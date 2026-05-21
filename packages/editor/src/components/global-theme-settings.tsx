"use client"

import { cn } from "../lib/utils"
import { 
  ChevronRight, 
  Check, 
  Type, 
  Palette, 
  Box, 
  Sparkles,
  RefreshCcw
} from "lucide-react"
import { useState } from "react"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import type {
  EditorConfig,
  ThemePresetType,
  FontFamily,
  ThemePreset,
} from "../types"

const themePresets: ThemePreset[] = [
  {
    id: "neutral",
    label: "Neutro",
    description: "Minimalista e atemporal",
    colors: {
      primary: "#404040",
      secondary: "#171717",
      accent: "#737373",
      background: "#0a0a0a",
      text: "#fafafa",
      surface: "#171717",
      muted: "#262626",
    },
    gradient: {
      stops: [
        { color: "#171717", position: 0 },
        { color: "#262626", position: 50 },
        { color: "transparent", position: 100 },
      ],
      angle: 90,
    },
    designSystem: {
      preset: "neutral",
      fonts: { primary: "sans", secondary: "sans" },
      borderRadius: "sm",
      shadows: "subtle",
      animations: false,
    },
  },
  {
    id: "classic",
    label: "Clássico",
    description: "Elegante e sofisticado",
    colors: {
      primary: "#1e3a5f",
      secondary: "#0f1c2e",
      accent: "#c9a227",
      background: "#0a1220",
      text: "#f5f5f0",
      surface: "#162030",
      muted: "#2c3e50",
    },
    gradient: {
      stops: [
        { color: "#0f1c2e", position: 0 },
        { color: "#1e3a5f", position: 60 },
        { color: "transparent", position: 100 },
      ],
      angle: 90,
    },
    designSystem: {
      preset: "classic",
      fonts: { primary: "serif", secondary: "sans" },
      borderRadius: "md",
      shadows: "medium",
      animations: true,
    },
  },
  {
    id: "ruby",
    label: "Rubi",
    description: "Intenso e apaixonante",
    colors: {
      primary: "#e11d48",
      secondary: "#4c0519",
      accent: "#fb7185",
      background: "#1c0108",
      text: "#fff1f2",
      surface: "#4c0519",
      muted: "#881337",
    },
    gradient: {
      stops: [
        { color: "#4c0519", position: 0 },
        { color: "#9f1239", position: 50 },
        { color: "transparent", position: 100 },
      ],
      angle: 90,
    },
    designSystem: {
      preset: "ruby",
      fonts: { primary: "display", secondary: "sans" },
      borderRadius: "lg",
      shadows: "medium",
      animations: true,
    },
  },
  {
    id: "emerald",
    label: "Esmeralda",
    description: "Natural e vibrante",
    colors: {
      primary: "#10b981",
      secondary: "#064e3b",
      accent: "#34d399",
      background: "#022c22",
      text: "#ffffff",
      surface: "#065f46",
      muted: "#064e3b",
    },
    gradient: {
      stops: [
        { color: "#064e3b", position: 0 },
        { color: "#10b981", position: 50 },
        { color: "transparent", position: 100 },
      ],
      angle: 90,
    },
    designSystem: {
      preset: "emerald",
      fonts: { primary: "serif", secondary: "sans" },
      borderRadius: "lg",
      shadows: "medium",
      animations: true,
    },
  },
  {
    id: "midnight",
    label: "Oceano",
    description: "Profundo e luxuoso",
    colors: {
      primary: "#6366f1",
      secondary: "#1e1b4b",
      accent: "#22d3ee",
      background: "#0f172a",
      text: "#f8fafc",
      surface: "#1e293b",
      muted: "#334155",
    },
    gradient: {
      stops: [
        { color: "#1e1b4b", position: 0 },
        { color: "#312e81", position: 50 },
        { color: "transparent", position: 100 },
      ],
      angle: 90,
    },
    designSystem: {
      preset: "midnight",
      fonts: { primary: "sans", secondary: "sans" },
      borderRadius: "xl",
      shadows: "dramatic",
      animations: true,
    },
  },
  {
    id: "sunset",
    label: "Entardecer",
    description: "Energético e quente",
    colors: {
      primary: "#f97316",
      secondary: "#4c1d95",
      accent: "#ec4899",
      background: "#2e1065",
      text: "#fdf2f8",
      surface: "#4c1d95",
      muted: "#5b21b6",
    },
    gradient: {
      stops: [
        { color: "#4c1d95", position: 0 },
        { color: "#7c3aed", position: 50 },
        { color: "transparent", position: 100 },
      ],
      angle: 90,
    },
    designSystem: {
      preset: "sunset",
      fonts: { primary: "display", secondary: "sans" },
      borderRadius: "full",
      shadows: "medium",
      animations: true,
    },
  },
  {
    id: "sunflower",
    label: "Girassol",
    description: "Vibrante e acolhedor",
    colors: {
      primary: "#f59e0b",
      secondary: "#451a03",
      accent: "#fbbf24",
      background: "#1a0e05",
      text: "#fffbeb",
      surface: "#451a03",
      muted: "#78350f",
    },
    gradient: {
      stops: [
        { color: "#451a03", position: 0 },
        { color: "#92400e", position: 50 },
        { color: "transparent", position: 100 },
      ],
      angle: 90,
    },
    designSystem: {
      preset: "sunflower",
      fonts: { primary: "serif", secondary: "sans" },
      borderRadius: "xl",
      shadows: "medium",
      animations: true,
    },
  },
]

const fontOptions: { id: FontFamily | string; label: string; preview: string }[] = [
  { id: "sans", label: "Sistema Sans", preview: "Aa" },
  { id: "serif", label: "Sistema Serif", preview: "Aa" },
  { id: "mono", label: "Monospace", preview: "Aa" },
  { id: "Playfair Display", label: "Playfair Display", preview: "Aa" },
  { id: "Cormorant Garamond", label: "C. Garamond", preview: "Aa" },
  { id: "Inter", label: "Inter", preview: "Aa" },
  { id: "Roboto", label: "Roboto", preview: "Aa" },
  { id: "Montserrat", label: "Montserrat", preview: "Aa" },
  { id: "Lora", label: "Lora", preview: "Aa" },
  { id: "Oswald", label: "Oswald", preview: "Aa" },
]

interface GlobalThemeSettingsProps {
  config: EditorConfig
  onConfigChange: (updates: Partial<EditorConfig>) => void
  accentColor?: string
}

export function GlobalThemeSettings({ config, onConfigChange, accentColor = "#10b981" }: GlobalThemeSettingsProps) {
  const [openSection, setOpenSection] = useState<string | null>("fonts")

  if (!config?.theme) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-muted-foreground italic">
        Aguardando configurações...
      </div>
    )
  }

  const designSystem = config.theme.designSystem || {
    preset: "emerald" as const,
    fonts: { primary: "serif" as FontFamily, secondary: "sans" as FontFamily },
    borderRadius: "lg" as const,
    shadows: "medium" as const,
    animations: true,
  }

  const applyThemePreset = (presetId: ThemePresetType) => {
    const preset = themePresets.find((p) => p.id === presetId)
    if (!preset) return

    onConfigChange({
      theme: {
        ...config.theme,
        designSystem: preset.designSystem,
        colors: preset.colors,
        gradient: {
          ...config.theme.gradient,
          stops: preset.gradient.stops,
          angle: preset.gradient.angle,
        },
      },
      header: {
        ...config.header,
        scrolled: {
          ...(config.header.scrolled || {}),
          backgroundColor: preset.colors.primary,
        }
      }
    })
  }

  const updateDesignSystem = (updates: Partial<EditorConfig["theme"]["designSystem"]>) => {
    onConfigChange({
      theme: {
        ...config.theme,
        designSystem: { ...config.theme.designSystem, ...updates },
      },
    })
  }

  const updateColors = (updates: Partial<EditorConfig["theme"]["colors"]>) => {
    const headerUpdates = updates.primary ? {
      header: {
        ...config.header,
        scrolled: {
          ...(config.header.scrolled || {}),
          backgroundColor: updates.primary,
        }
      }
    } : {}

    onConfigChange({
      theme: {
        ...config.theme,
        colors: { ...config.theme.colors, ...updates },
      },
      ...headerUpdates
    })
  }

  const updateCSSVariables = (updates: Record<string, string>) => {
    onConfigChange({
      theme: {
        ...config.theme,
        cssVariables: { ...(config.theme.cssVariables || {}), ...updates },
      },
    })
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-8 px-5 py-6 pb-24">
        
        {/* Presets Grid */}
        <section className="space-y-4">
          <header className="flex items-center justify-between">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Estilos Recomendados</h3>
            <Sparkles className="h-3 w-3 text-muted-foreground/30" />
          </header>
          
          <div className="grid grid-cols-1 gap-4">
            {themePresets.map((preset) => {
              const isSelected = designSystem.preset === preset.id
              return (
                <button
                  key={preset.id}
                  onClick={() => applyThemePreset(preset.id)}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border-2 transition-all duration-300",
                    isSelected 
                      ? "border-primary bg-primary/5 shadow-[0_0_0_4px_rgba(var(--primary),0.1)]" 
                      : "border-border/50 bg-card/30 hover:border-border hover:bg-card/50"
                  )}
                  style={isSelected ? { borderColor: accentColor, boxShadow: `0 0 0 4px ${accentColor}20` } : {}}
                >
                  <div className="flex p-4 gap-4">
                    {/* Visual Preview Section */}
                    <div 
                      className="w-24 h-24 rounded-xl border border-white/5 shadow-inner overflow-hidden flex flex-col p-2 gap-2 shrink-0"
                      style={{ background: `linear-gradient(135deg, ${preset.colors.secondary}, ${preset.colors.background})` }}
                    >
                      <div 
                        className="h-4 w-full rounded-full opacity-60" 
                        style={{ backgroundColor: preset.colors.primary }} 
                      />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-1.5 w-full bg-white/10 rounded-full" />
                        <div className="h-1.5 w-3/4 bg-white/10 rounded-full" />
                        <div className="h-1.5 w-1/2 bg-white/10 rounded-full" />
                      </div>
                      <div 
                        className="h-5 w-full rounded-lg shadow-sm flex items-center justify-center"
                        style={{ backgroundColor: preset.colors.primary }}
                      >
                        <div className="w-1/2 h-1 bg-white/20 rounded-full" />
                      </div>
                    </div>

                    {/* Text Section */}
                    <div className="flex flex-col justify-center items-start text-left flex-1 py-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold tracking-tight text-foreground">{preset.label}</span>
                        {isSelected && <Check className="h-3.5 w-3.5" style={{ color: accentColor }} />}
                      </div>
                      <p className="text-[10px] text-muted-foreground/70 leading-relaxed font-medium">
                        {preset.description}
                      </p>
                      
                      <div className="flex gap-1.5 mt-3">
                        {Object.values(preset.colors).slice(0, 7).map((color, i) => (
                          <div 
                            key={i} 
                            className="w-2.5 h-2.5 rounded-full border border-white/10" 
                            style={{ backgroundColor: color }} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        {/* Customization Accordion */}
        <section className="space-y-3 pt-4 border-t border-border/40">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-4">Personalizar Estilo</h3>
          
          {/* Colors Section */}
          <AccordionSection
            title="Cores"
            icon={Palette}
            isOpen={openSection === "colors"}
            onToggle={() => setOpenSection(openSection === "colors" ? null : "colors")}
            accentColor={accentColor}
          >
            <div className="grid grid-cols-2 gap-4 py-2">
              <ColorPickerItem
                label="Marca Principal"
                color={config.theme.colors.primary}
                onChange={(c) => updateColors({ primary: c })}
              />
              <ColorPickerItem
                label="Marca Secundária"
                color={config.theme.colors.secondary}
                onChange={(c) => updateColors({ secondary: c })}
              />
              <ColorPickerItem
                label="Destaque / Ação"
                color={config.theme.colors.accent}
                onChange={(c) => updateColors({ accent: c })}
              />
              <ColorPickerItem
                label="Plano de Fundo"
                color={config.theme.colors.background}
                onChange={(c) => updateColors({ background: c })}
              />
              <ColorPickerItem
                label="Cor do Texto"
                color={config.theme.colors.text}
                onChange={(c) => updateColors({ text: c })}
              />
              <ColorPickerItem
                label="Superfície (Cards)"
                color={config.theme.colors.surface}
                onChange={(c) => updateColors({ surface: c })}
              />
              <ColorPickerItem
                label="Bordas / Muted"
                color={config.theme.colors.muted}
                onChange={(c) => updateColors({ muted: c })}
              />
            </div>
          </AccordionSection>



          {/* Border Radius Section */}
          <AccordionSection
            title="Formas e Cantos"
            icon={Box}
            isOpen={openSection === "forms"}
            onToggle={() => setOpenSection(openSection === "forms" ? null : "forms")}
            accentColor={accentColor}
          >
            <div className="flex items-center justify-between gap-2 py-4">
              {(["none", "sm", "md", "lg", "full"] as const).map((radius) => (
                <button
                  key={radius}
                  onClick={() => updateDesignSystem({ borderRadius: radius })}
                  className={cn(
                    "flex-1 h-12 flex items-center justify-center border-2 transition-all group",
                    designSystem.borderRadius === radius 
                      ? "border-primary bg-primary/5" 
                      : "border-border/40 hover:border-border hover:bg-muted/50"
                  )}
                  style={designSystem.borderRadius === radius ? { borderColor: accentColor, backgroundColor: `${accentColor}10` } : {}}
                >
                  <div 
                    className={cn(
                      "w-6 h-6 border-2 border-current transition-all group-active:scale-90",
                      radius === "none" && "rounded-none",
                      radius === "sm" && "rounded-sm",
                      radius === "md" && "rounded-md",
                      radius === "lg" && "rounded-lg",
                      radius === "full" && "rounded-full"
                    )}
                    style={{ color: designSystem.borderRadius === radius ? accentColor : "inherit" }}
                  />
                </button>
              ))}
            </div>
          </AccordionSection>
        </section>

        {/* Reset Actions */}
        <div className="pt-8">
          <Button 
            variant="outline" 
            className="w-full border-dashed border-border/60 text-muted-foreground h-12 text-xs font-bold gap-2"
            onClick={() => applyThemePreset("neutral")}
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            Redefinir Estilo Original
          </Button>
        </div>
      </div>
    </div>
  )
}

function AccordionSection({ 
  title, 
  icon: Icon, 
  isOpen, 
  onToggle, 
  children,
  accentColor
}: { 
  title: string, 
  icon: any, 
  isOpen: boolean, 
  onToggle: () => void, 
  children: React.ReactNode,
  accentColor: string
}) {
  return (
    <div className="overflow-hidden border border-border/40 rounded-2xl bg-card/20 transition-all duration-300">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between p-4 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-background border border-border/50">
            <Icon className="h-4 w-4 text-muted-foreground/70" style={isOpen ? { color: accentColor } : {}} />
          </div>
          <span className={cn("text-[13px] font-bold tracking-tight", isOpen ? "text-foreground" : "text-foreground/80")}>{title}</span>
        </div>
        <ChevronRight className={cn("h-4 w-4 text-muted-foreground/30 transition-transform duration-300", isOpen && "rotate-90 text-foreground/50")} />
      </button>
      <div className={cn(
        "grid transition-all duration-300 ease-in-out",
        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      )}>
        <div className="overflow-hidden">
          <div className="px-4 pb-5 border-t border-border/20 mt-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

function ColorPickerItem({ label, color, onChange }: { label: string, color: string, onChange: (c: string) => void }) {
  const safeColor = color || "#000000"
  
  return (
    <div className="space-y-2">
      <Label className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest">{label}</Label>
      <div className="relative group">
        <input
          type="color"
          value={safeColor}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex items-center gap-2 p-1.5 rounded-xl border border-border/50 bg-background hover:border-border transition-colors">
          <div 
            className="w-8 h-8 rounded-lg shadow-sm border border-white/5" 
            style={{ backgroundColor: safeColor }} 
          />
          <span className="text-[10px] font-mono text-muted-foreground/80 font-bold uppercase">{safeColor}</span>
        </div>
      </div>
    </div>
  )
}

function FontButton({ selected, onClick, font, accentColor, small }: { selected: boolean, onClick: () => void, font: { id: FontFamily | string, label: string, preview: string }, accentColor: string, small?: boolean }) {
  const isSystem = ['sans', 'serif', 'mono', 'display'].includes(font.id)
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all",
        selected 
          ? "border-primary bg-primary/5" 
          : "border-border/40 bg-card/20 hover:border-border/60 hover:bg-card/40"
      )}
      style={selected ? { borderColor: accentColor, backgroundColor: `${accentColor}10` } : {}}
    >
      <span 
        className={cn("text-xl text-foreground mb-1", small && "text-lg")}
        style={{ 
          fontFamily: isSystem ? `var(--font-${font.id})` : `"${font.id}", sans-serif`,
          fontStyle: font.id === 'serif' || font.id === 'Cormorant Garamond' || font.id === 'Lora' ? 'italic' : 'normal',
          fontWeight: font.id === 'display' || font.id === 'mono' || font.id === 'Montserrat' ? 'bold' : 'normal'
        }}
      >
        {font.preview}
      </span>
      <span className="text-[8px] font-bold text-muted-foreground/60 uppercase tracking-widest truncate w-full text-center">{font.label}</span>
    </button>
  )
}
