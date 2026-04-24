/**
 * Tenant Config Builder — Single Source of Truth
 *
 * Centralized function that builds a TenantConfig from the database.
 * Used by: API routes, SSR pages, Admin Cockpit.
 * This eliminates duplicate data-fetching logic across the codebase.
 */

import { db } from "@/db"
import { tenants, services, categories, subscriptions, businessTypes } from "@/db/schema"
import { eq } from "drizzle-orm"
import type { TenantConfig, ConfigEnvironment } from "./tenant-config"
import { FREE_FEATURES, PRO_FEATURES } from "./tenant-config"
import type { TenantBadge, TenantData } from "./tenant-types"
import { mergeTenantWithDefaults } from "./tenant-defaults"

interface BuildOptions {
  environment?: ConfigEnvironment
}

/**
 * Build a complete TenantConfig from the database for a given slug.
 * Returns null if tenant not found.
 */
export async function buildTenantConfig(
  slug: string,
  options: BuildOptions = {}
): Promise<TenantConfig | null> {
  const { environment = "production" } = options

  // 1. Fetch Tenant
  const tenantDb = await db.query.tenants.findFirst({
    where: eq(tenants.slug, slug),
  })

  if (!tenantDb) return null

  // 2. Fetch Categories
  const categoriesDb = await db.query.categories.findMany({
    where: eq(categories.tenantId, tenantDb.id),
    orderBy: (categories, { asc }) => [asc(categories.sortOrder)],
  })

  // 3. Fetch Services
  const servicesDb = await db.query.services.findMany({
    where: eq(services.tenantId, tenantDb.id),
    orderBy: (services, { asc }) => [asc(services.sortOrder)],
  })

  // 4. Fetch Subscription
  const sub = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.tenantId, tenantDb.id),
  })
  const hasActiveSub = sub && ["active", "trialing"].includes(sub.status)
  const plan = sub?.plan || "essencial"

  // 5. Fetch Business Type
  let businessTypeSlug = ""
  let businessTypeName = ""
  if (tenantDb.businessTypeId) {
    const bt = await db.query.businessTypes.findFirst({
      where: eq(businessTypes.id, tenantDb.businessTypeId),
    })
    businessTypeSlug = bt?.slug || ""
    businessTypeName = bt?.name || ""
  }

  // 6. Build merged TenantData (preserves existing merge logic for compatibility)
  const mergedData: TenantData = mergeTenantWithDefaults({
    ...tenantDb,
    businessType: businessTypeSlug || (tenantDb as any).businessType,
    colors: {
      primary: tenantDb.primaryColor,
      hover: tenantDb.hoverColor,
    },
    contact: {
      phone: tenantDb.phone || "",
      whatsapp: tenantDb.whatsapp || "",
      address: tenantDb.address || "",
      instagram: tenantDb.instagram || "",
      mapEmbedUrl: tenantDb.mapEmbedUrl || "",
    },
    logoUrl: tenantDb.logoUrl || "",
    heroImageUrl: tenantDb.heroImageUrl || "",
    avatarUrl: tenantDb.avatarUrl || "",
    founder: {
      name: tenantDb.founderName || "",
      bio: tenantDb.founderBio || "",
      role: tenantDb.founderRole || "",
      imageUrl: tenantDb.profileImageUrl || "",
    },
    heroBadge: tenantDb.heroBadge || "",
    heroHeadline: tenantDb.heroHeadline || "",
    heroHighlight: tenantDb.heroHighlight || "",
    ctaText: tenantDb.ctaText || "Agendar Horário",
    trustBadges: (tenantDb.trustBadges as TenantBadge[]) || [],
    faq: (tenantDb.faq as any[]) || [],
    beforeAfter: (tenantDb.beforeAfter as any[]) || [],
    sectionStyles: (tenantDb.sectionStyles as any) || undefined,
    responsiveOverrides: (tenantDb.responsiveOverrides as any) || undefined,
    heroImageSettings: (tenantDb.heroImageSettings as any) || undefined,
    chat: (tenantDb.chat as any) || undefined,
    theme: tenantDb.theme || "neutro",
    designSystem: tenantDb.designSystem,
    config: tenantDb.config,
  })

  // 7. Format services and categories
  let formattedCategories: any[]
  let formattedServices: any[]

  if (servicesDb.length > 0) {
    formattedCategories =
      categoriesDb.length > 0
        ? categoriesDb.map((c) => ({ id: c.id, label: c.label, slug: c.slug }))
        : mergedData.categories || []

    formattedServices = servicesDb.map((s) => ({
      id: s.id,
      name: s.name,
      slug: s.slug || "",
      categoryId: s.categoryId,
      description: s.description || "",
      image: s.image || "",
      price: s.price ? Number(s.price) : 0,
      duration: s.duration || 60,
      isActive: s.isActive,
    }))
  } else {
    formattedCategories = mergedData.categories || []
    formattedServices = mergedData.services || []
  }

  // 8. Compute trial status
  const TRIAL_DAYS = 7
  const trialEndsAt = new Date(
    tenantDb.createdAt.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000
  )
  const isExpired = new Date() > trialEndsAt && !hasActiveSub
  const diffTime = trialEndsAt.getTime() - Date.now()
  const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))

  // 9. Determine features based on plan
  const isPro = hasActiveSub && (plan === "profissional" || plan === "premium")
  const features = {
    free: [...FREE_FEATURES],
    pro: isPro ? [...PRO_FEATURES] : [],
  }

  // 10. Assemble TenantConfig
  const config: TenantConfig = {
    id: tenantDb.id,
    slug: tenantDb.slug,
    segmento: businessTypeSlug,
    segmentoName: businessTypeName,
    theme: (tenantDb.theme || "neutro") as any,

    plan,
    features,

    designSystem: tenantDb.designSystem,
    config: tenantDb.config,

    services: formattedServices,
    categories: formattedCategories,

    content: {
      heroHeadline: mergedData.heroHeadline,
      heroHighlight: mergedData.heroHighlight,
      heroBadge: mergedData.heroBadge,
      description: mergedData.description,
      ctaText: mergedData.ctaText,
      tone: "", // populated from arvore if needed
      trustBadges: mergedData.trustBadges,
      faq: mergedData.faq,
      beforeAfter: mergedData.beforeAfter,
    },

    branding: {
      name: mergedData.name,
      surname: mergedData.surname,
      logoUrl: mergedData.logoUrl,
      heroImageUrl: mergedData.heroImageUrl,
      avatarUrl: mergedData.avatarUrl,
      primaryColor: tenantDb.primaryColor,
      hoverColor: tenantDb.hoverColor,
      headerBgColor: tenantDb.headerBgColor || "",
    },

    founder: mergedData.founder,

    contact: mergedData.contact,

    chat: mergedData.chat || {
      greeting: "Olá! Como podemos ajudar?",
      avatarUrl: "",
      status: "Online",
    },

    layout: {
      sections: mergedData.sections || [],
      sectionStyles: mergedData.sectionStyles,
      responsiveOverrides: mergedData.responsiveOverrides,
      heroImageSettings: mergedData.heroImageSettings,
    },

    metadata: {
      version: (tenantDb as any).configVersion || 1,
      environment,
      onboardingCompleted: tenantDb.onboardingCompleted,
      createdAt: tenantDb.createdAt.toISOString(),
      updatedAt: tenantDb.updatedAt.toISOString(),
      lastPublished: (tenantDb as any).lastPublished?.toISOString() || null,
      publishedBy: (tenantDb as any).publishedBy || null,
    },

    trialStatus: {
      isExpired,
      daysLeft,
      trialEndsAt: trialEndsAt.toISOString(),
    },
  }

  return config
}

/**
 * Convert a TenantConfig back to TenantData format for the TenantDisplay component.
 * This preserves backward compatibility with the existing rendering pipeline.
 */
export function configToTenantData(config: TenantConfig): TenantData {
  return {
    id: config.id,
    slug: config.slug,
    name: config.branding.name,
    surname: config.branding.surname,
    title: `${config.branding.name} | ${config.branding.surname}`,
    description: config.content.description,
    businessTypeId: undefined,

    heroBadge: config.content.heroBadge,
    heroImageUrl: config.branding.heroImageUrl,
    heroImageSettings: config.layout.heroImageSettings,
    ctaText: config.content.ctaText,
    heroHeadline: config.content.heroHeadline,
    heroHighlight: config.content.heroHighlight,

    colors: {
      primary: config.branding.primaryColor,
      hover: config.branding.hoverColor,
    },

    contact: config.contact,

    founder: config.founder,

    logoUrl: config.branding.logoUrl,
    avatarUrl: config.branding.avatarUrl,
    headerBgColor: config.branding.headerBgColor,

    trustBadges: config.content.trustBadges,

    chat: config.chat,

    categories: config.categories,
    services: config.services,
    faq: config.content.faq,
    beforeAfter: config.content.beforeAfter,
    sections: config.layout.sections,

    sectionStyles: config.layout.sectionStyles,
    responsiveOverrides: config.layout.responsiveOverrides,

    onboardingCompleted: config.metadata.onboardingCompleted,
    theme: config.theme,
    designSystem: config.designSystem,
    config: config.config,

    createdAt: config.metadata.createdAt,
    updatedAt: config.metadata.updatedAt,
    plan: config.plan,
    trialStatus: config.trialStatus,
  }
}
