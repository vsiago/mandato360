import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe, getPlanFromPriceId } from "@/lib/stripe";
import { db } from "@/db";
import { subscriptions, tenants } from "@/db/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const sig = headersList.get("stripe-signature");

    let event: Stripe.Event;

    try {
        if (!sig || !endpointSecret) {
            return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
        }
        event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err: any) {
        console.error(`❌ Webhook signature verification failed: ${err.message}`);
        return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
    }

    console.log(`📩 Stripe webhook: ${event.type}`);

    switch (event.type) {
        // ─── Checkout completed → metadata is here ──────────────────
        case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;

            if (session.mode === "subscription" && session.subscription) {
                const subscriptionId = typeof session.subscription === "string"
                    ? session.subscription
                    : session.subscription.id;

                // Retrieve the full subscription to sync data
                const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
                await upsertSubscription(stripeSubscription);
            }
            break;
        }

        // ─── Subscription lifecycle ─────────────────────────────────
        case "customer.subscription.created":
        case "customer.subscription.updated": {
            const subscription = event.data.object as Stripe.Subscription;
            await upsertSubscription(subscription);
            break;
        }

        case "customer.subscription.deleted": {
            const subscription = event.data.object as Stripe.Subscription;
            await db.update(subscriptions)
                .set({
                    status: "canceled",
                    canceledAt: new Date(),
                    updatedAt: new Date(),
                })
                .where(eq(subscriptions.stripeSubscriptionId, subscription.id));

            console.log(`🚫 Subscription canceled: ${subscription.id}`);
            break;
        }

        // ─── Payment events ─────────────────────────────────────────
        case "invoice.payment_succeeded": {
            const invoice = event.data.object as any;
            const invoiceSub = invoice.subscription;
            if (invoiceSub) {
                const subId = typeof invoiceSub === "string" ? invoiceSub : invoiceSub.id;

                await db.update(subscriptions)
                    .set({ status: "active", updatedAt: new Date() })
                    .where(eq(subscriptions.stripeSubscriptionId, subId));

                console.log(`✅ Payment succeeded for subscription: ${subId}`);
            }
            break;
        }

        case "invoice.payment_failed": {
            const failedInvoice = event.data.object as any;
            const failedSub = failedInvoice.subscription;
            if (failedSub) {
                const subId = typeof failedSub === "string" ? failedSub : failedSub.id;

                await db.update(subscriptions)
                    .set({ status: "past_due", updatedAt: new Date() })
                    .where(eq(subscriptions.stripeSubscriptionId, subId));

                console.log(`⚠️ Payment failed for subscription: ${subId}`);
            }
            break;
        }

        default:
            console.log(`ℹ️ Unhandled event: ${event.type}`);
    }

    return NextResponse.json({ received: true });
}

// ─── Helpers ────────────────────────────────────────────────────────────────

async function upsertSubscription(subscription: Stripe.Subscription) {
    const customerId = typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer.id;

    let userId = subscription.metadata?.userId;
    let tenantId = subscription.metadata?.tenantId;

    // Fallback: if metadata is missing, look up by customer metadata
    if (!userId || !tenantId) {
        try {
            const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
            userId = userId || customer.metadata?.userId;
            tenantId = tenantId || customer.metadata?.tenantId;
        } catch {
            console.error("Could not retrieve customer metadata");
        }
    }

    // Last resort: look up tenant by customer email
    if (!userId || !tenantId) {
        try {
            const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
            if (customer.email) {
                const tenant = await db.query.tenants.findFirst({
                    where: eq(tenants.slug, customer.email),
                });
                // Skip if we still can't find the user
            }
        } catch {
            // Skip gracefully
        }
    }

    if (!userId || !tenantId) {
        console.error(`❌ Cannot upsert subscription ${subscription.id}: missing userId or tenantId`);
        return;
    }

    const subData = {
        userId,
        tenantId,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id,
        stripePriceId: subscription.items.data[0]?.price.id || "",
        plan: getPlanFromPriceId(subscription.items.data[0]?.price.id || ""),
        status: subscription.status as any,
        trialStart: subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
        trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
        currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
        cancelAtPeriodEnd: (subscription as any).cancel_at_period_end || false,
        canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
        updatedAt: new Date(),
    };

    await db.insert(subscriptions)
        .values(subData)
        .onConflictDoUpdate({
            target: [subscriptions.stripeSubscriptionId],
            set: subData,
        });

    console.log(`✅ Subscription upserted: ${subscription.id} (${subData.plan}/${subData.status})`);
}
