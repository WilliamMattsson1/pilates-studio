import AdminAddBooking from '@/components/admin/AdminAddBooking'
import AdminAllBookings from '@/components/admin/AdminAllBookings'
import AdminTabs from '@/components/admin/AdminTabs'

const page = () => {
    return (
        <>
            <AdminTabs
                tabs={[
                    {
                        key: 'all',
                        label: 'All Bookings',
                        content: <AdminAllBookings />
                    },
                    {
                        key: 'add',
                        label: 'Add Booking',
                        content: <AdminAddBooking />
                    }
                ]}
            />
        </>
    )
}

export default page
