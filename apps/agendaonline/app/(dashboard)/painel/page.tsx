"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import {
    CalendarDays, TrendingUp, Users, ArrowRight, CheckSquare,
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

function PainelContent() {
    const [tenant, setTenant] = useState<TenantData | null>(null)
    const [loading, setLoading] = useState(true)
    const [showChecklist, setShowChecklist] = useState(true)
    const searchParams = useSearchParams()

    useEffect(() => {
        const success = searchParams.get("success")
        if (success === "true") {
            toast.success("Assinatura confirmada! Bem-vindo ao plano pro.", {
                duration: 5000,
            })
            // Limpar a URL sem recarregar
            window.history.replaceState({}, "", "/painel")
        }
    }, [searchParams])

    useEffect(() => {
        getMyTenant().then(data => {
            setTenant(data)
            setLoading(false)
            const dismissed = localStorage.getItem("agenda_checklist_dismissed_v2")
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
        : tenant?.name?.split(" ")[0] || "Usuário"

    const serviceCount = tenant?.services?.length || 0

    const checklistItems = [
        { label: "Site publicado", done: !!tenant?.slug, href: "/editar-site" },
        { label: "Configurar WhatsApp", done: !!tenant?.contact?.whatsapp, href: "/configuracoes" },
        { label: "Adicionar logotipo", done: !!tenant?.logoUrl, href: "/configuracoes" },
        { label: "Cadastrar serviços", done: serviceCount > 0, href: "/servicos" },
        { label: "Antes e Depois", done: (tenant?.beforeAfter?.length || 0) > 0, href: "/antes-depois" },
        { label: "Foto de Quem somos", done: !!tenant?.founder?.imageUrl, href: "/editar-site" },
        { label: "Foto do chat", done: !!tenant?.chat?.avatarUrl, href: "/configuracoes" },
    ]

    const completedCount = checklistItems.filter(i => i.done).length
    const allDone = completedCount === checklistItems.length
    const progress = Math.round(completedCount / checklistItems.length * 100)

    const handleDismissChecklist = () => {
        localStorage.setItem("agenda_checklist_dismissed_v2", "true")
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
        <div className="flex-1 flex flex-col space-y-6 animate-in fade-in duration-500 relative">
            {/* ── Trial Lock Overlay ── */}
            {tenant?.trialStatus?.isExpired && (
                <div className="fixed inset-0 z-[100] bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-stone-900 rounded-[32px] border border-amber-500/20 p-8 max-w-md w-full text-center shadow-2xl"
                    >
                        <div className="h-20 w-20 bg-amber-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
                            <Clock className="h-10 w-10 text-amber-500" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4 text-foreground" style={{ fontFamily: 'var(--font-playfair)' }}>
                            Periodo de Teste Expirou
                        </h2>
                        <p className="text-muted-foreground mb-8 text-sm">
                            Seus 7 dias gratuitos terminaram. Para continuar gerenciando seu negócio e manter seu site no ar, ative sua assinatura agora.
                        </p>
                        <div className="space-y-3">
                            <Link href="/checkout?plan=profissional" className="block">
                                <Button className="w-full btn-gold-solid h-14 rounded-2xl text-base font-bold">
                                    Ativar Minha Assinatura
                                </Button>
                            </Link>
                            <Link href="/#pricing" className="block">
                                <Button variant="ghost" className="w-full h-12 text-sm text-muted-foreground hover:text-foreground">
                                    Ver outros planos
                                </Button>
                            </Link>
                        </div>
                        <p className="mt-8 text-[10px] text-stone-500 uppercase tracking-widest font-bold">
                            Agenda Online • Ativação Imediata
                        </p>
                    </motion.div>
                </div>
            )}

            {/* ── Trial Banner ── */}
            {tenant?.trialStatus && !tenant.trialStatus.isExpired && tenant.plan === "free" && (
                <div className="relative group rounded-2xl overflow-hidden border border-amber-500/20 bg-amber-500/5 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20">
                            <Clock className="h-5 w-5 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-foreground">Seu período de teste está ativo</p>
                            <p className="text-xs text-muted-foreground">Você tem mais <span className="text-amber-500 font-bold">{tenant.trialStatus.daysLeft} dias</span> de acesso gratuito.</p>
                        </div>
                    </div>
                    <Link href="/checkout?plan=profissional">
                        <Button size="sm" className="btn-gold-solid rounded-xl px-6 h-10 text-xs font-bold shadow-lg shadow-amber-500/20 border-0">
                            Ativar Assinatura
                        </Button>
                    </Link>
                </div>
            )}

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
                <div>
                    <h2 className="text-3xl font-bold text-foreground tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
                        <span className="text-gold-smooth">{greeting()},</span> {displayName}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Gerencie seu negócio e acompanhe seus resultados.
                    </p>
                </div>
                <Link href="/agenda">
                    <Button className="btn-gold-solid rounded-xl px-6 h-11 font-bold shadow-lg shadow-amber-500/10">
                        <CalendarDays className="h-4 w-4 mr-2" /> Abrir Agenda
                    </Button>
                </Link>
            </div>

            {/* ── Minimalist Metrics Strip ── */}
            <div className="relative rounded-2xl border border-stone-200/50 dark:border-white/5 bg-white/50 dark:bg-stone-900/40 backdrop-blur-md px-2 py-6 shadow-sm overflow-hidden">
                <div className="absolute inset-0 pointer-events-none opacity-20" 
                    style={{ background: 'radial-gradient(circle at 20% 0%, rgba(232,168,58,0.15) 0%, transparent 50%)' }} />
                
                <div className="grid grid-cols-2 lg:grid-cols-4 relative z-10">
                    {[
                        { icon: CalendarDays, label: "Agendamentos", value: "0", sub: "Hoje" },
                        { icon: Users, label: "Clientes", value: "0", sub: "Total" },
                        { icon: Scissors, label: "Serviços ativos", value: String(serviceCount), sub: "Catálogo" },
                        { icon: Eye, label: "Visitas no site", value: "—", sub: "Mês" },
                    ].map((card, i) => (
                        <div key={i} className={cn(
                            "flex flex-col items-center justify-center text-center px-4",
                            i < 3 && "border-r border-stone-200/50 dark:border-white/5",
                            i >= 2 && "mt-6 lg:mt-0"
                        )}>
                            <div className="flex items-center gap-1.5 mb-1">
                                <card.icon className="h-3.5 w-3.5 text-amber-500/70" />
                                <span className="text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400 tracking-widest">{card.sub}</span>
                            </div>
                            <p className="text-2xl font-bold tracking-tighter text-foreground leading-none">{card.value}</p>
                            <p className="text-[11px] text-muted-foreground mt-1.5 font-medium">{card.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Compact Setup Checklist ── */}
            {showChecklist && (
                <div className="relative rounded-2xl border border-amber-500/10 dark:border-white/5 p-4 animate-in fade-in slide-in-from-top-2 duration-500 bg-white dark:bg-stone-900/40 backdrop-blur-md overflow-hidden shadow-sm">
                    {allDone && (
                        <button
                            onClick={handleDismissChecklist}
                            className="absolute top-3 right-3 z-10 h-6 w-6 rounded-full flex items-center justify-center text-stone-400 hover:text-foreground hover:bg-stone-100 dark:hover:bg-stone-800 transition-all"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    )}
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 flex items-center justify-center shrink-0">
                                <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-stone-100 dark:stroke-stone-800" strokeWidth="3" />
                                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-amber-500 transition-all duration-1000" strokeWidth="3" strokeDasharray={`${progress}, 100`} strokeLinecap="round" />
                                </svg>
                                <span className="absolute text-[10px] font-bold text-amber-600 dark:text-amber-400">{progress}%</span>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold tracking-tight text-foreground">Configuração da Agenda</h3>
                                <p className="text-[11px] text-muted-foreground">
                                    {allDone ? "Tudo pronto para começar!" : `${completedCount} de ${checklistItems.length} etapas concluídas`}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {checklistItems.map((item, i) => (
                                <Link
                                    key={i}
                                    href={item.done ? "#" : item.href}
                                    className={cn(
                                        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border transition-all text-[10px] font-semibold",
                                        item.done
                                            ? "bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400 opacity-60"
                                            : "bg-stone-100 dark:bg-stone-800 border-transparent text-stone-600 dark:text-stone-400 hover:border-amber-500/30 hover:text-foreground"
                                    )}
                                >
                                    {item.done ? <CheckCircle2 className="h-3 w-3" /> : <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />}
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        {allDone && (
                            <Button onClick={handleDismissChecklist} size="sm" className="btn-gold-solid rounded-full text-[10px] h-8 px-4 font-bold shrink-0">
                                Ocultar Checklist
                            </Button>
                        )}
                    </div>
                </div>
            )}

            {/* ── Quick Shortcuts ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { href: "/editar-site", icon: Globe, title: "Editar Site", desc: "Personalize seu site público" },
                    { href: "/servicos", icon: Scissors, title: "Serviços", desc: "Gerenciar catálogo e preços" },
                    ...(tenant?.slug ? [{ href: `/${tenant.slug}`, icon: ExternalLink, title: "Ver Meu Site", desc: `/${tenant.slug}`, external: true }] : []),
                ].map((item, i) => {
                    const Inner = (
                        <div className="group relative rounded-2xl border border-stone-200/50 dark:border-white/5 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5 bg-white/50 dark:bg-stone-900/40 backdrop-blur-md flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 bg-amber-500/10 border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-white transition-all">
                                <item.icon className="h-5 w-5 text-amber-600 dark:text-amber-400 group-hover:text-white" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-foreground tracking-tight">{item.title}</p>
                                <p className={cn("text-[10px] text-muted-foreground truncate", (item as any).external && "font-mono")}>{item.desc}</p>
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


            {/* ── Insights Row ── */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 pb-8 min-h-[400px]">
                {/* ── Agendamentos Chart ── */}
                <div className="relative rounded-2xl border border-stone-200/50 dark:border-white/5 p-6 bg-white/50 dark:bg-stone-900/40 backdrop-blur-md shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-amber-500" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Atividade</span>
                        </div>
                        <span className="text-[11px] font-bold text-foreground">0 Agendamentos</span>
                    </div>
                    <div className="flex items-end gap-2 h-24 mt-auto">
                        {[0, 0, 0, 0, 0, 0, 0].map((val, i) => {
                            const days = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D']
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                    <div className="w-full rounded-full bg-stone-100 dark:bg-stone-800/50 h-2 relative overflow-hidden">
                                        <div className="absolute bottom-0 left-0 right-0 bg-amber-500/20" style={{ height: '4px' }} />
                                    </div>
                                    <span className="text-[9px] text-muted-foreground font-bold">{days[i]}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* ── Próximos Agendamentos ── */}
                <div className="relative rounded-2xl border border-stone-200/50 dark:border-white/5 p-6 bg-white/50 dark:bg-stone-900/40 backdrop-blur-md shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-amber-500" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Próximos</span>
                        </div>
                        <div className="bg-green-500/10 text-green-600 dark:text-green-400 text-[9px] font-bold px-2 py-0.5 rounded-full border border-green-500/10">
                            HOJE
                        </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col items-center justify-center py-2 text-center">
                        <p className="text-xs text-muted-foreground mb-4">Nenhum agendamento para hoje</p>
                        <div className="w-full flex flex-col gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    if (tenant?.slug) {
                                        navigator.clipboard.writeText(`${window.location.origin}/${tenant.slug}`);
                                        toast.success("Link copiado!");
                                    }
                                }}
                                className="w-full rounded-xl text-[10px] font-bold border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-500/5 transition-all text-amber-600 dark:text-amber-400 h-9"
                            >
                                <Share2 className="h-3 w-3 mr-1.5" /> Copiar Link
                            </Button>
                        </div>
                    </div>
                </div>

                {/* ── Faturamento ── */}
                <div className="relative rounded-2xl border border-stone-200/50 dark:border-white/5 p-6 bg-white/50 dark:bg-stone-900/40 backdrop-blur-md shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-amber-500" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Faturamento</span>
                        </div>
                        <TrendingUp className="h-3.5 w-3.5 text-stone-300" />
                    </div>
                    <div className="mt-auto">
                        <p className="text-3xl font-bold tracking-tighter text-foreground leading-none">R$ 0</p>
                        <p className="text-[11px] text-muted-foreground mt-2 font-medium">Acumulado do mês</p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-stone-100 dark:border-white/5 flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground font-bold">MÊS ANTERIOR</span>
                        <span className="text-[10px] font-bold text-foreground">R$ 0</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function PainelPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        }>
            <PainelContent />
        </Suspense>
    )
}
