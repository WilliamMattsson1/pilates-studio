'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import TitleHeader from '../shared/TitleHeader'
import ClassCard from '../shared/ui/ClassCard'
import SkeletonClassCard from '../shared/ui/SkeletonClassCard'
import { ClassItem } from '@/types/classes'
import { useClasses } from '@/context/ClassesContext'
import NoUpcomingClasses from '../shared/NoUpcomingClasses'

const UpcomingClassesPreview = () => {
    const { upcomingClasses, loading } = useClasses()
    const upcomingClassesSliced = upcomingClasses.slice(0, 4) // bara de 4 första

    return (
        <section className="w-full bg-primary-bg py-8 md:px-10 px-6 mb-8">
            <TitleHeader
                title="Upcoming Classes"
                subtitle="Plan your session"
                alignment="left"
            />

            <div className="flex flex-col lg:flex-row items-start gap-8 mt-8">
                {/* Left side */}
                {loading ? (
                    // Skeleton cards om det laddar
                    <div className="flex flex-col lg:w-[60%] w-full mx-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 justify-items-center lg:justify-items-start">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <SkeletonClassCard key={i} />
                            ))}
                        </div>

                        <div className="flex justify-center lg:justify-start mt-8 md:mt-6">
                            <Link
                                href="/classes"
                                className="border-b-gray-300 border w-fit text-gray-300 px-5 py-3 rounded-lg transition-opacity flex items-center gap-2 opacity-50 pointer-events-none"
                            >
                                See All Classes
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                ) : upcomingClasses.length === 0 ? (
                    <NoUpcomingClasses />
                ) : (
                    <div className="flex flex-col lg:w-[60%] w-full mx-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 justify-items-center lg:justify-items-start">
                            {upcomingClassesSliced.map((cls: ClassItem) => (
                                <ClassCard key={cls.id} cls={cls} />
                            ))}
                        </div>

                        <div className="flex justify-center lg:justify-start mt-8 md:mt-6">
                            <Link
                                href="/classes"
                                className="border w-fit text-black px-5 py-3 rounded-lg transition-opacity hover:bg-btn hover:text-white flex items-center gap-2"
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
