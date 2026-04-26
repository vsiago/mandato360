"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import {
    CalendarDays, Clock, CheckCircle2, XCircle, AlertCircle, Plus, ChevronLeft, ChevronRight,
    MessageCircle, MoreVertical, Filter, UserPlus, TrendingUp, Users, Calendar as CalendarIcon, ChevronDown,
    Pencil, Trash2, Smartphone, X, LayoutGrid
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { AppointmentModal } from "@/components/AppointmentModal"
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup
} from "@/components/ui/select"
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { CompleteAppointmentModal, AppointmentDetailsModal } from "@/components/CompleteAppointmentModal"
import { getServicesAction } from "@/lib/actions/services"
import { getMyTenant } from "@/lib/tenant-api"
import { PixConfigModal } from "@/components/PixConfigModal"
import { SaveClientModal } from "@/components/SaveClientModal"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { 
    updateAppointmentStatusAction, 
    updateAppointmentAction,
    getAppointmentsByTenantAction, 
    createPublicAppointmentAction, 
    deleteAppointmentAction 
} from "@/lib/actions/appointments"
import { Badge } from "@/components/ui/badge"

/* ─── Static Constants ─── */

const MONTH_NAMES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
const WEEKDAYS = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"]

const TIME_SLOTS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"]

const STATUS_MAP = {
    confirmed: { label: "Confirmado", color: "bg-green-500" },
    pending: { label: "Pendente", color: "bg-blue-500" },
    blocked: { label: "Bloqueado", color: "bg-amber-500" },
    completed: { label: "Concluído", color: "bg-emerald-500" },
    unavailable: { label: "Indisponível", color: "bg-stone-500" },
}

export default function AgendaPage() {
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
    const [appointments, setAppointments] = useState<Record<string, any[]>>({})
    const [services, setServices] = useState<any[]>([])
    const [tenantId, setTenantId] = useState<string | null>(null)
    const [isIdling, setIsIdling] = useState(true)
    const [tenant, setTenant] = useState<any>(null)

    // Modal state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [activeTime, setActiveTime] = useState("")
    const [editingAppointment, setEditingAppointment] = useState<any>(null)
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false)
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
    const [isPixModalOpen, setIsPixModalOpen] = useState(false)
    const [isSaveClientModalOpen, setIsSaveClientModalOpen] = useState(false)
    const [appointmentToComplete, setAppointmentToComplete] = useState<any>(null)
    const [clientToSave, setClientToSave] = useState<any>(null)
    const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')
    const [selectedWeek, setSelectedWeek] = useState(0)
    const [loading, setLoading] = useState(false)
    const [dateToBlock, setDateToBlock] = useState<string | null>(null)
    const [isBlockConfirmOpen, setIsBlockConfirmOpen] = useState(false)
    const [dateToUnblock, setDateToUnblock] = useState<string | null>(null)
    const [isUnblockConfirmOpen, setIsUnblockConfirmOpen] = useState(false)

    useEffect(() => {
        async function loadInitialData() {
            try {
                const tenant = await getMyTenant()
                if (tenant?.id) {
                    setTenant(tenant)
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

    const fetchAppointments = async (tId: string) => {
        const res = await getAppointmentsByTenantAction(tId)
        if (res.success && res.appointments) {
            const grouped: Record<string, any[]> = {}
            res.appointments.forEach((apt: any) => {
                const dateKey = apt.date
                if (!grouped[dateKey]) grouped[dateKey] = []
                
                grouped[dateKey].push({
                    id: apt.id,
                    time: apt.time,
                    name: apt.customerName || "Cliente",
                    phone: apt.customerPhone || "",
                    serviceId: apt.serviceId,
                    service: services.find(s => s.id === apt.serviceId)?.name || (apt.status === "blocked" ? "-" : "Serviço"),
                    status: apt.status as "pending" | "confirmed" | "cancelled" | "blocked" | "completed",
                    price: services.find(s => s.id === apt.serviceId)?.price 
                        ? `R$ ${parseFloat(services.find(s => s.id === apt.serviceId).price).toFixed(0)}` 
                        : (apt.status === "blocked" ? "-" : "R$ 0"),
                    notes: apt.notes
                })
            })
            setAppointments(grouped)
        }
    }

    useEffect(() => {
        if (tenantId && services.length > 0) {
            fetchAppointments(tenantId)
        }
    }, [tenantId, services])

    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()
    const numRows = Math.ceil((daysInMonth + firstDay) / 7)

    const dayAppointments = appointments[selectedDate] || []

    const handleBlockDay = async (dateKey: string) => {
        if (!tenantId) return;
        setLoading(true);
        try {
            const currentApts = appointments[dateKey] || [];
            const freeSlots = TIME_SLOTS.filter(time => !currentApts.some(a => a.time === time));
            
            for (const time of freeSlots) {
                await createPublicAppointmentAction({
                    tenantId, 
                    customerName: "Bloqueio de Dia", 
                    customerPhone: "", 
                    date: dateKey, 
                    time, 
                    status: "blocked"
                } as any);
            }
            
            toast.success("Dia bloqueado com sucesso!");
            fetchAppointments(tenantId);
        } catch (error) {
            toast.error("Erro ao bloquear dia.");
        } finally {
            setLoading(false);
            setIsBlockConfirmOpen(false);
            setDateToBlock(null);
        }
    }

    const handleUnblockDay = async (dateKey: string) => {
        if (!tenantId) return;
        setLoading(true);
        try {
            const currentApts = appointments[dateKey] || [];
            const manualBlocks = currentApts.filter(a => a.status === "blocked");
            
            for (const apt of manualBlocks) {
                await deleteAppointmentAction(apt.id, tenantId);
            }
            
            toast.success("Dia liberado com sucesso!");
            fetchAppointments(tenantId);
        } catch (error) {
            toast.error("Erro ao liberar dia.");
        } finally {
            setLoading(false);
            setIsUnblockConfirmOpen(false);
            setDateToUnblock(null);
        }
    }

    const isDayFullyBlocked = (dateKey: string) => {
        const apts = appointments[dateKey] || [];
        if (apts.length === 0) return false;
        // A day is fully blocked if all time slots are filled and at least some are 'blocked' manual blocks 
        // OR simply if we have blocked every single slot.
        return TIME_SLOTS.every(time => apts.some(a => a.time === time && a.status === "blocked"));
    }

    const toggleSlot = async (time: string) => {
        if (!tenantId) return;
        const currentDayApts = appointments[selectedDate] || [];
        const existingApt = currentDayApts.find(a => a.time === time);

        if (existingApt) {
            if (existingApt.status === "blocked") {
                const res = await deleteAppointmentAction(existingApt.id, tenantId);
                if (res.success) {
                    setAppointments(prev => ({
                        ...prev,
                        [selectedDate]: currentDayApts.filter(a => a.time !== time)
                    }));
                    toast.success("Horário liberado.");
                }
            }
            return;
        }

        const res = await createPublicAppointmentAction({
            tenantId, customerName: "Bloqueio Manual", customerPhone: "", date: selectedDate, time, status: "blocked"
        } as any);

        if (res.success && res.appointment) {
            setAppointments(prev => ({
                ...prev,
                [selectedDate]: [...currentDayApts, { id: res.appointment.id, time, name: "Bloqueado", status: "blocked" as const }].sort((a, b) => a.time.localeCompare(b.time))
            }));
            toast.success("Horário bloqueado.");
        }
    };

    const confirmAppointment = async (time: string) => {
        const apt = dayAppointments.find(a => a.time === time);
        if (apt && (apt as any).id && tenantId) {
            const result = await updateAppointmentStatusAction((apt as any).id, tenantId, "confirmed");
            if (result.success) {
                setAppointments(prev => ({
                    ...prev,
                    [selectedDate]: prev[selectedDate].map(apt => apt.time === time ? { ...apt, status: "confirmed" as const } : apt)
                }));
            }
        }
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

        const day = newApt.date;
        const currentDayApts = appointments[day] || [];
        
        // If editing, replace. If new, add.
        if (editingAppointment) {
            setAppointments(prev => ({
                ...prev,
                [day]: currentDayApts.map(a => a.id === newApt.id ? formattedApt : a)
            }));
        } else {
            setAppointments(prev => ({
                ...prev,
                [day]: [...currentDayApts, formattedApt].sort((a, b) => a.time.localeCompare(b.time))
            }));
        }
        setEditingAppointment(null);
    }

    const handleCompleteConfirm = async (paymentMethod: string) => {
        if (!appointmentToComplete || !tenantId) return;
        
        const newNotes = (appointmentToComplete.notes || "") + `\nPagamento: ${paymentMethod}`;
        const res = await updateAppointmentAction(appointmentToComplete.id, tenantId, {
            status: "completed",
            notes: newNotes
        });

        if (res.success) {
            setAppointments(prev => ({
                ...prev,
                [selectedDate]: prev[selectedDate].map(apt => apt.id === appointmentToComplete.id ? { ...apt, status: "completed" as const, notes: newNotes } : apt)
            }));
            toast.success("Atendimento concluído!");
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este agendamento?")) return
        
        try {
            const result = await deleteAppointmentAction(id, tenantId || "local-tenant-id")
            if (result.success) {
                toast.success("Agendamento excluído!")
                setAppointments(prev => ({
                    ...prev,
                    [selectedDate]: prev[selectedDate].filter((a: any) => a.id !== id)
                }))
            } else {
                toast.error("Erro ao excluir agendamento.")
            }
        } catch (error) {
            toast.error("Erro inesperado.")
        }
    }

    const handleEdit = (apt: any) => {
        setEditingAppointment({
            id: apt.id,
            customerName: apt.name,
            customerPhone: apt.phone,
            time: apt.time,
            status: apt.status,
            serviceId: apt.serviceId,
            notes: apt.notes
        });
        setActiveTime(apt.time);
        setIsAddModalOpen(true);
    }

    const getDateKey = (day: number) => {
        const m = (currentMonth.getMonth() + 1).toString().padStart(2, "0")
        const d = day.toString().padStart(2, "0")
        return `${currentMonth.getFullYear()}-${m}-${d}`
    }

    const selectedDateObj = new Date(selectedDate + "T12:00:00")

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col space-y-6 animate-in fade-in duration-700 overflow-hidden">
            {/* ── Header ── */}
            <div className="shrink-0 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="h-12 w-12 rounded-xl bg-stone-900 border border-white/5 flex items-center justify-center shrink-0 shadow-lg">
                        <CalendarDays className="h-6 w-6 text-brand-primary" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-foreground leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>Sua Agenda</h2>
                        <p className="text-xs text-stone-400 font-medium tracking-tight">Gerencie seus horários e atendimentos.</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-10 rounded-xl px-4 border-stone-800 bg-stone-900/40 text-stone-300 hover:bg-stone-800 hover:text-white transition-all text-xs">
                        <Filter className="h-3.5 w-3.5 mr-2" /> Filtrar
                    </Button>
                    <Button 
                        onClick={() => { setActiveTime(TIME_SLOTS[0]); setIsAddModalOpen(true); }}
                        className="h-10 rounded-xl px-5 font-bold shadow-lg shadow-brand-secondary/20 bg-brand-gold text-stone-950 transition-all hover:scale-[1.02] text-xs"
                    >
                        <Plus className="h-4 w-4 mr-2" /> Novo Agendamento
                    </Button>
                </div>
            </div>

            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
                {/* ── Left Column ── */}
                <div className="lg:col-span-7 flex flex-col gap-4 min-h-0 h-full">
                    {/* Calendar Card */}
                    <div className="flex-1 h-full min-h-0 bg-stone-900/40 border border-white/5 rounded-2xl p-6 pb-4 backdrop-blur-xl flex flex-col gap-6 shadow-2xl">
                        {/* Calendar Toolbar */}
                        <div className="shrink-0 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => {
                                        const today = new Date();
                                        setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
                                        setSelectedDate(today.toISOString().split('T')[0]);
                                    }}
                                    className="h-9 px-4 bg-stone-900/60 border border-stone-800 rounded-xl text-[10px] uppercase tracking-widest font-black text-stone-400 hover:text-white hover:bg-stone-800 transition-all active:scale-95 cursor-pointer"
                                >
                                    Hoje
                                </Button>

                                <Select 
                                    value={currentMonth.getMonth().toString()} 
                                    onValueChange={(val) => {
                                        const newMonth = parseInt(val);
                                        setCurrentMonth(new Date(currentMonth.getFullYear(), newMonth, 1));
                                    }}
                                >
                                    <SelectTrigger className="h-9 w-[140px] bg-stone-900/60 border-stone-800 rounded-xl text-xs font-bold text-foreground focus:ring-0 focus:ring-offset-0 hover:bg-stone-800 transition-colors">
                                        <SelectValue placeholder="Mês" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-stone-950 border-white/10 rounded-2xl p-1 shadow-2xl">
                                        <SelectGroup>
                                            {MONTH_NAMES.map((name, i) => (
                                                <SelectItem key={i} value={i.toString()} className="rounded-xl focus:bg-stone-900 text-xs font-medium">
                                                    {name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>

                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-stone-500 hover:text-white hover:bg-stone-800"
                                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}>
                                        <ChevronLeft className="h-4.5 w-4.5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-stone-500 hover:text-white hover:bg-stone-800"
                                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}>
                                        <ChevronRight className="h-4.5 w-4.5" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-center bg-stone-900/60 p-0.5 rounded-xl border border-stone-800">
                                <Button 
                                    variant="ghost" size="sm" 
                                    onClick={() => setViewMode('month')}
                                    className={cn(
                                        "h-9 rounded-l-lg rounded-r-none px-5 font-bold text-[11px] tracking-wider transition-all flex items-center gap-2",
                                        viewMode === 'month' ? "bg-brand-gold text-stone-950 shadow-lg" : "text-stone-400 hover:text-white"
                                    )}
                                >
                                    <CalendarIcon className="h-4 w-4" />
                                    <span>Mês</span>
                                </Button>
                                <Button 
                                    variant="ghost" size="sm" 
                                    onClick={() => setViewMode('week')}
                                    className={cn(
                                        "h-9 rounded-r-lg rounded-l-none px-5 font-bold text-[11px] tracking-wider transition-all flex items-center gap-2",
                                        viewMode === 'week' ? "bg-brand-gold text-stone-950 shadow-lg" : "text-stone-400 hover:text-white"
                                    )}
                                >
                                    <LayoutGrid className="h-4 w-4" />
                                    <span>Semana</span>
                                </Button>
                            </div>
                        </div>

                        {viewMode === 'month' && (
                            <div className="flex-1 flex flex-col h-full min-h-0 gap-2">
                                {/* Weekdays Header */}
                                <div className="shrink-0 grid grid-cols-7 gap-1">
                                    {WEEKDAYS.map(d => (
                                        <div key={d} className="text-center text-[9px] font-black text-stone-600 uppercase tracking-widest py-1">{d}</div>
                                    ))}
                                </div>

                                {/* Calendar Days */}
                                <div className="flex-1 flex flex-col h-full min-h-0">
                                    <div 
                                        className="grid grid-cols-7 gap-0 border border-stone-800/40 rounded-2xl overflow-hidden shadow-2xl shadow-stone-950/50 flex-1 h-full"
                                        style={{ gridTemplateRows: `repeat(${numRows}, 1fr)` }}
                                    >
                                        {Array.from({ length: firstDay }).map((_, i) => (
                                            <div key={`e-${i}`} className="border-r border-b border-white/[0.03] bg-stone-900/10" />
                                        ))}
                                        {Array.from({ length: daysInMonth }).map((_, i) => {
                                            const day = i + 1
                                            const dateKey = getDateKey(day)
                                            const isSelected = dateKey === selectedDate
                                            const apts = appointments[dateKey] || []
                                            const isToday = dateKey === new Date().toISOString().split('T')[0]
                                            const isBlocked = isDayFullyBlocked(dateKey)

                                            return (
                                                <div key={day} onClick={() => setSelectedDate(dateKey)}
                                                    className={cn(
                                                        "w-full h-full text-sm font-bold transition-all relative flex flex-col items-center justify-center gap-1 group cursor-pointer border-r border-b border-white/[0.03]",
                                                        isSelected
                                                            ? (isBlocked ? "bg-red-500/10 text-red-500 z-10" : "bg-brand-gold text-stone-950 z-10")
                                                            : (isBlocked ? "text-stone-600 bg-stone-900/20" : "text-stone-400 hover:bg-stone-800/40 hover:text-white")
                                                    )}
                                                >
                                                    <span className="text-xs lg:text-sm">{day}</span>
                                                    <div className="flex gap-1">
                                                        {apts.slice(0, 2).map((a, idx) => (
                                                            <div key={idx} className={cn(
                                                                "h-1 w-1 rounded-full",
                                                                isSelected ? (isBlocked ? "bg-red-500/40" : "bg-stone-950/40") : 
                                                                a.status === 'completed' ? "bg-emerald-500" :
                                                                a.status === 'confirmed' ? "bg-green-500" :
                                                                a.status === 'pending' ? "bg-blue-500" : "bg-stone-500"
                                                            )} />
                                                        ))}
                                                    </div>
                                                    
                                                    {isToday && !isSelected && (
                                                        <div className="absolute top-1 right-1 h-1 w-1 rounded-full bg-brand-primary" />
                                                    )}
                                                    
                                                    {isBlocked && (
                                                        <div className="absolute inset-0 pointer-events-none px-4.5 flex items-center justify-center">
                                                            <svg className="w-full h-full opacity-40" viewBox="0 0 100 100" preserveAspectRatio="none">
                                                                <line x1="10" y1="20" x2="90" y2="80" stroke="currentColor" strokeWidth="2" className="text-red-500" />
                                                                <line x1="90" y1="20" x2="10" y2="80" stroke="currentColor" strokeWidth="2" className="text-red-500" />
                                                            </svg>
                                                        </div>
                                                    )}

                                                    {isBlocked ? (
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); setDateToUnblock(dateKey); setIsUnblockConfirmOpen(true); }}
                                                            className="absolute top-1 left-1 h-4 w-4 rounded-full bg-stone-900/80 text-stone-600 hover:text-emerald-500 hover:bg-emerald-500/10 border border-white/5 flex items-center justify-center z-20 transition-colors"
                                                            title="Desbloquear Dia"
                                                        >
                                                            <CheckCircle2 className="h-2.5 w-2.5" />
                                                        </button>
                                                    ) : (
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); setDateToBlock(dateKey); setIsBlockConfirmOpen(true); }}
                                                            className="absolute top-1 left-1 h-4 w-4 rounded-full bg-stone-900/80 hover:bg-red-500/20 text-stone-600 hover:text-red-500 border border-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-20"
                                                            title="Bloquear Dia Inteiro"
                                                        >
                                                            <X className="h-2.5 w-2.5" />
                                                        </button>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {viewMode === 'week' && (
                            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                                {/* Week Tabs */}
                                <div className="flex items-center gap-1 p-1 bg-stone-900/40 rounded-xl border border-white/5 mb-4 shrink-0">
                                    {Array.from({ length: Math.ceil((daysInMonth + firstDay) / 7) }).map((_, i) => (
                                        <button 
                                            key={i} 
                                            onClick={() => setSelectedWeek(i)}
                                            className={cn(
                                                "h-7 px-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex-1",
                                                selectedWeek === i ? "bg-brand-gold text-stone-950 shadow-lg" : "text-stone-500 hover:text-stone-300"
                                            )}
                                        >
                                            Semana {i + 1}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                    <Accordion type="single" collapsible className="space-y-3">
                                        {Array.from({ length: 7 }).map((_, i) => {
                                            const dayIdx = (selectedWeek * 7) - firstDay + i + 1;
                                            if (dayIdx <= 0 || dayIdx > daysInMonth) return null;
                                            
                                            const dateKey = getDateKey(dayIdx);
                                            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayIdx);
                                            const apts = appointments[dateKey] || [];
                                            const dayName = WEEKDAYS[date.getDay()];
                                            
                                            return (
                                                <AccordionItem key={dateKey} value={dateKey} className="border border-white/5 bg-stone-900/20 rounded-2xl overflow-hidden px-1">
                                                    <AccordionTrigger className="hover:no-underline p-4 py-3 group">
                                                        <div className="flex items-center justify-between w-full pr-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-8 w-8 rounded-lg bg-stone-950 flex flex-col items-center justify-center border border-white/5">
                                                                    <span className="text-[10px] font-black text-brand-gold uppercase">{dayName.slice(0,3)}</span>
                                                                    <span className="text-xs font-bold text-white">{dayIdx}</span>
                                                                </div>
                                                                <div className="text-left">
                                                                    <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest block">{date.toLocaleDateString('pt-BR', { month: 'long' })}</span>
                                                                    <span className="text-[9px] font-bold text-stone-600">{apts.length} agendamentos</span>
                                                                </div>
                                                            </div>
                                                            <div 
                                                                role="button"
                                                                onClick={(e) => { e.stopPropagation(); handleBlockDay(dateKey); }}
                                                                className="h-7 rounded-lg text-[9px] font-black uppercase tracking-widest text-red-500/50 hover:text-red-500 hover:bg-red-500/10 px-2 flex items-center justify-center transition-all cursor-pointer"
                                                            >
                                                                Bloquear Dia
                                                            </div>
                                                        </div>
                                                    </AccordionTrigger>
                                                    <AccordionContent className="px-4 pb-4">
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                                            {TIME_SLOTS.map(time => {
                                                                const apt = apts.find(a => a.time === time);
                                                                return (
                                                                    <div key={time} className={cn(
                                                                        "p-2.5 rounded-xl border flex items-center justify-between transition-all group/slot",
                                                                        apt ? (apt.status === 'blocked' ? "bg-red-500/[0.02] border-red-500/10" : "bg-stone-900/60 border-white/5 shadow-sm") 
                                                                            : "bg-transparent border-white/[0.02] border-dashed hover:border-brand-primary/20"
                                                                    )}>
                                                                        <div className="flex items-center gap-2.5 min-w-0">
                                                                            <span className="text-[10px] font-black text-stone-500 w-8">{time}</span>
                                                                            {apt ? (
                                                                                <div className="min-w-0">
                                                                                    <div className="text-[11px] font-bold text-foreground truncate">{apt.name}</div>
                                                                                    <div className="text-[9px] text-stone-500 truncate">{apt.status === 'blocked' ? "Horário Bloqueado" : apt.service}</div>
                                                                                </div>
                                                                            ) : (
                                                                                <span className="text-[9px] font-bold text-stone-700 uppercase tracking-widest">Disponível</span>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex items-center gap-1 opacity-0 group-hover/slot:opacity-100 transition-opacity">
                                                                            {!apt ? (
                                                                                <Button size="icon" variant="ghost" onClick={() => { setSelectedDate(dateKey); setActiveTime(time); setIsAddModalOpen(true); }} className="h-6 w-6 rounded-lg text-brand-primary hover:bg-brand-primary/10">
                                                                                    <Plus className="h-3 w-3" />
                                                                                </Button>
                                                                            ) : (
                                                                                <Button size="icon" variant="ghost" onClick={() => { if(apt.status === 'blocked') toggleSlot(time); }} className="h-6 w-6 rounded-lg text-stone-500 hover:text-white">
                                                                                    {apt.status === 'blocked' ? <CheckCircle2 className="h-3 w-3 text-emerald-500" /> : <MoreVertical className="h-3 w-3" />}
                                                                                </Button>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            )
                                        })}
                                    </Accordion>
                                </div>
                            </div>
                        )}

                        {viewMode === 'day' && (
                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                <div className="space-y-3">
                                    {TIME_SLOTS.map(time => {
                                        const apt = dayAppointments.find(a => a.time === time)
                                        return (
                                            <div key={time} className={cn(
                                                "group border rounded-2xl p-4 transition-all flex items-center justify-between",
                                                apt ? "bg-stone-900/60 border-white/10 shadow-lg" : "bg-transparent border-white/5 border-dashed hover:border-brand-primary/30"
                                            )}>
                                                <div className="flex items-center gap-6">
                                                    <div className="text-sm font-black text-stone-500 w-12">{time}</div>
                                                    {apt ? (
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-10 w-10 rounded-full bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold text-xs font-black">
                                                                {apt.name[0]}
                                                            </div>
                                                            <div>
                                                                <h4 className="text-sm font-bold text-foreground">{apt.name}</h4>
                                                                <p className="text-[11px] text-stone-500">{apt.service} • {apt.price}</p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[11px] font-bold text-stone-700 uppercase tracking-widest">Horário disponível</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {!apt && (
                                                        <Button size="sm" variant="ghost" className="h-8 rounded-xl text-[10px] font-black uppercase tracking-widest text-brand-primary hover:bg-brand-primary/10 px-4"
                                                            onClick={() => { setActiveTime(time); setIsAddModalOpen(true); }}>
                                                            Agendar
                                                        </Button>
                                                    )}
                                                    {apt && (
                                                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-xl text-stone-500 hover:text-white">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Legend */}
                        <div className="shrink-0 flex flex-wrap items-center justify-center gap-5">
                            {Object.entries(STATUS_MAP).map(([key, data]) => (
                                <div key={key} className="flex items-center gap-1.5">
                                    <div className={cn("h-1.5 w-1.5 rounded-full", data.color)} />
                                    <span className="text-[9px] font-black text-stone-600 uppercase tracking-widest">{data.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Metrics Bar */}
                    <div className="shrink-0 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                        {[
                            { label: "Agendamentos hoje", value: "1", sub: "Veja seu dia completo", icon: CalendarDays },
                            { label: "Próximos 7 dias", value: "5", sub: "Agendamentos", icon: CalendarIcon },
                            { label: "Taxa de ocupação", value: "68%", sub: "Da sua agenda", icon: TrendingUp },
                            { label: "Horário disponível", value: "08:00 - 18:00", sub: "Seu horário de trabalho", icon: Clock },
                        ].map((m, i) => (
                            <div key={i} className="group cursor-pointer bg-stone-900/40 border border-white/5 p-4 rounded-2xl hover:bg-stone-900/60 transition-all flex items-center gap-4 relative overflow-hidden">
                                <div className="h-10 w-10 shrink-0 rounded-full bg-stone-950 border border-white/5 flex items-center justify-center relative z-10 group-hover:border-brand-primary/20 transition-colors">
                                    <m.icon className="h-4.5 w-4.5 text-stone-500 group-hover:text-brand-primary transition-colors" />
                                    <div className="absolute inset-0 rounded-full bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
                                </div>
                                <div className="flex-1 min-w-0 relative z-10">
                                    <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest mb-0.5 truncate">{m.label}</p>
                                    <p className="text-sm font-bold text-foreground leading-none mb-1">{m.value}</p>
                                    <p className="text-[9px] text-stone-600 font-medium truncate">{m.sub}</p>
                                </div>
                                <ChevronRight className="h-3.5 w-3.5 text-stone-700 group-hover:text-brand-primary transition-all absolute right-4 top-1/2 -translate-y-1/2" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Right Column ── */}
                <div className="lg:col-span-5 bg-stone-900/40 border border-white/5 rounded-2xl flex flex-col h-full min-h-0 overflow-hidden backdrop-blur-xl">
                    <div className="shrink-0 p-5 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-stone-950 border border-white/5 flex items-center justify-center shadow-inner">
                                <Clock className="h-5 w-5 text-brand-primary" />
                            </div>
                            <div>
                                <h3 className="text-[11px] font-black text-stone-500 uppercase tracking-widest">Cronograma do dia</h3>
                                <p className="text-xs font-bold text-foreground mt-0.5">{selectedDateObj.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => setIsPixModalOpen(true)}
                                className="flex items-center gap-2 cursor-pointer h-7 px-3 rounded-lg border border-white/5 bg-stone-950 text-[9px] font-bold text-stone-500 uppercase tracking-widest hover:text-amber-500 transition-all group"
                                title="Configurar PIX do Estabelecimento"
                            >
                                <Smartphone className="h-3 w-3 group-hover:scale-110 transition-transform" />
                                <span>Configurar PIX</span>
                            </button>
                            <div className="bg-brand-primary/10 text-[9px] font-black text-brand-primary px-2 py-0.5 rounded-full border border-brand-primary/20 uppercase tracking-wider">
                                {dayAppointments.length} agendamento{dayAppointments.length !== 1 ? 's' : ''}
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
                        {TIME_SLOTS.map((time) => {
                            const apt = dayAppointments.find(a => a.time === time);
                            const isBlocked = apt?.status === "blocked";

                            return (
                                <div key={time} className="flex gap-3">
                                    <div className="w-10 pt-2 shrink-0 flex justify-end">
                                        <span className={cn(
                                            "tabular-nums tracking-tighter transition-all duration-300",
                                            apt && !isBlocked 
                                                ? "text-xs font-black text-white" 
                                                : "text-[10px] font-bold text-stone-600"
                                        )}>
                                            {time}
                                        </span>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        {apt && !isBlocked ? (
                                            <div className={cn(
                                                "border transition-all group relative overflow-hidden h-16 flex items-center rounded-2xl p-2 px-3",
                                                apt.status === 'completed' 
                                                    ? "bg-emerald-500/[0.04] border-emerald-500/10 hover:bg-emerald-500/[0.06] hover:border-emerald-500/20 shadow-inner shadow-emerald-500/[0.02]" 
                                                    : "bg-stone-900/40 border-white/[0.03] hover:bg-stone-900/60 hover:border-white/[0.08]"
                                            )}>
                                                <div className="flex items-center justify-between w-full gap-3">
                                                    {/* Left: Avatar & Info */}
                                                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                                        <div className={cn(
                                                            "h-9 w-9 rounded-full flex items-center justify-center text-[10px] font-black border shrink-0 shadow-inner",
                                                            apt.status === 'completed' 
                                                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
                                                                : "bg-stone-950 border-white/5 text-stone-600"
                                                        )}>
                                                            {apt.name.split(" ").map((n: string) => n[0]).join("").toUpperCase()}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="flex items-center gap-2 mb-0.5">
                                                                <h4 className={cn(
                                                                    "text-sm font-bold truncate tracking-tight",
                                                                    apt.status === 'completed' ? "text-emerald-500/90" : "text-foreground"
                                                                )}>{apt.name}</h4>
                                                                <div className={cn(
                                                                    "text-[7px] font-black uppercase px-1.5 py-0.5 rounded-full tracking-[0.1em] shrink-0 border",
                                                                    apt.status === 'completed' ? "text-emerald-500 bg-emerald-500/20 border-emerald-500/30" :
                                                                    apt.status === 'confirmed' ? "text-emerald-500/80 bg-emerald-500/[0.03] border-emerald-500/10" : 
                                                                    "text-blue-500/60 bg-blue-500/5 border-white/5"
                                                                )}>
                                                                    {apt.status === 'completed' ? 'Concluído' : apt.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                                                                </div>
                                                            </div>
                                                            <p className="text-[10px] text-stone-500 font-medium truncate">
                                                                {apt.service} • <span className="text-brand-primary/80 font-bold">{apt.price}</span>
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Right: Actions */}
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        {apt.status === 'completed' ? (
                                                            <button 
                                                                onClick={() => { setAppointmentToComplete(apt); setIsDetailsModalOpen(true); }}
                                                                className="h-8 px-3 rounded-lg border border-white/[0.05] bg-stone-950 text-stone-500 text-[9px] font-bold uppercase tracking-wider hover:bg-stone-900 hover:text-stone-300 transition-all active:scale-[0.98] shadow-sm cursor-pointer"
                                                            >
                                                                Ver detalhes
                                                            </button>
                                                        ) : (
                                                            <button 
                                                                onClick={() => { setAppointmentToComplete(apt); setIsCompleteModalOpen(true); }}
                                                                className="h-8 px-3 rounded-lg border border-white/[0.05] bg-stone-950 text-emerald-500/90 text-[9px] font-bold uppercase tracking-wider hover:bg-emerald-500/[0.08] hover:border-emerald-500/20 hover:text-emerald-400 transition-all active:scale-[0.98] shadow-sm cursor-pointer"
                                                            >
                                                                Concluir
                                                            </button>
                                                        )}

                                                        <div className="flex items-center gap-2">
                                                            <a 
                                                                href={`https://wa.me/${apt.phone.replace(/\D/g, '')}`} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer" 
                                                                className="h-9 w-9 rounded-full bg-stone-950 flex items-center justify-center text-green-500 border border-white/5 hover:bg-green-500/10 hover:border-green-500/20 transition-all shadow-lg"
                                                            >
                                                                <MessageCircle className="h-4 w-4" fill="currentColor" fillOpacity={0.1} />
                                                            </a>
                                                            
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <button className="h-9 w-9 rounded-full bg-stone-950 flex items-center justify-center text-stone-600 hover:text-white border border-white/5 hover:border-white/10 transition-all outline-none">
                                                                        <MoreVertical className="h-4 w-4" />
                                                                    </button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent 
                                                                    align="end" 
                                                                    sideOffset={4}
                                                                    className="w-32 bg-stone-950/98 backdrop-blur-xl border border-white/10 rounded-2xl p-1 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
                                                                >
                                                                    {!apt.customerId && (
                                                                        <DropdownMenuItem 
                                                                            onClick={() => { setClientToSave(apt); setIsSaveClientModalOpen(true); }}
                                                                            className="flex items-center gap-2 px-1.5 py-1.5 text-[10px] font-semibold text-stone-400 focus:text-amber-500 focus:bg-amber-500/10 rounded-xl transition-all cursor-pointer group/item"
                                                                        >
                                                                            <div className="h-6 w-6 rounded-lg bg-stone-900 flex items-center justify-center group-focus/item:bg-amber-500/20 transition-colors">
                                                                                <UserPlus className="h-3 w-3 transition-transform" />
                                                                            </div>
                                                                            <span>Salvar</span>
                                                                        </DropdownMenuItem>
                                                                    )}
                                                                    
                                                                    <DropdownMenuItem 
                                                                        onClick={() => { setEditingAppointment(apt); setIsAddModalOpen(true); }} 
                                                                        className="flex items-center gap-2 px-1.5 py-1.5 text-[10px] font-semibold text-stone-400 focus:text-white focus:bg-white/5 rounded-xl transition-all cursor-pointer group/item"
                                                                    >
                                                                        <div className="h-6 w-6 rounded-lg bg-stone-900 flex items-center justify-center group-focus/item:bg-white/10 transition-colors">
                                                                            <Pencil className="h-3 w-3 transition-transform" />
                                                                        </div>
                                                                        <span>Editar</span>
                                                                    </DropdownMenuItem>
                                                                    
                                                                    <DropdownMenuItem 
                                                                        onClick={() => handleDelete(apt.id)} 
                                                                        className="flex items-center gap-2 px-1.5 py-1.5 text-[10px] font-semibold text-stone-500/60 focus:text-red-500 focus:bg-red-500/10 rounded-xl transition-all cursor-pointer group/item mt-0.5"
                                                                    >
                                                                        <div className="h-6 w-6 rounded-lg bg-stone-900 flex items-center justify-center group-focus/item:bg-red-500/20 transition-colors">
                                                                            <Trash2 className="h-3 w-3 transition-transform" />
                                                                        </div>
                                                                        <span>Excluir</span>
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className={cn(
                                                "flex items-center justify-between border border-dashed rounded-xl p-2.5 px-3.5 transition-all group cursor-pointer",
                                                isBlocked 
                                                    ? "border-red-500/20 bg-red-500/[0.03] hover:bg-red-500/[0.06] hover:border-red-500/30" 
                                                    : "border-stone-800 hover:border-brand-primary/30 hover:bg-stone-900/40"
                                            )}
                                                onClick={() => { if (!isBlocked) { setActiveTime(time); setIsAddModalOpen(true); } }}>
                                                <div className="flex items-center gap-3">
                                                    <Clock className={cn(
                                                        "h-3.5 w-3.5 transition-colors",
                                                        isBlocked ? "text-red-500/40" : "text-stone-700 group-hover:text-brand-primary"
                                                    )} />
                                                    <span className={cn(
                                                        "text-[10px] font-black uppercase tracking-widest transition-colors",
                                                        isBlocked ? "text-red-500/60" : "text-stone-600 group-hover:text-stone-300"
                                                    )}>
                                                        {isBlocked ? 'Bloqueado' : 'Disponível'}
                                                    </span>
                                                </div>
                                                {!isBlocked && (
                                                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                                                        <Button size="sm" variant="ghost" className="h-7 rounded-lg text-[9px] font-black uppercase tracking-widest text-brand-primary hover:bg-brand-primary/10 px-2.5">
                                                            <Plus className="h-3 w-3 mr-1.5" /> Agendar
                                                        </Button>
                                                        <Button size="sm" variant="ghost" className="h-7 rounded-lg text-[9px] font-black uppercase tracking-widest text-stone-500 hover:text-red-500 px-2.5"
                                                            onClick={(e) => { e.stopPropagation(); toggleSlot(time); }}>
                                                            Bloquear
                                                        </Button>
                                                    </div>
                                                )}
                                                {isBlocked && (
                                                    <Button size="sm" variant="ghost" className="h-7 rounded-lg text-[9px] font-black uppercase tracking-widest text-red-500/50 hover:text-red-500 px-2.5 hover:bg-red-500/10"
                                                        onClick={(e) => { e.stopPropagation(); toggleSlot(time); }}>
                                                        Liberar
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>

            <AppointmentModal
                isOpen={isAddModalOpen}
                onClose={() => { setIsAddModalOpen(false); setEditingAppointment(null); }}
                date={selectedDate}
                time={activeTime}
                tenantId={tenantId || ""}
                services={services}
                onSuccess={handleAddSuccess}
                appointment={editingAppointment}
            />

            <CompleteAppointmentModal 
                isOpen={isCompleteModalOpen}
                onClose={() => setIsCompleteModalOpen(false)}
                appointment={appointmentToComplete}
                onConfirm={handleCompleteConfirm}
                pix={tenant?.pix}
            />

            <AppointmentDetailsModal 
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                appointment={appointmentToComplete}
            />

            <PixConfigModal 
                isOpen={isPixModalOpen}
                onClose={() => setIsPixModalOpen(false)}
                tenant={tenant}
                onSuccess={(updated) => setTenant(updated)}
            />

            <SaveClientModal 
                isOpen={isSaveClientModalOpen}
                onClose={() => setIsSaveClientModalOpen(false)}
                tenantId={tenantId || ""}
                initialData={{
                    name: clientToSave?.name,
                    phone: clientToSave?.phone,
                    appointmentId: clientToSave?.id
                }}
            />
            <Dialog open={isBlockConfirmOpen} onOpenChange={setIsBlockConfirmOpen}>
                <DialogContent className="bg-stone-950 border-white/10 rounded-3xl max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black text-white">Bloquear dia inteiro?</DialogTitle>
                        <DialogDescription className="text-stone-400 text-sm">
                            Isso irá fechar todos os horários disponíveis para o dia {dateToBlock && new Date(dateToBlock + 'T00:00:00').toLocaleDateString('pt-BR')}.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2 mt-4">
                        <Button variant="ghost" onClick={() => setIsBlockConfirmOpen(false)} className="flex-1 rounded-xl text-stone-400 hover:text-white hover:bg-white/5">
                            Cancelar
                        </Button>
                        <Button onClick={() => dateToBlock && handleBlockDay(dateToBlock)} className="flex-1 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold" disabled={loading}>
                            {loading ? "Bloqueando..." : "Bloquear"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isUnblockConfirmOpen} onOpenChange={setIsUnblockConfirmOpen}>
                <DialogContent className="bg-stone-950 border-white/10 rounded-3xl max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black text-white">Liberar dia inteiro?</DialogTitle>
                        <DialogDescription className="text-stone-400 text-sm">
                            Isso irá remover todos os bloqueios manuais para o dia {dateToUnblock && new Date(dateToUnblock + 'T00:00:00').toLocaleDateString('pt-BR')}.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2 mt-4">
                        <Button variant="ghost" onClick={() => setIsUnblockConfirmOpen(false)} className="flex-1 rounded-xl text-stone-400 hover:text-white hover:bg-white/5">
                            Cancelar
                        </Button>
                        <Button onClick={() => dateToUnblock && handleUnblockDay(dateToUnblock)} className="flex-1 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold" disabled={loading}>
                            {loading ? "Liberando..." : "Liberar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
