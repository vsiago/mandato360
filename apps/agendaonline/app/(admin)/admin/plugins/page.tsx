"use client"

import { Plug, Plus, Search, Puzzle, Star, ShieldCheck, ArrowRight, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export default function AdminPluginsPage() {
    const plugins = [
        {
            name: "Agenda Pro",
            desc: "Sistema de agendamento avançado com múltiplos profissionais.",
            icon: Puzzle,
            status: "Installed",
            category: "Gestão"
        },
        {
            name: "Financeiro Gold",
            desc: "Controle de fluxo de caixa, DRE e emissão de notas.",
            icon: Star,
            status: "Beta",
            category: "Financeiro"
        },
        {
            name: "Marketing Automático",
            desc: "Disparo de e-mails e WhatsApp para recuperação de clientes.",
            icon: ShieldCheck,
            status: "Available",
            category: "Marketing"
        }
    ]

    return (
        <div className="flex-1 flex flex-col space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-foreground tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
                        Loja de Plugins
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Gerencie e instale novas extensões para a plataforma.
                    </p>
                </div>
                <Button className="btn-gold-solid rounded-xl px-6 h-11 font-bold shadow-lg shadow-amber-500/10">
                    <Plus className="h-4 w-4 mr-2" /> Novo Plugin
                </Button>
            </div>

            {/* Search */}
            <div className="relative max-w-md w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Buscar plugins por nome ou funcionalidade..." 
                    className="pl-11 h-12 rounded-xl bg-card border-stone-200/60 dark:border-stone-800/60" 
                />
            </div>

            {/* Plugin Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {plugins.map((plugin, i) => (
                    <div key={i} className="bg-card rounded-[24px] border border-stone-200/60 dark:border-stone-800/60 p-6 flex flex-col group hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300">
                        <div className="flex items-start justify-between mb-6">
                            <div className="h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all">
                                <plugin.icon className="h-7 w-7 text-amber-600 dark:text-amber-400 group-hover:text-white" />
                            </div>
                            <span className={cn(
                                "text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest",
                                plugin.status === "Installed" ? "bg-emerald-500/10 text-emerald-600" : 
                                plugin.status === "Beta" ? "bg-amber-500/10 text-amber-600" : "bg-stone-100 text-stone-500"
                            )}>
                                {plugin.status}
                            </span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-foreground mb-2">{plugin.name}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-8 flex-1">
                            {plugin.desc}
                        </p>

                        <div className="flex items-center justify-between pt-6 border-t border-stone-100 dark:border-stone-800">
                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{plugin.category}</span>
                            <Button variant="ghost" size="sm" className="h-9 px-4 rounded-lg text-xs font-bold hover:bg-amber-500/5 hover:text-amber-600">
                                Gerenciar <ArrowRight className="h-3 w-3 ml-2" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Coming Soon Section */}
            <div className="bg-stone-900 rounded-[32px] p-10 text-center relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Quer desenvolver um plugin?</h3>
                    <p className="text-stone-400 text-sm max-w-md mx-auto mb-8">
                        Em breve abriremos nossa SDK para que desenvolvedores parceiros possam criar extensões para o ecossistema Agenda Online.
                    </p>
                    <Button className="rounded-xl h-12 px-8 font-bold bg-white text-black hover:bg-stone-200">
                        Inscrição para Beta <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                </div>
                <Plug className="absolute -left-10 -bottom-10 h-64 w-64 text-white/5 rotate-12" />
            </div>
        </div>
    )
}
