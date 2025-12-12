import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { requireAdmin } from '@/utils/server/auth'

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    await requireAdmin()

    const resolvedParams = await params
    const { id } = resolvedParams

    const supabase = await createClient()

    const { data, error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id)
        .select()

    if (error) {
        console.error(`Failed to delete booking ${id}:`, error)
        return NextResponse.json(
            { data: null, error: error.message },
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
}
