"use client"

import { Smartphone, Tablet, Monitor, ExternalLink, Save, Loader2, Palette, Globe, ChevronLeft, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Breakpoint } from "@/lib/tenant-types"
import Link from "next/link"

interface EditorHeaderProps {
  device: Breakpoint
  onDeviceChange: (device: Breakpoint) => void
  onSave: () => void
  isSaving: boolean
  isDirty: boolean
  tenantSlug: string
}

const devices: { type: Breakpoint; icon: typeof Smartphone; label: string }[] = [
  { type: "mobile", icon: Smartphone, label: "Celular" },
  { type: "tablet", icon: Tablet, label: "Tablet" },
  { type: "desktop", icon: Monitor, label: "Desktop" },
]

export function EditorHeader({
  device,
  onDeviceChange,
  onSave,
  isSaving,
  isDirty,
  tenantSlug
}: EditorHeaderProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-white/10 bg-[#0f0f12] px-4 shrink-0 z-50">
      {/* Left Side - Breadcrumb */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-white/40 hover:text-white hover:bg-white/10 h-8 w-8" asChild>
          <Link href="/painel">
            <LogOut className="h-4 w-4 rotate-180" />
          </Link>
        </Button>

        <div className="flex items-center gap-2 text-sm">
          <Globe className="h-4 w-4 text-amber-500" />
          <span className="font-bold text-white">Editor Visual</span>
          <span className="text-white/30 hidden sm:inline">/</span>
          <span className="text-white/70 font-mono text-[10px] hidden sm:inline">agendaonline.com.br/{tenantSlug}</span>
        </div>
      </div>

      {/* Center - Device Selector */}
      <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-0.5 rounded-lg bg-white/5 p-0.5 border border-white/5">
        {devices.map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            onClick={() => onDeviceChange(type)}
            className={cn(
              "flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-medium transition-all duration-200",
              device === type
                ? "bg-white/10 text-white shadow-sm"
                : "text-white/40 hover:bg-white/5 hover:text-white/60"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Right Side - Actions */}
      <div className="flex items-center gap-3">
        {isDirty && (
          <div className="flex items-center gap-2 text-amber-400 animate-pulse mr-2">
            <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Não salvo</span>
          </div>
        )}
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2 text-white/70 hover:bg-white/10 hover:text-white h-8"
          asChild
        >
          <a href={`/${tenantSlug}`} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
            <span className="hidden sm:inline">Site Final</span>
          </a>
        </Button>

        <Button
          size="sm"
          onClick={onSave}
          disabled={isSaving}
          className={cn(
            "gap-2 rounded-full px-5 transition-all h-8",
            isDirty 
              ? "bg-amber-500 text-black hover:bg-amber-600 font-bold" 
              : "bg-white/10 text-white/50"
          )}
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-xs">Salvando...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span className="text-xs">Salvar</span>
            </>
          )}
        </Button>
      </div>
    </header>
  )
}
