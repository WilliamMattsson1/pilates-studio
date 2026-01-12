import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/utils/supabase/admin'

export async function POST(req: Request) {
    try {
        const { payment_intent } = await req.json()

        if (!payment_intent) {
            return NextResponse.json(
                { verified: false, error: 'Missing payment_intent' },
                { status: 400 }
            )
        }

        // Verify payment with Stripe
        const paymentIntent =
            await stripe.paymentIntents.retrieve(payment_intent)

        if (paymentIntent.status !== 'succeeded') {
            return NextResponse.json(
                { verified: false, error: 'Payment not succeeded' },
                { status: 400 }
            )
        }

        // Verify booking exists with this payment_intent
        const { data: bookingDetail, error } = await supabaseAdmin
            .from('booking_details')
            .select('booking_id, user_id, guest_email, stripe_payment_id')
            .eq('stripe_payment_id', payment_intent)
            .single()

        if (error || !bookingDetail) {
            return NextResponse.json({
                verified: false,
                bookingExists: false,
                error: 'No booking found for this payment'
            })
        }

        // Get user context to verify ownership
        const supabase = await createClient()
        const {
            data: { user }
        } = await supabase.auth.getUser()

        // If user is logged in, verify booking belongs to them
        if (user?.id && bookingDetail.user_id !== user.id) {
            return NextResponse.json(
                {
                    verified: false,
                    error: 'Booking does not belong to current user'
                },
                { status: 403 }
            )
        }

        return NextResponse.json({
            verified: true,
            bookingExists: true,
            bookingId: bookingDetail.booking_id
        })
    } catch (err) {
        console.error('Verify booking error:', err)
        return NextResponse.json(
            { verified: false, error: 'Verification failed' },
            { status: 500 }
        )
    }
}
