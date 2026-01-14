'use client'

import { useClasses } from '@/context/ClassesContext'
import { useState } from 'react'
import { toast } from 'react-toastify'

const AdminAddClass = () => {
    const { addClass } = useClasses()

    const [isLoading, setIsLoading] = useState(false)

    const [title, setTitle] = useState('')
    const [date, setDate] = useState('')
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [maxSpots, setMaxSpots] = useState(8)
    const [price, setPrice] = useState(199)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

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
            setPrice(199)

            toast.success('Class added successfully!')
        } catch (error) {
            console.error('[AdminAddClass] Submit error:', error)
            toast.error('Failed to add class. Please try again.')
        } finally {
            setIsLoading(false)
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
                            className="px-4 py-3 rounded-lg bg-secondary-bg/50 outline-none focus:ring-2 focus:ring-btn/50 transition disabled:opacity-50"
                            placeholder="Matte Pilates"
                            required
                            disabled={isLoading}
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
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setDate(e.target.value)}
                            className="px-4 py-3 rounded-lg bg-secondary-bg/50 outline-none focus:ring-2 focus:ring-btn/50 transition disabled:opacity-50"
                            required
                            disabled={isLoading}
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
                                type="text"
                                name="startTime"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="px-4 py-3 rounded-lg bg-secondary-bg/50 outline-none focus:ring-2 focus:ring-btn/50 transition w-full disabled:opacity-50"
                                placeholder="14:00"
                                required
                                disabled={isLoading}
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
                                type="text"
                                name="endTime"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="px-4 py-3 rounded-lg bg-secondary-bg/50 outline-none focus:ring-2 focus:ring-btn/50 transition w-full disabled:opacity-50"
                                placeholder="16:00"
                                required
                                disabled={isLoading}
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
                                className="px-4 py-3 rounded-lg bg-secondary-bg/50 outline-none focus:ring-2 focus:ring-btn/50 transition w-full disabled:opacity-50"
                                required
                                disabled={isLoading}
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
                                className="px-4 py-3 rounded-lg bg-secondary-bg/50 outline-none focus:ring-2 focus:ring-btn/50 transition w-full disabled:opacity-50"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-btn text-white py-3 rounded-lg text-sm font-semibold hover:bg-btn-hover transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Adding...' : 'Add Class'}
                    </button>
                </form>
            </div>
        </section>
    )
}

export default AdminAddClass
