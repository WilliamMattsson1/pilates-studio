'use client'

import { createContext, useState, useContext, useEffect, useMemo } from 'react'
import { ClassItem, WeekGroup } from '../types/classes'
import { mockClasses } from '@/mock/classes'
import {
    sortClassesByDate,
    filterUpcomingClasses,
    filterPastClasses,
    groupAndSortByWeek
} from '@/utils/classes'

interface ClassesContextType {
    classes: ClassItem[]
    addClass: (cls: ClassItem) => void
    upcomingClasses: ClassItem[]
    pastClasses: ClassItem[]
    classesByWeek: WeekGroup[]
}

const ClassesContext = createContext<ClassesContextType | undefined>(undefined)

export const ClassesProvider = ({
    children
}: {
    children: React.ReactNode
}) => {
    const [classes, setClasses] = useState<ClassItem[]>([])

    // Load existing classes from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('classes')
        if (stored) {
            setClasses(JSON.parse(stored))
        } else {
            setClasses(mockClasses) // first time use mock data
            localStorage.setItem('classes', JSON.stringify(mockClasses))
        }
    }, [])

    const addClass = (cls: ClassItem) => {
        if (
            !cls.title ||
            !cls.date ||
            !cls.startTime ||
            !cls.endTime ||
            !cls.maxSpots
        ) {
            throw new Error('All fields must be filled')
        }

        setClasses((prev) => {
            const updated = [...prev, cls]
            localStorage.setItem('classes', JSON.stringify(updated))
            return updated
        })
    }

    // Different data: sort, filter, group
    const upcomingClasses = useMemo(() => {
        const sorted = sortClassesByDate(classes)
        return filterUpcomingClasses(sorted)
    }, [classes])

    const pastClasses = useMemo(() => {
        const sorted = sortClassesByDate(classes)
        return filterPastClasses(sorted)
    }, [classes])

    const classesByWeek = useMemo(() => {
        return groupAndSortByWeek(upcomingClasses)
    }, [upcomingClasses])

    return (
        <ClassesContext.Provider
            value={{
                classes,
                addClass,
                upcomingClasses,
                pastClasses,
                classesByWeek
            }}
        >
            {children}
        </ClassesContext.Provider>
    )
}

export const useClasses = () => {
    const context = useContext(ClassesContext)
    if (!context)
        throw new Error('useClasses must be used within ClassesProvider')
    return context
}
