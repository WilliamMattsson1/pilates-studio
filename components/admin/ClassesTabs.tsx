'use client'

import { useState } from 'react'
import AdminAddClass from '@/components/admin/AdminAddClass'
import AdminAllClasses from '@/components/admin/AdminAllClasses'

const ClassesTabs = () => {
    const [activeTab, setActiveTab] = useState<'all' | 'add'>('all')

    const tabs = [
        { key: 'all', label: 'All Classes' },
        { key: 'add', label: 'Add Class' }
    ] as const

    return (
        <div className="mt-9 flex flex-col items-center">
            {/* Tab buttons */}
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

            {/* Tab content */}
            <div className="w-full mt-4">
                {activeTab === 'all' ? (
                    <AdminAllClasses
                        onSwitchToAdd={() => setActiveTab('add')}
                    />
                ) : (
                    <AdminAddClass />
                )}
            </div>
        </div>
    )
}

export default ClassesTabs
