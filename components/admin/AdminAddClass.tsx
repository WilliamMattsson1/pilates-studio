'use client'

import { useClasses } from '@/context/ClassesContext'
import { useState } from 'react'

const AdminAddClass = () => {
    const { addClass, classes } = useClasses()

    const [title, setTitle] = useState('')
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [maxSpots, setMaxSpots] = useState(8)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        addClass({
            id: classes.length + 1,
            title,
            date,
            time,
            maxSpots,
            bookedSpots: 0
        })

        setTitle('')
        setDate('')
        setTime('')
        setMaxSpots(8)
    }

    return (
        <section className="w-full min-h-screen bg-secondary-bg px-6 md:px-20 py-16 flex justify-center">
            <div className="w-full max-w-xl">
                <h1 className="text-3xl font-bold mb-10 text-center">
                    Add New Class
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-8 rounded-2xl shadow-xl flex flex-col gap-6"
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
                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="time"
                            className="text-sm font-medium text-gray-700"
                        >
                            Time
                        </label>
                        <input
                            id="time"
                            name="time"
                            type="text"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:outline-none"
                            placeholder="14:00 – 15:00"
                            required
                        />
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
