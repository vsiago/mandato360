import { db } from "@/db"
import { tenants, services, subscriptions } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import { notFound, redirect } from "next/navigation"
import { ServiceClient as ServiceDetails } from "./service-details"
import { mergeTenantWithDefaults } from "@/lib/tenant-defaults"
import type { TenantData } from "@/lib/tenant-types"

interface PageProps {
    params: Promise<{ slug: string; serviceSlug: string }>
}

export default async function ServicePage({ params }: PageProps) {
    const { slug, serviceSlug } = await params

    console.log("ServicePage Hit:", { slug, serviceSlug });

    // 1. Fetch Tenant
    const tenantDb = await db.query.tenants.findFirst({
        where: eq(tenants.slug, slug)
    })

    if (!tenantDb) {
        console.log("Tenant NOT FOUND:", slug);
        notFound()
    }

    // 2. Fetch Subscription / Plan
    const sub = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.tenantId, tenantDb.id)
    })
    
    // Determine plan - from sub or from tenant defaults (mocked/trial)
    const plan = sub?.plan || "essencial"
    const isPro = ["profissional", "premium"].includes(plan)

    console.log("Plan Check:", { plan, isPro });

    // 3. Guard: Only Pro tenants have dynamic service pages
    if (!isPro) {
        console.log("NOT PRO, redirecting...");
        redirect(`/${slug}`)
    }

    // 4. Fetch Service
    const servicesFound = await db.select()
        .from(services)
        .where(
            and(
                eq(services.slug, serviceSlug),
                eq(services.tenantId, tenantDb.id)
            )
        )
        .limit(1)

    const serviceDb = servicesFound[0]

    if (!serviceDb) {
        notFound()
    }

    // 4.1 Fetch Related Services for Upsell
    const relatedServicesDb = await db.query.services.findMany({
        where: and(
            eq(services.tenantId, tenantDb.id),
            eq(services.isActive, true)
        ),
        limit: 10
    })

    const relatedServices = relatedServicesDb
        .filter(s => s.id !== serviceDb.id)
        .slice(0, 3)
        .map(s => ({
            id: s.id,
            name: s.name,
            slug: s.slug,
            price: Number(s.price) || 0,
            image: s.image || ""
        }))

    console.log("Service FOUND:", serviceDb.name);

    // 5. Prepare Tenant Data
    const tenantData: TenantData = mergeTenantWithDefaults({
        slug: tenantDb.slug,
        name: tenantDb.name,
        surname: tenantDb.surname || "",
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
        avatarUrl: tenantDb.avatarUrl || "",
        plan: plan
    })

    // 6. Format Service Data with Fallbacks
    const defaultImage = tenantData.services?.find(s => s.slug === serviceDb.slug)?.image || ""
    
    const formattedService = {
        id: serviceDb.id,
        name: serviceDb.name,
        categoryId: serviceDb.categoryId,
        description: serviceDb.description || "",
        fullDescription: serviceDb.fullDescription || "",
        image: serviceDb.image || defaultImage || "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80",
        longImage: serviceDb.longImage || "",
        price: Number(serviceDb.price) || 0,
        duration: serviceDb.duration || 60,
        features: (serviceDb.features as any[]) || [],
        addons: (serviceDb.addons as any[]) || []
    }

    return (
        <ServiceDetails 
            tenant={tenantData}
            service={formattedService as any}
            relatedServices={relatedServices as any}
        />
    )
}
