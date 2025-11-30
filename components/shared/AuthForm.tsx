'use client'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Mail, Lock } from 'lucide-react'
import TitleHeader from './TitleHeader'
import { useRouter } from 'next/navigation'

type AuthFormProps = {
    initialMode?: 'signIn' | 'signUp'
}

export default function AuthForm({ initialMode = 'signIn' }: AuthFormProps) {
    const [mode, setMode] = useState<'signIn' | 'signUp'>(initialMode)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)

    const { signIn, signUp, loading } = useAuth()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        try {
            if (mode === 'signIn') {
                await signIn(email, password)
            } else {
                await signUp(email, password)
            }

            setEmail('')
            setPassword('')

            router.push('/')
        } catch (err: any) {
            setError(err.message || 'Something went wrong')
            setPassword('')
        }
    }

    return (
        <section className="max-w-[90%] mx-auto">
            <TitleHeader
                title={mode === 'signIn' ? 'Welcome Back' : 'Create Account'}
                subtitle={
                    mode === 'signIn'
                        ? 'Sign in to manage your bookings'
                        : 'Sign up to manage your bookings'
                }
                alignment="center"
            />
            <div className="lg:max-w-4xl  mx-auto mt-6 rounded-lg bg-secondary-bg shadow-xl overflow-hidden flex flex-col md:flex-row">
                <div className="hidden md:flex md:w-1/2 h-58 md:h-auto max-h-[70vh]">
                    <img
                        src="/images/signup-image.png"
                        alt="Pilates"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="md:w-1/2 p-8 flex flex-col justify-center">
                    <h2 className="text-3xl font font-semibold mb-6 text-center">
                        {mode === 'signIn' ? 'Sign In' : 'Sign Up'}
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4"
                    >
                        <div className="flex items-center gap-3 px-3 py-3 bg-white rounded-lg focus-within:ring-2 focus-within:ring-btn/50 transition">
                            <Mail size={20} className="text-gray-400" />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="flex-1 bg-transparent outline-none text-gray-700"
                            />
                        </div>

                        <div className="flex items-center gap-3 px-3 py-3 bg-white rounded-lg focus-within:ring-2 focus-within:ring-btn/50 transition">
                            <Lock size={20} className="text-gray-400" />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="flex-1 bg-transparent outline-none text-gray-700"
                            />
                        </div>

                        {error && <p className="text-red-400">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="p-3 bg-btn text-white rounded-lg font-medium hover:opacity-90 transition"
                        >
                            {loading
                                ? 'Loading...'
                                : mode === 'signIn'
                                ? 'Sign In'
                                : 'Sign Up'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-600">
                        {mode === 'signIn' ? (
                            <>
                                Don't have an account?{' '}
                                <button
                                    onClick={() => {
                                        setMode('signUp')
                                        setError(null)
                                    }}
                                    className="text-blue-500 underline"
                                >
                                    Sign Up
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?{' '}
                                <button
                                    onClick={() => {
                                        setMode('signIn')
                                        setError(null)
                                    }}
                                    className="text-blue-500 underline"
                                >
                                    Sign In
                                </button>
                            </>
                        )}
                    </p>
                </div>
            </div>
        </section>
    )
}
