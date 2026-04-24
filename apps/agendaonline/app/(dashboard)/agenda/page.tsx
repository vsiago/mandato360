"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import {
    CalendarDays, TrendingUp, Users, ArrowRight,
    ExternalLink, Globe, Eye, DollarSign,
    Clock, BarChart3, CheckCircle2, XCircle, AlertCircle, X, Scissors,
    Loader2, Share2, Info, Plus, CalendarIcon, ChevronLeft, ChevronRight,
    MapPin, Phone, MessageCircle, MoreVertical, CreditCard, Filter, UserPlus
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { AddAppointmentModal } from "@/components/AddAppointmentModal"
import { getServicesAction } from "@/lib/actions/services"
import { getMyTenant } from "@/lib/tenant-api"
import { 
    updateAppointmentStatusAction, 
    getAppointmentsByTenantAction, 
    createPublicAppointmentAction, 
    deleteAppointmentAction 
} from "@/lib/actions/appointments"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

/* ─── Static Constants ─── */

const MONTH_NAMES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
const WEEKDAYS = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"]

const STATUS_MAP = {
    confirmed: { label: "Confirmado", icon: CheckCircle2, className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
    pending: { label: "Pendente", icon: AlertCircle, className: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400" },
    cancelled: { label: "Cancelado", icon: XCircle, className: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400" },
    blocked: { label: "Bloqueado", icon: XCircle, className: "bg-stone-100 text-stone-500 dark:bg-stone-900 dark:text-stone-500 border-dashed border-stone-300 dark:border-stone-800" },
}

const TIME_SLOTS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"]

/* ─── Page ─── */

export default function AgendaPage() {
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
    const [appointments, setAppointments] = useState<Record<string, any[]>>({})
    const [services, setServices] = useState<any[]>([])
    const [tenantId, setTenantId] = useState<string | null>(null)
    const [isIdling, setIsIdling] = useState(true)
    const [isLoadingAppointments, setIsLoadingAppointments] = useState(false)

    // Modal state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [activeTime, setActiveTime] = useState("")
    const [selectedAptDetails, setSelectedAptDetails] = useState<any | null>(null)

    const financeCardRef = useRef<HTMLDivElement>(null)
    const [shimmerKey, setShimmerKey] = useState(0)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShimmerKey(prev => prev + 1)
                }
            },
            { threshold: 0.2 }
        )
        if (financeCardRef.current) observer.observe(financeCardRef.current)
        return () => observer.disconnect()
    }, [])

    const fetchAppointments = async (tId: string) => {
        setIsLoadingAppointments(true)
        const res = await getAppointmentsByTenantAction(tId)
        if (res.success && res.appointments) {
            // Group appointments by date key 'YYYY-MM-DD'
            const grouped: Record<string, any[]> = {}
            res.appointments.forEach((apt: any) => {
                const dateKey = apt.date
                if (!grouped[dateKey]) grouped[dateKey] = []
                
                grouped[dateKey].push({
                    id: apt.id,
                    time: apt.time,
                    name: apt.customerName || "Cliente",
                    phone: apt.customerPhone || "",
                    service: services.find(s => s.id === apt.serviceId)?.name || (apt.status === "blocked" ? "-" : "Serviço"),
                    status: apt.status as "pending" | "confirmed" | "cancelled" | "blocked",
                    price: services.find(s => s.id === apt.serviceId)?.price 
                        ? `R$ ${parseFloat(services.find(s => s.id === apt.serviceId).price).toFixed(0)}` 
                        : (apt.status === "blocked" ? "-" : "R$ 0")
                })
            })
            setAppointments(grouped)
        }
        setIsLoadingAppointments(false)
    }

    useEffect(() => {
        async function loadInitialData() {
            try {
                const tenant = await getMyTenant()
                if (tenant?.id) {
                    setTenantId(tenant.id)
                    const svcResult = await getServicesAction(tenant.id)
                    if (svcResult.success) {
                        setServices(svcResult.services || [])
                    }
                }
            } catch (err) {
                console.error("Failed to load tenant/services:", err)
            } finally {
                setIsIdling(false)
            }
        }
        loadInitialData()
    }, [])

    useEffect(() => {
        if (tenantId && services.length > 0) {
            fetchAppointments(tenantId)
        }
    }, [tenantId, services])

    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

    const dayAppointments = appointments[selectedDate] || []

    const toggleSlot = async (time: string) => {
        if (!tenantId) return;

        const currentDayApts = appointments[selectedDate] || [];
        const existingApt = currentDayApts.find(a => a.time === time);

        if (existingApt) {
            if (existingApt.status === "blocked") {
                // Unblock (Delete the record)
                const res = await deleteAppointmentAction(existingApt.id, tenantId);
                if (res.success) {
                    setAppointments(prev => ({
                        ...prev,
                        [selectedDate]: currentDayApts.filter(a => a.time !== time)
                    }));
                    toast.success("Horário liberado.");
                } else {
                    toast.error("Erro ao liberar horário.");
                }
            }
            return;
        }

        // Block slot in DB
        const res = await createPublicAppointmentAction({
            tenantId,
            customerName: "Bloqueio Manual",
            customerPhone: "",
            date: selectedDate,
            time,
            status: "blocked"
        } as any);

        if (res.success && res.appointment) {
            const newBlock = {
                id: res.appointment.id,
                time,
                name: "Horário Bloqueado",
                phone: "",
                service: "-",
                status: "blocked" as const,
                price: "-"
            };

            setAppointments(prev => ({
                ...prev,
                [selectedDate]: [...currentDayApts, newBlock].sort((a, b) => a.time.localeCompare(b.time))
            }));
            toast.success("Horário bloqueado.");
        } else {
            toast.error(res.error || "Erro ao bloquear horário.");
        }
    };

    const confirmAppointment = async (time: string) => {
        const apt = dayAppointments.find(a => a.time === time);
        if (apt && (apt as any).id && tenantId) {
            const result = await updateAppointmentStatusAction((apt as any).id, tenantId, "confirmed");
            if (!result.success) {
                toast.error("Erro ao confirmar agendamento.");
                return;
            }
        }

        setAppointments(prev => ({
            ...prev,
            [selectedDate]: prev[selectedDate].map(apt =>
                apt.time === time ? { ...apt, status: "confirmed" as const } : apt
            )
        }));
    };

    const handleAddSuccess = (newApt: any) => {
        const formattedApt = {
            id: newApt.id,
            time: newApt.time,
            name: newApt.customerName,
            phone: newApt.customerPhone,
            service: services.find(s => s.id === newApt.serviceId)?.name || "Serviço",
            status: newApt.status,
            price: services.find(s => s.id === newApt.serviceId)?.price ? `R$ ${parseFloat(services.find(s => s.id === newApt.serviceId).price).toFixed(0)}` : "-"
        };

        setAppointments(prev => ({
            ...prev,
            [selectedDate]: [...(prev[selectedDate] || []), formattedApt as any].sort((a, b) => a.time.localeCompare(b.time))
        }));
    };

    const getDateKey = (day: number) => {
        const m = (currentMonth.getMonth() + 1).toString().padStart(2, "0")
        const d = day.toString().padStart(2, "0")
        return `${currentMonth.getFullYear()}-${m}-${d}`
    }

    const selectedDateObj = new Date(selectedDate + "T12:00:00")
    const fullWeekDays = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"]
    const formattedDate = `${fullWeekDays[selectedDateObj.getDay()]}, ${selectedDateObj.getDate()} de ${MONTH_NAMES[selectedDateObj.getMonth()]}`

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row gap-5 mb-8">
                <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex h-12 w-12 rounded-xl bg-linear-to-br from-amber-500/20 to-amber-600/5 border border-amber-500/20 items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/40 dark:bg-stone-900/40 backdrop-blur-sm" />
                            <CalendarDays className="h-6 w-6 text-amber-600 dark:text-amber-500 relative z-10" />
                        </div>
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-semibold text-foreground tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>Sua Agenda</h2>
                            <p className="text-sm font-medium text-muted-foreground mt-0.5 sm:mt-1">Gerencie seus horários e atendimentos.</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t border-stone-200/50 dark:border-stone-800/50 sm:border-0 relative">
                    <Button variant="outline" className="flex-1 sm:flex-none h-9 sm:h-10 rounded-lg sm:rounded-xl text-xs sm:text-[13px] font-semibold border-amber-600/20 dark:border-amber-400/20 bg-white/50 dark:bg-stone-900/50 hover:bg-amber-50 dark:hover:bg-amber-950/30 hover:border-amber-500/40 hover:text-amber-700 dark:hover:text-amber-400 backdrop-blur-sm transition-all shadow-sm">
                        <Filter className="h-3.5 w-3.5 mr-1.5 text-amber-600 dark:text-amber-500" /> Filtrar
                    </Button>
                    <Button
                        onClick={() => { setActiveTime(TIME_SLOTS[0]); setIsAddModalOpen(true); }}
                        className="flex-1 sm:flex-none h-9 sm:h-10 btn-gold-solid rounded-lg sm:rounded-xl text-xs sm:text-[13px] font-semibold px-4 shadow-sm shadow-amber-500/20 hover:shadow-md hover:shadow-amber-500/30 transition-all"
                    >
                        <Plus className="h-4 w-4 mr-1.5" /> <span className="hidden sm:inline">Novo Agendamento</span><span className="sm:hidden">Novo</span>
                    </Button>
                </div>
            </div>

            {/* ── Calendar + Details Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-6">

                {/* Calendar Card */}
                <div className="relative rounded-2xl border border-stone-200/60 dark:border-amber-500/20 p-6 bg-white dark:bg-stone-900/60 dark:bg-linear-to-br dark:from-stone-900/80 dark:via-stone-900/60 dark:to-amber-950/20 backdrop-blur-md shadow-sm overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(232,168,58,0.04) 0%, transparent 50%)' }} />
                    <div className="relative z-10 flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-foreground">
                                {MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                            </h3>
                            <p className="text-xs text-stone-700 dark:text-stone-400 mt-0.5">Clique em um dia para ver os detalhes</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                                className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-amber-500/10 hover:text-amber-500 border border-amber-500/10 transition-all">
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                                className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-amber-500/10 hover:text-amber-500 border border-amber-500/10 transition-all">
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div className="relative z-10 grid grid-cols-7 gap-1 mb-2">
                        {WEEKDAYS.map(d => (
                            <div key={d} className="text-center text-xs font-medium text-stone-600 dark:text-stone-400 py-2">{d}</div>
                        ))}
                    </div>

                    <div className="relative z-10 grid grid-cols-7 gap-1">
                        {Array.from({ length: firstDay }).map((_, i) => (<div key={`e-${i}`} className="h-12 lg:h-14" />))}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1
                            const dateKey = getDateKey(day)
                            const isSelected = dateKey === selectedDate
                            const apts = appointments[dateKey] || []
                            const hasBlocked = apts.some(a => a.status === "blocked")

                            return (
                                <button key={day} onClick={() => setSelectedDate(dateKey)}
                                    className={cn(
                                        "h-12 lg:h-14 w-full rounded-lg text-sm font-medium transition-all duration-200 relative flex flex-col items-center justify-center gap-0.5",
                                        isSelected
                                            ? "bg-amber-500 text-white shadow-md ring-2 ring-amber-500 ring-offset-2 dark:ring-offset-stone-950"
                                            : "text-foreground hover:bg-amber-500/10 hover:text-amber-600 dark:hover:bg-amber-500/10 dark:hover:text-amber-400 border border-transparent"
                                    )}
                                >
                                    <span>{day}</span>
                                    <div className="flex gap-0.5 mt-1">
                                        {apts.filter(a => a.status !== "blocked").slice(0, 3).map((_, idx) => (
                                            <div key={idx} className={cn(
                                                "h-1 w-1 rounded-full",
                                                isSelected ? "bg-white" : "bg-amber-500"
                                            )} />
                                        ))}
                                        {hasBlocked && (
                                            <div className={cn(
                                                "h-1 w-1 rounded-full opacity-40",
                                                isSelected ? "bg-white" : "bg-stone-400"
                                            )} />
                                        )}
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* ── Timeline ── */}
                <div className="space-y-6">
                    <div className="relative rounded-2xl border border-stone-200/60 dark:border-amber-500/20 overflow-hidden bg-white dark:bg-stone-900/60 backdrop-blur-md shadow-sm">
                        <div className="px-5 py-4 border-b border-amber-200/10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-xl flex items-center justify-center bg-amber-500/10 border border-amber-500/20">
                                    <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-sm font-semibold text-foreground tracking-tight">{formattedDate}</h3>
                                    <p className="text-[10px] text-stone-600 dark:text-stone-400 uppercase tracking-wider font-bold">Cronograma do dia</p>
                                </div>
                            </div>
                            <Badge variant="outline" className="rounded-full border-amber-500/20 text-amber-700 dark:text-amber-400 text-[10px] font-bold h-5">
                                {dayAppointments.filter(a => a.status !== 'blocked').length} agendamentos
                            </Badge>
                        </div>

                        <div key={selectedDate} className="divide-y divide-stone-100 dark:divide-stone-800/50">
                            {TIME_SLOTS.map((time) => {
                                const apt = dayAppointments.find(a => a.time === time);
                                const isBlocked = apt?.status === "blocked";

                                if (apt && !isBlocked) {
                                    const status = STATUS_MAP[apt.status as keyof typeof STATUS_MAP];
                                    return (
                                        <div key={time} className="group relative flex items-start gap-4 px-5 py-5 hover:bg-stone-100/40 dark:hover:bg-white/3 transition-all duration-300">
                                            <div className="w-10 pt-1">
                                                <span className="text-[11px] font-bold text-stone-700 dark:text-stone-300 tabular-nums">{time}</span>
                                            </div>

                                            <div
                                                onClick={() => setSelectedAptDetails(apt)}
                                                className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-stone-900/40 p-3 sm:p-4 rounded-xl border border-stone-200 dark:border-stone-800/50 shadow-xs hover:border-amber-400 group-hover:translate-x-1 cursor-pointer transition-all duration-500 gap-3 sm:gap-4"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center border border-stone-200/50 dark:border-stone-700/50 font-bold text-stone-500 text-xs sm:text-sm tracking-wider">
                                                        {apt.name.split(" ").slice(0, 2).map((n: string) => n[0]).join("").toUpperCase()}
                                                    </div>
                                                    <div className="text-left">
                                                        <div className="flex items-center gap-2 flex-wrap text-left">
                                                            <p className="text-sm font-semibold text-foreground truncate">{apt.name}</p>
                                                            <Badge variant="secondary" className={cn("text-[10px] rounded-full px-2 py-0 border-none shrink-0", status.className)}>
                                                                {status.label}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-[11px] text-muted-foreground mt-1 truncate">{apt.service} • <span className="font-bold text-amber-700 dark:text-amber-400">{apt.price}</span></p>
                                                    </div>
                                                </div>

                                                <div className="hidden md:flex items-center gap-2 lg:opacity-20 group-hover:opacity-100 transition-all duration-300" onClick={(e) => e.stopPropagation()}>
                                                    {apt.status === "pending" && (
                                                        <Button onClick={() => confirmAppointment(time)} size="sm" className="h-7 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold rounded-lg px-3">Confirmar</Button>
                                                    )}
                                                    <a href={`https://wa.me/${apt.phone}`} target="_blank" rel="noopener noreferrer">
                                                        <Button size="sm" variant="outline" className="h-7 rounded-lg text-[10px] px-3 border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800">
                                                            <MessageCircle className="h-3.5 w-3.5 mr-1.5 text-emerald-500" /> WhatsApp
                                                        </Button>
                                                    </a>
                                                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"><MoreVertical className="h-4 w-4" /></Button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <div key={time} className="group flex items-center gap-4 px-5 py-3 hover:bg-stone-50/50 dark:hover:bg-stone-900/10 transition-all duration-300">
                                        <div className="w-10">
                                            <span className="text-[11px] font-bold text-stone-700 dark:text-stone-300 tabular-nums">{time}</span>
                                        </div>

                                        <div
                                            onClick={() => { if (!isBlocked) { setActiveTime(time); setIsAddModalOpen(true); } }}
                                            className={cn(
                                                "flex-1 flex items-center justify-between border border-dashed py-3 px-4 rounded-xl transition-all duration-500 relative overflow-hidden cursor-pointer",
                                                isBlocked 
                                                    ? "bg-stone-50/50 dark:bg-stone-900/20 border-stone-200 dark:border-stone-800" 
                                                    : "border-stone-200/80 dark:border-stone-800 hover:border-amber-400 dark:hover:border-amber-500/50 hover:bg-amber-50/50 dark:hover:bg-amber-500/3 group-hover:translate-x-1"
                                            )}
                                        >
                                            <div className="flex items-center gap-2">
                                                {isBlocked ? (
                                                    <><XCircle className="h-3.5 w-3.5 text-stone-400 dark:text-stone-500" /><span className="text-xs font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wider">Bloqueado</span></>
                                                ) : (
                                                    <><Clock className="h-3.5 w-3.5 text-stone-300 group-hover:text-amber-500 transition-colors" /><span className="text-xs font-medium text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-300 hidden sm:inline">Disponível</span></>
                                                )}
                                            </div>
                                            {!isBlocked && (
                                                <div className="absolute inset-y-0 right-0 flex items-center gap-2 px-3 bg-white/10 backdrop-blur-xs lg:opacity-20 group-hover:opacity-100 transition-all duration-300">
                                                    <Button onClick={(e) => { e.stopPropagation(); setActiveTime(time); setIsAddModalOpen(true); }} size="sm" variant="ghost" className="h-7 rounded-lg text-[10px] font-bold shadow-sm border border-stone-200 dark:border-stone-800 px-3 bg-white dark:bg-stone-950 hover:bg-stone-50 dark:hover:bg-stone-900"><UserPlus className="h-3 w-3 mr-1.5 text-amber-500" />Adicionar</Button>
                                                    <Button onClick={(e) => { e.stopPropagation(); toggleSlot(time); }} size="sm" variant="ghost" className="h-7 rounded-lg text-[10px] font-bold text-stone-400 hover:text-red-500 px-3">Bloquear</Button>
                                                </div>
                                            )}
                                            {isBlocked && (
                                                <Button onClick={(e) => { e.stopPropagation(); toggleSlot(time); }} size="sm" variant="ghost" className="h-7 rounded-lg text-[10px] font-bold text-stone-400 hover:text-stone-900 lg:opacity-20 group-hover:opacity-100 transition-all duration-300 px-3 bg-stone-100/50 dark:bg-stone-800/50">Desbloquear</Button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div ref={financeCardRef} className="relative rounded-2xl border border-amber-400/50 p-6 overflow-hidden bg-linear-to-br from-amber-50 via-white to-amber-100 shadow-sm group transition-all duration-500 text-stone-900">
                        <div className="relative z-10 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 rounded-xl bg-amber-500 flex items-center justify-center shadow-inner border border-amber-400">
                                    <DollarSign className="h-7 w-7 text-white" />
                                </div>
                                <div className="text-left">
                                    <p className="text-[11px] font-black text-amber-800 uppercase tracking-widest mb-1">Rev. do Dia</p>
                                    <p className="text-base font-medium text-amber-900 leading-none">Previsão Bruta</p>
                                </div>
                            </div>
                            <div className="flex items-center text-right shrink-0">
                                <p className="text-4xl font-black tracking-tighter text-amber-700">
                                    R$ {dayAppointments.filter(a => a.status !== 'blocked').reduce((acc, curr) => acc + parseInt(curr.price.replace(/\D/g, '') || "0"), 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AddAppointmentModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={handleAddSuccess}
                date={selectedDate}
                time={activeTime}
                tenantId={tenantId || "local-tenant-id"}
                services={services}
            />
        </div>
    )
}
