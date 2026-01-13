import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import convertToSubcurrency from '@/utils/convertToSubcurrency'
import { supabaseAdmin } from '@/utils/supabase/admin'
import { isStripeEnabled } from '@/lib/payments/stripeEnabled'
import {
    CreatePaymentIntentRequest,
    PaymentIntentMetadata
} from '@/types/stripe-webhook'

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

        const body: CreatePaymentIntentRequest = await request.json()
        const {
            classId,
            userId,
            guestName,
            guestEmail,
            classTitle,
            classDate,
            classTime,
            amount: amountFromBody
        } = body

        // Fetch full class data (title, date, times) if not provided in body
        const { data: classData, error: classError } = await supabaseAdmin
            .from('classes')
            .select('price, title, date, start_time, end_time')
            .eq('id', classId)
            .single()

        if (classError || !classData) {
            console.error('[PaymentIntent] Class fetch error:', classError)
            return NextResponse.json(
                { error: 'Class not found' },
                { status: 404 }
            )
        }

        const amount = convertToSubcurrency(classData.price)

        // Prepare metadata - use provided values or fallback to class data
        const metadata: PaymentIntentMetadata = {
            classId,
            userId: userId ?? '',
            guestName: guestName ?? '',
            guestEmail: guestEmail ?? '',
            classTitle: classTitle ?? classData.title,
            classDate: classDate ?? classData.date,
            classTime:
                classTime ?? `${classData.start_time} - ${classData.end_time}`,
            amount: amountFromBody ?? String(classData.price)
        }

        console.log('[PaymentIntent] Creating with metadata:', {
            paymentIntentId: 'pending',
            classId: metadata.classId,
            userId: metadata.userId,
            guestEmail: metadata.guestEmail
        })

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'sek',
            automatic_payment_methods: { enabled: true },
            metadata: {
                classId: metadata.classId,
                userId: metadata.userId || '',
                guestName: metadata.guestName || '',
                guestEmail: metadata.guestEmail,
                classTitle: metadata.classTitle,
                classDate: metadata.classDate,
                classTime: metadata.classTime,
                amount: metadata.amount
            }
        })

        console.log('[PaymentIntent] Created successfully:', {
            paymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount,
            metadataKeys: Object.keys(paymentIntent.metadata)
        })

        return NextResponse.json({ clientSecret: paymentIntent.client_secret })
    } catch (error) {
        console.error('[PaymentIntent] Internal Server Error:', error)
        return NextResponse.json(
            { error: `Internal Server Error: ${error}` },
            { status: 500 }
        )
    }
}
