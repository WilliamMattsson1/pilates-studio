'use client'
import Link from 'next/link'
import { useClasses } from '@/context/ClassesContext'
import { Calendar, Users } from 'lucide-react'
import { useProfiles } from '@/context/ProfilesContext'
import { useAdminBookings } from '@/hooks/useAdminBookings'
import { isBookingPaid } from '@/utils/bookings'

const AdminOverview = () => {
    const { upcomingClasses } = useClasses()
    const { bookings } = useAdminBookings()
    const { activeStudents } = useProfiles()

    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay() + 1) // Monday
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6) // Sunday

    // Classes Stats
    const classesThisWeekCount = upcomingClasses.filter((cls) => {
        const classDate = new Date(cls.date)
        return classDate >= startOfWeek && classDate <= endOfWeek
    }).length

    const classesStats = [
        {
            label: 'Upcoming Classes',
            value: upcomingClasses.length,
            icon: <Calendar className="w-6 h-6 text-btn" />
        },
        {
            label: 'Classes This Week',
            value: classesThisWeekCount,
            icon: <Calendar className="w-6 h-6 text-btn" />
        }
    ]

    // Bookings Stats
    const unpaidBookingsCount = bookings.filter((b) => {
        const isRefunded = Boolean(b.details?.refunded)
        return !isBookingPaid(b, isRefunded) && !isRefunded
    }).length

    const bookingsStats = [
        {
            label: 'Unpaid Bookings',
            value: unpaidBookingsCount,
            icon: <Users className="w-6 h-6 text-red-500" />
        },
        {
            label: 'Total Bookings',
            value: bookings.length,
            icon: <Users className="w-6 h-6 text-btn" />
        },
        {
            label: 'Members',
            value: activeStudents,
            icon: <Users className="w-6 h-6 text-btn" />
        }
    ]

    const buttons = [
        { label: 'Add New Class', href: '/admin/classes', primary: true },
        { label: 'Add New Booking', href: '/admin/bookings', primary: true },
        { label: 'View All Classes', href: '/admin/classes', primary: true },
        { label: 'View All Bookings', href: '/admin/bookings', primary: true },
        { label: 'Back to Homepage', href: '/', primary: false }
    ]

    return (
        <div className="w-[90%] max-w-6xl mx-auto py-8 flex flex-col gap-8">
            <h1 className="text-3xl md:text-4xl font-extrabold fancy-font text-black">
                Overview
            </h1>

            {/* Classes Stats */}
            <h2 className="text-xl font-semibold text-gray-700">Classes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {classesStats.map((stat) => (
                    <div
                        key={stat.label}
                        className="flex flex-col items-center justify-center p-6 bg-primary-bg/50 rounded-lg shadow-lg hover:shadow-xl transition"
                    >
                        <div className="mb-2">{stat.icon}</div>
                        <p className="text-xl font-semibold text-gray-800">
                            {stat.value}
                        </p>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Bookings Stats */}
            <h2 className="text-xl font-semibold text-gray-700">Bookings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {bookingsStats.map((stat) => (
                    <div
                        key={stat.label}
                        className={`flex flex-col items-center justify-center p-6 rounded-lg shadow-lg transition ${
                            stat.label === 'Unpaid Bookings' && stat.value > 0
                                ? 'bg-red-100/50 hover:bg-red-200'
                                : 'bg-primary-bg/50 hover:shadow-xl'
                        }`}
                    >
                        <div className="mb-2">{stat.icon}</div>
                        <p className="text-xl font-semibold text-gray-800">
                            {stat.value}
                        </p>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap justify-between md:justify-start gap-4 mt-4">
                {buttons.map((btn) => (
                    <Link
                        key={btn.label}
                        href={btn.href}
                        className={`px-6 py-3 rounded-lg font-medium transition hover:opacity-90 ${
                            btn.primary
                                ? 'bg-btn text-white'
                                : 'bg-primary-bg/70 text-black hover:bg-primary-bg/90'
                        }`}
                    >
                        {btn.label}
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default AdminOverview
