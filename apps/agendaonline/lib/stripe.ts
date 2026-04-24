import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY && process.env.NODE_ENV === "production") {
    console.warn("⚠️ WARNING: STRIPE_SECRET_KEY is not set. Payments will not work in production.");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
    apiVersion: "2025-02-24.acacia" as any,
    appInfo: {
        name: "Agenda Online",
        version: "0.1.0",
    },
});

// ─── Plan Configuration ─────────────────────────────────────────────────────

export const PLANS = {
    essencial: {
        name: "Essencial",
        description: "Para profissionais autônomas",
        productId: process.env.STRIPE_PRODUCT_ESSENCIAL || "prod_placeholder_essencial",
        amount: 4900,
        displayPrice: "R$49",
        features: [
            "Página profissional personalizada",
            "Catálogo de serviços e preços",
            "Link exclusivo para bio do Instagram",
            "Agendamento online para clientes",
            "Integração com WhatsApp",
            "Painel simples para gerenciar horários",
        ],
    },
    profissional: {
        name: "Profissional",
        description: "Para salões com até 3 profissionais",
        productId: process.env.STRIPE_PRODUCT_PROFISSIONAL || "prod_placeholder_profissional",
        amount: 7900,
        displayPrice: "R$79",
        popular: true,
        features: [
            "Tudo do plano Essencial +",
            "Agenda inteligente em tempo real",
            "Gestão de múltiplos profissionais",
            "Bloqueio automático de horários",
            "Lembretes automáticos para clientes",
            "Cadastro de clientes",
            "Relatórios básicos de agendamentos",
        ],
    },
    premium: {
        name: "Completo",
        description: "Presença digital completa para salões",
        productId: process.env.STRIPE_PRODUCT_COMPLETO || "prod_placeholder_completo",
        amount: 11900,
        displayPrice: "R$119",
        features: [
            "Tudo do plano Profissional +",
            "Site completo do salão",
            "Galeria de trabalhos (Antes & Depois)",
            "Personalização avançada do site",
            "Relatórios de performance",
            "Destaque do salão no sistema",
            "Suporte prioritário",
        ],
    },
} as const;

export type PlanKey = keyof typeof PLANS;

export function getPriceId(plan: PlanKey): string {
    const envKeys: Record<PlanKey, string> = {
        essencial: "STRIPE_PRICE_ESSENCIAL",
        profissional: "STRIPE_PRICE_PROFISSIONAL",
        premium: "STRIPE_PRICE_COMPLETO",
    };
    const priceId = process.env[envKeys[plan]];
    if (!priceId || priceId.startsWith("price_COLE")) {
        if (process.env.NODE_ENV === "production") {
            console.warn(`⚠️ WARNING: Price ID do plano "${plan}" não configurado no .env`);
            return "price_placeholder";
        }
        throw new Error(`Price ID do plano "${plan}" não configurado no .env`);
    }
    return priceId;
}

export function getPlanFromPriceId(priceId: string): PlanKey {
    if (priceId === process.env.STRIPE_PRICE_ESSENCIAL) return "essencial";
    if (priceId === process.env.STRIPE_PRICE_PROFISSIONAL) return "profissional";
    return "premium";
}

export function isValidPlan(plan: string): plan is PlanKey {
    return plan in PLANS;
}
