import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { tenants, subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { CheckCircle2, PartyPopper, ArrowRight } from "lucide-react";

export default async function CheckoutSuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ subscription_id?: string }>;
}) {
    const { subscription_id } = await searchParams;

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return redirect("/login");
    }

    // Check subscription status from our DB
    const sub = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.userId, session.user.id),
    });

    // Check if user already has a tenant (onboarding completed)
    const userTenant = await db.query.tenants.findFirst({
        where: eq(tenants.ownerId, session.user.id),
    });
    const hasCompletedOnboarding = userTenant?.onboardingCompleted;
    const nextDestination = hasCompletedOnboarding ? "/painel" : "/onboarding";
    const nextLabel = hasCompletedOnboarding ? "Ir para o Painel" : "Criar meu site";

    const isSuccess = sub && ["trialing", "active"].includes(sub.status);
    const planName = sub?.plan || "";

    if (!isSuccess) {
        return (
            <div className="text-center max-w-md mx-auto py-12">
                <div className="h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                    style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(239,68,68,0.05) 100%)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <span className="text-3xl">😕</span>
                </div>
                <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50 mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
                    Algo deu errado
                </h1>
                <p className="text-sm text-stone-500 dark:text-stone-400 mb-8">
                    Não conseguimos confirmar sua assinatura. Por favor, tente novamente ou entre em contato conosco.
                </p>
                <Link href="/#pricing" className="btn-gold-solid rounded-full px-8 py-3 text-sm inline-block">
                    Tentar Novamente
                </Link>
            </div>
        );
    }

    return (
        <div className="text-center max-w-lg mx-auto py-12">
            {/* Success Icon */}
            <div className="relative mx-auto mb-8 w-fit">
                <div className="h-20 w-20 rounded-3xl flex items-center justify-center"
                    style={{
                        background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(16,185,129,0.05) 100%)',
                        border: '1px solid rgba(16,185,129,0.25)',
                    }}>
                    <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                </div>
                <div className="absolute -top-2 -right-2">
                    <PartyPopper className="h-6 w-6 text-amber-500 animate-bounce" />
                </div>
            </div>

            <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-50 mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
                Bem-vindo ao Agenda Online! 🎉
            </h1>

            <p className="text-stone-500 dark:text-stone-400 mb-2 text-lg">
                {planName ? `Plano ${planName.charAt(0).toUpperCase() + planName.slice(1)}` : 'Assinatura'} ativado com sucesso.
            </p>

            <p className="text-sm text-stone-400 dark:text-stone-500 mb-10 max-w-sm mx-auto leading-relaxed">
                {hasCompletedOnboarding
                    ? "Seu teste grátis de 7 dias já começou. Aproveite todos os recursos!"
                    : "Agora vamos criar seu site profissional em menos de 2 minutos."
                }
            </p>

            {/* What's next */}
            <div className="bg-white/60 dark:bg-stone-900/60 backdrop-blur-sm border border-amber-200/20 dark:border-amber-500/10 rounded-2xl p-6 mb-8 text-left">
                <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-4">
                    Próximos passos
                </p>
                <div className="space-y-3">
                    {[
                        "Personalize sua página profissional",
                        "Adicione seus serviços e preços",
                        "Compartilhe seu link com clientes",
                    ].map((step, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="h-6 w-6 rounded-full bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-xs font-bold text-amber-600 dark:text-amber-400 shrink-0">
                                {i + 1}
                            </div>
                            <span className="text-sm text-stone-600 dark:text-stone-400">{step}</span>
                        </div>
                    ))}
                </div>
            </div>

            <Link
                href={nextDestination}
                className="btn-gold-solid inline-flex items-center gap-2 rounded-full px-10 py-4 text-base"
            >
                {nextLabel} <ArrowRight className="h-5 w-5" />
            </Link>
        </div>
    );
}
