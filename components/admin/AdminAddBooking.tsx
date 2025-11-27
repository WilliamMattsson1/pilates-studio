'use client'

import { useState } from 'react'
import { Menu, MenuItem, MenuItems, MenuButton } from '@headlessui/react'
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
                    <div className="font-medium text-sm">Select Class</div>
                    <Menu as="div" className="relative">
                        {({ open }) => (
                            <>
                                <MenuButton className="w-full p-3 rounded-lg bg-secondary-bg/50 flex justify-between items-center cursor-pointer focus:ring-2 focus:ring-btn/50">
                                    <span>
                                        {selectedClass
                                            ? `${selectedClass.title} — ${selectedClass.date} (${selectedClass.startTime}-${selectedClass.endTime})`
                                            : 'Choose class...'}
                                    </span>
                                    <ChevronDown
                                        size={18}
                                        className={`text-gray-600 transition-transform ${
                                            open ? 'rotate-180' : ''
                                        }`}
                                    />
                                </MenuButton>

                                <MenuItems className="absolute z-10 w-full bg-secondary-bg rounded-lg mt-1 shadow-lg max-h-90 overflow-auto">
                                    {upcomingClasses.map((cls: ClassItem) => {
                                        const currentBookings = bookings.filter(
                                            (b) =>
                                                String(b.classId) ===
                                                String(cls.id)
                                        ).length
                                        const isFull =
                                            currentBookings >=
                                            (cls.maxSpots || 0)

                                        return (
                                            <MenuItem
                                                key={cls.id}
                                                disabled={isFull}
                                            >
                                                {({ disabled }) => (
                                                    <div
                                                        className={`p-3 cursor-pointer border-b last:border-b-0 ${
                                                            disabled
                                                                ? 'text-gray-400 cursor-not-allowed'
                                                                : 'hover:bg-btn/20'
                                                        }`}
                                                        onClick={() => {
                                                            if (!isFull)
                                                                setSelectedClassId(
                                                                    cls.id
                                                                )
                                                        }}
                                                    >
                                                        {cls.title} — {cls.date}{' '}
                                                        ({cls.startTime}-
                                                        {cls.endTime}) |{' '}
                                                        {currentBookings}/
                                                        {cls.maxSpots} bookings
                                                    </div>
                                                )}
                                            </MenuItem>
                                        )
                                    })}
                                </MenuItems>
                            </>
                        )}
                    </Menu>

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
                            }
                            /{selectedClass.maxSpots} bokningar
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
                    className="w-full py-3 bg-btn text-white rounded-lg hover:opacity-90 hover:cursor-pointer transition font-medium"
                >
                    {isSubmitting ? 'Adding...' : 'Add Booking'}
                </button>
            </form>
        </div>
    )
}

export default AdminAddBooking
