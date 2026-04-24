"use client"

import Link from "next/link"
import Image from "next/image"
import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { 
    Activity, Award, MapPin, Menu, Phone, ShieldCheck, Star, 
    ArrowRight, MessageCircle, X, ChevronLeft, ChevronRight, Clock, Instagram, User, Check,
    Image as ImageIcon
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

// Force-triggering a module factory rebuild by refactoring the main component.
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { SchedulingSection } from "@/components/scheduling-section"
import { DraggableCarousel } from "@/components/draggable-carousel"
import { TenantWhatsapp } from "@/components/tenant-whatsapp"
import type { TenantData } from "@/lib/tenant-types"
import { resolveSectionBackground, resolveElementStyle, elementStyleToCSS, buildGoogleFontsUrl, getFontStack } from "@/lib/style-utils"
import { getTheme, generateThemeCSS, getHeroImageForNiche } from "@/src/themes"
import { cn } from "@/lib/utils"

// Helper to render simple markdown-like syntax from editor
function renderEditorText(text: string = "") {
    if (!text) return ""
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/__(.*?)__/g, '<u>$1</u>')
        .replace(/<lg>(.*?)<\/lg>/g, '<span class="text-1.2em font-black">$1</span>')
        .replace(/<sm>(.*?)<\/sm>/g, '<span class="text-0.8em opacity-80">$1</span>')
}

interface TenantClientProps {
    data: TenantData
    services: any[]
    categories: any[]
}

export function TenantDisplay({ data, services, categories }: TenantClientProps) {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const [activeCategory, setActiveCategory] = useState("todos")
    const [isBookingOpen, setIsBookingOpen] = useState(false)
    const [activeServiceId, setActiveServiceId] = useState("")

    // Filter out duplicate "todos" from categories since we render it manually
    const filteredCategories = categories.filter(c => c.id !== 'todos')

    useEffect(() => {
        setIsMounted(true)
        const handleScroll = () => setIsScrolled(window.scrollY > 10)
        handleScroll()
        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const handleOpenBooking = (serviceId: string = "") => {
        setActiveServiceId(serviceId)
        setIsBookingOpen(true)
    }


    const { primary, hover } = data.colors
    const editorConfig = data.config as any
    const editorTheme = editorConfig?.theme
    const designSystem = data.designSystem || editorTheme?.designSystem || {}
    const fontHeading = designSystem.fonts?.primary || "serif"
    const fontBody = designSystem.fonts?.secondary || "sans"
    const borderRadius = designSystem.borderRadius || "lg"

    // Colors from editor theme if available
    const themeColors = editorTheme?.colors || {}
    const themePrimary = themeColors.primary || primary || '#8c6239'
    const themeHover = themeColors.hover || hover || themePrimary
    const themeAccent = themeColors.accent || '#eec584'
    const themeBg = themeColors.background || '#0f172a'
    const themeText = themeColors.text || '#ffffff'

    // ─── Resolve editor-saved styles ───
    const heroSectionBg = resolveSectionBackground(data, 'hero')
    const hasCustomHeroBg = Object.keys(heroSectionBg).length > 0

    // Combine theme values + patch with editor overrides (Mandato360 parity)
    const activeTheme = getTheme((data.theme as any) || "neutro")
    if (editorTheme) {
        if (editorTheme.colors) {
            activeTheme.colors.light = { ...activeTheme.colors.light, ...editorTheme.colors }
            activeTheme.colors.light.primary = editorTheme.colors.primary
            activeTheme.colors.light.secondary = editorTheme.colors.secondary
        }
        if (editorTheme.designSystem) {
            activeTheme.buttons.style = editorTheme.designSystem.borderRadius === 'full' ? 'pill' :
                                        editorTheme.designSystem.borderRadius === 'none' ? 'sharp' : 'soft'
        }
    }
    const themeCSSVars = generateThemeCSS(activeTheme, "light")
    const rootVarStyles = Object.entries(themeCSSVars).map(([key, val]) => `${key}: ${val};`).join('\n')

    const googleFontsUrl = buildGoogleFontsUrl([fontHeading, fontBody])

    // Helper: get inline style for an editable element
    const elStyle = (sectionId: string, elementId: string): React.CSSProperties =>
        elementStyleToCSS(resolveElementStyle(data, sectionId, elementId))

    // ─── Hero Resolution Engine (matches editor's resolveHero — Mandato360 parity) ───
    function resolveHeroForSite(bp: 'mobile' | 'tablet' | 'desktop') {
        const hero = editorConfig?.hero
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

    // Fallback: if resolution engine returns null, read directly from editorConfig
    const effectiveHero = heroDesktop || editorConfig?.hero || {}
    const effectiveVignette = effectiveHero?.vignette
    const effectiveOverlay = effectiveHero?.overlay

    // ─── Absolute Parity Calculations (identical to editor device-preview.tsx) ───
    const vignetteStyle = effectiveVignette?.enabled
        ? `radial-gradient(circle, transparent ${100 - (effectiveVignette.intensity ?? 40)}%, ${effectiveVignette.color || '#000000'} 100%)`
        : undefined

    const overlayStyle = effectiveOverlay?.enabled
        ? { backgroundColor: effectiveOverlay.color || '#000000', opacity: (effectiveOverlay.opacity ?? 30) / 100 }
        : undefined

    // Hero-level gradient (device-aware), fallback to theme gradient
    const activeDesktopGradient = heroDesktop?.gradient?.enabled ? heroDesktop.gradient : editorTheme?.gradient
    const themeGradientStyle = activeDesktopGradient?.enabled
        ? `linear-gradient(${activeDesktopGradient.angle}deg, ${activeDesktopGradient.stops
            .map((stop: any) => `${stop.color} ${stop.position}%`)
            .join(", ")})`
        : undefined

    // Responsive hero image helpers
    const getHeroImg = (device: 'mobile' | 'tablet' | 'desktop') => editorConfig?.hero?.images?.[device] || data.heroImageUrl || getHeroImageForNiche(data.businessTypeId)
    const getHeroPos = (device: 'mobile' | 'tablet' | 'desktop') => editorConfig?.hero?.imagePosition?.[device] || { x: 50, y: 50, scale: 100 }

    return (
        <div 
            className="min-h-screen bg-(--theme-color-background) font-sans text-slate-900 selection:bg-tenant-primary/10 selection:text-tenant-primary scroll-smooth tenant-theme-root"
            style={{ fontFamily: 'var(--theme-font-body)' }}
            data-theme={data.theme || "neutro"}
        >
            {googleFontsUrl && <link rel="stylesheet" href={googleFontsUrl} />}
            <style dangerouslySetInnerHTML={{
                __html: `
                :root {
                    ${rootVarStyles}
                    --tenant-primary: ${themePrimary};
                    --tenant-hover: ${themeHover};
                    --tenant-accent: ${themeAccent};
                    --tenant-hero-overlay: ${themePrimary};
                    --theme-color-background: ${themeBg};
                    --theme-color-text: ${themeText};
                    --theme-font-heading: ${getFontStack(fontHeading)};
                    --theme-font-body: ${getFontStack(fontBody)};
                    --theme-btn-radius: ${borderRadius === 'full' ? '9999px' : borderRadius === 'none' ? '0px' : borderRadius === 'lg' ? '0.625rem' : '0.375rem'};
                    --theme-card-radius: ${borderRadius === 'full' ? '2rem' : borderRadius === 'none' ? '0px' : borderRadius === 'lg' ? '1.5rem' : '0.75rem'};
                }
                .bg-tenant-primary { background-color: var(--tenant-primary); }
                .text-tenant-primary { color: var(--tenant-primary); }
                .border-tenant-primary { border-color: var(--tenant-primary); }
                .hover\\:bg-tenant-hover:hover { background-color: var(--tenant-hover); }
                .group:hover .group-hover\\:bg-tenant-primary { background-color: var(--tenant-primary); }
                .group:hover .group-hover\\:text-white { color: #ffffff; }
                
                /* Handle editor HTML tags */
                h1 lg, h1 .lg { font-size: 1.2em; font-weight: 900; }
                h1 sm, h1 .sm { font-size: 0.8em; opacity: 0.8; }
                h1 i, h1 .italic { font-style: italic; }
            `}} />

            {/* Nav */}
            <nav className={`fixed left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'backdrop-blur-lg border-b border-white/5 shadow-xl' : 'bg-transparent'}`} style={{ top: 0, ...(isScrolled ? { backgroundColor: data.headerBgColor || '#0f172acc' } : {}) }}>
                <div className={`mx-auto flex max-w-7xl items-center justify-between px-6 transition-all duration-300 ${!isScrolled ? 'py-6' : 'py-3'}`}>
                    <Link href="#inicio" className="flex items-center group">
                        {data.logoUrl ? (
                            <img src={data.logoUrl} alt={data.name}
                                className={`w-auto object-contain transition-all duration-300 group-hover:scale-105 ${!isScrolled ? 'h-16' : 'h-12 brightness-0 invert'}`} />
                        ) : (
                            <span className={`font-bold text-white transition-all duration-300 ${!isScrolled ? 'text-2xl' : 'text-lg'}`} style={{ fontFamily: 'var(--theme-font-heading)' }}>{data.name}</span>
                        )}
                    </Link>
                    <div className="hidden items-center gap-8 lg:flex">
                        {["Início", "Serviços", "Dúvidas", "Contato"].map((item) => (
                            <Link key={item} href={`#${item.toLowerCase().replace('í', 'i')}`}
                                className="text-sm font-bold text-white hover:text-white/80 transition-colors">{item}</Link>
                        ))}
                        <Link href={`https://wa.me/${data.contact.whatsapp}?text=Ol%C3%A1%20${encodeURIComponent(data.name)}%2C%20vi%20seu%20site%20e%20gostaria%20de%20agendar%20um%20hor%C3%A1rio.`} target="_blank">
                            <Button size="sm" className="bg-tenant-primary text-white hover:opacity-90 font-bold rounded-(--theme-btn-radius) px-6 shadow-sm border-none">Agendar Agora</Button>
                        </Link>
                    </div>
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" className="transition-all p-0 duration-300 text-white hover:bg-white/10 hover:backdrop-blur-md rounded-xl w-14 h-14 flex items-center justify-center active:scale-95">
                                    <Menu size={32} style={{ width: '32px', height: '32px' }} strokeWidth={1.2} />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[320px] bg-(--theme-color-surface) border-l border-slate-200 p-0 flex flex-col">
                                <SheetHeader className="p-8 border-b border-tenant-primary/10 flex-row items-center justify-center bg-white shadow-sm">
                                    <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
                                    <div className="relative w-48 h-20 flex justify-center items-center">
                                        {data.logoUrl ? (
                                            <img src={data.logoUrl} alt={data.name} className="h-full w-auto object-contain"
                                                style={{ filter: 'brightness(0) saturate(100%) invert(18%) sepia(34%) saturate(2283%) hue-rotate(346deg) brightness(93%) contrast(92%)' }} />
                                        ) : (
                                            <span className="font-bold text-slate-800 text-xl">{data.name}</span>
                                        )}
                                    </div>
                                </SheetHeader>
                                <div className="flex flex-col flex-1 gap-1 px-4 py-6 overflow-y-auto">
                                    {["Início", "Serviços", "Dúvidas", "Contato"].map((item) => (
                                        <SheetClose asChild key={item}>
                                            <Link href={`#${item.toLowerCase().replace('í', 'i')}`}
                                                className="group flex items-center justify-between text-[17px] font-medium text-slate-600 hover:text-tenant-primary hover:bg-white hover:shadow-sm px-5 py-4 rounded-2xl transition-all duration-300">
                                                {item}
                                                <ArrowRight className="h-4 w-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-tenant-primary" />
                                            </Link>
                                        </SheetClose>
                                    ))}
                                </div>
                                <div className="mt-auto p-6 bg-white border-t border-slate-100">
                                    <Link href={`https://wa.me/${data.contact.whatsapp}`}>
                                        <Button className="w-full h-14 bg-tenant-primary hover:bg-tenant-hover text-white font-bold rounded-(--theme-btn-radius) text-[15px] tracking-wide shadow-(--theme-card-shadow) transition-all active:scale-95 hover:scale-[1.02] flex items-center justify-center gap-2">
                                            <MessageCircle className="w-5 h-5" /> Como podemos ajudar?
                                        </Button>
                                    </Link>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </nav>

            {/* ─── DYNAMIC SECTION ENGINE ─── */}
            {(() => {
                const hero = editorConfig?.hero || {}
                
                // High-Fidelity Detection (including responsive overrides from editor)
                const desktopOverride = hero.overrides?.desktop?.orientation
                const baseOrientation = hero.orientation || (data.heroImageSettings as any)?.layout || 'left'
                const savedOrientation = desktopOverride || baseOrientation
                
                const heroLayout = (savedOrientation === 'center' || savedOrientation === 'centro' || savedOrientation === 'Centro') ? 'center' : savedOrientation;
                
                const isCenter = heroLayout === 'center';
                const isRight = heroLayout === 'right';
                const isLeft = !isCenter && !isRight;
                const resolvedHeroImageUrl = getHeroImg('desktop');
                
                // Hero Text
                const heroTitle = hero?.title || data.heroHeadline
                const heroDesc = hero?.description || data.description
                const heroBadge = hero?.badge || data.heroBadge
                const heroCtaPrimary = hero?.ctaPrimary || data.ctaText || "Agendar"
                const heroCtaSecondary = hero?.ctaSecondary || "Ver Serviços"
                const elements: Record<string, React.ReactNode> = {
                    'hero': (
                        <section
                            id="inicio"
                            className={cn(
                                "relative overflow-hidden",
                                (effectiveHero?.autoHeight !== false) ? "min-h-[90vh] lg:min-h-screen" : "h-auto",
                                isCenter 
                                    ? "flex flex-col justify-center items-center"
                                    : "pb-10 lg:pb-0 flex items-center"
                            )}
                            style={{ 
                                backgroundColor: themeBg,
                                paddingTop: isCenter ? '6rem' : '8rem',
                                paddingBottom: isCenter ? '4rem' : undefined,
                                height: (effectiveHero?.autoHeight !== false) ? undefined : `${effectiveHero?.height || 600}px`,
                            }}
                        >

                            {/* LAYER 1 — Background Image (CSS background-image — parity with editor) */}
                            {resolvedHeroImageUrl && (
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
                                        "inset-x-[-10%] inset-y-[-10%]" 
                                    )} style={{ 
                                        backgroundImage: 'inherit',
                                        backgroundPosition: 'inherit',
                                        transform: 'inherit',
                                        backgroundSize: 'cover'
                                    }} />
                                </div>
                            )}

                            {/* LAYER 2 — Overlay Color (matching editor) */}
                            {overlayStyle && <div className="absolute inset-0 z-[1]" style={overlayStyle} />}
                            
                            {/* LAYER 3 — Theme Gradient (identical to editor) */}
                            {themeGradientStyle && (
                                <div 
                                    className="absolute inset-0 z-[2]" 
                                    style={{ 
                                        background: themeGradientStyle, 
                                        opacity: (activeDesktopGradient?.opacity || 100) / 100 
                                    }} 
                                />
                            )}

                            {/* LAYER 4 — Vignette (radial-gradient — identical to editor) */}
                            {vignetteStyle && <div className="absolute inset-0 z-[3]" style={{ background: vignetteStyle }} />}

                            {/* LAYER 5 — Content */}
                            <div className={cn("relative z-10 mx-auto max-w-7xl px-6 w-full h-full flex items-center pointer-events-none", isScrolled ? "pt-16" : "pt-20 md:pt-24")}>
                                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} 
                                    className={cn(
                                        "w-full flex-1 flex flex-col transition-all duration-500 pointer-events-auto py-12",
                                        isCenter ? "items-center text-center" : isRight ? "items-end text-right" : "items-start text-left",
                                        (isLeft || isRight) && "lg:max-w-[60%]"
                                    )}
                                >
                                    {heroBadge && (
                                        <div 
                                            className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full mb-5 md:mb-6 border border-white/10 transition-transform hover:scale-105")}
                                            style={{ 
                                                borderRadius: 'var(--theme-btn-radius)',
                                                backgroundColor: `${themePrimary}4d`,
                                                color: themeText,
                                                ...elStyle('hero', 'hero-badge')
                                            }}
                                        >
                                            <Activity className="w-3 h-3 md:w-3.5 md:h-3.5" style={{ color: themePrimary }} />
                                            <span className="text-[10px] md:text-xs font-medium uppercase tracking-widest" dangerouslySetInnerHTML={{ __html: renderEditorText(heroBadge) }} />
                                        </div>
                                    )}
                                    <h1 
                                        className={cn("text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-5 md:mb-6")} 
                                        style={{ fontFamily: 'var(--theme-font-heading)', color: themeText, ...elStyle('hero', 'hero-headline') }}
                                        dangerouslySetInnerHTML={{ __html: renderEditorText(heroTitle) }}
                                    />
                                    {(!data.config && data.heroHighlight) && (
                                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-5 md:mb-6" style={{ fontFamily: 'var(--theme-font-heading)', color: themeText, ...elStyle('hero', 'hero-headline') }}>
                                            <span className="font-light italic" style={{ color: 'var(--tenant-accent)', textShadow: `0 0 15px #eec58466`, ...elStyle('hero', 'hero-highlight') }}>{data.heroHighlight}</span>.
                                        </h1>
                                    )}
                                    <p 
                                        className={cn("text-base md:text-lg lg:text-xl leading-relaxed opacity-90 mb-6 md:mb-10", isCenter ? "max-w-2xl mx-auto" : "max-w-xl")} 
                                        style={{ color: themeText, ...elStyle('hero', 'hero-description') }}
                                    >
                                        <span dangerouslySetInnerHTML={{ __html: renderEditorText(heroDesc) }} />
                                    </p>
                                    <div className={cn("flex flex-wrap gap-3 md:gap-4 mt-2", isCenter && "justify-center")}>
                                        <Button 
                                            onClick={() => handleOpenBooking()}
                                            className="font-medium text-xs md:text-sm lg:text-base px-6 py-3 md:px-7 md:py-4 lg:px-9 lg:py-5 transition-transform hover:scale-105 active:scale-95 shadow-xl h-auto border-none" 
                                            style={{ 
                                                borderRadius: 'var(--theme-btn-radius)',
                                                backgroundColor: themePrimary,
                                                color: themeText,
                                                ...elStyle('hero', 'hero-cta-primary')
                                            }}
                                        >
                                            {heroCtaPrimary} <ArrowRight className="h-4 w-4 ml-2" />
                                        </Button>
                                        <Link href="#servicos">
                                            <Button 
                                                variant="outline" 
                                                className="border-2 bg-transparent font-medium text-xs md:text-sm lg:text-base px-6 py-3 md:px-7 md:py-4 lg:px-9 lg:py-5 transition-transform hover:scale-105 hover:bg-white/10 h-auto" 
                                                style={{ 
                                                    borderRadius: 'var(--theme-btn-radius)',
                                                    borderColor: themeText,
                                                    color: themeText,
                                                    ...elStyle('hero', 'hero-cta-secondary')
                                                }}
                                            >
                                                {heroCtaSecondary}
                                            </Button>
                                        </Link>
                                    </div>
                                </motion.div>
                            </div>
                        </section>
                    ),
                    'trust_badges': (
                         <div className="bg-slate-900 py-6 overflow-hidden border-y border-white/5">
                            <motion.div animate={{ x: [0, -1000] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="flex items-center gap-12 whitespace-nowrap">
                                {[...data.trustBadges, ...data.trustBadges, ...data.trustBadges].map((badge, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <ShieldCheck className="h-5 w-5 text-tenant-primary" />
                                        <span className="text-white font-bold uppercase tracking-[0.2em] text-[10px]">{typeof badge === 'string' ? badge : (badge as any).text}</span>
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    ),
                    'servicos': (
                        <section id="servicos" className="py-24 bg-white">
                            <div className="mx-auto max-w-7xl px-6">
                                <div className="mb-16 text-center max-w-3xl mx-auto">
                                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6" style={{ fontFamily: 'var(--theme-font-heading)' }}>
                                        Nossa <span className="text-tenant-primary italic">Expertise</span>
                                    </h2>
                                    <p className="text-lg text-slate-600">Procedimentos personalizados para valorizar a arquitetura do seu rosto e realçar a sua beleza natural.</p>
                                </div>
                                <div className="flex justify-center flex-wrap gap-4 mb-16">
                                    <button onClick={() => setActiveCategory("todos")}
                                        className={`px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 ${activeCategory === "todos" ? "bg-tenant-primary text-white shadow-lg shadow-tenant-primary/30" : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700"}`}>Todos</button>
                                    {filteredCategories.map((cat) => (
                                        <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                                            className={`px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 ${activeCategory === cat.id ? "bg-tenant-primary text-white shadow-lg shadow-tenant-primary/30" : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700"}`}>{cat.label}</button>
                                    ))}
                                </div>
                                <div className="max-w-6xl mx-auto flex flex-col gap-10">
                                    {filteredCategories.filter(c => activeCategory === 'todos' || activeCategory === c.id).map((category) => {
                                        const categoryServices = services.filter(s => s.categoryId === category.id)
                                        if (categoryServices.length === 0) return null
                                        return (
                                            <div key={category.id} className="flex flex-col mb-10 last:mb-0">
                                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-10 w-full">
                                                    <div className="h-px bg-slate-200 flex-1"></div>
                                                    <h3 className="text-2xl font-bold tracking-widest text-slate-400 uppercase">{category.label}</h3>
                                                    <div className="h-px bg-slate-200 flex-1"></div>
                                                </motion.div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                                    {categoryServices.map((service, i) => (
                                                        <motion.div key={service.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="group bg-(--theme-color-surface) rounded-(--theme-card-radius) border border-slate-100 hover:border-tenant-primary/20 hover:bg-white hover:shadow-(--theme-card-shadow) transition-all duration-300 flex flex-col overflow-hidden shadow-sm">
                                                            <div className="relative h-56 w-full overflow-hidden bg-slate-100 flex items-center justify-center">
                                                                {service.image ? <img src={service.image} alt={service.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" /> : <ImageIcon className="h-12 w-12 text-slate-300" />}
                                                                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                            </div>
                                                            <div className="p-8 flex flex-col flex-1">
                                                                <h4 className="text-xl font-bold text-slate-900 mb-3">{service.name}</h4>
                                                                <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">{service.description}</p>
                                                                <div className="mt-auto flex flex-col sm:flex-row gap-3">
                                                                    {(data.plan === 'profissional' || data.plan === 'premium') && (
                                                                        <Link href={`/${data.slug}/servico/${service.slug}`} className="flex-1">
                                                                            <button className="w-full flex items-center justify-center bg-white text-tenant-primary border border-tenant-primary hover:bg-tenant-primary hover:text-white font-bold rounded-(--theme-btn-radius) h-12 transition-all shadow-sm">Conhecer</button>
                                                                        </Link>
                                                                    )}
                                                                    <button 
                                                                        onClick={() => handleOpenBooking(service.id)} 
                                                                        className="flex-1 flex items-center justify-center bg-tenant-primary text-white border border-transparent hover:bg-white hover:text-tenant-primary! hover:border-tenant-primary! font-bold rounded-(--theme-btn-radius) h-12 transition-all shadow-md group-hover:shadow-(--theme-card-shadow)"
                                                                    >
                                                                        Agendar
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </section>
                    ),
                    'agendamento': (
                        <SchedulingSection 
                            tenantId={data.id || ""} 
                            whatsappNumber={data.contact.whatsapp} 
                            services={services}
                        />
                    ),
                    'sobre': (
                        <section id="sobre" className="relative py-24 lg:py-32 bg-white overflow-hidden">
                            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,var(--tenant-primary)_0%,transparent_40%)] opacity-[0.03]" />
                            <div className="mx-auto max-w-7xl px-6 relative z-10">
                                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                                    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative pb-10">
                                        <div className="absolute -inset-4 lg:-inset-8 bg-tenant-primary/10 rounded-(--theme-card-radius) blur-3xl opacity-60" />
                                        <div className="relative aspect-4/5 max-w-md mx-auto rounded-(--theme-card-radius) bg-(--theme-color-surface) overflow-hidden shadow-(--theme-card-shadow) border border-slate-100 group">
                                            {data.founder.imageUrl ? (
                                                <Image src={data.founder.imageUrl} alt={data.founder.name || 'Fundador(a)'} fill className="object-cover object-top transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center transition-transform duration-700 group-hover:scale-105 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
                                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/40 rounded-full blur-2xl"></div>
                                                    <div className="relative z-10 w-40 h-40 rounded-full bg-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white flex items-center justify-center backdrop-blur-sm"><User className="w-20 h-20 text-slate-400" strokeWidth={1.5} /></div>
                                                </div>
                                            )}
                                            <div className="absolute bottom-6 left-6 right-6 p-5 bg-white/70 backdrop-blur-xl rounded-(--theme-card-radius) border border-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.05)] transform transition-transform duration-500 group-hover:-translate-y-2">
                                                <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-tenant-primary mb-1">{data.founder.role || 'Fundador(a) & Especialista'}</p>
                                                <h4 className="font-bold text-slate-900 text-lg">{data.founder.name && data.founder.name !== 'Seu Nome' ? data.founder.name : data.name}</h4>
                                            </div>
                                        </div>
                                    </motion.div>
                                    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="space-y-8">
                                        <div className="inline-flex items-center gap-2 rounded-(--theme-btn-radius) border border-(--tenant-primary)/20 bg-(--tenant-primary)/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-(--tenant-primary)"><Star className="h-3.5 w-3.5 fill-tenant-primary" /> Compromisso com a Excelência</div>
                                        <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.1]" style={{ fontFamily: 'var(--theme-font-heading)' }}>A <span className="text-tenant-primary italic">Expert</span> cuidando da sua autoestima.</h2>
                                        <div className="w-16 h-1 bg-tenant-primary/20 rounded-(--theme-btn-radius)" />
                                        <p className="text-xl text-slate-600 leading-relaxed font-light italic" style={elStyle('about', 'about-bio')}>&quot;{data.founder.bio || 'Apaixonado(a) por transformar vidas através da beleza e do cuidado. Cada cliente é único e merece uma experiência personalizada.'}&quot;</p>
                                        <div className="pt-8 border-t border-slate-100">
                                            <h3 className="text-3xl font-bold text-tenant-primary" style={{ fontFamily: 'var(--theme-font-heading)', ...elStyle('about', 'about-name') }}>{data.founder.name && data.founder.name !== 'Seu Nome' ? data.founder.name : data.name}</h3>
                                            <p className="text-sm text-slate-400 font-medium tracking-widest uppercase mt-1" style={elStyle('about', 'about-role')}>{data.founder.role || 'Fundador(a) & Especialista'}</p>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </section>
                    ),
                    'antes_depois': data.beforeAfter.length > 0 ? (
                        <section className="py-24 bg-(--theme-color-surface) overflow-hidden border-t border-slate-100 flex flex-col items-center">
                            <div className="mt-8 mb-4 w-full cursor-grab active:cursor-grabbing">
                                <DraggableCarousel items={data.beforeAfter} />
                            </div>
                        </section>
                    ) : null,
                    'faq': (
                         <section id="duvidas" className="py-24 bg-white border-t border-slate-100">
                            <div className="mx-auto max-w-3xl px-6">
                                <div className="mb-16 text-center">
                                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6" style={{ fontFamily: 'var(--theme-font-heading)' }}>
                                        Principais <span className="text-tenant-primary italic">Dúvidas</span>
                                    </h2>
                                </div>
                                 {isMounted && (
                                    <Accordion type="single" collapsible className="space-y-4">
                                        {data.faq.map((item: any, i: number) => (
                                            <AccordionItem key={i} value={`item-${i}`} className="border border-slate-200 bg-(--theme-color-surface) px-8 rounded-(--theme-card-radius) data-[state=open]:bg-white data-[state=open]:border-tenant-primary/20 transition-all">
                                                <AccordionTrigger className="font-bold text-slate-900 py-6 hover:no-underline">{item.question}</AccordionTrigger>
                                                <AccordionContent className="text-slate-600 pb-6">{item.answer}</AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                )}
                            </div>
                        </section>
                    ),
                    'contato': (
                        <section id="contato" className="py-24 bg-white border-t border-slate-100">
                            <div className="mx-auto max-w-7xl px-6">
                                <div className="grid lg:grid-cols-2 gap-16 items-start">
                                    <div className="space-y-12">
                                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900" style={{ fontFamily: 'var(--theme-font-heading)' }}>Onde estamos <span className="text-tenant-primary italic">Localizados</span></h2>
                                        <div className="space-y-8">
                                            <div className="flex gap-6 items-start">
                                                <div className="h-12 w-12 rounded-(--theme-btn-radius) bg-white border border-slate-200 flex items-center justify-center shrink-0"><MapPin className="h-6 w-6 text-tenant-primary" /></div>
                                                <div><h4 className="font-bold text-lg text-slate-900 mb-1">Endereço</h4><p className="text-slate-600">{data.contact.address}</p></div>
                                            </div>
                                            <div className="flex gap-6 items-start">
                                                <div className="h-12 w-12 rounded-(--theme-btn-radius) bg-white border border-slate-200 flex items-center justify-center shrink-0"><Phone className="h-6 w-6 text-tenant-primary" /></div>
                                                <div><h4 className="font-bold text-lg text-slate-900 mb-1">Contato Direto</h4><p className="text-slate-600">{data.contact.phone}</p></div>
                                            </div>
                                        </div>
                                    </div>
                                    {(() => {
                                        const mapUrl = data.contact.mapEmbedUrl || (data.contact.address ? `https://maps.google.com/maps?q=${encodeURIComponent(data.contact.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed` : null)
                                        return mapUrl && (
                                            <div className="relative aspect-video lg:aspect-square rounded-(--theme-card-radius) overflow-hidden border border-slate-200 shadow-(--theme-card-shadow)">
                                                <iframe src={mapUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" className="transition-all duration-500 hover:brightness-110"></iframe>
                                            </div>
                                        )
                                    })()}
                                </div>
                            </div>
                        </section>
                    ),
                    'depoimentos': null, // To be implemented later by specialized agents
                    'equipe': null,
                    'galeria': null,
                }

                // If no sections config exist, fallback to the traditional order
                const defaultOrder = ['hero', 'trust_badges', 'servicos', 'agendamento', 'sobre', 'antes_depois', 'faq', 'contato']
                const seq = data.sections && data.sections.length > 0 
                                ? [...data.sections].sort((a,b) => a.order - b.order)
                                : defaultOrder.map((type, i) => ({ type, enabled: true, pro: false, order: i }))

                return seq.map((sec, idx) => {
                    if (!sec.enabled) return null
                    if (sec.pro && data.plan !== 'premium' && data.plan !== 'profissional') return null
                    
                    return <React.Fragment key={`${sec.type}-${idx}`}>{elements[sec.type] || null}</React.Fragment>
                })
            })()}

            {/* Footer */}
            <footer className="py-16 bg-tenant-primary relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-white/10" />
                <div className="mx-auto max-w-7xl px-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
                        <div className="flex flex-col items-center md:items-start gap-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full overflow-hidden border border-white/30 shrink-0 relative bg-white/10">
                                    {data.avatarUrl ? (
                                        <Image src={data.avatarUrl} alt={data.name} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">{data.name.charAt(0)}</div>
                                    )}
                                </div>
                                <h3 className="font-bold text-white tracking-widest uppercase text-xs">{data.name}</h3>
                            </div>
                            <p className="text-white/60 text-[10px] tracking-widest uppercase font-medium text-center md:text-left">{data.surname}</p>
                        </div>
                        <div className="flex flex-col items-center gap-6">
                            <div className="flex items-center gap-6">
                                {data.contact.instagram && (
                                    <a href={data.contact.instagram} target="_blank" rel="noopener noreferrer"
                                        className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-tenant-primary transition-all duration-300 border border-white/20 group">
                                        <Instagram className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
                                    </a>
                                )}
                                {data.contact.whatsapp && (
                                    <a href={`https://wa.me/${data.contact.whatsapp}`} target="_blank" rel="noopener noreferrer"
                                        className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-tenant-primary transition-all duration-300 border border-white/20 group">
                                        <MessageCircle className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
                                    </a>
                                )}
                            </div>
                            {data.contact.instagram && <p className="text-white/40 text-[9px] tracking-[0.3em] uppercase font-bold">Acompanhe no Instagram</p>}
                        </div>
                        <div className="flex flex-col items-center md:items-end gap-3">
                            <span className="text-white/40 text-[10px] uppercase tracking-widest">© {new Date().getFullYear()} Todos os direitos reservados</span>
                            <Link href="/" className="group flex items-center gap-2">
                                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 group-hover:text-white transition-colors">Powered by</span>
                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/50 group-hover:text-white transition-colors">Agenda Online</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>

            <TenantWhatsapp DATA={data} primary={primary} />

            {isMounted && (
                <Sheet open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                    <SheetContent side="right" className="fixed inset-y-0 right-0 z-100 flex h-full w-full sm:max-w-xl flex-col bg-white border-l border-stone-100 overflow-y-auto p-0 shadow-2xl transition-all duration-500 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right">
                        <SheetHeader className="p-6 md:p-8 border-b border-stone-50 bg-stone-50/30">
                            <div className="flex items-center justify-between">
                                <div>
                                    <SheetTitle className="text-2xl md:text-3xl font-bold text-stone-900 tracking-tight" style={{ fontFamily: 'var(--theme-font-heading)' }}>
                                        Finalizar <span className="text-tenant-primary italic">Agendamento</span>
                                    </SheetTitle>
                                    <p className="text-stone-400 text-[10px] md:text-xs mt-1 uppercase tracking-widest font-bold">Reserva Exclusiva via Agenda Online</p>
                                </div>
                            </div>
                        </SheetHeader>
                        <div className="relative flex-1">
                            <SchedulingSection 
                                key={`drawer-${activeServiceId}`}
                                isModal={true}
                                tenantId={data.id || ""} 
                                whatsappNumber={data.contact.whatsapp} 
                                services={services}
                                initialServiceId={activeServiceId}
                            />
                        </div>
                    </SheetContent>
                </Sheet>
            )}

        </div>
    )
}
