// ─── Asaas Payment Gateway ──────────────────────────────────────────────────
// REST API helper for Asaas (Brazilian payment gateway)
// Docs: https://docs.asaas.com/reference

const ASAAS_API_KEY = process.env.ASAAS_API_KEY || "";
const ASAAS_ENV = process.env.ASAAS_ENVIRONMENT || "sandbox";

const ASAAS_BASE_URL =
    ASAAS_ENV === "production"
        ? "https://www.asaas.com/api/v3"
        : "https://api-sandbox.asaas.com/v3";

if (!ASAAS_API_KEY && process.env.NODE_ENV === "production") {
    console.warn("⚠️ WARNING: ASAAS_API_KEY is not set. Payments will not work in production.");
}

// ─── API Helper ─────────────────────────────────────────────────────────────

export async function asaasApi<T = any>(
    path: string,
    options: {
        method?: "GET" | "POST" | "PUT" | "DELETE";
        body?: Record<string, any>;
    } = {}
): Promise<T> {
    const { method = "GET", body } = options;

    const res = await fetch(`${ASAAS_BASE_URL}${path}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            access_token: ASAAS_API_KEY,
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
    });

    const data = await res.json();

    if (!res.ok) {
        const errorMsg = data?.errors?.[0]?.description || data?.message || JSON.stringify(data);
        throw new Error(`Asaas API error (${res.status}): ${errorMsg}`);
    }

    return data as T;
}

// ─── Types ──────────────────────────────────────────────────────────────────

export interface AsaasCustomer {
    id: string;
    name: string;
    email: string;
    cpfCnpj: string;
    mobilePhone?: string;
}

export interface AsaasSubscription {
    id: string;
    customer: string;
    billingType: string;
    value: number;
    nextDueDate: string;
    cycle: string;
    status: string;
    description?: string;
    externalReference?: string;
}

export interface AsaasPayment {
    id: string;
    customer: string;
    subscription?: string;
    billingType: string;
    value: number;
    status: string;
    dueDate: string;
    invoiceUrl?: string;
    bankSlipUrl?: string;
    invoiceNumber?: string;
    externalReference?: string;
}

// ─── Customer Operations ────────────────────────────────────────────────────

export async function createAsaasCustomer(data: {
    name: string;
    email: string;
    cpfCnpj?: string;
    mobilePhone?: string;
    externalReference?: string;
}): Promise<AsaasCustomer> {
    return asaasApi<AsaasCustomer>("/customers", {
        method: "POST",
        body: {
            name: data.name,
            email: data.email,
            cpfCnpj: data.cpfCnpj || "00000000000", // Placeholder — user should provide real CPF
            ...(data.mobilePhone ? { mobilePhone: data.mobilePhone } : {}),
            ...(data.externalReference ? { externalReference: data.externalReference } : {}),
        },
    });
}

export async function findAsaasCustomerByEmail(email: string): Promise<AsaasCustomer | null> {
    const result = await asaasApi<{ data: AsaasCustomer[]; totalCount: number }>(
        `/customers?email=${encodeURIComponent(email)}`
    );
    return result.data.length > 0 ? result.data[0] : null;
}

// ─── Subscription Operations ────────────────────────────────────────────────

export async function createAsaasSubscription(data: {
    customer: string;
    value: number;
    nextDueDate: string; // YYYY-MM-DD
    cycle?: string;
    billingType?: string;
    description?: string;
    externalReference?: string;
}): Promise<AsaasSubscription> {
    return asaasApi<AsaasSubscription>("/subscriptions", {
        method: "POST",
        body: {
            customer: data.customer,
            billingType: data.billingType || "UNDEFINED",
            value: data.value,
            nextDueDate: data.nextDueDate,
            cycle: data.cycle || "MONTHLY",
            description: data.description || "Assinatura Agenda Online",
            ...(data.externalReference ? { externalReference: data.externalReference } : {}),
        },
    });
}

export async function getAsaasSubscription(subscriptionId: string): Promise<AsaasSubscription> {
    return asaasApi<AsaasSubscription>(`/subscriptions/${subscriptionId}`);
}

export async function cancelAsaasSubscription(subscriptionId: string): Promise<void> {
    await asaasApi(`/subscriptions/${subscriptionId}`, { method: "DELETE" });
}

export async function inactivateAsaasSubscription(subscriptionId: string): Promise<AsaasSubscription> {
    return asaasApi<AsaasSubscription>(`/subscriptions/${subscriptionId}`, {
        method: "PUT",
        body: { status: "INACTIVE" },
    });
}

export async function reactivateAsaasSubscription(subscriptionId: string): Promise<AsaasSubscription> {
    return asaasApi<AsaasSubscription>(`/subscriptions/${subscriptionId}`, {
        method: "PUT",
        body: { status: "ACTIVE" },
    });
}

// ─── Payment Operations ─────────────────────────────────────────────────────

export async function getSubscriptionPayments(subscriptionId: string): Promise<AsaasPayment[]> {
    const result = await asaasApi<{ data: AsaasPayment[] }>(
        `/subscriptions/${subscriptionId}/payments`
    );
    return result.data;
}

export async function getPayment(paymentId: string): Promise<AsaasPayment> {
    return asaasApi<AsaasPayment>(`/payments/${paymentId}`);
}

// ─── Plan Configuration ─────────────────────────────────────────────────────

export const PLANS = {
    essencial: {
        name: "Essencial",
        description: "Para profissionais autônomas",
        amount: 4900,  // centavos para display
        value: 49.00,  // reais para Asaas API
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
        amount: 7900,
        value: 79.00,
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
        amount: 11900,
        value: 119.00,
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
    fundador: {
        name: "Plano Fundador",
        description: "Oferta exclusiva de lançamento",
        amount: 2900,
        value: 29.00,
        features: [
            "Tudo do plano Profissional +",
            "Preço vitalício de lançamento",
            "Selo de Parceiro Fundador",
            "Suporte direto pelo WhatsApp",
        ],
    },
} as const;

export type PlanKey = keyof typeof PLANS;

export function isValidPlan(plan: string): plan is PlanKey {
    return plan in PLANS;
}

export function getPlanFromValue(value: number): PlanKey {
    if (value === 49.00 || value === 4900) return "essencial";
    if (value === 79.00 || value === 7900) return "profissional";
    if (value === 29.00 || value === 2900) return "fundador";
    return "premium";
}
