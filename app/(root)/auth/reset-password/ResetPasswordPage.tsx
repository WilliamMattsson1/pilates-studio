'use client'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Lock } from 'lucide-react'
import TitleHeader from '@/components/shared/TitleHeader'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

type MessageType = 'success' | 'error'

const ResetPasswordPage = () => {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState<{
        text: string
        type: MessageType
    } | null>(null)
    const { updatePassword } = useAuth()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setMessage(null)

        if (password !== confirmPassword) {
            setMessage({ text: "Passwords don't match", type: 'error' })
            return
        }

        try {
            await updatePassword(password)
            setMessage({
                text: 'Your password has been updated!',
                type: 'success'
            })
            setPassword('')
            setConfirmPassword('')
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
        <section className="max-w-[90%] mx-auto mb-16">
            <TitleHeader
                title="Set New Password"
                subtitle="Enter your new password below"
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
                            <label htmlFor="password" className="font-medium">
                                New Password
                            </label>
                            <div className="flex items-center gap-3 px-3 py-3 bg-primary-bg rounded-lg focus-within:ring-2 focus-within:ring-btn/50 transition">
                                <Lock size={20} className="text-gray-400" />
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="New Password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                    className="flex-1 bg-transparent outline-none text-gray-700"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label
                                htmlFor="confirmPassword"
                                className="font-medium"
                            >
                                Confirm Password
                            </label>
                            <div className="flex items-center gap-3 px-3 py-3 bg-primary-bg rounded-lg focus-within:ring-2 focus-within:ring-btn/50 transition">
                                <Lock size={20} className="text-gray-400" />
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    required
                                    className="flex-1 bg-transparent outline-none text-gray-700"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="p-3 bg-btn text-white rounded-lg font-medium hover:bg-btn-hover transition"
                        >
                            Update Password
                        </button>

                        {message && (
                            <div className="flex flex-col items-center gap-3 pt-3">
                                <p
                                    className={`w-full text-center p-3 rounded-full ${
                                        message.type === 'success'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}
                                >
                                    {message.text}
                                </p>
                                {message.type === 'success' && (
                                    <button
                                        onClick={() => router.push('/')}
                                        className="px-6 py-2 mt-4 bg-btn text-white rounded-lg font-medium hover:bg-btn-hover transition"
                                    >
                                        Home
                                    </button>
                                )}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </section>
    )
}

export default ResetPasswordPage
