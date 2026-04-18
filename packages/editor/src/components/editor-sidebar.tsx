"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { cn } from "../lib/utils"
import {
  Palette,
  Image,
  Droplets,
  Wand2,
  ChevronDown,
  Upload,
  X,
  Plus,
  Lightbulb,
  Type,
  Layers,
  Loader2,
} from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Slider } from "./ui/slider"
import { Switch } from "./ui/switch"
import type {
  EditorConfig,
  DeviceType,
  OrientationType,
  GradientConfig,
  EditorPlugin,
  AccordionType,
  HeroOverridableProps,
  ImagePosition,
} from "../types"
import { resolveHero, hasOverride } from "../hooks/use-resolved-config"

interface EditorSidebarProps {
  config: EditorConfig
  device: DeviceType
  activeSection: string
  plugins: EditorPlugin[]
  accentColor?: string
  onConfigChange: (updates: Partial<EditorConfig>) => void
  onHeroChange?: (device: DeviceType, updates: Partial<HeroOverridableProps>) => void
  onHeroReset?: (device: DeviceType, prop: keyof HeroOverridableProps) => void
  onPluginConfigChange: (pluginId: string, updates: any) => void
  onImageUpload?: (file: File) => Promise<string>
  className?: string
}

/** Small indicator dot: purple = override active, click to reset */
function OverrideIndicator({ active, onReset, accentColor }: { active: boolean; onReset?: () => void; accentColor: string }) {
  if (!active) return null
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onReset?.() }}
      title="Override ativo — clique para resetar"
      className="ml-1 inline-flex h-3 w-3 items-center justify-center rounded-full transition-all hover:scale-125"
      style={{ backgroundColor: accentColor }}
    >
      <span className="text-[6px] font-bold text-white">✕</span>
    </button>
  )
}

interface AccordionItemProps {
  id: AccordionType
  icon: any
  label: string
  isOpen: boolean
  accentColor?: string
  onToggle: (id: AccordionType) => void
  children: React.ReactNode
}

const AccordionItem = ({
  id,
  icon: Icon,
  label,
  isOpen,
  accentColor = "#10b981",
  onToggle,
  children,
}: AccordionItemProps) => (
  <div className="border-b border-border">
    <button
      onClick={() => onToggle(id)}
      className={cn(
        "group flex w-full items-center justify-between p-4 text-left transition-all duration-200 hover:bg-muted",
        isOpen && "bg-muted/50"
      )}
    >
      <div className="flex items-center gap-3">
        <Icon className={cn(
          "h-4 w-4 transition-colors duration-200",
          isOpen ? "text-current" : "text-muted-foreground/50 group-hover:text-foreground"
        )} style={isOpen ? { color: accentColor } : undefined} />
        <span className={cn(
          "text-sm font-medium transition-colors duration-200",
          isOpen ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
        )}>{label}</span>
      </div>
      <ChevronDown
        className={cn(
          "h-3.5 w-3.5 text-muted-foreground/50 transition-transform duration-300",
          isOpen && "rotate-180 text-muted-foreground"
        )}
      />
    </button>
    {isOpen && (
      <div className="space-y-4 px-4 pb-4 pt-2">{children}</div>
    )}
  </div>
)

interface GradientControlsProps {
  gradient: GradientConfig
  onUpdate: (updates: Partial<GradientConfig>) => void
  title?: string
  showEnabled?: boolean
  accentColor?: string
}

const GradientControls = ({
  gradient,
  onUpdate,
  title = "Gradiente",
  showEnabled = true,
  accentColor = "#10b981",
}: GradientControlsProps) => {
  const angleRef = useRef<HTMLDivElement>(null)
  const [isDraggingAngle, setIsDraggingAngle] = useState(false)

  return (
    <div className="space-y-3 border-t border-border pt-4">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</Label>
        {showEnabled && (
          <Switch
            checked={gradient.enabled}
            onCheckedChange={(enabled) => onUpdate({ enabled })}
          />
        )}
      </div>
      {(gradient.enabled || !showEnabled) && (
        <>
          {/* Visual Angle Control */}
          <div className="flex flex-col items-center gap-2">
            <Label className="text-xs text-muted-foreground">Ajuste de Ângulo Visual</Label>
            <div
              ref={angleRef}
              className={cn(
                "relative h-28 w-28 cursor-pointer select-none",
                isDraggingAngle && "cursor-grabbing"
              )}
              onMouseDown={(e) => {
                e.preventDefault()
                setIsDraggingAngle(true)
                const handleDrag = (ev: MouseEvent | React.MouseEvent) => {
                  if (!angleRef.current) return
                  const rect = angleRef.current.getBoundingClientRect()
                  const centerX = rect.left + rect.width / 2
                  const centerY = rect.top + rect.height / 2
                  const deltaX = ev.clientX - centerX
                  const deltaY = ev.clientY - centerY
                  let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90
                  if (angle < 0) angle += 360
                  onUpdate({ angle: Math.round(angle) })
                }
                handleDrag(e as any)
                const handleMouseMove = (ev: MouseEvent) => handleDrag(ev)
                const handleMouseUp = () => {
                  setIsDraggingAngle(false)
                  window.removeEventListener("mousemove", handleMouseMove)
                  window.removeEventListener("mouseup", handleMouseUp)
                }
                window.addEventListener("mousemove", handleMouseMove)
                window.addEventListener("mouseup", handleMouseUp)
              }}
            >
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-border" />
              <div
                className="absolute left-1/2 top-1/2 h-12 w-0.5 origin-bottom transition-none"
                style={{
                  transform: `translateX(-50%) translateY(-100%) rotate(${gradient.angle}deg)`,
                  backgroundColor: accentColor,
                }}
              />
              <div
                className="absolute h-4 w-4 rounded-full border-2 bg-background"
                style={{
                  borderColor: accentColor,
                  left: `calc(50% + ${Math.sin(gradient.angle * Math.PI / 180) * 48}px - 8px)`,
                  top: `calc(50% - ${Math.cos(gradient.angle * Math.PI / 180) * 48}px - 8px)`,
                }}
              />
              <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-background" style={{ borderColor: accentColor }} />
            </div>
            <span className="text-sm font-mono" style={{ color: accentColor }}>{gradient.angle}°</span>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Opacidade</Label>
              <span className="text-xs font-mono text-muted-foreground">{gradient.opacity}%</span>
            </div>
            <Slider
              value={[gradient.opacity]}
              onValueChange={([opacity]) => onUpdate({ opacity })}
              max={100}
              step={1}
              className="touch-none"
            />
          </div>

            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Pontos de Cor</Label>
              {gradient.stops.length < 5 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const lastStop = gradient.stops[gradient.stops.length - 1]
                    const newStop = { 
                      color: lastStop?.color || "#ffffff", 
                      position: Math.min(100, (lastStop?.position || 0) + 20) 
                    }
                    onUpdate({ stops: [...gradient.stops, newStop] })
                  }}
                  className="h-6 w-6 p-0 hover:text-emerald-500"
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
            {gradient.stops.map((stop, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="color"
                  value={stop.color === "transparent" ? "#ffffff" : stop.color}
                  onChange={(e) => {
                    const newStops = [...gradient.stops]
                    newStops[index] = { ...stop, color: e.target.value }
                    onUpdate({ stops: newStops })
                  }}
                  className="h-7 w-7 cursor-pointer rounded border-0 bg-transparent"
                />
                <Slider
                  value={[stop.position]}
                  onValueChange={([position]) => {
                    const newStops = [...gradient.stops]
                    newStops[index] = { ...stop, position }
                    onUpdate({ stops: newStops })
                  }}
                  max={100}
                  step={1}
                  className="flex-1 touch-none"
                />
                <span className="w-8 text-right text-xs font-mono text-muted-foreground">
                  {stop.position}%
                </span>
                {gradient.stops.length > 2 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newStops = gradient.stops.filter((_, i) => i !== index)
                      onUpdate({ stops: newStops })
                    }}
                    className="h-6 w-6 p-0 text-muted-foreground/50 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
        </>
      )}
    </div>
  )
}

const sectionTitle: Record<string, { title: string; desc: string }> = {
  header: { title: "Header", desc: "Menu de navegação" },
  hero: { title: "Hero (Banner Principal)", desc: "Edite o fundo e conteúdo" },
  footer: { title: "Footer", desc: "Rodapé do site" },
}

export function EditorSidebar({
  config,
  device,
  activeSection,
  plugins,
  accentColor = "#10b981",
  onConfigChange,
  onHeroChange,
  onHeroReset,
  onPluginConfigChange,
  onImageUpload,
  className,
}: EditorSidebarProps) {
  const [openAccordion, setOpenAccordion] = useState<AccordionType | null>("theme")
  const [imageDevice, setImageDevice] = useState<DeviceType>(device)
  const [isUploading, setIsUploading] = useState(false)

  // Resolved Hero for the current device (reads with overrides applied)
  const resolvedHero = resolveHero(config.hero, device)

  // Sync imageDevice when device changes from the header bar
  useEffect(() => {
    setImageDevice(device)
  }, [device])

  // Helper: check if a prop has an override for the current device
  const isOverridden = (prop: keyof HeroOverridableProps) => hasOverride(config.hero, device, prop)

  // Helper: reset an override for the current device
  const resetOverride = (prop: keyof HeroOverridableProps) => onHeroReset?.(device, prop)

  // Check if active section is a plugin
  const activePlugin = plugins.find((p) => p.id === activeSection)

  // If it's a plugin section, render the plugin's sidebar
  if (activePlugin) {
    const PluginSidebar = activePlugin.sidebarComponent
    const pluginConfig = config.plugins?.[activePlugin.id] || activePlugin.defaultConfig
    return (
      <aside className={cn("flex h-full w-72 shrink-0 flex-col bg-background lg:w-80", className)}>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Section Title */}
          <div className="border-b border-border p-4 border-l" style={{ borderLeftColor: accentColor }}>
            <div className="mb-0.5 flex items-center gap-2">
              <Layers className="h-3.5 w-3.5" style={{ color: accentColor }} />
              <h2 className="text-[11px] font-bold uppercase tracking-[0.1em] text-foreground/90">
                {activePlugin.label}
              </h2>
            </div>
            <p className="text-[10px] text-muted-foreground/70 font-medium">Personalize esta seção</p>
          </div>
          <div className="p-4">
            <PluginSidebar
              config={pluginConfig}
              onChange={(updates) => onPluginConfigChange(activePlugin.id, updates)}
            />
          </div>
        </div>
        {/* Design tip */}
        <div className="shrink-0 border-t border-border p-3">
          <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3">
            <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: accentColor }} />
            <p className="text-[10px] leading-relaxed text-muted-foreground/70">
              Use cores e estilos com o empírico de 60/30/10: 60% base, 30% acentuação, <strong className="text-muted-foreground">10% destaque</strong>.
            </p>
          </div>
        </div>
      </aside>
    )
  }

  // Core section updates
  const updateColors = (key: keyof EditorConfig["theme"]["colors"], value: string) => {
    onConfigChange({
      theme: {
        ...config.theme,
        colors: { ...config.theme.colors, [key]: value },
        designSystem: { ...config.theme.designSystem, preset: "custom" },
      },
    })
  }

  const updateGradient = (updates: Partial<GradientConfig>) => {
    onConfigChange({
      theme: {
        ...config.theme,
        gradient: { ...config.theme.gradient, ...updates },
      },
    })
  }

  // Device-aware Hero update: routes to base (mobile) or overrides (tablet/desktop)
  const updateHero = (updates: Partial<HeroOverridableProps>) => {
    if (onHeroChange) {
      onHeroChange(device, updates)
    } else {
      // Fallback for backward compat
      onConfigChange({ hero: { ...config.hero, ...updates } })
    }
  }

  const updateHeroPosition = (axis: keyof ImagePosition, value: number) => {
    // Image positions are always per-device (not part of overrides)
    onConfigChange({
      hero: {
        ...config.hero,
        imagePosition: {
          ...config.hero.imagePosition,
          [imageDevice]: { ...config.hero.imagePosition[imageDevice], [axis]: value },
        },
      },
    })
  }

  const updateVignette = (updates: Partial<EditorConfig["hero"]["vignette"]>) => {
    updateHero({ vignette: { ...resolvedHero.vignette, ...updates } })
  }

  const updateOverlay = (updates: Partial<EditorConfig["hero"]["overlay"]>) => {
    updateHero({ overlay: { ...resolvedHero.overlay, ...updates } })
  }

  const updateHeader = (updates: Partial<EditorConfig["header"]>) => {
    onConfigChange({ header: { ...config.header, ...updates } })
  }

  const updateHeaderGradient = (updates: Partial<GradientConfig>) => {
    onConfigChange({
      header: {
        ...config.header,
        gradient: { ...config.header.gradient, ...updates },
      },
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (onImageUpload) {
      try {
        setIsUploading(true)
        const url = await onImageUpload(file)
        
        const newImages = { ...config.hero.images, [imageDevice]: url };
        
        // PROPAGATION LOGIC: If uploading to desktop, fill others if they are null
        if (imageDevice === 'desktop') {
          if (!newImages.tablet) newImages.tablet = url;
          if (!newImages.mobile) newImages.mobile = url;
        }

        onConfigChange({
          hero: {
            ...config.hero,
            images: newImages,
          },
        })
      } catch (err: any) {
        console.error("Upload Error:", err)
      } finally {
        setIsUploading(false)
      }
      return
    }

    // Fallback behavior (legacy)
    const reader = new FileReader()
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string
      onConfigChange({
        hero: {
          ...config.hero,
          images: { ...config.hero.images, [imageDevice]: imageUrl },
        },
      })
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    onConfigChange({
      hero: {
        ...config.hero,
        images: { ...config.hero.images, [imageDevice]: null },
      },
    })
  }

  const handleHeaderLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (onImageUpload) {
      try {
        setIsUploading(true)
        const url = await onImageUpload(file)
        updateHeader({ logo: url })
      } catch (err: any) {
        console.error("Logo Upload Error:", err)
      } finally {
        setIsUploading(false)
      }
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string
      updateHeader({ logo: imageUrl })
    }
    reader.readAsDataURL(file)
  }

  const removeHeaderLogo = () => {
    updateHeader({ logo: null })
  }

  const toggleAccordion = (id: AccordionType) => {
    setOpenAccordion(openAccordion === id ? null : id)
  }

  const info = sectionTitle[activeSection] || { title: activeSection, desc: "Editar seção" }

  return (
    <aside className={cn("flex h-full w-72 shrink-0 flex-col bg-background lg:w-80", className)}>
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Section Title */}
        <div className="border-b border-border p-4 border-l" style={{ borderLeftColor: accentColor }}>
          <div className="mb-0.5 flex items-center gap-2">
            <Layers className="h-3.5 w-3.5" style={{ color: accentColor }} />
            <h2 className="text-[11px] font-bold uppercase tracking-[0.1em] text-foreground/90">
              {info.title}
            </h2>
            {activeSection === "hero" && device !== "mobile" && (
              <span className="ml-auto text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
                {device === "tablet" ? "Tablet" : "Desktop"}
              </span>
            )}
          </div>
          <p className="text-[10px] text-muted-foreground/70 font-medium">
            {info.desc}
            {activeSection === "hero" && device !== "mobile" && (
              <span className="ml-1 opacity-70">— editando override para {device}</span>
            )}
          </p>
        </div>

        {/* Layout & Dimensions - Only for Hero (Pinned at top for visibility) */}
        {activeSection === "hero" && (
          <div className="border-b border-border p-4 bg-muted/20">
            <div className="space-y-4 rounded-lg bg-background p-3 border border-border/50 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-foreground/80">Auto Preencher</Label>
                    <OverrideIndicator active={isOverridden('autoHeight')} onReset={() => resetOverride('autoHeight')} accentColor={accentColor} />
                  </div>
                  <p className="text-[9px] text-muted-foreground">Ocupar 100% da tela (100vh)</p>
                </div>
                <Switch
                  checked={resolvedHero.autoHeight !== false}
                  onCheckedChange={(checked) => updateHero({ autoHeight: checked })}
                />
              </div>
              {!resolvedHero.autoHeight && (
                <div className="space-y-3 pt-3 border-t border-border/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Label className="text-[11px] font-medium text-muted-foreground">Altura Manual</Label>
                      <OverrideIndicator active={isOverridden('height')} onReset={() => resetOverride('height')} accentColor={accentColor} />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">{resolvedHero.height || 600}px</span>
                  </div>
                  <Slider
                    value={[resolvedHero.height || 600]}
                    onValueChange={([val]) => updateHero({ height: val })}
                    min={300}
                    max={1000}
                    step={10}
                    className="touch-none"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Colors & Gradient - Only for Hero (NOW DEVICE-AWARE) */}
        {activeSection === "hero" && (
          <AccordionItem
            id="colors"
            icon={Droplets}
            label="Cores e Gradiente"
            isOpen={openAccordion === "colors"}
            accentColor={accentColor}
            onToggle={toggleAccordion}
          >
            <div className="space-y-3">
              <Label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">Cores</Label>
              {Object.entries(config.theme.colors).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between gap-3">
                  <Label className="text-xs capitalize text-muted-foreground">
                    {key === "primary" ? "Primária" : key === "secondary" ? "Secundária" : key === "accent" ? "Destaque" : key === "background" ? "Fundo" : "Texto"}
                  </Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={value || ""}
                      onChange={(e) => updateColors(key as keyof EditorConfig["theme"]["colors"], e.target.value)}
                      className="h-8 w-8 cursor-pointer rounded border-0 bg-transparent"
                    />
                    <Input
                      value={value || ""}
                      onChange={(e) => updateColors(key as keyof EditorConfig["theme"]["colors"], e.target.value)}
                      className="h-8 w-20 border-border/50 bg-input font-mono text-[10px] text-foreground/60"
                    />
                  </div>
                </div>
              ))}
            </div>
            {/* Gradient — device-aware via Hero overrides */}
            <GradientControls
              gradient={resolvedHero.gradient?.enabled ? resolvedHero.gradient : config.theme.gradient}
              onUpdate={(updates) => {
                // Determine the full current gradient for this device
                // If hero has its own gradient, use that. Otherwise seed from theme.gradient
                const currentGradient = resolvedHero.gradient?.enabled
                  ? resolvedHero.gradient
                  : config.theme.gradient

                // Build complete gradient with stops deep-copied
                const fullGradient = {
                  ...currentGradient,
                  ...updates,
                  // If updates include stops, use them. Otherwise keep current
                  stops: updates.stops
                    ? updates.stops.map(s => ({ ...s }))
                    : currentGradient.stops.map(s => ({ ...s })),
                }

                // ONLY write through hero override system — never touch theme.gradient
                updateHero({ gradient: fullGradient })
              }}
              accentColor={accentColor}
            />
          </AccordionItem>
        )}

        {/* Header Content */}
        {activeSection === "header" && (
          <AccordionItem
            id="header-content"
            icon={Palette}
            label="Conteúdo"
            isOpen={openAccordion === "header-content"}
            accentColor={accentColor}
            onToggle={toggleAccordion}
          >
            <div className="space-y-4">
              <div className="space-y-3">
                <Label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">Logo do Header</Label>
                {config.header.logo ? (
                  <div className="relative group">
                    <div className="flex h-24 w-full items-center justify-center rounded-lg border border-border bg-muted p-4">
                      <img src={config.header.logo} alt="Logo Preview" className="max-h-full max-w-full object-contain" />
                    </div>
                    <button
                      onClick={removeHeaderLogo}
                      className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-foreground opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className={cn(
                    "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors hover:bg-muted",
                    isUploading && "pointer-events-none opacity-50"
                  )} style={{ borderColor: `${accentColor}50` }}>
                    {isUploading ? (
                      <Loader2 className="h-6 w-6 animate-spin" style={{ color: accentColor }} />
                    ) : (
                      <Upload className="h-6 w-6" style={{ color: accentColor }} />
                    )}
                    <span className="text-xs font-medium" style={{ color: accentColor }}>
                      {isUploading ? "Enviando..." : "Upload Logo (PNG, SVG)"}
                    </span>
                    <input type="file" accept="image/*" onChange={handleHeaderLogoUpload} className="hidden" disabled={isUploading} />
                  </label>
                )}
                <div>
                  <Label className="mb-1.5 block text-xs text-muted-foreground">Texto do Logo (Backup)</Label>
                  <Input
                    value={config.header.logoText || ""}
                    onChange={(e) => updateHeader({ logoText: e.target.value })}
                    placeholder="Nome do Logo"
                    className="h-9 border-border/50 bg-input text-foreground/80 placeholder:text-muted-foreground/50 text-xs"
                  />
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground">Tamanho do Logo</Label>
                    <span className="text-xs font-mono text-muted-foreground">{config.header.logoHeight}px</span>
                  </div>
                  <Slider
                    value={[config.header.logoHeight]}
                    onValueChange={([logoHeight]) => updateHeader({ logoHeight })}
                    min={16}
                    max={80}
                    step={1}
                    className="touch-none"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-4">
                <Label className="text-xs text-muted-foreground">Mostrar CTA</Label>
                <Switch
                  checked={config.header.showCta}
                  onCheckedChange={(showCta) => updateHeader({ showCta })}
                />
              </div>
            </div>
          </AccordionItem>
        )}

        {/* Content — Section-specific */}
        <AccordionItem
          id="content"
          icon={activeSection === "header" ? Wand2 : Type}
          label={activeSection === "header" ? "Personalizar" : "Conteúdo"}
          isOpen={openAccordion === "content"}
          accentColor={accentColor}
          onToggle={toggleAccordion}
        >
          <div className="space-y-4">
            {activeSection === "header" && (
              <>
                <div>
                  <Label className="mb-3 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Estilo do Fundo</Label>
                  <div className="grid grid-cols-3 gap-1.5 rounded-lg bg-muted p-1">
                    {(["transparent", "solid", "gradient"] as const).map((style) => (
                      <button
                        key={style}
                        onClick={() => onConfigChange({ header: { ...config.header, menuStyle: style } })}
                        className={cn(
                          "rounded-md px-1 py-1.5 text-[9px] font-bold transition-all uppercase tracking-wider",
                          config.header.menuStyle === style
                            ? "bg-white/10 text-foreground shadow-sm"
                            : "text-muted-foreground/70 hover:text-muted-foreground"
                        )}
                      >
                        {style === "transparent" ? "Transp." : style === "solid" ? "Sólido" : "Grad."}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="border-t border-border pt-4">
                  <div className="mb-2 flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground">Altura do Header</Label>
                    <span className="text-xs font-mono text-muted-foreground">{config.header.height}px</span>
                  </div>
                  <Slider
                    value={[config.header.height]}
                    onValueChange={([height]) => updateHeader({ height })}
                    min={48}
                    max={160}
                    step={1}
                    className="touch-none"
                  />
                </div>
                {config.header.menuStyle === "solid" && (
                  <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
                    <Label className="text-xs text-muted-foreground">Cor de Fundo</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.header.backgroundColor}
                        onChange={(e) => updateHeader({ backgroundColor: e.target.value })}
                        className="h-8 w-8 cursor-pointer rounded border-0 bg-transparent"
                      />
                      <Input
                        value={config.header.backgroundColor || "#000000"}
                        onChange={(e) => updateHeader({ backgroundColor: e.target.value })}
                        className="h-8 w-20 border-border/50 bg-input font-mono text-[10px] text-foreground/60"
                      />
                    </div>
                  </div>
                )}
                {config.header.menuStyle === "gradient" && (
                  <GradientControls
                    gradient={config.header.gradient}
                    onUpdate={updateHeaderGradient}
                    title="Gradiente do Header"
                    showEnabled={false}
                    accentColor={accentColor}
                  />
                )}
              </>
            )}

            {activeSection === "hero" && (
              <>
                <div className="pt-0">
                  <div className="flex items-center mb-3">
                    <Label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">Orientação</Label>
                    <OverrideIndicator active={isOverridden('orientation')} onReset={() => resetOverride('orientation')} accentColor={accentColor} />
                  </div>
                  <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
                    {(["left", "center"] as OrientationType[]).map((orient) => (
                      <button
                        key={orient}
                        onClick={() => updateHero({ orientation: orient })}
                        className={cn(
                          "rounded-md px-3 py-1.5 text-[10px] font-bold transition-all uppercase tracking-wider",
                          resolvedHero.orientation === orient
                            ? "bg-white/10 text-foreground shadow-sm"
                            : "text-muted-foreground/70 hover:text-muted-foreground"
                        )}
                      >
                        {orient === "left" ? "Esquerda" : "Centro"}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center mb-1.5">
                    <Label className="text-xs text-muted-foreground">Badge</Label>
                    <OverrideIndicator active={isOverridden('badge')} onReset={() => resetOverride('badge')} accentColor={accentColor} />
                  </div>
                  <Input
                    value={resolvedHero.badge}
                    onChange={(e) => updateHero({ badge: e.target.value })}
                    placeholder="Texto do badge"
                    className="h-9 border-border/50 bg-input text-foreground/80 placeholder:text-muted-foreground/50 text-xs"
                  />
                </div>
                <div>
                  <div className="flex items-center mb-1.5">
                    <Label className="text-xs text-muted-foreground">Título</Label>
                    <OverrideIndicator active={isOverridden('title')} onReset={() => resetOverride('title')} accentColor={accentColor} />
                  </div>
                  <Input
                    value={resolvedHero.title}
                    onChange={(e) => updateHero({ title: e.target.value })}
                    placeholder="Título principal"
                    className="h-9 border-border/50 bg-input text-foreground/80 placeholder:text-muted-foreground/50 text-xs"
                  />
                </div>
                <div>
                  <div className="flex items-center mb-1.5">
                    <Label className="text-xs text-muted-foreground">Descrição</Label>
                    <OverrideIndicator active={isOverridden('description')} onReset={() => resetOverride('description')} accentColor={accentColor} />
                  </div>
                  <Input
                    value={resolvedHero.description}
                    onChange={(e) => updateHero({ description: e.target.value })}
                    placeholder="Descrição"
                    className="h-9 border-border/50 bg-input text-foreground/80 placeholder:text-muted-foreground/50 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="flex items-center mb-1.5">
                      <Label className="text-xs text-muted-foreground">CTA Primário</Label>
                      <OverrideIndicator active={isOverridden('ctaPrimary')} onReset={() => resetOverride('ctaPrimary')} accentColor={accentColor} />
                    </div>
                    <Input
                      value={resolvedHero.ctaPrimary}
                      onChange={(e) => updateHero({ ctaPrimary: e.target.value })}
                      className="h-9 border-border/50 bg-input text-foreground/80 placeholder:text-muted-foreground/50 text-xs"
                    />
                  </div>
                  <div>
                    <div className="flex items-center mb-1.5">
                      <Label className="text-xs text-muted-foreground">CTA Secundário</Label>
                      <OverrideIndicator active={isOverridden('ctaSecondary')} onReset={() => resetOverride('ctaSecondary')} accentColor={accentColor} />
                    </div>
                    <Input
                      value={resolvedHero.ctaSecondary}
                      onChange={(e) => updateHero({ ctaSecondary: e.target.value })}
                      className="h-9 border-border/50 bg-input text-foreground/80 placeholder:text-muted-foreground/50 text-xs"
                    />
                  </div>
                </div>
              </>
            )}

            {activeSection === "footer" && (
              <>
                <div>
                  <Label className="mb-1.5 block text-xs text-muted-foreground">Copyright</Label>
                  <Input
                    value={config.footer.copyright}
                    onChange={(e) => onConfigChange({ footer: { ...config.footer, copyright: e.target.value } })}
                    placeholder="Texto de copyright"
                    className="h-9 border-border/50 bg-input text-foreground/80 placeholder:text-muted-foreground/50 text-xs"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Mostrar Redes Sociais</Label>
                  <Switch
                    checked={config.footer.showSocial}
                    onCheckedChange={(showSocial) => onConfigChange({ footer: { ...config.footer, showSocial } })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Mostrar Newsletter</Label>
                  <Switch
                    checked={config.footer.showNewsletter}
                    onCheckedChange={(showNewsletter) => onConfigChange({ footer: { ...config.footer, showNewsletter } })}
                  />
                </div>
              </>
            )}
          </div>
        </AccordionItem>

        {/* Image - Only for Hero */}
        {activeSection === "hero" && (
          <AccordionItem
            id="image"
            icon={Image}
            label="Imagem de Fundo"
            isOpen={openAccordion === "image"}
            accentColor={accentColor}
            onToggle={toggleAccordion}
          >
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Dispositivo</span>
                <div className="flex gap-1 rounded-lg bg-muted p-1">
                  {(["mobile", "tablet", "desktop"] as DeviceType[]).map((d) => (
                    <button
                      key={d}
                      onClick={() => setImageDevice(d)}
                      className={cn(
                        "flex-1 rounded-md px-2 py-1.5 text-[10px] font-bold transition-all uppercase tracking-wider",
                        imageDevice === d
                          ? "bg-white/10 text-foreground shadow-sm"
                          : "text-muted-foreground/70 hover:text-muted-foreground"
                      )}
                    >
                      {d === "mobile" ? "Mob." : d === "tablet" ? "Tab." : "Desk."}
                    </button>
                  ))}
                </div>
              </div>

              {config.hero.images[imageDevice] ? (
                <div className="relative">
                  <img
                    src={config.hero.images[imageDevice]!}
                    alt="Preview"
                    className="h-32 w-full rounded-lg border border-border object-cover"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-foreground transition-transform hover:scale-110"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className={cn(
                  "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 transition-colors hover:bg-muted",
                  isUploading && "pointer-events-none opacity-50"
                )} style={{ borderColor: `${accentColor}50` }}>
                  {isUploading ? (
                    <Loader2 className="h-8 w-8 animate-spin" style={{ color: accentColor }} />
                  ) : (
                    <Upload className="h-8 w-8" style={{ color: accentColor }} />
                  )}
                  <span className="text-sm font-medium" style={{ color: accentColor }}>
                    {isUploading ? "Enviando arquivo..." : "Clique para upload"}
                  </span>
                  <span className="text-xs text-muted-foreground">PNG, JPG até 10MB</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
                </label>
              )}
            </div>
          </AccordionItem>
        )}

        {/* Position - Only for Hero with image (or desktop fallback) */}
        {activeSection === "hero" && (config.hero.images[imageDevice] || config.hero.images.desktop) && (
          <AccordionItem
            id="position"
            icon={Wand2}
            label={cn("Posicionamento", imageDevice !== "desktop" && !config.hero.images[imageDevice] && "(Herda Desktop)")}
            isOpen={openAccordion === "position"}
            accentColor={accentColor}
            onToggle={toggleAccordion}
          >
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Posição X</Label>
                  <span className="text-xs font-mono text-muted-foreground">{config.hero.imagePosition[imageDevice].x}%</span>
                </div>
                <Slider value={[config.hero.imagePosition[imageDevice].x]} onValueChange={([v]) => updateHeroPosition("x", v)} max={100} step={1} className="touch-none" />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Posição Y</Label>
                  <span className="text-xs font-mono text-muted-foreground">{config.hero.imagePosition[imageDevice].y}%</span>
                </div>
                <Slider value={[config.hero.imagePosition[imageDevice].y]} onValueChange={([v]) => updateHeroPosition("y", v)} max={100} step={1} className="touch-none" />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Zoom</Label>
                  <span className="text-xs font-mono text-muted-foreground">{config.hero.imagePosition[imageDevice].scale}%</span>
                </div>
                <Slider value={[config.hero.imagePosition[imageDevice].scale]} onValueChange={([v]) => updateHeroPosition("scale", v)} min={50} max={200} step={1} className="touch-none" />
              </div>
            </div>
          </AccordionItem>
        )}

        {/* Effects - Only for Hero */}
        {activeSection === "hero" && (
          <AccordionItem
            id="effects"
            icon={Droplets}
            label="Efeitos"
            isOpen={openAccordion === "effects"}
            accentColor={accentColor}
            onToggle={toggleAccordion}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Label className="text-xs text-muted-foreground">Vinheta</Label>
                  <OverrideIndicator active={isOverridden('vignette')} onReset={() => resetOverride('vignette')} accentColor={accentColor} />
                </div>
                <Switch checked={resolvedHero.vignette.enabled} onCheckedChange={(enabled) => updateVignette({ enabled })} />
              </div>
              {resolvedHero.vignette.enabled && (
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground">Intensidade</Label>
                    <span className="text-xs font-mono text-muted-foreground">{resolvedHero.vignette.intensity}%</span>
                  </div>
                  <Slider value={[resolvedHero.vignette.intensity]} onValueChange={([intensity]) => updateVignette({ intensity })} max={100} step={1} className="touch-none" />
                </div>
              )}
              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Label className="text-xs text-muted-foreground">Overlay</Label>
                    <OverrideIndicator active={isOverridden('overlay')} onReset={() => resetOverride('overlay')} accentColor={accentColor} />
                  </div>
                  <Switch checked={resolvedHero.overlay.enabled} onCheckedChange={(enabled) => updateOverlay({ enabled })} />
                </div>
                {resolvedHero.overlay.enabled && (
                  <div className="mt-3 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <Label className="text-xs text-muted-foreground">Cor</Label>
                      <input
                        type="color"
                        value={resolvedHero.overlay.color}
                        onChange={(e) => updateOverlay({ color: e.target.value })}
                        className="h-8 w-8 cursor-pointer rounded border-0 bg-transparent"
                      />
                    </div>
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <Label className="text-xs text-muted-foreground">Opacidade</Label>
                        <span className="text-xs font-mono text-muted-foreground">{resolvedHero.overlay.opacity}%</span>
                      </div>
                      <Slider value={[resolvedHero.overlay.opacity]} onValueChange={([opacity]) => updateOverlay({ opacity })} max={100} step={1} className="touch-none" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </AccordionItem>
        )}
      </div>

      {/* Design tip pinned at bottom */}
      <div className="shrink-0 border-t border-border p-3">
        <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3">
          <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: accentColor }} />
          <p className="text-[10px] leading-relaxed text-muted-foreground/70">
            Use cores e estilos com o empírico de 60/30/10: 60% base, 30% acentuação, <strong className="text-muted-foreground">10% destaque</strong>.
          </p>
        </div>
      </div>
    </aside>
  )
}

