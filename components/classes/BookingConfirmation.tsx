'use client'

import { CheckCircle } from 'lucide-react'
import Confetti from 'react-confetti'
import { useEffect, useState, useRef } from 'react'

interface BookingConfirmationProps {
    title: string
    date: string
    startTime: string
    endTime: string
    onClose: () => void
}

const BookingConfirmation = ({
    title,
    date,
    startTime,
    endTime,
    onClose
}: BookingConfirmationProps) => {
    const [showConfetti, setShowConfetti] = useState(true)
    const [confettiDims, setConfettiDims] = useState({
        width: 0,
        height: 0,
        x: 0,
        y: 0
    })
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const timer = setTimeout(() => setShowConfetti(false), 4000)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect()
            setConfettiDims({
                width: rect.width,
                height: rect.height,
                x: rect.left,
                y: rect.top
            })
        }
    }, [containerRef.current])

    return (
        <div
            ref={containerRef}
            className="relative flex flex-col items-center justify-center gap-4 mx-auto text-center"
        >
            {showConfetti && confettiDims.width > 0 && (
                <Confetti
                    width={confettiDims.width}
                    height={confettiDims.height}
                    confettiSource={{
                        x: 0,
                        y: 0,
                        w: confettiDims.width,
                        h: 0
                    }}
                    numberOfPieces={100}
                    gravity={0.06}
                    initialVelocityX={{ min: -2, max: 2 }}
                    initialVelocityY={{ min: 2, max: 5 }}
                    recycle={false}
                    run
                    wind={0.03}
                />
            )}

            <CheckCircle size={78} className="text-green-500 mb-2" />
            <h3 className="text-2xl font-bold text-gray-800">
                Booking Confirmed!
            </h3>
            <p className="text-gray-600 text-sm md:text-base">
                You have successfully booked <strong>{title}</strong>
                <br />
                <strong>{date}</strong> at{' '}
                <strong>
                    {startTime}-{endTime}
                </strong>
                .
            </p>
            <button
                onClick={onClose}
                className="mt-4 bg-btn text-white px-6 py-2 rounded-lg w-40 font-medium hover:bg-btn/90 transition hover:cursor-pointer"
            >
                Done
            </button>
        </div>
    )
}

export default BookingConfirmation
