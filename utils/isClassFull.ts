import { createClient } from '@/utils/supabase/server'

export async function isClassFull(classId: string) {
    const supabase = await createClient()

    // Hämta klassens max_spots
    const { data: cls, error: classError } = await supabase
        .from('classes')
        .select('max_spots')
        .eq('id', classId)
        .single()

    if (classError || !cls) {
        console.error('Failed to fetch class', classError)
        return false
    }

    // Hämta alla bokningar för denna klass
    const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .eq('class_id', classId)

    if (bookingsError) {
        console.error('Failed to fetch bookings', bookingsError)
        return false
    }

    const bookedSpots = bookings?.length ?? 0

    console.log('se från isClassFull', bookedSpots)

    return bookedSpots >= cls.max_spots
}
