"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Plus, Trash2, GripVertical, ImagePlus, Eye, ArrowLeftRight, Pencil, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import Image from "next/image"
import { getMyTenant, saveTenant } from "@/lib/tenant-api"
import type { TenantBeforeAfter } from "@/lib/tenant-types"
import { toast } from "sonner"
import { ImageUpload } from "@/components/ui/image-upload"

export default function AntesDepoisPage() {
    const [items, setItems] = useState<TenantBeforeAfter[]>([])
    const [tenantSlug, setTenantSlug] = useState("")
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<TenantBeforeAfter | null>(null)
    const [formTitle, setFormTitle] = useState("")
    const [formBefore, setFormBefore] = useState("")
    const [formAfter, setFormAfter] = useState("")

    useEffect(() => {
        getMyTenant().then(data => {
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
        const newItems = items.filter(i => i.id !== id)
        setItems(newItems)
        try {
            await saveTenant({ slug: tenantSlug, beforeAfter: newItems })
            toast.success("Removido!")
        } catch {
            toast.error("Erro ao remover")
        }
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-semibold text-foreground tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
                        Antes & Depois
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        {items.length} foto{items.length !== 1 ? "s" : ""} cadastrada{items.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <Button onClick={handleNew} className="w-full sm:w-auto btn-gold-solid font-semibold rounded-lg px-4">
                    <Plus className="h-4 w-4 mr-2" /> Nova Foto
                </Button>
            </div>

            {/* Grid */}
            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-75 border-2 border-dashed border-amber-500/20 rounded-xl p-8 text-center space-y-4">
                    <div className="p-4 rounded-full" style={{ background: 'linear-gradient(135deg, rgba(232,168,58,0.15) 0%, rgba(232,168,58,0.05) 100%)' }}>
                        <ArrowLeftRight className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold">Nenhuma foto cadastrada</h3>
                    <p className="text-muted-foreground max-w-xs mx-auto">Mostre os resultados do seu trabalho com fotos de antes e depois.</p>
                    <Button onClick={handleNew} className="btn-gold-solid rounded-lg">
                        <Plus className="h-4 w-4 mr-2" /> Adicionar primeira foto
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {items.map((item) => (
                        <div key={item.id} className="relative rounded-xl border border-amber-200/20 dark:border-amber-500/10 overflow-hidden group bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5 transition-all">
                            <div className="grid grid-cols-2 gap-px bg-stone-200 dark:bg-stone-800">
                                <div className="relative aspect-square bg-stone-100 dark:bg-stone-900">
                                    {item.before ? (
                                        <img src={item.before} alt="Antes" className="absolute inset-0 w-full h-full object-cover" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs">Antes</div>
                                    )}
                                    <span className="absolute top-2 left-2 bg-black/60 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">Antes</span>
                                </div>
                                <div className="relative aspect-square bg-stone-100 dark:bg-stone-900">
                                    {item.after ? (
                                        <img src={item.after} alt="Depois" className="absolute inset-0 w-full h-full object-cover" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs">Depois</div>
                                    )}
                                    <span className="absolute top-2 left-2 bg-amber-500/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">Depois</span>
                                </div>
                            </div>
                            <div className="px-4 py-3 flex items-center justify-between">
                                <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(item)} className="h-7 w-7 rounded-lg flex items-center justify-center text-stone-400 hover:text-foreground hover:bg-stone-100 dark:hover:bg-stone-800 transition-all">
                                        <Pencil className="h-3 w-3" />
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} className="h-7 w-7 rounded-lg flex items-center justify-center text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all">
                                        <Trash2 className="h-3 w-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{editingItem ? "Editar Foto" : "Nova Foto Antes & Depois"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Título do procedimento</Label>
                            <Input value={formTitle} onChange={e => setFormTitle(e.target.value)} placeholder="Ex: Micropigmentação Fio a Fio" className="rounded-lg" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Imagem — Antes</Label>
                            <ImageUpload value={formBefore} onChange={url => setFormBefore(url)} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Imagem — Depois</Label>
                            <ImageUpload value={formAfter} onChange={url => setFormAfter(url)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" className="rounded-lg">Cancelar</Button>
                        </DialogClose>
                        <Button onClick={handleSave} disabled={!formTitle || saving} className="btn-gold-solid rounded-lg">
                            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            {editingItem ? "Salvar" : "Adicionar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
