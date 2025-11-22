'use client'

import Link from 'next/link'

const InstructorIntro = () => {
    return (
        <section className="w-full py-18 px-6 md:px-16 lg:px-24 flex flex-col lg:flex-row items-center gap-2">
            {/* Bild */}
            <div className="w-full md:w-1/2 flex justify-center md:justify-center">
                <img
                    src="/images/instructor.png"
                    alt="Instructor"
                    className="rounded-md shadow-lg md:max-w-md max-w-[90%]"
                />
            </div>

            {/* Text */}
            <div className="w-full md:w-[40%] flex flex-col justify-center text-left gap-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center">
                    Emma Svensson
                </h2>
                <p className="text-lg font-medium text-gray-700">
                    Certified Pilates Instructor with over 5 years of experience
                    helping clients improve strength, flexibility, and overall
                    well-being. I focus on tailored exercises for all levels,
                    ensuring a safe and rewarding practice.
                </p>
                <Link
                    href="/about"
                    className="mt-2 w-fit bg-btn text-white px-6 py-3 rounded-lg transition-opacity hover:opacity-90 mx-auto"
                >
                    Läs mer om mig
                </Link>
            </div>
        </section>
    )
}

export default InstructorIntro
