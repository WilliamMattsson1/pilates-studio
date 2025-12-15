import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET() {
    const supabase = await createClient()

    const { data, error } = await supabase.from('profiles').select('*')

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ profiles: data })
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
        const { error } = await supabase
            .from('profiles')
            .insert({ id: user.id, name, email })

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (err: any) {
        console.error('Error creating profile:', err)
        return NextResponse.json(
            { error: err.message || 'Something went wrong' },
            { status: 500 }
        )
    }
}
