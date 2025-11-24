'use client'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import SectionDivider from '@/components/shared/ui/SectionDivider'

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = useState(false)
    const pathname = usePathname() || '/admin'

    const navItems = [
        { label: 'Overview', href: '/admin' },
        { label: 'Classes', href: '/admin/classes' }, // Add class and manage classes under this
        { label: 'Bookings', href: '/admin/bookings' }, // Add manual booking and see all bookings here
        { label: 'Settings', href: '/admin/settings' }
    ]

    const currentNavLabel =
        navItems.find((item) => pathname.startsWith(item.href))?.label ||
        'Overview'

    return (
        <div className="min-h-screen flex bg-secondary-bg">
            {/* Desktop sidebar */}
            <aside className="hidden md:flex w-64 bg-primary-bg/60 flex-col p-6">
                <img src="/images/logo.png" className="mx-auto w-26" />
                <SectionDivider className="bg-btn/60 h-1 w-full my-6" />
                <h2 className="text-2xl font-semibold text-center">
                    Admin Panel
                </h2>
                <nav className="flex flex-col gap-3 mt-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`text-gray-700 font-medium transition-colors hover:underline ${
                                pathname.startsWith(item.href)
                                    ? 'font-semibold'
                                    : ''
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Mobile overlay */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/40 z-30 md:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* MOBILE SIDEBAR */}
            <aside
                className={`
                    fixed md:hidden top-0 left-0 h-full w-64 bg-primary-bg p-6 z-40
                    transform duration-300 ease-in-out
                    ${open ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">Admin Panel</h2>
                    <button onClick={() => setOpen(false)}>
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="flex flex-col gap-4 mt-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`text-gray-700 font-medium transition-colors hover:underline ${
                                pathname.startsWith(item.href)
                                    ? 'font-semibold underline'
                                    : ''
                            }`}
                            onClick={() => setOpen(false)}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main content area */}
            <div className="flex-1 flex flex-col">
                {/* top navbar */}
                <header className="h-16 bg-primary-bg/60 flex items-center justify-between px-4">
                    <button
                        className="md:hidden mr-4"
                        onClick={() => setOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <h1 className="text-lg md:text-xl font-semibold text-center ">
                        {currentNavLabel}
                    </h1>

                    <button className="bg-btn text-white px-4 py-2 rounded-full hover:opacity-90 transition">
                        Log out
                    </button>
                </header>

                {/* Content */}
                <main className="p-6 flex-1">{children}</main>
            </div>
        </div>
    )
}

export default AdminLayout
