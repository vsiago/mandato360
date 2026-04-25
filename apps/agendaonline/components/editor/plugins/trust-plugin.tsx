"use client"

import { useState } from "react"

import { EditorPlugin, PluginSectionProps, PluginSidebarProps } from "@mandato360/editor"
import { Award, Plus, Trash2, CheckCircle2, Star, Shield, Gem, Zap, Flag, Heart, ShieldCheck, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

/* ─── Icon Registry ─── */
const ICON_MAP: Record<string, any> = {
    Check: CheckCircle2,
    Award,
    Star,
    Shield,
    ShieldCheck,
    Gem,
    Zap,
    Flag,
    Heart,
}

const ICON_OPTIONS = [
    { label: "Check", icon: CheckCircle2, id: "Check" },
    { label: "Prêmio", icon: Award, id: "Award" },
    { label: "Estrela", icon: Star, id: "Star" },
    { label: "Escudo", icon: Shield, id: "Shield" },
    { label: "Proteção", icon: ShieldCheck, id: "ShieldCheck" },
    { label: "Gema", icon: Gem, id: "Gem" },
    { label: "Raio", icon: Zap, id: "Zap" },
    { label: "Coração", icon: Heart, id: "Heart" },
]

/* ═══════════════════════════════════════════
   PREVIEW — Marquee animada idêntica ao /[slug]
   ═══════════════════════════════════════════ */
function TrustPreview({ config, themeColors }: PluginSectionProps) {
    const badges = config.badges || []
    const autoplay = config.autoplay !== false
    const speed = config.speed || 25
    if (badges.length === 0) return null

    const loopedBadges = [...badges, ...badges, ...badges]

    return (
        <div 
            className="py-4 overflow-hidden border-y border-white/5 relative"
            style={{ backgroundColor: config.backgroundColor || "#0f172a" }}
        >
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes trust-marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.333%); }
                }
            `}} />
            <div
                className="flex items-center gap-12 whitespace-nowrap px-6 w-max"
                style={{
                    animationName: 'trust-marquee',
                    animationDuration: `${speed}s`,
                    animationTimingFunction: 'linear',
                    animationIterationCount: 'infinite',
                    animationPlayState: autoplay ? 'running' : 'paused',
                }}
            >
                {loopedBadges.map((badge: any, i: number) => {
                    const Icon = ICON_MAP[badge.icon || 'ShieldCheck'] || ShieldCheck
                    return (
                        <div key={i} className="flex items-center gap-3 shrink-0">
                            <Icon className="h-5 w-5" style={{ color: themeColors.primary }} />
                            <span className="text-white font-bold uppercase tracking-[0.2em] text-[10px]">
                                {typeof badge === 'string' ? badge : badge.text}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

/* ═══════════════════════════════════════════
   SIDEBAR — Controles avançados (Mandato360 parity)
   ═══════════════════════════════════════════ */
function TrustSidebar({ config, onChange, accentColor = "#10b981" }: PluginSidebarProps) {
    const badges = config.badges || []
    const autoplay = config.autoplay !== false
    const speed = config.speed || 25
    const [isPersonalizarOpen, setIsPersonalizarOpen] = useState(true)

    return (
        <div className="space-y-6">
            {/* Personalizar Accordion (Design System Parity) */}
            <div className="border-b border-border">
                <button
                    onClick={() => setIsPersonalizarOpen(!isPersonalizarOpen)}
                    className={cn(
                        "group flex w-full items-center justify-between p-4 text-left transition-all duration-200 hover:bg-muted",
                        isPersonalizarOpen && "bg-muted/50"
                    )}
                >
                    <div className="flex items-center gap-3">
                        <Zap className={cn(
                            "h-4 w-4 transition-colors duration-200",
                            isPersonalizarOpen ? "text-current" : "text-muted-foreground/50 group-hover:text-foreground"
                        )} style={isPersonalizarOpen ? { color: accentColor } : undefined} />
                        <span className={cn(
                            "text-sm font-medium transition-colors duration-200",
                            isPersonalizarOpen ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                        )}>Personalizar</span>
                    </div>
                    <ChevronDown
                        className={cn(
                            "h-3.5 w-3.5 text-muted-foreground/50 transition-transform duration-300",
                            isPersonalizarOpen && "rotate-180 text-muted-foreground"
                        )}
                    />
                </button>
                {isPersonalizarOpen && (
                    <div className="space-y-4 px-4 pb-4 pt-2">
                        <div className="rounded-xl border border-border bg-muted/15 p-3.5 space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-medium text-foreground/70">Autoplay</Label>
                                <Switch
                                    checked={autoplay}
                                    onCheckedChange={(checked) => onChange({ ...config, autoplay: checked })}
                                />
                            </div>
                            <div className="flex items-center justify-between border-t border-border/50 pt-3">
                                <Label className="text-[11px] font-medium text-foreground/70">Cor de Fundo</Label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={config.backgroundColor || "#0f172a"}
                                        onChange={(e) => onChange({ ...config, backgroundColor: e.target.value })}
                                        className="h-6 w-6 cursor-pointer rounded border-0 bg-transparent"
                                    />
                                    <Input
                                        value={config.backgroundColor || "#0f172a"}
                                        onChange={(e) => onChange({ ...config, backgroundColor: e.target.value })}
                                        className="h-7 w-20 border-border/50 bg-input font-mono text-[9px] text-foreground/60"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-[11px] font-medium text-foreground/70">Velocidade</Label>
                                </div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-[9px] text-muted-foreground">Tempo do loop</span>
                                    <span className="text-[10px] font-mono font-bold" style={{ color: accentColor }}>{speed}s</span>
                                </div>
                                <input
                                    type="range"
                                    min={5}
                                    max={60}
                                    step={1}
                                    value={speed}
                                    onChange={(e) => onChange({ ...config, speed: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer"
                                    style={{ accentColor: accentColor }}
                                />
                                <div className="flex justify-between text-[8px] text-muted-foreground/40">
                                    <span>5s (rápido)</span>
                                    <span>60s (lento)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Badges List */}
            <div className="space-y-3 px-4 pb-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/50">
                    Destaques ({badges.length})
                </p>
                <div className="space-y-3">
                    {badges.map((badge: any, i: number) => (
                        <div key={i} className="rounded-xl border border-border bg-muted/15 p-3.5 space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="flex-1 space-y-1">
                                    <Label className="text-[11px] font-medium text-foreground/70">Texto</Label>
                                    <Input
                                        value={badge.text}
                                        onChange={(e) => {
                                            const newBadges = [...badges]
                                            newBadges[i] = { ...badge, text: e.target.value }
                                            onChange({ ...config, badges: newBadges })
                                        }}
                                        className="h-8 text-[11px] border-border/50 bg-background"
                                    />
                                </div>
                                <button
                                    onClick={() => {
                                        const newBadges = badges.filter((_: any, idx: number) => idx !== i)
                                        onChange({ ...config, badges: newBadges })
                                    }}
                                    className="h-8 w-8 flex items-center justify-center text-muted-foreground/30 hover:text-red-500 mt-6 rounded transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-[11px] font-medium text-foreground/70">Ícone</Label>
                                <div className="grid grid-cols-4 gap-1.5">
                                    {ICON_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.id}
                                            onClick={() => {
                                                const newBadges = [...badges]
                                                newBadges[i] = { ...badge, icon: opt.id }
                                                onChange({ ...config, badges: newBadges })
                                            }}
                                            className={cn(
                                                "flex h-8 items-center justify-center rounded border transition-all hover:bg-muted",
                                                (badge.icon || "ShieldCheck") === opt.id
                                                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-500"
                                                    : "border-border text-muted-foreground/40"
                                            )}
                                        >
                                            <opt.icon className="h-3.5 w-3.5" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={() => onChange({ ...config, badges: [...badges, { text: "Novo Destaque", icon: "ShieldCheck" }] })}
                        className="w-full h-9 rounded-lg border border-dashed border-border text-[10px] uppercase font-bold tracking-widest text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all flex items-center justify-center gap-2"
                    >
                        <Plus className="h-3.5 w-3.5" /> Adicionar Destaque
                    </button>
                </div>
            </div>
        </div>
    )
}

export const trustPlugin: EditorPlugin = {
    id: "trust",
    label: "Destaques",
    icon: Award,
    previewComponent: TrustPreview,
    sidebarComponent: TrustSidebar,
    defaultConfig: {
        badges: [
            { text: "Atendimento VIP", icon: "Star" },
            { text: "Ambiente Seguro", icon: "ShieldCheck" },
        ],
        autoplay: true,
        speed: 25,
        backgroundColor: "#0f172a",
    }
}
