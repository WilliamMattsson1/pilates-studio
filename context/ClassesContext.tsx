'use client'

import { createContext, useState, useContext, useEffect, useMemo } from 'react'
import { ClassItem, WeekGroup } from '../types/classes'
import {
    sortClassesByDate,
    filterUpcomingClasses,
    filterPastClasses,
    groupAndSortByWeek
} from '@/utils/classes'
import { createClient } from '@/utils/supabase/client'

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
    const supabase = createClient()
    const [classes, setClasses] = useState<ClassItem[]>([])
    const [loading, setLoading] = useState(true)
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
            console.log('Error fetching classes', err.message)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        refreshClasses()

        const classesChannel = supabase
            .channel('public:classes')
            // INSERT
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'classes' },
                (payload) => {
                    setClasses((prev) => [...prev, payload.new as ClassItem])
                }
            )
            // UPDATE
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'classes' },
                (payload) => {
                    setClasses((prev) =>
                        prev.map((cls) =>
                            cls.id === payload.new.id
                                ? (payload.new as ClassItem)
                                : cls
                        )
                    )
                }
            )
            // DELETE
            .on(
                'postgres_changes',
                { event: 'DELETE', schema: 'public', table: 'classes' },
                (payload) => {
                    setClasses((prev) =>
                        prev.filter((cls) => cls.id !== payload.old.id)
                    )
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(classesChannel)
        }
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
        } catch (err: any) {
            console.log('Error adding class', err.message)
            setError(err.message)
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
        } catch (err: any) {
            console.log('Error updating class', err.message)

            setError(err.message)
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
        } catch (err: any) {
            console.log('Error deleting class', err.message)
            setError(err.message)
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
