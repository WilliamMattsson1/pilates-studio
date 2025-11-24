import { ClassItem } from '@/types/ClassItem'

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
    return classes.reduce((acc, cls) => {
        const week = getWeekNumber(cls.date)
        if (!acc[week]) acc[week] = []
        acc[week].push(cls)
        return acc
    }, {} as Record<number, ClassItem[]>)
}

export { getWeekNumber, groupByWeek }
