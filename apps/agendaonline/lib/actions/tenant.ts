"use server"

// Forced rebuild touch

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { tenants, services, categories, globalCategories, globalServices, globalPlaceholders, subscriptions, businessTypes } from "@/db/schema"
import { auth } from "@/lib/auth"
import type { TenantData, TenantBadge } from "@/lib/tenant-types"
import { mergeTenantWithDefaults } from "@/lib/tenant-defaults"
import { buildTenantConfig, configToTenantData } from "@/lib/tenant-config-builder"
import { eq, and } from "drizzle-orm"
import { headers } from "next/headers"
import { buildDefaultEditorConfig } from "@/lib/default-editor-config"
import { getHeroImageForNiche } from "@/src/themes"

/* ─── Helpers ─── */

async function getAuthSession() {
    // Playwright Bypass (Dev only)
    if (process.env.NODE_ENV === "development") {
        const h = await headers();
        if (h.get("x-playwright-test") === "true" || h.get("cookie")?.includes("test-bypass=true")) {
            // Find any user to act as a mock session
            const firstUser = await db.query.user.findFirst();
            if (firstUser) {
                return { user: firstUser, session: { id: "mock-session" } };
            }
        }
    }
    return await auth.api.getSession({ headers: await headers() })
}

/** Map TenantData → DB column values */
function mapTenantToDb(data: Partial<TenantData>) {
    return {
        name: data.name,
        surname: data.surname,
        businessTypeId: data.businessTypeId,
        description: data.description,
        // Colors
        primaryColor: data.colors?.primary,
        hoverColor: data.colors?.hover,
        // Contact
        phone: data.contact?.phone,
        whatsapp: data.contact?.whatsapp,
        address: data.contact?.address,
        instagram: data.contact?.instagram,
        mapEmbedUrl: data.contact?.mapEmbedUrl,
        // Branding
        logoUrl: data.logoUrl,
        heroImageUrl: data.heroImageUrl,
        profileImageUrl: data.founder?.imageUrl,
        avatarUrl: data.avatarUrl,
        headerBgColor: data.headerBgColor,
        // Founder
        founderName: data.founder?.name,
        founderBio: data.founder?.bio,
        founderRole: data.founder?.role,
        // Hero content
        heroBadge: data.heroBadge,
        heroHeadline: data.heroHeadline,
        heroHighlight: data.heroHighlight,
        ctaText: data.ctaText,
        // JSON fields
        trustBadges: data.trustBadges as any,
        faq: data.faq as any,
        beforeAfter: data.beforeAfter as any,
        sectionStyles: data.sectionStyles as any,
        responsiveOverrides: data.responsiveOverrides as any,
        heroImageSettings: data.heroImageSettings as any,
        chat: data.chat as any,
        // Theme
        theme: data.theme,
        designSystem: data.designSystem,
        config: {
            ...(data.config || {}),
            pix: data.pix || (data.config as any)?.pix,
            businessHours: (data as any).businessHours || (data.config as any)?.businessHours
        },
        updatedAt: new Date(),
    }
}

/** Map DB row → TenantData (partial) for merging with defaults */
function mapDbToTenantPartial(t: typeof tenants.$inferSelect) {
    return {
        id: t.id,
        slug: t.slug,
        name: t.name,
        surname: t.surname || "",
        businessTypeId: t.businessTypeId || undefined,
        description: t.description || "",
        colors: {
            primary: t.primaryColor,
            hover: t.hoverColor,
        },
        contact: {
            phone: t.phone || "",
            whatsapp: t.whatsapp || "",
            address: t.address || "",
            instagram: t.instagram || "",
            mapEmbedUrl: t.mapEmbedUrl || "",
        },
        logoUrl: t.logoUrl || "",
        heroImageUrl: t.heroImageUrl || "",
        avatarUrl: t.avatarUrl || "",
        headerBgColor: t.headerBgColor || undefined,
        founder: {
            name: t.founderName || "",
            bio: t.founderBio || "",
            role: t.founderRole || "",
            imageUrl: t.profileImageUrl || "",
        },
        heroBadge: t.heroBadge || "",
        heroHeadline: t.heroHeadline || "",
        heroHighlight: t.heroHighlight || "",
        ctaText: t.ctaText || "Agendar Horário",
        trustBadges: (t.trustBadges as TenantBadge[]) || [],
        faq: (t.faq as any[]) || [],
        beforeAfter: (t.beforeAfter as any[]) || [],
        sectionStyles: (t.sectionStyles as any) || undefined,
        responsiveOverrides: (t.responsiveOverrides as any) || undefined,
        heroImageSettings: (t.heroImageSettings as any) || undefined,
        chat: (t.chat as any) || undefined,
        theme: t.theme || "neutro",
        designSystem: t.designSystem,
        config: t.config,
        pix: (t.config as any)?.pix,
        onboardingCompleted: t.onboardingCompleted,
    }
}

/* ─── Get My Tenant ─── */

export async function getMyTenantAction(): Promise<{ success: boolean; data?: TenantData & { plan?: string }; error?: string }> {
    try {
        const session = await getAuthSession()
        if (!session?.user) return { success: false, error: "Não autenticado." }

        const tenant = await db.query.tenants.findFirst({
            where: eq(tenants.ownerId, session.user.id)
        })

        if (!tenant) return { success: false, error: "Nenhum tenant encontrado." }

        // Use the centralized builder to ensure 1:1 parity with the public site
        const config = await buildTenantConfig(tenant.slug)
        if (!config) return { success: false, error: "Erro ao montar configuração do tenant." }

        // Convert the unified config back to TenantData format for the editor
        const data = configToTenantData(config)

        return {
            success: true,
            data: {
                ...data,
                plan: config.plan
            }
        }
    } catch (error) {
        console.error("Error in getMyTenantAction:", error)
        return { success: false, error: "Erro interno", data: undefined }
    }
}

/* ─── Create Tenant ─── */

export async function createTenantAction(data: Partial<TenantData>): Promise<{ success: boolean; tenantId?: string; error?: string }> {
    try {
        const session = await getAuthSession()
        if (!session?.user) return { success: false, error: "Não autenticado." }

        // Check if user already has a tenant
        const existing = await db.query.tenants.findFirst({
            where: eq(tenants.ownerId, session.user.id)
        })
        if (existing) return { success: false, error: "Você já possui um site cadastrado." }

        // Check slug uniqueness
        if (data.slug) {
            const slugExists = await db.query.tenants.findFirst({
                where: eq(tenants.slug, data.slug)
            })
            if (slugExists) return { success: false, error: "Esta URL já está em uso." }
        }

        const dbValues = mapTenantToDb(data)

        // Find business type slug to get default hero image
        let btSlug = "outros"
        if (dbValues.businessTypeId) {
            const bt = await db.query.businessTypes.findFirst({
                where: eq(businessTypes.id, dbValues.businessTypeId)
            })
            if (bt) btSlug = bt.slug
        }
        
        // Always enforce a default hero image during creation if none exists
        const defaultHeroImage = getHeroImageForNiche(btSlug)
        const resolvedPrimary = dbValues.primaryColor || "#8c6239"
        const resolvedHover = dbValues.hoverColor || "#6d4a2a"
        
        // Generate a COMPLETE config — identical to what /editar-site produces
        const defaultConfig = buildDefaultEditorConfig({
            name: dbValues.name || data.name || "Meu Negócio",
            heroImage: dbValues.heroImageUrl || defaultHeroImage,
            primaryColor: resolvedPrimary,
            hoverColor: resolvedHover,
            heroHeadline: dbValues.heroHeadline || undefined,
            heroBadge: dbValues.heroBadge || undefined,
            description: dbValues.description || undefined,
            ctaText: dbValues.ctaText || undefined,
            nicheSlug: btSlug,
        })

        const result = await db.insert(tenants).values({
            slug: data.slug || "meu-negocio",
            name: dbValues.name || "Meu Negócio",
            surname: dbValues.surname,
            businessTypeId: dbValues.businessTypeId || undefined,
            description: dbValues.description || defaultConfig.hero.description,
            primaryColor: resolvedPrimary,
            hoverColor: resolvedHover,
            phone: dbValues.phone,
            whatsapp: dbValues.whatsapp,
            address: dbValues.address,
            instagram: dbValues.instagram,
            mapEmbedUrl: dbValues.mapEmbedUrl,
            logoUrl: dbValues.logoUrl,
            heroImageUrl: dbValues.heroImageUrl || defaultHeroImage,
            profileImageUrl: dbValues.profileImageUrl,
            avatarUrl: dbValues.avatarUrl,
            founderName: dbValues.founderName,
            founderBio: dbValues.founderBio,
            founderRole: dbValues.founderRole,
            heroBadge: dbValues.heroBadge || defaultConfig.hero.badge,
            heroHeadline: dbValues.heroHeadline || defaultConfig.hero.title,
            heroHighlight: dbValues.heroHighlight,
            ctaText: dbValues.ctaText || defaultConfig.hero.ctaPrimary,
            trustBadges: dbValues.trustBadges || defaultConfig.plugins.trust.badges,
            faq: dbValues.faq || defaultConfig.plugins.faq.items,
            beforeAfter: dbValues.beforeAfter || [],
            sectionStyles: dbValues.sectionStyles,
            responsiveOverrides: dbValues.responsiveOverrides,
            chat: dbValues.chat,
            theme: data.theme || "neutro",
            config: defaultConfig,
            onboardingCompleted: true,
            ownerId: session.user.id,
        }).returning()

        const tenantId = result[0].id

        // ─── Categories & Services ───
        const categoryIdMap = new Map<string, string>()

        // 1. Check if categories are provided in the data (from onboarding)
        if (data.categories && data.categories.length > 0) {
            try {
                for (const cat of data.categories) {
                    const newCatId = crypto.randomUUID()
                    categoryIdMap.set(cat.id, newCatId)

                    await db.insert(categories).values({
                        id: newCatId,
                        tenantId,
                        label: cat.label,
                        slug: cat.label.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
                        sortOrder: 0,
                    })
                }

                // 2. Insert services if provided
                if (data.services && data.services.length > 0) {
                    for (const svc of data.services) {
                        const tenantCategoryId = categoryIdMap.get(svc.categoryId)
                        if (!tenantCategoryId) continue

                        await db.insert(services).values({
                            tenantId,
                            categoryId: tenantCategoryId,
                            name: svc.name,
                            slug: svc.slug || svc.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                            description: svc.description || "",
                            duration: svc.duration || 60,
                            price: svc.price?.toString() || "0",
                            image: svc.image || "",
                            sortOrder: 0,
                            isActive: true,
                        })
                    }
                }
                console.log(`✅ Created ${data.categories.length} categories and ${data.services?.length} services from onboarding data`)
            } catch (error) {
                console.error("⚠️ Error creating categories/services from data:", error)
            }
        }
        // 3. FALLBACK: Clone from global taxonomy if no categories were provided
        else if (data.businessTypeId) {
            try {
                // Fetch global categories for this business type
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

                // Fetch global services + placeholders for this business type
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

                console.log(`✅ Cloned ${gCats.length} categories and ${gSvcs.length} services from global taxonomy`)
            } catch (cloneError) {
                console.error("⚠️ Error cloning global taxonomy:", cloneError)
            }
        }

        revalidatePath("/painel")
        return { success: true, tenantId }
    } catch (error) {
        console.error("Error in createTenantAction:", error)
        return { success: false, error: "Erro ao criar o site." }
    }
}

/* ─── Save / Update Tenant ─── */

export async function saveTenantAction(data: Partial<TenantData>): Promise<{ success: boolean; error?: string }> {
    try {
        const session = await getAuthSession()
        if (!session?.user) return { success: false, error: "Usuário não autenticado." }

        // Find tenant by slug or by owner
        let existingTenant
        if (data.slug) {
            existingTenant = await db.query.tenants.findFirst({
                where: eq(tenants.slug, data.slug)
            })
        } else {
            existingTenant = await db.query.tenants.findFirst({
                where: eq(tenants.ownerId, session.user.id)
            })
        }

        if (!existingTenant) return { success: false, error: "Tenant não encontrado." }
        if (existingTenant.ownerId && existingTenant.ownerId !== session.user.id) {
            return { success: false, error: "Sem permissão para atualizar este tenant." }
        }

        // ─── Trial Enforcement ───
        const TRIAL_DAYS = 7
        const trialEndsAt = new Date(existingTenant.createdAt.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000)
        
        const sub = await db.query.subscriptions.findFirst({
            where: eq(subscriptions.userId, session.user.id)
        })
        const hasActiveSub = sub && ["active", "trialing"].includes(sub.status)

        if (new Date() > trialEndsAt && !hasActiveSub) {
            return { success: false, error: "Seu período de teste expirou. Por favor, ative sua assinatura para continuar." }
        }

        // Build update, preserving existing values when not provided
        const dbValues = mapTenantToDb(data)
        const updatePayload: Record<string, any> = { updatedAt: new Date() }

        for (const [key, value] of Object.entries(dbValues)) {
            if (value !== undefined) {
                updatePayload[key] = value
            }
        }

        await db.update(tenants)
            .set(updatePayload)
            .where(eq(tenants.id, existingTenant.id))

        revalidatePath(`/${existingTenant.slug}`, 'layout')
        revalidatePath(`/${existingTenant.slug}`, 'page')
        return { success: true }
    } catch (error) {
        console.error("Error in saveTenantAction:", error)
        return { success: false, error: "Erro interno ao salvar dados." }
    }
}
