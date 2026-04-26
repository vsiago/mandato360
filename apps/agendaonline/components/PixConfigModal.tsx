"use client"

import * as React from "react"
import { Smartphone, X, Loader2, Save, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { saveTenant } from "@/lib/tenant-api"
import { BaseModal } from "./BaseModal"

import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select"

interface PixConfigModalProps {
    isOpen: boolean
    onClose: () => void
    tenant: any
    onSuccess: (updatedTenant: any) => void
}

export function PixConfigModal({ isOpen, onClose, tenant, onSuccess }: PixConfigModalProps) {
    const [loading, setLoading] = React.useState(false)
    const [pixType, setPixType] = React.useState<string>(tenant?.pix?.type || 'random')
    const [pixKey, setPixKey] = React.useState<string>(tenant?.pix?.key || '')

    React.useEffect(() => {
        if (isOpen && tenant) {
            setPixType(tenant.pix?.type || 'random')
            setPixKey(tenant.pix?.key || '')
        }
    }, [isOpen, tenant])

    const handleSave = async () => {
        if (!pixKey) {
            toast.error("Por favor, informe a chave PIX.")
            return
        }

        setLoading(true)
        try {
            const updatedData = {
                ...tenant,
                pix: {
                    type: pixType,
                    key: pixKey
                }
            }
            await saveTenant(updatedData)
            toast.success("Dados do PIX atualizados!")
            onSuccess(updatedData)
            onClose()
        } catch (error) {
            console.error("Error saving PIX config:", error)
            toast.error("Erro ao salvar configurações.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Configurar PIX"
            description="Dados para recebimento de pagamentos instantâneos."
            icon={Smartphone}
            maxWidth="sm:max-w-[440px]"
            footer={
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="rounded-2xl text-stone-500 hover:text-stone-300 font-bold text-xs uppercase tracking-widest flex-1 h-12"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="rounded-2xl bg-brand-gold text-stone-950 font-bold px-8 shadow-xl shadow-brand-secondary/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] text-xs uppercase tracking-widest h-12 flex-1 cursor-pointer"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Salvar Configuração
                    </Button>
                </div>
            }
        >
            <div className="space-y-6">
                <div className="bg-brand-primary/[0.03] border border-brand-primary/10 rounded-2xl p-4 flex gap-3 shadow-inner">
                    <Info className="h-4 w-4 text-brand-primary shrink-0 mt-0.5" />
                    <p className="text-[11px] text-stone-400 leading-relaxed font-medium">
                        Esta chave será exibida para seus clientes ao concluir um atendimento com a opção PIX selecionada.
                    </p>
                </div>

                <div className="space-y-5">
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-widest font-black text-stone-500 ml-1">Tipo de Chave</Label>
                        <Select value={pixType} onValueChange={setPixType}>
                            <SelectTrigger className="h-12 rounded-2xl border-white/5 bg-stone-950/40 text-stone-200 focus:ring-brand-primary/20 focus:border-brand-primary/40 transition-all text-sm">
                                <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-white/10 bg-stone-900 shadow-2xl text-stone-200">
                                <SelectItem value="email" className="rounded-xl focus:bg-stone-800 text-sm">E-mail</SelectItem>
                                <SelectItem value="phone" className="rounded-xl focus:bg-stone-800 text-sm">Telefone</SelectItem>
                                <SelectItem value="cpf_cnpj" className="rounded-xl focus:bg-stone-800 text-sm">CPF ou CNPJ</SelectItem>
                                <SelectItem value="random" className="rounded-xl focus:bg-stone-800 text-sm">Chave Aleatória</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-widest font-black text-stone-500 ml-1">Chave PIX</Label>
                        <Input 
                            value={pixKey} 
                            onChange={e => setPixKey(e.target.value)} 
                            placeholder="Insira sua chave aqui..."
                            className="h-12 rounded-2xl border-white/5 bg-stone-950/40 text-stone-200 focus:ring-brand-primary/20 focus:border-brand-primary/40 transition-all text-sm" 
                        />
                    </div>
                </div>
            </div>
        </BaseModal>
    )
}
