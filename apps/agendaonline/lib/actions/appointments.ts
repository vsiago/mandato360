"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { appointments } from "@/db/schema"
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

export async function createPublicAppointmentAction(data: {
    tenantId: string
    serviceId?: string
    customerName: string
    customerPhone: string
    date: string // YYYY-MM-DD
    time: string // HH:MM
    notes?: string
    status?: string // Added for admin support
}) {
    try {
        // Public action, no session check required for booking
        if (!data.tenantId || !data.customerName || !data.date || !data.time) {
            return { success: false, error: "Campos obrigatórios ausentes." }
        }

        const newAppointment = await db.insert(appointments).values({
            tenantId: data.tenantId,
            serviceId: data.serviceId || null,
            customerName: data.customerName,
            customerPhone: data.customerPhone,
            date: data.date,
            time: data.time,
            status: data.status || "pending",
            notes: data.notes || ""
        }).returning()

        revalidatePath("/agenda")
        return { success: true, appointment: newAppointment[0] }
    } catch (error) {
        console.error("Error creating public appointment:", error)
        return { success: false, error: "Erro ao realizar agendamento." }
    }
}

export const createAppointmentAction = createPublicAppointmentAction

export async function getAppointmentsByTenantAction(tenantId: string) {
    try {
        const session = await getAuthSession()
        if (!session?.user) return { success: false, error: "Não autorizado." }

        const list = await db.query.appointments.findMany({
            where: eq(appointments.tenantId, tenantId),
            orderBy: appointments.time
        })

        return { success: true, appointments: list }
    } catch (error) {
        console.error("Error fetching appointments:", error)
        return { success: false, error: "Erro ao buscar agenda." }
    }
}

export async function deleteAppointmentAction(appointmentId: string, tenantId: string) {
    try {
        const session = await getAuthSession()
        if (!session?.user) return { success: false, error: "Não autorizado." }

        await db.delete(appointments)
            .where(and(eq(appointments.id, appointmentId), eq(appointments.tenantId, tenantId)))

        revalidatePath("/agenda")
        return { success: true }
    } catch (error) {
        console.error("Error deleting appointment:", error)
        return { success: false, error: "Erro ao remover agendamento." }
    }
}

export async function updateAppointmentAction(appointmentId: string, tenantId: string, data: {
    customerName?: string
    customerPhone?: string
    serviceId?: string
    notes?: string
    status?: string
}) {
    try {
        const session = await getAuthSession()
        if (!session?.user) return { success: false, error: "Não autorizado." }

        const updated = await db.update(appointments)
            .set({
                ...data,
                updatedAt: new Date()
            })
            .where(and(eq(appointments.id, appointmentId), eq(appointments.tenantId, tenantId)))
            .returning()

        revalidatePath("/agenda")
        return { success: true, appointment: updated[0] }
    } catch (error) {
        console.error("Error updating appointment:", error)
        return { success: false, error: "Erro ao atualizar agendamento." }
    }
}

export async function updateAppointmentStatusAction(appointmentId: string, tenantId: string, status: "pending" | "confirmed" | "cancelled" | "blocked") {
    try {
        const session = await getAuthSession()
        if (!session?.user) return { success: false, error: "Não autorizado." }

        await db.update(appointments)
            .set({ status })
            .where(and(eq(appointments.id, appointmentId), eq(appointments.tenantId, tenantId)))

        revalidatePath("/agenda")
        return { success: true }
    } catch (error) {
        console.error("Error updating appointment status:", error)
        return { success: false, error: "Erro ao atualizar status." }
    }
}
