'use client'

import { useState } from 'react'
import AdminAllBookings from './AdminAllBookings'

const BookingsTabs = () => {
    const [activeTab, setActiveTab] = useState<'all' | 'add'>('all')

    return (
        <div className="mt-9 flex flex-col items-center w-[90%] max-w-2xl mx-auto ">
            {/* Tabs */}
            <div className="flex bg-primary-bg rounded-full shadow-sm p-2 w-fit">
                <button
                    className={`flex-1 py-2 px-8 rounded-full text-md font-medium transition-colors
                        ${activeTab === 'all' && 'bg-btn text-white'}`}
                    onClick={() => setActiveTab('all')}
                >
                    All Bookings
                </button>
                <button
                    className={`flex-1 py-2 px-8 rounded-full text-md font-medium transition-colors
                        ${activeTab === 'add' && 'bg-btn text-white'}`}
                    onClick={() => setActiveTab('add')}
                >
                    Add Booking
                </button>
            </div>

            {/* Tab content */}
            <div className="w-full py-4">
                {activeTab === 'all' ? (
                    <AdminAllBookings />
                ) : (
                    // Add booking form placeholder
                    <div className="text-center text-gray-600 italic">
                        Add Booking form goes here.
                    </div>
                )}
            </div>
        </div>
    )
}

export default BookingsTabs
