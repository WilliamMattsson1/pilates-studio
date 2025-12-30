'use client'

const Loader = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] py-12">
            <div
                className="w-16 h-16 border-b-3 border-gray-500 rounded-full animate-spin  mb-6"
                role="status"
                aria-label="Loading"
            ></div>

            <p className="text-2xl md:text-3xl font-extrabold text-gray-700 animate-pulse fancy-font tracking-wide leading-tight">
                Loading...
            </p>
        </div>
    )
}

export default Loader
