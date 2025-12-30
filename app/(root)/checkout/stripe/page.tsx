import type { Metadata } from 'next'
import { Suspense } from 'react'
import StripeCheckoutWrapper from './StripeCheckoutWrapper'
import Loader from '@/components/shared/ui/Loader'

export const metadata: Metadata = {
    title: 'Stripe Checkout | Pilates Studio',
    description: 'Proceed with your Stripe payment for your class booking.'
}

export const dynamic = 'force-dynamic'

const Page = () => {
    return (
        <Suspense fallback={<Loader />}>
            <StripeCheckoutWrapper />
        </Suspense>
    )
}

export default Page
