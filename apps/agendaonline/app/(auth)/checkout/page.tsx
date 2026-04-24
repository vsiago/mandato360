import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PLANS, isValidPlan, type PlanKey } from "@/lib/stripe";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import CheckoutClient from "./checkout-client";

export default async function CheckoutPage({
    searchParams,
}: {
    searchParams: Promise<{ plan?: string }>;
}) {
    const { plan = "profissional" } = await searchParams;

    if (!isValidPlan(plan)) {
        return (
            <div className="text-center py-20 max-w-md mx-auto">
                <div className="h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
                    style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(239,68,68,0.05) 100%)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <span className="text-2xl">⚠️</span>
                </div>
                <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50 mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
                    Plano inválido
                </h1>
                <p className="text-sm text-stone-500 dark:text-stone-400 mb-8">
                    O plano selecionado não existe. Por favor, volte e escolha um plano válido.
                </p>
                <a href="/#pricing" className="btn-gold-solid rounded-full px-8 py-3 text-sm inline-block">
                    Ver Planos Disponíveis
                </a>
            </div>
        );
    }

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return redirect(`/registro?plan=${plan}`);
    }

    // Check for existing active subscription
    const existingSub = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.userId, session.user.id),
    });

    if (existingSub && ["active", "trialing"].includes(existingSub.status)) {
        return redirect("/painel/assinatura");
    }

    const planData = PLANS[plan as PlanKey];

    return <CheckoutClient plan={plan} planData={planData} />;
}
