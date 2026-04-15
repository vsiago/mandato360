/* ─── Shared Site Configuration Types (Political Context) ─── */

import type { ThemeId } from "@/src/themes/types"

export interface ProjetoMandato {
    id: string
    categoryId: string
    name: string
    slug: string
    description: string
    image: string
    fullDescription?: string
    features?: { item: string }[]
    longImage?: string
}

export interface ProjetoCategory {
    id: string
    label: string
}

export interface TenantFAQ {
    id: string
    question: string
    answer: string
}

export interface TenantBeforeAfter {
    id: string
    title: string
    before: string
    after: string
}

export interface TenantBadge {
    text: string
    icon: string  // lucide icon name
}

/* ─── Visual Editor Types ─── */

export interface GradientStop {
    color: string
    position: number   // 0-100
    opacity: number    // 0-100
}

export interface Gradient {
    angle: number          // 0-360
    stops: GradientStop[]
}

export interface SectionStyle {
    background: 'solid' | 'gradient' | 'image'
    bgColor?: string
    gradient?: Gradient
    bgImage?: string
    paddingTop?: number    // px
    paddingBottom?: number // px
}

export interface ElementStyle {
    fontSize?: number     // px
    color?: string
    fontWeight?: string
    textAlign?: 'left' | 'center' | 'right'
}

export type Breakpoint = 'mobile' | 'tablet' | 'desktop'

/** Section IDs used across the editor */
export type EditorSectionId = 'header' | 'hero' | 'trust' | 'projetos' | 'perfil' | 'solicitacoes' | 'beforeAfter' | 'faq' | 'contact' | 'footer'

export interface HeroImagePosition {
    positionX: number   // 0-100, default 50
    positionY: number   // 0-100, default 20
    zoom: number        // 1-3, default 1
}

export interface HeroImageSettings {
    positionX: number
    positionY: number
    zoom: number
    mobile?: Partial<HeroImagePosition>
    tablet?: Partial<HeroImagePosition>
    overlayEnabled?: boolean
    overlay?: Gradient
    layout?: 'left' | 'center'
    autoHeight?: boolean
    height?: number
}

export interface SiteConfig {
    // Identity
    slug: string
    name: string
    tagline: string
    description: string

    // Hero
    heroBadge: string
    heroImageUrl: string
    heroImageSettings?: HeroImageSettings
    ctaText: string
    heroHeadline: string
    heroHighlight: string

    // Colors
    colors: {
        primary: string
        secondary: string
    }

    // Contact
    contact: {
        phone: string
        whatsapp: string
        address: string
        email: string
        instagram: string
    }

    // Perfil do Vereador
    perfil: {
        name: string
        bio: string
        role: string
        imageUrl: string
    }

    // Branding
    logoUrl: string
    avatarUrl: string

    // Header (scrolled nav)
    headerBgColor?: string 

    // Trust Strip (Conquistas / Números)
    trustBadges: TenantBadge[]

    // Content
    categories: ProjetoCategory[]
    projetos: ProjetoMandato[]
    faq: TenantFAQ[]
    beforeAfter: TenantBeforeAfter[]

    // Visual Editor — per-section styles
    sectionStyles?: Record<string, SectionStyle>

    // Visual Editor — per-breakpoint overrides (sectionId → elementId → style)
    responsiveOverrides?: Record<Breakpoint, Record<string, Record<string, ElementStyle>>>

    // Section Titles
    projetosTitle?: string
    perfilTitle?: string
    resultsTitle?: string
    faqTitle?: string
    contactTitle?: string

    // Theme (Design System)
    theme?: ThemeId
    fontHeading?: string
    fontBody?: string
}
