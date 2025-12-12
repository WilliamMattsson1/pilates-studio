'use client'

import { BookingItem } from '@/types/bookings'
import { ClassItem } from '@/types/classes'
import { MessageCircleWarning, X } from 'lucide-react'
import SectionDivider from '../shared/ui/SectionDivider'

type DeleteType = 'class' | 'booking'

interface DeleteModalProps {
    item: ClassItem | BookingItem
    type: DeleteType
    classInfo?: ClassItem // Endast för bokningar, för att visa klassinfo
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
}

const DeleteModal = ({
    item,
    type,
    classInfo,
    isOpen,
    onClose,
    onConfirm
}: DeleteModalProps) => {
    if (!isOpen || !item) return null

    // Bestäm titel, datum och tider baserat på typ
    const title =
        type === 'class'
            ? (item as ClassItem).title
            : (item as BookingItem).details.guest_name ||
              (item as BookingItem).details.guest_email ||
              'Anonymous'

    const date = type === 'class' ? (item as ClassItem).date : ''
    const startTime = type === 'class' ? (item as ClassItem).start_time : ''
    const endTime = type === 'class' ? (item as ClassItem).end_time : ''

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={onClose}
        >
            <div
                className="bg-primary-bg rounded-2xl shadow-xl w-full  p-6 relative md:max-w-xl max-w-[90%]"
                onClick={(e) => e.stopPropagation()} // Stoppar klick inne i modal
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 hover:cursor-pointer transition-colors"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-semibold mb-4 text-center">
                    Confirm Delete
                </h2>

                <MessageCircleWarning
                    size={58}
                    className="mx-auto mb-4 text-red-400"
                />

                <p className="text-center mb-4">
                    Are you sure you want to delete this {type}?
                </p>
                {type === 'class' && (
                    <p className="text-center mb-6 font-medium">
                        {title} | {date} | {startTime} - {endTime}
                    </p>
                )}
                {type === 'booking' && (
                    <>
                        <SectionDivider className="h-1 w-[70%] bg-icon my-5" />

                        <p className="text-center font-medium">{title}</p>
                        <p className="mb-6 text-center text-gray-500 italic">
                            {classInfo
                                ? `(${classInfo.title} | ${classInfo.date} | ${classInfo.start_time} - ${classInfo.end_time})`
                                : ''}
                        </p>
                    </>
                )}

                <div className="flex justify-center gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-200 hover:cursor-pointer transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 hover:cursor-pointer transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteModal
