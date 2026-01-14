import { useState, useEffect } from 'react'
import { useClasses } from '@/context/ClassesContext'
import { toast } from 'react-toastify'
import { Booking, UserBooking } from '@/types/bookings'

export const useProfile = (userId: string | undefined) => {
    const { classes } = useClasses()
    const [profile, setProfile] = useState<{
        id: string
        name: string
        email: string
    } | null>(null)
    const [userBookings, setUserBookings] = useState<UserBooking[]>([])
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const res = await fetch('/api/profiles/is-admin')
                const data = await res.json()
                setIsAdmin(data.admin) // lokal state i hooken
            } catch (err: unknown) {
                console.error('[useProfile] fetchAdmin:', err)
                setIsAdmin(false)
            }
        }

        fetchAdmin()
    }, [])

    useEffect(() => {
        if (!userId) return

        const fetchProfileAndBookings = async () => {
            setLoading(true)

            try {
                const res = await fetch('/api/bookings/user-bookings')
                const data = await res.json()

                if (!res.ok) throw new Error(data.error || 'Failed to fetch')

                setProfile(data.profile)
                setUserBookings(
                    data.bookings.map((b: Booking) => ({
                        ...b,
                        classes:
                            classes.find((c) => c.id === b.class_id) || null
                    }))
                )
            } catch (err: unknown) {
                console.error('[useProfile] fetchProfileAndBookings:', err)

                const displayError = 'Could not load profile or bookings.'
                toast.error(displayError)
            } finally {
                setLoading(false)
            }
        }

        fetchProfileAndBookings()
    }, [userId, classes])

    return {
        profile,
        bookings: userBookings,
        loading,
        isAdmin
    }
}
