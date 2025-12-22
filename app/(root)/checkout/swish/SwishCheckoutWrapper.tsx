'use client'
import { useSearchParams } from 'next/navigation'
import { useClasses } from '@/context/ClassesContext'
import SwishCheckoutPage from '@/components/checkout/SwishCheckoutPage'

const SwishCheckoutWrapper = () => {
    const searchParams = useSearchParams()
    const { classes } = useClasses()

    const classId = searchParams.get('classId') || ''
    const selectedClass = classes.find((c) => c.id === classId)
    if (!selectedClass) return <div>Class not found</div>

    const amount = selectedClass?.price

    const title = searchParams.get('title') || selectedClass.title
    const date = searchParams.get('date') || ''
    const startTime = searchParams.get('startTime') || ''
    const endTime = searchParams.get('endTime') || ''
    const guestName = searchParams.get('guestName') || undefined
    const guestEmail = searchParams.get('guestEmail') || undefined

    return (
        <>
            <SwishCheckoutPage
                amount={amount}
                classId={classId}
                title={title}
                date={date}
                startTime={startTime}
                endTime={endTime}
                guestName={guestName}
                guestEmail={guestEmail}
            />
        </>
    )
}

export default SwishCheckoutWrapper
