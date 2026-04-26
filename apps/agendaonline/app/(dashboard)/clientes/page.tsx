"use client"

import { Users, Search, Filter, Plus, Mail, Phone, Calendar, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export default function ClientesPage() {
    return (
        <div className="flex-1 flex flex-col space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-foreground tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
                        Clientes
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Gerencie sua base de clientes e histórico de atendimentos.
                    </p>
                </div>
                <Button className="btn-gold-solid rounded-xl px-6 h-11 font-bold shadow-lg shadow-amber-500/10">
                    <Plus className="h-4 w-4 mr-2" /> Novo Cliente
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: "Total de Clientes", value: "0", icon: Users, trend: "+0%" },
                    { label: "Novos este mês", value: "0", icon: Plus, trend: "+0%" },
                    { label: "Ticket Médio", value: "R$ 0", icon: Calendar, trend: "—" },
                ].map((stat, i) => (
                    <div key={i} className="bg-card rounded-xl border shadow-sm p-5 flex items-center gap-4 transition-all hover:shadow-md">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                            <stat.icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">{stat.trend}</span>
                            </div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mt-0.5">
                                {stat.label}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Buscar por nome, email ou telefone..." 
                        className="pl-11 h-12 rounded-xl bg-card border-stone-200/60 dark:border-stone-800/60 focus:ring-amber-500/20" 
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button variant="outline" className="flex-1 sm:flex-none h-12 px-5 rounded-xl border-stone-200/60 dark:border-stone-800/60">
                        <Filter className="h-4 w-4 mr-2" /> Filtros
                    </Button>
                    <Button variant="outline" className="flex-1 sm:flex-none h-12 px-5 rounded-xl border-stone-200/60 dark:border-stone-800/60">
                        Exportar
                    </Button>
                </div>
            </div>

            {/* Content Area - Empty State */}
            <div className="bg-card rounded-xl border border-stone-200/60 dark:border-stone-800/60 overflow-hidden">
                <div className="p-12 text-center flex flex-col items-center justify-center">
                    <div className="h-20 w-20 bg-muted rounded-2xl flex items-center justify-center mb-6 border border-stone-200/20 dark:border-stone-800/40">
                        <Users className="h-10 w-10 text-stone-300 dark:text-stone-600" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
                        Sua lista está vazia
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-2 leading-relaxed">
                        Os clientes que agendarem pelo seu site aparecerão aqui automaticamente. Você também pode adicioná-los manualmente ou importar uma lista.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                        <Button className="w-full sm:w-auto btn-gold-solid rounded-xl h-11 px-8 font-bold">
                            Adicionar Primeiro Cliente
                        </Button>
                        <Button variant="ghost" className="w-full sm:w-auto h-11 px-8 text-sm font-semibold">
                            Importar CSV/Excel
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
