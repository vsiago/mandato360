import { NextResponse } from "next/server";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getPlanFromValue } from "@/lib/asaas";

// Asaas webhook token for validation
const WEBHOOK_TOKEN = process.env.ASAAS_WEBHOOK_TOKEN;

export async function POST(req: Request) {
    try {
        // Validate webhook token
        const authToken = req.headers.get("asaas-access-token");
        if (WEBHOOK_TOKEN && authToken !== WEBHOOK_TOKEN) {
            console.error("❌ Webhook token mismatch");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const event = body.event as string;
        const payment = body.payment as any;

        console.log(`📩 Asaas webhook: ${event}`);

        if (!payment) {
            console.log("ℹ️ No payment data in webhook");
            return NextResponse.json({ received: true });
        }

        const subscriptionId = payment.subscription;

        // Only process subscription-related payments
        if (!subscriptionId) {
            console.log(`ℹ️ Payment ${payment.id} is not subscription-related, skipping`);
            return NextResponse.json({ received: true });
        }

        switch (event) {
            // ─── Payment received (confirmed) ────────────────────────
            case "PAYMENT_CONFIRMED":
            case "PAYMENT_RECEIVED": {
                await db.update(subscriptions)
                    .set({
                        status: "active",
                        currentPeriodEnd: payment.dueDate ? new Date(payment.dueDate) : undefined,
                        updatedAt: new Date(),
                    })
                    .where(eq(subscriptions.asaasSubscriptionId, subscriptionId));

                console.log(`✅ Payment received for subscription: ${subscriptionId}`);
                break;
            }

            // ─── New payment created (billing cycle) ─────────────────
            case "PAYMENT_CREATED": {
                // Update the current period end to the new due date
                if (payment.dueDate) {
                    await db.update(subscriptions)
                        .set({
                            currentPeriodEnd: new Date(payment.dueDate),
                            updatedAt: new Date(),
                        })
                        .where(eq(subscriptions.asaasSubscriptionId, subscriptionId));
                }
                console.log(`📋 New payment created for subscription: ${subscriptionId}`);
                break;
            }

            // ─── Payment overdue ─────────────────────────────────────
            case "PAYMENT_OVERDUE": {
                await db.update(subscriptions)
                    .set({
                        status: "past_due",
                        updatedAt: new Date(),
                    })
                    .where(eq(subscriptions.asaasSubscriptionId, subscriptionId));

                console.log(`⚠️ Payment overdue for subscription: ${subscriptionId}`);
                break;
            }

            // ─── Payment deleted / refunded ──────────────────────────
            case "PAYMENT_DELETED":
            case "PAYMENT_REFUNDED": {
                console.log(`🔄 Payment ${event} for subscription: ${subscriptionId}`);
                break;
            }

            // ─── Payment updated ─────────────────────────────────────
            case "PAYMENT_UPDATED": {
                console.log(`📝 Payment updated for subscription: ${subscriptionId}`);
                break;
            }

            default:
                console.log(`ℹ️ Unhandled event: ${event}`);
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error("Asaas webhook error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
