'use client'
import Link from 'next/link'
import { useBookings } from '@/context/BookingsContext'
import { useClasses } from '@/context/ClassesContext'
import { Calendar, Users } from 'lucide-react'
import { useProfiles } from '@/context/ProfilesContext'

const AdminOverview = () => {
    const { upcomingClasses } = useClasses()
    const { bookings } = useBookings()
    const { activeStudents } = useProfiles()

    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay() + 1) // Monday
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6) // Sunday

    // Stats
    const upcomingClassesCount = upcomingClasses.length

    const classesThisWeekCount = upcomingClasses.filter((cls) => {
        const classDate = new Date(cls.date)
        return classDate >= startOfWeek && classDate <= endOfWeek
    }).length

    const totalBookings = bookings.length

    const stats = [
        {
            label: 'Upcoming Classes',
            value: upcomingClassesCount,
            icon: <Calendar className="w-6 h-6 text-btn" />
        },
        {
            label: 'Classes This Week',
            value: classesThisWeekCount,
            icon: <Calendar className="w-6 h-6 text-btn" />
        },
        {
            label: 'Total Bookings',
            value: totalBookings,
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
        {
            label: 'Add New Booking',
            href: '/admin/bookings',
            primary: true
        },
        { label: 'View All Classes', href: '/admin/classes', primary: true },
        { label: 'View All Bookings', href: '/admin/bookings', primary: true },
        { label: 'Back to Homepage', href: '/', primary: false }
    ]

    return (
        <div className="w-[90%] max-w-6xl mx-auto py-8 flex flex-col">
            <h1 className="text-3xl md:text-4xl font-extrabold fancy-font text-black">
                Overview
            </h1>

            {/* Stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-4">
                {stats.map((stat) => (
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
