import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { EmailTemplate } from '@/components/email/email-template'

if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is missing')
}

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendBookingEmailProps {
    guestName: string
    guestEmail: string
    classTitle: string
    classDate: string
    classTime: string
    price: string
    linkUrl: string
}

export async function POST(req: Request) {
    const body: SendBookingEmailProps = await req.json()

    try {
        const data = await resend.emails.send({
            from: 'Pilates Team <kontakt@williammattsson.se>',
            to: [body.guestEmail],
            subject: 'Your Pilates Booking is Confirmed!',
            react: EmailTemplate(body)
        })

        return NextResponse.json(data)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error }, { status: 500 })
    }
}
