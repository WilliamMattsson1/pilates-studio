'use client'

import { ClassItem } from '@/types/classes'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

interface EditModalProps {
    cls: ClassItem | null
    isOpen: boolean
    onClose: () => void
    onUpdate: (updatedClass: ClassItem) => void
}

const EditClassModal = ({ cls, isOpen, onClose, onUpdate }: EditModalProps) => {
    const [title, setTitle] = useState('')
    const [date, setDate] = useState('')
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [maxSpots, setMaxSpots] = useState(8)

    // Fyll fälten när modal öppnas
    useEffect(() => {
        if (cls) {
            setTitle(cls.title)
            setDate(cls.date)
            setStartTime(cls.startTime)
            setEndTime(cls.endTime)
            setMaxSpots(cls.maxSpots)
        }
    }, [cls])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!cls) return

        try {
            onUpdate({
                ...cls,
                title,
                date,
                startTime,
                endTime,
                maxSpots
            })
            toast.success('Class updated successfully!')
            onClose()
        } catch (error) {
            console.error(error)
            toast.error('Failed to update class. Please try again.')
        }
    }

    // Rendera bara om modal ska vara öppen och cls finns
    if (!isOpen || !cls) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6 relative"
                onClick={(e) => e.stopPropagation()} // Klick inne i modal stoppar propagation
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>

                <h2 className="text-xl font-semibold mb-4">Edit Class</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Title */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Class Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:outline-none"
                            required
                        />
                    </div>

                    {/* Date */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Date
                        </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:outline-none"
                            required
                        />
                    </div>

                    {/* Time */}
                    <div className="flex flex-row gap-2">
                        <div className="flex-1 flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                                Start Time
                            </label>
                            <input
                                type="text"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                placeholder="14:00"
                                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:outline-none"
                                required
                            />
                        </div>
                        <div className="flex-1 flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                                End Time
                            </label>
                            <input
                                type="text"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                placeholder="15:00"
                                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:outline-none"
                                required
                            />
                        </div>
                    </div>

                    {/* Max Spots */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Max Spots
                        </label>
                        <input
                            type="number"
                            min={1}
                            value={maxSpots}
                            onChange={(e) =>
                                setMaxSpots(Number(e.target.value))
                            }
                            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:outline-none"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-btn text-white rounded-lg hover:opacity-90 transition"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditClassModal
