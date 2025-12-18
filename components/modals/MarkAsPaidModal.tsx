'use client'
import { BookingItem } from '@/types/bookings'
import { ClassItem } from '@/types/classes'
import { X, CheckCircle2 } from 'lucide-react'
import SectionDivider from '../shared/ui/SectionDivider'

interface MarkPaidModalProps {
    booking: BookingItem
    classInfo?: ClassItem
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    isProcessing: boolean
    success?: boolean
    error?: string | null
}

const MarkAsPaidModal = ({
    booking,
    classInfo,
    isOpen,
    onClose,
    onConfirm,
    isProcessing,
    success,
    error
}: MarkPaidModalProps) => {
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
                    {success ? 'Payment Confirmed' : 'Mark as Paid'}
                </h2>

                <CheckCircle2
                    size={58}
                    className={`mx-auto mb-4 ${
                        success ? 'text-green-500' : 'text-blue-500'
                    }`}
                />

                <div className="text-center mb-6">
                    <p className="font-semibold text-lg">
                        {booking.details.guest_name ||
                            booking.details.guest_email ||
                            'Anonymous'}
                    </p>
                    {booking.details.guest_email && (
                        <p className="text-gray-600">
                            {booking.details.guest_email}
                        </p>
                    )}
                    {classInfo && (
                        <p className="mt-3 text-gray-500 italic">
                            {classInfo.title} | {classInfo.date} |{' '}
                            {classInfo.start_time} - {classInfo.end_time}
                        </p>
                    )}

                    {error && !success && (
                        <div className="bg-red-100 w-fit mx-auto py-2 px-4 rounded-full text-red-700 mt-2 text-sm">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-100 w-fit mx-auto py-2 px-4 rounded-full text-green-700 mt-2 text-sm">
                            Booking has been marked as paid.
                        </div>
                    )}
                </div>

                <div className="mt-2 text-gray-700 font-medium text-center">
                    {classInfo?.price ? (
                        <>Price: {classInfo.price} kr</>
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
                            Loading price...
                        </span>
                    )}
                </div>

                <SectionDivider className="h-1 w-[70%] bg-icon my-5 mx-auto" />

                <div className="flex justify-center gap-4">
                    {!success ? (
                        <>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-200 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => onConfirm()}
                                disabled={isProcessing}
                                className={`px-4 py-2 bg-blue-500 text-white rounded-lg transition hover:bg-blue-600 ${
                                    isProcessing
                                        ? 'opacity-50 cursor-not-allowed'
                                        : ''
                                }`}
                            >
                                {isProcessing
                                    ? 'Processing...'
                                    : 'Confirm Payment'}
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-green-400 text-white rounded-lg hover:bg-green-500 transition"
                        >
                            Done
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MarkAsPaidModal
