'use client'
import { useState } from 'react'
import BookingCard from '@/components/profile/BookingCard'
import DeleteModal from '@/components/modals/DeleteItemModal'
import SectionDivider from '@/components/shared/ui/SectionDivider'
import { useAuth } from '@/context/AuthContext'
import { useProfile } from '@/hooks/useProfile'
import Link from 'next/link'

const ProfilePage = () => {
    const { user } = useAuth()
    const { profile, bookings, loading, cancelBooking } = useProfile(user?.id)

    const [selectedBooking, setSelectedBooking] = useState<string | null>(null)

    if (loading) return <p className="p-6 text-center">Loading...</p>

    const now = new Date()

    const upcoming = bookings.filter((b) => {
        if (!b.classes) return false
        const classEnd = new Date(`${b.classes.date}T${b.classes.end_time}`)
        return classEnd >= now // allt som fortfarande pågår idag eller senare
    })

    // Past classes
    const history = bookings.filter((b) => {
        if (!b.classes) return false
        const classEnd = new Date(`${b.classes.date}T${b.classes.end_time}`)
        return classEnd < now // allt som redan är över
    })

    return (
        <section className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <header className="space-y-2 text-center">
                <h1 className="text-3xl font-bold fancy-font tracking-wide leading-tight">
                    Welcome to your profile 👋
                </h1>
                <p className="text-gray-700">{user?.email}</p>
            </header>

            {profile?.is_admin && (
                <div className="mt-4 text-center">
                    <Link
                        href="/admin"
                        className="inline-block px-6 py-3 bg-btn text-white rounded-lg font-medium hover:opacity-90 transition"
                    >
                        Go to Admin Panel
                    </Link>
                </div>
            )}

            {/* Upcoming Bookings */}
            <div className="mt-12">
                <h2 className="text-2xl font-semibold pb-2">
                    Upcoming Bookings
                </h2>
                {upcoming.length === 0 ? (
                    <p className="text-gray-500 text-center">
                        No upcoming bookings.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {upcoming.map((b) => (
                            <BookingCard
                                key={b.id}
                                booking={b}
                                onCancel={() => setSelectedBooking(b.id)}
                                showCancel
                            />
                        ))}
                    </div>
                )}
            </div>

            <SectionDivider className="h-[3px] w-[85%] bg-btn my-9" />

            <div>
                <h2 className="text-2xl font-semibold pb-2">History</h2>
                {history.length === 0 ? (
                    <p className="text-gray-500 text-center">
                        No previous bookings.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {history.map((b) => (
                            <BookingCard key={b.id} booking={b} />
                        ))}
                    </div>
                )}
            </div>

            {selectedBooking && (
                <DeleteModal
                    item={bookings.find((b) => b.id === selectedBooking)!}
                    type="booking"
                    classInfo={
                        bookings.find((b) => b.id === selectedBooking)
                            ?.classes || undefined
                    }
                    isOpen={!!selectedBooking}
                    onClose={() => setSelectedBooking(null)}
                    onConfirm={async () => {
                        await cancelBooking(selectedBooking)
                        setSelectedBooking(null)
                    }}
                />
            )}
        </section>
    )
}

export default ProfilePage
