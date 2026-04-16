"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { getTenantBySlug } from "@/lib/actions/tenant"
import { updateTenantSiteAction } from "@/lib/actions/tenant"
import { uploadImageAction } from "@/lib/actions/upload"
import { SiteEditor, type EditorConfig, type EditorPlugin, type PluginSectionProps, type PluginSidebarProps } from "@mandato360/editor"
import "@mandato360/editor/styles"
import { siteConfigToEditorConfig, editorConfigToSiteConfig, extractEditorConfig } from "@/lib/editor/adapter"
import { SiteConfig } from "@/lib/editor/types"
import { cn } from "@/lib/utils"
import {
    AlertTriangle, Loader2,
    Award, FileText, User, ArrowLeftRight, HelpCircle, MapPin,
    CheckCircle2, Phone, MessageCircle, Mail, ChevronRight,
    Star, Shield, Gem, Zap, Flag, Heart,
    Trash2, Plus, GripVertical
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

/* ─── Plugin Preview Components ─── */

function TrustPreview({ config, device, themeColors }: PluginSectionProps) {
    const badges = config.badges || []
    const autoplay = config.autoplay !== false
    const speed = config.speed || 25
    if (badges.length === 0) return null

    const IconMap: any = {
        Check: CheckCircle2,
        Award,
        Star,
        Shield,
        Gem,
        Zap,
        Flag,
        Heart
    }

    // Double badges for infinite loop
    const loopedBadges = [...badges, ...badges, ...badges]

    return (
        <div className="bg-slate-900 py-4 overflow-hidden border-y border-white/5 relative">
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.333%); }
                }
            `}} />
            <div 
                className="flex items-center gap-12 whitespace-nowrap px-6 w-max"
                style={{
                    animationName: 'marquee',
                    animationDuration: `${speed}s`,
                    animationTimingFunction: 'linear',
                    animationIterationCount: 'infinite',
                    animationPlayState: autoplay ? 'running' : 'paused'
                }}
            >
                {loopedBadges.map((badge: any, i: number) => {
                    const Icon = IconMap[badge.icon || 'Check'] || CheckCircle2
                    return (
                        <div key={i} className="flex items-center gap-2 shrink-0">
                            <Icon className="h-4 w-4" style={{ color: themeColors.primary }} />
                            <span className="text-white font-bold uppercase tracking-[0.12em] text-[9px]">{badge.text}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function ProjetosPreview({ config, device, themeColors }: PluginSectionProps) {
    const items = config.items || []
    const title = config.title || "Ações e Projetos"
    return (
        <div className="bg-white py-8 px-4" style={device === "desktop" ? { padding: "3rem 2rem" } : undefined}>
            <h2 className="text-lg font-black text-gray-900 tracking-tight mb-4" style={device === "desktop" ? { fontSize: "1.5rem", marginBottom: "1.5rem" } : undefined}>
                {title}
            </h2>
            <div className={`grid gap-3 ${device === "desktop" ? "grid-cols-3" : device === "tablet" ? "grid-cols-2" : "grid-cols-1"}`}>
                {(items.length > 0 ? items.slice(0, 3) : [
                    { name: "Projeto Exemplo 1", description: "Descrição do projeto" },
                    { name: "Projeto Exemplo 2", description: "Descrição do projeto" },
                ]).map((item: any, i: number) => (
                    <div key={i} className="rounded-xl bg-gray-50 p-4 border border-gray-100">
                        <div className="h-8 w-8 rounded-lg mb-2 flex items-center justify-center" style={{ backgroundColor: `${themeColors.primary}15`, color: themeColors.primary }}>
                            <FileText className="h-4 w-4" />
                        </div>
                        <h3 className="text-xs font-bold text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-[10px] text-gray-500 line-clamp-2">{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

function PerfilPreview({ config, device, themeColors }: PluginSectionProps) {
    const title = config.title || "O Vereador"
    return (
        <div className="bg-gray-50 py-8 px-4" style={device === "desktop" ? { padding: "3rem 2rem" } : undefined}>
            <div className={`flex gap-6 ${device === "desktop" ? "flex-row items-center" : "flex-col"}`}>
                <div className="aspect-square rounded-2xl bg-gray-200 flex items-center justify-center overflow-hidden" style={device === "desktop" ? { width: "180px", flexShrink: 0 } : { width: "100%", maxWidth: "200px" }}>
                    {config.imageUrl ? (
                        <img src={config.imageUrl} alt={config.name} className="w-full h-full object-cover" />
                    ) : (
                        <User className="h-12 w-12 text-gray-400" />
                    )}
                </div>
                <div>
                    <h2 className="text-lg font-black text-gray-900 tracking-tight mb-2">{title}</h2>
                    <p className="text-xs text-gray-600 italic mb-2">"{config.bio || "Trabalhando por você."}"</p>
                    <h3 className="text-sm font-black uppercase" style={{ color: themeColors.primary }}>{config.name || "Nome"}</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{config.role || "Vereador"}</p>
                </div>
            </div>
        </div>
    )
}

function BeforeAfterPreview({ config, device, themeColors }: PluginSectionProps) {
    const items = config.items || []
    if (items.length === 0) return null
    return (
        <div className="bg-white py-8 px-4 border-t border-gray-100" style={device === "desktop" ? { padding: "3rem 2rem" } : undefined}>
            <h2 className="text-lg font-black text-gray-900 tracking-tight mb-4 text-center">{config.title || "Resultados"}</h2>
            <div className={`grid gap-3 ${device === "desktop" ? "grid-cols-3" : "grid-cols-1"}`}>
                {items.slice(0, 3).map((item: any, i: number) => (
                    <div key={i} className="rounded-xl bg-gray-50 border border-gray-100 overflow-hidden">
                        <div className="grid grid-cols-2 h-20">
                            <div className="bg-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-400">ANTES</div>
                            <div className="bg-gray-100 flex items-center justify-center text-[8px] font-bold text-gray-400">DEPOIS</div>
                        </div>
                        <div className="p-3">
                            <p className="text-[10px] font-bold text-gray-900">{item.title}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function FAQPreview({ config, device, themeColors }: PluginSectionProps) {
    const items = config.items || []
    if (items.length === 0) return null
    return (
        <div className="bg-gray-50 py-8 px-4" style={device === "desktop" ? { padding: "3rem 2rem" } : undefined}>
            <h2 className="text-lg font-black text-gray-900 tracking-tight mb-4 text-center">{config.title || "Perguntas Frequentes"}</h2>
            <div className="space-y-2 max-w-md mx-auto">
                {items.slice(0, 3).map((item: any, i: number) => (
                    <div key={i} className="bg-white rounded-lg border border-gray-100 p-3">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-gray-900">{item.question}</span>
                            <ChevronRight className="h-3 w-3 text-gray-400" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function ContactPreview({ config, device, themeColors }: PluginSectionProps) {
    const hasContent = config.phone || config.whatsapp || config.email
    if (!hasContent) return null
    return (
        <div className="bg-white py-8 px-4 border-t border-gray-100" style={device === "desktop" ? { padding: "3rem 2rem" } : undefined}>
            <h2 className="text-lg font-black text-gray-900 tracking-tight mb-4 text-center">{config.title || "Contato"}</h2>
            <div className={`grid gap-3 max-w-lg mx-auto ${device === "desktop" ? "grid-cols-3" : "grid-cols-1"}`}>
                {config.phone && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}>
                            <Phone className="h-3.5 w-3.5" />
                        </div>
                        <div>
                            <p className="text-[8px] font-bold text-gray-400 uppercase">Telefone</p>
                            <p className="text-[10px] font-bold text-gray-900">{config.phone}</p>
                        </div>
                    </div>
                )}
                {config.whatsapp && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="h-8 w-8 rounded-lg bg-green-500/10 text-green-600 flex items-center justify-center">
                            <MessageCircle className="h-3.5 w-3.5" />
                        </div>
                        <div>
                            <p className="text-[8px] font-bold text-gray-400 uppercase">WhatsApp</p>
                            <p className="text-[10px] font-bold text-gray-900">{config.whatsapp}</p>
                        </div>
                    </div>
                )}
                {config.email && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}>
                            <Mail className="h-3.5 w-3.5" />
                        </div>
                        <div>
                            <p className="text-[8px] font-bold text-gray-400 uppercase">E-mail</p>
                            <p className="text-[10px] font-bold text-gray-900">{config.email}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function TransparenciaPreview({ config, device, themeColors }: PluginSectionProps) {
    const items = config.items || []
    return (
        <div className="bg-slate-50 py-12 px-6" style={device === "desktop" ? { padding: "4rem 3rem" } : undefined}>
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">{config.title || "Portal da Transparência"}</h2>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">Informações detalhadas sobre a atuação e recursos geridos pelo mandato.</p>
                </div>
                
                <div className={`grid gap-4 ${device === "desktop" ? "grid-cols-3" : device === "tablet" ? "grid-cols-2" : "grid-cols-1"}`}>
                    {(items.length > 0 ? items : [
                        { label: "Assiduidade na Câmara", value: "100%", icon: "Shield" },
                        { label: "Projetos de Lei", value: "42", icon: "FileText" },
                        { label: "Economia de Verba", value: "R$ 150k", icon: "Gem" }
                    ]).map((item: any, i: number) => {
                        const Icon = i === 0 ? Shield : i === 1 ? FileText : i === 2 ? Gem : Zap
                        return (
                            <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
                                <div className="h-10 w-10 rounded-xl mb-4 flex items-center justify-center" style={{ backgroundColor: `${themeColors.primary}08`, color: themeColors.primary }}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</h3>
                                    <p className="text-xl font-black text-slate-900" style={{ color: i === 0 ? themeColors.primary : undefined }}>{item.value}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

function PrestacaoContasPreview({ config, device, themeColors }: PluginSectionProps) {
    const items = config.items || []
    return (
        <div className="bg-white py-12 px-6" style={device === "desktop" ? { padding: "4rem 3rem" } : undefined}>
            <div className="max-w-4xl mx-auto space-y-10">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">{config.title || "Prestação de Contas"}</h2>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">Resumo das principais ações e fiscalizações realizadas neste período.</p>
                </div>

                <div className="space-y-4">
                    {(items.length > 0 ? items : [
                        { text: "Fiscalização em 12 Unidades de Saúde do município", status: "Concluído" },
                        { text: "Implementação da Coleta Seletiva no bairro Central", status: "Em progresso" },
                        { text: "Reforma completa da Praça dos Atletas", status: "Concluído" }
                    ]).map((item: any, i: number) => (
                        <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/30">
                            <div className="h-6 w-6 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5" style={{ backgroundColor: item.status === "Concluído" ? "#10b98120" : "#f59e0b20", color: item.status === "Concluído" ? "#10b981" : "#f59e0b" }}>
                                <CheckCircle2 className="h-4 w-4" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <p className="text-xs font-bold text-slate-800 leading-relaxed">{item.text}</p>
                                <span className={cn(
                                    "text-[9px] font-black uppercase tracking-widest",
                                    item.status === "Concluído" ? "text-emerald-500" : "text-amber-500"
                                )}>{item.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

/* ─── Sidebar UI Components (Standardized) ─── */

function SidebarSection({ title, children, className }: { title?: string, children: React.ReactNode, className?: string }) {
    return (
        <div className={cn("space-y-3", className)}>
            {title && <SidebarLabel>{title}</SidebarLabel>}
            {children}
        </div>
    )
}

function SidebarLabel({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/50">
            {children}
        </p>
    )
}

function SidebarCard({ children, className, accentColor }: { children: React.ReactNode, className?: string, accentColor?: string }) {
    return (
        <div className={cn("group rounded-xl border border-border bg-muted/15 p-3.5 transition-all duration-200 hover:bg-muted/20 relative", className)}>
            {children}
        </div>
    )
}

function SidebarField({ label, children, description }: { label?: string, children: React.ReactNode, description?: string }) {
    return (
        <div className="space-y-2">
            {label && (
                <div className="flex items-center justify-between">
                    <Label className="text-[11px] font-medium text-foreground/70">{label}</Label>
                </div>
            )}
            {children}
            {description && <p className="text-[9px] text-muted-foreground/50 leading-tight">{description}</p>}
        </div>
    )
}

/* ─── Plugin Sidebar Components ─── */

const ICON_OPTIONS = [
    { label: "Check", icon: CheckCircle2, id: "Check" },
    { label: "Prêmio", icon: Award, id: "Award" },
    { label: "Estrela", icon: Star, id: "Star" },
    { label: "Escudo", icon: Shield, id: "Shield" },
    { label: "Gema", icon: Gem, id: "Gem" },
    { label: "Raio", icon: Zap, id: "Zap" },
    { label: "Flag", icon: Flag, id: "Flag" },
    { label: "Coração", icon: Heart, id: "Heart" },
]

function TrustSidebar({ config, onChange }: PluginSidebarProps) {
    const badges = config.badges || []
    const autoplay = config.autoplay !== false
    const speed = config.speed || 25

    return (
        <div className="space-y-6">
            <SidebarSection title="Configurações Globais">
                <SidebarCard className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="text-xs font-medium text-foreground/70">Autoplay</Label>
                        <Switch 
                            checked={autoplay} 
                            onCheckedChange={(checked) => onChange({ autoplay: checked })}
                        />
                    </div>
                    <SidebarField label="Velocidade">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[9px] text-muted-foreground">Tempo do loop</span>
                            <span className="text-[10px] font-mono font-bold text-emerald-500">{speed}s</span>
                        </div>
                        <Slider 
                            min={5} 
                            max={60} 
                            step={1}
                            value={[speed]} 
                            onValueChange={([val]) => onChange({ speed: val })}
                        />
                    </SidebarField>
                </SidebarCard>
            </SidebarSection>

            <SidebarSection title={`Destaques (${badges.length})`}>
                <div className="space-y-3">
                    {badges.map((badge: any, i: number) => (
                        <SidebarCard key={i} className="space-y-3">
                            <div className="flex items-center gap-2">
                                <SidebarField label="Texto" className="flex-1">
                                    <Input 
                                        value={badge.text}
                                        onChange={(e) => {
                                            const newBadges = [...badges]
                                            newBadges[i] = { ...badge, text: e.target.value }
                                            onChange({ badges: newBadges })
                                        }}
                                        className="h-8 text-[11px] border-border/50 bg-background"
                                    />
                                </SidebarField>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        const newBadges = badges.filter((_: any, idx: number) => idx !== i)
                                        onChange({ badges: newBadges })
                                    }}
                                    className="h-8 w-8 text-muted-foreground/30 hover:text-red-500 mt-6"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>

                            <SidebarField label="Ícone">
                                <div className="grid grid-cols-4 gap-1.5">
                                    {ICON_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.id}
                                            onClick={() => {
                                                const newBadges = [...badges]
                                                newBadges[i] = { ...badge, icon: opt.id }
                                                onChange({ badges: newBadges })
                                            }}
                                            className={cn(
                                                "flex h-8 items-center justify-center rounded border transition-all hover:bg-muted",
                                                (badge.icon || "Check") === opt.id ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-500" : "border-border text-muted-foreground/40"
                                            )}
                                        >
                                            <opt.icon className="h-3.5 w-3.5" />
                                        </button>
                                    ))}
                                </div>
                            </SidebarField>
                        </SidebarCard>
                    ))}

                    <Button
                        variant="dashed"
                        className="w-full h-9 text-[10px] uppercase font-bold tracking-widest text-muted-foreground hover:text-foreground"
                        onClick={() => {
                            onChange({ badges: [...badges, { text: "Novo Destaque", icon: "Check" }] })
                        }}
                    >
                        <Plus className="mr-2 h-3.5 w-3.5" /> Adicionar Destaque
                    </Button>
                </div>
            </SidebarSection>
        </div>
    )
}

function ProjetosSidebar({ config, onChange }: PluginSidebarProps) {
    const items = config.items || []
    return (
        <div className="space-y-6">
            <SidebarSection title="Configurações da Seção">
                <SidebarCard className="space-y-4">
                    <SidebarField label="Título da Seção">
                        <Input 
                            value={config.title}
                            onChange={(e) => onChange({ title: e.target.value })}
                            placeholder="Ex: Ações e Projetos"
                            className="h-9 text-xs"
                        />
                    </SidebarField>
                </SidebarCard>
            </SidebarSection>
            
            <SidebarSection title={`Projetos (${items.length})`}>
                <div className="space-y-3">
                    {items.map((item: any, i: number) => (
                        <SidebarCard key={i} className="space-y-3">
                            <div className="flex items-center justify-between">
                                <SidebarLabel>Projeto #{i + 1}</SidebarLabel>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        const newItems = items.filter((_: any, idx: number) => idx !== i)
                                        onChange({ items: newItems })
                                    }}
                                    className="h-6 w-6 p-0 text-muted-foreground/30 hover:text-red-500"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                            <SidebarField label="Título">
                                <Input 
                                    value={item.name}
                                    onChange={(e) => {
                                        const newItems = [...items]
                                        newItems[i] = { ...item, name: e.target.value }
                                        onChange({ items: newItems })
                                    }}
                                    className="h-8 text-xs bg-background"
                                />
                            </SidebarField>
                            <SidebarField label="Descrição">
                                <Textarea 
                                    value={item.description}
                                    onChange={(e) => {
                                        const newItems = [...items]
                                        newItems[i] = { ...item, description: e.target.value }
                                        onChange({ items: newItems })
                                    }}
                                    className="text-xs bg-background min-h-[60px]"
                                />
                            </SidebarField>
                        </SidebarCard>
                    ))}
                    <Button
                        variant="dashed"
                        className="w-full h-9 text-[10px] uppercase font-bold tracking-widest text-muted-foreground hover:text-foreground"
                        onClick={() => {
                            onChange({ items: [...items, { name: "Novo Projeto", description: "Descrição do projeto..." }] })
                        }}
                    >
                        <Plus className="mr-2 h-3.5 w-3.5" /> Adicionar Projeto
                    </Button>
                </div>
            </SidebarSection>
        </div>
    )
}

function PerfilSidebar({ config, onChange }: PluginSidebarProps) {
    return (
        <div className="space-y-6">
            <SidebarSection title="Informações do Perfil">
                <SidebarCard className="space-y-4">
                    <SidebarField label="Nome">
                        <Input 
                            value={config.name}
                            onChange={(e) => onChange({ name: e.target.value })}
                            className="h-9 text-xs bg-background"
                        />
                    </SidebarField>
                    <SidebarField label="Cargo / Role">
                        <Input 
                            value={config.role}
                            onChange={(e) => onChange({ role: e.target.value })}
                            className="h-9 text-xs bg-background"
                            placeholder="Ex: Vereador"
                        />
                    </SidebarField>
                    <SidebarField label="Biografia">
                        <Textarea 
                            value={config.bio}
                            onChange={(e) => onChange({ bio: e.target.value })}
                            className="text-xs bg-background min-h-[100px]"
                        />
                    </SidebarField>
                </SidebarCard>
            </SidebarSection>
            <SidebarSection title="Imagem">
                <SidebarCard>
                     <SidebarField label="URL da Imagem">
                        <Input 
                            value={config.imageUrl}
                            onChange={(e) => onChange({ imageUrl: e.target.value })}
                            className="h-9 text-xs bg-background font-mono"
                        />
                    </SidebarField>
                </SidebarCard>
            </SidebarSection>
        </div>
    )
}

function FAQSidebar({ config, onChange }: PluginSidebarProps) {
    const items = config.items || []
    return (
        <div className="space-y-6">
            <SidebarSection title="Configurações da Seção">
                <SidebarCard>
                    <SidebarField label="Título da Seção">
                        <Input 
                            value={config.title}
                            onChange={(e) => onChange({ title: e.target.value })}
                            placeholder="Ex: Perguntas Frequentes"
                            className="h-9 text-xs"
                        />
                    </SidebarField>
                </SidebarCard>
            </SidebarSection>

            <SidebarSection title={`Perguntas (${items.length})`}>
                <div className="space-y-3">
                    {items.map((item: any, i: number) => (
                        <SidebarCard key={i} className="space-y-3">
                            <div className="flex items-center justify-between">
                                <SidebarLabel>Item #{i + 1}</SidebarLabel>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        const newItems = items.filter((_: any, idx: number) => idx !== i)
                                        onChange({ items: newItems })
                                    }}
                                    className="h-6 w-6 p-0 text-muted-foreground/30 hover:text-red-500"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                            <SidebarField label="Pergunta">
                                <Input 
                                    value={item.question}
                                    onChange={(e) => {
                                        const newItems = [...items]
                                        newItems[i] = { ...item, question: e.target.value }
                                        onChange({ items: newItems })
                                    }}
                                    className="h-8 text-xs bg-background"
                                />
                            </SidebarField>
                            <SidebarField label="Resposta">
                                <Textarea 
                                    value={item.answer}
                                    onChange={(e) => {
                                        const newItems = [...items]
                                        newItems[i] = { ...item, answer: e.target.value }
                                        onChange({ items: newItems })
                                    }}
                                    className="text-xs bg-background min-h-[60px]"
                                />
                            </SidebarField>
                        </SidebarCard>
                    ))}
                    <Button
                        variant="dashed"
                        className="w-full h-9 text-[10px] uppercase font-bold tracking-widest text-muted-foreground hover:text-foreground"
                        onClick={() => {
                            onChange({ items: [...items, { question: "Nova Pergunta", answer: "Resposta..." }] })
                        }}
                    >
                        <Plus className="mr-2 h-3.5 w-3.5" /> Adicionar FAQ
                    </Button>
                </div>
            </SidebarSection>
        </div>
    )
}

function ContactSidebar({ config, onChange }: PluginSidebarProps) {
    return (
        <div className="space-y-6">
            <SidebarSection title="Canais de Atendimento">
                <SidebarCard className="space-y-4">
                    <SidebarField label="Telefone">
                        <Input 
                            value={config.phone}
                            onChange={(e) => onChange({ phone: e.target.value })}
                            className="h-9 text-xs bg-background"
                            placeholder="(00) 00000-0000"
                        />
                    </SidebarField>
                    <SidebarField label="WhatsApp">
                        <Input 
                            value={config.whatsapp}
                            onChange={(e) => onChange({ whatsapp: e.target.value })}
                            className="h-9 text-xs bg-background"
                            placeholder="Link ou número"
                        />
                    </SidebarField>
                    <SidebarField label="E-mail">
                        <Input 
                            value={config.email}
                            onChange={(e) => onChange({ email: e.target.value })}
                            className="h-9 text-xs bg-background"
                        />
                    </SidebarField>
                </SidebarCard>
            </SidebarSection>

            <SidebarSection title="Localização & Social">
                <SidebarCard className="space-y-4">
                    <SidebarField label="Endereço">
                        <Textarea 
                            value={config.address}
                            onChange={(e) => onChange({ address: e.target.value })}
                            className="text-xs bg-background min-h-[60px]"
                        />
                    </SidebarField>
                    <SidebarField label="Instagram">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">@</span>
                            <Input 
                                value={config.instagram}
                                onChange={(e) => onChange({ instagram: e.target.value })}
                                className="h-9 text-xs bg-background"
                                placeholder="usuario"
                            />
                        </div>
                    </SidebarField>
                </SidebarCard>
            </SidebarSection>
        </div>
    )
}

function TransparenciaSidebar({ config, onChange }: PluginSidebarProps) {
    const items = config.items || []
    return (
        <div className="space-y-6">
            <SidebarSection title="Configurações da Seção">
                <SidebarCard>
                    <SidebarField label="Título">
                        <Input value={config.title} onChange={(e) => onChange({ title: e.target.value })} className="h-9 text-xs" />
                    </SidebarField>
                </SidebarCard>
            </SidebarSection>
            
            <SidebarSection title={`Métricas (${items.length})`}>
                <div className="space-y-3">
                    {items.map((item: any, i: number) => (
                        <SidebarCard key={i} className="space-y-3">
                            <div className="flex items-center justify-between">
                                <SidebarLabel>Métrica #{i + 1}</SidebarLabel>
                                <Button variant="ghost" size="sm" onClick={() => onChange({ items: items.filter((_: any, idx: number) => idx !== i) })} className="h-6 w-6 p-0 text-muted-foreground/30 hover:text-red-500">
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                            <SidebarField label="Legenda (ex: Projetos)">
                                <Input value={item.label} onChange={(e) => {
                                    const newItems = [...items]
                                    newItems[i] = { ...item, label: e.target.value }
                                    onChange({ items: newItems })
                                }} className="h-8 text-xs bg-background" />
                            </SidebarField>
                            <SidebarField label="Valor (ex: 42 ou 98%)">
                                <Input value={item.value} onChange={(e) => {
                                    const newItems = [...items]
                                    newItems[i] = { ...item, value: e.target.value }
                                    onChange({ items: newItems })
                                }} className="h-8 text-xs bg-background font-black" />
                            </SidebarField>
                        </SidebarCard>
                    ))}
                    <Button variant="dashed" className="w-full h-9 text-[10px] uppercase font-bold tracking-widest text-muted-foreground hover:text-foreground" onClick={() => onChange({ items: [...items, { label: "Novo Dado", value: "0", icon: "Shield" }] })}>
                        <Plus className="mr-2 h-3.5 w-3.5" /> Adicionar Métrica
                    </Button>
                </div>
            </SidebarSection>
        </div>
    )
}

function PrestacaoContasSidebar({ config, onChange }: PluginSidebarProps) {
    const items = config.items || []
    return (
        <div className="space-y-6">
            <SidebarSection title="Configurações da Seção">
                <SidebarCard>
                    <SidebarField label="Título">
                        <Input value={config.title} onChange={(e) => onChange({ title: e.target.value })} className="h-9 text-xs" />
                    </SidebarField>
                </SidebarCard>
            </SidebarSection>

            <SidebarSection title={`Ações (${items.length})`}>
                <div className="space-y-3">
                    {items.map((item: any, i: number) => (
                        <SidebarCard key={i} className="space-y-3">
                            <div className="flex items-center justify-between">
                                <SidebarLabel>Ação #{i + 1}</SidebarLabel>
                                <Button variant="ghost" size="sm" onClick={() => onChange({ items: items.filter((_: any, idx: number) => idx !== i) })} className="h-6 w-6 p-0 text-muted-foreground/30 hover:text-red-500">
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                            <SidebarField label="Descrição da Ação">
                                <Textarea value={item.text} onChange={(e) => {
                                    const newItems = [...items]
                                    newItems[i] = { ...item, text: e.target.value }
                                    onChange({ items: newItems })
                                }} className="text-xs bg-background min-h-[60px]" />
                            </SidebarField>
                            <SidebarField label="Status">
                                <select 
                                    value={item.status} 
                                    onChange={(e) => {
                                        const newItems = [...items]
                                        newItems[i] = { ...item, status: e.target.value }
                                        onChange({ items: newItems })
                                    }}
                                    className="w-full h-8 rounded border border-border bg-background text-[10px] font-bold uppercase tracking-wider px-2"
                                >
                                    <option value="Concluído">Concluído</option>
                                    <option value="Em progresso">Em progresso</option>
                                    <option value="Aguardando">Aguardando</option>
                                </select>
                            </SidebarField>
                        </SidebarCard>
                    ))}
                    <Button variant="dashed" className="w-full h-9 text-[10px] uppercase font-bold tracking-widest text-muted-foreground hover:text-foreground" onClick={() => onChange({ items: [...items, { text: "Nova ação realizada...", status: "Concluído" }] })}>
                        <Plus className="mr-2 h-3.5 w-3.5" /> Adicionar Ação
                    </Button>
                </div>
            </SidebarSection>
        </div>
    )
}

function BeforeAfterSidebar({ config, onChange }: PluginSidebarProps) {
    const items = config.items || []
    return (
        <div className="space-y-6">
            <SidebarSection title="Configurações da Seção">
                <SidebarCard>
                    <SidebarField label="Título da Seção">
                        <Input 
                            value={config.title}
                            onChange={(e) => onChange({ title: e.target.value })}
                            placeholder="Ex: Transformando a Cidade"
                            className="h-9 text-xs"
                        />
                    </SidebarField>
                </SidebarCard>
            </SidebarSection>

            <SidebarSection title={`Comparações (${items.length})`}>
                <div className="space-y-3">
                    {items.map((item: any, i: number) => (
                        <SidebarCard key={i} className="space-y-4">
                            <div className="flex items-center justify-between">
                                <SidebarLabel>Item #{i + 1}</SidebarLabel>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        const newItems = items.filter((_: any, idx: number) => idx !== i)
                                        onChange({ items: newItems })
                                    }}
                                    className="h-6 w-6 p-0 text-muted-foreground/30 hover:text-red-500"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                            <SidebarField label="Título">
                                <Input 
                                    value={item.title}
                                    onChange={(e) => {
                                        const newItems = [...items]
                                        newItems[i] = { ...item, title: e.target.value }
                                        onChange({ items: newItems })
                                    }}
                                    className="h-8 text-xs bg-background"
                                />
                            </SidebarField>
                            <div className="grid grid-cols-2 gap-2">
                                <SidebarField label="Link Antes">
                                    <Input 
                                        value={item.beforeImage}
                                        onChange={(e) => {
                                            const newItems = [...items]
                                            newItems[i] = { ...item, beforeImage: e.target.value }
                                            onChange({ items: newItems })
                                        }}
                                        className="h-8 text-[10px] font-mono bg-background"
                                    />
                                </SidebarField>
                                <SidebarField label="Link Depois">
                                    <Input 
                                        value={item.afterImage}
                                        onChange={(e) => {
                                            const newItems = [...items]
                                            newItems[i] = { ...item, afterImage: e.target.value }
                                            onChange({ items: newItems })
                                        }}
                                        className="h-8 text-[10px] font-mono bg-background"
                                    />
                                </SidebarField>
                            </div>
                        </SidebarCard>
                    ))}
                    <Button
                        variant="dashed"
                        className="w-full h-9 text-[10px] uppercase font-bold tracking-widest text-muted-foreground hover:text-foreground"
                        onClick={() => {
                            onChange({ items: [...items, { title: "Nova Comparação", beforeImage: "", afterImage: "" }] })
                        }}
                    >
                        <Plus className="mr-2 h-3.5 w-3.5" /> Adicionar Comparação
                    </Button>
                </div>
            </SidebarSection>
        </div>
    )
}

/* ─── Define Mandato360 Plugins ─── */
const mandatoPlugins: EditorPlugin[] = [
    {
        id: "trust",
        label: "Destaques",
        icon: Award,
        previewComponent: TrustPreview,
        sidebarComponent: TrustSidebar,
        defaultConfig: { badges: [], autoplay: true, speed: 25 },
    },
    {
        id: "projetos",
        label: "Ações",
        icon: FileText,
        previewComponent: ProjetosPreview,
        sidebarComponent: ProjetosSidebar,
        defaultConfig: { title: "Ações e Projetos", items: [], categories: [] },
    },
    {
        id: "perfil",
        label: "Sobre",
        icon: User,
        previewComponent: PerfilPreview,
        sidebarComponent: PerfilSidebar,
        defaultConfig: { title: "O Vereador", name: "", bio: "", role: "Vereador", imageUrl: "" },
    },
    {
        id: "beforeAfter",
        label: "Resultados",
        icon: ArrowLeftRight,
        previewComponent: BeforeAfterPreview,
        sidebarComponent: BeforeAfterSidebar,
        defaultConfig: { title: "Transformando a Cidade", items: [] },
    },
    {
        id: "faq",
        label: "Dúvidas",
        icon: HelpCircle,
        previewComponent: FAQPreview,
        sidebarComponent: FAQSidebar,
        defaultConfig: { title: "Perguntas Frequentes", items: [] },
    },
    {
        id: "contact",
        label: "Contato",
        icon: MapPin,
        previewComponent: ContactPreview,
        sidebarComponent: ContactSidebar,
        defaultConfig: { title: "Entre em Contato", phone: "", whatsapp: "", email: "", instagram: "", address: "" },
    },
    {
        id: "transparencia",
        label: "Transparência",
        icon: Shield,
        previewComponent: TransparenciaPreview,
        sidebarComponent: TransparenciaSidebar,
        defaultConfig: { title: "Portal da Transparência", items: [] },
    },
    {
        id: "prestacaoContas",
        label: "Contas",
        icon: Gem,
        previewComponent: PrestacaoContasPreview,
        sidebarComponent: PrestacaoContasSidebar,
        defaultConfig: { title: "Prestação de Contas", items: [] },
    },
]

/* ─── Build SiteConfig from tenant DB row (reused from original) ─── */
function buildConfigFromTenant(tenant: any): SiteConfig {
    const defaultConfig: SiteConfig = {
        slug: tenant.slug,
        name: tenant.name || "Vereador",
        tagline: "Mandato Participativo",
        description: "Trabalhando pela transparência e inovação política.",
        heroBadge: "Mandato Participativo",
        heroImageUrl: "",
        heroHeadline: "Por uma cidade de",
        heroHighlight: "Resultados",
        ctaText: "Solicitar Demanda",
        colors: {
            primary: tenant.primaryColor || "#0F2B5B",
            secondary: tenant.secondaryColor || "#0D9F6E",
        },
        contact: { phone: "", whatsapp: "", address: "", email: "", instagram: "" },
        perfil: {
            name: tenant.name || "Vereador",
            bio: tenant.biografia || "",
            role: "Vereador",
            imageUrl: tenant.fotoPerfilUrl || "",
        },
        logoUrl: tenant.logoUrl || "",
        avatarUrl: "",
        trustBadges: [
            { text: "Compromisso com a Cidade", icon: "Check" },
            { text: "Transparência Total", icon: "Check" },
        ],
        categories: [],
        projetos: [],
        faq: [],
        beforeAfter: [],
        theme: "neutro" as any,
        fontHeading: "",
        fontBody: "",
        projetosTitle: "Ações e Projetos",
        perfilTitle: "O Vereador",
        resultsTitle: "Transformando a Cidade",
        faqTitle: "Perguntas Frequentes",
        contactTitle: "Entre em Contato",
        sectionStyles: {
            hero: {
                background: 'gradient',
                gradient: {
                    angle: 90,
                    stops: [
                        { color: tenant.primaryColor || "#0F2B5B", position: 0, opacity: 100 },
                        { color: tenant.secondaryColor || "#0D9F6E", position: 50, opacity: 80 },
                        { color: "#000000", position: 100, opacity: 70 }
                    ]
                }
            }
        },
        heroImageSettings: {
            positionX: 50,
            positionY: 20,
            zoom: 1,
            layout: 'left',
            autoHeight: true,
            height: 600,
            overlayEnabled: true,
            overlay: {
                angle: 90,
                stops: [
                    { color: tenant.primaryColor || "#0F2B5B", position: 0, opacity: 100 },
                    { color: tenant.primaryColor || "#0F2B5B", position: 50, opacity: 100 },
                    { color: tenant.primaryColor || "#0F2B5B", position: 100, opacity: 0 }
                ]
            }
        },
    }

    if (tenant.config) {
        try {
            const parsed = JSON.parse(tenant.config) as Partial<SiteConfig>
            return {
                ...defaultConfig,
                ...parsed,
                slug: tenant.slug,
                colors: { ...defaultConfig.colors, ...parsed.colors },
                contact: { ...defaultConfig.contact, ...parsed.contact },
                perfil: {
                    ...defaultConfig.perfil,
                    ...parsed.perfil,
                    imageUrl: tenant.fotoPerfilUrl || parsed.perfil?.imageUrl || ""
                },
                logoUrl: tenant.logoUrl || parsed.logoUrl || "",
            }
        } catch (e) {
            console.error("Failed to parse tenant config JSON:", e)
        }
    }

    return defaultConfig
}

/* ─── Main Page Component ─── */
export default function EditarSitePage() {
    const params = useParams()
    const slug = params.tenant as string
    const [editorConfig, setEditorConfig] = useState<EditorConfig | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [tenantPrimaryColor, setTenantPrimaryColor] = useState("#10b981")
    const [tenantCargo, setTenantCargo] = useState<string | null>(null)

    useEffect(() => {
        getTenantBySlug(slug).then(tenant => {
            if (!tenant) {
                setError("Mandato não encontrado.")
                setLoading(false)
                return
            }

            // Build SiteConfig from tenant, then convert to EditorConfig
            const siteConfig = buildConfigFromTenant(tenant)
            const config = extractEditorConfig(siteConfig)
            setEditorConfig(config)
            setTenantPrimaryColor(tenant.primaryColor || siteConfig.colors?.primary || "#10b981")
            setTenantCargo(tenant.cargo || "Vereador")
            setLoading(false)
        }).catch(err => {
            console.error("Error loading tenant:", err)
            setError("Erro ao carregar dados do mandato.")
            setLoading(false)
        })
    }, [slug])

    const handleSave = async (config: EditorConfig) => {
        // Convert EditorConfig → SiteConfig for persistence
        const siteConfig = editorConfigToSiteConfig(config, slug)
        const result = await updateTenantSiteAction(slug, siteConfig)
        if (!result.success) {
            throw new Error(result.error || "Falha ao salvar")
        }
    }

    const handleUpload = async (file: File) => {
        const formData = new FormData()
        formData.append("file", file)
        const result = await uploadImageAction(formData)
        if (!result.success) {
            throw new Error(result.error || "Erro ao fazer upload da imagem")
        }
        return result.url
    }

    if (error) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="text-center space-y-3">
                    <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto" />
                    <p className="text-sm text-stone-500 font-medium">{error}</p>
                </div>
            </div>
        )
    }

    if (loading || !editorConfig) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="animate-spin h-8 w-8 text-emerald-500" />
                    <p className="text-sm text-stone-400 font-medium">Carregando editor visual...</p>
                </div>
            </div>
        )
    }

    return (
        <SiteEditor
            initialConfig={editorConfig}
            onSave={handleSave}
            onImageUpload={handleUpload}
            previewUrl={`/${slug}`}
            tenantName={editorConfig.header.logoText || slug}
            plugins={mandatoPlugins.filter(p => {
                if (p.id === 'beforeAfter' && tenantCargo?.toLowerCase() === 'vereador') return false;
                return true;
            })}
            autoSave={false}
            autoSaveDelay={2000}
            accentColor={tenantPrimaryColor}
            className="w-full h-full -mx-0 -my-0 lg:-mx-0 lg:-my-0"
        />
    )
}
