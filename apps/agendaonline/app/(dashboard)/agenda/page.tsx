"use client"

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { cn } from "@/lib/utils"
import {
    CalendarDays, Clock, CheckCircle2, XCircle, AlertCircle, Plus, ChevronLeft, ChevronRight,
    MessageCircle, MoreVertical, Filter, UserPlus, TrendingUp, Users, Calendar as CalendarIcon, ChevronDown,
    Pencil, Trash2, Smartphone, X, LayoutGrid, Play, CalendarSearch, Zap, Lock
} from "lucide-react"
import { toast } from "sonner"
import { DesktopDetailsPanel, DesktopNextActionsPanel, DesktopOccupationCard, DesktopMiniCalendar, DesktopDaySummary, DesktopFreeSlots } from "./components"
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

/* â”€â”€â”€ Static Constants â”€â”€â”€ */

const MONTH_NAMES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
const WEEKDAYS = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÃB"]

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
    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000)
        return () => clearInterval(timer)
    }, [])
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
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false)
    const datePickerRef = useRef<HTMLDivElement>(null)

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

    const fetchAppointments = async (tId: string, specificDate?: string) => {
        const res = await getAppointmentsByTenantAction(tId)
        if (res.success && res.appointments) {
            const serverGrouped: Record<string, any[]> = {}
                res.appointments.forEach((apt: any) => {
                    const dateKey = apt.date.trim()
                    if (!serverGrouped[dateKey]) serverGrouped[dateKey] = []
                    
                    // Parse multiple services if they exist in notes as JSON
                    const isJsonNotes = apt.notes?.startsWith('{"serviceIds"');
                    let serviceIds = [apt.serviceId].filter(Boolean);
                    let displayNotes = apt.notes;

                    if (isJsonNotes) {
                        try {
                            const data = JSON.parse(apt.notes);
                            serviceIds = data.serviceIds || serviceIds;
                            displayNotes = data.displayText || "";
                        } catch (e) {}
                    }

                    const selectedServices = serviceIds.map(id => services.find(s => s.id === id)).filter(Boolean);
                    const totalPrice = selectedServices.reduce((acc, s) => acc + (parseFloat(s.price) || 0), 0);
                    const allServiceNames = selectedServices.map(s => s.name);
                    
                    serverGrouped[dateKey].push({
                        id: apt.id,
                        time: apt.time.split(':').slice(0, 2).join(':'), // Normalize to HH:MM
                        name: apt.customerName || "Cliente",
                        phone: apt.customerPhone || "",
                        serviceId: apt.serviceId,
                        service: allServiceNames[0] || (apt.status === "blocked" ? "-" : "Serviço"),
                        allServices: allServiceNames,
                        status: apt.status as any,
                        price: totalPrice > 0 ? `R$ ${totalPrice.toFixed(0)}` : (apt.status === "blocked" ? "-" : "R$ 0"),
                        notes: displayNotes
                    })
                })
            
            setAppointments(prev => {
                const nextState = { ...prev }
                const datesToSync = specificDate ? [specificDate] : Object.keys(serverGrouped)
                
                datesToSync.forEach(date => {
                    const serverData = serverGrouped[date] || []
                    const currentData = prev[date] || []
                    
                    // MERGE LOGIC: 
                    // 1. We trust the server for IDs it returns.
                    // 2. We keep local optimistic ones that haven't been saved yet.
                    // 3. We keep local "stable" ones that the server might have missed due to replication lag (for a grace period).
                    
                    const merged = [...serverData]
                    
                    currentData.forEach(localApt => {
                        const existsInServer = serverData.some(s => s.id === localApt.id)
                        if (!existsInServer) {
                            // If it's optimistic, definitely keep it
                            if (localApt.isOptimistic) {
                                merged.push(localApt)
                            } else {
                                // If it was stable but now missing, it might be a deletion or lag.
                                // For now, let's trust the server if it's a specific fetch,
                                // but if it's a general fetch, we might want to be careful.
                                // Actually, let's add a "recentlySeen" check if needed, but for now
                                // let's just ensure we don't wipe everything if serverData is empty but currentData wasn't.
                                if (serverData.length === 0 && currentData.length > 0) {
                                    // Extreme safety: if server returns NOTHING for a day that HAD things, 
                                    // and we were only doing a quick sync, maybe it's a transient error.
                                    // But if we trust noStore(), we should trust the empty result.
                                }
                            }
                        }
                    })
                    
                    nextState[date] = merged.sort((a, b) => a.time.localeCompare(b.time))
                })
                
                return nextState
            })
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

    // â”€â”€ Metrics Calculation â”€â”€
    const todayAppointmentsCount = dayAppointments.filter(a => a.status === 'confirmed' || a.status === 'completed' || a.status === 'pending').length;
    
    const next7DaysCount = Object.entries(appointments).reduce((acc, [date, apts]) => {
        const d = new Date(date + 'T12:00:00');
        const now = new Date();
        now.setHours(0,0,0,0);
        const diff = (d.getTime() - now.getTime()) / (1000 * 3600 * 24);
        if (diff >= 0 && diff <= 7) {
            return acc + apts.filter(a => a.status === 'confirmed' || a.status === 'completed' || a.status === 'pending').length;
        }
        return acc;
    }, 0);

    const filteredTimeSlots = useMemo(() => {
        if (!tenant?.businessHours) return TIME_SLOTS;
        const dw = new Date(selectedDate + 'T12:00:00').getDay().toString();
        const conf = tenant.businessHours[dw];
        if (!conf?.isOpen) return [];
        const sM = parseInt(conf.start.split(':')[0]) * 60 + parseInt(conf.start.split(':')[1]);
        const eM = parseInt(conf.end.split(':')[0]) * 60 + parseInt(conf.end.split(':')[1]);
        return TIME_SLOTS.filter(t => {
            const [h, m] = t.split(':').map(Number);
            const mins = h * 60 + m;
            return mins >= sM && mins < eM;
        });
    }, [selectedDate, tenant?.businessHours]);

    // Include out-of-hours slots that have appointments (manually opened or blocked)
    const visibleTimeSlots = useMemo(() => {
        const extra = dayAppointments
            .filter(a => !filteredTimeSlots.includes(a.time))
            .map(a => a.time);
        return [...new Set([...filteredTimeSlots, ...extra])].sort();
    }, [filteredTimeSlots, dayAppointments]);

    const freeSlotCount = useMemo(() => {
        let count = 0;
        const sortedVisible = [...new Set([...filteredTimeSlots, ...dayAppointments.map(a => a.time)])].sort();
        
        sortedVisible.forEach(time => {
            const apt = dayAppointments.find(a => a.time === time);
            const isBlocked = apt?.status === 'blocked';
            const isLiberado = apt?.status === 'liberado';
            const isOpenByConfig = filteredTimeSlots.includes(time);
            
            const isUnavailable = !isOpenByConfig && !isLiberado;
            
            if (!isUnavailable && !isBlocked && (!apt || isLiberado)) {
                count++;
            }
        });
        return count;
    }, [filteredTimeSlots, dayAppointments]);

    const occupancyRate = useMemo(() => {
        const confirmed = dayAppointments.filter(a => a.status === 'confirmed').length;
        const pending = dayAppointments.filter(a => a.status === 'pending').length;
        const completed = dayAppointments.filter(a => a.status === 'completed').length;
        const totalApts = confirmed + pending + completed;
        
        const totalSlots = totalApts + freeSlotCount;
        if (totalSlots === 0) return "0%";
        
        const rate = Math.round((totalApts / totalSlots) * 100);
        return `${Math.min(100, Math.max(0, rate))}%`;
    }, [dayAppointments, freeSlotCount]);

    // ── Mobile-First Computed Values ──
    const occupancyNumber = parseInt(occupancyRate) || 0;

    const datePickerDays = useMemo(() => {
        const days: { date: Date; dateKey: string; dayNum: number; dayName: string; isToday: boolean }[] = [];
        const today = new Date();
        today.setHours(12, 0, 0, 0);
        for (let i = -3; i <= 10; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() + i);
            const dk = d.toISOString().split('T')[0];
            days.push({
                date: d,
                dateKey: dk,
                dayNum: d.getDate(),
                dayName: WEEKDAYS[d.getDay()],
                isToday: i === 0
            });
        }
        return days;
    }, []);

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

        // Optimistic Update using functional state
        setAppointments(prev => {
            const currentData = prev[selectedDate] || [];
            const existingApt = currentData.find(a => a.time === time);
            
            if (existingApt) {
                if (existingApt.status === "blocked" || existingApt.status === "liberado") {
                    return {
                        ...prev,
                        [selectedDate]: currentData.filter(a => a.time !== time)
                    };
                }
                return prev; // Don't toggle booked slots
            } else {
                const isOpenByConfig = isTimeOpen(selectedDate, time);
                const status = isOpenByConfig ? "blocked" : "liberado";
                const customerName = isOpenByConfig ? "Bloqueio Manual" : "Liberado Manualmente";
                
                return {
                    ...prev,
                    [selectedDate]: [...currentData, { 
                        id: `opt-${Date.now()}`, 
                        time, 
                        name: customerName, 
                        status: status as any,
                        isOptimistic: true,
                        service: "-",
                        price: "-"
                    }].sort((a, b) => a.time.localeCompare(b.time))
                };
            }
        });

        try {
            const currentDayApts = appointments[selectedDate] || [];
            const existingApt = currentDayApts.find(a => a.time === time);

            if (existingApt) {
                if (existingApt.status === "blocked" || existingApt.status === "liberado") {
                    await deleteAppointmentAction(existingApt.id, tenantId);
                }
            } else {
                const isOpenByConfig = isTimeOpen(selectedDate, time);
                const status = isOpenByConfig ? "blocked" : "liberado";
                const customerName = isOpenByConfig ? "Bloqueio Manual" : "Liberado Manualmente";

                await createPublicAppointmentAction({
                    tenantId, customerName, customerPhone: "", date: selectedDate, time, status
                } as any);
            }
            
            setTimeout(() => {
                fetchAppointments(tenantId, selectedDate);
            }, 1500);
        } catch (error) {
            toast.error("Erro ao atualizar status do horário.");
            fetchAppointments(tenantId, selectedDate);
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
        setIsAddModalOpen(false)
        setEditingAppointment(null)

        if (!tenantId) return;

        // Force optimistic update with proper formatting and flag
        const formattedApt = {
            id: newApt.id,
            time: newApt.time,
            name: newApt.customerName || "Cliente",
            phone: newApt.customerPhone || "",
            service: services.find(s => s.id === newApt.serviceId)?.name || (newApt.status === "blocked" ? "-" : "Serviço"),
            status: newApt.status as any,
            isOptimistic: true,
            price: services.find(s => s.id === newApt.serviceId)?.price 
                ? `R$ ${parseFloat(services.find(s => s.id === newApt.serviceId).price).toFixed(0)}` 
                : (newApt.status === "blocked" ? "-" : "R$ 0"),
            notes: newApt.notes || ""
        };

        const day = newApt.date;
        setAppointments(prev => {
            const currentDayApts = prev[day] || [];
            const filtered = currentDayApts.filter(a => a.id !== newApt.id);
            const newList = [...filtered, formattedApt].sort((a, b) => a.time.localeCompare(b.time));
            return {
                ...prev,
                [day]: newList
            };
        });

        // Delay background sync slightly more to ensure DB propagation
        setTimeout(() => {
            fetchAppointments(tenantId, day);
        }, 1200);
        
        toast.success("Agendamento processado!");
    };

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
            name: apt.name,
            phone: apt.phone,
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

    // ── Desktop-specific state ──
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null)

    // Auto-select first appointment when day changes
    useEffect(() => {
        const realApts = dayAppointments.filter(a => a.status !== 'blocked' && a.status !== 'liberado')
        if (realApts.length > 0 && !selectedAppointment) {
            setSelectedAppointment(realApts[0])
        } else if (realApts.length === 0) {
            setSelectedAppointment(null)
        }
    }, [selectedDate, dayAppointments.length])

    // Day summary stats for desktop
    const daySummary = useMemo(() => {
        const confirmed = dayAppointments.filter(a => a.status === 'confirmed').length
        const pending = dayAppointments.filter(a => a.status === 'pending').length
        const blocked = dayAppointments.filter(a => a.status === 'blocked').length
        const completed = dayAppointments.filter(a => a.status === 'completed').length
        const total = confirmed + pending + completed
        return { total, confirmed, pending, blocked, completed, free: freeSlotCount }
    }, [dayAppointments, freeSlotCount])

    // Free time slots list for desktop sidebar
    const freeTimeSlots = useMemo(() => {
        return filteredTimeSlots.filter(time => !dayAppointments.some(a => a.time === time))
    }, [filteredTimeSlots, dayAppointments])

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col animate-in fade-in duration-700 overflow-hidden">

            {/* ═══════════════════════════════════════════════════════
                DESKTOP LAYOUT (≥ lg) — 3-column grid
               ═══════════════════════════════════════════════════════ */}
            <div className="hidden lg:flex flex-col h-full overflow-hidden">
                {/* Desktop Header */}
                <div className="shrink-0 flex items-center justify-between px-2 py-3 gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 rounded-xl bg-stone-900 border border-white/5 flex items-center justify-center shrink-0">
                            <CalendarDays className="h-5 w-5 text-brand-primary" />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-xl font-bold text-foreground leading-tight" style={{ fontFamily: 'var(--font-serif)' }}>Sua Agenda</h2>
                            <p className="text-[11px] text-stone-500 font-medium">Gerencie seus horários e atendimentos com eficiência.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => setIsBusinessHoursModalOpen(true)} className="h-9 px-4 rounded-xl border border-stone-800 bg-stone-900/40 text-stone-300 hover:text-white hover:bg-stone-800 transition-all flex items-center gap-2 text-xs font-semibold cursor-pointer">
                            <Clock className="h-4 w-4" /> Funcionamento
                        </button>
                        <button onClick={() => setIsCalendarModalOpen(true)} className="h-9 px-4 rounded-xl border border-stone-800 bg-stone-900/40 text-stone-300 hover:text-white hover:bg-stone-800 transition-all flex items-center gap-2 text-xs font-semibold cursor-pointer">
                            <Filter className="h-4 w-4" /> Filtrar
                        </button>
                        <button onClick={() => { setActiveTime(filteredTimeSlots[0] || TIME_SLOTS[0]); setIsAddModalOpen(true); }} className="h-9 px-4 rounded-xl font-bold shadow-lg shadow-brand-secondary/20 bg-brand-gold text-stone-950 transition-all hover:scale-[1.02] text-xs flex items-center gap-2 cursor-pointer">
                            <Plus className="h-4 w-4" /> Novo Agendamento <ChevronDown className="h-3.5 w-3.5 opacity-60 ml-0.5" />
                        </button>
                    </div>
                </div>

                {/* Desktop 3-column body */}
                <div className="flex-1 min-h-0 grid grid-cols-[minmax(300px,360px)_minmax(0,1fr)_minmax(300px,360px)] gap-4 px-2 pb-2">
                    {/* ── CENTER COLUMN (Visual): Timeline ── */}
                    <div className="flex flex-col min-h-0 gap-4 relative order-2">
                        {/* Date picker Card */}
                        <div className="shrink-0 h-[116px] rounded-2xl border border-white/5 bg-stone-900/30 flex items-center shadow-lg relative overflow-hidden">
                            <button className="w-14 h-full flex items-center justify-center text-stone-500 hover:text-stone-300 bg-stone-900/20 hover:bg-stone-800/30 transition-all shrink-0 border-r border-white/5 cursor-pointer">
                                <ChevronLeft className="h-6 w-6" />
                            </button>
                            
                            <div className="flex-1 flex justify-around items-center px-4 gap-1">
                                {datePickerDays.slice(0, 7).map((day, i) => {
                                    const isSelected = day.dateKey === selectedDate
                                    const apts = appointments[day.dateKey] || []
                                    const hasApts = apts.some(a => a.status === 'confirmed' || a.status === 'completed' || a.status === 'pending')
                                    const isBlocked = isDayFullyBlocked(day.dateKey)
                                    
                                    return (
                                        <React.Fragment key={day.dateKey}>
                                            <button onClick={() => { setSelectedDate(day.dateKey); setSelectedAppointment(null); }}
                                                className={cn(
                                                    "flex flex-col items-center justify-center flex-1 min-w-0 max-w-[88px] h-[100px] rounded-[18px] transition-all cursor-pointer border relative overflow-hidden",
                                                    isSelected ? "bg-brand-gold/[0.04] border-brand-gold/30 shadow-[inset_0_0_20px_rgba(245,204,112,0.03)]" :
                                                        isBlocked ? "border-transparent opacity-50" :
                                                            "border-transparent hover:bg-white/[0.02]"
                                                )}>
                                                <span className={cn("text-[9px] 2xl:text-[11px] font-bold tracking-[0.1em] uppercase mb-1.5", isSelected ? "text-stone-300" : "text-stone-400")}>{day.dayName}</span>
                                                <span className={cn("text-[20px] 2xl:text-[28px] font-bold leading-none mb-2.5 transition-all", isSelected ? "text-white" : "text-stone-200")}>{day.dayNum}</span>
                                                
                                                <div className="flex gap-1.5 h-1.5">
                                                    {isBlocked ? <div className="h-1.5 w-1.5 rounded-full bg-red-500/60" /> :
                                                        isSelected ? (
                                                            <div className="h-1.5 w-1.5 rounded-full bg-brand-gold shadow-[0_0_6px_rgba(245,204,112,0.6)]" />
                                                        ) : hasApts ? (
                                                            <>
                                                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                            </>
                                                        ) : (
                                                            <div className="h-1.5 w-1.5 rounded-full bg-stone-600" />
                                                        )}
                                                </div>
                                            </button>
                                            
                                            {i < 6 && (
                                                <div className="w-[1px] h-14 bg-gradient-to-b from-transparent via-stone-800/40 to-transparent opacity-50" />
                                            )}
                                        </React.Fragment>
                                    )
                                })}
                            </div>

                            <button className="w-14 h-full flex items-center justify-center text-stone-500 hover:text-stone-300 bg-stone-900/20 hover:bg-stone-800/30 transition-all shrink-0 border-l border-white/5 cursor-pointer">
                                <ChevronRight className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Timeline Card */}
                        <div className="flex-1 flex flex-col min-h-0 rounded-2xl border border-white/5 bg-stone-900/30 overflow-hidden shadow-lg relative">
                            {/* Selected Date Header */}
                            <div className="shrink-0 px-8 pt-7 pb-4">
                                <h3 className="text-[11px] font-bold text-stone-300 uppercase tracking-widest">
                                    {new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(selectedDate + "T12:00:00"))}
                                </h3>
                            </div>
                            
                            {/* Timeline scroll */}
                            <div className="flex-1 min-h-0 overflow-hidden relative">
                                <div className="absolute left-[57px] top-4 bottom-4 w-px bg-stone-800/30 pointer-events-none z-0" />
                                <TooltipProvider>
                                    <div ref={timelineRef} onClick={() => setSelectedAppointment(null)} className="h-full overflow-y-auto px-8 py-4 space-y-0 custom-scrollbar scroll-smooth relative z-10">
                                    {visibleTimeSlots.map((time) => {
                                        const isToday = selectedDate === currentTime.toISOString().split('T')[0]
                                        const nowTime = currentTime.getHours() * 60 + currentTime.getMinutes()
                                        const [slotH, slotM] = time.split(':').map(Number)
                                        const slotMins = slotH * 60 + slotM
                                        const isCurrentSlot = isToday && slotMins <= nowTime && slotMins + 60 > nowTime
                                        const apt = dayAppointments.find(a => a.time === time)
                                        const isOpenByConfig = isTimeOpen(selectedDate, time)
                                        const isBlocked = apt?.status === "blocked"
                                        const isLiberado = apt?.status === "liberado"
                                        const isUnavailable = !isOpenByConfig && !isLiberado
                                        return (
                                            <div key={time} id={`slot-${time}`} className={cn("flex gap-8 items-start transition-all duration-300 relative group/row", isUnavailable && !apt ? "opacity-50" : "opacity-100")}>
                                                <div className="w-[50px] shrink-0 flex items-center justify-center pt-3 relative z-10">
                                                    <span className={cn("text-[13px] font-medium tabular-nums", isCurrentSlot ? "text-brand-primary" : "text-stone-300")}>{time}</span>
                                                </div>
                                                <div className="flex-1 min-w-0 pb-3">
                                                    {apt && !isBlocked && !isLiberado ? (
                                                        <div onClick={(e) => { e.stopPropagation(); setSelectedAppointment(apt); }} className={cn(
                                                            "rounded-[14px] p-4 transition-all cursor-pointer border-y border-r border-white/[0.04]",
                                                            selectedAppointment?.id === apt.id ? "ring-1 ring-brand-primary/40 shadow-[0_0_15px_rgba(245,204,112,0.1)]" : "",
                                                            apt.status === 'completed' ? "bg-gradient-to-r from-emerald-500/10 to-transparent border-l-4 border-l-emerald-500" :
                                                                apt.status === 'confirmed' ? "bg-gradient-to-r from-emerald-500/10 to-transparent border-l-4 border-l-emerald-500" :
                                                                    "bg-gradient-to-r from-amber-500/10 to-transparent border-l-4 border-l-amber-500"
                                                        )}>
                                                            <div className="flex items-center justify-between gap-3">
                                                                <div className="flex flex-col min-w-0 flex-1">
                                                                    <h4 className="text-[15px] font-bold text-white truncate mb-0.5">{apt.name}</h4>
                                                                    <p className="text-[12px] text-stone-400 truncate">{apt.service} • <span className="text-stone-300">{apt.price}</span></p>
                                                                </div>
                                                                <div className="flex items-center gap-3 shrink-0">
                                                                    <div className={cn("text-[9px] font-bold uppercase px-2.5 py-1 rounded-sm tracking-wider",
                                                                        apt.status === 'completed' ? "text-emerald-400 bg-emerald-500/10" :
                                                                            apt.status === 'confirmed' ? "text-emerald-400 bg-emerald-500/10" :
                                                                                "text-amber-400 bg-amber-500/10"
                                                                    )}>{apt.status === 'completed' ? 'Concluído' : apt.status === 'confirmed' ? 'Confirmado' : 'Pendente'}</div>
                                                                    
                                                                    <div className="h-8 w-8 rounded-full overflow-hidden shrink-0 bg-stone-800 flex items-center justify-center text-[10px] font-bold text-stone-400 ml-1">
                                                                        {apt.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                                                                    </div>

                                                                    <DropdownMenu>
                                                                        <DropdownMenuTrigger asChild>
                                                                            <button onClick={e => e.stopPropagation()} className="h-8 w-8 rounded-full flex items-center justify-center text-stone-400 hover:text-white hover:bg-white/5 transition-all outline-none cursor-pointer">
                                                                                <MoreVertical className="h-5 w-5" />
                                                                            </button>
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent align="end" sideOffset={4} className="w-44 bg-stone-950 border border-white/10 rounded-xl p-1 shadow-2xl">
                                                                            <DropdownMenuItem onClick={() => handleEdit(apt)} className="rounded-lg text-xs gap-2 py-1.5 cursor-pointer"><Pencil className="h-3 w-3" /> Editar</DropdownMenuItem>
                                                                            <DropdownMenuItem onClick={() => confirmAppointment(time)} className="rounded-lg text-xs gap-2 py-1.5 cursor-pointer"><CheckCircle2 className="h-3 w-3 text-green-500" /> Confirmar</DropdownMenuItem>
                                                                            <DropdownMenuItem onClick={() => handleDelete(apt.id)} className="rounded-lg text-xs gap-2 py-1.5 text-red-500 cursor-pointer"><Trash2 className="h-3 w-3" /> Excluir</DropdownMenuItem>
                                                                        </DropdownMenuContent>
                                                                    </DropdownMenu>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : isBlocked ? (
                                                        <div className="rounded-[14px] p-4 bg-gradient-to-r from-red-500/10 to-transparent border-y border-r border-white/[0.04] border-l-4 border-l-red-500 flex items-center gap-4">
                                                            <div className="h-10 w-10 rounded-[10px] border border-red-500/20 flex items-center justify-center shrink-0 bg-red-500/5"><Lock className="h-4 w-4 text-red-500" /></div>
                                                            <div>
                                                                <p className="text-[13px] font-bold text-red-500 uppercase tracking-wider mb-0.5">Horário Bloqueado</p>
                                                                <p className="text-[12px] text-red-500/60">Indisponível para clientes</p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="rounded-[14px] p-3 pl-4 bg-stone-900/40 border border-white/5 hover:border-white/10 flex items-center justify-between group/empty transition-all">
                                                            <div className="flex items-center gap-4">
                                                                <div className="h-10 w-10 rounded-[10px] border border-dashed border-white/10 flex items-center justify-center text-stone-500">
                                                                    <LayoutGrid className="h-4 w-4 opacity-50" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-[13px] font-bold text-stone-400 uppercase tracking-wider mb-0.5">Horário Livre</p>
                                                                    <p className="text-[12px] text-stone-500">Disponível para agendamento</p>
                                                                </div>
                                                            </div>
                                                            <button onClick={() => { setActiveTime(time); setIsAddModalOpen(true); }} className="h-10 w-10 rounded-xl border border-white/5 bg-white/[0.02] text-stone-300 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer">
                                                                <Plus className="h-5 w-5" />
                                                            </button>
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
                </div>

                {/* ── RIGHT COLUMN (Visual): Details + States ── */}
                    <div className="flex flex-col gap-4 min-h-0 overflow-y-auto custom-scrollbar pr-1 order-3">
                        <DesktopDetailsPanel
                            apt={selectedAppointment}
                            onEdit={handleEdit}
                            onComplete={(a) => { setAppointmentToComplete(a); setIsCompleteModalOpen(true); }}
                            onDetails={(a) => { setAppointmentToComplete(a); setIsDetailsModalOpen(true); }}
                            onConfirm={confirmAppointment}
                            onDelete={handleDelete}
                            onSaveClient={(a) => { setClientToSave(a); setIsSaveClientModalOpen(true); }}
                        />
                        <DesktopOccupationCard summary={daySummary} />
                        <DesktopNextActionsPanel />
                    </div>

                    {/* ── LEFT COLUMN (Visual): Calendar + Summary + Free Slots ── */}
                    <div className="flex flex-col gap-4 min-h-0 overflow-y-auto custom-scrollbar pr-1 order-1">
                        <DesktopMiniCalendar
                            currentMonth={currentMonth}
                            setCurrentMonth={setCurrentMonth}
                            selectedDate={selectedDate}
                            setSelectedDate={(d) => { setSelectedDate(d); setSelectedAppointment(null); }}
                            appointments={appointments}
                            isDayFullyBlocked={isDayFullyBlocked}
                        />
                        <DesktopDaySummary summary={daySummary} />
                        <DesktopFreeSlots slots={freeTimeSlots} onAddAt={(time) => { setActiveTime(time); setIsAddModalOpen(true); }} />
                    </div>
                </div>
            </div>
            
            <div className="lg:hidden flex flex-col flex-1 min-h-0 h-full overflow-hidden">
            <div className="shrink-0 flex items-center justify-between px-2 py-3 gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-full border border-white/10 overflow-hidden shrink-0">
                        <div className="h-full w-full bg-stone-800 flex items-center justify-center text-xs font-bold text-stone-400">
                            {tenant?.name?.[0]?.toUpperCase() || "A"}
                        </div>
                    </div>
                    <div className="min-w-0">
                        <h2 className="text-[15px] font-bold text-foreground leading-tight truncate">Olá, Anderson</h2>
                        <p className="text-[11px] text-stone-500 font-medium tracking-tight capitalize">
                            {selectedDateObj.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={() => setIsCalendarModalOpen(true)}
                        className="h-10 w-10 rounded-full bg-stone-900/60 border border-white/5 text-stone-400 hover:text-white transition-all flex items-center justify-center cursor-pointer"
                        title="Calendário completo"
                    >
                        <Filter className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => { setActiveTime(filteredTimeSlots[0] || TIME_SLOTS[0]); setIsAddModalOpen(true); }}
                        className="h-10 w-10 rounded-full shadow-lg shadow-brand-secondary/20 bg-brand-gold text-stone-950 transition-all hover:scale-[1.02] flex items-center justify-center cursor-pointer"
                    >
                        <Plus className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* ═══ DATE PICKER HORIZONTAL (iOS-style) ═══ */}
            <div className="shrink-0 px-2 pb-3">
                <div ref={datePickerRef} className="flex gap-2 overflow-x-auto hide-scrollbar pb-1 snap-x snap-mandatory">
                    {datePickerDays.map((day) => {
                        const isSelected = day.dateKey === selectedDate;
                        const apts = appointments[day.dateKey] || [];
                        const hasApts = apts.some(a => a.status === 'confirmed' || a.status === 'completed' || a.status === 'pending');
                        const isBlocked = isDayFullyBlocked(day.dateKey);
                        const isOpen = isDateOpen(day.dateKey);
                        return (
                            <button
                                key={day.dateKey}
                                onClick={() => setSelectedDate(day.dateKey)}
                                className={cn(
                                    "flex flex-col items-center justify-center min-w-[54px] h-[72px] rounded-2xl transition-all snap-center cursor-pointer shrink-0 relative border",
                                    isSelected
                                        ? "bg-stone-900/80 border-brand-primary/50 text-brand-primary"
                                        : isBlocked
                                            ? "border-transparent text-stone-600"
                                            : !isOpen
                                                ? "border-transparent text-stone-600"
                                                : "border-transparent text-stone-400 hover:bg-stone-900/40"
                                )}
                            >
                                <span className={cn("text-[10px] font-bold uppercase tracking-wider", isSelected ? "text-brand-primary" : "text-stone-500")}>{day.dayName}</span>
                                <span className={cn("text-lg font-black leading-none mt-0.5", isSelected ? "text-foreground" : "text-stone-300")}>{day.dayNum}</span>
                                <div className="flex gap-1 mt-1.5">
                                    {isBlocked ? (
                                        <div className="h-1.5 w-1.5 rounded-full bg-red-500/60" />
                                    ) : hasApts ? (
                                        <>
                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                        </>
                                    ) : (
                                        <div className={cn("h-1.5 w-1.5 rounded-full", isSelected ? "bg-brand-primary" : "bg-stone-700")} />
                                    )}
                                </div>
                                {day.isToday && !isSelected && (
                                    <div className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-brand-primary border-2 border-stone-950" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ─── INSIGHT BAR ─── */}
            <div className="shrink-0 mx-1 mb-3 p-3 rounded-2xl bg-stone-900/40 border border-white/5 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                        <Zap className="h-3.5 w-3.5 text-brand-primary shrink-0" />
                        <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest truncate">
                            {occupancyNumber}% ocupado Â· {freeSlotCount} {freeSlotCount === 1 ? 'horário livre' : 'horários livres'}
                        </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-stone-800 overflow-hidden">
                        <div
                            className={cn("h-full rounded-full transition-all duration-700", occupancyNumber >= 80 ? "bg-gradient-to-r from-amber-500 to-red-500" : "bg-gradient-to-r from-emerald-500/80 to-brand-primary/80")}
                            style={{ width: `${Math.min(occupancyNumber, 100)}%` }}
                        />
                    </div>
                </div>
                <div className="text-right shrink-0">
                    <p className="text-lg font-bold text-foreground leading-none">{todayAppointmentsCount}</p>
                    <p className="text-[9px] text-stone-500 font-medium">agendados</p>
                </div>
            </div>

            {/* â•â•â• TIMELINE DO DIA (Core UX) â•â•â• */}
            <div className="flex-1 min-h-0 overflow-hidden flex flex-col relative">
                {/* Timeline vertical line */}
                <div className="absolute left-[29px] top-0 bottom-0 w-px bg-gradient-to-b from-brand-primary/30 via-brand-primary/10 to-transparent pointer-events-none z-0" />

                <TooltipProvider>
                    <div ref={timelineRef} className="flex-1 overflow-y-auto px-1 py-2 space-y-2 custom-scrollbar scroll-smooth relative z-10">
                        {visibleTimeSlots.map((time) => {
                            const isToday = selectedDate === currentTime.toISOString().split('T')[0];
                            const nowTime = currentTime.getHours() * 60 + currentTime.getMinutes();
                            const [slotH, slotM] = time.split(':').map(Number);
                            const slotMins = slotH * 60 + slotM;
                            const isCurrentSlot = isToday && slotMins <= nowTime && slotMins + 60 > nowTime;

                            const apt = dayAppointments.find(a => a.time === time);
                            const isOpenByConfig = isTimeOpen(selectedDate, time);
                            const isBlocked = apt?.status === "blocked";
                            const isLiberado = apt?.status === "liberado";
                            const isUnavailable = !isOpenByConfig && !isLiberado;

                            return (
                                <div key={time} id={`slot-${time}`} className={cn("flex gap-2 items-start transition-all duration-300 relative group/row", isUnavailable && !apt ? "opacity-50" : "opacity-100")}>
                                    {/* Time + dot */}
                                    <div className="w-[58px] shrink-0 flex items-center gap-1.5 pt-3 relative z-10">
                                        <div className={cn("h-2 w-2 rounded-full shrink-0 border-2 transition-all",
                                            isCurrentSlot ? "bg-brand-primary border-brand-primary shadow-[0_0_8px_rgba(245,204,112,0.4)]" :
                                            apt && !isBlocked && !isLiberado ? "bg-stone-600 border-stone-500" :
                                            isBlocked ? "bg-red-500/40 border-red-500/30" :
                                            "bg-stone-800 border-stone-700"
                                        )} />
                                        <span className={cn("text-[11px] font-bold tabular-nums tracking-tight",
                                            isCurrentSlot ? "text-brand-primary" :
                                            apt && !isBlocked && !isLiberado ? "text-foreground" :
                                            "text-stone-600"
                                        )}>{time}</span>
                                    </div>

                                    {/* Card */}
                                    <div className="flex-1 min-w-0">
                                        {apt && !isBlocked && !isLiberado ? (
                                            /* ── Appointment Card ── */
                                            <div className={cn(
                                                "border rounded-xl p-3 transition-all relative overflow-hidden group/card cursor-pointer active:scale-[0.98]",
                                                apt.status === 'completed'
                                                    ? "bg-emerald-500/[0.05] border-emerald-500/20"
                                                    : apt.status === 'confirmed'
                                                        ? "bg-gradient-to-r from-emerald-500/[0.08] to-emerald-500/[0.02] border-emerald-500/20"
                                                        : "bg-gradient-to-r from-amber-500/[0.08] to-amber-500/[0.02] border-amber-500/20"
                                            )} onClick={() => { setAppointmentToComplete(apt); apt.status === 'completed' ? setIsDetailsModalOpen(true) : setIsCompleteModalOpen(true); }}>
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="flex flex-col min-w-0 flex-1">
                                                        <h4 className="text-sm font-bold text-foreground truncate">{apt.name}</h4>
                                                        <p className="text-[11px] text-stone-400 truncate">{apt.service} • <span className="font-semibold">{apt.price}</span></p>
                                                    </div>
                                                    {/* Quick actions & Avatar */}
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <div className={cn("text-[9px] font-black uppercase px-2 py-1 rounded-full tracking-wider border",
                                                            apt.status === 'completed' ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" :
                                                                apt.status === 'confirmed' ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" :
                                                                    "text-amber-500 bg-amber-500/10 border-amber-500/20"
                                                        )}>{apt.status === 'completed' ? 'Concluído' : apt.status === 'confirmed' ? 'Confirmado' : 'Pendente'}</div>
                                                        
                                                        <div className="h-8 w-8 rounded-full overflow-hidden border border-white/10 shrink-0">
                                                            <div className="h-full w-full bg-stone-800 flex items-center justify-center text-[10px] font-bold text-stone-400">
                                                                {apt.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                                                            </div>
                                                        </div>

                                                        <div onClick={(e) => e.stopPropagation()}>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <button className="h-7 w-7 rounded-full flex items-center justify-center text-stone-400 hover:text-white hover:bg-white/5 transition-all outline-none cursor-pointer">
                                                                        <MoreVertical className="h-4 w-4" />
                                                                    </button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" sideOffset={4} className="w-48 bg-stone-950 border border-white/10 rounded-2xl p-1 shadow-2xl">
                                                                    {!apt.customerId && (
                                                                        <DropdownMenuItem onClick={() => { setClientToSave(apt); setIsSaveClientModalOpen(true); }} className="rounded-xl focus:bg-stone-900 text-xs gap-2 py-2">
                                                                            <UserPlus className="h-3.5 w-3.5" /> Salvar Cliente
                                                                        </DropdownMenuItem>
                                                                    )}
                                                                    <DropdownMenuItem onClick={() => handleEdit(apt)} className="rounded-xl focus:bg-stone-900 text-xs gap-2 py-2">
                                                                        <Pencil className="h-3.5 w-3.5" /> Editar
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => confirmAppointment(time)} className="rounded-xl focus:bg-stone-900 text-xs gap-2 py-2">
                                                                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> Confirmar
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleDelete(apt.id)} className="rounded-xl focus:bg-stone-900 text-xs gap-2 py-2 text-red-500">
                                                                        <Trash2 className="h-3.5 w-3.5" /> Excluir
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            /* ── Empty / Blocked / Unavailable slot ── */
                                            <div className={cn(
                                                "border rounded-xl p-3 transition-all flex items-center justify-between",
                                                isBlocked ? "bg-gradient-to-r from-red-500/[0.08] to-red-500/[0.02] border-red-500/20"
                                                    : isUnavailable ? "bg-stone-900/10 border-white/[0.02]"
                                                        : "bg-stone-900/40 border-white/5 hover:border-brand-primary/30"
                                            )}>
                                                <div className="flex items-center gap-4">
                                                    {isBlocked ? (
                                                        <div className="h-8 w-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                                                            <Lock className="h-4 w-4 text-red-500" />
                                                        </div>
                                                    ) : isUnavailable ? (
                                                        <div className="h-8 w-8 rounded-full bg-stone-900/50 border border-white/[0.05] flex items-center justify-center shrink-0">
                                                            <Clock className="h-4 w-4 text-stone-700" />
                                                        </div>
                                                    ) : (
                                                        <div className="h-8 w-8 rounded-full border border-dashed border-white/20 flex items-center justify-center text-stone-500 transition-all">
                                                            <Plus className="h-4 w-4" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className={cn("text-xs font-bold uppercase tracking-wider mb-0.5",
                                                            isBlocked ? "text-red-500" : isUnavailable ? "text-stone-600" : "text-stone-400"
                                                        )}>
                                                            {isBlocked ? "Horário Bloqueado" : isUnavailable ? "Fechado" : "Horário Livre"}
                                                        </p>
                                                        <p className={cn("text-[11px]",
                                                            isBlocked ? "text-red-500/60" : isUnavailable ? "text-stone-600" : "text-stone-500"
                                                        )}>
                                                            {isBlocked ? "Indisponível para clientes" : isUnavailable ? "Fora do horário de func." : "Disponível para agendamento"}
                                                        </p>
                                                    </div>
                                                </div>
                                                {!isBlocked && !isUnavailable && (
                                                    <button onClick={() => { setActiveTime(time); setIsAddModalOpen(true); }} className="h-8 w-8 rounded-full border border-white/10 bg-stone-900 text-stone-400 hover:text-brand-gold hover:border-brand-gold/30 hover:bg-brand-gold/10 flex items-center justify-center transition-all cursor-pointer">
                                                        <Plus className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </TooltipProvider>
            </div>

            {/* â•â•â• FAB â€” Floating Action Button â•â•â• */}
            <button
                onClick={() => { setActiveTime(filteredTimeSlots[0] || TIME_SLOTS[0]); setIsAddModalOpen(true); }}
                className="fixed bottom-24 right-5 z-50 h-14 w-14 rounded-full bg-brand-gold shadow-xl shadow-brand-secondary/30 flex items-center justify-center text-stone-950 hover:scale-110 active:scale-95 transition-all cursor-pointer sm:hidden"
                title="Novo Agendamento"
            >
                <Plus className="h-6 w-6" strokeWidth={2.5} />
            </button>
            </div>{/* end mobile wrapper */}

            {/* â•â•â• CALENDAR MODAL (Full Month) â•â•â• */}
            <Dialog open={isCalendarModalOpen} onOpenChange={setIsCalendarModalOpen}>
                <DialogContent className="bg-stone-950 border-white/10 rounded-3xl max-w-md p-6">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-black text-white flex items-center gap-2">
                            <CalendarIcon className="h-5 w-5 text-brand-primary" /> Calendário
                        </DialogTitle>
                        <DialogDescription className="text-stone-400 text-xs">
                            Selecione uma data para visualizar a agenda.
                        </DialogDescription>
                    </DialogHeader>
                    {/* Month navigation */}
                    <div className="flex items-center justify-between mt-4 mb-3">
                        <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="h-8 w-8 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-white transition-all cursor-pointer">
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="text-sm font-bold text-foreground">{MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
                        <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="h-8 w-8 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-white transition-all cursor-pointer">
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                    {/* Weekday headers */}
                    <div className="grid grid-cols-7 gap-1 mb-1">
                        {WEEKDAYS.map(d => <div key={d} className="text-center text-[9px] font-black text-stone-600 uppercase tracking-widest py-1">{d}</div>)}
                    </div>
                    {/* Days grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const dateKey = getDateKey(day);
                            const isSelected = dateKey === selectedDate;
                            const apts = appointments[dateKey] || [];
                            const isToday = dateKey === new Date().toISOString().split('T')[0];
                            const blocked = isDayFullyBlocked(dateKey);
                            return (
                                <button key={day} onClick={() => { setSelectedDate(dateKey); setIsCalendarModalOpen(false); }}
                                    className={cn(
                                        "h-9 w-full rounded-lg text-xs font-bold transition-all relative flex flex-col items-center justify-center gap-0.5 cursor-pointer",
                                        isSelected ? (blocked ? "bg-red-500/20 text-red-400" : "bg-brand-gold text-stone-950") :
                                            blocked ? "text-stone-600 bg-stone-900/30" : "text-stone-400 hover:bg-stone-800/50 hover:text-white"
                                    )}>
                                    <span>{day}</span>
                                    <div className="flex gap-0.5">
                                        {apts.slice(0, 2).map((a, idx) => (
                                            <div key={idx} className={cn("h-1 w-1 rounded-full",
                                                isSelected ? "bg-stone-950/30" :
                                                    a.status === 'completed' ? "bg-emerald-500" : a.status === 'confirmed' ? "bg-green-500" : a.status === 'pending' ? "bg-amber-400" : "bg-stone-600"
                                            )} />
                                        ))}
                                    </div>
                                    {isToday && !isSelected && <div className="absolute top-0.5 right-0.5 h-1 w-1 rounded-full bg-brand-primary" />}
                                </button>
                            );
                        })}
                    </div>
                </DialogContent>
            </Dialog>


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
