import type { Metadata } from 'next'
import AvailableClasses from '@/components/classes/AvailableClasses'
import ClassesHero from '@/components/classes/ClassesHero'
import ClassesOverviewSection from '@/components/classes/ClassesOverview'
import SectionDivider from '@/components/shared/ui/SectionDivider'

export const metadata: Metadata = {
    title: 'Pilates Classes | Uppsala',
    description:
        'Check out our available Pilates classes in Uppsala and book your spot online. Suitable for all levels.'
}

const Classes = () => {
    return (
        <>
            <ClassesHero />
            <AvailableClasses />
            <ClassesOverviewSection />
            <SectionDivider className="h-1 bg-btn/60 my-18 w-[60%]" />
        </>
    )
}

export default Classes
