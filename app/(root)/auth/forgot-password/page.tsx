import { Metadata } from 'next'
import ForgotPasswordPage from './ForgotPasswordPage'

export const metadata: Metadata = {
    title: 'Forgot Password | Pilates Studio',
    description: 'Reset your Pilates Studio account password by email.'
}

const page = () => {
    return <ForgotPasswordPage />
}

export default page
