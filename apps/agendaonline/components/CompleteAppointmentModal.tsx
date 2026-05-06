"use client"

import * as React from "react"
import { 
    CheckCircle2, 
    X, 
    CreditCard, 
    Smartphone, 
    Banknote, 
    Info, 
    Loader2,
    Calendar,
    Clock,
    User,
    Scissors,
    UserPlus,
    Scale,
    Briefcase,
    Video,
    MapPin,
    Hash,
    Phone,
    Globe
} from "lucide-react"
import { SaveClientModal } from "./SaveClientModal"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { BaseModal } from "./BaseModal"

interface CompleteAppointmentModalProps {
    isOpen: boolean
    onClose: () => void
    appointment: any
    onConfirm: (paymentMethod: string) => Promise<void>
    pix?: {
        type: string
        key: string
    }
    tenantId: string
}

export function CompleteAppointmentModal({ 
    isOpen, 
    onClose, 
    appointment, 
    onConfirm,
    pix,
    tenantId
}: CompleteAppointmentModalProps) {
    const [paymentMethod, setPaymentMethod] = React.useState<"credit" | "debit" | "pix" | "cash" | null>(null)
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [isSaveClientModalOpen, setIsSaveClientModalOpen] = React.useState(false)

    if (!isOpen || !appointment) return null

    const pixLabel = pix?.type === 'email' ? 'E-mail' : 
                    pix?.type === 'phone' ? 'Telefone' : 
                    pix?.type === 'cpf_cnpj' ? 'CPF/CNPJ' : 'Chave';

    const handleConfirm = async () => {
        if (!paymentMethod) {
            toast.error("Por favor, selecione a forma de pagamento.")
            return
        }

        setIsSubmitting(true)
        try {
            await onConfirm(paymentMethod)
            onClose()
        } catch (error) {
            console.error("Error completing appointment:", error)
            toast.error("Erro ao concluir agendamento.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Concluir Atendimento"
            description="Selecione a forma de pagamento para finalizar este agendamento."
            icon={CheckCircle2}
            maxWidth="sm:max-w-[480px]"
            footer={
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                        variant="ghost" 
                        onClick={onClose}
                        className="h-12 px-6 rounded-2xl text-stone-500 hover:text-stone-300 transition-all text-xs font-bold uppercase tracking-widest"
                    >
                        Cancelar
                    </Button>
                    <Button
                        disabled={!paymentMethod || isSubmitting}
                        onClick={handleConfirm}
                        className="flex-1 h-12 rounded-2xl bg-brand-gold text-stone-950 font-bold uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-brand-secondary/20 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                <CheckCircle2 className="h-4 w-4" />
                                Confirmar Recebimento
                            </>
                        )}
                    </Button>
                </div>
            }
        >
            <div className="space-y-6">
                {/* Summary Card */}
                <div className="bg-stone-950/40 border border-white/5 rounded-2xl p-4 space-y-4 shadow-inner">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-stone-900 flex items-center justify-center border border-white/5 text-[10px] font-black text-stone-500">
                                {appointment.name.split(" ").map((n: any) => n[0]).join("").toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <h4 className="text-sm font-bold text-foreground truncate">{appointment.name}</h4>
                                <p className="text-[10px] text-stone-500 font-medium uppercase tracking-wider">{appointment.time} • {appointment.service}</p>
                            </div>
                        </div>
                        
                        {!appointment.customerId && (
                            <button 
                                onClick={() => setIsSaveClientModalOpen(true)}
                                className="h-8 px-3 rounded-lg border border-brand-primary/20 bg-brand-primary/5 text-[9px] font-black text-brand-primary uppercase tracking-widest hover:bg-brand-primary/10 transition-all flex items-center gap-1.5"
                            >
                                <UserPlus className="h-3 w-3" />
                                Adicionar Cliente
                            </button>
                        )}
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Total a Pagar</span>
                        <span className="text-xl font-black text-brand-primary">{appointment.price}</span>
                    </div>
                </div>

                {/* Payment Selection */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest px-1">Forma de Pagamento</label>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { id: "pix", label: "PIX", icon: Smartphone },
                            { id: "debit", label: "Cartão Débito", icon: CreditCard },
                            { id: "credit", label: "Cartão Crédito", icon: CreditCard },
                            { id: "cash", label: "Dinheiro", icon: Banknote },
                        ].map((method) => (
                            <button
                                key={method.id}
                                onClick={() => setPaymentMethod(method.id as any)}
                                className={cn(
                                    "flex items-center gap-3 p-3 rounded-2xl border transition-all text-left",
                                    paymentMethod === method.id
                                        ? "bg-brand-primary/10 border-brand-primary/40 text-brand-primary shadow-lg shadow-brand-primary/5"
                                        : "bg-stone-950/40 border-white/5 text-stone-500 hover:border-white/10 hover:bg-stone-800"
                                )}
                            >
                                <method.icon className={cn("h-4 w-4", paymentMethod === method.id ? "text-brand-primary" : "text-stone-500")} />
                                <span className="text-[11px] font-bold uppercase tracking-wider">{method.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* PIX Info (Condicional) */}
                {paymentMethod === "pix" && (
                    <div className="bg-brand-primary/[0.03] border border-brand-primary/20 rounded-2xl p-4 flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
                        <Info className="h-4 w-4 text-brand-primary shrink-0 mt-0.5" />
                        <div>
                            <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-1">Chave PIX do Estabelecimento ({pixLabel})</p>
                            <p className="text-xs font-bold text-foreground break-all">{pix?.key || "Chave não configurada"}</p>
                        </div>
                    </div>
                )}
            </div>

            <SaveClientModal 
                isOpen={isSaveClientModalOpen} 
                onClose={() => setIsSaveClientModalOpen(false)} 
                initialData={{ name: appointment.name, phone: appointment.phone }}
                tenantId={tenantId}
            />
        </BaseModal>
    )
}

interface DetailsModalProps {
    isOpen: boolean
    onClose: () => void
    appointment: any
}

export function AppointmentDetailsModal({ isOpen, onClose, appointment }: DetailsModalProps) {
    const [isSaveClientModalOpen, setIsSaveClientModalOpen] = React.useState(false)

    const details = React.useMemo(() => {
        if (!appointment?.notes) return null
        try {
            return JSON.parse(appointment.notes)
        } catch (e) {
            return null
        }
    }, [appointment])

    if (!isOpen || !appointment) return null

    const isLegal = !!details?.mode
    const mode = details?.mode || 'standard'
    
    const getBadgeColor = () => {
        switch(mode) {
            case 'audiencia': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
            case 'diligencia': return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
            case 'reuniao': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            case 'financeiro': return 'bg-brand-gold/10 text-brand-gold border-brand-gold/20'
            default: return 'bg-brand-primary/10 text-brand-primary border-brand-primary/20'
        }
    }

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={details?.titulo || "Resumo do Atendimento"}
            description={isLegal ? `Compromisso do tipo ${mode.toUpperCase()}` : "Confira os detalhes e informações do agendamento."}
            icon={mode === 'audiencia' ? Scale : mode === 'diligencia' ? Briefcase : mode === 'reuniao' ? Video : Info}
            maxWidth="sm:max-w-[500px]"
            footer={
                <Button
                    onClick={onClose}
                    className="w-full h-12 rounded-2xl bg-brand-gold text-stone-950 font-bold uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-brand-secondary/20 active:scale-[0.98] cursor-pointer"
                >
                    Fechar Resumo
                </Button>
            }
        >
            <div className="space-y-5">
                {/* Header Badge */}
                <div className="flex justify-center">
                    <div className={cn("px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-[0.2em]", getBadgeColor())}>
                        {mode === 'standard' ? 'Consulta / Atendimento' : mode.toUpperCase()}
                    </div>
                </div>

                {/* Client & Status */}
                <div className="bg-stone-900/40 border border-white/5 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-stone-950 border border-white/5 flex items-center justify-center text-sm font-bold text-stone-400">
                                {appointment.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white">{appointment.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">{appointment.status === 'confirmed' ? 'Confirmado' : appointment.status}</span>
                                </div>
                            </div>
                        </div>
                        {appointment.phone && (
                            <a 
                                href={`https://wa.me/55${appointment.phone.replace(/\D/g, '')}`} 
                                target="_blank"
                                className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 hover:bg-emerald-500/20 transition-all"
                            >
                                <Phone className="h-5 w-5" />
                            </a>
                        )}
                    </div>
                    
                    {!appointment.customerId && (
                        <Button 
                            onClick={() => setIsSaveClientModalOpen(true)}
                            variant="outline"
                            className="w-full h-10 rounded-xl border-brand-primary/20 bg-brand-primary/5 text-[10px] font-black text-brand-primary uppercase tracking-widest hover:bg-brand-primary/10 transition-all flex items-center gap-2"
                        >
                            <UserPlus className="h-4 w-4" />
                            Salvar como Cliente Oficial
                        </Button>
                    )}
                </div>

                {/* Main Data (Contextual) */}
                <div className="bg-stone-900/40 border border-white/5 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center gap-2 text-stone-500 mb-2">
                        <Info className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Informações do Processo</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {details?.processNumber && (
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest flex items-center gap-1.5">
                                    <Hash className="h-3 w-3" /> Número do Processo
                                </p>
                                <p className="text-sm font-bold text-white tracking-wider">{details.processNumber}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            {details?.foro && (
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest">Fórum</p>
                                    <p className="text-xs font-bold text-stone-200">{details.foro}</p>
                                </div>
                            )}
                            {details?.vara && (
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest">Vara</p>
                                    <p className="text-xs font-bold text-stone-200">{details.vara}</p>
                                </div>
                            )}
                        </div>

                        {details?.location && (
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest flex items-center gap-1.5">
                                    <MapPin className="h-3 w-3" /> {mode === 'reuniao' ? 'Local da Reunião' : 'Localização'}
                                </p>
                                <p className="text-xs font-bold text-stone-200">{details.location}</p>
                            </div>
                        )}

                        {details?.audiencia?.linkOnline && (
                            <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20 space-y-2">
                                <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <Globe className="h-3 w-3" /> Link da Audiência Virtual
                                </p>
                                <a href={details.audiencia.linkOnline} target="_blank" className="text-xs font-bold text-blue-300 underline break-all">
                                    {details.audiencia.linkOnline}
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Financial Block (blueprint item 3) */}
                {details?.financeiro && (
                    <div className="bg-stone-900/40 border border-white/5 rounded-2xl p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-stone-500">
                                <Banknote className="h-4 w-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Financeiro</span>
                            </div>
                            <div className={cn("px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest", details.financeiro.pago ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500")}>
                                {details.financeiro.pago ? 'Pago' : 'Pendente'}
                            </div>
                        </div>

                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest mb-1">Valor Total</p>
                                <p className="text-xl font-black text-white">R$ {details.financeiro.valor || '0,00'}</p>
                            </div>
                            {details.financeiro.formaPagamento && (
                                <div className="text-right">
                                    <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest mb-1">Forma</p>
                                    <p className="text-xs font-bold text-stone-300 uppercase">{details.financeiro.formaPagamento}</p>
                                </div>
                            )}
                        </div>

                        {details.financeiro.parcelas > 1 && (
                            <div className="pt-3 border-t border-white/5">
                                <p className="text-[9px] font-bold text-stone-500 uppercase tracking-widest">Recorrência: {details.financeiro.parcelas} parcelas mensais</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Standard Summary Details */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-stone-900/40 border border-white/5 rounded-2xl p-4">
                        <div className="flex items-center gap-2 text-stone-500 mb-2">
                            <Calendar className="h-3.5 w-3.5" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Data</span>
                        </div>
                        <p className="text-xs font-bold text-white">{appointment.date.split('-').reverse().join('/')}</p>
                    </div>
                    <div className="bg-stone-900/40 border border-white/5 rounded-2xl p-4">
                        <div className="flex items-center gap-2 text-stone-500 mb-2">
                            <Clock className="h-3.5 w-3.5" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Horário</span>
                        </div>
                        <p className="text-xs font-bold text-white">{appointment.time}</p>
                    </div>
                </div>

                {/* Reminders */}
                {details?.lembrete?.ativo && (
                    <div className="px-1 flex items-center gap-2 text-emerald-500/60">
                        <Bell className="h-3 w-3" />
                        <span className="text-[9px] font-bold uppercase tracking-[0.15em]">Lembretes automáticos ativos</span>
                    </div>
                )}
            </div>

            <SaveClientModal 
                isOpen={isSaveClientModalOpen} 
                onClose={() => setIsSaveClientModalOpen(false)} 
                initialData={{ name: appointment.name, phone: appointment.phone }}
                tenantId={appointment.tenantId}
            />
        </BaseModal>
    )
}
