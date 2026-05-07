"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Plus, Trash2, GripVertical, ImagePlus, Eye, ArrowLeftRight, Pencil, Loader2, Image as ImageIcon, Sparkles, Scale, Briefcase, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BaseModal } from "@/components/BaseModal"
import { getMyTenant, saveTenant } from "@/lib/tenant-api"
import type { TenantBeforeAfter } from "@/lib/tenant-types"
import { toast } from "sonner"
import { ImageUpload } from "@/components/ui/image-upload"

export default function AntesDepoisPage() {
    const [items, setItems] = useState<TenantBeforeAfter[]>([])
    const [tenantSlug, setTenantSlug] = useState("")
    const [tenant, setTenant] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<TenantBeforeAfter | null>(null)
    const [formTitle, setFormTitle] = useState("")
    const [formBefore, setFormBefore] = useState("")
    const [formAfter, setFormAfter] = useState("")

    const isAdvocacia = tenant?.segmento === "advocacia"

    useEffect(() => {
        getMyTenant().then(data => {
            setTenant(data)
            setItems(data.beforeAfter || [])
            setTenantSlug(data.slug)
            setLoading(false)
        })
    }, [])

    const handleNew = () => {
        setEditingItem(null)
        setFormTitle("")
        setFormBefore("")
        setFormAfter("")
        setDialogOpen(true)
    }

    const handleEdit = (item: TenantBeforeAfter) => {
        setEditingItem(item)
        setFormTitle(item.title)
        setFormBefore(item.before)
        setFormAfter(item.after)
        setDialogOpen(true)
    }

    const handleSave = async () => {
        setSaving(true)
        let newItems: TenantBeforeAfter[]
        if (editingItem) {
            newItems = items.map(i => i.id === editingItem.id ? { ...i, title: formTitle, before: formBefore, after: formAfter } : i)
        } else {
            newItems = [...items, { id: `ba-${Date.now()}`, title: formTitle, before: formBefore, after: formAfter }]
        }
        setItems(newItems)
        setDialogOpen(false)
        try {
            await saveTenant({ slug: tenantSlug, beforeAfter: newItems })
            toast.success("Salvo com sucesso!")
        } catch {
            toast.error("Erro ao salvar")
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Deseja realmente excluir este item?")) return
        const newItems = items.filter(i => i.id !== id)
        setItems(newItems)
        try {
            await saveTenant({ slug: tenantSlug, beforeAfter: newItems })
            toast.success("Removido!")
        } catch {
            toast.error("Erro ao remover")
        }
    }

    const isImageUrl = (url: string) => url?.startsWith('http') || url?.startsWith('/') || url?.startsWith('data:image')

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
                        {isAdvocacia ? "Casos de Sucesso" : "Antes & Depois"}
                    </h2>
                    <p className="text-xs lg:text-sm text-muted-foreground mt-0.5 lg:mt-1">
                        {isAdvocacia 
                            ? "Destaque vitórias jurídicas e soluções entregues aos seus clientes." 
                            : "Exiba os resultados e transformações do seu trabalho."}
                    </p>
                </div>
                
                <Button 
                    onClick={handleNew}
                    className="w-full lg:w-auto text-white rounded-xl px-6 h-10 lg:h-12 font-bold flex items-center justify-center gap-2 transition-all bg-brand-gold text-[11px] lg:text-sm shadow-lg shadow-brand-gold/10"
                >
                    <Plus className="h-4 w-4 lg:h-5 lg:w-5" /> {isAdvocacia ? "Novo Caso" : "Novo Resultado"}
                </Button>
            </div>

            {/* ── Grid ── */}
            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white dark:bg-stone-900/40 backdrop-blur-md border border-stone-200 dark:border-white/[0.03] rounded-2xl shadow-2xl">
                    <div className="h-20 w-20 rounded-[2.5rem] bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-white/5 flex items-center justify-center mb-6 shadow-2xl">
                        {isAdvocacia ? <Briefcase className="h-10 w-10 text-stone-300 dark:text-stone-700" /> : <ArrowLeftRight className="h-10 w-10 text-stone-300 dark:text-stone-700" />}
                    </div>
                    <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                        {isAdvocacia ? "Seu portfólio está vazio" : "Sua galeria está vazia"}
                    </h3>
                    <p className="text-sm text-stone-500 max-w-xs mx-auto mb-8">
                        {isAdvocacia 
                            ? "Apresente os problemas que você resolveu para construir autoridade e confiança." 
                            : "Mostre o valor do seu serviço através de comparações visuais de resultados reais."}
                    </p>
                    <Button onClick={handleNew} className="bg-brand-gold text-white rounded-xl px-8 h-12 font-black uppercase tracking-widest text-xs shadow-xl shadow-brand-secondary/20">
                        {isAdvocacia ? "Adicionar Primeiro Caso" : "Adicionar Primeira Foto"}
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                    {items.map((item) => (
                        <div key={item.id} className="group bg-white dark:bg-stone-900/40 backdrop-blur-md border border-stone-200 dark:border-white/[0.03] rounded-2xl overflow-hidden hover:bg-stone-50 dark:hover:bg-stone-900/60 transition-all shadow-xl flex flex-col">
                            {/* Content Comparison */}
                            <div className="relative aspect-[16/9] lg:aspect-square flex bg-stone-100 dark:bg-stone-950 overflow-hidden">
                                {/* BEFORE / PROBLEM */}
                                <div className="flex-1 relative border-r border-stone-200 dark:border-white/10 overflow-hidden flex flex-col">
                                    {isImageUrl(item.before) ? (
                                        <img src={item.before} alt="Antes" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    ) : (
                                        <div className="w-full h-full p-4 flex flex-col justify-center bg-stone-50 dark:bg-stone-900 text-[11px] lg:text-xs text-stone-600 dark:text-stone-400 italic leading-relaxed text-center overflow-y-auto hide-scrollbar">
                                            {isAdvocacia && <AlertCircle className="h-4 w-4 mx-auto mb-2 opacity-20" />}
                                            "{item.before || (isAdvocacia ? "Descreva o problema jurídico..." : "Sem descrição...")}"
                                        </div>
                                    )}
                                    <div className="absolute top-2 left-2 bg-white/80 dark:bg-stone-950/80 backdrop-blur-md text-stone-900 dark:text-white text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider border border-stone-200 dark:border-white/5 z-10">
                                        {isAdvocacia ? "O Problema" : "Antes"}
                                    </div>
                                </div>

                                {/* AFTER / RESULT */}
                                <div className="flex-1 relative overflow-hidden flex flex-col">
                                    {isImageUrl(item.after) ? (
                                        <img src={item.after} alt="Depois" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    ) : (
                                        <div className="w-full h-full p-4 flex flex-col justify-center bg-brand-primary/10 dark:bg-brand-primary/5 text-[11px] lg:text-xs text-brand-primary font-bold leading-relaxed text-center overflow-y-auto hide-scrollbar">
                                            {isAdvocacia && <CheckCircle2 className="h-4 w-4 mx-auto mb-2" />}
                                            {item.after || (isAdvocacia ? "Descreva o resultado alcançado..." : "Sem descrição...")}
                                        </div>
                                    )}
                                    <div className="absolute top-2 left-2 bg-brand-primary text-white text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider shadow-lg z-10">
                                        {isAdvocacia ? "O Resultado" : "Depois"}
                                    </div>
                                </div>
                                
                                {/* Overlay Actions */}
                                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 z-20">
                                    <button onClick={() => handleEdit(item)} className="h-9 w-9 rounded-xl bg-white/90 dark:bg-stone-950/80 backdrop-blur-md border border-stone-200 dark:border-white/10 flex items-center justify-center text-stone-900 dark:text-white hover:bg-brand-primary hover:text-white transition-all shadow-lg">
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} className="h-9 w-9 rounded-xl bg-white/90 dark:bg-stone-950/80 backdrop-blur-md border border-stone-200 dark:border-white/10 flex items-center justify-center text-stone-400 hover:text-red-500 hover:bg-red-500/10 transition-all shadow-lg">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-4 lg:p-5 flex items-center justify-between gap-4">
                                <h4 className="text-sm lg:text-base font-bold text-stone-900 dark:text-white group-hover:text-brand-primary transition-colors truncate">
                                    {item.title}
                                </h4>
                                <div className="h-7 px-2.5 rounded-lg bg-stone-50 dark:bg-white/[0.03] border border-stone-100 dark:border-white/5 flex items-center gap-1.5 text-[9px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-widest whitespace-nowrap shadow-sm">
                                    {isAdvocacia ? <Scale className="h-3 w-3 text-brand-gold" /> : <Sparkles className="h-3 w-3 text-brand-gold" />} Ver Caso
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Add New Slot */}
                    <button
                        onClick={handleNew}
                        className="group min-h-[200px] rounded-2xl border-2 border-dashed border-stone-200 dark:border-white/5 bg-stone-50 dark:bg-stone-900/20 flex flex-col items-center justify-center gap-4 hover:bg-white dark:hover:bg-brand-primary/5 hover:border-brand-primary/20 transition-all shadow-sm"
                    >
                        <div className="h-14 w-14 rounded-2xl bg-stone-100 dark:bg-white/[0.03] border border-stone-200 dark:border-white/5 flex items-center justify-center text-stone-400 dark:text-stone-500 group-hover:text-brand-primary group-hover:scale-110 transition-all shadow-lg">
                            <Plus className="h-6 w-6" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-bold text-stone-500 dark:text-stone-400 group-hover:text-stone-900 dark:group-hover:text-foreground transition-colors uppercase tracking-widest">{isAdvocacia ? "Novo Caso" : "Novo Resultado"}</p>
                            <p className="text-[10px] text-stone-400 dark:text-stone-600 mt-1 max-w-[140px]">{isAdvocacia ? "Documente uma vitória" : "Compare o antes e depois"}</p>
                        </div>
                    </button>
                </div>
            )}

            {/* ── Tip Card ── */}
            <div className="bg-white dark:bg-stone-900/40 backdrop-blur-md border border-stone-200 dark:border-white/[0.03] p-5 lg:p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-5 shadow-lg mt-4 lg:mt-8">
                <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
                    <div className="h-12 w-12 lg:h-14 lg:w-14 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center shrink-0">
                        {isAdvocacia ? <Scale className="h-6 w-6 lg:h-7 lg:w-7 text-brand-primary" /> : <Sparkles className="h-6 w-6 lg:h-7 lg:w-7 text-brand-primary" />}
                    </div>
                    <div>
                        <h4 className="text-sm lg:text-base font-bold text-stone-900 dark:text-white leading-tight">{isAdvocacia ? "Autoridade Jurídica" : "Dica de Conversão"}</h4>
                        <p className="text-xs text-stone-500 mt-1">
                            {isAdvocacia 
                                ? "Casos de sucesso demonstram sua competência e atraem clientes qualificados." 
                                : "Fotos reais de resultados aumentam a confiança dos clientes em até 3x."}
                        </p>
                    </div>
                </div>
                <Button variant="outline" className="w-full sm:w-auto h-11 lg:h-12 px-6 rounded-xl border-stone-200 dark:border-white/5 text-stone-500 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-white/5 font-bold text-[11px] lg:text-xs shadow-sm">
                    {isAdvocacia ? "Ver Portfólio no Site" : "Ver Galeria no Site"}
                </Button>
            </div>

            {/* ── Modal ── */}
            <BaseModal
                isOpen={dialogOpen}
                onClose={() => setDialogOpen(false)}
                title={editingItem ? (isAdvocacia ? "Editar Caso" : "Editar Resultado") : (isAdvocacia ? "Novo Caso de Sucesso" : "Novo Antes & Depois")}
                icon={isAdvocacia ? Briefcase : ArrowLeftRight}
                footer={
                    <div className="flex gap-3 w-full">
                        <Button variant="outline" onClick={() => setDialogOpen(false)} className="flex-1 h-12 rounded-xl border-stone-200 dark:border-white/5 text-stone-500 hover:bg-stone-50 dark:hover:bg-white/5 font-bold">
                            Cancelar
                        </Button>
                        <Button onClick={handleSave} disabled={!formTitle || saving} className="bg-brand-gold text-white rounded-xl flex-1 h-12 font-black uppercase tracking-widest text-xs shadow-xl shadow-brand-secondary/20">
                            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            {editingItem ? "Salvar" : "Adicionar"}
                        </Button>
                    </div>
                }
            >
                <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar pb-2">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-stone-500">{isAdvocacia ? "Título do Caso" : "Título do Procedimento"}</Label>
                        <Input value={formTitle} onChange={e => setFormTitle(e.target.value)} placeholder={isAdvocacia ? "Ex: Revisão de Aposentadoria" : "Ex: Micropigmentação Labial"} 
                            className="h-12 bg-white dark:bg-stone-950/40 border-stone-200 dark:border-white/5 rounded-xl text-sm font-bold text-stone-900 dark:text-white shadow-sm" />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-stone-500">{isAdvocacia ? "O Problema (Texto ou Foto)" : "Foto — Antes"}</Label>
                            {isAdvocacia ? (
                                <textarea 
                                    value={formBefore} 
                                    onChange={e => setFormBefore(e.target.value)} 
                                    placeholder="Descreva a situação inicial ou o desafio enfrentado pelo cliente..."
                                    className="w-full min-h-[140px] bg-white dark:bg-stone-950/40 border border-stone-200 dark:border-white/5 rounded-xl px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-brand-primary/20 text-stone-900 dark:text-stone-300 outline-none font-medium shadow-sm"
                                />
                            ) : (
                                <ImageUpload value={formBefore} onChange={url => setFormBefore(url)} />
                            )}
                            {isAdvocacia && (
                                <div className="pt-2">
                                    <p className="text-[10px] text-stone-600 italic">Ou cole uma URL de imagem se preferir.</p>
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-stone-500">{isAdvocacia ? "A Solução (Texto ou Foto)" : "Foto — Depois"}</Label>
                            {isAdvocacia ? (
                                <textarea 
                                    value={formAfter} 
                                    onChange={e => setFormAfter(e.target.value)} 
                                    placeholder="Descreva como você resolveu o caso e qual foi o resultado final..."
                                    className="w-full min-h-[140px] bg-white dark:bg-stone-950/40 border border-stone-200 dark:border-white/5 rounded-xl px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-brand-primary/20 text-stone-900 dark:text-stone-300 outline-none font-medium shadow-sm"
                                />
                            ) : (
                                <ImageUpload value={formAfter} onChange={url => setFormAfter(url)} />
                            )}
                             {isAdvocacia && (
                                <div className="pt-2">
                                    <p className="text-[10px] text-stone-600 italic">Ou cole uma URL de imagem se preferir.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </BaseModal>
        </div>
    )
}
