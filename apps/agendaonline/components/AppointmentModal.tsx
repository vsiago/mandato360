"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Phone, Scissors, Loader2, Plus, XCircle, Calendar, Clock as ClockIcon, Briefcase, Scale, Banknote, Users, Receipt, CheckCircle2, ChevronRight, ArrowLeft, Sparkles, Hash, MapPin, CreditCard, Bell, Video, Info } from "lucide-react"
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
import { Switch } from "@/components/ui/switch"

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
    
    // Legal specialized states
    const [processNumber, setProcessNumber] = useState("")
    const [nbNumber, setNbNumber] = useState("")
    const [naturezaCausa, setNaturezaCausa] = useState("")
    const [foro, setForo] = useState("")
    const [vara, setVara] = useState("")
    const [location, setLocation] = useState("")
    const [description, setDescription] = useState("")
    const [paymentMethod, setPaymentMethod] = useState("pendente")
    const [formaPagamento, setFormaPagamento] = useState<string | null>(null)
    const [pago, setPago] = useState(false)
    const [sendReminders, setSendReminders] = useState(true)
    const [meetingChannel, setMeetingChannel] = useState("presencial")
    const [linkOnline, setLinkOnline] = useState("")
    const [totalValue, setTotalValue] = useState("")
    const [origem, setOrigem] = useState("")
    const [assunto, setAssunto] = useState("")
    const [financeiroTipo, setFinanceiroTipo] = useState("honorario")
    const [diligenciaTipo, setDiligenciaTipo] = useState("externa")
    const [audienciaTipo, setAudienciaTipo] = useState("conciliacao")
    const [reuniaoTipo, setReuniaoTipo] = useState("cliente")
    const [internalDate, setInternalDate] = useState(date)
    const [internalTime, setInternalTime] = useState(time)

    useEffect(() => {
        setInternalDate(date)
        setInternalTime(time)
    }, [date, time])

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
        if (!name) {
            toast.error("Por favor, informe o nome.")
            return
        }

        if (!tenantId) {
            toast.error("Sessão expirada ou ID não encontrado. Recarregue a página.")
            return
        }

        if (!internalDate || !internalTime) {
            toast.error("Data ou horário não identificados.")
            return
        }

        setLoading(true)
        try {
            const legalData = {
                mode,
                titulo: mode === 'standard' ? `Consulta: ${name}` : 
                       mode === 'diligencia' ? `Diligência: ${location || 'Externa'}` :
                       mode === 'audiencia' ? `Audiência: ${processNumber || 'Judicial'}` :
                       mode === 'reuniao' ? `Reunião: ${description || 'Pautada'}` :
                       `Financeiro: ${financeiroTipo}`,
                
                // Fields for all
                processNumber: (mode === 'audiencia' || mode === 'diligencia' || mode === 'financeiro') ? processNumber : undefined,
                nbNumber: nbNumber || undefined,
                naturezaCausa: naturezaCausa || undefined,
                foro: (mode === 'audiencia' || mode === 'diligencia') ? foro : undefined,
                vara: (mode === 'audiencia' || mode === 'diligencia') ? vara : undefined,
                location: (mode === 'diligencia' || mode === 'audiencia' || mode === 'reuniao') ? location : undefined,
                description: description || undefined,
                
                // Specific fields
                consulta: mode === 'standard' ? { origem, assunto } : undefined,
                diligencia: mode === 'diligencia' ? { tipo: diligenciaTipo } : undefined,
                audiencia: mode === 'audiencia' ? { tipo: audienciaTipo, presencial: meetingChannel === 'presencial', linkOnline } : undefined,
                reuniao: mode === 'reuniao' ? { tipo: reuniaoTipo } : undefined,
                financeiroEvento: mode === 'financeiro' ? { tipo: financeiroTipo } : undefined,

                // Standardized Finance Block
                financeiro: (totalValue || installments > 1) ? {
                    tipo: mode === 'financeiro' && financeiroTipo === 'despesa' ? 'despesa' : 'receita',
                    valor: totalValue,
                    pago: pago,
                    formaPagamento: formaPagamento,
                    recorrente: installments > 1,
                    parcelas: installments,
                    descricao: description
                } : undefined,

                // Reminders
                lembrete: {
                    ativo: sendReminders,
                    antecedenciaMin: 60,
                    recorrente: installments > 1
                },

                serviceIds: selectedServices.filter(Boolean)
            }

            const notes = JSON.stringify(legalData)

            if (appointment) {
                const result = await updateAppointmentAction(appointment.id, tenantId, {
                    customerName: name,
                    customerPhone: phone,
                    serviceId: selectedServices[0] || undefined,
                    notes,
                })
                if (result.success) {
                    onSuccess(result.appointment)
                    onClose()
                    toast.success("Atualizado com sucesso!")
                } else {
                    toast.error(result.error || "Erro ao atualizar")
                }
            } else if (mode === 'financeiro') {
                for (let i = 0; i < installments; i++) {
                    const installmentDate = addMonths(parseISO(internalDate), i)
                    const formattedDate = format(installmentDate, 'yyyy-MM-dd')
                    
                    await createAppointmentAction({
                        tenantId,
                        customerName: name,
                        customerPhone: phone,
                        date: formattedDate,
                        time: internalTime,
                        status: 'pending',
                        notes: `[Financeiro] Parcela ${i + 1}/${installments} - ${notes}`
                    })
                }
                onSuccess({ type: 'financeiro' })
                setSuccessData({ type: 'financeiro', installments, name })
                setStep(3)
                toast.success("Parcelas geradas!")
            } else {
                const result = await createAppointmentAction({
                    tenantId,
                    customerName: name,
                    customerPhone: phone,
                    serviceId: selectedServices[0] || undefined,
                    date: internalDate,
                    time: internalTime,
                    status: 'confirmed',
                    notes,
                })

                if (result.success) {
                    onSuccess(result.appointment)
                    setSuccessData(result.appointment)
                    setStep(3)
                } else {
                    toast.error(result.error || "Erro ao agendar")
                }
            }
        } catch (error) {
            console.error(error)
            toast.error("Erro inesperado no agendamento")
        } finally {
            setLoading(false)
        }
    }

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={step === 1 ? 'Novo Registro' : step === 3 ? 'Concluído' : (mode === 'standard' ? 'Novo Cliente' : mode.toUpperCase())}
            description={step === 2 ? `Preencha os dados para o horário de ${time} no dia ${date.split('-').reverse().join('/')}.` : undefined}
            icon={Calendar}
            onBack={step === 2 && !appointment ? () => setStep(1) : undefined}
            maxWidth="sm:max-w-[900px]"
            footer={step !== 3 && (
                <div className="flex gap-3 pt-6 border-t border-white/5">
                    <Button onClick={handleSubmit} disabled={loading} className="flex-1 h-14 rounded-2xl bg-brand-gold !text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-brand-gold/20">
                        {loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Confirmar Registro'}
                    </Button>
                </div>
            )}
        >
            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar pb-2">
                {step === 1 && (
                    <div className="grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <button onClick={() => { setMode('standard'); setStep(2); }} className="p-5 rounded-2xl bg-stone-900/40 border border-white/5 hover:border-brand-primary/40 hover:bg-brand-primary/5 transition-all group flex items-center gap-4 text-left">
                            <div className="h-12 w-12 rounded-xl bg-brand-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Users className="h-6 w-6 text-brand-primary" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-white">Novo Cliente / Consulta</h4>
                                <p className="text-[10px] text-stone-500 uppercase tracking-widest mt-0.5">Ficha completa + Pagamento</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-stone-700" />
                        </button>
                        
                        <button onClick={() => { setMode('diligencia'); setStep(2); }} className="p-5 rounded-2xl bg-stone-900/40 border border-white/5 hover:border-amber-500/40 hover:bg-amber-500/5 transition-all group flex items-center gap-4 text-left">
                            <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Briefcase className="h-6 w-6 text-amber-500" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-white">Diligência</h4>
                                <p className="text-[10px] text-stone-500 uppercase tracking-widest mt-0.5">Fórum ou Compromisso Externo</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-stone-700" />
                        </button>

                        <button onClick={() => { setMode('audiencia'); setStep(2); }} className="p-5 rounded-2xl bg-stone-900/40 border border-white/5 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all group flex items-center gap-4 text-left">
                            <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Scale className="h-6 w-6 text-blue-400" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-white">Audiência</h4>
                                <p className="text-[10px] text-stone-500 uppercase tracking-widest mt-0.5">Conciliação, Instrução ou Julgamento</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-stone-700" />
                        </button>

                        <button onClick={() => { setMode('reuniao'); setStep(2); }} className="p-5 rounded-2xl bg-stone-900/40 border border-white/5 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all group flex items-center gap-4 text-left">
                            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Video className="h-6 w-6 text-emerald-400" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-white">Reunião</h4>
                                <p className="text-[10px] text-stone-500 uppercase tracking-widest mt-0.5">Pauta com Cliente ou Parceiros</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-stone-700" />
                        </button>

                        <button onClick={() => { setMode('financeiro'); setStep(2); }} className="p-5 rounded-2xl bg-brand-gold/5 border border-brand-gold/10 hover:border-brand-gold/40 hover:bg-brand-gold/10 transition-all group flex items-center gap-4 text-left">
                            <div className="h-12 w-12 rounded-xl bg-brand-gold/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Banknote className="h-6 w-6 text-brand-gold" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-brand-gold">Financeiro</h4>
                                <p className="text-[10px] text-brand-gold/60 uppercase tracking-widest mt-0.5">Gerar parcelas e cobranças</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-brand-gold/40" />
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                        {/* Mode Indicator - Top Banner */}
                        <div className="flex items-center gap-4 p-4 rounded-[24px] bg-stone-950/60 border border-white/5 shadow-2xl">
                            <div className={cn(
                                "h-12 w-12 rounded-xl flex items-center justify-center transition-transform hover:scale-105 duration-300",
                                mode === 'standard' ? "bg-brand-primary/10 text-brand-primary" :
                                mode === 'diligencia' ? "bg-amber-500/10 text-amber-500" :
                                mode === 'audiencia' ? "bg-blue-500/10 text-blue-400" :
                                mode === 'reuniao' ? "bg-emerald-500/10 text-emerald-400" :
                                "bg-brand-gold/10 text-brand-gold"
                            )}>
                                {mode === 'standard' ? <Users className="h-6 w-6" /> :
                                 mode === 'diligencia' ? <Briefcase className="h-6 w-6" /> :
                                 mode === 'audiencia' ? <Scale className="h-6 w-6" /> :
                                 mode === 'reuniao' ? <Video className="h-6 w-6" /> :
                                 <Banknote className="h-6 w-6" />}
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] uppercase tracking-[0.3em] font-black text-stone-500 mb-0.5 leading-none">Categoria Profissional</p>
                                <h4 className="text-lg font-black text-white leading-tight">
                                    {mode === 'standard' ? 'Novo Cliente / Consulta' :
                                     mode === 'diligencia' ? 'Diligência Externa' :
                                     mode === 'audiencia' ? 'Audiência Judicial' :
                                     mode === 'reuniao' ? 'Reunião Pautada' :
                                     'Lembrete Financeiro'}
                                </h4>
                            </div>
                        </div>

                        {/* Two Column Layout Container */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                            {/* LEFT COLUMN: Core Registration */}
                            <div className="space-y-6">
                                {/* Date and Time Section */}
                                <div className="p-5 rounded-[24px] bg-stone-900/40 border border-white/5 space-y-4 shadow-sm">
                                    <Label className="text-[10px] uppercase tracking-widest font-black text-brand-primary flex items-center gap-2">
                                        <Calendar className="h-3.5 w-3.5" /> Agenda do Compromisso
                                    </Label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="relative group">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-600 group-focus-within:text-brand-primary transition-colors" />
                                            <Input type="date" value={internalDate} onChange={e => setInternalDate(e.target.value)} className="pl-11 h-12 bg-stone-950/40 border-white/5 rounded-xl text-sm font-bold text-white focus:border-brand-primary/50 transition-all" />
                                        </div>
                                        <div className="relative group">
                                            <ClockIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-600 group-focus-within:text-brand-primary transition-colors" />
                                            <Input type="time" value={internalTime} onChange={e => setInternalTime(e.target.value)} className="pl-11 h-12 bg-stone-950/40 border-white/5 rounded-xl text-sm font-bold text-white focus:border-brand-primary/50 transition-all" />
                                        </div>
                                    </div>
                                </div>

                                {/* Identification Section */}
                                <div className="p-5 rounded-[24px] bg-stone-900/40 border border-white/5 space-y-4 shadow-sm">
                                    <Label className="text-[10px] uppercase tracking-widest font-black text-stone-500 flex items-center gap-2">
                                        <User className="h-3.5 w-3.5" /> Dados do Cliente
                                    </Label>
                                    <div className="space-y-3">
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-600 group-focus-within:text-brand-primary transition-colors" />
                                            <Input value={name} onChange={e => setName(e.target.value)} className="pl-11 h-12 bg-stone-950/40 border-white/5 rounded-xl text-sm font-bold placeholder:text-stone-700" placeholder="Nome Completo" />
                                        </div>
                                        <div className="relative group">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-600 group-focus-within:text-brand-primary transition-colors" />
                                            <Input value={phone} onChange={e => setPhone(e.target.value)} className="pl-11 h-12 bg-stone-950/40 border-white/5 rounded-xl text-sm font-bold placeholder:text-stone-700" placeholder="WhatsApp (DDD + Número)" />
                                        </div>
                                    </div>
                                </div>

                                {/* Mode Specific: Finance Section for ALL if has value or mode is financeiro */}
                                {(mode === 'standard' || mode === 'financeiro') && (
                                    <div className={cn("p-5 rounded-[24px] border space-y-4 shadow-sm", mode === 'financeiro' ? "bg-brand-gold/5 border-brand-gold/20" : "bg-stone-900/40 border-white/5")}>
                                        <Label className="text-[10px] uppercase tracking-widest font-black text-emerald-500 flex items-center gap-2">
                                            <Banknote className="h-3.5 w-3.5" /> Informações Financeiras
                                        </Label>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] text-stone-500 font-bold ml-1 uppercase">Valor Total</Label>
                                                <div className="relative group">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-stone-600">R$</span>
                                                    <Input value={totalValue} onChange={e => setTotalValue(e.target.value)} className="pl-11 h-12 bg-stone-950/40 border-white/5 rounded-xl text-sm font-bold" placeholder="0,00" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] text-stone-500 font-bold ml-1 uppercase">Parcelas</Label>
                                                <Input type="number" value={installments} onChange={e => setInstallments(parseInt(e.target.value))} className="h-12 bg-stone-950/40 border-white/5 rounded-xl text-sm font-bold" min={1} />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 pt-2">
                                            <div className="flex items-center justify-between p-3 rounded-xl bg-stone-950/40 border border-white/5">
                                                <span className="text-[9px] font-black text-stone-500 uppercase tracking-widest">Pago?</span>
                                                <Switch checked={pago} onCheckedChange={setPago} />
                                            </div>
                                            <Select value={formaPagamento || ""} onValueChange={setFormaPagamento}>
                                                <SelectTrigger className="h-12 bg-stone-950/40 border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                                    <SelectValue placeholder="Pagamento" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-stone-900 border-white/10 text-white">
                                                    <SelectItem value="pix">PIX</SelectItem>
                                                    <SelectItem value="cartao">Cartão</SelectItem>
                                                    <SelectItem value="dinheiro">Dinheiro</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* RIGHT COLUMN: Specialized Data */}
                            <div className="space-y-6">
                                {/* Specialized Fields based on Mode */}
                                {(mode === 'audiencia' || mode === 'diligencia' || mode === 'standard') && (
                                    <div className="p-5 rounded-[24px] bg-stone-900/40 border border-white/5 space-y-4 shadow-sm">
                                        <Label className="text-[10px] uppercase tracking-widest font-black text-blue-400 flex items-center gap-2">
                                            <Scale className="h-3.5 w-3.5" /> Contexto Jurídico
                                        </Label>
                                        
                                        <div className="space-y-4">
                                            {(mode === 'audiencia' || mode === 'diligencia') && (
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] text-stone-500 font-bold ml-1">Tipo de Evento</Label>
                                                    <Select value={mode === 'audiencia' ? audienciaTipo : diligenciaTipo} onValueChange={val => mode === 'audiencia' ? setAudienciaTipo(val) : setDiligenciaTipo(val)}>
                                                        <SelectTrigger className="h-12 bg-stone-950/40 border-white/5 rounded-xl text-sm font-bold">
                                                            <SelectValue placeholder="Selecione o tipo" />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-stone-900 border-white/10 text-white">
                                                            {mode === 'audiencia' ? (
                                                                <>
                                                                    <SelectItem value="conciliacao">Conciliação</SelectItem>
                                                                    <SelectItem value="instrucao">Instrução e Julgamento</SelectItem>
                                                                    <SelectItem value="julgamento">Julgamento / Sentença</SelectItem>
                                                                    <SelectItem value="outra">Outra</SelectItem>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <SelectItem value="externa">Diligência Externa</SelectItem>
                                                                    <SelectItem value="forum">Fórum / Tribunal</SelectItem>
                                                                    <SelectItem value="cartorio">Cartório</SelectItem>
                                                                </>
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="relative group">
                                                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-600" />
                                                    <Input value={processNumber} onChange={e => setProcessNumber(e.target.value)} className="pl-11 h-12 bg-stone-950/40 border-white/5 rounded-xl text-sm font-bold placeholder:text-stone-700" placeholder="Processo" />
                                                </div>
                                                <div className="relative group">
                                                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500/60" />
                                                    <Input value={nbNumber} onChange={e => setNbNumber(e.target.value)} className="pl-11 h-12 bg-stone-950/40 border-white/5 rounded-xl text-sm font-bold placeholder:text-stone-700" placeholder="NB / ID" />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="relative group">
                                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-600" />
                                                    <Input value={foro} onChange={e => setForo(e.target.value)} className="pl-11 h-12 bg-stone-950/40 border-white/5 rounded-xl text-sm font-bold placeholder:text-stone-700" placeholder="Fórum" />
                                                </div>
                                                <div className="relative group">
                                                    <Scale className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-600" />
                                                    <Input value={vara} onChange={e => setVara(e.target.value)} className="pl-11 h-12 bg-stone-950/40 border-white/5 rounded-xl text-sm font-bold placeholder:text-stone-700" placeholder="Vara" />
                                                </div>
                                            </div>

                                            {mode === 'audiencia' && (
                                                <div className="space-y-3">
                                                    <div className="flex gap-2">
                                                        {['presencial', 'virtual'].map(c => (
                                                            <button key={c} type="button" onClick={() => setMeetingChannel(c)} className={cn("flex-1 h-10 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all", meetingChannel === c ? "bg-blue-500/10 border-blue-500 text-blue-400" : "bg-stone-950/40 border-white/5 text-stone-500")}>
                                                                {c}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    {meetingChannel === 'virtual' && (
                                                        <div className="relative group animate-in slide-in-from-top-2">
                                                            <Video className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400" />
                                                            <Input value={linkOnline} onChange={e => setLinkOnline(e.target.value)} className="pl-11 h-12 bg-blue-500/5 border-blue-500/20 rounded-xl text-[10px] font-black text-blue-100" placeholder="Link da Videochamada" />
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <div className="relative group">
                                                <Info className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-600" />
                                                <Input value={naturezaCausa} onChange={e => setNaturezaCausa(e.target.value)} className="pl-11 h-12 bg-stone-950/40 border-white/5 rounded-xl text-sm font-bold placeholder:text-stone-700" placeholder="Natureza da Causa (ex: LOAS, Auxílio...)" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Notes and Extra Details */}
                                <div className="p-5 rounded-[24px] bg-stone-900/40 border border-white/5 space-y-4 shadow-sm">
                                    <Label className="text-[10px] uppercase tracking-widest font-black text-stone-500 flex items-center gap-2">
                                        <Info className="h-3.5 w-3.5" /> Observações Gerais
                                    </Label>
                                    <textarea 
                                        value={description} 
                                        onChange={e => setDescription(e.target.value)}
                                        className="w-full h-32 bg-stone-950/40 border border-white/5 rounded-xl p-4 text-sm font-bold text-white placeholder:text-stone-700 focus:border-brand-primary/50 transition-all outline-none resize-none"
                                        placeholder="Descreva detalhes importantes deste processo ou compromisso..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="py-12 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in-95 fade-in duration-500">
                        <div className="h-24 w-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center relative">
                            <CheckCircle2 className="h-12 w-12 text-emerald-500 animate-in zoom-in duration-700 delay-300" />
                            <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping duration-1000 opacity-20" />
                        </div>
                        
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
                                {successData?.type === 'financeiro' ? 'Lembretes Gerados!' : 'Registro Concluído!'}
                            </h3>
                            <p className="text-stone-500 text-sm max-w-[280px] mx-auto">
                                O compromisso foi salvo com sucesso em sua agenda profissional.
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
