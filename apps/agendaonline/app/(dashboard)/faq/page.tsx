"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Plus, Trash2, Pencil, GripVertical, MessageCircleQuestion, ChevronDown, ChevronUp, HelpCircle, Loader2, Search, HelpCircle as HelpIcon, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BaseModal } from "@/components/BaseModal"
import { getMyTenant, saveTenant } from "@/lib/tenant-api"
import type { TenantFAQ } from "@/lib/tenant-types"
import { toast } from "sonner"

export default function FAQPage() {
    const [items, setItems] = useState<TenantFAQ[]>([])
    const [tenantSlug, setTenantSlug] = useState("")
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<TenantFAQ | null>(null)
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [formQuestion, setFormQuestion] = useState("")
    const [formAnswer, setFormAnswer] = useState("")
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        getMyTenant().then(data => {
            setItems(data.faq || [])
            setTenantSlug(data.slug)
            setLoading(false)
        })
    }, [])

    const handleNew = () => {
        setEditingItem(null)
        setFormQuestion("")
        setFormAnswer("")
        setDialogOpen(true)
    }

    const handleEdit = (item: TenantFAQ) => {
        setEditingItem(item)
        setFormQuestion(item.question)
        setFormAnswer(item.answer)
        setDialogOpen(true)
    }

    const handleSave = async () => {
        setSaving(true)
        let newItems: TenantFAQ[]
        if (editingItem) {
            newItems = items.map(i => i.id === editingItem.id ? { ...i, question: formQuestion, answer: formAnswer } : i)
        } else {
            newItems = [...items, { id: `faq-${Date.now()}`, question: formQuestion, answer: formAnswer }]
        }
        setItems(newItems)
        setDialogOpen(false)
        try {
            await saveTenant({ slug: tenantSlug, faq: newItems })
            toast.success("FAQ salvo com sucesso!")
        } catch {
            toast.error("Erro ao salvar FAQ")
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Deseja realmente excluir esta pergunta?")) return
        const newItems = items.filter(i => i.id !== id)
        setItems(newItems)
        try {
            await saveTenant({ slug: tenantSlug, faq: newItems })
            toast.success("FAQ removido!")
        } catch {
            toast.error("Erro ao remover FAQ")
        }
    }

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id)
    }

    const filteredItems = items.filter(i => 
        i.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
        i.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col space-y-4 lg:space-y-6 animate-in fade-in duration-500 pb-10">
            {/* ── Header ── */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6 mb-1 lg:mb-2 lg:px-0">
                <div className="flex-1">
                    <h2 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight flex items-center gap-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                        Perguntas Frequentes
                    </h2>
                    <p className="text-xs lg:text-sm text-muted-foreground mt-0.5 lg:mt-1">
                        Gerencie as dúvidas mais comuns dos seus clientes.
                    </p>
                </div>
                
                <Button 
                    onClick={handleNew}
                    className="w-full lg:w-auto text-white rounded-xl px-6 h-10 lg:h-12 font-bold flex items-center justify-center gap-2 transition-all bg-brand-gold text-[11px] lg:text-sm shadow-lg shadow-brand-gold/10"
                >
                    <Plus className="h-4 w-4 lg:h-5 lg:w-5" /> Nova Pergunta
                </Button>
            </div>

            {/* ── Search ── */}
            <div className="relative group px-0 lg:px-0">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-stone-500 group-focus-within:text-brand-primary transition-colors" />
                </div>
                <Input
                    placeholder="Buscar pergunta ou resposta..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-stone-900/40 backdrop-blur-md border-white/[0.03] rounded-2xl pl-12 h-12 lg:h-14 text-sm lg:text-base focus-visible:ring-brand-primary/20 transition-all shadow-lg"
                />
            </div>

            {/* ── FAQ List ── */}
            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-stone-900/40 backdrop-blur-md border border-white/[0.03] rounded-2xl shadow-2xl">
                    <div className="h-20 w-20 rounded-[2.5rem] bg-stone-900 border border-white/5 flex items-center justify-center mb-6 shadow-2xl">
                        <HelpCircle className="h-10 w-10 text-stone-700" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                        Nenhuma pergunta cadastrada
                    </h3>
                    <p className="text-sm text-stone-500 max-w-xs mx-auto mb-8">
                        Ajude seus clientes a tirarem dúvidas rápidas e aumente sua taxa de agendamentos.
                    </p>
                    <Button onClick={handleNew} className="bg-brand-gold text-white rounded-xl px-8 h-12 font-black uppercase tracking-widest text-xs shadow-xl shadow-brand-gold/10">
                        Adicionar Primeira Pergunta
                    </Button>
                </div>
            ) : (
                <div className="bg-stone-900/40 backdrop-blur-md border border-white/[0.03] rounded-2xl overflow-hidden shadow-2xl divide-y divide-white/[0.03]">
                    {filteredItems.map((item) => (
                        <div key={item.id} className="group">
                            <div className="flex items-center gap-4 px-5 py-4 lg:py-5 hover:bg-white/[0.02] transition-all">
                                <div className="h-8 w-8 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center shrink-0">
                                    <HelpIcon className="h-4 w-4 text-stone-600 group-hover:text-brand-primary transition-colors" />
                                </div>
                                <button onClick={() => toggleExpand(item.id)} className="flex-1 text-left min-w-0">
                                    <p className="text-sm lg:text-base font-bold text-white truncate group-hover:text-brand-primary transition-colors">{item.question}</p>
                                </button>
                                <div className="flex items-center gap-2">
                                    <div className="hidden lg:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEdit(item)} className="h-10 w-10 rounded-xl flex items-center justify-center text-stone-400 bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:text-white transition-all">
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => handleDelete(item.id)} className="h-10 w-10 rounded-xl flex items-center justify-center text-stone-400 bg-white/[0.03] border border-white/5 hover:bg-red-500/10 hover:text-red-500 transition-all">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <button onClick={() => toggleExpand(item.id)} className="h-10 w-10 rounded-xl flex items-center justify-center text-stone-500 hover:text-white hover:bg-white/5 transition-all">
                                        {expandedId === item.id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                            
                            {/* Actions bar for mobile (always visible on group hover or if expanded) */}
                            <div className={cn(
                                "lg:hidden flex items-center gap-2 px-14 pb-4 transition-all overflow-hidden",
                                expandedId === item.id ? "h-auto opacity-100" : "h-0 opacity-0"
                            )}>
                                <button onClick={() => handleEdit(item)} className="h-9 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-stone-400 bg-white/[0.03] border border-white/5">
                                    <Pencil className="h-3 w-3" /> Editar
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="h-9 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-red-500 bg-red-500/5 border border-red-500/10">
                                    <Trash2 className="h-3 w-3" /> Excluir
                                </button>
                            </div>

                            {expandedId === item.id && (
                                <div className="px-5 pb-6 pl-16 animate-in slide-in-from-top-2 duration-200">
                                    <p className="text-xs lg:text-sm text-stone-400 leading-relaxed max-w-2xl">{item.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                    {filteredItems.length === 0 && (
                        <div className="py-12 text-center">
                            <p className="text-sm text-stone-600 italic">Nenhuma pergunta encontrada para sua busca.</p>
                        </div>
                    )}
                </div>
            )}

            {/* ── Tip Card ── */}
            <div className="bg-stone-900/40 backdrop-blur-md border border-white/[0.03] p-5 lg:p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-5 shadow-lg mt-4 lg:mt-8">
                <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
                    <div className="h-12 w-12 lg:h-14 lg:w-14 rounded-2xl bg-brand-primary/5 border border-brand-primary/10 flex items-center justify-center shrink-0">
                        <Sparkles className="h-6 w-6 lg:h-7 lg:w-7 text-brand-primary" />
                    </div>
                    <div>
                        <h4 className="text-sm lg:text-base font-bold text-white leading-tight">Dica de Atendimento</h4>
                        <p className="text-xs text-stone-500 mt-1">Antecipar dúvidas comuns reduz o tempo de suporte e passa mais segurança para o cliente agendar.</p>
                    </div>
                </div>
                <Button variant="outline" className="w-full sm:w-auto h-11 lg:h-12 px-6 rounded-xl border-white/5 text-stone-400 hover:bg-white/5 font-bold text-[11px] lg:text-xs">
                    Ver no Site
                </Button>
            </div>

            {/* ── Modal ── */}
            <BaseModal
                isOpen={dialogOpen}
                onClose={() => setDialogOpen(false)}
                title={editingItem ? "Editar Pergunta" : "Nova Pergunta"}
                icon={HelpIcon}
                footer={
                    <div className="flex gap-3 w-full">
                        <Button variant="outline" onClick={() => setDialogOpen(false)} className="flex-1 h-12 rounded-xl border-white/5 text-stone-500 hover:bg-white/5 font-bold">
                            Cancelar
                        </Button>
                        <Button onClick={handleSave} disabled={!formQuestion || !formAnswer || saving} className="bg-brand-gold text-white rounded-xl flex-1 h-12 font-black uppercase tracking-widest text-xs shadow-xl">
                            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            {editingItem ? "Salvar Pergunta" : "Adicionar Pergunta"}
                        </Button>
                    </div>
                }
            >
                <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar pb-2">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-stone-500">Pergunta do Cliente</Label>
                        <Input value={formQuestion} onChange={e => setFormQuestion(e.target.value)} placeholder="Ex: Quais são os horários de atendimento?" 
                            className="h-12 bg-stone-950/40 border-white/5 rounded-xl text-sm font-bold" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-stone-500">Resposta Detalhada</Label>
                        <textarea 
                            value={formAnswer} 
                            onChange={e => setFormAnswer(e.target.value)} 
                            placeholder="Escreva a resposta de forma clara e objetiva..."
                            className="w-full min-h-[140px] bg-stone-950/40 border border-white/5 rounded-xl px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-brand-primary/20 text-stone-300 outline-none font-medium leading-relaxed"
                        />
                    </div>
                </div>
            </BaseModal>
        </div>
    )
}
