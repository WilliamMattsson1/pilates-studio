import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/utils/supabase/admin'
import { requireAdmin } from '@/utils/server/auth'

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin()

        const { id } = await params
        if (!id)
            return NextResponse.json(
                { error: 'Booking ID missing' },
                { status: 400 }
            )

        const { data, error } = await supabaseAdmin
            .from('booking_details')
            .update({ swish_received: true })
            .eq('booking_id', id)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ data })
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message || 'Something went wrong' },
            { status: 500 }
        )
    }
}
