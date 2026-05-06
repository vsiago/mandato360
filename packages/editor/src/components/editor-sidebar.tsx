"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { cn, hexToRgba } from "../lib/utils"
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
  MousePointer2,
  RotateCcw,
  Layout,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronRight,
  ArrowRight,
  Calendar,
  MessageSquare,
  Phone,
  Info,
  Check,
  Star,
  Zap,
  Trash2,
  GripVertical,
} from "lucide-react"

// ... (existing imports and helpers)

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
  ButtonConfig,
} from "../types"
import { resolveHero, hasOverride } from "../hooks/use-resolved-config"

const ICON_OPTIONS = [
  { id: "ArrowRight", icon: ArrowRight },
  { id: "ChevronRight", icon: ChevronRight },
  { id: "Calendar", icon: Calendar },
  { id: "MessageSquare", icon: MessageSquare },
  { id: "Phone", icon: Phone },
  { id: "Zap", icon: Zap },
  { id: "Star", icon: Star },
  { id: "Info", icon: Info },
]

const SECTION_LABELS: Record<string, string> = {
  'trust': 'Destaques',
  'services': 'Serviços',
  'about': 'Sobre',
  'beforeAfter': 'Resultados',
  'faq': 'FAQ',
  'contact': 'Contato',
  'agendamento': 'Agendar',
  'antes_depois': 'Resultados',
  'practiceAreas': 'Áreas de Atuação',
  'team': 'Equipe'
}

interface ButtonEditorProps {
  label: string
  config: Partial<ButtonConfig>
  defaultConfig: Partial<ButtonConfig>
  accentColor: string
  onChange: (updates: Partial<ButtonConfig>) => void
  onReset: () => void
}

const ButtonEditor = ({ label, config, defaultConfig, accentColor, onChange, onReset }: ButtonEditorProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{label}</Label>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onReset}
          className="h-6 gap-1 px-1.5 text-[9px] font-bold uppercase text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-3 w-3" /> Reset
        </Button>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-[11px] font-medium text-foreground/70">Texto do Botão</Label>
          <Input
            value={config.text || defaultConfig.text || ""}
            onChange={(e) => onChange({ text: e.target.value })}
            placeholder="Ex: Agendar Agora"
            className="h-8 text-[11px] border-border/50 bg-background"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-[11px] font-medium text-foreground/70">Link ou Âncora (#)</Label>
          <Input
            value={config.link || defaultConfig.link || ""}
            onChange={(e) => onChange({ link: e.target.value })}
            placeholder="Ex: #agenda ou /contato"
            className="h-8 text-[11px] border-border/50 bg-background font-mono"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-[11px] font-medium text-foreground/70">Icon Esquerda</Label>
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => onChange({ iconLeft: undefined })}
                className={cn(
                  "h-7 w-7 rounded border border-border flex items-center justify-center transition-all",
                  !config.iconLeft ? "bg-accent text-accent-foreground border-accent" : "hover:bg-muted"
                )}
              >
                <X className="h-3 w-3" />
              </button>
              {ICON_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onChange({ iconLeft: opt.id })}
                  className={cn(
                    "h-7 w-7 rounded border border-border flex items-center justify-center transition-all",
                    config.iconLeft === opt.id ? "bg-accent text-accent-foreground border-accent" : "hover:bg-muted"
                  )}
                >
                  <opt.icon className="h-3 w-3" />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] font-medium text-foreground/70">Icon Direita</Label>
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => onChange({ iconRight: undefined })}
                className={cn(
                  "h-7 w-7 rounded border border-border flex items-center justify-center transition-all",
                  !config.iconRight ? "bg-accent text-accent-foreground border-accent" : "hover:bg-muted"
                )}
              >
                <X className="h-3 w-3" />
              </button>
              {ICON_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onChange({ iconRight: opt.id })}
                  className={cn(
                    "h-7 w-7 rounded border border-border flex items-center justify-center transition-all",
                    config.iconRight === opt.id ? "bg-accent text-accent-foreground border-accent" : "hover:bg-muted"
                  )}
                >
                  <opt.icon className="h-3 w-3" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3 border-t border-border pt-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-[10px] text-muted-foreground">Padding X</Label>
                <span className="text-[10px] font-mono">{config.paddingX ?? 24}px</span>
              </div>
              <Slider
                value={[config.paddingX ?? 24]}
                onValueChange={([val]) => onChange({ paddingX: val })}
                min={8}
                max={64}
                step={1}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-[10px] text-muted-foreground">Padding Y</Label>
                <span className="text-[10px] font-mono">{config.paddingY ?? 12}px</span>
              </div>
              <Slider
                value={[config.paddingY ?? 12]}
                onValueChange={([val]) => onChange({ paddingY: val })}
                min={4}
                max={32}
                step={1}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-[10px] text-muted-foreground">Altura</Label>
                <span className="text-[10px] font-mono">{config.height ?? 48}px</span>
              </div>
              <Slider
                value={[config.height ?? 48]}
                onValueChange={([val]) => onChange({ height: val })}
                min={32}
                max={80}
                step={1}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] text-muted-foreground">Largura</Label>
              <div className="grid grid-cols-2 gap-1 rounded bg-muted p-0.5">
                <button
                  onClick={() => onChange({ width: 'auto' })}
                  className={cn(
                    "px-2 py-1 text-[8px] font-bold uppercase rounded",
                    (config.width === 'auto' || !config.width) ? "bg-background shadow-sm" : "text-muted-foreground"
                  )}
                >
                  Auto
                </button>
                <button
                  onClick={() => onChange({ width: 'full' })}
                  className={cn(
                    "px-2 py-1 text-[8px] font-bold uppercase rounded",
                    config.width === 'full' ? "bg-background shadow-sm" : "text-muted-foreground"
                  )}
                >
                  Full
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3 border-t border-border pt-3 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-[10px] text-muted-foreground">Tam. Texto</Label>
                  <span className="text-[10px] font-mono">{config.fontSize ?? 12}px</span>
                </div>
                <Slider
                  value={[config.fontSize ?? 12]}
                  onValueChange={([val]) => onChange({ fontSize: val })}
                  min={10}
                  max={24}
                  step={1}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-[10px] text-muted-foreground">Tam. Ícone</Label>
                  <span className="text-[10px] font-mono">{config.iconSize ?? 16}px</span>
                </div>
                <Slider
                  value={[config.iconSize ?? 16]}
                  onValueChange={([val]) => onChange({ iconSize: val })}
                  min={10}
                  max={32}
                  step={1}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-[10px] text-muted-foreground">Peso Ícone (Stroke)</Label>
                <span className="text-[10px] font-mono">{config.iconWeight ?? 2}px</span>
              </div>
              <Slider
                value={[config.iconWeight ?? 2]}
                onValueChange={([val]) => onChange({ iconWeight: val })}
                min={1}
                max={4}
                step={0.5}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3 border-t border-border pt-3">
           <div className="flex items-center justify-between">
            <Label className="text-[11px] font-medium text-foreground/70">Cores Personalizadas</Label>
            <Switch 
              checked={!!config.backgroundColor} 
              onCheckedChange={(checked) => {
                if (checked) {
                  onChange({ backgroundColor: accentColor, textColor: '#ffffff' })
                } else {
                  onChange({ backgroundColor: undefined, textColor: undefined })
                }
              }}
            />
          </div>
          
          {config.backgroundColor && (
            <div className="space-y-3 p-3 rounded-lg border border-border/50 bg-muted/20">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] text-muted-foreground">Fundo</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.backgroundColor}
                    onChange={(e) => onChange({ backgroundColor: e.target.value })}
                    className="h-6 w-6 cursor-pointer rounded border-0 bg-transparent"
                  />
                  <Input
                    value={config.backgroundColor}
                    onChange={(e) => onChange({ backgroundColor: e.target.value })}
                    className="h-7 w-20 border-border/50 bg-background font-mono text-[9px]"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-[10px] text-muted-foreground">Texto</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.textColor || '#ffffff'}
                    onChange={(e) => onChange({ textColor: e.target.value })}
                    className="h-6 w-6 cursor-pointer rounded border-0 bg-transparent"
                  />
                  <Input
                    value={config.textColor || '#ffffff'}
                    onChange={(e) => onChange({ textColor: e.target.value })}
                    className="h-7 w-20 border-border/50 bg-background font-mono text-[9px]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-[10px] text-muted-foreground">Ícones</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.iconColor || config.textColor || '#ffffff'}
                    onChange={(e) => onChange({ iconColor: e.target.value })}
                    className="h-6 w-6 cursor-pointer rounded border-0 bg-transparent"
                  />
                  <Input
                    value={config.iconColor || config.textColor || '#ffffff'}
                    onChange={(e) => onChange({ iconColor: e.target.value })}
                    className="h-7 w-20 border-border/50 bg-background font-mono text-[9px]"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-border/30">
                <GradientControls
                  title="Gradiente do Botão"
                  gradient={config.gradient || { enabled: false, angle: 90, opacity: 100, stops: [{ color: config.backgroundColor || accentColor, position: 0 }, { color: '#000000', position: 100 }] }}
                  onUpdate={(updates) => onChange({ gradient: { ...(config.gradient || { enabled: false, angle: 90, opacity: 100, stops: [{ color: config.backgroundColor || accentColor, position: 0 }, { color: '#000000', position: 100 }] }), ...updates } })}
                  onApplyPreset={(updates) => onChange({ ...updates })}
                  accentColor={accentColor}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

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
  openAccordion: AccordionType | null
  onToggleAccordion: (id: AccordionType | null) => void
  className?: string
  placeholders?: {
    title?: string
    description?: string
    badge?: string
    ctaPrimary?: string
    ctaSecondary?: string
  }
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
  onApplyPreset?: (updates: { gradient: GradientConfig; textColor?: string; iconColor?: string }) => void
  title?: string
  showEnabled?: boolean
  accentColor?: string
}

const GradientControls = ({
  gradient,
  onUpdate,
  onApplyPreset,
  title = "Gradiente",
  showEnabled = true,
  accentColor = "#10b981",
}: GradientControlsProps) => {
  const angleRef = useRef<HTMLDivElement>(null)
  const [isDraggingAngle, setIsDraggingAngle] = useState(false)

  const GRADIENT_PRESETS = [
    { 
      name: "Black", 
      stops: [{ color: '#1a1a1a', position: 0, opacity: 100 }, { color: '#000000', position: 100, opacity: 100 }],
      angle: 135,
      textColor: '#ffffff',
      iconColor: '#ffffff'
    },
    { 
      name: "White", 
      stops: [{ color: '#ffffff', position: 0, opacity: 100 }, { color: '#f8fafc', position: 100, opacity: 100 }],
      angle: 135,
      textColor: '#000000',
      iconColor: '#000000'
    },
    { 
      name: "Elegante", 
      stops: [{ color: accentColor, position: 0, opacity: 100 }, { color: accentColor, position: 100, opacity: 60 }],
      angle: 135,
      textColor: '#ffffff',
      iconColor: '#ffffff'
    },
    { 
      name: "Profundo", 
      stops: [{ color: accentColor, position: 0, opacity: 100 }, { color: '#000000', position: 100, opacity: 100 }],
      angle: 135,
      textColor: '#ffffff',
      iconColor: '#ffffff'
    },
    { 
      name: "Suave", 
      stops: [{ color: '#ffffff', position: 0, opacity: 100 }, { color: accentColor, position: 100, opacity: 100 }],
      angle: 135,
      textColor: accentColor,
      iconColor: accentColor
    },
    { 
      name: "Aurora", 
      stops: [{ color: '#00f2fe', position: 0, opacity: 100 }, { color: '#4facfe', position: 100, opacity: 100 }],
      angle: 135,
      textColor: '#ffffff',
      iconColor: '#ffffff'
    },
    { 
      name: "Sunset", 
      stops: [{ color: '#fa709a', position: 0, opacity: 100 }, { color: '#fee140', position: 100, opacity: 100 }],
      angle: 135,
      textColor: '#ffffff',
      iconColor: '#ffffff'
    },
    { 
      name: "Oceano", 
      stops: [{ color: '#43e97b', position: 0, opacity: 100 }, { color: '#38f9d7', position: 100, opacity: 100 }],
      angle: 135,
      textColor: '#ffffff',
      iconColor: '#ffffff'
    },
    { 
      name: "Glassy", 
      stops: [{ color: '#ffffff', position: 0, opacity: 20 }, { color: '#ffffff', position: 100, opacity: 5 }],
      angle: 135,
      textColor: '#ffffff',
      iconColor: '#ffffff'
    },
    { 
      name: "Minimal", 
      stops: [{ color: accentColor, position: 0, opacity: 40 }, { color: 'transparent', position: 100, opacity: 0 }],
      angle: 135,
      textColor: accentColor,
      iconColor: accentColor
    },
  ]

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

      {gradient.enabled && (
        <div className="space-y-2 mb-6">
          <Label className="text-[10px] uppercase font-bold text-muted-foreground/60 px-1">Presets Premium</Label>
          <div className="flex gap-3 overflow-x-auto pb-3 px-1 scrollbar-hide snap-x">
            {GRADIENT_PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => {
                  const updates = {
                    gradient: { 
                      enabled: true, 
                      stops: preset.stops,
                      angle: preset.angle 
                    },
                    textColor: preset.textColor,
                    iconColor: preset.iconColor
                  }
                  
                  if (onApplyPreset) {
                    onApplyPreset(updates)
                  } else {
                    onUpdate(updates.gradient)
                  }
                }}
                className="flex flex-col items-center gap-1.5 shrink-0 snap-start group"
              >
                <div 
                  className={cn(
                    "h-12 w-12 rounded-full border-2 border-border transition-all group-hover:scale-110 group-hover:border-accent group-active:scale-95 shadow-sm",
                    "flex items-center justify-center overflow-hidden"
                  )}
                  style={{ 
                    background: `linear-gradient(${preset.angle}deg, ${preset.stops.map(s => `${hexToRgba(s.color, s.opacity)} ${s.position}%`).join(', ')})` 
                  }}
                />
                <span className="text-[9px] font-bold uppercase text-muted-foreground/70 group-hover:text-foreground transition-colors">{preset.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
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
              <div key={index} className="space-y-2 rounded-lg border border-border/50 bg-muted/30 p-2.5">
                <div className="flex items-center gap-3">
                  <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-md border border-border shadow-sm">
                    <input
                      type="color"
                      value={stop.color === "transparent" ? "#ffffff" : stop.color}
                      onChange={(e) => {
                        const newStops = [...gradient.stops]
                        newStops[index] = { ...stop, color: e.target.value }
                        onUpdate({ stops: newStops })
                      }}
                      className="absolute inset-0 h-[150%] w-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer border-0 bg-transparent"
                    />
                  </div>
                  
                  <div className="flex flex-1 flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">Posição</span>
                      <span className="text-[10px] font-mono font-bold text-muted-foreground">{stop.position}%</span>
                    </div>
                    <Slider
                      value={[stop.position]}
                      onValueChange={([position]) => {
                        const newStops = [...gradient.stops]
                        newStops[index] = { ...stop, position }
                        onUpdate({ stops: newStops })
                      }}
                      max={100}
                      step={1}
                      className="touch-none"
                    />
                  </div>

                  {gradient.stops.length > 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newStops = gradient.stops.filter((_, i) => i !== index)
                        onUpdate({ stops: newStops })
                      }}
                      className="h-6 w-6 p-0 text-muted-foreground/30 hover:text-red-500"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-3 border-t border-border/40 pt-2">
                  <div className="flex flex-1 flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">Opacidade</span>
                      <span className="text-[10px] font-mono font-bold text-muted-foreground">{stop.opacity ?? 100}%</span>
                    </div>
                    <Slider
                      value={[stop.opacity ?? 100]}
                      onValueChange={([opacity]) => {
                        const newStops = [...gradient.stops]
                        newStops[index] = { ...stop, opacity }
                        onUpdate({ stops: newStops })
                      }}
                      max={100}
                      step={1}
                      className="touch-none"
                    />
                  </div>
                </div>
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
  openAccordion,
  onToggleAccordion,
  className,
  placeholders,
}: EditorSidebarProps) {
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
          {/* Section Title - Premium Glassmorphism Redesign */}
          <div className="relative border-b border-border p-5 overflow-hidden group bg-gradient-to-br from-white/[0.04] to-transparent backdrop-blur-md border-l-2" style={{ borderLeftColor: accentColor }}>
            {/* Subtle background glow */}
            <div 
              className="absolute -right-4 -top-4 h-24 w-24 rounded-full blur-3xl opacity-10 transition-opacity group-hover:opacity-25"
              style={{ backgroundColor: accentColor }}
            />
            
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="p-1.5 rounded-lg bg-muted/40 border border-border/50 shadow-inner">
                <Layers className="h-3.5 w-3.5" style={{ color: accentColor }} />
              </div>
              <h2 className="text-[12px] font-black uppercase tracking-[0.15em] text-foreground/90">
                {activePlugin.label}
              </h2>
            </div>
            
            <p className="text-[10px] text-muted-foreground/60 font-medium tracking-tight">
              Personalize esta seção e seus componentes
            </p>
          </div>
          <div className="w-full">
            <PluginSidebar
              config={pluginConfig}
              accentColor={accentColor}
              onImageUpload={onImageUpload}
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
  
  const updateHeaderScrolled = (updates: Partial<EditorConfig["header"]["scrolled"]>) => {
    onConfigChange({
      header: {
        ...config.header,
        scrolled: { ...config.header.scrolled, ...updates },
      },
    })
  }

  const updateHeaderScrolledColors = (updates: Partial<EditorConfig["header"]["scrolled"]["colors"]>) => {
    onConfigChange({
      header: {
        ...config.header,
        scrolled: {
          ...config.header.scrolled,
          colors: { ...config.header.scrolled.colors, ...updates },
        },
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

  const handleHeaderLogoMiniUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (onImageUpload) {
      try {
        setIsUploading(true)
        const url = await onImageUpload(file)
        updateHeader({ logoMini: url })
      } catch (err: any) {
        console.error("Mini Logo Upload Error:", err)
      } finally {
        setIsUploading(false)
      }
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string
      updateHeader({ logoMini: imageUrl })
    }
    reader.readAsDataURL(file)
  }

  const removeHeaderLogoMini = () => {
    updateHeader({ logoMini: null })
  }

  const toggleAccordion = (id: AccordionType) => {
    onToggleAccordion(openAccordion === id ? null : id)
  }

  const info = sectionTitle[activeSection] || { title: activeSection, desc: "Editar seção" }

  return (
    <aside className={cn("flex h-full w-72 shrink-0 flex-col bg-background lg:w-80", className)}>
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Section Title - Premium Glassmorphism Redesign */}
        <div className="relative border-b border-border p-5 overflow-hidden group bg-gradient-to-br from-white/[0.04] to-transparent backdrop-blur-md border-l-2" style={{ borderLeftColor: accentColor }}>
          {/* Subtle background glow */}
          <div 
            className="absolute -right-4 -top-4 h-24 w-24 rounded-full blur-3xl opacity-10 transition-opacity group-hover:opacity-25"
            style={{ backgroundColor: accentColor }}
          />
          
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-muted/40 border border-border/50 shadow-inner">
                <Layers className="h-3.5 w-3.5" style={{ color: accentColor }} />
              </div>
              <h2 className="text-[12px] font-black uppercase tracking-[0.15em] text-foreground/90">
                {info.title}
              </h2>
            </div>
            
            {activeSection === "hero" && device !== "mobile" && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-border/50 bg-background/50 backdrop-blur-sm shadow-sm">
                <div className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
                <span className="text-[8px] font-black uppercase tracking-tighter text-foreground/70">
                  {device === "tablet" ? "Tablet" : "Desktop"}
                </span>
              </div>
            )}
          </div>
          
          <p className="text-[10px] text-muted-foreground/60 font-medium tracking-tight">
            {info.desc}
            {activeSection === "hero" && device !== "mobile" && (
              <span className="ml-1 opacity-50 italic">— modo override {device}</span>
            )}
          </p>
        </div>

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

                {/* Logo Mini (Dashboard Sidebar Collapsed) */}
                <div className="pt-4 border-t border-border/50">
                  <Label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                    Logo Miniatura
                    <span className="text-[9px] font-normal lowercase bg-muted px-1.5 py-0.5 rounded text-muted-foreground/60">Painel Contraído</span>
                  </Label>
                  {config.header.logoMini ? (
                    <div className="relative group w-20">
                      <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-border bg-muted p-3">
                        <img src={config.header.logoMini} alt="Mini Logo Preview" className="max-h-full max-w-full object-contain" />
                      </div>
                      <button
                        onClick={removeHeaderLogoMini}
                        className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow-lg opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <label className={cn(
                      "flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed transition-colors hover:bg-muted",
                      isUploading && "pointer-events-none opacity-50"
                    )} style={{ borderColor: `${accentColor}40` }}>
                      {isUploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" style={{ color: accentColor }} />
                      ) : (
                        <Upload className="h-4 w-4" style={{ color: accentColor }} />
                      )}
                      <span className="text-[10px] font-medium text-center" style={{ color: accentColor }}>
                        Upload
                      </span>
                      <input type="file" accept="image/*" onChange={handleHeaderLogoMiniUpload} className="hidden" disabled={isUploading} />
                    </label>
                  )}
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

        {activeSection === "header" && (
          <AccordionItem
            id="header-nav"
            icon={AlignLeft}
            label="Menu de Navegação"
            isOpen={openAccordion === "header-nav"}
            accentColor={accentColor}
            onToggle={toggleAccordion}
          >
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Itens do Menu</Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      const newItems = [...(config.header.menuItems || [])]
                      // Generate a safe ID
                      const newId = `item-${Math.random().toString(36).substr(2, 9)}`
                      newItems.push({ id: newId, label: "Novo Item", href: "#" })
                      updateHeader({ menuItems: newItems as any })
                    }}
                    className="h-6 gap-1 px-1.5 text-[9px] font-bold uppercase"
                    style={{ color: accentColor }}
                  >
                    <Plus className="h-3 w-3" /> Adicionar
                  </Button>
                </div>

                <div className="space-y-2">
                  {/* Automatic items from sectionOrder */}
                  {config.sectionOrder
                    .filter(id => id !== 'header' && id !== 'hero' && id !== 'footer' && id !== 'trust')
                    .map((id) => {
                      const item = (config.header.menuItems || []).find((m: any) => m.id === id)
                      const label = item?.label || (id === 'team' && config.header.logoText?.includes('Adv') ? 'Equipe Jurídica' : SECTION_LABELS[id] || id)
                      const href = item?.href || `#${id}`

                      return (
                        <div key={id} className="group relative flex flex-col gap-2 rounded-lg border border-border/50 bg-muted/20 p-3 transition-all hover:bg-muted/40">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-accent/40" style={{ backgroundColor: accentColor + '66' }} />
                            <Input
                              value={label}
                              onChange={(e) => {
                                const newItems = [...(config.header.menuItems || [])]
                                const idx = newItems.findIndex((m: any) => m.id === id)
                                if (idx !== -1) {
                                  newItems[idx] = { ...newItems[idx], label: e.target.value }
                                } else {
                                  newItems.push({ id, label: e.target.value, href })
                                }
                                updateHeader({ menuItems: newItems })
                              }}
                              placeholder="Label"
                              className="h-8 flex-1 text-[11px] border-border/50 bg-background"
                            />
                            <div className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-tighter">Auto</div>
                          </div>
                          <Input
                            value={href}
                            onChange={(e) => {
                              const newItems = [...(config.header.menuItems || [])]
                              const idx = newItems.findIndex((m: any) => m.id === id)
                              if (idx !== -1) {
                                newItems[idx] = { ...newItems[idx], href: e.target.value }
                              } else {
                                newItems.push({ id, label, href: e.target.value })
                              }
                              updateHeader({ menuItems: newItems })
                            }}
                            placeholder="Link (#secao ou URL)"
                            className="h-7 text-[10px] border-border/30 bg-background/50 font-mono"
                          />
                        </div>
                      )
                    })
                  }

                  {/* Custom items from menuItems (not in sectionOrder) */}
                  {(config.header.menuItems || [])
                    .filter((m: any) => !config.sectionOrder.includes(m.id))
                    .map((item: any, index: number) => (
                      <div key={item.id || index} className="group relative flex flex-col gap-2 rounded-lg border border-accent/20 bg-accent/5 p-3 transition-all hover:bg-accent/10">
                        <div className="flex items-center gap-2">
                          <Plus className="h-3 w-3 text-accent" style={{ color: accentColor }} />
                          <Input
                            value={item.label}
                            onChange={(e) => {
                              const newItems = [...config.header.menuItems]
                              const idx = newItems.findIndex((m: any) => m.id === item.id)
                              newItems[idx] = { ...item, label: e.target.value }
                              updateHeader({ menuItems: newItems })
                            }}
                            placeholder="Label"
                            className="h-8 flex-1 text-[11px] border-border/50 bg-background"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newItems = config.header.menuItems.filter((m: any) => m.id !== item.id)
                              updateHeader({ menuItems: newItems })
                            }}
                            className="h-8 w-8 p-0 text-muted-foreground/30 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <Input
                          value={item.href}
                          onChange={(e) => {
                            const newItems = [...config.header.menuItems]
                            const idx = newItems.findIndex((m: any) => m.id === item.id)
                            newItems[idx] = { ...item, href: e.target.value }
                            updateHeader({ menuItems: newItems })
                          }}
                          placeholder="Link (#secao ou URL)"
                          className="h-7 text-[10px] border-border/30 bg-background/50 font-mono"
                        />
                      </div>
                    ))
                  }
                </div>
              </div>

              <div className="space-y-4 border-t border-border pt-4">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground">Tamanho do Texto</Label>
                    <span className="text-xs font-mono text-muted-foreground">{config.header.menuFontSize || 14}px</span>
                  </div>
                  <Slider
                    value={[config.header.menuFontSize || 14]}
                    onValueChange={([val]) => updateHeader({ menuFontSize: val })}
                    min={10}
                    max={24}
                    step={1}
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground">Espaçamento entre Itens</Label>
                    <span className="text-xs font-mono text-muted-foreground">{config.header.menuSpacing || 32}px</span>
                  </div>
                  <Slider
                    value={[config.header.menuSpacing || 32]}
                    onValueChange={([val]) => updateHeader({ menuSpacing: val })}
                    min={8}
                    max={64}
                    step={2}
                  />
                </div>
              </div>
            </div>
          </AccordionItem>
        )}

        {/* Content \u2014 Section-specific (Moved to top) */}
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
                <div className="flex items-center justify-between border-t border-border pt-4 mb-4">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Modo de Edição</Label>
                  <div className="grid grid-cols-2 gap-1.5 rounded-lg bg-muted p-1">
                    {(["fixed", "static"] as const).map((behavior) => (
                      <button
                        key={behavior}
                        onClick={() => {
                          updateHeader({ 
                            behavior,
                            menuStyle: behavior === "fixed" ? "gradient" : "solid"
                          })
                          if (behavior === "static") onConfigChange({ headerPreviewView: "top" })
                        }}
                        className={cn(
                          "rounded-md px-3 py-1.5 text-[9px] font-bold transition-all uppercase tracking-wider",
                          config.header.behavior === behavior
                            ? "bg-white/10 text-foreground shadow-sm"
                            : "text-muted-foreground/70 hover:text-muted-foreground"
                        )}
                      >
                        {behavior === "fixed" ? "Fixo" : "Estático"}
                      </button>
                    ))}
                  </div>
                </div>

                {config.header.behavior === "fixed" && (
                  <div className="space-y-3 mb-4 bg-muted/30 p-3 rounded-lg border border-border/50">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 block">Comportamento</Label>
                    <div className="grid grid-cols-2 bg-muted p-0.5 rounded-md border border-border/50">
                      <button
                        onClick={() => onConfigChange({ headerPreviewView: "top" })}
                        className={cn(
                          "px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded transition-all",
                          (config.headerPreviewView || "top") === "top" ? "bg-white/10 text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        Topo
                      </button>
                      <button
                        onClick={() => {
                          onConfigChange({ headerPreviewView: "scrolled" })
                          if (!config.header.scrolled.enabled) updateHeaderScrolled({ enabled: true })
                        }}
                        className={cn(
                          "px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded transition-all",
                          config.headerPreviewView === "scrolled" ? "bg-white/10 text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        Scroll
                      </button>
                    </div>
                  </div>
                )}

                { (config.headerPreviewView || "top") === "top" ? (
                  <div className="space-y-4">
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
                        <Label className="text-xs text-muted-foreground">Cor de Fundo (Padrão)</Label>
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
                        title="Gradiente (Padrão)"
                        showEnabled={false}
                        accentColor={accentColor}
                      />
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-4 border-t border-border pt-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-muted-foreground">Efeito de Scroll</Label>
                        <Switch
                          checked={config.header.scrolled.enabled}
                          onCheckedChange={(enabled) => updateHeaderScrolled({ enabled })}
                        />
                      </div>

                      {config.header.scrolled.enabled && (
                        <div className="space-y-4 rounded-lg border border-border/50 bg-muted/30 p-3">
                          <div>
                            <div className="mb-2 flex items-center justify-between">
                              <Label className="text-[10px] text-muted-foreground">Altura no Scroll</Label>
                              <span className="text-[10px] font-mono text-muted-foreground">{config.header.scrolled.height}px</span>
                            </div>
                            <Slider
                              value={[config.header.scrolled.height]}
                              onValueChange={([height]) => updateHeaderScrolled({ height })}
                              min={40}
                              max={120}
                              step={1}
                              className="touch-none"
                            />
                          </div>

                          <div className="flex items-center justify-between gap-3 border-t border-border/50 pt-3">
                            <Label className="text-[10px] text-muted-foreground">Fundo no Scroll</Label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={config.header.scrolled.backgroundColor}
                                onChange={(e) => updateHeaderScrolled({ backgroundColor: e.target.value })}
                                className="h-6 w-6 cursor-pointer rounded border-0 bg-transparent"
                              />
                              <Input
                                value={config.header.scrolled.backgroundColor}
                                onChange={(e) => updateHeaderScrolled({ backgroundColor: e.target.value })}
                                className="h-7 w-16 border-border/50 bg-input font-mono text-[9px] text-foreground/60"
                              />
                            </div>
                          </div>

                          <div className="space-y-2 border-t border-border/50 pt-3">
                             <Label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">Cores dos Elementos</Label>
                             <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                {[
                                  { key: 'logo', label: 'Logo' },
                                  { key: 'menu', label: 'Menu' },
                                  { key: 'cta', label: 'Botão CTA' },
                                  { key: 'hamburger', label: 'Hamburger' }
                                ].map(({ key, label }) => (
                                  <div key={key} className="flex items-center justify-between gap-2">
                                    <span className="text-[9px] text-muted-foreground">{label}</span>
                                    <input
                                      type="color"
                                      value={(config.header.scrolled.colors as any)[key]}
                                      onChange={(e) => updateHeaderScrolledColors({ [key]: e.target.value })}
                                      className="h-5 w-5 cursor-pointer rounded border-0 bg-transparent"
                                    />
                                  </div>
                                ))}
                             </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
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
                    placeholder={placeholders?.badge || "Texto do badge"}
                    className="h-9 border-border/50 bg-input text-foreground/80 placeholder:text-muted-foreground/50 text-xs"
                  />
                  <div className="flex items-center gap-1 mt-2">
                    {["✨", "🔥", "💎", "⭐", "🚀", "❤️", "📍"].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => updateHero({ badge: `${emoji} ${resolvedHero.badge || ''}`.trim() })}
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted text-xs transition-colors border border-border/50 bg-background shadow-sm"
                        title={`Adicionar emoji ${emoji}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center mb-1.5">
                    <Label className="text-xs text-muted-foreground">Título</Label>
                    <OverrideIndicator active={isOverridden('title')} onReset={() => resetOverride('title')} accentColor={accentColor} />
                  </div>
                  <Input
                    value={resolvedHero.title}
                    onChange={(e) => updateHero({ title: e.target.value })}
                    placeholder={placeholders?.title || "Título principal"}
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
                    placeholder={placeholders?.description || "Descrição"}
                    className="h-9 border-border/50 bg-input text-foreground/80 placeholder:text-muted-foreground/50 text-xs"
                  />
                </div>
              </>
            )}

            {activeSection === "hero" && (
              <div className="space-y-4">
                <p className="text-[10px] font-medium text-muted-foreground/60 italic border-t border-border/30 pt-4">
                  Dica: Para configurações avançadas, use os acordeões de botões abaixo.
                </p>
              </div>
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

        {/* Layout & Dimensions - Only for Hero */}
        {activeSection === "hero" && (
          <AccordionItem
            id="layout"
            icon={Wand2}
            label="Personalizar"
            isOpen={openAccordion === "layout"}
            accentColor={accentColor}
            onToggle={toggleAccordion}
          >
            <div className="space-y-4">
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
          </AccordionItem>
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
            {/* Gradient \u2014 device-aware via Hero overrides */}
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

                // ONLY write through hero override system \u2014 never touch theme.gradient
                updateHero({ gradient: fullGradient })
              }}
              accentColor={accentColor}
            />
          </AccordionItem>
        )}


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

        {/* Primary Button - Only for Hero */}
        {activeSection === "hero" && (
          <AccordionItem
            id="button-primary"
            icon={MousePointer2}
            label="Botão Primário"
            isOpen={openAccordion === "button-primary"}
            accentColor={accentColor}
            onToggle={toggleAccordion}
          >
            <ButtonEditor
              label="Botão Primário"
              config={resolvedHero.buttonPrimary || { text: resolvedHero.ctaPrimary || placeholders?.ctaPrimary || "Agendar", link: "#agendamento" }}
              defaultConfig={{ text: resolvedHero.ctaPrimary || placeholders?.ctaPrimary || "Agendar", link: "#agendamento" }}
              accentColor={accentColor}
              onChange={(updates) => updateHero({ 
                buttonPrimary: { 
                  ...(resolvedHero.buttonPrimary || { text: resolvedHero.ctaPrimary || placeholders?.ctaPrimary || "Agendar", link: "#agendamento" }), 
                  ...updates 
                } 
              })}
              onReset={() => resetOverride('buttonPrimary')}
            />
          </AccordionItem>
        )}

        {/* Secondary Button - Only for Hero */}
        {activeSection === "hero" && (
          <AccordionItem
            id="button-secondary"
            icon={MousePointer2}
            label="Botão Secundário"
            isOpen={openAccordion === "button-secondary"}
            accentColor={accentColor}
            onToggle={toggleAccordion}
          >
            <ButtonEditor
              label="Botão Secundário"
              config={resolvedHero.buttonSecondary || { text: resolvedHero.ctaSecondary || placeholders?.ctaSecondary || "Ver Serviços", link: "#services", outline: true }}
              defaultConfig={{ text: resolvedHero.ctaSecondary || placeholders?.ctaSecondary || "Ver Serviços", link: "#services", outline: true }}
              accentColor={accentColor}
              onChange={(updates) => updateHero({ 
                buttonSecondary: { 
                  ...(resolvedHero.buttonSecondary || { text: resolvedHero.ctaSecondary || placeholders?.ctaSecondary || "Ver Serviços", link: "#services", outline: true }), 
                  ...updates 
                } 
              })}
              onReset={() => resetOverride('buttonSecondary')}
            />
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
