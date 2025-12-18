'use client'
import { useBookings } from '@/context/BookingsContext'
import { useClasses } from '@/context/ClassesContext'
import { BookingItem } from '@/types/bookings'
import { ClassItem } from '@/types/classes'
import { ChevronDownIcon, Calendar, Users } from 'lucide-react'
import { useState } from 'react'
import DeleteModal from '../modals/DeleteItemModal'
import RefundModal from '../modals/RefundModal'
import { useAdminBookings } from '@/hooks/useAdminBookings'
import BookingCard from './BookingCard'
import { getBookingStatus } from '@/utils/bookings'

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
    const { deleteBooking, markBookingAsPaid } = useBookings()

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

    const handleMarkPaid = async (bookingId: string) => {
        try {
            await markBookingAsPaid(bookingId)
            fetchBookings()
        } catch (err) {
            console.error('Failed to mark booking as paid', err)
        }
    }

    // Funktion för att bestämma badge-variant baserat på status

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
                        className="shadow-lg rounded-xl bg-primary-bg overflow-hidden"
                    >
                        <div
                            className="flex justify-between items-center p-4 cursor-pointer"
                            onClick={() => toggleExpand(cls.id)}
                        >
                            <div>
                                <h3 className="font-semibold text-lg">
                                    {cls.title}
                                </h3>
                                <p className="text-gray-600 text-sm flex items-center mt-1">
                                    <Calendar
                                        size={14}
                                        className="inline mr-2"
                                    />
                                    {cls.date} | {cls.start_time} -{' '}
                                    {cls.end_time}
                                </p>
                                <p
                                    className={`font-medium text-sm flex items-center mt-1 ${
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
                                    clsBookings.map((b) => {
                                        const status = getBookingStatus(b)
                                        const isRefunded = Boolean(
                                            b.details?.refunded
                                        )

                                        return (
                                            <BookingCard
                                                key={b.id}
                                                booking={b}
                                                handleMarkPaid={handleMarkPaid}
                                                setBookingToRefund={
                                                    setBookingToRefund
                                                }
                                                setIsRefundModalOpen={
                                                    setIsRefundModalOpen
                                                }
                                                setBookingToDelete={
                                                    setBookingToDelete
                                                }
                                                setIsDeleteModalOpen={
                                                    setIsDeleteModalOpen
                                                }
                                                isRefunded={isRefunded}
                                                status={status}
                                            />
                                        )
                                    })
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
