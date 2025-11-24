'use client'

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

interface WeekClasses {
    weekNumber: number
    classes: ClassItem[]
}

// Ny mockdata med 3 veckor
const AvailableClassesData: WeekClasses[] = [
    {
        weekNumber: 48,
        classes: [
            {
                id: 1,
                title: 'Matta Pilates',
                date: 'Mån 25 Nov',
                time: '14:00 – 15:00',
                maxSpots: 8,
                bookedSpots: 6
            },
            {
                id: 2,
                title: 'Core Flow',
                date: 'Tis 26 Nov',
                time: '16:00 – 17:00',
                maxSpots: 8,
                bookedSpots: 3
            },
            {
                id: 3,
                title: 'Pilates Basics',
                date: 'Ons 27 Nov',
                time: '10:00 – 11:00',
                maxSpots: 10,
                bookedSpots: 8
            },
            {
                id: 4,
                title: 'Stretch & Strength',
                date: 'Tor 28 Nov',
                time: '12:00 – 13:00',
                maxSpots: 8,
                bookedSpots: 5
            }
        ]
    },
    {
        weekNumber: 49,
        classes: [
            {
                id: 5,
                title: 'Matta Pilates',
                date: 'Mån 2 Dec',
                time: '14:00 – 15:00',
                maxSpots: 8,
                bookedSpots: 2
            },
            {
                id: 6,
                title: 'Core Flow',
                date: 'Tis 3 Dec',
                time: '16:00 – 17:00',
                maxSpots: 8,
                bookedSpots: 5
            },
            {
                id: 7,
                title: 'Pilates Basics',
                date: 'Ons 4 Dec',
                time: '10:00 – 11:00',
                maxSpots: 10,
                bookedSpots: 9
            }
        ]
    },
    {
        weekNumber: 50,
        classes: [
            {
                id: 8,
                title: 'Stretch & Strength',
                date: 'Mån 9 Dec',
                time: '12:00 – 13:00',
                maxSpots: 8,
                bookedSpots: 8
            },
            {
                id: 9,
                title: 'Core Flow',
                date: 'Tis 10 Dec',
                time: '16:00 – 17:00',
                maxSpots: 8,
                bookedSpots: 4
            }
        ]
    }
]

const AvailableClasses = () => {
    return (
        <section
            id="available-classes"
            className="w-full bg-primary-bg mt-12 px-6 md:px-20"
        >
            <TitleHeader
                title="Available Classes"
                subtitle="Find your session"
                alignment="center"
            />

            <div className="flex flex-col gap-8 mt-8">
                {AvailableClassesData.map((week) => (
                    <div key={week.weekNumber}>
                        <h3 className="text-2xl md:text-3xl font-bold mb-2">
                            Week {week.weekNumber}
                        </h3>

                        {/* Class card grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 justify-items-center">
                            {week.classes.map((cls) => {
                                const spotsLeft = cls.maxSpots - cls.bookedSpots
                                return (
                                    <div
                                        key={cls.id}
                                        className="w-[90%] sm:w-full min-w-[250px] relative bg-secondary-bg rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow flex flex-col"
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
                                            <span className="text-gray-400">
                                                •
                                            </span>
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
                    </div>
                ))}
            </div>
        </section>
    )
}

export default AvailableClasses
