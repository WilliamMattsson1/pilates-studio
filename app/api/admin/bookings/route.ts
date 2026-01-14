import { NextResponse } from 'next/server'
import { BookingWithDetails } from '@/types/bookings'
import { requireAdmin } from '@/utils/server/auth'
import { supabaseAdmin } from '@/utils/supabase/admin'

export async function GET() {
    try {
        await requireAdmin()

        // Hämta alla bookings
        const { data: bookings, error: bookingsError } = await supabaseAdmin
            .from('bookings')
            .select('*')
            .order('created_at', { ascending: false })

        if (bookingsError) throw bookingsError

        // Hämta booking_details
        const bookingIds = bookings.map((b) => b.id)
        const { data: details, error: detailsError } = await supabaseAdmin
            .from('booking_details')
            .select('*')
            .in('booking_id', bookingIds)

        if (detailsError) throw detailsError

        // Kombinera bookings med deras detaljer
        const bookingsWithDetails: BookingWithDetails[] = bookings.map((b) => ({
            ...b,
            details: details.find((d) => d.booking_id === b.id)
        }))

        return NextResponse.json({ data: bookingsWithDetails, error: null })
    } catch (err: unknown) {
        console.error('Detailed Admin Error:', err)

        const errorMessage = err instanceof Error ? err.message : ''

        if (
            errorMessage === 'Unauthorized' ||
            errorMessage === 'Not authenticated'
        ) {
            return NextResponse.json(
                { data: null, error: 'Unauthorized' },
                { status: 403 }
            )
        }

        return NextResponse.json(
            { data: null, error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
