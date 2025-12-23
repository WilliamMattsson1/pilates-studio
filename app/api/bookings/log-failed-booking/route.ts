import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/utils/supabase/admin'
import { stripe } from '@/lib/stripe'

export async function GET() {
    try {
        const { data, error } = await supabaseAdmin
            .from('failed_bookings')
            .select('*')
            .eq('refunded', false)
            .order('created_at', { ascending: false })

        if (error) {
            return NextResponse.json(
                { data: null, error: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json({ data, error: null })
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err)
        return NextResponse.json(
            { data: null, error: message },
            { status: 500 }
        )
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()

        // Kolla om finns lyckad Stripe-betalning
        let stripePaid = false
        if (body.stripe_payment_id && body.payment_method === 'stripe') {
            const paymentIntent = await stripe.paymentIntents.retrieve(
                body.stripe_payment_id
            )
            stripePaid = paymentIntent.status === 'succeeded'
        }

        // Spara i failed_bookings
        const { data, error } = await supabaseAdmin
            .from('failed_bookings')
            .insert({
                class_id: body.class_id,
                user_id: body.user_id ?? null,
                guest_name: body.guest_name ?? null,
                guest_email: body.guest_email ?? null,
                stripe_payment_id: body.stripe_payment_id ?? null,
                stripe_paid: stripePaid,
                payment_method: body.payment_method,
                error_message: body.error_message || 'Booking failed',
                created_at: new Date().toISOString()
            })
            .select()
            .single()

        if (error || !data) {
            throw error || new Error('Failed to insert into failed_bookings')
        }

        return NextResponse.json({ data, error: null })
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err)
        return NextResponse.json(
            { data: null, error: message },
            { status: 500 }
        )
    }
}
