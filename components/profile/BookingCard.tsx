// components/BookingCard.tsx
import React from 'react'

interface Props {
    booking: any
    onCancel?: (id: string) => void
    showCancel?: boolean
}

export const BookingCard: React.FC<Props> = ({
    booking,
    onCancel,
    showCancel = false
}) => {
    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr)
        return d.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    return (
        <div
            className={`flex justify-between items-center bg-secondary-bg p-4 shadow-lg rounded-lg ${
                showCancel ? ' shadow-sm' : ' opacity-60'
            }`}
        >
            <div>
                <p className="font-medium">{booking.classes?.title}</p>
                <p className="text-gray-500 text-sm">
                    {formatDate(booking.classes?.date)}{' '}
                    {booking.classes?.start_time} - {booking.classes?.end_time}
                </p>
            </div>
            {showCancel && onCancel && (
                <button
                    onClick={() => onCancel(booking.id)}
                    className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                    Cancel
                </button>
            )}
        </div>
    )
}
