"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Phone, Scissors, Loader2, Plus, XCircle } from "lucide-react"
import { createAppointmentAction, updateAppointmentAction } from "@/lib/actions/appointments"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue,
    SelectSeparator
} from "@/components/ui/select"
import { createServiceAction } from "@/lib/actions/services"

interface Service {
    id: string
    name: string
    price: string | null
    duration: number | null
}

interface AppointmentModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: (appointment: any) => void
    date: string
    time: string
    tenantId: string
    services: Service[]
    appointment?: any // For editing
}

export function AppointmentModal({ 
    isOpen, 
    onClose, 
    onSuccess, 
    date, 
    time, 
    tenantId, 
    services: initialServices,
    appointment
}: AppointmentModalProps) {
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [selectedServices, setSelectedServices] = useState<string[]>([])
    const [services, setServices] = useState<Service[]>(initialServices)
    
    // Quick add service state
    const [isAddingNewService, setIsAddingNewService] = useState(false)
    const [newServiceName, setNewServiceName] = useState("")
    const [newServicePrice, setNewServicePrice] = useState("")

    useEffect(() => {
        if (isOpen) {
            if (appointment) {
                setName(appointment.name || "")
                setPhone(appointment.phone || "")
                // Restore primary service. Restoring extra from notes string is simplified to just primary for now.
                const initial = [appointment.serviceId].filter(Boolean)
                setSelectedServices(initial.length > 0 ? initial : (initialServices[0] ? [initialServices[0].id] : []))
            } else {
                setName("")
                setPhone("")
                setSelectedServices(initialServices[0] ? [initialServices[0].id] : [])
                setIsAddingNewService(false)
            }
            setServices(initialServices)
        }
    }, [isOpen, initialServices, appointment])

    const handleAddService = () => {
        setSelectedServices([...selectedServices, ""])
    }

    const handleRemoveService = (index: number) => {
        const newSelected = [...selectedServices]
        newSelected.splice(index, 1)
        setSelectedServices(newSelected)
    }

    const handleUpdateService = (index: number, value: string) => {
        const newSelected = [...selectedServices]
        newSelected[index] = value
        setSelectedServices(newSelected)
    }

    const handleQuickCreateService = async () => {
        if (!newServiceName) return
        
        setLoading(true)
        try {
            const result = await createServiceAction(tenantId, {
                name: newServiceName,
                price: parseFloat(newServicePrice) || 0,
                categoryId: "default", // Assign to a default category
                isActive: true
            })

            if (result.success && result.service) {
                const createdService = {
                    id: result.service.id,
                    name: result.service.name,
                    price: result.service.price,
                    duration: result.service.duration
                }
                setServices([...services, createdService])
                // Update the last empty or new service slot with this one
                const newSelected = [...selectedServices]
                const lastEmptyIndex = newSelected.findIndex(id => id === "")
                if (lastEmptyIndex !== -1) {
                    newSelected[lastEmptyIndex] = createdService.id
                } else {
                    newSelected.push(createdService.id)
                }
                setSelectedServices(newSelected)
                setIsAddingNewService(false)
                setNewServiceName("")
                setNewServicePrice("")
                toast.success("Serviço criado!")
            }
        } catch (error) {
            toast.error("Erro ao criar serviço.")
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const validServices = selectedServices.filter(id => id !== "")
        if (!name || validServices.length === 0) {
            toast.error("Por favor, preencha o nome e selecione pelo menos um serviço.")
            return
        }

        setLoading(true)
        try {
            const mainServiceId = validServices[0]
            const extraServices = validServices.slice(1).map(id => {
                const s = services.find(srv => srv.id === id)
                return s ? s.name : ""
            }).filter(Boolean).join(", ")

            const payload = {
                customerName: name,
                customerPhone: phone,
                serviceId: mainServiceId,
                notes: extraServices ? `Serviços adicionais: ${extraServices}` : (appointment?.notes || ""),
                status: appointment?.status || "confirmed"
            }

            let result
            if (appointment) {
                result = await updateAppointmentAction(appointment.id, tenantId, payload)
            } else {
                result = await createAppointmentAction({
                    ...payload,
                    tenantId,
                    date,
                    time,
                })
            }

            if (result.success) {
                toast.success(appointment ? "Agendamento atualizado!" : "Agendamento realizado!")
                onSuccess(result.appointment)
                onClose()
            } else {
                toast.error(result.error || "Erro ao salvar agendamento.")
            }
        } catch (error) {
            toast.error("Erro inesperado.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[480px] bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800/60 rounded-[32px] shadow-2xl p-0 overflow-hidden backdrop-blur-xl">
                <DialogHeader className="p-8 pb-4">
                    <DialogTitle className="text-2xl font-bold tracking-tight text-foreground" style={{ fontFamily: 'var(--font-serif)' }}>
                        {appointment ? 'Editar Agendamento' : 'Novo Agendamento'}
                    </DialogTitle>
                    <DialogDescription className="text-stone-500 dark:text-stone-400 text-sm mt-2">
                        {appointment 
                            ? `Atualize os dados para o horário das ${appointment.time}.`
                            : `Preencha os dados para o horário de ${time} no dia ${date.split('-').reverse().join('/')}.`
                        }
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 p-8 pt-0">
                    <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-widest font-black text-stone-500 ml-1">Dados do Cliente</Label>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 group-focus-within:text-brand-primary transition-colors" />
                                    <Input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Nome"
                                        className="pl-11 rounded-2xl border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 focus:ring-brand-primary/20 focus:border-brand-primary/40 transition-all h-11 text-sm"
                                    />
                                </div>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 group-focus-within:text-brand-primary transition-colors" />
                                    <Input
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="WhatsApp"
                                        className="pl-11 rounded-2xl border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 focus:ring-brand-primary/20 focus:border-brand-primary/40 transition-all h-11 text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between ml-1">
                                <Label className="text-[10px] uppercase tracking-widest font-black text-stone-500">Serviços Selecionados</Label>
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    onClick={handleAddService}
                                    className="h-6 text-[9px] uppercase tracking-widest font-bold text-brand-primary hover:bg-brand-primary/10 rounded-lg px-2"
                                >
                                    <Plus className="h-3 w-3 mr-1" /> Adicionar outro
                                </Button>
                            </div>
                            
                            <div className="space-y-3">
                                {selectedServices.map((id, index) => (
                                    <div key={index} className="flex items-center gap-2 group/item animate-in fade-in slide-in-from-top-1 duration-200">
                                        <div className="relative flex-1 group">
                                            <Scissors className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 group-focus-within:text-brand-primary transition-colors z-10" />
                                            <Select value={id} onValueChange={(val) => handleUpdateService(index, val)}>
                                                <SelectTrigger className="pl-11 rounded-2xl border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 focus:ring-brand-primary/20 focus:border-brand-primary/40 transition-all h-11 text-sm">
                                                    <SelectValue placeholder="Selecione um serviço" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-2xl border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 shadow-2xl">
                                                    {services.map(s => (
                                                        <SelectItem key={s.id} value={s.id} className="rounded-xl focus:bg-stone-100 dark:focus:bg-stone-900 text-sm">
                                                            {s.name} {s.price ? `• R$ ${parseFloat(s.price).toFixed(0)}` : ""}
                                                        </SelectItem>
                                                    ))}
                                                    <SelectSeparator />
                                                    <button 
                                                        onClick={(e) => { e.preventDefault(); setIsAddingNewService(true); }}
                                                        className="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-bold text-brand-primary hover:bg-brand-primary/5 rounded-xl transition-colors"
                                                    >
                                                        <Plus className="h-3 w-3" /> Criar novo serviço
                                                    </button>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {selectedServices.length > 1 && (
                                            <Button 
                                                type="button" 
                                                variant="ghost" 
                                                onClick={() => handleRemoveService(index)}
                                                className="h-11 w-11 rounded-2xl text-stone-400 hover:text-red-500 hover:bg-red-500/10 shrink-0"
                                            >
                                                <XCircle className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {isAddingNewService && (
                            <div className="p-4 rounded-2xl bg-brand-primary/[0.03] border border-brand-primary/10 space-y-4 animate-in zoom-in-95 duration-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] uppercase tracking-widest font-black text-brand-primary">Novo Serviço Rápido</span>
                                    <button onClick={() => setIsAddingNewService(false)} className="text-stone-400 hover:text-stone-600">
                                        <XCircle className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <Input 
                                        placeholder="Nome do serviço" 
                                        value={newServiceName}
                                        onChange={(e) => setNewServiceName(e.target.value)}
                                        className="h-10 rounded-xl text-xs bg-white dark:bg-stone-950"
                                    />
                                    <Input 
                                        placeholder="Preço (R$)" 
                                        type="number"
                                        value={newServicePrice}
                                        onChange={(e) => setNewServicePrice(e.target.value)}
                                        className="h-10 rounded-xl text-xs bg-white dark:bg-stone-950"
                                    />
                                </div>
                                <Button 
                                    type="button"
                                    onClick={handleQuickCreateService}
                                    className="w-full h-9 rounded-xl bg-brand-primary text-stone-950 font-bold text-[10px] uppercase tracking-widest"
                                >
                                    Criar e Selecionar
                                </Button>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="pt-2 gap-3 sm:gap-0">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            className="rounded-xl text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 font-bold text-xs uppercase tracking-widest"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="rounded-xl bg-brand-gold text-stone-950 font-bold px-8 shadow-lg shadow-brand-secondary/20 transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] text-xs uppercase tracking-widest h-11"
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
