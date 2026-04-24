"use server"

import { db } from "@/db"
import { user, subscriptions } from "@/db/schema"
import { count, eq, and, sql } from "drizzle-orm"
import { requireRoot } from "@/lib/admin-guard"

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

    return await db.select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt
    }).from(user).orderBy(sql`${user.createdAt} DESC`)
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
