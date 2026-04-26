"use client"

import { DollarSign, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Wallet, Receipt, Calendar, Filter, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function FinanceiroPage() {
    return (
        <div className="flex-1 flex flex-col space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-foreground tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
                        Financeiro
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Acompanhe suas receitas, despesas e fluxo de caixa.
                    </p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button variant="outline" className="flex-1 sm:flex-none rounded-xl h-11 px-5 border-stone-200/60 dark:border-stone-800/60">
                        <Download className="h-4 w-4 mr-2" /> Relatório
                    </Button>
                    <Button className="flex-1 sm:flex-none btn-gold-solid rounded-xl px-6 h-11 font-bold shadow-lg shadow-amber-500/10">
                        Nova Transação
                    </Button>
                </div>
            </div>

            {/* Main Stats KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: "Receita (Mês)", value: "R$ 0,00", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                    { label: "Despesas (Mês)", value: "R$ 0,00", icon: TrendingDown, color: "text-rose-500", bg: "bg-rose-500/10" },
                    { label: "Saldo Previsto", value: "R$ 0,00", icon: Wallet, color: "text-amber-500", bg: "bg-amber-500/10" },
                ].map((stat, i) => (
                    <div key={i} className="bg-card rounded-xl border shadow-sm p-6 flex flex-col gap-4 relative overflow-hidden group hover:shadow-md transition-all">
                        <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center shrink-0 border border-transparent transition-all group-hover:scale-110", stat.bg)}>
                            <stat.icon className={cn("h-6 w-6", stat.color)} />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-foreground tracking-tighter">{stat.value}</p>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mt-1">
                                {stat.label}
                            </p>
                        </div>
                        {/* Decorative subtle background icon */}
                        <stat.icon className="absolute -right-4 -bottom-4 h-24 w-24 opacity-[0.03] text-foreground rotate-12" />
                    </div>
                ))}
            </div>

            {/* Quick Actions / Chart Section Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
                {/* Recent Activity */}
                <div className="bg-card rounded-xl border border-stone-200/60 dark:border-stone-800/60 flex flex-col min-h-[400px]">
                    <div className="px-6 py-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
                        <h3 className="text-base font-bold text-foreground">Transações Recentes</h3>
                        <Button variant="ghost" size="sm" className="text-xs font-semibold text-amber-600 dark:text-amber-400">Ver todas</Button>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                        <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                            <Receipt className="h-8 w-8 text-stone-300 dark:text-stone-600" />
                        </div>
                        <p className="text-sm font-medium text-foreground">Nenhuma transação este mês</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Agendamentos pagos ou lançamentos manuais aparecerão aqui.
                        </p>
                    </div>
                </div>

                {/* Account Summary Sidebar */}
                <div className="space-y-4">
                    <div className="bg-card rounded-xl border border-stone-200/60 dark:border-stone-800/60 p-6">
                        <h3 className="text-sm font-bold text-foreground mb-4">Próximos Vencimentos</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-center py-8 border border-dashed border-stone-200 dark:border-stone-800 rounded-lg">
                                <p className="text-xs text-muted-foreground italic">Tudo em dia!</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-6">
                        <h3 className="text-sm font-bold text-amber-700 dark:text-amber-400 mb-2">Dica Financeira</h3>
                        <p className="text-xs text-amber-600/80 leading-relaxed">
                            Mantenha seus serviços atualizados para que o cálculo de receita prevista seja sempre preciso.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
