import type { Metadata } from 'next'
import PaymentSuccess from './PaymentSuccess'
import { Suspense } from 'react'
import Loader from '@/components/shared/ui/Loader'

export const metadata: Metadata = {
    title: 'Booking Confirmed | Pilates Studio',
    description:
        'Your payment was successful and your class booking is confirmed.'
}

export const dynamic = 'force-dynamic'

const PaymentSuccessPage = () => {
    return (
        <Suspense fallback={<Loader />}>
            <PaymentSuccess />
        </Suspense>
    )
}

export default PaymentSuccessPage
