"use client"

import React, { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import {
    CalendarDays, Clock, CheckCircle2, XCircle, AlertCircle, Plus, ChevronLeft, ChevronRight,
    MessageCircle, MoreVertical, Filter, UserPlus, TrendingUp, Users, Calendar as CalendarIcon, ChevronDown,
    Pencil, Trash2, Smartphone, X, LayoutGrid, Play
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
import { BusinessHoursModal } from "@/components/BusinessHoursModal"
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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

/* ─── Static Constants ─── */

const MONTH_NAMES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
const WEEKDAYS = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"]

const TIME_SLOTS = [
    "00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", 
    "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", 
    "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
]

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
    const [isBusinessHoursModalOpen, setIsBusinessHoursModalOpen] = useState(false)

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
            
            // Auto-refresh every 10 seconds to keep the dashboard live
            const interval = setInterval(() => {
                fetchAppointments(tenantId)
            }, 10000)
            
            return () => clearInterval(interval)
        }
    }, [tenantId, services])

    // Auto-scroll to current/next hour logic
    const timelineRef = useRef<HTMLDivElement>(null)
    
    useEffect(() => {
        if (!timelineRef.current || viewMode !== 'month') return
        
        const now = new Date()
        const isToday = selectedDate === now.toISOString().split('T')[0]
        
        if (isToday) {
            const nowTime = now.getHours() * 60 + now.getMinutes()
            const nextSlot = TIME_SLOTS.find(t => {
                const [h, m] = t.split(':').map(Number)
                return (h * 60 + m) > nowTime
            }) || "08:00"
            
            // Wait for render
            setTimeout(() => {
                const element = document.getElementById(`slot-${nextSlot}`)
                if (element && timelineRef.current) {
                    const containerHeight = timelineRef.current.offsetHeight
                    const elementTop = element.offsetTop
                    const elementHeight = element.offsetHeight
                    
                    timelineRef.current.scrollTo({
                        top: elementTop - (containerHeight / 2) + (elementHeight / 2),
                        behavior: 'smooth'
                    })
                }
            }, 500)
        }
    }, [selectedDate, viewMode])

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

    const isDateOpen = (dateKey: string) => {
        const date = new Date(dateKey + 'T12:00:00');
        const dayOfWeek = date.getDay().toString();
        
        if (!tenant?.businessHours || Object.keys(tenant.businessHours).length === 0) {
            // Default fallback if no config at all: Mon-Sat open, Sun closed
            return dayOfWeek !== '0';
        }
        
        const config = tenant.businessHours[dayOfWeek];
        if (!config) return dayOfWeek !== '0'; // Default if day missing from config
        
        return config.isOpen;
    }

    const isTimeOpen = (dateKey: string, time: string) => {
        if (!isDateOpen(dateKey)) return false;
        const date = new Date(dateKey + 'T12:00:00');
        const dayOfWeek = date.getDay().toString();
        const config = tenant?.businessHours?.[dayOfWeek];
        if (!config) return true;
        
        const [h, m] = time.split(':').map(Number);
        const [startH, startM] = config.start.split(':').map(Number);
        const [endH, endM] = config.end.split(':').map(Number);
        
        const timeVal = h * 60 + m;
        const startVal = startH * 60 + startM;
        const endVal = endH * 60 + endM;
        
        return timeVal >= startVal && timeVal < endVal;
    }

    const isDayFullyBlocked = (dateKey: string) => {
        const apts = appointments[dateKey] || [];
        // Se tem agendamentos reais (não bloqueios), o dia não está totalmente bloqueado (é uma exceção)
        const hasRealApts = apts.some(a => a.status !== "blocked");
        if (hasRealApts) return false;

        if (!isDateOpen(dateKey)) return true;
        if (apts.length === 0) return false;
        return TIME_SLOTS.every(time => apts.some(a => a.time === time && a.status === "blocked"));
    }

    const toggleSlot = async (time: string) => {
        if (!tenantId) return;
        const currentDayApts = appointments[selectedDate] || [];
        const existingApt = currentDayApts.find(a => a.time === time);

        if (existingApt) {
            if (existingApt.status === "blocked" || existingApt.status === "liberado") {
                const res = await deleteAppointmentAction(existingApt.id, tenantId);
                if (res.success) {
                    setAppointments(prev => ({
                        ...prev,
                        [selectedDate]: currentDayApts.filter(a => a.time !== time)
                    }));
                    toast.success("Horário restaurado ao padrão.");
                }
            }
            return;
        }

        // Se está fora do horário, o clique no botão "Liberar" deve criar um status especial
        const isOpenByConfig = isTimeOpen(selectedDate, time);
        const status = isOpenByConfig ? "blocked" : "liberado";
        const customerName = isOpenByConfig ? "Bloqueio Manual" : "Horário Liberado (Exceção)";

        const res = await createPublicAppointmentAction({
            tenantId, customerName, customerPhone: "", date: selectedDate, time, status
        } as any);

        if (res.success && res.appointment) {
            setAppointments(prev => ({
                ...prev,
                [selectedDate]: [...currentDayApts, { id: res.appointment.id, time, name: customerName, status: status as any }].sort((a, b) => a.time.localeCompare(b.time))
            }));
            toast.success(status === "blocked" ? "Horário bloqueado." : "Horário liberado para clientes.");
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
                    <Button 
                        variant="outline" 
                        onClick={() => setIsBusinessHoursModalOpen(true)}
                        className="h-10 rounded-xl px-4 border-stone-800 bg-stone-900/40 text-stone-300 hover:bg-stone-800 hover:text-white transition-all text-xs cursor-pointer"
                    >
                        <Clock className="h-3.5 w-3.5 mr-2" /> Funcionamento
                    </Button>
                    <Button variant="outline" className="h-10 rounded-xl px-4 border-stone-800 bg-stone-900/40 text-stone-300 hover:bg-stone-800 hover:text-white transition-all text-xs cursor-pointer">
                        <Filter className="h-3.5 w-3.5 mr-2" /> Filtrar
                    </Button>
                    <Button 
                        onClick={() => { setActiveTime(TIME_SLOTS[0]); setIsAddModalOpen(true); }}
                        className="h-10 rounded-xl px-5 font-bold shadow-lg shadow-brand-secondary/20 bg-brand-gold text-stone-950 transition-all hover:scale-[1.02] text-xs cursor-pointer"
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
                                        "h-8 rounded-l-lg rounded-r-none px-5 font-bold text-[11px] tracking-wider transition-all flex items-center gap-2",
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
                                        "h-8 rounded-r-lg rounded-l-none px-5 font-bold text-[11px] tracking-wider transition-all flex items-center gap-2",
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
                            { 
                                label: "Horário disponível", 
                                value: (() => {
                                    if (!tenant?.businessHours) return "08:00 - 18:00";
                                    const dayOfWeek = new Date(selectedDate + 'T12:00:00').getDay().toString();
                                    const config = tenant.businessHours[dayOfWeek];
                                    return config?.isOpen ? `${config.start} - ${config.end}` : "Fechado";
                                })(), 
                                sub: "Seu horário de trabalho", 
                                icon: Clock 
                            },
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
                <div className="lg:col-span-5 bg-stone-900/40 border border-white/5 rounded-2xl flex flex-col h-full min-h-0 overflow-hidden backdrop-blur-xl relative">
                    {/* ── Digital Time Track (Fixed Viewport) ── */}
                    <div className="absolute left-10 top-20 bottom-0 w-px bg-gradient-to-b from-transparent via-brand-primary/40 to-transparent pointer-events-none z-10 hidden lg:block" />

                    <div className="shrink-0 p-5 border-b border-white/5 flex items-center justify-between relative z-20 bg-stone-950/40 backdrop-blur-md">
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

                    <TooltipProvider>
                        <div 
                            ref={timelineRef}
                            className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar scroll-smooth relative z-20"
                        >
                            {TIME_SLOTS.map((time) => {
                            const now = new Date();
                            const isToday = selectedDate === now.toISOString().split('T')[0];
                            const nowTime = now.getHours() * 60 + now.getMinutes();
                            const nextSlot = TIME_SLOTS.find(t => {
                                const [h, m] = t.split(':').map(Number);
                                return (h * 60 + m) > nowTime;
                            }) || "08:00";
                            const isNextSlot = isToday && time === nextSlot;

                            const apt = dayAppointments.find(a => a.time === time);
                            const isOpenByConfig = isTimeOpen(selectedDate, time);
                            const isBlocked = apt?.status === "blocked";
                            const isLiberado = apt?.status === "liberado";
                            const isUnavailable = !isOpenByConfig && !isLiberado;

                            return (
                                <div 
                                    key={time} 
                                    id={`slot-${time}`}
                                    className={cn(
                                        "flex gap-3 items-center transition-all duration-500 relative", 
                                        isUnavailable && !apt ? "opacity-90" : "opacity-100",
                                        isNextSlot && "z-10"
                                    )}
                                >
                                    {isNextSlot && (
                                        <>
                                            {/* Digital Pointer */}
                                            <div className="absolute -left-3 top-1/2 -translate-y-1/2 z-30 flex items-center group/pointer">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="flex items-center">
                                                            <svg 
                                                                viewBox="0 0 10 20" 
                                                                className="h-3.5 w-2 fill-brand-primary text-brand-primary drop-shadow-[0_0_8px_rgba(var(--brand-primary-rgb),0.6)] cursor-help transition-transform group-hover/pointer:scale-110"
                                                            >
                                                                <path d="M0 2 L10 10 L0 18 Z" fill="currentColor" />
                                                            </svg>
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent hideArrow side="right" className="bg-stone-950 border-brand-primary/20 text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary px-3 py-1 shadow-2xl backdrop-blur-md">
                                                        Próximo horário
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>

                                            {/* Scanning Line Effect */}
                                            <div className="absolute left-10 right-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-brand-primary/20 to-transparent pointer-events-none z-10" />
                                        </>
                                    )}
                                    <div className="w-10 shrink-0 flex justify-center relative">
                                        <div className="absolute top-1/2 -translate-y-1/2 h-5 w-9 bg-stone-950 z-10 rounded-md" />
                                        <span className={cn(
                                            "tabular-nums tracking-tighter transition-all duration-300 relative z-20",
                                            apt && !isBlocked && !isLiberado 
                                                ? "text-xs font-black text-white" 
                                                : isUnavailable ? "text-[10px] font-bold text-stone-700" : "text-[10px] font-bold text-stone-600"
                                        )}>
                                            {time}
                                        </span>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        {apt && !isBlocked && !isLiberado ? (
                                            <div className={cn(
                                                "border transition-all group relative overflow-hidden h-16 flex items-center rounded-2xl p-2 px-3",
                                                apt.status === 'completed' 
                                                    ? "bg-emerald-500/[0.04] border-emerald-500/10 hover:bg-emerald-500/[0.06] hover:border-emerald-500/20 shadow-inner shadow-emerald-500/[0.02]" 
                                                    : "bg-stone-900/40 border-white/[0.03] hover:bg-stone-900/60 hover:border-white/[0.08]"
                                            )}>
                                                <div className="flex items-center justify-between w-full gap-3">
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
                                                                href={`https://wa.me/${apt.phone?.replace(/\D/g, '')}`} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer" 
                                                                className="h-8 w-8 rounded-lg bg-stone-950 flex items-center justify-center text-green-500 border border-white/5 hover:bg-green-500/10 hover:border-green-500/20 transition-all shadow-sm"
                                                            >
                                                                <MessageCircle className="h-4 w-4" />
                                                            </a>
                                                            
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <button className="h-8 w-8 rounded-lg bg-stone-950 flex items-center justify-center text-stone-600 hover:text-white border border-white/5 hover:border-white/10 transition-all outline-none">
                                                                        <MoreVertical className="h-4 w-4" />
                                                                    </button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent 
                                                                    align="end" 
                                                                    sideOffset={4}
                                                                    className="w-48 bg-stone-950 border border-white/10 rounded-2xl p-1 shadow-2xl"
                                                                >
                                                                    {!apt.customerId && (
                                                                        <DropdownMenuItem 
                                                                            onClick={() => { setClientToSave(apt); setIsSaveClientModalOpen(true); }}
                                                                            className="rounded-xl focus:bg-stone-900 text-xs gap-2 py-2"
                                                                        >
                                                                            <UserPlus className="h-3.5 w-3.5" /> Salvar Cliente
                                                                        </DropdownMenuItem>
                                                                    )}
                                                                    <DropdownMenuItem 
                                                                        onClick={() => { setEditingAppointment(apt); setIsAddModalOpen(true); }} 
                                                                        className="rounded-xl focus:bg-stone-900 text-xs gap-2 py-2"
                                                                    >
                                                                        <Pencil className="h-3.5 w-3.5" /> Editar Dados
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem 
                                                                        onClick={() => confirmAppointment(time)} 
                                                                        className="rounded-xl focus:bg-stone-900 text-xs gap-2 py-2"
                                                                    >
                                                                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> Confirmar Presença
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem 
                                                                        onClick={() => handleDelete(apt.id)} 
                                                                        className="rounded-xl focus:bg-stone-900 text-xs gap-2 py-2 text-red-500"
                                                                    >
                                                                        <Trash2 className="h-3.5 w-3.5" /> Excluir
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className={cn(
                                                "border transition-all group relative overflow-hidden h-16 flex items-center rounded-2xl p-2 px-4 justify-between",
                                                isBlocked 
                                                    ? "bg-red-500/[0.03] border-red-500/10 hover:border-red-500/20 shadow-inner" 
                                                    : isUnavailable
                                                        ? "bg-stone-900/10 border-white/[0.03] hover:bg-stone-900/30 hover:border-white/5"
                                                        : "bg-stone-900/20 border-white/[0.03] hover:bg-stone-900/40 hover:border-white/[0.08]"
                                            )}>
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "h-8 w-8 rounded-full border flex items-center justify-center shrink-0 transition-all",
                                                        isBlocked ? "bg-red-500/10 border-red-500/20 text-red-500" : 
                                                        isUnavailable ? "bg-stone-950 border-white/5 text-stone-500 group-hover:text-amber-500" :
                                                        "bg-stone-950 border-white/5 text-stone-600 group-hover:border-brand-gold/20 group-hover:text-brand-gold"
                                                    )}>
                                                        {isBlocked ? <XCircle className="h-4 w-4" /> : isUnavailable ? <AlertCircle className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                                                    </div>
                                                    <div>
                                                        <span className={cn(
                                                            "text-[10px] font-black uppercase tracking-widest block mb-0.5",
                                                            isBlocked ? "text-red-500/70" : 
                                                            isUnavailable ? "text-stone-500 group-hover:text-stone-400" :
                                                            "text-stone-600 group-hover:text-stone-300 transition-colors"
                                                        )}>
                                                            {isBlocked ? "Horário Bloqueado" : isUnavailable ? "Fora do Horário" : "Horário Livre"}
                                                        </span>
                                                        <span className={cn(
                                                            "text-[9px] font-bold",
                                                            isBlocked ? "text-red-500/40" : 
                                                            isUnavailable ? "text-stone-700 group-hover:text-stone-600" :
                                                            "text-stone-700"
                                                        )}>
                                                            {isBlocked ? "Indisponível para clientes" : isUnavailable ? "Liberação manual necessária" : "Disponível para agendamento"}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {isUnavailable ? (
                                                        <button 
                                                            onClick={() => toggleSlot(time)}
                                                            className="h-8 px-4 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 cursor-pointer shadow-lg bg-amber-500/20 text-amber-500 border border-amber-500/30 hover:bg-amber-600 hover:text-white"
                                                        >
                                                            Liberar Horário
                                                        </button>
                                                    ) : (
                                                        <button 
                                                            onClick={() => { setActiveTime(time); setIsAddModalOpen(true); }}
                                                            className="h-8 px-4 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 cursor-pointer shadow-lg bg-brand-gold/10 text-brand-gold border border-brand-gold/20 hover:bg-brand-gold hover:text-stone-950"
                                                        >
                                                            Agendar
                                                        </button>
                                                    )}
                                                    
                                                    <button 
                                                        onClick={() => toggleSlot(time)}
                                                        className={cn(
                                                            "h-8 w-8 rounded-lg flex items-center justify-center transition-all border border-white/5 opacity-0 group-hover:opacity-100",
                                                            isBlocked 
                                                                ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white" 
                                                                : "bg-stone-950 text-stone-600 hover:text-red-500 hover:bg-red-500/10"
                                                        )}
                                                        title={isBlocked ? "Liberar Horário" : "Bloquear Horário"}
                                                    >
                                                        {isBlocked || isLiberado ? <CheckCircle2 className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                        </div>
                    </TooltipProvider>
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
            <BusinessHoursModal 
                isOpen={isBusinessHoursModalOpen}
                onClose={() => setIsBusinessHoursModalOpen(false)}
                tenant={tenant}
                onSuccess={(updatedTenant) => {
                    setTenant(updatedTenant)
                    setIsBusinessHoursModalOpen(false)
                }}
            />
        </div>
    )
}
