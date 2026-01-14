'use client'

import { useAuth } from '@/context/AuthContext'
import { useBookings } from '@/context/BookingsContext'
import { useProfile } from '@/hooks/useProfile'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Calendar, User, ArrowRight, Clock } from 'lucide-react'
import CancellationPolicy from '@/components/shared/CancellationPolicy'
import Image from 'next/image'
import { toast } from 'react-toastify'

interface SwishCheckoutPageProps {
    classId: string
    title: string
    date: string
    startTime: string
    endTime: string
    guestName?: string
    guestEmail?: string
    amount?: number
}

const SwishCheckoutPage = ({
    classId,
    title,
    date,
    startTime,
    endTime,
    guestName,
    guestEmail,
    amount
}: SwishCheckoutPageProps) => {
    const { addBooking } = useBookings()
    const { user } = useAuth()
    const { profile } = useProfile(user?.id)
    const [submitting, setSubmitting] = useState(false)
    const [confirmedPayment, setConfirmedPayment] = useState(false)
    const router = useRouter()

    const customerName = guestName || profile?.name || ''
    const customerEmail = guestEmail || user?.email || ''

    const handleConfirm = async () => {
        if (!confirmedPayment) return
        setSubmitting(true)
        try {
            await addBooking({
                class_id: classId,
                user_id: user?.id,
                guest_name: customerName,
                guest_email: customerEmail,
                stripe_payment_id: undefined,
                payment_method: 'swish',
                swish_received: false
            })

            const params = new URLSearchParams()
            params.set('classId', classId)
            params.set('amount', String(amount))

            // Säker hantering av parametrar för confirmation-sidan
            if (customerName) params.set('name', customerName)
            if (customerEmail) params.set('email', customerEmail)

            router.push(`/swish-confirmation?${params.toString()}`)
        } catch (err) {
            console.error('[SwishCheckout] Failed to create booking:', err)
            const message =
                err instanceof Error
                    ? err.message
                    : 'Kunde inte skapa bokning. Försök igen.'
            toast.error(message)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <section className="max-w-[90%] min-h-[90vh] mx-auto my-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-center fancy-font tracking-wide leading-tight mb-8">
                Complete Your Booking
            </h1>

            <div className="lg:max-w-5xl mx-auto rounded-xl bg-secondary-bg shadow-xl overflow-hidden flex flex-col-reverse md:flex-row min-h-[80vh]">
                {/* Left: Class Info */}
                <div className=" md:w-1/2 p-8 flex flex-col justify-center items-center gap-5 bg-card ">
                    <div className="bg-btn text-white w-20 h-20 flex items-center justify-center rounded-full">
                        <Calendar className="w-10 h-10" />
                    </div>
                    <h2 className="text-4xl font-extrabold text-center fancy-font">
                        {title}
                    </h2>

                    <div className="flex items-center gap-4 text-lg">
                        <div className="flex items-center gap-1">
                            <Calendar className="w-6 h-6" />
                            <span>{date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="w-6 h-6" />
                            <span>
                                {startTime} - {endTime}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1  text-lg">
                        <User className="w-6 h-6 " />
                        <span>{customerName}</span>
                    </div>

                    {customerEmail && (
                        <p className="text-sm">{customerEmail}</p>
                    )}

                    <div className="mt-4 text-3xl font-bold text-gray-900">
                        {amount}kr
                    </div>
                </div>

                {/* Right: Swish Instructions */}
                <div className="md:w-1/2 p-8 flex flex-col justify-center bg-secondary-bg">
                    <div className="relative w-40 h-12 mx-auto">
                        <Image
                            src="/icons/swish-logo.png"
                            alt="Swish"
                            fill
                            style={{ objectFit: 'contain' }}
                        />
                    </div>

                    <div className="p-4 rounded-lg bg-white space-y-1 mt-12">
                        <p>
                            Swisha till:{' '}
                            <span className="font-semibold text-black">
                                123 456 78 90
                            </span>
                        </p>
                        <p>
                            Meddelande:{' '}
                            <span className="font-semibold text-black">
                                ditt namn + klassdatum
                            </span>
                        </p>
                        <p className="font-semibold text-lg text-gray-900 mt-4">
                            Summa att betala: {amount}kr
                        </p>
                    </div>

                    <CancellationPolicy className="mt-2 text-xs text-gray-500" />

                    <div className="flex items-center gap-2 mt-12">
                        <input
                            type="checkbox"
                            id="swish-confirm"
                            checked={confirmedPayment}
                            onChange={(e) =>
                                setConfirmedPayment(e.target.checked)
                            }
                            className="w-4 h-4 accent-btn"
                        />
                        <label
                            htmlFor="swish-confirm"
                            className="text-gray-800 text-sm font-medium"
                        >
                            Jag har betalat med Swish
                        </label>
                    </div>

                    <button
                        onClick={handleConfirm}
                        disabled={submitting || !confirmedPayment}
                        className="w-full flex items-center justify-center gap-2 bg-btn text-white py-3 rounded-md font-semibold hover:bg-btn-hover hover:cursor-pointer disabled:opacity-60 transition text-lg mt-4"
                    >
                        {submitting ? 'Laddar...' : 'Bekräfta min bokning'}
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </section>
    )
}

export default SwishCheckoutPage
