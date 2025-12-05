'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import TitleHeader from '../shared/TitleHeader'
import DownArrow from '../shared/ui/DownArrow'

const faqs = [
    {
        question: 'How do I book a class?',
        answer: 'You can easily book a class through the bookings page. Payment is handled during checkout, and you will receive a confirmation email afterward.'
    },
    {
        question: 'Do I need any prior experience?',
        answer: 'No experience is required. The classes are suitable for both beginners and more experienced participants.'
    },
    {
        question: 'What should I bring to the class?',
        answer: 'Comfortable workout clothes and a water bottle. Mats are provided, but feel free to bring your own if you prefer.'
    },
    {
        question: 'Can I cancel my booking?',
        answer: 'Yes, cancellations are allowed up to 24 hours before the session starts.'
    },
    {
        question: 'Is parking available?',
        answer: 'Yes, free parking is available right outside the studio.'
    },
    {
        question: 'How long is each class?',
        answer: 'Each session typically lasts 60 minutes depending on the class type.'
    },
    {
        question: 'Are the classes suitable during pregnancy?',
        answer: 'Many exercises can be adapted, but please consult your doctor first and inform the instructor before the class.'
    }
]

const AboutFAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    const toggle = (i: number) => {
        setOpenIndex(openIndex === i ? null : i)
    }

    return (
        <section className="w-full max-w-[90%] mx-auto py-10">
            <div className="max-w-3xl mx-auto">
                <TitleHeader
                    title="Frequently Asked Questions"
                    subtitle="Everything you need to know"
                />
                <div className="hidden lg:flex transform flex-col items-center animate-bounce my-7">
                    <DownArrow width={50} height={50} />
                </div>

                <div className="space-y-3">
                    {faqs.map((faq, i) => (
                        <div
                            key={i}
                            className="rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow duration-300
"
                        >
                            <button
                                onClick={() => toggle(i)}
                                className="w-full flex justify-between items-center p-5 text-left"
                            >
                                <span className="font-medium text-lg">
                                    {faq.question}
                                </span>
                                <ChevronDown
                                    className={`h-5 w-5 transition-transform duration-300 ${
                                        openIndex === i ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>

                            {openIndex === i && (
                                <div className="px-5 pb-5 text-gray-700 leading-relaxed">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default AboutFAQ
