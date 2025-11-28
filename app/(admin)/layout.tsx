'use client'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/admin/Sidebar'
import TopNavbar from '@/components/admin/TopNavbar'
import { BookOpen, Calendar, Home } from 'lucide-react'

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = useState(false)
    const pathname = usePathname() || '/admin'

    const navItems = [
        { label: 'Overview', href: '/admin/overview', icon: Home },
        { label: 'Classes', href: '/admin/classes', icon: BookOpen },
        { label: 'Bookings', href: '/admin/bookings', icon: Calendar }
    ]

    const currentNavLabel =
        navItems.find((item) =>
            item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href)
        )?.label || 'Overview'

    return (
        <div className="min-h-screen flex bg-secondary-bg">
            <Sidebar
                navItems={navItems}
                pathname={pathname}
                isOpen={open}
                onClose={() => setOpen(false)}
            />
            {/* Main content area */}
            <div className="flex-1 flex flex-col">
                <TopNavbar
                    currentNavLabel={currentNavLabel}
                    onMenuClick={() => setOpen(true)}
                />

                <main>{children}</main>
            </div>
        </div>
    )
}

export default AdminLayout
