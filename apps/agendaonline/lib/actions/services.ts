"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { services } from "@/db/schema"
import { auth } from "@/lib/auth"
import { eq, and } from "drizzle-orm"
import { headers } from "next/headers"

/**
 * Ensures the user is authenticated and returns the session.
 */
async function getAuthSession() {
    return await auth.api.getSession({
        headers: await headers()
    })
}

export async function createServiceAction(tenantId: string, data: {
    name: string
    categoryId: string
    description?: string
    price?: number
    duration?: number
    isActive?: boolean
    image?: string
}) {
    try {
        const session = await getAuthSession()
        if (!session?.user) return { success: false, error: "Não autorizado." }

        // We assume categoryId corresponds to the label for now if categories aren't strictly relational yet
        // In a full implementation, we'd verify tenant ownership here.

        const newService = await db.insert(services).values({
            tenantId,
            categoryId: data.categoryId, // For MVP, we might just store the string label here or link to categories table
            name: data.name,
            description: data.description,
            price: data.price ? String(data.price) : null,
            duration: data.duration,
            isActive: data.isActive ?? true,
            image: data.image,
            sortOrder: 0
        }).returning()

        return { success: true, service: newService[0] }
    } catch (error) {
        console.error("Error creating service:", error)
        return { success: false, error: "Erro ao criar serviço." }
    }
}

export async function updateServiceAction(serviceId: string, tenantId: string, data: Partial<{
    name: string
    categoryId: string
    description: string
    price: number
    duration: number
    isActive: boolean
    image: string
}>) {
    try {
        const session = await getAuthSession()
        if (!session?.user) return { success: false, error: "Não autorizado." }

        const updateData: any = { ...data }
        if (data.price !== undefined) updateData.price = String(data.price)

        const updated = await db.update(services)
            .set(updateData)
            .where(and(eq(services.id, serviceId), eq(services.tenantId, tenantId)))
            .returning()

        return { success: true, service: updated[0] }
    } catch (error) {
        console.error("Error updating service:", error)
        return { success: false, error: "Erro ao atualizar serviço." }
    }
}

export async function deleteServiceAction(serviceId: string, tenantId: string) {
    try {
        const session = await getAuthSession()
        if (!session?.user) return { success: false, error: "Não autorizado." }

        await db.delete(services)
            .where(and(eq(services.id, serviceId), eq(services.tenantId, tenantId)))

        return { success: true }
    } catch (error) {
        console.error("Error deleting service:", error)
        return { success: false, error: "Erro ao deletar serviço." }
    }
}

export async function toggleServiceStatusAction(serviceId: string, tenantId: string, isActive: boolean) {
    try {
        const session = await getAuthSession()
        if (!session?.user) return { success: false, error: "Não autorizado." }

        await db.update(services)
            .set({ isActive })
            .where(and(eq(services.id, serviceId), eq(services.tenantId, tenantId)))

        return { success: true }
    } catch (error) {
        console.error("Error toggling service status:", error)
        return { success: false, error: "Erro ao alterar status do serviço." }
    }
}

export async function getServicesAction(tenantId: string) {
    try {
        const data = await db.select()
            .from(services)
            .where(and(eq(services.tenantId, tenantId), eq(services.isActive, true)))
            .orderBy(services.sortOrder)

        return { success: true, services: data }
    } catch (error) {
        console.error("Error fetching services:", error)
        return { success: false, error: "Erro ao buscar serviços." }
    }
}
