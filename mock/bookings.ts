import { BookingWithDetails } from '@/types/bookings'

const mockBookings: BookingWithDetails[] = [
    {
        id: '1',
        class_id: '3',
        created_at: '2025-11-20T10:00:00Z',
        details: {
            id: 'd1',
            booking_id: '1',
            user_id: null,
            guest_name: 'Alice Svensson',
            guest_email: 'alice@example.com',
            stripe_payment_id: null,
            payment_method: 'manual',
            swish_received: false,
            refunded: false,
            refunded_at: null,
            created_at: '2025-11-20T10:00:00Z'
        }
    },
    {
        id: '2',
        class_id: '3',
        created_at: '2025-11-20T11:30:00Z',
        details: {
            id: 'd2',
            booking_id: '2',
            user_id: null,
            guest_name: 'Bob Andersson',
            guest_email: 'bob@example.com',
            stripe_payment_id: null,
            payment_method: 'manual',
            swish_received: false,
            refunded: false,
            refunded_at: null,
            created_at: '2025-11-20T11:30:00Z'
        }
    },
    {
        id: '3',
        class_id: '3',
        created_at: '2025-11-21T12:45:00Z',
        details: {
            id: 'd3',
            booking_id: '3',
            user_id: null,
            guest_name: 'Carl Lind',
            guest_email: 'carl@example.com',
            stripe_payment_id: null,
            payment_method: 'manual',
            swish_received: false,
            refunded: false,
            refunded_at: null,
            created_at: '2025-11-21T12:45:00Z'
        }
    }
]

export { mockBookings }
