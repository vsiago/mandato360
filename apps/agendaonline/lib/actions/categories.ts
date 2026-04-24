"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { categories } from "@/db/schema"
import { auth } from "@/lib/auth"
import { eq, and } from "drizzle-orm"
import { headers } from "next/headers"

async function getAuthSession() {
    return await auth.api.getSession({
        headers: await headers()
    })
}

export async function createCategoryAction(tenantId: string, data: {
    label: string
    slug: string
    sortOrder?: number
}) {
    try {
        const session = await getAuthSession()
        if (!session?.user) return { success: false, error: "Não autorizado." }

        const newCategory = await db.insert(categories).values({
            tenantId,
            label: data.label,
            slug: data.slug,
            sortOrder: data.sortOrder ?? 0
        }).returning()

        return { success: true, category: newCategory[0] }
    } catch (error) {
        console.error("Error creating category:", error)
        return { success: false, error: "Erro ao criar categoria." }
    }
}

export async function deleteCategoryAction(categoryId: string, tenantId: string) {
    try {
        const session = await getAuthSession()
        if (!session?.user) return { success: false, error: "Não autorizado." }

        await db.delete(categories)
            .where(and(eq(categories.id, categoryId), eq(categories.tenantId, tenantId)))

        return { success: true }
    } catch (error) {
        console.error("Error deleting category:", error)
        return { success: false, error: "Erro ao deletar categoria." }
    }
}
