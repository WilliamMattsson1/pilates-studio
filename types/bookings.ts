interface Booking {
    id: string // PK int8 i supabase, använder string i frontend
    class_id: string // uuid, FK → classes.id (uuid) anger vilken klass bokningen tillhör
    created_at: string // timestamptz → ISO string
}

// BookingDetail innehåller känslig info, ska skyddas med RLS
interface BookingDetail {
    id: string // PK uuid, unik
    booking_id: string // int8, FK → bookings.id, UNIQUE kopplar detail till en bokning
    user_id: string | null // uuid, nullable om inloggad användare (uuid) annars null
    guest_name: string | null // Gästens namn om bokning !user
    guest_email: string | null // Email för user och !user
    stripe_payment_id: string | null // stripe payment intent ID om bokningen betalats
    payment_method: 'manual' | 'stripe' | 'swish' // ny kolumn som anger betalningsmetod
    swish_received: boolean // ny kolumn som visar om Swish-betalning mottagits (false)
    refunded: boolean // true om refunded, false default
    refunded_at: string | null // Tid för refund
    created_at: string // timestamptz
}

// Om du vill kombinera en booking med dess detaljer
interface BookingItem extends Booking {
    details: BookingDetail // Se ovan
}

interface NewBookingDetail {
    class_id: string // uuid på klassen
    user_id?: string // nullable om gäst
    guest_name?: string // name oavsett om user eller !user
    guest_email?: string // --||--
    stripe_payment_id?: string // Sker via stripe
    payment_method?: 'manual' | 'stripe' | 'swish' // ny optional vid skapande
    swish_received?: boolean // ny optional vid skapande
}

export type { Booking, BookingDetail, BookingItem, NewBookingDetail }
