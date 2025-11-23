const SectionDivider = ({
    width = '65%',
    height = '4px',
    bg = 'bg-btn/60',
    mt = 'mt-14',
    mb = 'mb-14'
}) => {
    return (
        <div
            className={`
                ${mt} ${mb}
                mx-auto
                ${bg}
                rounded-full
                w-[${width}]
                h-[${height}]
            `}
        />
    )
}

export default SectionDivider
