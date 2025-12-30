'use client'
import { useAuth } from '@/context/AuthContext'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const Navbar = () => {
    const { user, signOut } = useAuth()
    const router = useRouter()

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Classes', path: '/classes' },
        { name: 'About', path: '/about' }
    ]

    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const handleClick = async () => {
        setIsMenuOpen(false)
        if (user) {
            await signOut()
        } else {
            router.push('/auth')
        }
    }

    return (
        <nav
            className={`sticky top-0 bg-secondary-bg w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 py-4 md:py-3`}
        >
            {/* Logo */}
            <Link href="/" className="flex items-center py-3 font-extrabold">
                <Image
                    src="/images/logo.png"
                    alt="logo"
                    width={55}
                    height={55}
                    className="h-8 w-auto"
                    priority
                />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-4 lg:gap-8">
                {navLinks.map((link, i) => (
                    <Link
                        key={i}
                        href={link.path}
                        className="group flex flex-col gap-0.5"
                    >
                        {link.name}
                        <div
                            className={`bg-black h-0.5 w-0 group-hover:w-full transition-all duration-300`}
                        />
                    </Link>
                ))}
                <button className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all duration-300 hover:bg-btn hover:text-white">
                    <Link href="/classes/#available-classes">Book Now</Link>
                </button>
            </div>

            {/* Desktop Right */}
            <div className="hidden md:flex items-center gap-2">
                <button
                    onClick={handleClick}
                    className={`px-8 py-2.5 rounded-full ml-4 transition-all duration-500 bg-btn hover:bg-btn-hover text-white hover:cursor-pointer`}
                >
                    {!user ? 'Login' : 'Logout'}
                </button>
                {user && (
                    <button
                        onClick={() => router.push('/profile')}
                        className="w-9 h-9 rounded-full overflow-hidden bg-btn hover:bg-btn-hover hover:cursor-pointer transition"
                    >
                        <span className="flex items-center justify-center w-full h-full text-white font-semibold">
                            {user.email?.charAt(0).toUpperCase()}
                        </span>
                    </button>
                )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 md:hidden">
                {user && (
                    <button
                        onClick={() => router.push('/profile')}
                        className="w-9 h-9 rounded-full overflow-hidden bg-btn hover:border-btn-hover transition"
                    >
                        <span className="flex items-center justify-center w-full h-full text-white font-semibold">
                            {user.email?.charAt(0).toUpperCase()}
                        </span>
                    </button>
                )}
                {/* Hamburger Menu */}
                <svg
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="h-6 w-6 cursor-pointer"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
            </div>

            {/* Mobile Menu */}
            <div
                className={`fixed top-0 left-0 w-full h-screen bg-secondary-bg text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${
                    isMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <button
                    className="absolute top-4 right-4"
                    onClick={() => setIsMenuOpen(false)}
                >
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                {navLinks.map((link, i) => (
                    <a
                        key={i}
                        href={link.path}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        {link.name}
                    </a>
                ))}

                <button className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all">
                    <Link
                        href="/classes/#available-classes"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Book Now
                    </Link>
                </button>

                <button
                    onClick={handleClick}
                    className="bg-btn text-white px-8 py-2.5 rounded-full transition-all duration-500"
                >
                    {!user ? 'Login' : 'Logout'}
                </button>
            </div>
        </nav>
    )
}

export default Navbar
