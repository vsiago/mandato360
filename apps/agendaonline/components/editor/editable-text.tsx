"use client"

import React, { useCallback, useRef, useEffect } from "react"
import { useEditor } from "@/lib/editor-context"
import { cn } from "@/lib/utils"

interface EditableTextProps {
    fieldPath: string
    elementId: string
    sectionId: string
    as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'div'
    multiline?: boolean
    className?: string
    style?: React.CSSProperties
    children?: React.ReactNode
    [key: string]: unknown
}

/**
 * Inline-editable text.
 *
 * Uses a frozen HTML ref to prevent React from clearing contentEditable text.
 * When editing starts, we snapshot the innerHTML into a ref. All subsequent
 * React re-renders see the same frozen __html value via dangerouslySetInnerHTML,
 * so React never touches the DOM while the user types. When editing ends, the
 * ref is cleared and React resumes control with the updated data value.
 */
export function EditableText({
    fieldPath, elementId, sectionId,
    as: Tag = "span", multiline = false,
    className, style: propStyle, children,
    ...rest
}: EditableTextProps) {
    const {
        data, selectedElement, selectElement, selectSection,
        updateNestedField, getResolvedStyle
    } = useEditor()
    const ref = useRef<HTMLElement>(null)
    const isEditingRef = useRef(false)
    const frozenHtmlRef = useRef<string | null>(null)
    const isSelected = selectedElement === elementId

    // Get current value from data by dot-path
    const getValue = useCallback((): string => {
        const keys = fieldPath.split(".")
        let val: unknown = data
        for (const k of keys) {
            if (val && typeof val === 'object') val = (val as Record<string, unknown>)[k]
            else return ""
        }
        return String(val || "")
    }, [data, fieldPath])

    // Resolved style (base + responsive)
    const resolvedStyle = getResolvedStyle(sectionId, elementId)
    const mergedStyle: React.CSSProperties = { ...propStyle }
    if (resolvedStyle.fontSize) mergedStyle.fontSize = resolvedStyle.fontSize
    if (resolvedStyle.color) mergedStyle.color = resolvedStyle.color
    if (resolvedStyle.fontWeight) mergedStyle.fontWeight = resolvedStyle.fontWeight
    if (resolvedStyle.textAlign) mergedStyle.textAlign = resolvedStyle.textAlign

    const handleClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        if (isEditingRef.current) return // Don't interfere during editing
        selectSection(sectionId as import("@/lib/tenant-types").EditorSectionId)
        selectElement(elementId)
    }, [elementId, sectionId, selectSection, selectElement])

    const handleDoubleClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()

        const el = ref.current
        if (!el || isEditingRef.current) return

        // Freeze the current HTML so React won't overwrite it during re-renders
        frozenHtmlRef.current = el.innerHTML
        isEditingRef.current = true

        // Toggle contentEditable via DOM
        el.contentEditable = "true"

        // Swap CSS classes via DOM
        el.classList.remove("ring-blue-400")
        el.classList.add("ring-amber-400", "bg-white/10", "cursor-text")

        // Focus and place cursor at end
        el.focus()
        try {
            const range = document.createRange()
            range.selectNodeContents(el)
            range.collapse(false)
            const sel = window.getSelection()
            sel?.removeAllRanges()
            sel?.addRange(range)
        } catch { /* ignore range errors */ }
    }, [])

    const finishEditing = useCallback((save: boolean) => {
        const el = ref.current
        if (!el || !isEditingRef.current) return

        const newText = el.innerText

        // Turn off contentEditable via DOM
        el.contentEditable = "false"
        el.classList.remove("ring-amber-400", "bg-white/10", "cursor-text")
        el.classList.add("ring-blue-400")

        isEditingRef.current = false
        frozenHtmlRef.current = null

        if (save && newText !== getValue()) {
            updateNestedField(fieldPath, newText)
        } else if (!save) {
            el.innerText = getValue()
        }
    }, [fieldPath, getValue, updateNestedField])

    const handleBlur = useCallback(() => {
        finishEditing(true)
    }, [finishEditing])

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (!isEditingRef.current) return
        if (e.key === 'Enter' && !multiline) {
            e.preventDefault()
            finishEditing(true)
        }
        if (e.key === 'Escape') {
            e.preventDefault()
            finishEditing(false)
        }
    }, [multiline, finishEditing])

    // Cleanup: if component unmounts while editing
    useEffect(() => {
        return () => {
            if (isEditingRef.current && ref.current) {
                ref.current.contentEditable = "false"
                isEditingRef.current = false
                frozenHtmlRef.current = null
            }
        }
    }, [])

    const currentValue = getValue()
    const fallback = typeof children === 'string' ? children : ''
    const TagEl = Tag as React.ElementType

    // If editing, always serve the frozen snapshot so React never diffs/overwrites the DOM.
    // If not editing, render the live data value.
    const htmlContent = frozenHtmlRef.current !== null
        ? frozenHtmlRef.current
        : (currentValue || fallback)

    return (
        <TagEl
            ref={ref}
            data-element-id={elementId}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            suppressContentEditableWarning
            className={cn(
                "relative transition-all duration-150 outline-none",
                isSelected && "ring-2 ring-blue-400 ring-offset-1 rounded-sm",
                !isSelected && "hover:ring-1 hover:ring-blue-300/50 hover:rounded-sm cursor-pointer",
                className
            )}
            style={mergedStyle}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
    )
}
