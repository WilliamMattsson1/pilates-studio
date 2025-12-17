'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useClasses } from '@/context/ClassesContext'
import {
    Calendar as CalendarIcon,
    User,
    MailCheck,
    Home,
    Clock3
} from 'lucide-react'
import SectionDivider from '@/components/shared/ui/SectionDivider'
import Link from 'next/link'
import CancellationPolicy from '@/components/shared/CancellationPolicy'

const Page = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const classId = searchParams.get('classId')
    const name = searchParams.get('name')
    const email = searchParams.get('email')
    const amount = searchParams.get('amount')

    const { classes } = useClasses()
    const cls = classes.find((c) => c.id === classId)

    return (
        <section className="min-h-[80vh] flex flex-col items-center justify-start px-4 py-8 bg-secondary-bg relative">
            <div className="flex flex-col items-center mb-6">
                <Clock3 className="w-22 h-22 text-gray-500 mb-4 animate-pulse" />
                <h1 className="text-4xl md:text-5xl font-extrabold text-center lg:text-left fancy-font tracking-wide leading-tight">
                    Booking Received!
                </h1>
            </div>

            <div className="bg-primary-bg rounded-xl shadow-lg p-6 md:max-w-lg max-w-[90%] w-full ">
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
                                You will receive a confirmation email once we
                                verify your Swish payment.
                            </span>
                        </div>

                        <p className="font-semibold mt-8">Price: {amount}kr</p>

                        <div className="text-sm text-gray-500 mt-1">
                            <CancellationPolicy />
                        </div>
                    </>
                ) : (
                    <p className="text-gray-700">
                        Your booking request has been received. Amount to pay:{' '}
                        {amount}kr
                    </p>
                )}
            </div>

            {/* Knappar */}
            <div className="flex flex-col md:flex-row gap-4 mt-8">
                <button
                    onClick={() => router.push('/profile')}
                    className="bg-btn text-white px-6 py-3 rounded-md font-bold hover:bg-btn-hover transition"
                >
                    <Link href="/profile">See Your Bookings</Link>
                </button>
                <button className="flex items-center justify-center gap-2 border border-black px-6 py-3 rounded-md font-semibold hover:bg-btn-hover hover:text-white hover:border-transparent transition">
                    <Home className="w-5 h-5" />
                    <Link href="/">Back To Start</Link>
                </button>
            </div>

            <SectionDivider className="h-1 w-[60%] mt-24 bg-btn" />
        </section>
    )
}

export default Page
