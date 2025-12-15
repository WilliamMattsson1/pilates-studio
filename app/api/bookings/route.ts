import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { BookingItem, NewBookingDetail } from '@/types/bookings'
import { supabaseAdmin } from '@/utils/supabase/admin'

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
    const body: NewBookingDetail = await req.json()

    const { class_id } = body

    try {
        // Kontrollera antal bokningar för klassen
        const { data: existingBookings, error: fetchError } = await supabase
            .from('bookings')
            .select('*')
            .eq('class_id', class_id)

        if (fetchError) throw fetchError

        // Hämta klassens max_spots
        const { data: classData, error: classError } = await supabase
            .from('classes')
            .select('max_spots')
            .eq('id', class_id)
            .single()

        if (classError) throw classError

        if ((existingBookings?.length || 0) >= (classData.max_spots || 0)) {
            return NextResponse.json(
                { data: null, error: 'Class is full' },
                { status: 400 }
            )
        }

        // Lägg till publika booking
        const { data: booking, error: insertError } = await supabase
            .from('bookings')
            .insert([{ class_id }])
            .select()
            .single()

        if (insertError || !booking)
            throw insertError || new Error('Booking insert failed')

        // Lägg till detaljer i booking_details
        const { data: details, error: detailsError } = await supabaseAdmin
            .from('booking_details')
            .insert([
                {
                    booking_id: booking.id,
                    user_id: body.user_id ?? null,
                    guest_name: body.guest_name ?? null,
                    guest_email: body.guest_email ?? null,
                    stripe_payment_id: body.stripe_payment_id ?? null,
                    refunded: false,
                    created_at: new Date().toISOString()
                }
            ])
            .select()
            .single()

        if (detailsError || !details)
            throw detailsError || new Error('Booking details insert failed')

        // Returnera kombinerad booking
        const bookingItem: BookingItem = { ...booking, details }

        return NextResponse.json({ data: bookingItem, error: null })
    } catch (err: any) {
        return NextResponse.json(
            { data: null, error: err.message || err.toString() },
            { status: 500 }
        )
    }
}
