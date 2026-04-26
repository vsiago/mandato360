"use client"

import * as React from "react"
import { UserPlus, X, Loader2, Save, CheckCircle2, Calendar, Phone, Mail, User } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { createCustomerAction, updateAppointmentCustomerAction } from "@/lib/actions/customers"

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

    React.useEffect(() => {
        if (isOpen && initialData) {
            setFormData({
                name: initialData.name || "",
                phone: initialData.phone || "",
                email: "",
                birthday: ""
            })
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
            const res = await createCustomerAction(tenantId, formData)
            
            if (res.success && res.customer) {
                // If we have an appointmentId, link it
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
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[400px] bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800/60 rounded-[32px] p-8 text-center animate-in zoom-in duration-300">
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mb-2">
                            <CheckCircle2 className="h-10 w-10 text-emerald-500 animate-in fade-in zoom-in duration-500 delay-150" />
                        </div>
                        <h3 className="text-2xl font-bold tracking-tight text-foreground" style={{ fontFamily: 'var(--font-playfair)' }}>
                            Cliente Confirmado!
                        </h3>
                        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed max-w-[280px]">
                            {formData.name} agora faz parte da sua base de clientes oficial.
                        </p>
                        <Button 
                            onClick={onClose}
                            className="w-full h-12 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-bold uppercase tracking-widest mt-4"
                        >
                            OK
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[440px] bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800/60 rounded-[32px] p-0 overflow-hidden shadow-2xl backdrop-blur-xl">
                <DialogHeader className="p-8 pb-4">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                            <UserPlus className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-bold tracking-tight text-foreground" style={{ fontFamily: 'var(--font-playfair)' }}>
                                Salvar Cliente
                            </DialogTitle>
                            <DialogDescription className="text-stone-500 dark:text-stone-400 text-sm mt-1">
                                Transforme este contato em um cliente oficial.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="p-8 pt-2 space-y-5">
                    <div className="grid gap-5">
                        <div className="space-y-2 group">
                            <Label className="text-[10px] uppercase tracking-widest font-black text-stone-500 ml-1 flex items-center gap-1.5">
                                <User className="h-3 w-3" /> Nome Completo
                            </Label>
                            <Input 
                                value={formData.name} 
                                onChange={e => setFormData({...formData, name: e.target.value})} 
                                placeholder="Ex: Maria Oliveira"
                                className="h-12 rounded-2xl border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 focus:ring-brand-primary/20 focus:border-brand-primary/40 transition-all" 
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
                                    className="h-12 rounded-2xl border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 focus:ring-brand-primary/20 focus:border-brand-primary/40 transition-all" 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase tracking-widest font-black text-stone-500 ml-1 flex items-center gap-1.5">
                                    <Calendar className="h-3 w-3" /> Aniversário
                                </Label>
                                <Input 
                                    type="date"
                                    value={formData.birthday} 
                                    onChange={e => setFormData({...formData, birthday: e.target.value})} 
                                    className="h-12 rounded-2xl border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 focus:ring-brand-primary/20 focus:border-brand-primary/40 transition-all" 
                                />
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
                                className="h-12 rounded-2xl border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 focus:ring-brand-primary/20 focus:border-brand-primary/40 transition-all" 
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-8 pt-0 flex flex-col sm:flex-row gap-3">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="rounded-xl text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 font-bold text-xs uppercase tracking-widest flex-1 h-12"
                    >
                        Agora não
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="rounded-xl bg-brand-gold text-stone-950 font-bold px-8 shadow-lg shadow-brand-secondary/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] text-xs uppercase tracking-widest h-12 flex-1"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Confirmar Cadastro
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
