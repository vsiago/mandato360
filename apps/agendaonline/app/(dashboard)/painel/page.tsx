"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import {
    CalendarDays, TrendingUp, Users, ArrowRight, CheckSquare,
    ExternalLink, Globe, Eye, DollarSign,
    Clock, BarChart3, CheckCircle2, X, Scissors,
    Loader2, Share2, Info, ChevronRight, Pencil, Plus, MoreVertical,
    Lightbulb, ChevronDown
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
        { label: "WhatsApp conectado", done: !!tenant?.contact?.whatsapp, href: "/configuracoes" },
        { label: "Adicionar serviços", done: serviceCount > 0, href: "/servicos" },
        { label: "Foto de perfil", done: !!tenant?.logoUrl, href: "/configuracoes" },
        { label: "Foto de capa", done: (tenant?.beforeAfter?.length || 0) > 0, href: "/antes-depois" },
        { label: "Sobre você", done: !!tenant?.founder?.imageUrl, href: "/editar-site" },
        { label: "Horário de atendimento", done: !!tenant?.chat?.avatarUrl, href: "/configuracoes" },
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
                        className="bg-white dark:bg-stone-900 rounded-3xl border border-brand-primary/20 p-8 max-w-md w-full text-center shadow-2xl"
                    >
                        <div className="h-20 w-20 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-brand-primary/20">
                            <Clock className="h-10 w-10 text-brand-primary" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4 text-foreground">
                            Periodo de Teste Expirou
                        </h2>
                        <p className="text-muted-foreground mb-8 text-sm">
                            Seus 7 dias gratuitos terminaram. Para continuar gerenciando seu negócio e manter seu site no ar, ative sua assinatura agora.
                        </p>
                        <div className="space-y-3">
                            <Link href="/checkout?plan=profissional" className="block">
                                <Button 
                                    className="w-full text-stone-950 h-14 rounded-xl text-base font-bold shadow-xl shadow-brand-secondary/20 transition-all hover:scale-[1.02] bg-brand-gold"
                                >
                                    Ativar Minha Assinatura
                                </Button>
                            </Link>
                            <Link href="/#pricing" className="block">
                                <Button variant="ghost" className="w-full h-12 text-sm text-muted-foreground hover:text-foreground">
                                    Ver outros planos
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* ── Trial Banner ── */}
            {tenant?.trialStatus && !tenant.trialStatus.isExpired && tenant.plan === "free" && (
                <div className="relative group rounded-2xl overflow-hidden border border-brand-primary/20 bg-brand-primary/5 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-brand-primary/10 rounded-xl flex items-center justify-center border border-brand-primary/20">
                            <Clock className="h-5 w-5 text-brand-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-foreground">Seu período de teste está ativo</p>
                            <p className="text-xs text-muted-foreground">Você tem mais <span className="text-brand-primary font-bold">{tenant.trialStatus.daysLeft} dias</span> de acesso gratuito.</p>
                        </div>
                    </div>
                    <Link href="/checkout?plan=profissional">
                        <Button 
                            size="sm" 
                            className="text-stone-950 rounded-xl px-6 h-10 text-xs font-bold shadow-lg shadow-brand-secondary/20 border-0 transition-all hover:scale-105 bg-brand-gold"
                        >
                            Ativar Assinatura
                        </Button>
                    </Link>
                </div>
            )}

            {/* ── Header ── */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-2">
                <div className="flex-1">
                    <h2 className="text-3xl font-bold text-foreground tracking-tight flex items-center gap-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                        {greeting()}, <span className="text-brand-primary">{displayName}!</span> 👋
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Aqui está o que acontece no seu negócio hoje.
                    </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                    <Link href="/agenda">
                        <Button 
                            className="text-stone-950 rounded-xl px-6 h-12 font-bold shadow-lg shadow-brand-secondary/10 flex items-center gap-2 transition-all hover:scale-105 bg-brand-gold"
                        >
                            <CalendarDays className="h-5 w-5" /> Abrir Agenda <ChevronRight className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href={`/${tenant?.slug || ""}`} target="_blank">
                        <Button variant="outline" className="border-stone-800 bg-transparent hover:bg-stone-900 text-white rounded-xl px-6 h-12 font-bold flex items-center gap-2">
                            <ExternalLink className="h-5 w-5" /> Ver Meu Site
                        </Button>
                    </Link>

                </div>
            </div>

            {/* ── Quick Actions ── */}
            <div className="space-y-4">
                <h3 className="text-[10px] font-bold text-stone-500 uppercase tracking-widest px-1">AÇÕES RÁPIDAS</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { href: "/agenda?action=new", icon: CalendarDays, title: "Novo Agendamento", desc: "Criar um novo horário" },
                        { href: "/servicos", icon: Scissors, title: "Gerenciar Serviços", desc: "Adicionar ou editar serviços" },
                        { href: "/editar-site", icon: Pencil, title: "Editar Site", desc: "Personalize seu site público" },
                        { href: "#", icon: Share2, title: "Compartilhar Link", desc: "Compartilhe seu site", action: () => {
                            if (tenant?.slug) {
                                navigator.clipboard.writeText(`${window.location.origin}/${tenant.slug}`);
                                toast.success("Link copiado!");
                            }
                        }},
                    ].map((item, i) => (
                        <div 
                            key={i} 
                            onClick={() => item.action ? item.action() : null}
                            className="group cursor-pointer bg-stone-900/40 hover:bg-stone-900/60 border border-white/5 p-4 rounded-2xl flex items-center gap-4 transition-all"
                        >
                            <div 
                                className="h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 bg-stone-900/50 group-hover:border-brand-primary/30 transition-colors"
                            >
                                <item.icon className="h-6 w-6 text-stone-500 group-hover:text-brand-primary transition-colors" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-foreground group-hover:text-brand-primary transition-colors">{item.title}</h4>
                                <p className="text-[10px] text-muted-foreground truncate">{item.desc}</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-stone-700 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Setup Checklist (Refined Horizontal Style) ── */}
            {showChecklist && (
                <div className="bg-stone-900/60 border border-white/5 rounded-2xl p-6 lg:p-8 flex flex-col lg:flex-row items-center gap-6 lg:gap-12 relative overflow-hidden">
                    
                    {/* Left Section: Progress & Info */}
                    <div className="flex items-center gap-6 pr-8 lg:border-r border-white/5 shrink-0">
                        <div className="relative h-20 w-20 flex items-center justify-center shrink-0">
                            <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="16" fill="none" className="stroke-stone-800" strokeWidth="3" />
                                <circle 
                                    cx="18" cy="18" r="16" fill="none" 
                                    className="stroke-brand-primary transition-all duration-1000" 
                                    strokeWidth="3" 
                                    strokeDasharray={`${progress}, 100`} 
                                    strokeLinecap="round" 
                                />
                            </svg>
                            <span className="absolute text-lg font-bold text-foreground">{progress}%</span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold text-foreground tracking-tight">Configuração da Agenda</h3>
                            <p className="text-[13px] text-muted-foreground">
                                {completedCount} de {checklistItems.length} etapas concluídas
                            </p>
                            <p className="text-[11px] text-stone-500 max-w-[200px]">Complete as etapas e destaque seu negócio.</p>
                        </div>
                    </div>

                    {/* Middle Section: Stepper */}
                    <div className="flex-1 w-full lg:w-auto">
                        <div className="relative flex justify-between items-start w-full px-4">
                            {/* Connector Line */}
                            <div className="absolute top-3.5 left-8 right-8 h-[1px] bg-stone-800 z-0" />
                            
                            {checklistItems.map((item, i) => {
                                const isActive = !item.done && (i === 0 || checklistItems[i-1].done)
                                return (
                                    <div key={i} className="relative z-10 flex flex-col items-center gap-4 w-16">
                                        <div className={cn(
                                            "h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all border-2",
                                            item.done 
                                                ? "bg-green-500/80 border-green-500/20 text-stone-950" 
                                                : isActive 
                                                    ? "bg-brand-primary border-brand-primary text-stone-950 shadow-lg shadow-brand-secondary/40 scale-110" 
                                                    : "bg-stone-900 border-stone-800 text-stone-500"
                                        )}>
                                            {item.done ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
                                        </div>
                                        <span className={cn(
                                            "text-[10px] text-center font-medium leading-tight whitespace-pre-line",
                                            item.done ? "text-green-500/60" : isActive ? "text-brand-primary font-bold" : "text-stone-500"
                                        )}>
                                            {item.label.replace(" ", "\n")}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Right Section: Action Button */}
                    <div className="shrink-0">
                        <Link href="/configuracoes">
                            <Button 
                                className="text-stone-950 rounded-xl px-8 h-14 font-bold shadow-xl shadow-brand-secondary/10 transition-all hover:scale-[1.02] bg-brand-gold"
                            >
                                Continuar configuração
                            </Button>
                        </Link>
                    </div>
                </div>
            )}

            {/* ── Main Content Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch pb-4">
                
                {/* ── Left Column: Agendamentos ── */}
                <div className="lg:col-span-5 bg-stone-900/40 border border-white/5 rounded-2xl overflow-hidden flex flex-col h-full">
                    <div className="p-6 flex items-center justify-between border-b border-white/5">
                        <div className="flex items-center gap-2">
                            <CalendarDays className="h-5 w-5 text-brand-primary" />
                            <h3 className="font-bold text-foreground">Próximos agendamentos</h3>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-stone-900 border border-stone-800 rounded-xl cursor-pointer">
                            <span className="text-[10px] font-bold text-foreground">Hoje</span>
                            <ChevronDown className="h-3 w-3 text-muted-foreground" />
                        </div>
                    </div>

                    <div className="p-6 space-y-3">
                        {[
                            { time: "10:00", name: "João Silva", service: "Corte de Cabelo", status: "Confirmado", initials: "JS" },
                            { time: "14:30", name: "Ana Martins", service: "Coloração", status: "Confirmado", initials: "AM" },
                            { time: "16:00", name: "Carlos Pereira", service: "Barba", status: "Confirmado", initials: "CP" },
                        ].map((apt, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-stone-900/20 border border-white/5 border-l-2 border-l-brand-primary hover:bg-white/5 transition-all group">
                                <div className="text-center w-12 shrink-0">
                                    <p className="text-sm font-bold text-stone-400 group-hover:text-brand-primary transition-colors">{apt.time}</p>
                                    <p className="text-[9px] text-stone-500 uppercase font-bold tracking-wider mt-0.5">Hoje</p>
                                </div>
                                <div className="flex-1 flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-[10px] font-bold text-stone-400">
                                        {apt.initials}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-foreground truncate">{apt.name}</p>
                                        <p className="text-[10px] text-muted-foreground truncate">{apt.service}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="bg-stone-900/50 text-green-500/80 text-[9px] font-bold px-2.5 py-1 rounded-full border border-green-500/20 uppercase tracking-wider transition-colors group-hover:border-green-500/40">
                                        Confirmado
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-600 hover:text-foreground">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-6 pt-0 mt-auto">
                        <Link href="/agenda">
                            <Button variant="outline" className="w-full border-stone-800 hover:bg-stone-900 rounded-2xl h-12 text-xs font-bold text-brand-primary flex items-center justify-center gap-2">
                                <CalendarDays className="h-4 w-4" /> Ver agenda completa <ChevronRight className="h-3 w-3" />
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* ── Right Column: Metrics Grid & Tip Card ── */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Metrics Grid (2 columns) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { title: "Faturamento do mês", value: "R$ 0,00", sub: "0% em relação ao mês anterior", icon: DollarSign, chart: true },
                            { title: "Clientes", value: "0", sub: "Total de clientes cadastrados", icon: Users },
                            { title: "Serviços ativos", value: String(serviceCount), sub: "Serviços cadastrados", icon: Scissors },
                            { title: "Agendamentos hoje", value: "0", sub: "Total de agendamentos", icon: CalendarDays },
                        ].map((m, i) => (
                            <div key={i} className="group cursor-pointer bg-stone-900/40 border border-white/5 p-6 rounded-2xl hover:bg-stone-900/60 transition-all relative overflow-hidden flex flex-col justify-between min-h-[160px]">
                                <div className="flex items-start justify-between">
                                    <div className="h-10 w-10 rounded-xl bg-stone-900 border border-white/5 flex items-center justify-center group-hover:border-brand-primary/30 transition-colors">
                                        <m.icon className="h-5 w-5 text-stone-500 group-hover:text-brand-primary transition-colors" />
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-stone-700 group-hover:text-brand-primary transition-all" />
                                </div>
                                
                                <div>
                                    <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">{m.title}</p>
                                    <p className="text-2xl font-bold text-foreground tracking-tight mt-1">{m.value}</p>
                                    <p className="text-[10px] text-muted-foreground mt-1">{m.sub}</p>
                                </div>

                                {m.chart && (
                                    <div className="absolute bottom-6 right-6 opacity-20 group-hover:opacity-60 transition-opacity">
                                        <TrendingUp className="h-10 w-10 text-brand-primary" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Tip Card (Full width horizontal) */}
                    <div className="bg-stone-900/40 border border-white/5 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-full bg-stone-900 border border-white/5 flex items-center justify-center shrink-0">
                                <Lightbulb className="h-7 w-7 text-stone-500" />
                            </div>
                            <div className="max-w-[400px]">
                                <h4 className="text-sm font-bold text-foreground mb-1">Dica para você</h4>
                                <p className="text-[11px] text-muted-foreground leading-relaxed">
                                    Complete seu perfil com foto e descrição para transmitir mais confiança aos seus clientes.
                                </p>
                            </div>
                        </div>
                        <Link href="/configuracoes">
                            <Button variant="outline" className="border-stone-800 hover:bg-stone-900 text-brand-primary text-[11px] font-bold h-11 px-6 rounded-xl transition-all whitespace-nowrap">
                                Ir para perfil
                            </Button>
                        </Link>
                    </div>

                </div>
            </div>

            {/* Footer */}
            <div className="pt-0 text-center pb-6">
                <p className="text-[9px] text-stone-600 font-medium uppercase tracking-[0.2em]">
                    © 2024 AgendaOnline. Todos os direitos reservados.
                </p>
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
