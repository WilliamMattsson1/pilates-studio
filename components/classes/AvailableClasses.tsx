import TitleHeader from '../shared/TitleHeader'
import ClassCard, { ClassItem } from '../shared/ui/ClassCard'

interface WeekClasses {
    weekNumber: number
    classes: ClassItem[]
}

// Ny mockdata med 3 veckor
const AvailableClassesData: WeekClasses[] = [
    {
        weekNumber: 48,
        classes: [
            {
                id: 1,
                title: 'Matta Pilates',
                date: 'Mån 25 Nov',
                time: '14:00 – 15:00',
                maxSpots: 8,
                bookedSpots: 6
            },
            {
                id: 2,
                title: 'Core Flow',
                date: 'Tis 26 Nov',
                time: '16:00 – 17:00',
                maxSpots: 8,
                bookedSpots: 3
            },
            {
                id: 3,
                title: 'Pilates Basics',
                date: 'Ons 27 Nov',
                time: '10:00 – 11:00',
                maxSpots: 10,
                bookedSpots: 8
            },
            {
                id: 4,
                title: 'Stretch & Strength',
                date: 'Tor 28 Nov',
                time: '12:00 – 13:00',
                maxSpots: 8,
                bookedSpots: 5
            }
        ]
    },
    {
        weekNumber: 49,
        classes: [
            {
                id: 5,
                title: 'Matta Pilates',
                date: 'Mån 2 Dec',
                time: '14:00 – 15:00',
                maxSpots: 8,
                bookedSpots: 2
            },
            {
                id: 6,
                title: 'Core Flow',
                date: 'Tis 3 Dec',
                time: '16:00 – 17:00',
                maxSpots: 8,
                bookedSpots: 5
            },
            {
                id: 7,
                title: 'Pilates Basics',
                date: 'Ons 4 Dec',
                time: '10:00 – 11:00',
                maxSpots: 10,
                bookedSpots: 9
            }
        ]
    },
    {
        weekNumber: 50,
        classes: [
            {
                id: 8,
                title: 'Stretch & Strength',
                date: 'Mån 9 Dec',
                time: '12:00 – 13:00',
                maxSpots: 8,
                bookedSpots: 8
            },
            {
                id: 9,
                title: 'Core Flow',
                date: 'Tis 10 Dec',
                time: '16:00 – 17:00',
                maxSpots: 8,
                bookedSpots: 4
            }
        ]
    }
]

const AvailableClasses = () => {
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
                {AvailableClassesData.map((week) => (
                    <div key={week.weekNumber}>
                        <h3 className="text-2xl md:text-3xl font-bold mb-2">
                            Week {week.weekNumber}
                        </h3>

                        {/* Class card grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 justify-items-center">
                            {week.classes.map((cls: ClassItem) => (
                                <ClassCard key={cls.id} cls={cls} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default AvailableClasses
