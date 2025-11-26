'use client'

import { createContext, useState, useContext, useEffect } from 'react'
import { BookingItem } from '../types/bookings'
import { mockBookings } from '@/mock/bookings'

interface BookingsContextType {
    bookings: BookingItem[]
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

    return (
        <BookingsContext.Provider value={{ bookings }}>
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
