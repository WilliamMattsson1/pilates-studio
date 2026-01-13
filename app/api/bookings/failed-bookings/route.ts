import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/utils/supabase/admin'

export async function GET() {
    try {
        const { data, error } = await supabaseAdmin
            .from('failed_bookings')
            .select('*')
            .eq('payment_method', 'stripe')
            .eq('stripe_paid', true)
            .eq('refunded', false)
            .order('created_at', { ascending: false })

        if (error) {
            return NextResponse.json(
                { data: null, error: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json({ data, error: null })
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err)
        return NextResponse.json(
            { data: null, error: message },
            { status: 500 }
        )
    }
}
