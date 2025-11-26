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

// Returnerar ISO-vecknummer (vecka börjar måndag) för ett datum
const getWeekNumber = (dateStr: string): number => {
    const date = new Date(dateStr)
    const target = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    )
    // ISO dagnummer, måndag = 1, söndag = 7
    const dayNr = target.getUTCDay() === 0 ? 7 : target.getUTCDay()
    target.setUTCDate(target.getUTCDate() + 4 - dayNr)
    const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1))
    const weekNo = Math.ceil(
        ((target.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
    )
    return weekNo
}

// Grupperar klasser efter ISO-vecka och ISO-år
const groupAndSortByWeek = (classes: ClassItem[]): WeekGroup[] => {
    const map = new Map<string, WeekGroup>()

    classes.forEach((cls) => {
        const date = new Date(cls.date)
        const target = new Date(
            Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
        )
        const dayNr = target.getUTCDay() === 0 ? 7 : target.getUTCDay()
        target.setUTCDate(target.getUTCDate() + 4 - dayNr)
        const isoYear = target.getUTCFullYear()
        const week = getWeekNumber(cls.date)
        const key = `${isoYear}-W${week}`

        if (!map.has(key)) {
            map.set(key, { year: isoYear, week, classes: [] })
        }
        map.get(key)!.classes.push(cls)
    })

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
