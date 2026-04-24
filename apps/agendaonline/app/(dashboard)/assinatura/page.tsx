import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Calendar, CreditCard, Zap, Clock } from "lucide-react";
import { SubscriptionActions } from "@/components/subscription-actions";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default async function AssinaturaPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || !session.user) {
        return redirect("/login");
    }

    const sub = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.userId, session.user.id),
    });

    if (!sub) {
        return (
            <div className="max-w-4xl mx-auto py-12">
                <div className="relative rounded-xl border border-amber-200/20 dark:border-amber-500/10 overflow-hidden bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm">
                    <div className="text-center py-12 px-6">
                        <div className="h-10 w-10 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, rgba(232,168,58,0.2) 0%, rgba(232,168,58,0.05) 100%)', border: '1px solid rgba(232,168,58,0.2)' }}>
                            <Zap className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <h2 className="text-2xl font-semibold text-foreground mb-2">Nenhuma assinatura ativa</h2>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto mb-8">
                            Você ainda não assinou um plano. Comece seu teste grátis de 7 dias e profissionalize sua agenda.
                        </p>
                        <a href="/#pricing" className="btn-gold-solid font-semibold px-6 py-2.5 rounded-lg transition-all inline-block">
                            Ver Planos Disponíveis
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    const isTrialing = sub.status === "trialing";
    const planName = sub.plan.charAt(0).toUpperCase() + sub.plan.slice(1);

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">

            {/* ── Header ── */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-foreground tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>Sua Assinatura</h2>
                    <p className="text-sm text-muted-foreground mt-1">Gerencie seu plano e pagamentos</p>
                </div>
                <SubscriptionActions isCanceled={sub.cancelAtPeriodEnd} status={sub.status} />
            </div>

            <div className="grid md:grid-cols-3 gap-6">

                {/* Status Card */}
                <Card className="md:col-span-2 rounded-xl border-amber-200/20 dark:border-amber-500/10 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm shadow-none">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold">Plano {planName}</CardTitle>
                            <Badge variant={sub.status === "active" ? "default" : sub.status === "trialing" ? "secondary" : "destructive"}
                                className={sub.status === "active" ? "bg-emerald-500 hover:bg-emerald-600" : ""}>
                                {sub.status === "trialing" ? "Teste Grátis" : sub.status === "active" ? "Ativa" : sub.status}
                            </Badge>
                        </div>
                        <CardDescription className="text-sm">
                            {isTrialing
                                ? `Seu período de teste termina em ${format(sub.trialEnd!, "dd 'de' MMMM", { locale: ptBR })}`
                                : `Próxima cobrança em ${format(sub.currentPeriodEnd, "dd 'de' MMMM", { locale: ptBR })}`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {isTrialing && (
                            <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800/30 rounded-xl p-4 flex items-start gap-3">
                                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">Você está no teste grátis!</p>
                                    <p className="text-xs text-amber-700 dark:text-amber-300">Aproveite todos os recursos. Cobrança automática após 7 dias se não cancelar.</p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-3">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Recursos Inclusos:</p>
                            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                                {[
                                    "Agenda Online Ilimitada",
                                    "WhatsApp Business",
                                    "Página Profissional",
                                    "Relatórios de Vendas",
                                    "Suporte Prioritário",
                                    "Sem Taxas Extras",
                                ].map((feature, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Details Card */}
                <Card className="rounded-xl border-amber-200/20 dark:border-amber-500/10 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm shadow-none">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold">Detalhes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(232,168,58,0.15) 0%, rgba(232,168,58,0.05) 100%)', border: '1px solid rgba(232,168,58,0.15)' }}>
                                    <CreditCard className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Valor mensal</p>
                                    <p className="text-sm font-bold text-foreground">
                                        {sub.plan === "essencial" ? "R$49,00" : sub.plan === "profissional" ? "R$79,00" : "R$119,00"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(232,168,58,0.15) 0%, rgba(232,168,58,0.05) 100%)', border: '1px solid rgba(232,168,58,0.15)' }}>
                                    <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Membro desde</p>
                                    <p className="text-sm font-bold text-foreground">
                                        {format(sub.createdAt, "MMM yyyy", { locale: ptBR })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Precisando de nota fiscal ou históricos de cobrança? Acesse o portal de faturamento do Stripe.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

