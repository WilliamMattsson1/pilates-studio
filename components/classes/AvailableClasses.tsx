'use client'
import { ClassItem } from '@/types/classes'
import TitleHeader from '../shared/TitleHeader'
import ClassCard from '../shared/ui/ClassCard'
import { useClasses } from '@/context/ClassesContext'
import {
    sortClassesByDate,
    filterUpcomingClasses,
    groupAndSortByWeek
} from '@/utils/classes'
import NoUpcomingClasses from '../shared/NoUpcomingClasses'

const AvailableClasses = () => {
    const { classes } = useClasses()
    const sorted = sortClassesByDate(classes)
    const upcoming = filterUpcomingClasses(sorted)
    const classesByWeek = groupAndSortByWeek(upcoming)

    const currentYear = new Date().getFullYear()
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

            {upcoming.length === 0 ? (
                <NoUpcomingClasses />
            ) : (
                <div className="flex flex-col gap-8 mt-8">
                    {classesByWeek.map((weekGroup) => (
                        <div key={`${weekGroup.year}-W${weekGroup.week}`}>
                            <h3 className="text-2xl md:text-3xl font-bold mb-2">
                                Week {weekGroup.week}{' '}
                                {weekGroup.year > currentYear ? (
                                    <span className="text-gray-400 font-medium">
                                        ({weekGroup.year})
                                    </span>
                                ) : (
                                    ''
                                )}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 justify-items-center">
                                {weekGroup.classes.map((cls: ClassItem) => (
                                    <ClassCard key={cls.id} cls={cls} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}

export default AvailableClasses
