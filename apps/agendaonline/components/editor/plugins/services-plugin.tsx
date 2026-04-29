"use client"

import { EditorPlugin, PluginSectionProps, PluginSidebarProps } from "@mandato360/editor"
import { Scissors, Plus, Trash2, ChevronDown, ChevronUp, Image as ImageIcon, Type, Layers, Upload, Loader2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

/* ═══════════════════════════════════════════
   PREVIEW — Layout idêntico ao /[slug] (tenant-client.tsx)
   ═══════════════════════════════════════════ */
function ServicesPreview({ config, device, themeColors }: PluginSectionProps) {
    const items = config.items || []
    const cats = config.categories || []
    const title = config.title || "Nossa Expertise"
    const subtitle = config.subtitle || "Procedimentos personalizados para valorizar a arquitetura do seu rosto e realçar a sua beleza natural."

    // Group services by category
    const filteredCategories = cats.length > 0 ? cats : [{ id: "all", label: "Todos" }]

    return (
        <div className="py-16 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="mb-12 text-center max-w-3xl mx-auto">
                    <h2
                        className="text-2xl font-bold tracking-tight text-slate-900 mb-4"
                        style={{
                            fontSize: device === "desktop" ? "2.5rem" : device === "tablet" ? "1.75rem" : "1.5rem",
                            fontFamily: "var(--font-serif, serif)",
                        }}
                    >
                        {title.includes("*") ? (
                            <>
                                {title.split("*")[0]}
                                <span className="italic" style={{ color: themeColors.primary }}>{title.split("*")[1]}</span>
                                {title.split("*")[2] || ""}
                            </>
                        ) : title}
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed" style={{ fontSize: device === "desktop" ? "1rem" : "0.85rem" }}>
                        {subtitle}
                    </p>
                </div>

                {/* Category Filter Pills */}
                {cats.length > 0 && (
                    <div className="flex justify-center flex-wrap gap-3 mb-12">
                        <div
                            className="px-5 py-2 rounded-(--theme-btn-radius) text-xs font-bold tracking-wide shadow-sm"
                            style={{ backgroundColor: themeColors.primary, color: '#fff' }}
                        >
                            Todos
                        </div>
                        {cats.map((cat: any) => (
                            <div
                                key={cat.id}
                                className="px-5 py-2 rounded-(--theme-btn-radius) text-xs font-bold tracking-wide bg-slate-100 text-slate-500"
                            >
                                {cat.label}
                            </div>
                        ))}
                    </div>
                )}

                {/* Services grouped by category */}
                <div className="flex flex-col gap-10">
                    {filteredCategories.map((category: any) => {
                        const categoryServices = cats.length > 0
                            ? items.filter((s: any) => s.categoryId === category.id)
                            : items

                        if (categoryServices.length === 0 && cats.length > 0) return null

                        return (
                            <div key={category.id} className="flex flex-col mb-6 last:mb-0">
                                {/* Category Separator */}
                                {cats.length > 0 && (
                                    <div className="flex items-center gap-4 mb-8 w-full">
                                        <div className="h-px bg-slate-200 flex-1"></div>
                                        <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase">{category.label}</h3>
                                        <div className="h-px bg-slate-200 flex-1"></div>
                                    </div>
                                )}

                                {/* Service Cards Grid */}
                                <div className={cn(
                                    "grid gap-6",
                                    device === "mobile" ? "grid-cols-1" : device === "tablet" ? "grid-cols-2" : "grid-cols-3"
                                )}>
                                    {categoryServices.map((service: any, i: number) => (
                                        <div
                                            key={i}
                                            className="group bg-white rounded-(--theme-card-radius) border border-slate-100 hover:border-opacity-20 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden shadow-sm"
                                            style={{ ['--hover-border' as any]: `${themeColors.primary}33` }}
                                        >
                                            {/* Image Area */}
                                            <div className="relative h-44 w-full overflow-hidden bg-slate-100 flex items-center justify-center">
                                                {service.image && service.image.trim() !== "" ? (
                                                    <img
                                                        src={service.image}
                                                        alt={service.name}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <ImageIcon className="h-10 w-10 text-slate-300" />
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            </div>

                                            {/* Content */}
                                            <div className="p-6 flex flex-col flex-1">
                                                <h4 className="text-base font-bold text-slate-900 mb-2">{service.name}</h4>
                                                <p className="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-2">{service.description}</p>
                                                <div className="mt-auto flex items-center gap-3">
                                                    <button
                                                        className="flex-1 flex items-center justify-center text-white font-bold rounded-(--theme-btn-radius) h-14 text-xs transition-all shadow-sm"
                                                        style={{ backgroundColor: themeColors.primary }}
                                                    >
                                                        Agendar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}

                    {items.length === 0 && (
                        <div className="text-center py-12 text-slate-400 text-sm">
                            Nenhum serviço cadastrado. Adicione pela sidebar →
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

/* ═══════════════════════════════════════════
   SIDEBAR — Edição completa com categorias
   ═══════════════════════════════════════════ */
function ServicesSidebar({ config, onChange, accentColor = "#10b981", onImageUpload }: PluginSidebarProps) {
    const items = config.items || []
    const cats = config.categories || []
    const [expandedService, setExpandedService] = useState<number | null>(null)
    const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)

    const [isCabecalhoOpen, setIsCabecalhoOpen] = useState(false)
    const [isCategoriasOpen, setIsCategoriasOpen] = useState(false)
    const [isConteudoOpen, setIsConteudoOpen] = useState(false)

    const updateItem = (index: number, updates: any) => {
        const newItems = [...items]
        newItems[index] = { ...newItems[index], ...updates }
        onChange({ ...config, items: newItems })
    }

    const removeItem = (index: number) => {
        const newItems = items.filter((_: any, idx: number) => idx !== index)
        onChange({ ...config, items: newItems })
        if (expandedService === index) setExpandedService(null)
    }

    const addItem = (categoryId?: string) => {
        const newItem = {
            id: crypto.randomUUID(),
            name: "Novo Serviço",
            description: "Descrição do serviço...",
            price: 0,
            duration: 60,
            image: "",
            categoryId: categoryId || cats[0]?.id || "",
            isActive: true,
        }
        onChange({ ...config, items: [...items, newItem] })
        setExpandedService(items.length)
    }

    const updateCategory = (index: number, updates: any) => {
        const newCats = [...cats]
        newCats[index] = { ...newCats[index], ...updates }
        onChange({ ...config, categories: newCats })
    }

    const removeCategory = (index: number) => {
        const catId = cats[index].id
        const newCats = cats.filter((_: any, idx: number) => idx !== index)
        // Also remove services in this category
        const newItems = items.filter((item: any) => item.categoryId !== catId)
        onChange({ ...config, categories: newCats, items: newItems })
    }

    const addCategory = () => {
        const newCat = { id: crypto.randomUUID(), label: "Nova Categoria", slug: "nova-categoria" }
        onChange({ ...config, categories: [...cats, newCat] })
    }

    return (
        <div className="flex-1">
            {/* Cabeçalho Accordion */}
            <div className="border-b border-border">
                <button
                    onClick={() => setIsCabecalhoOpen(!isCabecalhoOpen)}
                    className={cn(
                        "group flex w-full items-center justify-between p-4 text-left transition-all duration-200 hover:bg-muted",
                        isCabecalhoOpen && "bg-muted/50"
                    )}
                >
                    <div className="flex items-center gap-3">
                        <Type className={cn(
                            "h-4 w-4 transition-colors duration-200",
                            isCabecalhoOpen ? "text-current" : "text-muted-foreground/50 group-hover:text-foreground"
                        )} style={isCabecalhoOpen ? { color: accentColor } : undefined} />
                        <span className={cn(
                            "text-sm font-medium transition-colors duration-200",
                            isCabecalhoOpen ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                        )}>Cabeçalho</span>
                    </div>
                    <ChevronDown
                        className={cn(
                            "h-3.5 w-3.5 text-muted-foreground/50 transition-transform duration-300",
                            isCabecalhoOpen && "rotate-180 text-muted-foreground"
                        )}
                    />
                </button>
                {isCabecalhoOpen && (
                    <div className="space-y-4 px-4 pb-4 pt-2">
                        <div className="rounded-xl border border-border bg-muted/15 p-3.5 space-y-4">
                            <div className="space-y-1">
                                <Label className="text-[11px] font-medium text-foreground/70">Título da Seção</Label>
                                <Input
                                    value={config.title || "Nossa Expertise"}
                                    onChange={(e) => onChange({ ...config, title: e.target.value })}
                                    className="h-8 text-[11px] border-border/50 bg-background"
                                    placeholder="Nossa *Expertise*"
                                />
                                <p className="text-[9px] text-muted-foreground/40">Use *texto* para itálico colorido</p>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[11px] font-medium text-foreground/70">Subtítulo</Label>
                                <textarea
                                    value={config.subtitle || ""}
                                    onChange={(e) => onChange({ ...config, subtitle: e.target.value })}
                                    className="w-full bg-background border border-border/50 rounded-lg px-3 py-2 text-[11px] text-foreground outline-none resize-none min-h-[50px]"
                                    placeholder="Descrição da seção de serviços..."
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Categorias Accordion */}
            <div className="border-b border-border">
                <button
                    onClick={() => setIsCategoriasOpen(!isCategoriasOpen)}
                    className={cn(
                        "group flex w-full items-center justify-between p-4 text-left transition-all duration-200 hover:bg-muted",
                        isCategoriasOpen && "bg-muted/50"
                    )}
                >
                    <div className="flex items-center gap-3">
                        <Layers className={cn(
                            "h-4 w-4 transition-colors duration-200",
                            isCategoriasOpen ? "text-current" : "text-muted-foreground/50 group-hover:text-foreground"
                        )} style={isCategoriasOpen ? { color: accentColor } : undefined} />
                        <span className={cn(
                            "text-sm font-medium transition-colors duration-200",
                            isCategoriasOpen ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                        )}>Categorias</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span 
                            className="flex items-center justify-center text-[10px] font-bold px-2 h-5 min-w-[1.25rem] rounded-full border shadow-sm transition-colors"
                            style={{ 
                                backgroundColor: `${accentColor}15`, 
                                borderColor: `${accentColor}30`,
                                color: accentColor 
                            }}
                        >
                            {cats.length}
                        </span>
                        <ChevronDown
                            className={cn(
                                "h-3.5 w-3.5 text-muted-foreground/50 transition-transform duration-300",
                                isCategoriasOpen && "rotate-180 text-muted-foreground"
                            )}
                        />
                    </div>
                </button>
                {isCategoriasOpen && (
                    <div className="space-y-4 px-4 pb-4 pt-2">
                        <div className="space-y-2">
                            {cats.map((cat: any, i: number) => (
                                <div key={cat.id || i} className="flex items-center gap-2">
                                    <Input
                                        value={cat.label}
                                        onChange={(e) => updateCategory(i, { label: e.target.value })}
                                        className="h-8 text-[11px] border-border/50 bg-background flex-1"
                                    />
                                    <button
                                        onClick={() => removeCategory(i)}
                                        className="h-8 w-8 flex items-center justify-center text-muted-foreground/30 hover:text-red-500 rounded transition-colors shrink-0"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={addCategory}
                                className="w-full h-8 rounded-lg border border-dashed border-border text-[10px] uppercase font-bold tracking-widest text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all flex items-center justify-center gap-2"
                            >
                                <Plus className="h-3 w-3" /> Categoria
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Conteúdo Accordion */}
            <div className="border-b border-border">
                <button
                    onClick={() => setIsConteudoOpen(!isConteudoOpen)}
                    className={cn(
                        "group flex w-full items-center justify-between p-4 text-left transition-all duration-200 hover:bg-muted",
                        isConteudoOpen && "bg-muted/50"
                    )}
                >
                    <div className="flex items-center gap-3">
                        <Scissors className={cn(
                            "h-4 w-4 transition-colors duration-200",
                            isConteudoOpen ? "text-current" : "text-muted-foreground/50 group-hover:text-foreground"
                        )} style={isConteudoOpen ? { color: accentColor } : undefined} />
                        <span className={cn(
                            "text-sm font-medium transition-colors duration-200",
                            isConteudoOpen ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                        )}>Conteúdo</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span 
                            className="flex items-center justify-center text-[10px] font-bold px-2 h-5 min-w-[1.25rem] rounded-full border shadow-sm transition-colors"
                            style={{ 
                                backgroundColor: `${accentColor}15`, 
                                borderColor: `${accentColor}30`,
                                color: accentColor 
                            }}
                        >
                            {items.length}
                        </span>
                        <ChevronDown
                            className={cn(
                                "h-3.5 w-3.5 text-muted-foreground/50 transition-transform duration-300",
                                isConteudoOpen && "rotate-180 text-muted-foreground"
                            )}
                        />
                    </div>
                </button>
                {isConteudoOpen && (
                    <div className="space-y-4 px-4 pb-4 pt-2">
                        <div className="space-y-2">
                            {items.map((item: any, i: number) => {
                                const isExpanded = expandedService === i
                                const categoryLabel = cats.find((c: any) => c.id === item.categoryId)?.label || "Sem categoria"

                                return (
                                    <div key={item.id || i} className="rounded-xl border border-border bg-muted/15 overflow-hidden">
                                        {/* Collapsed Header */}
                                        <button
                                            onClick={() => setExpandedService(isExpanded ? null : i)}
                                            className="w-full flex items-center gap-3 p-3 hover:bg-muted/30 transition-colors"
                                        >
                                            <div className="h-8 w-8 rounded-lg bg-muted/30 flex items-center justify-center shrink-0 overflow-hidden">
                                                {item.image ? (
                                                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <Scissors className="h-3.5 w-3.5 text-muted-foreground/40" />
                                                )}
                                            </div>
                                            <div className="flex-1 text-left min-w-0">
                                                <p className="text-[11px] font-bold text-foreground truncate">{item.name}</p>
                                                <p className="text-[9px] text-muted-foreground/50">{categoryLabel} · R$ {item.price || 0}</p>
                                            </div>
                                            {isExpanded ? (
                                                <ChevronUp className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
                                            ) : (
                                                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
                                            )}
                                        </button>

                                        {/* Expanded Content */}
                                        {isExpanded && (
                                            <div className="border-t border-border p-3.5 space-y-3">
                                                <div className="space-y-1">
                                                    <Label className="text-[11px] font-medium text-foreground/70">Nome</Label>
                                                    <Input
                                                        value={item.name}
                                                        onChange={(e) => updateItem(i, { name: e.target.value })}
                                                        className="h-8 text-[11px] border-border/50 bg-background"
                                                    />
                                                </div>

                                                <div className="space-y-1">
                                                    <Label className="text-[11px] font-medium text-foreground/70">Descrição</Label>
                                                    <textarea
                                                        value={item.description || ""}
                                                        onChange={(e) => updateItem(i, { description: e.target.value })}
                                                        className="w-full bg-background border border-border/50 rounded-lg px-3 py-2 text-[11px] text-foreground outline-none resize-none min-h-[50px]"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="space-y-1">
                                                        <Label className="text-[11px] font-medium text-foreground/70">Preço (R$)</Label>
                                                        <Input
                                                            type="number"
                                                            value={item.price || 0}
                                                            onChange={(e) => updateItem(i, { price: parseFloat(e.target.value) || 0 })}
                                                            className="h-8 text-[11px] border-border/50 bg-background"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label className="text-[11px] font-medium text-foreground/70">Duração (min)</Label>
                                                        <Input
                                                            type="number"
                                                            value={item.duration || 60}
                                                            onChange={(e) => updateItem(i, { duration: parseInt(e.target.value) || 60 })}
                                                            className="h-8 text-[11px] border-border/50 bg-background"
                                                        />
                                                    </div>
                                                </div>

                                                {cats.length > 0 && (
                                                    <div className="space-y-1">
                                                        <Label className="text-[11px] font-medium text-foreground/70">Categoria</Label>
                                                        <select
                                                            value={item.categoryId || ""}
                                                            onChange={(e) => updateItem(i, { categoryId: e.target.value })}
                                                            className="w-full h-8 rounded-lg border border-border/50 bg-background text-[11px] px-3 outline-none text-foreground"
                                                        >
                                                            <option value="">Sem categoria</option>
                                                            {cats.map((cat: any) => (
                                                                <option key={cat.id} value={cat.id}>{cat.label}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                )}

                                                <div className="space-y-2">
                                                    <Label className="text-[11px] font-medium text-foreground/70">Imagem do Serviço</Label>
                                                    {item.image ? (
                                                        <div className="relative aspect-video rounded-lg overflow-hidden border border-border group/img">
                                                            <img src={item.image} alt="" className="w-full h-full object-cover" />
                                                            <button
                                                                onClick={() => updateItem(i, { image: "" })}
                                                                className="absolute top-2 right-2 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <label className={cn(
                                                            "flex flex-col items-center justify-center gap-2 py-6 rounded-xl border-2 border-dashed border-border/50 hover:bg-muted/30 cursor-pointer transition-colors",
                                                            uploadingIndex === i && "pointer-events-none opacity-50"
                                                        )}>
                                                            {uploadingIndex === i ? (
                                                                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground/40" />
                                                            ) : (
                                                                <Upload className="h-5 w-5 text-muted-foreground/40" />
                                                            )}
                                                            <span className="text-[10px] text-muted-foreground/60">
                                                                {uploadingIndex === i ? "Enviando..." : "Upload de foto"}
                                                            </span>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="hidden"
                                                                onChange={async (e) => {
                                                                    const file = e.target.files?.[0]
                                                                    if (!file || !onImageUpload) return
                                                                    setUploadingIndex(i)
                                                                    try {
                                                                        const url = await onImageUpload(file)
                                                                        updateItem(i, { image: url })
                                                                    } catch (err) {
                                                                        console.error("Upload failed", err)
                                                                    } finally {
                                                                        setUploadingIndex(null)
                                                                    }
                                                                }}
                                                            />
                                                        </label>
                                                    )}
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-px bg-border/30 flex-1" />
                                                        <span className="text-[9px] text-muted-foreground/30 uppercase font-bold">ou URL</span>
                                                        <div className="h-px bg-border/30 flex-1" />
                                                    </div>
                                                    <Input
                                                        value={item.image || ""}
                                                        onChange={(e) => updateItem(i, { image: e.target.value })}
                                                        className="h-8 text-[11px] border-border/50 bg-background font-mono"
                                                        placeholder="https://..."
                                                    />
                                                </div>

                                                <button
                                                    onClick={() => removeItem(i)}
                                                    className="w-full h-8 rounded-lg border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-wider hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Trash2 className="h-3 w-3" /> Remover Serviço
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}

                            <button
                                onClick={() => addItem()}
                                className="w-full h-9 rounded-lg border border-dashed border-border text-[10px] uppercase font-bold tracking-widest text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all flex items-center justify-center gap-2"
                            >
                                <Plus className="h-3.5 w-3.5" /> Adicionar Serviço
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export const servicesPlugin: EditorPlugin = {
    id: "services",
    label: "Serviços",
    icon: Scissors,
    previewComponent: ServicesPreview,
    sidebarComponent: ServicesSidebar,
    defaultConfig: {
        title: "Nossa *Expertise*",
        subtitle: "Procedimentos personalizados para valorizar a arquitetura do seu rosto e realçar a sua beleza natural.",
        items: [],
        categories: [],
    }
}
