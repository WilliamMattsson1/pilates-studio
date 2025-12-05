'use client'

const SkeletonClassCard = () => {
    return (
        <div className="min-w-[250px] w-full sm:w-full relative rounded-lg shadow-md p-4 flex flex-col overflow-hidden bg-gray-100">
            {/* Shimmer overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 opacity-50 animate-shimmer"></div>

            {/* Title */}
            <div className="h-6 w-3/4 bg-gray-300 rounded-md mt-4 mb-2"></div>

            {/* Date / Time row */}
            <div className="flex items-center gap-1 mb-2">
                <div className="h-4 w-16 bg-gray-300 rounded-full"></div>
                <span className="text-gray-200">•</span>
                <div className="h-4 w-20 bg-gray-300 rounded-full"></div>
            </div>

            {/* Footer: booked spots + button */}
            <div className="mt-auto flex items-center justify-between">
                <div className="h-4 w-16 bg-gray-300 rounded-full"></div>
                <div className="h-7 w-20 bg-gray-300 rounded-full"></div>
            </div>
        </div>
    )
}

export default SkeletonClassCard
