'use client'

import Link from 'next/link'

const AboutHero = () => {
    return (
        <section
            className="relative bg-cover bg-center  h-screen"
            style={{ backgroundImage: `url('/images/about-instructor.png')` }}
        >
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center py-40 text-center px-6">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white fancy-font tracking-wide leading-tight">
                    Meet Jane, Your Pilates Guide
                </h1>
                <p className="text-md md:text-xl text-gray-100 md:mt-2 mt-4 max-w-2xl uppercase leading-tight italic">
                    Specializing in Reformer & Core Pilates to help you
                    strengthen, stretch, and balance.
                </p>

                <Link
                    href="/classes/#available-classes"
                    className="mt-4 bg-btn text-white px-6 py-3 rounded-lg hover:bg-btn-hover transition font-medium"
                >
                    See Available Classes
                </Link>
            </div>
        </section>
    )
}

export default AboutHero
