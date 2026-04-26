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
    UserPlus
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

    if (!isOpen || !appointment) return null

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Resumo do Atendimento"
            description="Confira os detalhes e informações do agendamento concluído."
            icon={Info}
            maxWidth="sm:max-w-[480px]"
            footer={
                <Button
                    onClick={onClose}
                    className="w-full h-12 rounded-2xl bg-brand-gold text-stone-950 font-bold uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-brand-secondary/20 active:scale-[0.98] cursor-pointer"
                >
                    Fechar Resumo
                </Button>
            }
        >
            <div className="space-y-6">
                {/* Customer Info */}
                <div className="bg-stone-950/40 border border-white/5 rounded-2xl p-4 flex items-center justify-between shadow-inner">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-stone-900 border border-white/5 flex items-center justify-center text-xs font-bold text-stone-500">
                            {appointment.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-foreground">{appointment.name}</p>
                            <p className="text-[10px] text-stone-500 font-medium">{appointment.time} • {appointment.service}</p>
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

                {/* Summary Details */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-stone-950/40 border border-white/5 rounded-2xl p-4 shadow-inner">
                        <div className="flex items-center gap-2 text-stone-500 mb-2">
                            <Calendar className="h-3.5 w-3.5" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Data</span>
                        </div>
                        <p className="text-xs font-bold text-foreground">Concluído Hoje</p>
                    </div>
                    <div className="bg-stone-950/40 border border-white/5 rounded-2xl p-4 shadow-inner">
                        <div className="flex items-center gap-2 text-stone-500 mb-2">
                            <Clock className="h-3.5 w-3.5" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Horário</span>
                        </div>
                        <p className="text-xs font-bold text-foreground">{appointment.time}</p>
                    </div>
                </div>

                {/* Services List */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2 text-stone-500">
                            <Scissors className="h-3.5 w-3.5" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Serviços Executados</span>
                        </div>
                        <span className="text-[9px] font-black text-stone-500 uppercase tracking-widest">Valor</span>
                    </div>
                    <div className="bg-stone-950/40 border border-white/5 rounded-2xl p-4 divide-y divide-white/5 shadow-inner">
                        <div className="flex items-center justify-between py-1 pb-2">
                            <span className="text-xs font-bold text-stone-300">{appointment.service}</span>
                            <span className="text-xs font-bold text-foreground">{appointment.price}</span>
                        </div>
                        {appointment.notes?.includes("Serviços adicionais:") && (
                            <div className="pt-2 text-xs text-stone-500">
                                {appointment.notes.split("Serviços adicionais:")[1].split("\n")[0]}
                            </div>
                        )}
                    </div>
                </div>

                {/* Payment Info */}
                <div className="bg-stone-950/40 border border-white/5 rounded-2xl p-4 flex items-center justify-between shadow-inner">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-stone-900 border border-white/5 flex items-center justify-center">
                            <CreditCard className="h-4 w-4 text-brand-primary/60" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest">Forma de Pagamento</p>
                            <p className="text-xs font-bold text-foreground capitalize">
                                {appointment.notes?.match(/Pagamento: (\w+)/)?.[1] || "Dinheiro"}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest">Valor Total</p>
                        <p className="text-base font-black text-brand-primary">{appointment.price}</p>
                    </div>
                </div>
            </div>
        </BaseModal>
    )
}
