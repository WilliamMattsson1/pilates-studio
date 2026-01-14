import { MetadataRoute } from 'next'

const baseUrl = 'https://pilates-studio-xi.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
    const routes = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 1.0
        },
        {
            url: `${baseUrl}/classes`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8
        }
    ]

    return routes
}
