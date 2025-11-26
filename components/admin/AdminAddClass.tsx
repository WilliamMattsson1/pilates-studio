'use client'

import { useClasses } from '@/context/ClassesContext'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

const AdminAddClass = () => {
    const { addClass } = useClasses()

    const [title, setTitle] = useState('')
    const [date, setDate] = useState('')
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [maxSpots, setMaxSpots] = useState(8)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        addClass({
            id: uuidv4(),
            title,
            date,
            startTime,
            endTime,
            maxSpots
        })

        setTitle('')
        setDate('')
        setStartTime('')
        setEndTime('')
        setMaxSpots(8)
    }

    return (
        <section className="w-full min-h-screen bg-secondary-bg px-6 md:px-16 py-6 flex justify-center">
            <div className="w-full max-w-xl">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-6 rounded-2xl shadow-xl flex flex-col gap-6"
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
                            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:outline-none"
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
                            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:outline-none"
                            required
                        />
                    </div>

                    {/* Time */}
                    <div className="flex flex-row gap-1">
                        <div>
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
                                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:outline-none"
                                placeholder="14:00"
                                required
                            />
                        </div>
                        <div>
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
                                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:outline-none"
                                placeholder="15:00"
                                required
                            />
                        </div>
                    </div>

                    {/* Max Spots */}
                    <div className="flex flex-col gap-1">
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
                            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:outline-none"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-btn text-white py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition"
                    >
                        Add Class
                    </button>
                </form>
            </div>
        </section>
    )
}

export default AdminAddClass
