"use client"

import * as React from "react"
import { Smartphone, Tablet, Monitor, ExternalLink, Save, Loader2, Palette, Undo2, Redo2, ChevronLeft, Sparkles, SlidersHorizontal } from "lucide-react"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "./ui/sheet"
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle 
} from "./ui/dialog"
import { GlobalThemeSettings } from "./global-theme-settings"
import { cn } from "../lib/utils"
import type { DeviceType, EditorConfig, EditorMode } from "../types"

interface EditorHeaderProps {
  device: DeviceType
  onDeviceChange: (device: DeviceType) => void
  onSave: () => void
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
  isSaving: boolean
  hasUnsavedChanges: boolean
  savedSuccessfully: boolean
  config: EditorConfig
  onConfigChange: (updates: Partial<EditorConfig>) => void
  onThemeClick?: () => void
  previewUrl?: string
  tenantName?: string
  accentColor?: string
  editorMode?: EditorMode
  onModeChange?: (mode: EditorMode) => void
  className?: string
  onExit?: () => void
}

const devices: { type: DeviceType; icon: typeof Smartphone; label: string }[] = [
  { type: "mobile", icon: Smartphone, label: "Celular" },
  { type: "tablet", icon: Tablet, label: "Tablet" },
  { type: "desktop", icon: Monitor, label: "Desktop" },
]

export function EditorHeader({
  device,
  onDeviceChange,
  onSave,
  undo,
  redo,
  canUndo,
  canRedo,
  isSaving,
  hasUnsavedChanges,
  savedSuccessfully,
  config,
  onConfigChange,
  onThemeClick,
  previewUrl,
  tenantName,
  accentColor = "#10b981",
  editorMode = "basic",
  onModeChange,
  className,
  onExit,
}: EditorHeaderProps) {
  const [showExitDialog, setShowExitDialog] = React.useState(false)

  const handleExit = () => {
    if (hasUnsavedChanges) {
      setShowExitDialog(true)
    } else {
      onExit?.()
    }
  }

  const handleSaveAndExit = async () => {
    await onSave()
    setShowExitDialog(false)
    // Wait a bit for the save to complete and state to update if needed
    setTimeout(() => {
        onExit?.()
    }, 500)
  }

  return (
    <header className={cn("flex h-16 sm:h-14 items-center justify-between border-b border-border bg-card px-2 sm:px-4 gap-2", className)}>
      {/* Left Side - Exit & Context */}
      <div className="flex items-center gap-1 sm:gap-3">
        <Button
            variant="ghost"
            size="sm"
            onClick={handleExit}
            className="h-9 w-9 sm:w-auto gap-2 px-0 sm:px-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all active:scale-95 group"
        >
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-muted group-hover:bg-background transition-colors">
                <ChevronLeft className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest hidden xs:inline-block">Sair</span>
        </Button>
        
        <div className="mx-1 h-6 w-px bg-border/60 hidden sm:block" />

        <div className="flex items-center gap-1.5 text-xs sm:text-sm pl-1">
            <span className="text-muted-foreground/60 font-medium tracking-tight uppercase hidden xs:inline">Visual</span>
            <span className="text-foreground font-bold tracking-tight uppercase">Editor</span>
        </div>
        
        {/* Exit Confirmation Dialog */}
        <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
            <DialogContent className="max-w-md border-border bg-card shadow-2xl">
                <DialogHeader className="space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20">
                        <Save className="h-6 w-6 text-amber-500" />
                    </div>
                    <div className="space-y-1">
                        <DialogTitle className="text-xl font-bold text-foreground">Salvar alterações?</DialogTitle>
                        <DialogDescription className="text-muted-foreground leading-relaxed">
                            Existem alterações não salvas no seu site. Deseja salvar seu progresso antes de sair?
                        </DialogDescription>
                    </div>
                </DialogHeader>
                <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
                    <Button 
                        variant="outline" 
                        onClick={() => setShowExitDialog(false)}
                        className="w-full sm:w-auto border-border bg-transparent hover:bg-muted text-foreground"
                    >
                        Cancelar
                    </Button>
                    <div className="flex flex-col sm:flex-row gap-2 flex-1 sm:justify-end">
                        <Button 
                            variant="ghost" 
                            onClick={() => { setShowExitDialog(false); onExit?.() }}
                            className="w-full sm:w-auto text-muted-foreground hover:text-red-400 hover:bg-red-400/5"
                        >
                            Sair sem salvar
                        </Button>
                        <Button 
                            onClick={handleSaveAndExit}
                            disabled={isSaving}
                            className="w-full sm:w-auto font-bold text-white shadow-lg shadow-emerald-500/20"
                            style={{ backgroundColor: accentColor }}
                        >
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                            Salvar e Sair
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </div>

      {/* Center - Device Selector (Condensed on Mobile) */}
      <div className="flex items-center">
        <div className="flex items-center gap-0.5 rounded-lg bg-muted p-0.5">
          {devices.map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              onClick={() => onDeviceChange(type)}
              title={label}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 sm:px-3.5 py-1.5 text-xs font-medium transition-all duration-200",
                device === type
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden md:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mode Toggle (Desktop) */}
      <div className="hidden md:flex items-center">
        <div className="flex items-center gap-0.5 rounded-lg bg-muted p-0.5">
          <button
            onClick={() => onModeChange?.("basic")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200",
              editorMode === "basic"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
            )}
          >
            <Sparkles className="h-3 w-3" />
            <span>Básico</span>
          </button>
          <button
            onClick={() => onModeChange?.("advanced")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200",
              editorMode === "advanced"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
            )}
          >
            <SlidersHorizontal className="h-3 w-3" />
            <span>Avançado</span>
          </button>
        </div>
      </div>

      {/* Right Side - Actions */}
      <div className="flex items-center gap-1 sm:gap-3">
        {/* Undo/Redo - Hidden on tiny screens, shown on sm+ */}
        <div className="hidden xs:flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={undo}
            disabled={!canUndo}
            className="h-8 w-8 text-muted-foreground hover:bg-muted disabled:opacity-30"
          >
            <Undo2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={redo}
            disabled={!canRedo}
            className="h-8 w-8 text-muted-foreground hover:bg-muted disabled:opacity-30"
          >
            <Redo2 className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Global Theme Button (Triggers external sheet) */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onThemeClick}
          className="hidden md:flex gap-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Palette className="h-4 w-4" style={{ color: accentColor }} />
          <span>Tema Global</span>
        </Button>

        {/* Save Button */}
        <Button
          size="sm"
          onClick={onSave}
          disabled={isSaving || (!hasUnsavedChanges && !savedSuccessfully)}
          className={cn(
            "flex gap-2 rounded-full px-4 sm:px-5 transition-all h-9",
            savedSuccessfully && !hasUnsavedChanges
              ? "bg-green-500 text-white hover:bg-green-600"
              : hasUnsavedChanges
              ? "text-white hover:opacity-90"
              : "bg-muted text-muted-foreground"
          )}
          style={hasUnsavedChanges && !savedSuccessfully ? { backgroundColor: accentColor } : undefined}
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : savedSuccessfully && !hasUnsavedChanges ? (
            <Save className="h-4 w-4" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">
            {isSaving ? "Salvando..." : savedSuccessfully && !hasUnsavedChanges ? "Salvo" : "Salvar"}
          </span>
        </Button>
      </div>
    </header>
  )
}
