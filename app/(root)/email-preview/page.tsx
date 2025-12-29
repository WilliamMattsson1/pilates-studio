// Enbart för att testa hur mejl kommer att se ut
import BookingConfirmationEmailate from '@/components/email/BookingConfirmationEmail'

export default function EmailPreview() {
    return (
        <BookingConfirmationEmailate
            guestName="Alice Svensson"
            classTitle="Morning Pilates Flow"
            classDate="2025-12-05"
            classTime="09:00 - 10:00"
            price="200kr"
            tiktokUrl="https://tiktok.com/"
            instagramUrl="https://instagram.com/"
            linkUrl="https://pilates-studio-xi.vercel.app/classes#available-classes"
        />
    )
}
