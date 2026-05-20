"use server"

import {
    createAsaasCustomer,
    findAsaasCustomerByEmail,
    inactivateAsaasSubscription,
    reactivateAsaasSubscription,
    cancelAsaasSubscription,
    type PlanKey,
} from "@/lib/asaas";
import { db } from "@/db";
import { subscriptions, tenants } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

async function getSession() {
    return await auth.api.getSession({
        headers: await headers(),
    });
}

export async function getOrCreateAsaasCustomer(
    userId: string,
    email: string,
    name: string,
    tenantId: string
): Promise<string> {
    // Check if we already have a customer ID saved
    const existingSub = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.userId, userId),
    });

    if (existingSub?.asaasCustomerId) {
        return existingSub.asaasCustomerId;
    }

    // Search by email in Asaas
    const existing = await findAsaasCustomerByEmail(email);
    if (existing) {
        return existing.id;
    }

    // Create new customer in Asaas
    const customer = await createAsaasCustomer({
        name,
        email,
        externalReference: userId,
    });
    return customer.id;
}

export async function cancelSubscriptionAction() {
    const session = await getSession();
    if (!session?.user) throw new Error("Não autorizado");

    const sub = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.userId, session.user.id),
    });
    if (!sub) throw new Error("Nenhuma assinatura encontrada");

    // Inactivate in Asaas (keeps subscription, stops billing)
    await inactivateAsaasSubscription(sub.asaasSubscriptionId);

    await db.update(subscriptions)
        .set({ cancelAtPeriodEnd: true, updatedAt: new Date() })
        .where(eq(subscriptions.id, sub.id));

    return { success: true };
}

export async function resumeSubscriptionAction() {
    const session = await getSession();
    if (!session?.user) throw new Error("Não autorizado");

    const sub = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.userId, session.user.id),
    });
    if (!sub) throw new Error("Nenhuma assinatura encontrada");

    // Reactivate in Asaas
    await reactivateAsaasSubscription(sub.asaasSubscriptionId);

    await db.update(subscriptions)
        .set({ cancelAtPeriodEnd: false, updatedAt: new Date() })
        .where(eq(subscriptions.id, sub.id));

    return { success: true };
}

export async function getSubscriptionStatus() {
    const session = await getSession();
    if (!session?.user) return null;

    const sub = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.userId, session.user.id),
    });

    if (!sub) return null;

    return {
        plan: sub.plan,
        status: sub.status,
        trialEnd: sub.trialEnd,
        currentPeriodEnd: sub.currentPeriodEnd,
        cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
    };
}
