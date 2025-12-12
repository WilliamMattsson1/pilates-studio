import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/utils/supabase/server'
import { requireAdmin } from '@/utils/server/auth'

export async function POST(req: Request) {
    const supabase = await createClient()

    await requireAdmin()

    try {
        const { payment_intent, booking_id } = await req.json()

        if (!payment_intent || !booking_id) {
            return NextResponse.json(
                { error: 'Missing payment_intent or booking_id' },
                { status: 400 }
            )
        }

        // Kolla om den redan är refunded
        const { data: details } = await supabase
            .from('booking_details')
            .select('refunded')
            .eq('booking_id', booking_id)
            .single()

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
                { error: 'Refund did not complete in time' },
                { status: 500 }
            )
        }

        const { error: dbError } = await supabase
            .from('booking_details')
            .update({
                refunded: true,
                refunded_at: new Date().toISOString()
            })
            .eq('booking_id', booking_id)

        if (dbError) {
            return NextResponse.json(
                { error: 'Refund succeeded but DB update failed' },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (e: any) {
        console.error('Refund API error:', e)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
