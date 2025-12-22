import type { Metadata } from 'next'
import { Suspense } from 'react'
import SwishCheckoutWrapper from './SwishCheckoutWrapper'

export const metadata: Metadata = {
    title: 'Swish Checkout | Pilates Studio',
    description: 'Proceed with your Swish payment for your class booking.'
}

export const dynamic = 'force-dynamic'

const SwishCheckoutPage = () => {
    return (
        <Suspense fallback={<div>Loading checkout...</div>}>
            <SwishCheckoutWrapper />
        </Suspense>
    )
}

export default SwishCheckoutPage
