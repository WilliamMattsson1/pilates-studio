'use client'
import BookingCard from '@/components/profile/BookingCard'
import SectionDivider from '@/components/shared/ui/SectionDivider'
import { useAuth } from '@/context/AuthContext'
import { useProfile } from '@/hooks/useProfile'
import Link from 'next/link'

const ProfileSection = () => {
    const { user } = useAuth()
    const { profile, bookings, loading, isAdmin } = useProfile(user?.id)

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
        <section className="max-w-4xl mx-auto p-6 mb-16">
            <header className="space-y-2 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-center fancy-font tracking-wide leading-tight">
                    Welcome To Your Profile {profile?.name}
                </h1>
                <p className="md:mt-1 text-md md:text-xl text-center mt-3 text-black uppercase leading-tight italic">
                    Manage your bookings and stay ready for your next class.
                </p>
            </header>

            {isAdmin && (
                <div className="mt-4 text-center">
                    <Link
                        href="/admin/overview"
                        className="inline-block px-6 py-3 bg-btn text-white rounded-lg font-medium hover:bg-btn-hovertransition"
                    >
                        Go to Admin Panel
                    </Link>
                </div>
            )}

            <div className="mt-12">
                <h2 className="text-2xl font-semibold ">Upcoming Bookings</h2>
                {upcoming.length === 0 ? (
                    <p className="text-gray-500 text-center">
                        No upcoming bookings.
                    </p>
                ) : (
                    <>
                        <p className="text-sm text-gray-600 italic  mb-2">
                            To cancel a booking, please contact your instructor.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {upcoming.map((b) => (
                                <BookingCard key={b.id} booking={b} />
                            ))}
                        </div>
                    </>
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
        </section>
    )
}

export default ProfileSection
