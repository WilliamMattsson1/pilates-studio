'use client'
import Link from 'next/link'
import { Wrench, X } from 'lucide-react'
import SectionDivider from '@/components/shared/ui/SectionDivider'
import type { LucideIcon } from 'lucide-react'

interface SidebarProps {
    navItems: { label: string; href: string; icon: LucideIcon }[]
    pathname: string
    isOpen: boolean
    onClose: () => void
}

export const Sidebar = ({
    navItems,
    pathname,
    isOpen,
    onClose
}: SidebarProps) => {
    return (
        <>
            {/* Desktop sidebar */}
            <aside className="hidden md:flex w-64 bg-primary-bg/60 flex-col p-6">
                <img src="/images/logo.png" className="mx-auto w-26" />
                <SectionDivider className="bg-btn/60 h-1 w-full my-6" />
                <h2 className="text-2xl font-semibold text-left">
                    <Wrench size={34} className="inline-block mr-2 " />
                    Admin Panel
                </h2>
                <nav className="flex flex-col  mt-6">
                    {navItems.map((item) => {
                        const IconComponent = item.icon
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-centertext-gray-600 transition-colors p-2 rounded-sm hover:font-bold${
                                    pathname.startsWith(item.href)
                                        ? 'font-bold text-black bg-gray-300/70'
                                        : 'font-medium'
                                }`}
                            >
                                <IconComponent className="w-5  inline-block mr-2 text-black" />

                                {item.label}
                            </Link>
                        )
                    })}
                </nav>
            </aside>

            {/* Mobile sidebar */}
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/40 z-30 md:hidden"
                        onClick={onClose}
                    />
                    <aside
                        className={`
                            fixed md:hidden top-0 left-0 h-full w-64 bg-primary-bg p-6 z-40
                            transform duration-300 ease-in-out
                            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                        `}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-semibold">
                                Admin Panel
                            </h2>
                            <button onClick={onClose}>
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <nav className="flex flex-col gap-4 mt-6">
                            {navItems.map((item) => {
                                const IconComponent = item.icon

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`text-gray-700 font-medium transition-colors hover:underline ${
                                            pathname.startsWith(item.href)
                                                ? 'font-semibold'
                                                : ''
                                        }`}
                                        onClick={onClose}
                                    >
                                        <IconComponent className="w-5  inline-block mr-2 text-black" />
                                        {item.label}
                                    </Link>
                                )
                            })}
                        </nav>
                        <SectionDivider className="bg-btn/60 h-1 w-full my-6" />
                        <img
                            src="/images/logo.png"
                            className="mx-auto w-26 mt-6"
                        />
                    </aside>
                </>
            )}
        </>
    )
}
