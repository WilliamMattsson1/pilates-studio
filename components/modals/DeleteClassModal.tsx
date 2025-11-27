'use client'

import { ClassItem } from '@/types/classes'
import { MessageCircleWarning, X } from 'lucide-react'

interface DeleteModalProps {
    cls: ClassItem | null
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
}

const DeleteClassModal = ({
    cls,
    isOpen,
    onClose,
    onConfirm
}: DeleteModalProps) => {
    if (!isOpen || !cls) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 "
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative"
                onClick={(e) => e.stopPropagation()} // Stoppar klick inne i modal
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 hover:cursor-pointer transition-colors"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-semibold mb-4 text-center">
                    Confirm Delete
                </h2>
                <MessageCircleWarning
                    size={58}
                    className="mx-auto mb-4 text-red-400"
                />
                <p className="text-center mb-4">
                    Are you sure you want to delete this class?
                </p>
                <p className="text-center mb-6 font-medium">
                    {cls.title} | {cls.date} | {cls.startTime} - {cls.endTime}
                </p>

                <div className="flex justify-center gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-200 hover:cursor-pointer transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 hover:cursor-pointer transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteClassModal
