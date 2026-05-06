"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Clock, Filter, Search, LayoutGrid, List, Scissors } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { BaseModal } from "@/components/BaseModal"

import { createServiceAction, updateServiceAction, deleteServiceAction, toggleServiceStatusAction } from "@/lib/actions/services"
import { createCategoryAction, deleteCategoryAction } from "@/lib/actions/categories"
import { ImageUpload } from "@/components/ui/image-upload"

export interface Service {
    id: string
    name: string
    category: string // This will now represent categoryId
    description: string
    price: string
    duration: number
    isActive: boolean
    image?: string
}

export interface Category {
    id: string
    label: string
}

export default function ServicosClient({
    initialServices,
    initialCategories,
    tenantId
}: {
    initialServices: Service[],
    initialCategories: Category[],
    tenantId: string
}) {
    const router = useRouter()
    const [services, setServices] = useState<Service[]>(initialServices)
    const [categories, setCategories] = useState<Category[]>(initialCategories)
    const [editingService, setEditingService] = useState<Service | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
    const [newCategoryLabel, setNewCategoryLabel] = useState("")
    const [searchTerm, setSearchTerm] = useState("")

    const toggleActive = async (id: string) => {
        const service = services.find(s => s.id === id)
        if (!service) return

        const newTargetState = !service.isActive

        // Optimistic UI update
        setServices(prev => prev.map(s => s.id === id ? { ...s, isActive: newTargetState } : s))

        const res = await toggleServiceStatusAction(id, tenantId, newTargetState)
        if (!res.success) {
            toast.error(res.error)
            // Revert on failure
            setServices(prev => prev.map(s => s.id === id ? { ...s, isActive: service.isActive } : s))
        } else {
            toast.success(newTargetState ? "Serviço ativado" : "Serviço desativado")
        }
    }

    const deleteService = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esse serviço?")) return

        const res = await deleteServiceAction(id, tenantId)
        if (res.success) {
            setServices(prev => prev.filter(s => s.id !== id))
            toast.success("Serviço excluído com sucesso.")
            router.refresh()
        } else {
            toast.error(res.error)
        }
    }

    const handleNew = () => {
        setEditingService({ id: "", name: "", category: categories[0]?.id || "", description: "", price: "", duration: 60, isActive: true, image: "" })
        setIsDialogOpen(true)
    }

    const handleEdit = (service: Service) => {
        setEditingService({ ...service })
        setIsDialogOpen(true)
    }

    const handleAddCategory = async () => {
        if (!newCategoryLabel) return
        const slug = newCategoryLabel.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-")
        const res = await createCategoryAction(tenantId, { label: newCategoryLabel, slug })
        if (res.success && res.category) {
            setCategories(prev => [...prev, { id: res.category.id, label: res.category.label }])
            setNewCategoryLabel("")
            toast.success("Categoria adicionada!")
            router.refresh()
        } else {
            toast.error(res.error || "Erro ao criar categoria.")
        }
    }

    const handleDeleteCategory = async (id: string) => {
        if (!confirm("Isso excluirá a categoria. Serviços vinculados podem ficar órfãos. Continuar?")) return
        const res = await deleteCategoryAction(id, tenantId)
        if (res.success) {
            setCategories(prev => prev.filter(c => c.id !== id))
            toast.success("Categoria removida.")
            router.refresh()
        } else {
            toast.error(res.error)
        }
    }

    const handleSave = async () => {
        if (!editingService) return

        if (!editingService.name || !editingService.category) {
            toast.error("Nome e Categoria são obrigatórios.")
            return
        }

        const isNew = !editingService.id

        if (isNew) {
            const res = await createServiceAction(tenantId, {
                name: editingService.name,
                categoryId: editingService.category,
                description: editingService.description,
                price: parseFloat(editingService.price || "0"),
                duration: editingService.duration,
                isActive: editingService.isActive,
                image: editingService.image
            })

            if (res.success && res.service) {
                toast.success("Serviço criado com sucesso!")
                setServices(prev => [...prev, {
                    ...editingService,
                    id: res.service.id,
                    price: res.service.price || "0",
                    category: res.service.categoryId
                }])
            } else {
                toast.error(res.error || "Erro ao criar serviço.")
            }
        } else {
            // Update
            const res = await updateServiceAction(editingService.id, tenantId, {
                name: editingService.name,
                categoryId: editingService.category,
                description: editingService.description,
                price: parseFloat(editingService.price || "0"),
                duration: editingService.duration,
                image: editingService.image
            })

            if (res.success && res.service) {
                toast.success("Serviço atualizado com sucesso!")
                setServices(prev => prev.map(s => s.id === editingService.id ? {
                    ...editingService,
                    price: res.service.price || "0",
                    category: res.service.categoryId
                } : s))
            } else {
                toast.error(res.error || "Erro ao atualizar serviço.")
            }
        }

        setIsDialogOpen(false)
        setEditingService(null)
        router.refresh()
    }

    const getCategoryLabel = (id: string) => categories.find(c => c.id === id)?.label || id

    const filteredServices = services.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getCategoryLabel(s.category).toLowerCase().includes(searchTerm.toLowerCase())
    )

    const activeServices = filteredServices.filter(s => s.isActive)
    const inactiveServices = filteredServices.filter(s => !s.isActive)

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-semibold text-foreground tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>Catálogo de Serviços</h2>
                    <p className="text-sm text-muted-foreground mt-1">Cadastre e gerencie o que você oferece.</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button variant="outline" onClick={() => setIsCategoryDialogOpen(true)} className="flex-1 sm:flex-none rounded-lg px-4 border-dashed border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-500/5">
                        Organizar Categorias
                    </Button>
                    <Button onClick={handleNew} className="flex-1 sm:flex-none btn-gold-solid font-semibold rounded-lg px-4">
                        <Plus className="h-4 w-4 mr-2" /> Novo serviço
                    </Button>
                </div>
            </div>

            {/* ── Toolbar ── */}
            <div className="flex flex-col sm:flex-row items-center gap-3 relative rounded-xl border border-amber-200/20 dark:border-amber-500/10 p-3 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm overflow-hidden">
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(232,168,58,0.03) 0%, transparent 40%)' }} />
                <div className="relative z-10 w-full flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500/50" />
                    <Input
                        placeholder="Buscar por nome ou categoria..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-10 bg-muted border-none rounded-lg text-sm"
                    />
                </div>
            </div>

            {/* ── Services Grid ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeServices.map(service => (
                    <div key={service.id} className="group relative rounded-xl border border-amber-200/20 dark:border-amber-500/10 p-5 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-200 flex flex-col h-full overflow-hidden">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => toggleActive(service.id)} className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-emerald-500">
                                <ToggleRight className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mb-4">
                            <Badge variant="secondary" className="bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400 text-xs font-medium rounded-full px-2.5 py-0.5 mb-3">
                                {getCategoryLabel(service.category)}
                            </Badge>
                            <h3 className="text-lg font-semibold text-foreground mb-1 leading-tight">{service.name}</h3>
                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                {service.description}
                            </p>
                        </div>

                        <div className="mt-auto pt-4 border-t flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-0.5">
                                    <Clock className="h-3 w-3" /> {service.duration} min
                                </div>
                                <div className="text-lg font-bold text-foreground">
                                    R$ {service.price}
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={() => handleEdit(service)} className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
                                    <Pencil className="h-4 w-4" />
                                </button>
                                <button onClick={() => deleteService(service.id)} className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-500 transition-all">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add New Placeholder */}
                <button
                    onClick={handleNew}
                    className="group rounded-xl border-2 border-dashed border-amber-500/20 p-5 flex flex-col items-center justify-center gap-3 hover:bg-amber-500/5 hover:border-amber-500/40 transition-all duration-200 min-h-60"
                >
                    <div className="h-11 w-11 rounded-xl bg-card border flex items-center justify-center text-muted-foreground group-hover:text-amber-500 group-hover:scale-105 transition-all shadow-sm">
                        <Plus className="h-5 w-5" />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">Adicionar Novo</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Expanda seu catálogo</p>
                    </div>
                </button>
            </div>

            {/* ── Inactive Services ── */}
            {inactiveServices.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-border" />
                        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Serviços Inativos</h4>
                        <div className="h-px flex-1 bg-border" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 opacity-60">
                        {inactiveServices.map(service => (
                            <div key={service.id} className="bg-card rounded-xl border p-4 flex items-center justify-between">
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-muted-foreground line-through truncate">{service.name}</p>
                                    <p className="text-xs text-muted-foreground">{getCategoryLabel(service.category)}</p>
                                </div>
            setCategories(prev => [...prev, { id: res.category.id, label: res.category.label }])
            setNewCategoryLabel("")
            toast.success("Categoria adicionada!")
            router.refresh()
        } else {
            toast.error(res.error || "Erro ao criar categoria.")
        }
    }

    const handleDeleteCategory = async (id: string) => {
        if (!confirm("Isso excluirá a categoria. Serviços vinculados podem ficar órfãos. Continuar?")) return
        const res = await deleteCategoryAction(id, tenantId)
        if (res.success) {
            setCategories(prev => prev.filter(c => c.id !== id))
            toast.success("Categoria removida.")
            router.refresh()
        } else {
            toast.error(res.error)
        }
    }

    const handleSave = async () => {
        if (!editingService) return

        if (!editingService.name || !editingService.category) {
            toast.error("Nome e Categoria são obrigatórios.")
            return
        }

        const isNew = !editingService.id

        if (isNew) {
            const res = await createServiceAction(tenantId, {
                name: editingService.name,
                categoryId: editingService.category,
                description: editingService.description,
                price: parseFloat(editingService.price || "0"),
                duration: editingService.duration,
                isActive: editingService.isActive,
                image: editingService.image
            })

            if (res.success && res.service) {
                toast.success("Serviço criado com sucesso!")
                setServices(prev => [...prev, {
                    ...editingService,
                    id: res.service.id,
                    price: res.service.price || "0",
                    category: res.service.categoryId
                }])
            } else {
                toast.error(res.error || "Erro ao criar serviço.")
            }
        } else {
            // Update
            const res = await updateServiceAction(editingService.id, tenantId, {
                name: editingService.name,
                categoryId: editingService.category,
                description: editingService.description,
                price: parseFloat(editingService.price || "0"),
                duration: editingService.duration,
                image: editingService.image
            })

            if (res.success && res.service) {
                toast.success("Serviço atualizado com sucesso!")
                setServices(prev => prev.map(s => s.id === editingService.id ? {
                    ...editingService,
                    price: res.service.price || "0",
                    category: res.service.categoryId
                } : s))
            } else {
                toast.error(res.error || "Erro ao atualizar serviço.")
            }
        }

        setIsDialogOpen(false)
        setEditingService(null)
        router.refresh()
    }

    const getCategoryLabel = (id: string) => categories.find(c => c.id === id)?.label || id

    const filteredServices = services.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getCategoryLabel(s.category).toLowerCase().includes(searchTerm.toLowerCase())
    )

    const activeServices = filteredServices.filter(s => s.isActive)
    const inactiveServices = filteredServices.filter(s => !s.isActive)

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-semibold text-foreground tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>Catálogo de Serviços</h2>
                    <p className="text-sm text-muted-foreground mt-1">Cadastre e gerencie o que você oferece.</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button variant="outline" onClick={() => setIsCategoryDialogOpen(true)} className="flex-1 sm:flex-none rounded-lg px-4 border-dashed border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-500/5">
                        Organizar Categorias
                    </Button>
                    <Button onClick={handleNew} className="flex-1 sm:flex-none btn-gold-solid font-semibold rounded-lg px-4">
                        <Plus className="h-4 w-4 mr-2" /> Novo serviço
                    </Button>
                </div>
            </div>

            {/* ── Toolbar ── */}
            <div className="flex flex-col sm:flex-row items-center gap-3 relative rounded-xl border border-amber-200/20 dark:border-amber-500/10 p-3 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm overflow-hidden">
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(232,168,58,0.03) 0%, transparent 40%)' }} />
                <div className="relative z-10 w-full flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500/50" />
                    <Input
                        placeholder="Buscar por nome ou categoria..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-10 bg-muted border-none rounded-lg text-sm"
                    />
                </div>
            </div>

            {/* ── Services Grid ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeServices.map(service => (
                    <div key={service.id} className="group relative rounded-xl border border-amber-200/20 dark:border-amber-500/10 p-5 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-200 flex flex-col h-full overflow-hidden">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => toggleActive(service.id)} className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-emerald-500">
                                <ToggleRight className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mb-4">
                            <Badge variant="secondary" className="bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400 text-xs font-medium rounded-full px-2.5 py-0.5 mb-3">
                                {getCategoryLabel(service.category)}
                            </Badge>
                            <h3 className="text-lg font-semibold text-foreground mb-1 leading-tight">{service.name}</h3>
                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                {service.description}
                            </p>
                        </div>

                        <div className="mt-auto pt-4 border-t flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-0.5">
                                    <Clock className="h-3 w-3" /> {service.duration} min
                                </div>
                                <div className="text-lg font-bold text-foreground">
                                    R$ {service.price}
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={() => handleEdit(service)} className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
                                    <Pencil className="h-4 w-4" />
                                </button>
                                <button onClick={() => deleteService(service.id)} className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-500 transition-all">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add New Placeholder */}
                <button
                    onClick={handleNew}
                    className="group rounded-xl border-2 border-dashed border-amber-500/20 p-5 flex flex-col items-center justify-center gap-3 hover:bg-amber-500/5 hover:border-amber-500/40 transition-all duration-200 min-h-60"
                >
                    <div className="h-11 w-11 rounded-xl bg-card border flex items-center justify-center text-muted-foreground group-hover:text-amber-500 group-hover:scale-105 transition-all shadow-sm">
                        <Plus className="h-5 w-5" />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">Adicionar Novo</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Expanda seu catálogo</p>
                    </div>
                </button>
            </div>

            {/* ── Inactive Services ── */}
            {inactiveServices.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-border" />
                        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Serviços Inativos</h4>
                        <div className="h-px flex-1 bg-border" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 opacity-60">
                        {inactiveServices.map(service => (
                            <div key={service.id} className="bg-card rounded-xl border p-4 flex items-center justify-between">
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-muted-foreground line-through truncate">{service.name}</p>
                                    <p className="text-xs text-muted-foreground">{getCategoryLabel(service.category)}</p>
                                </div>
                                <button onClick={() => toggleActive(service.id)} className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-amber-500 hover:bg-muted transition-all">
                                    <ToggleLeft className="h-5 w-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Category Modal */}
            <BaseModal
                isOpen={isCategoryDialogOpen}
                onClose={() => setIsCategoryDialogOpen(false)}
                title="Categorias"
                description="Organize seus serviços por grupos."
                icon={Plus}
                maxWidth="sm:max-w-md"
                footer={
                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-white/5">
                        <Button variant="ghost" onClick={() => setIsCategoryDialogOpen(false)} className="rounded-xl flex-1 h-12">
                            Fechar
                        </Button>
                    </div>
                }
            >
                <div className="space-y-6">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Nome da nova categoria..."
                            value={newCategoryLabel}
                            onChange={e => setNewCategoryLabel(e.target.value)}
                            className="h-12 bg-stone-950/40 border-white/5 rounded-xl text-sm"
                        />
                        <Button onClick={handleAddCategory} className="btn-gold-solid rounded-xl px-6 h-12">Adicionar</Button>
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                        {categories.map(cat => (
                            <div key={cat.id} className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-2xl group">
                                <span className="text-sm font-medium">{cat.label}</span>
                                <button onClick={() => handleDeleteCategory(cat.id)} className="opacity-0 group-hover:opacity-100 p-2 text-stone-500 hover:text-red-500 transition-all">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </BaseModal>

            {/* Edit/New Service Modal */}
            <BaseModal
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                title={editingService?.id ? "Editar Serviço" : "Novo Serviço"}
                description="Defina os detalhes do seu atendimento."
                icon={Scissors}
                maxWidth="sm:max-w-[500px]"
                footer={
                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-white/5">
                        <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl flex-1 h-12">
                            Cancelar
                        </Button>
                        <Button onClick={handleSave} className="btn-gold-solid rounded-xl flex-1 h-12 font-bold">
                            Salvar Serviço
                        </Button>
                    </div>
                }
            >
                <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Imagem do serviço</Label>
                        <ImageUpload value={editingService?.image || ""} onChange={url => setEditingService(prev => prev ? { ...prev, image: url } : null)} />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Nome do serviço</Label>
                        <Input value={editingService?.name} onChange={e => setEditingService(prev => prev ? { ...prev, name: e.target.value } : null)}
                            className="h-12 bg-stone-950/40 border-white/5 rounded-xl text-sm" placeholder="Ex: Brow Lamination" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Categoria</Label>
                            <select
                                value={editingService?.category}
                                onChange={e => setEditingService(prev => prev ? { ...prev, category: e.target.value } : null)}
                                className="w-full h-12 bg-stone-950/40 border border-white/5 rounded-xl text-sm px-3 focus:ring-2 focus:ring-amber-500/20"
                            >
                                <option value="" disabled className="bg-stone-900">Selecione...</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id} className="bg-stone-900">{cat.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Preço (R$)</Label>
                            <Input type="number" value={editingService?.price} onChange={e => setEditingService(prev => prev ? { ...prev, price: e.target.value } : null)}
                                className="h-12 bg-stone-950/40 border-white/5 rounded-xl text-sm font-bold" placeholder="150" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Duração (minutos)</Label>
                        <div className="flex bg-stone-950/40 border border-white/5 rounded-xl p-1 gap-1">
                            {[30, 45, 60, 90, 120].map(val => (
                                <button
                                    key={val}
                                    onClick={() => setEditingService(prev => prev ? { ...prev, duration: val } : null)}
                                    className={cn(
                                        "flex-1 h-10 rounded-lg text-xs font-bold transition-all",
                                        editingService?.duration === val
                                            ? "bg-brand-primary text-white shadow-lg"
                                            : "text-stone-500 hover:text-stone-300"
                                    )}
                                >
                                    {val}m
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Descrição</Label>
                        <textarea
                            value={editingService?.description}
                            onChange={e => setEditingService(prev => prev ? { ...prev, description: e.target.value } : null)}
                            className="w-full min-h-24 bg-stone-950/40 border border-white/5 rounded-xl px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-amber-500/20 text-stone-300"
                            placeholder="Explique o que o serviço inclui..."
                        />
                    </div>
                </div>
            </BaseModal>
        </div>
    )
}
