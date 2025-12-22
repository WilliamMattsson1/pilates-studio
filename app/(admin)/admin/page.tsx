import AdminOverview from '@/components/admin/AdminOverview'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Admin | Pilates Studio',
    description: 'Manage classes and bookings as an instructor.'
}
const page = () => {
    return <AdminOverview />
}

export default page
