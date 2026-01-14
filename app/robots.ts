import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: ['/', '/classes', '/about'],
                disallow: ['/auth/', '/profiles/', '/admin/', '/api/']
            }
        ],
        sitemap: 'https://pilates-studio-xi.vercel.app/sitemap.xml'
    }
}
