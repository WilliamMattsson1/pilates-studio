import { useState, useEffect } from 'react'
import { useClasses } from '@/context/ClassesContext'
import { toast } from 'react-toastify'

export const useProfile = (userId: string | undefined) => {
    const { classes } = useClasses()
    const [profile, setProfile] = useState<{
        id: string
        name: string
        email: string
    } | null>(null)
    const [userBookings, setUserBookings] = useState<any[]>([])
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
                    data.bookings.map((b: any) => ({
                        ...b,
                        classes:
                            classes.find((c) => c.id === b.class_id) || null
                    }))
                )
            } catch (err: any) {
                console.error('Failed to fetch profile bookings:', err)
                toast.error(err.message || 'Failed to fetch user data')
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
