'use client'

import { CheckCircle } from 'lucide-react'

interface BookingConfirmationProps {
    title: string
    date: string
    startTime: string
    endTime: string
    onClose: () => void
}

const BookingConfirmation = ({
    title,
    date,
    startTime,
    endTime,
    onClose
}: BookingConfirmationProps) => {
    return (
        <div className="flex flex-col items-center justify-center gap-4 p-8 max-w-md mx-auto text-center">
            <CheckCircle size={78} className="text-green-500 mb-2" />
            <h3 className="text-2xl font-bold text-gray-800">
                Booking Confirmed!
            </h3>
            <p className="text-gray-600 text-sm md:text-base">
                You have successfully booked <strong>{title}</strong>
                <br />
                <strong>{date}</strong> at{' '}
                <strong>
                    {startTime}-{endTime}
                </strong>
                .
            </p>
            <button
                onClick={onClose}
                className="mt-4 bg-btn text-white px-6 py-2 rounded-lg w-40 font-medium hover:bg-btn/90 transition hover:cursor-pointer"
            >
                Done
            </button>
        </div>
    )
}

export default BookingConfirmation
