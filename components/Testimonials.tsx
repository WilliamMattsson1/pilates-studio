import { Quote } from 'lucide-react'

const testimonials = [
    {
        name: 'Anna Karlsson',
        initial: 'A',
        text: 'Lisa is amazing! Her classes have improved my posture and reduced my back pain.'
    },
    {
        name: 'Johanna S.',
        initial: 'J',
        text: 'The atmosphere is calm and welcoming. I always leave feeling stronger and happier.'
    }
]

export default function Testimonials() {
    return (
        <section className="w-full px-6 ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-8">
                {testimonials.map((t, i) => (
                    <div
                        key={i}
                        className="
                            relative
                            bg-bg/40
                            shadow-md rounded-md p-8
                            flex flex-col gap-6
                        "
                    >
                        {/* Quote icon in corner */}
                        <Quote
                            size={42}
                            className="absolute top-4 right-4 text-btn/50"
                        />

                        {/* Testimonial text */}
                        <p className="text-gray-800 text-lg italic leading-relaxed">
                            “{t.text}”
                        </p>

                        {/* Footer with avatar */}
                        <div className="flex items-center gap-2 mt-2">
                            <div
                                className="
                                    w-10 h-10 rounded-full
                                    bg-btn/30 flex items-center justify-center
                                    text-btn font-semibold text-lg
                                "
                            >
                                {t.initial}
                            </div>
                            <span className="font-medium text-md">
                                {t.name}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
