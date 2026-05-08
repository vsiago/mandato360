"use client"

import React from "react"
import { cn } from "@/lib/utils"
import {
    CalendarDays, Clock, CheckCircle2, XCircle, Plus, ChevronLeft, ChevronRight,
    MessageCircle, MoreVertical, Pencil, Trash2, UserPlus, X, Zap, Phone, Calendar as CalendarIcon, Lock,
    Scissors, Share2, CalendarClock, CalendarOff, User, CreditCard, ShieldCheck
} from "lucide-react"
import Link from "next/link"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

const WEEKDAYS = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"]
const MONTH_NAMES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]

/* ═══════════════════════════════════════════
   DESKTOP: Appointment Details Panel
   ═══════════════════════════════════════════ */
export function DesktopDetailsPanel({ apt, segmento, onEdit, onReschedule, onComplete, onDetails, onConfirm, onDelete, onSaveClient }: {
    apt: any
    segmento?: string
    onEdit: (apt: any) => void
    onReschedule: (apt: any) => void
    onComplete: (apt: any) => void
    onDetails: (apt: any) => void
    onConfirm: (apt: any) => void
    onDelete: (id: string) => void
    onSaveClient?: (apt: any) => void
}) {
    if (!apt) return null;

    // Format date properly: "26 de abril de 2025" -> from apt.date (YYYY-MM-DD)
    const formatDate = (dateStr: string) => {
        if (!dateStr) return "";
        const [y, m, d] = dateStr.split('-').map(Number);
        const date = new Date(y, m - 1, d);
        return `${d} de ${MONTH_NAMES[m - 1].toLowerCase()} de ${y}`;
    };

    // Parse notes if they are JSON
    const getDisplayNotes = (notes: string) => {
        if (!notes) return "";
        try {
            if (notes.startsWith('{')) {
                const parsed = JSON.parse(notes);
                return parsed.description || parsed.notes || notes;
            }
        } catch (e) {}
        return notes;
    };

    return (
        <div className="rounded-2xl border border-stone-200 dark:border-white/5 bg-white dark:bg-stone-900/30 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.15em]">
                    {segmento === 'advocacia' ? 'Detalhes da Consulta' : 'Detalhes do Agendamento'}
                </h3>
            </div>
            {/* Client info */}
            <div className="flex items-center gap-3 mb-5">
                <div className={cn(
                    "h-12 w-12 rounded-full flex items-center justify-center text-sm font-black border-2 shrink-0",
                    apt.status === 'confirmed' ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : apt.status === 'completed' ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                            : "bg-amber-400/10 border-amber-400/30 text-amber-400"
                )}>
                    {apt.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{apt.name}</p>
                    {apt.phone && (
                        <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                            {apt.phone}
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {apt.phone && (
                        <>
                            <a href={`tel:${apt.phone}`} className="h-8 w-8 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-white/5 flex items-center justify-center text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200 dark:hover:bg-stone-700 transition-all">
                                <Phone className="h-3.5 w-3.5" />
                            </a>
                            <a href={`https://wa.me/${apt.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 hover:bg-green-500/20 transition-all">
                                <MessageCircle className="h-3.5 w-3.5" />
                            </a>
                        </>
                    )}
                </div>
            </div>
            {/* Details grid */}
            <div className="space-y-4 mb-6">
                {[
                    { label: segmento === 'advocacia' ? "Atendimento" : "Serviço", value: apt.service },
                    { label: "Valor", value: apt.price },
                    { label: "Data", value: formatDate(apt.date) }, 
                    { label: "Horário", value: apt.time },
                    { label: "Duração", value: "50 min" }, 
                    ...(apt.customFields ? Object.entries(apt.customFields).map(([k, v]) => ({ label: k, value: String(v) })) : []),
                    ...(apt.notes ? [{ label: "Obs", value: getDisplayNotes(apt.notes) }] : [])
                ].map(row => (
                    <div key={row.label} className="flex items-stretch gap-4 group/row min-h-[32px]">
                        <div className="w-[70px] shrink-0 flex items-center justify-end text-right">
                            <span className="text-[10px] text-stone-500 dark:text-stone-400 font-black uppercase tracking-widest leading-none">{row.label}</span>
                        </div>
                        
                        <div className="w-[2px] bg-stone-100 dark:bg-stone-800/80 self-stretch rounded-full group-hover/row:bg-brand-primary/40 transition-colors shrink-0" />
                        
                        <div className="flex-1 py-1 flex items-center">
                            {(row.label === "Serviço" || row.label === "Atendimento") && apt.allServices?.length > 1 ? (
                                <div className="flex flex-col gap-1.5 py-1">
                                    {apt.allServices.map((s: string, idx: number) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <div className="h-1 w-1 rounded-full bg-brand-primary shrink-0" />
                                            <span className="text-xs text-stone-700 dark:text-stone-200 font-bold leading-none">{s}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <span className={cn(
                                    "text-xs font-bold",
                                    row.label === "Valor" ? "text-brand-gold" : "text-stone-600 dark:text-stone-300",
                                    row.label !== "Obs" && "leading-none"
                                )}>
                                    {row.value}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {/* Actions */}
            <div className="grid grid-cols-4 gap-2 border-t border-stone-100 dark:border-white/5 pt-5">
                <button onClick={() => onEdit(apt)} className="flex flex-col items-center gap-2 text-stone-500 dark:text-stone-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors group cursor-pointer">
                    <div className="h-10 w-10 rounded-xl bg-amber-400/5 border border-amber-400/10 flex items-center justify-center group-hover:bg-amber-400/10 group-hover:border-amber-400/20 transition-all">
                        <Pencil className="h-4 w-4 text-amber-400" />
                    </div>
                    <span className="text-[10px] font-medium">Editar</span>
                </button>
                <button onClick={() => onReschedule(apt)} className="flex flex-col items-center gap-2 text-stone-500 dark:text-stone-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors group cursor-pointer">
                    <div className="h-10 w-10 rounded-xl bg-amber-400/5 border border-amber-400/10 flex items-center justify-center group-hover:bg-amber-400/10 group-hover:border-amber-400/20 transition-all">
                        <CalendarIcon className="h-4 w-4 text-amber-500" />
                    </div>
                    <span className="text-[10px] font-medium">Reagendar</span>
                </button>
                <button 
                    onClick={() => {
                        if (apt.status === 'pending') onConfirm(apt.time);
                        else if (apt.status === 'confirmed') onComplete(apt);
                        else onDetails(apt);
                    }} 
                    className={cn(
                        "flex flex-col items-center gap-2 transition-all group cursor-pointer",
                        apt.status === 'pending' ? "text-emerald-500 hover:scale-105" : "text-stone-500 dark:text-stone-400 hover:text-emerald-500"
                    )}
                >
                    <div className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center transition-all",
                        apt.status === 'pending' 
                            ? "bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)] animate-pulse" 
                            : "bg-emerald-500/5 border border-emerald-500/10 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20"
                    )}>
                        {apt.status === 'pending' ? <ShieldCheck className="h-4 w-4 text-emerald-500" /> : <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                    </div>
                    <span className="text-[10px] font-bold tracking-tight">{apt.status === 'pending' ? 'Confirmar' : 'Concluir'}</span>
                </button>

                <button onClick={() => onDelete(apt.id)} className="flex flex-col items-center gap-2 text-stone-500 dark:text-stone-400 hover:text-red-500 transition-colors group cursor-pointer">
                    <div className="h-10 w-10 rounded-xl bg-red-500/5 border border-red-500/10 flex items-center justify-center group-hover:bg-red-500/10 group-hover:border-red-500/20 transition-all">
                        <Trash2 className="h-4 w-4 text-red-500" />
                    </div>
                    <span className="text-[10px] font-medium">Cancelar</span>
                </button>
            </div>
        </div>
    )
}

/* ═══════════════════════════════════════════
   DESKTOP: Occupation Card
   ═══════════════════════════════════════════ */
export function DesktopOccupationCard({ summary, segmento }: { summary: { total: number, free: number }, segmento?: string }) {
    const totalSlots = summary.total + summary.free;
    const occupationPercent = totalSlots > 0 ? Math.round((summary.total / totalSlots) * 100) : 0;

    return (
        <div className="rounded-2xl border border-stone-200 dark:border-white/5 bg-white dark:bg-stone-900/30 p-5 flex shadow-sm">
            {/* Left Side */}
            <div className="flex-1 pr-5 border-r border-stone-100 dark:border-white/5">
                <p className="text-[11px] font-medium text-stone-600 dark:text-stone-300 mb-1">Ocupação do dia</p>
                <div className="text-3xl font-bold text-stone-900 dark:text-white mb-2">{occupationPercent}%</div>
                <div className="h-1.5 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden mb-2">
                    <div 
                        className="h-full bg-brand-gold rounded-full transition-all duration-1000" 
                        style={{ width: `${occupationPercent}%` }} 
                    />
                </div>
                <p className="text-[10px] text-stone-500 dark:text-stone-400">{summary.total} / {totalSlots} {segmento === 'advocacia' ? 'consultas' : 'agendamentos'}</p>
            </div>

            {/* Right Side */}
            <div className="w-[110px] pl-5 relative flex flex-col shrink-0">
                <p className="text-[11px] font-medium text-stone-600 dark:text-stone-300 leading-snug">
                    {summary.free} horários<br/>livres
                </p>
                <div className="absolute bottom-0 right-0 h-8 w-8 rounded-[10px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <CalendarIcon className="h-4 w-4 text-emerald-500" />
                </div>
            </div>
        </div>
    )
}

/* ═══════════════════════════════════════════
   DESKTOP: Next Actions Panel
   ═══════════════════════════════════════════ */
export function DesktopNextActionsPanel({ appointments, currentTime, onConfirmAll }: { appointments: Record<string, any[]>, currentTime: Date, onConfirmAll?: () => void }) {
    // 1. Pending count
    const allApts = Object.values(appointments).flat();
    const pendingCount = allApts.filter(a => a.status === 'pending').length;

    // 2. Next client
    const todayKey = currentTime.toISOString().split('T')[0];
    const todayApts = appointments[todayKey] || [];
    const nowTimeStr = currentTime.toTimeString().slice(0, 5);
    const nextApt = todayApts
        .filter(a => (a.status === 'confirmed' || a.status === 'pending') && a.time >= nowTimeStr)
        .sort((a, b) => a.time.localeCompare(b.time))[0];

    // 3. Free slots (simplified for now)
    const freeSlotsToday = 3; // Placeholder logic for now, could be dynamic

    const actions = [];

    if (pendingCount > 0) {
        actions.push({
            icon: CalendarClock,
            title: `${pendingCount} ${pendingCount === 1 ? 'cliente aguardando' : 'clientes aguardando'} confirmação`,
            sub: "Agendamentos pendentes",
            btnLabel: "Confirmar todos",
            onClick: onConfirmAll,
            colorClass: "text-amber-500",
            bgClass: "bg-amber-500/10 border-amber-500/20"
        });
    }

    if (nextApt) {
        actions.push({
            icon: User,
            title: `Próximo cliente: ${nextApt.name}`,
            sub: `${nextApt.time} - ${nextApt.service}`,
            btnLabel: "Ver detalhes",
            colorClass: "text-emerald-500",
            bgClass: "bg-emerald-500/10 border-emerald-500/20"
        });
    }

    // Default placeholders if nothing else
    if (actions.length < 3) {
        actions.push({
            icon: CalendarIcon,
            title: "Tudo em dia!",
            sub: "Sua agenda está organizada",
            btnLabel: "Ver agenda",
            colorClass: "text-blue-500",
            bgClass: "bg-blue-500/10 border-blue-500/20"
        });
    }

    return (
        <div className="rounded-2xl border border-stone-200 dark:border-white/5 bg-white dark:bg-stone-900/30 p-5 shadow-sm">
            <h3 className="text-[11px] font-bold text-brand-primary uppercase tracking-[0.15em] mb-4">
                Próximas Ações
            </h3>
            
            <div className="space-y-3">
                {actions.map((act, i) => (
                    <div key={i} className="flex items-center gap-3 bg-stone-50 dark:bg-stone-900/20 hover:bg-stone-100 dark:hover:bg-stone-900/40 border border-stone-100 dark:border-white/5 p-3 rounded-[14px] transition-all cursor-pointer group">
                        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors", act.bgClass)}>
                            <act.icon className={cn("h-5 w-5", act.colorClass)} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200 truncate group-hover:text-brand-primary dark:group-hover:text-white transition-colors">{act.title}</h4>
                            <p className="text-[10px] text-stone-500 dark:text-stone-400 truncate mt-0.5">{act.sub}</p>
                        </div>
                        <button 
                            onClick={act.onClick}
                            className="shrink-0 h-8 px-3 rounded-full border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/40 flex items-center gap-1.5 text-[10px] font-medium text-brand-gold hover:bg-stone-50 dark:hover:bg-stone-800 group-hover:border-stone-300 dark:group-hover:border-stone-700 transition-all cursor-pointer"
                        >
                            {act.btnLabel}
                            <ChevronRight className="h-3 w-3" />
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-5 pt-4">
                <button className="w-full flex items-center justify-between text-xs font-bold text-brand-gold hover:text-amber-500 transition-colors cursor-pointer group">
                    Ver todas as ações
                    <ChevronRight className="h-4 w-4 text-stone-400 dark:text-stone-600 group-hover:text-brand-gold group-hover:translate-x-1 transition-all" />
                </button>
            </div>
        </div>
    )
}

/* ═══════════════════════════════════════════
   DESKTOP: Monthly Mini Calendar
   ═══════════════════════════════════════════ */
export function DesktopMiniCalendar({ currentMonth, setCurrentMonth, selectedDate, setSelectedDate, appointments, isDayFullyBlocked }: {
    currentMonth: Date
    setCurrentMonth: (d: Date) => void
    selectedDate: string
    setSelectedDate: (d: string) => void
    appointments: Record<string, any[]>
    isDayFullyBlocked: (d: string) => boolean
}) {
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

    const getDateKey = (day: number) => {
        const m = (currentMonth.getMonth() + 1).toString().padStart(2, "0")
        const d = day.toString().padStart(2, "0")
        return `${currentMonth.getFullYear()}-${m}-${d}`
    }

    return (
        <div className="rounded-2xl border border-stone-200 dark:border-white/5 bg-white dark:bg-stone-900/30 p-5 shadow-sm">
            <h3 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.15em] mb-4">Visão Mensal</h3>
            <div className="flex items-center justify-between mb-5">
                <span className="text-sm font-bold text-stone-900 dark:text-foreground capitalize">{MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
                <div className="flex gap-2">
                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="h-7 w-7 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 flex items-center justify-center text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-all cursor-pointer">
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button onClick={() => setCurrentMonth(new Date())} className="h-7 px-3 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 flex items-center justify-center text-[10px] font-bold text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-all cursor-pointer uppercase tracking-widest">
                        Hoje
                    </button>
                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="h-7 w-7 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 flex items-center justify-center text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-all cursor-pointer">
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-y-3 mb-2">
                {WEEKDAYS.map(d => <div key={d} className="text-center text-[9px] font-bold text-stone-500 uppercase tracking-widest">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-y-4">
                {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1
                    const dateKey = getDateKey(day)
                    const isSelected = dateKey === selectedDate
                    const apts = appointments[dateKey] || []
                    const isToday = dateKey === new Date().toISOString().split('T')[0]
                    const blocked = isDayFullyBlocked(dateKey)
                    return (
                        <button key={day} onClick={() => setSelectedDate(dateKey)}
                            className={cn(
                                "h-8 w-8 mx-auto rounded-full text-xs font-bold transition-all relative flex flex-col items-center justify-center cursor-pointer",
                                isSelected ? "bg-brand-gold text-white shadow-[0_0_10px_rgba(245,204,112,0.3)]" :
                                    isToday ? "text-brand-primary border border-brand-primary/30" :
                                        blocked ? "text-stone-300 dark:text-stone-600" : "text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-white"
                            )}>
                            <span>{day}</span>
                            <div className="flex gap-0.5 absolute -bottom-2">
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
            {/* Legend */}
            <div className="flex items-center justify-between gap-2 mt-6 pt-4 border-t border-stone-100 dark:border-white/5">
                <div className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /><span className="text-[9px] text-stone-500 dark:text-stone-400 font-medium">Tem agendamentos</span></div>
                <div className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-red-500" /><span className="text-[9px] text-stone-500 dark:text-stone-400 font-medium">Bloqueado</span></div>
                <div className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-stone-300 dark:bg-stone-600" /><span className="text-[9px] text-stone-500 dark:text-stone-400 font-medium">Sem agendamentos</span></div>
            </div>
        </div>
    )
}

/* ═══════════════════════════════════════════
   DESKTOP: Day Summary
   ═══════════════════════════════════════════ */
export function DesktopDaySummary({ summary, segmento }: {
    summary: { total: number; confirmed: number; pending: number; blocked: number; free: number; completed: number },
    segmento?: string
}) {
    return (
        <div className="rounded-2xl border border-stone-200 dark:border-white/5 bg-white dark:bg-stone-900/30 p-5 shadow-sm">
            <h3 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.15em] mb-4">Resumo do Dia</h3>
            <div className="grid grid-cols-3 gap-2 mb-2">
                <div className="col-span-1 rounded-xl bg-stone-50 dark:bg-stone-900/50 border border-stone-100 dark:border-white/5 p-3">
                    <p className="text-xl font-bold text-stone-700 dark:text-stone-300 mb-1">{summary.total + summary.completed}</p>
                    <p className="text-[9px] text-stone-500 dark:text-stone-400 leading-tight">Total de<br />{segmento === 'advocacia' ? 'consultas' : 'agendamentos'}</p>
                </div>
                <div className="col-span-1 rounded-xl bg-emerald-500/[0.03] border border-emerald-500/10 p-3 relative overflow-hidden">
                    <CheckCircle2 className="absolute -bottom-2 -right-2 h-10 w-10 text-emerald-500/10" />
                    <p className="text-xl font-bold text-emerald-500 mb-1">{summary.confirmed}</p>
                    <p className="text-[9px] text-emerald-500/70 leading-tight">Confirmados</p>
                </div>
                <div className="col-span-1 rounded-xl bg-brand-primary/[0.03] border border-brand-primary/10 p-3 relative overflow-hidden">
                    <CalendarDays className="absolute -bottom-2 -right-2 h-10 w-10 text-brand-primary/10" />
                    <p className="text-xl font-bold text-brand-primary mb-1">{summary.pending}</p>
                    <p className="text-[9px] text-brand-primary/70 leading-tight">Pendentes</p>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div className="col-span-1 rounded-xl bg-red-500/[0.03] border border-red-500/10 p-3">
                    <p className="text-xl font-bold text-red-500 mb-1">{summary.blocked}</p>
                    <p className="text-[9px] text-red-500/70 leading-tight">Bloqueados</p>
                </div>
                <div className="col-span-1 rounded-xl bg-stone-50 dark:bg-stone-900/50 border border-stone-100 dark:border-white/5 p-3">
                    <p className="text-xl font-bold text-stone-700 dark:text-stone-300 mb-1">{summary.free}</p>
                    <p className="text-[9px] text-stone-500 dark:text-stone-400 leading-tight"><Clock className="inline h-2.5 w-2.5 mb-0.5 mr-0.5" />Horários livres</p>
                </div>
            </div>
        </div>
    )
}

/* ═══════════════════════════════════════════
   DESKTOP: Free Slots Grid
   ═══════════════════════════════════════════ */
export function DesktopFreeSlots({ slots, onAddAt, maxShow = 6 }: {
    slots: string[]
    onAddAt: (time: string) => void
    maxShow?: number
}) {
    const [showAll, setShowAll] = React.useState(false)
    const visible = showAll ? slots : slots.slice(0, maxShow)

    return (
        <div className="rounded-2xl border border-stone-200 dark:border-white/5 bg-white dark:bg-stone-900/30 p-5 shadow-sm">
            <h3 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.15em] mb-4">Próximos Horários Livres</h3>
            {slots.length === 0 ? (
                <p className="text-xs text-stone-400 dark:text-stone-600 text-center py-3">Nenhum horário livre</p>
            ) : (
                <>
                    <div className="grid grid-cols-4 gap-2">
                        {visible.map(time => (
                            <button key={time} onClick={() => onAddAt(time)}
                                className="h-9 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-white/5 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:border-brand-primary/30 hover:text-brand-primary hover:bg-brand-primary/5 transition-all cursor-pointer">
                                {time}
                            </button>
                        ))}
                        {slots.length > maxShow && !showAll && (
                            <button onClick={() => setShowAll(true)}
                                className="h-9 col-span-2 rounded-xl text-[10px] font-bold text-brand-primary border border-stone-200 dark:border-white/5 hover:border-brand-primary/30 hover:bg-brand-primary/5 transition-all cursor-pointer">
                                Ver todos
                            </button>
                        )}
                        {showAll && (
                            <button onClick={() => setShowAll(false)}
                                className="h-9 col-span-4 mt-1 rounded-xl text-[10px] font-bold text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-white/5 hover:bg-stone-50 dark:hover:bg-white/5 transition-all cursor-pointer">
                                Mostrar menos
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}
