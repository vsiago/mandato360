"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Clock, Filter, Search, LayoutGrid, List, Scissors, Scale, ExternalLink } from "lucide-react"
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
    tenantId,
    tenantSegmento
}: {
    initialServices: Service[],
    initialCategories: Category[],
    tenantId: string,
    tenantSegmento?: string
}) {
    const isAdvocacia = tenantSegmento === "advocacia"
    const FallbackIcon = isAdvocacia ? Scale : Scissors
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
        <div className="flex-1 flex flex-col space-y-4 lg:space-y-6 animate-in fade-in duration-500">

            {/* ── Header ── */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6 mb-1 lg:mb-2 lg:px-0">
                <div className="flex-1">
                    <h2 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight flex items-center gap-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                        Catálogo de Serviços
                    </h2>
                    <p className="text-xs lg:text-sm text-muted-foreground mt-0.5 lg:mt-1">
                        Gerencie as especialidades e valores do seu negócio.
                    </p>
                </div>
                
                <div className="flex flex-row w-full lg:w-auto items-center gap-2 lg:gap-3 mt-1 lg:mt-0">
                    <Button 
                        variant="outline"
                        onClick={() => setIsCategoryDialogOpen(true)}
                        className="flex-1 lg:flex-none text-stone-500 dark:text-stone-400 border-stone-200 dark:border-white/5 bg-white dark:bg-stone-900/40 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-xl px-4 lg:px-6 h-10 lg:h-12 font-bold flex items-center justify-center gap-2 transition-all text-[11px] lg:text-sm shadow-sm"
                    >
                        Categorias
                    </Button>
                    <Button 
                        onClick={handleNew}
                        className="flex-1 lg:flex-none text-white rounded-xl px-4 lg:px-6 h-10 lg:h-12 font-bold flex items-center justify-center gap-2 transition-all bg-brand-gold text-[11px] lg:text-sm shadow-xl shadow-brand-secondary/20"
                    >
                        <Plus className="h-4 w-4 lg:h-5 lg:w-5" /> Novo Serviço
                    </Button>
                </div>
            </div>

            {/* ── Search & Filter ── */}
            <div className="relative group px-0 lg:px-0">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-stone-500 group-focus-within:text-brand-primary transition-colors" />
                </div>
                <Input
                    placeholder="Buscar serviço por nome ou categoria..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white dark:bg-stone-900/40 backdrop-blur-md border-stone-200 dark:border-white/[0.03] text-stone-900 dark:text-white rounded-2xl pl-12 h-12 lg:h-14 text-sm lg:text-base focus-visible:ring-brand-primary/20 transition-all shadow-lg"
                />
            </div>

            {/* ── Services Grid ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {activeServices.map(service => (
                    <div key={service.id} className="group flex flex-col bg-white dark:bg-stone-900/40 backdrop-blur-md border border-stone-200 dark:border-white/[0.03] rounded-2xl overflow-hidden hover:bg-stone-50 dark:hover:bg-stone-900/60 transition-all shadow-xl">
                        {/* Service Image Header */}
                        <div className="relative h-40 lg:h-48 w-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                            {service.image ? (
                                <img src={service.image} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-900">
                                    <FallbackIcon className="h-10 w-10 text-stone-300 dark:text-stone-700" />
                                </div>
                            )}
                            <div className="absolute top-3 left-3">
                                <Badge className="bg-brand-primary/90 text-white border-0 rounded-lg px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-lg">
                                    {getCategoryLabel(service.category)}
                                </Badge>
                            </div>
                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => toggleActive(service.id)} className="h-8 w-8 rounded-lg bg-stone-950/80 backdrop-blur-md flex items-center justify-center text-emerald-500 border border-white/5 hover:scale-110 transition-all">
                                    <ToggleRight className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Service Body */}
                        <div className="p-5 flex flex-col flex-1">
                            <h3 className="text-lg font-bold text-stone-900 dark:text-foreground mb-1 leading-tight group-hover:text-brand-primary transition-colors">{service.name}</h3>
                            <p className="text-xs text-stone-500 dark:text-muted-foreground line-clamp-2 leading-relaxed mb-4 flex-1">
                                {service.description || "Nenhuma descrição fornecida."}
                            </p>

                            <div className="flex items-end justify-between pt-4 border-t border-stone-100 dark:border-white/5">
                                <div>
                                    {!isAdvocacia && (
                                        <div className="flex items-center gap-1.5 text-[10px] font-black text-stone-500 uppercase tracking-widest mb-1">
                                            <Clock className="h-3 w-3" /> {service.duration} MIN
                                        </div>
                                    )}
                                    <div className="text-xl font-black text-brand-primary tracking-tight">
                                        R$ {service.price}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => handleEdit(service)} className="h-10 w-10 rounded-xl flex items-center justify-center text-stone-500 dark:text-stone-400 bg-stone-50 dark:bg-white/[0.03] border border-stone-200 dark:border-white/5 hover:bg-stone-100 dark:hover:bg-white/[0.08] hover:text-stone-900 dark:hover:text-white transition-all shadow-sm">
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                    <button onClick={() => deleteService(service.id)} className="h-10 w-10 rounded-xl flex items-center justify-center text-stone-500 dark:text-stone-400 bg-stone-50 dark:bg-white/[0.03] border border-stone-200 dark:border-white/5 hover:bg-red-500/10 hover:text-red-500 transition-all shadow-sm">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add New Slot */}
                <button
                    onClick={handleNew}
                    className="group min-h-[300px] lg:min-h-full rounded-2xl border-2 border-dashed border-stone-200 dark:border-white/5 bg-stone-50 dark:bg-stone-900/20 flex flex-col items-center justify-center gap-4 hover:bg-brand-primary/5 hover:border-brand-primary/20 transition-all shadow-inner"
                >
                    <div className="h-14 w-14 rounded-2xl bg-white dark:bg-white/[0.03] border border-stone-200 dark:border-white/5 flex items-center justify-center text-stone-400 dark:text-stone-500 group-hover:text-brand-primary group-hover:scale-110 transition-all shadow-xl">
                        <Plus className="h-6 w-6" />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-bold text-stone-500 dark:text-stone-400 group-hover:text-stone-900 dark:group-hover:text-foreground transition-colors uppercase tracking-widest">Novo Serviço</p>
                        <p className="text-[10px] text-stone-400 dark:text-stone-600 mt-1 max-w-[140px]">Cadastre uma nova especialidade</p>
                    </div>
                </button>
            </div>

            {/* ── Inactive Services ── */}
            {inactiveServices.length > 0 && (
                <div className="space-y-4 pt-4 lg:pt-8">
                    <div className="flex items-center gap-4">
                        <h4 className="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.2em] whitespace-nowrap">SERVIÇOS INATIVOS</h4>
                        <div className="h-px w-full bg-stone-200 dark:bg-white/[0.03]" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 opacity-60">
                        {inactiveServices.map(service => (
                            <div key={service.id} className="bg-white dark:bg-stone-900/40 border border-stone-100 dark:border-white/5 rounded-xl p-4 flex items-center justify-between hover:bg-stone-50 dark:hover:bg-stone-900/60 transition-all group shadow-sm">
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-stone-500 dark:text-stone-400 line-through truncate">{service.name}</p>
                                    <p className="text-[10px] text-stone-400 dark:text-stone-600 uppercase tracking-widest">{getCategoryLabel(service.category)}</p>
                                </div>
                                <button onClick={() => toggleActive(service.id)} className="h-8 w-8 rounded-lg flex items-center justify-center text-stone-400 dark:text-stone-500 hover:text-emerald-500 hover:bg-emerald-500/10 transition-all">
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
                title="Categorias de Serviços"
                icon={LayoutGrid}
                footer={
                    <div className="flex gap-2 w-full">
                        <Input
                            placeholder="Nova categoria..."
                            value={newCategoryLabel}
                            onChange={(e) => setNewCategoryLabel(e.target.value)}
                            className="bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-white/5 rounded-xl h-11 text-sm text-stone-900 dark:text-white"
                        />
                        <Button onClick={handleAddCategory} className="bg-brand-gold text-white rounded-xl h-11 font-black uppercase tracking-widest text-[10px] px-6 shadow-lg shadow-brand-secondary/20">
                            Adicionar
                        </Button>
                    </div>
                }
            >
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                    {categories.map(cat => (
                        <div key={cat.id} className="flex items-center justify-between p-4 rounded-xl bg-stone-50 dark:bg-white/[0.02] border border-stone-100 dark:border-white/5 group hover:bg-stone-100 dark:hover:bg-white/[0.04] transition-all">
                            <span className="text-sm font-bold text-stone-700 dark:text-stone-300">{cat.label}</span>
                            <button onClick={() => handleDeleteCategory(cat.id)} className="h-8 w-8 rounded-lg flex items-center justify-center text-stone-400 dark:text-stone-600 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                    {categories.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-xs text-stone-500 font-medium italic">Nenhuma categoria cadastrada.</p>
                        </div>
                    )}
                </div>
            </BaseModal>

            {/* Service Modal */}
            <BaseModal
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                title={editingService?.id ? "Editar Serviço" : "Novo Serviço"}
                icon={FallbackIcon}
                footer={
                    <div className="flex gap-3 w-full">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1 h-12 rounded-xl border-stone-200 dark:border-white/5 text-stone-500 hover:bg-stone-100 dark:hover:bg-white/5 font-bold">
                            Cancelar
                        </Button>
                        <Button onClick={handleSave} className="bg-brand-gold text-white rounded-xl flex-1 h-12 font-black uppercase tracking-widest text-xs shadow-xl shadow-brand-secondary/20">
                            Salvar Serviço
                        </Button>
                    </div>
                }
            >
                <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar pb-2">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-stone-500">Imagem do Serviço</Label>
                        <ImageUpload value={editingService?.image || ""} onChange={url => setEditingService(prev => prev ? { ...prev, image: url } : null)} />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-stone-500">Nome do Serviço</Label>
                        <Input value={editingService?.name} onChange={e => setEditingService(prev => prev ? { ...prev, name: e.target.value } : null)}
                            className="h-12 bg-white dark:bg-stone-950/40 border-stone-200 dark:border-white/5 rounded-xl text-sm font-bold text-stone-900 dark:text-stone-200 shadow-sm" placeholder="Ex: Consulta Jurídica" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-stone-500">Categoria</Label>
                            <select
                                value={editingService?.category}
                                onChange={e => setEditingService(prev => prev ? { ...prev, category: e.target.value } : null)}
                                className="w-full h-12 bg-white dark:bg-stone-950/40 border border-stone-200 dark:border-white/5 rounded-xl text-sm px-3 focus:ring-2 focus:ring-brand-primary/20 outline-none font-bold text-stone-700 dark:text-stone-300 shadow-sm"
                            >
                                <option value="" disabled className="bg-stone-900">Selecione...</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id} className="bg-stone-900">{cat.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-stone-500">Valor (R$)</Label>
                            <Input type="number" value={editingService?.price} onChange={e => setEditingService(prev => prev ? { ...prev, price: e.target.value } : null)}
                                className="h-12 bg-white dark:bg-stone-950/40 border-stone-200 dark:border-white/5 rounded-xl text-sm font-black text-brand-primary shadow-sm" placeholder="0.00" />
                        </div>
                    </div>
                    {!isAdvocacia && (
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-stone-500">Duração do Atendimento</Label>
                            <div className="flex bg-stone-50 dark:bg-stone-950/40 border border-stone-200 dark:border-white/5 rounded-xl p-1 gap-1">
                                {[30, 45, 60, 90, 120].map(val => (
                                    <button
                                        key={val}
                                        onClick={() => setEditingService(prev => prev ? { ...prev, duration: val } : null)}
                                        className={cn(
                                            "flex-1 h-10 rounded-lg text-[10px] font-black transition-all",
                                            editingService?.duration === val
                                                ? "bg-brand-primary text-white shadow-lg"
                                                : "text-stone-500 dark:text-stone-500 hover:text-stone-900 dark:hover:text-stone-300 hover:bg-white dark:hover:bg-white/5"
                                        )}
                                    >
                                        {val}M
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-stone-500">Descrição Detalhada</Label>
                        <textarea
                            value={editingService?.description}
                            onChange={e => setEditingService(prev => prev ? { ...prev, description: e.target.value } : null)}
                            className="w-full min-h-24 bg-white dark:bg-stone-950/40 border border-stone-200 dark:border-white/5 rounded-xl px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-brand-primary/20 text-stone-900 dark:text-stone-300 outline-none font-medium leading-relaxed shadow-sm"
                            placeholder="Descreva o que está incluído neste serviço..."
                        />
                    </div>
                </div>
            </BaseModal>
        </div>
    )
}
