'use client'

import { ArrowDown, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const ClassesHero = () => {
    return (
        <section className="w-full bg-secondary-bg py-16 px-6 md:px-20 flex flex-col lg:flex-row items-center gap-10 lg:gap-0">
            <div className="flex-1 flex flex-col gap-8">
                <h1 className="text-4xl md:text-5xl font-extrabold text-center lg:text-left">
                    Discover Our Pilates Classes
                </h1>

                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="bg-white rounded-lg shadow-lg p-4 flex-1 flex flex-col gap-3">
                        <h2 className="text-2xl font-semibold">
                            Reformer Pilates
                        </h2>
                        <p className="text-gray-700">
                            Build strength and stability with our Core Pilates
                            sessions. Perfect for improving your core.
                        </p>
                        <Link
                            href="#reformer-pilates"
                            className="mt-auto self-start text-btn font-semibold flex items-center gap-1 hover:underline"
                        >
                            Läs mer{' '}
                            <ArrowRight size={16} className="inline-block" />
                        </Link>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-4 flex-1 flex flex-col gap-3">
                        <h2 className="text-2xl font-semibold">Core Pilates</h2>
                        <p className="text-gray-700">
                            Increase flexibility and improve your posture with
                            our Mat Pilates classes. Suitable for all levels.
                        </p>
                        <Link
                            href="#core-pilates"
                            className="mt-auto self-start text-btn font-semibold flex items-center gap-1 hover:underline"
                        >
                            Läs mer{' '}
                            <ArrowRight size={16} className="inline-block" />
                        </Link>
                    </div>
                </div>

                <Link
                    href="#booking"
                    className="hidden lg:flex absolute bottom-6 left-1/2 transform -translate-x-1/2  flex-col items-center text-white animate-bounce"
                >
                    <ArrowDown size={22} className="text-btn " />
                </Link>
            </div>

            <div className="flex-1 flex justify-center lg:justify-end w-full max-w-lg">
                <img
                    src="/images/classes-hero.png"
                    alt="Pilates Classes Hero"
                    className="rounded-lg shadow-xl w-64 sm:w-72 md:w-80 lg:w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-sm"
                />
            </div>
        </section>
    )
}

export default ClassesHero
