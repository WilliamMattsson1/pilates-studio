import type { Metadata } from 'next'
import { Suspense } from 'react'
import StripeCheckoutWrapper from './StripeCheckoutWrapper'

export const metadata: Metadata = {
    title: 'Stripe Checkout | Pilates Studio',
    description: 'Proceed with your Stripe payment for your class booking.'
}

export const dynamic = 'force-dynamic'

const Page = () => {
    return (
        <Suspense fallback={<div>Loading checkout...</div>}>
            <StripeCheckoutWrapper />
        </Suspense>
    )
}

export default Page
