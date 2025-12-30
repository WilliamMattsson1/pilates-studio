import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const { paymentIntentId } = await req.json()

        if (!paymentIntentId) {
            return NextResponse.json(
                { ok: false, message: 'Missing payment intent id' },
                { status: 400 }
            )
        }

        const paymentIntent =
            await stripe.paymentIntents.retrieve(paymentIntentId)

        if (paymentIntent.status !== 'succeeded') {
            return NextResponse.json(
                {
                    ok: false,
                    status: paymentIntent.status
                },
                { status: 400 }
            )
        }

        return NextResponse.json({
            ok: true,
            paymentIntent
        })
    } catch (err) {
        console.error('Verify payment error', err)
        return NextResponse.json(
            { ok: false, message: 'Verification failed' },
            { status: 500 }
        )
    }
}
