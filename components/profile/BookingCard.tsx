// components/BookingCard.tsx
'use client'
import React from 'react'
import { useBookings } from '@/context/BookingsContext'

interface Props {
    booking: any
    onCancel?: (id: string) => void
    showCancel?: boolean
}

const BookingCard: React.FC<Props> = ({
    booking,
    onCancel,
    showCancel = false
}) => {
    const { bookings } = useBookings()

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr)
        return d.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const bookedSpots = bookings.filter(
        (b) => b.class_id === booking.class_id
    ).length
    const maxSpots = booking.classes?.max_spots || 0
    const spotsLeft = maxSpots - bookedSpots
    const isFull = spotsLeft <= 0

    return (
        <div
            className={`relative min-w-[250px] w-full sm:w-full rounded-lg shadow-md p-4 flex flex-col transition-shadow
        ${isFull ? 'bg-gray-300' : 'bg-secondary-bg hover:shadow-lg'}`}
        >
            <div className="mb-2">
                <p
                    className={`font-semibold text-lg ${
                        isFull ? 'text-gray-500' : ''
                    }`}
                >
                    {booking.classes?.title}
                </p>
                <p
                    className={`text-sm ${
                        isFull ? 'text-gray-400' : 'text-gray-600'
                    }`}
                >
                    <span className="text-black/90 ">
                        {booking.classes?.date}
                    </span>
                    {'  •  '}
                    {booking.classes?.start_time} - {booking.classes?.end_time}
                </p>
            </div>

            {/* Footer */}
            <div className="mt-auto flex items-center justify-between">
                <p
                    className={`text-xs ${
                        isFull ? 'text-gray-500' : 'text-gray-500'
                    }`}
                >
                    {bookedSpots}/{maxSpots} booked
                </p>

                {showCancel && onCancel && (
                    <button
                        onClick={() => onCancel(booking.id)}
                        className={`px-3 py-1 text-sm rounded-full font-semibold hover:cursor-pointer ${
                            isFull
                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                : 'bg-red-500 text-white hover:bg-red-600'
                        }`}
                        disabled={isFull}
                    >
                        Cancel
                    </button>
                )}
            </div>
        </div>
    )
}

export default BookingCard
