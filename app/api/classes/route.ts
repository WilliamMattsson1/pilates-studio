import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { requireAdmin } from '@/utils/server/auth'

export async function GET() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('date', { ascending: true })
        .order('start_time', { ascending: true })

    if (error) {
        return NextResponse.json(
            { data: null, error: error.message },
            { status: 500 }
        )
    }

    return NextResponse.json({ data, error: null })
}

export async function POST(req: Request) {
    const supabase = await createClient()

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

        const { data, error } = await supabase
            .from('classes')
            .insert(body)
            .select()
            .single()

        if (error) {
            return NextResponse.json(
                { data: null, error: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json({ data, error: null })
    } catch (err: any) {
        return NextResponse.json(
            { data: null, error: err.message },
            { status: 403 }
        )
    }
}
