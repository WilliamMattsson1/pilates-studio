'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { useClasses } from '@/context/ClassesContext'
import { CheckCircle, Info, Home } from 'lucide-react'

const PaymentSuccess = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const classId = searchParams.get('classId')
    const name = searchParams.get('name')
    const email = searchParams.get('email')
    const amount = searchParams.get('amount')

    const { classes } = useClasses()
    const cls = classes.find((c) => c.id === classId)

    return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 text-center mt-10">
            {/* Största check-ikonen högst upp */}
            <CheckCircle className="w-28 h-28 text-green-600 mb-6" />

            <h1 className="text-3xl md:text-4xl font-bold mb-6">
                Booking Confirmed
            </h1>

            {cls ? (
                <div className="text-lg text-gray-700 max-w-xl space-y-4">
                    <p>
                        You have booked{' '}
                        <span className="font-semibold">{cls.title}</span>
                    </p>
                    {/* Datum och tid på samma rad */}
                    <p className="flex justify-center gap-4">
                        <span>
                            Date:{' '}
                            <span className="font-semibold">{cls.date}</span>
                        </span>
                        <span>
                            Time:{' '}
                            <span className="font-semibold">
                                {cls.start_time}–{cls.end_time}
                            </span>
                        </span>
                    </p>
                    <p>
                        Guest:{' '}
                        <span className="font-semibold">
                            {name || 'Your name'}
                        </span>
                    </p>
                    <p>
                        Email:{' '}
                        <span className="font-semibold">
                            {email || 'Your email'}
                        </span>
                    </p>
                    <p>
                        Paid: <span className="font-semibold">{amount} kr</span>
                    </p>
                </div>
            ) : (
                <div className="text-lg text-gray-700 max-w-xl space-y-2">
                    <p>
                        Your payment was successful and your booking has been
                        registered.
                    </p>
                    <p>
                        Paid: <span className="font-semibold">{amount} kr</span>
                    </p>
                </div>
            )}

            <div className="text-sm text-gray-500 max-w-xl mt-6 flex flex-col items-center gap-2">
                <p className="flex items-center gap-2">
                    If anything looks incorrect or if you have questions, simply
                    reply to the confirmation email and we will assist you.
                </p>

                <p className="flex items-center gap-2 mt-2">
                    <Info className="w-4 h-4" />
                    You may cancel your booking up to{' '}
                    <strong>24 hours before the class starts</strong>.
                </p>
            </div>

            {/* Hem-knapp */}
            <button
                onClick={() => router.push('/')}
                className="mt-8 flex items-center gap-2 bg-btn text-white px-6 py-3 rounded-md font-bold hover:opacity-90"
            >
                <Home className="w-5 h-5" />
                Go Home
            </button>
        </div>
    )
}

export default PaymentSuccess
