'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { useClasses } from '@/context/ClassesContext'
import {
    CheckCircle,
    Info,
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

const PaymentSuccess = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const classId = searchParams.get('classId')
    const name = searchParams.get('name')
    const email = searchParams.get('email')
    const amount = searchParams.get('amount')

    const { classes } = useClasses()
    const cls = classes.find((c) => c.id === classId)

    const [showConfetti, setShowConfetti] = useState(false)
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

    useEffect(() => {
        setShowConfetti(true)
        const timer = setTimeout(() => setShowConfetti(false), 6500)

        const handleResize = () =>
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            })
        handleResize()
        window.addEventListener('resize', handleResize)

        return () => {
            clearTimeout(timer)
            window.removeEventListener('resize', handleResize)
        }
    }, [])

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
            <div className="bg-white rounded-xl shadow-lg p-6 md:max-w-lg max-w-[90%] w-full ">
                {cls ? (
                    <>
                        <h2 className="text-2xl font-semibold">{cls.title}</h2>
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

                        <p className="font-semibold mt-8">Paid: {amount}kr</p>

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
                <button
                    onClick={() => router.push('/profile')}
                    className="bg-btn text-white px-6 py-3 rounded-md font-bold hover:bg-btn/90 transition"
                >
                    <Link href="/profile">See Your Bookings</Link>
                </button>
                <button className="flex items-center justify-center gap-2 border border-black  px-6 py-3 rounded-md font-semibold hover:bg-btn hover:text-white hover:border-transparent transition">
                    <Home className="w-5 h-5" />
                    <Link href="/">Back To Start</Link>
                </button>
            </div>
            <SectionDivider className="h-1 w-[60%] mt-24 bg-btn" />
        </section>
    )
}

export default PaymentSuccess
