'use client'

import { useSearchParams } from 'next/navigation'
import { useClasses } from '@/context/ClassesContext'
import { useAuth } from '@/context/AuthContext'
import {
    CheckCircle,
    Home,
    Calendar as CalendarIcon,
    User,
    MailCheck
} from 'lucide-react'
import Confetti from 'react-confetti'
import { useEffect, useState } from 'react'
import SectionDivider from '@/components/shared/ui/SectionDivider'
import Link from 'next/link'
import CancellationPolicy from '@/components/shared/CancellationPolicy'
import Loader from '@/components/shared/ui/Loader'

interface BookingData {
    booking: {
        id: string
        class_id: string
        created_at: string
    }
    class: {
        id: string
        title: string
        date: string
        start_time: string
        end_time: string
        price: number
    } | null
    details: {
        booking_id: string
        user_id: string | null
        guest_name: string | null
        guest_email: string
        stripe_payment_id: string
    }
}

const PaymentSuccess = () => {
    const { user } = useAuth()

    const searchParams = useSearchParams()
    const classId = searchParams.get('classId')
    const name = searchParams.get('name')
    const email = searchParams.get('email')
    const amount = searchParams.get('amount')

    const { classes } = useClasses()
    const cls = classes.find((c) => c.id === classId)

    const [showConfetti, setShowConfetti] = useState(true)
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

    useEffect(() => {
        const timer = setTimeout(() => setShowConfetti(false), 6500)

        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            })
        }

        handleResize()
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const paymentIntentId =
        searchParams.get('payment_intent') ||
        searchParams.get('payment_intent_client_secret')?.split('_secret')[0]

    const [bookingFound, setBookingFound] = useState(false)
    const [loading, setLoading] = useState(!!paymentIntentId)
    const [bookingData, setBookingData] = useState<BookingData | null>(null)

    useEffect(() => {
        if (!paymentIntentId) {
            return
        }

        const pollForBooking = async () => {
            const maxAttempts = 5
            const pollInterval = 2000 // 2 seconds

            for (let attempt = 1; attempt <= maxAttempts; attempt++) {
                try {
                    const res = await fetch(
                        `/api/bookings/by-payment-intent?payment_intent=${paymentIntentId}`
                    )

                    if (!res.ok) {
                        console.error('Polling request failed:', res.status)
                        continue
                    }

                    const data = await res.json()

                    if (data.found && data.booking) {
                        setBookingFound(true)
                        setBookingData(data.booking)
                        setLoading(false)
                        return
                    }
                } catch (err) {
                    console.error('Polling error:', err)
                }

                // Wait before next attempt (except on last attempt)
                if (attempt < maxAttempts) {
                    await new Promise((resolve) =>
                        setTimeout(resolve, pollInterval)
                    )
                }
            }

            // If we get here, booking not found after all attempts
            setLoading(false)
            setBookingFound(false)
        }

        pollForBooking()
    }, [paymentIntentId])

    // Show loading/polling state
    if (loading) {
        return (
            <section className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8 bg-secondary-bg">
                <Loader />
            </section>
        )
    }

    // Show processing message if booking not found after polling
    if (!bookingFound) {
        return (
            <section className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8 bg-secondary-bg">
                <div className="bg-primary-bg rounded-xl shadow-lg p-8 md:max-w-lg max-w-[90%] w-full text-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold mb-4 fancy-font">
                        Payment Received
                    </h1>
                    <p className="text-gray-700 mb-4">
                        Your payment was successful! We&apos;re processing your
                        booking now.
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                        You&apos;ll receive a confirmation email once your
                        booking is confirmed.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        {user && (
                            <Link
                                href="/profile"
                                className="bg-btn text-white px-6 py-3 rounded-md font-bold hover:bg-btn-hover transition text-center"
                            >
                                See Your Bookings
                            </Link>
                        )}
                        <Link
                            href="/"
                            className="flex items-center justify-center gap-2 border border-black px-6 py-3 rounded-md font-semibold hover:bg-btn-hover hover:text-white hover:border-transparent transition"
                        >
                            <Home className="w-5 h-5" />
                            Back To Start
                        </Link>
                    </div>
                </div>
            </section>
        )
    }

    // Show success state with booking details
    const displayClass = bookingData?.class || cls
    const displayName = bookingData?.details?.guest_name || name || 'Guest'
    const displayEmail =
        bookingData?.details?.guest_email || email || 'No email'
    const displayAmount = amount || ''

    return (
        <section className="min-h-[80vh] flex flex-col items-center justify-start px-4 py-8 bg-secondary-bg relative">
            {showConfetti && (
                <Confetti
                    width={windowSize.width}
                    height={windowSize.height}
                    recycle={false}
                />
            )}

            {/* Check-ikon + Titel */}
            <div className="flex flex-col items-center mb-6">
                <CheckCircle className="w-22 h-22 text-green-600 mb-4 animate-pulse" />
                <h1 className="text-4xl md:text-5xl font-extrabold text-center lg:text-left fancy-font tracking-wide leading-tight">
                    Booking Confirmed!
                </h1>
            </div>

            {/* Bokningsinformation card */}
            <div className="bg-primary-bg rounded-xl shadow-lg p-6 md:max-w-lg max-w-[90%] w-full ">
                {displayClass ? (
                    <>
                        <h2 className="text-2xl font-semibold">
                            {displayClass.title}
                        </h2>
                        <div className="flex items-center gap-2 mt-4 text-gray-600">
                            <CalendarIcon className="w-5 h-5" />
                            <span>
                                {displayClass.date} • {displayClass.start_time}–
                                {displayClass.end_time}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 mt-2">
                            <User className="w-5 h-5" />
                            <span>
                                {displayName} ({displayEmail})
                            </span>
                        </div>

                        <div className="flex items-center gap-2 font-medium mt-6">
                            <MailCheck className="w-5 h-5" />
                            <span>
                                A confirmation email has been sent to your
                                inbox.
                            </span>
                        </div>

                        {displayAmount && (
                            <p className="font-semibold mt-8">
                                Paid: {displayAmount}kr
                            </p>
                        )}

                        <div className="text-sm text-gray-500 mt-1">
                            <CancellationPolicy />
                        </div>
                    </>
                ) : (
                    <p className="text-gray-700">
                        Your payment was successful. Paid: {displayAmount} kr
                    </p>
                )}
            </div>

            {/* Knappar */}
            <div className="flex flex-col md:flex-row gap-4 mt-8">
                {user && (
                    <Link
                        href="/profile"
                        className="bg-btn text-white px-6 py-3 rounded-md font-bold hover:bg-btn-hover transition text-center"
                    >
                        See Your Bookings
                    </Link>
                )}

                <Link
                    href="/"
                    className="flex items-center justify-center gap-2 border border-black px-6 py-3 rounded-md font-semibold hover:bg-btn-hover hover:text-white hover:border-transparent transition"
                >
                    <Home className="w-5 h-5" />
                    Back To Start
                </Link>
            </div>
            <SectionDivider className="h-1 w-[60%] mt-24 bg-btn" />
        </section>
    )
}

export default PaymentSuccess
