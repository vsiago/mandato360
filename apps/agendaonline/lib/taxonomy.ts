/**
 * Global Taxonomy Queries
 * Centralized data access for business types, categories, services, and placeholders.
 * Replaces hardcoded maps in tenant-defaults.ts
 */

import { db } from "@/db"
import { businessTypes, globalCategories, globalServices, globalPlaceholders } from "@/db/schema"
import { eq, asc } from "drizzle-orm"

/* ─── Business Types ─── */

export async function getBusinessTypes() {
    return db.select().from(businessTypes).orderBy(asc(businessTypes.sortOrder))
}

export async function getBusinessTypeById(id: string) {
    return db.query.businessTypes.findFirst({
        where: eq(businessTypes.id, id),
    })
}

export async function getBusinessTypeBySlug(slug: string) {
    return db.query.businessTypes.findFirst({
        where: eq(businessTypes.slug, slug),
    })
}

/* ─── Categories ─── */

export async function getCategoriesForType(businessTypeId: string) {
    return db
        .select()
        .from(globalCategories)
        .where(eq(globalCategories.businessTypeId, businessTypeId))
        .orderBy(asc(globalCategories.sortOrder))
}

/* ─── Services ─── */

export async function getServicesForType(businessTypeId: string) {
    return db
        .select({
            id: globalServices.id,
            name: globalServices.name,
            slug: globalServices.slug,
            categoryId: globalServices.globalCategoryId,
            defaultDuration: globalServices.defaultDuration,
            defaultPrice: globalServices.defaultPrice,
            defaultDescription: globalServices.defaultDescription,
            sortOrder: globalServices.sortOrder,
        })
        .from(globalServices)
        .where(eq(globalServices.businessTypeId, businessTypeId))
        .orderBy(asc(globalServices.sortOrder))
}

export async function getServicesWithPlaceholders(businessTypeId: string) {
    return db
        .select({
            id: globalServices.id,
            name: globalServices.name,
            slug: globalServices.slug,
            categoryId: globalServices.globalCategoryId,
            defaultDuration: globalServices.defaultDuration,
            defaultPrice: globalServices.defaultPrice,
            defaultDescription: globalServices.defaultDescription,
            sortOrder: globalServices.sortOrder,
            placeholder: globalPlaceholders.placeholderText,
        })
        .from(globalServices)
        .leftJoin(globalPlaceholders, eq(globalPlaceholders.globalServiceId, globalServices.id))
        .where(eq(globalServices.businessTypeId, businessTypeId))
        .orderBy(asc(globalServices.sortOrder))
}

/* ─── Full taxonomy for a business type (used by onboarding + tenant creation) ─── */

export interface TaxonomyTemplate {
    businessType: {
        id: string
        name: string
        slug: string
        icon: string | null
        emoji: string | null
        description: string | null
    }
    categories: {
        id: string
        name: string
        slug: string
        sortOrder: number
    }[]
    services: {
        id: string
        name: string
        slug: string
        categoryId: string
        defaultDuration: number | null
        defaultPrice: string | null
        defaultDescription: string | null
        sortOrder: number
        placeholder: string | null
    }[]
}

export async function getFullTaxonomy(businessTypeId: string): Promise<TaxonomyTemplate | null> {
    const bt = await getBusinessTypeById(businessTypeId)
    if (!bt) return null

    const [categories, services] = await Promise.all([
        getCategoriesForType(businessTypeId),
        getServicesWithPlaceholders(businessTypeId),
    ])

    return {
        businessType: {
            id: bt.id,
            name: bt.name,
            slug: bt.slug,
            icon: bt.icon,
            emoji: bt.emoji,
            description: bt.description,
        },
        categories: categories.map(c => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            sortOrder: c.sortOrder,
        })),
        services,
    }
}
