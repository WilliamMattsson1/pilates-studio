'use client'
import { useState, useEffect } from 'react'
import { BookingItem } from '@/types/bookings'
import { toast } from 'react-toastify'
import { createClient } from '@/utils/supabase/client'

export const useAdminBookings = () => {
    const [bookings, setBookings] = useState<BookingItem[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const supabase = createClient()

    const fetchBookings = async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch('/api/admin/bookings')
            const data = await res.json()
            if (!res.ok)
                throw new Error(data.error || 'Failed to fetch bookings')
            setBookings(data.data)
        } catch (err: any) {
            console.error(err)
            setError(err.message)
            toast.error(err.message || 'Failed to fetch bookings')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBookings()

        const channel = supabase.channel('public:booking_details')

        channel.on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'booking_details' },
            () => fetchBookings()
        )
        channel.subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    return { bookings, loading, error, fetchBookings }
}
