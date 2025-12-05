'use client'

import { User, Dumbbell, Heart } from 'lucide-react'
import TitleHeader from '../shared/TitleHeader'

const AboutBio = () => {
    const bioCards = [
        {
            icon: <User className="w-16 h-16 text-btn/50" />,
            title: 'Experienced Instructor',
            description:
                'Emma has over 10 years of teaching experience, guiding students of all levels to improve their strength, flexibility, and posture.'
        },
        {
            icon: <Dumbbell className="w-16 h-16 text-btn/50" />,
            title: 'Pilates Expert',
            description:
                'Specializing in Reformer and Core Pilates, Emma creates tailored programs that target strength, stability, and overall body awareness.'
        },
        {
            icon: <Heart className="w-16 h-16 text-btn/50" />,
            title: 'Passionate & Caring',
            description:
                'Emma believes in a holistic approach, supporting students both physically and mentally to help them achieve their wellness goals.'
        }
    ]

    return (
        <section className="px-6 md:px-20 pt-16 pb-22 bg-secondary-bg flex flex-col gap-4">
            <TitleHeader
                title="Your Pilates Instructor"
                subtitle="Passion in every session"
                alignment="center"
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {bioCards.map((card, idx) => (
                    <div
                        key={idx}
                        className="bg-primary-bg rounded-xl shadow-lg p-6 flex flex-col items-center text-center md:text-left gap-4"
                    >
                        {card.icon}
                        <h3 className="text-xl font-semibold">{card.title}</h3>
                        <p className="text-gray-700 text-md">
                            {card.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default AboutBio
