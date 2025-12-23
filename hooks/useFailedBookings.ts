import { useEffect, useState } from 'react'

export const useFailedBookings = () => {
    const [failedBookings, setFailedBookings] = useState<[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/bookings/log-failed-booking')
            .then((res) => res.json())
            .then((data) => {
                if (data?.data) setFailedBookings(data.data)
            })
            .finally(() => setLoading(false))
    }, [])

    return { failedBookings, loading }
}
