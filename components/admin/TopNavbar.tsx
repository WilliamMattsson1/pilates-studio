'use client'

import Link from 'next/link'
import { LogOut, Menu, Home } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

interface TopNavbarProps {
    currentNavLabel: string
    onMenuClick: () => void
}

const TopNavbar = ({ currentNavLabel, onMenuClick }: TopNavbarProps) => {
    const { signOut } = useAuth()
    const router = useRouter()

    const handleLogout = async () => {
        await signOut()
        router.push('/')
    }
    return (
        <header className="h-16 bg-primary-bg/60 flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
                <button className="md:hidden" onClick={onMenuClick}>
                    <Menu className="w-6 h-6" />
                </button>

                <Link href="/">
                    <Home
                        className="
            w-6 text-gray-700
            transition-transform duration-200
            hover:scale-110 hover:text-black
        "
                    />
                </Link>
            </div>

            <h1 className="text-lg md:text-2xl font-medium text-center fancy-font tracking-wider">
                {currentNavLabel}
            </h1>

            <button
                onClick={handleLogout}
                className="bg-btn text-white px-4 py-2 rounded-full hover:bg-btn-hover transition flex items-center font-medium"
            >
                Log out
                <LogOut className="w-4 inline-block ml-2" />
            </button>
        </header>
    )
}

export default TopNavbar
