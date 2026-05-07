"use client"

import * as React from "react"
import { Calendar as CalendarIcon, Phone, Mail, User, UserPlus, CheckCircle2, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { createCustomerAction, updateAppointmentCustomerAction } from "@/lib/actions/customers"
import { BaseModal } from "./BaseModal"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface SaveClientModalProps {
    isOpen: boolean
    onClose: () => void
    tenantId: string
    initialData?: {
        name?: string
        phone?: string
        appointmentId?: string
    }
}

export function SaveClientModal({ isOpen, onClose, tenantId, initialData }: SaveClientModalProps) {
    const [loading, setLoading] = React.useState(false)
    const [success, setSuccess] = React.useState(false)
    const [formData, setFormData] = React.useState({
        name: "",
        email: "",
        phone: "",
        birthday: ""
    })

    const [date, setDate] = React.useState<Date | undefined>(undefined)

    React.useEffect(() => {
        if (isOpen && initialData) {
            setFormData({
                name: initialData.name || "",
                phone: initialData.phone || "",
                email: "",
                birthday: ""
            })
            setDate(undefined)
            setSuccess(false)
        }
    }, [isOpen, initialData])

    const handleSave = async () => {
        if (!formData.name) {
            toast.error("O nome é obrigatório.")
            return
        }

        setLoading(true)
        try {
            const res = await createCustomerAction(tenantId, {
                ...formData,
                birthday: date ? format(date, 'yyyy-MM-dd') : ""
            })
            
            if (res.success && res.customer) {
                if (initialData?.appointmentId) {
                    await updateAppointmentCustomerAction(initialData.appointmentId, res.customer.id)
                }
                
                setSuccess(true)
                toast.success("Cliente salvo com sucesso!")
            } else {
                toast.error(res.error || "Erro ao salvar cliente.")
            }
        } catch (error) {
            console.error("Error saving client:", error)
            toast.error("Erro interno ao processar.")
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <BaseModal
                isOpen={isOpen}
                onClose={onClose}
                title="Cliente Confirmado!"
                description={`${formData.name} agora faz parte da sua base de clientes oficial.`}
                icon={CheckCircle2}
                maxWidth="sm:max-w-[400px]"
            >
                <div className="flex flex-col items-center justify-center space-y-4 py-4">
                    <div className="h-20 w-20 rounded-full bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20 mb-2 shadow-2xl">
                        <CheckCircle2 className="h-10 w-10 text-brand-primary animate-in fade-in zoom-in duration-500 delay-150" />
                    </div>
                    <Button 
                        onClick={onClose}
                        className="w-full h-12 rounded-2xl bg-brand-gold text-stone-950 font-bold uppercase tracking-widest mt-4 shadow-xl shadow-brand-secondary/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                    >
                        Concluído
                    </Button>
                </div>
            </BaseModal>
        )
    }

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Salvar Cliente"
            description="Transforme este contato em um cliente oficial."
            icon={UserPlus}
            maxWidth="sm:max-w-[460px]"
            footer={
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="rounded-2xl text-stone-500 dark:text-stone-500 hover:text-stone-900 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/5 font-bold text-xs uppercase tracking-widest flex-1 h-12 transition-all"
                    >
                        Agora não
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="rounded-2xl bg-brand-gold text-white font-bold px-8 shadow-xl shadow-brand-secondary/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] text-xs uppercase tracking-widest h-12 flex-1 cursor-pointer"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Confirmar Cadastro
                    </Button>
                </div>
            }
        >
            <div className="space-y-5">
                <div className="grid gap-5">
                    <div className="space-y-2 group">
                        <Label className="text-[10px] uppercase tracking-widest font-black text-stone-500 ml-1 flex items-center gap-1.5">
                            <User className="h-3 w-3" /> Nome Completo
                        </Label>
                        <Input 
                            value={formData.name} 
                            onChange={e => setFormData({...formData, name: e.target.value})} 
                            placeholder="Ex: Maria Oliveira"
                            className="h-12 rounded-2xl border-stone-200 dark:border-white/5 bg-white dark:bg-stone-950/40 text-stone-900 dark:text-stone-200 focus:ring-brand-primary/20 focus:border-brand-primary/40 transition-all shadow-sm" 
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-widest font-black text-stone-500 ml-1 flex items-center gap-1.5">
                                <Phone className="h-3 w-3" /> Telefone
                            </Label>
                            <Input 
                                value={formData.phone} 
                                onChange={e => setFormData({...formData, phone: e.target.value})} 
                                placeholder="(00) 00000-0000"
                                className="h-12 rounded-2xl border-stone-200 dark:border-white/5 bg-white dark:bg-stone-950/40 text-stone-900 dark:text-stone-200 focus:ring-brand-primary/20 focus:border-brand-primary/40 transition-all shadow-sm" 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-widest font-black text-stone-500 ml-1 flex items-center gap-1.5">
                                <CalendarIcon className="h-3 w-3" /> Aniversário
                            </Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full h-12 justify-start text-left font-normal rounded-2xl border-stone-200 dark:border-white/5 bg-white dark:bg-stone-950/40 text-stone-900 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-900 hover:text-stone-900 dark:hover:text-stone-100 transition-all focus:ring-brand-primary/20 focus:border-brand-primary/40 shadow-sm",
                                            !date && "text-stone-500"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP", { locale: ptBR }) : <span>dd/mm/aaaa</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 rounded-2xl border-stone-200 dark:border-white/10 bg-white dark:bg-stone-900 shadow-2xl" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                        className="rounded-2xl"
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-widest font-black text-stone-500 ml-1 flex items-center gap-1.5">
                            <Mail className="h-3 w-3" /> E-mail (Opcional)
                        </Label>
                        <Input 
                            type="email"
                            value={formData.email} 
                            onChange={e => setFormData({...formData, email: e.target.value})} 
                            placeholder="cliente@email.com"
                            className="h-12 rounded-2xl border-stone-200 dark:border-white/5 bg-white dark:bg-stone-950/40 text-stone-900 dark:text-stone-200 focus:ring-brand-primary/20 focus:border-brand-primary/40 transition-all shadow-sm" 
                        />
                    </div>
                </div>
            </div>
        </BaseModal>
    )
}
