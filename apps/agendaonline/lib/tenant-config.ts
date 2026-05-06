/**
 * TenantConfig — Unified configuration schema
 *
 * This is the SINGLE SOURCE OF TRUTH type for tenant configuration.
 * Consumed by: API endpoints, SSR pages, Admin Cockpit, Editor.
 */

import type { ThemeId } from "@/src/themes/types"
import type {
  TenantService,
  TenantCategory,
  TenantBadge,
  TenantFAQ,
  TenantBeforeAfter,
  SectionStyle,
  HeroImageSettings,
  Breakpoint,
  ElementStyle,
} from "./tenant-types"

export type ConfigEnvironment = "lab" | "production"

export interface TenantConfig {
  // Identity
  id: string
  ownerId: string
  slug: string
  segmento: string               // businessType slug
  segmentoName: string           // businessType display name
  theme: ThemeId

  // Plan & Features
  plan: string
  features: {
    free: string[]
    pro: string[]
  }

  // Design System (Optional overrides)
  designSystem?: any
  config?: any

  // PIX Configuration
  pix?: {
    type: 'email' | 'phone' | 'cpf_cnpj' | 'random'
    key: string
  }

  // Services & Categories
  services: TenantService[]
  categories: TenantCategory[]

  // Content
  content: {
    heroHeadline: string
    heroHighlight: string
    heroBadge: string
    description: string
    ctaText: string
    tone: string
    trustBadges: TenantBadge[]
    faq: TenantFAQ[]
    beforeAfter: TenantBeforeAfter[]
  }

  // Branding
  branding: {
    name: string
    surname: string
    logoUrl: string
    logoMiniUrl?: string
    heroImageUrl: string
    avatarUrl: string
    primaryColor: string
    hoverColor: string
    headerBgColor: string
  }

  // Founder / About
  founder: {
    name: string
    bio: string
    role: string
    imageUrl: string
  }

  // Contact
  contact: {
    phone: string
    whatsapp: string
    address: string
    instagram: string
    mapEmbedUrl: string
  }

  // Chat Widget
  chat: {
    greeting: string
    avatarUrl: string
    status: string
  }

  // Layout
  layout: {
    sections: any[]
    sectionStyles?: Record<string, SectionStyle>
    responsiveOverrides?: Record<Breakpoint, Record<string, Record<string, ElementStyle>>>
    heroImageSettings?: HeroImageSettings
  }

  // Metadata
  metadata: {
    version: number
    environment: ConfigEnvironment
    onboardingCompleted: boolean
    createdAt: string
    updatedAt: string
    lastPublished: string | null
    publishedBy: string | null
  }

  // Trial Status (computed)
  trialStatus?: {
    isExpired: boolean
    daysLeft: number
    trialEndsAt: string
  }
}

/**
 * Free features that are always available on all plans
 */
export const FREE_FEATURES = [
  "site_basico",
  "agendamento_whatsapp",
  "secao_servicos",
  "secao_faq",
  "secao_contato",
  "secao_sobre",
  "trust_badges",
  "chat_widget",
] as const

/**
 * Pro features — require active subscription (profissional or premium)
 */
export const PRO_FEATURES = [
  "pagina_servico_detalhada",
  "before_after_gallery",
  "editor_visual",
  "seo_avancado",
  "custom_domain",
  "analytics_dashboard",
  "galeria_fotos",
  "depoimentos",
  "equipe",
  "temas_premium",
] as const
