"use client"

import { useEditor } from "@/lib/editor/context"
import { cn } from "@/lib/utils"
import { 
    Bold, Italic, AlignLeft, AlignCenter, AlignRight, 
    Type, Trash2, ChevronLeft, ChevronRight, X
} from "lucide-react"

export function FloatingToolbar() {
    const { selectedElement, selectedSection, updateResponsiveStyle, breakpoint, getResolvedStyle, selectElement } = useEditor()

    if (!selectedElement) return null

    // Find the current style for the specific breakpoint
    const style = getResolvedStyle(selectedSection!, selectedElement)

    const updateStyle = (newStyle: any) => {
        updateResponsiveStyle(breakpoint, selectedSection!, selectedElement, newStyle)
    }

    return (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-1 p-1.5 bg-stone-900 text-white rounded-2xl shadow-2xl border border-white/10 backdrop-blur-xl">
                {/* Text tools */}
                <div className="flex items-center gap-0.5 px-2 border-r border-white/10 mr-1">
                    <button 
                        onClick={() => updateStyle({ fontWeight: style.fontWeight === 'bold' ? 'normal' : 'bold' })}
                        className={cn("p-2 rounded-lg transition-colors hover:bg-white/10", style.fontWeight === 'bold' && "text-emerald-400 bg-white/10")}
                    >
                        <Bold className="h-4 w-4" />
                    </button>
                    <button 
                         onClick={() => updateStyle({ fontWeight: style.fontWeight === 'italic' ? 'normal' : 'italic' })} // Reuse fontWeight for simplicity or add fontStyle to ElementStyle
                        className={cn("p-2 rounded-lg transition-colors hover:bg-white/10", style.fontWeight === 'italic' && "text-emerald-400 bg-white/10")}
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
