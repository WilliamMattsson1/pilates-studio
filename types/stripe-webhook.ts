export interface PaymentIntentMetadata {
    classId: string
    userId: string | null
    guestName: string | null
    guestEmail: string
    classTitle: string
    classDate: string
    classTime: string
    amount: string
}

export interface CreatePaymentIntentRequest {
    classId: string
    userId?: string | null
    guestName?: string | null
    guestEmail?: string
    classTitle?: string
    classDate?: string
    classTime?: string
    amount?: string
}
