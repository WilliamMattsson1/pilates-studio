'use client'
import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode
} from 'react'
import { createClient } from '@/utils/supabase/client'
import type { User, Session } from '@supabase/supabase-js'

interface AuthContextProps {
    user: User | null
    session: Session | null
    loading: boolean
    signIn: (email: string, password: string) => Promise<void>
    signUp: (email: string, password: string, name: string) => Promise<void>
    signOut: () => Promise<void>
    resetPassword: (email: string) => Promise<void>
    updatePassword: (newPassword: string) => Promise<void>
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

interface AuthProviderProps {
    children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const supabase = createClient()
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const initAuth = async () => {
            const { data } = await supabase.auth.getSession()
            setSession(data.session)
            setUser(data.session?.user ?? null)
            setLoading(false)
        }

        initAuth()

        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session)
                setUser(session?.user ?? null)
            }
        )

        return () => {
            listener.subscription.unsubscribe()
        }
    }, [supabase])

    const signIn = async (email: string, password: string) => {
        if (user) {
            throw new Error('You are already signed in')
        }
        setLoading(true)

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            })

            if (error) throw error

            setSession(data.session ?? null)
            setUser(data.session?.user ?? null)
        } catch (err: any) {
            console.error('Sign In Error:', err.message)
            throw new Error(err.message || 'Failed to sign in')
        } finally {
            setLoading(false)
        }
    }

    const signUp = async (email: string, password: string, name: string) => {
        if (!email || !password) {
            throw new Error('Email and password are required')
        }

        setLoading(true)

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: { emailRedirectTo: `${location.origin}/auth/callback` }
            })

            if (error) {
                if (error.message.includes('already registered')) {
                    throw new Error('This email is already in use')
                }
                throw error
            }

            const user = data.user
            if (!user) throw new Error('User was not returned')
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: user.id,
                    name: name,
                    email: email
                })

            if (profileError) throw profileError

            setSession(data.session ?? null)
            setUser(data.session?.user ?? null)
        } catch (err: any) {
            console.error('Sign Up Error:', err.message)
            throw new Error(err.message || 'Failed to sign up')
        } finally {
            setLoading(false)
        }
    }

    const signOut = async () => {
        setLoading(true)
        await supabase.auth.signOut()
        setUser(null)
        setSession(null)
        setLoading(false)
    }

    const resetPassword = async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${location.origin}/auth/reset-password`
        })

        if (error) throw error
    }

    const updatePassword = async (newPassword: string) => {
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        })
        if (error) throw error
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                session,
                loading,
                signIn,
                signUp,
                signOut,
                resetPassword,
                updatePassword
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}
