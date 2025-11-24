'use client'
import { createContext, useState, useContext } from 'react'
import { ClassItem } from '../types/ClassItem'
import { mockClasses } from '@/mock/classes'

interface ClassesContextType {
    classes: ClassItem[]
    // addClass: (cls: ClassItem) => void
    // bookSpot: (id: number) => void
}

const ClassesContext = createContext<ClassesContextType | undefined>(undefined)

export const ClassesProvider = ({
    children
}: {
    children: React.ReactNode
}) => {
    const [classes, setClasses] = useState<ClassItem[]>(mockClasses)

    // const addClass = (cls: ClassItem) => setClasses((prev) => [...prev, cls])

    // const bookSpot = (id: number) =>
    //     setClasses((prev) =>
    //         prev.map((c) =>
    //             c.id === id ? { ...c, bookedSpots: c.bookedSpots + 1 } : c
    //         )
    //     )

    return (
        <ClassesContext.Provider value={{ classes }}>
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
