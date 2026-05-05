"use client"

import { EditorPlugin, PluginSectionProps, PluginSidebarProps } from "@mandato360/editor"
import { Briefcase, Plus, Trash2, ChevronDown, ChevronUp, Image as ImageIcon, Type, Layers, Upload, Loader2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

function PracticeAreasPreview({ config, device, themeColors }: PluginSectionProps) {
    const items = config.items || []
    const title = config.title || "Áreas de *Atuação*"
    const subtitle = config.subtitle || "Nossa equipe atua de forma estratégica em diversas áreas do direito para proteger seus interesses com excelência."

    return (
        <div className="py-20 px-6 bg-slate-50">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
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

                {/* Cards Grid */}
                <div className={cn(
                    "grid gap-8",
                    device === "mobile" ? "grid-cols-1" : device === "tablet" ? "grid-cols-2" : "grid-cols-3"
                )}>
                    {items.map((item: any, i: number) => (
                        <div
                            key={i}
                            className="group bg-white rounded-(--theme-card-radius) border border-slate-200 hover:border-opacity-30 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
                            style={{ ['--hover-border' as any]: `${themeColors.primary}40` }}
                        >
                            {/* Image Area */}
                            {item.image && item.image.trim() !== "" ? (
                                <div className="h-48 w-full overflow-hidden bg-slate-100 relative">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                                    <div className="absolute bottom-4 left-6 text-white font-bold text-lg tracking-wide">
                                        {item.title}
                                    </div>
                                </div>
                            ) : (
                                <div className="h-3 bg-slate-100" style={{ backgroundColor: themeColors.primary }} />
                            )}

                            {/* Content */}
                            <div className="p-8 flex flex-col flex-1">
                                {(!item.image || item.image.trim() === "") && (
                                    <h4 className="text-xl font-bold text-slate-900 mb-4" style={{ fontFamily: "var(--font-serif, serif)" }}>
                                        {item.title}
                                    </h4>
                                )}
                                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                    {item.description}
                                </p>
                                <div className="mt-auto">
                                    <button
                                        className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 group/btn transition-colors"
                                        style={{ color: themeColors.primary }}
                                    >
                                        Saiba Mais
                                        <span className="transform translate-x-0 group-hover/btn:translate-x-1 transition-transform">→</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {items.length === 0 && (
                    <div className="text-center py-12 text-slate-400 text-sm">
                        Nenhuma área de atuação cadastrada. Adicione pela sidebar →
                    </div>
                )}
            </div>
        </div>
    )
}

function PracticeAreasSidebar({ config, onChange, accentColor = "#10b981", onImageUpload }: PluginSidebarProps) {
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
            title: "Nova Área",
            description: "Descrição da área de atuação e especialidades...",
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
                                    value={config.title || "Áreas de *Atuação*"}
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
                        <Briefcase className={cn(
                            "h-4 w-4 transition-colors duration-200",
                            isConteudoOpen ? "text-current" : "text-muted-foreground/50 group-hover:text-foreground"
                        )} style={isConteudoOpen ? { color: accentColor } : undefined} />
                        <span className={cn(
                            "text-sm font-medium transition-colors duration-200",
                            isConteudoOpen ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                        )}>Áreas</span>
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
                                            <div className="flex-1 text-left min-w-0">
                                                <p className="text-[11px] font-bold text-foreground truncate">{item.title}</p>
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
                                                    <Label className="text-[11px] font-medium text-foreground/70">Nome da Área</Label>
                                                    <Input
                                                        value={item.title}
                                                        onChange={(e) => updateItem(i, { title: e.target.value })}
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

                                                <div className="space-y-2">
                                                    <Label className="text-[11px] font-medium text-foreground/70">Imagem Opcional</Label>
                                                    <Input
                                                        value={item.image || ""}
                                                        onChange={(e) => updateItem(i, { image: e.target.value })}
                                                        className="h-8 text-[11px] border-border/50 bg-background"
                                                        placeholder="https://..."
                                                    />
                                                </div>

                                                <button
                                                    onClick={() => removeItem(i)}
                                                    className="w-full h-8 rounded-lg border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-wider hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Trash2 className="h-3 w-3" /> Remover Área
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
                                <Plus className="h-3.5 w-3.5" /> Adicionar Área
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export const practiceAreasPlugin: EditorPlugin = {
    id: "practice-areas",
    label: "Áreas de Atuação",
    icon: Briefcase,
    previewComponent: PracticeAreasPreview,
    sidebarComponent: PracticeAreasSidebar,
    defaultConfig: {
        title: "Áreas de *Atuação*",
        subtitle: "Nossa equipe atua de forma estratégica em diversas áreas do direito para proteger seus interesses com excelência.",
        items: [
            { id: "1", title: "Direito Civil", description: "Contratos, responsabilidade civil, família e sucessões." },
            { id: "2", title: "Direito Trabalhista", description: "Defesa dos direitos de empregados e consultoria preventiva para empresas." },
            { id: "3", title: "Direito Empresarial", description: "Constituição de empresas, falências, recuperações e planejamento societário." },
        ],
    }
}
