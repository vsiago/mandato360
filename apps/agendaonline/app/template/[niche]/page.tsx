import { notFound } from "next/navigation"
import { getArvoreBySlug } from "@/src/arvores-segmentos"
import { getTheme, type ThemeId } from "@/src/themes"
import { generateMockTenant } from "@/src/themes/mock-tenant"
import { TenantDisplay } from "@/app/[slug]/tenant-client"

interface PageProps {
    params: Promise<{ niche: string }>
    searchParams: Promise<{ theme?: string }>
}

export default async function TemplateLivePreviewPage({ params, searchParams }: PageProps) {
    const { niche } = await params
    const search = await searchParams
    const themeId = (search.theme as ThemeId) || "classico"

    // 1. Fetch Niche Tree
    const arvore = getArvoreBySlug(niche)
    if (!arvore) {
        notFound()
    }

    // 2. Fetch Theme
    const theme = getTheme(themeId)

    // 3. Generate Mock Data identical to production
    const mockTenant = generateMockTenant(arvore, theme)

    // 4. Extract categories and services as expected by TenantDisplay
    // (mockTenant generates these internally to match the DB format fallback)
    const formattedCategories = mockTenant.categories || []
    const formattedServices = mockTenant.services || []

    return (
        <TenantDisplay
            data={mockTenant as any}
            services={formattedServices}
            categories={formattedCategories}
        />
    )
}
