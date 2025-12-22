import { Metadata } from 'next'
import ResetPasswordPage from './ResetPasswordPage'

export const metadata: Metadata = {
    title: 'Reset Password | Pilates Studio',
    description: 'Reset your Pilates Studio account password securely.'
}

const page = () => {
    return <ResetPasswordPage />
}

export default page
