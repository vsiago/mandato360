"use client"

import { useState, useEffect, Suspense, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import {
    CalendarDays, TrendingUp, Users, ArrowRight, CheckSquare,
    ExternalLink, Globe, Eye, DollarSign,
    Clock, BarChart3, CheckCircle2, X, Scissors,
    Loader2, Share2, Info, ChevronRight, Pencil, Plus, MoreVertical,
    Lightbulb, ChevronDown, Scale, Briefcase
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { getMyTenant } from "@/lib/tenant-api"
import { getAppointmentsByTenantAction } from "@/lib/actions/appointments"
import { getServicesAction } from "@/lib/actions/services"
import type { TenantData } from "@/lib/tenant-types"

let globalCache = {
    tenant: null as TenantData | null,
    services: [] as any[],
    appointments: [] as any[],
    isLoaded: false
};

function PainelContent() {
    const [tenant, setTenant] = useState<TenantData | null>(globalCache.tenant)
    const [loading, setLoading] = useState(!globalCache.isLoaded)
    const [loadingAgenda, setLoadingAgenda] = useState(true)
    const [showChecklist, setShowChecklist] = useState(true)
    const [agendaFilter, setAgendaFilter] = useState("Hoje")
    const [appointments, setAppointments] = useState<any[]>(globalCache.appointments)
    const [services, setServices] = useState<any[]>(globalCache.services)
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
        let isMounted = true;
        
        getMyTenant().then(async data => {
            if (!isMounted) return;
            setTenant(data)
            globalCache.tenant = data
            
            const dismissed = localStorage.getItem("agenda_checklist_dismissed_v2")
            if (dismissed === "true") setShowChecklist(false)
            
            if (data?.id) {
                // Fetch services in background
                getServicesAction(data.id).then(svcRes => {
                    if (isMounted && svcRes.success && svcRes.services) {
                        setServices(svcRes.services)
                        globalCache.services = svcRes.services
                    }
                })
                
                // Stop overall loading immediately since we have tenant info
                setLoading(false)
                globalCache.isLoaded = true
                
                // Fetch appointments
                getAppointmentsByTenantAction(data.id).then(aptRes => {
                    if (isMounted && aptRes.success && aptRes.appointments) {
                        setAppointments(aptRes.appointments)
                        globalCache.appointments = aptRes.appointments
                    }
                    if (isMounted) setLoadingAgenda(false)
                }).catch(() => {
                    if (isMounted) setLoadingAgenda(false)
                })
            } else {
                setLoading(false)
                setLoadingAgenda(false)
                globalCache.isLoaded = true
            }
        }).catch(() => {
            if (isMounted) {
                setLoading(false)
                setLoadingAgenda(false)
            }
        })
        
        return () => { isMounted = false; }
    }, [])

    const filteredAppointments = useMemo(() => {
        if (!appointments.length) return [];
        
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Format to YYYY-MM-DD using local time
        const pad = (n: number) => n.toString().padStart(2, '0');
        const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
        const tomorrowStr = `${tomorrow.getFullYear()}-${pad(tomorrow.getMonth() + 1)}-${pad(tomorrow.getDate())}`;
        
        const next7Days = new Date(today);
        next7Days.setDate(next7Days.getDate() + 7);
        const next7Str = `${next7Days.getFullYear()}-${pad(next7Days.getMonth() + 1)}-${pad(next7Days.getDate())}`;

        let filtered = appointments;

        if (agendaFilter === "Hoje") {
            filtered = appointments.filter(a => a.date === todayStr);
        } else if (agendaFilter === "Amanhã") {
            filtered = appointments.filter(a => a.date === tomorrowStr);
        } else if (agendaFilter === "Próximos 7 dias") {
            filtered = appointments.filter(a => a.date >= todayStr && a.date <= next7Str);
        }
        
        // Sort by date and time
        return filtered.sort((a, b) => {
            if (a.date !== b.date) return a.date.localeCompare(b.date);
            return a.time.localeCompare(b.time);
        }).slice(0, 5); // Limit to top 5 on dashboard
    }, [appointments, agendaFilter]);

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
    const isAdvocacia = tenant?.segmento === "advocacia"

    const faturamentoHoje = useMemo(() => {
        const today = new Date();
        const pad = (n: number) => n.toString().padStart(2, '0');
        const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
        
        let total = 0;
        appointments.forEach(apt => {
            if (apt.date === todayStr && (apt.status === 'completed' || apt.status === 'confirmed')) {
                let price = 0;
                if (apt.notes?.startsWith('{')) {
                    try {
                        const data = JSON.parse(apt.notes);
                        if (data.financeiro?.valor) price = Number(data.financeiro.valor);
                    } catch(e) {}
                }
                if (price === 0 && apt.serviceId) {
                    const srv = services.find(s => s.id === apt.serviceId);
                    if (srv && srv.price) price = Number(srv.price);
                }
                total += price;
            }
        });
        return total;
    }, [appointments, services]);

    const checklistItems = [
        { label: "Site publicado", done: !!tenant?.slug, href: `/${tenant?.slug}` },
        { label: "WhatsApp conectado", done: !!tenant?.contact?.whatsapp, href: "/configuracoes?tab=business" },
        { label: "Serviços iniciais", done: serviceCount > 0, href: "/servicos" },
        { label: "Identidade Visual", done: !!tenant?.logoUrl, href: "/configuracoes?tab=brand" },
        { label: "Sobre você", done: !!tenant?.founder?.imageUrl, href: "/configuracoes?tab=profile" },
        { label: "Chave PIX", done: !!tenant?.pix?.key, href: "/configuracoes?tab=finance" },
    ]

    const completedCount = checklistItems.filter(i => i.done).length
    const allDone = completedCount === checklistItems.length
    const progress = Math.round(completedCount / checklistItems.length * 100)

    const handleDismissChecklist = () => {
        localStorage.setItem("agenda_checklist_dismissed_v2", "true")
        setShowChecklist(false)
    }

    // Skeleton Components
    const HeaderSkeleton = () => (
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6 mb-4 lg:mb-6 lg:px-0">
            <div className="flex-1 space-y-2">
                <Skeleton className="h-10 w-64 rounded-xl" />
                <Skeleton className="h-4 w-48 rounded-lg" />
            </div>
            <Skeleton className="w-full lg:w-48 h-12 rounded-xl" />
        </div>
    )

    const ChecklistSkeleton = () => (
        <div className="lg:mx-0 bg-white/60 dark:bg-stone-900/40 backdrop-blur-md border border-stone-200 dark:border-white/[0.03] rounded-2xl p-6 lg:p-8 flex flex-col lg:flex-row items-center gap-6 lg:gap-12 mb-6 lg:mb-8 shadow-xl">
            <div className="flex items-center gap-6 w-full lg:w-auto">
                <Skeleton className="h-16 w-16 lg:h-20 lg:w-20 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-32 rounded-lg" />
                    <Skeleton className="h-4 w-48 rounded-lg" />
                </div>
            </div>
            <div className="flex-1 w-full flex gap-4 lg:gap-8 overflow-hidden">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex flex-col items-center gap-3 shrink-0">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-2 w-12 rounded-lg" />
                    </div>
                ))}
            </div>
            <Skeleton className="w-full lg:w-32 h-12 lg:h-14 rounded-2xl" />
        </div>
    )

    const AgendaSkeleton = () => (
        <div className="lg:col-span-5 bg-white/60 dark:bg-stone-900/40 backdrop-blur-md border border-stone-200 dark:border-white/[0.03] rounded-2xl overflow-hidden flex flex-col h-full shadow-xl">
            <div className="p-5 lg:p-6 flex items-center justify-between border-b border-stone-100 dark:border-white/[0.03]">
                <div className="flex items-center gap-2.5">
                    <Skeleton className="h-8 w-8 rounded-xl" />
                    <Skeleton className="h-5 w-24 rounded-lg" />
                </div>
                <Skeleton className="h-8 w-24 rounded-xl" />
            </div>
            <div className="p-5 lg:p-6 space-y-3">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-[1.25rem] border border-stone-200/50 dark:border-white/[0.03]">
                        <div className="space-y-1 w-10">
                            <Skeleton className="h-4 w-full rounded" />
                            <Skeleton className="h-2 w-full rounded" />
                        </div>
                        <div className="flex-1 flex items-center justify-between">
                            <Skeleton className="h-4 w-32 rounded" />
                            <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-5 lg:p-6 pt-0 mt-auto">
                <Skeleton className="w-full h-11 rounded-xl" />
            </div>
        </div>
    )

    const MetricsSkeleton = () => (
        <div className="lg:col-span-7 space-y-4 lg:space-y-6">
            <div className="grid grid-cols-2 gap-3 lg:gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white/60 dark:bg-stone-900/40 backdrop-blur-md border border-stone-200 dark:border-white/[0.03] p-4 lg:p-6 rounded-2xl h-[120px] lg:h-[170px] flex flex-col justify-between shadow-lg">
                        <Skeleton className="h-11 w-11 rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-2 w-12 rounded" />
                            <Skeleton className="h-6 w-24 rounded" />
                            <Skeleton className="h-2 w-16 rounded" />
                        </div>
                    </div>
                ))}
            </div>
            <div className="bg-white/60 dark:bg-stone-900/40 backdrop-blur-md border border-stone-200 dark:border-white/[0.03] p-5 lg:p-6 rounded-2xl flex items-center gap-4 shadow-lg">
                <Skeleton className="h-14 w-14 rounded-2xl shrink-0" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32 rounded" />
                    <Skeleton className="h-3 w-64 rounded" />
                </div>
                <Skeleton className="h-10 w-32 rounded-xl" />
            </div>
        </div>
    )

    return (
        <div className="flex-1 flex flex-col space-y-4 lg:space-y-6 animate-in fade-in duration-500 relative">
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
                                    className="w-full text-white h-14 rounded-xl text-base font-bold shadow-xl shadow-brand-secondary/20 transition-all hover:scale-[1.02] bg-brand-gold"
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
                <div className="lg:mx-0 relative group rounded-2xl overflow-hidden border border-brand-primary/20 bg-brand-primary/5 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 mb-2">
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
                            className="text-white rounded-xl px-6 h-10 text-xs font-bold shadow-lg shadow-brand-secondary/20 border-0 transition-all hover:scale-105 bg-brand-gold"
                        >
                            Ativar Assinatura
                        </Button>
                    </Link>
                </div>
            )}

            {/* ── Header ── */}
            {loading ? <HeaderSkeleton /> : (
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6 mb-4 lg:mb-6 lg:px-0">
                    <div className="flex-1">
                        <h2 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight flex items-center gap-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                            {greeting()}, <span className="text-brand-primary">{displayName}!</span> 👋
                        </h2>
                        <p className="text-xs lg:text-sm text-muted-foreground mt-0.5 lg:mt-1 font-medium">
                            Aqui está o que acontece no seu negócio hoje.
                        </p>
                    </div>
                    
                    <div className="flex flex-row w-full lg:w-auto items-center gap-2 lg:gap-3 mt-1 lg:mt-0">
                        <Button 
                            onClick={() => {
                                if (tenant?.slug) {
                                    navigator.clipboard.writeText(`${window.location.origin}/${tenant.slug}`);
                                    toast.success("Link copiado! Envie para seus clientes.");
                                }
                            }}
                            variant="outline"
                            className="flex-1 lg:flex-none text-brand-primary border-brand-primary/20 bg-brand-primary/5 hover:bg-brand-primary/10 rounded-xl px-4 lg:px-8 h-10 lg:h-12 font-bold flex items-center justify-center gap-2 transition-all text-[11px] lg:text-sm shadow-sm"
                        >
                            <Share2 className="h-4 w-4 lg:h-5 lg:w-5" /> Link de Agendamento
                        </Button>
                    </div>
                </div>
            )}

            {/* ── Onboarding / Evolution (Moved Up) ── */}
            {loading ? <ChecklistSkeleton /> : showChecklist && !allDone && (
                <div className="lg:mx-0 bg-white/60 dark:bg-stone-900/40 backdrop-blur-md border border-stone-200 dark:border-white/[0.03] rounded-2xl p-6 lg:p-8 flex flex-col lg:flex-row items-center gap-6 lg:gap-12 relative overflow-hidden shadow-xl transition-colors mb-6 lg:mb-8">
                    <div className="absolute top-0 right-0 p-4">
                        <button onClick={handleDismissChecklist} className="h-8 w-8 rounded-full bg-stone-100 dark:bg-white/5 flex items-center justify-center text-stone-400 dark:text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
 
                    <div className="flex items-center gap-6 w-full lg:w-auto">
                        <div className="relative h-16 w-16 lg:h-20 lg:w-20 flex items-center justify-center shrink-0">
                            <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="16" fill="none" className="stroke-stone-100 dark:stroke-white/[0.03]" strokeWidth="3.5" />
                                <circle 
                                    cx="18" cy="18" r="16" fill="none" 
                                    className="stroke-brand-primary transition-all duration-1000 shadow-[0_0_15px_rgba(var(--brand-primary-rgb),0.3)]" 
                                    strokeWidth="3.5" 
                                    strokeDasharray={`${progress}, 100`} 
                                    strokeLinecap="round" 
                                />
                            </svg>
                            <span className="absolute text-sm lg:text-lg font-black text-stone-900 dark:text-foreground">{progress}%</span>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-base lg:text-xl font-black text-foreground tracking-tight">Evolução do Negócio</h3>
                            <p className="text-[11px] lg:text-[13px] text-muted-foreground font-medium mt-0.5">
                                {completedCount} de {checklistItems.length} etapas concluídas
                            </p>
                        </div>
                    </div>

                    <div className="flex-1 w-full overflow-x-auto hide-scrollbar lg:mx-0 lg:px-0 snap-x scroll-pl-6">
                        <div className="flex justify-between items-start gap-8 lg:gap-4 w-max lg:w-full pb-2">
                            {checklistItems.map((item, i) => {
                                const isActive = !item.done && (i === 0 || checklistItems[i-1].done)
                                return (
                                    <div key={i} className="flex flex-col items-center gap-3 w-16 lg:w-20 shrink-0 snap-start">
                                        <div className={cn(
                                            "h-7 w-7 lg:h-8 lg:w-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all border-2",
                                            item.done 
                                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
                                                : isActive 
                                                    ? "bg-brand-primary border-brand-primary text-white shadow-xl scale-110" 
                                                    : "bg-stone-100 dark:bg-white/5 border-stone-200 dark:border-white/[0.03] text-stone-400 dark:text-stone-600"
                                        )}>
                                            {item.done ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
                                        </div>
                                        <span className={cn(
                                            "text-[8px] lg:text-[9px] text-center font-black leading-tight whitespace-pre-line uppercase tracking-wider",
                                            item.done ? "text-emerald-500/60" : isActive ? "text-brand-primary" : "text-stone-400 dark:text-stone-600"
                                        )}>
                                            {item.label.split(" ").join("\n")}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <Link href="/configuracoes" className="w-full lg:w-auto">
                        <Button className="w-full lg:w-auto text-white rounded-2xl px-8 h-12 lg:h-14 text-xs font-black uppercase tracking-widest shadow-xl bg-brand-gold hover:scale-[1.02] transition-transform">
                            Avançar
                        </Button>
                    </Link>
                </div>
            )}


            {/* ── Main Content Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* ── Left Column: Agendamentos ── */}
                {loadingAgenda ? <AgendaSkeleton /> : (
                    <div className="lg:col-span-5 bg-white/60 dark:bg-stone-900/40 backdrop-blur-md border border-stone-200 dark:border-white/[0.03] rounded-2xl overflow-hidden flex flex-col h-full lg:mx-0 shadow-xl dark:shadow-2xl transition-colors">
                        <div className="p-5 lg:p-6 flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 dark:border-white/[0.03] bg-stone-50/30 dark:bg-white/[0.01]">
                            <div className="flex items-center gap-2.5">
                                <div className="h-8 w-8 rounded-xl bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20">
                                    <CalendarDays className="h-4 w-4 text-brand-primary" />
                                </div>
                                <h3 className="text-sm lg:text-base font-bold text-foreground tracking-tight">Agenda</h3>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-stone-900/50 border border-stone-200 dark:border-white/5 rounded-xl cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors shadow-xs">
                                        <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">{agendaFilter}</span>
                                        <ChevronDown className="h-3 w-3 text-stone-400 dark:text-stone-600" />
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40 bg-white dark:bg-stone-950 border-stone-200 dark:border-white/10 shadow-2xl rounded-xl">
                                    <DropdownMenuItem onClick={() => setAgendaFilter("Hoje")} className="text-xs font-medium cursor-pointer text-stone-600 dark:text-stone-300 focus:bg-stone-100 dark:focus:bg-white/5 rounded-lg">Hoje</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setAgendaFilter("Amanhã")} className="text-xs font-medium cursor-pointer text-stone-600 dark:text-stone-300 focus:bg-stone-100 dark:focus:bg-white/5 rounded-lg">Amanhã</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setAgendaFilter("Próximos 7 dias")} className="text-xs font-medium cursor-pointer text-stone-600 dark:text-stone-300 focus:bg-stone-100 dark:focus:bg-white/5 rounded-lg">Próximos 7 dias</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="p-5 lg:p-6 space-y-3">
                            {filteredAppointments.length > 0 ? filteredAppointments.map((apt, i) => {
                                const customerName = apt.customerName || "Cliente";
                                const initials = customerName.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();

                                let dateLabel = "Hoje";
                                const pad = (n: number) => n.toString().padStart(2, '0');
                                const today = new Date();
                                const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
                                const tomorrow = new Date();
                                tomorrow.setDate(tomorrow.getDate() + 1);
                                const tomorrowStr = `${tomorrow.getFullYear()}-${pad(tomorrow.getMonth() + 1)}-${pad(tomorrow.getDate())}`;

                                if (apt.date === todayStr) dateLabel = "Hoje";
                                else if (apt.date === tomorrowStr) dateLabel = "Amanhã";
                                else {
                                    const [y, m, d] = apt.date.split("-");
                                    dateLabel = `${d}/${m}`;
                                }

                                return (
                                    <div key={apt.id} className="flex items-center gap-4 p-4 rounded-[1.25rem] bg-stone-50/50 dark:bg-white/[0.02] border border-stone-200/50 dark:border-white/[0.03] hover:bg-white/80 dark:hover:bg-white/[0.05] transition-all group relative overflow-hidden shadow-xs hover:shadow-md">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-primary/40" />
                                        <div className="text-center w-10 shrink-0">
                                            <p className="text-xs font-black text-stone-600 dark:text-stone-300 group-hover:text-brand-primary transition-colors">{apt.time}</p>
                                            <p className="uppercase font-black tracking-widest mt-0.5 text-[8px] text-stone-400 dark:text-stone-500">{dateLabel}</p>
                                        </div>
                                        <div className="flex-1 flex items-center justify-between min-w-0">
                                            <p className="font-bold text-stone-800 dark:text-foreground truncate text-sm">{customerName}</p>
                                            <div className="h-8 w-8 rounded-full border border-stone-200 dark:border-white/5 flex items-center justify-center text-[10px] font-black shrink-0 transition-colors bg-white dark:bg-stone-900 text-stone-400 dark:text-stone-500 shadow-xs">
                                                {initials}
                                            </div>
                                        </div>
                                    </div>
                                )
                            }) : (
                                <div className="text-center p-6 border border-dashed border-stone-300 dark:border-white/5 rounded-[1.25rem] bg-stone-50/30 dark:bg-white/[0.01]">
                                    <p className="text-xs text-stone-400 dark:text-stone-500 font-medium italic">Nenhum agendamento pendente.</p>
                                </div>
                            )}
                        </div>

                        <div className="p-5 lg:p-6 pt-0 mt-auto">
                            <Link href="/agenda">
                                <Button variant="ghost" className="w-full bg-white dark:bg-white/[0.03] hover:bg-stone-50 dark:hover:bg-white/[0.06] rounded-xl h-11 text-xs font-bold text-brand-primary border border-brand-primary/20 shadow-sm">
                                    Ver agenda completa
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}

                {/* ── Right Column: Metrics Grid & Tip Card ── */}
                {loading ? <MetricsSkeleton /> : (
                    <div className="lg:col-span-7 space-y-4 lg:space-y-6 lg:px-0">
                        <div className="grid grid-cols-2 gap-3 lg:gap-4">
                            {[
                                { title: "Faturamento", value: `R$ ${faturamentoHoje.toFixed(2).replace('.', ',')}`, sub: "Hoje", icon: DollarSign, accent: "bg-emerald-500/10 text-emerald-500" },
                                { title: "Clientes", value: String(new Set(appointments.map(a => a.customerName)).size), sub: "Total", icon: Users, accent: "bg-blue-500/10 text-blue-500" },
                                { title: isAdvocacia ? "Áreas" : "Serviços", value: String(serviceCount), sub: "Catálogo", icon: isAdvocacia ? Scale : Scissors, accent: "bg-amber-500/10 text-amber-500" },
                                { title: "Hoje", value: String(appointments.filter(a => {
                                    const today = new Date();
                                    const pad = (n: number) => n.toString().padStart(2, '0');
                                    const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
                                    return a.date === todayStr;
                                }).length), sub: "Agendados", icon: CalendarDays, accent: "bg-brand-primary/10 text-brand-primary" },
                            ].map((m, i) => (
                                <div key={i} className="group cursor-pointer bg-white/60 dark:bg-stone-900/40 backdrop-blur-md border border-stone-200 dark:border-white/[0.03] p-4 lg:p-6 rounded-2xl hover:bg-white dark:hover:bg-white/[0.04] transition-all relative overflow-hidden flex flex-col justify-between min-h-[120px] lg:min-h-[170px] shadow-lg hover:shadow-xl transition-all duration-300">
                                    <div className="flex items-start justify-between">
                                        <div className={cn("h-9 w-9 lg:h-11 lg:w-11 rounded-xl flex items-center justify-center border border-stone-100 dark:border-white/5 shadow-inner transition-colors", m.accent)}>
                                            <m.icon className="h-4 w-4 lg:h-5 lg:w-5" />
                                        </div>
                                        <div className="h-6 w-6 rounded-lg bg-stone-100 dark:bg-white/[0.03] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ChevronRight className="h-3.5 w-3.5 text-stone-400 dark:text-stone-500" />
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4">
                                        <p className="text-[9px] lg:text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.15em]">{m.title}</p>
                                        <p className="text-lg lg:text-2xl font-black text-stone-900 dark:text-foreground tracking-tight mt-0.5">{m.value}</p>
                                        <p className="text-[9px] text-stone-500 dark:text-muted-foreground mt-0.5 font-medium">{m.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white/60 dark:bg-stone-900/40 backdrop-blur-md border border-stone-200 dark:border-white/[0.03] p-5 lg:p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-5 shadow-lg">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 lg:h-14 lg:w-14 rounded-2xl bg-brand-primary/5 border border-brand-primary/10 flex items-center justify-center shrink-0">
                                    <Lightbulb className="h-6 w-6 lg:h-7 lg:w-7 text-brand-primary" />
                                </div>
                                <div className="max-w-[360px]">
                                    <h4 className="text-sm font-bold text-stone-900 dark:text-foreground mb-1">Insights Premium</h4>
                                    <p className="text-[10px] lg:text-[11px] text-stone-500 dark:text-muted-foreground leading-relaxed font-medium">
                                        {isAdvocacia 
                                            ? "Destaque suas especialidades para atrair clientes qualificados."
                                            : "Adicione fotos reais do seu trabalho para converter mais visitantes."
                                        }
                                    </p>
                                </div>
                            </div>
                            <Link href="/configuracoes" className="w-full sm:w-auto">
                                <Button variant="outline" className="w-full sm:w-auto border-stone-200 dark:border-white/5 bg-white dark:bg-white/[0.02] hover:bg-stone-50 dark:hover:bg-white/[0.05] text-stone-600 dark:text-stone-300 text-[10px] font-bold h-10 px-6 rounded-xl transition-all shadow-sm">
                                    Perfil Completo
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="pt-4 text-center pb-8 opacity-40">
                <p className="text-[8px] text-stone-500 font-black uppercase tracking-[0.3em]">
                    © 2024 AgendaOnline • Inteligência em Gestão
                </p>
            </div>

            {/* ── Floating Action Button (FAB) ── */}
            <Link href="/agenda?action=new">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="fixed bottom-24 lg:bottom-8 right-6 lg:right-8 h-14 w-14 lg:h-16 lg:w-16 rounded-full bg-brand-primary text-white shadow-2xl flex items-center justify-center z-50 hover:bg-brand-gold transition-colors"
                >
                    <Plus className="h-8 w-8" />
                </motion.button>
            </Link>
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
