'use client'

import TitleHeader from './TitleHeader'

interface ClassItem {
    id: number
    date: string
    time: string
    spotsLeft: number
    maxSpots: number
    title: string
}

const classes: ClassItem[] = [
    {
        id: 1,
        date: 'Tisdag 26 Nov',
        time: '14:00 – 15:00',
        spotsLeft: 2,
        maxSpots: 8,
        title: 'Matta Pilates'
    },
    {
        id: 2,
        date: 'Onsdag 27 Nov',
        time: '16:00 – 17:00',
        spotsLeft: 5,
        maxSpots: 8,
        title: 'Core Flow'
    },
    {
        id: 3,
        date: 'Torsdag 28 Nov',
        time: '10:00 – 11:00',
        spotsLeft: 1,
        maxSpots: 8,
        title: 'Pilates Basics'
    },
    {
        id: 4,
        date: 'Fredag 29 Nov',
        time: '12:00 – 13:00',
        spotsLeft: 8,
        maxSpots: 8,
        title: 'Stretch & Strength'
    }
]

const UpcomingClassesPreview = () => {
    return (
        <section className="w-full bg-white py-2 px-6 md:px-16 lg:px-24">
            <TitleHeader
                title="Upcoming Classes"
                subtitle="Plan your next session"
                alignment="center"
            />

            <div className="flex flex-col lg:flex-row items-start gap-8 mt-8">
                {/* Left: Class cards */}
                <div className="flex flex-wrap gap-6 lg:w-1/2">
                    {classes.map((cls) => (
                        <div
                            key={cls.id}
                            className="relative w-full sm:w-[48%] bg-bg rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                        >
                            {/* Alert if spots are low */}
                            {cls.spotsLeft <= 3 && (
                                <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                                    Endast {cls.spotsLeft} platser kvar!
                                </span>
                            )}

                            <h4 className="font-semibold text-lg mb-1">
                                {cls.title}
                            </h4>
                            <p className="text-gray-600 text-sm">{cls.date}</p>
                            <p className="text-gray-600 text-sm mb-1">
                                {cls.time}
                            </p>
                            <p className="text-gray-500 text-xs">
                                {cls.spotsLeft}/{cls.maxSpots} kvar
                            </p>
                        </div>
                    ))}
                </div>

                {/* Right: Image */}
                <div className="lg:w-1/2 flex justify-center items-center">
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
