"use client"

import { useState } from "react"
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Clock, Check, Save } from "lucide-react"
import { cn } from "@/lib/utils"

const WEEKDAYS = [
    { id: 0, label: "Domingo" },
    { id: 1, label: "Segunda-feira" },
    { id: 2, label: "Terça-feira" },
    { id: 3, label: "Quarta-feira" },
    { id: 4, label: "Quinta-feira" },
    { id: 5, label: "Sexta-feira" },
    { id: 6, label: "Sábado" },
]

interface BusinessHoursModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (config: any) => void
    initialConfig?: any
}

export function BusinessHoursModal({ isOpen, onClose, onSave, initialConfig }: BusinessHoursModalProps) {
    const [config, setConfig] = useState(initialConfig || {
        0: { open: false, start: "08:00", end: "18:00" },
        1: { open: true, start: "08:00", end: "18:00" },
        2: { open: true, start: "08:00", end: "18:00" },
        3: { open: true, start: "08:00", end: "18:00" },
        4: { open: true, start: "08:00", end: "18:00" },
        5: { open: true, start: "08:00", end: "18:00" },
        6: { open: false, start: "08:00", end: "12:00" },
    })

    const handleToggle = (dayId: number) => {
        setConfig((prev: any) => ({
            ...prev,
            [dayId]: { ...prev[dayId], open: !prev[dayId].open }
        }))
    }

    const handleTimeChange = (dayId: number, field: 'start' | 'end', value: string) => {
        setConfig((prev: any) => ({
            ...prev,
            [dayId]: { ...prev[dayId], [field]: value }
        }))
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl bg-stone-950 border-white/5 rounded-3xl p-0 overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/5 bg-gradient-to-br from-stone-900 to-stone-950">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="h-12 w-12 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center shadow-inner">
                            <Clock className="h-6 w-6 text-brand-gold" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-bold text-white tracking-tight">Horário de Funcionamento</DialogTitle>
                            <DialogDescription className="text-stone-500 font-medium">
                                Configure os dias e horários padrão em que sua agenda estará aberta.
                            </DialogDescription>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {WEEKDAYS.map((day) => {
                        const dayConfig = config[day.id]
                        return (
                            <div 
                                key={day.id}
                                className={cn(
                                    "flex items-center justify-between p-4 rounded-2xl border transition-all duration-300",
                                    dayConfig.open 
                                        ? "bg-stone-900/40 border-brand-gold/10 shadow-lg" 
                                        : "bg-stone-950/40 border-white/5 opacity-60"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <Switch 
                                        checked={dayConfig.open}
                                        onCheckedChange={() => handleToggle(day.id)}
                                        className="data-[state=checked]:bg-brand-gold"
                                    />
                                    <div>
                                        <p className={cn(
                                            "text-sm font-bold tracking-tight transition-colors",
                                            dayConfig.open ? "text-white" : "text-stone-500"
                                        )}>
                                            {day.label}
                                        </p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-stone-600 mt-0.5">
                                            {dayConfig.open ? "Aberto para agendamentos" : "Fechado / Indisponível"}
                                        </p>
                                    </div>
                                </div>

                                {dayConfig.open && (
                                    <div className="flex items-center gap-2">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[9px] font-black text-stone-600 uppercase tracking-widest px-1">Início</span>
                                            <input 
                                                type="time" 
                                                value={dayConfig.start}
                                                onChange={(e) => handleTimeChange(day.id, 'start', e.target.value)}
                                                className="bg-stone-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:border-brand-gold/50 transition-all outline-none"
                                            />
                                        </div>
                                        <div className="h-4 w-4 flex items-center justify-center mt-4">
                                            <div className="h-0.5 w-2 bg-stone-700" />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[9px] font-black text-stone-600 uppercase tracking-widest px-1">Fim</span>
                                            <input 
                                                type="time" 
                                                value={dayConfig.end}
                                                onChange={(e) => handleTimeChange(day.id, 'end', e.target.value)}
                                                className="bg-stone-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:border-brand-gold/50 transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                <DialogFooter className="p-6 bg-stone-900/20 border-t border-white/5 sm:justify-between items-center">
                    <p className="text-[10px] font-medium text-stone-500 max-w-[200px]">
                        As alterações serão aplicadas a todos os novos agendamentos e visualizações.
                    </p>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" onClick={onClose} className="rounded-xl text-stone-400 hover:text-white hover:bg-stone-800">
                            Cancelar
                        </Button>
                        <Button 
                            onClick={() => onSave(config)}
                            className="bg-brand-gold text-stone-950 hover:bg-brand-gold/90 font-bold rounded-xl px-6 gap-2"
                        >
                            <Save className="h-4 w-4" />
                            Salvar Configurações
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
