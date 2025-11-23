import Link from 'next/link'

const Footer = () => {
    const footerLinks = [
        { name: 'Home', path: '/' },
        { name: 'Classes', path: '/classes' },
        { name: 'About', path: '/about' },
        { name: 'Book Now', path: '/book' }
    ]

    const socials = [
        {
            name: 'Instagram',
            url: 'https://instagram.com',
            icon: '/icons/instagram.svg'
        },
        {
            name: 'TikTok',
            url: 'https://tiktok.com',
            icon: '/icons/tiktok.svg'
        },
        {
            name: 'Email',
            url: 'mailto:info@pilatesstudio.com',
            icon: '/icons/gmail.svg'
        }
    ]

    return (
        <footer className="flex flex-col bg-secondary-bg items-center justify-around w-full py-8 text-black mt-18">
            <div className="flex flex-col items-center gap-8">
                <img src="/images/logo.png" alt="logo" width={120} />

                <div className="flex items-center gap-6">
                    {footerLinks.map((l, i) => (
                        <Link
                            key={i}
                            href={l.path}
                            className="group flex flex-col gap-0.5"
                        >
                            {l.name}
                            <div
                                className={`bg-black h-0.5 w-0 group-hover:w-full transition-all duration-300`}
                            />
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    {socials.map((s, i) => (
                        <a
                            key={i}
                            href={s.url}
                            target="_blank"
                            className="hover:-translate-y-0.5 transition-all duration-300"
                        >
                            <img
                                src={s.icon}
                                alt={s.name}
                                width={24}
                                height={24}
                            />
                        </a>
                    ))}
                </div>
            </div>

            <p className="mt-10 text-center opacity-80 text-sm">
                © {new Date().getFullYear()} Pilates Studio. All rights
                reserved.
            </p>
        </footer>
    )
}

export default Footer
