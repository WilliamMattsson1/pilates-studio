import AboutBio from '@/components/about/AboutBio'
import AboutContact from '@/components/about/AboutContact'
import AboutHero from '@/components/about/AboutHero'
import SectionDivider from '@/components/shared/ui/SectionDivider'

const page = () => {
    return (
        <>
            <AboutHero />
            <AboutBio />
            <SectionDivider className="w-[60%] h-1 bg-btn/60 mt-18" />
            <AboutContact />
        </>
    )
}

export default page
