'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import TitleHeader from './TitleHeader'

const InstructorIntro = () => {
    return (
        <section className="w-full">
            <TitleHeader
                title="Meet Your Instructor"
                subtitle="Certified Pilates Expert"
                alignment="center"
            />
            <div className="py-6 px-6 md:px-16 lg:px-24 flex flex-col lg:flex-row items-center gap-6">
                {/* Bild */}
                <div className="w-full md:w-1/2 flex justify-center">
                    <img
                        src="/images/instructor.png"
                        alt="Instructor"
                        className="rounded-md shadow-lg md:max-w-md max-w-[90%]"
                    />
                </div>

                {/* Text */}
                <div className="w-full md:w-[40%] flex flex-col justify-center gap-4 text-center lg:text-left mt-6 lg:mt-0">
                    <h3 className="text-2xl md:text-3xl font-bold">Jane Doe</h3>
                    <p className="text-lg font-medium text-gray-700">
                        Certified Pilates Instructor with over 5 years of
                        experience helping clients improve strength,
                        flexibility, and overall well-being. I focus on tailored
                        exercises for all levels, ensuring a safe and rewarding
                        practice.
                    </p>
                    <div className="flex justify-center lg:justify-start">
                        <Link
                            href="/about"
                            className="mt-2 w-fit bg-btn text-white px-5 py-3 rounded-lg transition-opacity hover:opacity-90 flex items-center gap-2"
                        >
                            Läs mer om mig
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default InstructorIntro
