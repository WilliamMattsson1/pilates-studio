'use client'

import Link from 'next/link'

const AboutHero = () => {
    return (
        <section
            className="relative bg-cover bg-center  h-screen"
            style={{ backgroundImage: `url('/images/about-instructor.png')` }}
        >
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center py-40 text-center px-6">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white">
                    Meet Jane - Your Pilates Guide
                </h1>
                <p className="text-lg md:text-xl text-gray-100 mt-4 max-w-2xl">
                    Specializing in Reformer and Core Pilates to help you
                    strengthen, stretch, and balance. Jane brings years of
                    experience and a passion for helping students achieve their
                    wellness goals.
                </p>

                <Link
                    href="/classes/#available-classes"
                    className="mt-6 bg-btn text-white px-6 py-3 rounded-lg hover:opacity-90 transition font-medium"
                >
                    See Available Classes
                </Link>
            </div>
        </section>
    )
}

export default AboutHero
