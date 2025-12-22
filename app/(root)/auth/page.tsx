import AuthForm from '@/components/shared/AuthForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Login | Pilates Studio',
    description:
        'Log in to your Pilates Studio account to manage bookings and access your profile.'
}
const page = () => {
    return <AuthForm />
}

export default page
