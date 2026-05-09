"use client"

import { EditorPlugin, PluginSectionProps, PluginSidebarProps } from "@mandato360/editor"
import { Calendar, ChevronDown, Type } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { SchedulingSection } from "@/components/scheduling-section"

/* ═══════════════════════════════════════════
   PREVIEW — Simulação da Seção de Agendamento
   ═══════════════════════════════════════════ */
function SchedulingPreview({ config, device, themeColors }: PluginSectionProps) {
    const title = config.title || "Agenda *Online*"
    const subtitle = config.subtitle || "Exclusividade e Precisão em cada detalhe"

    return (
        <SchedulingSection
            tenantId="preview"
            whatsappNumber="000000000"
            services={[]}
            businessHours={null}
            config={{ title, subtitle }}
            themeColors={themeColors}
        />
    )
}

/* ═══════════════════════════════════════════
   SIDEBAR — Edição da seção
   ═══════════════════════════════════════════ */
function SchedulingSidebar({ config, onChange, accentColor = "#10b981" }: PluginSidebarProps) {
    const [isCabecalhoOpen, setIsCabecalhoOpen] = useState(false)

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
                                    value={config.title || "Agenda *Online*"}
                                    onChange={(e) => onChange({ ...config, title: e.target.value })}
                                    className="h-8 text-[11px] border-border/50 bg-background"
                                    placeholder="Agenda *Online*"
                                />
                                <p className="text-[9px] text-muted-foreground/40">Use *texto* para itálico colorido</p>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[11px] font-medium text-foreground/70">Subtítulo</Label>
                                <textarea
                                    value={config.subtitle || ""}
                                    onChange={(e) => onChange({ ...config, subtitle: e.target.value })}
                                    className="w-full bg-background border border-border/50 rounded-lg px-3 py-2 text-[11px] text-foreground outline-none resize-none min-h-[50px]"
                                    placeholder="Descrição da seção de agendamento..."
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export const schedulingPlugin: EditorPlugin = {
    id: "agendamento",
    label: "Agendamento",
    icon: Calendar,
    previewComponent: SchedulingPreview,
    sidebarComponent: SchedulingSidebar,
    defaultConfig: {
        title: "Agenda *Online*",
        subtitle: "Exclusividade e Precisão em cada detalhe",
    }
}
