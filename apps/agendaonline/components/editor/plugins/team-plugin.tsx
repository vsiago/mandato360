"use client"

import { EditorPlugin, PluginSectionProps, PluginSidebarProps } from "@mandato360/editor"
import { Users, Plus, Trash2, ChevronDown, ChevronUp, Image as ImageIcon, Type, Upload, Loader2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

function TeamPreview({ config, device, themeColors }: PluginSectionProps) {
    const items = config.items || []
    const title = config.title || "Nossa *Equipe*"
    const subtitle = config.subtitle || "Profissionais altamente qualificadas e dedicadas a realçar sua beleza."

    return (
        <div className="py-20 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
                <div className="mb-16 text-center max-w-3xl mx-auto">
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
                    <p className="text-sm text-slate-600 leading-relaxed" style={{ fontSize: device === "desktop" ? "1.125rem" : "0.95rem" }}>
                        {subtitle}
                    </p>
                </div>

                <div className={cn(
                    "grid gap-10",
                    device === "mobile" ? "grid-cols-1" : device === "tablet" ? "grid-cols-2" : "grid-cols-4"
                )}>
                    {items.map((member: any, i: number) => (
                        <div key={i} className="flex flex-col items-center text-center group">
                            <div className="w-48 h-48 rounded-full overflow-hidden mb-6 border-4 border-slate-50 transition-transform duration-500 group-hover:scale-105 group-hover:shadow-xl bg-slate-100 flex items-center justify-center">
                                {member.image ? (
                                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                ) : (
                                    <Users className="w-12 h-12 text-slate-300" />
                                )}
                            </div>
                            <h4 className="text-lg font-bold text-slate-900 mb-1">{member.name}</h4>
                            <p className="text-sm font-semibold mb-3 tracking-wide" style={{ color: themeColors.primary }}>
                                {member.role}
                            </p>
                            <p className="text-sm text-slate-500 line-clamp-3">
                                {member.bio}
                            </p>
                        </div>
                    ))}
                </div>

                {items.length === 0 && (
                    <div className="text-center py-12 text-slate-400 text-sm">
                        Nenhum membro da equipe cadastrado. Adicione pela sidebar →
                    </div>
                )}
            </div>
        </div>
    )
}

function TeamSidebar({ config, onChange, accentColor = "#10b981", onImageUpload }: PluginSidebarProps) {
    const items = config.items || []
    const [expandedItem, setExpandedItem] = useState<number | null>(null)
    const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)

    const [isCabecalhoOpen, setIsCabecalhoOpen] = useState(false)
    const [isConteudoOpen, setIsConteudoOpen] = useState(false)

    const updateItem = (index: number, updates: any) => {
        const newItems = [...items]
        newItems[index] = { ...newItems[index], ...updates }
        onChange({ ...config, items: newItems })
    }

    const removeItem = (index: number) => {
        const newItems = items.filter((_: any, idx: number) => idx !== index)
        onChange({ ...config, items: newItems })
        if (expandedItem === index) setExpandedItem(null)
    }

    const addItem = () => {
        const newItem = {
            id: crypto.randomUUID(),
            name: "Nome do Profissional",
            role: "Especialidade",
            bio: "Breve resumo profissional...",
            image: "",
        }
        onChange({ ...config, items: [...items, newItem] })
        setExpandedItem(items.length)
    }

    return (
        <div className="flex-1">
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
                                    value={config.title || "Nossa *Equipe*"}
                                    onChange={(e) => onChange({ ...config, title: e.target.value })}
                                    className="h-8 text-[11px] border-border/50 bg-background"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[11px] font-medium text-foreground/70">Subtítulo</Label>
                                <textarea
                                    value={config.subtitle || ""}
                                    onChange={(e) => onChange({ ...config, subtitle: e.target.value })}
                                    className="w-full bg-background border border-border/50 rounded-lg px-3 py-2 text-[11px] text-foreground outline-none resize-none min-h-[50px]"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="border-b border-border">
                <button
                    onClick={() => setIsConteudoOpen(!isConteudoOpen)}
                    className={cn(
                        "group flex w-full items-center justify-between p-4 text-left transition-all duration-200 hover:bg-muted",
                        isConteudoOpen && "bg-muted/50"
                    )}
                >
                    <div className="flex items-center gap-3">
                        <Users className={cn(
                            "h-4 w-4 transition-colors duration-200",
                            isConteudoOpen ? "text-current" : "text-muted-foreground/50 group-hover:text-foreground"
                        )} style={isConteudoOpen ? { color: accentColor } : undefined} />
                        <span className={cn(
                            "text-sm font-medium transition-colors duration-200",
                            isConteudoOpen ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                        )}>Membros</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span 
                            className="flex items-center justify-center text-[10px] font-bold px-2 h-5 min-w-[1.25rem] rounded-full border shadow-sm transition-colors"
                            style={{ backgroundColor: `${accentColor}15`, borderColor: `${accentColor}30`, color: accentColor }}
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
                                const isExpanded = expandedItem === i
                                return (
                                    <div key={item.id || i} className="rounded-xl border border-border bg-muted/15 overflow-hidden">
                                        <button
                                            onClick={() => setExpandedItem(isExpanded ? null : i)}
                                            className="w-full flex items-center gap-3 p-3 hover:bg-muted/30 transition-colors"
                                        >
                                            <div className="h-8 w-8 rounded-full bg-muted/30 flex items-center justify-center shrink-0 overflow-hidden">
                                                {item.image ? (
                                                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <Users className="h-3.5 w-3.5 text-muted-foreground/40" />
                                                )}
                                            </div>
                                            <div className="flex-1 text-left min-w-0">
                                                <p className="text-[11px] font-bold text-foreground truncate">{item.name}</p>
                                                <p className="text-[9px] text-muted-foreground/50">{item.role}</p>
                                            </div>
                                            {isExpanded ? (
                                                <ChevronUp className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
                                            ) : (
                                                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
                                            )}
                                        </button>

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
                                                    <Label className="text-[11px] font-medium text-foreground/70">Cargo / Especialidade</Label>
                                                    <Input
                                                        value={item.role}
                                                        onChange={(e) => updateItem(i, { role: e.target.value })}
                                                        className="h-8 text-[11px] border-border/50 bg-background"
                                                    />
                                                </div>

                                                <div className="space-y-1">
                                                    <Label className="text-[11px] font-medium text-foreground/70">Biografia</Label>
                                                    <textarea
                                                        value={item.bio || ""}
                                                        onChange={(e) => updateItem(i, { bio: e.target.value })}
                                                        className="w-full bg-background border border-border/50 rounded-lg px-3 py-2 text-[11px] text-foreground outline-none resize-none min-h-[50px]"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-[11px] font-medium text-foreground/70">Foto</Label>
                                                    {item.image ? (
                                                        <div className="relative aspect-square w-24 rounded-full overflow-hidden border border-border group/img mx-auto">
                                                            <img src={item.image} alt="" className="w-full h-full object-cover" />
                                                            <button
                                                                onClick={() => updateItem(i, { image: "" })}
                                                                className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                                                            >
                                                                <X className="h-5 w-5" />
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
                                                    <Trash2 className="h-3 w-3" /> Remover
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
                                <Plus className="h-3.5 w-3.5" /> Adicionar Membro
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export const teamPlugin: EditorPlugin = {
    id: "team",
    label: "Nossa Equipe",
    icon: Users,
    previewComponent: TeamPreview,
    sidebarComponent: TeamSidebar,
    defaultConfig: {
        title: "Nossa *Equipe*",
        subtitle: "Profissionais altamente qualificadas e dedicadas a realçar sua beleza.",
        items: [
            { id: "1", name: "Carlos Mendes", role: "Cabeleireiro Sênior", bio: "Especialista em colorimetria e cortes modernos com mais de 10 anos de experiência." },
            { id: "2", name: "Ana Silva", role: "Nail Designer", bio: "Especialista em unhas em gel, fibra de vidro e nail art detalhada." },
        ],
    }
}
