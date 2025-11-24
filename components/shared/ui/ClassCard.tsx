'use client'

import Link from 'next/link'

export interface ClassItem {
    id: number
    title: string
    date: string
    time: string
    maxSpots: number
    bookedSpots: number
}

interface ClassCardProps {
    cls: ClassItem
}

const ClassCard = ({ cls }: ClassCardProps) => {
    const spotsLeft = cls.maxSpots - cls.bookedSpots

    return (
        <div className="min-w-[250px] w-[90%] sm:w-full relative bg-secondary-bg rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow flex flex-col">
            {spotsLeft <= 3 && (
                <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-400 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    Only {spotsLeft} left!
                </span>
            )}

            <h5 className="font-semibold text-lg mb-2">{cls.title}</h5>

            <div className="flex items-center gap-1 mb-2">
                <p className="text-gray-700 text-sm font-medium">{cls.date}</p>
                <span className="text-gray-400">•</span>
                <p className="text-gray-600 text-sm">{cls.time}</p>
            </div>

            <div className="mt-auto flex items-center justify-between">
                <p className="text-gray-500 text-xs">
                    {cls.bookedSpots}/{cls.maxSpots} booked
                </p>

                <Link
                    href={`/booking/${cls.id}`}
                    className="bg-btn text-white px-3 py-1 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-1"
                >
                    Book now
                </Link>
            </div>
        </div>
    )
}

export default ClassCard
