'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import TitleHeader from '../shared/TitleHeader'

interface ClassItem {
    id: number
    title: string
    date: string
    time: string
    maxSpots: number
    bookedSpots: number
}

const mockClasses: ClassItem[] = [
    {
        id: 1,
        title: 'Matta Pilates',
        date: '2025-11-26',
        time: '14:00 – 15:00',
        maxSpots: 8,
        bookedSpots: 6
    },
    {
        id: 2,
        title: 'Core Flow',
        date: '2025-11-27',
        time: '16:00 – 17:00',
        maxSpots: 8,
        bookedSpots: 3
    },
    {
        id: 3,
        title: 'Pilates Basics',
        date: '2025-11-28',
        time: '10:00 – 11:00',
        maxSpots: 8,
        bookedSpots: 7
    },
    {
        id: 4,
        title: 'Stretch & Strength',
        date: '2025-11-29',
        time: '12:00 – 13:00',
        maxSpots: 8,
        bookedSpots: 2
    }
]

const UpcomingClassesPreview = () => {
    return (
        <section className="w-full bg-white py-8 px-6 md:px-10">
            <TitleHeader
                title="Upcoming Classes"
                subtitle="Plan your next session"
                alignment="center"
            />

            <div className="flex flex-col lg:flex-row items-start gap-8 mt-8">
                {/* Left: Class cards */}
                <div className="flex flex-col lg:w-[60%] mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 justify-items-center lg:justify-items-start">
                        {mockClasses.map((cls) => {
                            const spotsLeft = cls.maxSpots - cls.bookedSpots
                            return (
                                <div
                                    key={cls.id}
                                    className="min-w-[250px] w-full relative bg-secondary-bg rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow flex flex-col "
                                >
                                    {spotsLeft <= 3 && (
                                        <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-400 text-white text-xs font-semibold px-2 py-1 rounded-full">
                                            Only {spotsLeft} left!
                                        </span>
                                    )}

                                    <h5 className="font-semibold text-lg mb-2">
                                        {cls.title}
                                    </h5>

                                    <div className="flex items-center gap-1 mb-2">
                                        <p className="text-gray-700 text-sm font-medium">
                                            {cls.date}
                                        </p>
                                        <span className="text-gray-400">•</span>
                                        <p className="text-gray-600 text-sm">
                                            {cls.time}
                                        </p>
                                    </div>

                                    <div className="mt-auto flex items-center justify-between">
                                        <p className="text-gray-500 text-xs">
                                            {cls.bookedSpots}/{cls.maxSpots}{' '}
                                            booked
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
                        })}
                    </div>

                    <div className="flex justify-center lg:justify-start mt-6">
                        <Link
                            href="/classes"
                            className="border-btn border w-full md:w-fit text-black px-5 py-3 rounded-lg transition-opacity hover:opacity-90 flex items-center gap-2"
                        >
                            See All Classes
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>

                {/* Right: Image */}
                <div className="lg:w-[40%] flex lg:justify-end items-center mx-auto">
                    <img
                        src="/images/pilates-room.png"
                        alt="Pilates Room"
                        className="rounded-md shadow-lg w-full max-w-xl"
                    />
                </div>
            </div>
        </section>
    )
}

export default UpcomingClassesPreview
