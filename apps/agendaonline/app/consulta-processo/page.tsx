"use client"

import { useState } from "react"
import { Search, Hash, Phone, Loader2, CheckCircle2, Clock, Scale, Info, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { getPublicProcessStatusAction } from "@/lib/actions/appointments"
import { LEGAL_STATUSES } from "@/lib/utils/process-utils"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function ConsultaProcessoPage() {
    const [processNumber, setProcessNumber] = useState("")
    const [phone, setPhone] = useState("")
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!processNumber || !phone) return

        setLoading(true)
        setError(null)
        setResult(null)

        try {
            const res = await getPublicProcessStatusAction(processNumber, phone)
            if (res.success) {
                setResult(res.process)
            } else {
                setError(res.error || "Processo não encontrado.")
            }
        } catch (err) {
            setError("Erro ao buscar informações. Tente novamente.")
        } finally {
            setLoading(false)
        }
    }

    const currentStatusIndex = result ? LEGAL_STATUSES.findIndex(s => s.id === result.status) : -1

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col">
            {/* Header */}
            <header className="py-6 px-6 border-b border-stone-200 dark:border-white/5 bg-white/80 dark:bg-stone-950/50 backdrop-blur-xl sticky top-0 z-20">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-stone-500 hover:text-brand-primary transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Voltar</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Scale className="h-5 w-5 text-brand-primary" />
                        <h1 className="text-xl font-black text-stone-900 dark:text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
                            Consulta de Processo
                        </h1>
                    </div>
                    <div className="w-12" /> {/* Spacer */}
                </div>
            </header>

            <main className="flex-1 max-w-4xl mx-auto w-full p-6 py-12">
                {!result ? (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center space-y-4">
                            <h2 className="text-3xl font-black text-stone-900 dark:text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
                                Acompanhe seu caso em tempo real.
                            </h2>
                            <p className="text-stone-500 dark:text-stone-400 text-sm max-w-md mx-auto">
                                Insira os dados abaixo para verificar o andamento atual do seu processo jurídico.
                            </p>
                        </div>

                        <form onSubmit={handleSearch} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-[2.5rem] p-8 shadow-xl space-y-6 max-w-md mx-auto">
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase tracking-widest font-black text-stone-500 ml-1">Número do Processo</Label>
                                <div className="relative group">
                                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 group-focus-within:text-brand-primary transition-colors" />
                                    <Input 
                                        value={processNumber}
                                        onChange={e => setProcessNumber(e.target.value)}
                                        placeholder="PROC-2026-XXXX" 
                                        className="pl-11 h-14 bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-white/5 rounded-2xl text-sm font-bold"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase tracking-widest font-black text-stone-500 ml-1">Telefone Cadastrado</Label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 group-focus-within:text-brand-primary transition-colors" />
                                    <Input 
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        placeholder="(DD) 99999-9999" 
                                        className="pl-11 h-14 bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-white/5 rounded-2xl text-sm font-bold"
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold text-center animate-in shake-1">
                                    {error}
                                </div>
                            )}

                            <Button 
                                type="submit" 
                                disabled={loading}
                                className="w-full h-14 rounded-2xl bg-brand-primary text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-brand-primary/20 hover:scale-[1.02] transition-all"
                            >
                                {loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Consultar Agora'}
                            </Button>
                        </form>
                    </div>
                ) : (
                    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                            {/* Decorative background */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                            
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-primary mb-2">Processo Encontrado</p>
                                    <h3 className="text-2xl font-black text-stone-900 dark:text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
                                        Olá, {result.customerName.split(' ')[0]}
                                    </h3>
                                    <p className="text-stone-500 text-sm mt-1">Confira abaixo o status atual do seu caso.</p>
                                </div>
                                <Badge variant="outline" className="h-10 px-4 bg-brand-primary/10 border-brand-primary/20 text-brand-primary text-xs font-black uppercase tracking-widest rounded-xl self-start md:self-center">
                                    {processNumber}
                                </Badge>
                            </div>

                            <div className="mt-12 space-y-12">
                                {/* Progress Stepper */}
                                <div className="relative">
                                    <div className="absolute top-5 left-5 right-5 h-0.5 bg-stone-100 dark:bg-stone-800 hidden md:block" />
                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                                        {LEGAL_STATUSES.map((status, index) => {
                                            const isPast = index < currentStatusIndex
                                            const isCurrent = index === currentStatusIndex
                                            
                                            return (
                                                <div key={status.id} className="relative flex md:flex-col items-center gap-4 md:gap-3 text-center group">
                                                    <div className={cn(
                                                        "h-10 w-10 rounded-full border-2 flex items-center justify-center z-10 transition-all duration-500",
                                                        isPast ? "bg-emerald-500 border-emerald-500 text-white" :
                                                        isCurrent ? "bg-brand-primary border-brand-primary text-white scale-125 shadow-lg shadow-brand-primary/20" :
                                                        "bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-stone-300"
                                                    )}>
                                                        {isPast ? <CheckCircle2 className="h-5 w-5" /> : 
                                                         isCurrent ? <Clock className="h-5 w-5 animate-pulse" /> : 
                                                         <span className="text-xs font-black">{index + 1}</span>}
                                                    </div>
                                                    <div className="flex-1 text-left md:text-center">
                                                        <p className={cn(
                                                            "text-[10px] font-black uppercase tracking-widest transition-colors",
                                                            isCurrent ? "text-brand-primary" : "text-stone-400"
                                                        )}>
                                                            {status.label}
                                                        </p>
                                                        {isCurrent && (
                                                            <p className="text-[9px] text-stone-500 font-bold mt-1 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-full inline-block">
                                                                Fase Atual
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                <div className="p-6 rounded-3xl bg-stone-50 dark:bg-stone-950/50 border border-stone-100 dark:border-white/5 flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-white/5 flex items-center justify-center shrink-0">
                                        <Info className="h-5 w-5 text-stone-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black text-stone-900 dark:text-white uppercase tracking-widest mb-1">Informação Adicional</h4>
                                        <p className="text-xs text-stone-500 leading-relaxed">
                                            Seu processo está na fase de <span className="font-bold text-stone-900 dark:text-stone-300">{LEGAL_STATUSES[currentStatusIndex]?.label}</span>. 
                                            Fique tranquilo, qualquer novidade importante entraremos em contato diretamente.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <Button 
                                variant="ghost" 
                                onClick={() => setResult(null)}
                                className="text-stone-500 hover:text-brand-primary font-bold text-xs uppercase tracking-widest gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" /> Nova Consulta
                            </Button>
                        </div>
                    </div>
                )}
            </main>

            <footer className="py-12 px-6 text-center border-t border-stone-200 dark:border-white/5 bg-white dark:bg-stone-950/50">
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">
                    © {new Date().getFullYear()} Agenda Online — Gestão Jurídica Inteligente
                </p>
            </footer>
        </div>
    )
}
