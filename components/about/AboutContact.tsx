'use client'

import Link from 'next/link'
import TitleHeader from '../shared/TitleHeader'
import { ArrowRight, Mail, Phone, MapPin } from 'lucide-react'
import SectionDivider from '../shared/ui/SectionDivider'

const socials = [
    {
        name: 'Instagram',
        url: 'https://instagram.com',
        icon: '/icons/instagram.svg'
    },
    {
        name: 'TikTok',
        url: 'https://tiktok.com',
        icon: '/icons/tiktok.svg'
    },
    {
        name: 'Email',
        url: 'mailto:info@pilatesstudio.com',
        icon: '/icons/gmail.svg'
    }
]

const AboutContact = () => {
    return (
        <section className="px-6 md:px-20 py-12 pb-2 bg-white flex flex-col mb-16">
            <TitleHeader
                title="Get in Touch"
                subtitle="discuss classes or sessions"
                alignment="left"
            />

            <div className="flex flex-col lg:flex-row gap-10">
                <div className="flex-1 flex flex-col gap-4 bg-secondary-bg p-5 rounded-lg shadow-lg min-h-[400px] lg:h-auto">
                    <h3 className="text-xl font-semibold text-gray-900">
                        Contact Details
                    </h3>
                    <p className="text-gray-700 text-sm">
                        Feel free to reach out to discuss our Pilates classes,
                        private sessions, or any questions you might have about
                        your wellness journey. We’re here to guide and support
                        you every step of the way.
                    </p>

                    <SectionDivider className="w-full h-1 bg-btn/60 my-1" />

                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 font-medium text-gray-900 hover:text-btn transition">
                            <Mail className="w-6 h-6" />
                            <Link href="mailto:info@pilatesstudio.com">
                                info@pilatesstudio.com
                            </Link>
                        </div>
                        <div className="flex items-center gap-2 font-medium text-gray-900 hover:text-btn transition">
                            <Phone className="w-6 h-6" />
                            <Link href="tel:+46771234567">
                                +46 77 123 45 67
                            </Link>
                        </div>
                        <div className="flex items-center gap-2 font-medium text-gray-900">
                            <MapPin className="w-6 h-6" />
                            <span>Uppsala, Sweden</span>
                        </div>
                    </div>

                    <h4 className="mt-1 text-md font-bold text-gray-900">
                        Follow Us
                    </h4>
                    <div className="flex items-center gap-3">
                        {socials.map((s, i) => (
                            <a
                                key={i}
                                href={s.url}
                                target="_blank"
                                rel="noreferrer"
                                className="hover:-translate-y-0.5 transition-all duration-300"
                            >
                                <img
                                    src={s.icon}
                                    alt={s.name}
                                    width={28}
                                    height={28}
                                />
                            </a>
                        ))}
                    </div>

                    <Link
                        href="/classes/#available-classes"
                        className="mt-2 w-fit bg-btn text-white font-medium px-5 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition"
                    >
                        See Available Classes
                        <ArrowRight size={22} />
                    </Link>
                </div>

                {/* Google Map */}
                <div className="flex-1 min-h-[400px] lg:h-auto rounded-lg overflow-hidden shadow-lg relative">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2003.4325953019447!2d17.636377478103572!3d59.85856282487493!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465fcbf7464c29e5%3A0x88bf0461ad081078!2sStora%20Torget%2C%20Centrum%2C%20Uppsala!5e0!3m2!1ssv!2sse!4v1764087706102!5m2!1ssv!2sse"
                        className="absolute top-0 left-0 w-full h-full border-0"
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>
            </div>
        </section>
    )
}

export default AboutContact
