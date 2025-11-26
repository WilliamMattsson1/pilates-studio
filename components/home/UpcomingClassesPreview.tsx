'use client'

import { ArrowRight, CalendarOff } from 'lucide-react'
import Link from 'next/link'
import TitleHeader from '../shared/TitleHeader'
import ClassCard from '../shared/ui/ClassCard'
import { ClassItem } from '@/types/classes'
import { useClasses } from '@/context/ClassesContext'
import { filterUpcomingClasses, sortClassesByDate } from '@/utils/classes'

const UpcomingClassesPreview = () => {
    const { classes } = useClasses()
    const sortedClasses = sortClassesByDate(classes)
    const upcomingClasses = filterUpcomingClasses(sortedClasses).slice(0, 4) // bara de 4 första

    return (
        <section className="w-full bg-white py-8 md:px-10 px-6">
            <TitleHeader
                title="Upcoming Classes"
                subtitle="Plan your next session"
                alignment="center"
            />

            <div className="flex flex-col lg:flex-row items-start gap-8 mt-8">
                {/* Left: Class cards */}
                {upcomingClasses.length === 0 ? (
                    <div
                        className="flex flex-col items-center justify-center text-center
                    bg-secondary-bg/40 rounded-xl
                    py-14 px-6 w-full lg:w-[60%] mx-auto shadow-md"
                    >
                        <div className="w-14 h-14 rounded-full bg-white shadow flex items-center justify-center mb-4">
                            <CalendarOff className="w-6 h-6 text-gray-400 rotate-90" />
                        </div>

                        <h3 className="text-xl font-semibold text-gray-800">
                            No Upcoming Classes
                        </h3>

                        <p className="text-gray-500 mt-1 max-w-sm">
                            Once the instructor add classes, they will appear
                            here so visitors can book their sessions.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col lg:w-[60%] w-full mx-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 justify-items-center lg:justify-items-start">
                            {upcomingClasses.map((cls: ClassItem) => (
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
                )}

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
