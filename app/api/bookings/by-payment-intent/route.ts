import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/utils/supabase/admin'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const paymentIntentId = searchParams.get('payment_intent')

        if (!paymentIntentId) {
            return NextResponse.json(
                { error: 'Missing payment_intent parameter' },
                { status: 400 }
            )
        }

        // Query booking_details by stripe_payment_id
        const { data: bookingDetail, error: detailError } = await supabaseAdmin
            .from('booking_details')
            .select(
                'booking_id, user_id, guest_name, guest_email, stripe_payment_id'
            )
            .eq('stripe_payment_id', paymentIntentId)
            .single()

        if (detailError || !bookingDetail) {
            return NextResponse.json({
                found: false,
                booking: null
            })
        }

        // Get the booking
        const { data: booking, error: bookingError } = await supabaseAdmin
            .from('bookings')
            .select('id, class_id, created_at')
            .eq('id', bookingDetail.booking_id)
            .single()

        if (bookingError || !booking) {
            return NextResponse.json({
                found: false,
                booking: null
            })
        }

        const supabase = await createClient()
        const {
            data: { user }
        } = await supabase.auth.getUser()

        // Om bokningen är kopplad till ett user_id, kräv att det är rätt användare
        if (bookingDetail.user_id && bookingDetail.user_id !== user?.id) {
            return NextResponse.json(
                {
                    error: 'Unauthorized: This booking belongs to another account'
                },
                { status: 403 }
            )
        }

        // Get class details
        const { data: classData, error: classError } = await supabaseAdmin
            .from('classes')
            .select('id, title, date, start_time, end_time, price')
            .eq('id', booking.class_id)
            .single()

        if (classError || !classData) {
            return NextResponse.json({
                found: false,
                booking: null
            })
        }

        return NextResponse.json({
            found: true,
            booking: {
                ...booking,
                details: bookingDetail,
                class: classData || null
            }
        })
    } catch (err) {
        console.error('[ByPaymentIntent] Error:', err)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
