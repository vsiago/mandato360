"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Phone, Scissors, Loader2, Plus, XCircle, Calendar, Clock as ClockIcon } from "lucide-react"
import { createAppointmentAction, updateAppointmentAction } from "@/lib/actions/appointments"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { BaseModal } from "./BaseModal"

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
                
                // Parse multiple services if they exist in notes as JSON
                let ids = [appointment.serviceId].filter(Boolean)
                if (appointment.notes?.startsWith('{"serviceIds"')) {
                    try {
                        const data = JSON.parse(appointment.notes)
                        if (Array.isArray(data.serviceIds)) {
                            ids = data.serviceIds
                        }
                    } catch (e) {
                        console.error("Failed to parse services from notes", e)
                    }
                }
                
                setSelectedServices(ids.length > 0 ? ids : (initialServices[0] ? [initialServices[0].id] : []))
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
                categoryId: "default",
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

    const handleSubmit = async () => {
        const validServices = selectedServices.filter(id => id !== "")
        if (!name || validServices.length === 0) {
            toast.error("Por favor, preencha o nome e selecione pelo menos um serviço.")
            return
        }

        setLoading(true)
        try {
            const mainServiceId = validServices[0]
            const extraServicesText = validServices.slice(1).map(id => {
                const s = services.find(srv => srv.id === id)
                return s ? s.name : ""
            }).filter(Boolean).join(", ")

            // Store IDs as JSON in notes to allow parsing back when editing
            const notesData = {
                serviceIds: validServices,
                displayText: extraServicesText ? `Serviços adicionais: ${extraServicesText}` : (appointment?.notes?.startsWith('{"serviceIds"') ? "" : (appointment?.notes || ""))
            }

            const payload = {
                customerName: name,
                customerPhone: phone,
                serviceId: mainServiceId,
                notes: JSON.stringify(notesData),
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
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={appointment ? 'Editar Agendamento' : 'Novo Agendamento'}
            description={appointment 
                ? `Atualize os dados para o horário das ${appointment.time}.`
                : `Preencha os dados para o horário de ${time} no dia ${date.split('-').reverse().join('/')}.`
            }
            icon={Calendar}
            maxWidth="sm:max-w-[500px]"
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
                        onClick={handleSubmit}
                        disabled={loading}
                        className="rounded-2xl bg-brand-gold text-stone-950 font-bold px-8 shadow-xl shadow-brand-secondary/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] text-[10px] uppercase tracking-widest h-12 flex-1 cursor-pointer"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        {appointment ? 'Salvar Alterações' : 'Confirmar Agendamento'}
                    </Button>
                </div>
            }
        >
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-3">
                    <Label className="text-[10px] uppercase tracking-widest font-black text-stone-500 ml-1 flex items-center gap-2">
                        <User className="h-3 w-3" /> Dados do Cliente
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500 group-focus-within:text-brand-primary transition-colors" />
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nome do cliente"
                                className="pl-11 rounded-2xl border-white/5 bg-stone-950/40 text-stone-200 focus:ring-brand-primary/20 focus:border-brand-primary/40 transition-all h-12 text-sm"
                            />
                        </div>
                        <div className="relative group">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500 group-focus-within:text-brand-primary transition-colors" />
                            <Input
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="WhatsApp (opcional)"
                                className="pl-11 rounded-2xl border-white/5 bg-stone-950/40 text-stone-200 focus:ring-brand-primary/20 focus:border-brand-primary/40 transition-all h-12 text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between ml-1">
                        <Label className="text-[10px] uppercase tracking-widest font-black text-stone-500 flex items-center gap-2">
                            <Scissors className="h-3 w-3" /> Serviços Selecionados
                        </Label>
                        <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={handleAddService}
                            className="h-7 text-[9px] uppercase tracking-widest font-black text-brand-primary hover:bg-brand-primary/10 rounded-xl px-3 transition-all"
                        >
                            <Plus className="h-3 w-3 mr-1" /> Adicionar outro
                        </Button>
                    </div>
                    
                    <div className="space-y-3">
                        {selectedServices.map((id, index) => (
                            <div key={index} className="flex items-center gap-2 group/item animate-in fade-in slide-in-from-top-1 duration-200">
                                <div className="relative flex-1 group">
                                    <Scissors className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500 group-focus-within:text-brand-primary transition-colors z-10" />
                                    <Select value={id} onValueChange={(val) => handleUpdateService(index, val)}>
                                        <SelectTrigger className="pl-11 rounded-2xl border-white/5 bg-stone-950/40 text-stone-200 focus:ring-brand-primary/20 focus:border-brand-primary/40 transition-all h-12 text-sm">
                                            <SelectValue placeholder="Selecione um serviço" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-white/10 bg-stone-900 shadow-2xl text-stone-200">
                                            {services.map(s => (
                                                <SelectItem key={s.id} value={s.id} className="rounded-xl focus:bg-stone-800 text-sm">
                                                    {s.name} {s.price ? `• R$ ${parseFloat(s.price).toFixed(0)}` : ""}
                                                </SelectItem>
                                            ))}
                                            <SelectSeparator />
                                            <button 
                                                onClick={(e) => { e.preventDefault(); setIsAddingNewService(true); }}
                                                className="w-full flex items-center gap-2 px-2 py-2 text-[10px] font-black uppercase tracking-widest text-brand-primary hover:bg-brand-primary/5 rounded-xl transition-colors"
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
                                        className="h-12 w-12 rounded-2xl text-stone-500 hover:text-red-500 hover:bg-red-500/10 shrink-0 transition-all"
                                    >
                                        <XCircle className="h-5 w-5" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {isAddingNewService && (
                    <div className="p-5 rounded-2xl bg-brand-primary/[0.03] border border-brand-primary/10 space-y-4 animate-in zoom-in-95 duration-200 shadow-inner">
                        <div className="flex items-center justify-between">
                            <span className="text-[9px] uppercase tracking-widest font-black text-brand-primary">Novo Serviço Rápido</span>
                            <button onClick={() => setIsAddingNewService(false)} className="text-stone-500 hover:text-stone-300 transition-colors">
                                <XCircle className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[9px] uppercase tracking-widest font-black text-stone-600 ml-1">Nome</Label>
                                <Input 
                                    placeholder="Ex: Barba" 
                                    value={newServiceName}
                                    onChange={(e) => setNewServiceName(e.target.value)}
                                    className="h-11 rounded-xl text-xs bg-stone-950 border-white/5 text-stone-200 focus:border-brand-primary/30"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[9px] uppercase tracking-widest font-black text-stone-600 ml-1">Preço (R$)</Label>
                                <Input 
                                    placeholder="0,00" 
                                    type="number"
                                    value={newServicePrice}
                                    onChange={(e) => setNewServicePrice(e.target.value)}
                                    className="h-11 rounded-xl text-xs bg-stone-950 border-white/5 text-stone-200 focus:border-brand-primary/30"
                                />
                            </div>
                        </div>
                        <Button 
                            type="button"
                            onClick={handleQuickCreateService}
                            className="w-full h-11 rounded-xl bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 font-black text-[10px] uppercase tracking-widest transition-all border border-brand-primary/20"
                        >
                            Criar e Selecionar
                        </Button>
                    </div>
                )}
            </div>
        </BaseModal>
    )
}
