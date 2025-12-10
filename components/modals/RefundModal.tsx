'use client'
import { useEffect, useState } from 'react'
import { BookingItem } from '@/types/bookings'
import { ClassItem } from '@/types/classes'
import { X, RotateCcw } from 'lucide-react'
import SectionDivider from '../shared/ui/SectionDivider'

interface RefundModalProps {
    booking: BookingItem
    classInfo?: ClassItem
    isOpen: boolean
    onClose: () => void
    onConfirm: (deleteAfterRefund: boolean) => void
    refundSuccess?: boolean
    refundError?: string | null
    isRefunding: boolean
}

const RefundModal = ({
    booking,
    classInfo,
    isOpen,
    onClose,
    onConfirm,
    refundSuccess,
    refundError,
    isRefunding
}: RefundModalProps) => {
    const [amount, setAmount] = useState<number | null>(null)
    const [currency, setCurrency] = useState<string | null>(null)

    const [deleteAfterRefund, setDeleteAfterRefund] = useState(false)

    useEffect(() => {
        if (!booking || !isOpen) return

        setAmount(null)
        setCurrency(null)

        const fetchPayment = async () => {
            try {
                const res = await fetch('/api/payment-info', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        payment_intent: booking.stripe_payment_id
                    })
                })
                const data = await res.json()
                setAmount(data.amount)
                setCurrency(data.currency)
            } catch (e) {
                console.error('Fetch payment info error', e)
            }
        }

        fetchPayment()
    }, [booking, isOpen])

    if (!isOpen || !booking) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={onClose}
        >
            <div
                className="bg-primary-bg rounded-2xl shadow-xl w-full p-6 relative md:max-w-xl max-w-[90%]"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-semibold mb-4 text-center">
                    {refundSuccess ? 'Refund Completed' : 'Confirm Refund'}
                </h2>
                <RotateCcw
                    size={58}
                    className={`mx-auto mb-4 ${
                        refundSuccess ? 'text-green-500' : 'text-yellow-500'
                    }`}
                />

                <div className="text-center mb-6">
                    <p className="font-semibold text-lg">
                        {booking.guest_name ||
                            booking.guest_email ||
                            'Anonymous'}
                    </p>
                    {booking.guest_email && (
                        <p className="text-gray-600">{booking.guest_email}</p>
                    )}
                    {classInfo && (
                        <p className="mt-3 text-gray-500 italic">
                            {classInfo.title} — {classInfo.date} |{' '}
                            {classInfo.start_time} - {classInfo.end_time}
                        </p>
                    )}

                    {/* Spinner till priset hämtats */}
                    <div className="mt-2 text-gray-700 font-medium">
                        {amount === null && !refundSuccess ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
                                Loading price...
                            </span>
                        ) : (
                            !refundSuccess && (
                                <>
                                    Price: {(amount! / 100).toFixed(2)}{' '}
                                    {currency?.toUpperCase()}
                                </>
                            )
                        )}
                    </div>

                    {refundError && !refundSuccess && (
                        <div>
                            <p className="bg-red-100 w-fit mx-auto py-2 px-4 rounded-full text-red-700 mt-2 text-sm">
                                {refundError}adsfasdfasd
                            </p>
                        </div>
                    )}
                    {refundSuccess && (
                        <div>
                            <p className="bg-green-100 w-fit mx-auto py-2 px-4 rounded-full text-green-700 mt-2 text-sm">
                                Refund succeeded!{' '}
                                {deleteAfterRefund
                                    ? 'Booking also deleted successfully.'
                                    : ''}
                            </p>
                        </div>
                    )}
                </div>

                <SectionDivider className="h-1 w-[70%] bg-icon my-5" />

                <div className="mb-4 flex items-center justify-center gap-1">
                    {!refundSuccess && !isRefunding && (
                        <>
                            <input
                                type="checkbox"
                                id="deleteBooking"
                                checked={deleteAfterRefund}
                                onChange={(e) =>
                                    setDeleteAfterRefund(e.target.checked)
                                }
                                className="w-4 h-4"
                            />
                            <label
                                htmlFor="deleteBooking"
                                className="text-sm medium text-gray-700"
                            >
                                Remove booking from class after refund
                            </label>
                        </>
                    )}
                </div>

                <div className="flex justify-center gap-4">
                    {!refundSuccess ? (
                        <>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-200 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => onConfirm(deleteAfterRefund)}
                                disabled={isRefunding || !amount}
                                className={`px-4 py-2 bg-yellow-500 text-white rounded-lg transition hover:bg-yellow-600 ${
                                    isRefunding || !amount
                                        ? 'opacity-50 cursor-not-allowed'
                                        : ''
                                }`}
                            >
                                {isRefunding ? 'Processing...' : 'Refund'}
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-green-400 text-white rounded-lg hover:bg-green-500 transition "
                        >
                            Done
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default RefundModal
