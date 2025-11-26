// types som har med classes att göra

interface ClassItem {
    id: number
    title: string
    date: string // eller Date-objekt
    startTime: string // lagrar t.ex. "14:00"
    endTime: string // lagrar t.ex. "15:00"
    maxSpots: number
}

interface WeekGroup {
    year: number
    week: number
    classes: ClassItem[]
}

export type { ClassItem, WeekGroup }
