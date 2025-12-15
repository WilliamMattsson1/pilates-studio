import { NextResponse } from 'next/server'
import { BookingItem } from '@/types/bookings'
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
        const bookingIds = bookings.map((b: any) => b.id)
        const { data: details, error: detailsError } = await supabaseAdmin
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
