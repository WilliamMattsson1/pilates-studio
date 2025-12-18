import { BookingItem } from '@/types/bookings'

export const getBookingStatus = (booking: BookingItem) => {
    if (booking.details?.refunded) {
        return {
            label: 'Refunded',
            bgColor: 'bg-gray-100',
            textColor: 'text-gray-700'
        }
    }

    if (booking.details?.stripe_payment_id) {
        return {
            label: 'Paid (Stripe)',
            bgColor: 'bg-green-200',
            textColor: 'text-green-800'
        }
    }

    if (booking.details?.swish_received) {
        const method = booking.details?.payment_method

        if (method === 'swish') {
            return {
                label: 'Paid (Swish)',
                bgColor: 'bg-green-200',
                textColor: 'text-green-700'
            }
        }

        if (method === 'manual') {
            return {
                label: 'Paid (Manual)',
                bgColor: 'bg-green-200',
                textColor: 'text-green-700'
            }
        }

        return {
            label: 'Paid',
            bgColor: 'bg-green-200',
            textColor: 'text-green-700'
        }
    }

    return {
        label: 'Unpaid',
        bgColor: 'bg-red-300',
        textColor: 'text-red-800'
    }
}

export const isBookingPaid = (booking: BookingItem, isRefunded: boolean) => {
    return (
        booking.details?.swish_received ||
        (booking.details?.stripe_payment_id != null && !isRefunded)
    )
}

export const needsManualPayment = (
    booking: BookingItem,
    isRefunded: boolean
) => {
    return (
        (booking.details?.payment_method === 'swish' ||
            booking.details?.payment_method === 'manual') &&
        !booking.details?.swish_received &&
        !isRefunded &&
        !booking.details?.stripe_payment_id
    )
}
