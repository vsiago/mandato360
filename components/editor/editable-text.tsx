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
    const ref = React.useRef<HTMLElement>(null)
    const [isSelected, setIsSelected] = React.useState(selectedElement === elementId)
    const isEditingRef = React.useRef(false)
    const frozenHtmlRef = React.useRef<string | null>(null)

    React.useEffect(() => {
        setIsSelected(selectedElement === elementId)
    }, [selectedElement, elementId])

    // Resolve value from path
    const getValue = () => {
        return fieldPath.split('.').reduce((obj: any, key) => obj?.[key], data) || children || ""
    }

    const value = getValue()

    // Resolve responsive styles
    const resolvedStyle = resolveElementStyle(data, sectionId, elementId, breakpoint)
    const cssStyles = elementStyleToCSS(resolvedStyle)

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (isEditingRef.current) return
        selectSection(sectionId)
        selectElement(elementId)
    }

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        const el = ref.current
        if (!el || isEditingRef.current) return

        frozenHtmlRef.current = el.innerHTML
        isEditingRef.current = true
        el.contentEditable = "true"
        el.focus()

        // Place cursor at end
        try {
            const range = document.createRange()
            range.selectNodeContents(el)
            range.collapse(false)
            const sel = window.getSelection()
            sel?.removeAllRanges()
            sel?.addRange(range)
        } catch (e) {}
    }

    const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
        const el = e.currentTarget
        const newValue = el.innerText
        el.contentEditable = "false"
        isEditingRef.current = false
        frozenHtmlRef.current = null
        updateNestedField(fieldPath, newValue)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !multiline) {
            e.preventDefault()
            e.currentTarget.blur()
        }
    }

    const htmlContent = frozenHtmlRef.current !== null ? frozenHtmlRef.current : (value || (isSelected ? "" : "Digite algo..."))

    return (
        <Component
            ref={ref}
            className={cn(
                "relative transition-all cursor-text outline-none inline-block min-w-[2ch]",
                isSelected ? "ring-2 ring-blue-500 ring-offset-2 z-20" : "hover:bg-blue-500/10",
                !value && !isEditingRef.current && "opacity-50 border border-dashed border-white/30 px-2 py-1 rounded min-h-[1.5em]",
                className
            )}
            style={{ ...style, ...cssStyles }}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            suppressContentEditableWarning
            dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
    )
}
