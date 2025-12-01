import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { BookingItem } from '@/types/bookings'

export async function GET() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })

    if (error)
        return NextResponse.json(
            { data: null, error: error.message },
            { status: 500 }
        )

    return NextResponse.json({ data, error: null })
}

export async function POST(req: Request) {
    const supabase = await createClient()
    const body: Omit<BookingItem, 'id' | 'created_at'> = await req.json()

    const { class_id } = body

    // Hämta alla bokningar för den här klassen
    const { data: existingBookings, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('class_id', class_id)

    if (fetchError)
        return NextResponse.json(
            { data: null, error: fetchError.message },
            { status: 500 }
        )

    // Hämta klassens max_spots
    const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('max_spots')
        .eq('id', class_id)
        .single()

    if (classError)
        return NextResponse.json(
            { data: null, error: classError.message },
            { status: 500 }
        )

    // Kontrollera om klassen är full
    if ((existingBookings?.length || 0) >= (classData.max_spots || 0)) {
        return NextResponse.json(
            { data: null, error: 'Class is full' },
            { status: 400 }
        )
    }

    const { data, error } = await supabase
        .from('bookings')
        .insert([body])
        .select()
        .single()

    if (error)
        return NextResponse.json(
            { data: null, error: error.message },
            { status: 500 }
        )

    return NextResponse.json({ data, error: null })
}
