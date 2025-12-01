import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const resolvedParams = await params
    const { id } = resolvedParams

    const supabase = await createClient()
    const body = await req.json()

    const { data, error } = await supabase
        .from('classes')
        .update(body)
        .eq('id', id)
        .select()
        .single()

    if (error)
        return NextResponse.json(
            { data: null, error: error.message },
            { status: 500 }
        )

    return NextResponse.json({ data, error: null })
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const resolvedParams = await params
    const { id } = resolvedParams

    const supabase = await createClient()

    const { data, error } = await supabase
        .from('classes')
        .delete()
        .eq('id', id)
        .select()

    if (error)
        return NextResponse.json(
            { data: null, error: error.message },
            { status: 500 }
        )

    return NextResponse.json({ data, error: null })
}
