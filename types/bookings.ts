interface BookingItem {
    id: string // UUID från Supabase
    classId: string // UUID som referens till ClassItem.id
    userId?: string // UUID om det är en inloggad användare
    guestName?: string // ifall anonym bokning
    guestEmail?: string // ifall anonym bokning
    bookedAt: string // ISO-datum, t.ex. "2025-10-01T10:00:00Z"
}

export type { BookingItem }
