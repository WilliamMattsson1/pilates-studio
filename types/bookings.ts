interface BookingItem {
    id: string // int8 i Supabase, men vi kan använda string i frontend
    class_id: string // uuid - referens till ClassItem.id
    user_id?: string // uuid om inloggad användare, nullable för gäster
    guest_name?: string // text - om !user, nullable för user
    guest_email?: string // text - om !user, nullable för user
    stripe_payment_id: string | null // Payment id från stripe för att koppla bokning till betalning
    created_at: string // timestamptz → ISO-datum, t.ex. "2025-10-01T10:00:00Z"
}

export type { BookingItem }
