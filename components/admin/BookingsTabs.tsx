'use client'

import { useState } from 'react'
import { useClasses } from '@/context/ClassesContext'
import { useBookings } from '@/context/BookingsContext'
import { toast } from 'react-toastify'
import { ClassItem } from '@/types/classes'
import { BookingItem } from '@/types/bookings'
import { ChevronDownIcon } from 'lucide-react'
import DeleteModal from '../modals/DeleteItemModal'

const BookingsTabs = () => {
    const [activeTab, setActiveTab] = useState<'all' | 'add'>('all')
    const { upcomingClasses } = useClasses()
    const { bookings, deleteBooking } = useBookings()

    const [expandedClasses, setExpandedClasses] = useState<string[]>([
        upcomingClasses[0]?.id || ''
    ])
    const [bookingToDelete, setBookingToDelete] = useState<BookingItem | null>(
        null
    )
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    const toggleExpand = (classId: string) => {
        setExpandedClasses(
            (prev) =>
                prev.includes(classId)
                    ? prev.filter((id) => id !== classId) // stäng den, men lämna andra öppna
                    : [...prev, classId] // öppna
        )
    }

    const getBookingsForClass = (cls: ClassItem) =>
        bookings.filter((b) => b.classId === cls.id)

    const handleConfirmDelete = () => {
        if (!bookingToDelete) return
        deleteBooking(bookingToDelete.id)
        setIsDeleteModalOpen(false)
        setBookingToDelete(null)
        toast.success('Booking cancelled successfully!')
    }

    return (
        <div className="mt-9 flex flex-col items-center w-[90%] max-w-2xl mx-auto ">
            {/* Tabs */}
            <div className="flex bg-primary-bg rounded-full shadow-sm p-2 w-fit">
                <button
                    className={`flex-1 py-2 px-8 rounded-full text-md font-medium transition-colors
                        ${activeTab === 'all' && 'bg-btn text-white'}`}
                    onClick={() => setActiveTab('all')}
                >
                    All Bookings
                </button>
                <button
                    className={`flex-1 py-2 px-8 rounded-full text-md font-medium transition-colors
                        ${activeTab === 'add' && 'bg-btn text-white'}`}
                    onClick={() => setActiveTab('add')}
                >
                    Add Booking
                </button>
            </div>

            {/* Tab content */}
            <div className="w-full py-4">
                {activeTab === 'all' ? (
                    <div className="flex flex-col gap-4 w-full">
                        {upcomingClasses.map((cls) => {
                            const clsBookings = getBookingsForClass(cls)
                            const isExpanded = expandedClasses.includes(cls.id)
                            const bookedCount = clsBookings.length
                            const isFull = bookedCount >= cls.maxSpots

                            return (
                                <div
                                    key={cls.id}
                                    className="shadow-lg rounded-md  bg-primary-bg overflow-hidden"
                                >
                                    <div
                                        className="flex justify-between items-center p-4 cursor-pointer"
                                        onClick={() => toggleExpand(cls.id)}
                                    >
                                        <div>
                                            <h3 className="font-semibold">
                                                {cls.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm">
                                                {cls.date} | {cls.startTime} -{' '}
                                                {cls.endTime}
                                            </p>
                                            <p
                                                className={`font-medium text-sm ${
                                                    isFull
                                                        ? 'text-red-500'
                                                        : 'text-green-500'
                                                }`}
                                            >
                                                Booked: {bookedCount}/
                                                {cls.maxSpots}
                                                {isFull ? ' (Full)' : ''}
                                            </p>
                                        </div>
                                        <ChevronDownIcon
                                            className={`transition-transform duration-300 ${
                                                isExpanded ? 'rotate-180' : ''
                                            }`}
                                        />
                                    </div>

                                    {/* Booking list */}
                                    {isExpanded && (
                                        <div className="p-4 border-t flex flex-col gap-2">
                                            {clsBookings.length === 0 ? (
                                                <p className="text-gray-700 text-sm">
                                                    No bookings yet.
                                                </p>
                                            ) : (
                                                clsBookings.map((b) => (
                                                    <div
                                                        key={b.id}
                                                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                                                    >
                                                        <div>
                                                            <p className="font-medium">
                                                                {b.guestName ||
                                                                    'Anonymous'}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                {b.guestEmail ||
                                                                    ''}
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                setBookingToDelete(
                                                                    b
                                                                )
                                                                setIsDeleteModalOpen(
                                                                    true
                                                                )
                                                            }}
                                                            className="px-3 py-1 bg-red-400 text-white rounded hover:opacity-90 transition"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            )
                        })}

                        {/* Delete modal */}
                        {bookingToDelete && (
                            <DeleteModal
                                item={bookingToDelete}
                                type="booking"
                                classInfo={upcomingClasses.find(
                                    (c) => c.id === bookingToDelete.classId
                                )}
                                isOpen={isDeleteModalOpen}
                                onClose={() => setIsDeleteModalOpen(false)}
                                onConfirm={handleConfirmDelete}
                            />
                        )}
                    </div>
                ) : (
                    // Add booking form placeholder
                    <div>Form to add manual booking goes here.</div>
                )}
            </div>
        </div>
    )
}

export default BookingsTabs
