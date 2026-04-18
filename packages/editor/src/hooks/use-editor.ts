"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import type { EditorConfig, DeviceType, SectionType, EditorPlugin, HeroOverridableProps } from "../types"

export interface UseEditorOptions {
  initialConfig: EditorConfig
  onSave: (config: EditorConfig) => Promise<void>
  plugins?: EditorPlugin[]
  autoSave?: boolean
  autoSaveDelay?: number
}

export interface UseEditorReturn {
  config: EditorConfig
  device: DeviceType
  activeSection: string
  isSaving: boolean
  hasUnsavedChanges: boolean
  savedSuccessfully: boolean
  canUndo: boolean
  canRedo: boolean
  sectionOrder: string[]

  setDevice: (device: DeviceType) => void
  setActiveSection: (section: string) => void
  updateConfig: (updates: Partial<EditorConfig>) => void
  updateHeroForDevice: (device: DeviceType, updates: Partial<HeroOverridableProps>) => void
  resetHeroOverride: (device: DeviceType, prop: keyof HeroOverridableProps) => void
  updatePluginConfig: (pluginId: string, updates: any) => void
  reorderSections: (newOrder: string[]) => void
  undo: () => void
  redo: () => void
  save: () => Promise<void>
}

const CORE_SECTIONS: SectionType[] = ["header", "hero", "footer"]

export function useEditor({
  initialConfig,
  onSave,
  plugins = [],
  autoSave = false, // Default changed to false
  autoSaveDelay = 2000,
}: UseEditorOptions): UseEditorReturn {
  const [config, setConfig] = useState<EditorConfig>(() => {
    // Initialize plugin configs with defaults if not present
    const pluginConfigs = { ...(initialConfig.plugins || {}) }
    for (const plugin of plugins) {
      if (!pluginConfigs[plugin.id]) {
        pluginConfigs[plugin.id] = plugin.defaultConfig
      }
    }

    // Initialize section order
    // Default order for new mandate (onboarding phase): Mandatory sections only
    // Note: 'perfil' and 'contact' are technically plugins but are mandatory for the mandate profile
    const mandatoryPluginIds = ["perfil", "contact"]
    const defaultOrder = [
      "header",
      "hero",
      ...plugins.filter(p => mandatoryPluginIds.includes(p.id)).map(p => p.id),
      "footer",
    ]
    const sectionOrder = initialConfig.sectionOrder || defaultOrder

    return {
      ...initialConfig,
      plugins: pluginConfigs,
      sectionOrder,
    }
  })

  const [device, setDevice] = useState<DeviceType>("desktop")

  // Auto-detect default device based on window width
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 768) {
        setDevice("mobile")
      } else if (window.innerWidth < 1024) {
        setDevice("tablet")
      } else {
        setDevice("desktop")
      }
    }
  }, [])

  const [activeSection, setActiveSection] = useState<string>("hero")
  const [isSaving, setIsSaving] = useState(false)
  const [savedSuccessfully, setSavedSuccessfully] = useState(false)

  // History State
  const [history, setHistory] = useState<EditorConfig[]>([config])
  const [historyIndex, setHistoryIndex] = useState(0)

  // Track the last state that was explicitly saved to the database
  const lastSavedConfigRef = useRef<EditorConfig>(config)

  // Explicitly check for unsaved changes by comparing current config with last saved
  const hasUnsavedChanges = JSON.stringify(config) !== JSON.stringify(lastSavedConfigRef.current)

  const configRef = useRef(config)
  configRef.current = config

  // Section order from config
  const sectionOrder = config.sectionOrder || [
    "header",
    "hero",
    ...plugins.filter(p => ["perfil", "contact"].includes(p.id)).map(p => p.id),
    "footer",
  ]

  // Helper to push new state to history
  const pushToHistory = useCallback((newConfig: EditorConfig) => {
    setConfig(newConfig)
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1)
      return [...newHistory, newConfig]
    })
    setHistoryIndex((prev) => prev + 1)
    setSavedSuccessfully(false)
  }, [historyIndex])

  // Update core config (theme, header, hero, footer)
  const updateConfig = useCallback(
    (updates: Partial<EditorConfig>) => {
      const newConfig = { ...configRef.current }
      if (updates.theme) newConfig.theme = { ...newConfig.theme, ...updates.theme }
      if (updates.header) newConfig.header = { ...newConfig.header, ...updates.header }
      if (updates.hero) newConfig.hero = { ...newConfig.hero, ...updates.hero }
      if (updates.footer) newConfig.footer = { ...newConfig.footer, ...updates.footer }
      if (updates.sectionOrder) newConfig.sectionOrder = updates.sectionOrder
      pushToHistory(newConfig)
    },
    [pushToHistory]
  )

  // Device-aware Hero update: mobile = base, tablet/desktop = overrides
  const updateHeroForDevice = useCallback(
    (targetDevice: DeviceType, updates: Partial<HeroOverridableProps>) => {
      const currentHero = { ...configRef.current.hero }

      if (targetDevice === "mobile") {
        // Write directly to base
        const newHero = { ...currentHero }
        for (const [key, value] of Object.entries(updates)) {
          if (key === "overlay" && value) {
            newHero.overlay = { ...newHero.overlay, ...(value as Record<string, any>) }
          } else if (key === "vignette" && value) {
            newHero.vignette = { ...newHero.vignette, ...(value as Record<string, any>) }
          } else if (key === "gradient" && value) {
            newHero.gradient = { ...(newHero.gradient || {} as any), ...(value as Record<string, any>) }
          } else {
            ;(newHero as any)[key] = value
          }
        }
        const newConfig = { ...configRef.current, hero: newHero }
        pushToHistory(newConfig)
      } else {
        // Write to overrides layer
        const layer = targetDevice === "tablet" ? "tablet" : "desktop"
        const existingOverrides = currentHero.overrides || {}
        const existingLayer = existingOverrides[layer] || {}

        // Merge nested objects (overlay, vignette) correctly
        const mergedUpdates = { ...existingLayer }
        for (const [key, value] of Object.entries(updates)) {
          if ((key === "overlay" || key === "vignette" || key === "gradient") && value && typeof value === "object") {
            mergedUpdates[key] = { ...(existingLayer[key as keyof HeroOverridableProps] as any || {}), ...value }
          } else {
            (mergedUpdates as any)[key] = value
          }
        }

        const newHero = {
          ...currentHero,
          overrides: {
            ...existingOverrides,
            [layer]: mergedUpdates,
          },
        }
        const newConfig = { ...configRef.current, hero: newHero }
        pushToHistory(newConfig)
      }
    },
    [pushToHistory]
  )

  // Reset a specific override for a device (delete it so it inherits from base)
  const resetHeroOverride = useCallback(
    (targetDevice: DeviceType, prop: keyof HeroOverridableProps) => {
      if (targetDevice === "mobile") return // base cannot be reset

      const currentHero = { ...configRef.current.hero }
      const layer = targetDevice === "tablet" ? "tablet" : "desktop"
      const existingOverrides = { ...(currentHero.overrides || {}) }
      const existingLayer = { ...(existingOverrides[layer] || {}) }

      delete existingLayer[prop]

      existingOverrides[layer] = existingLayer
      const newHero = { ...currentHero, overrides: existingOverrides }
      const newConfig = { ...configRef.current, hero: newHero }
      pushToHistory(newConfig)
    },
    [pushToHistory]
  )

  // Update plugin-specific config
  const updatePluginConfig = useCallback(
    (pluginId: string, updates: any) => {
      const newConfig = {
        ...configRef.current,
        plugins: {
          ...configRef.current.plugins,
          [pluginId]: {
            ...(configRef.current.plugins?.[pluginId] || {}),
            ...updates,
          },
        },
      }
      pushToHistory(newConfig)
    },
    [pushToHistory]
  )

  // Reorder sections (drag-and-drop)
  const reorderSections = useCallback(
    (newOrder: string[]) => {
      const newConfig = {
        ...configRef.current,
        sectionOrder: newOrder,
      }
      pushToHistory(newConfig)
    },
    [pushToHistory]
  )

  // Undo / Redo logic
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setConfig(history[newIndex])
      setSavedSuccessfully(false)
    }
  }, [historyIndex, history])

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setConfig(history[newIndex])
      setSavedSuccessfully(false)
    }
  }, [historyIndex, history])

  // Save handler
  const save = useCallback(async () => {
    setIsSaving(true)
    try {
      await onSave(configRef.current)
      lastSavedConfigRef.current = configRef.current
      setSavedSuccessfully(true)
      setTimeout(() => setSavedSuccessfully(false), 3000)
    } catch (error) {
      console.error("Editor save failed:", error)
    } finally {
      setIsSaving(false)
    }
  }, [onSave])

  // Auto-save with debounce
  useEffect(() => {
    if (!autoSave || !hasUnsavedChanges) return
    const timeoutId = setTimeout(() => {
      save()
    }, autoSaveDelay)
    return () => clearTimeout(timeoutId)
  }, [config, hasUnsavedChanges, autoSave, autoSaveDelay, save])

  return {
    config,
    device,
    activeSection,
    isSaving,
    hasUnsavedChanges,
    savedSuccessfully,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    sectionOrder,
    setDevice,
    setActiveSection,
    updateConfig,
    updateHeroForDevice,
    resetHeroOverride,
    updatePluginConfig,
    reorderSections,
    undo,
    redo,
    save,
  }
}
