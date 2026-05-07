"use client"

import { BarChart3, TrendingUp, Users, Calendar, Clock, DollarSign, ArrowRight, PieChart, LineChart, FileText, Sparkles, ChevronRight, Download, Filter, Plus } from "lucide-react"
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
        <div className="flex-1 flex flex-col space-y-4 lg:space-y-8 animate-in fade-in duration-500 pb-10">
            {/* ── Header ── */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6 mb-1 lg:mb-2 lg:px-0">
                <div className="flex-1">
                    <h2 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight flex items-center gap-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                        Relatórios
                    </h2>
                    <p className="text-xs lg:text-sm text-muted-foreground mt-0.5 lg:mt-1">
                        Analise os números do seu negócio para tomar decisões baseadas em dados.
                    </p>
                </div>
                <div className="flex items-center gap-2 w-full lg:w-auto">
                    <Button variant="outline" className="flex-1 lg:flex-none text-stone-500 dark:text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-white/5 border-stone-200 dark:border-white/5 rounded-xl font-bold text-[11px] lg:text-sm h-10 lg:h-12 transition-all shadow-sm">
                        <Filter className="h-4 w-4 mr-2" /> Filtrar Período
                    </Button>
                    <Button className="flex-1 lg:flex-none text-white rounded-xl px-6 h-10 lg:h-12 font-bold flex items-center justify-center gap-2 transition-all bg-brand-gold text-[11px] lg:text-sm shadow-xl shadow-brand-secondary/20">
                        <Plus className="h-4 w-4 lg:h-5 lg:w-5" /> Exportar Dados
                    </Button>
                </div>
            </div>

            {/* ── Quick Summary KPI (Premium Glass Card) ── */}
            <div className="group bg-white dark:bg-stone-900/40 backdrop-blur-md border border-stone-200 dark:border-white/[0.03] rounded-[2rem] p-6 lg:p-10 text-stone-900 dark:text-white shadow-2xl relative overflow-hidden transition-all hover:bg-stone-50 dark:hover:bg-stone-900/60">
                {/* Decorative background glow */}
                <div className="absolute top-0 right-0 h-full w-1/2 bg-linear-to-l from-brand-primary/10 to-transparent pointer-events-none" />
                
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8 lg:mb-12">
                        <h3 className="text-xs lg:text-sm font-black uppercase tracking-[0.3em] text-stone-400 dark:text-stone-500">Resumo da Performance</h3>
                        <div className="h-8 px-4 rounded-full bg-stone-50 dark:bg-white/[0.03] border border-stone-100 dark:border-white/5 flex items-center gap-2 text-[10px] font-bold text-stone-500 dark:text-stone-400 shadow-sm">
                            Maio 2026 <ChevronRight className="h-3 w-3" />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                        {[
                            { label: "Agendamentos", value: "0", sub: "+0% vs abr" },
                            { label: "Faturamento", value: "R$ 0", sub: "Ticket Médio: R$ 0" },
                            { label: "Novos Clientes", value: "0", sub: "Ativos: 0" },
                            { label: "Taxa Retenção", value: "0%", sub: "Recorrência" },
                        ].map((stat, i) => (
                            <div key={i} className="space-y-1.5 lg:space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500">{stat.label}</p>
                                <p className="text-3xl lg:text-4xl font-black text-stone-900 dark:text-white tracking-tighter">{stat.value}</p>
                                <p className="text-[9px] lg:text-[10px] font-bold text-brand-primary opacity-60 uppercase tracking-widest">{stat.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <BarChart3 className="absolute -right-8 -bottom-8 h-48 w-48 lg:h-64 lg:w-64 opacity-[0.03] text-brand-primary rotate-12 transition-all group-hover:rotate-0 group-hover:scale-110" />
            </div>

            {/* ── Report Categories Grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8">
                {reportCategories.map((cat, i) => (
                    <div key={i} className="group bg-white dark:bg-stone-900/40 backdrop-blur-md border border-stone-200 dark:border-white/[0.03] rounded-2xl p-5 lg:p-7 flex flex-col hover:bg-stone-50 dark:hover:bg-stone-900/60 transition-all duration-500 shadow-xl">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className={cn("h-10 w-10 lg:h-12 lg:w-12 rounded-xl flex items-center justify-center border shadow-lg group-hover:scale-110 transition-all", cat.bg, "border-stone-100 dark:border-white/5")}>
                                    <cat.icon className={cn("h-5 w-5 lg:h-6 lg:w-6", cat.color)} />
                                </div>
                                <h3 className="text-sm lg:text-base font-bold text-stone-900 dark:text-white uppercase tracking-widest">{cat.title}</h3>
                            </div>
                            <Sparkles className="h-4 w-4 text-stone-300 dark:text-stone-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        
                        <div className="space-y-3 flex-1">
                            {cat.reports.map((report, j) => (
                                <button key={j} className="w-full flex items-center justify-between p-4 rounded-xl bg-stone-50 dark:bg-white/[0.02] border border-stone-100 dark:border-white/5 hover:border-brand-primary/30 hover:bg-brand-primary/5 group/item transition-all text-left shadow-sm">
                                    <span className="text-[11px] lg:text-xs font-bold text-stone-500 dark:text-stone-400 group-hover/item:text-stone-900 dark:group-hover/item:text-white transition-colors">{report}</span>
                                    <ArrowRight className="h-3.5 w-3.5 text-stone-300 dark:text-stone-700 group-hover/item:text-brand-primary transition-all group-hover/item:translate-x-1" />
                                </button>
                            ))}
                        </div>
                        
                        <Button variant="ghost" className="mt-8 w-full text-[10px] font-black uppercase tracking-widest text-stone-500 hover:text-brand-primary hover:bg-transparent transition-all">
                            Gerar Relatório Completo
                        </Button>
                    </div>
                ))}
            </div>

            {/* ── Custom Builder Tip ── */}
            <div className="bg-white dark:bg-stone-900/60 backdrop-blur-md border border-stone-200 dark:border-white/[0.03] p-8 lg:p-12 rounded-[2.5rem] flex flex-col items-center text-center space-y-6 shadow-2xl relative overflow-hidden group">
                {/* Abstract background effect */}
                <div className="absolute inset-0 bg-radial-at-c from-brand-primary/5 to-transparent pointer-events-none" />
                
                <div className="h-16 w-16 lg:h-20 lg:w-20 bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-white/5 rounded-3xl flex items-center justify-center shadow-2xl relative z-10 group-hover:scale-110 transition-transform">
                    <FileText className="h-8 w-8 lg:h-10 lg:w-10 text-stone-300 dark:text-stone-600 group-hover:text-brand-primary transition-colors" />
                </div>
                
                <div className="max-w-md space-y-3 relative z-10">
                    <h3 className="text-xl lg:text-2xl font-bold text-stone-900 dark:text-white" style={{ fontFamily: 'var(--font-playfair)' }}>Filtros Personalizados</h3>
                    <p className="text-xs lg:text-sm text-stone-400 dark:text-stone-500 leading-relaxed font-medium">
                        Precisa de dados específicos? Em breve você poderá criar seus próprios relatórios com filtros avançados e exportação automática.
                    </p>
                </div>
                
                <Button disabled className="relative z-10 rounded-xl h-12 px-8 text-[10px] font-black uppercase tracking-widest bg-stone-50 dark:bg-white/[0.03] border border-stone-200 dark:border-white/5 text-stone-400 dark:text-stone-600 opacity-50">
                    Em Breve na Versão 2.0
                </Button>
            </div>
        </div>
    )
}
