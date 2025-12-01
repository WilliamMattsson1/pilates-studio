import ProfileSection from '@/components/profile/ProfileSection'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Your Profile | Pilates Classes',
    description:
        'View your upcoming and past Pilates class bookings, manage your bookings, and stay updated in real-time.'
}

const page = () => {
    return (
        <>
            <ProfileSection />
        </>
    )
}

export default page
