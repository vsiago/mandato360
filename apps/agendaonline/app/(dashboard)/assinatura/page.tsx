import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Calendar, CreditCard, Zap, Clock, ShieldCheck, Star, Sparkles, ChevronRight, ArrowUpRight } from "lucide-react";
import { SubscriptionActions } from "@/components/subscription-actions";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";

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
            <div className="flex-1 flex flex-col space-y-4 lg:space-y-6 animate-in fade-in duration-500 pb-10 lg:max-w-4xl lg:mx-auto">
                {/* ── Header ── */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6 mb-1 lg:mb-2">
                    <div className="flex-1">
                        <h2 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight flex items-center gap-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                            Sua Assinatura
                        </h2>
                        <p className="text-xs lg:text-sm text-muted-foreground mt-0.5 lg:mt-1">
                            Você ainda não possui um plano ativo no momento.
                        </p>
                    </div>
                </div>

                <div className="bg-white dark:bg-stone-900/40 backdrop-blur-md border border-stone-200 dark:border-white/[0.03] rounded-[2rem] p-8 lg:p-16 flex flex-col items-center text-center space-y-8 shadow-2xl relative overflow-hidden group">
                    {/* Abstract background effect */}
                    <div className="absolute inset-0 bg-radial-at-c from-brand-gold/5 to-transparent pointer-events-none" />
                    
                    <div className="h-20 w-20 lg:h-24 lg:w-24 bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-white/5 rounded-[2.5rem] flex items-center justify-center shadow-2xl relative z-10 group-hover:scale-110 transition-transform">
                        <Zap className="h-10 w-10 lg:h-12 lg:w-12 text-stone-300 dark:text-stone-700" />
                    </div>
                    
                    <div className="max-w-md space-y-3 relative z-10">
                        <h3 className="text-xl lg:text-2xl font-bold text-stone-900 dark:text-white" style={{ fontFamily: 'var(--font-playfair)' }}>Comece sua jornada VIP</h3>
                        <p className="text-xs lg:text-sm text-stone-500 leading-relaxed font-medium">
                            Desbloqueie todos os recursos profissionais, desde agendamentos ilimitados até relatórios avançados de faturamento.
                        </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10 w-full sm:w-auto">
                        <Button className="w-full sm:w-auto bg-brand-gold text-white rounded-xl px-10 h-14 font-black uppercase tracking-widest text-xs shadow-xl shadow-brand-secondary/20 hover:scale-105 transition-all">
                            Ver Planos Premium
                        </Button>
                        <Button variant="ghost" className="w-full sm:w-auto h-14 px-8 rounded-xl font-bold text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-white/5 text-xs">
                            Falar com Consultor
                        </Button>
                    </div>

                    <div className="pt-8 grid grid-cols-3 gap-6 lg:gap-12 relative z-10 border-t border-stone-100 dark:border-white/[0.03] w-full max-w-lg">
                        <div className="text-center space-y-1">
                            <p className="text-xs lg:text-sm font-black text-stone-900 dark:text-white">7 Dias</p>
                            <p className="text-[9px] text-stone-600 uppercase tracking-widest">Teste Grátis</p>
                        </div>
                        <div className="text-center space-y-1">
                            <p className="text-xs lg:text-sm font-black text-stone-900 dark:text-white">Ilimitado</p>
                            <p className="text-[9px] text-stone-600 uppercase tracking-widest">Clientes</p>
                        </div>
                        <div className="text-center space-y-1">
                            <p className="text-xs lg:text-sm font-black text-stone-900 dark:text-white">24/7</p>
                            <p className="text-[9px] text-stone-600 uppercase tracking-widest">Suporte</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const isTrialing = sub.status === "trialing";
    const planName = sub.plan.charAt(0).toUpperCase() + sub.plan.slice(1);

    return (
        <div className="flex-1 flex flex-col space-y-4 lg:space-y-6 animate-in fade-in duration-500 pb-10 lg:max-w-5xl lg:mx-auto">

            {/* ── Header ── */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6 mb-1 lg:mb-2">
                <div className="flex-1">
                    <h2 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight flex items-center gap-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                        Assinatura & Plano
                    </h2>
                    <p className="text-xs lg:text-sm text-muted-foreground mt-0.5 lg:mt-1">
                        Gerencie seu plano atual, métodos de pagamento e faturamento.
                    </p>
                </div>
                <SubscriptionActions isCanceled={sub.cancelAtPeriodEnd} status={sub.status} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6 lg:gap-8">

                {/* ── Status Card (Main) ── */}
                <div className="bg-white dark:bg-stone-900/40 backdrop-blur-md border border-stone-200 dark:border-white/[0.03] rounded-[2rem] p-6 lg:p-10 space-y-8 lg:space-y-10 shadow-2xl relative overflow-hidden group">
                    {/* Decorative background glow */}
                    <div className="absolute top-0 right-0 h-full w-1/3 bg-linear-to-l from-brand-primary/5 to-transparent pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 lg:h-16 lg:w-16 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center shrink-0 shadow-lg">
                                <Star className="h-7 w-7 lg:h-8 lg:w-8 text-brand-primary" />
                            </div>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h3 className="text-xl lg:text-2xl font-black text-stone-900 dark:text-white tracking-tight">Plano {planName}</h3>
                                    <Badge className={cn(
                                        "h-6 px-3 rounded-full text-[10px] font-black uppercase tracking-widest border-none shadow-lg",
                                        sub.status === "active" ? "bg-emerald-500 text-white" : 
                                        sub.status === "trialing" ? "bg-brand-primary text-white" : "bg-red-500 text-white"
                                    )}>
                                        {sub.status === "trialing" ? "Trial Grátis" : sub.status === "active" ? "Ativo" : "Pendente"}
                                    </Badge>
                                </div>
                                <p className="text-xs lg:text-sm text-stone-500 mt-1 font-medium italic">
                                    {isTrialing
                                        ? `Seu período VIP termina em ${format(sub.trialEnd!, "dd 'de' MMMM", { locale: ptBR })}`
                                        : `Sua próxima renovação é em ${format(sub.currentPeriodEnd, "dd 'de' MMMM", { locale: ptBR })}`}
                                </p>
                            </div>
                        </div>
                        
                        <div className="h-10 px-4 rounded-xl bg-stone-50 dark:bg-white/[0.03] border border-stone-100 dark:border-white/5 flex items-center gap-2 text-[10px] font-black text-stone-500 dark:text-stone-400 uppercase tracking-widest shadow-sm">
                            <ShieldCheck className="h-4 w-4 text-emerald-500" /> Transação Segura
                        </div>
                    </div>

                    {isTrialing && (
                        <div className="bg-brand-primary/5 border border-brand-primary/10 rounded-2xl p-5 lg:p-6 flex items-start gap-4 animate-in zoom-in-95 duration-500 shadow-sm">
                            <div className="h-10 w-10 rounded-xl bg-brand-primary flex items-center justify-center shadow-lg shadow-brand-primary/20 shrink-0">
                                <Clock className="h-5 w-5 text-white" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-brand-primary">Você está no Período de Teste!</p>
                                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                                    Explore todos os recursos premium sem limitações. A cobrança automática ocorrerá apenas após o fim dos 7 dias.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-6 lg:space-y-8">
                        <p className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em] flex items-center gap-3">
                            Recursos Ativos na sua conta <span className="h-px flex-1 bg-stone-100 dark:bg-white/[0.03]" />
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                            {[
                                "Agenda Online Ilimitada",
                                "Notificações WhatsApp Business",
                                "Página Profissional Mobile Native",
                                "Relatórios Financeiros Avançados",
                                "Suporte Prioritário 24/7",
                                "Customização de Marca Total",
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 group/item">
                                    <div className="h-6 w-6 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 flex items-center justify-center shrink-0 group-hover/item:bg-emerald-500 group-hover/item:text-white transition-all shadow-sm">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 group-hover/item:text-white" />
                                    </div>
                                    <span className="text-xs lg:text-sm font-bold text-stone-600 dark:text-stone-400 group-hover/item:text-stone-900 dark:group-hover/item:text-white transition-colors">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Details Card (Sidebar) ── */}
                <div className="space-y-6 lg:space-y-8">
                    <div className="bg-white dark:bg-stone-900/40 backdrop-blur-md border border-stone-200 dark:border-white/[0.03] rounded-[2rem] p-6 lg:p-8 space-y-8 shadow-xl">
                        <h3 className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em]">Detalhes da Conta</h3>
                        
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 group">
                                <div className="h-12 w-12 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-white/5 flex items-center justify-center shadow-md group-hover:border-brand-primary/30 transition-all">
                                    <CreditCard className="h-6 w-6 text-stone-400 dark:text-stone-600 group-hover:text-brand-primary" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest">Investimento Mensal</p>
                                    <p className="text-lg font-black text-stone-900 dark:text-white">
                                        {sub.plan === "essencial" ? "R$ 49,00" : sub.plan === "profissional" ? "R$ 79,00" : "R$ 119,00"}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 group">
                                <div className="h-12 w-12 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-white/5 flex items-center justify-center shadow-md group-hover:border-brand-primary/30 transition-all">
                                    <Calendar className="h-6 w-6 text-stone-400 dark:text-stone-600 group-hover:text-brand-primary" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest">Membro Desde</p>
                                    <p className="text-base font-black text-stone-900 dark:text-white">
                                        {format(sub.createdAt, "MMMM 'de' yyyy", { locale: ptBR })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-stone-100 dark:border-white/[0.03]">
                            <button className="w-full flex items-center justify-between p-4 rounded-xl bg-stone-50 dark:bg-white/[0.02] border border-stone-100 dark:border-white/5 hover:bg-stone-100 dark:hover:bg-white/[0.05] transition-all group shadow-sm">
                                <div className="flex items-center gap-3">
                                    <Sparkles className="h-4 w-4 text-brand-gold" />
                                    <span className="text-[10px] font-black text-stone-500 dark:text-stone-400 uppercase tracking-widest">Upgrade de Plano</span>
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-stone-300 dark:text-stone-700 group-hover:text-brand-primary transition-all" />
                            </button>
                        </div>
                    </div>

                    {/* Faturamento Info */}
                    <div className="bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-white/5 rounded-2xl p-6 shadow-md">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-8 w-8 rounded-lg bg-white dark:bg-white/[0.03] border border-stone-200 dark:border-white/5 flex items-center justify-center shadow-sm">
                                <ShieldCheck className="h-4 w-4 text-stone-400 dark:text-stone-600" />
                            </div>
                            <h4 className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Portal de Faturamento</h4>
                        </div>
                        <p className="text-[11px] text-stone-500 leading-relaxed font-medium">
                            Precisando de nota fiscal ou históricos de cobrança? Acesse o portal seguro do Stripe para gerenciar seus dados financeiros.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
