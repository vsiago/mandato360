"use client"

import React, { useState, useEffect } from "react"
import { BaseModal } from "./BaseModal"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon, Clock, Loader2, ArrowRight, User, Hash, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { getPublicAppointmentsByDateAction, updateAppointmentAction } from "@/lib/actions/appointments"
import { toast } from "sonner"
import { ptBR } from "date-fns/locale"
import { format, parseISO } from "date-fns"

interface RescheduleModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    appointment: any
    tenantId: string
    businessHours?: any
}

const TIME_SLOTS = [
    "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"
]

export function RescheduleModal({
    isOpen,
    onClose,
    onSuccess,
    appointment,
    tenantId,
    businessHours
}: RescheduleModalProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [availableSlots, setAvailableSlots] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (isOpen && appointment && appointment.date) {
            // Parse appointment date (YYYY-MM-DD)
            const [y, m, d] = appointment.date.split("-").map(Number)
            setSelectedDate(new Date(y, m - 1, d))
            setSelectedTime(appointment.time)
        }
    }, [isOpen, appointment])

    useEffect(() => {
        if (selectedDate && tenantId && isOpen) {
            fetchSlots()
        }
    }, [selectedDate, tenantId, isOpen])

    const fetchSlots = async () => {
        if (!selectedDate) return
        setLoading(true)
        const dateStr = format(selectedDate, "yyyy-MM-dd")
        
        try {
            const res = await getPublicAppointmentsByDateAction(tenantId, dateStr)
            if (res.success && res.appointments) {
                calculateAvailableSlots(res.appointments)
            }
        } catch (error) {
            console.error("Error fetching slots:", error)
        } finally {
            setTimeout(() => setLoading(false), 300)
        }
    }

    const calculateAvailableSlots = (apts: any[]) => {
        if (!selectedDate) return
        const dayOfWeek = selectedDate.getDay().toString()
        const config = businessHours?.[dayOfWeek]

        const slots: any[] = []
        
        TIME_SLOTS.forEach(time => {
            // Don't count the current appointment as "occupied" if it's on the same day/time
            const apt = apts.find(a => a.time === time && a.id !== appointment?.id)
            const isOccupied = apt && apt.status !== 'liberado' && apt.status !== 'cancelled'
            const isBlocked = apt && apt.status === 'blocked'
            const isLiberado = apt && apt.status === 'liberado'

            let isOpenByConfig = false
            // FIX: Using 'start' and 'end' as per database schema/page.tsx logic
            if (config && config.isOpen) {
                const [h, m] = time.split(':').map(Number)
                const [startH, startM] = (config.start || "08:00").split(':').map(Number)
                const [endH, endM] = (config.end || "18:00").split(':').map(Number)
                const timeVal = h * 60 + m
                const startVal = startH * 60 + startM
                const endVal = endH * 60 + endM
                isOpenByConfig = timeVal >= startVal && timeVal < endVal
            } else if (!config) {
                // FALLBACK: If no config exists, assume standard business hours (8-18)
                // except for Sunday (0)
                const [h, m] = time.split(':').map(Number)
                const isSunday = dayOfWeek === '0'
                isOpenByConfig = !isSunday && h >= 8 && h < 18
            }

            const isAvailable = (isOpenByConfig || isLiberado) && !isOccupied && !isBlocked

            if (isAvailable) {
                slots.push({ 
                    time, 
                    isCurrent: time === appointment?.time && format(selectedDate, "yyyy-MM-dd") === appointment?.date 
                })
            }
        })

        setAvailableSlots(slots)
    }

    const handleConfirm = async () => {
        if (!selectedDate || !selectedTime || !appointment) return

        setSaving(true)
        try {
            const dateStr = format(selectedDate, "yyyy-MM-dd")
            const res = await updateAppointmentAction(appointment.id, tenantId, {
                date: dateStr,
                time: selectedTime
            })

            if (res.success) {
                toast.success("Agendamento reagendado com sucesso!")
                onSuccess()
                onClose()
            } else {
                toast.error(res.error || "Erro ao reagendar.")
            }
        } catch (error) {
            toast.error("Erro inesperado ao reagendar.")
        } finally {
            setSaving(false)
        }
    }

    const hasChanged = selectedDate && selectedTime && (format(selectedDate, "yyyy-MM-dd") !== appointment?.date || selectedTime !== appointment?.time)

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Reagendar Horário"
            description="Mova este agendamento para um novo dia ou horário disponível."
            icon={CalendarIcon}
            maxWidth="sm:max-w-4xl"
            footer={
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-white/5 w-full">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="rounded-2xl text-stone-500 hover:text-stone-300 font-bold text-[10px] uppercase tracking-widest flex-1 h-12"
                    >
                        Manter Atual
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={saving || !selectedDate || !selectedTime || !hasChanged}
                        className="rounded-2xl bg-brand-gold text-stone-950 font-bold px-8 shadow-xl shadow-brand-secondary/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] text-[10px] uppercase tracking-widest h-12 flex-1 cursor-pointer disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed"
                    >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        Confirmar Reagendamento
                    </Button>
                </div>
            }
        >
            <div className="space-y-8">
                {/* Appointment Header Info */}
                <div className="p-4 rounded-3xl bg-stone-900/30 border border-white/5 flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
                            <User className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-stone-500 leading-none mb-1">Cliente</p>
                            <p className="text-sm font-bold text-white">{appointment?.name}</p>
                        </div>
                    </div>
                    
                    <div className="h-8 w-px bg-white/5 hidden md:block" />

                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                            <Clock className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-stone-500 leading-none mb-1">Atual</p>
                            <p className="text-sm font-bold text-stone-300">
                                {appointment?.date && format(new Date(appointment.date + 'T12:00:00'), "dd/MM")} às {appointment?.time}
                            </p>
                        </div>
                    </div>

                    {hasChanged && (
                        <>
                            <div className="ml-auto hidden lg:block">
                                <ArrowRight className="h-5 w-5 text-brand-primary animate-pulse" />
                            </div>
                            <div className="flex items-center gap-3 bg-brand-primary/5 border border-brand-primary/10 p-2 pr-4 rounded-2xl animate-in zoom-in-95 duration-300">
                                <div className="h-10 w-10 rounded-full bg-brand-primary text-stone-950 flex items-center justify-center">
                                    <Check className="h-5 w-5" strokeWidth={3} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary leading-none mb-1">Novo Horário</p>
                                    <p className="text-sm font-black text-white">
                                        {format(selectedDate!, "dd/MM")} às {selectedTime}
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Date Picker Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-stone-500 mb-2">
                            <span className="flex items-center gap-2"><CalendarIcon className="h-3 w-3" /> 1. Escolha a Nova Data</span>
                            {selectedDate && <span className="text-brand-primary">{format(selectedDate, "yyyy")}</span>}
                        </div>
                        <div className="p-2 sm:p-4 rounded-3xl bg-stone-950/40 border border-white/5 shadow-inner flex justify-center overflow-hidden">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                locale={ptBR}
                                className="p-0 w-full"
                                style={{ 
                                    // @ts-ignore
                                    "--cell-size": "44px" 
                                }}
                                classNames={{
                                    months: "w-full",
                                    month: "w-full space-y-4",
                                    table: "w-full border-collapse",
                                    head_row: "flex w-full",
                                    head_cell: "text-stone-500 rounded-md flex-1 font-black text-[10px] uppercase tracking-widest",
                                    row: "flex w-full mt-2",
                                    cell: cn(
                                        "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 flex-1",
                                        "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
                                    ),
                                    day: cn(
                                        "h-10 w-10 p-0 font-bold aria-selected:opacity-100 rounded-xl transition-all"
                                    ),
                                    day_selected: "bg-brand-primary text-stone-950 hover:bg-brand-primary hover:text-stone-950 focus:bg-brand-primary focus:text-stone-950",
                                    day_today: "bg-stone-800/50 text-white",
                                    day_outside: "text-stone-700 opacity-50",
                                    day_disabled: "text-stone-800 opacity-20",
                                    day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                                    day_hidden: "invisible",
                                }}
                                disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                            />
                        </div>
                    </div>

                    {/* Time Selection Section */}
                    <div className="space-y-4 flex flex-col">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-stone-500 mb-2">
                            <span className="flex items-center gap-2"><Clock className="h-3 w-3" /> 2. Escolha o Novo Horário</span>
                            {selectedDate && <span className="text-brand-primary">{format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}</span>}
                        </div>

                        <div className="flex-1 min-h-[300px] p-4 rounded-3xl bg-stone-950/40 border border-white/5 shadow-inner overflow-y-auto custom-scrollbar relative">
                            {loading ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-stone-950/20 backdrop-blur-[2px] z-10">
                                    <Loader2 className="h-8 w-8 text-brand-primary animate-spin" />
                                    <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Verificando agenda...</p>
                                </div>
                            ) : availableSlots.length === 0 ? (
                                <div className="h-full w-full flex flex-col items-center justify-center gap-4 text-center py-10 opacity-60">
                                    <div className="h-16 w-16 rounded-full bg-stone-900 border border-white/5 flex items-center justify-center">
                                        <Clock className="w-8 h-8 text-stone-600" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-stone-300">Nenhum horário livre</p>
                                        <p className="text-[10px] text-stone-500 uppercase tracking-widest font-medium">Tente outra data no calendário</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 gap-2">
                                    {availableSlots.map((slot) => (
                                        <button
                                            key={slot.time}
                                            onClick={() => setSelectedTime(slot.time)}
                                            className={cn(
                                                "h-14 rounded-xl border font-bold text-xs transition-all flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer",
                                                selectedTime === slot.time
                                                    ? "bg-brand-gold border-brand-gold text-stone-950 shadow-lg shadow-brand-gold/20 scale-[1.02] z-10"
                                                    : slot.isCurrent
                                                        ? "bg-stone-800/30 border-brand-primary/20 text-brand-primary"
                                                        : "bg-stone-900/50 border-white/5 text-stone-400 hover:border-brand-primary/40 hover:text-brand-primary hover:bg-brand-primary/5 hover:scale-[1.02]"
                                            )}
                                        >
                                            <span className="text-base tabular-nums">{slot.time}</span>
                                            {slot.isCurrent && (
                                                <span className="absolute top-0 right-0 p-1 px-1.5 bg-brand-primary/10 text-[7px] font-black uppercase tracking-tighter rounded-bl-lg text-brand-primary">Atual</span>
                                            )}
                                            {selectedTime === slot.time && !slot.isCurrent && (
                                                <div className="absolute inset-0 bg-white/10 opacity-0 group-active:opacity-100 transition-opacity" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
            `}</style>
        </BaseModal>
    )
}
