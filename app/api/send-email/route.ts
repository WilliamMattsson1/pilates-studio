import { EmailTemplate } from '@/components/email/email-template'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST() {
    const linkUrl = 'http://localhost:3000/classes'

    try {
        const data = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: ['wmattsson@hotmail.com'],
            subject: 'Your Pilates Booking is Confirmed!',
            react: EmailTemplate({ linkUrl })
        })

        return NextResponse.json(data)
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error }, { status: 500 })
    }
}
