/* ─── Shared Tenant Data Types ─── */

import type { ThemeId } from "@/src/themes/types"

export interface TenantService {
    id: string
    categoryId: string
    name: string
    slug: string
    description: string
    image: string
    price?: number
    duration?: number
    fullDescription?: string
    features?: { item: string }[]
    addons?: { name: string; price: number }[]
    longImage?: string
}

export interface TenantCategory {
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
export type EditorSectionId = 'header' | 'hero' | 'trust' | 'services' | 'about' | 'scheduling' | 'agendamento' | 'beforeAfter' | 'faq' | 'contact' | 'footer'

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
}

export interface TenantData {
    // Identity
    id?: string
    slug: string
    name: string
    surname: string
    title: string
    description: string
    businessTypeId?: string

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
        hover: string
    }

    // Contact
    contact: {
        phone: string
        whatsapp: string
        address: string
        mapEmbedUrl: string
        instagram: string
    }

    // Founder / About
    founder: {
        name: string
        bio: string
        role: string
        imageUrl: string
    }

    // Branding
    logoUrl: string
    avatarUrl: string

    // Header (scrolled nav)
    headerBgColor?: string   // e.g. '#0f172acc' — background when nav is scrolled

    // Trust Strip
    trustBadges: TenantBadge[]

    // Chat Widget
    chat: {
        greeting: string
        avatarUrl: string
        status: string
    }

    // Content
    categories: TenantCategory[]
    services: TenantService[]
    faq: TenantFAQ[]
    beforeAfter: TenantBeforeAfter[]
    sections?: any[]


    // Visual Editor — per-section styles
    sectionStyles?: Record<string, SectionStyle>

    // Visual Editor — per-breakpoint overrides (sectionId → elementId → style)
    responsiveOverrides?: Record<Breakpoint, Record<string, Record<string, ElementStyle>>>

    // Metadata
    onboardingCompleted: boolean
    // Theme
    theme?: ThemeId
    designSystem?: any
    config?: any

    createdAt: string
    updatedAt: string
    plan?: string
    trialStatus?: {
        isExpired: boolean
        daysLeft: number
        trialEndsAt: string
    }
}

/** Fields required during onboarding (step 1-4) */
export type OnboardingData = Pick<TenantData,
    | "name" | "surname" | "slug" | "businessTypeId"
    | "contact" | "colors" | "founder" | "logoUrl" | "theme"
>
