import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET() {
    const supabase = await createClient()

    const { data, error } = await supabase.from('tasks').select('*')

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
    const supabase = await createClient()

    const body = await req.json()
    const { title, desc } = body

    const { data, error } = await supabase
        .from('tasks')
        .insert({ title, desc })
        .select()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
}
