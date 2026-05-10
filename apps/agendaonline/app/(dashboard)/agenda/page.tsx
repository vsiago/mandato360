"use client"

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { createPortal } from "react-dom"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import {
    CalendarDays, Clock, CheckCircle2, XCircle, AlertCircle, Plus, ChevronLeft, ChevronRight,
    MessageCircle, MoreVertical, Filter, UserPlus, TrendingUp, Users, Calendar as CalendarIcon, ChevronDown,
    Pencil, Trash2, Smartphone, X, LayoutGrid, Play, CalendarSearch, Zap, Lock, CalendarOff, Unlock,
    Briefcase, Scale, Banknote
} from "lucide-react"
import { toast } from "sonner"
import { DesktopDetailsPanel, DesktopNextActionsPanel, DesktopOccupationCard, DesktopMiniCalendar, DesktopDaySummary, DesktopFreeSlots } from "./components"
import { Button } from "@/components/ui/button"
import { AppointmentModal } from "@/components/AppointmentModal"
import { RescheduleModal } from "@/components/RescheduleModal"
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
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer"
import { useMediaQuery } from "@/hooks/use-media-query"
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
    const [currentTime, setCurrentTime] = useState(new Date())
    const [isClientMounted, setIsClientMounted] = useState(false)

    useEffect(() => {
        setIsClientMounted(true)
        const timer = setInterval(() => setCurrentTime(new Date()), 60000)
        return () => clearInterval(timer)
    }, [])
    const [appointments, setAppointments] = useState<Record<string, any[]>>({})
    const [services, setServices] = useState<any[]>([])
    const [tenantId, setTenantId] = useState<string | null>(null)
    const [isIdling, setIsIdling] = useState(true)
    const [tenant, setTenant] = useState<any>(null)
    const [appointmentMode, setAppointmentMode] = useState<string>("standard")
    const lastKnownPendingIds = useRef<Set<string>>(new Set())
    const initialLoadDone = useRef(false)

    // ── Desktop-specific state ──
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)



    // Modal state
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false)
    const [appointmentToReschedule, setAppointmentToReschedule] = useState<any>(null)
    const [activeTime, setActiveTime] = useState("")
    const [editingAppointment, setEditingAppointment] = useState<any>(null)
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false)
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
    const [isPixModalOpen, setIsPixModalOpen] = useState(false)
    const [isSaveClientModalOpen, setIsSaveClientModalOpen] = useState(false)
    const [appointmentToComplete, setAppointmentToComplete] = useState<any>(null)
    const [clientToSave, setClientToSave] = useState<any>(null)
    const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const isXL = useMediaQuery("(min-width: 1280px)")

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
                const isJsonNotes = apt.notes?.startsWith('{');
                let serviceIds = [apt.serviceId].filter(Boolean);
                let displayNotes = apt.notes;
                let parsedServices: any[] = [];

                if (isJsonNotes) {
                    try {
                        const data = JSON.parse(apt.notes);
                        serviceIds = data.serviceIds || serviceIds;
                        displayNotes = data.observations || data.displayText || "";
                        if (data.services && Array.isArray(data.services)) {
                            parsedServices = data.services;
                        }
                    } catch (e) { }
                }

                const selectedServicesData = parsedServices.length > 0 ? parsedServices.map(s => ({
                    id: s.id,
                    name: s.name,
                    price: s.price ? Number(s.price) : 0
                })) : serviceIds.map(id => {
                    const fromState = services.find(s => s.id === id);
                    if (fromState) return { id: fromState.id, name: fromState.name, price: Number(fromState.price) || 0 };
                    
                    // Fallback to joined service from DB
                    if (apt.service && apt.service.id === id) {
                        return {
                            id: apt.service.id,
                            name: apt.service.name,
                            price: apt.service.price ? Number(apt.service.price) : 0
                        };
                    }
                    return null;
                }).filter(Boolean);
                
                const totalPrice = selectedServicesData.reduce((acc, s) => acc + (s?.price || 0), 0);
                const allServiceNames = selectedServicesData.map(s => s?.name);
                
                // Prioritize the total value saved in the financial block
                let displayPrice = totalPrice > 0 ? `R$ ${totalPrice.toFixed(0)}` : (apt.status === "blocked" ? "-" : "R$ 0");
                if (isJsonNotes) {
                    try {
                        const data = JSON.parse(apt.notes);
                        if (data.financeiro?.valor) {
                            displayPrice = `R$ ${Number(data.financeiro.valor).toFixed(0)}`;
                        }
                    } catch (e) {}
                }

                serverGrouped[dateKey].push({
                    id: apt.id,
                    time: apt.time.split(':').slice(0, 2).join(':'), // Normalize to HH:MM
                    name: apt.customerName || "Cliente",
                    phone: apt.customerPhone || "",
                    date: dateKey,
                    serviceId: apt.serviceId,
                    serviceIds: serviceIds,
                    service: allServiceNames[0] || (apt.status === "blocked" ? "-" : "Serviço"),
                    allServices: allServiceNames,
                    allServicesData: selectedServicesData,
                    status: apt.status as any,
                    price: displayPrice,
                    notes: displayNotes,
                    rawNotes: apt.notes,
                    customFields: apt.customFields
                })
            })

            const playNotificationSound = () => {
                try {
                    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
                    audio.volume = 0.5;
                    audio.play();
                } catch (e) {
                    console.error("Failed to play notification sound:", e);
                }
            };

            // Notification Logic for new pending appointments
            if (initialLoadDone.current) {
                let hasNewPending = false;
                res.appointments.forEach((apt: any) => {
                    if (apt.status === 'pending' && !lastKnownPendingIds.current.has(apt.id)) {
                        hasNewPending = true;
                        toast.success("Novo agendamento!", {
                            description: `${apt.customerName} solicitou para ${apt.date} às ${apt.time}`,
                            action: {
                                label: "Ver agora",
                                onClick: () => {
                                    setSelectedDate(apt.date.trim());
                                    // Optionally scroll to slot logic if needed
                                }
                            }
                        });
                    }
                });
                if (hasNewPending) playNotificationSound();
            } else {
                initialLoadDone.current = true;
            }

            const currentPendingIds = new Set(res.appointments.filter((a: any) => a.status === 'pending').map((a: any) => a.id));
            lastKnownPendingIds.current = currentPendingIds;

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

    // ── Metrics Calculation ──
    const todayAppointmentsCount = dayAppointments.filter(a => a.status === 'confirmed' || a.status === 'completed' || a.status === 'pending').length;

    const next7DaysCount = Object.entries(appointments).reduce((acc, [date, apts]) => {
        const d = new Date(date + 'T12:00:00');
        const now = new Date();
        now.setHours(0, 0, 0, 0);
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
                
                // Update selectedAppointment to reflect change immediately in the details panel
                setSelectedAppointment(prev => prev && (prev.id === (apt as any).id || prev.time === time) ? { ...prev, status: "confirmed" } : prev);
                
                toast.success("Agendamento confirmado!");
            }
        }
    };

    const handleConfirmAll = async () => {
        if (!tenantId) return;
        const pending = Object.values(appointments).flat().filter(a => a.status === 'pending');
        if (pending.length === 0) return;

        setLoading(true);
        try {
            for (const apt of pending) {
                await updateAppointmentStatusAction(apt.id, tenantId, "confirmed");
            }
            toast.success(`${pending.length} agendamentos confirmados!`);
            fetchAppointments(tenantId);
        } catch (error) {
            toast.error("Erro ao confirmar agendamentos.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddSuccess = (newApt: any) => {
        setIsAddModalOpen(false)
        setEditingAppointment(null)

        if (!tenantId) return;

        // Parse multiple services if they exist in notes as JSON
        const isJsonNotes = newApt.notes?.startsWith('{');
        let serviceIds = [newApt.serviceId].filter(Boolean);
        let displayNotes = newApt.notes;

        let parsedServices: any[] = [];

        if (isJsonNotes) {
            try {
                const data = JSON.parse(newApt.notes);
                serviceIds = data.serviceIds || serviceIds;
                displayNotes = data.observations || data.displayText || "";
                if (data.services && Array.isArray(data.services)) {
                    parsedServices = data.services;
                }
            } catch (e) { }
        }

        const selectedServicesData = parsedServices.length > 0 ? parsedServices.map(s => ({
            id: s.id,
            name: s.name,
            price: s.price ? Number(s.price) : 0
        })) : serviceIds.map(id => {
            const srv = services.find(s => s.id === id);
            return srv ? { id: srv.id, name: srv.name, price: Number(srv.price) || 0 } : null;
        }).filter(Boolean);

        const totalPrice = selectedServicesData.reduce((acc, s) => acc + (s?.price || 0), 0);
        const allServiceNames = selectedServicesData.map(s => s?.name);

        // Prioritize the total value saved in the financial block
        let displayPrice = totalPrice > 0 ? `R$ ${totalPrice.toFixed(0)}` : (newApt.status === "blocked" ? "-" : "R$ 0");
        if (isJsonNotes) {
            try {
                const data = JSON.parse(newApt.notes);
                if (data.financeiro?.valor) {
                    displayPrice = `R$ ${Number(data.financeiro.valor).toFixed(0)}`;
                }
            } catch (e) { }
        }

        const formattedApt = {
            id: newApt.id,
            time: newApt.time.split(':').slice(0, 2).join(':'),
            name: newApt.customerName || "Cliente",
            phone: newApt.customerPhone || "",
            date: newApt.date,
            serviceId: newApt.serviceId,
            serviceIds: serviceIds,
            service: allServiceNames[0] || (newApt.status === "blocked" ? "-" : "Serviço"),
            allServices: allServiceNames,
            allServicesData: selectedServicesData,
            status: newApt.status as any,
            isOptimistic: true,
            price: displayPrice,
            notes: displayNotes,
            rawNotes: newApt.notes
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

        // Update selectedAppointment to reflect change immediately in the details panel
        setSelectedAppointment(formattedApt);

        // Delay background sync slightly more to ensure DB propagation
        setTimeout(() => {
            fetchAppointments(tenantId, day);
        }, 1500);

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
            serviceIds: apt.serviceIds,
            notes: apt.notes,
            rawNotes: apt.rawNotes
        });
        setActiveTime(apt.time);
        setIsAddModalOpen(true);
    }

    const handleReschedule = (apt: any) => {
        setAppointmentToReschedule(apt)
        setIsRescheduleModalOpen(true)
    }

    const getDateKey = (day: number) => {
        const m = (currentMonth.getMonth() + 1).toString().padStart(2, "0")
        const d = day.toString().padStart(2, "0")
        return `${currentMonth.getFullYear()}-${m}-${d}`
    }

    const selectedDateObj = new Date(selectedDate + "T12:00:00")

    const calendarContent = (
        <>
            <DialogHeader className={cn("p-0 text-left", !isDesktop && "mt-4")}>
                <div className="flex items-center gap-3 mb-2">
                    <CalendarIcon className="h-6 w-6 text-brand-primary" />
                    {isDesktop ? (
                        <DialogTitle className="text-2xl font-bold text-white">Calendário</DialogTitle>
                    ) : (
                        <DrawerTitle className="text-2xl font-bold text-white">Calendário</DrawerTitle>
                    )}
                </div>
                {isDesktop ? (
                    <DialogDescription className="text-stone-400 text-xs">
                        Selecione uma data para visualizar a agenda.
                    </DialogDescription>
                ) : (
                    <DrawerDescription className="text-stone-400 text-xs">
                        Selecione uma data para visualizar a agenda.
                    </DrawerDescription>
                )}
            </DialogHeader>

            <div className="mt-8">
                <div className="flex items-center justify-between mb-8">
                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-stone-400 hover:text-white transition-all">
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <span className="text-sm font-bold text-white capitalize">{MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-stone-400 hover:text-white transition-all">
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-y-2 mb-4">
                    {WEEKDAYS.map(d => (
                        <div key={d} className="text-center text-[10px] font-black text-stone-600 uppercase tracking-widest">{d.slice(0, 3)}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-y-4">
                    {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() }).map((_, i) => <div key={`e-${i}`} />)}
                    {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate() }).map((_, i) => {
                        const day = i + 1
                        const m = (currentMonth.getMonth() + 1).toString().padStart(2, "0")
                        const d = day.toString().padStart(2, "0")
                        const dateKey = `${currentMonth.getFullYear()}-${m}-${d}`
                        const isSelected = dateKey === selectedDate
                        const apts = appointments[dateKey] || []
                        const isToday = dateKey === new Date().toISOString().split('T')[0]
                        const blocked = isDayFullyBlocked(dateKey)
                        const isOpen = isDateOpen(dateKey)

                        return (
                            <button
                                key={day}
                                onClick={() => { setSelectedDate(dateKey); setIsCalendarModalOpen(false); }}
                                className={cn(
                                    "h-10 w-full rounded-xl text-xs font-bold transition-all relative flex flex-col items-center justify-center cursor-pointer",
                                    isSelected ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" :
                                        isToday ? "text-brand-primary border border-brand-primary/30" :
                                            blocked || !isOpen ? "text-stone-700 pointer-events-none" : "text-stone-400 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <span>{day}</span>
                                <div className="flex gap-0.5 absolute bottom-1.5">
                                    {apts.length > 0 && (
                                        <>
                                            {apts.some(a => a.status === 'confirmed' || a.status === 'completed') && <div className="h-1 w-1 rounded-full bg-emerald-500" />}
                                            {apts.some(a => a.status === 'pending') && <div className="h-1 w-1 rounded-full bg-brand-primary" />}
                                            {apts.some(a => a.status === 'blocked') && <div className="h-1 w-1 rounded-full bg-red-500" />}
                                        </>
                                    )}
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>
        </>
    )

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

    // Effect to customize layout header and padding for this page
    useEffect(() => {
        if (!isClientMounted) return;
        
        // Hide default title
        const defaultTitle = document.getElementById('header-default-title');
        if (defaultTitle) defaultTitle.style.display = 'none';
        
        // Hide user info for a simpler header
        const userInfo = document.getElementById('header-user-info');
        if (userInfo) userInfo.style.display = 'none';
        
        // Reduce main container padding
        const main = document.querySelector('main');
        if (main) {
            main.style.paddingTop = '16px';
            main.style.paddingLeft = '16px';
            main.style.paddingRight = '16px';
        }

        return () => {
            if (defaultTitle) defaultTitle.style.display = 'block';
            if (userInfo) userInfo.style.display = 'flex';
            if (main) main.style.paddingTop = '';
        }
    }, [isClientMounted]);

    if (!isClientMounted) return null;

    const headerTitlePortal = createPortal(
        <div className="flex items-center gap-3 min-w-0 animate-in fade-in slide-in-from-left-4 duration-500">
            <h2 className="text-xl font-bold text-foreground tracking-tight">Agenda</h2>
        </div>,
        document.getElementById('header-title-portal')!
    );

    const headerActionsPortal = createPortal(
        <div className="flex items-center gap-2 shrink-0 animate-in fade-in slide-in-from-right-4 duration-500">
            <button onClick={() => setIsBusinessHoursModalOpen(true)} className="h-8 px-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/40 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-stone-800 transition-all flex items-center gap-2 text-[10px] font-bold cursor-pointer">
                <Clock className="h-3.5 w-3.5" /> Funcionamento
            </button>
            <button onClick={() => setIsCalendarModalOpen(true)} className="h-8 px-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/40 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-stone-800 transition-all flex items-center gap-2 text-[10px] font-bold cursor-pointer">
                <Filter className="h-3.5 w-3.5" /> Filtrar
            </button>
            <button 
                onClick={() => { setAppointmentMode("standard"); setIsAddModalOpen(true); }}
                className="h-8 px-3 rounded-xl font-black shadow-lg shadow-brand-secondary/20 bg-brand-gold text-white transition-all hover:scale-[1.02] text-[10px] flex items-center gap-2 cursor-pointer"
            >
                <Plus className="h-3.5 w-3.5" /> Novo Registro
            </button>
        </div>,
        document.getElementById('header-actions-portal')!
    );

    return (
        <div className="h-[calc(100vh-80px)] flex flex-col animate-in fade-in duration-700 overflow-hidden bg-transparent">
            {headerTitlePortal}
            {headerActionsPortal}

            {/* ═══════════════════════════════════════════════════════
                DESKTOP LAYOUT (≥ md) — 2 or 3 column grid
               ═══════════════════════════════════════════════════════ */}
            <div className="hidden md:flex flex-col h-full overflow-hidden">

                {/* Desktop 2 or 3-column body */}
                <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-[minmax(300px,360px)_minmax(0,1fr)] xl:grid-cols-[minmax(300px,360px)_minmax(0,1fr)_minmax(300px,360px)] gap-4 px-1 pb-2">
                    {/* ── CENTER COLUMN (Visual): Timeline ── */}
                    <div className="flex flex-col min-h-0 gap-4 relative order-2">
                        {/* Date picker Card */}
                        <div className="shrink-0 h-[84px] rounded-2xl border border-stone-200 dark:border-white/5 bg-white dark:bg-stone-900/30 flex items-center shadow-sm relative overflow-hidden">
                            <button className="w-12 h-full flex items-center justify-center text-stone-500 hover:text-stone-900 dark:hover:text-stone-300 bg-stone-50 dark:bg-stone-900/20 hover:bg-stone-100 dark:hover:bg-stone-800/30 transition-all shrink-0 border-r border-stone-100 dark:border-white/5 cursor-pointer">
                                <ChevronLeft className="h-5 w-5" />
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
                                                    "flex flex-col items-center justify-center flex-1 min-w-0 max-w-[88px] h-[72px] rounded-[14px] transition-all cursor-pointer border relative overflow-hidden",
                                                    isSelected ? "bg-brand-gold/[0.04] border-brand-gold/30 shadow-[inset_0_0_20px_rgba(245,204,112,0.03)]" :
                                                        isBlocked ? "border-transparent opacity-50" :
                                                            "border-transparent hover:bg-stone-50 dark:hover:bg-white/[0.02]"
                                                )}>
                                                <span className={cn("text-[8px] 2xl:text-[10px] font-bold tracking-[0.1em] uppercase mb-0.5", isSelected ? "text-stone-700 dark:text-stone-300" : "text-stone-500 dark:text-stone-400")}>{day.dayName}</span>
                                                <span className={cn("text-[18px] 2xl:text-[24px] font-bold leading-none mb-1.5 transition-all", isSelected ? "text-stone-900 dark:text-white" : "text-stone-700 dark:text-stone-200")}>{day.dayNum}</span>

                                                <div className="flex gap-1 h-1">
                                                    {isBlocked ? <div className="h-1 w-1 rounded-full bg-red-500/60" /> :
                                                        isSelected ? (
                                                            <div className="h-1 w-1 rounded-full bg-brand-gold shadow-[0_0_6px_rgba(245,204,112,0.6)]" />
                                                        ) : hasApts ? (
                                                            <>
                                                                <div className="h-1 w-1 rounded-full bg-emerald-500" />
                                                                <div className="h-1 w-1 rounded-full bg-emerald-500" />
                                                            </>
                                                        ) : (
                                                            <div className="h-1 w-1 rounded-full bg-stone-300 dark:bg-stone-600" />
                                                        )}
                                                </div>
                                            </button>

                                            {i < 6 && (
                                                <div className="w-[1px] h-10 bg-gradient-to-b from-transparent via-stone-200 dark:via-stone-800/40 to-transparent opacity-50" />
                                            )}
                                        </React.Fragment>
                                    )
                                })}
                            </div>

                            <button className="w-12 h-full flex items-center justify-center text-stone-500 hover:text-stone-900 dark:hover:text-stone-300 bg-stone-50 dark:bg-stone-900/20 hover:bg-stone-100 dark:hover:bg-stone-800/30 transition-all shrink-0 border-l border-stone-100 dark:border-white/5 cursor-pointer">
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Timeline Card */}
                        <div className="flex-1 flex flex-col min-h-0 rounded-2xl border border-stone-200 dark:border-white/5 bg-white dark:bg-stone-900/30 overflow-hidden shadow-sm relative">
                            {/* Selected Date Header */}
                            <div className="shrink-0 px-6 pt-4 pb-2">
                                <h3 className="text-[10px] font-bold text-stone-600 dark:text-stone-300 uppercase tracking-widest">
                                    {new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(selectedDate + "T12:00:00"))}
                                </h3>
                            </div>

                            {/* Timeline scroll */}
                            <div className="flex-1 min-h-0 overflow-hidden relative">
                                <div className="absolute left-[45px] top-4 bottom-4 w-px bg-stone-100 dark:bg-stone-800/30 pointer-events-none z-0" />
                                <TooltipProvider>
                                    <div ref={timelineRef} onClick={() => setSelectedAppointment(null)} className="h-full overflow-y-auto px-6 py-2 space-y-2 custom-scrollbar scroll-smooth relative z-10">
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
                                                    <div className="w-[50px] shrink-0 flex items-center justify-center pt-2 relative z-10">
                                                        <span className={cn("text-[12px] font-medium tabular-nums", isCurrentSlot ? "text-brand-primary" : "text-stone-600 dark:text-stone-300")}>{time}</span>
                                                    </div>
                                                    <div className="flex-1 min-w-0 pb-2">
                                                        {apt && !isBlocked && !isLiberado ? (
                                                            <motion.div 
                                                                whileHover={{ backgroundColor: "rgba(var(--brand-primary-rgb), 0.03)" }}
                                                                whileTap={{ scale: 0.995 }}
                                                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                                                onClick={(e) => { 
                                                                e.stopPropagation(); 
                                                                setSelectedAppointment(apt); 
                                                                if (!isXL) {
                                                                    setAppointmentToComplete(apt);
                                                                    setIsDetailsModalOpen(true);
                                                                }
                                                            }} className={cn(
                                                                "rounded-[14px] p-4 transition-all cursor-pointer border-y border-r border-stone-100 dark:border-white/[0.04]",
                                                                selectedAppointment?.id === apt.id ? "ring-1 ring-brand-primary/40 shadow-[0_0_15px_rgba(245,204,112,0.1)]" : "",
                                                                apt.status === 'completed' ? "bg-gradient-to-r from-emerald-500/10 to-transparent border-l-4 border-l-emerald-500" :
                                                                    apt.status === 'confirmed' ? "bg-gradient-to-r from-emerald-500/10 to-transparent border-l-4 border-l-emerald-500" :
                                                                        "bg-gradient-to-r from-amber-500/10 to-transparent border-l-4 border-l-amber-500"
                                                            )}>
                                                                <div className="flex items-center justify-between gap-3">
                                                                    <div className="flex flex-col min-w-0 flex-1">
                                                                        <h4 className="text-[15px] font-bold text-stone-900 dark:text-white truncate mb-0.5">{apt.name}</h4>
                                                                        <p className="text-[12px] text-stone-500 dark:text-stone-400 truncate">{apt.service} • <span className="text-stone-700 dark:text-stone-300">{apt.price}</span></p>
                                                                    </div>
                                                                    <div className="flex items-center gap-3 shrink-0">
                                                                        <div className={cn("text-[9px] font-bold uppercase px-2.5 py-1 rounded-sm tracking-wider",
                                                                            apt.status === 'completed' ? "text-emerald-400 bg-emerald-500/10" :
                                                                                apt.status === 'confirmed' ? "text-emerald-400 bg-emerald-500/10" :
                                                                                    "text-amber-400 bg-amber-500/10"
                                                                        )}>{apt.status === 'completed' ? 'Concluído' : apt.status === 'confirmed' ? 'Confirmado' : 'Pendente'}</div>

                                                                        <div className="h-8 w-8 rounded-full overflow-hidden shrink-0 bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-[10px] font-bold text-stone-500 dark:text-stone-400 ml-1">
                                                                            {apt.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                                                                        </div>

                                                                        <DropdownMenu>
                                                                            <DropdownMenuTrigger asChild>
                                                                                <button onClick={e => e.stopPropagation()} className="h-8 w-8 rounded-full flex items-center justify-center text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-white/5 transition-all outline-none cursor-pointer">
                                                                                    <MoreVertical className="h-5 w-5" />
                                                                                </button>
                                                                            </DropdownMenuTrigger>
                                                                            <DropdownMenuContent align="end" sideOffset={4} className="w-44 bg-white dark:bg-stone-950 border border-stone-200 dark:border-white/10 rounded-xl p-1 shadow-2xl">
                                                                                <DropdownMenuItem onClick={() => handleEdit(apt)} className="rounded-lg text-xs gap-2 py-1.5 cursor-pointer"><Pencil className="h-3 w-3" /> Editar</DropdownMenuItem>
                                                                                <DropdownMenuItem onClick={() => confirmAppointment(time)} className="rounded-lg text-xs gap-2 py-1.5 cursor-pointer"><CheckCircle2 className="h-3 w-3 text-green-500" /> Confirmar</DropdownMenuItem>
                                                                                <DropdownMenuItem onClick={() => handleDelete(apt.id)} className="rounded-lg text-xs gap-2 py-1.5 text-red-500 cursor-pointer"><Trash2 className="h-3 w-3" /> Excluir</DropdownMenuItem>
                                                                            </DropdownMenuContent>
                                                                        </DropdownMenu>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        ) : isBlocked ? (
                                                            <div className="rounded-[14px] p-4 bg-gradient-to-r from-red-500/10 to-transparent border-y border-r border-white/[0.04] border-l-4 border-l-red-500 flex items-center justify-between gap-4 group/blocked">
                                                                <div className="flex items-center gap-4">
                                                                    <div>
                                                                        <p className="text-[13px] font-bold text-red-500 uppercase tracking-wider mb-0.5">Horário Bloqueado</p>
                                                                        <p className="text-[12px] text-red-500/60">Indisponível para clientes</p>
                                                                    </div>
                                                                </div>
                                                                <button onClick={(e) => { e.stopPropagation(); toggleSlot(time); }} className="h-10 w-10 rounded-xl border border-red-500/20 bg-red-500/5 text-red-500 hover:text-white hover:bg-red-500 flex items-center justify-center transition-all cursor-pointer opacity-0 group-hover/blocked:opacity-100" title="Liberar Horário">
                                                                    <Unlock className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <motion.div 
                                                                whileHover={{ borderColor: "rgba(var(--brand-primary-rgb), 0.2)" }}
                                                                whileTap={{ scale: 0.995 }}
                                                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                                                onClick={() => { setActiveTime(time); setIsAddModalOpen(true); }}
                                                                className="rounded-[14px] p-3 pl-4 bg-stone-50 dark:bg-stone-900/40 border border-stone-100 dark:border-white/5 flex items-center justify-between group/empty transition-all shadow-sm dark:shadow-none cursor-pointer"
                                                            >
                                                                <div className="flex items-center gap-4">
                                                                    <div>
                                                                        <p className="text-[13px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider mb-0.5">Horário Livre</p>
                                                                        <p className="text-[12px] text-stone-500">{tenant?.segmento === 'advocacia' ? 'Disponível para consulta' : 'Disponível para agendamento'}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <button onClick={(e) => { e.stopPropagation(); toggleSlot(time); }} className="h-10 w-10 rounded-xl border border-stone-200 dark:border-white/5 bg-white dark:bg-white/[0.02] text-stone-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-200 dark:hover:border-red-500/20 flex items-center justify-center transition-all cursor-pointer opacity-0 group-hover/empty:opacity-100 shadow-sm dark:shadow-none" title="Bloquear Horário">
                                                                        <CalendarOff className="h-4 w-4" />
                                                                    </button>
                                                                    <button onClick={() => { setActiveTime(time); setIsAddModalOpen(true); }} className="h-10 w-10 rounded-xl border border-stone-200 dark:border-white/5 bg-white dark:bg-white/[0.02] text-stone-700 dark:text-stone-300 hover:text-brand-primary dark:hover:text-white hover:bg-stone-50 dark:hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer shadow-sm dark:shadow-none" title={tenant?.segmento === "advocacia" ? "Nova Consulta" : "Novo Agendamento"}>
                                                                        <Plus className="h-5 w-5" />
                                                                    </button>
                                                                </div>
                                                            </motion.div>
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
                    <div className="hidden xl:flex flex-col gap-4 min-h-0 overflow-y-auto custom-scrollbar pr-1 order-3">
                        <DesktopDetailsPanel
                            apt={selectedAppointment}
                            segmento={tenant?.segmento}
                            onEdit={handleEdit}
                            onComplete={(a) => { setAppointmentToComplete(a); setIsCompleteModalOpen(true); }}
                            onDetails={(a) => { setAppointmentToComplete(a); setIsDetailsModalOpen(true); }}
                            onConfirm={confirmAppointment}
                            onReschedule={handleReschedule}
                            onDelete={handleDelete}
                            onSaveClient={(a) => { setClientToSave(a); setIsSaveClientModalOpen(true); }}
                        />
                        <DesktopOccupationCard summary={daySummary} segmento={tenant?.segmento} />
                        <DesktopNextActionsPanel 
                            appointments={appointments} 
                            currentTime={currentTime} 
                            onConfirmAll={handleConfirmAll}
                        />
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
                        <DesktopDaySummary summary={daySummary} segmento={tenant?.segmento} />
                        <DesktopFreeSlots slots={freeTimeSlots} onAddAt={(time) => { setActiveTime(time); setIsAddModalOpen(true); }} />
                    </div>
                </div>
            </div>

            <div className="md:hidden flex flex-col flex-1 min-h-0 h-full overflow-hidden">
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
                                            ? "bg-stone-100 dark:bg-stone-900/80 border-brand-primary/50 text-brand-primary"
                                            : isBlocked
                                                ? "border-transparent text-stone-300 dark:text-stone-600"
                                                : !isOpen
                                                    ? "border-transparent text-stone-300 dark:text-stone-600"
                                                    : "border-transparent text-stone-500 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-900/40"
                                    )}
                                >
                                    <span className={cn("text-[10px] font-bold uppercase tracking-wider", isSelected ? "text-brand-primary" : "text-stone-500 dark:text-stone-400")}>{day.dayName}</span>
                                    <span className={cn("text-lg font-black leading-none mt-0.5", isSelected ? "text-stone-900 dark:text-foreground" : "text-stone-600 dark:text-stone-300")}>{day.dayNum}</span>
                                    <div className="flex gap-1 mt-1.5">
                                        {isBlocked ? (
                                            <div className="h-1.5 w-1.5 rounded-full bg-red-500/60" />
                                        ) : hasApts ? (
                                            <>
                                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                            </>
                                        ) : (
                                            <div className={cn("h-1.5 w-1.5 rounded-full", isSelected ? "bg-brand-primary" : "bg-stone-200 dark:bg-stone-700")} />
                                        )}
                                    </div>
                                    {day.isToday && !isSelected && (
                                        <div className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-brand-primary border-2 border-stone-950" />
                                    )}
                                </button>
                            );
                        })}

                        {/* Calendar Button to open modal */}
                        <button
                            onClick={() => setIsCalendarModalOpen(true)}
                            className="flex flex-col items-center justify-center min-w-[54px] h-[72px] rounded-2xl transition-all snap-center cursor-pointer shrink-0 relative border border-stone-200 dark:border-white/5 bg-white dark:bg-stone-900/40 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white shadow-sm dark:shadow-none"
                        >
                            <CalendarIcon className="h-6 w-6" />
                            <span className="text-[9px] font-bold uppercase tracking-tighter mt-1">Calendário</span>
                        </button>
                    </div>
                </div>

                {/* ═══ TIMELINE DO DIA (Core UX) ═══ */}
                <div className="flex-1 min-h-0 overflow-hidden flex flex-col relative">
                    {/* Timeline vertical line */}
                    <div className="absolute left-[23px] top-0 bottom-0 w-px bg-brand-primary/10 dark:bg-brand-primary/20 pointer-events-none z-0" />

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
                                    <div key={time} id={`slot-${time}`} className={cn("flex gap-0.5 items-start transition-all duration-300 relative group/row", isUnavailable && !apt ? "opacity-50" : "opacity-100")}>
                                        {/* Time + dot */}
                                        <div className="w-[46px] shrink-0 flex items-center gap-1 pt-3 relative z-10">
                                            <div className={cn("h-2 w-2 rounded-full shrink-0 border-2 transition-all",
                                                isCurrentSlot ? "bg-brand-primary border-brand-primary shadow-[0_0_8px_rgba(245,204,112,0.4)]" :
                                                    apt && !isBlocked && !isLiberado ? "bg-stone-400 dark:bg-stone-600 border-stone-300 dark:border-stone-500" :
                                                        isBlocked ? "bg-red-500/40 border-red-500/30" :
                                                            "bg-stone-200 dark:bg-stone-800 border-stone-300 dark:border-stone-700"
                                            )} />
                                            <span className={cn("text-[11px] font-bold tabular-nums tracking-tight",
                                                isCurrentSlot ? "text-brand-primary" :
                                                    apt && !isBlocked && !isLiberado ? "text-stone-900 dark:text-foreground" :
                                                        "text-stone-400 dark:text-stone-600"
                                            )}>{time}</span>
                                        </div>

                                        {/* Card */}
                                        <div className="flex-1 min-w-0">
                                            {apt && !isBlocked && !isLiberado ? (
                                                /* ── Appointment Card ── */
                                                <motion.div 
                                                    whileHover={{ scale: 1.01 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    className={cn(
                                                    "border rounded-xl p-3 transition-all relative overflow-hidden group/card cursor-pointer",
                                                    apt.status === 'completed'
                                                        ? "bg-emerald-500/[0.05] border-emerald-500/20"
                                                        : apt.status === 'confirmed'
                                                            ? "bg-gradient-to-r from-emerald-500/[0.08] to-emerald-500/[0.02] border-emerald-500/20"
                                                    : "bg-gradient-to-r from-amber-500/[0.08] to-amber-500/[0.02] border-amber-500/20"
                                                )} onClick={() => { setAppointmentToComplete(apt); setIsDetailsModalOpen(true); }}>
                                                    <div className="flex items-center justify-between gap-2">
                                                        <div className="flex flex-col min-w-0 flex-1">
                                                            <h4 className="text-sm font-bold text-stone-900 dark:text-foreground truncate">{apt.name}</h4>
                                                            <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">{apt.service} • <span className="font-semibold">{apt.price}</span></p>
                                                        </div>
                                                        {/* Quick actions & Avatar */}
                                                        <div className="flex items-center gap-2 shrink-0">
                                                            <div className={cn("text-[9px] font-black uppercase px-2 py-1 rounded-full tracking-wider border",
                                                                apt.status === 'completed' ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" :
                                                                    apt.status === 'confirmed' ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" :
                                                                        "text-amber-500 bg-amber-500/10 border-amber-500/20"
                                                            )}>{apt.status === 'completed' ? 'Concluído' : apt.status === 'confirmed' ? 'Confirmado' : 'Pendente'}</div>

                                                            <div className="h-8 w-8 rounded-full overflow-hidden border border-stone-200 dark:border-white/10 shrink-0">
                                                                <div className="h-full w-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-[10px] font-bold text-stone-500 dark:text-stone-400">
                                                                    {apt.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                                                                </div>
                                                            </div>

                                                            <div onClick={(e) => e.stopPropagation()}>
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <button className="h-7 w-7 rounded-full flex items-center justify-center text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-white/5 transition-all outline-none cursor-pointer">
                                                                            <MoreVertical className="h-4 w-4" />
                                                                        </button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end" sideOffset={4} className="w-48 bg-white dark:bg-stone-950 border border-stone-200 dark:border-white/10 rounded-2xl p-1 shadow-2xl">
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
                                                </motion.div>
                                            ) : (
                                                /* ── Empty / Blocked / Unavailable slot ── */
                                                <motion.div 
                                                    whileHover={{ scale: 1.01 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    onClick={() => { if (!isBlocked && !isUnavailable) { setActiveTime(time); setIsAddModalOpen(true); } }}
                                                    className={cn(
                                                    "border rounded-xl p-3 transition-all flex items-center justify-between cursor-pointer",
                                                    isBlocked ? "bg-gradient-to-r from-red-500/[0.08] to-red-500/[0.02] border-red-500/20"
                                                        : isUnavailable ? "bg-stone-100 dark:bg-stone-900/10 border-stone-100 dark:border-white/[0.02] opacity-50"
                                                            : "bg-stone-50 dark:bg-stone-900/40 border-stone-100 dark:border-white/5 active:scale-[0.98] hover:border-brand-primary/30"
                                                )}>
                                                    <div className="flex items-center gap-4">
                                                        <div>
                                                            <p className={cn("text-xs font-bold uppercase tracking-wider mb-0.5",
                                                                isBlocked ? "text-red-500" : isUnavailable ? "text-stone-400 dark:text-stone-600" : "text-stone-600 dark:text-stone-400"
                                                            )}>
                                                                {isBlocked ? "Horário Bloqueado" : isUnavailable ? "Fechado" : "Horário Livre"}
                                                            </p>
                                                            <p className={cn("text-[11px]",
                                                                isBlocked ? "text-red-500/60" : isUnavailable ? "text-stone-400 dark:text-stone-600" : "text-stone-500 dark:text-stone-400"
                                                            )}>
                                                                {isBlocked ? "Indisponível para clientes" : isUnavailable ? "Fora do horário de func." : tenant?.segmento === 'advocacia' ? "Disponível para consulta" : "Disponível para agendamento"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {!isBlocked && !isUnavailable && (
                                                        <div className="flex items-center gap-2">
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); toggleSlot(time); }} 
                                                                className="h-9 w-9 rounded-full border border-stone-200 dark:border-white/10 bg-white dark:bg-stone-900 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-200 dark:hover:border-red-500/20 flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-90"
                                                            >
                                                                <CalendarOff className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    )}
                                                    {isBlocked && (
                                                        <button onClick={(e) => { e.stopPropagation(); toggleSlot(time); }} className="h-8 w-8 rounded-full border border-red-500/20 bg-red-500/10 text-red-400 hover:text-white hover:bg-red-500 flex items-center justify-center transition-all cursor-pointer">
                                                            <Unlock className="h-3.5 w-3.5" />
                                                        </button>
                                                    )}
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </TooltipProvider>
                </div>

                {/* ─── INSIGHT BAR (Moved to bottom) ─── */}
                <div className="shrink-0 mx-1 mt-2 mb-4 p-3 rounded-2xl bg-white dark:bg-stone-900/40 border border-stone-100 dark:border-white/5 flex items-center gap-4 shadow-sm dark:shadow-none">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                            <TrendingUp className="h-3.5 w-3.5 text-brand-primary shrink-0" />
                            <span className="text-[10px] font-black text-stone-500 dark:text-stone-400 uppercase tracking-widest truncate">
                                {occupancyNumber}% ocupado · {freeSlotCount} {freeSlotCount === 1 ? 'horário livre' : 'horários livres'}
                            </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                            <div
                                className={cn("h-full rounded-full transition-all duration-700", occupancyNumber >= 80 ? "bg-gradient-to-r from-amber-500 to-red-500" : "bg-gradient-to-r from-emerald-500/80 to-brand-primary/80")}
                                style={{ width: `${Math.min(occupancyNumber, 100)}%` }}
                            />
                        </div>
                    </div>
                    <div className="text-right shrink-0">
                        <p className="text-lg font-bold text-stone-900 dark:text-foreground leading-none">{todayAppointmentsCount}</p>
                        <p className="text-[9px] text-stone-500 dark:text-stone-400 font-medium">{tenant?.segmento === 'advocacia' ? 'consultas' : 'agendados'}</p>
                    </div>
                </div>

            </div>{/* end mobile wrapper */}

            {/* ═══ MOBILE FLOATING ACTION BUTTON (FAB) ═══ */}
            {!isDesktop && tenant?.segmento === 'advocacia' && (
                <div className="fixed bottom-24 right-6 z-50 lg:hidden">
                    <button 
                        onClick={() => { setAppointmentMode("standard"); setIsAddModalOpen(true); }}
                        className="h-14 w-14 rounded-full bg-brand-gold text-stone-950 shadow-[0_8px_30px_rgb(245,204,112,0.4)] flex items-center justify-center transition-all active:scale-90 border-2 border-white/10"
                    >
                        <Plus className="h-7 w-7" />
                    </button>
                </div>
            )}

            {/* ═══ CALENDAR MODAL (Full Month) ═══ */}
            {isDesktop ? (
                <Dialog open={isCalendarModalOpen} onOpenChange={setIsCalendarModalOpen}>
                    <DialogContent className="bg-white dark:bg-stone-950 border-stone-200 dark:border-white/5 rounded-3xl max-w-sm p-8 shadow-2xl">
                        {calendarContent}
                    </DialogContent>
                </Dialog>
            ) : (
                <Drawer open={isCalendarModalOpen} onOpenChange={setIsCalendarModalOpen}>
                    <DrawerContent className="bg-white dark:bg-stone-950 border-stone-200 dark:border-white/5 rounded-t-3xl px-8 pt-4 pb-12 shadow-2xl border-t">
                        {calendarContent}
                    </DrawerContent>
                </Drawer>
            )}


            <AppointmentModal
                isOpen={isAddModalOpen}
                onClose={() => { setIsAddModalOpen(false); setEditingAppointment(null); setAppointmentMode("standard"); }}
                date={selectedDate}
                time={activeTime}
                tenantId={tenantId || ""}
                services={services}
                onSuccess={handleAddSuccess}
                appointment={editingAppointment}
                initialMode={appointmentMode}
                segmento={tenant?.segmento}
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
                onComplete={() => { setIsDetailsModalOpen(false); setTimeout(() => setIsCompleteModalOpen(true), 200); }}
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

            <RescheduleModal
                isOpen={isRescheduleModalOpen}
                onClose={() => setIsRescheduleModalOpen(false)}
                onSuccess={() => fetchAppointments(tenantId || "")}
                appointment={appointmentToReschedule}
                tenantId={tenant?.id || ""}
                businessHours={tenant?.businessHours}
            />

            {isDesktop ? (
                <Dialog open={isBlockConfirmOpen} onOpenChange={setIsBlockConfirmOpen}>
                    <DialogContent className="bg-white dark:bg-stone-950 border-stone-200 dark:border-white/10 rounded-3xl max-w-sm">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-black text-stone-900 dark:text-white">Bloquear dia inteiro?</DialogTitle>
                            <DialogDescription className="text-stone-500 dark:text-stone-400 text-sm">
                                Isso irá fechar todos os horários disponíveis para o dia {dateToBlock && new Date(dateToBlock + 'T00:00:00').toLocaleDateString('pt-BR')}.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex gap-2 mt-4">
                            <Button variant="ghost" onClick={() => setIsBlockConfirmOpen(false)} className="flex-1 rounded-xl text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-white/5">
                                Cancelar
                            </Button>
                            <Button onClick={() => dateToBlock && handleBlockDay(dateToBlock)} className="flex-1 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold" disabled={loading}>
                                {loading ? "Bloqueando..." : "Bloquear"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            ) : (
                <Drawer open={isBlockConfirmOpen} onOpenChange={setIsBlockConfirmOpen}>
                    <DrawerContent className="bg-white dark:bg-stone-950 border-stone-200 dark:border-white/10 rounded-t-3xl px-6 pt-2 pb-6 shadow-2xl border-t">
                        <DrawerHeader className="text-left p-0">
                            <DrawerTitle className="text-xl font-black text-stone-900 dark:text-white">Bloquear dia inteiro?</DrawerTitle>
                            <DrawerDescription className="text-stone-500 dark:text-stone-400 text-sm">
                                Isso irá fechar todos os horários disponíveis para o dia {dateToBlock && new Date(dateToBlock + 'T00:00:00').toLocaleDateString('pt-BR')}.
                            </DrawerDescription>
                        </DrawerHeader>
                        <DrawerFooter className="flex flex-col gap-2 mt-6 p-0 pb-6">
                            <Button onClick={() => dateToBlock && handleBlockDay(dateToBlock)} className="w-full h-12 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold" disabled={loading}>
                                {loading ? "Bloqueando..." : "Bloquear Dia Inteiro"}
                            </Button>
                            <Button variant="ghost" onClick={() => setIsBlockConfirmOpen(false)} className="w-full h-12 rounded-xl text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-white/5">
                                Cancelar
                            </Button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            )}

            {isDesktop ? (
                <Dialog open={isUnblockConfirmOpen} onOpenChange={setIsUnblockConfirmOpen}>
                    <DialogContent className="bg-white dark:bg-stone-950 border-stone-200 dark:border-white/10 rounded-3xl max-w-sm">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-black text-stone-900 dark:text-white">Liberar dia inteiro?</DialogTitle>
                            <DialogDescription className="text-stone-500 dark:text-stone-400 text-sm">
                                Isso irá remover todos os bloqueios manuais para o dia {dateToUnblock && new Date(dateToUnblock + 'T00:00:00').toLocaleDateString('pt-BR')}.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex gap-2 mt-4">
                            <Button variant="ghost" onClick={() => setIsUnblockConfirmOpen(false)} className="flex-1 rounded-xl text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-white/5">
                                Cancelar
                            </Button>
                            <Button onClick={() => dateToUnblock && handleUnblockDay(dateToUnblock)} className="flex-1 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold" disabled={loading}>
                                {loading ? "Liberando..." : "Liberar"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            ) : (
                <Drawer open={isUnblockConfirmOpen} onOpenChange={setIsUnblockConfirmOpen}>
                    <DrawerContent className="bg-white dark:bg-stone-950 border-stone-200 dark:border-white/10 rounded-t-3xl px-6 pt-2 pb-6 shadow-2xl border-t">
                        <DrawerHeader className="text-left p-0">
                            <DrawerTitle className="text-xl font-black text-stone-900 dark:text-white">Liberar dia inteiro?</DrawerTitle>
                            <DrawerDescription className="text-stone-500 dark:text-stone-400 text-sm">
                                Isso irá remover todos os bloqueios manuais para o dia {dateToUnblock && new Date(dateToUnblock + 'T00:00:00').toLocaleDateString('pt-BR')}.
                            </DrawerDescription>
                        </DrawerHeader>
                        <DrawerFooter className="flex flex-col gap-2 mt-6 p-0 pb-6">
                            <Button onClick={() => dateToUnblock && handleUnblockDay(dateToUnblock)} className="w-full h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold" disabled={loading}>
                                {loading ? "Liberando..." : "Liberar Dia Inteiro"}
                            </Button>
                            <Button variant="ghost" onClick={() => setIsUnblockConfirmOpen(false)} className="w-full h-12 rounded-xl text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-white/5">
                                Cancelar
                            </Button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            )}
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
