import AdminOverview from '@/components/admin/AdminOverview'
import { getProfilesCount } from '@/utils/server/profiles-service'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: 'Admin | Pilates Studio',
    description: 'Manage classes and bookings as an instructor.'
}
const page = async () => {
    const activeStudents = (await getProfilesCount()) ?? 0
    return <AdminOverview activeStudents={activeStudents} />
}

export default page
