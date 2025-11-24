'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import TitleHeader from '../shared/TitleHeader'
import ClassCard, { ClassItem } from '../shared/ui/ClassCard'

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
        <section className="w-full bg-white py-8 md:px-10 px-6">
            <TitleHeader
                title="Upcoming Classes"
                subtitle="Plan your next session"
                alignment="center"
            />

            <div className="flex flex-col lg:flex-row items-start gap-8 mt-8">
                {/* Left: Class cards */}
                <div className="flex flex-col lg:w-[60%] w-full mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 justify-items-center lg:justify-items-start">
                        {mockClasses.map((cls: ClassItem) => (
                            <ClassCard key={cls.id} cls={cls} />
                        ))}
                    </div>

                    <div className="flex justify-center lg:justify-start mt-8 md:mt-6">
                        <Link
                            href="/classes"
                            className="border-btn border w-fit text-black px-5 py-3 rounded-lg transition-opacity hover:opacity-90 flex items-center gap-2"
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
