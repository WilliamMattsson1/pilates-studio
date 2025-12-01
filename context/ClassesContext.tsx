'use client'

import { createContext, useState, useContext, useEffect, useMemo } from 'react'
import { ClassItem, WeekGroup } from '../types/classes'
import {
    sortClassesByDate,
    filterUpcomingClasses,
    filterPastClasses,
    groupAndSortByWeek
} from '@/utils/classes'

interface ClassesContextType {
    classes: ClassItem[]
    loading: boolean
    error: string | null
    addClass: (cls: Omit<ClassItem, 'id' | 'created_at'>) => Promise<void>
    deleteClass: (id: string) => Promise<void>
    updateClass: (updatedClass: ClassItem) => Promise<void>
    refreshClasses: () => Promise<void>
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
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const refreshClasses = async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch('/api/classes')
            const data = await res.json()
            if (!res.ok)
                throw new Error(data.error || 'Failed to fetch classes')
            setClasses(data.data)
        } catch (err: any) {
            setError(err.message)
            throw err
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        refreshClasses()
    }, [])

    const addClass = async (cls: Omit<ClassItem, 'id' | 'created_at'>) => {
        setLoading(true)
        setError(null)

        try {
            const res = await fetch('/api/classes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cls)
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to add class')
            setClasses((prev) => [...prev, data.data])
        } catch (err: any) {
            setError(err.message)
            throw new Error(err.message)
        } finally {
            setLoading(false)
        }
    }

    const updateClass = async (updatedClass: ClassItem) => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch(`/api/classes/${updatedClass.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedClass)
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to update class')
            setClasses((prev) =>
                prev.map((cls) =>
                    cls.id === updatedClass.id ? data.data : cls
                )
            )
        } catch (err: any) {
            setError(err.message)
            throw new Error(err.message)
        } finally {
            setLoading(false)
        }
    }

    const deleteClass = async (id: string) => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch(`/api/classes/${id}`, {
                method: 'DELETE'
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to delete class')
            setClasses((prev) => prev.filter((cls) => cls.id !== id))
        } catch (err: any) {
            setError(err.message)
            throw new Error(err.message)
        } finally {
            setLoading(false)
        }
    }

    const upcomingClasses = useMemo(() => {
        const sorted = sortClassesByDate(classes)
        return filterUpcomingClasses(sorted)
    }, [classes])

    const pastClasses = useMemo(() => {
        const sorted = sortClassesByDate(classes)
        return filterPastClasses(sorted)
    }, [classes])

    const classesByWeek = useMemo(
        () => groupAndSortByWeek(upcomingClasses),
        [upcomingClasses]
    )

    return (
        <ClassesContext.Provider
            value={{
                classes,
                loading,
                error,
                addClass,
                updateClass,
                deleteClass,
                refreshClasses,
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
