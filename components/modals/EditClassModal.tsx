'use client'

import { ClassItem } from '@/types/classes'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { X } from 'lucide-react'

interface EditModalProps {
    cls: ClassItem | null
    isOpen: boolean
    onClose: () => void
    onUpdate: (updatedClass: ClassItem) => void
}

const EditClassModal = ({ cls, isOpen, onClose, onUpdate }: EditModalProps) => {
    const [title, setTitle] = useState(cls?.title ?? '')
    const [date, setDate] = useState(cls?.date ?? '')
    const [startTime, setStartTime] = useState(cls?.start_time ?? '')
    const [endTime, setEndTime] = useState(cls?.end_time ?? '')
    const [maxSpots, setMaxSpots] = useState(cls?.max_spots ?? 8)
    const [price, setPrice] = useState(cls?.price ?? 199)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!cls) return

        try {
            onUpdate({
                ...cls,
                title,
                date,
                start_time: startTime,
                end_time: endTime,
                max_spots: maxSpots,
                price
            })
            onClose()
        } catch (error) {
            console.error(error)
            toast.error('Failed to update class. Please try again.')
        }
    }

    if (!isOpen || !cls) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={onClose}
        >
            <div
                className="bg-primary-bg rounded-2xl shadow-xl w-full md:max-w-xl p-6 relative max-w-[90%]"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 hover:cursor-pointer transition-colors"
                >
                    <X size={24} />
                </button>

                <h2 className="text-xl font-semibold mb-4">Edit Class</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Title */}
                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor={`title-${cls.id}`}
                            className="text-sm font-medium text-gray-700"
                        >
                            Class Title
                        </label>
                        <input
                            id={`title-${cls.id}`}
                            name="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="px-4 py-3 rounded-lg bg-secondary-bg/50 outline-none focus:ring-2 focus:ring-btn/50 transition"
                            placeholder="Matte Pilates"
                            required
                        />
                    </div>

                    {/* Date */}
                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor={`date-${cls.id}`}
                            className="text-sm font-medium text-gray-700"
                        >
                            Date
                        </label>
                        <input
                            id={`date-${cls.id}`}
                            name="date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="px-4 py-3 rounded-lg bg-secondary-bg/50 outline-none focus:ring-2 focus:ring-btn/50 transition"
                            required
                        />
                    </div>

                    {/* Time */}
                    <div className="flex flex-row gap-2">
                        <div className="flex-1 flex flex-col gap-1">
                            <label
                                htmlFor={`startTime-${cls.id}`}
                                className="text-sm font-medium text-gray-700"
                            >
                                Start Time
                            </label>
                            <input
                                id={`startTime-${cls.id}`}
                                name="startTime"
                                type="text"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                placeholder="14:00"
                                className="px-4 py-3 rounded-lg bg-secondary-bg/50 outline-none focus:ring-2 focus:ring-btn/50 transition w-full"
                                required
                            />
                        </div>
                        <div className="flex-1 flex flex-col gap-1">
                            <label
                                htmlFor={`endTime-${cls.id}`}
                                className="text-sm font-medium text-gray-700"
                            >
                                End Time
                            </label>
                            <input
                                id={`endTime-${cls.id}`}
                                name="endTime"
                                type="text"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                placeholder="15:00"
                                className="px-4 py-3 rounded-lg bg-secondary-bg/50 outline-none focus:ring-2 focus:ring-btn/50 transition w-full"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-row gap-2">
                        {/* Max Spots */}
                        <div className="flex flex-col flex-1 gap-1">
                            <label
                                htmlFor={`maxSpots-${cls.id}`}
                                className="text-sm font-medium text-gray-700"
                            >
                                Max Spots
                            </label>
                            <input
                                id={`maxSpots-${cls.id}`}
                                name="maxSpots"
                                type="number"
                                min={1}
                                value={maxSpots}
                                onChange={(e) =>
                                    setMaxSpots(Number(e.target.value))
                                }
                                className="px-4 py-3 rounded-lg bg-secondary-bg/50 outline-none focus:ring-2 focus:ring-btn/50 transition w-full"
                                required
                            />
                        </div>

                        <div className="flex flex-col flex-1 gap-1">
                            <label
                                htmlFor={`price-${cls.id}`}
                                className="text-sm font-medium text-gray-700"
                            >
                                Price (kr)
                            </label>
                            <input
                                id={`price-${cls.id}`}
                                name="price"
                                type="number"
                                min={1}
                                value={price}
                                onChange={(e) =>
                                    setPrice(Number(e.target.value))
                                }
                                className="px-4 py-3 rounded-lg bg-secondary-bg/50 outline-none focus:ring-2 focus:ring-btn/50 transition w-full"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg hover:bg-gray-100 hover:cursor-pointer transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-btn text-white rounded-lg hover:bg-btn-hover transition"
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
