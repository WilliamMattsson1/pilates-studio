import AboutBio from '@/components/about/AboutBio'
import AboutContact from '@/components/about/AboutContact'
import AboutFAQ from '@/components/about/AboutFAQ'
import AboutHero from '@/components/about/AboutHero'
import SectionDivider from '@/components/shared/ui/SectionDivider'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'About Pilates Studio | Uppsala',
    description:
        'Learn more about our Pilates Studio, our philosophy, and the team dedicated to helping you stay healthy and fit.'
}

const page = () => {
    return (
        <>
            <AboutHero />
            <AboutBio />

            <AboutFAQ />
            <SectionDivider className="w-[90%] max-w-3xl h-1 bg-icon mt-8" />
            <AboutContact />
        </>
    )
}

export default page
