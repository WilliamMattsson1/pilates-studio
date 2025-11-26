interface BookingItem {
    id: number
    classId: number
    userId?: number // ifall inloggad användare
    guestName?: string // ifall anonym
    guestEmail?: string // ifall anonym
    bookedAt: string // t.ex. "2025-10-01T10:00:00Z"
}

export type { BookingItem }
