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
import { Sheet, SheetContent, SheetTitle } from "./ui/sheet"
import { Settings, Layers } from "lucide-react"
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
  const [openAccordion, setOpenAccordion] = useState<AccordionType | null>("theme")

  // Sync openAccordion when activeSection changes
  useEffect(() => {
    if (editor.activeSection === "header") setOpenAccordion("header-content")
    else if (editor.activeSection === "hero") setOpenAccordion("content")
    else if (editor.activeSection === "footer") setOpenAccordion("content")
    else setOpenAccordion(null)
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

        {/* Mobile Floating Action Toolbar */}
        <div className="lg:hidden absolute bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-background/95 backdrop-blur-md p-1.5 rounded-full border border-border/60 shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-[200]">
          <Button variant="ghost" size="sm" className="rounded-full gap-2 px-6 h-12 hover:bg-muted active:scale-[0.98]" onClick={() => setMobileMenuOpen(true)}>
            <Layers className="h-4 w-4" /> <span className="text-xs font-semibold tracking-tight">Seções</span>
          </Button>
          <div className="w-px h-6 bg-border/80" />
          <Button variant="ghost" size="sm" className="rounded-full gap-2 px-5 h-11 hover:bg-muted active:scale-[0.98]" onClick={() => setMobileConfigOpen(true)}>
            <Settings className="h-4 w-4" /> <span className="text-xs font-semibold tracking-tight">Configurar</span>
          </Button>
        </div>
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
