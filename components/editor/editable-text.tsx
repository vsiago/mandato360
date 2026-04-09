"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { useEditor } from "@/lib/editor/context"
import { EditorSectionId } from "@/lib/editor/types"
import { resolveElementStyle, elementStyleToCSS } from "@/lib/editor/style-utils"

interface EditableTextProps {
    fieldPath: string      // e.g. "heroHeadline" or "contact.phone"
    elementId: string      // Unique ID for responsive overrides
    sectionId: EditorSectionId
    as?: keyof JSX.IntrinsicElements | React.ComponentType<any>
    className?: string
    style?: React.CSSProperties
    multiline?: boolean
    children?: React.ReactNode
}

export function EditableText({
    fieldPath,
    elementId,
    sectionId,
    as: Component = "span",
    className,
    style,
    multiline,
    children
}: EditableTextProps) {
    const { data, selectedElement, selectElement, selectSection, breakpoint, updateNestedField } = useEditor()
    const isSelected = selectedElement === elementId

    // Resolve value from path
    const value = fieldPath.split('.').reduce((obj: any, key) => obj?.[key], data) || children || ""

    // Resolve responsive styles
    const resolvedStyle = resolveElementStyle(data, sectionId, elementId, breakpoint)
    const cssStyles = elementStyleToCSS(resolvedStyle)

    return (
        <Component
            className={cn(
                "relative transition-all cursor-text outline-none inline-block min-w-[2ch]",
                isSelected ? "ring-2 ring-blue-500 ring-offset-2 z-20" : "hover:bg-blue-500/10",
                !value && "opacity-50 border border-dashed border-white/30 px-2 py-1 rounded min-h-[1.5em]",
                className
            )}
            style={{ ...style, ...cssStyles }}
            onClick={(e: React.MouseEvent) => {
                e.stopPropagation()
                selectSection(sectionId)
                selectElement(elementId)
            }}
            contentEditable={isSelected}
            suppressContentEditableWarning
            onBlur={(e: React.FocusEvent<HTMLElement>) => {
                const newValue = e.currentTarget.innerText
                updateNestedField(fieldPath, newValue)
            }}
            onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter' && !multiline) {
                    e.preventDefault()
                    e.currentTarget.blur()
                }
            }}
        >
            {value || "Digite algo..."}
        </Component>
    )
}
