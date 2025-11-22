import PilatesBenefits from '@/components/Benefits'
import Hero from '@/components/Hero'
import InstructorIntro from '@/components/InstructorIntro'
import UpcomingClassesPreview from '@/components/UpcomingClassesPreview'

const Home = () => {
    return (
        <>
            <Hero />
            <InstructorIntro />
            <PilatesBenefits />
            <UpcomingClassesPreview />
        </>
    )
}

export default Home
