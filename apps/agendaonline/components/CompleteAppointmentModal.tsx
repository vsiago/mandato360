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
    Scissors
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface CompleteAppointmentModalProps {
    isOpen: boolean
    onClose: () => void
    appointment: any
    onConfirm: (paymentMethod: string) => Promise<void>
    establishmentPix?: string
}

export function CompleteAppointmentModal({ 
    isOpen, 
    onClose, 
    appointment, 
    onConfirm,
    establishmentPix = "000.000.000-00" // Placeholder
}: CompleteAppointmentModalProps) {
    const [paymentMethod, setPaymentMethod] = React.useState<"credit" | "debit" | "pix" | "cash" | null>(null)
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    if (!isOpen || !appointment) return null

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm" onClick={onClose} />
            
            <div className="relative w-full max-w-md bg-stone-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-stone-900/50">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        </div>
                        <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Concluir Atendimento</h3>
                    </div>
                    <button onClick={onClose} className="text-stone-500 hover:text-white transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Summary Card */}
                    <div className="bg-stone-950/50 border border-white/5 rounded-2xl p-4 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-stone-900 flex items-center justify-center border border-white/5 text-[10px] font-black text-stone-500">
                                {appointment.name.split(" ").map((n: any) => n[0]).join("").toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <h4 className="text-sm font-bold text-foreground truncate">{appointment.name}</h4>
                                <p className="text-[10px] text-stone-500 font-medium uppercase tracking-wider">{appointment.time} • {appointment.service}</p>
                            </div>
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
                                            ? "bg-brand-primary/10 border-brand-primary text-brand-primary shadow-lg shadow-brand-primary/5"
                                            : "bg-stone-900 border-white/5 text-stone-400 hover:border-white/10 hover:bg-stone-800"
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
                        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
                            <Info className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Chave PIX do Estabelecimento</p>
                                <p className="text-xs font-bold text-foreground break-all">{establishmentPix}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 pt-0">
                    <Button
                        disabled={!paymentMethod || isSubmitting}
                        onClick={handleConfirm}
                        className="w-full h-12 rounded-2xl bg-emerald-500 text-stone-950 font-black uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/10 active:scale-[0.98]"
                    >
                        {isSubmitting ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            "Confirmar Recebimento"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}

interface DetailsModalProps {
    isOpen: boolean
    onClose: () => void
    appointment: any
}

export function AppointmentDetailsModal({ isOpen, onClose, appointment }: DetailsModalProps) {
    if (!isOpen || !appointment) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm" onClick={onClose} />
            
            <div className="relative w-full max-w-md bg-stone-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-emerald-500/5">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        </div>
                        <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Resumo do Atendimento</h3>
                    </div>
                    <button onClick={onClose} className="text-stone-500 hover:text-white transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Customer Info */}
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-stone-950 flex items-center justify-center border border-white/5 text-xs font-black text-stone-600 shadow-inner">
                            {appointment.name.split(" ").map((n: any) => n[0]).join("").toUpperCase()}
                        </div>
                        <div>
                            <h4 className="text-base font-bold text-foreground">{appointment.name}</h4>
                            <p className="text-xs text-stone-500 font-medium">{appointment.phone}</p>
                        </div>
                    </div>

                    {/* Summary Details */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-stone-950/40 border border-white/5 rounded-2xl p-4">
                            <div className="flex items-center gap-2 text-stone-500 mb-2">
                                <Calendar className="h-3.5 w-3.5" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Data</span>
                            </div>
                            <p className="text-xs font-bold text-foreground">Concluído Hoje</p>
                        </div>
                        <div className="bg-stone-950/40 border border-white/5 rounded-2xl p-4">
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
                        <div className="bg-stone-950/40 border border-white/5 rounded-2xl p-4 divide-y divide-white/5">
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
                    <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-xl bg-stone-950 border border-white/5 flex items-center justify-center shadow-inner">
                                <CreditCard className="h-4 w-4 text-emerald-500/60" />
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

                {/* Footer */}
                <div className="p-6">
                    <Button
                        onClick={onClose}
                        variant="outline"
                        className="w-full h-11 rounded-2xl border-white/5 bg-stone-950 text-stone-400 font-bold uppercase tracking-widest hover:text-white transition-all"
                    >
                        Fechar Resumo
                    </Button>
                </div>
            </div>
        </div>
    )
}
