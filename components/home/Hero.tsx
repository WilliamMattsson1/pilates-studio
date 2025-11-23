'use client'
import Link from 'next/link'

const Hero = () => {
    return (
        <section
            className=" w-full min-h-[91vh] md:min-h-[90vh] flex items-center justify-center text-white "
            style={{
                backgroundImage: `url('/images/hero.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            {/* Overlay (very subtle, optional) */}
            {/* <div className="absolute inset-0 bg-black/10" /> */}

            {/* Content */}
            <div className="text-center px-6 max-w-3xl">
                <h1 className="text-4xl md:text-5xl font-bold mb-2 leading-tight">
                    Strengthen Your Body.
                    <br /> Move With Confidence.
                </h1>

                <p className="text-base md:text-lg font-mono font-medium mb-6 max-w-xl mx-auto">
                    Pilates classes designed to build strength, stability and
                    balance tailored for all experience levels.
                </p>

                <Link
                    href="/book"
                    className="bg-btn px-8 py-3 rounded-full text-base md:text-lg transition-opacity hover:opacity-90"
                >
                    Book a Class
                </Link>
            </div>
        </section>
    )
}

export default Hero
