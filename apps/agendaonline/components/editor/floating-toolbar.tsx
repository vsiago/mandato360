"use client"

import React, { useEffect, useRef, useState } from "react"
import { useEditor } from "@/lib/editor-context"
import {
    Bold, Italic, Underline as UnderlineIcon, AlignLeft, AlignCenter, AlignRight,
    Type, Palette, Minus, Plus, Smartphone, Tablet, Monitor
} from "lucide-react"
import { cn } from "@/lib/utils"

export function FloatingToolbar() {
    const {
        selectedElement, selectedSection, data,
        updateResponsiveStyle, getResolvedStyle, breakpoint, setBreakpoint
    } = useEditor()
    const toolbarRef = useRef<HTMLDivElement>(null)
    const [position, setPosition] = useState({ top: 0, left: 0 })
    const [visible, setVisible] = useState(false)

    // Position the toolbar near the selected element
    // NOTE: We intentionally avoid MutationObserver here because editing text
    // modifies DOM attributes (contentEditable, classList) which would trigger
    // the observer in an infinite loop, freezing the browser.
    useEffect(() => {
        if (!selectedElement) {
            setVisible(false)
            return
        }

        let rafId: number
        let lastTop = 0
        let lastLeft = 0

        const updatePosition = () => {
            const el = document.querySelector(`[data-element-id="${selectedElement}"]`)
            if (!el) { setVisible(false); return }

            const rect = el.getBoundingClientRect()
            const toolbarHeight = 52
            const top = Math.max(8, rect.top - toolbarHeight - 8)
            const left = Math.max(8, rect.left + rect.width / 2)

            // Only update state if position actually changed (avoids unnecessary re-renders)
            if (top !== lastTop || left !== lastLeft) {
                lastTop = top
                lastLeft = left
                setPosition({ top, left })
            }
            setVisible(true)
        }

        // Poll position via rAF — lightweight and avoids MutationObserver issues
        const poll = () => {
            updatePosition()
            rafId = requestAnimationFrame(poll)
        }

        updatePosition()
        rafId = requestAnimationFrame(poll)

        const onScroll = () => updatePosition()
        window.addEventListener("scroll", onScroll, true)
        window.addEventListener("resize", onScroll)

        return () => {
            cancelAnimationFrame(rafId)
            window.removeEventListener("scroll", onScroll, true)
            window.removeEventListener("resize", onScroll)
        }
    }, [selectedElement])

    if (!selectedElement || !selectedSection || !visible) return null

    const resolved = getResolvedStyle(selectedSection, selectedElement)
    const fontSize = resolved.fontSize || 16
    const color = resolved.color || ""

    const updateStyle = (style: Parameters<typeof updateResponsiveStyle>[3]) => {
        updateResponsiveStyle(breakpoint, selectedSection!, selectedElement!, style)
    }

    return (
        <div
            ref={toolbarRef}
            className="fixed z-[9999] pointer-events-auto"
            style={{ top: position.top, left: position.left, transform: "translateX(-50%)" }}
        >
            <div className="bg-stone-900 text-white rounded-xl shadow-2xl border border-stone-700/50 backdrop-blur-xl px-1.5 py-1 flex items-center gap-0.5 animate-in fade-in slide-in-from-bottom-2 duration-200">

                {/* Font size controls */}
                <div className="flex items-center gap-0.5 px-1.5 border-r border-stone-700/50 mr-0.5">
                    <Type className="h-3 w-3 text-stone-400 mr-1" />
                    <button
                        onClick={() => updateStyle({ fontSize: Math.max(8, fontSize - 1) })}
                        className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-stone-700 transition-colors"
                    >
                        <Minus className="h-3 w-3" />
                    </button>
                    <input
                        type="number"
                        value={fontSize}
                        onChange={e => updateStyle({ fontSize: Number(e.target.value) || 16 })}
                        className="w-10 h-7 bg-stone-800 border-none rounded-lg text-center text-xs font-mono focus:ring-1 focus:ring-blue-400 outline-none"
                    />
                    <button
                        onClick={() => updateStyle({ fontSize: fontSize + 1 })}
                        className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-stone-700 transition-colors"
                    >
                        <Plus className="h-3 w-3" />
                    </button>
                </div>

                {/* Text formatting */}
                <div className="flex items-center gap-0.5 border-r border-stone-700/50 mr-0.5 px-0.5">
                    {[
                        { icon: Bold, weight: "bold", label: "Bold" },
                        { icon: Italic, weight: "italic", label: "Italic" },
                    ].map(({ icon: Icon, weight, label }) => (
                        <button
                            key={weight}
                            onClick={() => updateStyle({ fontWeight: resolved.fontWeight === weight ? "normal" : weight })}
                            title={label}
                            className={cn(
                                "h-7 w-7 rounded-lg flex items-center justify-center transition-colors",
                                resolved.fontWeight === weight ? "bg-blue-500/30 text-blue-300" : "hover:bg-stone-700"
                            )}
                        >
                            <Icon className="h-3.5 w-3.5" />
                        </button>
                    ))}
                </div>

                {/* Text alignment */}
                <div className="flex items-center gap-0.5 border-r border-stone-700/50 mr-0.5 px-0.5">
                    {[
                        { icon: AlignLeft, align: "left" as const },
                        { icon: AlignCenter, align: "center" as const },
                        { icon: AlignRight, align: "right" as const },
                    ].map(({ icon: Icon, align }) => (
                        <button
                            key={align}
                            onClick={() => updateStyle({ textAlign: align })}
                            className={cn(
                                "h-7 w-7 rounded-lg flex items-center justify-center transition-colors",
                                resolved.textAlign === align ? "bg-blue-500/30 text-blue-300" : "hover:bg-stone-700"
                            )}
                        >
                            <Icon className="h-3.5 w-3.5" />
                        </button>
                    ))}
                </div>

                {/* Color picker */}
                <div className="flex items-center gap-1 border-r border-stone-700/50 mr-0.5 px-1.5">
                    <Palette className="h-3 w-3 text-stone-400" />
                    <div className="relative">
                        <div
                            className="h-6 w-6 rounded-md border-2 border-stone-600 cursor-pointer"
                            style={{ backgroundColor: color || "#ffffff" }}
                        />
                        <input
                            type="color"
                            value={color || "#ffffff"}
                            onChange={e => updateStyle({ color: e.target.value })}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                    </div>
                </div>

                {/* Responsive breakpoint toggle */}
                <div className="flex items-center gap-0.5 px-0.5">
                    {([
                        { bp: "mobile" as const, icon: Smartphone },
                        { bp: "tablet" as const, icon: Tablet },
                        { bp: "desktop" as const, icon: Monitor },
                    ]).map(({ bp, icon: Icon }) => (
                        <button
                            key={bp}
                            onClick={() => setBreakpoint(bp)}
                            title={`Editar para ${bp}`}
                            className={cn(
                                "h-7 w-7 rounded-lg flex items-center justify-center transition-colors",
                                breakpoint === bp ? "bg-amber-500/30 text-amber-300" : "hover:bg-stone-700 text-stone-400"
                            )}
                        >
                            <Icon className="h-3.5 w-3.5" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
