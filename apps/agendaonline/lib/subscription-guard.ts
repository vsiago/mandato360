import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

type SubscriptionData = {
    id: string;
    plan: string;
    status: string;
    trialEnd: Date | null;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
};

export async function requireActiveSubscription(): Promise<SubscriptionData> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return redirect("/login");
    }

    const sub = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.userId, session.user.id),
    });

    if (!sub || !["active", "trialing"].includes(sub.status)) {
        return redirect("/#pricing");
    }

    return {
        id: sub.id,
        plan: sub.plan,
        status: sub.status,
        trialEnd: sub.trialEnd,
        currentPeriodEnd: sub.currentPeriodEnd,
        cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
    };
}

export async function getOptionalSubscription(): Promise<SubscriptionData | null> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) return null;

    const sub = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.userId, session.user.id),
    });

    if (!sub) return null;

    return {
        id: sub.id,
        plan: sub.plan,
        status: sub.status,
        trialEnd: sub.trialEnd,
        currentPeriodEnd: sub.currentPeriodEnd,
        cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
    };
}
