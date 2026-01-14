import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { supabaseAdmin } from '@/utils/supabase/admin'
import { requireAdmin } from '@/utils/server/auth'

export async function GET() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('date', { ascending: true })
        .order('start_time', { ascending: true })

    if (error) {
        console.error('Fetch classes error:', error)
        return NextResponse.json(
            { data: null, error: 'Failed to fetch classes' },
            { status: 500 }
        )
    }

    return NextResponse.json({ data, error: null })
}

export async function POST(req: Request) {
    try {
        await requireAdmin()
        const body = await req.json()

        if (
            !body.title ||
            !body.date ||
            !body.start_time ||
            !body.end_time ||
            !body.max_spots
        ) {
            return NextResponse.json(
                { data: null, error: 'All fields are required' },
                { status: 400 }
            )
        }

        const { data, error } = await supabaseAdmin
            .from('classes')
            .insert(body)
            .select()
            .single()

        if (error) {
            console.error('Create class error:', error)
            return NextResponse.json(
                { data: null, error: 'Failed to create class' },
                { status: 500 }
            )
        }

        return NextResponse.json({ data, error: null })
    } catch (err: unknown) {
        console.error('POST class error:', err)
        const message = err instanceof Error ? err.message : ''
        const isAuth =
            message === 'Unauthorized' || message === 'Not authenticated'

        return NextResponse.json(
            {
                data: null,
                error: isAuth ? 'Unauthorized' : 'Internal Server Error'
            },
            { status: isAuth ? 403 : 500 }
        )
    }
}
