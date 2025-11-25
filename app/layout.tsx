import type { Metadata } from 'next'
import { Roboto, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ClassesProvider } from '@/context/ClassesContext'

const roboto = Roboto({
    variable: '--font-roboto',
    subsets: ['latin']
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin']
})

export const metadata: Metadata = {
    title: 'Pilates Studio',
    description: 'Pilates i Uppsala | Boka nu'
}

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" data-scroll-behavior="smooth">
            <body
                className={`${roboto.variable} ${geistMono.variable} antialiased`}
            >
                <ClassesProvider>{children}</ClassesProvider>
            </body>
        </html>
    )
}
