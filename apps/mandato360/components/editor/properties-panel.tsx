"use client"

import React, { useState } from "react"
import { useEditor } from "@/lib/editor/context"
import { GenericGradientEditor } from "./gradient-editor"
import { cn } from "@/lib/utils"
import {
    Layers, Palette, Image as ImageIcon, Type, Smartphone, Tablet, Monitor,
    PaintBucket, GripVertical, ImagePlus, EyeOff, Eye, Zap, Check, Sparkles,
    SlidersHorizontal, Layout, ChevronRight, MousePointer2
} from "lucide-react"
import { buildGradientString } from "@/lib/editor/style-utils"
import { ImageUpload } from "@/components/ui/image-upload"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Gradient, HeroImageSettings } from "@/lib/editor/types"

const SECTION_LABELS: Record<string, string> = {
    hero: "Topo (Banner Principal)",
    trust: "Faixa de Conquistas",
    projetos: "Ações e Projetos",
    perfil: "Perfil do Vereador",
    beforeAfter: "Resultados (Antes/Depois)",
    faq: "Perguntas Frequentes",
    contact: "Contato e Endereço",
    footer: "Rodapé",
    solicitacoes: "Solicitações",
}

export function PropertiesPanel() {
    const {
        selectedSection, selectedElement, data, updateField,
        updateSectionStyle, getSectionStyle,
        getResolvedStyle, updateResponsiveStyle, breakpoint, setBreakpoint
    } = useEditor()

    const [showUpgradeModal, setShowUpgradeModal] = useState(false)

    if (!selectedSection && !selectedElement) {
        return (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center bg-white dark:bg-stone-950">
                <div className="h-14 w-14 rounded-2xl flex items-center justify-center mb-4 bg-emerald-500/5 border border-emerald-500/10 shadow-sm">
                    <MousePointer2 className="h-6 w-6 text-emerald-500/50" />
                </div>
                <p className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-tighter">Selecione um elemento</p>
                <p className="text-[10px] text-stone-400 mt-1 max-w-48 leading-relaxed font-medium">
                    Clique em qualquer seção ou texto no preview para editar suas propriedades visuais.
                </p>
            </div>
        )
    }

    const sectionStyle = selectedSection ? getSectionStyle(selectedSection) : undefined
    const bgType = sectionStyle?.background || 'solid'
    const bgColor = sectionStyle?.bgColor || ''

    return (
        <div className="h-full flex flex-col bg-white dark:bg-stone-950 border-l border-stone-100 dark:border-stone-800">
            {/* Header */}
            <div className="px-5 py-4 border-b border-stone-100 dark:border-stone-800 shrink-0 bg-stone-50/50 dark:bg-stone-900/20">
                <div className="flex items-center gap-2 mb-1">
                    <SlidersHorizontal className="h-3.5 w-3.5 text-emerald-500" />
                    <p className="text-xs font-black text-stone-900 dark:text-stone-100 uppercase tracking-widest">
                        {selectedElement
                            ? `Texto: ${selectedElement}`
                            : SECTION_LABELS[selectedSection!] || selectedSection
                        }
                    </p>
                </div>
                <p className="text-[10px] text-stone-400 font-medium italic">
                    {selectedElement ? "Edite o estilo do texto selecionado" : "Edite o fundo e espaçamento da seção"}
                </p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-8 custom-scrollbar">

                {/* ─── Section Background Controls ─── */}
                {selectedSection && !selectedElement && (
                    <>
                        {/* === HERO: Dedicated simple panel === */}
                        {selectedSection === 'hero' ? (
                             <div className="space-y-10 hero-master-editor">

                                {/* 🎨 CORES E TRANSIÇÃO (Tons 1, 2, 3) */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Palette className="h-4 w-4 text-emerald-500" />
                                        <p className="text-[10px] font-black text-stone-900 dark:text-stone-100 uppercase tracking-widest">Controle de Tons e Vinheta</p>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/50 border border-stone-100 dark:border-stone-800">
                                        {[1, 2, 3].map((num) => {
                                            const sectionStyle = getSectionStyle('hero')
                                            const settings = data.heroImageSettings
                                            let currentColor = num === 1 ? (sectionStyle?.gradient?.stops[0]?.color ?? data.colors.primary) : (num === 2 ? (sectionStyle?.gradient?.stops[1]?.color ?? data.colors.primary) : (settings?.overlay?.stops[2]?.color ?? data.colors.primary))
                                            let opacityValue = num === 3 ? (settings?.overlay?.stops[2]?.opacity ?? 0) : 100

                                            const updateTone = (val: string) => {
                                                const sStyle = getSectionStyle('hero')
                                                const hSettings = data.heroImageSettings
                                                const isCenter = hSettings?.layout === 'center'
                                                const angle = isCenter ? 0 : 90
                                                const currentPos = sStyle?.gradient?.stops[1]?.position ?? 50

                                                if (num === 1) {
                                                    updateSectionStyle('hero', {
                                                        background: 'gradient',
                                                        gradient: {
                                                            angle,
                                                            stops: [
                                                                { color: val, position: 0, opacity: 100 },
                                                                { color: sStyle?.gradient?.stops[1]?.color ?? data.colors.primary, position: currentPos, opacity: 100 }
                                                            ]
                                                        }
                                                    })
                                                } else if (num === 2) {
                                                    updateSectionStyle('hero', {
                                                        background: 'gradient',
                                                        gradient: { angle, stops: [
                                                            { color: sStyle?.gradient?.stops[0]?.color ?? data.colors.primary, position: 0, opacity: 100 },
                                                            { color: val, position: currentPos, opacity: 100 }
                                                        ]}
                                                    })
                                                    updateField('heroImageSettings', {
                                                        ...hSettings,
                                                        overlay: {
                                                            angle,
                                                            stops: [
                                                                { color: val, position: 0, opacity: 100 },
                                                                { color: val, position: currentPos, opacity: 100 },
                                                                { color: hSettings?.overlay?.stops[2]?.color ?? val, position: 100, opacity: hSettings?.overlay?.stops[2]?.opacity ?? 0 }
                                                            ]
                                                        }
                                                    })
                                                } else if (num === 3) {
                                                    updateField('heroImageSettings', {
                                                        ...hSettings,
                                                        overlay: {
                                                            angle,
                                                            stops: [
                                                                { ...hSettings?.overlay?.stops[0] ?? { color: data.colors.primary, position: 0, opacity: 100 } },
                                                                { ...hSettings?.overlay?.stops[1] ?? { color: data.colors.primary, position: 50, opacity: 100 } },
                                                                { color: val, position: 100, opacity: hSettings?.overlay?.stops[2]?.opacity ?? 0 }
                                                            ]
                                                        }
                                                    })
                                                }
                                            }

                                            return (
                                                <div key={num} className="space-y-2">
                                                    <div className="flex justify-between items-center px-1">
                                                        <span className="text-[8px] font-black text-stone-400 uppercase tracking-tighter">Tom {num}</span>
                                                        {num === 3 && <span className="text-[8px] font-mono font-bold text-emerald-500">{opacityValue}%</span>}
                                                    </div>
                                                    <div className="relative group">
                                                        <div 
                                                            className="h-10 w-full rounded-xl border border-stone-200 shadow-sm cursor-pointer group-hover:ring-2 group-hover:ring-emerald-500/30 transition-all" 
                                                            style={{ backgroundColor: currentColor }} 
                                                        />
                                                        <input 
                                                            type="color" 
                                                            value={currentColor} 
                                                            onChange={(e) => updateTone(e.target.value)}
                                                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    {/* TRANSIÇÃO / VINHETA SLIDER */}
                                    <div className="px-1 space-y-3">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-1.5">
                                                <Sparkles className="h-3 w-3 text-emerald-500" />
                                                <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Ponto de Transição (Vinheta)</span>
                                            </div>
                                            <span className="text-[10px] font-mono font-bold text-emerald-500">{getSectionStyle('hero')?.gradient?.stops[1]?.position ?? 50}%</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min={0} max={100}
                                            value={getSectionStyle('hero')?.gradient?.stops[1]?.position ?? 50}
                                            onChange={(e) => {
                                                const val = Number(e.target.value)
                                                const sStyle = getSectionStyle('hero')
                                                const hSettings = data.heroImageSettings
                                                const isCenter = hSettings?.layout === 'center'
                                                const angle = isCenter ? 0 : 90
                                                
                                                updateSectionStyle('hero', {
                                                    background: 'gradient',
                                                    gradient: {
                                                        angle,
                                                        stops: [
                                                            { ...sStyle?.gradient?.stops[0] ?? { color: data.colors.primary, position: 0, opacity: 100 } },
                                                            { color: sStyle?.gradient?.stops[1]?.color ?? data.colors.primary, position: val, opacity: 100 }
                                                        ]
                                                    }
                                                })
                                                updateField('heroImageSettings', {
                                                    ...hSettings,
                                                    overlay: {
                                                        angle,
                                                        stops: [
                                                            { color: hSettings?.overlay?.stops[0]?.color ?? data.colors.primary, position: 0, opacity: 100 },
                                                            { color: hSettings?.overlay?.stops[1]?.color ?? data.colors.primary, position: val, opacity: 100 },
                                                            { color: hSettings?.overlay?.stops[2]?.color ?? data.colors.primary, position: 100, opacity: hSettings?.overlay?.stops[2]?.opacity ?? 0 }
                                                        ]
                                                    }
                                                })
                                            }}
                                            className="w-full h-1.5 appearance-none bg-stone-100 dark:bg-stone-800 rounded-full accent-emerald-500 cursor-pointer"
                                        />
                                    </div>
                                </div>


                                {/* 📷 FOTO ADAPTATIVA (Zoom, X, Y, Layout) */}
                                <div className="space-y-4 pt-4 border-t border-stone-100 dark:border-stone-800">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <ImageIcon className="h-4 w-4 text-emerald-500" />
                                            <p className="text-[10px] font-black text-stone-900 dark:text-stone-100 uppercase tracking-widest">Foto Adaptativa</p>
                                        </div>
                                        <div className="flex bg-stone-100 p-0.5 rounded-lg border border-stone-200">
                                            {['left', 'center'].map((l) => (
                                                <button
                                                    key={l}
                                                    onClick={() => {
                                                        const s = { positionX: 50, positionY: 20, zoom: 1, ...data.heroImageSettings } as HeroImageSettings
                                                        const isCenter = l === 'center'
                                                        updateField('heroImageSettings', { 
                                                            ...s, 
                                                            layout: l as any,
                                                            overlay: s.overlay ? { ...s.overlay, angle: isCenter ? 0 : 90 } : undefined
                                                        })
                                                        const sectionStyle = getSectionStyle('hero')
                                                        if (sectionStyle?.gradient) {
                                                            updateSectionStyle('hero', {
                                                                gradient: { ...sectionStyle.gradient, angle: isCenter ? 0 : 90 }
                                                            })
                                                        }
                                                    }}
                                                    className={cn(
                                                        "px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-tighter transition-all",
                                                        (data.heroImageSettings?.layout || 'left') === l 
                                                            ? "bg-white text-emerald-600 shadow-sm" 
                                                            : "text-stone-400 hover:text-stone-600"
                                                    )}
                                                >
                                                    {l === 'left' ? 'Esquerda' : 'Centro'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-4">
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
                                                    (newSettings as any)[field] = val
                                                } else {
                                                    const bpKey = breakpoint as 'mobile' | 'tablet'
                                                    if (!newSettings[bpKey]) newSettings[bpKey] = {}
                                                    (newSettings[bpKey] as any)![field] = val
                                                }
                                                updateField('heroImageSettings', newSettings)
                                            }

                                            return (
                                                <div className="space-y-5 p-4 rounded-2xl bg-stone-50/50 dark:bg-stone-900/30 border border-stone-100 dark:border-stone-800">
                                                    {(['positionX', 'positionY', 'zoom'] as const).map(field => (
                                                        <div key={field} className="space-y-2">
                                                            <div className="flex justify-between items-center text-[9px] font-black text-stone-400 uppercase tracking-widest">
                                                                <span>{field === 'positionX' ? 'Alinhamento X' : field === 'positionY' ? 'Alinhamento Y' : 'Zoom da Foto'}</span>
                                                                <span className="text-emerald-500 font-mono">{field === 'zoom' ? `${getValue(field).toFixed(1)}x` : `${getValue(field)}%`}</span>
                                                            </div>
                                                            <input type="range"
                                                                min={field === 'zoom' ? 1 : 0} max={field === 'zoom' ? 3 : 100} step={field === 'zoom' ? 0.1 : 1}
                                                                value={getValue(field)} onChange={e => setValue(field, Number(e.target.value))}
                                                                className="w-full h-1 appearance-none bg-stone-200 dark:bg-stone-800 rounded-full accent-emerald-500 cursor-pointer"
                                                            />
                                                        </div>
                                                    ))}

                                                    {/* Opacidade do Tom 3 (Overlay) */}
                                                    <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                                                        <div className="flex justify-between items-center text-[9px] font-black text-stone-400 uppercase tracking-widest">
                                                            <span>Opacidade da Vinheta (Tom 3)</span>
                                                            <span className="text-emerald-500 font-mono">{(data.heroImageSettings?.overlay?.stops[2]?.opacity ?? 0)}%</span>
                                                        </div>
                                                        <input 
                                                            type="range" 
                                                            min={0} max={100}
                                                            value={data.heroImageSettings?.overlay?.stops[2]?.opacity ?? 0}
                                                            onChange={(e) => {
                                                                const val = Number(e.target.value)
                                                                const hSettings = data.heroImageSettings
                                                                updateField('heroImageSettings', {
                                                                    ...hSettings,
                                                                    overlay: hSettings?.overlay ? {
                                                                        ...hSettings.overlay,
                                                                        stops: [
                                                                            { color: hSettings.overlay.stops[0]?.color ?? data.colors.primary, position: hSettings.overlay.stops[0]?.position ?? 0, opacity: 100 },
                                                                            { color: hSettings.overlay.stops[1]?.color ?? data.colors.primary, position: hSettings.overlay.stops[1]?.position ?? 50, opacity: 100 },
                                                                            { color: hSettings.overlay.stops[2]?.color ?? data.colors.primary, position: 100, opacity: val }
                                                                        ]
                                                                    } : undefined
                                                                })
                                                            }}
                                                            className="w-full h-1 appearance-none bg-stone-200 dark:bg-stone-800 rounded-full accent-emerald-500 cursor-pointer"
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        })()}
                                    </div>
                                </div>

                            </div>
                        ) : (
                            /* === ALL OTHER SECTIONS: Generic controls === */
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                                        <PaintBucket className="h-3.5 w-3.5 text-emerald-500" /> Papel de Parede
                                    </p>

                                    {/* Background type selector */}
                                    <div className="flex gap-1.5 p-1 bg-stone-50 dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800">
                                        {([
                                            { type: "solid" as const, label: "Cor Solida", icon: Palette },
                                            { type: "gradient" as const, label: "Degrade", icon: GripVertical },
                                            { type: "image" as const, label: "Imagem", icon: ImageIcon },
                                        ]).map(({ type, label, icon: Icon }) => (
                                            <button
                                                key={type}
                                                onClick={() => updateSectionStyle(selectedSection, { background: type })}
                                                className={cn(
                                                    "flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all shadow-sm",
                                                    bgType === type
                                                        ? "bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-emerald-600 font-bold"
                                                        : "border-transparent text-stone-400 hover:text-stone-600"
                                                )}
                                            >
                                                <Icon className="h-3.5 w-3.5" />
                                                <span className="text-[8px] font-black uppercase tracking-tighter">{label}</span>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Solid color picker */}
                                    {bgType === 'solid' && (
                                        <div className="flex items-center gap-3 p-3 rounded-xl border border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30">
                                            <div className="relative shrink-0">
                                                <div className="h-10 w-10 rounded-lg border shadow-sm" style={{ backgroundColor: bgColor || '#ffffff' }} />
                                                <input type="color" value={bgColor || '#ffffff'} onChange={e => updateSectionStyle(selectedSection, { bgColor: e.target.value })} className="absolute inset-0 opacity-0 cursor-pointer" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Código Hex</span>
                                                <input type="text" value={bgColor || '#ffffff'} onChange={e => updateSectionStyle(selectedSection, { bgColor: e.target.value })} className="w-full h-8 bg-white dark:bg-stone-800 border border-stone-100 dark:border-stone-700 rounded-lg px-2 text-xs font-mono font-bold" placeholder="#ffffff" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Gradient editor */}
                                    {bgType === 'gradient' && (
                                        <div className="p-4 rounded-xl border border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30">
                                             <GenericGradientEditor 
                                                value={sectionStyle?.gradient || { angle: 180, stops: [{ color: "#ffffff", position: 0, opacity: 100 }, { color: "#f0f0f0", position: 100, opacity: 100 }] }} 
                                                onChange={(g) => updateSectionStyle(selectedSection, { gradient: g })}
                                             />
                                        </div>
                                    )}

                                    {/* Image URL */}
                                    {bgType === 'image' && (
                                        <ImageUpload value={sectionStyle?.bgImage || ''} onChange={url => updateSectionStyle(selectedSection, { bgImage: url })} />
                                    )}
                                </div>

                                {/* Spacing */}
                                <div className="space-y-4 pt-6 border-t border-stone-100 dark:border-stone-800">
                                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Espaçamento Vertical</p>
                                    <div className="space-y-4">
                                        {[
                                            { field: 'paddingTop', label: 'Margem Superior' },
                                            { field: 'paddingBottom', label: 'Margem Inferior' }
                                        ].map(opt => (
                                            <div key={opt.field} className="space-y-1.5">
                                                <div className="flex justify-between items-center text-[9px] font-bold text-stone-500">
                                                    <span>{opt.label}</span>
                                                    <span className="font-mono text-emerald-500">{(sectionStyle as any)?.[opt.field] ?? 40}px</span>
                                                </div>
                                                <input 
                                                    type="range" 
                                                    min={0} max={200} 
                                                    value={(sectionStyle as any)?.[opt.field] ?? 40} 
                                                    onChange={e => updateSectionStyle(selectedSection, { [opt.field]: Number(e.target.value) })} 
                                                    className="w-full h-1 appearance-none bg-stone-100 dark:bg-stone-800 rounded-full accent-emerald-500 cursor-pointer" 
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* ─── Element Text Controls ─── */}
                {selectedElement && selectedSection && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                             <Type className="h-4 w-4 text-emerald-500" />
                             <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Tipografia</p>
                        </div>
                        
                        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 space-y-2">
                            <p className="text-[10px] text-stone-600 dark:text-stone-300 font-medium leading-relaxed">
                                Você está editando o estilo para **{breakpoint.toUpperCase()}**.
                            </p>
                            <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-tighter">
                                Use a barra flutuante no preview para ajustes rápidos.
                            </p>
                        </div>

                        {(() => {
                            const resolved = getResolvedStyle(selectedSection, selectedElement)
                            return (
                                <div className="space-y-6">
                                    {/* Font size */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-[10px] font-black text-stone-400 uppercase tracking-widest">
                                            <span>Tamanho da Fonte</span>
                                            <span className="font-mono text-emerald-500">{resolved.fontSize || 16}px</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="range"
                                                min={8} max={120}
                                                value={resolved.fontSize || 16}
                                                onChange={e => updateResponsiveStyle(breakpoint, selectedSection, selectedElement, { fontSize: Number(e.target.value) })}
                                                className="flex-1 h-1.5 appearance-none bg-stone-100 dark:bg-stone-800 rounded-full accent-emerald-500 cursor-pointer"
                                            />
                                            <input
                                                type="number"
                                                value={resolved.fontSize || 16}
                                                onChange={e => updateResponsiveStyle(breakpoint, selectedSection, selectedElement, { fontSize: Number(e.target.value) })}
                                                className="w-16 h-8 bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-lg text-center text-xs font-mono font-bold"
                                            />
                                        </div>
                                    </div>

                                    {/* Font color */}
                                    <div className="space-y-3">
                                        <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Cor do Texto</span>
                                        <div className="flex items-center gap-3 p-3 rounded-xl border border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30">
                                            <div className="relative shrink-0">
                                                <div
                                                    className="h-10 w-10 rounded-lg border shadow-sm"
                                                    style={{ backgroundColor: resolved.color || '#333333' }}
                                                />
                                                <input
                                                    type="color"
                                                    value={resolved.color || '#333333'}
                                                    onChange={e => updateResponsiveStyle(breakpoint, selectedSection, selectedElement, { color: e.target.value })}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <input
                                                    type="text"
                                                    value={resolved.color || ''}
                                                    onChange={e => updateResponsiveStyle(breakpoint, selectedSection, selectedElement, { color: e.target.value })}
                                                    className="w-full h-8 bg-white dark:bg-stone-800 border border-stone-100 dark:border-stone-700 rounded-lg px-2 text-xs font-mono font-bold"
                                                    placeholder="Cor automática"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Font weight */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Peso / Estilo</label>
                                        <select
                                            value={resolved.fontWeight || "normal"}
                                            onChange={e => updateResponsiveStyle(breakpoint, selectedSection, selectedElement, { fontWeight: e.target.value })}
                                            className="w-full h-10 bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-xl px-3 text-xs font-bold text-stone-700 dark:text-stone-300 focus:outline-emerald-500"
                                        >
                                            <option value="normal">Leve (400)</option>
                                            <option value="500">Médio (500)</option>
                                            <option value="600">Semi-Negrito (600)</option>
                                            <option value="bold">Negrito (700)</option>
                                            <option value="900">Black (900)</option>
                                        </select>
                                    </div>
                                </div>
                            )
                        })()}
                    </div>
                )}

                {/* Tip Section */}
                <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 mt-12 shadow-xl">
                      <div className="flex items-center gap-2 mb-3">
                         <Zap className="h-4 w-4 text-emerald-400 fill-emerald-400" />
                         <span className="text-[10px] font-black text-white uppercase tracking-widest">Dica de Design</span>
                      </div>
                      <p className="text-[10px] text-stone-400 leading-relaxed font-medium italic">
                         Use degradês com o ângulo em 180° para criar profundidade em relação ao Herói (Vereador). Isso ajuda o texto a ficar legível mesmo sobre a foto.
                      </p>
                </div>
            </div>
        </div>
    )
}
