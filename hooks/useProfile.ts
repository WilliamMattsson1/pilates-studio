import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'react-toastify'

export const useProfile = (userId: string | undefined) => {
    const supabase = createClient()
    const [profile, setProfile] = useState<any>(null)
    const [bookings, setBookings] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (userId) fetchData()
    }, [userId])

    const fetchData = async () => {
        setLoading(true)

        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle()

        if (profileError) {
            console.error(profileError)
        }
        setProfile(profileData)

        // Fetch user's bookings including related class data
        const { data: bookingData, error: bookingError } = await supabase
            .from('bookings')
            .select('*, classes(*)')
            .eq('user_id', userId)

        if (bookingError) {
            console.error(bookingError)
        }

        // Sort bookings by class date ascending
        const sorted = (bookingData || []).sort((a, b) => {
            if (!a.classes || !b.classes) return 0
            return (
                new Date(a.classes.date).getTime() -
                new Date(b.classes.date).getTime()
            )
        })

        setBookings(sorted)
        setLoading(false)
    }

    // Cancel a booking and remove it from state
    const cancelBooking = async (id: string) => {
        const { error } = await supabase.from('bookings').delete().eq('id', id)
        if (error) {
            toast.error("Couldn't cancel booking.")
            return
        }
        setBookings((prev) => prev.filter((b) => b.id !== id))
        toast.success('Booking cancelled.')
    }

    return { profile, bookings, loading, cancelBooking }
}
