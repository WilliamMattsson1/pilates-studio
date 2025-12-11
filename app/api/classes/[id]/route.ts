import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { requireAdmin } from '@/utils/server/auth'

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const resolvedParams = await params
    const { id } = resolvedParams

    const supabase = await createClient()

    try {
        await requireAdmin()
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

    const supabase = await createClient()

    try {
        await requireAdmin()

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
    } catch (err: any) {
        return NextResponse.json(
            { data: null, error: err.message },
            { status: 403 }
        )
    }
}
