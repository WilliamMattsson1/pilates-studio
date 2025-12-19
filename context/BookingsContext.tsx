'use client'

import { createContext, useState, useContext, useEffect } from 'react'
import { Booking, NewBookingDetail } from '@/types/bookings'
import { toast } from 'react-toastify'
import { createClient } from '@/utils/supabase/client'

interface BookingsContextType {
    bookings: Booking[]
    loading: boolean
    error: string | null
    addBooking: (booking: NewBookingDetail) => Promise<void>
    deleteBooking: (id: string) => Promise<void>
    refreshBookings: () => Promise<void>
    markBookingAsPaid: (id: string) => Promise<void>
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
    const [bookings, setBookings] = useState<Booking[]>([])
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
                        const newBooking: Booking = {
                            id: payload.new.id,
                            class_id: payload.new.class_id,
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
    }, [supabase])

    const refreshBookings = async () => {
        setLoading(true)
        setError(null)

        try {
            const res = await fetch('/api/bookings')
            const data = await res.json()

            if (!res.ok)
                throw new Error(data.error || 'Failed to fetch bookings')

            setBookings(data.data)
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.log('Failed to fetch booking', err.message)
                setError(err.message)
            } else {
                console.log('Failed to fetch booking', err)
                setError('Unknown error occurred')
            }
        } finally {
            setLoading(false)
        }
    }

    const addBooking = async (booking: NewBookingDetail) => {
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
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.log('Error adding booking', err.message)
                setError(err.message)
                toast.error(err.message || 'Failed to add booking.')
                throw err
            } else {
                console.log('Error adding booking', err)
                setError('Unknown error occurred')
                toast.error('Unknown error occurred')
                throw new Error('Unknown error occurred')
            }
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
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.log('Error deleting booking', err.message)
                setError(err.message)
                toast.error(err.message || 'Failed to delete booking.')
                throw err
            } else {
                console.log('Error deleting booking', err)
                setError('Unknown error occurred')
                toast.error('Unknown error occurred')
                throw new Error('Unknown error occurred')
            }
        } finally {
            setLoading(false)
        }
    }

    const markBookingAsPaid = async (id: string) => {
        try {
            const res = await fetch(`/api/bookings/${id}/mark-paid`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            })
            if (!res.ok) throw new Error('Failed to mark as paid')

            await refreshBookings()
        } catch (err) {
            console.error(err)
            throw err
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
                refreshBookings,
                markBookingAsPaid
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
