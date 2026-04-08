"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { useEditor } from "@/lib/editor/context"
import { EditorSectionId } from "@/lib/editor/types"
import { ImageIcon } from "lucide-react"

interface EditableImageProps {
    fieldPath: string
    elementId: string
    sectionId: EditorSectionId
    className?: string
    style?: React.CSSProperties
    aspectRatio?: string
    children: React.ReactNode
}

export function EditableImage({
    fieldPath,
    elementId,
    sectionId,
    className,
    style,
    children
}: EditableImageProps) {
    const { selectedElement, selectElement, selectSection } = useEditor()
    const isSelected = selectedElement === elementId

    return (
        <div
            className={cn(
                "relative transition-all cursor-pointer overflow-hidden",
                isSelected ? "ring-4 ring-blue-500 z-20" : "hover:ring-2 hover:ring-blue-500/30",
                className
            )}
            style={style}
            onClick={(e) => {
                e.stopPropagation()
                selectSection(sectionId)
                selectElement(elementId)
            }}
        >
            {children}
            
            {/* Image overlay with icon */}
            <div className={cn(
                "absolute inset-0 bg-blue-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
                isSelected && "opacity-100"
            )}>
                <div className="bg-white/90 p-2 rounded-full shadow-lg">
                    <ImageIcon className="h-5 w-5 text-blue-500" />
                </div>
            </div>
        </div>
    )
}
