'use client'

import { useState } from 'react'
import { useBookings } from '@/context/BookingsContext'
import { useClasses } from '@/context/ClassesContext'
import { BookingItem } from '@/types/bookings'
import { ClassItem } from '@/types/classes'
import { Calendar, User, Mail, ChevronDown } from 'lucide-react'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'

const AdminAddBooking = () => {
    const { upcomingClasses } = useClasses()
    const { addBooking, bookings } = useBookings()

    const [selectedClassId, setSelectedClassId] = useState('')
    const [guestName, setGuestName] = useState('')
    const [guestEmail, setGuestEmail] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const selectedClass = upcomingClasses.find((c) => c.id === selectedClassId)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!selectedClassId) {
            toast.error('Please select a class')
            return
        }

        if (!selectedClass) {
            toast.error('Selected class not found')
            return
        }

        const currentBookingsForClass = bookings.filter(
            (b) => String(b.classId) === String(selectedClassId)
        )

        if (currentBookingsForClass.length >= (selectedClass.maxSpots || 0)) {
            toast.error('Denna klass är fullbokad')
            return
        }

        setIsSubmitting(true)

        const newBooking: BookingItem = {
            id: uuidv4(),
            classId: selectedClassId,
            guestName: guestName || 'Anonymous',
            guestEmail: guestEmail || '',
            bookedAt: new Date().toISOString()
        }

        addBooking(newBooking)
        toast.success('Booking added successfully!')

        setSelectedClassId('')
        setGuestName('')
        setGuestEmail('')
        setIsSubmitting(false)
    }

    return (
        <div className="w-full max-w-lg mx-auto bg-primary-bg shadow-lg rounded-lg p-6 mt-4">
            <h2 className="text-xl font-semibold mb-4 text-center">
                Add Booking
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label
                        htmlFor="classSelect"
                        className="font-medium text-sm"
                    >
                        Select Class
                    </label>

                    <div className="relative mt-1">
                        <select
                            id="classSelect"
                            name="classSelect"
                            value={selectedClassId}
                            onChange={(e) => setSelectedClassId(e.target.value)}
                            className="w-full p-3 rounded-lg bg-secondary-bg/50 outline-none focus:ring-2 focus:ring-btn/50 appearance-none pr-10 transition"
                        >
                            <option value="">Choose class...</option>
                            {upcomingClasses.map((cls: ClassItem) => (
                                <option key={cls.id} value={cls.id}>
                                    {cls.title} — {cls.date} ({cls.startTime}-
                                    {cls.endTime})
                                </option>
                            ))}
                        </select>

                        <ChevronDown
                            size={18}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                        />
                    </div>

                    {selectedClass && (
                        <p className="text-xs text-gray-600 mt-1 flex items-center gap-2">
                            <Calendar size={14} />
                            {selectedClass.date} | {selectedClass.startTime}–
                            {selectedClass.endTime} |{' '}
                            {
                                bookings.filter(
                                    (b) =>
                                        String(b.classId) ===
                                        String(selectedClassId)
                                ).length
                            }{' '}
                            / {selectedClass.maxSpots} bokningar
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="guestName" className="font-medium text-sm">
                        Guest Name
                    </label>
                    <div className="mt-1 flex items-center bg-secondary-bg/50 rounded-lg p-3 focus-within:ring-2 focus-within:ring-btn/50 transition">
                        <User size={18} className="text-gray-500 mr-2" />
                        <input
                            id="guestName"
                            name="guestName"
                            type="text"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            placeholder="Optional"
                            className="bg-transparent outline-none flex-1"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="guestEmail" className="font-medium text-sm">
                        Guest Email
                    </label>
                    <div className="mt-1 flex items-center bg-secondary-bg/50 rounded-lg p-3 focus-within:ring-2 focus-within:ring-btn/50 transition">
                        <Mail size={18} className="text-gray-500 mr-2" />
                        <input
                            id="guestEmail"
                            name="guestEmail"
                            type="email"
                            value={guestEmail}
                            onChange={(e) => setGuestEmail(e.target.value)}
                            placeholder="Optional"
                            className="bg-transparent outline-none flex-1"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-btn text-white rounded-lg hover:opacity-90 hover:cutransition font-medium"
                >
                    {isSubmitting ? 'Adding...' : 'Add Booking'}
                </button>
            </form>
        </div>
    )
}

export default AdminAddBooking
