'use client'
import React from 'react'
import { useBookings } from '@/context/BookingsContext'

interface Props {
    booking: any
}

const BookingCard: React.FC<Props> = ({ booking }) => {
    const { bookings } = useBookings()

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
            </div>
        </div>
    )
}

export default BookingCard
