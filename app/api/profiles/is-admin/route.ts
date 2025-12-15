import { NextResponse } from 'next/server'
import { requireAdmin } from '@/utils/server/auth'

export async function GET() {
    try {
        await requireAdmin()
        return NextResponse.json({ admin: true })
    } catch {
        return NextResponse.json({ admin: false })
    }
}
