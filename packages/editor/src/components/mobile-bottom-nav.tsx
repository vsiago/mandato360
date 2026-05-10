"use client"

import { cn } from "../lib/utils"
import { 
    Plus, 
    Layers, 
    Palette, 
    Type,
    Paintbrush,
    SlidersHorizontal,
    ChevronLeft
} from "lucide-react"
import type { DeviceType, EditorMode } from "../types"

interface MobileBottomNavProps {
  activeSection: string
  device: DeviceType
  editorMode: EditorMode
  accentColor?: string
  onAddClick: () => void
  onSectionsClick: () => void
  onThemeClick: () => void
  onContentClick: () => void
  onAppearanceClick: () => void
  onAdvancedClick: () => void
  onModeToggle: () => void
  onDeselectSection: () => void
  className?: string
}

/** Section display names for the contextual toolbar label */
const SECTION_DISPLAY: Record<string, string> = {
  header: "Header",
  hero: "Capa",
  footer: "Rodapé",
  trust: "Destaques",
  services: "Serviços",
  about: "Sobre",
  beforeAfter: "Resultados",
  faq: "FAQ",
  contact: "Contato",
  agendamento: "Agendamento",
  practiceAreas: "Áreas",
  team: "Equipe",
  antes_depois: "Resultados",
}

export function MobileBottomNav({
  activeSection,
  device,
  editorMode,
  accentColor = "#10b981",
  onAddClick,
  onSectionsClick,
  onThemeClick,
  onContentClick,
  onAppearanceClick,
  onAdvancedClick,
  onModeToggle,
  onDeselectSection,
  className
}: MobileBottomNavProps) {
  
  const hasSelection = !!activeSection && activeSection !== ""
  const sectionLabel = SECTION_DISPLAY[activeSection] || activeSection

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-[60] lg:hidden",
      "bg-background/95 backdrop-blur-2xl border-t border-border px-4 pb-safe pt-2",
      "transition-all duration-300 ease-in-out",
      className
    )}>
      {hasSelection ? (
        /* ═══ Estado 2: Seção Selecionada — Ferramentas Contextuais ═══ */
        <div className="flex flex-col gap-3">
          {/* Header row with back button and label */}
          <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-1">
            <button
              onClick={onDeselectSection}
              className="flex items-center gap-1.5 py-1 text-muted-foreground hover:text-foreground transition-colors active:scale-95"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Voltar</span>
            </button>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-muted/50 border border-border/60">
              <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
              <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/70">
                {sectionLabel}
              </span>
            </div>
          </div>

          {/* Tool buttons: 3 clean columns */}
          <div className="flex items-center justify-around">
            <NavButton
              icon={Type}
              label="Editar"
              onClick={onContentClick}
              accentColor={accentColor}
              active
            />
            <NavButton
              icon={Paintbrush}
              label="Estilo"
              onClick={onAppearanceClick}
              accentColor={accentColor}
            />
            <NavButton
              icon={SlidersHorizontal}
              label="Mais"
              onClick={onAdvancedClick}
              accentColor={accentColor}
            />
          </div>
        </div>
      ) : (
        /* ═══ Estado 1: Sem Seleção — Navegação Global ═══ */
        <div className="flex items-center justify-between max-w-lg mx-auto px-2">
          <NavButton
            icon={Layers}
            label="Seções"
            onClick={onSectionsClick}
          />

          {/* NEW BUTTON (Primary Action) */}
          <button
            onClick={onAddClick}
            className="flex flex-col items-center justify-center gap-1 group"
          >
            <div 
              className="flex h-11 w-11 items-center justify-center rounded-2xl shadow-lg text-white transition-all group-active:scale-90"
              style={{ 
                backgroundColor: accentColor, 
                boxShadow: `0 8px 16px -4px ${accentColor}40` 
              }}
            >
              <Plus className="h-6 w-6 stroke-[2.5]" />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-foreground mt-0.5">Novo</span>
          </button>

          <NavButton
            icon={Palette}
            label="Estilo"
            onClick={onThemeClick}
          />
        </div>
      )}
    </div>
  )
}

function NavButton({
  icon: Icon,
  label,
  onClick,
  accentColor,
  active,
}: {
  icon: any
  label: string
  onClick: () => void
  accentColor?: string
  active?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1.5 px-4 py-1 rounded-xl transition-all active:scale-95",
        active && accentColor
          ? "text-foreground"
          : "text-muted-foreground/80 hover:text-foreground"
      )}
    >
      <Icon className={cn("h-5 w-5 transition-transform", active && "scale-110")} style={active && accentColor ? { color: accentColor } : undefined} />
      <span className="text-[10px] font-bold uppercase tracking-tight">{label}</span>
    </button>
  )
}
