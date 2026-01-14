import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const supabase = await createClient()
        const {
            data: { user }
        } = await supabase.auth.getUser()

        if (!user?.id) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            )
        }

        // Hämta profil
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id, name, email')
            .eq('id', user.id)
            .maybeSingle()

        if (profileError) {
            console.error('Profile fetch error:', profileError)
            throw new Error('Database error')
        }

        // Hämta booking_details för användaren
        const { data: detailsData, error: detailsError } = await supabase
            .from('booking_details')
            .select('booking_id')
            .eq('user_id', user.id)

        if (detailsError) {
            console.error('Booking details error:', detailsError)
            throw new Error('Database error')
        }

        const bookingIds = detailsData?.map((d) => d.booking_id) || []

        // Hämta bookings
        const { data: bookingsData, error: bookingsError } = await supabase
            .from('bookings')
            .select('id, class_id, created_at')
            .in('id', bookingIds)

        if (bookingsError) {
            console.error('Bookings error:', bookingsError)
            throw new Error('Database error')
        }

        return NextResponse.json({
            profile,
            bookings: bookingsData
        })
    } catch (err: unknown) {
        console.error('Detailed fetch error:', err)

        const message = err instanceof Error ? err.message : ''
        const isDbError = message === 'Database error'

        return NextResponse.json(
            {
                error: isDbError
                    ? 'Failed to load your account data'
                    : 'Something went wrong'
            },
            { status: 500 }
        )
    }
}
