"use client"

import { useEffect } from "react"
import { cn } from "../lib/utils"
import { useEditor } from "../hooks/use-editor"
import { EditorHeader } from "./editor-header"
import { SectionNav } from "./section-nav"
import { DevicePreview } from "./device-preview"
import { EditorSidebar } from "./editor-sidebar"
import { SectionLibrary } from "./section-library"
import type { SiteEditorProps } from "../types"
import { useState } from "react"
import { MobileBottomNav } from "./mobile-bottom-nav"
import { Sheet, SheetContent, SheetTitle, SheetTrigger, SheetHeader, SheetDescription } from "./ui/sheet"
import { GlobalThemeSettings } from "./global-theme-settings"
import { Settings, Layers, Palette } from "lucide-react"
import { Button } from "./ui/button"
import type { AccordionType } from "../types"

export function SiteEditor({
  initialConfig,
  onSave,
  previewUrl,
  tenantName,
  plugins = [],
  autoSave = false,
  autoSaveDelay = 2000,
  className,
  accentColor = "#10b981",
  onImageUpload,
  placeholders,
  onExit,
}: SiteEditorProps) {
  const editor = useEditor({
    initialConfig,
    onSave,
    plugins,
    autoSave,
    autoSaveDelay,
  })

  const [isLibraryOpen, setIsLibraryOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileConfigOpen, setMobileConfigOpen] = useState(false)
  const [isThemeOpen, setIsThemeOpen] = useState(false)
  const [openAccordion, setOpenAccordion] = useState<AccordionType | null>(null)

  // Sync openAccordion when activeSection changes
  useEffect(() => {
    // We want accordions to start closed by default as per user request
    setOpenAccordion(null)
  }, [editor.activeSection])

  // ... (rest of the component)

  // Onboarding Logic: Automatically open library if only core sections exist
  useEffect(() => {
    const isFirstTime = (editor.sectionOrder.length <= 5)
    if (isFirstTime) {
      const timer = setTimeout(() => setIsLibraryOpen(true), 800)
      return () => clearTimeout(timer)
    }
  }, []) // Only on mount

  const handleAddSection = (pluginId: string) => {
    const newOrder = [...editor.sectionOrder]
    // Insert before footer (which is always last)
    const footerIndex = newOrder.indexOf("footer")
    if (footerIndex !== -1) {
        newOrder.splice(footerIndex, 0, pluginId)
    } else {
        newOrder.push(pluginId)
    }
    
    editor.reorderSections(newOrder)
    editor.setActiveSection(pluginId)
    setIsLibraryOpen(false)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo: Ctrl+Z
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault()
        editor.undo()
      }
      // Redo: Ctrl+Shift+Z or Ctrl+Y
      if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && e.shiftKey) ||
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y")
      ) {
        e.preventDefault()
        editor.redo()
      }
      // Save: Ctrl+S
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault()
        editor.save()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [editor])

  // Global click-outside to deselect
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      // Elements that should NOT trigger deselection:
      const isSection = !!target.closest('[data-section-id]')
      const isToolbar = !!target.closest('#inline-toolbar') || !!target.closest('#section-toolbar')
      const isSidebar = !!target.closest('#editor-sidebar') || !!target.closest('[role="dialog"]') || !!target.closest('[data-radix-collection-item]')
      const isAction = !!target.closest('button') || !!target.closest('a')
      const isInput = !!target.closest('input') || !!target.closest('textarea') || !!target.closest('select')
      const isLibrary = !!target.closest('#section-library')
      
      if (!isSection && !isToolbar && !isSidebar && !isAction && !isInput && !isLibrary) {
        editor.setActiveSection('')
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside, true)
    return () => document.removeEventListener('mousedown', handleClickOutside, true)
  }, [editor.setActiveSection])

  return (
    <div className={cn("flex h-screen flex-col overflow-hidden bg-background", className)}>
      <EditorHeader
        device={editor.device}
        onDeviceChange={editor.setDevice}
        onSave={editor.save}
        undo={editor.undo}
        redo={editor.redo}
        canUndo={editor.canUndo}
        canRedo={editor.canRedo}
        isSaving={editor.isSaving}
        hasUnsavedChanges={editor.hasUnsavedChanges}
        savedSuccessfully={editor.savedSuccessfully}
        config={editor.config}
        onConfigChange={editor.updateConfig}
        onThemeClick={() => setIsThemeOpen(true)}
        previewUrl={previewUrl}
        tenantName={tenantName}
        accentColor={accentColor}
        onExit={onExit}
      />
      <div className="flex flex-1 overflow-hidden relative">
        {/* Section Navigation (Desktop) */}
        <div className="hidden md:flex bg-background">
          <SectionNav
            activeSection={editor.activeSection}
            sectionOrder={editor.sectionOrder}
            plugins={plugins}
            accentColor={accentColor}
            onSectionChange={editor.setActiveSection}
            onReorder={editor.reorderSections}
            onAddSectionClick={() => setIsLibraryOpen(true)}
          />
        </div>

        {/* Mobile Section Nav (Drawer) */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="p-0 w-max bg-background flex">
            <SheetTitle className="sr-only">Navegação de Seções</SheetTitle>
            <SectionNav
              activeSection={editor.activeSection}
              sectionOrder={editor.sectionOrder}
              plugins={plugins}
              accentColor={accentColor}
              onSectionChange={(s) => { editor.setActiveSection(s); setMobileMenuOpen(false) }}
              onReorder={editor.reorderSections}
              onAddSectionClick={() => { setMobileMenuOpen(false); setIsLibraryOpen(true) }}
            />
          </SheetContent>
        </Sheet>

        {/* Preview Area */}
        <div className="flex-1 overflow-auto bg-muted">
          <DevicePreview
            config={editor.config}
            device={editor.device}
            activeSection={editor.activeSection}
            sectionOrder={editor.sectionOrder}
            plugins={plugins}
            accentColor={accentColor}
            onConfigChange={editor.updateConfig}
            onAccordionToggle={(id) => setOpenAccordion(id as AccordionType)}
            onSectionReorder={editor.reorderSections}
            onSectionDelete={editor.deleteSection}
            onSectionSelect={editor.setActiveSection}
            placeholders={placeholders}
          />
        </div>

        {/* Editor Sidebar (Desktop) */}
        <div className="hidden lg:flex border-l border-border bg-background w-80">
          <EditorSidebar
            config={editor.config}
            device={editor.device}
            activeSection={editor.activeSection}
            plugins={plugins}
            accentColor={accentColor}
            onConfigChange={editor.updateConfig}
            onHeroChange={editor.updateHeroForDevice}
            onHeroReset={editor.resetHeroOverride}
            onPluginConfigChange={editor.updatePluginConfig}
            onImageUpload={onImageUpload}
            openAccordion={openAccordion}
            onToggleAccordion={setOpenAccordion}
            placeholders={placeholders}
          />
        </div>

        {/* Mobile Editor Sidebar (Drawer) */}
        <Sheet open={mobileConfigOpen} onOpenChange={setMobileConfigOpen}>
          <SheetContent side="bottom" className="p-0 h-[85vh] sm:h-full sm:w-[350px] sm:side-right rounded-t-2xl sm:rounded-none overflow-hidden bg-background">
            <SheetTitle className="sr-only">Configurações da Seção</SheetTitle>
            <EditorSidebar
              config={editor.config}
              device={editor.device}
              activeSection={editor.activeSection}
              plugins={plugins}
              accentColor={accentColor}
              onConfigChange={editor.updateConfig}
              onHeroChange={editor.updateHeroForDevice}
              onHeroReset={editor.resetHeroOverride}
              onPluginConfigChange={editor.updatePluginConfig}
              onImageUpload={onImageUpload}
              openAccordion={openAccordion}
              onToggleAccordion={setOpenAccordion}
              placeholders={placeholders}
              className="w-full flex-1"
            />
          </SheetContent>
        </Sheet>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav
          activeSection={editor.activeSection}
          device={editor.device}
          accentColor={accentColor}
          onAddClick={() => setIsLibraryOpen(true)}
          onSectionsClick={() => setMobileMenuOpen(true)}
          onThemeClick={() => setIsThemeOpen(true)}
          onConfigClick={() => setMobileConfigOpen(true)}
        />

        {/* Global Theme Sheet (Shared) */}
        <Sheet open={isThemeOpen} onOpenChange={setIsThemeOpen}>
          <SheetContent className="flex w-full flex-col border-l border-border bg-background p-0 sm:w-[540px]">
            <SheetHeader className="p-6 pb-0">
              <SheetTitle className="text-foreground">Tema Global</SheetTitle>
              <SheetDescription className="text-muted-foreground">
                Configure as cores, gradientes e tipografia globais do site de forma centralizada.
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <GlobalThemeSettings config={editor.config} onConfigChange={editor.updateConfig} accentColor={accentColor} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Section Library (Menu) */}
      <SectionLibrary 
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        plugins={plugins}
        activeSectionIds={editor.sectionOrder}
        onAddSection={handleAddSection}
        accentColor={accentColor}
      />
    </div>
  )
}
