"use client"

import * as React from "react"
import { Clock, Loader2, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { saveTenant } from "@/lib/tenant-api"
import { BaseModal } from "./BaseModal"
import { cn } from "@/lib/utils"

interface BusinessHoursModalProps {
    isOpen: boolean
    onClose: () => void
    tenant: any
    onSuccess: (updatedTenant: any) => void
}

const DAYS_OF_WEEK = [
    { id: '0', label: 'Domingo' },
    { id: '1', label: 'Segunda-feira' },
    { id: '2', label: 'Terça-feira' },
    { id: '3', label: 'Quarta-feira' },
    { id: '4', label: 'Quinta-feira' },
    { id: '5', label: 'Sexta-feira' },
    { id: '6', label: 'Sábado' },
]

export function BusinessHoursModal({ isOpen, onClose, tenant, onSuccess }: BusinessHoursModalProps) {
    const [loading, setLoading] = React.useState(false)
    const [hours, setHours] = React.useState<any>({})

    React.useEffect(() => {
        if (isOpen && tenant) {
            const initial = { ...tenant.businessHours }
            // Ensure defaults if missing
            DAYS_OF_WEEK.forEach(day => {
                if (!initial[day.id]) {
                    initial[day.id] = {
                        isOpen: day.id !== '0', // Sunday closed by default
                        start: "08:00",
                        end: day.id === '6' ? "12:00" : "18:00"
                    }
                }
            })
            setHours(initial)
        }
    }, [isOpen, tenant])

    const handleToggleDay = (dayId: string) => {
        setHours((prev: any) => ({
            ...prev,
            [dayId]: {
                ...prev[dayId],
                isOpen: !prev[dayId]?.isOpen,
                start: prev[dayId]?.start || "08:00",
                end: prev[dayId]?.end || "18:00",
            }
        }))
    }

    const handleChangeTime = (dayId: string, field: 'start' | 'end', value: string) => {
        setHours((prev: any) => ({
            ...prev,
            [dayId]: {
                ...prev[dayId],
                [field]: value
            }
        }))
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            const updatedData = {
                ...tenant,
                businessHours: hours
            }
            await saveTenant(updatedData)
            toast.success("Horários de funcionamento atualizados!")
            onSuccess(updatedData)
            onClose()
        } catch (error) {
            console.error("Error saving business hours:", error)
            toast.error("Erro ao salvar horários.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Horário de Funcionamento"
            description="Configure os dias e horários padrão em que sua agenda estará aberta."
            icon={Clock}
            maxWidth="sm:max-w-[500px]"
            footer={
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-white/5 pt-6">
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-stone-500 font-medium leading-relaxed max-w-[240px] sm:max-w-none">
                            As alterações serão aplicadas a todos os novos agendamentos e visualizações.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
                        <Button 
                            variant="ghost" 
                            onClick={onClose}
                            className="h-11 px-6 rounded-2xl text-stone-500 hover:text-stone-300 transition-all text-[10px] font-bold uppercase tracking-widest"
                        >
                            Cancelar
                        </Button>
                        <Button 
                            onClick={handleSave}
                            disabled={loading}
                            className="flex-1 sm:flex-none h-11 px-8 rounded-2xl bg-brand-gold text-stone-950 font-bold uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-brand-secondary/20 active:scale-[0.98] cursor-pointer flex items-center gap-2 text-[10px]"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Salvar Configurações
                        </Button>
                    </div>
                </div>
            }
        >
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {DAYS_OF_WEEK.map((day) => {
                    const defaultIsOpen = day.id !== '0' // Sunday inactive
                    const defaultEnd = day.id === '6' ? "12:00" : "18:00" // Saturday until noon
                    const config = hours[day.id] || { isOpen: defaultIsOpen, start: "08:00", end: defaultEnd }
                    
                    return (
                        <div 
                            key={day.id}
                            className={cn(
                                "p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-4",
                                config.isOpen 
                                    ? "bg-stone-950/40 border-brand-primary/20 shadow-lg shadow-brand-primary/5" 
                                    : "bg-stone-900/50 border-white/5 opacity-60"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <Switch 
                                    checked={config.isOpen}
                                    onCheckedChange={() => handleToggleDay(day.id)}
                                    className="data-[state=checked]:bg-brand-primary"
                                />
                                <div>
                                    <p className="text-sm font-bold text-foreground">{day.label}</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">
                                        {config.isOpen ? "Aberto para agendamentos" : "Fechado / Indisponível"}
                                    </p>
                                </div>
                            </div>

                            {config.isOpen && (
                                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-stone-600 text-center">Início</p>
                                        <input 
                                            type="time" 
                                            value={config.start}
                                            onChange={(e) => handleChangeTime(day.id, 'start', e.target.value)}
                                            className="h-9 w-24 bg-stone-900 border border-white/5 rounded-xl px-2 text-xs font-bold text-stone-300 focus:outline-none focus:border-brand-primary/50 transition-colors [color-scheme:dark]"
                                        />
                                    </div>
                                    <div className="mt-4 text-stone-700">—</div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-stone-600 text-center">Fim</p>
                                        <input 
                                            type="time" 
                                            value={config.end}
                                            onChange={(e) => handleChangeTime(day.id, 'end', e.target.value)}
                                            className="h-9 w-24 bg-stone-900 border border-white/5 rounded-xl px-2 text-xs font-bold text-stone-300 focus:outline-none focus:border-brand-primary/50 transition-colors [color-scheme:dark]"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </BaseModal>
    )
}
