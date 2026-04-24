"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Phone, Scissors, Loader2 } from "lucide-react"
import { createAppointmentAction } from "@/lib/actions/appointments"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Service {
    id: string
    name: string
    price: string | null
    duration: number | null
}

interface AddAppointmentModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: (appointment: any) => void
    date: string
    time: string
    tenantId: string
    services: Service[]
}

export function AddAppointmentModal({ isOpen, onClose, onSuccess, date, time, tenantId, services }: AddAppointmentModalProps) {
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [serviceId, setServiceId] = useState("")

    useEffect(() => {
        if (isOpen) {
            setName("")
            setPhone("")
            setServiceId(services[0]?.id || "")
        }
    }, [isOpen, services])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name || !serviceId) {
            toast.error("Por favor, preencha o nome e selecione um serviço.")
            return
        }

        setLoading(true)
        try {
            const result = await createAppointmentAction({
                tenantId,
                customerName: name,
                customerPhone: phone,
                serviceId,
                date,
                time,
                status: "confirmed"
            })

            if (result.success) {
                toast.success("Agendamento realizado com sucesso!")
                onSuccess(result.appointment)
                onClose()
            } else {
                toast.error(result.error || "Erro ao realizar agendamento.")
            }
        } catch (error) {
            toast.error("Erro inesperado ao realizar agendamento.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-106.25 bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold tracking-tight text-foreground" style={{ fontFamily: 'var(--font-playfair)' }}>
                        Novo Agendamento
                    </DialogTitle>
                    <DialogDescription className="text-stone-500 dark:text-stone-400 text-sm">
                        Preencha os dados do cliente para o horário de <span className="font-bold text-amber-500">{time}</span> no dia <span className="font-bold text-amber-500">{date.split('-').reverse().join('/')}</span>.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-[10px] uppercase tracking-widest font-bold text-stone-400 ml-1">Nome do Cliente</Label>
                            <div className="relative group">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-300 group-focus-within:text-amber-500 transition-colors" />
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ex: Maria Oliveira"
                                    className="pl-10 rounded-2xl border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 focus:ring-amber-500/20 focus:border-amber-500/40 transition-all h-12"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-[10px] uppercase tracking-widest font-bold text-stone-400 ml-1">WhatsApp (Opcional)</Label>
                            <div className="relative group">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-300 group-focus-within:text-amber-500 transition-colors" />
                                <Input
                                    id="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="21 99999-9999"
                                    className="pl-10 rounded-2xl border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 focus:ring-amber-500/20 focus:border-amber-500/40 transition-all h-12"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="service" className="text-[10px] uppercase tracking-widest font-bold text-stone-400 ml-1">Serviço</Label>
                            <div className="relative group">
                                <Scissors className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-300 group-focus-within:text-amber-500 transition-colors" />
                                <select
                                    id="service"
                                    value={serviceId}
                                    onChange={(e) => setServiceId(e.target.value)}
                                    className="w-full pl-10 pr-4 rounded-2xl border border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/40 transition-all h-12 text-sm appearance-none outline-none"
                                >
                                    {services.map(s => (
                                        <option key={s.id} value={s.id} className="bg-white dark:bg-stone-950">
                                            {s.name} {s.price ? `(R$ ${parseFloat(s.price).toFixed(0)})` : ""}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            className="rounded-xl text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                            Confirmar Agendamento
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
