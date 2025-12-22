import { Metadata } from 'next'
import AdminBookingsWrapper from './AdminBookingsWrapper'

export const metadata: Metadata = {
    title: 'Admin Bookings | Pilates Studio',
    description: 'Manage classes and bookings as an instructor.'
}
const page = () => {
    return <AdminBookingsWrapper />
}

export default page
