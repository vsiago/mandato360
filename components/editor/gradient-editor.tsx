"use client"

import React, { useCallback } from "react"
import { useEditor } from "@/lib/editor/context"
import { GradientStop, Gradient } from "@/lib/editor/types"
import { Plus, Trash2, RotateCw } from "lucide-react"
import { cn } from "@/lib/utils"

const GRADIENT_PRESETS = [
    { name: "Escuro suave", stops: [{ color: "#1a1a2e", position: 0, opacity: 100 }, { color: "#16213e", position: 50, opacity: 80 }, { color: "#0f3460", position: 100, opacity: 60 }], angle: 180 },
    { name: "Dourado quente", stops: [{ color: "#3e270a", position: 0, opacity: 100 }, { color: "#8c6239", position: 50, opacity: 70 }, { color: "#eec584", position: 100, opacity: 40 }], angle: 135 },
    { name: "Transparente", stops: [{ color: "#000000", position: 0, opacity: 80 }, { color: "#000000", position: 100, opacity: 0 }], angle: 180 },
    { name: "Rose premium", stops: [{ color: "#2d1b30", position: 0, opacity: 100 }, { color: "#6b2462", position: 50, opacity: 70 }, { color: "#d4a0c0", position: 100, opacity: 30 }], angle: 150 },
    { name: "Noite estrelada", stops: [{ color: "#0c0c1d", position: 0, opacity: 100 }, { color: "#1b1b3a", position: 60, opacity: 90 }, { color: "#3d3d7a", position: 100, opacity: 60 }], angle: 170 },
]

interface GradientEditorProps {
    sectionId: string
    hideAngle?: boolean
}

export interface GenericGradientEditorProps {
    value: Gradient
    onChange: (gradient: Gradient) => void
    previewCssBuilder?: (gradient: Gradient) => string
    hideAngle?: boolean
}

export function GenericGradientEditor({ value, onChange, previewCssBuilder, hideAngle }: GenericGradientEditorProps) {
    const stops = value.stops || []
    const angle = value.angle ?? 180

    const updateGradient = useCallback((newStops: GradientStop[], newAngle?: number) => {
        onChange({ angle: newAngle ?? angle, stops: newStops })
    }, [angle, onChange])

    const updateStop = useCallback((index: number, updates: Partial<GradientStop>) => {
        const newStops = stops.map((s, i) => i === index ? { ...s, ...updates } : s)
        updateGradient(newStops)
    }, [stops, updateGradient])

    const addStop = useCallback(() => {
        const newStop: GradientStop = { color: "#888888", position: 50, opacity: 100 }
        updateGradient([...stops, newStop])
    }, [stops, updateGradient])

    const removeStop = useCallback((index: number) => {
        if (stops.length <= 2) return
        updateGradient(stops.filter((_, i) => i !== index))
    }, [stops, updateGradient])

    const setAngle = useCallback((deg: number) => {
        updateGradient(stops, deg)
    }, [stops, updateGradient])

    const applyPreset = useCallback((preset: typeof GRADIENT_PRESETS[0]) => {
        onChange({ angle: preset.angle, stops: [...preset.stops] })
    }, [onChange])

    // Build CSS preview
    let gradientCSS = `linear-gradient(${angle}deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)`
    if (previewCssBuilder) {
        gradientCSS = previewCssBuilder(value)
    } else {
        const sortedStops = [...stops].sort((a, b) => a.position - b.position)
        const stopsCSS = sortedStops.map(s => {
            const r = parseInt(s.color.slice(1, 3), 16) || 0
            const g = parseInt(s.color.slice(3, 5), 16) || 0
            const b = parseInt(s.color.slice(5, 7), 16) || 0
            return `rgba(${r},${g},${b},${s.opacity / 100}) ${s.position}%`
        }).join(', ')
        gradientCSS = `linear-gradient(${angle}deg, ${stopsCSS})`
    }

    return (
        <div className="space-y-4">
            {/* Live preview */}
            <div
                className="h-16 rounded-xl border shadow-inner overflow-hidden"
                style={{ background: gradientCSS }}
            />

            {/* Angle control */}
            {!hideAngle && (
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                        <RotateCw className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-[10px] font-medium text-muted-foreground">Ângulo</span>
                    </div>
                    <input
                        type="range"
                        min={0} max={360} value={angle}
                        onChange={e => setAngle(Number(e.target.value))}
                        className="flex-1 h-1.5 appearance-none bg-muted rounded-full accent-emerald-500 cursor-pointer"
                    />
                    <input
                        type="number"
                        min={0} max={360} value={angle}
                        onChange={e => setAngle(Number(e.target.value))}
                        className="w-14 h-7 bg-muted border-none rounded-lg text-center text-xs font-mono"
                    />
                    <span className="text-[10px] text-muted-foreground">°</span>
                </div>
            )}

            {/* Stops */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Pontos do gradiente</p>
                    <button
                        onClick={addStop}
                        className="h-6 px-2 rounded-md bg-muted hover:bg-muted/80 transition-colors flex items-center gap-1 text-[10px] font-medium"
                    >
                        <Plus className="h-3 w-3" /> Adicionar
                    </button>
                </div>

                {stops.map((stop, i) => (
                    <div key={i} className="bg-muted/40 rounded-xl p-3 space-y-2">
                        <div className="flex items-center gap-2">
                            {/* Color + swatch */}
                            <div className="relative">
                                <div className="h-8 w-8 rounded-lg border-2 border-stone-100 shadow-sm" style={{ backgroundColor: stop.color }} />
                                <input
                                    type="color"
                                    value={stop.color}
                                    onChange={e => updateStop(i, { color: e.target.value })}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </div>
                            <input
                                type="text"
                                value={stop.color}
                                onChange={e => updateStop(i, { color: e.target.value })}
                                className="flex-1 h-7 bg-white dark:bg-stone-800 border border-stone-100 rounded-lg px-2 text-xs font-mono"
                            />
                            {stops.length > 2 && (
                                <button
                                    onClick={() => removeStop(i)}
                                    className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                                >
                                    <Trash2 className="h-3 w-3" />
                                </button>
                            )}
                        </div>

                        {/* Position slider */}
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] text-muted-foreground w-10 shrink-0">Posição</span>
                            <input
                                type="range"
                                min={0} max={100} value={stop.position}
                                onChange={e => updateStop(i, { position: Number(e.target.value) })}
                                className="flex-1 h-1 appearance-none bg-muted rounded-full accent-emerald-500 cursor-pointer"
                            />
                            <span className="text-[10px] font-mono text-muted-foreground w-8 text-right">{stop.position}%</span>
                        </div>

                        {/* Opacity slider */}
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] text-muted-foreground w-10 shrink-0">Opacid.</span>
                            <input
                                type="range"
                                min={0} max={100} value={stop.opacity}
                                onChange={e => updateStop(i, { opacity: Number(e.target.value) })}
                                className="flex-1 h-1 appearance-none bg-muted rounded-full accent-emerald-500 cursor-pointer"
                            />
                            <span className="text-[10px] font-mono text-muted-foreground w-8 text-right">{stop.opacity}%</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Presets */}
            <div className="space-y-2">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Presets rápidos</p>
                <div className="grid grid-cols-2 gap-2">
                    {GRADIENT_PRESETS.map((preset, i) => {
                        const sortedStops = [...preset.stops].sort((a, b) => a.position - b.position)
                        const cssStops = sortedStops.map(s => {
                            const r = parseInt(s.color.slice(1, 3), 16) || 0
                            const g = parseInt(s.color.slice(3, 5), 16) || 0
                            const b = parseInt(s.color.slice(5, 7), 16) || 0
                            return `rgba(${r},${g},${b},${s.opacity / 100}) ${s.position}%`
                        }).join(', ')
                        return (
                            <button
                                key={i}
                                onClick={() => applyPreset(preset)}
                                className="group text-left rounded-xl border border-stone-100 overflow-hidden hover:ring-2 hover:ring-emerald-400 transition-all"
                            >
                                <div
                                    className="h-8 w-full"
                                    style={{ background: `linear-gradient(${preset.angle}deg, ${cssStops})` }}
                                />
                                <p className="px-2 py-1 text-[9px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                    {preset.name}
                                </p>
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

// Keep the old GradientEditor as a wrapper for backward compatibility with section editing
export function GradientEditor({ sectionId, hideAngle }: GradientEditorProps) {
    const { getSectionStyle, updateSectionStyle, buildGradientCSS } = useEditor()

    const style = getSectionStyle(sectionId)
    const gradient = style?.gradient || {
        angle: 180, stops: [
            { color: "#000000", position: 0, opacity: 100 },
            { color: "#000000", position: 100, opacity: 0 },
        ]
    }

    return (
        <GenericGradientEditor
            value={gradient}
            onChange={(newGradient) => {
                updateSectionStyle(sectionId, {
                    background: 'gradient',
                    gradient: newGradient
                })
            }}
            previewCssBuilder={() => buildGradientCSS(sectionId) || ""}
            hideAngle={hideAngle}
        />
    )
}
