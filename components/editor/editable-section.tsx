"use client"

import { cn } from "@/lib/utils"
import { useEditor } from "@/lib/editor/context"
import { EditorSectionId } from "@/lib/editor/types"

interface EditableSectionProps {
    sectionId: EditorSectionId
    label: string
    children: React.ReactNode
    className?: string
}

export function EditableSection({ sectionId, label, children, className }: EditableSectionProps) {
    const { selectedSection, selectSection, selectElement } = useEditor()
    const isSelected = selectedSection === sectionId

    return (
        <div
            data-section-id={sectionId}
            className={cn(
                "group/section relative transition-all duration-300",
                isSelected ? "ring-2 ring-blue-500 ring-offset-4 z-10" : "hover:ring-1 hover:ring-blue-500/30",
                className
            )}
            onClick={(e) => {
                e.stopPropagation()
                selectSection(sectionId)
                selectElement(null)
            }}
        >
            {children}
            
            {/* Section overlay hover */}
            {(!isSelected) && (
                <div className="absolute inset-0 bg-blue-500/0 group-hover/section:bg-blue-500/5 pointer-events-none" />
            )}
        </div>
    )
}
