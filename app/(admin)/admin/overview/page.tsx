import AdminOverview from '@/components/admin/AdminOverview'
import { Metadata } from 'next'
import { getProfilesCount } from '@/utils/server/profiles-service'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: 'Admin Overview | Pilates Studio',
    description: 'Manage classes and bookings as an instructor.'
}

const page = async () => {
    const activeStudents = (await getProfilesCount()) ?? 0

    return <AdminOverview activeStudents={activeStudents} />
}

export default page
