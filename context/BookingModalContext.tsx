'use client'
import { createContext, useContext, useState } from 'react'
import { ClassItem } from '@/types/classes'

interface BookingModalContextType {
    isOpen: boolean
    selectedClass: ClassItem | null
    openModal: (cls: ClassItem) => void
    closeModal: () => void
}

const BookingModalContext = createContext<BookingModalContextType | undefined>(
    undefined
)

export const BookingModalProvider = ({
    children
}: {
    children: React.ReactNode
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null)

    const openModal = (cls: ClassItem) => {
        setSelectedClass(cls)
        setIsOpen(true)
    }

    const closeModal = () => {
        setSelectedClass(null)
        setIsOpen(false)
    }

    return (
        <BookingModalContext.Provider
            value={{ isOpen, selectedClass, openModal, closeModal }}
        >
            {children}
        </BookingModalContext.Provider>
    )
}

export const useBookingModal = () => {
    const ctx = useContext(BookingModalContext)
    if (!ctx)
        throw new Error(
            'useBookingModal must be used inside BookingModalProvider'
        )
    return ctx
}
