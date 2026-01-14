import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { BookingWithDetails, NewBookingDetail } from '@/types/bookings'
import { supabaseAdmin } from '@/utils/supabase/admin'
import { stripe } from '@/lib/stripe'
import { requireAdmin } from '@/utils/server/auth'

export async function GET() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Fetch bookings error:', error)
        return NextResponse.json(
            { data: null, error: 'Failed to retrieve bookings' },
            { status: 500 }
        )
    }
    return NextResponse.json({ data, error: null })
}

export async function POST(req: Request) {
    const supabase = await createClient()
    const body: NewBookingDetail = await req.json()

    const { class_id, stripe_payment_id, payment_method, swish_received } = body

    try {
        const isStripeBooking = stripe_payment_id && payment_method === 'stripe'

        const isSwishBooking =
            payment_method === 'swish' && swish_received === false

        const isAuthorizedPublicFlow = isStripeBooking || isSwishBooking

        if (!isAuthorizedPublicFlow) {
            // Om det inte är Stripe eller en obetald Swish, krävs Admin
            try {
                await requireAdmin()
            } catch {
                return NextResponse.json(
                    {
                        data: null,
                        error: 'Unauthorized: Manual bookings require admin privileges.'
                    },
                    { status: 403 }
                )
            }
        }

        if (isStripeBooking) {
            const paymentIntent =
                await stripe.paymentIntents.retrieve(stripe_payment_id)
            if (paymentIntent.status !== 'succeeded') {
                return NextResponse.json(
                    { data: null, error: 'Payment not completed' },
                    { status: 400 }
                )
            }
        }

        // Kontrollera antal bokningar för klassen
        const { data: existingBookings, error: fetchError } = await supabase
            .from('bookings')
            .select('*')
            .eq('class_id', class_id)

        if (fetchError) throw fetchError

        // Hämta klassens max_spots
        const { data: classData, error: classError } = await supabase
            .from('classes')
            .select('max_spots')
            .eq('id', class_id)
            .single()

        if (classError) throw classError

        if ((existingBookings?.length || 0) >= (classData.max_spots || 0)) {
            return NextResponse.json(
                { data: null, error: 'Class is full' },
                { status: 400 }
            )
        }

        // Idempotency check: If Stripe payment, check if booking already exists
        if (stripe_payment_id && payment_method === 'stripe') {
            const { data: existingBooking } = await supabaseAdmin
                .from('booking_details')
                .select('booking_id')
                .eq('stripe_payment_id', stripe_payment_id)
                .single()

            if (existingBooking) {
                // Return existing booking
                const { data: booking } = await supabase
                    .from('bookings')
                    .select('*')
                    .eq('id', existingBooking.booking_id)
                    .single()

                if (booking) {
                    const { data: details } = await supabaseAdmin
                        .from('booking_details')
                        .select('*')
                        .eq('booking_id', booking.id)
                        .single()

                    if (details) {
                        return NextResponse.json({
                            data: { ...booking, details },
                            error: null
                        })
                    }
                }
            }
        }

        // Double-check capacity right before insert (race condition protection)
        const { data: finalCheck } = await supabase
            .from('bookings')
            .select('id')
            .eq('class_id', class_id)

        if ((finalCheck?.length || 0) >= (classData.max_spots || 0)) {
            return NextResponse.json(
                {
                    data: null,
                    error: 'Class became full. Please try another class.'
                },
                { status: 400 }
            )
        }

        // Lägg till publika booking
        const { data: booking, error: insertError } = await supabase
            .from('bookings')
            .insert([{ class_id }])
            .select()
            .single()

        if (insertError || !booking)
            throw insertError || new Error('Booking insert failed')

        // Lägg till detaljer i booking_details
        const { data: details, error: detailsError } = await supabaseAdmin
            .from('booking_details')
            .insert([
                {
                    booking_id: booking.id,
                    user_id: body.user_id ?? null,
                    guest_name: body.guest_name ?? null,
                    guest_email: body.guest_email ?? null,
                    stripe_payment_id: body.stripe_payment_id ?? null,
                    payment_method:
                        body.payment_method ??
                        (body.stripe_payment_id ? 'stripe' : 'manual'),
                    swish_received: body.swish_received ?? false,
                    refunded: false,
                    created_at: new Date().toISOString()
                }
            ])
            .select()
            .single()

        if (detailsError || !details)
            throw detailsError || new Error('Booking details insert failed')

        // Returnera kombinerad booking
        const bookingWithDetails: BookingWithDetails = { ...booking, details }

        return NextResponse.json({ data: bookingWithDetails, error: null })
    } catch (err) {
        console.error('Booking creation failed:', err)

        return NextResponse.json(
            {
                data: null,
                error: 'An unexpected error occurred during booking.'
            },
            { status: 500 }
        )
    }
}
