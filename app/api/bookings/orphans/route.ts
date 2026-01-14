import { NextResponse } from 'next/server'
import { requireAdmin } from '@/utils/server/auth'
import { supabaseAdmin } from '@/utils/supabase/admin'

/**
 * Find bookings without corresponding booking_details (orphans)
 * Admin-only endpoint for data integrity checks
 */
export async function GET() {
    try {
        await requireAdmin()

        // Get all booking IDs that have details
        const { data: detailsData } = await supabaseAdmin
            .from('booking_details')
            .select('booking_id')

        const bookingIdsWithDetails = new Set(
            detailsData?.map((d) => d.booking_id) || []
        )

        // Get all bookings
        const { data: allBookings, error: bookingsError } = await supabaseAdmin
            .from('bookings')
            .select('id, class_id, created_at')
            .order('created_at', { ascending: false })

        if (bookingsError) throw bookingsError

        // Find orphans
        const orphans =
            allBookings?.filter((b) => !bookingIdsWithDetails.has(b.id)) || []

        return NextResponse.json({
            total: allBookings?.length || 0,
            orphans: orphans.length,
            orphanBookings: orphans
        })
    } catch (err: unknown) {
        console.error('Integrity Check Error:', err)

        const message = err instanceof Error ? err.message : ''
        const isAuth =
            message === 'Unauthorized' || message === 'Not authenticated'

        return NextResponse.json(
            { error: isAuth ? 'Unauthorized' : 'Internal Server Error' },
            { status: isAuth ? 403 : 500 }
        )
    }
}
