import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import convertToSubcurrency from '@/utils/convertToSubcurrency'
import { supabaseAdmin } from '@/utils/supabase/admin'
import { isStripeEnabled } from '@/lib/payments/stripeEnabled'

export async function POST(request: NextRequest) {
    try {
        // Server-auktoritativ feature flag:
        // när STRIPE_ENABLED === 'false' får inga Stripe-betalningar
        // påbörjas, även om någon försöker anropa API:t manuellt.
        if (!isStripeEnabled()) {
            return NextResponse.json(
                {
                    error: 'Card payments are temporarily paused. Please use Swish instead.'
                },
                { status: 503 }
            )
        }

        const { classId } = await request.json()
        const { data, error } = await supabaseAdmin
            .from('classes')
            .select('price')
            .eq('id', classId)
            .single()

        if (error || !data) {
            return NextResponse.json(
                { error: 'Class not found' },
                { status: 404 }
            )
        }

        const amount = convertToSubcurrency(data.price)

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'sek',
            automatic_payment_methods: { enabled: true }
        })

        return NextResponse.json({ clientSecret: paymentIntent.client_secret })
    } catch (error) {
        console.error('Internal Server Error', error)
        // Handle other errors
        return NextResponse.json(
            { error: `Internal Server Error: ${error}` },
            { status: 500 }
        )
    }
}
