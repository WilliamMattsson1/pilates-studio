import type { Metadata, Viewport } from 'next'
import { Roboto } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'
import { ClassesProvider } from '@/context/ClassesContext'
import { BookingsProvider } from '@/context/BookingsContext'
import { ToastContainer } from 'react-toastify'
import BookingModal from '@/components/modals/BookingModal'
import { BookingModalProvider } from '@/context/BookingModalContext'
import { AuthProvider } from '@/context/AuthContext'

const roboto = Roboto({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    variable: '--font-roboto',
    display: 'swap'
})

const instrumentSerif = localFont({
    src: [
        {
            path: '../public/fonts/InstrumentSerif-Regular.ttf',
            style: 'normal',
            weight: 'normal'
        },
        {
            path: '../public/fonts/InstrumentSerif-Italic.ttf',
            style: 'italic',
            weight: 'normal'
        }
    ],
    variable: '--font-instrument-serif',
    display: 'swap',
    weight: 'normal'
})

const baseUrl = 'https://pilates-studio-xi.vercel.app' // UPPDATERA DENNA NÄR DOMÄN ÄR KLAR

export const metadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title: 'Pilates Studio | Träning & Wellness i Uppsala',
    description:
        'Professionell pilates i Uppsala. Stärk din kropp och hitta balans med våra personliga pass och expertledda klasser i en harmonisk miljö.',
    keywords: [
        'Pilates Uppsala',
        'Träning Uppsala',
        'Wellness Uppsala',
        'Boka Pilates',
        'Pilatesstudio'
    ],
    authors: [{ name: 'William Mattsson' }],
    alternates: {
        canonical: '/'
    },
    openGraph: {
        type: 'website',
        locale: 'sv_SE',
        url: '/',
        siteName: 'Pilates Studio',
        title: 'Pilates Studio | Träning & Wellness i Uppsala',
        description:
            'Professionell pilates i Uppsala. Boka ditt pass enkelt online.',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Pilates Studio Uppsala'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Pilates Studio | Träning & Wellness i Uppsala',
        description: 'Professionell pilates i Uppsala.',
        images: ['/og-image.png']
    },
    icons: {
        icon: '/favicon.ico'
        // apple: '/apple-touch-icon.png'
    }
}

export const viewport: Viewport = {
    themeColor: '#ebe5e0'
}

const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'HealthAndBeautyBusiness',
            '@id': `${baseUrl}/#business`,
            name: 'Pilates Studio',
            description:
                'Professionell pilates och wellness i hjärtat av Uppsala.',
            url: baseUrl,
            image: `${baseUrl}/og-image.png`,
            address: {
                '@type': 'PostalAddress',
                addressLocality: 'Uppsala',
                addressRegion: 'Uppsala län',
                addressCountry: 'SE'
            }
        },
        {
            '@type': 'WebSite',
            '@id': `${baseUrl}/#website`,
            url: baseUrl,
            name: 'Pilates Studio | Uppsala',
            publisher: {
                '@id': `${baseUrl}/#business`
            },
            inLanguage: 'sv-SE'
        }
    ]
}

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="sv" className="scroll-smooth" data-scroll-behavior="smooth">
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body
                className={`${roboto.variable} ${instrumentSerif.variable} antialiased`}
            >
                <AuthProvider>
                    <ClassesProvider>
                        <BookingsProvider>
                            <BookingModalProvider>
                                <BookingModal />
                                {children}
                            </BookingModalProvider>
                        </BookingsProvider>
                    </ClassesProvider>
                </AuthProvider>
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
