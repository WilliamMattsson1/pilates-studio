'use client'

import TitleHeader from '../shared/TitleHeader'

const ClassesDetailSections = () => {
    return (
        <section className="px-6 md:px-20 py-12 mt-16 flex flex-col gap-10 bg-secondary-bg">
            <TitleHeader
                title="Discover Our Pilates Classes"
                subtitle="Explore our specialized sessions designed to enhance strength, flexibility, and wellbeing"
                alignment="center"
            />

            <div className="flex flex-col lg:flex-row items-center gap-8">
                <div
                    id="reformer-pilates"
                    className="flex-[55%] flex flex-col gap-4"
                >
                    <h2 className="text-3xl font-bold">Reformer Pilates</h2>
                    <p className="text-gray-700 text-lg">
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
                    <div className="flex flex-wrap gap-2 mt-2">
                        <span className="bg-white shadow-lg px-3 py-1 rounded-full text-sm">
                            💪 Strength & Stability
                        </span>
                        <span className="bg-white shadow-lg px-3 py-1 rounded-full text-sm">
                            🧘 Core & Posture Focus
                        </span>
                        <span className="bg-white shadow-lg px-3 py-1 rounded-full text-sm">
                            🌟 Suitable for All Levels
                        </span>
                    </div>
                </div>

                <div className="flex-[45%] flex justify-end">
                    <img
                        src="/images/reformer-pilates.png"
                        alt="Reformer Pilates"
                        className="rounded-lg shadow-lg max-w-lg"
                    />
                </div>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="flex-[45%]">
                    <img
                        src="/images/core-pilates.png"
                        alt="Core Pilates"
                        className="rounded-lg shadow-lg w-full max-w-lg"
                    />
                </div>

                <div
                    id="core-pilates"
                    className="flex-[55%] flex flex-col gap-4"
                >
                    <h2 className="text-3xl font-bold">Core Pilates</h2>
                    <p className="text-gray-700 text-lg">
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
                    <div className="flex flex-wrap gap-2 mt-2">
                        <span className="bg-white shadow-lg px-3 py-1 rounded-full text-sm">
                            🤸 Flexibility & Balance
                        </span>
                        <span className="bg-white shadow-lg px-3 py-1 rounded-full text-sm">
                            🧘 Alignment & Core Strength
                        </span>
                        <span className="bg-white shadow-lg px-3 py-1 rounded-full text-sm">
                            🌟 Beginner-Friendly
                        </span>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ClassesDetailSections
