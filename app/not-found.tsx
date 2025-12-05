import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Page Not Found | Pilates Studio',
    description:
        'The page you are looking for does not exist. Return to the homepage to explore our Pilates classes.'
}

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800 px-4">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <h2 className="text-2xl mb-6">Page Not Found</h2>
            <p className="mb-6 text-center max-w-md">
                Sorry, the page you are looking for does not exist or has been
                moved.
            </p>
            <Link
                href="/"
                className="px-6 py-3 bg-btn text-white rounded-lg hover:shadow-lg hover:bg-btn-hover transition"
            >
                Go Home
            </Link>
        </div>
    )
}

export default NotFound
