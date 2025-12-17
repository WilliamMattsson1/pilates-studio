'use client'
import React, { useEffect, useState } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { Calendar, Clock, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useBookings } from '@/context/BookingsContext'
import { useAuth } from '@/context/AuthContext'
import { useProfile } from '@/hooks/useProfile'
import { StripePaymentElementOptions } from '@stripe/stripe-js'
import CancellationPolicy from '../shared/CancellationPolicy'
import { sendBookingEmail } from '@/utils/sendBookingEmail'

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
    const router = useRouter()
    const { addBooking } = useBookings()
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
                name: customerName || '',
                email: customerEmail || '',
                phone: 'never'
            }
        }
    }

    useEffect(() => {
        fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'Application/json'
            },
            body: JSON.stringify({ classId })
        })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret))
    }, [classId])

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

        // confirm payment
        const { paymentIntent, error }: { paymentIntent?: any; error?: any } =
            await stripe.confirmPayment({
                elements,
                clientSecret,
                confirmParams: {
                    return_url: `${window.location.origin}/payment-success?amount=${amount}`
                },
                redirect: 'if_required' // så att vi kan hantera redirect manuellt
            })

        if (error) {
            // This point is only reached if there's an immediate error when confirming the payment. Show the error to customer ("Payment details incomplete")
            setErrorMessage(error.message)
        } else {
            // The payment UI automatically closes with success animation. Customer is redirected to return url
            // Om betalningen lyckades, skapa bokning
            if (paymentIntent?.status === 'succeeded' && classId) {
                try {
                    await addBooking({
                        class_id: classId,
                        user_id: user?.id,
                        guest_name: user ? profile?.name : guestName,
                        guest_email: user ? user?.email : guestEmail,
                        stripe_payment_id: paymentIntent.id
                    })

                    await sendBookingEmail({
                        guestName: customerName,
                        guestEmail: customerEmail,
                        classTitle: title,
                        classDate: date,
                        classTime: `${startTime} - ${endTime}`,
                        price: `${amount}kr`,
                        linkUrl: `${window.location.origin}/classes`
                    }).catch((err) =>
                        console.error('Failed to send booking email', err)
                    )

                    const params = new URLSearchParams()
                    params.set('classId', classId)
                    params.set('amount', String(amount))
                    if (user) {
                        if (profile?.name) params.set('name', profile.name)
                        if (user.email) params.set('email', user.email)
                    } else {
                        if (guestName) params.set('name', guestName)
                        if (guestEmail) params.set('email', guestEmail)
                    }

                    router.push(`/payment-success?${params.toString()}`)
                } catch (err) {
                    setErrorMessage('Booking failed. Please contact support.')
                    console.error(err)
                    router.push('/booking-error')
                }
            }

            setLoading(false)
        }
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
