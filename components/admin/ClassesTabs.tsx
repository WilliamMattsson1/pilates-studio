'use client'

import { useState } from 'react'
import AdminAddClass from '@/components/admin/AdminAddClass'
import AdminAllClasses from '@/components/admin/AdminAllClasses'

const ClassesTabs = () => {
    const [activeTab, setActiveTab] = useState<'all' | 'add'>('all')

    return (
        <div className="mt-9 flex flex-col items-center">
            <div className="flex bg-primary-bg rounded-full shadow-sm p-2 w-fit">
                {/* Tab buttons */}
                <button
                    className={`flex-1 py-2 px-8 rounded-full text-md font-medium  transition-colors
                        ${activeTab === 'all' && 'bg-btn text-white'}`}
                    onClick={() => setActiveTab('all')}
                >
                    All Classes
                </button>
                <button
                    className={`flex-1 py-2 px-8 rounded-full text-md font-medium transition-colors
                        ${activeTab === 'add' && 'bg-btn text-white'}`}
                    onClick={() => setActiveTab('add')}
                >
                    Add Class
                </button>
            </div>

            {/* Tab content */}
            <div className="w-full">
                {activeTab === 'all' ? <AdminAllClasses /> : <AdminAddClass />}
            </div>
        </div>
    )
}

export default ClassesTabs
