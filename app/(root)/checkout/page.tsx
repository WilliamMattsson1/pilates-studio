'use client'
import CheckoutPage from '@/components/CheckoutPage'
import convertToSubcurrency from '@/utils/convertToSubcurrency'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === undefined) {
    throw new Error(
        'process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined'
    )
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

const page = () => {
    const amount = 197
    return (
        <main className="min-h-screen">
            <div>
                <h1 className="text-3xl">Du ska betala {amount}kr</h1>
            </div>
            <Elements
                stripe={stripePromise}
                options={{
                    mode: 'payment',
                    amount: convertToSubcurrency(amount),
                    currency: 'sek'
                }}
            >
                <CheckoutPage amount={amount} />
            </Elements>
        </main>
    )
}

export default page
