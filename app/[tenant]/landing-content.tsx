"use client"

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Building2, Users, Stethoscope, GraduationCap, HardHat, HeartHandshake,
  ArrowRight, Star, MapPin, ChevronDown, Menu, X, User, Heart, Phone,
  MoveRight, ArrowLeftRight, CheckCircle2, LifeBuoy, FileText, Send, Mail,
  Share2, MessageCircle, HelpCircle, ChevronRight,
  Award, Shield, Gem, Zap, Flag
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { submitSupporterAction, submitRequestAction } from "@/lib/actions/forms"
import { createLead } from "@/lib/actions/leads"
import { toast } from "sonner"
import { cn } from '@/lib/utils'
import { getTheme, generateThemeCSS } from "@/src/themes"
import { SiteConfig } from "@/lib/editor/types"
import { buildGradientString, resolveElementStyle, elementStyleToCSS } from "@/lib/editor/style-utils"
import { buildGoogleFontsUrl } from "@/lib/editor/fonts"
import { renderMarkdown } from "@mandato360/editor"

const FONT_STACKS = {
  sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
  serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  display: 'Graphik, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
}

function getFontStack(font: string) {
  if (FONT_STACKS[font as keyof typeof FONT_STACKS]) return FONT_STACKS[font as keyof typeof FONT_STACKS]
  if (font.includes("'") || font.includes('"')) return font
  return `'${font}', sans-serif`
}

export default function LandingContent({ tenant, initialData }: { tenant: any, initialData: any }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // ─── Resolve Data (Config vs DB) ───
  const hasConfig = !!tenant?.config
  let config: SiteConfig | null = null
  if (hasConfig) {
      try {
          config = JSON.parse(tenant.config)
      } catch (e) {
          console.error("Failed to parse tenant config")
      }
  }

  const editor = (config as any)?.__editorConfig

  // Fallback / Merged Data
  const primaryColor = config?.colors?.primary || tenant?.primaryColor || "#0F2B5B"
  const secondaryColor = config?.colors?.secondary || tenant?.secondaryColor || "#0D9F6E"
  const displayName = config?.name || tenant?.name || "Vereador"
  const displayBio = config?.perfil?.bio || tenant?.biografia || "Trabalhando por você."
  const displayFoto = config?.perfil?.imageUrl || tenant?.fotoPerfilUrl || ""
  const displayRole = config?.perfil?.role || "Vereador"
  
  // Hero Source of Truth (Prefer Editor Config)
  const heroBadge = editor?.hero?.badge || config?.heroBadge || "Mandato Participativo"
  const heroHeadline = editor?.hero?.title || config?.heroHeadline || "Por uma cidade de"
  const heroHighlight = editor ? "" : (config?.heroHighlight || "Resultados") // Clear highlight if using editor
  const heroImageUrl = editor?.hero?.images?.desktop || config?.heroImageUrl || "/avatar-vereador.png"
  const heroDescription = editor?.hero?.description || config?.description || "Trabalhando pela transparência e inovação política."
  const ctaPrimaryText = editor?.hero?.ctaPrimary || config?.ctaText || "Solicitar Demanda"
  const ctaSecondaryText = editor?.hero?.ctaSecondary || "Ver Projetos"

  // Responsive Hero Image Logic
  const getHeroImg = (device: 'mobile' | 'tablet' | 'desktop') => editor?.hero?.images?.[device] || heroImageUrl
  const getHeroPos = (device: 'mobile' | 'tablet' | 'desktop') => editor?.hero?.imagePosition?.[device] || { x: 50, y: 50, scale: 100 }
  
  const displayTagline = config?.tagline || "Mandato Participativo"
  const logoUrl = config?.logoUrl || tenant?.logoUrl || ""

  const projetosTitle = config?.projetosTitle || "Ações e Projetos"
  const perfilTitle = config?.perfilTitle || "O Vereador"
  const resultsTitle = config?.resultsTitle || "Transformando a Cidade"
  const faqTitle = config?.faqTitle || "Perguntas Frequentes"
  const contactTitle = config?.contactTitle || "Entre em Contato"

  // Hero image settings
  const heroSettings = config?.heroImageSettings
  const heroLayout = editor?.hero?.orientation || heroSettings?.layout || 'left'

  // Section styles (for gradient backgrounds)
  const heroSectionStyle = config?.sectionStyles?.hero
  const hasHeroGradient = heroSectionStyle?.background === 'gradient' && heroSectionStyle?.gradient
  const heroOverlay = heroSettings?.overlayEnabled && heroSettings?.overlay

  // Style Resolution Helper
  const getStyle = (sectionId: string, elementId: string) => {
    if (!config) return {}
    const resolved = resolveElementStyle(config, sectionId, elementId, 'desktop')
    return elementStyleToCSS(resolved)
  }

  const activeTheme = getTheme((config?.theme as any) || "neutro")
  
  // Patch theme with editor overrides if available for total parity
  if (editor?.theme) {
    if (editor.theme.colors) {
        activeTheme.colors.light = { ...activeTheme.colors.light, ...editor.theme.colors }
        // Also update the core theme colors for generating variables
        activeTheme.colors.light.primary = editor.theme.colors.primary
        activeTheme.colors.light.secondary = editor.theme.colors.secondary
    }
    if (editor.theme.designSystem) {
        activeTheme.buttons.style = editor.theme.designSystem.borderRadius === 'full' ? 'pill' : 
                                    editor.theme.designSystem.borderRadius === 'none' ? 'sharp' : 'soft'
    }
  }

  const themeCSSVars = generateThemeCSS(activeTheme, "light")

  // --- Hero Resolution Engine (inline, matches editor's resolveHero) ---
  function resolveHeroForSite(bp: 'mobile' | 'tablet' | 'desktop') {
    const hero = editor?.hero
    if (!hero) return null
    
    const base: any = {
      title: hero.title,
      subtitle: hero.subtitle,
      description: hero.description,
      ctaPrimary: hero.ctaPrimary,
      ctaSecondary: hero.ctaSecondary,
      badge: hero.badge,
      orientation: hero.orientation,
      autoHeight: hero.autoHeight,
      height: hero.height,
      overlay: hero.overlay ? { ...hero.overlay } : { enabled: false, color: '#000000', opacity: 60 },
      vignette: hero.vignette ? { ...hero.vignette } : { enabled: false, intensity: 40, color: '#000000' },
      backgroundColor: hero.backgroundColor || '',
      gradient: hero.gradient ? { ...hero.gradient, stops: (hero.gradient.stops || []).map((s: any) => ({...s})) } : null,
    }
    
    const applyOvr = (target: any, overrides: any) => {
      if (!overrides) return
      for (const [k, v] of Object.entries(overrides)) {
        if (v === undefined) continue
        if ((k === 'overlay' || k === 'vignette') && typeof v === 'object') {
          target[k] = { ...target[k], ...v }
        } else if (k === 'gradient' && typeof v === 'object') {
          const gradVal = v as any
          target[k] = { ...(target[k] || {}), ...gradVal, stops: gradVal.stops ? gradVal.stops.map((s: any) => ({...s})) : (target[k]?.stops || []) }
        } else {
          target[k] = v
        }
      }
    }
    
    if (bp === 'mobile') return base
    applyOvr(base, hero.overrides?.tablet)
    if (bp === 'tablet') return base
    applyOvr(base, hero.overrides?.desktop)
    return base
  }
  
  const heroDesktop = resolveHeroForSite('desktop')
  const heroTablet = resolveHeroForSite('tablet')
  const heroMobile = resolveHeroForSite('mobile')

  // --- Absolute Hero Parity Calculations (use resolved desktop as primary) ---
  const vignetteStyle = heroDesktop?.vignette?.enabled
    ? `radial-gradient(ellipse at center, transparent 0%, ${heroDesktop.vignette.color}${Math.round(
        (heroDesktop.vignette.intensity / 100) * 255
      ).toString(16).padStart(2, "0")} 100%)`
    : undefined

  const overlayColor = heroDesktop?.overlay?.enabled
    ? `${heroDesktop.overlay.color}${Math.round((heroDesktop.overlay.opacity / 100) * 255).toString(16).padStart(2, "0")}`
    : undefined

  // Use hero-level gradient (device-aware) if present, otherwise fallback to theme gradient
  const activeDesktopGradient = heroDesktop?.gradient?.enabled ? heroDesktop.gradient : editor?.theme?.gradient
  const themeGradientStyle = activeDesktopGradient?.enabled
    ? `linear-gradient(${activeDesktopGradient.angle}deg, ${activeDesktopGradient.stops
        .map((stop: any) => `${stop.color} ${stop.position}%`)
        .join(", ")})`
    : undefined

  const themeColors = editor?.theme?.colors || { text: "#ffffff", primary: primaryColor, background: "#000000" }

  // Typography
  const fontHeading = config?.fontHeading || activeTheme.typography.heading
  const fontBody = config?.fontBody || activeTheme.typography.body

  // Gather all unique fonts (global + overrides)
  const fontsToLoad = new Set<string>()
  if (fontHeading) fontsToLoad.add(fontHeading)
  if (fontBody) fontsToLoad.add(fontBody)
  
  // Scan overrides for additional fonts
  if (config?.responsiveOverrides) {
    Object.values(config.responsiveOverrides).forEach(bp => {
      Object.values(bp).forEach(section => {
        Object.values(section).forEach(element => {
          if (element.fontFamily) fontsToLoad.add(element.fontFamily)
        })
      })
    })
  }

  const googleFontsUrl = buildGoogleFontsUrl(Array.from(fontsToLoad).filter(Boolean))

  const fontHeadingCSS = getFontStack(fontHeading)
  const fontBodyCSS = getFontStack(fontBody)

  // Data from initialData (DB)
  const { projetosLei = [], indicacoes = [], agenda = [] } = initialData || {}

  // Lists: prefer config if it has content, else use DB fallbacks
  const displayProjetos = (config?.projetos && config.projetos.length > 0) 
    ? config.projetos.slice(0, 6) 
    : projetosLei.slice(0, 6).map((p: any) => ({ name: p.titulo, description: p.descricao, image: "" }))

  const displayIndicacoes = indicacoes.slice(0, 6)
  const displayAgenda = agenda.slice(0, 6)
  const displayTrustBadges = config?.trustBadges || (tenant?.destaques || []).map((d: any) => ({ text: d.text || d }))
  const displayFAQ = config?.faq || []
  const displayBeforeAfter = config?.beforeAfter || []
  const displayContact = config?.contact || {
    phone: tenant?.telefone,
    whatsapp: tenant?.whatsapp,
    email: tenant?.email || tenant?.emailContato,
    instagram: tenant?.instagram,
    address: tenant?.endereco,
  }
  const showLeis = tenant?.showLeis ?? true
  const showIndicacoes = tenant?.showIndicacoes ?? true
  const showAgenda = tenant?.showAgenda ?? true

  // Lead capture state
  const [leadForm, setLeadForm] = useState({ nome: "", telefone: "", bairro: "" })
  const [leadSubmitting, setLeadSubmitting] = useState(false)
  const [leadSubmitted, setLeadSubmitted] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <div 
        className="min-h-screen bg-gray-50 font-sans selection:bg-primary selection:text-white overflow-x-hidden"
        style={{
            ...themeCSSVars,
            // @ts-ignore
            "--primary": primaryColor,
            "--secondary": secondaryColor,
            "--tenant-primary": primaryColor,
            "--tenant-secondary": secondaryColor,
            "--theme-font-heading": fontHeadingCSS,
            "--theme-font-body": fontBodyCSS,
            fontFamily: "var(--theme-font-body)",
        }}
    >
      {googleFontsUrl && <link rel="stylesheet" href={googleFontsUrl} />}
      {/* HEADER */}
      <header 
        className={cn(
            "fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b",
            isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-gray-100 h-16" : "border-transparent"
        )}
        style={!isScrolled ? {
            height: config?.__editorConfig?.header?.height || 80,
            background: config?.__editorConfig?.header?.menuStyle === "solid"
                ? config?.__editorConfig?.header?.backgroundColor
                : config?.__editorConfig?.header?.menuStyle === "gradient"
                ? `linear-gradient(${config?.__editorConfig?.header?.gradient?.angle}deg, ${config?.__editorConfig?.header?.gradient?.stops
                    .map((stop: any) => `${stop.color} ${stop.position}%`)
                    .join(", ")})`
                : "transparent",
            opacity: config?.__editorConfig?.header?.menuStyle === "gradient" ? (config?.__editorConfig?.header?.gradient?.opacity || 100) / 100 : 1,
        } : {}}
      >
        <div className="mx-auto max-w-7xl px-6 h-full flex items-center justify-between">
           <div className="flex items-center gap-3">
              {logoUrl ? (
                <img 
                    src={logoUrl} 
                    alt={displayName} 
                    style={{ height: isScrolled ? 40 : (config?.__editorConfig?.header?.logoHeight || 40) }} 
                    className="w-auto object-contain" 
                />
              ) : (
                <>
                  <div className={cn(
                    "flex items-center justify-center rounded-xl font-black transition-all",
                    isScrolled ? "bg-[var(--tenant-primary)] text-white h-10 w-10" : "bg-white text-[var(--tenant-primary)]",
                    !isScrolled && "h-12 w-12"
                  )}>
                    {(config?.__editorConfig?.header?.logoText || displayName).charAt(0)}
                  </div>
                  <span className={cn(
                    "font-bold",
                    isScrolled ? "text-base text-gray-900" : "text-lg text-white drop-shadow-sm"
                  )}>{config?.__editorConfig?.header?.logoText || displayName}</span>
                </>
              )}
           </div>
            <nav className="hidden lg:flex items-center gap-8">
               {['projetos', 'perfil', 'contato'].map((id) => (
                 <button key={id} onClick={() => scrollTo(id)} className={cn(
                     "text-sm font-medium uppercase tracking-tight transition-colors hover:opacity-100",
                     isScrolled ? "text-gray-600 hover:text-[var(--tenant-primary)]" : "text-white/90"
                 )}>
                   {id === 'projetos' ? 'Projetos' : id === 'perfil' ? 'Perfil' : 'Contato'}
                 </button>
               ))}
            </nav>
             {(config?.__editorConfig?.header?.showCta ?? true) && (
                 <Button className={cn(
                     "px-5 py-2.5 text-sm font-medium shadow-sm transition-all hover:scale-105",
                     isScrolled ? "bg-[var(--tenant-primary)] text-white h-9" : "bg-[var(--tenant-secondary)] text-white h-10"
                 )} style={{ borderRadius: 'var(--theme-btn-radius)' }}>
                    {config?.__editorConfig?.header?.ctaText || "Quero Apoiar"}
                 </Button>
             )}
        </div>
      </header>

      {/* UNIFIED OPENING (DYNAMIC HEIGHT) */}
      <div className={cn(
        "flex flex-col relative overflow-hidden",
        (editor?.hero?.autoHeight !== false) ? "min-h-screen" : "h-auto"
      )}>
        {/* HERO RECONSTRUCTION (ABSOLUTE PARITY) */}
        <section 
          className={cn(
              "relative flex flex-col justify-center min-h-0",
              (editor?.hero?.autoHeight !== false) ? "flex-1 min-h-[500px]" : "shrink-0"
          )}
          style={{ 
            backgroundColor: themeColors.background,
            height: (editor?.hero?.autoHeight !== false) ? undefined : `${editor?.hero?.height || 600}px`
          }}
        >
        {/* Layer 1: Image Background */}
        {heroImageUrl && (
          <div 
            className="absolute inset-0 z-0 overflow-hidden"
            style={{ 
                // @ts-ignore
                '--hero-img-mob': `url(${getHeroImg('mobile')})`,
                '--hero-img-tab': `url(${getHeroImg('tablet')})`,
                '--hero-img-desk': `url(${getHeroImg('desktop')})`,
                '--hero-pos-mob': `${getHeroPos('mobile').x}% ${getHeroPos('mobile').y}%`,
                '--hero-pos-tab': `${getHeroPos('tablet').x}% ${getHeroPos('tablet').y}%`,
                '--hero-pos-desk': `${getHeroPos('desktop').x}% ${getHeroPos('desktop').y}%`,
                '--hero-scale-mob': `${getHeroPos('mobile').scale / 100}`,
                '--hero-scale-tab': `${getHeroPos('tablet').scale / 100}`,
                '--hero-scale-desk': `${getHeroPos('desktop').scale / 100}`,
                
                backgroundImage: 'var(--hero-img-mob)',
                backgroundPosition: 'var(--hero-pos-mob)',
                transform: 'scale(var(--hero-scale-mob))',
            }}
          >
            {/* Inline responsive style for background inheritance */}
            <style dangerouslySetInnerHTML={{ __html: `
                @media (min-width: 768px) {
                    .hero-img-layer { 
                        background-image: var(--hero-img-tab) !important; 
                        background-position: var(--hero-pos-tab) !important;
                        transform: scale(var(--hero-scale-tab)) !important;
                        background-size: cover !important;
                    }
                }
                @media (min-width: 1024px) {
                    .hero-img-layer { 
                        background-image: var(--hero-img-desk) !important; 
                        background-position: var(--hero-pos-desk) !important;
                        transform: none !important;
                        background-size: calc(var(--hero-scale-desk) * 100%) !important;
                        top: 0 !important;
                        bottom: 0 !important;
                        left: 0 !important;
                        right: 0 !important;
                    }
                }
            `}} />
            <div className={cn(
                "absolute hero-img-layer bg-no-repeat transition-all duration-300 ease-out",
                // Mobile/Tablet use inset-[-10%] for scale safety, Desktop uses inset-0
                "inset-x-[-10%] inset-y-[-10%]" 
            )} style={{ 
                backgroundImage: 'inherit',
                backgroundPosition: 'inherit',
                transform: 'inherit',
                backgroundSize: 'cover'
            }} />
          </div>
        )}

        {/* Layer 2: Overlay Color */}
        {overlayColor && <div className="absolute inset-0 z-[1]" style={{ backgroundColor: overlayColor }} />}
        
        {/* Layer 3: Theme Gradient */}
        {themeGradientStyle && (
            <div 
                className="absolute inset-0 z-[2]" 
                style={{ 
                    background: themeGradientStyle, 
                    opacity: (editor?.theme?.gradient?.opacity || 100) / 100 
                }} 
            />
        )}

        {/* Layer 4: Vignette */}
        {vignetteStyle && <div className="absolute inset-0 z-[3]" style={{ background: vignetteStyle }} />}

        {/* Layer 5: Content Area */}
        <div className={cn(
            "relative z-10 mx-auto w-full max-w-7xl h-full flex items-center px-6 pointer-events-none",
            isScrolled ? "pt-16" : "pt-20 md:pt-24"
        )}>
          <div className={cn(
            "w-full flex-1 flex flex-col transition-all duration-500 pointer-events-auto py-12",
            heroLayout === 'center' ? "items-center text-center" : 
            heroLayout === 'right' ? "items-end text-right" : "items-start text-left",
            (heroLayout === 'left' || heroLayout === 'right') && "lg:max-w-[60%]"
          )}>
            {/* Badge */}
            {heroBadge && (
              <div 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 lg:px-4.5 lg:py-2 rounded-full mb-5 md:mb-6 border border-white/10 transition-transform hover:scale-105" 
                  style={{ 
                      borderRadius: 'var(--theme-btn-radius)',
                      backgroundColor: `${themeColors.primary}4d`, // 30% alpha (4d)
                      color: themeColors.text
                  }}
              >
                <Heart className="w-3 h-3 md:w-3.5 md:h-3.5 lg:w-3.5 lg:h-3.5" style={{ color: primaryColor }} />
                <span className="text-[10px] md:text-xs lg:text-sm font-medium uppercase tracking-widest">{renderMarkdown(heroBadge)}</span>
              </div>
            )}

            {/* Title */}
            <h1 
                className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-5 md:mb-6" 
                style={{ 
                    fontFamily: 'var(--theme-font-heading)', 
                    color: themeColors.text,
                    ...getStyle('hero', 'hero-headline') 
                }}
            >
                {renderMarkdown(heroHeadline || "Por uma cidade de")} {heroHighlight && <span style={{ color: secondaryColor, ...getStyle('hero', 'hero-highlight') }}>{heroHighlight}</span>}
            </h1>

            {/* Description */}
            <p 
                className={cn(
                    "text-base md:text-lg lg:text-xl leading-relaxed opacity-90 mb-6 md:mb-10", 
                    heroLayout === 'center' ? "max-w-2xl mx-auto" : "max-w-xl"
                )} 
                style={{ 
                    color: themeColors.text,
                    ...getStyle('hero', 'hero-description') 
                }}
            >
                {renderMarkdown(heroDescription)}
            </p>

            {/* CTAs */}
            <div className={cn("flex flex-wrap gap-3 md:gap-4 mt-2", heroLayout === 'center' && "justify-center")}>
              <Button 
                className="font-medium text-xs md:text-sm lg:text-base px-6 py-3 md:px-7 md:py-4 lg:px-9 lg:py-5 transition-transform hover:scale-105 active:scale-95 shadow-xl h-auto" 
                style={{ 
                    borderRadius: 'var(--theme-btn-radius)',
                    backgroundColor: themeColors.primary,
                    color: themeColors.text
                }}
              >
                {ctaPrimaryText}
              </Button>
              <Button 
                variant="outline" 
                className="border-2 bg-transparent font-medium text-xs md:text-sm lg:text-base px-6 py-3 md:px-7 md:py-4 lg:px-9 lg:py-5 transition-transform hover:scale-105 hover:bg-white/10 h-auto" 
                style={{ 
                    borderRadius: 'var(--theme-btn-radius)',
                    borderColor: themeColors.text,
                    color: themeColors.text
                }} 
                onClick={() => scrollTo('projetos')}
              >
                {ctaSecondaryText}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BADGES (Highlights Bar) */}
      {displayTrustBadges.length > 0 && (() => {
        const trustPlugin = (config as any)?.__editorConfig?.plugins?.trust || {}
        const autoplay = trustPlugin.autoplay !== false
        const speed = trustPlugin.speed || 25
        
        const IconMap: any = {
            Check: CheckCircle2,
            Award,
            Star,
            Shield,
            Gem,
            Zap,
            Flag,
            Heart
        }

        const loopedBadges = [...displayTrustBadges, ...displayTrustBadges, ...displayTrustBadges]

        return (
          <section className="bg-slate-900 py-6 overflow-hidden border-y border-white/5 relative shrink-0">
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes marquee-site {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.333%); }
                }
            `}} />
            <div 
                className="flex items-center gap-12 whitespace-nowrap px-6 w-max"
                style={{
                    animationName: 'marquee-site',
                    animationDuration: `${speed}s`,
                    animationTimingFunction: 'linear',
                    animationIterationCount: 'infinite',
                    animationPlayState: autoplay ? 'running' : 'paused'
                }}
            >
              {loopedBadges.map((badge: any, i: number) => {
                const Icon = IconMap[badge.icon || 'Check'] || CheckCircle2
                return (
                  <div key={i} className="flex items-center gap-3 shrink-0">
                    <Icon className="h-5 w-5" style={{ color: primaryColor }} />
                    <span className="text-white font-bold uppercase tracking-[0.15em] text-[10px]">
                      {badge.text}
                    </span>
                  </div>
                )
              })}
            </div>
          </section>
        )
      })()}
    </div>

      {/* PROJETOS */}
      <section id="projetos" className="py-24 bg-white relative">
        <div className="mx-auto max-w-7xl px-8">
           <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-16" style={{ fontFamily: 'var(--theme-font-heading)', ...getStyle('projetos', 'projetos-title') }}>
               {projetosTitle}
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayProjetos.map((proj: any, i: number) => (
                <div key={i} className="group rounded-[2rem] bg-gray-50 hover:bg-white hover:shadow-2xl transition-all border border-transparent hover:border-gray-200 overflow-hidden">
                  {proj.image ? (
                    <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                      <img src={proj.image} alt={proj.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ) : (
                    <div className="p-8 pb-0">
                      <div className="h-14 w-14 rounded-2xl flex items-center justify-center mb-6 transition-all"
                        style={{ backgroundColor: `${primaryColor}10`, color: primaryColor }}
                      >
                        <FileText className="h-7 w-7" />
                      </div>
                    </div>
                  )}
                  <div className="p-8">
                    <h3 className="text-xl font-black text-gray-900 mb-2">{proj.name}</h3>
                    <p className="text-gray-500 leading-relaxed text-sm line-clamp-3">{proj.description}</p>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* INDICAÇÕES LEGISLATIVAS */}
      {showIndicacoes && displayIndicacoes.length > 0 && (
        <section className="py-24 bg-gray-50 border-t border-gray-100">
          <div className="mx-auto max-w-7xl px-8">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-16">Indicações <span style={{ color: primaryColor }} className="italic">Legislativas</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayIndicacoes.map((ind: any, i: number) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider" style={{ backgroundColor: `${secondaryColor}15`, color: secondaryColor }}>
                      {ind.tipo === 'indicacao' ? 'Indicação' : ind.tipo}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400">{ind.numero || ''}</span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{ind.titulo}</h3>
                  {ind.descricao && <p className="text-sm text-gray-500 line-clamp-3">{ind.descricao}</p>}
                  <p className="text-[10px] text-gray-400 mt-3">{ind.data ? new Date(ind.data).toLocaleDateString('pt-BR') : ''}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* AGENDA PÚBLICA */}
      {showAgenda && displayAgenda.length > 0 && (
        <section className="py-24 bg-white border-t border-gray-100">
          <div className="mx-auto max-w-7xl px-8">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-16">Agenda <span style={{ color: primaryColor }} className="italic">Pública</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayAgenda.map((event: any, i: number) => (
                <div key={i} className="bg-gray-50 rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all flex gap-4">
                  <div className="flex flex-col items-center justify-center h-16 w-16 rounded-2xl text-center shrink-0" style={{ backgroundColor: `${primaryColor}10` }}>
                    <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: primaryColor }}>
                      {new Date(event.dataEvento).toLocaleDateString('pt-BR', { month: 'short' })}
                    </span>
                    <span className="text-2xl font-black leading-none" style={{ color: primaryColor }}>
                      {new Date(event.dataEvento).getDate()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{event.titulo}</h3>
                    {event.local && <p className="text-sm text-gray-500 mt-1 flex items-center gap-1"><MapPin className="h-3 w-3" />{event.local}</p>}
                    <p className="text-xs text-gray-400 mt-1">{new Date(event.dataEvento).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA - CAPTURA DE LEAD */}
      <section className="py-20 relative" style={{ backgroundColor: primaryColor }}>
        <div className="absolute inset-0 bg-linear-to-br from-black/20 to-transparent z-0" />
        <div className="relative z-10 mx-auto max-w-3xl px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">Quer fazer parte da mudança?</h2>
          <p className="text-white/70 mb-8 text-lg">Deixe seus dados e fique por dentro das ações do mandato</p>
          {leadSubmitted ? (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <CheckCircle2 className="h-12 w-12 text-white mx-auto mb-4" />
              <p className="text-white font-bold text-xl">Obrigado pelo contato!</p>
              <p className="text-white/60 text-sm mt-2">Em breve entraremos em contato com você.</p>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={leadForm.nome}
                  onChange={(e) => setLeadForm(prev => ({ ...prev, nome: e.target.value }))}
                  className="rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder:text-white/40 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                <input
                  type="text"
                  placeholder="Seu telefone"
                  value={leadForm.telefone}
                  onChange={(e) => setLeadForm(prev => ({ ...prev, telefone: e.target.value }))}
                  className="rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder:text-white/40 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                <input
                  type="text"
                  placeholder="Seu bairro"
                  value={leadForm.bairro}
                  onChange={(e) => setLeadForm(prev => ({ ...prev, bairro: e.target.value }))}
                  className="rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder:text-white/40 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>
              <Button
                className="mt-4 w-full md:w-auto px-12 py-6 rounded-xl font-black text-lg shadow-xl hover:scale-105 active:scale-95 transition-all"
                style={{ backgroundColor: secondaryColor }}
                disabled={leadSubmitting}
                onClick={async () => {
                  if (!leadForm.nome) { toast.error('Preencha seu nome'); return }
                  setLeadSubmitting(true)
                  try {
                    if (tenant?.id) {
                      await createLead({ tenantId: tenant.id, nome: leadForm.nome, telefone: leadForm.telefone, bairroNome: leadForm.bairro, origem: 'landing_cta', funil: 'novo' })
                    }
                    setLeadSubmitted(true)
                    toast.success('Cadastro realizado!')
                  } catch { toast.error('Erro ao cadastrar') }
                  finally { setLeadSubmitting(false) }
                }}
              >
                <Send className="h-5 w-5 mr-2" />
                {leadSubmitting ? 'Enviando...' : 'Quero Participar'}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* PERFIL */}
      <section id="perfil" className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-8">
           <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl bg-slate-200">
                {displayFoto ? (
                  <Image src={displayFoto} alt={displayName} fill className="object-cover object-top" sizes="600px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor}10` }}>
                    <User className="h-24 w-24 text-slate-300" />
                  </div>
                )}
              </div>
              <div className="space-y-8">
                 <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight" style={{ fontFamily: 'var(--theme-font-heading)', ...getStyle('perfil', 'perfil-title') }}>
                     {perfilTitle}
                 </h2>
                 <p className="text-xl text-gray-600 leading-relaxed italic">"{displayBio}"</p>
                 <div className="pt-8 border-t border-gray-200">
                    <h3 className="text-3xl font-black uppercase" style={{ color: primaryColor }}>{displayName}</h3>
                    <p className="text-gray-400 font-bold uppercase tracking-widest mt-1">{displayRole}</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* BEFORE/AFTER */}
      {displayBeforeAfter.length > 0 && (
        <section className="py-24 bg-white border-t border-gray-100">
          <div className="mx-auto max-w-7xl px-8">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-16 text-center" style={{ fontFamily: 'var(--theme-font-heading)', ...getStyle('beforeAfter', 'results-title') }}>
              {resultsTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayBeforeAfter.map((item: any, idx: number) => (
                <div key={idx} className="bg-gray-50 rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all">
                  <div className="grid grid-cols-2 h-44">
                    <div className="relative overflow-hidden">
                      {item.before ? (
                        <img src={item.before} alt="Antes" className="w-full h-full object-cover grayscale" />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center"><span className="text-xs text-gray-400 font-bold">ANTES</span></div>
                      )}
                    </div>
                    <div className="relative overflow-hidden">
                      {item.after ? (
                        <img src={item.after} alt="Depois" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center"><span className="text-xs text-gray-400 font-bold">DEPOIS</span></div>
                      )}
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-sm font-bold text-gray-900">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {displayFAQ.length > 0 && (
        <section className="py-24 bg-gray-50">
          <div className="mx-auto max-w-3xl px-8">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-16 text-center" style={{ fontFamily: 'var(--theme-font-heading)', ...getStyle('faq', 'faq-title') }}>
              {faqTitle}
            </h2>
            <div className="space-y-4">
              {displayFAQ.map((item: any, idx: number) => (
                <details key={idx} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                  <summary className="flex items-center justify-between px-6 py-5 cursor-pointer select-none list-none hover:bg-gray-50 transition-colors">
                    <span className="text-base font-bold text-gray-900">{item.question}</span>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-open:rotate-90 transition-transform shrink-0 ml-4" />
                  </summary>
                  <div className="px-6 pb-5 text-gray-600 leading-relaxed text-sm">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CONTACT */}
      {(displayContact as any)?.phone || (displayContact as any)?.whatsapp || (displayContact as any)?.email ? (
        <section id="contato" className="py-24 bg-white border-t border-gray-100">
          <div className="mx-auto max-w-4xl px-8">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-16 text-center" style={{ fontFamily: 'var(--theme-font-heading)', ...getStyle('contact', 'contact-title') }}>
              {contactTitle}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(displayContact as any)?.phone && (
                <a href={`tel:${(displayContact as any).phone}`} className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-lg transition-all group">
                  <div className="h-12 w-12 rounded-xl flex items-center justify-center transition-all" style={{ backgroundColor: `${primaryColor}10`, color: primaryColor }}>
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Telefone</p>
                    <p className="text-sm font-bold text-gray-900">{(displayContact as any).phone}</p>
                  </div>
                </a>
              )}
              {(displayContact as any)?.whatsapp && (
                <a href={`https://wa.me/55${(displayContact as any).whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-lg transition-all group">
                  <div className="h-12 w-12 rounded-xl bg-green-500/10 text-green-600 flex items-center justify-center">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">WhatsApp</p>
                    <p className="text-sm font-bold text-gray-900">{(displayContact as any).whatsapp}</p>
                  </div>
                </a>
              )}
              {(displayContact as any)?.email && (
                <a href={`mailto:${(displayContact as any).email}`} className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-lg transition-all group">
                  <div className="h-12 w-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${primaryColor}10`, color: primaryColor }}>
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">E-mail</p>
                    <p className="text-sm font-bold text-gray-900">{(displayContact as any).email}</p>
                  </div>
                </a>
              )}
              {(displayContact as any)?.address && (
                <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100 md:col-span-2 lg:col-span-3">
                  <div className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${primaryColor}10`, color: primaryColor }}>
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Endereço</p>
                    <p className="text-sm font-bold text-gray-900">{(displayContact as any).address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      ) : null}

      {/* FOOTER */}
      <footer id="contact" className="bg-gray-900 py-20 text-white/50 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-8 flex flex-col md:flex-row justify-between items-center gap-12">
           <div className="flex flex-col items-center md:items-start gap-4">
              <span className="text-3xl font-black text-white uppercase tracking-tighter">{displayName}</span>
              <p className="max-w-xs text-sm">{displayTagline}</p>
           </div>
           <div className="flex gap-6">
              {(displayContact as any)?.instagram && (
                <a href={`https://instagram.com/${(displayContact as any).instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                  <Share2 className="w-8 h-8 text-white/30 hover:text-[var(--tenant-secondary)] transition-colors" />
                </a>
              )}
              {(displayContact as any)?.whatsapp && (
                <a href={`https://wa.me/55${(displayContact as any).whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-8 h-8 text-white/30 hover:text-green-400 transition-colors" />
                </a>
              )}
           </div>
           <p className="text-[10px] uppercase font-black tracking-widest">© 2026 Mandato360</p>
        </div>
      </footer>
    </div>
  )
}
