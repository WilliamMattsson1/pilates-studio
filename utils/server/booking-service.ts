import Stripe from 'stripe'
import { supabaseAdmin } from '@/utils/supabase/admin'
import { PaymentIntentMetadata } from '@/types/stripe-webhook'

interface ProcessBookingResult {
    success: true
    bookingId: string
}

interface ProcessBookingError {
    success: false
    error: string
}

type ProcessBookingResponse = ProcessBookingResult | ProcessBookingError

/**
 * Process a booking from a successful Stripe payment intent.
 * Handles idempotency, capacity checks, and booking creation.
 * Automatically logs errors to failed_bookings.
 */
export async function processBooking(
    paymentIntent: Stripe.PaymentIntent,
    metadata: PaymentIntentMetadata
): Promise<ProcessBookingResponse> {
    // STEG 4: Idempotenskontroll (Förhindra dubbelbokning vid nätverksfel)
    // Vi kollar om detta PaymentIntent ID redan har en bokning i databasen.
    const { data: existingBookingDetail } = await supabaseAdmin
        .from('booking_details')
        .select('booking_id')
        .eq('stripe_payment_id', paymentIntent.id)
        .single()

    if (existingBookingDetail) {
        console.log('[BookingService] Booking already exists (idempotent):', {
            paymentIntentId: paymentIntent.id,
            bookingId: existingBookingDetail.booking_id
        })
        return {
            success: true,
            bookingId: existingBookingDetail.booking_id
        }
    }

    // STEG 5: Kapacitetskontroll (Sista kollen innan vi bokar)
    // Vi hämtar aktuella bokningar och max_spots för klassen.
    const { data: existingBookings, error: fetchError } = await supabaseAdmin
        .from('bookings')
        .select('*')
        .eq('class_id', metadata.classId)

    if (fetchError) {
        console.error('[BookingService] Error fetching existing bookings:', {
            paymentIntentId: paymentIntent.id,
            error: fetchError.message
        })
        // SÄKERHET: Vi loggar detaljfelet internt men returnerar ett städat fel
        const internalError = `Failed to fetch existing bookings: ${fetchError.message}`
        await logFailedBooking(paymentIntent, metadata, internalError)
        return {
            success: false,
            error: 'Failed to verify class capacity. Please contact support.'
        }
    }

    // Get class max_spots
    const { data: classData, error: classError } = await supabaseAdmin
        .from('classes')
        .select('max_spots')
        .eq('id', metadata.classId)
        .single()

    if (classError) {
        console.error('[BookingService] Error fetching class data:', {
            paymentIntentId: paymentIntent.id,
            classId: metadata.classId,
            error: classError.message
        })
        const internalError = `Failed to fetch class data: ${classError.message}`
        await logFailedBooking(paymentIntent, metadata, internalError)
        return {
            success: false,
            error: 'Failed to verify class details.'
        }
    }

    // Om klassen blev full under tiden kunden betalade:
    if ((existingBookings?.length || 0) >= (classData.max_spots || 0)) {
        console.error('[BookingService] Class is full:', {
            paymentIntentId: paymentIntent.id,
            classId: metadata.classId,
            currentBookings: existingBookings?.length || 0,
            maxSpots: classData.max_spots
        })
        const errorMessage = `Class is full (${existingBookings?.length || 0}/${classData.max_spots} spots)`
        await logFailedBooking(paymentIntent, metadata, errorMessage)
        return {
            success: false,
            error: errorMessage
        }
    }

    // Double-check capacity before insert (race condition protection)
    const { data: finalCheck } = await supabaseAdmin
        .from('bookings')
        .select('id')
        .eq('class_id', metadata.classId)

    if ((finalCheck?.length || 0) >= (classData.max_spots || 0)) {
        console.error('[BookingService] Class became full during processing:', {
            paymentIntentId: paymentIntent.id,
            classId: metadata.classId
        })
        const errorMessage =
            'Class became full during processing (race condition)'
        await logFailedBooking(paymentIntent, metadata, errorMessage)
        return {
            success: false,
            error: errorMessage
        }
    }

    // STEG 7: Create booking
    const { data: booking, error: insertError } = await supabaseAdmin
        .from('bookings')
        .insert([{ class_id: metadata.classId }])
        .select()
        .single()

    if (insertError || !booking) {
        const dbError = insertError?.message || 'Unknown error'
        console.error('[BookingService] Booking insert failed:', {
            paymentIntentId: paymentIntent.id,
            error: dbError
        })
        const internalError = `Booking insert failed: ${dbError}`
        await logFailedBooking(paymentIntent, metadata, internalError)
        return {
            success: false,
            error: 'Database error while creating booking.'
        }
    }

    console.log('[BookingService] Booking created:', {
        paymentIntentId: paymentIntent.id,
        bookingId: booking.id,
        classId: metadata.classId
    })

    // Create booking details
    const { data: details, error: detailsError } = await supabaseAdmin
        .from('booking_details')
        .insert([
            {
                booking_id: booking.id,
                user_id: metadata.userId || null,
                guest_name: metadata.guestName || null,
                guest_email: metadata.guestEmail,
                stripe_payment_id: paymentIntent.id,
                payment_method: 'stripe',
                swish_received: false,
                refunded: false,
                created_at: new Date().toISOString()
            }
        ])
        .select()
        .single()

    if (detailsError || !details) {
        const dbError = detailsError?.message || 'Unknown error'
        console.error('[BookingService] Booking details insert failed:', {
            paymentIntentId: paymentIntent.id,
            bookingId: booking.id,
            error: dbError
        })

        // Try to clean up the orphaned booking
        try {
            await supabaseAdmin.from('bookings').delete().eq('id', booking.id)
        } catch (cleanupErr) {
            console.error(
                '[BookingService] Failed to cleanup orphaned booking:',
                cleanupErr
            )
        }

        const internalError = `Booking details insert failed: ${dbError}`
        await logFailedBooking(paymentIntent, metadata, internalError)
        return {
            success: false,
            error: 'Failed to save booking details.'
        }
    }

    console.log('[BookingService] Booking details created:', {
        paymentIntentId: paymentIntent.id,
        bookingId: booking.id,
        detailsId: details.id
    })

    return {
        success: true,
        bookingId: booking.id
    }
}

/**
 * Log a failed booking to the failed_bookings table.
 * Used when payment succeeded but booking creation failed.
 */
export async function logFailedBooking(
    paymentIntent: Stripe.PaymentIntent,
    metadata: PaymentIntentMetadata,
    errorMessage: string
): Promise<void> {
    try {
        await supabaseAdmin.from('failed_bookings').insert({
            class_id: metadata.classId,
            user_id: metadata.userId || null,
            guest_name: metadata.guestName || null,
            guest_email: metadata.guestEmail,
            stripe_payment_id: paymentIntent.id,
            stripe_paid: true,
            payment_method: 'stripe',
            error_message: errorMessage,
            created_at: new Date().toISOString()
        })
    } catch (logErr) {
        console.error(
            '[BookingService] Failed to log to failed_bookings:',
            logErr
        )
    }
}
