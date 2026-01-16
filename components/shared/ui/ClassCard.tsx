'use client'

import { useBookingModal } from '@/context/BookingModalContext'
import { useBookings } from '@/context/BookingsContext'
import { ClassItem } from '@/types/classes'

interface ClassCardProps {
    cls: ClassItem
}

const ClassCard = ({ cls }: ClassCardProps) => {
    const { bookings } = useBookings()
    const { openModal } = useBookingModal()
    const bookedSpots = bookings.filter((b) => b.class_id === cls.id).length
    const spotsLeft = cls.max_spots - bookedSpots
    const isFull = spotsLeft <= 0

    return (
        <div
            className={`min-w-[250px] w-full sm:w-full relative rounded-lg shadow-md p-4 flex flex-col transition-shadow
            ${isFull ? 'bg-gray-100' : 'bg-secondary-bg hover:shadow-lg'}`}
        >
            {isFull ? (
                <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-700 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    Fully booked!
                </span>
            ) : spotsLeft <= 3 ? (
                /* bg-red-600 är godkänt mot vit text, bg-red-500 är det inte alltid */
                <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    Only {spotsLeft} left!
                </span>
            ) : null}

            {/* Ändrat h5 -> h3 för SEO/A11y och mörkare grå för isFull */}
            <h3
                className={`font-semibold text-lg mb-2 ${
                    isFull ? 'text-gray-700' : 'text-gray-900'
                }`}
            >
                {cls.title}
            </h3>

            <div className="flex items-center gap-1 mb-2">
                <p
                    className={`text-sm font-medium ${
                        isFull ? 'text-gray-700' : 'text-gray-700'
                    }`}
                >
                    {cls.date}
                </p>
                <span className="text-gray-600">•</span>
                <p
                    className={`text-sm ${
                        isFull ? 'text-gray-700' : 'text-gray-700'
                    }`}
                >
                    {cls.start_time} - {cls.end_time}
                </p>
            </div>

            <div className="mt-auto flex items-center justify-between">
                <p
                    className={`text-xs font-medium ${
                        isFull ? 'text-gray-600' : 'text-gray-600'
                    }`}
                >
                    {bookedSpots}/{cls.max_spots} booked
                </p>

                {isFull ? (
                    <button
                        disabled
                        className="bg-gray-500 text-white px-3 py-1 rounded-full font-semibold text-sm flex items-center gap-1 cursor-not-allowed"
                    >
                        Book now
                    </button>
                ) : (
                    <button
                        onClick={() => openModal(cls)}
                        className="bg-btn text-white px-3 py-1 rounded-full font-semibold text-sm hover:bg-btn-hover hover:cursor-pointer"
                    >
                        Book now
                    </button>
                )}
            </div>
        </div>
    )
}

export default ClassCard
