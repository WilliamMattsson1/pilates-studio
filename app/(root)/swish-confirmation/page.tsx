import { Suspense } from 'react'
import SwishConfirmation from './SwishConfirmation'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Booking Received | Pilates Studio',
    description:
        'Your Swish payment request has been received and your booking is being processed.'
}

export const dynamic = 'force-dynamic'

const SwishConfirmationPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SwishConfirmation />
        </Suspense>
    )
}

export default SwishConfirmationPage
