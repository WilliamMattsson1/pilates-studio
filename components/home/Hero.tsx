'use client'
import Link from 'next/link'
import Image from 'next/image'

const Hero = () => {
    return (
        <section className="relative w-full min-h-[91vh] md:min-h-[90vh] flex items-center justify-center text-white overflow-hidden">
            <Image
                src="/images/hero.png"
                alt="Professional Pilates training background"
                fill
                priority
                fetchPriority="high"
                className="object-cover object-center z-0"
                sizes="100vw"
            />

            {/* <div className="absolute inset-0 bg-black/30 z-10" /> */}

            <div className="relative z-20 text-center px-6 max-w-3xl">
                <h1 className="text-3xl md:text-6xl font-bold mb-4 md:mb-2 fancy-font tracking-wide leading-tight">
                    Strengthen Your Body.
                    <br /> Move With Confidence.
                </h1>

                <p className="text-md md:text-md font-mono font-medium mb-8 md:mb-6 max-w-md mx-auto uppercase leading-tight italic">
                    Pilates classes designed to build strength, stability and
                    balance tailored for all experience levels.
                </p>

                <Link
                    href="/classes/#available-classes"
                    className="bg-btn px-8 py-3 rounded-full text-base md:text-lg transition-opacity hover:bg-btn-hover"
                >
                    Book a Class
                </Link>
            </div>
        </section>
    )
}

export default Hero
