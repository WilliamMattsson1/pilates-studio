'use client'

import { Menu } from 'lucide-react'

interface TopNavbarProps {
    currentNavLabel: string
    onMenuClick: () => void
}

const TopNavbar = ({ currentNavLabel, onMenuClick }: TopNavbarProps) => {
    return (
        <header className="h-16 bg-primary-bg/60 flex items-center justify-between px-4">
            <button className="md:hidden mr-4" onClick={onMenuClick}>
                <Menu className="w-6 h-6" />
            </button>

            <h1 className="text-lg md:text-xl font-semibold text-center">
                {currentNavLabel}
            </h1>

            <button className="bg-btn text-white px-4 py-2 rounded-full hover:opacity-90 transition">
                Log out
            </button>
        </header>
    )
}

export default TopNavbar
