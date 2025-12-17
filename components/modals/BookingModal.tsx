'use client'

import { useState } from 'react'
import { useBookings } from '@/context/BookingsContext'
import { useBookingModal } from '@/context/BookingModalContext'
import { toast } from 'react-toastify'
import { User, Mail, Calendar } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useProfile } from '@/hooks/useProfile'
import { useRouter } from 'next/navigation'
import CancellationPolicy from '../shared/CancellationPolicy'
import { isStripeEnabled } from '@/lib/payments/stripeEnabled'

const BookingModal = () => {
    const { isOpen, selectedClass, closeModal } = useBookingModal()
    const { bookings } = useBookings()
    const { user } = useAuth()
    const { profile } = useProfile(user?.id)
    const router = useRouter()

    const [guestName, setGuestName] = useState('')
    const [guestEmail, setGuestEmail] = useState('')

    const isLoggedIn = user

    if (!isOpen || !selectedClass) return null

    const bookedSpots = bookings.filter(
        (b) => b.class_id === selectedClass.id
    ).length

    const isFull = bookedSpots >= selectedClass.max_spots

    // const alreadyBooked = bookings.some((b) => {
    //     const isSameClass = b.class_id === selectedClass.id

    //     if (isLoggedIn) {
    //         const isSameUser = b.user_id === user.id
    //         return isSameClass && isSameUser
    //     } else {
    //         const isSameGuest = b.guest_email === guestEmail
    //         return isSameClass && isSameGuest
    //     }
    // })

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

        const bookingData = {
            classId: selectedClass.id,
            title: selectedClass.title,
            date: selectedClass.date,
            startTime: selectedClass.start_time,
            endTime: selectedClass.end_time,
            price: selectedClass.price,
            guestName: isLoggedIn ? profile?.name : guestName,
            guestEmail: isLoggedIn ? user.email : guestEmail
        }

        const params = new URLSearchParams()
        params.set('classId', bookingData.classId)
        params.set('title', bookingData.title)
        params.set('date', bookingData.date)
        params.set('startTime', bookingData.startTime)
        params.set('endTime', bookingData.endTime)
        params.set('guestName', bookingData.guestName || '')
        params.set('guestEmail', bookingData.guestEmail || '')

        // Frontend väljer endast vilken sida vi navigerar till.
        // Själva valet av betalningsleverantör är alltid
        // säkrat på serversidan via STRIPE_ENABLED-flaggan.
        const basePath = isStripeEnabled()
            ? '/checkout/stripe'
            : '/checkout/swish'
        router.push(`${basePath}?${params.toString()}`)

        handleClose()
    }

    const handleClose = () => {
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
                className="bg-primary-bg rounded-xl w-full p-6 shadow-xl relative md:max-w-xl max-w-[90%]"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-black hover:cursor-pointer"
                >
                    ✕
                </button>

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
                                <User size={20} className="text-gray-500" />
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
                                <Mail size={20} className="text-gray-500" />
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
                        <User size={16} /> Booking as:{' '}
                        <span className="font-medium">{user.email}</span>
                    </p>
                )}

                <p className="text-2xl font-bold text-gray-900 mb-1">
                    {selectedClass.price}kr
                </p>

                <CancellationPolicy className="mb-2" />
                {/* {alreadyBooked && !isFull && (
                    <p className="mb-2 text-sm text-yellow-600 flex items-center gap-1">
                        <AlertTriangle size={16} />
                        You have already booked this class. Are you sure you
                        want to book again?
                    </p>
                )} */}
                <button
                    onClick={handleBooking}
                    disabled={isFull}
                    className="w-full bg-btn text-white p-3 rounded hover:bg-btn-hover disabled:bg-gray-400 hover:cursor-pointer"
                >
                    {isFull ? 'Class Full' : 'Confirm Booking'}
                </button>
            </div>
        </div>
    )
}

export default BookingModal
