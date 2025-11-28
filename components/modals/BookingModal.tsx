'use client'

import { useState } from 'react'
import { useBookings } from '@/context/BookingsContext'
import { useBookingModal } from '@/context/BookingModalContext'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'react-toastify'

interface BookingModalProps {
    userId?: string | null
}

const BookingModal = ({ userId }: BookingModalProps) => {
    const { isOpen, selectedClass, closeModal } = useBookingModal()
    const { bookings, addBooking } = useBookings()

    const [guestName, setGuestName] = useState('')
    const [guestEmail, setGuestEmail] = useState('')

    // TODO Hantera efter auth
    const isLoggedIn = false

    if (!isOpen || !selectedClass) return null

    const bookedSpots = bookings.filter(
        (b) => b.classId === selectedClass.id
    ).length

    const isFull = bookedSpots >= selectedClass.maxSpots

    const handleBooking = () => {
        if (isFull) {
            toast.error('Class is full')
            return
        }

        if (!isLoggedIn && !guestEmail.trim()) {
            toast.error('Email is required for guest booking')
            return
        }

        addBooking({
            id: uuidv4(),
            classId: selectedClass.id,
            userId: isLoggedIn ? userId! : undefined,
            guestName: isLoggedIn ? undefined : guestName || 'Anonymous',
            guestEmail: isLoggedIn ? undefined : guestEmail,
            bookedAt: new Date().toISOString()
        })

        toast.success('Booking completed!')

        setGuestName('')
        setGuestEmail('')

        closeModal()
    }

    return (
        <div
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
            onClick={closeModal}
        >
            <div
                className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={closeModal}
                    className="absolute top-3 right-3 text-gray-500 hover:text-black hover:cursor-pointer"
                >
                    ✕
                </button>

                <h2 className="text-xl font-semibold mb-2">
                    {selectedClass.title}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                    {selectedClass.date} • {selectedClass.startTime}-
                    {selectedClass.endTime}
                </p>

                <p className="text-sm mb-4">
                    {bookedSpots}/{selectedClass.maxSpots} booked
                </p>

                {!isLoggedIn ? (
                    <>
                        <div className="flex flex-col gap-1">
                            <label
                                htmlFor="guestName"
                                className="text-sm font-medium mb-1 text-gray-700"
                            >
                                Your Name
                            </label>
                            <input
                                id="guestName"
                                name="guestName"
                                type="text"
                                value={guestName}
                                onChange={(e) => setGuestName(e.target.value)}
                                placeholder="Optional"
                                className="w-full rounded-lg px-4 py-3 bg-secondary-bg/50 outline-none focus:ring-2 focus:ring-btn/50 transition mb-3"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label
                                htmlFor="guestEmail"
                                className="text-sm font-medium mb-1 text-gray-700"
                            >
                                Email (required)
                            </label>
                            <input
                                id="guestEmail"
                                name="guestEmail"
                                type="email"
                                value={guestEmail}
                                onChange={(e) => setGuestEmail(e.target.value)}
                                placeholder="your@email.com"
                                required
                                className="w-full rounded-lg px-4 py-3 bg-secondary-bg/50 outline-none focus:ring-2 focus:ring-btn/50 transition mb-4"
                            />
                        </div>
                    </>
                ) : (
                    <p className="text-sm text-gray-700 mb-3">
                        Booking as: <span className="font-medium">lalala</span>
                    </p>
                )}

                <button
                    onClick={handleBooking}
                    disabled={isFull}
                    className="w-full bg-btn text-white p-3 rounded hover:opacity-90 disabled:bg-gray-400"
                >
                    {isFull ? 'Class Full' : 'Confirm Booking'}
                </button>
            </div>
        </div>
    )
}

export default BookingModal
