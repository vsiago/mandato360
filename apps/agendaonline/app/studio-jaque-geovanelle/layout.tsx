import type { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Studio Jaque Geovanelle | Brow Lamination & Micropigmentação',
    description: 'Especialista em Brow Lamination, Micropigmentação de sobrancelhas e labial no Centro de Itaguaí.',
    icons: {
        icon: [
            { url: '/jaque-favicon.png', sizes: '512x512', type: 'image/png' }
        ],
        shortcut: ['/jaque-favicon.png'],
        apple: [
            { url: '/jaque-favicon.png', sizes: '512x512', type: 'image/png' },
        ],
    },
    openGraph: {
        title: 'Studio Jaque Geovanelle',
        description: 'Especialista em Brow Lamination e Micropigmentação no Centro de Itaguaí.',
        url: 'https://jaquegeovanelle.com.br',
        siteName: 'Studio Jaque Geovanelle',
        images: [
            {
                url: '/jaque-favicon.png', // Using the elegant monogram for the link preview
                width: 512,
                height: 512,
            },
        ],
        locale: 'pt_BR',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Studio Jaque Geovanelle',
        description: 'Especialista em Brow Lamination e Micropigmentação no Centro de Itaguaí.',
        images: ['/jaque-favicon.png'],
    },
}

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return <>{children}</>
}
