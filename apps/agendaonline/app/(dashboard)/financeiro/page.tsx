"use client"

import { DollarSign, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Wallet, Receipt, Calendar, Filter, Download, Plus, Sparkles, PieChart, CreditCard, Landmark, Banknote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function FinanceiroPage() {
    return (
        <div className="flex-1 flex flex-col space-y-4 lg:space-y-8 animate-in fade-in duration-500 pb-10">
            {/* ── Header ── */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6 mb-1 lg:mb-2 lg:px-0">
                <div className="flex-1">
                    <h2 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight flex items-center gap-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                        Financeiro
                    </h2>
                    <p className="text-xs lg:text-sm text-muted-foreground mt-0.5 lg:mt-1">
                        Acompanhe suas receitas, despesas e fluxo de caixa em tempo real.
                    </p>
                </div>
                
                <div className="flex items-center gap-2 w-full lg:w-auto">
                    <Button 
                        variant="outline" 
                        className="flex-1 lg:flex-none text-stone-500 dark:text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-white/5 border-stone-200 dark:border-white/5 rounded-xl font-bold text-[11px] lg:text-sm h-10 lg:h-12 transition-all shadow-sm"
                    >
                        <Download className="h-4 w-4 mr-2" /> Relatórios
                    </Button>
                    <Button 
                        className="flex-1 lg:flex-none text-white rounded-xl px-6 h-10 lg:h-12 font-bold flex items-center justify-center gap-2 transition-all bg-brand-gold text-[11px] lg:text-sm shadow-xl shadow-brand-secondary/20"
                    >
                        <Plus className="h-4 w-4 lg:h-5 lg:w-5" /> Nova Transação
                    </Button>
                </div>
            </div>

            {/* ── Main Stats KPIs (Premium Cards) ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                {[
                    { label: "Receita (Mês)", value: "R$ 0,00", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/10" },
                    { label: "Despesas (Mês)", value: "R$ 0,00", icon: TrendingDown, color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/10" },
                    { label: "Saldo Previsto", value: "R$ 0,00", icon: Wallet, color: "text-brand-primary", bg: "bg-brand-primary/10", border: "border-brand-primary/10" },
                ].map((stat, i) => (
                    <div key={i} className="group bg-white dark:bg-stone-900/40 backdrop-blur-md border border-stone-200 dark:border-white/[0.03] rounded-2xl p-5 lg:p-6 flex flex-col gap-4 relative overflow-hidden hover:bg-stone-50 dark:hover:bg-stone-900/60 transition-all shadow-xl">
                        <div className="relative z-10 flex items-center justify-between">
                            <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center shrink-0 border transition-all group-hover:scale-110 shadow-lg", stat.bg, stat.border)}>
                                <stat.icon className={cn("h-6 w-6", stat.color)} />
                            </div>
                            <div className="h-8 px-3 rounded-lg bg-stone-50 dark:bg-white/[0.03] border border-stone-100 dark:border-white/5 flex items-center gap-1 text-[9px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-widest shadow-sm">
                                <Plus className="h-3 w-3" /> Lançar
                            </div>
                        </div>
                        <div className="relative z-10">
                            <p className="text-2xl lg:text-3xl font-black text-stone-900 dark:text-white tracking-tighter">{stat.value}</p>
                            <p className="text-[10px] lg:text-xs font-black text-stone-500 uppercase tracking-[0.2em] mt-1.5 flex items-center gap-2">
                                {stat.label}
                                <span className="h-1 w-1 rounded-full bg-stone-200 dark:bg-stone-700" />
                                <span className="text-emerald-500">+0%</span>
                            </p>
                        </div>
                        {/* Decorative background element */}
                        <div className={cn("absolute -right-4 -bottom-4 h-24 w-24 opacity-[0.03] rotate-12 transition-all group-hover:rotate-0 group-hover:scale-110", stat.color)}>
                            <stat.icon className="h-full w-full" />
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Transaction Section & Sidebar ── */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 lg:gap-8">
                
                {/* ── Recent Activity List ── */}
                <div className="bg-white dark:bg-stone-900/40 backdrop-blur-md border border-stone-200 dark:border-white/[0.03] rounded-2xl flex flex-col shadow-2xl overflow-hidden min-h-[450px]">
                    <div className="px-6 py-5 lg:py-6 border-b border-stone-100 dark:border-white/[0.03] flex items-center justify-between bg-stone-50/50 dark:bg-white/[0.01]">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-stone-100 dark:bg-white/[0.03] border border-stone-200 dark:border-white/5 flex items-center justify-center shadow-sm">
                                <Receipt className="h-4 w-4 text-brand-primary" />
                            </div>
                            <h3 className="text-sm lg:text-base font-bold text-stone-900 dark:text-white uppercase tracking-widest">Transações Recentes</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="h-8 w-8 rounded-lg bg-stone-50 dark:bg-white/[0.03] border border-stone-200 dark:border-white/5 flex items-center justify-center text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-white/5 transition-all shadow-sm">
                                <Filter className="h-4 w-4" />
                            </button>
                            <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest text-brand-primary hover:bg-brand-primary/5">Ver Todas</Button>
                        </div>
                    </div>

                    {/* Empty State / List */}
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
                        <div className="relative">
                            <div className="h-20 w-20 bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-white/5 rounded-[2.5rem] flex items-center justify-center shadow-2xl animate-pulse">
                                <Receipt className="h-10 w-10 text-stone-300 dark:text-stone-700" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-xl bg-brand-primary flex items-center justify-center shadow-xl border-2 border-white dark:border-stone-900">
                                <DollarSign className="h-4 w-4 text-white" />
                            </div>
                        </div>
                        <div className="max-w-xs">
                            <h4 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-widest mb-2">Caixa Vazio</h4>
                            <p className="text-xs text-stone-500 leading-relaxed font-medium">
                                Agendamentos pagos e lançamentos manuais aparecerão aqui para o seu controle.
                            </p>
                        </div>
                        <Button className="bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 border border-brand-primary/20 rounded-xl px-8 h-12 font-black uppercase tracking-widest text-[10px] transition-all">
                            Começar Lançamentos
                        </Button>
                    </div>
                </div>

                {/* ── Account Summary Sidebar ── */}
                <div className="space-y-6 lg:space-y-8">
                    
                    {/* Next Bills */}
                    <div className="bg-white dark:bg-stone-900/40 backdrop-blur-md border border-stone-200 dark:border-white/[0.03] rounded-2xl p-6 lg:p-7 shadow-xl space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em]">Próximos Vencimentos</h3>
                            <div className="h-6 px-2 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-500 uppercase flex items-center">Ok</div>
                        </div>
                        
                        <div className="space-y-3">
                            <div className="flex items-center justify-center py-10 border border-dashed border-stone-200 dark:border-white/5 rounded-2xl bg-stone-50/50 dark:bg-white/[0.01]">
                                <p className="text-[10px] font-bold text-stone-400 dark:text-stone-600 italic uppercase tracking-widest">Tudo em dia!</p>
                            </div>
                        </div>

                        {/* Quick Method Cards */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-white/5 flex flex-col gap-2 group hover:border-brand-primary/30 hover:bg-stone-100 dark:hover:bg-stone-900 transition-all cursor-pointer shadow-sm">
                                <Landmark className="h-4 w-4 text-stone-400 dark:text-stone-600 group-hover:text-brand-primary" />
                                <p className="text-[9px] font-black text-stone-500 dark:text-stone-400 uppercase tracking-widest">Bancos</p>
                            </div>
                            <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-white/5 flex flex-col gap-2 group hover:border-brand-primary/30 hover:bg-stone-100 dark:hover:bg-stone-900 transition-all cursor-pointer shadow-sm">
                                <CreditCard className="h-4 w-4 text-stone-400 dark:text-stone-600 group-hover:text-brand-primary" />
                                <p className="text-[9px] font-black text-stone-500 dark:text-stone-400 uppercase tracking-widest">Cartões</p>
                            </div>
                        </div>
                    </div>

                    {/* Financial Tip */}
                    <div className="bg-brand-primary/10 dark:bg-brand-primary/5 border border-brand-primary/20 dark:border-brand-primary/10 rounded-2xl p-6 lg:p-7 shadow-lg relative overflow-hidden group">
                        <div className="relative z-10 flex items-start gap-4">
                            <div className="h-10 w-10 rounded-xl bg-brand-primary flex items-center justify-center shadow-lg shadow-brand-primary/20 shrink-0">
                                <Sparkles className="h-5 w-5 text-white" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-bold text-brand-primary uppercase tracking-widest">Dica Financeira</h4>
                                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-medium">
                                    Mantenha seus serviços atualizados para que o cálculo de receita prevista seja sempre 100% preciso.
                                </p>
                            </div>
                        </div>
                        {/* Abstract background shape */}
                        <div className="absolute -top-10 -right-10 h-32 w-32 bg-brand-primary/5 rounded-full blur-3xl group-hover:bg-brand-primary/10 transition-all" />
                    </div>

                    {/* Quick Link */}
                    <button className="w-full flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-white/[0.02] border border-stone-200 dark:border-white/5 hover:bg-stone-50 dark:hover:bg-white/[0.05] transition-all group shadow-md shadow-stone-200/20 dark:shadow-none">
                        <div className="flex items-center gap-3">
                            <PieChart className="h-5 w-5 text-stone-500 group-hover:text-brand-primary transition-colors" />
                            <span className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-widest">Ver Balanço Anual</span>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-stone-300 dark:text-stone-700 group-hover:text-brand-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                    </button>
                </div>
            </div>
        </div>
    )
}
