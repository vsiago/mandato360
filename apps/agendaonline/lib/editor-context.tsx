"use client"

import React, { createContext, useContext, useState, useCallback, useRef } from "react"
import type { TenantData, SectionStyle, ElementStyle, Breakpoint, EditorSectionId, GradientStop } from "@/lib/tenant-types"
import { saveTenant } from "@/lib/tenant-api"
import { buildGradientCSS as buildGradientCSSUtil } from "@/lib/style-utils"
import { toast } from "sonner"

/* ─── Editor State ─── */
export interface EditorState {
    data: TenantData
    originalData: TenantData
    isDirty: boolean
    selectedSection: EditorSectionId | null
    selectedElement: string | null  // e.g. "hero-title", "about-bio"
    breakpoint: Breakpoint
    saving: boolean
    saved: boolean
    isPremium: boolean
}

export interface EditorActions {
    /* Data mutations */
    updateField: <K extends keyof TenantData>(key: K, value: TenantData[K]) => void
    updateNestedField: (path: string, value: string) => void
    updateSectionStyle: (sectionId: string, style: Partial<SectionStyle>) => void
    updateElementStyle: (sectionId: string, elementId: string, style: Partial<ElementStyle>) => void
    updateResponsiveStyle: (breakpoint: Breakpoint, sectionId: string, elementId: string, style: Partial<ElementStyle>) => void

    /* Selection */
    selectSection: (id: EditorSectionId | null) => void
    selectElement: (id: string | null) => void

    /* Breakpoint */
    setBreakpoint: (bp: Breakpoint) => void

    /* Persistence */
    save: () => Promise<void>
    resetDirty: () => void

    /* Get resolved style (merge base + responsive override) */
    getResolvedStyle: (sectionId: string, elementId: string) => ElementStyle
    getSectionStyle: (sectionId: string) => SectionStyle | undefined

    /* Gradient helpers */
    buildGradientCSS: (sectionId: string) => string | undefined
}

const EditorContext = createContext<(EditorState & EditorActions) | null>(null)

export function useEditor() {
    const ctx = useContext(EditorContext)
    if (!ctx) throw new Error("useEditor must be used within EditorProvider")
    return ctx
}

/* ─── Provider ─── */
export function EditorProvider({ initialData, children }: { initialData: TenantData; children: React.ReactNode }) {
    const [data, setData] = useState<TenantData>(initialData)
    const originalRef = useRef<TenantData>(initialData)
    const [isDirty, setIsDirty] = useState(false)
    const [selectedSection, setSelectedSection] = useState<EditorSectionId | null>(null)
    const [selectedElement, setSelectedElement] = useState<string | null>(null)
    const [breakpoint, setBreakpoint] = useState<Breakpoint>("desktop")
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    const markDirty = useCallback(() => {
        setIsDirty(true)
        setSaved(false)
    }, [])

    /* ─── Data mutations ─── */
    const updateField = useCallback(<K extends keyof TenantData>(key: K, value: TenantData[K]) => {
        setData(prev => ({ ...prev, [key]: value }))
        markDirty()
    }, [markDirty])

    const updateNestedField = useCallback((path: string, value: string) => {
        setData(prev => {
            const keys = path.split(".")
            const newData = { ...prev } as Record<string, unknown>
            let obj = newData
            for (let i = 0; i < keys.length - 1; i++) {
                obj[keys[i]] = { ...(obj[keys[i]] as Record<string, unknown>) }
                obj = obj[keys[i]] as Record<string, unknown>
            }
            obj[keys[keys.length - 1]] = value
            return newData as TenantData
        })
        markDirty()
    }, [markDirty])

    const updateSectionStyle = useCallback((sectionId: string, style: Partial<SectionStyle>) => {
        setData(prev => {
            const existing = prev.sectionStyles || {}
            const current = existing[sectionId] || { background: 'solid' }
            return {
                ...prev,
                sectionStyles: {
                    ...existing,
                    [sectionId]: { ...current, ...style }
                }
            }
        })
        markDirty()
    }, [markDirty])

    const updateElementStyle = useCallback((sectionId: string, elementId: string, style: Partial<ElementStyle>) => {
        setData(prev => {
            const existing = prev.sectionStyles || {}
            const section = existing[sectionId] || { background: 'solid' }
            return {
                ...prev,
                sectionStyles: {
                    ...existing,
                    [sectionId]: { ...section }
                }
            }
        })
        markDirty()
    }, [markDirty])

    const updateResponsiveStyle = useCallback((bp: Breakpoint, sectionId: string, elementId: string, style: Partial<ElementStyle>) => {
        setData(prev => {
            const overrides = prev.responsiveOverrides || { mobile: {}, tablet: {}, desktop: {} }
            const bpData = overrides[bp] || {}
            const sectionData = bpData[sectionId] || {}
            const elementData = sectionData[elementId] || {}
            return {
                ...prev,
                responsiveOverrides: {
                    ...overrides,
                    [bp]: {
                        ...bpData,
                        [sectionId]: {
                            ...sectionData,
                            [elementId]: { ...elementData, ...style }
                        }
                    }
                }
            }
        })
        markDirty()
    }, [markDirty])

    /* ─── Selection ─── */
    const selectSection = useCallback((id: EditorSectionId | null) => {
        setSelectedSection(id)
        if (id === null) setSelectedElement(null)
    }, [])

    const selectElement = useCallback((id: string | null) => {
        setSelectedElement(id)
    }, [])

    /* ─── Style resolution ─── */
    const getResolvedStyle = useCallback((sectionId: string, elementId: string): ElementStyle => {
        const base: ElementStyle = {}
        // Desktop is the base
        const desktopOverride = data.responsiveOverrides?.desktop?.[sectionId]?.[elementId]
        const bpOverride = data.responsiveOverrides?.[breakpoint]?.[sectionId]?.[elementId]
        return { ...base, ...desktopOverride, ...(breakpoint !== 'desktop' ? bpOverride : {}) }
    }, [data.responsiveOverrides, breakpoint])

    const getSectionStyle = useCallback((sectionId: string): SectionStyle | undefined => {
        return data.sectionStyles?.[sectionId]
    }, [data.sectionStyles])

    const buildGradientCSS = useCallback((sectionId: string): string | undefined => {
        const style = data.sectionStyles?.[sectionId]
        return buildGradientCSSUtil(style)
    }, [data.sectionStyles])

    /* ─── Persistence ─── */
    const save = useCallback(async () => {
        setSaving(true)
        try {
            await saveTenant(data)
            originalRef.current = data
            setIsDirty(false)
            setSaved(true)
            toast.success("Alterações salvas e publicadas no site!")
            setTimeout(() => setSaved(false), 3000)
        } catch (e: any) {
            toast.error("Erro ao salvar", { description: e.message })
        } finally {
            setSaving(false)
        }
    }, [data])

    const resetDirty = useCallback(() => {
        setIsDirty(false)
    }, [])

    /* ─── Auto-save ─── */
    React.useEffect(() => {
        if (!isDirty) return;
        const timeoutId = setTimeout(() => {
            save();
        }, 1500); // 1.5s debounce

        return () => clearTimeout(timeoutId);
    }, [data, isDirty, save]);

    const isPremium = (data as any).plan === "premium"

    const value: EditorState & EditorActions = {
        data, originalData: originalRef.current, isDirty,
        selectedSection, selectedElement, breakpoint, saving, saved,
        isPremium,
        updateField, updateNestedField, updateSectionStyle, updateElementStyle,
        updateResponsiveStyle, selectSection, selectElement, setBreakpoint,
        save, resetDirty, getResolvedStyle, getSectionStyle, buildGradientCSS,
    }

    return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
}
