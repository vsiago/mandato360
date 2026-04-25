"use client"

import * as React from "react"
import { Smartphone, Tablet, Monitor, ExternalLink, Save, Loader2, Palette, Undo2, Redo2, ChevronLeft } from "lucide-react"
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
import type { DeviceType, EditorConfig } from "../types"

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
  previewUrl?: string
  tenantName?: string
  accentColor?: string
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
  previewUrl,
  tenantName,
  accentColor = "#10b981",
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
    <header className={cn("flex h-16 sm:h-14 flex-wrap sm:flex-nowrap items-center justify-between border-b border-border bg-card px-2 sm:px-4 gap-y-2 py-1 sm:py-0", className)}>
      {/* Left Side - Exit & Context */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
        <div className="flex items-center gap-2">
            <Button
                variant="ghost"
                size="sm"
                onClick={handleExit}
                className="h-9 gap-2 px-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all active:scale-95 group"
            >
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-muted group-hover:bg-background transition-colors">
                    <ChevronLeft className="h-4 w-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest hidden xs:inline">Sair do Editor</span>
            </Button>
            
            <div className="mx-1 h-6 w-px bg-border/60 hidden sm:block" />

            <div className="flex items-center gap-2 text-xs sm:text-sm pl-1">
                <span className="text-muted-foreground/60 font-medium tracking-tight uppercase">Visual</span>
                <span className="text-foreground font-bold tracking-tight uppercase">Editor</span>
            </div>
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

        {/* Save Button (Mobile position) */}
        <div className="sm:hidden flex items-center gap-2">
          {hasUnsavedChanges && (
            <div className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
          )}
          <Button
            size="sm"
            onClick={onSave}
            disabled={isSaving || (!hasUnsavedChanges && !savedSuccessfully)}
            className={cn(
              "h-8 rounded-full px-3 transition-all",
              savedSuccessfully && !hasUnsavedChanges
                ? "bg-green-500 text-white"
                : hasUnsavedChanges
                ? "text-white"
                : "bg-muted text-muted-foreground"
            )}
            style={hasUnsavedChanges && !savedSuccessfully ? { backgroundColor: accentColor } : undefined}
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Center - Device Selector */}
      <div className="flex flex-1 sm:flex-none justify-start sm:justify-center items-center sm:absolute sm:left-1/2 sm:-translate-x-1/2 order-3 sm:order-none w-full sm:w-auto">
        <div className="flex items-center gap-0.5 rounded-lg bg-muted p-0.5">
          {devices.map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              onClick={() => onDeviceChange(type)}
              className={cn(
                "flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-medium transition-all duration-200",
                device === type
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Right Side - Actions */}
      <div className="flex items-center gap-3">
        {hasUnsavedChanges && (
          <div className="flex items-center gap-2 text-amber-400">
            <div className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
            <span className="text-xs">Alterações não salvas</span>
          </div>
        )}

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-border bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Palette className="h-4 w-4" style={{ color: accentColor }} />
              <span className="hidden sm:inline">Tema Global</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="flex w-[400px] flex-col border-l border-border bg-background p-0 sm:w-[540px]">
            <SheetHeader className="p-6 pb-0">
              <SheetTitle className="text-foreground">Tema Global</SheetTitle>
              <SheetDescription className="text-muted-foreground">
                Configure as cores, gradientes e tipografia globais do site de forma centralizada.
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <GlobalThemeSettings config={config} onConfigChange={onConfigChange} accentColor={accentColor} />
            </div>
          </SheetContent>
        </Sheet>

        {previewUrl && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            asChild
          >
            <a href={previewUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">Site Final</span>
            </a>
          </Button>
        )}

        <div className="mx-1 h-6 w-px bg-border" />

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={undo}
            disabled={!canUndo}
            className="h-8 w-8 text-muted-foreground hover:bg-muted disabled:opacity-30"
            title="Desfazer (Ctrl+Z)"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={redo}
            disabled={!canRedo}
            className="h-8 w-8 text-muted-foreground hover:bg-muted disabled:opacity-30"
            title="Refazer (Ctrl+Shift+Z)"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Desktop Save Button */}
        <Button
          size="sm"
          onClick={onSave}
          disabled={isSaving || (!hasUnsavedChanges && !savedSuccessfully)}
          className={cn(
            "hidden sm:flex gap-2 rounded-full px-5 transition-all",
            savedSuccessfully && !hasUnsavedChanges
              ? "bg-green-500 text-white hover:bg-green-600"
              : hasUnsavedChanges
              ? "text-white hover:opacity-90"
              : "bg-muted text-muted-foreground"
          )}
          style={hasUnsavedChanges && !savedSuccessfully ? { backgroundColor: accentColor } : undefined}
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Salvando...</span>
            </>
          ) : savedSuccessfully && !hasUnsavedChanges ? (
            <>
              <Save className="h-4 w-4" />
              <span>Salvo ✓</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Salvar</span>
            </>
          )}
        </Button>
      </div>
    </header>
  )
}
