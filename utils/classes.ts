import { ClassItem, WeekGroup } from '@/types/classes'

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
const groupAndSortByWeek = (classes: ClassItem[]): WeekGroup[] => {
    const map = new Map<string, WeekGroup>()

    classes.forEach((cls) => {
        const date = new Date(cls.date)
        const year = date.getFullYear()
        const week = getWeekNumber(cls.date)
        const key = `${year}-W${week}`

        // Skapa en ny WeekGroup om den inte finns
        if (!map.has(key)) {
            map.set(key, { year, week, classes: [] })
        }
        // Lägg till klassen i rätt WeekGroup
        map.get(key)!.classes.push(cls)
    })

    // Konvertera till array och sortera på year först, sedan week
    return Array.from(map.values()).sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year
        return a.week - b.week
    })
}

export {
    sortClassesByDate,
    filterUpcomingClasses,
    getWeekNumber,
    groupAndSortByWeek
}
