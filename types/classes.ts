// types som har med classes att göra

interface ClassItem {
    id: number
    title: string
    date: string
    time: string
    maxSpots: number
    bookedSpots: number
}

interface WeekGroup {
    year: number
    week: number
    classes: ClassItem[]
}

export type { ClassItem, WeekGroup }
