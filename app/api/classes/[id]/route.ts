import { NextResponse } from 'next/server'
import { requireAdmin } from '@/utils/server/auth'
import { supabaseAdmin } from '@/utils/supabase/admin'

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const resolvedParams = await params
    const { id } = resolvedParams

    await requireAdmin()

    try {
        const body = await req.json()

        const { data, error } = await supabaseAdmin
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
    } catch (err: any) {
        return NextResponse.json(
            { data: null, error: err.message },
            { status: 403 }
        )
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const resolvedParams = await params
    const { id } = resolvedParams

    await requireAdmin()

    try {
        const { data, error } = await supabaseAdmin
            .from('classes')
            .delete()
            .eq('id', id)
            .select()

        if (error)
            return NextResponse.json(
                { data: null, error: error.message },
                { status: 500 }
            )

        if (!data || data.length === 0) {
            return NextResponse.json(
                { data: null, error: 'Unauthorized or class not found' },
                { status: 403 }
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
