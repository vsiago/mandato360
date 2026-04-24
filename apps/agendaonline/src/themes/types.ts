/**
 * Design System Theme — Type definitions
 *
 * Independent layer from niche segments.
 * Niche = WHAT appears | Theme = HOW it appears
 */

export type ThemeId = "neutro" | "classico" | "ludico" | "hightech"

export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: string
  textMuted: string
  border: string
}

export interface ThemeTypography {
  heading: string        // Google Font name
  body: string           // Google Font name
  headingWeight: string
  bodyWeight: string
}

export interface ThemeButtons {
  style: "rounded" | "pill" | "sharp" | "soft"
  shadow: boolean
  borderWidth: number
}

export interface ThemeCards {
  shadow: "none" | "sm" | "md" | "lg" | "glow"
  border: boolean
  borderRadius: string
  backdrop: boolean      // glassmorphism
}

export interface ThemeAnimations {
  hoverScale: boolean
  fadeIn: boolean
  staggerChildren: boolean
  duration: "fast" | "normal" | "slow"
}

export interface ThemeSpacing {
  sectionPadding: string   // CSS value
  cardPadding: string
  borderRadius: string     // global default
  gap: string
}

export interface DesignTheme {
  id: ThemeId
  nome: string
  descricao: string
  emoji: string
  preview: string          // preview color for card backgrounds

  colors: {
    light: ThemeColors
    dark: ThemeColors
  }
  typography: ThemeTypography
  buttons: ThemeButtons
  cards: ThemeCards
  animations: ThemeAnimations
  spacing: ThemeSpacing

  cssVariables: Record<string, string>
}
