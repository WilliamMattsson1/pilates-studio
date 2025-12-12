import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { BookingItem } from '@/types/bookings'
import { requireAdmin } from '@/utils/server/auth'

export async function GET() {
    try {
        await requireAdmin()

        const supabase = await createClient()

        // Hämta alla bookings
        const { data: bookings, error: bookingsError } = await supabase
            .from('bookings')
            .select('*')
            .order('created_at', { ascending: false })

        if (bookingsError) throw bookingsError

        // Hämta booking_details
        const bookingIds = bookings.map((b: any) => b.id)
        const { data: details, error: detailsError } = await supabase
            .from('booking_details')
            .select('*')
            .in('booking_id', bookingIds)

        if (detailsError) throw detailsError

        // Kombinera bookings med deras detaljer
        const bookingItems: BookingItem[] = bookings.map((b: any) => ({
            ...b,
            details: details.find((d: any) => d.booking_id === b.id)
        }))

        return NextResponse.json({ data: bookingItems, error: null })
    } catch (err: any) {
        return NextResponse.json(
            { data: null, error: err.message || 'Unauthorized' },
            { status: 403 }
        )
    }
}
