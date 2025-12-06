import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Booking Error | Pilates Studio',
    description:
        'Something went wrong with your booking. Contact us for assistance or a refund if payment was processed.'
}

const BookingErrorPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[68vh] px-4">
            <AlertCircle className="w-20 h-20 text-red-400 mb-4" />
            <h1 className="text-4xl font-bold mb-2">Booking Failed</h1>
            <p className="mb-6 text-center max-w-md">
                Something went wrong with your booking. If payment was
                processed, please contact us for a refund.
            </p>
            <Link
                href="/classes"
                className="px-6 py-3 bg-btn text-white rounded-lg hover:shadow-lg hover:bg-btn-hover transition"
            >
                Back to Classes
            </Link>
        </div>
    )
}

export default BookingErrorPage
