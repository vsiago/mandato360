"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Phone, Scissors, Loader2, Plus, XCircle, Calendar, Clock as ClockIcon, Briefcase, Scale, Banknote, Users, Receipt, CheckCircle2, ChevronRight, ArrowLeft, Sparkles } from "lucide-react"
import { createAppointmentAction, updateAppointmentAction } from "@/lib/actions/appointments"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { BaseModal } from "./BaseModal"
import { addMonths, format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"

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
    initialMode?: string
    segmento?: string
}

export function AppointmentModal({ 
    isOpen, 
    onClose, 
    onSuccess, 
    date, 
    time, 
    tenantId, 
    services: initialServices,
    appointment,
    initialMode = "standard",
    segmento
}: AppointmentModalProps) {
    const [step, setStep] = useState(appointment ? 2 : 1)
    const [loading, setLoading] = useState(false)
    const [mode, setMode] = useState(initialMode)
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [installments, setInstallments] = useState(1)
    const [selectedServices, setSelectedServices] = useState<string[]>([])
    const [services, setServices] = useState<Service[]>(initialServices)
    const [successData, setSuccessData] = useState<any>(null)
    
    // Quick add service state
    const [isAddingNewService, setIsAddingNewService] = useState(false)
    const [newServiceName, setNewServiceName] = useState("")
    const [newServicePrice, setNewServicePrice] = useState("")

    useEffect(() => {
        if (isOpen) {
            setMode(initialMode)
            const isAdvocacia = segmento === 'advocacia'
            setStep(appointment ? 2 : (isAdvocacia ? 1 : (initialMode !== 'standard' ? 2 : 1)))
            if (appointment) {
                setName(appointment.name || "")
                setPhone(appointment.phone || "")
                
                // Parse multiple services if they exist
                let ids = [appointment.serviceId].filter(Boolean)
                if (appointment.serviceIds && Array.isArray(appointment.serviceIds) && appointment.serviceIds.length > 0) {
                    ids = appointment.serviceIds
                } else if (appointment.rawNotes?.startsWith('{"serviceIds"')) {
                    try {
                        const data = JSON.parse(appointment.rawNotes)
                        if (Array.isArray(data.serviceIds)) {
                            ids = data.serviceIds
                        }
                    } catch (e) {
                        console.error("Failed to parse services from rawNotes", e)
                    }
                } else if (appointment.notes?.startsWith('{"serviceIds"')) {
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
        if (!name || (mode !== 'financeiro' && validServices.length === 0)) {
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

            // Determine Label/Tag based on mode
            let typePrefix = ""
            if (mode === 'diligencia') typePrefix = "[Diligência] "
            if (mode === 'audiencia') typePrefix = "[Audiência] "
            if (mode === 'reuniao') typePrefix = "[Reunião] "
            if (mode === 'financeiro') typePrefix = "[Financeiro] "

            if (mode === 'financeiro' && !appointment) {
                // Recurrence Logic
                let lastApt = null;
                const startDate = parseISO(date);
                
                for (let i = 0; i < installments; i++) {
                    const currentDate = addMonths(startDate, i);
                    const formattedDate = format(currentDate, 'yyyy-MM-dd');
                    
                    const notesData = {
                        serviceIds: [],
                        mode: 'financeiro',
                        installment: i + 1,
                        totalInstallments: installments,
                        displayText: `Cobrança: Parcela ${i + 1} de ${installments}`
                    }

                    const result = await createAppointmentAction({
                        customerName: `${typePrefix}${name}`,
                        customerPhone: phone,
                        serviceId: undefined,
                        notes: JSON.stringify(notesData),
                        status: "confirmed",
                        tenantId,
                        date: formattedDate,
                        time,
                    });
                    
                    if (i === 0) lastApt = result.appointment;
                }
                
                setSuccessData({ type: 'financeiro', installments });
                setStep(3);
                onSuccess(lastApt);
                return;
            }

            // Standard Flow (including standard, diligencia, audiencia, reuniao)
            const notesData = {
                serviceIds: validServices,
                mode: mode,
                displayText: extraServicesText ? `Serviços adicionais: ${extraServicesText}` : (appointment?.notes?.startsWith('{"serviceIds"') ? "" : (appointment?.notes || ""))
            }

            const payload = {
                customerName: mode !== 'standard' ? `${typePrefix}${name}` : name,
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
                setSuccessData({ type: mode, appointment: result.appointment });
                setStep(3);
                onSuccess(result.appointment)
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
            title={step === 1 ? 'Selecione o Tipo' : step === 3 ? 'Sucesso!' : (appointment ? 'Editar Agendamento' : 
                   mode === 'financeiro' ? 'Lembrete Financeiro' :
                   mode === 'diligencia' ? 'Nova Diligência' :
                   mode === 'audiencia' ? 'Agendar Audiência' :
                   mode === 'reuniao' ? 'Reunião com Cliente' : 'Novo Agendamento')}
            description={step === 1 ? 'Qual o objetivo deste novo registro?' : step === 3 ? 'Ação realizada com êxito em sua agenda.' : (appointment 
                ? `Atualize os dados para o horário das ${appointment.time}.`
                : `Preencha os dados para o horário de ${time} no dia ${date.split('-').reverse().join('/')}.`
            )}
            icon={step === 1 ? Sparkles : step === 3 ? CheckCircle2 : (mode === 'financeiro' ? Banknote : mode === 'diligencia' ? Briefcase : mode === 'audiencia' ? Scale : mode === 'reuniao' ? Users : Calendar)}
            onBack={step === 2 && !appointment ? () => setStep(1) : undefined}
            maxWidth="sm:max-w-[500px]"
            footer={step !== 3 && (
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-white/5">
                    {step === 1 && (
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            className="rounded-2xl text-stone-500 hover:text-stone-300 font-bold text-[10px] uppercase tracking-widest flex-1 h-12"
                        >
                            Fechar
                        </Button>
                    )}
                    {step === 2 && (
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="rounded-2xl bg-brand-gold !text-white font-black px-8 shadow-[0_10px_40px_rgba(245,204,112,0.2)] transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] text-[11px] uppercase tracking-[0.2em] h-14 flex-1 cursor-pointer"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                            {appointment ? 'Salvar Alterações' : 'Confirmar Agendamento'}
                        </Button>
                    )}
                </div>
            )}
        >
            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                
                {/* ── STEP 1: CATEGORY SELECTION ── */}
                {step === 1 && (
                    <div className="space-y-4 py-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-1 gap-3">
                            <button 
                                onClick={() => { setMode('standard'); setStep(2); }}
                                className="flex items-center gap-4 p-4 rounded-2xl bg-stone-900/40 border border-white/5 hover:border-brand-primary/40 hover:bg-brand-primary/5 transition-all group text-left"
                            >
                                <div className="h-12 w-12 rounded-xl bg-brand-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Calendar className="h-6 w-6 text-brand-primary" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-white">Consulta Padrão</h4>
                                    <p className="text-[10px] text-stone-500 uppercase tracking-widest mt-0.5">Atendimento Jurídico Geral</p>
                                </div>
                                <ChevronRight className="h-4 w-4 text-stone-700 group-hover:text-brand-primary transition-colors" />
                            </button>

                            <button 
                                onClick={() => { setMode('diligencia'); setStep(2); }}
                                className="flex items-center gap-4 p-4 rounded-2xl bg-stone-900/40 border border-white/5 hover:border-amber-500/40 hover:bg-amber-500/5 transition-all group text-left"
                            >
                                <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Briefcase className="h-6 w-6 text-amber-500" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-white">Diligência</h4>
                                    <p className="text-[10px] text-stone-500 uppercase tracking-widest mt-0.5">Fórum, Cartório ou Visita Externa</p>
                                </div>
                                <ChevronRight className="h-4 w-4 text-stone-700 group-hover:text-amber-500 transition-colors" />
                            </button>

                            <button 
                                onClick={() => { setMode('audiencia'); setStep(2); }}
                                className="flex items-center gap-4 p-4 rounded-2xl bg-stone-900/40 border border-white/5 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all group text-left"
                            >
                                <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Scale className="h-6 w-6 text-blue-400" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-white">Audiência</h4>
                                    <p className="text-[10px] text-stone-500 uppercase tracking-widest mt-0.5">Compromisso Judicial ou Virtual</p>
                                </div>
                                <ChevronRight className="h-4 w-4 text-stone-700 group-hover:text-blue-400 transition-colors" />
                            </button>

                            <button 
                                onClick={() => { setMode('reuniao'); setStep(2); }}
                                className="flex items-center gap-4 p-4 rounded-2xl bg-stone-900/40 border border-white/5 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all group text-left"
                            >
                                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Users className="h-6 w-6 text-emerald-400" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-white">Reunião com Cliente</h4>
                                    <p className="text-[10px] text-stone-500 uppercase tracking-widest mt-0.5">Conferência ou Entrega de Docs</p>
                                </div>
                                <ChevronRight className="h-4 w-4 text-stone-700 group-hover:text-emerald-400 transition-colors" />
                            </button>

                            <button 
                                onClick={() => { setMode('financeiro'); setStep(2); }}
                                className="flex items-center gap-4 p-4 rounded-2xl bg-brand-gold/5 border border-brand-gold/10 hover:border-brand-gold/40 hover:bg-brand-gold/10 transition-all group text-left"
                            >
                                <div className="h-12 w-12 rounded-xl bg-brand-gold/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Banknote className="h-6 w-6 text-brand-gold" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-brand-gold">Cobrança Financeira</h4>
                                    <p className="text-[10px] text-brand-gold/60 uppercase tracking-widest mt-0.5">Gerar Lembretes de Parcelas</p>
                                </div>
                                <ChevronRight className="h-4 w-4 text-brand-gold/40 group-hover:text-brand-gold transition-colors" />
                            </button>
                        </div>
                    </div>
                )}

                {/* ── STEP 2: FORM ── */}
                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                        {/* Selected Type Badge */}
                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-stone-900/40 border border-white/5 mb-2">
                            <div className={cn(
                                "h-10 w-10 rounded-xl flex items-center justify-center",
                                mode === 'financeiro' ? "bg-brand-gold/10 text-brand-gold" :
                                mode === 'diligencia' ? "bg-amber-500/10 text-amber-500" :
                                mode === 'audiencia' ? "bg-blue-500/10 text-blue-400" :
                                mode === 'reuniao' ? "bg-emerald-500/10 text-emerald-400" :
                                "bg-brand-primary/10 text-brand-primary"
                            )}>
                                {mode === 'financeiro' ? <Banknote className="h-5 w-5" /> :
                                 mode === 'diligencia' ? <Briefcase className="h-5 w-5" /> :
                                 mode === 'audiencia' ? <Scale className="h-5 w-5" /> :
                                 mode === 'reuniao' ? <Users className="h-5 w-5" /> :
                                 <Calendar className="h-5 w-5" />}
                            </div>
                            <div>
                                <p className="text-[9px] uppercase tracking-widest font-black text-stone-500 leading-none mb-1">Categoria selecionada</p>
                                <h4 className="text-sm font-bold text-white leading-none">
                                    {mode === 'financeiro' ? 'Cobrança Financeira' :
                                     mode === 'diligencia' ? 'Diligência' :
                                     mode === 'audiencia' ? 'Audiência' :
                                     mode === 'reuniao' ? 'Reunião com Cliente' :
                                     'Consulta Padrão'}
                                </h4>
                            </div>
                        </div>
                <div className="space-y-3">
                    <Label className="text-[10px] uppercase tracking-widest font-black text-stone-500 ml-1 flex items-center gap-2">
                        <User className="h-3 w-3" /> {mode === 'financeiro' ? 'Dados do Devedor / Cliente' : 'Dados do Cliente'}
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="relative group col-span-2 sm:col-span-1">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500 group-focus-within:text-brand-primary transition-colors" />
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nome completo"
                                className="pl-11 rounded-2xl border-white/5 bg-stone-950/40 text-stone-200 focus:ring-brand-primary/20 focus:border-brand-primary/40 transition-all h-12 text-sm"
                            />
                        </div>
                        <div className="relative group col-span-2 sm:col-span-1">
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

                {mode === 'financeiro' && (
                    <div className="p-5 rounded-2xl bg-brand-gold/[0.03] border border-brand-gold/10 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-xl bg-brand-gold/10 flex items-center justify-center border border-brand-gold/20">
                                <Receipt className="h-4 w-4 text-brand-gold" />
                            </div>
                            <span className="text-[10px] uppercase tracking-widest font-black text-brand-gold">Configuração de Parcelas (Mensal)</span>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[9px] uppercase tracking-widest font-black text-stone-500 ml-1">Quantidade de Parcelas</Label>
                            <div className="flex items-center gap-3">
                                <Input 
                                    type="number" 
                                    min={1} 
                                    max={60} 
                                    value={installments} 
                                    onChange={e => setInstallments(parseInt(e.target.value) || 1)}
                                    className="h-12 rounded-2xl bg-stone-950/60 border-white/5 text-stone-200 text-center font-bold text-lg w-24"
                                />
                                <div className="flex-1 text-xs text-stone-500 font-medium">
                                    Serão criados {installments} agendamentos mensais automáticos começando em {format(parseISO(date), "dd/MM/yyyy")}.
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {mode !== 'financeiro' && (
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
                )}
            </div>
        )}

                {/* ── STEP 3: SUCCESS ── */}
                {step === 3 && (
                    <div className="py-12 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in-95 fade-in duration-500">
                        <div className="h-24 w-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center relative">
                            <CheckCircle2 className="h-12 w-12 text-emerald-500 animate-in zoom-in duration-700 delay-300" />
                            <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping duration-1000 opacity-20" />
                        </div>
                        
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
                                {successData?.type === 'financeiro' ? 'Parcelas Geradas!' : 'Agendado com Sucesso!'}
                            </h3>
                            <p className="text-stone-500 text-sm max-w-[280px] mx-auto">
                                {successData?.type === 'financeiro' 
                                    ? `Foram criados ${successData.installments} lembretes mensais para ${name}.`
                                    : `O compromisso de ${mode === 'standard' ? 'Consulta' : mode} para ${name} foi registrado.`}
                            </p>
                        </div>

                        <div className="pt-4 w-full">
                            <Button 
                                onClick={() => { onClose(); setTimeout(() => setStep(1), 300); }}
                                className="w-full h-12 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                            >
                                Concluir e Fechar
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </BaseModal>
    )
}
