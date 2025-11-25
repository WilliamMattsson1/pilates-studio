import AvailableClasses from '@/components/classes/AvailableClasses'
import ClassesHero from '@/components/classes/ClassesHero'
import ClassesOverviewSection from '@/components/classes/ClassesOverview'
import SectionDivider from '@/components/shared/ui/SectionDivider'

const Classes = () => {
    return (
        <>
            <ClassesHero />
            <AvailableClasses />
            <ClassesOverviewSection />
            <SectionDivider className="h-1 bg-btn mt-18 w-[60%]" />
        </>
    )
}

export default Classes
