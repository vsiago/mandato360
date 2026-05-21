"use client"

import { useState, useEffect, useRef } from "react"
import { cn, hexToRgba } from "../lib/utils"
import type { EditorConfig, DeviceType, EditorPlugin } from "../types"
import { 
  Heart, 
  Menu, 
  Globe, 
  Share2, 
  MessageCircle, 
  Link2, 
  Send, 
  Plus, 
  Minus, 
  Maximize2,
  ArrowRight,
  ChevronRight,
  Calendar,
  MessageSquare,
  Phone,
  Zap,
  Star,
  Info
} from "lucide-react"

const ICON_MAP: Record<string, any> = {
  ArrowRight,
  ChevronRight,
  Calendar,
  MessageSquare,
  Phone,
  Zap,
  Star,
  Info
}
import { Slider } from "./ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { resolveHero } from "../hooks/use-resolved-config"
import { InlineToolbar } from "./inline-toolbar"
import { renderMarkdown } from "../lib/markdown-renderer"
import { SectionToolbar } from "./section-toolbar"
import { getFontStack } from "../lib/font-utils"

interface DevicePreviewProps {
  config: EditorConfig
  device: DeviceType
  activeSection: string
  sectionOrder: string[]
  plugins: EditorPlugin[]
  accentColor?: string
  onConfigChange?: (config: any) => void
  onAccordionToggle?: (id: string) => void
  onSectionToolTabChange?: (tab: "content" | "appearance") => void
  onSectionReorder?: (newOrder: string[]) => void
  onSectionDelete?: (id: string) => void
  onSectionSelect?: (id: string) => void
  onTextElementSelect?: (id: string) => void
  placeholders?: {
    title?: string
    description?: string
    badge?: string
    ctaPrimary?: string
    ctaSecondary?: string
  }
}

const borderRadiusMap: Record<string, string> = {
  none: "",
  sm: "rounded",
  md: "rounded-lg",
  lg: "rounded-xl",
  full: "rounded-full",
}

export function DevicePreview({ 
  config, 
  device, 
  activeSection, 
  sectionOrder, 
  plugins, 
  accentColor = "#10b981", 
  onConfigChange, 
  onAccordionToggle, 
  onSectionToolTabChange,
  onSectionReorder,
  onSectionDelete,
  onSectionSelect,
  onTextElementSelect,
  placeholders
}: DevicePreviewProps) {
  const [zoom, setZoom] = useState(100)
  const [isScrolled, setIsScrolled] = useState(false)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
  const [sectionRect, setSectionRect] = useState<DOMRect | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  
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

  const skipAutoScrollRef = useRef(false)

  // Auto-scroll to active section
  useEffect(() => {
    if (!activeSection || !scrollContainerRef.current) return

    if (skipAutoScrollRef.current) {
      skipAutoScrollRef.current = false
      return
    }

    // Small timeout to allow the DOM to update if needed
    const timeoutId = setTimeout(() => {
      const element = scrollContainerRef.current?.querySelector(`[data-section-id="${activeSection}"]`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [activeSection])

  // Simulated Scroll Logic
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      setIsScrolled(container.scrollTop > 24)
    }

    container.addEventListener("scroll", handleScroll, { passive: true })
    return () => container.removeEventListener("scroll", handleScroll)
  }, [scrollContainerRef])

  // Auto-scroll when enabling scrolled state or switching view for feedback
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    if (config.headerPreviewView === "scrolled") {
      container.scrollTo({ top: 60, behavior: "smooth" })
    } else if (config.headerPreviewView === "top") {
      container.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [config.headerPreviewView])

  const handleSectionClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    skipAutoScrollRef.current = true
    onSectionSelect?.(id)
    setSectionRect(e.currentTarget.getBoundingClientRect())
    // Close inline text editing if clicking a new section
    if (activeSection !== id) {
        setEditingField(null)
        setTargetRect(null)
    }
  }

  const handleMoveUp = (id: string) => {
    const idx = sectionOrder.indexOf(id)
    // Don't move header or move something above header
    if (idx > 1) { 
      const newOrder = [...sectionOrder]
      const temp = newOrder[idx]
      newOrder[idx] = newOrder[idx - 1]
      newOrder[idx - 1] = temp
      onSectionReorder?.(newOrder)
    }
  }

  const handleMoveDown = (id: string) => {
    const idx = sectionOrder.indexOf(id)
    // Don't move footer or move something below footer
    if (idx > 0 && idx < sectionOrder.length - 2) {
      const newOrder = [...sectionOrder]
      const temp = newOrder[idx]
      newOrder[idx] = newOrder[idx + 1]
      newOrder[idx + 1] = temp
      onSectionReorder?.(newOrder)
    }
  }

  // Update sectionRect automatically when layout or scroll changes
  useEffect(() => {
    const container = scrollContainerRef.current
    
    const updateRect = () => {
      if (activeSection) {
        const el = containerRef.current?.querySelector(`[data-section-id="${activeSection}"]`)
        if (el) {
          setSectionRect(el.getBoundingClientRect())
        }
      } else {
        setSectionRect(null)
      }
    }

    updateRect()
    
    if (container) {
      container.addEventListener("scroll", updateRect, { passive: true })
      return () => container.removeEventListener("scroll", updateRect)
    }
  }, [activeSection, sectionOrder, device, zoom])

  // Sync editing field with active section
  useEffect(() => {
    if (activeSection === "") {
      setEditingField(null)
      setTargetRect(null)
    }
  }, [activeSection])

  const handleToolbarAction = (action: string) => {
    if (!editingField || !onConfigChange) return

    if (action === "edit") {
        setIsTyping(true)
        return
    }

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

  const primaryFont = getFontStack(designSystem.fonts?.primary || "serif")
  const secondaryFont = getFontStack(designSystem.fonts?.secondary || "sans")
  const btnRadius = borderRadiusMap[designSystem.borderRadius || "lg"]

  // Use hero-level gradient (device-aware) if present, otherwise fallback to theme gradient
  const activeGradient = resolvedHero.gradient?.enabled ? resolvedHero.gradient : theme.gradient
  const gradientStyle = activeGradient.enabled
    ? `linear-gradient(${activeGradient.angle}deg, ${activeGradient.stops
        .map((stop) => `${hexToRgba(stop.color, stop.opacity ?? 100)} ${stop.position}%`)
        .join(", ")})`
    : undefined

  const headerGradientStyle = `linear-gradient(${header.gradient.angle}deg, ${header.gradient.stops
    .map((stop) => `${hexToRgba(stop.color, stop.opacity ?? 100)} ${stop.position}%`)
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
  
  const navigationItems = [
    ...middleSections.map(id => {
      const customItem = (header.menuItems || []).find((m: any) => m.id === id)
      const plugin = pluginMap.get(id)
      return {
        id,
        label: customItem?.label || (id === 'team' && header.logoText?.includes('Adv') ? 'Equipe Jurídica' : plugin?.label || id),
        href: customItem?.href || `#${id}`
      }
    }),
    ...(header.menuItems || []).filter((m: any) => !sectionOrder.includes(m.id))
  ]

  const isHeaderScrolled = header.behavior === "fixed" && header.scrolled.enabled && isScrolled
  const currentHeaderHeight = isHeaderScrolled ? header.scrolled.height : header.height
  
  const headerColors = isHeaderScrolled ? header.scrolled.colors : {
    logo: theme.colors.text,
    menu: theme.colors.text,
    cta: theme.colors.text,
    hamburger: theme.colors.text
  }

  // Design System Variables for Plugins (Parity with generateThemeCSS)
  const borderRadiusValues: Record<string, string> = {
    none: "0px",
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "24px",
    full: "20px", // Cards shouldn't be circles even when buttons are pills
  }

  const themeVariables = {
    "--theme-card-radius": borderRadiusValues[designSystem.borderRadius || "lg"],
    "--theme-btn-radius": designSystem.borderRadius === 'full' ? '9999px' :
                          designSystem.borderRadius === 'xl' ? '24px' :
                          designSystem.borderRadius === 'lg' ? '12px' :
                          designSystem.borderRadius === 'md' ? '8px' :
                          designSystem.borderRadius === 'sm' ? '4px' : '0px',
    "--theme-color-primary": theme.colors.primary,
    "--theme-color-secondary": theme.colors.secondary,
    "--theme-color-background": theme.colors.background,
    "--theme-color-text": theme.colors.text,
    "--theme-font-heading": primaryFont,
    "--theme-font-body": secondaryFont,
    // User-tunable typography vars from the global theme settings
    ...(theme.cssVariables || {}),
  } as React.CSSProperties

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
            <div 
              ref={scrollContainerRef}
              className={cn(
                "relative overflow-y-auto bg-black custom-scrollbar",
                (config.hero.autoHeight !== false || device === "mobile" || device === "tablet") ? "flex-1" : "",
                device === "mobile" && "rounded-[2.25rem] aspect-[9/19]",
                device === "tablet" && "rounded-2xl aspect-[3/4]",
                device === "desktop" && (config.hero.autoHeight !== false ? "h-full min-h-[600px] max-h-[900px]" : "min-h-[600px] max-h-[80vh]")
              )}
              style={themeVariables}
            >
              {/* Full Page Preview */}
              <div 
                className={cn(
                  "relative flex flex-col h-full",
                  config.hero.autoHeight !== false ? "min-h-full" : "min-h-full"
                )}
              >
                {/* === HEADER === */}
                <header
                  data-section-id="header"
                  className={cn(
                    "z-50 flex shrink-0 items-center justify-between px-4 transition-all duration-300",
                    device === "desktop" && "px-8",
                    header.behavior === "fixed" ? "sticky top-0" : "relative",
                    isHeaderScrolled && "shadow-lg backdrop-blur-lg",
                    activeSection === "header" && "ring-2 ring-inset"
                  )}
                  style={{
                    height: currentHeaderHeight,
                    ...(activeSection === "header" ? { ringColor: accentColor } : {}),
                  }}
                >
                  {/* Background Layer */}
                  <div 
                    className="absolute inset-0 -z-10 transition-all duration-300"
                    style={{
                      background: isHeaderScrolled 
                        ? header.scrolled.backgroundColor 
                        : header.menuStyle === "solid"
                        ? header.backgroundColor
                        : header.menuStyle === "gradient" && header.gradient.stops.length > 0
                        ? headerGradientStyle
                        : "transparent",
                      opacity: (!isHeaderScrolled && header.menuStyle === "gradient") ? (header.gradient.opacity ?? 100) / 100 : 1,
                    }}
                  />
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => {
                        const container = scrollContainerRef.current
                        if (container) container.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                  >
                    {header.logo && header.logo.trim() !== "" ? (
                      <img src={header.logo} alt="Logo" style={{ height: isHeaderScrolled ? header.logoHeight * 0.8 : header.logoHeight, filter: isHeaderScrolled ? 'none' : undefined }} className="w-auto object-contain transition-all duration-300" />
                    ) : (
                      <span
                        className="font-bold transition-all duration-300"
                        style={{ fontSize: (isHeaderScrolled ? header.logoHeight * 0.8 : header.logoHeight) * 0.7, color: headerColors.logo, fontFamily: primaryFont }}
                      >
                        {header.logoText}
                      </span>
                    )}
                  </div>
                  {device === "desktop" ? (
                    <nav 
                      className="flex items-center"
                      style={{ gap: `${header.menuSpacing || 24}px` }}
                    >
                      {navigationItems.map((item, idx) => (
                        <span 
                          key={`${item.id}-${idx}`} 
                          className={cn("font-medium opacity-90 transition-all duration-300 hover:opacity-100 cursor-pointer", secondaryFont)} 
                          style={{ 
                            color: headerColors.menu,
                            fontSize: `${header.menuFontSize || 14}px`
                          }}
                        >
                          {item.label}
                        </span>
                      ))}
                      {header.showCta && (
                        <button className={cn("px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105", btnRadius, primaryFont)} style={{ backgroundColor: isHeaderScrolled ? theme.colors.primary : theme.colors.primary, color: headerColors.cta }}>
                          {header.ctaText}
                        </button>
                      )}
                    </nav>
                  ) : (
                    <button className={cn("p-2 transition-colors duration-300", btnRadius)} style={{ color: headerColors.hamburger }}>
                      <Menu className="h-5 w-5" />
                    </button>
                  )}
                </header>

                {/* UNIFIED OPENING (100VH PARITY) */}
                <div 
                  className={cn(
                    "flex flex-col relative overflow-hidden shrink-0",
                    resolvedHero.autoHeight !== false ? "relative min-h-full" : "h-auto"
                  )}
                  style={{
                    marginTop: (header.behavior === "fixed" && (header.menuStyle === "transparent" || header.menuStyle === "gradient" || header.menuStyle === "solid")) 
                      ? -header.height 
                      : 0
                  }}
                >
                  {/* === HERO === */}
                    <div
                      data-section-id="hero"
                      onClick={(e) => handleSectionClick(e, 'hero')}
                      className={cn(
                        "relative flex flex-col justify-center min-h-0 cursor-pointer",
                        resolvedHero.autoHeight !== false ? "flex-1" : "shrink-0"
                      )}
                      style={{
                        backgroundColor: theme.colors.background,
                        height: resolvedHero.autoHeight !== false ? undefined : `${resolvedHero.height || 600}px`
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
                            .map((stop) => `${hexToRgba(stop.color, stop.opacity ?? 100)} ${stop.position}%`)
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
                          value={resolvedHero.badge || ""}
                          field="hero.badge"
                          onChange={(val) => onConfigChange?.({ hero: { ...hero, badge: val } })}
                          isEditing={editingField === "hero.badge"}
                          isTyping={isTyping && editingField === "hero.badge"}
                          onSelect={(rect) => {
                            setEditingField("hero.badge")
                            setTargetRect(rect)
                            setIsTyping(false)
                            onTextElementSelect?.("hero")
                          }}
                          onStartTyping={() => setIsTyping(true)}
                          accentColor={accentColor}
                          className={cn("mb-5 md:mb-6 inline-flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 text-[10px] md:text-xs font-medium uppercase tracking-widest border border-white/10 transition-transform hover:scale-105", btnRadius)}
                          style={{ backgroundColor: `${theme.colors.primary}4d`, color: theme.colors.text }}
                        >
                          {renderMarkdown(resolvedHero.badge || placeholders?.badge || "NOVIDADE")}
                        </EditableText>

                        {/* Title */}
                        <EditableText
                          value={resolvedHero.title || ""}
                          field="hero.title"
                          onChange={(val) => onConfigChange?.({ hero: { ...hero, title: val } })}
                          isEditing={editingField === "hero.title"}
                          isTyping={isTyping && editingField === "hero.title"}
                          onSelect={(rect) => {
                            setEditingField("hero.title")
                            setTargetRect(rect)
                            setIsTyping(false)
                            onTextElementSelect?.("hero")
                          }}
                          onStartTyping={() => setIsTyping(true)}
                          accentColor={accentColor}
                          className={cn(
                            "text-3xl font-black leading-tight tracking-tighter w-full",
                            device === "desktop" && "text-6xl",
                            device === "tablet" && "text-4xl"
                          )}
                          style={{
                            color: theme.colors.text,
                            fontFamily: primaryFont,
                            letterSpacing: 'var(--theme-letter-spacing-heading)'
                          }}
                        >
                          {renderMarkdown(resolvedHero.title || placeholders?.title || "Por uma cidade de Resultados")}
                        </EditableText>

                        {/* Description */}
                        <EditableText
                          value={resolvedHero.description || ""}
                          field="hero.description"
                          onChange={(val) => onConfigChange?.({ hero: { ...hero, description: val } })}
                          isEditing={editingField === "hero.description"}
                          isTyping={isTyping && editingField === "hero.description"}
                          onSelect={(rect) => {
                            setEditingField("hero.description")
                            setTargetRect(rect)
                            setIsTyping(false)
                            onTextElementSelect?.("hero")
                          }}
                          onStartTyping={() => setIsTyping(true)}
                          accentColor={accentColor}
                          className={cn(
                            "mt-2 w-full text-sm opacity-90",
                            device === "desktop" && "mt-4 text-lg"
                          )}
                          style={{
                            color: theme.colors.text,
                            fontFamily: secondaryFont,
                            letterSpacing: 'var(--theme-letter-spacing-body)',
                            lineHeight: 'var(--theme-line-height-body, 1.5)'
                          }}
                        >
                          {renderMarkdown(resolvedHero.description || placeholders?.description || "Seja bem-vindo ao nosso espaço.")}
                        </EditableText>
                        {/* CTAs */}
                        <div className={cn(
                          "mt-4 flex flex-wrap gap-2 w-full",
                          device === "mobile" && "flex-col",
                          device === "desktop" && "mt-6 gap-3",
                          resolvedHero.orientation === "center" && "justify-center",
                          resolvedHero.orientation === "right" && "justify-end"
                        )}>
                          {/* Primary Button */}
                          {(() => {
                            const btn = resolvedHero.buttonPrimary || { text: resolvedHero.ctaPrimary || placeholders?.ctaPrimary || "Agendar Agora", link: "#agendamento" }
                            const IconLeft = btn.iconLeft ? (ICON_MAP[btn.iconLeft] || null) : null
                            const IconRight = btn.iconRight ? (ICON_MAP[btn.iconRight] || null) : null
                            
                            const btnStyle: React.CSSProperties = {
                              color: btn.textColor || theme.colors.text,
                              paddingLeft: `${btn.paddingX ?? 24}px`,
                              paddingRight: `${btn.paddingX ?? 24}px`,
                              paddingTop: `${btn.paddingY ?? 12}px`,
                              paddingBottom: `${btn.paddingY ?? 12}px`,
                              height: `${btn.height ?? 48}px`,
                              width: btn.width === 'full' ? '100%' : (btn.width === 'auto' || !btn.width ? 'auto' : `${btn.width}px`),
                              fontSize: btn.fontSize ? `${btn.fontSize}px` : undefined,
                              fontFamily: primaryFont,
                            }

                            if (btn.gradient?.enabled) {
                              const stops = btn.gradient.stops.map(s => `${hexToRgba(s.color, s.opacity ?? 100)} ${s.position}%`).join(', ')
                              btnStyle.background = `linear-gradient(${btn.gradient.angle}deg, ${stops})`
                              btnStyle.opacity = (btn.gradient.opacity ?? 100) / 100
                            } else {
                              btnStyle.backgroundColor = btn.backgroundColor || theme.colors.primary
                            }

                            return (
                              <button
                                onClick={() => onAccordionToggle?.('button-primary')}
                                className={cn(
                                  "inline-flex items-center justify-center gap-2 font-bold transition-all hover:scale-105 active:scale-95 shadow-lg",
                                  btnRadius,
                                  !btn.fontSize && "text-xs"
                                )}
                                style={btnStyle}
                              >
                                {IconLeft && <IconLeft className="shrink-0" style={{ width: btn.iconSize || 16, height: btn.iconSize || 16, strokeWidth: btn.iconWeight || 2, color: btn.iconColor || 'inherit' }} />}
                                {btn.text}
                                {IconRight && <IconRight className="shrink-0" style={{ width: btn.iconSize || 16, height: btn.iconSize || 16, strokeWidth: btn.iconWeight || 2, color: btn.iconColor || 'inherit' }} />}
                              </button>
                            )
                          })()}

                          {/* Secondary Button */}
                          {(() => {
                            const btn = resolvedHero.buttonSecondary || { text: resolvedHero.ctaSecondary || placeholders?.ctaSecondary || "Ver Serviços", link: "#services", outline: true }
                            const IconLeft = btn.iconLeft ? (ICON_MAP[btn.iconLeft] || null) : null
                            const IconRight = btn.iconRight ? (ICON_MAP[btn.iconRight] || null) : null
                            
                            const btnStyle: React.CSSProperties = {
                              color: btn.textColor || theme.colors.text,
                              paddingLeft: `${btn.paddingX ?? 24}px`,
                              paddingRight: `${btn.paddingX ?? 24}px`,
                              paddingTop: `${btn.paddingY ?? 12}px`,
                              paddingBottom: `${btn.paddingY ?? 12}px`,
                              height: `${btn.height ?? 48}px`,
                              width: btn.width === 'full' ? '100%' : (btn.width === 'auto' || !btn.width ? 'auto' : `${btn.width}px`),
                              fontSize: btn.fontSize ? `${btn.fontSize}px` : undefined,
                              border: btn.outline ? `2px solid ${btn.textColor || theme.colors.text}` : undefined,
                              fontFamily: primaryFont,
                            }

                            if (btn.gradient?.enabled) {
                              const stops = btn.gradient.stops.map(s => `${hexToRgba(s.color, s.opacity ?? 100)} ${s.position}%`).join(', ')
                              btnStyle.background = `linear-gradient(${btn.gradient.angle}deg, ${stops})`
                              btnStyle.opacity = (btn.gradient.opacity ?? 100) / 100
                            } else {
                              btnStyle.backgroundColor = btn.backgroundColor || (btn.outline ? 'transparent' : theme.colors.secondary)
                            }

                            return (
                              <button
                                onClick={() => onAccordionToggle?.('button-secondary')}
                                className={cn(
                                  "inline-flex items-center justify-center gap-2 font-bold transition-all hover:scale-105 active:scale-95",
                                  btnRadius,
                                  !btn.fontSize && "text-xs"
                                )}
                                style={btnStyle}
                              >
                                {IconLeft && <IconLeft className="shrink-0" style={{ width: btn.iconSize || 16, height: btn.iconSize || 16, strokeWidth: btn.iconWeight || 2, color: btn.iconColor || 'inherit' }} />}
                                {btn.text}
                                {IconRight && <IconRight className="shrink-0" style={{ width: btn.iconSize || 16, height: btn.iconSize || 16, strokeWidth: btn.iconWeight || 2, color: btn.iconColor || 'inherit' }} />}
                              </button>
                            )
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Group first plugin (usually Trust bar) into the same viewport container */}
                  {middleSections[0] && (
                    <div
                      data-section-id={middleSections[0]}
                      onClick={(e) => handleSectionClick(e, middleSections[0])}
                      className="relative shrink-0 cursor-pointer"
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
                      data-section-id={sectionId}
                      onClick={(e) => handleSectionClick(e, sectionId)}
                      className={cn("relative cursor-pointer")}
                    >
                      <PluginPreview config={pluginConfig} device={device} themeColors={theme.colors} />
                    </div>
                  )
                })}

                {/* === FOOTER === */}
                <footer
                  data-section-id="footer"
                  className={cn(
                    "relative z-10 shrink-0 border-t border-white/10 px-4 py-3",
                    device === "desktop" && "px-8 py-5",
                    device === "tablet" && "py-4",
                  )}
                  style={{
                    backgroundColor: theme.colors.secondary
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

      {/* Global Section Selection Indicator */}
      {activeSection && sectionRect && !editingField && (
        <div 
          className="pointer-events-none fixed z-[140] border-[3px] border-blue-500 rounded-sm shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all duration-150"
          style={{
            top: sectionRect.top + window.scrollY,
            left: sectionRect.left + window.scrollX,
            width: sectionRect.width,
            height: sectionRect.height,
          }}
        />
      )}

      <SectionToolbar
        sectionId={activeSection}
        label={(() => {
            if (activeSection === 'hero') return 'Capa (Hero)'
            if (activeSection === 'header') return 'Cabeçalho'
            if (activeSection === 'footer') return 'Rodapé'
            return pluginMap.get(activeSection)?.label || 'Seção'
        })()}
        targetRect={sectionRect}
        isVisible={!!activeSection && !!sectionRect && !editingField}
        onMoveUp={handleMoveUp}
        onMoveDown={handleMoveDown}
        onDelete={onSectionDelete || (() => {})}
        isFirst={sectionOrder.indexOf(activeSection) <= 1}
        isLast={sectionOrder.indexOf(activeSection) >= sectionOrder.length - 2}
      />

      <InlineToolbar
        isVisible={!!editingField && !!targetRect}
        targetRect={targetRect}
        onAction={handleToolbarAction}
        activeFormats={(() => {
          if (!editingField) return {};
          const fieldKey = editingField.split('.')[1] as keyof typeof hero;
          const val = ((resolvedHero as any)[fieldKey] || "") as string;
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
        ...(isEditing && !isTyping ? { outline: `2px solid #3b82f6`, outlineOffset: '4px' } : {})
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
