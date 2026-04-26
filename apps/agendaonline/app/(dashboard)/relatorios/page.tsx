"use client"

import { BarChart3, TrendingUp, Users, Calendar, Clock, DollarSign, ArrowRight, PieChart, LineChart, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function RelatoriosPage() {
    const reportCategories = [
        {
            title: "Desempenho",
            icon: TrendingUp,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
            reports: [
                "Agendamentos por período",
                "Taxa de comparecimento",
                "Serviços mais procurados"
            ]
        },
        {
            title: "Clientes",
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            reports: [
                "Crescimento da base",
                "Fidelidade e recorrência",
                "Aniversariantes do mês"
            ]
        },
        {
            title: "Financeiro",
            icon: DollarSign,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            reports: [
                "Faturamento detalhado",
                "Ticket médio por serviço",
                "Previsão de recebíveis"
            ]
        }
    ]

    return (
        <div className="flex-1 flex flex-col space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-foreground tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
                        Relatórios
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Analise os números do seu negócio para tomar decisões melhores.
                    </p>
                </div>
            </div>

            {/* Quick Summary KPI */}
            <div className="bg-linear-to-r from-amber-500 to-amber-600 rounded-2xl p-8 text-white shadow-xl shadow-amber-500/20 relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-lg font-bold opacity-90 mb-6">Resumo do Mês Atual</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">Agendamentos</p>
                            <p className="text-3xl font-bold">0</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">Receita</p>
                            <p className="text-3xl font-bold">R$ 0</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">Novos Clientes</p>
                            <p className="text-3xl font-bold">0</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">Serviços</p>
                            <p className="text-3xl font-bold">0</p>
                        </div>
                    </div>
                </div>
                <BarChart3 className="absolute -right-10 -bottom-10 h-64 w-64 opacity-10 rotate-12" />
            </div>

            {/* Report Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {reportCategories.map((cat, i) => (
                    <div key={i} className="bg-card rounded-xl border border-stone-200/60 dark:border-stone-800/60 p-6 flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-center gap-3 mb-6">
                            <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", cat.bg)}>
                                <cat.icon className={cn("h-5 w-5", cat.color)} />
                            </div>
                            <h3 className="text-base font-bold text-foreground">{cat.title}</h3>
                        </div>
                        <div className="space-y-3 flex-1">
                            {cat.reports.map((report, j) => (
                                <button key={j} className="w-full flex items-center justify-between p-3 rounded-lg border border-stone-100 dark:border-stone-800 hover:border-amber-500/30 hover:bg-amber-500/5 group transition-all text-left">
                                    <span className="text-xs font-medium text-stone-600 dark:text-stone-400 group-hover:text-foreground">{report}</span>
                                    <ArrowRight className="h-3 w-3 text-stone-300 group-hover:text-amber-500 transition-all" />
                                </button>
                            ))}
                        </div>
                        <Button variant="ghost" className="mt-6 w-full text-xs font-bold text-muted-foreground hover:text-amber-600 transition-colors">
                            Ver todos os relatórios
                        </Button>
                    </div>
                ))}
            </div>

            {/* Custom Report Builder Placeholder */}
            <div className="bg-card rounded-xl border border-stone-200/60 dark:border-stone-800/60 p-8 flex flex-col items-center text-center">
                <FileText className="h-12 w-12 text-stone-300 mb-4" />
                <h3 className="text-lg font-bold text-foreground">Relatórios Personalizados</h3>
                <p className="text-sm text-muted-foreground max-w-sm mt-2">
                    Precisa de dados específicos? Em breve você poderá criar seus próprios relatórios com filtros avançados.
                </p>
                <Button disabled className="mt-6 rounded-xl h-10 px-6 text-xs font-bold opacity-50">
                    Em Breve
                </Button>
            </div>
        </div>
    )
}
