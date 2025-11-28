'use client'
import { useState } from 'react'
import AdminAllBookings from './AdminAllBookings'
import AdminAddBooking from './AdminAddBooking'

const BookingsTabs = () => {
    const [activeTab, setActiveTab] = useState<'all' | 'add'>('all')

    const tabs = [
        { key: 'all', label: 'All Bookings' },
        { key: 'add', label: 'Add Booking' }
    ] as const

    return (
        <div className="mt-9 flex flex-col items-center w-[90%] max-w-2xl mx-auto ">
            <div className="flex bg-primary-bg rounded-full shadow-sm p-2 w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        className={`
                            flex-1 py-2 px-8 rounded-full text-md font-medium transition-colors
                            ${
                                activeTab === tab.key
                                    ? 'bg-btn text-white'
                                    : 'hover:bg-btn/30 hover:cursor-pointer'
                            }
                        `}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="w-full py-4">
                {activeTab === 'all' ? (
                    <AdminAllBookings />
                ) : (
                    <AdminAddBooking />
                )}
            </div>
        </div>
    )
}

export default BookingsTabs
