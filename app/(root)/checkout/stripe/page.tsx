'use client'
import StripeCheckoutPage from '@/components/checkout/StripeCheckoutPage'
import { useClasses } from '@/context/ClassesContext'
import convertToSubcurrency from '@/utils/convertToSubcurrency'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useSearchParams } from 'next/navigation'

if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === undefined) {
    throw new Error(
        'process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined'
    )
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

const Page = () => {
    const searchParams = useSearchParams()
    const { classes } = useClasses()

    const classId = searchParams.get('classId') || ''
    const selectedClass = classes.find((c) => c.id === classId)
    const amount = selectedClass?.price
    if (!amount || amount <= 0) {
        return <div>Invalid amount</div>
    }

    const title = searchParams.get('title') || ''
    const date = searchParams.get('date') || ''
    const startTime = searchParams.get('startTime') || ''
    const endTime = searchParams.get('endTime') || ''
    const guestName = searchParams.get('guestName') || undefined
    const guestEmail = searchParams.get('guestEmail') || undefined

    return (
        <main className="min-h-screen">
            <Elements
                stripe={stripePromise}
                options={{
                    mode: 'payment',
                    amount: convertToSubcurrency(amount),
                    currency: 'sek'
                }}
            >
                <StripeCheckoutPage
                    amount={amount}
                    classId={classId}
                    title={title}
                    date={date}
                    startTime={startTime}
                    endTime={endTime}
                    guestName={guestName}
                    guestEmail={guestEmail}
                />
            </Elements>
        </main>
    )
}

export default Page
