import { Resend } from 'resend'
import { BookingConfirmationEmail } from '@/components/email/BookingConfirmationEmail'

if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is missing')
}

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendBookingEmailParams {
    guestName: string
    guestEmail: string
    classTitle: string
    classDate: string
    classTime: string
    price: string
    linkUrl: string
}

interface SendBookingEmailSuccess {
    success: true
}

interface SendBookingEmailError {
    success: false
    error: string
}

type SendBookingEmailResponse = SendBookingEmailSuccess | SendBookingEmailError

/**
 * Send a booking confirmation email using Resend.
 * Non-blocking: errors are returned, not thrown.
 */
export async function sendBookingEmail(
    params: SendBookingEmailParams
): Promise<SendBookingEmailResponse> {
    try {
        await resend.emails.send({
            from: 'Pilates Team <kontakt@williammattsson.se>',
            to: [params.guestEmail],
            subject: 'Your Pilates Booking is Confirmed!',
            react: BookingConfirmationEmail(params)
        })

        return { success: true }
    } catch (error: unknown) {
        console.error('[EmailService] Email sending failed:', error)

        return {
            success: false,
            error: 'Failed to send confirmation email. Please check your dashboard.'
        }
    }
}
