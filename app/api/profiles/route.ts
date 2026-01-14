import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { supabaseAdmin } from '@/utils/supabase/admin'
import { requireAdmin } from '@/utils/server/auth'

export async function GET() {
    try {
        await requireAdmin()

        const { data, error } = await supabaseAdmin.from('profiles').select('*')

        if (error) {
            console.error('Fetch profiles error:', error)
            throw new Error('Database error')
        }

        return NextResponse.json({ profiles: data })
    } catch (err: unknown) {
        console.error('Profiles access error:', err)

        const message = err instanceof Error ? err.message : ''
        const isAuth =
            message === 'Unauthorized' || message === 'Not authenticated'

        return NextResponse.json(
            { error: isAuth ? 'Unauthorized' : 'Internal Server Error' },
            { status: isAuth ? 403 : 500 }
        )
    }
}

export async function POST(req: Request) {
    try {
        const supabase = await createClient()
        const {
            data: { user }
        } = await supabase.auth.getUser()

        if (!user?.id) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            )
        }

        const { name, email } = await req.json()
        if (!name || !email) {
            return NextResponse.json(
                { error: 'Missing fields' },
                { status: 400 }
            )
        }

        // Insert utan is_admin
        const { error } = await supabaseAdmin
            .from('profiles')
            .insert({ id: user.id, name, email })

        if (error) {
            console.error('Profile creation error:', error)
            throw new Error('Database error')
        }

        return NextResponse.json({ success: true })
    } catch (err: unknown) {
        console.error('Error creating profile:', err)

        const message = err instanceof Error ? err.message : ''
        const isDbError = message === 'Database error'

        return NextResponse.json(
            {
                error: isDbError
                    ? 'Could not create profile'
                    : 'Internal Server Error'
            },
            { status: 500 }
        )
    }
}
