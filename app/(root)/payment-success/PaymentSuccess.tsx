'use client'

import { useRouter, useSearchParams } from 'next/navigation'
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
import { toast } from 'react-toastify'
import Loader from '@/components/shared/ui/Loader'

const PaymentSuccess = () => {
    const router = useRouter()
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

    const paymentIntentId = searchParams.get('payment_intent')

    const [verified, setVerified] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!paymentIntentId) {
            setLoading(false)
            return
        }

        const verifyPayment = async () => {
            try {
                const res = await fetch('/api/verify-payment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        paymentIntentId
                    })
                })

                const data = await res.json()

                if (!res.ok || !data.ok) {
                    throw new Error('Payment not verified')
                }

                setVerified(true)
            } catch (err) {
                console.error(err)
                toast.error(
                    'We could not verify your payment. Please contact support.'
                )
                router.push('/booking-error')
            } finally {
                setLoading(false)
            }
        }

        verifyPayment()
    }, [paymentIntentId, router])

    if (loading) {
        return <Loader />
    }
    return (
        verified && (
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
                    {cls ? (
                        <>
                            <h2 className="text-2xl font-semibold">
                                {cls.title}
                            </h2>
                            <div className="flex items-center gap-2 mt-4 text-gray-600">
                                <CalendarIcon className="w-5 h-5" />
                                <span>
                                    {cls.date} • {cls.start_time}–{cls.end_time}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 mt-2">
                                <User className="w-5 h-5" />
                                <span>
                                    {name || 'Guest'} ({email || 'No email'})
                                </span>
                            </div>

                            <div className="flex items-center gap-2 font-medium mt-6">
                                <MailCheck className="w-5 h-5" />
                                <span>
                                    A confirmation email has been sent to your
                                    inbox.
                                </span>
                            </div>

                            <p className="font-semibold mt-8">
                                Paid: {amount}kr
                            </p>

                            <div className="text-sm text-gray-500 mt-1">
                                <CancellationPolicy />
                            </div>
                        </>
                    ) : (
                        <p className="text-gray-700">
                            Your payment was successful. Paid: {amount} kr
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
    )
}

export default PaymentSuccess
