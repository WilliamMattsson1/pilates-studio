import type { Metadata } from 'next'
import { Suspense } from 'react'
import SwishCheckoutWrapper from './SwishCheckoutWrapper'
import Loader from '@/components/shared/ui/Loader'

export const metadata: Metadata = {
    title: 'Swish Checkout | Pilates Studio',
    description: 'Proceed with your Swish payment for your class booking.'
}

export const dynamic = 'force-dynamic'

const SwishCheckoutPage = () => {
    return (
        <Suspense fallback={<Loader />}>
            <SwishCheckoutWrapper />
        </Suspense>
    )
}

export default SwishCheckoutPage
