"use client"

import { Smartphone, Tablet, Monitor, ExternalLink, Save, Loader2, Palette, Undo2, Redo2 } from "lucide-react"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "./ui/sheet"
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
}: EditorHeaderProps) {
  return (
    <header className={cn("flex h-16 sm:h-14 flex-wrap sm:flex-nowrap items-center justify-between border-b border-border bg-card px-2 sm:px-4 gap-y-2 py-1 sm:py-0", className)}>
      {/* Left Side - Breadcrumb */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
        <div className="flex items-center gap-1.5 text-xs sm:text-sm">
          {tenantName && (
            <>
              <span className="font-medium text-foreground max-w-[100px] sm:max-w-none truncate">{tenantName}</span>
              <span className="text-muted-foreground/30">/</span>
            </>
          )}
          <span className="text-muted-foreground hidden xs:inline">Editor Visual</span>
        </div>
        
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
