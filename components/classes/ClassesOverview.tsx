'use client'

import { ArrowRight } from 'lucide-react'
import TitleHeader from '../shared/TitleHeader'
import Link from 'next/link'
import Image from 'next/image'

const ClassesDetailSections = () => {
    return (
        <section className="px-6 md:px-20 py-12 mt-16 flex flex-col gap-10 bg-secondary-bg">
            <TitleHeader
                title="Discover  Pilates Classes"
                subtitle="Our Specialized Sessions"
                alignment="center"
            />

            <div className="flex flex-col lg:flex-row items-center gap-8">
                <div
                    id="reformer-pilates"
                    className="flex-[55%] flex flex-col gap-4"
                >
                    <h3 className="text-2xl font-bold fancy-font tracking-widest">
                        Reformer Pilates
                    </h3>
                    <p className="text-gray-700 text-lg leading-relaxed">
                        Strengthen your core, improve posture, and enhance
                        overall stability with our Reformer Pilates sessions.
                        Using the reformer equipment, these classes provide a
                        full-body workout that engages multiple muscle groups
                        simultaneously, ensuring an efficient and balanced
                        routine.
                    </p>
                    <p className="text-gray-700 text-lg">
                        Our experienced instructors guide you through precise
                        movements that challenge your strength, flexibility, and
                        coordination. Ideal for both beginners and seasoned
                        practitioners, Reformer Pilates will leave you feeling
                        more energized, confident, and balanced after every
                        session.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2 md:justify-start justify-center">
                        <span className="bg-primary-bg shadow-lg px-3 py-1 rounded-full text-sm">
                            💪 Strength & Stability
                        </span>
                        <span className="bg-primary-bg shadow-lg px-3 py-1 rounded-full text-sm">
                            🧘 Core & Posture Focus
                        </span>
                        <span className="bg-primary-bg shadow-lg px-3 py-1 rounded-full text-sm">
                            🌟 Suitable for All Levels
                        </span>
                    </div>
                    <div className="flex justify-center lg:justify-start">
                        <Link
                            href="#available-classes"
                            className="mt-2 w-fit h-[30px] bg-btn text-white font-medium px-4 py-6 rounded-lg transition-opacity hover:bg-btn-hover flex items-center gap-2"
                        >
                            See Available Classes
                            <ArrowRight size={22} />
                        </Link>
                    </div>
                </div>

                <div className="flex-[45%] flex justify-end">
                    <Image
                        src="/images/reformer-pilates.png"
                        alt="Reformer Pilates"
                        className="w-full max-w-sm md:max-w-md lg:max-w-lg rounded-lg shadow-lg object-contain"
                        width={600}
                        height={600}
                    />
                </div>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="flex-[45%]">
                    <Image
                        src="/images/core-pilates.png"
                        alt="Core Pilates"
                        className="rounded-lg shadow-lg w-full max-w-lg hidden md:block"
                        width={600}
                        height={600}
                    />
                </div>

                <div
                    id="core-pilates"
                    className="flex-[55%] flex flex-col gap-4"
                >
                    <h3 className="text-2xl font-bold fancy-font tracking-widest">
                        Core Pilates
                    </h3>
                    <p className="text-gray-700 text-lg leading-relaxed">
                        Enhance flexibility, balance, and alignment with our
                        Core Pilates classes. Focusing on controlled movements
                        and mindful breathing, these sessions strengthen the
                        muscles that support posture and improve overall body
                        awareness.
                    </p>
                    <p className="text-gray-700 text-lg">
                        Perfect for all levels, Core Pilates classes help you
                        build endurance and coordination while reducing tension
                        and promoting better alignment. Participants often
                        report feeling more energized, centered, and capable in
                        their daily activities.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2 justify-center lg:justify-start">
                        <span className="bg-primary-bg shadow-lg px-3 py-1 rounded-full text-sm">
                            🤸 Flexibility & Balance
                        </span>
                        <span className="bg-primary-bg shadow-lg px-3 py-1 rounded-full text-sm">
                            🧘 Alignment & Core Strength
                        </span>
                        <span className="bg-primary-bg shadow-lg px-3 py-1 rounded-full text-sm">
                            🌟 Beginner-Friendly
                        </span>
                    </div>
                    <div className="flex justify-center md:justify-start">
                        <Link
                            href="#available-classes"
                            className="mt-2 w-fit h-[30px] bg-btn text-white font-medium px-4 py-6 rounded-lg transition-opacity hover:bg-btn-hover flex items-center gap-2"
                        >
                            See Available Classes
                            <ArrowRight size={22} />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ClassesDetailSections
