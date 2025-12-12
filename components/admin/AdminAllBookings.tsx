'use client'
import { useBookings } from '@/context/BookingsContext'
import { useClasses } from '@/context/ClassesContext'
import { BookingItem } from '@/types/bookings'
import { ClassItem } from '@/types/classes'
import {
    ChevronDownIcon,
    Calendar,
    Users,
    User,
    Trash2,
    Repeat
} from 'lucide-react'
import { useState } from 'react'
import DeleteModal from '../modals/DeleteItemModal'
import RefundModal from '../modals/RefundModal'
import { useAdminBookings } from '@/hooks/useAdminBookings'

const FILTERS = [
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'past', label: 'Past' }
]

const AdminAllBookings = () => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isRefundModalOpen, setIsRefundModalOpen] = useState(false)
    const [bookingToRefund, setBookingToRefund] = useState<BookingItem | null>(
        null
    )

    const [isRefunding, setIsRefunding] = useState(false)
    const [refundError, setRefundError] = useState<string | null>(null)
    const [refundSuccess, setRefundSuccess] = useState(false)

    const { upcomingClasses, pastClasses } = useClasses()
    const { deleteBooking } = useBookings()

    const { bookings, fetchBookings } = useAdminBookings()

    const [expandedClasses, setExpandedClasses] = useState<string[]>([
        upcomingClasses[0]?.id || ''
    ])
    const [bookingToDelete, setBookingToDelete] = useState<BookingItem | null>(
        null
    )
    const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming')

    const toggleExpand = (classId: string) => {
        setExpandedClasses(
            (prev) =>
                prev.includes(classId)
                    ? prev.filter((id) => id !== classId) // stäng den, men lämna andra öppna
                    : [...prev, classId] // öppna
        )
    }

    const getBookingsForClass = (cls: ClassItem) =>
        bookings.filter((b) => b.class_id === cls.id)

    const handleConfirmDelete = async () => {
        if (!bookingToDelete) return

        try {
            await deleteBooking(bookingToDelete.id)
            setBookingToDelete(null)
            setIsDeleteModalOpen(false)
            fetchBookings()
        } catch (err) {
            console.error(err)
        }
        fetchBookings()
    }

    const handleRefund = async (
        booking: BookingItem,
        deleteAfterRefund: boolean
    ) => {
        setIsRefunding(true)
        setRefundError(null)
        setRefundSuccess(false)

        try {
            const res = await fetch('/api/refund', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    payment_intent: booking.details.stripe_payment_id,
                    booking_id: booking.id
                })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Refund failed')
            }

            if (data.alreadyRefunded) {
                setRefundSuccess(true)
                return
            }

            setRefundSuccess(true)

            // Ta bort bokningen efter att refund gick igenom (om checkbox === checked)
            if (deleteAfterRefund) {
                await deleteBooking(booking.id)
            }
            fetchBookings()
        } catch (err: any) {
            console.error(err)
            setRefundError(err.message || 'Refund failed')
        } finally {
            setIsRefunding(false)
        }
    }

    const classesToShow = filter === 'upcoming' ? upcomingClasses : pastClasses

    return (
        <div className="flex flex-col gap-4 pb-6 w-full max-w-[90%] mx-auto">
            <div className="flex gap-2">
                {FILTERS.map(({ key, label }) => (
                    <button
                        key={key}
                        className={`px-4 py-2 rounded-full shadow-lg transition hover:cursor-pointer ${
                            filter === key
                                ? 'bg-btn text-white'
                                : 'bg-primary-bg hover:bg-btn/20'
                        }`}
                        onClick={() => setFilter(key as 'upcoming' | 'past')}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {classesToShow.map((cls) => {
                const clsBookings = getBookingsForClass(cls)
                const isExpanded = expandedClasses.includes(cls.id)
                const bookedCount = clsBookings.length
                const isFull = bookedCount >= cls.max_spots

                return (
                    <div
                        key={cls.id}
                        className="shadow-lg rounded-md bg-primary-bg overflow-hidden "
                    >
                        <div
                            className="flex justify-between items-center p-4 cursor-pointer"
                            onClick={() => toggleExpand(cls.id)}
                        >
                            <div>
                                <h3 className="font-semibold">{cls.title}</h3>
                                <p className="text-gray-600 text-sm flex items-center">
                                    <Calendar
                                        size={14}
                                        className="inline mr-2"
                                    />
                                    {cls.date} | {cls.start_time} -{' '}
                                    {cls.end_time}
                                </p>
                                <p
                                    className={`font-medium text-sm flex items-center ${
                                        isFull
                                            ? 'text-red-500'
                                            : 'text-green-600'
                                    }`}
                                >
                                    <Users size={16} className="inline mr-2" />
                                    {'Booked'}: {bookedCount}/{cls.max_spots}
                                    {isFull ? ' (Full)' : ''}
                                </p>
                            </div>

                            <ChevronDownIcon
                                className={`transition-transform duration-300 ${
                                    isExpanded ? 'rotate-180' : ''
                                }`}
                            />
                        </div>

                        {isExpanded && (
                            <div className="p-4 border-t flex flex-col gap-3">
                                {clsBookings.length === 0 ? (
                                    <p className="text-gray-700 text-sm">
                                        No bookings yet.
                                    </p>
                                ) : (
                                    clsBookings.map((b) => (
                                        <div
                                            key={b.id}
                                            className="flex justify-between items-center p-3 bg-secondary-bg/50 rounded-md"
                                        >
                                            <div className="flex items-center">
                                                <User
                                                    size={26}
                                                    className="mr-2"
                                                />
                                                <div>
                                                    <p className="font-medium">
                                                        {b.details
                                                            ?.guest_name || ''}
                                                    </p>
                                                    <p
                                                        className={` ${
                                                            b.details
                                                                ?.guest_email &&
                                                            !b.details
                                                                .guest_name
                                                                ? 'font-medium text-black'
                                                                : 'text-gray-600 text-sm'
                                                        }`}
                                                    >
                                                        {b.details
                                                            ?.guest_email || ''}
                                                    </p>
                                                </div>
                                            </div>
                                            {b.details.refunded && (
                                                <span className="px-4 py-2 text-xs font-semibold bg-red-100 text-red-800 rounded-full">
                                                    Refunded
                                                </span>
                                            )}

                                            {!b.details.stripe_payment_id && (
                                                <span className="px-4 py-2 text-xs font-semibold bg-gray-300 text-gray-800 rounded-full">
                                                    Manual
                                                </span>
                                            )}
                                            <div className="flex gap-2">
                                                {b.details.stripe_payment_id &&
                                                    !b.details.refunded && (
                                                        <button
                                                            onClick={() => {
                                                                setBookingToRefund(
                                                                    b
                                                                )
                                                                setIsRefundModalOpen(
                                                                    true
                                                                )
                                                            }}
                                                            className="px-3 py-2 bg-yellow-500 text-white rounded hover:opacity-90 transition"
                                                            aria-label="Refund booking"
                                                        >
                                                            <Repeat size={14} />
                                                        </button>
                                                    )}
                                                <button
                                                    onClick={() => {
                                                        setBookingToDelete(b)
                                                        setIsDeleteModalOpen(
                                                            true
                                                        )
                                                    }}
                                                    className="px-3 py-2 bg-red-400 text-white rounded hover:opacity-90 transition"
                                                    aria-label="Delete booking"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                )
            })}

            {bookingToDelete && (
                <DeleteModal
                    item={bookingToDelete}
                    type="booking"
                    classInfo={upcomingClasses.find(
                        (c) => c.id === bookingToDelete.class_id
                    )}
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleConfirmDelete}
                />
            )}

            {bookingToRefund && (
                <RefundModal
                    booking={bookingToRefund}
                    classInfo={classesToShow.find(
                        (c) => c.id === bookingToRefund.class_id
                    )}
                    isOpen={isRefundModalOpen}
                    onClose={() => {
                        setIsRefundModalOpen(false)
                        setBookingToRefund(null)
                        setRefundError(null)
                        setRefundSuccess(false)
                    }}
                    onConfirm={(deleteAfterRefund) => {
                        if (bookingToRefund)
                            handleRefund(bookingToRefund, deleteAfterRefund)
                    }}
                    refundSuccess={refundSuccess}
                    refundError={refundError}
                    isRefunding={isRefunding}
                />
            )}
        </div>
    )
}

export default AdminAllBookings
