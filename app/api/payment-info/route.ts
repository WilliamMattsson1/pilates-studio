import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { requireAdmin } from '@/utils/server/auth'

export async function POST(req: Request) {
    try {
        await requireAdmin()
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
    } catch (err: unknown) {
        console.error('payment-info error', err)

        const message = err instanceof Error ? err.message : ''
        const isAuth =
            message === 'Unauthorized' || message === 'Not authenticated'

        return NextResponse.json(
            { error: isAuth ? 'Unauthorized' : 'Internal Server Error' },
            { status: isAuth ? 403 : 500 }
        )
    }
}
