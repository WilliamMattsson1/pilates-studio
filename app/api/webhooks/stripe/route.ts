import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/utils/supabase/admin'
import { PaymentIntentMetadata } from '@/types/stripe-webhook'
import Stripe from 'stripe'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * STRIPE WEBHOOK ENDPOINT
 * Denna funktion kickas igång av Stripe (inte din frontend) varje gång en händelse sker.
 */
export async function POST(request: NextRequest) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    // STEG 1: Grundläggande säkerhetskoll av konfiguration
    if (!webhookSecret) {
        console.error('[Webhook] STRIPE_WEBHOOK_SECRET is not configured')
        return NextResponse.json(
            { error: 'Webhook secret not configured' },
            { status: 500 }
        )
    }

    let event: Stripe.Event
    let rawBody: string

    // STEG 2: Verifiera att anropet faktiskt kommer från Stripe (Säkerhet!)
    try {
        // Read raw body as text for signature verification
        rawBody = await request.text()
        const signature = request.headers.get('stripe-signature')

        if (!signature) {
            console.error('[Webhook] Missing stripe-signature header')
            return NextResponse.json(
                { error: 'Missing signature' },
                { status: 401 }
            )
        }

        // Verify webhook signature
        event = stripe.webhooks.constructEvent(
            rawBody,
            signature,
            webhookSecret
        ) as Stripe.Event

        console.log('[Webhook] Event received:', {
            type: event.type,
            id: event.id,
            livemode: event.livemode
        })
    } catch (err) {
        const errorMessage =
            err instanceof Error ? err.message : 'Unknown error'
        console.error('[Webhook] Signature verification failed:', errorMessage)
        return NextResponse.json(
            { error: `Webhook signature verification failed: ${errorMessage}` },
            { status: 401 }
        )
    }

    // STEG 3: Filtrera händelser - Vi bryr oss bara om lyckade betalningar
    if (event.type === 'payment_intent.succeeded') {
        try {
            const paymentIntent = event.data.object as Stripe.PaymentIntent

            console.log('[Webhook] Processing payment_intent.succeeded:', {
                paymentIntentId: paymentIntent.id,
                amount: paymentIntent.amount,
                currency: paymentIntent.currency,
                metadataKeys: Object.keys(paymentIntent.metadata || {})
            })

            // Extract metadata
            const metadata =
                paymentIntent.metadata as unknown as PaymentIntentMetadata

            // Validera att vi fick med all metadata (Id, email etc.)
            if (!metadata.classId || !metadata.guestEmail) {
                console.error('[Webhook] Missing required metadata:', {
                    paymentIntentId: paymentIntent.id,
                    hasClassId: !!metadata.classId,
                    hasGuestEmail: !!metadata.guestEmail
                })
                return NextResponse.json(
                    { error: 'Missing required metadata fields' },
                    { status: 400 }
                )
            }

            console.log('[Webhook] Extracted metadata:', {
                paymentIntentId: paymentIntent.id,
                classId: metadata.classId,
                userId: metadata.userId,
                guestEmail: metadata.guestEmail
            })

            // STEG 4: Idempotenskontroll (Förhindra dubbelbokning vid nätverksfel)
            // Vi kollar om detta PaymentIntent ID redan har en bokning i databasen.
            const { data: existingBookingDetail } = await supabaseAdmin
                .from('booking_details')
                .select('booking_id')
                .eq('stripe_payment_id', paymentIntent.id)
                .single()

            if (existingBookingDetail) {
                console.log('[Webhook] Booking already exists (idempotent):', {
                    paymentIntentId: paymentIntent.id,
                    bookingId: existingBookingDetail.booking_id
                })
                // Return 200 - idempotent success
                return NextResponse.json({
                    received: true,
                    bookingExists: true,
                    bookingId: existingBookingDetail.booking_id
                })
            }

            // STEG 5: Kapacitetskontroll (Sista kollen innan vi bokar)
            // Vi hämtar aktuella bokningar och max_spots för klassen.
            const { data: existingBookings, error: fetchError } =
                await supabaseAdmin
                    .from('bookings')
                    .select('*')
                    .eq('class_id', metadata.classId)

            if (fetchError) {
                console.error('[Webhook] Error fetching existing bookings:', {
                    paymentIntentId: paymentIntent.id,
                    error: fetchError.message
                })
                throw fetchError
            }

            // Get class max_spots
            const { data: classData, error: classError } = await supabaseAdmin
                .from('classes')
                .select('max_spots')
                .eq('id', metadata.classId)
                .single()

            if (classError) {
                console.error('[Webhook] Error fetching class data:', {
                    paymentIntentId: paymentIntent.id,
                    classId: metadata.classId,
                    error: classError.message
                })
                throw classError
            }

            // Om klassen blev full under tiden kunden betalade:
            if ((existingBookings?.length || 0) >= (classData.max_spots || 0)) {
                console.error('[Webhook] Class is full:', {
                    paymentIntentId: paymentIntent.id,
                    classId: metadata.classId,
                    currentBookings: existingBookings?.length || 0,
                    maxSpots: classData.max_spots
                })

                // Log to failed_bookings since payment succeeded but booking failed
                try {
                    await supabaseAdmin.from('failed_bookings').insert({
                        class_id: metadata.classId,
                        user_id: metadata.userId || null,
                        guest_name: metadata.guestName || null,
                        guest_email: metadata.guestEmail,
                        stripe_payment_id: paymentIntent.id,
                        stripe_paid: true,
                        payment_method: 'stripe',
                        error_message: `Class is full (${existingBookings?.length || 0}/${classData.max_spots} spots)`,
                        created_at: new Date().toISOString()
                    })
                } catch (logErr) {
                    console.error(
                        '[Webhook] Failed to log to failed_bookings:',
                        logErr
                    )
                }

                return NextResponse.json(
                    { error: 'Class is full' },
                    { status: 400 }
                )
            }

            // Double-check capacity before insert (race condition protection)
            const { data: finalCheck } = await supabaseAdmin
                .from('bookings')
                .select('id')
                .eq('class_id', metadata.classId)

            if ((finalCheck?.length || 0) >= (classData.max_spots || 0)) {
                console.error(
                    '[Webhook] Class became full during processing:',
                    {
                        paymentIntentId: paymentIntent.id,
                        classId: metadata.classId
                    }
                )

                // Log to failed_bookings since payment succeeded but booking failed
                try {
                    await supabaseAdmin.from('failed_bookings').insert({
                        class_id: metadata.classId,
                        user_id: metadata.userId || null,
                        guest_name: metadata.guestName || null,
                        guest_email: metadata.guestEmail,
                        stripe_payment_id: paymentIntent.id,
                        stripe_paid: true,
                        payment_method: 'stripe',
                        error_message:
                            'Class became full during processing (race condition)',
                        created_at: new Date().toISOString()
                    })
                } catch (logErr) {
                    console.error(
                        '[Webhook] Failed to log to failed_bookings:',
                        logErr
                    )
                }

                return NextResponse.json(
                    { error: 'Class became full. Please try another class.' },
                    { status: 400 }
                )
            }

            // Create booking
            const { data: booking, error: insertError } = await supabaseAdmin
                .from('bookings')
                .insert([{ class_id: metadata.classId }])
                .select()
                .single()

            if (insertError || !booking) {
                const errorMessage = insertError?.message || 'Unknown error'
                console.error('[Webhook] Booking insert failed:', {
                    paymentIntentId: paymentIntent.id,
                    error: errorMessage
                })

                // Log to failed_bookings since payment succeeded but booking failed
                try {
                    await supabaseAdmin.from('failed_bookings').insert({
                        class_id: metadata.classId,
                        user_id: metadata.userId || null,
                        guest_name: metadata.guestName || null,
                        guest_email: metadata.guestEmail,
                        stripe_payment_id: paymentIntent.id,
                        stripe_paid: true,
                        payment_method: 'stripe',
                        error_message: `Booking insert failed: ${errorMessage}`,
                        created_at: new Date().toISOString()
                    })
                } catch (logErr) {
                    console.error(
                        '[Webhook] Failed to log to failed_bookings:',
                        logErr
                    )
                }

                throw insertError || new Error('Booking insert failed')
            }

            console.log('[Webhook] Booking created:', {
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
                const errorMessage = detailsError?.message || 'Unknown error'
                console.error('[Webhook] Booking details insert failed:', {
                    paymentIntentId: paymentIntent.id,
                    bookingId: booking.id,
                    error: errorMessage
                })

                // Log to failed_bookings since payment succeeded but booking details failed
                try {
                    await supabaseAdmin.from('failed_bookings').insert({
                        class_id: metadata.classId,
                        user_id: metadata.userId || null,
                        guest_name: metadata.guestName || null,
                        guest_email: metadata.guestEmail,
                        stripe_payment_id: paymentIntent.id,
                        stripe_paid: true,
                        payment_method: 'stripe',
                        error_message: `Booking details insert failed: ${errorMessage}`,
                        created_at: new Date().toISOString()
                    })
                } catch (logErr) {
                    console.error(
                        '[Webhook] Failed to log to failed_bookings:',
                        logErr
                    )
                }

                // Try to clean up the orphaned booking
                try {
                    await supabaseAdmin
                        .from('bookings')
                        .delete()
                        .eq('id', booking.id)
                } catch (cleanupErr) {
                    console.error(
                        '[Webhook] Failed to cleanup orphaned booking:',
                        cleanupErr
                    )
                }

                throw detailsError || new Error('Booking details insert failed')
            }

            console.log('[Webhook] Booking details created:', {
                paymentIntentId: paymentIntent.id,
                bookingId: booking.id,
                detailsId: details.id
            })

            // Send confirmation email (non-blocking, log errors but don't fail webhook)
            try {
                const emailResponse = await fetch(
                    `${request.nextUrl.origin}/api/send-email`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            guestName: metadata.guestName || 'Guest',
                            guestEmail: metadata.guestEmail,
                            classTitle: metadata.classTitle,
                            classDate: metadata.classDate,
                            classTime: metadata.classTime,
                            price: `${metadata.amount}kr`,
                            linkUrl: `https://pilates-studio-xi.vercel.app/classes#available-classes`
                        })
                    }
                )

                if (!emailResponse.ok) {
                    const errorData = await emailResponse
                        .json()
                        .catch(() => ({}))
                    console.error('[Webhook] Email sending failed:', {
                        paymentIntentId: paymentIntent.id,
                        bookingId: booking.id,
                        status: emailResponse.status,
                        error: errorData.error || 'Unknown error'
                    })
                } else {
                    console.log('[Webhook] Confirmation email sent:', {
                        paymentIntentId: paymentIntent.id,
                        bookingId: booking.id,
                        guestEmail: metadata.guestEmail
                    })
                }
            } catch (emailErr) {
                console.error('[Webhook] Email sending error (non-fatal):', {
                    paymentIntentId: paymentIntent.id,
                    bookingId: booking.id,
                    error:
                        emailErr instanceof Error
                            ? emailErr.message
                            : String(emailErr)
                })
                // Don't fail webhook if email fails
            }

            console.log(
                '[Webhook] Successfully processed payment_intent.succeeded:',
                {
                    paymentIntentId: paymentIntent.id,
                    bookingId: booking.id,
                    classId: metadata.classId
                }
            )

            return NextResponse.json({
                received: true,
                bookingId: booking.id
            })
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : String(err)
            const paymentIntent = event.data.object as Stripe.PaymentIntent
            console.error(
                '[Webhook] Error processing payment_intent.succeeded:',
                {
                    eventId: event.id,
                    paymentIntentId: paymentIntent.id,
                    error: errorMessage
                }
            )

            // Log to failed_bookings for any unexpected errors
            // Extract metadata if available
            const metadata =
                paymentIntent.metadata as unknown as PaymentIntentMetadata
            if (metadata?.classId && metadata?.guestEmail) {
                try {
                    await supabaseAdmin.from('failed_bookings').insert({
                        class_id: metadata.classId,
                        user_id: metadata.userId || null,
                        guest_name: metadata.guestName || null,
                        guest_email: metadata.guestEmail,
                        stripe_payment_id: paymentIntent.id,
                        stripe_paid: true,
                        payment_method: 'stripe',
                        error_message: `Webhook processing error: ${errorMessage}`,
                        created_at: new Date().toISOString()
                    })
                } catch (logErr) {
                    console.error(
                        '[Webhook] Failed to log to failed_bookings:',
                        logErr
                    )
                }
            }

            // Return 500 for unexpected errors
            return NextResponse.json(
                { error: `Webhook processing failed: ${errorMessage}` },
                { status: 500 }
            )
        }
    }

    // Handle other event types (log but don't process)
    console.log('[Webhook] Unhandled event type:', {
        type: event.type,
        id: event.id
    })

    return NextResponse.json({ received: true })
}
