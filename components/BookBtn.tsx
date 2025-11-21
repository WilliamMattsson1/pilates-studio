'use client'
const BookBtn = () => {
    return (
        <>
            <div className="flex items-center justify-center">
                <button
                    onClick={() => console.log('ses')}
                    className="mt-6 bg-btn-primary mx-auto px-8 py-4"
                >
                    <a href="#book">Book Now</a>
                </button>
            </div>
            <div className="flex flex-row">
                <div
                    className="w-[100px] h-[100px]"
                    style={{ backgroundColor: 'var(--color-bg)' }}
                ></div>
                <div
                    className="w-[100px] h-[100px]"
                    style={{ backgroundColor: 'var(--color-surface)' }}
                ></div>
                <div
                    className="w-[100px] h-[100px]"
                    style={{ backgroundColor: 'var(--color-text)' }}
                ></div>

                <div
                    className="w-[100px] h-[100px]"
                    style={{ backgroundColor: 'var(--color-muted)' }}
                ></div>
                <div
                    className="w-[100px] h-[100px]"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                ></div>
                <div
                    className="w-[100px] h-[100px]"
                    style={{ backgroundColor: 'var(--color-accent)' }}
                ></div>

                <div
                    className="w-[100px] h-[100px]"
                    style={{ backgroundColor: 'var(--color-warm)' }}
                ></div>
                <div
                    className="w-[100px] h-[100px]"
                    style={{ backgroundColor: 'var(--color-danger)' }}
                ></div>
                <div
                    className="w-[100px] h-[100px] backdrop-blur-sm"
                    style={{ backgroundColor: 'var(--glass)' }}
                ></div>
            </div>
        </>
    )
}

export default BookBtn
