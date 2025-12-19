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
            } catch (err) {
                console.error(err)
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

                if (data.error) throw new Error(data.error)

                setProfile(data.profile)
                setUserBookings(
                    data.bookings.map((b: Booking) => ({
                        ...b,
                        classes:
                            classes.find((c) => c.id === b.class_id) || null
                    }))
                )
            } catch (err: unknown) {
                const message =
                    err instanceof Error ? err.message : 'Unknown error'
                console.error('Failed to fetch profile bookings:', message)
                toast.error(message)
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
