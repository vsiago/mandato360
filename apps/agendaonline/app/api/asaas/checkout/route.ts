import { NextResponse } from "next/server";
import {
    createAsaasSubscription,
    getSubscriptionPayments,
    isValidPlan,
    PLANS,
    type PlanKey,
} from "@/lib/asaas";
import { getOrCreateAsaasCustomer } from "@/lib/asaas/actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { tenants, subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
    try {
        const { plan } = await req.json();

        if (!plan || !isValidPlan(plan)) {
            return NextResponse.json({ error: "Plano inválido" }, { status: 400 });
        }

        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const userId = session.user.id;
        const email = session.user.email;
        const name = session.user.name;

        // Tenant may not exist yet (new users: register → pay → onboarding)
        const userTenant = await db.query.tenants.findFirst({
            where: eq(tenants.ownerId, userId),
        });

        // Check for existing active subscription
        const existingSub = await db.query.subscriptions.findFirst({
            where: eq(subscriptions.userId, userId),
        });

        if (existingSub && ["active", "trialing"].includes(existingSub.status)) {
            return NextResponse.json({ error: "Você já possui uma assinatura ativa" }, { status: 400 });
        }

        // Get or create Asaas customer
        const tenantId = userTenant?.id || "pending";
        const customerId = await getOrCreateAsaasCustomer(userId, email, name, tenantId);

        const planData = PLANS[plan as PlanKey];

        // Calculate trial: nextDueDate = 7 days from now
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + 7);
        const nextDueDate = trialEndDate.toISOString().split("T")[0]; // YYYY-MM-DD

        // Create subscription in Asaas
        const asaasSub = await createAsaasSubscription({
            customer: customerId,
            value: planData.value,
            nextDueDate,
            cycle: "MONTHLY",
            billingType: "UNDEFINED",
            description: `Agenda Online — Plano ${planData.name}`,
            externalReference: JSON.stringify({ userId, tenantId, planName: plan }),
        });

        // Get the first payment to retrieve the invoice URL
        // Small delay to allow Asaas to generate the payment
        await new Promise((r) => setTimeout(r, 1500));

        let invoiceUrl = "";
        try {
            const payments = await getSubscriptionPayments(asaasSub.id);
            if (payments.length > 0 && payments[0].invoiceUrl) {
                invoiceUrl = payments[0].invoiceUrl;
            }
        } catch {
            console.warn("Could not retrieve invoice URL for new subscription");
        }

        // Calculate period dates
        const now = new Date();
        const periodEnd = new Date(nextDueDate);

        // Upsert subscription in our DB
        const subData = {
            userId,
            tenantId,
            asaasCustomerId: customerId,
            asaasSubscriptionId: asaasSub.id,
            plan: plan as PlanKey,
            status: "trialing" as const,
            trialStart: now,
            trialEnd: periodEnd,
            currentPeriodStart: now,
            currentPeriodEnd: periodEnd,
            cancelAtPeriodEnd: false,
            updatedAt: now,
        };

        await db.insert(subscriptions)
            .values(subData)
            .onConflictDoUpdate({
                target: [subscriptions.asaasSubscriptionId],
                set: subData,
            });

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3002";

        return NextResponse.json({
            subscriptionId: asaasSub.id,
            invoiceUrl,
            successUrl: `${baseUrl}/checkout/sucesso?subscription_id=${asaasSub.id}`,
        });
    } catch (error: any) {
        console.error("Asaas checkout error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
