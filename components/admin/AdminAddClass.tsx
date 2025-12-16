'use client'

import { useClasses } from '@/context/ClassesContext'
import { useState } from 'react'
import { toast } from 'react-toastify'

const AdminAddClass = () => {
    const { addClass } = useClasses()

    const [title, setTitle] = useState('')
    const [date, setDate] = useState('')
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [maxSpots, setMaxSpots] = useState(8)
    const [price, setPrice] = useState(199)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            await addClass({
                title,
                date,
                start_time: startTime,
                end_time: endTime,
                max_spots: maxSpots,
                price: price
            })

            setTitle('')
            setDate('')
            setStartTime('')
            setEndTime('')
            setMaxSpots(8)

            toast.success('Class added successfully!')
        } catch (error) {
            console.error(error)
            toast.error('Failed to add class. Please try again.')
        }
    }

    return (
        <section className="w-full min-h-screen bg-secondary-bg px-6 md:px-16 py-6 flex justify-center">
            <div className="w-full max-w-[90vw] md:max-w-xl">
                <form
                    onSubmit={handleSubmit}
                    className="bg-primary-bg p-6 rounded-2xl shadow-xl flex flex-col gap-6"
                >
                    {/* Title */}
                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="title"
                            className="text-sm font-medium text-gray-700"
                        >
                            Class Title
                        </label>
                        <input
                            id="title"
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
                            htmlFor="date"
                            className="text-sm font-medium text-gray-700"
                        >
                            Date
                        </label>
                        <input
                            id="date"
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
                                htmlFor="startTime"
                                className="text-sm font-medium text-gray-700"
                            >
                                Start Time
                            </label>
                            <input
                                id="startTime"
                                name="startTime"
                                type="text"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="px-4 py-3 rounded-lg bg-secondary-bg/50 outline-none focus:ring-2 focus:ring-btn/50 transition w-full"
                                placeholder="14:00"
                                required
                            />
                        </div>
                        <div className="flex-1 flex flex-col gap-1">
                            <label
                                htmlFor="endTime"
                                className="text-sm font-medium text-gray-700"
                            >
                                End Time
                            </label>
                            <input
                                id="endTime"
                                name="endTime"
                                type="text"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="px-4 py-3 rounded-lg bg-secondary-bg/50 outline-none focus:ring-2 focus:ring-btn/50 transition w-full"
                                placeholder="15:00"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-row gap-2">
                        {/* Max Spots */}
                        <div className="flex-1 flex flex-col gap-1">
                            <label
                                htmlFor="maxSpots"
                                className="text-sm font-medium text-gray-700"
                            >
                                Max Spots
                            </label>
                            <input
                                id="maxSpots"
                                name="maxSpots"
                                type="number"
                                min="1"
                                value={maxSpots}
                                onChange={(e) =>
                                    setMaxSpots(Number(e.target.value))
                                }
                                className="px-4 py-3 rounded-lg bg-secondary-bg/50 outline-none focus:ring-2 focus:ring-btn/50 transition w-full"
                                required
                            />
                        </div>
                        <div className="flex-1 flex flex-col gap-1">
                            <label
                                htmlFor="price"
                                className="text-sm font-medium text-gray-700"
                            >
                                Price (kr)
                            </label>
                            <input
                                id="price"
                                name="price"
                                type="number"
                                min="1"
                                value={price}
                                onChange={(e) =>
                                    setPrice(Number(e.target.value))
                                }
                                className="px-4 py-3 rounded-lg bg-secondary-bg/50 outline-none focus:ring-2 focus:ring-btn/50 transition w-full"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="bg-btn text-white py-3 rounded-lg text-sm font-semibold hover:bg-btn-hover transition"
                    >
                        Add Class
                    </button>
                </form>
            </div>
        </section>
    )
}

export default AdminAddClass
