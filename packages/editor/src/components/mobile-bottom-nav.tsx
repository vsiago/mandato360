"use client"

import { cn } from "../lib/utils"
import { 
    Plus, 
    Layers, 
    Palette, 
    Settings2,
    Monitor,
    Smartphone,
    Tablet
} from "lucide-react"
import { DeviceType } from "../types"

interface MobileBottomNavProps {
  activeSection: string
  device: DeviceType
  accentColor?: string
  onAddClick: () => void
  onSectionsClick: () => void
  onThemeClick: () => void
  onConfigClick: () => void
  className?: string
}

export function MobileBottomNav({
  activeSection,
  device,
  accentColor = "#10b981",
  onAddClick,
  onSectionsClick,
  onThemeClick,
  onConfigClick,
  className
}: MobileBottomNavProps) {
  
  const navItems = [
    {
      label: "Seções",
      icon: Layers,
      onClick: onSectionsClick,
      active: false
    },
    {
      label: "Estilos",
      icon: Palette,
      onClick: onThemeClick,
      active: false
    },
    {
      label: "Ajustes",
      icon: Settings2,
      onClick: onConfigClick,
      active: true // Highlighting this as it's the "active section" config
    }
  ]

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-[60] lg:hidden",
      "bg-background/80 backdrop-blur-xl border-t border-border px-4 pb-safe pt-2",
      className
    )}>
      <div className="flex items-center justify-between max-w-lg mx-auto gap-1">
        
        {/* Sections Toggle */}
        <button
          onClick={onSectionsClick}
          className="flex flex-col items-center gap-1 px-3 py-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Layers className="h-5 w-5" />
          <span className="text-[10px] font-bold uppercase tracking-tight">Seções</span>
        </button>

        {/* Global Theme */}
        <button
          onClick={onThemeClick}
          className="flex flex-col items-center gap-1 px-3 py-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Palette className="h-5 w-5" />
          <span className="text-[10px] font-bold uppercase tracking-tight">Estilos</span>
        </button>

        {/* Central Add Button (FAB) */}
        <div className="relative -top-6">
            <button
                onClick={onAddClick}
                className="flex h-14 w-14 items-center justify-center rounded-full shadow-lg shadow-emerald-500/20 text-white transition-all active:scale-95 border-4 border-background"
                style={{ backgroundColor: accentColor }}
            >
                <Plus className="h-7 w-7" />
            </button>
            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest text-foreground/40 whitespace-nowrap">
                Adicionar
            </span>
        </div>

        {/* Section Config */}
        <button
          onClick={onConfigClick}
          className="flex flex-col items-center gap-1 px-3 py-1 transition-colors"
          style={{ color: accentColor }}
        >
          <Settings2 className="h-5 w-5" />
          <span className="text-[10px] font-bold uppercase tracking-tight">Configurar</span>
        </button>

        {/* More/Device - Optional, but let's keep it simple for now */}
        <div className="flex flex-col items-center gap-1 px-3 py-1 text-muted-foreground/30">
          {device === "mobile" ? <Smartphone className="h-5 w-5" /> : device === "tablet" ? <Tablet className="h-5 w-5" /> : <Monitor className="h-5 w-5" />}
          <span className="text-[10px] font-bold uppercase tracking-tight">{device}</span>
        </div>

      </div>
    </div>
  )
}
