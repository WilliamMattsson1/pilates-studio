import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(req: Request) {
    try {
        const { payment_intent } = await req.json()
        if (!payment_intent) {
            return NextResponse.json(
                { error: 'Missing payment_intent' },
                { status: 400 }
            )
        }

        const pi = await stripe.paymentIntents.retrieve(payment_intent)
        const amount = pi.amount // i öre
        const currency = pi.currency

        return NextResponse.json({ amount, currency })
    } catch (err) {
        console.error('payment-info error', err)
        return NextResponse.json({ error: 'Failed' }, { status: 500 })
    }
}
