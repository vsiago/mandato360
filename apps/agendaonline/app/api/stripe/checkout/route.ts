import { NextResponse } from "next/server";
import { stripe, getPriceId, isValidPlan, type PlanKey } from "@/lib/stripe";
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

        // Find or create Stripe Customer
        let customerId: string;
        if (existingSub?.stripeCustomerId) {
            customerId = existingSub.stripeCustomerId;
        } else {
            const customers = await stripe.customers.list({ email, limit: 1 });
            if (customers.data.length > 0) {
                customerId = customers.data[0].id;
            } else {
                const customer = await stripe.customers.create({
                    email,
                    name,
                    metadata: {
                        userId,
                        ...(userTenant ? { tenantId: userTenant.id } : {}),
                    },
                });
                customerId = customer.id;
            }
        }

        const priceId = getPriceId(plan as PlanKey);
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3002";

        const checkoutSession = await stripe.checkout.sessions.create({
            mode: "subscription",
            ui_mode: "embedded",
            customer: customerId,
            line_items: [{ price: priceId, quantity: 1 }],
            subscription_data: {
                trial_period_days: 7,
                metadata: {
                    userId,
                    ...(userTenant ? { tenantId: userTenant.id } : {}),
                    planName: plan,
                },
            },
            payment_method_collection: "always",
            return_url: `${baseUrl}/checkout/sucesso?session_id={CHECKOUT_SESSION_ID}`,
        });

        return NextResponse.json({ clientSecret: checkoutSession.client_secret });
    } catch (error: any) {
        console.error("Stripe checkout error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// GET: Check session status (used by success page)
export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const sessionId = url.searchParams.get("session_id");

        if (!sessionId) {
            return NextResponse.json({ error: "session_id ausente" }, { status: 400 });
        }

        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

        return NextResponse.json({
            status: checkoutSession.status,
            paymentStatus: checkoutSession.payment_status,
        });
    } catch (error: any) {
        console.error("Session status error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
