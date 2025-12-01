import { useState, useEffect } from 'react'
import { useBookings } from '@/context/BookingsContext'
import { useClasses } from '@/context/ClassesContext'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'react-toastify'

export const useProfile = (userId: string | undefined) => {
    const supabase = createClient()
    const [profile, setProfile] = useState<any>(null)
    const [loadingProfile, setLoadingProfile] = useState(true)

    const { bookings, deleteBooking } = useBookings()
    const { classes } = useClasses()

    // Filtrera bokningar för aktuell användare
    const userBookings = bookings
        .filter((b) => b.user_id === userId)
        .map((b) => ({
            ...b,
            classes: classes.find((c) => c.id === b.class_id) || null
        }))
        .sort((a, b) => {
            if (!a.classes || !b.classes) return 0
            return (
                new Date(a.classes.date).getTime() -
                new Date(b.classes.date).getTime()
            )
        })

    useEffect(() => {
        if (!userId) return

        const fetchProfile = async () => {
            setLoadingProfile(true)
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .maybeSingle()

            if (error) console.error(error)
            setProfile(data)
            setLoadingProfile(false)
        }

        fetchProfile()
    }, [userId])

    const cancelBooking = async (id: string) => {
        try {
            await deleteBooking(id) // context hanterar realtime uppdatering
        } catch (err: any) {
            toast.error(err.message || 'Failed to cancel booking')
        }
    }

    return {
        profile,
        bookings: userBookings,
        loading: loadingProfile,
        cancelBooking
    }
}
