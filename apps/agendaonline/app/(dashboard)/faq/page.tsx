"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Plus, Trash2, Pencil, GripVertical, MessageCircleQuestion, ChevronDown, ChevronUp, HelpCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[40vh]">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-foreground tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
                        Perguntas Frequentes
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        {items.length} pergunta{items.length !== 1 ? "s" : ""} cadastrada{items.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <Button onClick={handleNew} className="btn-gold-solid font-semibold rounded-lg px-4">
                    <Plus className="h-4 w-4 mr-2" /> Nova Pergunta
                </Button>
            </div>

            {/* FAQ List */}
            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-75 border-2 border-dashed border-amber-500/20 rounded-xl p-8 text-center space-y-4">
                    <div className="p-4 rounded-full" style={{ background: 'linear-gradient(135deg, rgba(232,168,58,0.15) 0%, rgba(232,168,58,0.05) 100%)' }}>
                        <HelpCircle className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold">Nenhuma pergunta cadastrada</h3>
                    <p className="text-muted-foreground max-w-xs mx-auto">Adicione perguntas frequentes para ajudar seus clientes.</p>
                    <Button onClick={handleNew} className="btn-gold-solid rounded-lg">
                        <Plus className="h-4 w-4 mr-2" /> Adicionar primeira pergunta
                    </Button>
                </div>
            ) : (
                <div className="relative rounded-xl border border-amber-200/20 dark:border-amber-500/10 overflow-hidden divide-y divide-stone-100 dark:divide-stone-800/50 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm">
                    {items.map((item) => (
                        <div key={item.id} className="group">
                            <div className="flex items-center gap-4 px-6 py-4 hover:bg-stone-50/50 dark:hover:bg-stone-800/20 transition-colors">
                                <GripVertical className="h-4 w-4 text-stone-300 shrink-0 cursor-grab" />
                                <button onClick={() => toggleExpand(item.id)} className="flex-1 text-left min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">{item.question}</p>
                                </button>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(item)} className="h-8 w-8 rounded-lg flex items-center justify-center text-stone-400 hover:text-foreground hover:bg-stone-100 dark:hover:bg-stone-800 transition-all">
                                        <Pencil className="h-3.5 w-3.5" />
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} className="h-8 w-8 rounded-lg flex items-center justify-center text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all">
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                                <button onClick={() => toggleExpand(item.id)} className="h-8 w-8 rounded-lg flex items-center justify-center text-stone-400 hover:text-foreground transition-all">
                                    {expandedId === item.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </button>
                            </div>
                            {expandedId === item.id && (
                                <div className="px-6 pb-5 pl-14">
                                    <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{editingItem ? "Editar Pergunta" : "Nova Pergunta"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Pergunta</Label>
                            <Input value={formQuestion} onChange={e => setFormQuestion(e.target.value)} placeholder="Como faço para agendar?" className="rounded-lg" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Resposta</Label>
                            <textarea value={formAnswer} onChange={e => setFormAnswer(e.target.value)} placeholder="Escreva a resposta aqui..."
                                className="w-full min-h-28 rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none" />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" className="rounded-lg">Cancelar</Button>
                        </DialogClose>
                        <Button onClick={handleSave} disabled={!formQuestion || !formAnswer || saving} className="btn-gold-solid rounded-lg">
                            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            {editingItem ? "Salvar" : "Adicionar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
