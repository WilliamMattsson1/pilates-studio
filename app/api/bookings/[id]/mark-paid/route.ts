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

        if (error) {
            console.error('Swish confirmation error:', error)
            return NextResponse.json(
                { data: null, error: 'Failed to update payment status' },
                { status: 500 }
            )
        }

        return NextResponse.json({ data, error: null })
    } catch (err: unknown) {
        console.error('Detailed Swish POST Error:', err)

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
