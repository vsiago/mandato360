"use client"

import React, { useCallback, useState } from "react"
import { useEditor } from "@/lib/editor-context"
import { cn } from "@/lib/utils"
import { Camera, Link2 } from "lucide-react"

interface EditableImageProps {
    fieldPath: string
    elementId: string
    sectionId: string
    className?: string
    children: React.ReactNode // The actual image element
}

export function EditableImage({ fieldPath, elementId, sectionId, className, children }: EditableImageProps) {
    const { selectedElement, selectElement, selectSection, updateNestedField } = useEditor()
    const isSelected = selectedElement === elementId
    const [showUrlInput, setShowUrlInput] = useState(false)
    const [tempUrl, setTempUrl] = useState("")

    const handleClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        selectSection(sectionId as import("@/lib/tenant-types").EditorSectionId)
        selectElement(elementId)
    }, [elementId, sectionId, selectSection, selectElement])

    const handleDoubleClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        setShowUrlInput(true)
    }, [])

    const handleSaveUrl = useCallback(() => {
        if (tempUrl.trim()) {
            updateNestedField(fieldPath, tempUrl.trim())
        }
        setShowUrlInput(false)
        setTempUrl("")
    }, [tempUrl, fieldPath, updateNestedField])

    return (
        <div
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            className={cn(
                "relative group/image transition-all duration-200 cursor-pointer",
                isSelected && "ring-2 ring-blue-500 ring-offset-1",
                !isSelected && "hover:ring-1 hover:ring-blue-400/40",
                className
            )}
        >
            {children}

            {/* Hover overlay */}
            <div className={cn(
                "absolute inset-0 bg-black/40 flex items-center justify-center gap-2 transition-opacity duration-200 z-10 pointer-events-none",
                isSelected ? "opacity-50" : "opacity-0 group-hover/image:opacity-100"
            )}>
                <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2 shadow-lg">
                    <Camera className="h-4 w-4 text-stone-700" />
                    <span className="text-xs font-medium text-stone-700">Duplo-clique para trocar</span>
                </div>
            </div>

            {/* URL input dialog */}
            {showUrlInput && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20" onClick={e => e.stopPropagation()}>
                    <div className="bg-card rounded-xl p-4 shadow-2xl max-w-sm w-full mx-4 space-y-3">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <Link2 className="h-4 w-4" />
                            <span>URL da Imagem</span>
                        </div>
                        <input
                            type="url"
                            value={tempUrl}
                            onChange={e => setTempUrl(e.target.value)}
                            placeholder="https://exemplo.com/imagem.jpg"
                            className="w-full h-9 px-3 bg-muted border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-400"
                            autoFocus
                            onKeyDown={e => {
                                if (e.key === 'Enter') handleSaveUrl()
                                if (e.key === 'Escape') { setShowUrlInput(false); setTempUrl("") }
                            }}
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={() => { setShowUrlInput(false); setTempUrl("") }}
                                className="flex-1 h-8 rounded-lg text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveUrl}
                                className="flex-1 h-8 rounded-lg text-xs font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                            >
                                Aplicar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
