import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'
import { ClassesProvider } from '@/context/ClassesContext'
import { BookingsProvider } from '@/context/BookingsContext'
import { ToastContainer } from 'react-toastify'
import BookingModal from '@/components/modals/BookingModal'
import { BookingModalProvider } from '@/context/BookingModalContext'

const roboto = Roboto({
    variable: '--font-roboto',
    subsets: ['latin']
})

export const metadata: Metadata = {
    title: 'Pilates Studio | Home',
    description:
        'Welcome to our Pilates Studio in Uppsala. Discover our classes and book your spot online easily.'
}

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" data-scroll-behavior="smooth">
            <body className={`${roboto.variable}  antialiased`}>
                <ClassesProvider>
                    <BookingsProvider>
                        <BookingModalProvider>
                            <BookingModal />
                            {children}
                        </BookingModalProvider>
                    </BookingsProvider>
                </ClassesProvider>
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </body>
        </html>
    )
}
