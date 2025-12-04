import { Info } from 'lucide-react'

const CancellationPolicy = ({ className = '' }) => {
    return (
        <p
            className={`flex items-center gap-1 italic text-sm text-gray-500 ${className}`}
        >
            <Info className="w-4 h-4" />
            Free cancellation if you cancel at least 24h before class start
        </p>
    )
}

export default CancellationPolicy
