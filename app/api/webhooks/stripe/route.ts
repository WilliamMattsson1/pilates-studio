import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { PaymentIntentMetadata } from '@/types/stripe-webhook'
import {
    processBooking,
    logFailedBooking
} from '@/utils/server/booking-service'
import { sendBookingEmail } from '@/utils/server/email-service'
import Stripe from 'stripe'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * STRIPE WEBHOOK ENDPOINT
 * Denna funktion kickas igång av Stripe (inte din frontend) varje gång en händelse sker.
 */
export async function POST(request: NextRequest) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    // STEG 1: Grundläggande säkerhetskoll av konfiguration
    if (!webhookSecret) {
        console.error('[Webhook] STRIPE_WEBHOOK_SECRET is not configured')
        return NextResponse.json(
            { error: 'Webhook secret not configured' },
            { status: 500 }
        )
    }

    let event: Stripe.Event
    let rawBody: string

    // STEG 2: Verifiera att anropet faktiskt kommer från Stripe (Säkerhet!)
    try {
        // Read raw body as text for signature verification
        rawBody = await request.text()
        const signature = request.headers.get('stripe-signature')

        if (!signature) {
            console.error('[Webhook] Missing stripe-signature header')
            return NextResponse.json(
                { error: 'Missing signature' },
                { status: 401 }
            )
        }

        // Verify webhook signature
        event = stripe.webhooks.constructEvent(
            rawBody,
            signature,
            webhookSecret
        ) as Stripe.Event

        console.log('[Webhook] Event received:', {
            type: event.type,
            id: event.id,
            livemode: event.livemode
        })
    } catch (err) {
        const errorMessage =
            err instanceof Error ? err.message : 'Unknown error'
        console.error('[Webhook] Signature verification failed:', errorMessage)
        return NextResponse.json(
            { error: 'Webhook signature verification failed' },
            { status: 401 }
        )
    }

    // STEG 3: Filtrera händelser - Vi bryr oss bara om lyckade betalningar
    if (event.type === 'payment_intent.succeeded') {
        try {
            const paymentIntent = event.data.object as Stripe.PaymentIntent

            console.log('[Webhook] Processing payment_intent.succeeded:', {
                paymentIntentId: paymentIntent.id,
                amount: paymentIntent.amount,
                currency: paymentIntent.currency,
                metadataKeys: Object.keys(paymentIntent.metadata || {})
            })

            // Extract metadata
            const metadata =
                paymentIntent.metadata as unknown as PaymentIntentMetadata

            // Validera att vi fick med all metadata (Id, email etc.)
            if (!metadata.classId || !metadata.guestEmail) {
                console.error('[Webhook] Missing required metadata:', {
                    paymentIntentId: paymentIntent.id,
                    hasClassId: !!metadata.classId,
                    hasGuestEmail: !!metadata.guestEmail
                })
                return NextResponse.json(
                    { error: 'Missing required metadata fields' },
                    { status: 400 }
                )
            }

            console.log('[Webhook] Extracted metadata:', {
                paymentIntentId: paymentIntent.id,
                classId: metadata.classId,
                userId: metadata.userId,
                guestEmail: metadata.guestEmail
            })

            // Process booking (idempotency, capacity checks, booking creation)
            const bookingResult = await processBooking(paymentIntent, metadata)

            if (!bookingResult.success) {
                // Determine appropriate status code based on error type
                const statusCode = bookingResult.error.includes('full')
                    ? 400
                    : 500

                return NextResponse.json(
                    { error: bookingResult.error },
                    { status: statusCode }
                )
            }

            console.log('[Webhook] Booking processed successfully:', {
                paymentIntentId: paymentIntent.id,
                bookingId: bookingResult.bookingId,
                classId: metadata.classId
            })

            // Send confirmation email (non-blocking, log errors but don't fail webhook)
            const emailResult = await sendBookingEmail({
                guestName: metadata.guestName || 'Guest',
                guestEmail: metadata.guestEmail,
                classTitle: metadata.classTitle,
                classDate: metadata.classDate,
                classTime: metadata.classTime,
                price: `${metadata.amount}kr`,
                linkUrl: `https://pilates-studio-xi.vercel.app/classes#available-classes`
            })

            if (!emailResult.success) {
                console.error('[Webhook] Email sending failed (non-fatal):', {
                    paymentIntentId: paymentIntent.id,
                    bookingId: bookingResult.bookingId,
                    error: emailResult.error
                })
            } else {
                console.log('[Webhook] Confirmation email sent:', {
                    paymentIntentId: paymentIntent.id,
                    bookingId: bookingResult.bookingId,
                    guestEmail: metadata.guestEmail
                })
            }

            console.log(
                '[Webhook] Successfully processed payment_intent.succeeded:',
                {
                    paymentIntentId: paymentIntent.id,
                    bookingId: bookingResult.bookingId,
                    classId: metadata.classId
                }
            )

            return NextResponse.json({
                received: true,
                bookingId: bookingResult.bookingId
            })
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : String(err)
            const paymentIntent = event.data.object as Stripe.PaymentIntent
            console.error(
                '[Webhook] Error processing payment_intent.succeeded:',
                {
                    eventId: event.id,
                    paymentIntentId: paymentIntent.id,
                    error: errorMessage
                }
            )

            // Log to failed_bookings for any unexpected errors
            const metadata =
                paymentIntent.metadata as unknown as PaymentIntentMetadata
            if (metadata?.classId && metadata?.guestEmail) {
                await logFailedBooking(
                    paymentIntent,
                    metadata,
                    `Webhook processing error: ${errorMessage}`
                )
            }

            // Return 500 for unexpected errors
            return NextResponse.json(
                { error: 'Webhook processing failed' },
                { status: 500 }
            )
        }
    }

    // Handle other event types (log but don't process)
    console.log('[Webhook] Unhandled event type:', {
        type: event.type,
        id: event.id
    })

    return NextResponse.json({ received: true })
}
