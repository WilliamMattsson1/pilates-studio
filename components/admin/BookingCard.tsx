'use client'
import { BookingItem } from '@/types/bookings'
import { isBookingPaid, needsManualPayment } from '@/utils/bookings'
import { CheckCircle2, Repeat, Trash2, User } from 'lucide-react'

interface BookingCardProps {
    booking: BookingItem
    setBookingToRefund: (booking: BookingItem | null) => void
    setIsRefundModalOpen: (open: boolean) => void
    setBookingToDelete: (booking: BookingItem | null) => void
    setIsDeleteModalOpen: (open: boolean) => void
    setBookingToMarkAsPaid: (booking: BookingItem | null) => void
    setIsBookingToMarkAsPaidModalOpen: (open: boolean) => void
    isRefunded: boolean
    status: { label: string; bgColor: string; textColor: string }
}

const BookingCard = ({
    booking: b,
    setBookingToRefund,
    setIsRefundModalOpen,
    setBookingToDelete,
    setIsDeleteModalOpen,
    setBookingToMarkAsPaid,
    setIsBookingToMarkAsPaidModalOpen,
    isRefunded,
    status
}: BookingCardProps) => {
    const isPaid = isBookingPaid(b, isRefunded)
    const requiresManualPaymentConfirmation = needsManualPayment(b, isRefunded)
    return (
        <div
            className={`rounded-lg px-3 py-3 border ${
                isRefunded
                    ? 'bg-gray-200 border-gray-200 text-gray-500'
                    : !isPaid
                      ? 'bg-red-100 border-red-300'
                      : 'bg-card/70 border-secondary-bg text-black'
            } shadow-sm`}
        >
            <div className="flex items-center justify-between gap-2">
                {/* Guest info - left */}
                <div className="flex items-center flex-1 min-w-0">
                    <div className="p-2 rounded-full shrink-0">
                        <User size={22} className="text-gray-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                            {b.details?.guest_name || ''}
                        </p>
                        <p className="text-sm text-gray-600 break-all">
                            {b.details?.guest_email || ''}
                        </p>
                    </div>
                </div>

                {/* Badge + Buttons - right */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                    <span
                        className={`
                            inline-flex items-center
                            px-3 py-1.5 rounded-md text-xs font-medium
                            ${status.bgColor} ${status.textColor}
                        `}
                    >
                        {status.label}
                    </span>

                    <div className="flex items-center gap-2">
                        {requiresManualPaymentConfirmation && (
                            <button
                                onClick={() => {
                                    setBookingToMarkAsPaid(b)
                                    setIsBookingToMarkAsPaidModalOpen(true)
                                }}
                                className="
                                    flex items-center justify-center
                                    w-10 h-10
                                    bg-blue-400 hover:bg-blue-500
                                    text-white
                                    rounded-md
                                    transition-colors
                                "
                                aria-label="Mark as paid"
                                title="Mark Paid"
                            >
                                <CheckCircle2 size={18} />
                            </button>
                        )}

                        {b.details?.stripe_payment_id && !isRefunded && (
                            <button
                                onClick={() => {
                                    setBookingToRefund(b)
                                    setIsRefundModalOpen(true)
                                }}
                                className="
                                    flex items-center justify-center
                                    w-10 h-10
                                    bg-yellow-500 hover:bg-yellow-600
                                    text-white
                                    rounded-md
                                    transition-colors
                                "
                                aria-label="Refund booking"
                                title="Refund"
                            >
                                <Repeat size={18} />
                            </button>
                        )}

                        <button
                            onClick={() => {
                                setBookingToDelete(b)
                                setIsDeleteModalOpen(true)
                            }}
                            className="
                                flex items-center justify-center
                                w-10 h-10
                                bg-red-400 hover:bg-red-500
                                text-white
                                rounded-md
                                transition-colors
                            "
                            aria-label="Delete booking"
                            title="Delete"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookingCard
