import { Metadata } from 'next'
import { db } from "@/db"
import { tenants } from "@/db/schema"
import { eq } from "drizzle-orm"

interface LayoutProps {
    children: React.ReactNode
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
    const { slug } = await params

    const tenantDb = await db.query.tenants.findFirst({
        where: eq(tenants.slug, slug)
    })

    if (!tenantDb) {
        return {
            title: 'Agenda Online',
            description: 'Agende seu horário com facilidade.',
        }
    }

    const title = tenantDb.name
    const subtitle = (tenantDb.config as any)?.__editorConfig?.hero?.subtitle || ""
    const description = (tenantDb.config as any)?.__editorConfig?.hero?.description || tenantDb.description || tenantDb.heroHeadline || `Agende seu horário no ${tenantDb.name}`
    const fullTitle = subtitle ? `${title} | ${subtitle}` : `${title} | Agenda Online`

    return {
        title: fullTitle,
        description,
        metadataBase: new URL('https://agendaonline.app'),
        openGraph: {
            title: fullTitle,
            description,
            type: 'website',
            locale: 'pt_BR',
            siteName: tenantDb.name,
        },
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description,
        },
        robots: {
            index: true,
            follow: true,
        }
    }
}

export default async function Layout({ children }: LayoutProps) {
    return (
        <>
            {children}
        </>
    )
}
