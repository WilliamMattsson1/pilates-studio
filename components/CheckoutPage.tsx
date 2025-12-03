'use client'
import React, { useEffect, useState } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import convertToSubcurrency from '@/utils/convertToSubcurrency'

const CheckoutPage = ({ amount }: { amount: number }) => {
    const stripe = useStripe()
    const elements = useElements()

    const [errorMessage, setErrorMessage] = useState<string>()
    const [clientSecret, setClientSecret] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'Application/json'
            },
            body: JSON.stringify({ amount: convertToSubcurrency(amount) })
        })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret))
    }, [amount])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)

        if (!stripe || !elements) {
            return
        }

        const { error: submitError } = await elements.submit()

        if (submitError) {
            setErrorMessage(submitError.message)
            setLoading(false)
            return
        }

        const { error } = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                return_url: `${window.location.origin}/payment-success?amount=${amount}`
            }
        })

        if (error) {
            // This point is only reached if there's an immediate error when confirming the payment. Show the error to customer ("Payment details incomplete")
            setErrorMessage(error.message)
        } else {
            // The payment UI automatically closes with success animation. Customer is redirected to return url
        }

        setLoading(false)
    }

    if (!clientSecret || !stripe || !elements) {
        return (
            <div className="fixed inset-0 flex items-center justify-center  z-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 border-4 border-t-4 border-t-btn border-gray-200 rounded-full animate-spin"></div>
                    <span className="text-lg font-medium">Loading...</span>
                </div>
            </div>
        )
    }

    return (
        <section className="max-w-[90%] mx-auto mt-6">
            <div className="lg:max-w-5xl mx-auto rounded-xl bg-secondary-bg shadow-xl overflow-hidden flex flex-col md:flex-row">
                <div className="hidden md:flex md:w-1/2 h-64 md:h-auto max-h-[76vh]">
                    {/* bild eller information om vad som bokas TODO */}
                    <img
                        src="/images/signup-image.png"
                        alt="pilates image"
                        className="w-full h-full object-fill"
                    />
                </div>
                <div className="md:w-1/2 p-8 ">
                    <form onSubmit={handleSubmit} className="max-w-xl">
                        {clientSecret && <PaymentElement />}
                        {errorMessage && <div>{errorMessage}</div>}
                        <button
                            disabled={!stripe || loading}
                            className="text-white w-full p-4 bg-btn mt-3 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse"
                        >
                            {!loading ? `Pay ${amount}kr` : 'Processing...'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default CheckoutPage
