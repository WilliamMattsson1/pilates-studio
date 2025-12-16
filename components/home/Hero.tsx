'use client'
import Link from 'next/link'

const Hero = () => {
    return (
        <section
            className="w-full min-h-[91vh] md:min-h-[90vh] flex items-center justify-center text-white
            bg-[url('/images/hero-mobile.png')] sm:bg-[url('/images/hero.png')]
            bg-cover bg-center"
        >
            <div className="text-center px-6 max-w-3xl">
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
