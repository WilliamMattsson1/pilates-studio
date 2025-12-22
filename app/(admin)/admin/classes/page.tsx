import { Metadata } from 'next'
import AdminClassesWrapper from './AdminClassesWrapper'

export const metadata: Metadata = {
    title: 'Admin Classes | Pilates Studio',
    description: 'Manage classes and bookings as an instructor.'
}
const Page = () => {
    return <AdminClassesWrapper />
}

export default Page
