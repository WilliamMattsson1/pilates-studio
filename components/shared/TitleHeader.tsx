'use client'

interface TitleHeaderProps {
    title: string
    subtitle?: string
    alignment?: 'left' | 'center' | 'right'
}

const TitleHeader = ({
    title,
    subtitle,
    alignment = 'center'
}: TitleHeaderProps) => {
    const alignClass = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right'
    }

    return (
        <div className={`flex flex-col my-6 ${alignClass[alignment]}`}>
            {subtitle && (
                <p className=" text-lg md:text-xl text-black/90 italic">
                    {subtitle.toLocaleUpperCase()}
                </p>
            )}
            <h2 className="text-3xl md:text-4xl font-bold fancy-font tracking-wide">
                {title}
            </h2>
        </div>
    )
}

export default TitleHeader
