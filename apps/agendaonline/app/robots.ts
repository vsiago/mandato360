import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const disallow = [
        '/api/',
        '/admin/',
        '/dashboard/',
        '/checkout',
        '/onboarding',
        '/verificar-email',
        '/confirmar',
        '/esqueci-senha',
    ]

    return {
        rules: [
            { userAgent: '*', allow: '/', disallow },
            { userAgent: 'GPTBot', allow: '/' },
            { userAgent: 'OAI-SearchBot', allow: '/' },
            { userAgent: 'ChatGPT-User', allow: '/' },
            { userAgent: 'PerplexityBot', allow: '/' },
            { userAgent: 'Perplexity-User', allow: '/' },
            { userAgent: 'ClaudeBot', allow: '/' },
            { userAgent: 'Claude-Web', allow: '/' },
            { userAgent: 'anthropic-ai', allow: '/' },
            { userAgent: 'Google-Extended', allow: '/' },
            { userAgent: 'CCBot', allow: '/' },
            { userAgent: 'Applebot-Extended', allow: '/' },
            { userAgent: 'Bytespider', allow: '/' },
        ],
        sitemap: 'https://agendaonline.app/sitemap.xml',
        host: 'https://agendaonline.app',
    }
}
