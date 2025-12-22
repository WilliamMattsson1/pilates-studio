'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Mail } from 'lucide-react'
import Link from 'next/link'
import TitleHeader from '@/components/shared/TitleHeader'
import Image from 'next/image'

type Message = {
    text: string
    type: 'success' | 'error'
} | null

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState<Message>()
    const { resetPassword } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setMessage(null)

        try {
            await resetPassword(email)
            setMessage({
                text: "We've sent you a reset link!",
                type: 'success'
            })
        } catch (err: unknown) {
            if (err instanceof Error) {
                setMessage({
                    text: err.message,
                    type: 'error'
                })
            } else {
                setMessage({
                    text: 'Something went wrong',
                    type: 'error'
                })
            }
        }
    }

    return (
        <section className="max-w-[90%] mx-auto mb-16 min-h-[40vh]">
            <TitleHeader
                title="Reset Password"
                subtitle="Enter your email"
                alignment="center"
            />

            <div className="lg:max-w-4xl mx-auto mt-6 rounded-lg bg-secondary-bg shadow-xl overflow-hidden flex flex-col md:flex-row">
                <div className="hidden md:flex md:w-1/2 h-58 md:h-[70vh] max-h-[70vh] relative">
                    <Image
                        src="/images/signup-image.png"
                        alt="Pilates"
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                    />
                </div>

                <div className="md:w-1/2 p-8 flex flex-col justify-center">
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4"
                    >
                        <div className="flex flex-col gap-1">
                            <label htmlFor="email" className="font-medium">
                                Email
                            </label>
                            <div className="flex items-center gap-3 px-3 py-3 bg-primary-bg rounded-lg focus-within:ring-2 focus-within:ring-btn/50 transition">
                                <Mail size={20} className="text-gray-400" />
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="flex-1 bg-transparent outline-none text-gray-700"
                                />
                            </div>
                        </div>

                        <button className="p-3 bg-btn text-white rounded-lg font-medium hover:bg-btn-hover hover:cursor-pointer transition">
                            Send reset link
                        </button>

                        {message && (
                            <div
                                className={`mt-2 p-3 rounded-full text-center font-medium ${
                                    message.type === 'success'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                }`}
                            >
                                {message.text}
                            </div>
                        )}
                    </form>

                    <p className="mt-6 text-center text-sm">
                        <Link
                            href="/auth"
                            className="font-semibold hover:underline"
                        >
                            Back to Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    )
}

export default ForgotPasswordPage
