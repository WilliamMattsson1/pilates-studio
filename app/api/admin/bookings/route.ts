import { NextResponse } from 'next/server'
import { BookingItem } from '@/types/bookings'
import { requireAdmin } from '@/utils/server/auth'
import { supabaseAdmin } from '@/utils/supabase/admin'

export async function GET() {
    await requireAdmin()

    try {
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
        const bookingItems: BookingItem[] = bookings.map((b) => ({
            ...b,
            details: details.find((d) => d.booking_id === b.id)
        }))

        return NextResponse.json({ data: bookingItems, error: null })
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unauthorized'
        return NextResponse.json(
            { data: null, error: message },
            { status: 403 }
        )
    }
}
