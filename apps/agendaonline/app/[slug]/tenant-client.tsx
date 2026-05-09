"use client"

import Link from "next/link"
import Image from "next/image"
import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { 
    Activity, Award, MapPin, Menu, Phone, ShieldCheck, Star, 
    ArrowRight, MessageCircle, X, ChevronLeft, ChevronRight, Clock, Instagram, User, Check,
    Image as ImageIcon, ShieldCheck as Shield, Gem, Zap, Flag, Heart, CheckCircle2,
    Calendar,
    MessageSquare,
    Info,
    Users,
    Scale,
    Hash,
    Search
} from "lucide-react"

const PUBLIC_ICON_MAP: Record<string, any> = {
    ArrowRight,
    ChevronRight,
    Calendar,
    MessageSquare,
    Phone,
    Zap,
    Star,
    Info
}

import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

// Force-triggering a module factory rebuild by refactoring the main component.
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { SchedulingSection } from "@/components/scheduling-section"
import { DraggableCarousel } from "@/components/draggable-carousel"
import { TenantWhatsapp } from "@/components/tenant-whatsapp"
import type { TenantData } from "@/lib/tenant-types"
import { resolveSectionBackground, resolveElementStyle, elementStyleToCSS, generateResponsiveElementCSS, buildGoogleFontsUrl, getFontStack, hexToRgba } from "@/lib/style-utils"
import { getTheme, generateThemeCSS, getHeroImageForNiche } from "@/src/themes"
import { cn } from "@/lib/utils"
import { getPublicProcessStatusAction } from "@/lib/actions/appointments"
import { LEGAL_STATUSES } from "@/lib/utils/process-utils"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

// Helper to render simple markdown-like syntax from editor
function renderEditorText(text: string = "") {
    if (!text) return ""
    return text
        .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/__(.*?)__/g, '<u>$1</u>')
        .replace(/<lg>(.*?)<\/lg>/g, '<span class="text-[1.25em]">$1</span>')
        .replace(/<md>(.*?)<\/md>/g, '<span class="text-[1em]">$1</span>')
        .replace(/<sm>(.*?)<\/sm>/g, '<span class="text-[0.75em]">$1</span>')
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
    const [isConsultingProcess, setIsConsultingProcess] = useState(false)
    const [processCode, setProcessCode] = useState("")
    const [consultationResult, setConsultationResult] = useState<any>(null)
    const [consultationLoading, setConsultationLoading] = useState(false)
    const [consultationError, setConsultationError] = useState<string | null>(null)
    const [showInlineConsult, setShowInlineConsult] = useState(false)

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

    const handleConsultProcess = async () => {
        if (!processCode) return
        setConsultationLoading(true)
        setConsultationError(null)
        try {
            const res = await getPublicProcessStatusAction(processCode)
            if (res.success) {
                setConsultationResult(res.process)
            } else {
                setConsultationError(res.error || "Código incorreto ou não encontrado.")
            }
        } catch (e) {
            setConsultationError("Erro ao conectar ao servidor.")
        } finally {
            setConsultationLoading(false)
        }
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
            
            activeTheme.cards.borderRadius = editorTheme.designSystem.borderRadius === 'full' ? '20px' :
                                             editorTheme.designSystem.borderRadius === 'none' ? '0px' :
                                             editorTheme.designSystem.borderRadius === 'sm' ? '4px' :
                                             editorTheme.designSystem.borderRadius === 'md' ? '8px' : '12px'
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
            buttonPrimary: hero.buttonPrimary,
            buttonSecondary: hero.buttonSecondary,
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

    const heroDesktop = resolveHeroForSite('desktop') || {}
    const heroTablet = resolveHeroForSite('tablet') || {}
    const heroMobile = resolveHeroForSite('mobile') || {}

    // ─── Absolute Parity — Responsive Overrides Engine ───
    const generateHeroResponsiveCSS = () => {
        if (!heroMobile?.orientation || !heroTablet?.orientation || !heroDesktop?.orientation) return ""
        
        const getFlexAlign = (orientation: string) => orientation === 'center' ? 'center' : orientation === 'right' ? 'flex-end' : 'flex-start'
        const getTextAlign = (orientation: string) => orientation === 'center' ? 'center' : orientation === 'right' ? 'right' : 'left'
        const getJustify = (orientation: string) => orientation === 'center' ? 'center' : orientation === 'right' ? 'flex-end' : 'flex-start'
        const getMargin = (orientation: string) => orientation === 'center' ? '0 auto' : orientation === 'right' ? '0 0 0 auto' : '0 auto 0 0'

        const getBtnCSS = (btn: any, bp: 'mobile' | 'tablet' | 'desktop') => {
            const b = btn || {}
            let width = b.width === 'full' ? '100%' : (b.width === 'auto' || !b.width ? 'auto' : `${b.width}px`)
            
            // Parity with Editor: On mobile, buttons default to full width (100%) if not explicitly set to a fixed numeric width
            if (bp === 'mobile' && (b.width === 'auto' || !b.width)) {
                width = '100%'
            }

            return `
                width: ${width} !important;
                height: ${b.height ?? 48}px !important;
                padding: ${b.paddingY ?? 12}px ${b.paddingX ?? 24}px !important;
                font-size: ${b.fontSize ?? 12}px !important;
            `
        }

        return `
            /* Hero Layout Responsivity */
            .hero-layout-responsive {
                align-items: ${getFlexAlign(heroMobile.orientation)};
                text-align: ${getTextAlign(heroMobile.orientation)};
            }
            .hero-content-width { width: 100%; }
            .hero-mx-auto { margin: ${getMargin(heroMobile.orientation)}; }
            .hero-justify-res { 
                justify-content: ${getJustify(heroMobile.orientation)}; 
                align-items: ${getFlexAlign(heroMobile.orientation)};
            }
            
            /* Responsive Buttons */
            .hero-cta-primary-res { ${getBtnCSS(heroMobile.buttonPrimary, 'mobile')} }
            .hero-cta-secondary-res { ${getBtnCSS(heroMobile.buttonSecondary, 'mobile')} }

            @media (min-width: 640px) {
                .hero-layout-responsive {
                    align-items: ${getFlexAlign(heroTablet.orientation)};
                    text-align: ${getTextAlign(heroTablet.orientation)};
                }
                .hero-mx-auto { margin: ${getMargin(heroTablet.orientation)}; }
                .hero-justify-res { 
                    justify-content: ${getJustify(heroTablet.orientation)}; 
                    align-items: ${getFlexAlign(heroTablet.orientation)};
                }
                .hero-cta-primary-res { ${getBtnCSS(heroTablet.buttonPrimary, 'tablet')} }
                .hero-cta-secondary-res { ${getBtnCSS(heroTablet.buttonSecondary, 'tablet')} }
            }
            @media (min-width: 1024px) {
                .hero-layout-responsive {
                    align-items: ${getFlexAlign(heroDesktop.orientation)};
                    text-align: ${getTextAlign(heroDesktop.orientation)};
                }
                .hero-mx-auto { margin: ${getMargin(heroDesktop.orientation)}; }
                .hero-justify-res { 
                    justify-content: ${getJustify(heroDesktop.orientation)}; 
                    align-items: ${getFlexAlign(heroDesktop.orientation)};
                }
                .hero-content-width { 
                    max-width: ${heroDesktop.orientation === 'center' ? '100%' : '50%'};
                }
                .hero-cta-primary-res { ${getBtnCSS(heroDesktop.buttonPrimary, 'desktop')} }
                .hero-cta-secondary-res { ${getBtnCSS(heroDesktop.buttonSecondary, 'desktop')} }
            }

            /* Responsive Overlays & Vignettes */
            .hero-overlay-layer { 
                background-color: ${heroMobile.overlay?.color || '#000000'};
                opacity: ${(heroMobile.overlay?.opacity ?? 30) / 100};
                display: ${heroMobile.overlay?.enabled ? 'block' : 'none'};
            }
            .hero-vignette-layer {
                display: ${heroMobile.vignette?.enabled ? 'block' : 'none'};
                background: radial-gradient(circle, transparent ${100 - (heroMobile.vignette?.intensity ?? 40)}%, ${heroMobile.vignette?.color || '#000000'} 100%);
            }

            @media (min-width: 768px) {
                .hero-overlay-layer { 
                    background-color: ${heroTablet.overlay?.color || '#000000'};
                    opacity: ${(heroTablet.overlay?.opacity ?? 30) / 100};
                    display: ${heroTablet.overlay?.enabled ? 'block' : 'none'};
                }
                .hero-vignette-layer {
                    display: ${heroTablet.vignette?.enabled ? 'block' : 'none'};
                    background: radial-gradient(circle, transparent ${100 - (heroTablet.vignette?.intensity ?? 40)}%, ${heroTablet.vignette?.color || '#000000'} 100%);
                }
            }

            @media (min-width: 1024px) {
                .hero-overlay-layer { 
                    background-color: ${heroDesktop.overlay?.color || '#000000'};
                    opacity: ${(heroDesktop.overlay?.opacity ?? 30) / 100};
                    display: ${heroDesktop.overlay?.enabled ? 'block' : 'none'};
                }
                .hero-vignette-layer {
                    display: ${heroDesktop.vignette?.enabled ? 'block' : 'none'};
                    background: radial-gradient(circle, transparent ${100 - (heroDesktop.vignette?.intensity ?? 40)}%, ${heroDesktop.vignette?.color || '#000000'} 100%);
                }
            }
        `
    }

    const heroResponsiveCSS = generateHeroResponsiveCSS()

    // Element-level responsive styles
    const headlineCSS = generateResponsiveElementCSS(data, 'hero', 'hero-headline', '.hero-headline-res')
    const descriptionCSS = generateResponsiveElementCSS(data, 'hero', 'hero-description', '.hero-description-res')
    const badgeCSS = generateResponsiveElementCSS(data, 'hero', 'hero-badge', '.hero-badge-res')
    const ctaPrimaryCSS = generateResponsiveElementCSS(data, 'hero', 'hero-cta-primary', '.hero-cta-primary-res')
    const ctaSecondaryCSS = generateResponsiveElementCSS(data, 'hero', 'hero-cta-secondary', '.hero-cta-secondary-res')

    // Fallback: if resolution engine returns null, read directly from editorConfig
    const effectiveHero = heroDesktop || editorConfig?.hero || {}


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

    const beforeAfterConfig = editorConfig?.plugins?.beforeAfter || { 
        enabled: data.beforeAfter && data.beforeAfter.length > 0, 
        title: "Nossos *Resultados*",
        subtitle: "Confira as transformações reais de nossos clientes.",
        items: data.beforeAfter || [] 
    }

    const servicesConfig = editorConfig?.plugins?.services || {
        title: "Nossa *Expertise*",
        subtitle: "Procedimentos personalizados para valorizar a arquitetura do seu rosto e realçar a sua beleza natural.",
        items: services || [],
        categories: categories || []
    }

    const faqPluginDb = editorConfig?.plugins?.faq || {}
    const faqConfig = {
        enabled: faqPluginDb.enabled !== false,
        title: faqPluginDb.title || "Perguntas *Frequentes*",
        subtitle: faqPluginDb.subtitle || "Tire suas dúvidas sobre nossos serviços.",
        items: faqPluginDb.items || data.faq || []
    }

    const schedulingConfig = editorConfig?.plugins?.agendamento || {}

    const practiceAreasConfig = editorConfig?.plugins?.practiceAreas || { enabled: false, title: "", subtitle: "", items: [] }
    const teamConfig = editorConfig?.plugins?.team || { enabled: false, title: "", subtitle: "", members: [] }

    const headerConfig = editorConfig?.header || {}
    
    // ─── Dynamic Navigation Logic ───
    // 1. Get all active sections and apply overrides from menuItems
    const activeSections = (editorConfig?.sectionOrder || [])
        .filter(id => id !== 'header' && id !== 'hero' && id !== 'footer' && id !== 'trust')
        .map(id => {
            const customItem = (headerConfig.menuItems || []).find((m: any) => m.id === id)
            return {
                id,
                label: customItem?.label || (id === 'team' && data.name?.includes('Adv') ? 'Equipe Jurídica' : SECTION_LABELS[id] || id),
                href: customItem?.href || `#${id}`
            }
        })

    // 2. Get any manual/custom items added via the editor (that aren't linked to sections)
    const manualItems = (headerConfig.menuItems || [])
        .filter((m: any) => !(editorConfig?.sectionOrder || []).includes(m.id))

    const navigationSections = [...activeSections, ...manualItems]

    // ─── Header Parity Logic ───

    const headerGradient = headerConfig.gradient || {}
    const headerGradientStyle = headerConfig.menuStyle === 'gradient' && headerGradient.stops?.length > 0
        ? `linear-gradient(${headerGradient.angle ?? 180}deg, ${headerGradient.stops
            .map((stop: any) => `${hexToRgba(stop.color, stop.opacity ?? 100)} ${stop.position}%`)
            .join(", ")})`
        : undefined

    const isFixed = headerConfig.behavior === 'fixed' || headerConfig.sticky === true
    const scrolledEnabled = headerConfig.scrolled?.enabled !== false
    const isHeaderScrolled = isScrolled && isFixed && scrolledEnabled
    
    const headerBgStyle = isHeaderScrolled
        ? { backgroundColor: headerConfig.scrolled?.backgroundColor || themePrimary }
        : headerConfig.menuStyle === 'solid'
            ? { backgroundColor: headerConfig.backgroundColor || themeBg }
            : headerConfig.menuStyle === 'gradient'
                ? { background: headerGradientStyle, opacity: (headerGradient.opacity ?? 100) / 100 }
                : { backgroundColor: 'transparent' }

    const headerColors = isHeaderScrolled 
        ? {
            logo: headerConfig.scrolled?.colors?.logo || '#ffffff',
            menu: headerConfig.scrolled?.colors?.menu || '#ffffff',
            cta: headerConfig.scrolled?.colors?.cta || '#ffffff',
            hamburger: headerConfig.scrolled?.colors?.hamburger || '#ffffff',
        }
        : {
            logo: themeText,
            menu: themeText,
            cta: themeText,
            hamburger: themeText
        }

    // Hero-level gradient (device-aware), fallback to theme gradient
    const activeDesktopGradient = heroDesktop?.gradient?.enabled ? heroDesktop.gradient : editorTheme?.gradient
    const themeGradientStyle = activeDesktopGradient?.enabled
        ? `linear-gradient(${activeDesktopGradient.angle}deg, ${activeDesktopGradient.stops
            .map((stop: any) => `${hexToRgba(stop.color, stop.opacity ?? 100)} ${stop.position}%`)
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

                /* Responsive Hero Overrides */
                ${heroResponsiveCSS}
                ${headlineCSS}
                ${descriptionCSS}
                ${badgeCSS}
                ${ctaPrimaryCSS}
                ${ctaSecondaryCSS}
            `}} />

            {/* Nav */}
            <nav 
                className={cn(
                    "left-0 right-0 z-50 transition-all duration-300",
                    isFixed ? 'fixed' : 'relative',
                    isHeaderScrolled ? 'backdrop-blur-lg border-b border-white/5 shadow-xl' : ''
                )} 
                style={{ top: 0, height: isHeaderScrolled ? (headerConfig.scrolled?.height || 64) : (headerConfig.height || 80) }}
            >
                {/* Background Layer */}
                <div 
                    className="absolute inset-0 -z-10 transition-all duration-300"
                    style={headerBgStyle}
                />
                <div className={`mx-auto flex max-w-7xl items-center justify-between px-6 h-full transition-all duration-300`}>
                    <Link href="#" className="flex items-center group">
                        {data.logoUrl ? (
                            <img src={data.logoUrl} alt={data.name}
                                className={`w-auto object-contain transition-all duration-300 group-hover:scale-105`} 
                                style={{ height: isHeaderScrolled ? ((headerConfig.logoHeight || 32) * 0.8) : (headerConfig.logoHeight || 32) }}
                            />
                        ) : (
                            <span className={`font-bold transition-all duration-300`} style={{ fontFamily: 'var(--theme-font-heading)', color: headerColors.logo, fontSize: isHeaderScrolled ? '1.25rem' : '1.5rem' }}>{data.name}</span>
                        )}
                    </Link>
                    <div className="hidden items-center lg:flex" style={{ gap: `${headerConfig.menuSpacing || 32}px` }}>
                        {navigationSections.map((item: any) => (
                            <Link key={item.id} href={item.href || `#${item.id}`}
                                className="font-bold transition-colors" 
                                style={{ 
                                    color: headerColors.menu,
                                    fontSize: `${headerConfig.menuFontSize || 14}px`
                                }}
                            >
                                {item.label}
                            </Link>
                        ))}
                        
                        <Link href="/login" className="transition-all hover:opacity-80">
                            <Button 
                                variant="ghost" 
                                className="font-bold text-[11px] uppercase tracking-widest h-10 px-4 rounded-xl"
                                style={{ color: headerColors.menu }}
                            >
                                <User className="w-4 h-4 mr-2" />
                                Login
                            </Button>
                        </Link>

                        {headerConfig.showCta !== false && (
                            <Link href={`https://wa.me/${data.contact.whatsapp}?text=Ol%C3%A1%20${encodeURIComponent(data.name)}%2C%20vi%20seu%20site%20e%20gostaria%20de%20agendar%20um%20hor%C3%A1rio.`} target="_blank">
                                <Button className="h-[50px] px-8 hover:opacity-90 font-bold rounded-(--theme-btn-radius) shadow-sm border-none transition-all duration-300 text-[15px]" style={{ backgroundColor: themePrimary, color: headerColors.cta }}>{headerConfig.ctaText || "Agendar Agora"}</Button>
                            </Link>
                        )}
                    </div>
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" className="transition-all p-0 duration-300 hover:bg-white/10 hover:backdrop-blur-md rounded-xl w-14 h-14 flex items-center justify-center active:scale-95" style={{ color: headerColors.hamburger }}>
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
                                    {navigationSections.map((item: any) => (
                                        <SheetClose asChild key={item.id}>
                                            <Link href={item.href || `#${item.id}`}
                                                className="group flex items-center justify-between text-[17px] font-medium text-slate-600 hover:text-tenant-primary hover:bg-white hover:shadow-sm px-5 py-4 rounded-2xl transition-all duration-300">
                                                {item.label}
                                                <ArrowRight className="h-4 w-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-tenant-primary" />
                                            </Link>
                                        </SheetClose>
                                    ))}
                                    
                                    <div className="h-px bg-slate-100 my-2 mx-4" />
                                    
                                    <SheetClose asChild>
                                        <Link href="/login"
                                            className="group flex items-center justify-between text-[17px] font-bold text-slate-900 hover:text-tenant-primary hover:bg-white hover:shadow-sm px-5 py-4 rounded-2xl transition-all duration-300">
                                            <div className="flex items-center gap-3">
                                                <User className="h-5 w-5 text-slate-400 group-hover:text-tenant-primary transition-colors" />
                                                Login
                                            </div>
                                            <ArrowRight className="h-4 w-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-tenant-primary" />
                                        </Link>
                                    </SheetClose>
                                </div>
                                <div className="mt-auto p-6 bg-white border-t border-slate-100">
                                    <Link href={`https://wa.me/${data.contact.whatsapp}`}>
                                        <Button className="w-full h-14 bg-tenant-primary hover:bg-tenant-hover text-white font-bold rounded-(--theme-btn-radius) text-[11px] tracking-widest uppercase shadow-(--theme-card-shadow) transition-all active:scale-95 hover:scale-[1.02] flex items-center justify-center gap-2">
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
                const hero = effectiveHero || {}
                
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
                                "relative overflow-hidden flex flex-col justify-center min-h-0",
                                (effectiveHero?.autoHeight !== false) ? "min-h-[calc(100vh-60px)] lg:min-h-[calc(100vh-60px)] flex-1" : "shrink-0"
                            )}
                            style={{ 
                                backgroundColor: themeBg,
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
                                        transform: 'scale(var(--hero-scale-mob))',
                                        backgroundSize: 'cover'
                                    }} />
                                </div>
                            )}

                            {/* LAYER 2 — Overlay Color (matching editor) */}
                            <div className="absolute inset-0 z-[1] hero-overlay-layer" />
                            
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
                            <div className="absolute inset-0 z-[3] hero-vignette-layer" />

                            {/* LAYER 5 — Content */}
                            <div className={cn(
                                "relative z-40 mx-auto w-full max-w-7xl px-6 pt-24 pb-12 flex flex-col pointer-events-none hero-layout-responsive",
                            )}>
                                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} 
                                    className={cn(
                                        "flex flex-col w-full pointer-events-auto transition-all duration-500",
                                        "hero-layout-responsive hero-content-width"
                                    )}
                                >
                                    {heroBadge && (
                                        <div 
                                            className={cn("hero-badge-res inline-flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full mb-5 md:mb-6 border border-white/10 transition-transform hover:scale-105")}
                                            style={{ 
                                                borderRadius: 'var(--theme-btn-radius)',
                                                backgroundColor: `${themePrimary}4d`,
                                                color: themeText,
                                            }}
                                        >
                                            <span className="text-[10px] md:text-xs font-medium uppercase tracking-widest" dangerouslySetInnerHTML={{ __html: renderEditorText(heroBadge) }} />
                                        </div>
                                    )}
                                    <h1 
                                        className={cn("hero-headline-res text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-5 md:mb-6")} 
                                        style={{ fontFamily: 'var(--theme-font-heading)', color: themeText }}
                                        dangerouslySetInnerHTML={{ __html: renderEditorText(heroTitle) }}
                                    />
                                    {(!data.config && data.heroHighlight) && (
                                        <h1 className="hero-headline-res text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.1] mb-5 sm:mb-6 tracking-tight" style={{ fontFamily: 'var(--theme-font-heading)', color: themeText }}>
                                            <span className="hero-highlight-res font-light italic" style={{ color: 'var(--tenant-accent)', textShadow: `0 0 15px #eec58466` }}>{data.heroHighlight}</span>.
                                        </h1>
                                    )}
                                    <p className={cn("hero-desc-res text-sm sm:text-base lg:text-lg mb-6 sm:mb-10 opacity-90 leading-relaxed font-medium hero-mx-auto", heroMobile?.orientation === "center" ? "max-w-2xl" : "max-w-xl")} style={{ color: themeText }}>
                                        <span dangerouslySetInnerHTML={{ __html: renderEditorText(heroDesc) }} />
                                    </p>
                                    <div className={cn("hero-ctas-container w-full flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mt-2 hero-justify-res")}>
                                        {/* Primary Button */}
                                        {(() => {
                                            const btn = effectiveHero?.buttonPrimary || { text: heroCtaPrimary, link: "#agendamento" }
                                            const IconLeft = btn.iconLeft ? (PUBLIC_ICON_MAP[btn.iconLeft] || null) : null
                                            const IconRight = btn.iconRight ? (PUBLIC_ICON_MAP[btn.iconRight] || null) : null
                                            
                                            const btnStyle: React.CSSProperties = {
                                                borderRadius: 'var(--theme-btn-radius)',
                                                color: btn.textColor || themeText,
                                                ...elStyle('hero', 'hero-cta-primary'), // Still support legacy if needed
                                                zIndex: 1,
                                            }

                                            if (btn.gradient?.enabled) {
                                                const stops = btn.gradient.stops.map(s => `${hexToRgba(s.color, s.opacity ?? 100)} ${s.position}%`).join(', ')
                                                btnStyle.background = `linear-gradient(${btn.gradient.angle}deg, ${stops})`
                                                btnStyle.opacity = (btn.gradient.opacity ?? 100) / 100
                                            } else {
                                                btnStyle.backgroundColor = btn.backgroundColor || themePrimary
                                            }

                                            const content = (
                                                <>
                                                    {IconLeft && <IconLeft className="shrink-0" style={{ width: btn.iconSize || 16, height: btn.iconSize || 16, strokeWidth: btn.iconWeight || 2, color: btn.iconColor || 'inherit' }} />}
                                                    {btn.text}
                                                    {IconRight && <IconRight className="shrink-0" style={{ width: btn.iconSize || 16, height: btn.iconSize || 16, strokeWidth: btn.iconWeight || 2, color: btn.iconColor || 'inherit' }} />}
                                                </>
                                            )

                                            if (btn.link === "#agendamento" || btn.link === "#agenda") {
                                                return (
                                                    <Button 
                                                        onClick={() => handleOpenBooking()}
                                                        className={cn(
                                                            "hero-cta-primary-res font-bold transition-transform hover:scale-105 active:scale-95 shadow-xl h-14 border-none flex items-center justify-center gap-2 uppercase tracking-widest",
                                                            !btn.fontSize && "text-xs md:text-sm lg:text-base"
                                                        )}
                                                        style={btnStyle}
                                                    >
                                                        {content}
                                                    </Button>
                                                )
                                            }

                                            return (
                                                <Link href={btn.link || "#"} className="w-full sm:w-auto flex">
                                                    <Button 
                                                        className={cn(
                                                            "hero-cta-primary-res font-bold transition-transform hover:scale-105 active:scale-95 shadow-xl h-14 border-none flex items-center justify-center gap-2 uppercase tracking-widest",
                                                            !btn.fontSize && "text-xs sm:text-sm lg:text-base"
                                                        )}
                                                        style={btnStyle}
                                                    >
                                                        {content}
                                                    </Button>
                                                </Link>
                                            )
                                        })()}

                                        {/* Secondary Button */}
                                        {(() => {
                                            const btn = effectiveHero?.buttonSecondary || { text: heroCtaSecondary, link: "#servicos", outline: true }
                                            const IconLeft = btn.iconLeft ? (PUBLIC_ICON_MAP[btn.iconLeft] || null) : null
                                            const IconRight = btn.iconRight ? (PUBLIC_ICON_MAP[btn.iconRight] || null) : null
                                            
                                            const btnStyle: React.CSSProperties = {
                                                borderRadius: 'var(--theme-btn-radius)',
                                                color: btn.textColor || themeText,
                                                border: btn.outline ? `2px solid ${btn.textColor || themeText}` : undefined,
                                                ...elStyle('hero', 'hero-cta-secondary')
                                            }

                                            if (btn.gradient?.enabled) {
                                                const stops = btn.gradient.stops.map(s => `${hexToRgba(s.color, s.opacity ?? 100)} ${s.position}%`).join(', ')
                                                btnStyle.background = `linear-gradient(${btn.gradient.angle}deg, ${stops})`
                                                btnStyle.opacity = (btn.gradient.opacity ?? 100) / 100
                                            } else {
                                                btnStyle.backgroundColor = btn.backgroundColor || (btn.outline ? 'transparent' : themeSecondary)
                                            }

                                            return (
                                                <Link href={btn.link || "#"} className="w-full sm:w-auto flex">
                                                    <Button 
                                                        variant={btn.outline ? "outline" : "default"}
                                                        className={cn(
                                                            "hero-cta-secondary-res font-bold transition-transform hover:scale-105 active:scale-95 h-14 flex items-center justify-center gap-2 uppercase tracking-widest",
                                                            !btn.fontSize && "text-xs sm:text-sm lg:text-base"
                                                        )}
                                                        style={btnStyle}
                                                    >
                                                        {IconLeft && <IconLeft className="shrink-0" style={{ width: btn.iconSize || 16, height: btn.iconSize || 16, strokeWidth: btn.iconWeight || 2, color: btn.iconColor || 'inherit' }} />}
                                                        {btn.text}
                                                        {IconRight && <IconRight className="shrink-0" style={{ width: btn.iconSize || 16, height: btn.iconSize || 16, strokeWidth: btn.iconWeight || 2, color: btn.iconColor || 'inherit' }} />}
                                                    </Button>
                                                </Link>
                                            )
                                        })()}

                                        {/* Legal Consultation UI */}
                                        {(data.businessTypeId === 'advocacia' || data.segmento === 'advocacia' || data.name?.toLowerCase().includes('advog') || editorConfig?.plugins?.practiceAreas?.enabled) && (
                                            <div className="w-full sm:w-auto flex">
                                                <AnimatePresence mode="wait">
                                                    {consultationResult ? (
                                                        <motion.div
                                                            key="inline-result"
                                                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                            className="flex flex-col gap-4 bg-white/10 backdrop-blur-2xl p-5 rounded-[2rem] border border-white/20 shadow-2xl min-w-[280px]"
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex flex-col">
                                                                    <span className="text-[9px] font-black text-tenant-primary uppercase tracking-[0.2em] mb-0.5">Status do Processo</span>
                                                                    <h4 className="text-white font-black text-base tracking-tight">Olá, {consultationResult.customerName.split(' ')[0]}</h4>
                                                                </div>
                                                                <button 
                                                                    onClick={() => setConsultationResult(null)} 
                                                                    className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                                                                >
                                                                    <X size={14}/>
                                                                </button>
                                                            </div>
                                                            
                                                            <div className="flex items-center gap-4 bg-black/20 p-3 rounded-2xl border border-white/5">
                                                                <div className="h-10 w-10 rounded-xl bg-tenant-primary flex items-center justify-center text-white shadow-lg shadow-tenant-primary/20 shrink-0">
                                                                    <Clock size={18} className="animate-pulse" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <p className="text-[11px] text-white font-bold leading-tight">
                                                                        {LEGAL_STATUSES.find(s => s.id === consultationResult.status)?.label || "Em andamento"}
                                                                    </p>
                                                                    <p className="text-[9px] text-white/40 uppercase tracking-widest mt-1 font-black">Ref: {processCode}</p>
                                                                </div>
                                                            </div>
                                                            
                                                            <Button 
                                                                variant="ghost" 
                                                                size="sm"
                                                                onClick={() => {
                                                                    if (window.innerWidth < 768) {
                                                                        setIsConsultingProcess(true)
                                                                    } else {
                                                                        setShowInlineConsult(true)
                                                                        setConsultationResult(null)
                                                                    }
                                                                }}
                                                                className="h-8 text-[9px] text-white/30 hover:text-white uppercase tracking-widest font-black"
                                                            >
                                                                Nova Consulta
                                                            </Button>
                                                        </motion.div>
                                                    ) : !showInlineConsult ? (
                                                        <motion.div
                                                            key="button"
                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.9 }}
                                                            className="w-full"
                                                        >
                                                            <Button 
                                                                onClick={() => {
                                                                    if (window.innerWidth < 768) {
                                                                        setIsConsultingProcess(true)
                                                                        setConsultationResult(null)
                                                                        setConsultationError(null)
                                                                    } else {
                                                                        setShowInlineConsult(true)
                                                                        setConsultationResult(null)
                                                                        setConsultationError(null)
                                                                    }
                                                                }}
                                                                className="w-full hero-cta-secondary-res font-bold transition-transform hover:scale-105 active:scale-95 h-14 flex items-center justify-center gap-2 uppercase tracking-widest border-2 border-white/20 bg-white/5 backdrop-blur-md text-white shadow-xl"
                                                                style={{ borderRadius: 'var(--theme-btn-radius)' }}
                                                            >
                                                                <Scale className="w-4 h-4" /> Consultar processo
                                                            </Button>
                                                        </motion.div>
                                                    ) : (
                                                        <motion.div
                                                            key="inline-input"
                                                            initial={{ opacity: 0, x: 20, width: 0 }}
                                                            animate={{ opacity: 1, x: 0, width: 'auto' }}
                                                            exit={{ opacity: 0, x: 20, width: 0 }}
                                                            className="flex items-center gap-2 bg-white/10 backdrop-blur-xl p-1 rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
                                                            style={{ borderRadius: 'var(--theme-btn-radius)' }}
                                                        >
                                                            <div className="relative flex-1 min-w-[180px]">
                                                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                                                                <input 
                                                                    autoFocus
                                                                    value={processCode}
                                                                    onChange={e => setProcessCode(e.target.value.toUpperCase())}
                                                                    onKeyDown={e => e.key === 'Enter' && handleConsultProcess()}
                                                                    placeholder="CÓDIGO"
                                                                    className="w-full bg-transparent border-none text-white text-sm font-bold placeholder:text-white/30 focus:ring-0 pl-9 pr-3 h-12"
                                                                />
                                                            </div>
                                                            <Button 
                                                                size="sm"
                                                                onClick={handleConsultProcess}
                                                                disabled={consultationLoading || !processCode}
                                                                className="h-10 px-4 bg-white text-stone-900 hover:bg-stone-100 rounded-xl font-bold uppercase tracking-widest text-[10px] shrink-0"
                                                            >
                                                                {consultationLoading ? <Loader2 className="animate-spin h-3 w-3" /> : <Search className="h-3 w-3" />}
                                                            </Button>
                                                            <button 
                                                                onClick={() => setShowInlineConsult(false)}
                                                                className="p-2 text-white/40 hover:text-white transition-colors"
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        </section>
                    ),
                    'trust': (() => {
                        const trustConfig = editorConfig?.plugins?.trust || {}
                        const trustSpeed = trustConfig.speed || 25
                        const trustAutoplay = trustConfig.autoplay !== false
                        const trustBg = trustConfig.backgroundColor || "#0f172a"
                        const TRUST_ICON_MAP: Record<string, any> = { Check: CheckCircle2, Award, Star, Shield, ShieldCheck, Gem, Zap, Flag, Heart }
                        return (
                            <div id="trust" className="py-6 overflow-hidden border-y border-white/5 relative" style={{ backgroundColor: trustBg }}>
                                <style dangerouslySetInnerHTML={{ __html: `
                                    @keyframes public-marquee {
                                        0% { transform: translateX(0); }
                                        100% { transform: translateX(-33.333%); }
                                    }
                                `}} />
                                <div
                                    className="flex items-center gap-12 whitespace-nowrap px-6 w-max"
                                    style={{
                                        animationName: 'public-marquee',
                                        animationDuration: `${trustSpeed}s`,
                                        animationTimingFunction: 'linear',
                                        animationIterationCount: 'infinite',
                                        animationPlayState: trustAutoplay ? 'running' : 'paused',
                                    }}
                                >
                                    {[...data.trustBadges, ...data.trustBadges, ...data.trustBadges].map((badge, i) => {
                                        const badgeObj = typeof badge === 'string' ? { text: badge, icon: 'ShieldCheck' } : badge as any
                                        const BadgeIcon = TRUST_ICON_MAP[badgeObj.icon || 'ShieldCheck'] || ShieldCheck
                                        return (
                                            <div key={i} className="flex items-center gap-3 shrink-0">
                                                <BadgeIcon className="h-5 w-5 text-tenant-primary" />
                                                <span className="text-white font-bold uppercase tracking-[0.2em] text-[10px]">{badgeObj.text}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })(),
                    'services': (
                        <section id="services" className="py-24 bg-white">
                            <div className="mx-auto max-w-7xl px-6">
                                <div className="mb-16 text-center max-w-3xl mx-auto">
                                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6" style={{ fontFamily: 'var(--theme-font-heading)' }}
                                        dangerouslySetInnerHTML={{ __html: renderEditorText(servicesConfig.title).replace(/<em>(.*?)<\/em>/g, '<span class="text-tenant-primary italic">$1</span>') }}
                                    />
                                    <p className="text-lg text-slate-600">{servicesConfig.subtitle}</p>
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
                                                                        <Link href={`/${data.slug}/servico/${service.slug}`} className="flex-1 block">
                                                                            <button className="w-full flex items-center justify-center bg-white text-tenant-primary border border-tenant-primary hover:bg-tenant-primary hover:text-white font-bold rounded-(--theme-btn-radius) transition-all shadow-sm text-[15px]">Conhecer</button>
                                                                        </Link>
                                                                    )}
                                                                    <button 
                                                                        onClick={() => handleOpenBooking(service.id)} 
                                                                        className="w-full flex items-center justify-center bg-tenant-primary text-white border border-transparent hover:bg-white hover:text-tenant-primary! hover:border-tenant-primary! font-bold rounded-(--theme-btn-radius) h-13 transition-all shadow-md group-hover:shadow-(--theme-card-shadow) text-[15px]"
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
                        <div id="agendamento">
                            <SchedulingSection 
                                tenantId={data.id || ""} 
                                whatsappNumber={data.contact.whatsapp} 
                                services={services}
                                businessHours={data.config?.businessHours}
                                config={schedulingConfig}
                            />
                        </div>
                    ),
                    'about': (() => {
                        const aboutConfig = editorConfig?.plugins?.about || {}
                        const founder = aboutConfig.founder || data.founder || {}
                        const badge = aboutConfig.badge || "Compromisso com a Excelência"
                        const title = aboutConfig.title || "A *Expert* cuidando da sua autoestima."
                        const bio = aboutConfig.bio || founder.bio || 'Apaixonado(a) por transformar vidas através da beleza e do cuidado. Cada cliente é único e merece uma experiência personalizada.'
                        const name = founder.name && founder.name !== 'Seu Nome' ? founder.name : data.name
                        const role = founder.role || 'Fundador(a) & Especialista'
                        const imageUrl = founder.imageUrl || data.founder.imageUrl

                        return (
                            <section id="about" className="relative py-24 lg:py-32 bg-white overflow-hidden">
                                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,var(--tenant-primary)_0%,transparent_40%)] opacity-[0.03]" />
                                <div className="mx-auto max-w-7xl px-6 relative z-10">
                                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                                        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative pb-10">
                                            <div className="absolute -inset-4 lg:-inset-8 bg-tenant-primary/10 rounded-(--theme-card-radius) blur-3xl opacity-60" />
                                            <div className="relative aspect-4/5 max-w-md mx-auto rounded-(--theme-card-radius) bg-(--theme-color-surface) overflow-hidden shadow-(--theme-card-shadow) border border-slate-100 group">
                                                {imageUrl ? (
                                                    <Image src={imageUrl} alt={name} fill className="object-cover object-top transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center transition-transform duration-700 group-hover:scale-105 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
                                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/40 rounded-full blur-2xl"></div>
                                                        <div className="relative z-10 w-40 h-40 rounded-full bg-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white flex items-center justify-center backdrop-blur-sm"><User className="w-20 h-20 text-slate-400" strokeWidth={1.5} /></div>
                                                    </div>
                                                )}
                                                <div className="absolute bottom-6 left-6 right-6 p-5 bg-white/70 backdrop-blur-xl rounded-(--theme-card-radius) border border-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.05)] transform transition-transform duration-500 group-hover:-translate-y-2">
                                                    <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-tenant-primary mb-1">{role}</p>
                                                    <h4 className="font-bold text-slate-900 text-lg">{name}</h4>
                                                </div>
                                            </div>
                                        </motion.div>
                                        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="space-y-8">
                                            <div className="inline-flex items-center gap-2 rounded-(--theme-btn-radius) border border-(--tenant-primary)/20 bg-(--tenant-primary)/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-(--tenant-primary)"><Star className="h-3.5 w-3.5 fill-tenant-primary" /> {badge}</div>
                                            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.1]" style={{ fontFamily: 'var(--theme-font-heading)' }} dangerouslySetInnerHTML={{ __html: renderEditorText(title).replace(/<em>(.*?)<\/em>/g, '<span class="text-tenant-primary italic">$1</span>') }} />
                                            <div className="w-16 h-1 bg-tenant-primary/20 rounded-(--theme-btn-radius)" />
                                            <p className="text-xl text-slate-600 leading-relaxed font-light italic" style={elStyle('about', 'about-bio')}>&quot;{bio}&quot;</p>
                                            <div className="pt-8 border-t border-slate-100">
                                                <h3 className="text-3xl font-bold text-tenant-primary" style={{ fontFamily: 'var(--theme-font-heading)', ...elStyle('about', 'about-name') }}>{name}</h3>
                                                <p className="text-sm text-slate-400 font-medium tracking-widest uppercase mt-1" style={elStyle('about', 'about-role')}>{role}</p>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            </section>
                        )
                    })(),
                    'beforeAfter': (beforeAfterConfig.enabled && beforeAfterConfig.items?.length > 0) ? (
                        <section id="beforeAfter" className="py-24 bg-(--theme-color-surface) overflow-hidden border-t border-slate-100 flex flex-col items-center">
                            <div className="mx-auto max-w-7xl px-6 w-full">
                                <div className="mb-16 text-center max-w-3xl mx-auto">
                                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6" style={{ fontFamily: 'var(--theme-font-heading)' }} 
                                        dangerouslySetInnerHTML={{ __html: renderEditorText(beforeAfterConfig.title).replace(/<em>(.*?)<\/em>/g, '<span class="text-tenant-primary italic">$1</span>') }} 
                                    />
                                    <p className="text-lg text-slate-600">{beforeAfterConfig.subtitle}</p>
                                </div>
                                <div className="mt-8 mb-4 w-full cursor-grab active:cursor-grabbing">
                                    <DraggableCarousel items={beforeAfterConfig.items} />
                                </div>
                            </div>
                        </section>
                    ) : null,
                    'faq': faqConfig.enabled ? (
                         <section id="faq" className="py-24 bg-white border-t border-slate-100">
                            <div className="mx-auto max-w-3xl px-6">
                                <div className="mb-16 text-center">
                                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6" style={{ fontFamily: 'var(--theme-font-heading)' }}
                                        dangerouslySetInnerHTML={{ __html: renderEditorText(faqConfig.title).replace(/<em>(.*?)<\/em>/g, '<span class="text-tenant-primary italic">$1</span>') }}
                                    />
                                    {faqConfig.subtitle && <p className="text-lg text-slate-600">{faqConfig.subtitle}</p>}
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
                    ) : null,
                    'contact': (
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
                    'practiceAreas': practiceAreasConfig.enabled && practiceAreasConfig.items?.length > 0 ? (
                        <section id="practiceAreas" className="py-20 px-6 bg-slate-50">
                            <div className="max-w-6xl mx-auto">
                                <div className="mb-16 text-center max-w-3xl mx-auto">
                                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6" style={{ fontFamily: 'var(--theme-font-heading)' }}
                                        dangerouslySetInnerHTML={{ __html: renderEditorText(practiceAreasConfig.title).replace(/<em>(.*?)<\/em>/g, '<span class="text-tenant-primary italic">$1</span>') }}
                                    />
                                    <p className="text-lg text-slate-600">{practiceAreasConfig.subtitle}</p>
                                </div>
                                <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                    {practiceAreasConfig.items.map((item: any, i: number) => (
                                        <div key={i} className="group bg-white rounded-(--theme-card-radius) border border-slate-200 hover:border-tenant-primary/30 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
                                            {item.image && item.image.trim() !== "" ? (
                                                <div className="h-48 w-full overflow-hidden bg-slate-100 relative">
                                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                                    <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 to-transparent" />
                                                    <div className="absolute bottom-4 left-6 text-white font-bold text-lg tracking-wide">{item.title}</div>
                                                </div>
                                            ) : (
                                                <div className="h-3 bg-tenant-primary" />
                                            )}
                                            <div className="p-8 flex flex-col flex-1">
                                                {(!item.image || item.image.trim() === "") && (
                                                    <h4 className="text-xl font-bold text-slate-900 mb-4" style={{ fontFamily: "var(--theme-font-heading, var(--font-serif, serif))" }}>{item.title}</h4>
                                                )}
                                                <p className="text-slate-600 text-sm leading-relaxed mb-6">{item.description}</p>
                                                <div className="mt-auto">
                                                    <button className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 group/btn transition-colors text-tenant-primary">
                                                        Saiba Mais <span className="transform translate-x-0 group-hover/btn:translate-x-1 transition-transform">→</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    ) : null,
                    'team': teamConfig.enabled && (teamConfig.items?.length > 0 || teamConfig.members?.length > 0) ? (
                        <section id="team" className="py-20 px-6 bg-white">
                            <div className="max-w-6xl mx-auto">
                                <div className="mb-16 text-center max-w-3xl mx-auto">
                                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6" style={{ fontFamily: 'var(--theme-font-heading)' }}
                                        dangerouslySetInnerHTML={{ __html: renderEditorText(teamConfig.title).replace(/<em>(.*?)<\/em>/g, '<span class="text-tenant-primary italic">$1</span>') }}
                                    />
                                    <p className="text-lg text-slate-600">{teamConfig.subtitle}</p>
                                </div>
                                <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                                    {(teamConfig.items || teamConfig.members || []).map((member: any, i: number) => (
                                        <div key={i} className="flex flex-col items-center text-center group">
                                            <div className="w-48 h-48 rounded-full overflow-hidden mb-6 border-4 border-slate-50 transition-transform duration-500 group-hover:scale-105 group-hover:shadow-xl bg-slate-100 flex items-center justify-center">
                                                {member.image ? (
                                                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Users className="w-12 h-12 text-slate-300" />
                                                )}
                                            </div>
                                            <h4 className="text-lg font-bold text-slate-900 mb-1">{member.name}</h4>
                                            <p className="text-sm font-semibold mb-3 tracking-wide text-tenant-primary">{member.role}</p>
                                            <p className="text-sm text-slate-500 line-clamp-3">{member.bio}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    ) : null,
                    'equipe': null,
                    'galeria': null,
                }

                // Make public site respect the Editor's section order completely!
                const defaultOrder = ['hero', 'trust', 'services', 'agendamento', 'about', 'beforeAfter', 'faq', 'contact']
                let editorSections = editorConfig?.sectionOrder || defaultOrder

                // Retroactive fix: ensure agendamento is present for older tenants that haven't saved yet
                if (!editorSections.includes('agendamento')) {
                    editorSections = [...editorSections]
                    const svcIdx = editorSections.indexOf('services')
                    if (svcIdx !== -1) {
                        editorSections.splice(svcIdx + 1, 0, 'agendamento')
                    } else {
                        editorSections.push('agendamento')
                    }
                }

                return editorSections.map((type: string, idx: number) => {
                    // Skip header and footer as they are rendered explicitly
                    if (type === 'header' || type === 'footer') return null
                    
                    return <React.Fragment key={`${type}-${idx}`}>{elements[type as keyof typeof elements] || null}</React.Fragment>
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
                        <SheetHeader className="p-4 md:pb-2 border-b border-stone-50 bg-stone-50/30">
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

            {/* Legal Process Consultation Drawer (Mobile) */}
            {isMounted && (
                <Sheet open={isConsultingProcess} onOpenChange={setIsConsultingProcess}>
                    <SheetContent side="bottom" className="h-[85vh] rounded-t-[2.5rem] bg-stone-950 border-t border-white/10 p-0 overflow-hidden">
                        <SheetHeader className="p-6 pb-2">
                            <div className="h-1 w-12 bg-white/20 rounded-full mx-auto mb-4" />
                            <SheetTitle className="text-3xl font-black text-white leading-none text-center" style={{ fontFamily: 'var(--theme-font-heading)' }}>
                                Consultar <span className="text-tenant-primary italic">Processo</span>
                            </SheetTitle>
                        </SheetHeader>

                        <div className="px-6 pb-8 overflow-y-auto h-full custom-scrollbar">
                            {!consultationResult ? (
                                <div className="space-y-6 mt-2">
                                    <p className="text-white/60 text-center text-xs leading-relaxed">Insira o código do seu processo para verificar o andamento em tempo real.</p>
                                    
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40 ml-1">Código do Processo</Label>
                                            <div className="relative group">
                                                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-tenant-primary transition-colors" />
                                                <Input 
                                                    value={processCode}
                                                    onChange={e => setProcessCode(e.target.value.toUpperCase())}
                                                    placeholder="PROC-2026-XXXX" 
                                                    className="pl-12 h-16 bg-white/5 border-white/10 rounded-2xl text-white text-lg font-bold placeholder:text-white/10 focus:ring-tenant-primary/20"
                                                />
                                            </div>
                                        </div>

                                        {consultationError && (
                                            <motion.div 
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold text-center"
                                            >
                                                {consultationError}
                                            </motion.div>
                                        )}

                                        <Button 
                                            onClick={handleConsultProcess}
                                            disabled={consultationLoading || !processCode}
                                            className="w-full h-16 bg-tenant-primary hover:opacity-90 text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl shadow-xl shadow-tenant-primary/20 transition-all active:scale-95 disabled:opacity-50"
                                        >
                                            {consultationLoading ? <Loader2 className="animate-spin" /> : 'Verificar Status Agora'}
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6 mt-2">
                                    <div className="flex items-center justify-between bg-white/5 p-4 rounded-3xl border border-white/10">
                                        <div>
                                            <p className="text-[9px] font-black text-tenant-primary uppercase tracking-[0.3em] mb-0.5">Busca Concluída</p>
                                            <h3 className="text-xl font-black text-white" style={{ fontFamily: 'var(--theme-font-heading)' }}>
                                                Olá, {consultationResult.customerName.split(' ')[0]}
                                            </h3>
                                        </div>
                                        <Badge className="h-7 px-3 bg-white/10 text-white border-none font-black text-[9px] rounded-lg uppercase tracking-widest">
                                            {processCode}
                                        </Badge>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="relative">
                                            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/5" />
                                            <div className="space-y-4">
                                                {LEGAL_STATUSES.map((status, index) => {
                                                    const currentIndex = LEGAL_STATUSES.findIndex(s => s.id === consultationResult.status)
                                                    const isPast = index < currentIndex
                                                    const isCurrent = index === currentIndex
                                                    
                                                    return (
                                                        <div key={status.id} className="relative flex items-center gap-4 group">
                                                            <div className={cn(
                                                                "h-9 w-9 rounded-xl border-2 flex items-center justify-center z-10 transition-all duration-500",
                                                                isPast ? "bg-emerald-500 border-emerald-500 text-white" :
                                                                isCurrent ? "bg-tenant-primary border-tenant-primary text-white scale-110 shadow-lg shadow-tenant-primary/20" :
                                                                "bg-stone-900 border-white/5 text-white/20"
                                                            )}>
                                                                {isPast ? <CheckCircle2 className="h-4 w-4" /> : 
                                                                 isCurrent ? <Clock className="h-4 w-4 animate-pulse" /> : 
                                                                 <span className="text-[10px] font-black">{index + 1}</span>}
                                                            </div>
                                                            <div>
                                                                <p className={cn(
                                                                    "text-[10px] font-black uppercase tracking-[0.2em] transition-colors",
                                                                    isCurrent ? "text-tenant-primary" : isPast ? "text-emerald-500" : "text-white/20"
                                                                )}>
                                                                    {status.label}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-start gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                                <Info className="h-4 w-4 text-white/40" />
                                            </div>
                                            <p className="text-[10px] text-white/50 leading-relaxed">
                                                Seu processo está avançando conforme o planejado. Qualquer atualização crítica será notificada via WhatsApp ou e-mail.
                                            </p>
                                        </div>
                                    </div>

                                    <Button 
                                        onClick={() => setConsultationResult(null)}
                                        variant="ghost"
                                        className="w-full text-white/40 hover:text-white font-bold text-[9px] uppercase tracking-widest gap-2 pb-6"
                                    >
                                        <ChevronLeft size={14} /> Nova Consulta
                                    </Button>
                                </div>
                            )}
                        </div>
                    </SheetContent>
                </Sheet>
            )}

        </div>
    )
}
