"use server"

import { db } from "@/db"
import { user, subscriptions, tenants, categories, services, globalCategories, globalServices, globalPlaceholders, account, businessTypes } from "@/db/schema"
import { count, eq, and, sql } from "drizzle-orm"
import { requireRoot } from "@/lib/admin-guard"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { getHeroImageForNiche } from "@/src/themes"
import { buildDefaultEditorConfig } from "@/lib/default-editor-config"

export async function getAdminMetrics() {
    const { error } = await requireRoot()
    if (error) throw new Error("Não autorizado")

    const totalUsers = await db.select({ value: count() }).from(user)
    
    // Count paid users (active subscriptions)
    const paidUsers = await db.select({ value: count() })
        .from(subscriptions)
        .where(eq(subscriptions.status, "active"))

    const nonPaidUsers = (totalUsers[0].value || 0) - (paidUsers[0].value || 0)

    return {
        total: totalUsers[0].value || 0,
        paid: paidUsers[0].value || 0,
        free: nonPaidUsers > 0 ? nonPaidUsers : 0
    }
}

export async function getAllClients() {
    const { error } = await requireRoot()
    if (error) throw new Error("Não autorizado")

    const results = await db.select()
    .from(user)
    .leftJoin(tenants, eq(user.id, tenants.ownerId))
    .orderBy(sql`${user.createdAt} DESC`)

    return results.map(row => ({
        id: row.user.id,
        name: row.user.name,
        email: row.user.email,
        role: row.user.role,
        emailVerified: row.user.emailVerified,
        createdAt: row.user.createdAt ? new Date(row.user.createdAt).toISOString() : null,
        tenantSlug: row.tenants?.slug,
        tenantId: row.tenants?.id
    }))
}

export async function deleteClient(id: string) {
    const { error } = await requireRoot()
    if (error) throw new Error("Não autorizado")

    // We should ideally delete associated data or handle foreign keys
    await db.delete(user).where(eq(user.id, id))
    return { success: true }
}

export async function updateClient(id: string, data: any) {
    const { error } = await requireRoot()
    if (error) throw new Error("Não autorizado")

    await db.update(user).set(data).where(eq(user.id, id))
    return { success: true }
}

export async function getClientDetails(id: string) {
    const { error } = await requireRoot()
    if (error) throw new Error("Não autorizado")

    try {
        const result = await db.select({
            user: user,
            tenants: tenants,
            businessType: businessTypes
        })
        .from(user)
        .leftJoin(tenants, eq(user.id, tenants.ownerId))
        .leftJoin(businessTypes, eq(tenants.businessTypeId, businessTypes.id))
        .where(eq(user.id, id))
        .limit(1)

        if (!result[0]) return null

        const row = result[0]

        // If tenant id is null, it means the left join didn't find anything
        return {
            user: {
                id: row.user.id,
                name: row.user.name,
                email: row.user.email,
                role: row.user.role,
                emailVerified: row.user.emailVerified,
                image: row.user.image,
                createdAt: row.user.createdAt ? new Date(row.user.createdAt).toISOString() : null
            },
            tenant: row.tenants?.id ? {
                id: row.tenants.id,
                slug: row.tenants.slug,
                name: row.tenants.name,
                whatsapp: row.tenants.whatsapp,
                phone: row.tenants.phone,
                address: row.tenants.address,
                instagram: row.tenants.instagram,
                plan: row.tenants.plan,
                isDemo: row.tenants.isDemo,
                claimed: row.tenants.claimed,
                businessType: row.businessType?.name,
                createdAt: row.tenants.createdAt ? new Date(row.tenants.createdAt).toISOString() : null
            } : null
        }
    } catch (e: any) {
        console.error("Error in getClientDetails:", e)
        throw new Error(e.message || "Erro ao buscar detalhes do cliente")
    }
}

export async function repairTenantServices(tenantId: string) {
    const { error } = await requireRoot()
    if (error) throw new Error("Não autorizado")

    const tenant = await db.query.tenants.findFirst({
        where: eq(tenants.id, tenantId)
    })

    if (!tenant || !tenant.businessTypeId) throw new Error("Tenant ou Categoria de Negócio não encontrada")

    const gSvcs = await db.query.globalServices.findMany({
        where: eq(globalServices.businessTypeId, tenant.businessTypeId)
    })

    for (const gSvc of gSvcs) {
        const existingSvc = await db.query.services.findFirst({
            where: and(
                eq(services.tenantId, tenantId),
                eq(services.slug, gSvc.slug)
            )
        })

        if (existingSvc) {
            await db.update(services).set({
                image: gSvc.image,
                description: gSvc.defaultDescription
            }).where(eq(services.id, existingSvc.id))
        }
    }

    return { success: true }
}

export async function convertDemoAccount(data: { email: string; password?: string; tenantId: string }) {
    const { data: session } = await auth.api.getSession({ headers: await headers() })
    if (!session) throw new Error("Não autenticado")

    // 1. Update User
    const updateData: any = { email: data.email, emailVerified: false }
    if (data.password) {
        // We use better-auth to update password to ensure hashing
        await auth.api.changePassword({
            body: {
                newPassword: data.password,
                currentPassword: "", // better-auth might require this unless we use internal api
            },
            headers: await headers()
        }).catch(err => {
            console.error("Password change error:", err)
        })
    }

    await db.update(user).set(updateData).where(eq(user.id, session.user.id))

    // 2. Update Tenant
    await db.update(tenants).set({ isDemo: false, claimed: true }).where(eq(tenants.id, data.tenantId))

    revalidatePath("/painel")
    return { success: true }
}

export async function adminCreateTenantAction(data: {
    name: string;
    slug: string;
    businessTypeId: string;
    theme: string;
    demoEmail: string;
    demoPassword: string;
}) {
    const { error: rootError } = await requireRoot()
    if (rootError) throw new Error("Não autorizado")

    try {
        // 1. Create User via better-auth API (to ensure password hashing etc)
        const newUser = await auth.api.signUpEmail({
            body: {
                email: data.demoEmail,
                password: data.demoPassword,
                name: data.name,
            },
            headers: await headers()
        })

        if (!newUser) throw new Error("Erro ao criar usuário demo")

        // 2. Force verify email
        await db.update(user).set({ emailVerified: true }).where(eq(user.email, data.demoEmail))

        // 2.5 Find business type slug for default image
        const bt = await db.query.businessTypes.findFirst({
            where: eq(businessTypes.id, data.businessTypeId)
        })
        const btSlug = bt?.slug || "outros"
        const defaultHeroImage = getHeroImageForNiche(btSlug)
        const primaryColor = data.theme === "gold" ? "#d4af37" : "#8c6239"
        const hoverColor = data.theme === "gold" ? "#b8860b" : "#6d4a2a"

        // Generate a COMPLETE config — identical to what /editar-site produces
        const defaultConfig = buildDefaultEditorConfig({
            name: data.name,
            heroImage: defaultHeroImage,
            primaryColor,
            hoverColor,
        })

        // 3. Create Tenant (with ALL text columns + full config)
        const tenantResult = await db.insert(tenants).values({
            slug: data.slug,
            name: data.name,
            businessTypeId: data.businessTypeId,
            theme: data.theme,
            ownerId: newUser.user.id,
            onboardingCompleted: true,
            primaryColor,
            hoverColor,
            heroImageUrl: defaultHeroImage,
            heroHeadline: defaultConfig.hero.title,
            heroBadge: defaultConfig.hero.badge,
            description: defaultConfig.hero.description,
            ctaText: defaultConfig.hero.ctaPrimary,
            trustBadges: defaultConfig.plugins.trust.badges,
            faq: defaultConfig.plugins.faq.items,
            config: defaultConfig,
        }).returning()

        const tenantId = tenantResult[0].id

        // 4. Clone global categories & services (Simplified logic)
        const gCats = await db.query.globalCategories.findMany({
            where: eq(globalCategories.businessTypeId, data.businessTypeId)
        })

        const catIdMap = new Map<string, string>()

        for (const gCat of gCats) {
            const newCatId = crypto.randomUUID()
            catIdMap.set(gCat.id, newCatId)
            await db.insert(categories).values({
                id: newCatId,
                tenantId,
                label: gCat.name,
                slug: gCat.slug,
                sortOrder: gCat.sortOrder
            })
        }

        const gSvcs = await db.query.globalServices.findMany({
            where: eq(globalServices.businessTypeId, data.businessTypeId)
        })

        for (const gSvc of gSvcs) {
            const tenantCatId = catIdMap.get(gSvc.globalCategoryId)
            if (!tenantCatId) continue

            await db.insert(services).values({
                tenantId,
                categoryId: tenantCatId,
                name: gSvc.name,
                slug: gSvc.slug,
                duration: gSvc.defaultDuration,
                price: gSvc.defaultPrice?.toString() || "0",
                image: gSvc.image,
                description: gSvc.defaultDescription,
                isActive: true
            })
        }

        revalidatePath("/admin/clientes")
        
        return { 
            success: true, 
            tenantId,
            siteUrl: `${process.env.NEXT_PUBLIC_APP_URL}/${data.slug}`,
            demoEmail: data.demoEmail,
            demoPassword: data.demoPassword
        }

    } catch (err: any) {
        console.error("Admin Create Tenant Error:", err)
        return { success: false, error: err.message || "Erro desconhecido" }
    }
}
