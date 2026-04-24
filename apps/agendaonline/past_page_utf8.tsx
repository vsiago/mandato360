"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import {
    CalendarDays, TrendingUp, Users, ArrowRight, Sparkles,
    ExternalLink, Globe, Eye, DollarSign,
    Clock, BarChart3, CheckCircle2, X, Scissors,
    Loader2, Share2, Info
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { getMyTenant } from "@/lib/tenant-api"
import type { TenantData } from "@/lib/tenant-types"

export default function PainelPage() {
    const [tenant, setTenant] = useState<TenantData | null>(null)
    const [loading, setLoading] = useState(true)
    const [showChecklist, setShowChecklist] = useState(true)

    useEffect(() => {
        getMyTenant().then(data => {
            setTenant(data)
            setLoading(false)
            const dismissed = localStorage.getItem("agenda_checklist_dismissed")
            if (dismissed === "true") setShowChecklist(false)
        }).catch(() => setLoading(false))
    }, [])

    const greeting = () => {
        const h = new Date().getHours()
        if (h < 12) return "Bom dia"
        if (h < 18) return "Boa tarde"
        return "Boa noite"
    }

    const displayName = tenant?.founder?.name && tenant.founder.name !== "Seu Nome"
        ? tenant.founder.name.split(" ")[0]
        : tenant?.name?.split(" ")[0] || "Usu├írio"

    const serviceCount = tenant?.services?.length || 0

    const checklistItems = [
        { label: "Site publicado", done: !!tenant?.slug, href: "/editar-site" },
        { label: "WhatsApp configurado", done: !!tenant?.contact?.whatsapp, href: "/configuracoes" },
        { label: "Servi├ºos adicionados", done: serviceCount > 0, href: "/servicos" },
        { label: "Logo adicionada", done: !!tenant?.logoUrl, href: "/configuracoes" },
        { label: "Se├º├úo Sobre preenchida", done: tenant?.founder?.name !== "Seu Nome" && !!tenant?.founder?.bio, href: "/editar-site" },
    ]

    const completedCount = checklistItems.filter(i => i.done).length
    const allDone = completedCount === checklistItems.length
    const progress = Math.round(completedCount / checklistItems.length * 100)

    const handleDismissChecklist = () => {
        localStorage.setItem("agenda_checklist_dismissed", "true")
        setShowChecklist(false)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col space-y-6 animate-in fade-in duration-500">

            {/* ÔöÇÔöÇ Header ÔöÇÔöÇ */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-foreground tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
                        {`${greeting()}, ${displayName}`}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Gerencie seu neg├│cio e acompanhe seus resultados.
                    </p>
                </div>
                <Link href="/agenda">
                    <Button className="btn-gold-solid rounded-lg px-5 font-semibold">
                        <CalendarDays className="h-4 w-4 mr-2" /> Abrir Agenda
                    </Button>
                </Link>
            </div>

            {/* ÔöÇÔöÇ BI / Metrics Cards ÔöÇÔöÇ */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { icon: CalendarDays, label: "Agendamentos", value: "0", sub: "Hoje", color: "amber" },
                    { icon: Users, label: "Clientes", value: "0", sub: "Total", color: "amber" },
                    { icon: Scissors, label: "Servi├ºos ativos", value: String(serviceCount), sub: "Cat├ílogo", color: "amber" },
                    { icon: Eye, label: "Visitas no site", value: "ÔÇö", sub: "M├¬s", color: "amber" },
                ].map((card, i) => (
                    <div key={i} className="relative group rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(232,168,58,0.12)] cursor-default"
                        style={{
                            background: 'linear-gradient(145deg, rgba(232,168,58,0.06) 0%, transparent 60%)',
                        }}
                    >
                        {/* Gold top accent line */}
                        <div className="absolute top-0 left-0 right-0 h-[2px]"
                            style={{ background: 'linear-gradient(90deg, transparent, rgba(232,168,58,0.5), transparent)' }} />

                        <div className="relative p-5 border border-amber-200/20 dark:border-amber-500/10 rounded-xl bg-white/60 dark:bg-stone-900/60 backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-3">
                                <div className="h-10 w-10 rounded-xl flex items-center justify-center"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(232,168,58,0.15) 0%, rgba(232,168,58,0.05) 100%)',
                                        border: '1px solid rgba(232,168,58,0.15)',
                                    }}>
                                    <card.icon className="h-[18px] w-[18px] text-amber-600 dark:text-amber-400" />
                                </div>
                                <span className="text-[9px] uppercase font-bold text-amber-700/50 dark:text-amber-400/40 tracking-widest">{card.sub}</span>
                            </div>
                            <p className="text-3xl font-bold tracking-tight text-foreground">{card.value}</p>
                            <p className="text-[11px] text-muted-foreground mt-1 font-medium">{card.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ÔöÇÔöÇ Quick Shortcuts ÔöÇÔöÇ */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { href: "/editar-site", icon: Globe, title: "Editar Site", desc: "Personalize seu site p├║blico", gradient: "from-amber-500/10 to-amber-600/5" },
                    { href: "/servicos", icon: Scissors, title: "Servi├ºos", desc: "Gerenciar cat├ílogo e pre├ºos", gradient: "from-amber-500/8 to-amber-600/3" },
                    ...(tenant?.slug ? [{ href: `/${tenant.slug}`, icon: ExternalLink, title: "Ver Meu Site", desc: `/${tenant.slug}`, external: true, gradient: "from-amber-500/8 to-amber-600/3" }] : []),
                ].map((item, i) => {
                    const Inner = (
                        <div className="group relative rounded-xl border border-amber-200/20 dark:border-amber-500/10 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(232,168,58,0.12)] hover:border-amber-500/30 flex items-center gap-4 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm">
                            <div className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0 transition-all"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(232,168,58,0.2) 0%, rgba(232,168,58,0.05) 100%)',
                                    border: '1px solid rgba(232,168,58,0.2)',
                                }}>
                                <item.icon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-foreground tracking-tight">{item.title}</p>
                                <p className={cn("text-[11px] text-muted-foreground truncate", (item as any).external && "font-mono")}>{item.desc}</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-amber-500/30 ml-auto shrink-0 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                        </div>
                    )

                    return (item as any).external ? (
                        <a key={i} href={item.href} target="_blank" rel="noopener noreferrer">{Inner}</a>
                    ) : (
                        <Link key={i} href={item.href}>{Inner}</Link>
                    )
                })}
            </div>

            {/* ÔöÇÔöÇ Setup Checklist (dismissible) ÔöÇÔöÇ */}
            {showChecklist && (
                <div className="relative rounded-xl border border-amber-200/20 dark:border-amber-500/10 p-6 animate-in fade-in slide-in-from-top-2 duration-300 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm overflow-hidden">
                    {/* Subtle gradient bg */}
                    <div className="absolute inset-0 pointer-events-none"
                        style={{ background: 'linear-gradient(135deg, rgba(232,168,58,0.04) 0%, transparent 50%)' }} />

                    {allDone && (
                        <button
                            onClick={handleDismissChecklist}
                            className="absolute top-4 right-4 z-10 h-7 w-7 rounded-lg flex items-center justify-center text-stone-400 hover:text-foreground hover:bg-stone-100 dark:hover:bg-stone-800 transition-all"
                            title="Esconder checklist"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-1">
                            <Sparkles className="h-4 w-4 text-amber-500" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-amber-700/60 dark:text-amber-400/60">Configura├º├úo Inicial</span>
                        </div>
                        <p className="text-[13px] text-muted-foreground mb-4">
                            {allDone ? "Parab├®ns! Tudo configurado. Voc├¬ pode ocultar este checklist." : `${completedCount} de ${checklistItems.length} etapas conclu├¡das`}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
                            {checklistItems.map((item, i) => (
                                <Link
                                    key={i}
                                    href={item.done ? "#" : item.href}
                                    className={cn(
                                        "flex items-center gap-2.5 px-3.5 py-3 rounded-lg border transition-all text-[13px]",
                                        item.done
                                            ? "bg-emerald-500/5 dark:bg-emerald-500/5 border-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                                            : "bg-white/50 dark:bg-stone-800/50 border-stone-200/50 dark:border-stone-700/50 text-muted-foreground hover:border-amber-500/30 hover:text-foreground"
                                    )}
                                >
                                    <div className={cn(
                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold shrink-0",
                                        item.done
                                            ? "bg-emerald-500 border-emerald-500 text-white"
                                            : "border-stone-300 dark:border-stone-600"
                                    )}>
                                        {item.done ? "Ô£ô" : ""}
                                    </div>
                                    <span className="truncate font-medium">{item.label}</span>
                                </Link>
                            ))}
                        </div>
                        {/* Gold progress bar */}
                        <div className="h-1 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{
                                    width: `${progress}%`,
                                    background: 'linear-gradient(90deg, #E8A83A, #FADC8A, #E8A83A)',
                                }}
                            />
                        </div>
                        {allDone && (
                            <div className="mt-4 flex justify-end">
                                <Button onClick={handleDismissChecklist} size="sm" className="btn-gold-solid rounded-lg text-xs font-semibold px-6">
                                    <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Conclu├¡do, ocultar
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ÔöÇÔöÇ Bottom Row ÔÇö 3 columns ÔöÇÔöÇ */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* ÔöÇÔöÇ Mini Bar Chart: Agendamentos ├║ltimos 7 dias ÔöÇÔöÇ */}
                <div className="relative rounded-xl border border-amber-200/20 dark:border-amber-500/10 p-6 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm overflow-hidden flex flex-col">
                    <div className="absolute inset-0 pointer-events-none"
                        style={{ background: 'linear-gradient(135deg, rgba(232,168,58,0.03) 0%, transparent 40%)' }} />
                    <div className="relative z-10 flex flex-col flex-1">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <BarChart3 className="h-4 w-4 text-amber-500" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-amber-700/60 dark:text-amber-400/60">├Ültimos 7 dias</span>
                            </div>
                            <span className="text-[11px] text-muted-foreground font-medium">0 agendamentos</span>
                        </div>
                        {/* Sparkline bar chart */}
                        <div className="flex items-end gap-1.5 h-20 mt-auto">
                            {[0, 0, 0, 0, 0, 0, 0].map((val, i) => {
                                const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'S├íb', 'Dom']
                                const barH = val === 0 ? 4 : Math.max(8, (val / 10) * 80)
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                                        <div
                                            className="w-full rounded-md transition-all duration-500"
                                            style={{
                                                height: `${barH}px`,
                                                background: val === 0
                                                    ? 'rgba(232,168,58,0.1)'
                                                    : 'linear-gradient(180deg, rgba(232,168,58,0.8) 0%, rgba(232,168,58,0.4) 100%)',
                                                border: val === 0 ? '1px solid rgba(232,168,58,0.08)' : 'none',
                                                boxShadow: val > 0 ? '0 0 8px rgba(232,168,58,0.2)' : 'none',
                                            }}
                                        />
                                        <span className="text-[8px] text-stone-400 font-medium">{days[i]}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* ÔöÇÔöÇ Pr├│ximos Agendamentos ÔöÇÔöÇ */}
                <div className="relative rounded-xl border border-amber-200/20 dark:border-amber-500/10 p-6 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(232,168,58,0.08)]">
                    <div className="absolute inset-0 pointer-events-none"
                        style={{ background: 'linear-gradient(135deg, rgba(232,168,58,0.03) 0%, transparent 40%)' }} />
                    <div className="relative z-10 flex flex-col flex-1">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-amber-500" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-amber-700/60 dark:text-amber-400/60">Pr├│ximos Agendamentos</span>
                            </div>
                            <span className="text-[9px] uppercase font-bold text-amber-700/40 dark:text-amber-400/30 tracking-widest">Hoje</span>
                        </div>

                        {/* Insight Badge */}
                        <div className="flex items-center gap-1.5 mb-4">
                            <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                                <Info className="h-3 w-3" />
                                Voc├¬ tem v├írios hor├írios livres hoje
                            </div>
                        </div>
                        {/* Empty state with CTA */}
                        <div className="flex-1 flex flex-col items-center justify-center py-4 text-center">
                            <div className="h-11 w-11 rounded-xl flex items-center justify-center mb-3"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(232,168,58,0.1) 0%, rgba(232,168,58,0.03) 100%)',
                                    border: '1px solid rgba(232,168,58,0.1)',
                                }}>
                                <CalendarDays className="h-5 w-5 text-amber-500/50" />
                            </div>
                            <p className="text-[13px] text-muted-foreground">Nenhum agendamento hoje</p>
                            <p className="text-[11px] text-stone-400 mt-1 mb-4">Sua agenda est├í vazia. Que tal divulgar seu link?</p>
                            <div className="w-full flex flex-col gap-2 relative z-20">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        if (tenant?.slug) {
                                            navigator.clipboard.writeText(`${window.location.origin}/${tenant.slug}`);
                                            toast.success("Link copiado para a ├írea de transfer├¬ncia!");
                                        }
                                    }}
                                    className="w-full rounded-lg text-xs font-semibold border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-500/5 transition-all text-amber-600 dark:text-amber-400 cursor-pointer"
                                >
                                    <Share2 className="h-3.5 w-3.5 mr-1.5" />
                                    Copiar Link da Agenda
                                </Button>
                                <Link href="/agenda" className="w-full">
                                    <Button variant="ghost" size="sm" className="w-full rounded-lg text-xs font-medium text-stone-500 hover:text-stone-700 dark:hover:text-stone-300">
                                        Abrir Agenda
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ÔöÇÔöÇ Faturamento do M├¬s ÔöÇÔöÇ */}
                <div className="relative rounded-xl border border-amber-200/20 dark:border-amber-500/10 p-6 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm overflow-hidden flex flex-col">
                    <div className="absolute inset-0 pointer-events-none"
                        style={{ background: 'linear-gradient(135deg, rgba(232,168,58,0.03) 0%, transparent 40%)' }} />
                    <div className="relative z-10 flex flex-col flex-1">
                        <div className="flex items-center gap-2 mb-4">
                            <DollarSign className="h-4 w-4 text-amber-500" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-amber-700/60 dark:text-amber-400/60">Faturamento</span>
                        </div>
                        <div className="flex items-end justify-between mb-1">
                            <p className="text-3xl font-bold tracking-tight text-foreground">R$ 0</p>
                            <div className="flex items-center gap-1 px-2 py-1 rounded-md"
                                style={{
                                    background: 'rgba(232,168,58,0.06)',
                                    border: '1px solid rgba(232,168,58,0.1)',
                                }}>
                                <TrendingUp className="h-3 w-3 text-amber-500" />
                                <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">0%</span>
                            </div>
                        </div>
                        <p className="text-[11px] text-muted-foreground font-medium">Este m├¬s</p>
                        <div className="mt-auto pt-4 border-t border-stone-100 dark:border-stone-800/60">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] text-stone-400">M├¬s anterior</span>
                                <span className="text-[11px] text-stone-500 font-medium">R$ 0</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
