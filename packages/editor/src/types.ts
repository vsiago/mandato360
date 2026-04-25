/* ─── Editor Package — Type Definitions ─── */

import type { ComponentType } from "react"

// ─── Device & Section Types ───
export type DeviceType = "mobile" | "tablet" | "desktop"
export type SectionType = "header" | "hero" | "footer"
export type AccordionType = "theme" | "colors" | "image" | "position" | "effects" | "content" | "header-content" | "layout" | "button-primary" | "button-secondary"
export type ThemePresetType = "neutral" | "classic" | "hightech" | "emerald" | "custom"
export type OrientationType = "left" | "center" | "right"
export type FontFamily = "sans" | "serif" | "mono" | "display"

// ─── Gradient ───
export interface GradientStop {
  color: string
  position: number
  opacity?: number // 0-100
}

export interface GradientConfig {
  enabled: boolean
  angle: number
  opacity: number
  stops: GradientStop[]
}

// ─── Image Position ───
export interface ImagePosition {
  x: number
  y: number
  scale: number
}

// ─── Design System ───
export interface DesignSystemConfig {
  preset: ThemePresetType
  fonts: {
    primary: FontFamily
    secondary: FontFamily
  }
  borderRadius: "none" | "sm" | "md" | "lg" | "full"
  shadows: "none" | "subtle" | "medium" | "dramatic"
  animations: boolean
}

// ─── Theme ───
export interface ThemeConfig {
  designSystem: DesignSystemConfig
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  gradient: GradientConfig
}

// ─── Header ───
export interface HeaderConfig {
  logo: string | null
  logoText: string
  menuItems: string[]
  menuStyle: "transparent" | "solid" | "gradient"
  backgroundColor: string
  logoHeight: number
  gradient: GradientConfig
  behavior: "fixed" | "static"
  height: number
  showCta: boolean
  ctaText: string
  scrolled: {
    enabled: boolean
    height: number
    backgroundColor: string
    colors: {
      logo: string
      menu: string
      cta: string
      hamburger: string
    }
  }
}

// ─── Button Config ───
export interface ButtonConfig {
  text: string
  link: string
  iconLeft?: string
  iconRight?: string
  paddingX?: number
  paddingY?: number
  height?: number
  width?: 'auto' | 'full' | number
  backgroundColor?: string
  textColor?: string
  gradient?: GradientConfig
  outline?: boolean
  fontSize?: number
  iconSize?: number
  iconWeight?: number
  iconColor?: string
}

// ─── Hero Overridable Props (per-breakpoint) ───
export interface HeroOverridableProps {
  title?: string
  subtitle?: string
  description?: string
  ctaPrimary?: string
  ctaSecondary?: string
  buttonPrimary?: Partial<ButtonConfig>
  buttonSecondary?: Partial<ButtonConfig>
  badge?: string
  orientation?: OrientationType
  autoHeight?: boolean
  height?: number
  overlay?: {
    enabled: boolean
    color: string
    opacity: number
  }
  vignette?: {
    enabled: boolean
    intensity: number
    color: string
  }
  // Colors & Gradient (per-breakpoint)
  backgroundColor?: string
  gradient?: GradientConfig
}

// ─── Hero ───
export interface HeroConfig {
  orientation: OrientationType
  title: string
  subtitle: string
  description: string
  ctaPrimary: string
  ctaSecondary: string
  buttonPrimary?: ButtonConfig
  buttonSecondary?: ButtonConfig
  badge: string
  images: {
    mobile: string | null
    tablet: string | null
    desktop: string | null
  }
  imagePosition: {
    mobile: ImagePosition
    tablet: ImagePosition
    desktop: ImagePosition
  }
  vignette: {
    enabled: boolean
    intensity: number
    color: string
  }
  overlay: {
    enabled: boolean
    color: string
    opacity: number
  }
  autoHeight: boolean
  height: number
  /** Hero-specific background color (overridable per breakpoint) */
  backgroundColor?: string
  /** Hero-specific gradient (overridable per breakpoint) */
  gradient?: GradientConfig
  /** Responsive overrides: mobile-first, tablet/desktop can override specific props */
  overrides?: {
    tablet?: HeroOverridableProps
    desktop?: HeroOverridableProps
  }
}

// ─── Footer ───
export interface FooterConfig {
  style: "simple" | "columns" | "centered"
  showSocial: boolean
  socialLinks: {
    instagram: string
    facebook: string
    twitter: string
    linkedin: string
  }
  copyright: string
  showNewsletter: boolean
  newsletterTitle: string
  columns: {
    title: string
    links: string[]
  }[]
}

// ─── Full Editor Config ───
export interface EditorConfig {
  theme: ThemeConfig
  header: HeaderConfig
  hero: HeroConfig
  footer: FooterConfig
  /** Plugin configs keyed by plugin ID */
  plugins?: Record<string, any>
  /** Ordering of all sections (core + plugins) */
  sectionOrder?: string[]
  /** UI State for Header Preview (not persisted) */
  headerPreviewView?: 'top' | 'scrolled'
}

// ─── Theme Presets ───
export interface ThemePreset {
  id: ThemePresetType
  label: string
  description: string
  colors: ThemeConfig["colors"]
  gradient: {
    stops: GradientStop[]
    angle: number
  }
  designSystem: DesignSystemConfig
}

// ─── Plugin System ───
export interface PluginSectionProps {
  config: any
  device: DeviceType
  themeColors: ThemeConfig["colors"]
}

export interface PluginSidebarProps {
  config: any
  onChange: (updates: any) => void
  accentColor?: string
  onImageUpload?: (file: File) => Promise<string>
}

export interface EditorPlugin {
  /** Unique plugin ID (e.g. "projetos", "faq") */
  id: string
  /** Display label in section nav */
  label: string
  /** Lucide icon component */
  icon: ComponentType<{ className?: string }>
  /** Component rendered in the device preview area */
  previewComponent: ComponentType<PluginSectionProps>
  /** Component rendered in the sidebar for editing */
  sidebarComponent: ComponentType<PluginSidebarProps>
  /** Default config when plugin is first enabled */
  defaultConfig: Record<string, any>
}

// ─── Props for the main SiteEditor ───
export interface SiteEditorProps {
  /** Initial editor configuration (loaded from DB) */
  initialConfig: EditorConfig
  /** Called when the user saves. Must persist to backend. */
  onSave: (config: EditorConfig) => Promise<void>
  /** URL of the final published site for "View Site" button */
  previewUrl?: string
  /** Tenant/user name displayed in breadcrumb */
  tenantName?: string
  /** Array of plugin extensions */
  plugins?: EditorPlugin[]
  /** Enable auto-save with debounce (default: false) */
  autoSave?: boolean
  /** Auto-save debounce in ms (default: 2000) */
  autoSaveDelay?: number
  /** Async function to handle image uploads. Returns the remote URL. */
  onImageUpload?: (file: File) => Promise<string>
  /** Additional className for the root container */
  className?: string
  /** Accent color inherited from host app (used for active states, indicators) */
  /** Accent color inherited from host app (used for active states, indicators) */
  accentColor?: string
  /** Default text placeholders for hero content (business type specific) */
  placeholders?: {
    title?: string
    description?: string
    badge?: string
    ctaPrimary?: string
    ctaSecondary?: string
  }
}
