'use client'
import { useState } from 'react'
import { useClasses } from '@/context/ClassesContext'
import { useBookings } from '@/context/BookingsContext'
import { ClassItem } from '@/types/classes'
import { toast } from 'react-toastify'
import EditClassModal from '../modals/EditClassModal'
import DeleteModal from '../modals/DeleteItemModal'
import { Calendar, Users } from 'lucide-react'

const FILTERS = [
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'past', label: 'Past' },
    { key: 'all', label: 'All Classes' }
]

const AdminAllClasses = () => {
    const { upcomingClasses, pastClasses, deleteClass, updateClass } =
        useClasses()
    const { bookings } = useBookings()

    const [filter, setFilter] = useState('upcoming')

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null)

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [classToDelete, setClassToDelete] = useState<ClassItem | null>(null)

    const classesToShow: ClassItem[] =
        filter === 'upcoming'
            ? upcomingClasses
            : filter === 'past'
              ? pastClasses
              : [...upcomingClasses, ...pastClasses]

    const getBookedInfo = (cls: ClassItem) => {
        const booked = bookings.filter((b) => b.class_id === cls.id).length
        const isFull = booked >= cls.max_spots
        return { booked, isFull }
    }

    const handleSave = (updatedClass: ClassItem) => {
        updateClass(updatedClass)
        setIsModalOpen(false)
    }

    return (
        <div className="w-[90%] max-w-xl py-6 mx-auto">
            {/* Filter buttons */}
            <div className="flex gap-2 mb-4">
                {FILTERS.map(({ key, label }) => (
                    <button
                        key={key}
                        className={`px-4 py-2 rounded-full transition ${
                            filter === key
                                ? 'bg-btn text-white'
                                : 'bg-primary-bg hover:bg-btn/30 hover:cursor-pointer'
                        }`}
                        onClick={() => setFilter(key)}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Classes list */}
            <div className="flex flex-col gap-4">
                {classesToShow.length === 0 ? (
                    <>
                        <p className="text-center py-6">
                            No classes found. Change filter or add a new class.
                        </p>
                    </>
                ) : (
                    classesToShow.map((cls: ClassItem) => {
                        const { booked, isFull } = getBookedInfo(cls)

                        return (
                            <div
                                key={cls.id}
                                className="p-4 bg-primary-bg rounded-lg shadow-md flex justify-between items-center"
                            >
                                {/* Left content */}
                                <div className="flex flex-col">
                                    <h3 className="font-semibold text-md mb-1">
                                        {cls.title}
                                    </h3>

                                    <p className="text-gray-600 text-sm flex items-center mb-1">
                                        <Calendar size={15} className="mr-2" />
                                        {cls.date} | {cls.start_time} -{' '}
                                        {cls.end_time}
                                    </p>
                                    <p
                                        className={`font-medium flex items-center text-sm ${
                                            isFull
                                                ? 'text-red-500'
                                                : 'text-green-600'
                                        }`}
                                    >
                                        <Users size={16} className="mr-2" />
                                        Booked: {booked}/{cls.max_spots}
                                        {isFull ? ' (Full)' : ''}
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:opacity-90 transition"
                                        onClick={() => {
                                            setSelectedClass(cls)
                                            setIsModalOpen(true)
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="px-3 py-1 bg-red-400 text-white rounded hover:opacity-90 transition"
                                        onClick={() => {
                                            setClassToDelete(cls)
                                            setIsDeleteModalOpen(true)
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
            {selectedClass && (
                <EditClassModal
                    cls={selectedClass}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onUpdate={handleSave}
                />
            )}
            {classToDelete && (
                <DeleteModal
                    item={classToDelete}
                    type="class"
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={() => {
                        deleteClass(classToDelete.id)
                        setIsDeleteModalOpen(false)
                        setClassToDelete(null)
                        toast.success('Class deleted successfully!!')
                    }}
                />
            )}
        </div>
    )
}

export default AdminAllClasses
