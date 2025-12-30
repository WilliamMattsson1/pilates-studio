'use client'

import Link from 'next/link'

const AboutHero = () => {
    return (
        <section
            className="relative bg-cover bg-center  h-screen"
            style={{ backgroundImage: `url('/images/about-instructor.png')` }}
        >
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center py-40 text-center px-6">
                <h1 className="text-3xl md:text-6xl font-bold mb-4 md:mb-2 fancy-font tracking-wide leading-tight text-white">
                    Meet Jane <br /> Your Pilates Guide
                </h1>
                <p className="text-md md:text-md font-mono font-medium mb-8 md:mb-6 max-w-md mx-auto uppercase leading-tight italic text-white">
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
