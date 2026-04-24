import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://agendaonline.app'

    // List of static routes
    const routes = [
        '',
        '/prices',
        '/rapido',
        '/services',
        '/dashboards',
        '/contato',
        '/agendamento/estetica',
        '/agendamento/barbearia',
        '/agendamento/tatuagem',
        '/agendamento/petshop',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    return [...routes]
}
