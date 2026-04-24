import ServicosClient from "./client"
import { db } from "@/db"
import { services, tenants, categories } from "@/db/schema"
import { auth } from "@/lib/auth"
import { eq } from "drizzle-orm"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function ServicosPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session?.user) {
        redirect("/login")
    }

    // Find the tenant for this user (assume first tenant for now)
    const userTenant = await db.query.tenants.findFirst({
        where: eq(tenants.ownerId, session.user.id)
    })

    if (!userTenant) {
        return (
            <div className="flex flex-col items-center justify-center min-h-100 border-2 border-dashed border-amber-500/20 rounded-xl p-8 text-center space-y-4">
                <div className="bg-muted p-4 rounded-full">
                    <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
                <h3 className="text-xl font-bold">Nenhum tenant encontrado</h3>
                <p className="text-muted-foreground max-w-xs mx-auto">Você ainda não configurou seu negócio. Complete o onboarding ou crie um tenant no editor.</p>
            </div>
        )
    }

    // Fetch categories
    const myCategories = await db.query.categories.findMany({
        where: eq(categories.tenantId, userTenant.id),
        orderBy: (categories, { asc }) => [asc(categories.sortOrder)]
    })

    // Fetch services
    const myServices = await db.query.services.findMany({
        where: eq(services.tenantId, userTenant.id),
        orderBy: (services, { asc }) => [asc(services.sortOrder), asc(services.createdAt)]
    })

    // Match the interface expected by the client component
    const formattedServices = myServices.map(s => ({
        id: s.id,
        name: s.name,
        category: s.categoryId || "Geral",
        description: s.description || "",
        price: s.price || "0.00",
        duration: s.duration || 60,
        isActive: s.isActive
    }))

    const formattedCategories = myCategories.map(c => ({
        id: c.id,
        label: c.label
    }))

    return (
        <ServicosClient
            initialServices={formattedServices}
            initialCategories={formattedCategories}
            tenantId={userTenant.id}
        />
    )
}
