'use client'

import { createContext, useState, useContext, useEffect } from 'react'
import { ClassItem } from '../types/classes'
import { mockClasses } from '@/mock/classes'

interface ClassesContextType {
    classes: ClassItem[]
    addClass: (cls: ClassItem) => void
    //     bookSpot: (id: number) => void
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
        setClasses((prev) => {
            const updated = [...prev, cls]
            localStorage.setItem('classes', JSON.stringify(updated))
            return updated
        })
    }

    // const bookSpot = (id: number) => {
    //     setClasses((prev) => {
    //         const updated = prev.map((c) =>
    //             c.id === id ? { ...c, bookedSpots: c.bookedSpots + 1 } : c
    //         )
    //         localStorage.setItem('classes', JSON.stringify(updated))
    //         return updated
    //     })
    // }

    return (
        <ClassesContext.Provider value={{ classes, addClass }}>
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
