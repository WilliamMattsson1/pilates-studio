'use client'

import { createContext, useState, useContext, useEffect } from 'react'
import { BookingItem } from '../types/bookings'
import { mockBookings } from '@/mock/bookings'

interface BookingsContextType {
    bookings: BookingItem[]
    addBooking: (booking: BookingItem) => void
    deleteBooking: (id: string) => void
}

const BookingsContext = createContext<BookingsContextType | undefined>(
    undefined
)

export const BookingsProvider = ({
    children
}: {
    children: React.ReactNode
}) => {
    const [bookings, setBookings] = useState<BookingItem[]>([])

    useEffect(() => {
        const storedBookings = localStorage.getItem('bookings')
        if (storedBookings) {
            setBookings(JSON.parse(storedBookings))
        } else {
            setBookings(mockBookings) // first time use mock data
            localStorage.setItem('bookings', JSON.stringify(mockBookings))
        }
    }, [])

    // Lägg till bokning
    const addBooking = (booking: BookingItem) => {
        setBookings((prev) => {
            const updated = [...prev, booking]
            localStorage.setItem('bookings', JSON.stringify(updated))
            return updated
        })
    }

    // Ta bort bokning
    const deleteBooking = (id: string) => {
        setBookings((prev) => {
            const updated = prev.filter((b) => b.id !== id)
            localStorage.setItem('bookings', JSON.stringify(updated))
            return updated
        })
    }

    return (
        <BookingsContext.Provider
            value={{ bookings, addBooking, deleteBooking }}
        >
            {children}
        </BookingsContext.Provider>
    )
}

export const useBookings = () => {
    const context = useContext(BookingsContext)
    if (!context)
        throw new Error('useBookings must be used within BookingsProvider')
    return context
}
