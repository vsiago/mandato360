"use client"

import { useState, useCallback, useEffect, useReducer, useRef } from "react"
import type { EditorConfig, DeviceType, HeroOverridableProps } from "../types"

interface EditorState {
  history: EditorConfig[]
  index: number
  device: DeviceType
  activeSection: string
  isSaving: boolean
  savedSuccessfully: boolean
}

type EditorAction =
  | { type: 'SET_DEVICE', device: DeviceType }
  | { type: 'SET_ACTIVE_SECTION', section: string }
  | { type: 'UPDATE_CONFIG', updates: Partial<EditorConfig> }
  | { type: 'UPDATE_HERO_DEVICE', targetDevice: DeviceType, updates: Partial<HeroOverridableProps> }
  | { type: 'RESET_HERO_OVERRIDE', targetDevice: DeviceType, prop: keyof HeroOverridableProps }
  | { type: 'UPDATE_PLUGIN_CONFIG', pluginId: string, updates: any }
  | { type: 'REORDER_SECTIONS', newOrder: string[] }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_SAVING', isSaving: boolean }
  | { type: 'SET_SAVED_SUCCESS', success: boolean }

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  const currentConfig = state.history[state.index]

  const pushHistory = (newConfig: EditorConfig): EditorState => {
    const newHistory = state.history.slice(0, state.index + 1)
    return {
      ...state,
      history: [...newHistory, newConfig],
      index: newHistory.length,
      savedSuccessfully: false
    }
  }

  switch (action.type) {
    case 'SET_DEVICE':
      return { ...state, device: action.device }
    case 'SET_ACTIVE_SECTION':
      return { ...state, activeSection: action.section }
    case 'SET_SAVING':
      return { ...state, isSaving: action.isSaving }
    case 'SET_SAVED_SUCCESS':
      return { ...state, savedSuccessfully: action.success }

    case 'UPDATE_CONFIG': {
      const newConfig = { ...currentConfig, ...action.updates }
      const updates = action.updates
      if (updates.theme) newConfig.theme = { ...currentConfig.theme, ...updates.theme }
      if (updates.header) newConfig.header = { ...currentConfig.header, ...updates.header }
      if (updates.hero) newConfig.hero = { ...currentConfig.hero, ...updates.hero }
      if (updates.footer) newConfig.footer = { ...currentConfig.footer, ...updates.footer }
      return pushHistory(newConfig)
    }

    case 'UPDATE_HERO_DEVICE': {
      const { updates } = action
      let newHero = { ...currentConfig.hero }

      // Update base (Mobile is treated as the source of truth for the config root)
      for (const [key, value] of Object.entries(updates)) {
        if ((key === "overlay" || key === "vignette" || key === "gradient") && value) {
          (newHero as any)[key] = { ...(newHero as any)[key], ...value }
        } else {
          (newHero as any)[key] = value
        }
      }

      // Propagate to overrides to ensure perfect sync across viewports
      const overrides = { ...(newHero.overrides || {}) }
      const tabletData = { ...(overrides.tablet || {}) }
      const desktopData = { ...(overrides.desktop || {}) }

      for (const [key, value] of Object.entries(updates)) {
        if ((key === "overlay" || key === "vignette" || key === "gradient") && value) {
          (tabletData as any)[key] = { ...(tabletData as any)[key], ...value };
          (desktopData as any)[key] = { ...(desktopData as any)[key], ...value };
        } else {
          (tabletData as any)[key] = value
          (desktopData as any)[key] = value
        }
      }

      overrides.tablet = tabletData
      overrides.desktop = desktopData
      newHero.overrides = overrides

      return pushHistory({ ...currentConfig, hero: newHero })
    }

    case 'RESET_HERO_OVERRIDE': {
      if (action.targetDevice === "mobile") return state
      const layer = action.targetDevice === "tablet" ? "tablet" : "desktop"
      const newHero = { ...currentConfig.hero }
      const overrides = { ...(newHero.overrides || {}) }
      const layerData = { ...(overrides[layer] || {}) }
      delete (layerData as any)[action.prop]
      overrides[layer] = layerData
      newHero.overrides = overrides
      return pushHistory({ ...currentConfig, hero: newHero })
    }

    case 'UPDATE_PLUGIN_CONFIG': {
      const newPlugins = { ...(currentConfig.plugins || {}), [action.pluginId]: { ...(currentConfig.plugins?.[action.pluginId] || {}), ...action.updates } }
      return pushHistory({ ...currentConfig, plugins: newPlugins })
    }

    case 'REORDER_SECTIONS':
      return pushHistory({ ...currentConfig, sectionOrder: action.newOrder })

    case 'UNDO':
      return state.index > 0 ? { ...state, index: state.index - 1, savedSuccessfully: false } : state
    case 'REDO':
      return state.index < state.history.length - 1 ? { ...state, index: state.index + 1, savedSuccessfully: false } : state

    default:
      return state
  }
}

interface UseEditorProps {
  initialConfig: EditorConfig
  onSave: (config: EditorConfig) => Promise<void>
  plugins?: any[]
  autoSave?: boolean
  autoSaveDelay?: number
}

export function useEditor({ initialConfig, onSave, autoSave = false, autoSaveDelay = 2000 }: UseEditorProps) {
  const [state, dispatch] = useReducer(editorReducer, {
    history: [initialConfig],
    index: 0,
    device: "desktop",
    activeSection: "hero",
    isSaving: false,
    savedSuccessfully: false
  })

  const config = state.history[state.index]
  const lastSavedConfigRef = useRef(initialConfig)

  const setDevice = useCallback((device: DeviceType) => dispatch({ type: 'SET_DEVICE', device }), [])
  const setActiveSection = (section: string) => dispatch({ type: 'SET_ACTIVE_SECTION', section })
  const updateConfig = (updates: Partial<EditorConfig>) => dispatch({ type: 'UPDATE_CONFIG', updates })
  const updateHeroForDevice = (targetDevice: DeviceType, updates: Partial<HeroOverridableProps>) => dispatch({ type: 'UPDATE_HERO_DEVICE', targetDevice, updates })
  const resetHeroOverride = (targetDevice: DeviceType, prop: keyof HeroOverridableProps) => dispatch({ type: 'RESET_HERO_OVERRIDE', targetDevice, prop })
  const updatePluginConfig = (pluginId: string, updates: any) => dispatch({ type: 'UPDATE_PLUGIN_CONFIG', pluginId, updates })
  const reorderSections = (newOrder: string[]) => dispatch({ type: 'REORDER_SECTIONS', newOrder })
  const undo = () => dispatch({ type: 'UNDO' })
  const redo = () => dispatch({ type: 'REDO' })

  // Auto-detect device on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const width = window.innerWidth
      if (width < 768) setDevice("mobile")
      else if (width < 1024) setDevice("tablet")
      else setDevice("desktop")
    }
  }, [setDevice])

  const hasUnsavedChanges = JSON.stringify(config) !== JSON.stringify(lastSavedConfigRef.current)

  const save = useCallback(async () => {
    dispatch({ type: 'SET_SAVING', isSaving: true })
    try {
      await onSave(config)
      lastSavedConfigRef.current = config
      dispatch({ type: 'SET_SAVED_SUCCESS', success: true })
      setTimeout(() => dispatch({ type: 'SET_SAVED_SUCCESS', success: false }), 3000)
    } catch (error) {
      console.error("Editor save failed:", error)
    } finally {
      dispatch({ type: 'SET_SAVING', isSaving: false })
    }
  }, [onSave, config])

  useEffect(() => {
    if (!autoSave || !hasUnsavedChanges) return
    const timeoutId = setTimeout(() => {
      save()
    }, autoSaveDelay)
    return () => clearTimeout(timeoutId)
  }, [config, hasUnsavedChanges, autoSave, autoSaveDelay, save])

  return {
    config,
    device: state.device,
    activeSection: state.activeSection,
    sectionOrder: config.sectionOrder || ["header", "hero", "trust", "services", "about", "contact", "footer"],
    isSaving: state.isSaving,
    savedSuccessfully: state.savedSuccessfully,
    hasUnsavedChanges,
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
    canUndo: state.index > 0,
    canRedo: state.index < state.history.length - 1,
  }
}
