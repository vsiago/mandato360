import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const sub = await db.query.subscriptions.findFirst({
            where: eq(subscriptions.userId, session.user.id),
        });

        if (!sub) {
            return NextResponse.json({ error: "Nenhuma assinatura encontrada" }, { status: 404 });
        }

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3002";

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: sub.stripeCustomerId,
            return_url: `${baseUrl}/painel/assinatura`,
        });

        return NextResponse.json({ url: portalSession.url });
    } catch (error: any) {
        console.error("Portal session error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
