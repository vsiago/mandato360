import { MetadataRoute } from 'next'
import { NICHO_SLUGS, CIDADE_SLUGS, CONCORRENTE_SLUGS } from '@/lib/seo-catalog'

const BASE_URL = 'https://agendaonline.app'

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date()

    const staticRoutes: MetadataRoute.Sitemap = [
        { url: `${BASE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
        { url: `${BASE_URL}/registro`, lastModified: now, changeFrequency: 'monthly', priority: 0.95 },
        { url: `${BASE_URL}/oferta`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
        { url: `${BASE_URL}/indique`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
        { url: `${BASE_URL}/login`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    ]

    const nichoRoutes: MetadataRoute.Sitemap = NICHO_SLUGS.map((slug) => ({
        url: `${BASE_URL}/para/${slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.9,
    }))

    const cidadeRoutes: MetadataRoute.Sitemap = CIDADE_SLUGS.map((slug) => ({
        url: `${BASE_URL}/agenda-online-em/${slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.7,
    }))

    const compararRoutes: MetadataRoute.Sitemap = CONCORRENTE_SLUGS.map((slug) => ({
        url: `${BASE_URL}/comparar/agenda-online-vs-${slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.75,
    }))

    const blogRoutes: MetadataRoute.Sitemap = [
        'quanto-custa-criar-site-salao-de-beleza',
        'como-reduzir-faltas-de-clientes',
        'agenda-online-vs-trinks-comparativo',
    ].map((slug) => ({
        url: `${BASE_URL}/blog/${slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.65,
    }))

    return [
        ...staticRoutes,
        ...nichoRoutes,
        ...cidadeRoutes,
        ...compararRoutes,
        ...blogRoutes,
    ]
}
