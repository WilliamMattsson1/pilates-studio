import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/utils/supabase/admin'
import { requireAdmin } from '@/utils/server/auth'

export async function GET() {
    try {
        await requireAdmin()

        const { data, error } = await supabaseAdmin
            .from('failed_bookings')
            .select('*')
            .eq('payment_method', 'stripe')
            .eq('stripe_paid', true)
            .eq('refunded', false)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Database error fetching failed bookings:', error)
            return NextResponse.json(
                { data: null, error: 'Failed to fetch failed bookings' },
                { status: 500 }
            )
        }

        return NextResponse.json({ data, error: null })
    } catch (err: unknown) {
        console.error('Failed bookings access error:', err)

        const errorMessage = err instanceof Error ? err.message : ''
        const isAuthError =
            errorMessage === 'Unauthorized' ||
            errorMessage === 'Not authenticated'

        return NextResponse.json(
            {
                data: null,
                error: isAuthError ? 'Unauthorized' : 'Internal Server Error'
            },
            { status: isAuthError ? 403 : 500 }
        )
    }
}
