// Enbart för att testa hur mejl kommer att se ut
import EmailTemplate from '@/components/email/email-template'

export default function EmailPreview() {
    return (
        <EmailTemplate
            guestName="Alice Svensson"
            classTitle="Morning Pilates Flow"
            classDate="2025-12-05"
            classTime="09:00 - 10:00"
            price="200kr"
            tiktokUrl="https://tiktok.com/"
            instagramUrl="https://instagram.com/"
            linkUrl="http://localhost:3000/classes"
        />
    )
}
