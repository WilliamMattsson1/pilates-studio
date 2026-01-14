import { NextResponse } from 'next/server'
import { requireAdmin } from '@/utils/server/auth'
import { supabaseAdmin } from '@/utils/supabase/admin'

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    await requireAdmin()

    try {
        const resolvedParams = await params
        const { id } = resolvedParams

        const { data, error } = await supabaseAdmin
            .from('bookings')
            .delete()
            .eq('id', id)
            .select()

        if (error) {
            console.error('Delete booking database error:', error)
            return NextResponse.json(
                { data: null, error: 'Failed to delete booking from database' },
                { status: 500 }
            )
        }

        if (!data || data.length === 0) {
            return NextResponse.json(
                { data: null, error: 'Booking not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({ data, error: null })
    } catch {
        return NextResponse.json(
            {
                data: null,
                error: 'An unexpected error occurred during booking deletion.'
            },
            { status: 500 }
        )
    }
}
