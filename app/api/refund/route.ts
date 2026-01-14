import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { requireAdmin } from '@/utils/server/auth'
import { supabaseAdmin } from '@/utils/supabase/admin'

export async function POST(req: Request) {
    try {
        await requireAdmin()

        const { payment_intent, booking_id } = await req.json()

        if (!payment_intent || !booking_id) {
            return NextResponse.json(
                { error: 'Missing payment_intent or booking_id' },
                { status: 400 }
            )
        }

        // Kolla om den redan är refunded
        const { data: details, error: fetchError } = await supabaseAdmin
            .from('booking_details')
            .select('refunded')
            .eq('booking_id', booking_id)
            .single()

        if (fetchError) {
            console.error('Fetch booking error:', fetchError)
            return NextResponse.json(
                { error: 'Booking not found' },
                { status: 404 }
            )
        }

        if (details?.refunded) {
            return NextResponse.json({ success: false, alreadyRefunded: true })
        }

        // Create refund
        const refund = await stripe.refunds.create({ payment_intent })

        // Poll Stripe 1–3 times
        let status = refund.status

        for (let i = 0; i < 3; i++) {
            if (status === 'succeeded') break

            await new Promise((res) => setTimeout(res, 1500))

            const updated = await stripe.refunds.retrieve(refund.id)
            status = updated.status
        }

        if (status !== 'succeeded') {
            return NextResponse.json(
                { error: 'Refund processing - please check back later' },
                { status: 500 }
            )
        }

        const { error: dbError } = await supabaseAdmin
            .from('booking_details')
            .update({
                refunded: true,
                refunded_at: new Date().toISOString()
            })
            .eq('booking_id', booking_id)

        if (dbError) {
            console.error('DB Update Error after successful refund:', dbError)
            return NextResponse.json(
                { error: 'Refund succeeded but system update failed' },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (err: unknown) {
        console.error('Refund API error:', err)

        const message = err instanceof Error ? err.message : ''
        const isAuth =
            message === 'Unauthorized' || message === 'Not authenticated'

        return NextResponse.json(
            { error: isAuth ? 'Unauthorized' : 'Internal Server Error' },
            { status: isAuth ? 403 : 500 }
        )
    }
}
