'use client'
import { ClassItem } from '@/types/ClassItem'
import TitleHeader from '../shared/TitleHeader'
import ClassCard from '../shared/ui/ClassCard'
import { useClasses } from '@/context/ClassesContext'
import {
    groupByWeek,
    sortClassesByDate,
    filterUpcomingClasses
} from '@/utils/classes'

const AvailableClasses = () => {
    const { classes } = useClasses()
    const sorted = sortClassesByDate(classes)
    const upcoming = filterUpcomingClasses(sorted)
    const classesByWeek = groupByWeek(upcoming)

    return (
        <section
            id="available-classes"
            className="w-full bg-primary-bg mt-12 px-6 md:px-20"
        >
            <TitleHeader
                title="Available Classes"
                subtitle="Find your session"
                alignment="center"
            />

            <div className="flex flex-col gap-8 mt-8">
                {Object.entries(classesByWeek).map(
                    ([weekNumber, weekClasses]) => (
                        <div key={weekNumber}>
                            <h3 className="text-2xl md:text-3xl font-bold mb-2">
                                Week {weekNumber}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 justify-items-center">
                                {weekClasses.map((cls: ClassItem) => (
                                    <ClassCard key={cls.id} cls={cls} />
                                ))}
                            </div>
                        </div>
                    )
                )}
            </div>
        </section>
    )
}

export default AvailableClasses
