'use client'
import { useSearchParams } from 'next/navigation'

const PaymentSuccess = () => {
    const searchParams = useSearchParams()
    const amount = searchParams?.get('amount') || 0
    return (
        <main className="max-w-6xl mx-auto p-10  text-center border m-10 rounded-md bg-secondary-bg">
            <div className="mb-10">
                <h1 className="text-4xl font-extrabold mb-2">Thank you!</h1>
                <h2 className="text-2xl">You succesfully paid</h2>
                <div className="bg-white p-2 rounded-md text-btn mt-5 text-4xl font-bold">
                    {amount}kr
                </div>
            </div>
        </main>
    )
}

export default PaymentSuccess
