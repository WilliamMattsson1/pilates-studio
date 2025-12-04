export interface SendBookingEmailProps {
    guestName: string
    guestEmail: string
    classTitle: string
    classDate: string
    classTime: string
    price: string
    linkUrl: string
}

export async function sendBookingEmail(data: SendBookingEmailProps) {
    try {
        const res = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        if (!res.ok) {
            throw new Error('Failed to send booking email')
        }

        return await res.json()
    } catch (err) {
        console.error('Error sending booking email:', err)
        throw err
    }
}
