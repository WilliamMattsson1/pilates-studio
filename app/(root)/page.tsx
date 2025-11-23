import PilatesBenefits from '@/components/home/Benefits'
import Hero from '@/components/home/Hero'
import InstructorIntro from '@/components/home/InstructorIntro'
import UpcomingClassesPreview from '@/components/home/UpcomingClassesPreview'

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
