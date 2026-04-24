"use client"

import React, { useCallback } from "react"
import { useEditor } from "@/lib/editor-context"
import type { EditorSectionId } from "@/lib/tenant-types"
import { cn } from "@/lib/utils"

interface EditableSectionProps {
    sectionId: EditorSectionId
    label: string
    children: React.ReactNode
    className?: string
    style?: React.CSSProperties
}

export function EditableSection({ sectionId, label, children, className, style: propStyle }: EditableSectionProps) {
    const { selectedSection, selectSection, selectElement, getSectionStyle, buildGradientCSS } = useEditor()
    const isSelected = selectedSection === sectionId

    const handleClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        selectSection(sectionId)
        selectElement(null)
    }, [sectionId, selectSection, selectElement])

    // Compute dynamic background style from section styles
    const sectionStyle = getSectionStyle(sectionId)
    const gradientCSS = buildGradientCSS(sectionId)
    const dynamicStyle: React.CSSProperties = { ...propStyle }

    if (sectionStyle) {
        if (sectionStyle.background === 'solid' && sectionStyle.bgColor) {
            dynamicStyle.backgroundColor = sectionStyle.bgColor
        } else if (sectionStyle.background === 'gradient' && gradientCSS) {
            dynamicStyle.background = gradientCSS
        } else if (sectionStyle.background === 'image' && sectionStyle.bgImage) {
            dynamicStyle.backgroundImage = `url(${sectionStyle.bgImage})`
            dynamicStyle.backgroundSize = 'cover'
            dynamicStyle.backgroundPosition = 'center'
        }
        if (sectionStyle.paddingTop !== undefined) dynamicStyle.paddingTop = sectionStyle.paddingTop
        if (sectionStyle.paddingBottom !== undefined) dynamicStyle.paddingBottom = sectionStyle.paddingBottom
    }

    return (
        <div
            data-section-id={sectionId}
            onClick={handleClick}
            className={cn(
                "relative group/section transition-all duration-200 cursor-pointer",
                isSelected && "ring-2 ring-blue-500 ring-offset-2 ring-offset-transparent",
                !isSelected && "hover:ring-1 hover:ring-blue-400/40",
                className
            )}
            style={dynamicStyle}
        >
            {/* Section label */}
            <div className={cn(
                "absolute -top-6 left-2 z-50 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all duration-200 pointer-events-none whitespace-nowrap",
                isSelected
                    ? "bg-blue-500 text-white opacity-100"
                    : "bg-blue-500/80 text-white opacity-0 group-hover/section:opacity-100"
            )}>
                {label}
            </div>

            {children}
        </div>
    )
}
