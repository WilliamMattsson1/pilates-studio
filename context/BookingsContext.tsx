'use client'

import { createContext, useState, useContext, useEffect } from 'react'
import { BookingItem } from '@/types/bookings'
import { toast } from 'react-toastify'
import { createClient } from '@/utils/supabase/client'

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
    const supabase = createClient()
    const [bookings, setBookings] = useState<BookingItem[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        refreshBookings()

        const bookingsChannel = supabase
            .channel('public:bookings')
            // INSERT
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'bookings' },
                (payload) => {
                    setBookings((prev) => {
                        if (prev.find((b) => b.id === payload.new.id))
                            return prev
                        const newBooking: BookingItem = {
                            id: payload.new.id,
                            class_id: payload.new.class_id,
                            user_id: payload.new.user_id,
                            guest_name: payload.new.guest_name,
                            guest_email: payload.new.guest_email,
                            created_at: payload.new.created_at
                        }
                        return [...prev, newBooking]
                    })
                }
            )
            // DELETE
            .on(
                'postgres_changes',
                { event: 'DELETE', schema: 'public', table: 'bookings' },
                (payload) => {
                    setBookings((prev) =>
                        prev.filter((b) => b.id !== payload.old.id)
                    )
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(bookingsChannel)
        }
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

            toast.success('Booking added successfully!')
        } catch (err: any) {
            setError(err.message)
            toast.error(err.message || 'Failed to add booking.')
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

            toast.success('Booking deleted successfully!')
        } catch (err: any) {
            setError(err.message)
            toast.error(err.message || 'Failed to delete booking.')
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
