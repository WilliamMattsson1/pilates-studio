import { User, Heart, Clock } from 'lucide-react'
import TitleHeader from '../shared/TitleHeader'
import SectionDivider from '../shared/ui/SectionDivider'
import Testimonials from './Testimonials'

const benefits = [
    {
        icon: <User size={62} className="text-icon" />,
        title: 'Personalized Training',
        description:
            'Tailored exercises for all levels, so everyone can progress safely.'
    },
    {
        icon: <Heart size={62} className="text-icon" />,
        title: 'Improve Well-being',
        description:
            'Build strength, flexibility, and overall health through Pilates.'
    },
    {
        icon: <Clock size={62} className="text-icon" />,
        title: 'Flexible Scheduling',
        description:
            'Book classes when it suits you, with easy online management.'
    },
    {
        icon: <User size={62} className="text-icon" />,
        title: 'Expert Guidance',
        description:
            'Learn from a certified instructor with years of experience.'
    }
]

const PilatesBenefits = () => {
    return (
        <section
            className="w-full bg-primary-bg
          px-6 py-13"
        >
            <TitleHeader
                title="Why Choose Pilates?"
                subtitle="Discover the benefits"
                alignment="center"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-7">
                {benefits.map((benefit, i) => (
                    <div
                        key={i}
                        className="bg-card flex flex-col items-center text-center gap-3 p-6 rounded-md shadow-md hover:shadow-lg transition-shadow"
                    >
                        {benefit.icon}
                        <h4 className="text-2xl font-semibold">
                            {benefit.title}
                        </h4>
                        <p className="text-gray-800 text-md">
                            {benefit.description}
                        </p>
                    </div>
                ))}
            </div>

            <SectionDivider className="my-14 bg-icon h-1 w-[65%]" />

            <Testimonials />
        </section>
    )
}

export default PilatesBenefits
