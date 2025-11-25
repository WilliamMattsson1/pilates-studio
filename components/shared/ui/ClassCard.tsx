'use client'

import { ClassItem } from '@/types/classes'
import Link from 'next/link'

interface ClassCardProps {
    cls: ClassItem
}

const ClassCard = ({ cls }: ClassCardProps) => {
    const spotsLeft = cls.maxSpots - cls.bookedSpots
    const isFull = spotsLeft <= 0

    return (
        <div
            className={`min-w-[250px] w-full sm:w-full relative rounded-lg shadow-md p-4 flex flex-col transition-shadow
            ${isFull ? 'bg-gray-300' : 'bg-secondary-bg hover:shadow-lg'}`}
        >
            {isFull ? (
                <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-300 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    Fully booked!
                </span>
            ) : spotsLeft <= 3 ? (
                <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-400 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    Only {spotsLeft} left!
                </span>
            ) : null}

            <h5
                className={`font-semibold text-lg mb-2 ${
                    isFull ? 'text-gray-500' : ''
                }`}
            >
                {cls.title}
            </h5>

            <div className="flex items-center gap-1 mb-2">
                <p
                    className={`text-sm font-medium ${
                        isFull ? 'text-gray-500' : 'text-gray-700'
                    }`}
                >
                    {cls.date}
                </p>
                <span className="text-gray-400">•</span>
                <p
                    className={`text-sm ${
                        isFull ? 'text-gray-400' : 'text-gray-600'
                    }`}
                >
                    {cls.time}
                </p>
            </div>

            <div className="mt-auto flex items-center justify-between">
                <p
                    className={`text-xs ${
                        isFull ? 'text-gray-500' : 'text-gray-500'
                    }`}
                >
                    {cls.bookedSpots}/{cls.maxSpots} booked
                </p>

                {isFull ? (
                    <button
                        disabled
                        className="bg-gray-400 text-white px-3 py-1 rounded-full font-semibold text-sm flex items-center gap-1 cursor-not-allowed"
                    >
                        Book now
                    </button>
                ) : (
                    <Link
                        href={`/booking/${cls.id}`}
                        className="bg-btn text-white px-3 py-1 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-1"
                    >
                        Book now
                    </Link>
                )}
            </div>
        </div>
    )
}

export default ClassCard
