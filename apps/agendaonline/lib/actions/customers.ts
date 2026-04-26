"use server"

import { db } from "@/db"
import { tenants, appointments } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { getMyTenantAction, saveTenantAction } from "./tenant"

export async function createCustomerAction(tenantId: string, data: {
    name: string;
    email?: string;
    phone?: string;
    birthday?: string;
    notes?: string;
}) {
    try {
        const tenantRes = await getMyTenantAction()
        if (!tenantRes.success || !tenantRes.data) return { success: false, error: "Tenant não encontrado." }

        const tenant = tenantRes.data
        const currentConfig = tenant.config || {}
        const currentCustomers = currentConfig.customers || []

        const newCustomer = {
            id: crypto.randomUUID(),
            ...data,
            createdAt: new Date().toISOString()
        }

        const updatedConfig = {
            ...currentConfig,
            customers: [newCustomer, ...currentCustomers]
        }

        await saveTenantAction({
            ...tenant,
            config: updatedConfig
        })

        revalidatePath("/clientes")
        return { success: true, customer: newCustomer }
    } catch (error) {
        console.error("Error creating customer:", error)
        return { success: false, error: "Erro ao criar cliente." }
    }
}

export async function getCustomersAction(tenantId: string) {
    try {
        const tenantRes = await getMyTenantAction()
        if (!tenantRes.success || !tenantRes.data) return { success: false, error: "Tenant não encontrado." }
        
        const customers = tenantRes.data.config?.customers || []
        return { success: true, customers }
    } catch (error) {
        console.error("Error fetching customers:", error)
        return { success: false, error: "Erro ao buscar clientes." }
    }
}

export async function updateAppointmentCustomerAction(appointmentId: string, customerId: string) {
    // Since we don't have a customerId column anymore, we can store it in notes or ignore
    // For now, let's just mark it in notes to not lose the intent
    try {
        const apt = await db.query.appointments.findFirst({
            where: eq(appointments.id, appointmentId)
        })
        if (!apt) return { success: false, error: "Agendamento não encontrado." }

        const updatedNotes = (apt.notes || "") + `\n[CUSTOMER_ID: ${customerId}]`
        
        await db.update(appointments)
            .set({ notes: updatedNotes })
            .where(eq(appointments.id, appointmentId))
        
        revalidatePath("/agenda")
        return { success: true }
    } catch (error) {
        console.error("Error updating appointment customer:", error)
        return { success: false, error: "Erro ao vincular cliente." }
    }
}
