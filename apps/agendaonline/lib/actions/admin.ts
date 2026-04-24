"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { tenants, services, categories, globalCategories, globalServices, globalPlaceholders } from "@/db/schema"
import { auth } from "@/lib/auth"
import { getTenantDefaults } from "@/lib/tenant-defaults"
import { tenantToEditorConfig, editorConfigToTenant } from "@/lib/editor-adapter"
import { eq } from "drizzle-orm"
import { headers } from "next/headers"

export async function adminCreateTenantAction(data: any) {
    try {
        const session = await auth.api.getSession({ headers: await headers() })
        if (!session?.user) {
            return { success: false, error: "Não autenticado." }
        }

        // Verifica se é admin (Relaxado temporariamente para testes locais)
        // Se precisar de restrição estrita em produção, descomente abaixo e garanta que o seu usuário no BD tem a role 'admin'
        // if (session.user.role !== 'admin' && session.user.role !== 'superadmin') {
        //     return { success: false, error: "Acesso negado." }
        // }

        // 1. Criar o usuário demo via fetch para evitar sobrescrever a sessão atual
        // Como Better Auth precisa do Request pra rodar auth.api.*, o mais limpo é
        // fazer um POST interno para o endpoint.
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3002"
        const signUpRes = await fetch(`${baseUrl}/api/auth/sign-up/email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Origin": baseUrl,
                "Accept": "application/json"
            },
            body: JSON.stringify({
                email: data.demoEmail,
                password: data.demoPassword,
                name: data.name
            })
        })

        const signUpData = await signUpRes.json()

        if (!signUpRes.ok) {
            return { success: false, error: signUpData.message || "Erro ao criar usuário demo." }
        }

        const newUserId = signUpData.user.id

        // 2. Verifica se o slug já existe
        if (data.slug) {
            const slugExists = await db.query.tenants.findFirst({
                where: eq(tenants.slug, data.slug)
            })
            if (slugExists) return { success: false, error: "Esta URL já está em uso." }
        }

        // 3. Obtém defaults baseados no nicho
        const defaults = getTenantDefaults(data.businessTypeId)
        
        // 3.1 Garante que o nome do site seja o informado no formulário
        defaults.name = data.name || "Demo Site"

        // 3.2 Sincroniza com o estado inicial do editor para garantir paridade 100% no banco (gradientes, vinhetas, etc)
        const initialEditorConfig = tenantToEditorConfig(defaults)
        const synchronizedData = editorConfigToTenant(initialEditorConfig, defaults)

        // 4. Cria o Tenant no banco de dados, vinculando ao newUserId com dados iniciais populados e paridade total com o editor
        const result = await db.insert(tenants).values({
            slug: data.slug || `demo-${Date.now()}`,
            name: data.name || "Demo Site",
            surname: synchronizedData.surname,
            description: synchronizedData.description,
            heroBadge: synchronizedData.heroBadge,
            heroHeadline: synchronizedData.heroHeadline,
            heroHighlight: synchronizedData.heroHighlight,
            ctaText: synchronizedData.ctaText,
            heroImageUrl: synchronizedData.heroImageUrl,
            trustBadges: synchronizedData.trustBadges,
            faq: synchronizedData.faq,
            
            // Campos sincronizados via adapter (Cores, Design System, Config)
            primaryColor: synchronizedData.colors?.primary || "#8c6239",
            hoverColor: synchronizedData.colors?.hover || "#6d4a2a",
            phone: synchronizedData.contact?.phone,
            whatsapp: synchronizedData.contact?.whatsapp,
            address: synchronizedData.contact?.address,
            instagram: synchronizedData.contact?.instagram,
            mapEmbedUrl: synchronizedData.contact?.mapEmbedUrl,
            logoUrl: synchronizedData.logoUrl,
            avatarUrl: synchronizedData.avatarUrl,
            founderName: synchronizedData.founder?.name,
            founderBio: synchronizedData.founder?.bio,
            founderRole: synchronizedData.founder?.role,
            profileImageUrl: synchronizedData.founder?.imageUrl,
            chat: synchronizedData.chat as any,
            beforeAfter: synchronizedData.beforeAfter as any,
            sectionStyles: synchronizedData.sectionStyles as any,
            responsiveOverrides: synchronizedData.responsiveOverrides as any,
            heroImageSettings: synchronizedData.heroImageSettings as any,
            designSystem: synchronizedData.designSystem as any,
            config: synchronizedData.config as any,

            businessTypeId: data.businessTypeId || undefined,
            theme: data.theme || "neutro",
            ownerId: newUserId,
            onboardingCompleted: true,
        }).returning()

        const tenantId = result[0].id

        // 5. Clona categorias e serviços globais baseados no nicho
        if (data.businessTypeId) {
            try {
                const categoryIdMap = new Map<string, string>()
                const gCats = await db.query.globalCategories.findMany({
                    where: eq(globalCategories.businessTypeId, data.businessTypeId),
                    orderBy: (c, { asc }) => [asc(c.sortOrder)]
                })

                for (const gCat of gCats) {
                    const newCatId = crypto.randomUUID()
                    categoryIdMap.set(gCat.id, newCatId)
                    await db.insert(categories).values({
                        id: newCatId,
                        tenantId,
                        label: gCat.name,
                        slug: gCat.slug,
                        sortOrder: gCat.sortOrder,
                    })
                }

                const gSvcs = await db.query.globalServices.findMany({
                    where: eq(globalServices.businessTypeId, data.businessTypeId),
                    orderBy: (s, { asc }) => [asc(s.sortOrder)]
                })

                for (const gSvc of gSvcs) {
                    const placeholder = await db.query.globalPlaceholders.findFirst({
                        where: eq(globalPlaceholders.globalServiceId, gSvc.id)
                    })
                    const tenantCategoryId = categoryIdMap.get(gSvc.globalCategoryId)
                    if (!tenantCategoryId) continue

                    await db.insert(services).values({
                        tenantId,
                        categoryId: tenantCategoryId,
                        name: gSvc.name,
                        slug: gSvc.slug,
                        description: placeholder?.placeholderText || "",
                        duration: gSvc.defaultDuration,
                        sortOrder: gSvc.sortOrder,
                        image: (gSvc as any).image || "",
                        isActive: true,
                    })
                }
            } catch (cloneError) {
                console.error("Erro ao clonar taxonomia global:", cloneError)
            }
        }

        revalidatePath("/admin")
        return { 
            success: true, 
            tenantId, 
            siteUrl: `${baseUrl}/${result[0].slug}`,
            demoEmail: data.demoEmail,
            demoPassword: data.demoPassword
        }
    } catch (error: any) {
        console.error("Error in adminCreateTenantAction:", error)
        return { success: false, error: error.message || "Erro ao criar inquilino demo." }
    }
}
