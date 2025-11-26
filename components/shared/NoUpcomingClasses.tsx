import { CalendarOff } from 'lucide-react'

const NoUpcomingClasses = () => {
    return (
        <div
            className="flex flex-col items-center justify-center text-center
                    bg-secondary-bg/40 rounded-xl
                    py-14 px-6 w-full lg:w-[60%] mx-auto shadow-md"
        >
            <div className="w-14 h-14 rounded-full bg-white shadow flex items-center justify-center mb-4">
                <CalendarOff className="w-6 h-6 text-gray-400 rotate-90" />
            </div>

            <h3 className="text-xl font-semibold text-gray-800">
                No Upcoming Classes
            </h3>

            <p className="text-gray-500 mt-1 max-w-sm">
                Once the instructor add classes, they will appear here so
                visitors can book their sessions.
            </p>
        </div>
    )
}

export default NoUpcomingClasses
