"use client"

import React, { useState, useEffect } from "react"
import { BaseModal } from "./BaseModal"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon, Clock, Loader2, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { getPublicAppointmentsByDateAction, updateAppointmentAction } from "@/lib/actions/appointments"
import { toast } from "sonner"
import { ptBR } from "date-fns/locale"
import { format } from "date-fns"

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
        if (isOpen && appointment) {
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
            // Small delay to make it feel smooth
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
            if (config && config.isOpen) {
                const [h, m] = time.split(':').map(Number)
                const [openH, openM] = config.open.split(':').map(Number)
                const [closeH, closeM] = config.close.split(':').map(Number)
                const timeVal = h * 60 + m
                const openVal = openH * 60 + openM
                const closeVal = closeH * 60 + closeM
                isOpenByConfig = timeVal >= openVal && timeVal < closeVal
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

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Reagendar Horário"
            description={`Escolha uma nova data e horário para ${appointment?.name}.`}
            icon={CalendarIcon}
            maxWidth="sm:max-w-4xl"
            footer={
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-white/5">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="rounded-2xl text-stone-500 hover:text-stone-300 font-bold text-[10px] uppercase tracking-widest flex-1 h-12"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={saving || !selectedDate || !selectedTime || (format(selectedDate, "yyyy-MM-dd") === appointment?.date && selectedTime === appointment?.time)}
                        className="rounded-2xl bg-brand-gold text-stone-950 font-bold px-8 shadow-xl shadow-brand-secondary/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] text-[10px] uppercase tracking-widest h-12 flex-1 cursor-pointer"
                    >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        Confirmar Reagendamento
                    </Button>
                </div>
            }
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Date Picker Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-stone-500 mb-2">
                        <CalendarIcon className="h-3 w-3" /> 1. Nova Data
                    </div>
                    <div className="p-4 rounded-3xl bg-stone-950/40 border border-white/5 shadow-inner flex justify-center">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            locale={ptBR}
                            className="p-0"
                            disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                        />
                    </div>
                </div>

                {/* Time Selection Section */}
                <div className="space-y-4 flex flex-col">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-stone-500 mb-2">
                        <span className="flex items-center gap-2"><Clock className="h-3 w-3" /> 2. Novo Horário</span>
                        {selectedDate && <span className="text-brand-primary">{format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}</span>}
                    </div>

                    <div className="flex-1 min-h-[300px] p-4 rounded-3xl bg-stone-950/40 border border-white/5 shadow-inner overflow-y-auto custom-scrollbar">
                        {loading ? (
                            <div className="h-full w-full flex flex-col items-center justify-center gap-3">
                                <Loader2 className="h-8 w-8 text-brand-primary animate-spin" />
                                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Buscando horários...</p>
                            </div>
                        ) : availableSlots.length === 0 ? (
                            <div className="h-full w-full flex flex-col items-center justify-center gap-4 text-center opacity-50">
                                <Clock className="w-10 h-10 text-stone-600" />
                                <p className="text-xs font-bold text-stone-500">Nenhum horário disponível para esta data.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-2">
                                {availableSlots.map((slot) => (
                                    <button
                                        key={slot.time}
                                        onClick={() => setSelectedTime(slot.time)}
                                        className={cn(
                                            "h-12 rounded-xl border font-bold text-xs transition-all flex flex-col items-center justify-center relative overflow-hidden group",
                                            selectedTime === slot.time
                                                ? "bg-brand-gold border-brand-gold text-stone-950 shadow-lg shadow-brand-gold/10"
                                                : slot.isCurrent
                                                    ? "bg-stone-800/30 border-brand-primary/20 text-brand-primary cursor-default pointer-events-none"
                                                    : "bg-stone-900/50 border-white/5 text-stone-400 hover:border-brand-primary/30 hover:text-brand-primary hover:bg-brand-primary/5"
                                        )}
                                    >
                                        {slot.time}
                                        {slot.isCurrent && (
                                            <span className="absolute top-0 right-0 p-1 bg-brand-primary/10 text-[6px] font-black uppercase tracking-tighter rounded-bl-lg text-brand-primary">Atual</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
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
