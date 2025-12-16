'use client'
import { useState, ReactNode } from 'react'

interface TabItem {
    key: string
    label: string
    content: ReactNode
}

interface TabsProps {
    tabs: TabItem[]
    initialTabKey?: string
}

const AdminTabs = ({ tabs, initialTabKey }: TabsProps) => {
    const [activeTab, setActiveTab] = useState(initialTabKey || tabs[0].key)

    return (
        <div className="mt-9 flex flex-col items-center w-full md:max-w-3xl mx-auto">
            <div className="flex bg-primary-bg rounded-full shadow-sm p-2 w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        className={`
                            flex-1 py-2 px-6 md:px-8 rounded-full text-md font-medium transition-colors
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

            <div className="w-full mt-4">
                {tabs.find((t) => t.key === activeTab)?.content}
            </div>
        </div>
    )
}

export default AdminTabs
