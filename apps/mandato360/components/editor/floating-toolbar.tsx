"use client"

import { useEditor } from "@/lib/editor/context"
import { cn } from "@/lib/utils"
import { 
    Bold, Italic, AlignLeft, AlignCenter, AlignRight, 
    Type, Trash2, ChevronLeft, ChevronRight, X, Palette
} from "lucide-react"
import { CURATED_FONTS } from "@/lib/editor/fonts"
import { useState } from "react"

export function FloatingToolbar() {
    const { selectedElement, selectedSection, updateResponsiveStyle, breakpoint, getResolvedStyle, selectElement } = useEditor()
    const [showFonts, setShowFonts] = useState(false)

    if (!selectedElement) return null

    // Find the current style for the specific breakpoint
    const style = getResolvedStyle(selectedSection!, selectedElement)

    const updateStyle = (newStyle: any) => {
        updateResponsiveStyle(breakpoint, selectedSection!, selectedElement, newStyle)
    }

    return (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] animate-in slide-in-from-bottom-4 duration-300">
            {/* Font selector sub-menu */}
            {showFonts && (
                <div className="absolute bottom-full mb-3 left-0 w-48 bg-stone-900 border border-white/10 rounded-2xl p-2 shadow-2xl max-h-64 overflow-y-auto no-scrollbar">
                    <p className="px-3 py-1 text-[9px] font-black uppercase text-white/40 mb-1">Escolha a Fonte</p>
                    <div className="grid grid-cols-1 gap-1">
                        {CURATED_FONTS.map(f => (
                            <button
                                key={f.family}
                                onClick={() => { updateStyle({ fontFamily: f.family }); setShowFonts(false) }}
                                className={cn(
                                    "px-3 py-2 text-left rounded-xl text-xs transition-colors hover:bg-white/10 text-white",
                                    style.fontFamily === f.family && "bg-white/10 text-emerald-400"
                                )}
                                style={{ fontFamily: f.family }}
                            >
                                {f.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex items-center gap-1 p-1.5 bg-stone-900 text-white rounded-2xl shadow-2xl border border-white/10 backdrop-blur-xl">
                {/* Font Selector Trigger */}
                <button 
                    onClick={() => setShowFonts(!showFonts)}
                    className={cn("p-2 rounded-lg transition-colors hover:bg-white/10 flex items-center gap-2 px-3 border-r border-white/10 mr-1", showFonts && "bg-white/10 text-emerald-400")}
                >
                    <Type className="h-4 w-4" />
                    <span className="text-[10px] font-bold truncate max-w-[60px]">{style.fontFamily || "Padrão"}</span>
                </button>

                {/* Text tools */}
                <div className="flex items-center gap-0.5 px-2 border-r border-white/10 mr-1">
                    <button 
                        onClick={() => updateStyle({ fontWeight: style.fontWeight === 'bold' ? 'normal' : 'bold' })}
                        className={cn("p-2 rounded-lg transition-colors hover:bg-white/10", style.fontWeight === 'bold' && "text-emerald-400 bg-white/10")}
                    >
                        <Bold className="h-4 w-4" />
                    </button>
                    <button 
                         onClick={() => updateStyle({ fontStyle: style.fontStyle === 'italic' ? 'normal' : 'italic' })}
                        className={cn("p-2 rounded-lg transition-colors hover:bg-white/10", (style.fontStyle === 'italic' || style.fontWeight === 'italic') && "text-emerald-400 bg-white/10")}
                    >
                        <Italic className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex items-center gap-0.5 px-2 border-r border-white/10 mr-1">
                    {([
                        { id: 'left', icon: AlignLeft },
                        { id: 'center', icon: AlignCenter },
                        { id: 'right', icon: AlignRight }
                    ] as const).map((opt) => (
                        <button 
                            key={opt.id}
                            onClick={() => updateStyle({ textAlign: opt.id })}
                            className={cn("p-2 rounded-lg transition-colors hover:bg-white/10", style.textAlign === opt.id && "text-emerald-400 bg-white/10")}
                        >
                            <opt.icon className="h-4 w-4" />
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3 px-3">
                    <div className="flex items-center gap-2">
                         <span className="text-[10px] font-black uppercase text-white/40">Size</span>
                         <div className="flex items-center gap-1.5 bg-white/5 rounded-lg px-2 py-1">
                            <button onClick={() => updateStyle({ fontSize: (style.fontSize || 16) - 1 })} className="p-0.5"><ChevronLeft className="h-3 w-3" /></button>
                            <span className="text-[10px] font-mono font-bold w-4 text-center">{style.fontSize || 16}</span>
                            <button onClick={() => updateStyle({ fontSize: (style.fontSize || 16) + 1 })} className="p-0.5"><ChevronRight className="h-3 w-3" /></button>
                         </div>
                    </div>
                </div>

                <button 
                    onClick={() => selectElement(null)}
                    className="p-2 ml-2 hover:bg-white/10 rounded-lg text-white/50 hover:text-white"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}
