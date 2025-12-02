'use client'

import { useState } from 'react'
import { useBookings } from '@/context/BookingsContext'
import { useBookingModal } from '@/context/BookingModalContext'
import { toast } from 'react-toastify'
import { User, Mail, Calendar } from 'lucide-react'
import BookingConfirmation from '../classes/BookingConfirmation'
import { useAuth } from '@/context/AuthContext'
import { useProfile } from '@/hooks/useProfile'

const BookingModal = () => {
    const { isOpen, selectedClass, closeModal } = useBookingModal()
    const { bookings, addBooking } = useBookings()
    const { user } = useAuth()
    const { profile } = useProfile(user?.id)

    const [bookingSuccess, setBookingSuccess] = useState(false)
    const [guestName, setGuestName] = useState('')
    const [guestEmail, setGuestEmail] = useState('')

    const isLoggedIn = user

    if (!isOpen || !selectedClass) return null

    const bookedSpots = bookings.filter(
        (b) => b.class_id === selectedClass.id
    ).length

    const isFull = bookedSpots >= selectedClass.max_spots

    const handleBooking = async () => {
        if (isFull) {
            toast.error('Class is full')
            return
        }

        if (!isLoggedIn) {
            if (!guestName.trim()) {
                toast.error('Name is required for guest booking')
                return
            }
            if (!guestEmail.trim()) {
                toast.error('Email is required for guest booking')
                return
            }
        }

        try {
            await addBooking({
                class_id: selectedClass.id,
                user_id: isLoggedIn ? user.id : undefined,
                guest_name: isLoggedIn ? profile?.name || undefined : guestName,
                guest_email: isLoggedIn ? user.email : guestEmail
            })

            setBookingSuccess(true)
        } catch (err) {
            // addBooking kastar error om något går fel (t.ex. class full)
            // Toast visas redan i addBooking, så här behöver vi inget mer
        }
    }

    const handleClose = () => {
        setBookingSuccess(false)
        setGuestName('')
        setGuestEmail('')

        closeModal()
    }

    return (
        <div
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
            onClick={handleClose}
        >
            <div
                className="bg-white rounded-xl w-full p-6 shadow-xl relative md:max-w-xl max-w-[90%]"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-black hover:cursor-pointer"
                >
                    ✕
                </button>

                {bookingSuccess ? (
                    <BookingConfirmation
                        title={selectedClass.title}
                        date={selectedClass.date}
                        startTime={selectedClass.start_time}
                        endTime={selectedClass.end_time}
                        onClose={handleClose}
                    />
                ) : (
                    <>
                        <h2 className="text-xl font-semibold mb-2">
                            {selectedClass.title}
                        </h2>
                        <p className="text-sm text-gray-600 mb-4 flex items-center gap-1">
                            <Calendar size={16} />
                            {selectedClass.date} • {selectedClass.start_time}-
                            {selectedClass.end_time}
                        </p>
                        <p className="text-sm mb-4">
                            {bookedSpots}/{selectedClass.max_spots} booked
                        </p>

                        {!isLoggedIn ? (
                            <>
                                <div className="flex flex-col gap-1 mb-3">
                                    <label
                                        htmlFor="guestName"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Your Name
                                    </label>
                                    <div className="flex items-center gap-3 px-3 py-3 bg-secondary-bg/50 rounded-lg focus-within:ring-2 focus-within:ring-btn/50 transition">
                                        <User
                                            size={20}
                                            className="text-gray-500"
                                        />
                                        <input
                                            id="guestName"
                                            name="guestName"
                                            type="text"
                                            value={guestName}
                                            onChange={(e) =>
                                                setGuestName(e.target.value)
                                            }
                                            placeholder="John Doe"
                                            required
                                            className="flex-1 bg-transparent outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1 mb-4">
                                    <label
                                        htmlFor="guestEmail"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Email (required)
                                    </label>
                                    <div className="flex items-center gap-3 px-3 py-3 bg-secondary-bg/50 rounded-lg focus-within:ring-2 focus-within:ring-btn/50 transition">
                                        <Mail
                                            size={20}
                                            className="text-gray-500"
                                        />
                                        <input
                                            id="guestEmail"
                                            name="guestEmail"
                                            type="email"
                                            value={guestEmail}
                                            onChange={(e) =>
                                                setGuestEmail(e.target.value)
                                            }
                                            placeholder="your@email.com"
                                            required
                                            className="flex-1 bg-transparent outline-none"
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p className="text-sm text-gray-700 mb-3 flex items-center gap-1">
                                {/* TODO Change after auth */}
                                <User size={16} /> Booking as:{' '}
                                <span className="font-medium">
                                    {user.email}
                                </span>
                            </p>
                        )}

                        <p className="text-2xl font-bold text-gray-900 mb-1">
                            {selectedClass.price}kr
                        </p>
                        <p className="text-sm italic text-gray-500 mb-4">
                            Free cancellation if you cancel at least 24h before
                            class start
                        </p>
                        <button
                            onClick={handleBooking}
                            disabled={isFull}
                            className="w-full bg-btn text-white p-3 rounded hover:opacity-90 disabled:bg-gray-400 hover:cursor-pointer"
                        >
                            {isFull ? 'Class Full' : 'Confirm Booking'}
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

export default BookingModal
