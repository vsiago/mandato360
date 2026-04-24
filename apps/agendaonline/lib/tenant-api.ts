import type { TenantData } from "./tenant-types"
import { getTenantDefaults, mergeTenantWithDefaults } from "./tenant-defaults"
import { getMyTenantAction, saveTenantAction, createTenantAction } from "@/lib/actions/tenant"

/* ─── Slug Utilities ─── */

/**
 * Normalize a slug: lowercase, strip diacritics (ó→o, é→e), replace spaces with hyphens,
 * remove non-alphanumeric chars except hyphens.
 */
export function normalizeSlug(input: string): string {
    return input
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
}

/* ─── API Functions ─── */

/**
 * Get the current user's tenant data.
 * Uses the server action for authenticated dashboard/editor access.
 */
export async function getMyTenant(): Promise<TenantData> {
    try {
        const result = await getMyTenantAction()
        if (result.success && result.data) return result.data
        return getTenantDefaults()
    } catch (e) {
        console.error("Error in getMyTenant:", e)
        return getTenantDefaults()
    }
}

/**
 * Save tenant data (partial update).
 * Uses the server action for persistence.
 */
export async function saveTenant(data: Partial<TenantData>): Promise<void> {
    const result = await saveTenantAction(data)
    if (!result.success) {
        console.error("Failed to save tenant:", result.error)
        throw new Error(result.error)
    }
}

/**
 * Create a new tenant from onboarding data.
 * Uses the server action for persistence.
 */
export async function createTenant(data: Partial<TenantData>): Promise<void> {
    const result = await createTenantAction(data)
    if (!result.success) {
        console.error("Failed to create tenant:", result.error)
        throw new Error(result.error)
    }
}

/**
 * Get the current tenant slug from localStorage (client-side only).
 */
export function getSlug(): string {
    if (typeof window === "undefined") return "meu-negocio"
    return localStorage.getItem("agenda_online_current_slug") || "meu-negocio"
}
