import React, { useState } from "react"
import { useEditor } from "@/lib/editor-context"
import { GradientEditor, GenericGradientEditor } from "./gradient-editor"
import { cn } from "@/lib/utils"
import {
    Layers, Palette, Image as ImageIcon, Type, Smartphone, Tablet, Monitor,
    PaintBucket, GripVertical, ImagePlus, EyeOff, Eye, Zap, Check, Sparkles
} from "lucide-react"
import { buildGradientString } from "@/lib/style-utils"
import { ImageUpload } from "@/components/ui/image-upload"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const SECTION_LABELS: Record<string, string> = {
    hero: "Hero (Banner Principal)",
    trust: "Faixa de Confiança",
    services: "Nossos Serviços",
    about: "Quem Sou Eu",
    scheduling: "Agendamento",
    beforeAfter: "Antes & Depois",
    faq: "Perguntas Frequentes",
    contact: "Contato & Localização",
    footer: "Rodapé",
}

export function PropertiesPanel() {
    const {
        selectedSection, selectedElement, data, isPremium, updateField,
        updateSectionStyle, getSectionStyle,
        getResolvedStyle, updateResponsiveStyle, breakpoint, setBreakpoint
    } = useEditor()

    const [showUpgradeModal, setShowUpgradeModal] = useState(false)

    if (!selectedSection && !selectedElement) {
        return (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                <div className="h-14 w-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, rgba(232,168,58,0.15) 0%, rgba(232,168,58,0.05) 100%)' }}>
                    <Layers className="h-6 w-6 text-amber-500/50" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">Selecione um elemento</p>
                <p className="text-[10px] text-muted-foreground/60 mt-1 max-w-48">
                    Clique em qualquer seção ou texto no preview para editar suas propriedades
                </p>
            </div>
        )
    }

    const sectionStyle = selectedSection ? getSectionStyle(selectedSection) : undefined
    const bgType = sectionStyle?.background || 'solid'
    const bgColor = sectionStyle?.bgColor || ''

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="px-4 py-3 border-b border-amber-200/10 dark:border-amber-500/5 shrink-0" style={{ background: 'linear-gradient(135deg, rgba(232,168,58,0.05) 0%, transparent 50%)' }}>
                <p className="text-xs font-semibold text-foreground">
                    {selectedElement
                        ? `Texto: ${selectedElement}`
                        : SECTION_LABELS[selectedSection!] || selectedSection
                    }
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                    {selectedElement ? "Edite estilo do texto selecionado" : "Edite o fundo e espaçamento da seção"}
                </p>
            </div>



            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">

                {/* ─── Section Background Controls ─── */}
                {selectedSection && !selectedElement && (
                    <>
                        {/* === HERO: Dedicated simple panel === */}
                        {selectedSection === 'hero' ? (
                            <div className="space-y-4">

                                {/* ── 1. STYLE PRESETS (main interaction) ── */}
                                <div className="space-y-2">
                                    <p className="text-[10px] font-semibold text-amber-700/60 dark:text-amber-400/50 uppercase tracking-wider flex items-center gap-1.5">
                                        <Palette className="h-3 w-3" /> Estilo da Hero
                                    </p>
                                    <div className="grid grid-cols-3 gap-1.5">
                                        {([
                                            {
                                                name: "Escuro",
                                                sectionGradient: { angle: 180, stops: [{ color: "#1a1a2e", position: 0, opacity: 100 }, { color: "#16213e", position: 50, opacity: 80 }, { color: "#0f3460", position: 100, opacity: 60 }] },
                                                overlay: { angle: 270, stops: [{ color: "#1a1a2e", position: 0, opacity: 90 }, { color: "#1a1a2e", position: 100, opacity: 0 }] },
                                                preview: "linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)"
                                            },
                                            {
                                                name: "Dourado",
                                                sectionGradient: { angle: 135, stops: [{ color: "#3e270a", position: 0, opacity: 100 }, { color: "#8c6239", position: 50, opacity: 70 }, { color: "#eec584", position: 100, opacity: 40 }] },
                                                overlay: { angle: 270, stops: [{ color: "#3e270a", position: 0, opacity: 80 }, { color: "#3e270a", position: 100, opacity: 0 }] },
                                                preview: "linear-gradient(135deg, #3e270a 0%, #8c6239 50%, #eec584 100%)"
                                            },
                                            {
                                                name: "Foto pura",
                                                sectionGradient: null,
                                                overlay: null,
                                                preview: `linear-gradient(180deg, ${data.colors.primary} 0%, ${data.colors.primary} 100%)`
                                            },
                                            {
                                                name: "Preto",
                                                sectionGradient: { angle: 180, stops: [{ color: "#000000", position: 0, opacity: 95 }, { color: "#000000", position: 100, opacity: 40 }] },
                                                overlay: { angle: 270, stops: [{ color: "#000000", position: 0, opacity: 80 }, { color: "#000000", position: 100, opacity: 10 }] },
                                                preview: "linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 100%)"
                                            },
                                            {
                                                name: "Rose",
                                                sectionGradient: { angle: 150, stops: [{ color: "#2d1b30", position: 0, opacity: 100 }, { color: "#6b2462", position: 50, opacity: 70 }, { color: "#d4a0c0", position: 100, opacity: 30 }] },
                                                overlay: { angle: 270, stops: [{ color: "#2d1b30", position: 0, opacity: 85 }, { color: "#2d1b30", position: 100, opacity: 0 }] },
                                                preview: "linear-gradient(150deg, #2d1b30 0%, #6b2462 50%, #d4a0c0 100%)"
                                            },
                                            {
                                                name: "Tema",
                                                sectionGradient: { angle: 180, stops: [{ color: data.colors.primary, position: 0, opacity: 100 }, { color: data.colors.primary, position: 60, opacity: 80 }, { color: data.colors.hover, position: 100, opacity: 50 }] },
                                                overlay: { angle: 270, stops: [{ color: data.colors.primary, position: 0, opacity: 85 }, { color: data.colors.primary, position: 100, opacity: 0 }] },
                                                preview: `linear-gradient(180deg, ${data.colors.primary} 0%, ${data.colors.hover} 100%)`
                                            },
                                        ] as { name: string; sectionGradient: import('@/lib/tenant-types').Gradient | null; overlay: import('@/lib/tenant-types').Gradient | null; preview: string }[]).map((preset, i) => (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    if (preset.sectionGradient) {
                                                        updateSectionStyle('hero', { background: 'gradient', gradient: { ...preset.sectionGradient } })
                                                    } else {
                                                        updateSectionStyle('hero', { background: 'solid', bgColor: data.colors.primary })
                                                    }
                                                    const s = { positionX: 50, positionY: 20, zoom: 1, ...data.heroImageSettings } as import('@/lib/tenant-types').HeroImageSettings
                                                    updateField('heroImageSettings', preset.overlay
                                                        ? { ...s, overlayEnabled: true, overlay: { ...preset.overlay } }
                                                        : { ...s, overlayEnabled: false }
                                                    )
                                                }}
                                                className="group text-left rounded-lg border border-amber-500/10 overflow-hidden hover:ring-2 hover:ring-amber-400/50 transition-all"
                                            >
                                                <div className="h-6 w-full" style={{ background: preset.preview }} />
                                                <p className="px-1.5 py-1 text-[8px] font-medium text-muted-foreground group-hover:text-foreground transition-colors text-center">{preset.name}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>


                                {/* ── 2. ORIENTAÇÃO DO LAYOUT ── */}
                                <div className="space-y-2 pt-4 border-t border-amber-200/10 dark:border-amber-500/5">
                                    <p className="text-[10px] font-semibold text-amber-700/60 dark:text-amber-400/50 uppercase tracking-wider flex items-center gap-1.5">
                                        <Layers className="h-3 w-3" /> Orientação
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                const s = { positionX: 50, positionY: 20, zoom: 1, ...data.heroImageSettings } as import('@/lib/tenant-types').HeroImageSettings
                                                updateField('heroImageSettings', { ...s, layout: 'left' })
                                            }}
                                            className={cn(
                                                "flex-1 py-1.5 rounded-md text-[10px] border transition-all",
                                                data.heroImageSettings?.layout !== 'center'
                                                    ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold"
                                                    : "border-amber-500/10 text-muted-foreground hover:bg-amber-500/5"
                                            )}
                                        >
                                            À Esquerda
                                        </button>
                                        <button
                                            onClick={() => {
                                                const s = { positionX: 50, positionY: 20, zoom: 1, ...data.heroImageSettings } as import('@/lib/tenant-types').HeroImageSettings
                                                updateField('heroImageSettings', { ...s, layout: 'center' })
                                            }}
                                            className={cn(
                                                "flex-1 py-1.5 rounded-md text-[10px] border transition-all",
                                                data.heroImageSettings?.layout === 'center'
                                                    ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold"
                                                    : "border-amber-500/10 text-muted-foreground hover:bg-amber-500/5"
                                            )}
                                        >
                                            Centralizado
                                        </button>
                                    </div>
                                </div>

                                {/* ── 3. CATEGORIZED ACCORDIONS ── */}
                                <div className="space-y-1 pt-4 border-t border-amber-200/10 dark:border-amber-500/5">

                                    {/* ═══ 🎨 DEGRADÊ ═══ */}
                                    {sectionStyle?.background === 'gradient' && sectionStyle.gradient && (
                                        <details open className="group rounded-lg border border-amber-500/10 overflow-hidden">
                                            <summary className="flex items-center gap-2 px-3 py-2 bg-amber-500/5 cursor-pointer select-none list-none hover:bg-amber-500/10 transition-colors">
                                                <span className="text-sm">🎨</span>
                                                <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex-1">Degradê</span>
                                                <span className="text-[8px] text-muted-foreground group-open:rotate-90 transition-transform">▶</span>
                                            </summary>
                                            <div className="px-3 py-3 space-y-4 bg-background/50">

                                                {/* Intensity */}
                                                {(() => {
                                                    const avg = Math.round(sectionStyle.gradient!.stops.reduce((sum, s) => sum + s.opacity, 0) / sectionStyle.gradient!.stops.length)
                                                    return (
                                                        <div className="space-y-1">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-[9px] text-muted-foreground font-medium">Intensidade</span>
                                                                <span className="text-[9px] font-mono text-amber-500">{avg}%</span>
                                                            </div>
                                                            <input type="range" min={10} max={100} value={avg}
                                                                onChange={e => {
                                                                    const t = Number(e.target.value)
                                                                    const g = sectionStyle.gradient!
                                                                    const cAvg = g.stops.reduce((sum, s) => sum + s.opacity, 0) / g.stops.length
                                                                    const r = cAvg > 0 ? t / cAvg : 1
                                                                    updateSectionStyle('hero', { gradient: { ...g, stops: g.stops.map(s => ({ ...s, opacity: Math.min(100, Math.max(0, Math.round(s.opacity * r))) })) } })
                                                                }}
                                                                className="w-full h-1.5 accent-amber-500"
                                                            />
                                                        </div>
                                                    )
                                                })()}

                                                {/* Compass dial direction */}
                                                {(() => {
                                                    const angle = sectionStyle.gradient!.angle
                                                    const setAngle = (a: number) => updateSectionStyle('hero', { gradient: { ...sectionStyle.gradient!, angle: ((a % 360) + 360) % 360 } })
                                                    const R = 34 // radius from center to compass points
                                                    const CX = 40 // center X of 80px dial
                                                    const CY = 40 // center Y
                                                    const compassPoints = [0, 45, 90, 135, 180, 225, 270, 315].map(deg => {
                                                        const rad = (deg - 90) * Math.PI / 180 // offset -90 so 0deg = top
                                                        return { a: deg, x: CX + R * Math.cos(rad), y: CY + R * Math.sin(rad) }
                                                    })
                                                    // Needle endpoint
                                                    const needleR = 28
                                                    const needleRad = (angle - 90) * Math.PI / 180
                                                    const needleX = CX + needleR * Math.cos(needleRad)
                                                    const needleY = CY + needleR * Math.sin(needleRad)

                                                    return (
                                                        <div className="space-y-1.5">
                                                            <span className="text-[9px] text-muted-foreground font-medium">Direção</span>
                                                            <div className="flex items-center gap-3">
                                                                {/* SVG Compass */}
                                                                <svg width="80" height="80" viewBox="0 0 80 80" className="shrink-0">
                                                                    {/* Outer ring */}
                                                                    <circle cx={CX} cy={CY} r="38" fill="none" stroke="rgba(245,158,11,0.15)" strokeWidth="1" />
                                                                    {/* Inner gradient preview circle */}
                                                                    <defs>
                                                                        <linearGradient id="heroGradPreview" gradientTransform={`rotate(${angle} 0.5 0.5)`}>
                                                                            {sectionStyle.gradient!.stops.map((s, i) => (
                                                                                <stop key={i} offset={`${s.position}%`} stopColor={s.color} stopOpacity={s.opacity / 100} />
                                                                            ))}
                                                                        </linearGradient>
                                                                    </defs>
                                                                    <circle cx={CX} cy={CY} r="22" fill="url(#heroGradPreview)" stroke="rgba(245,158,11,0.1)" strokeWidth="0.5" />
                                                                    {/* Needle line from center to edge */}
                                                                    <line x1={CX} y1={CY} x2={needleX} y2={needleY}
                                                                        stroke="rgb(245,158,11)" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
                                                                    {/* Needle tip glow */}
                                                                    <circle cx={needleX} cy={needleY} r="2.5" fill="rgb(245,158,11)" opacity="0.9" />
                                                                    {/* Center dot */}
                                                                    <circle cx={CX} cy={CY} r="2" fill="rgb(245,158,11)" opacity="0.6" />
                                                                    {/* Compass points */}
                                                                    {compassPoints.map(p => (
                                                                        <circle
                                                                            key={p.a}
                                                                            cx={p.x} cy={p.y} r={angle === p.a ? 4 : 3}
                                                                            fill={angle === p.a ? "rgb(245,158,11)" : "rgb(100,100,100)"}
                                                                            className="cursor-pointer transition-all"
                                                                            onClick={() => setAngle(p.a)}
                                                                            opacity={angle === p.a ? 1 : 0.6}
                                                                        >
                                                                            <title>{p.a}°</title>
                                                                        </circle>
                                                                    ))}
                                                                </svg>
                                                                {/* Angle input */}
                                                                <div className="flex-1 space-y-1">
                                                                    <div className="flex items-center gap-1.5">
                                                                        <input
                                                                            type="number" min={0} max={360} step={1} value={angle}
                                                                            onChange={e => setAngle(Number(e.target.value))}
                                                                            className="w-14 h-7 bg-muted rounded-md text-center text-[11px] font-mono text-foreground border border-amber-500/10 focus:border-amber-500/40 focus:outline-none"
                                                                        />
                                                                        <span className="text-[9px] text-muted-foreground">graus</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })()}

                                                {/* Full gradient editor (stops only, no angle) */}
                                                <details className="pt-1">
                                                    <summary className="text-[9px] text-muted-foreground cursor-pointer hover:text-foreground select-none list-none flex items-center gap-1">
                                                        <span className="group-open:rotate-90 transition-transform">▸</span> Editar pontos do gradiente
                                                    </summary>
                                                    <div className="pt-2">
                                                        <GradientEditor sectionId="hero" hideAngle />
                                                    </div>
                                                </details>
                                            </div>
                                        </details>
                                    )}

                                    {/* ═══ 📷 IMAGEM ═══ */}
                                    <details open className="group rounded-lg border border-amber-500/10 overflow-hidden">
                                        <summary className="flex items-center gap-2 px-3 py-2 bg-amber-500/5 cursor-pointer select-none list-none hover:bg-amber-500/10 transition-colors">
                                            <span className="text-sm">📷</span>
                                            <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex-1">Imagem</span>
                                            <span className="text-[8px] uppercase font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-full">{breakpoint}</span>
                                            <span className="text-[8px] text-muted-foreground group-open:rotate-90 transition-transform">▶</span>
                                        </summary>
                                        <div className="px-3 py-3 space-y-2 bg-background/50">
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1.5">
                                                            <ImageIcon className="h-3 w-3" /> Upload de Imagem
                                                        </span>
                                                        {data.heroImageUrl && (
                                                            <button
                                                                onClick={async () => {
                                                                    if (!isPremium) {
                                                                        setShowUpgradeModal(true)
                                                                        return;
                                                                    }

                                                                    let tid: string | number | undefined;
                                                                    try {
                                                                        tid = toast.loading("Removendo fundo...");
                                                                        const res = await fetch("/api/remove-bg", {
                                                                            method: "POST",
                                                                            headers: { "Content-Type": "application/json" },
                                                                            body: JSON.stringify({ imageUrl: data.heroImageUrl })
                                                                        });

                                                                        if (!res.ok) {
                                                                            const err = await res.json();
                                                                            throw new Error(err.error || "Erro ao processar imagem");
                                                                        }

                                                                        const result = await res.json();
                                                                        updateField('heroImageUrl', result.url);
                                                                        toast.success("Fundo removido com sucesso!", { id: tid });
                                                                    } catch (err: any) {
                                                                        toast.error("Falha ao remover fundo", { id: tid, description: err.message });
                                                                    }
                                                                }}
                                                                className={cn(
                                                                    "flex items-center gap-1.5 px-2 py-1 rounded-md text-[9px] font-semibold transition-all shadow-sm",
                                                                    isPremium
                                                                        ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 dark:text-amber-400 border border-amber-500/20"
                                                                        : "bg-muted/50 text-muted-foreground hover:bg-muted dark:hover:bg-muted/80"
                                                                )}
                                                            >
                                                                <span className="text-[10px]">{isPremium ? "✨" : "🔒"}</span>
                                                                Remover fundo
                                                                <span className={cn(
                                                                    "text-[7px] px-1 py-0.5 rounded leading-none ml-1 uppercase",
                                                                    isPremium ? "bg-amber-500 text-white" : "bg-muted-foreground/20 text-muted-foreground"
                                                                )}>Premium</span>
                                                            </button>
                                                        )}
                                                    </div>
                                                    <ImageUpload
                                                        value={data.heroImageUrl}
                                                        onChange={(url) => updateField('heroImageUrl', url)}
                                                        className="aspect-video"
                                                    />
                                                </div>
                                            {data.heroImageUrl && (() => {
                                                const settings = data.heroImageSettings || { positionX: 50, positionY: 20, zoom: 1 }
                                                const getValue = (field: 'positionX' | 'positionY' | 'zoom') => {
                                                    if (breakpoint === 'mobile' && settings.mobile?.[field] !== undefined) return settings.mobile[field]!
                                                    if (breakpoint === 'tablet' && settings.tablet?.[field] !== undefined) return settings.tablet[field]!
                                                    return settings[field] || (field === 'zoom' ? 1 : field === 'positionX' ? 50 : 20)
                                                }
                                                const setValue = (field: 'positionX' | 'positionY' | 'zoom', val: number) => {
                                                    const newSettings = { ...settings }
                                                    if (breakpoint === 'desktop') {
                                                        newSettings[field] = val
                                                    } else {
                                                        const bpKey = breakpoint as 'mobile' | 'tablet'
                                                        if (!newSettings[bpKey]) newSettings[bpKey] = {}
                                                        newSettings[bpKey]![field] = val
                                                    }
                                                    updateField('heroImageSettings', newSettings)
                                                }
                                                return (
                                                    <div className="space-y-1.5">
                                                        {(['positionX', 'positionY', 'zoom'] as const).map(field => (
                                                            <div key={field} className="flex items-center gap-2">
                                                                <span className="text-[9px] text-muted-foreground w-6 shrink-0">{field === 'positionX' ? 'H' : field === 'positionY' ? 'V' : 'Z'}</span>
                                                                <input type="range"
                                                                    min={field === 'zoom' ? 1 : 0} max={field === 'zoom' ? 3 : 100} step={field === 'zoom' ? 0.1 : 1}
                                                                    value={getValue(field)} onChange={e => setValue(field, Number(e.target.value))}
                                                                    className="flex-1 h-1 accent-amber-500"
                                                                />
                                                                <span className="text-[9px] font-mono text-muted-foreground w-8 text-right">{field === 'zoom' ? `${getValue(field).toFixed(1)}x` : `${getValue(field)}%`}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )
                                            })()}
                                            </div>
                                        </div>
                                    </details>

                                    {/* ═══ 🌫️ VINHETA ═══ */}
                                    {data.heroImageUrl && (
                                        <details className="group rounded-lg border border-amber-500/10 overflow-hidden">
                                            <summary className="flex items-center gap-2 px-3 py-2 bg-amber-500/5 cursor-pointer select-none list-none hover:bg-amber-500/10 transition-colors">
                                                <span className="text-sm">🌫️</span>
                                                <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex-1">Vinheta</span>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        const s = { positionX: 50, positionY: 20, zoom: 1, ...data.heroImageSettings } as import('@/lib/tenant-types').HeroImageSettings
                                                        updateField('heroImageSettings', {
                                                            ...s,
                                                            overlayEnabled: !s.overlayEnabled,
                                                            overlay: s.overlay || { angle: 270, stops: [{ color: data.colors.primary, position: 0, opacity: 100 }, { color: data.colors.primary, position: 100, opacity: 0 }] }
                                                        })
                                                    }}
                                                    className={cn(
                                                        "flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-medium transition-all",
                                                        data.heroImageSettings?.overlayEnabled ? "bg-amber-500/15 text-amber-500" : "bg-muted/40 text-muted-foreground"
                                                    )}
                                                >
                                                    {data.heroImageSettings?.overlayEnabled ? <Eye className="h-2.5 w-2.5" /> : <EyeOff className="h-2.5 w-2.5" />}
                                                    {data.heroImageSettings?.overlayEnabled ? "On" : "Off"}
                                                </button>
                                                <span className="text-[8px] text-muted-foreground group-open:rotate-90 transition-transform">▶</span>
                                            </summary>
                                            {data.heroImageSettings?.overlayEnabled && data.heroImageSettings.overlay && (
                                                <div className="px-3 py-3 space-y-3 bg-background/50">
                                                    {/* Intensity slider */}
                                                    {(() => {
                                                        const overlay = data.heroImageSettings.overlay
                                                        const avg = Math.round(overlay.stops.reduce((sum, s) => sum + s.opacity, 0) / overlay.stops.length)
                                                        return (
                                                            <div className="space-y-1">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-[9px] text-muted-foreground font-medium">Intensidade</span>
                                                                    <span className="text-[9px] font-mono text-amber-500">{avg}%</span>
                                                                </div>
                                                                <input type="range" min={10} max={100} value={avg}
                                                                    onChange={e => {
                                                                        const t = Number(e.target.value)
                                                                        const cAvg = overlay.stops.reduce((sum, s) => sum + s.opacity, 0) / overlay.stops.length
                                                                        const r = cAvg > 0 ? t / cAvg : 1
                                                                        const newStops = overlay.stops.map(s => ({ ...s, opacity: Math.min(100, Math.max(0, Math.round(s.opacity * r))) }))
                                                                        const s = { positionX: 50, positionY: 20, zoom: 1, ...data.heroImageSettings } as import('@/lib/tenant-types').HeroImageSettings
                                                                        updateField('heroImageSettings', { ...s, overlay: { ...overlay, stops: newStops } })
                                                                    }}
                                                                    className="w-full h-1.5 accent-amber-500"
                                                                />
                                                            </div>
                                                        )
                                                    })()}
                                                    {/* Full vinheta gradient editor */}
                                                    <details className="pt-1">
                                                        <summary className="text-[9px] text-muted-foreground cursor-pointer hover:text-foreground select-none list-none">▸ Editar gradiente da vinheta</summary>
                                                        <div className="pt-2">
                                                            <GenericGradientEditor
                                                                value={data.heroImageSettings.overlay}
                                                                onChange={g => {
                                                                    const s = { positionX: 50, positionY: 20, zoom: 1, ...data.heroImageSettings } as import('@/lib/tenant-types').HeroImageSettings
                                                                    updateField('heroImageSettings', { ...s, overlay: g })
                                                                }}
                                                                previewCssBuilder={g => buildGradientString(g) || ""}
                                                            />
                                                        </div>
                                                    </details>
                                                </div>
                                            )}
                                        </details>
                                    )}

                                    {/* ═══ 📝 CONTEÚDO ═══ */}
                                    <details className="group rounded-lg border border-amber-500/10 overflow-hidden">
                                        <summary className="flex items-center gap-2 px-3 py-2 bg-amber-500/5 cursor-pointer select-none list-none hover:bg-amber-500/10 transition-colors">
                                            <span className="text-sm">📝</span>
                                            <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex-1">Conteúdo</span>
                                            <span className="text-[8px] text-muted-foreground group-open:rotate-90 transition-transform">▶</span>
                                        </summary>
                                        <div className="px-3 py-3 space-y-2 bg-background/50">
                                            <p className="text-[9px] text-muted-foreground italic">
                                                Clique diretamente nos textos da hero no preview para editá-los.
                                            </p>
                                        </div>
                                    </details>
                                </div>
                            </div>
                        ) : (
                            /* === ALL OTHER SECTIONS: Generic controls === */
                            <>
                                <div className="space-y-3">
                                    <p className="text-[10px] font-semibold text-amber-700/60 dark:text-amber-400/50 uppercase tracking-wider flex items-center gap-1.5">
                                        <PaintBucket className="h-3 w-3" /> Fundo da Seção
                                    </p>

                                    {/* Background type selector */}
                                    <div className="flex gap-1">
                                        {([
                                            { type: "solid" as const, label: "Cor Sólida", icon: Palette },
                                            { type: "gradient" as const, label: "Gradiente", icon: GripVertical },
                                            { type: "image" as const, label: "Imagem", icon: ImageIcon },
                                        ]).map(({ type, label, icon: Icon }) => (
                                            <button
                                                key={type}
                                                onClick={() => updateSectionStyle(selectedSection, { background: type })}
                                                className={cn(
                                                    "flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border text-[9px] font-medium transition-all",
                                                    bgType === type
                                                        ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
                                                        : "border-transparent bg-muted/40 text-muted-foreground hover:bg-muted"
                                                )}
                                            >
                                                <Icon className="h-4 w-4" />
                                                {label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Solid color picker */}
                                    {bgType === 'solid' && (
                                        <div className="flex items-center gap-2">
                                            <div className="relative">
                                                <div className="h-9 w-9 rounded-lg border-2 border-stone-300 dark:border-stone-600" style={{ backgroundColor: bgColor || '#ffffff' }} />
                                                <input type="color" value={bgColor || '#ffffff'} onChange={e => updateSectionStyle(selectedSection, { bgColor: e.target.value })} className="absolute inset-0 opacity-0 cursor-pointer" />
                                            </div>
                                            <input type="text" value={bgColor || '#ffffff'} onChange={e => updateSectionStyle(selectedSection, { bgColor: e.target.value })} className="flex-1 h-8 bg-muted border-none rounded-lg px-2 text-xs font-mono" placeholder="#ffffff" />
                                        </div>
                                    )}

                                    {/* Gradient editor */}
                                    {bgType === 'gradient' && <GradientEditor sectionId={selectedSection} />}

                                    {/* Image URL */}
                                    {bgType === 'image' && (
                                        <ImageUpload value={sectionStyle?.bgImage || ''} onChange={url => updateSectionStyle(selectedSection, { bgImage: url })} />
                                    )}
                                </div>

                                {/* Spacing */}
                                <div className="space-y-3">
                                    <p className="text-[10px] font-semibold text-amber-700/60 dark:text-amber-400/50 uppercase tracking-wider">Espaçamento</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-[9px] text-muted-foreground">Padding Superior</label>
                                            <div className="flex items-center gap-1">
                                                <input type="range" min={0} max={200} value={sectionStyle?.paddingTop ?? 40} onChange={e => updateSectionStyle(selectedSection, { paddingTop: Number(e.target.value) })} className="flex-1 h-1 accent-amber-500" />
                                                <span className="text-[10px] font-mono w-8 text-right">{sectionStyle?.paddingTop ?? 40}px</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] text-muted-foreground">Padding Inferior</label>
                                            <div className="flex items-center gap-1">
                                                <input type="range" min={0} max={200} value={sectionStyle?.paddingBottom ?? 40} onChange={e => updateSectionStyle(selectedSection, { paddingBottom: Number(e.target.value) })} className="flex-1 h-1 accent-amber-500" />
                                                <span className="text-[10px] font-mono w-8 text-right">{sectionStyle?.paddingBottom ?? 40}px</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                )}

                {/* ─── Element Text Controls ─── */}
                {selectedElement && selectedSection && (
                    <div className="space-y-3">
                        <p className="text-[10px] font-semibold text-amber-700/60 dark:text-amber-400/50 uppercase tracking-wider flex items-center gap-1.5">
                            <Type className="h-3 w-3" /> Estilo do Texto
                        </p>
                        <p className="text-[9px] text-muted-foreground bg-muted/50 rounded-lg px-2 py-1.5">
                            Use a <strong>barra flutuante</strong> acima do texto para ajustes rápidos de tamanho, cor e alinhamento.
                            Alterações aqui afetam o breakpoint <strong>{breakpoint}</strong>.
                        </p>

                        {(() => {
                            const resolved = getResolvedStyle(selectedSection, selectedElement)
                            return (
                                <div className="space-y-3">
                                    {/* Font size */}
                                    <div className="space-y-1">
                                        <label className="text-[9px] text-muted-foreground">Tamanho da Fonte</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="range"
                                                min={8} max={120}
                                                value={resolved.fontSize || 16}
                                                onChange={e => updateResponsiveStyle(breakpoint, selectedSection, selectedElement, { fontSize: Number(e.target.value) })}
                                                className="flex-1 h-1 accent-amber-500"
                                            />
                                            <input
                                                type="number"
                                                value={resolved.fontSize || 16}
                                                onChange={e => updateResponsiveStyle(breakpoint, selectedSection, selectedElement, { fontSize: Number(e.target.value) })}
                                                className="w-14 h-7 bg-muted border-none rounded-lg text-center text-xs font-mono"
                                            />
                                            <span className="text-[10px] text-muted-foreground">px</span>
                                        </div>
                                    </div>

                                    {/* Font color */}
                                    <div className="space-y-1">
                                        <label className="text-[9px] text-muted-foreground">Cor do Texto</label>
                                        <div className="flex items-center gap-2">
                                            <div className="relative">
                                                <div
                                                    className="h-8 w-8 rounded-lg border-2 border-stone-300 dark:border-stone-600"
                                                    style={{ backgroundColor: resolved.color || '#333333' }}
                                                />
                                                <input
                                                    type="color"
                                                    value={resolved.color || '#333333'}
                                                    onChange={e => updateResponsiveStyle(breakpoint, selectedSection, selectedElement, { color: e.target.value })}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                value={resolved.color || ''}
                                                onChange={e => updateResponsiveStyle(breakpoint, selectedSection, selectedElement, { color: e.target.value })}
                                                className="flex-1 h-7 bg-muted border-none rounded-lg px-2 text-xs font-mono"
                                                placeholder="Cor padrão"
                                            />
                                        </div>
                                    </div>

                                    {/* Font weight */}
                                    <div className="space-y-1">
                                        <label className="text-[9px] text-muted-foreground">Peso da Fonte</label>
                                        <select
                                            value={resolved.fontWeight || "normal"}
                                            onChange={e => updateResponsiveStyle(breakpoint, selectedSection, selectedElement, { fontWeight: e.target.value })}
                                            className="w-full h-7 bg-muted border-none rounded-lg px-2 text-xs"
                                        >
                                            <option value="normal">Normal (400)</option>
                                            <option value="500">Medium (500)</option>
                                            <option value="600">Semibold (600)</option>
                                            <option value="bold">Bold (700)</option>
                                            <option value="800">Extra Bold (800)</option>
                                        </select>
                                    </div>
                                </div>
                            )
                        })()}
                    </div>
                )}
            </div>

            {/* Upgrade Pro Modal */}
            <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
                <DialogContent className="sm:max-w-100 p-0 overflow-hidden border-none bg-zinc-950">
                    <div className="relative p-6">
                        {/* Background Aura */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/20 blur-[80px] rounded-full pointer-events-none" />
                        
                        <DialogHeader className="relative z-10 text-center space-y-3">
                            <div className="mx-auto w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                                <Zap className="w-6 h-6 text-amber-500 fill-amber-500" />
                            </div>
                            <DialogTitle className="text-xl font-bold text-white tracking-tight">
                                Liberte o Poder do <span className="text-amber-500">Plano Pro</span>
                            </DialogTitle>
                            <DialogDescription className="text-zinc-400 text-sm leading-relaxed">
                                Remova fundos instantaneamente e simplifique sua edição com ferramentas de IA avançadas.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="mt-8 space-y-3 relative z-10">
                            {[
                                "Remoção de fundo ilimitada com IA",
                                "Controle total de cores e fontes",
                                "Remoção do selo 'Agenda Online'",
                                "Suporte prioritário via WhatsApp"
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/50 border border-white/5 hover:border-amber-500/20 transition-colors group">
                                    <div className="h-5 w-5 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-black transition-colors">
                                        <Check className="h-3 w-3" />
                                    </div>
                                    <span className="text-xs text-zinc-300 group-hover:text-amber-100 transition-colors">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 space-y-3">
                            <Button 
                                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold h-11 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                                onClick={() => {
                                    window.location.href = "/dashboard/faturamento"
                                }}
                            >
                                <Sparkles className="w-4 h-4 mr-2" />
                                Quero ser Pro agora
                            </Button>
                            <p className="text-[10px] text-zinc-500 text-center font-medium">
                                Cancele quando quiser • Satisfação garantida
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
