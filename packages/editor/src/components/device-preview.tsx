"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "../lib/utils"
import type { EditorConfig, DeviceType, EditorPlugin } from "../types"
import { Heart, Menu, Globe, Share2, MessageCircle, Link2, Send, Plus, Minus, Maximize2 } from "lucide-react"
import { Slider } from "./ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { resolveHero } from "../hooks/use-resolved-config"
import { InlineToolbar } from "./inline-toolbar"
import { renderMarkdown } from "../lib/markdown-renderer"

interface DevicePreviewProps {
  config: EditorConfig
  device: DeviceType
  activeSection: string
  sectionOrder: string[]
  plugins: EditorPlugin[]
  accentColor?: string
  onConfigChange?: (config: any) => void
}

const fontFamilyMap: Record<string, string> = {
  sans: "var(--font-sans)",
  serif: "var(--font-serif)",
  mono: "var(--font-mono)",
  display: "var(--font-display)",
}

const borderRadiusMap: Record<string, string> = {
  none: "",
  sm: "rounded",
  md: "rounded-lg",
  lg: "rounded-xl",
  full: "rounded-full",
}

export function DevicePreview({ config, device, activeSection, sectionOrder, plugins, accentColor = "#10b981", onConfigChange }: DevicePreviewProps) {
  const [zoom, setZoom] = useState(100)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { theme, header, hero, footer } = config
  // Resolved Hero with overrides applied for the current device
  const resolvedHero = resolveHero(hero, device)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Ignore clicks inside the inline toolbar
      if (target.closest('#inline-toolbar')) {
        return;
      }

      // Ignore if the node was removed from the DOM (often happens when React updates content on click)
      if (!document.body.contains(target)) {
        return;
      }
      
      if (containerRef.current && !containerRef.current.contains(target)) {
        setEditingField(null)
        setTargetRect(null)
        setIsTyping(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleToolbarAction = (action: string) => {
    if (!editingField || !onConfigChange) return

    const fieldKey = editingField.split(".")[1] as keyof typeof hero
    let currentValue = ((hero as any)[fieldKey] || "") as string

    if (action === "bold") {
      const isBold = /^\*\*(.*)\*\*$/.test(currentValue);
      const isBoldItalic = /^\*\*\*(.*)\*\*\*$/.test(currentValue);
      
      let newValue = currentValue;
      if (isBoldItalic) {
        newValue = currentValue.replace(/^\*\*\*(.*)\*\*\*$/, "*$1*")
      } else if (isBold) {
        newValue = currentValue.replace(/^\*\*(.*)\*\*$/, "$1")
      } else if (/^\*(.*)\*$/.test(currentValue)) {
        newValue = currentValue.replace(/^\*(.*)\*$/, "***$1***")
      } else {
        newValue = `**${currentValue}**`
      }
      onConfigChange({ hero: { ...hero, [fieldKey]: newValue } })
    } else if (action === "italic") {
      const isItalic = /^\*(.*)\*$/.test(currentValue) && !/^\*\*(.*)\*\*$/.test(currentValue);
      const isBoldItalic = /^\*\*\*(.*)\*\*\*$/.test(currentValue);
      
      let newValue = currentValue;
      if (isBoldItalic) {
        newValue = currentValue.replace(/^\*\*\*(.*)\*\*\*$/, "**$1**")
      } else if (isItalic) {
        newValue = currentValue.replace(/^\*(.*)\*$/, "$1")
      } else if (/^\*\*(.*)\*\*$/.test(currentValue)) {
        newValue = currentValue.replace(/^\*\*(.*)\*\*$/, "***$1***")
      } else {
        newValue = `*${currentValue}*`
      }
      onConfigChange({ hero: { ...hero, [fieldKey]: newValue } })
    } else if (action.startsWith("size-")) {
      const sizeTag = action.replace("size-", "")
      let cleanValue = currentValue
        .replace(/<sm>/g, "").replace(/<\/sm>/g, "")
        .replace(/<md>/g, "").replace(/<\/md>/g, "")
        .replace(/<lg>/g, "").replace(/<\/lg>/g, "")

      const newValue = sizeTag === 'md' ? cleanValue : `<${sizeTag}>${cleanValue}</${sizeTag}>`
      onConfigChange({ hero: { ...hero, [fieldKey]: newValue } })
    } else if (action === "advanced") {
      // Future advanced settings panel trigger
    }
  }
  const currentImage = (hero.images?.[device] || hero.images?.desktop) || ""
  const currentPosition = hero.imagePosition?.[device] || { x: 50, y: 50, scale: 100 }
  const designSystem = theme.designSystem || {
    preset: "emerald",
    fonts: { primary: "serif", secondary: "sans" },
    borderRadius: "lg",
    shadows: "medium",
    animations: true,
  }

  const primaryFont = fontFamilyMap[designSystem.fonts?.primary || "serif"]
  const secondaryFont = fontFamilyMap[designSystem.fonts?.secondary || "sans"]
  const btnRadius = borderRadiusMap[designSystem.borderRadius || "lg"]

  // Use hero-level gradient (device-aware) if present, otherwise fallback to theme gradient
  const activeGradient = resolvedHero.gradient?.enabled ? resolvedHero.gradient : theme.gradient
  const gradientStyle = activeGradient.enabled
    ? `linear-gradient(${activeGradient.angle}deg, ${activeGradient.stops
        .map((stop) => `${stop.color} ${stop.position}%`)
        .join(", ")})`
    : undefined

  const headerGradientStyle = `linear-gradient(${header.gradient.angle}deg, ${header.gradient.stops
    .map((stop) => `${stop.color} ${stop.position}%`)
    .join(", ")})`

  const vignetteStyle = resolvedHero.vignette.enabled
    ? `radial-gradient(ellipse at center, transparent 0%, ${resolvedHero.vignette.color}${Math.round(
        (resolvedHero.vignette.intensity / 100) * 255
      ).toString(16).padStart(2, "0")} 100%)`
    : undefined

  const overlayColor = resolvedHero.overlay.enabled
    ? `${resolvedHero.overlay.color}${Math.round((resolvedHero.overlay.opacity / 100) * 255).toString(16).padStart(2, "0")}`
    : undefined

  // Plugin sections to render between hero and footer
  const pluginMap = new Map(plugins.map((p) => [p.id, p]))
  const middleSections = sectionOrder.filter((id) => id !== "header" && id !== "hero" && id !== "footer")

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-transparent">
      {/* Zoom Controls */}
      <div className="hidden sm:flex absolute bottom-6 right-6 z-[100] items-center gap-3 rounded-full border border-border bg-popover/80 p-2 backdrop-blur-md shadow-2xl transition-all hover:bg-popover">
        <div className="flex items-center gap-1 border-r border-border pr-2">
          <button
            onClick={() => setZoom(Math.max(25, zoom - 10))}
            className="h-7 w-7 flex items-center justify-center rounded-full hover:bg-accent text-muted-foreground transition-colors"
          >
            <Minus className="h-4 w-4" />
          </button>
          <div className="w-32 px-2">
            <Slider
              value={[zoom]}
              min={25}
              max={200}
              step={5}
              onValueChange={([v]) => setZoom(v)}
              className="cursor-pointer"
            />
          </div>
          <button
            onClick={() => setZoom(Math.min(200, zoom + 10))}
            className="h-7 w-7 flex items-center justify-center rounded-full hover:bg-accent text-muted-foreground transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center gap-2 pl-1">
          <span className="text-[10px] font-mono font-medium text-muted-foreground w-9 text-center">{zoom}%</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setZoom(100)}
                  className="h-7 w-7 flex items-center justify-center rounded-full hover:bg-accent transition-colors"
                  style={{ color: accentColor }}
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Resetar Zoom (100%)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="flex-1 overflow-auto flex items-center justify-center p-8 lg:p-12">
        {/* Device Frame */}
        <div
          className={cn(
            "relative transition-all duration-500 ease-out origin-center",
            resolvedHero.autoHeight !== false ? "h-full" : "",
            device === "mobile" && "w-[360px]",
            device === "tablet" && "w-[520px]",
            device === "desktop" && "w-full min-w-[320px] max-w-[1400px]"
          )}
          style={{ transform: `scale(${zoom / 100})` }}
        >
          {/* Device Chrome */}
          <div className={cn(
            "overflow-hidden shadow-2xl flex flex-col",
            resolvedHero.autoHeight !== false ? "h-full" : "",
            device === "mobile" && "rounded-[3rem] bg-zinc-900 p-3",
            device === "tablet" && "rounded-[2rem] bg-zinc-900 p-3",
            device === "desktop" && "rounded-xl bg-card border border-border"
          )}>
            {/* Notch for mobile */}
            {device === "mobile" && (
              <div className="absolute left-1/2 top-4 z-50 h-7 w-28 -translate-x-1/2 rounded-full bg-black" />
            )}

            {/* Camera for tablet */}
            {device === "tablet" && (
              <div className="absolute left-1/2 top-4 z-50 h-3 w-3 -translate-x-1/2 rounded-full bg-[#2a2a2e] ring-2 ring-[#3a3a3e]" />
            )}

            {/* Browser Chrome for Desktop */}
            {device === "desktop" && (
              <div className="flex h-10 items-center gap-3 border-b border-border bg-card px-4">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
                  <div className="h-3 w-3 rounded-full bg-[#28c840]" />
                </div>
                <div className="flex flex-1 justify-center">
                  <div className="flex items-center gap-2 rounded-md bg-muted px-4 py-1.5">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: accentColor }} />
                    <span className="text-xs text-muted-foreground">seusite.com.br</span>
                  </div>
                </div>
              </div>
            )}

            {/* Content Area */}
            <div className={cn(
              "relative overflow-y-auto bg-black custom-scrollbar",
              (config.hero.autoHeight !== false || device === "mobile" || device === "tablet") ? "flex-1" : "",
              device === "mobile" && "rounded-[2.25rem] aspect-[9/19]",
              device === "tablet" && "rounded-2xl aspect-[3/4]",
              device === "desktop" && (config.hero.autoHeight !== false ? "h-full min-h-[600px] max-h-[900px]" : "min-h-[600px] max-h-[80vh]")
            )}>
              {/* Full Page Preview */}
              <div className={cn(
                "relative flex flex-col h-full",
                config.hero.autoHeight !== false ? "min-h-full" : "min-h-full"
              )}>
                {/* === HEADER === */}
                <header
                  className={cn(
                    "relative z-50 flex shrink-0 items-center justify-between px-4 transition-all",
                    device === "desktop" && "px-8",
                    header.menuStyle === "solid" && "backdrop-blur-md",
                    (header.menuStyle === "transparent" || header.menuStyle === "gradient") && "absolute top-0 left-0 right-0",
                    activeSection === "header" && "ring-2 ring-inset"
                  )}
                  style={{
                    background: header.menuStyle === "solid"
                      ? header.backgroundColor
                      : header.menuStyle === "gradient"
                      ? headerGradientStyle
                      : "transparent",
                    opacity: header.menuStyle === "gradient" ? header.gradient.opacity / 100 : 1,
                    height: header.height,
                    ...(activeSection === "header" ? { ringColor: accentColor, boxShadow: `inset 0 0 0 2px ${accentColor}` } : {}),
                  }}
                >
                  <div className="flex items-center">
                    {header.logo && header.logo.trim() !== "" ? (
                      <img src={header.logo} alt="Logo" style={{ height: header.logoHeight }} className="w-auto object-contain" />
                    ) : (
                      <span
                        className="font-bold transition-all"
                        style={{ fontSize: header.logoHeight * 0.7, color: theme.colors.text, fontFamily: primaryFont }}
                      >
                        {header.logoText}
                      </span>
                    )}
                  </div>
                  {device === "desktop" ? (
                    <nav className="flex items-center gap-6">
                      {header.menuItems.map((item, i) => (
                        <span key={i} className={cn("text-sm font-medium opacity-90 transition-opacity hover:opacity-100", secondaryFont)} style={{ color: theme.colors.text }}>
                          {item}
                        </span>
                      ))}
                      {header.showCta && (
                        <button className={cn("px-4 py-2 text-sm font-medium transition-transform hover:scale-105", btnRadius, primaryFont)} style={{ backgroundColor: theme.colors.primary, color: theme.colors.text }}>
                          {header.ctaText}
                        </button>
                      )}
                    </nav>
                  ) : (
                    <button className={cn("p-2", btnRadius)} style={{ color: theme.colors.text }}>
                      <Menu className="h-5 w-5" />
                    </button>
                  )}
                </header>

                {/* Phantom Viewport Spacer */}
                {resolvedHero.autoHeight !== false && (
                    <div className="shrink-0 min-h-full w-full pointer-events-none" />
                )}

                {/* UNIFIED OPENING (100VH PARITY) */}
                <div 
                  className={cn(
                    "flex flex-col relative overflow-hidden shrink-0",
                    resolvedHero.autoHeight !== false ? "absolute inset-0 z-10" : "h-auto"
                  )}
                >
                  {/* === HERO === */}
                  <div
                    className={cn(
                      "relative flex flex-col justify-center min-h-0",
                      resolvedHero.autoHeight !== false ? "flex-1" : "shrink-0"
                    )}
                    style={{
                      backgroundColor: theme.colors.background,
                      height: resolvedHero.autoHeight !== false ? undefined : `${resolvedHero.height || 600}px`,
                      ...(activeSection === "hero" ? { boxShadow: `inset 0 0 0 2px ${accentColor}` } : {}),
                    }}
                  >
                    {currentImage && (
                      <div
                        className="absolute inset-0 overflow-hidden"
                      >
                         <div 
                            className={cn(
                                "absolute transition-transform duration-300 ease-out",
                                device === "desktop" ? "inset-0" : "inset-x-[-10%] inset-y-[-10%]"
                            )}
                            style={{
                              backgroundImage: `url(${currentImage})`,
                              backgroundSize: device === "desktop" ? `${currentPosition.scale}%` : "cover",
                              backgroundPosition: `${currentPosition.x}% ${currentPosition.y}%`,
                              backgroundRepeat: "no-repeat",
                              transform: device === "desktop" ? "none" : `scale(${currentPosition.scale / 100})`,
                            }}
                         />
                      </div>
                    )}

                    {resolvedHero.overlay.enabled && (
                      <div
                        className="absolute inset-0 z-10"
                        style={{ backgroundColor: resolvedHero.overlay.color, opacity: resolvedHero.overlay.opacity / 100 }}
                      />
                    )}

                    {activeGradient.enabled && (
                      <div
                        className="absolute inset-0 z-20"
                        style={{
                          background: `linear-gradient(${activeGradient.angle}deg, ${activeGradient.stops
                            .map((stop) => `${stop.color} ${stop.position}%`)
                            .join(", ")})`,
                          opacity: activeGradient.opacity / 100,
                        }}
                      />
                    )}

                    {resolvedHero.vignette.enabled && (
                      <div
                        className="absolute inset-0 z-30"
                        style={{
                          background: `radial-gradient(circle, transparent ${100 - resolvedHero.vignette.intensity}%, ${resolvedHero.vignette.color} 100%)`,
                        }}
                      />
                    )}

                    <div 
                      ref={containerRef}
                      className={cn(
                        "relative z-40 mx-auto w-full max-w-7xl px-4",
                        device === "desktop" ? "pt-24 pb-12 px-8" : "pt-20 pb-10 px-4",
                        "flex flex-col",
                        resolvedHero.orientation === "center" ? "items-center text-center" : 
                        resolvedHero.orientation === "right" ? "items-end text-right" : "items-start text-left"
                      )}
                    >
                      <div className={cn(
                        "flex flex-col w-full",
                        resolvedHero.orientation === "center" ? "items-center text-center" : 
                        resolvedHero.orientation === "right" ? "items-end text-right" : 
                        device === "desktop" ? "max-w-[50%] items-start text-left" : "items-start text-left"
                      )}>
                        {/* Badge */}
                        <EditableText
                          value={hero.badge}
                          field="hero.badge"
                          onChange={(val) => onConfigChange?.({ hero: { ...hero, badge: val } })}
                          isEditing={editingField === "hero.badge"}
                          isTyping={isTyping && editingField === "hero.badge"}
                          onSelect={(rect) => {
                            setEditingField("hero.badge")
                            setTargetRect(rect)
                            setIsTyping(false)
                          }}
                          onStartTyping={() => setIsTyping(true)}
                          accentColor={accentColor}
                          className={cn("mb-3 inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest transition-transform hover:scale-105", btnRadius)}
                          style={{ backgroundColor: `${theme.colors.primary}30`, color: theme.colors.text }}
                        >
                          <Heart className="h-3 w-3" style={{ color: theme.colors.primary }} />
                          {renderMarkdown(hero.badge)}
                        </EditableText>

                        {/* Title */}
                        <EditableText
                          value={hero.title || "Por uma cidade de Resultados"}
                          field="hero.title"
                          onChange={(val) => onConfigChange?.({ hero: { ...hero, title: val } })}
                          isEditing={editingField === "hero.title"}
                          isTyping={isTyping && editingField === "hero.title"}
                          onSelect={(rect) => {
                            setEditingField("hero.title")
                            setTargetRect(rect)
                            setIsTyping(false)
                          }}
                          onStartTyping={() => setIsTyping(true)}
                          accentColor={accentColor}
                          className={cn(
                            "text-3xl font-black leading-tight tracking-tighter w-full",
                            device === "desktop" && "text-6xl",
                            device === "tablet" && "text-4xl"
                          )}
                          style={{ color: theme.colors.text, fontFamily: primaryFont }}
                        >
                          {renderMarkdown(hero.title || "Por uma cidade de Resultados")}
                        </EditableText>

                        {/* Description */}
                        <EditableText
                          value={hero.description}
                          field="hero.description"
                          onChange={(val) => onConfigChange?.({ hero: { ...hero, description: val } })}
                          isEditing={editingField === "hero.description"}
                          isTyping={isTyping && editingField === "hero.description"}
                          onSelect={(rect) => {
                            setEditingField("hero.description")
                            setTargetRect(rect)
                            setIsTyping(false)
                          }}
                          onStartTyping={() => setIsTyping(true)}
                          accentColor={accentColor}
                          className={cn(
                            "mt-2 w-full text-sm leading-relaxed opacity-90",
                            device === "desktop" && "mt-4 text-lg"
                          )}
                          style={{ color: theme.colors.text, fontFamily: secondaryFont }}
                        >
                          {renderMarkdown(hero.description)}
                        </EditableText>

                        {/* CTAs */}
                        <div className={cn(
                          "mt-4 flex flex-wrap gap-2 w-full",
                          device === "mobile" && "flex-col",
                          device === "desktop" && "mt-6 gap-3",
                          resolvedHero.orientation === "center" && "justify-center",
                          resolvedHero.orientation === "right" && "justify-end"
                        )}>
                          <button
                            className={cn(
                              "px-4 py-2 text-xs font-medium transition-transform hover:scale-105",
                              device === "mobile" && "w-full py-3 text-sm",
                              device === "desktop" && "px-5 py-2.5 text-sm",
                              btnRadius, primaryFont
                            )}
                            style={{ backgroundColor: theme.colors.primary, color: theme.colors.text }}
                          >
                            {hero.ctaPrimary}
                          </button>
                          <button
                            className={cn(
                              "border-2 px-4 py-2 text-xs font-medium transition-transform hover:scale-105",
                              device === "mobile" && "w-full py-3 text-sm",
                              device === "desktop" && "px-5 py-2.5 text-sm",
                              btnRadius, primaryFont
                            )}
                            style={{ borderColor: theme.colors.text, color: theme.colors.text }}
                          >
                            {hero.ctaSecondary}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Group first plugin (usually Trust bar) into the same viewport container */}
                  {middleSections[0] && (
                    <div
                      className="relative shrink-0"
                      style={activeSection === middleSections[0] ? { boxShadow: `inset 0 0 0 2px ${accentColor}` } : undefined}
                    >
                      {(() => {
                        const plugin = pluginMap.get(middleSections[0])
                        if (!plugin) return null
                        const PluginPreview = plugin.previewComponent
                        const pluginConfig = config.plugins?.[middleSections[0]] || plugin.defaultConfig
                        return <PluginPreview config={pluginConfig} device={device} themeColors={theme.colors} />
                      })()}
                    </div>
                  )}
                </div>

                {/* === OTHER PLUGIN SECTIONS === */}
                {middleSections.slice(1).map((sectionId) => {
                  const plugin = pluginMap.get(sectionId)
                  if (!plugin) return null
                  const PluginPreview = plugin.previewComponent
                  const pluginConfig = config.plugins?.[sectionId] || plugin.defaultConfig
                  return (
                    <div
                      key={sectionId}
                      className={cn("relative")}
                      style={activeSection === sectionId ? { boxShadow: `inset 0 0 0 2px ${accentColor}` } : undefined}
                    >
                      <PluginPreview config={pluginConfig} device={device} themeColors={theme.colors} />
                    </div>
                  )
                })}

                {/* === FOOTER === */}
                <footer
                  className={cn(
                    "relative z-10 shrink-0 border-t border-white/10 px-4 py-3",
                    device === "desktop" && "px-8 py-5",
                    device === "tablet" && "py-4",
                  )}
                  style={{
                    backgroundColor: theme.colors.secondary,
                    ...(activeSection === "footer" ? { boxShadow: `inset 0 0 0 2px ${accentColor}` } : {}),
                  }}
                >
                  {footer.style === "simple" && (
                    <div className="flex items-center justify-between">
                      <span className={cn("text-[10px] opacity-70", device === "desktop" && "text-xs", secondaryFont)} style={{ color: theme.colors.text }}>
                        {footer.copyright}
                      </span>
                      {footer.showSocial && (
                        <div className="flex gap-2">
                          <Globe className="h-3.5 w-3.5" style={{ color: theme.colors.text, opacity: 0.7 }} />
                          <Share2 className="h-3.5 w-3.5" style={{ color: theme.colors.text, opacity: 0.7 }} />
                          <MessageCircle className="h-3.5 w-3.5" style={{ color: theme.colors.text, opacity: 0.7 }} />
                        </div>
                      )}
                    </div>
                  )}

                  {footer.style === "columns" && device === "desktop" && (
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <div className={cn("mb-2 inline-block px-2 py-1 text-xs font-bold", btnRadius, primaryFont)} style={{ backgroundColor: `${theme.colors.primary}30`, color: theme.colors.text }}>
                          {header.logoText}
                        </div>
                        <p className={cn("text-[10px] opacity-60", secondaryFont)} style={{ color: theme.colors.text }}>
                          {(hero.description || "").slice(0, 50)}...
                        </p>
                      </div>
                      {footer.columns.slice(0, 2).map((col, i) => (
                        <div key={i}>
                          <h4 className={cn("mb-1.5 text-[10px] font-semibold uppercase tracking-wider", primaryFont)} style={{ color: theme.colors.text }}>{col.title}</h4>
                          <div className="space-y-0.5">
                            {col.links.slice(0, 3).map((link, j) => (
                              <div key={j} className={cn("text-[10px] opacity-60", secondaryFont)} style={{ color: theme.colors.text }}>{link}</div>
                            ))}
                          </div>
                        </div>
                      ))}
                      {footer.showNewsletter && (
                        <div>
                          <h4 className={cn("mb-1.5 text-[10px] font-semibold uppercase tracking-wider", primaryFont)} style={{ color: theme.colors.text }}>Newsletter</h4>
                          <div className="flex gap-1">
                            <div className={cn("flex-1 border border-border bg-muted px-2 py-1 text-[10px]", btnRadius)} style={{ color: theme.colors.text }}>Email</div>
                            <button className={cn("p-1.5", btnRadius)} style={{ backgroundColor: theme.colors.primary }}>
                              <Send className="h-2.5 w-2.5" style={{ color: theme.colors.text }} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {(footer.style === "columns" && device !== "desktop") && (
                    <div className="text-center">
                      <div className="mb-2 flex justify-center gap-3">
                        {footer.showSocial && (
                          <>
                            <Globe className="h-4 w-4" style={{ color: theme.colors.text, opacity: 0.7 }} />
                            <Share2 className="h-4 w-4" style={{ color: theme.colors.text, opacity: 0.7 }} />
                            <MessageCircle className="h-4 w-4" style={{ color: theme.colors.text, opacity: 0.7 }} />
                            <Link2 className="h-4 w-4" style={{ color: theme.colors.text, opacity: 0.7 }} />
                          </>
                        )}
                      </div>
                      <span className={cn("text-[10px] opacity-60", secondaryFont)} style={{ color: theme.colors.text }}>{footer.copyright}</span>
                    </div>
                  )}

                  {footer.style === "centered" && (
                    <div className="text-center">
                      <div className={cn("mb-2 inline-block px-2 py-1 text-xs font-bold", btnRadius, primaryFont)} style={{ backgroundColor: `${theme.colors.primary}30`, color: theme.colors.text }}>
                        {header.logoText}
                      </div>
                      {footer.showSocial && (
                        <div className="mb-2 flex justify-center gap-3">
                          <Globe className="h-3.5 w-3.5" style={{ color: theme.colors.text, opacity: 0.7 }} />
                          <Share2 className="h-3.5 w-3.5" style={{ color: theme.colors.text, opacity: 0.7 }} />
                          <MessageCircle className="h-3.5 w-3.5" style={{ color: theme.colors.text, opacity: 0.7 }} />
                        </div>
                      )}
                      <span className={cn("text-[10px] opacity-60", secondaryFont)} style={{ color: theme.colors.text }}>{footer.copyright}</span>
                    </div>
                  )}
                </footer>
              </div>

              {/* Home Indicator */}
              {(device === "mobile" || device === "tablet") && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                  <div className={cn("h-1 rounded-full bg-white/30", device === "mobile" ? "w-28" : "w-24")} />
                </div>
              )}
            </div>
          </div>

          {/* Device Shadow */}
          <div className={cn(
            "absolute -bottom-6 left-1/2 -z-10 h-12 -translate-x-1/2 rounded-full bg-foreground/10 dark:bg-black/40 blur-2xl",
            device === "mobile" && "w-64",
            device === "tablet" && "w-80",
            device === "desktop" && "w-[70%]"
          )} />
        </div>
      </div>

      <InlineToolbar
        isVisible={!!editingField && !!targetRect}
        targetRect={targetRect}
        onAction={handleToolbarAction}
        activeFormats={(() => {
          if (!editingField) return {};
          const fieldKey = editingField.split('.')[1] as keyof typeof hero;
          const val = ((hero as any)[fieldKey] || "") as string;
          return {
            bold: val.includes('**'),
            italic: val.includes('*') && (!val.includes('**') || /^\*\*\*(.*)\*\*\*$/.test(val)),
            size: val.includes('<sm>') ? 'sm' : val.includes('<lg>') ? 'lg' : 'md'
          };
        })()}
      />
    </div>
  )
}

interface EditableTextProps {
  value: string
  field: string
  onChange: (val: string) => void
  onSelect: (rect: DOMRect) => void
  onStartTyping: () => void
  isEditing: boolean
  isTyping: boolean
  accentColor: string
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

function EditableText({ 
  value, 
  field,
  onChange, 
  onSelect, 
  onStartTyping, 
  isEditing, 
  isTyping, 
  accentColor, 
  children, 
  className,
  style 
}: EditableTextProps) {
  const ref = useRef<HTMLDivElement>(null)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (ref.current) {
      onSelect(ref.current.getBoundingClientRect())
    }
  }

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onStartTyping()
  }

  return (
    <div
      ref={ref}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className={cn(
        "relative cursor-pointer transition-all duration-200 ring-offset-4 rounded-sm",
        isEditing && !isTyping && "ring-2",
        className
      )}
      style={{ 
        ...style,
        ...(isEditing && !isTyping ? { outline: `2px solid ${accentColor}`, outlineOffset: '4px' } : {})
      }}
    >
      {isTyping ? (
        <textarea
          autoFocus
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            // Simple auto-height
            e.target.style.height = 'auto'
            e.target.style.height = e.target.scrollHeight + 'px'
          }}
          className="w-full bg-transparent border-none outline-none resize-none p-0 focus:ring-0 overflow-hidden"
          style={{ 
            height: ref.current?.offsetHeight || 'auto',
            color: 'inherit',
            font: 'inherit',
            textAlign: 'inherit',
            lineHeight: 'inherit'
          }}
          onFocus={(e) => {
             e.target.style.height = 'auto'
             e.target.style.height = e.target.scrollHeight + 'px'
             // Move cursor to the end
             const length = e.target.value.length
             e.target.setSelectionRange(length, length)
          }}
          aria-label={`Editar ${field}`}
          onBlur={() => {
            // Logic to stop typing would be better handled by a state in parent
            // but for now, clicking outside the container handles it.
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              // Logic to stop typing would go here if we tracked it in parent
            }
          }}
        />
      ) : (
        children
      )}
    </div>
  )
}
