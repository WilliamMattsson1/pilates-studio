'use client'

import { useState } from 'react'
import { useClasses } from '@/context/ClassesContext'
import { useBookings } from '@/context/BookingsContext'
import { ClassItem } from '@/types/classes'
import { toast } from 'react-toastify'

const FILTERS = [
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'past', label: 'Past' },
    { key: 'all', label: 'All Classes' }
]

type AdminAllClassesProps = {
    onSwitchToAdd?: () => void
}

const AdminAllClasses = ({ onSwitchToAdd }: AdminAllClassesProps) => {
    const { upcomingClasses, pastClasses, deleteClass } = useClasses()
    const { bookings } = useBookings()

    const [filter, setFilter] = useState('upcoming')

    const classesToShow: ClassItem[] =
        filter === 'upcoming'
            ? upcomingClasses
            : filter === 'past'
            ? pastClasses
            : [...upcomingClasses, ...pastClasses]

    const handleDelete = (id: string) => {
        if (!confirm('Are you sure you want to delete this class?')) return
        deleteClass(id)
        toast.success('Class deleted successfully!')
    }

    const getBookedInfo = (cls: ClassItem) => {
        const booked = bookings.filter((b) => b.classId === cls.id).length
        const isFull = booked >= cls.maxSpots
        return { booked, isFull }
    }

    return (
        <div className="w-[90%] max-w-xl py-6 mx-auto">
            {/* Filter buttons */}
            <div className="flex gap-2 mb-3">
                {FILTERS.map(({ key, label }) => (
                    <button
                        key={key}
                        className={`px-4 py-2 rounded-full ${
                            filter === key
                                ? 'bg-btn text-white'
                                : 'bg-primary-bg'
                        }`}
                        onClick={() => setFilter(key)}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Classes list */}
            <div className="flex flex-col gap-3">
                {classesToShow.length === 0 ? (
                    <>
                        <p className="text-center py-6">
                            No classes found. Change filter or add a new class.
                        </p>
                        <button
                            className="px-4 py-2 bg-btn w-fit mx-auto text-white rounded"
                            onClick={onSwitchToAdd}
                        >
                            Add Class
                        </button>
                    </>
                ) : (
                    classesToShow.map((cls: ClassItem) => {
                        const { booked, isFull } = getBookedInfo(cls)

                        return (
                            <div
                                key={cls.id}
                                className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
                            >
                                <div>
                                    <h3 className="font-semibold text-lg">
                                        {cls.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {cls.date} | {cls.startTime} -{' '}
                                        {cls.endTime}
                                    </p>
                                    <p
                                        className={`font-medium ${
                                            isFull
                                                ? 'text-red-400'
                                                : 'text-green-500'
                                        }`}
                                    >
                                        Booked: {booked}/{cls.maxSpots}
                                        {isFull ? ' (Full)' : ''}
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        className="px-3 py-1 bg-yellow-400 rounded hover:opacity-90"
                                        onClick={() =>
                                            toast.info(
                                                'Edit functionality coming soon'
                                            )
                                        }
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:opacity-90"
                                        onClick={() => handleDelete(cls.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}

export default AdminAllClasses
