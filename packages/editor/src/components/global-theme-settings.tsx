"use client"

import { cn } from "../lib/utils"
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
    id: "hightech",
    label: "Hightech",
    description: "Futurista e inovador",
    colors: {
      primary: "#00d4ff",
      secondary: "#0a0f1a",
      accent: "#ff00aa",
      background: "#050810",
      text: "#ffffff",
    },
    gradient: {
      stops: [
        { color: "#0a0f1a", position: 0 },
        { color: "#001122", position: 40 },
        { color: "#00111fcc", position: 100 },
      ],
      angle: 90,
    },
    designSystem: {
      preset: "hightech",
      fonts: { primary: "mono", secondary: "sans" },
      borderRadius: "lg",
      shadows: "dramatic",
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
    id: "custom",
    label: "Personalizado",
    description: "Configure manualmente",
    colors: {
      primary: "#8b5cf6",
      secondary: "#1e1b4b",
      accent: "#c084fc",
      background: "#0f0d1a",
      text: "#ffffff",
    },
    gradient: {
      stops: [
        { color: "#1e1b4b", position: 0 },
        { color: "#4c1d95", position: 50 },
        { color: "transparent", position: 100 },
      ],
      angle: 90,
    },
    designSystem: {
      preset: "custom",
      fonts: { primary: "sans", secondary: "sans" },
      borderRadius: "md",
      shadows: "medium",
      animations: true,
    },
  },
]

const fontOptions: { id: FontFamily; label: string; preview: string }[] = [
  { id: "sans", label: "Sans Serif", preview: "Aa" },
  { id: "serif", label: "Serif", preview: "Aa" },
  { id: "mono", label: "Monospace", preview: "Aa" },
  { id: "display", label: "Display", preview: "Aa" },
]

interface GlobalThemeSettingsProps {
  config: EditorConfig
  onConfigChange: (updates: Partial<EditorConfig>) => void
  accentColor?: string
}

export function GlobalThemeSettings({ config, onConfigChange, accentColor = "#10b981" }: GlobalThemeSettingsProps) {
  if (!config?.theme) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
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

  return (
    <div className="space-y-6 px-4 pt-6 pb-12">
      {/* Theme Presets */}
      <div>
        <Label className="mb-3 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Estilo
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {themePresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyThemePreset(preset.id)}
              className={cn(
                "flex flex-col items-start gap-1.5 rounded-lg border p-3 text-left transition-all",
                designSystem.preset === preset.id
                  ? "border-current bg-current/10"
                  : "border-border hover:border-muted-foreground/30"
              )}
              style={designSystem.preset === preset.id ? { borderColor: accentColor, backgroundColor: `${accentColor}15` } : undefined}
            >
              <div
                className="h-8 w-full rounded-md"
                style={{
                  background: `linear-gradient(135deg, ${preset.colors.primary}, ${preset.colors.secondary})`,
                }}
              />
              <span className="text-xs font-medium text-foreground">{preset.label}</span>
              <span className="text-[10px] text-muted-foreground">{preset.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Font Selection */}
      <div className="space-y-3 border-t border-border pt-4">
        <Label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Tipografia
        </Label>

        <div>
          <Label className="mb-2 block text-[10px] text-muted-foreground">Fonte Primária (Títulos)</Label>
          <div className="grid grid-cols-4 gap-1.5">
            {fontOptions.map((font) => (
              <button
                key={font.id}
                onClick={() => updateDesignSystem({ fonts: { ...designSystem.fonts, primary: font.id } })}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-md border p-2 transition-all",
                  designSystem.fonts.primary === font.id
                    ? "bg-current/10"
                    : "border-border hover:border-muted-foreground/30"
                )}
                style={designSystem.fonts.primary === font.id ? { borderColor: accentColor, backgroundColor: `${accentColor}15` } : undefined}
              >
                <span className={cn(
                  "text-lg text-foreground",
                  font.id === "sans" && "font-sans",
                  font.id === "serif" && "font-serif italic",
                  font.id === "mono" && "font-mono",
                  font.id === "display" && "font-serif font-bold"
                )}>
                  {font.preview}
                </span>
                <span className="text-[8px] text-muted-foreground">{font.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label className="mb-2 block text-[10px] text-muted-foreground">Fonte Secundária (Corpo)</Label>
          <div className="grid grid-cols-4 gap-1.5">
            {fontOptions.map((font) => (
              <button
                key={font.id}
                onClick={() => updateDesignSystem({ fonts: { ...designSystem.fonts, secondary: font.id } })}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-md border p-2 transition-all",
                  designSystem.fonts.secondary === font.id
                    ? "bg-current/10"
                    : "border-border hover:border-muted-foreground/30"
                )}
                style={designSystem.fonts.secondary === font.id ? { borderColor: accentColor, backgroundColor: `${accentColor}15` } : undefined}
              >
                <span className={cn(
                  "text-sm text-foreground",
                  font.id === "sans" && "font-sans",
                  font.id === "serif" && "font-serif",
                  font.id === "mono" && "font-mono",
                  font.id === "display" && "font-serif"
                )}>
                  {font.preview}
                </span>
                <span className="text-[8px] text-muted-foreground">{font.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Border Radius */}
      <div className="space-y-2 border-t border-border pt-4">
        <Label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Formas
        </Label>
        <div className="flex gap-2">
          {(["none", "sm", "md", "lg", "full"] as const).map((radius) => (
            <button
              key={radius}
              onClick={() => updateDesignSystem({ borderRadius: radius })}
              className={cn(
                "flex-1 border p-2 transition-all",
                radius === "none" && "rounded-none",
                radius === "sm" && "rounded",
                radius === "md" && "rounded-lg",
                radius === "lg" && "rounded-xl",
                radius === "full" && "rounded-full",
                designSystem.borderRadius !== radius && "border-border hover:border-muted-foreground/30"
              )}
              style={designSystem.borderRadius === radius ? { borderColor: accentColor, backgroundColor: `${accentColor}15` } : undefined}
            >
              <div className={cn(
                "mx-auto h-4 w-6",
                radius === "none" && "rounded-none",
                radius === "sm" && "rounded",
                radius === "md" && "rounded-md",
                radius === "lg" && "rounded-lg",
                radius === "full" && "rounded-full"
              )} style={{ backgroundColor: `${accentColor}80` }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
