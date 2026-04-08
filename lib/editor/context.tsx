"use client"

import React, { createContext, useContext, useState, useCallback, useRef } from "react"
import type { SiteConfig, SectionStyle, ElementStyle, Breakpoint, EditorSectionId } from "./types"
import { updateTenantSiteAction } from "@/lib/actions/tenant"
import { buildGradientCSS as buildGradientCSSUtil } from "./style-utils"
import { toast } from "sonner"
import { useParams } from "next/navigation"

/* ─── Editor State ─── */
export interface EditorState {
    data: SiteConfig
    originalData: SiteConfig
    isDirty: boolean
    selectedSection: EditorSectionId | null
    selectedElement: string | null
    breakpoint: Breakpoint
    saving: boolean
    saved: boolean
}

export interface EditorActions {
    updateField: <K extends keyof SiteConfig>(key: K, value: SiteConfig[K]) => void
    updateNestedField: (path: string, value: string) => void
    updateSectionStyle: (sectionId: string, style: Partial<SectionStyle>) => void
    updateElementStyle: (sectionId: string, elementId: string, style: Partial<ElementStyle>) => void
    updateResponsiveStyle: (breakpoint: Breakpoint, sectionId: string, elementId: string, style: Partial<ElementStyle>) => void
    selectSection: (id: EditorSectionId | null) => void
    selectElement: (id: string | null) => void
    setBreakpoint: (bp: Breakpoint) => void
    save: () => Promise<void>
    resetDirty: () => void
    getResolvedStyle: (sectionId: string, elementId: string) => ElementStyle
    getSectionStyle: (sectionId: string) => SectionStyle | undefined
    buildGradientCSS: (sectionId: string) => string | undefined
}

const EditorContext = createContext<(EditorState & EditorActions) | null>(null)

export function useEditor() {
    const ctx = useContext(EditorContext)
    if (!ctx) throw new Error("useEditor must be used within EditorProvider")
    return ctx
}

/* ─── Provider ─── */
export function EditorProvider({ initialData, children }: { initialData: SiteConfig; children: React.ReactNode }) {
    const params = useParams()
    const tenantSlug = params.tenant as string
    
    const [data, setData] = useState<SiteConfig>(initialData)
    const originalRef = useRef<SiteConfig>(initialData)
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
    const updateField = useCallback(<K extends keyof SiteConfig>(key: K, value: SiteConfig[K]) => {
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
            return newData as SiteConfig
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
        if (!tenantSlug) return
        setSaving(true)
        try {
            const result = await updateTenantSiteAction(tenantSlug, data)
            if (result.success) {
                originalRef.current = data
                setIsDirty(false)
                setSaved(true)
                toast.success("Alterações salvas e publicadas!")
                setTimeout(() => setSaved(false), 3000)
            } else {
                throw new Error(result.error)
            }
        } catch (e: any) {
            toast.error("Erro ao salvar", { description: e.message })
        } finally {
            setSaving(false)
        }
    }, [data, tenantSlug])

    const resetDirty = useCallback(() => {
        setIsDirty(false)
    }, [])

    /* ─── Auto-save ─── */
    React.useEffect(() => {
        if (!isDirty) return;
        const timeoutId = setTimeout(() => {
            save();
        }, 2000); // 2s debounce for auto-save

        return () => clearTimeout(timeoutId);
    }, [data, isDirty, save]);

    const value: EditorState & EditorActions = {
        data, originalData: originalRef.current, isDirty,
        selectedSection, selectedElement, breakpoint, saving, saved,
        updateField, updateNestedField, updateSectionStyle, updateElementStyle,
        updateResponsiveStyle, selectSection, selectElement, setBreakpoint,
        save, resetDirty, getResolvedStyle, getSectionStyle, buildGradientCSS,
    }

    return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
}
