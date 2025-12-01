'use client'

import { createContext, useState, useContext, useEffect } from 'react'
import { BookingItem } from '@/types/bookings'
import { toast } from 'react-toastify'

interface BookingsContextType {
    bookings: BookingItem[]
    loading: boolean
    error: string | null
    addBooking: (
        booking: Omit<BookingItem, 'id' | 'created_at'>
    ) => Promise<void>
    deleteBooking: (id: string) => Promise<void>
    refreshBookings: () => Promise<void>
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
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        refreshBookings()
    }, [])

    const refreshBookings = async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch('/api/bookings')
            const data = await res.json()
            if (!res.ok)
                throw new Error(data.error || 'Failed to fetch bookings')
            setBookings(data.data)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const addBooking = async (
        booking: Omit<BookingItem, 'id' | 'created_at'>
    ) => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(booking)
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to add booking')
            setBookings((prev) => [...prev, data.data])
            toast.success('Booking added successfully!')
        } catch (err: any) {
            setError(err.message)
            toast.error(
                err.message || 'Failed to add booking. Please try again.'
            )
            throw err
        } finally {
            setLoading(false)
        }
    }

    const deleteBooking = async (id: string) => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' })
            const data = await res.json()
            if (!res.ok)
                throw new Error(data.error || 'Failed to delete booking')
            setBookings((prev) => prev.filter((b) => b.id !== id))
            toast.success('Booking deleted successfully!')
        } catch (err: any) {
            setError(err.message)
            toast.error('Failed to delete booking. Please try again.')
            throw err
        } finally {
            setLoading(false)
        }
    }

    return (
        <BookingsContext.Provider
            value={{
                bookings,
                loading,
                error,
                addBooking,
                deleteBooking,
                refreshBookings
            }}
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
