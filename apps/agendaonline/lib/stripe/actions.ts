"use server"

import { stripe, getPriceId, getPlanFromPriceId, PlanKey } from "@/lib/stripe";
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

async function getOrCreateStripeCustomer(userId: string, email: string, name: string, tenantId: string): Promise<string> {
    const existingSub = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.userId, userId),
    });

    if (existingSub?.stripeCustomerId) {
        return existingSub.stripeCustomerId;
    }

    const customers = await stripe.customers.list({ email, limit: 1 });
    if (customers.data.length > 0) {
        return customers.data[0].id;
    }

    const customer = await stripe.customers.create({
        email,
        name,
        metadata: { userId, tenantId },
    });
    return customer.id;
}

export async function cancelSubscription() {
    const session = await getSession();
    if (!session?.user) throw new Error("Não autorizado");

    const sub = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.userId, session.user.id),
    });
    if (!sub) throw new Error("Nenhuma assinatura encontrada");

    await stripe.subscriptions.update(sub.stripeSubscriptionId, {
        cancel_at_period_end: true,
    });

    await db.update(subscriptions)
        .set({ cancelAtPeriodEnd: true, updatedAt: new Date() })
        .where(eq(subscriptions.id, sub.id));

    return { success: true };
}

export async function resumeSubscription() {
    const session = await getSession();
    if (!session?.user) throw new Error("Não autorizado");

    const sub = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.userId, session.user.id),
    });
    if (!sub) throw new Error("Nenhuma assinatura encontrada");

    await stripe.subscriptions.update(sub.stripeSubscriptionId, {
        cancel_at_period_end: false,
    });

    await db.update(subscriptions)
        .set({ cancelAtPeriodEnd: false, updatedAt: new Date() })
        .where(eq(subscriptions.id, sub.id));

    return { success: true };
}

export async function createPortalSession() {
    const session = await getSession();
    if (!session?.user) throw new Error("Não autorizado");

    const sub = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.userId, session.user.id),
    });
    if (!sub) throw new Error("Nenhuma assinatura encontrada");

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3002";

    const portalSession = await stripe.billingPortal.sessions.create({
        customer: sub.stripeCustomerId,
        return_url: `${baseUrl}/painel/assinatura`,
    });

    return { url: portalSession.url };
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
