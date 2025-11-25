import { ClassItem } from '@/types/ClassItem'

// Sorterar klasser kronologiskt
const sortClassesByDate = (classes: ClassItem[]): ClassItem[] => {
    return [...classes].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )
}

// Filtrerar för att bara visa framtida (från idag och framåt)
const filterUpcomingClasses = (classes: ClassItem[]): ClassItem[] => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return classes.filter((cls) => {
        const date = new Date(cls.date)
        date.setHours(0, 0, 0, 0) // Nollställ klassens tid också
        return date >= today
    })
}

// Returnerar vecka nummer
const getWeekNumber = (dateStr: string): number => {
    const date = new Date(dateStr)
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
    const pastDaysOfYear =
        (date.getTime() - firstDayOfYear.getTime()) / 86400000
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}

// Grupperar klasser efter vecka
const groupByWeek = (classes: ClassItem[]): Record<number, ClassItem[]> => {
    const sorted = sortClassesByDate(classes)

    return sorted.reduce((acc, cls) => {
        const week = getWeekNumber(cls.date)
        if (!acc[week]) acc[week] = []
        acc[week].push(cls)
        return acc
    }, {} as Record<number, ClassItem[]>)
}

export { sortClassesByDate, filterUpcomingClasses, getWeekNumber, groupByWeek }
