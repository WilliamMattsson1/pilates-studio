import { NextResponse } from 'next/server'
import { requireAdmin } from '@/utils/server/auth'
import { supabaseAdmin } from '@/utils/supabase/admin'

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const resolvedParams = await params
    const { id } = resolvedParams

    try {
        await requireAdmin()
        const body = await req.json()

        const { data, error } = await supabaseAdmin
            .from('classes')
            .update(body)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('Update error:', error)
            return NextResponse.json(
                { data: null, error: 'Failed to update class' },
                { status: 500 }
            )
        }

        return NextResponse.json({ data, error: null })
    } catch (err: unknown) {
        console.error('PUT error:', err)
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

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const resolvedParams = await params
    const { id } = resolvedParams

    try {
        await requireAdmin()

        const { data, error } = await supabaseAdmin
            .from('classes')
            .delete()
            .eq('id', id)
            .select()

        if (error) {
            console.error('Delete error:', error)

            // Om det är en foreign key constraint (Postgres kod 23503)
            if (error.code === '23503') {
                return NextResponse.json(
                    {
                        data: null,
                        error: 'foreign key constraint: class has active bookings'
                    },
                    { status: 400 }
                )
            }

            return NextResponse.json(
                { data: null, error: 'Failed to delete class' },
                { status: 500 }
            )
        }

        if (!data || data.length === 0) {
            return NextResponse.json(
                { data: null, error: 'Class not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({ data, error: null })
    } catch (err: unknown) {
        console.error('DELETE error:', err)
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
