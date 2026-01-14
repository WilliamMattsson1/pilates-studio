'use client'
import React, { useEffect, useState } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { StripeError } from '@stripe/stripe-js'
import { Calendar, Clock, User } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useProfile } from '@/hooks/useProfile'
import { StripePaymentElementOptions } from '@stripe/stripe-js'
import CancellationPolicy from '../shared/CancellationPolicy'
import Loader from '../shared/ui/Loader'

interface StripeCheckoutPageProps {
    amount: number
    classId?: string
    title: string
    date: string
    startTime: string
    endTime: string
    guestName?: string
    guestEmail?: string
}

const StripeCheckoutPage = ({
    amount,
    classId,
    title,
    date,
    startTime,
    endTime,
    guestName,
    guestEmail
}: StripeCheckoutPageProps) => {
    const stripe = useStripe()
    const elements = useElements()
    const { user } = useAuth()
    const { profile } = useProfile(user?.id)

    const [errorMessage, setErrorMessage] = useState<string>()
    const [clientSecret, setClientSecret] = useState('')
    const [loading, setLoading] = useState(false)

    const customerName = guestName || profile?.name || ''
    const customerEmail = guestEmail || user?.email || ''

    const paymentElementOptions: StripePaymentElementOptions = {
        paymentMethodOrder: ['card'],
        layout: {
            type: 'tabs',
            defaultCollapsed: false
        },
        defaultValues: {
            billingDetails: {
                name: customerName,
                email: customerEmail,
                phone: 'never'
            }
        }
    }

    useEffect(() => {
        if (!classId || clientSecret) return
        if (!customerEmail) return

        fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                classId,
                userId: user?.id || null,
                guestName: customerName,
                guestEmail: customerEmail,
                classTitle: title,
                classDate: date,
                classTime: `${startTime} - ${endTime}`,
                amount: String(amount)
            })
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    console.error('Payment intent creation failed:', data.error)
                    setErrorMessage(data.error)
                } else {
                    setClientSecret(data.clientSecret)
                }
            })
            .catch((err) => {
                console.error('Payment intent creation error:', err)
                setErrorMessage(
                    'Failed to initialize payment. Please try again.'
                )
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [classId, clientSecret, customerEmail])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)
        setErrorMessage('')

        if (!stripe || !elements) {
            return
        }

        const { error: submitError } = await elements.submit()

        if (submitError) {
            setErrorMessage(submitError.message)
            setLoading(false)
            return
        }

        // Confirm payment - Stripe will handle redirect automatically
        // Stripe will append payment_intent parameter to return_url automatically
        const { error }: { error?: StripeError } = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                return_url: `${window.location.origin}/payment-success?amount=${amount}`
            }
            // Removed redirect: 'if_required' to allow Stripe's native redirect flow
            // Webhook will handle booking creation asynchronously
        })

        if (error) {
            // This point is only reached if there's an immediate error when confirming the payment
            setErrorMessage(error.message)
            setLoading(false)
        }
        // If successful, Stripe will redirect to return_url automatically
    }

    if (!clientSecret || !stripe || !elements) {
        return <Loader />
    }

    return (
        <section className="max-w-[90%] min-h-[90vh] mx-auto my-12 ">
            <h1 className="text-4xl md:text-5xl font-extrabold text-center fancy-font tracking-wide leading-tight mb-8">
                Complete Your Booking
            </h1>
            <div className="lg:max-w-5xl mx-auto rounded-xl bg-secondary-bg shadow-xl overflow-hidden flex flex-col-reverse md:flex-row min-h-[80vh]">
                <div className=" md:w-1/2 p-8 flex flex-col justify-center items-center gap-5 bg-card ">
                    <div className="bg-btn text-white w-20 h-20 flex items-center justify-center rounded-full">
                        <Calendar className="w-10 h-10" />
                    </div>

                    {/* Titel */}
                    <h2 className="text-4xl font-extrabold text-center fancy-font">
                        {title}
                    </h2>

                    {/* Datum och tid på samma rad */}
                    <div className="flex items-center gap-4 text-lg">
                        <div className="flex items-center gap-1">
                            <Calendar className="w-6 h-6" />
                            <span>{date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="w-6 h-6 " />
                            <span>
                                {startTime} - {endTime}
                            </span>
                        </div>
                    </div>

                    {/* Gästinfo */}
                    {guestName && (
                        <div className="flex items-center gap-1  text-lg">
                            <User className="w-6 h-6 " />
                            <span>{guestName}</span>
                        </div>
                    )}
                    {guestEmail && <p className="text-sm">{guestEmail}</p>}

                    {/* Pris */}
                    <div className="mt-4 text-center">
                        <h3 className="text-4xl font-bold">{amount}kr</h3>
                    </div>
                </div>

                <div className="md:w-1/2 p-8 ">
                    <form onSubmit={handleSubmit} className="max-w-xl">
                        {clientSecret && (
                            <PaymentElement options={paymentElementOptions} />
                        )}
                        {errorMessage && <div>{errorMessage}</div>}
                        <button
                            disabled={!stripe || loading}
                            className="text-white w-full p-4 bg-btn mt-3 rounded-md font-bold hover:cursor-pointer hover:bg-btn-hover disabled:opacity-50 disabled:animate-pulse"
                        >
                            {!loading ? `Pay ${amount}kr` : 'Processing...'}
                        </button>
                    </form>
                    <CancellationPolicy className="mt-2" />
                </div>
            </div>
        </section>
    )
}

export default StripeCheckoutPage
