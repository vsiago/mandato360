/**
 * Design System Themes — Index / Registry
 *
 * SINGLE source of truth for all themes.
 * Niche JSONs define WHAT appears, themes define HOW.
 */

import type { DesignTheme, ThemeId } from "./types"

import neutro from "./neutro.json"
import classico from "./classico.json"
import ludico from "./ludico.json"
import hightech from "./hightech.json"

export const THEMES: Record<ThemeId, DesignTheme> = {
  neutro: neutro as unknown as DesignTheme,
  classico: classico as unknown as DesignTheme,
  ludico: ludico as unknown as DesignTheme,
  hightech: hightech as unknown as DesignTheme,
}

/**
 * Niche → Default Theme mapping
 * Each niche gets a suggested theme, but tenant can override.
 */
export const NICHE_DEFAULT_THEME: Record<string, ThemeId> = {
  "salao-de-beleza":       "classico",
  "barbearia":             "classico",
  "studio-de-estetica":    "ludico",
  "clinica-de-estetica":   "neutro",
  "nail-designer":         "ludico",
  "studio-de-sobrancelhas":"ludico",
  "tatuagem-e-piercing":   "hightech",
  "massagem-e-spa":        "classico",
  "pet-shop":              "ludico",
  "health-fitness":        "hightech",
  "educacao-e-aulas":      "neutro",
  "fotografia":            "classico",
  "manutencao-e-reparos":  "neutro",
  "outros":                "neutro",
}

/**
 * Which themes are available for each niche (upsell potential)
 */
export const NICHE_ALLOWED_THEMES: Record<string, ThemeId[]> = {
  "salao-de-beleza":       ["classico", "ludico", "neutro", "hightech"],
  "barbearia":             ["classico", "hightech", "neutro", "ludico"],
  "studio-de-estetica":    ["ludico", "classico", "neutro", "hightech"],
  "clinica-de-estetica":   ["neutro", "classico", "hightech", "ludico"],
  "nail-designer":         ["ludico", "classico", "neutro", "hightech"],
  "studio-de-sobrancelhas":["ludico", "classico", "neutro", "hightech"],
  "tatuagem-e-piercing":   ["hightech", "classico", "neutro", "ludico"],
  "massagem-e-spa":        ["classico", "neutro", "ludico", "hightech"],
  "pet-shop":              ["ludico", "neutro", "classico", "hightech"],
  "health-fitness":        ["hightech", "neutro", "classico", "ludico"],
  "educacao-e-aulas":      ["neutro", "classico", "ludico", "hightech"],
  "fotografia":            ["classico", "hightech", "neutro", "ludico"],
  "manutencao-e-reparos":  ["neutro", "hightech", "classico", "ludico"],
  "outros":                ["neutro", "classico", "ludico", "hightech"],
}

/**
 * Default fallback background images for Hero section based on Niche
 */
export const NICHE_HERO_IMAGES: Record<string, string> = {
  "salao-de-beleza":       "/images/niches/salao-de-beleza.png",
  "barbearia":             "/images/niches/barbearia.png",
  "studio-de-estetica":    "/images/niches/studio-de-estetica.png",
  "clinica-de-estetica":   "/images/niches/clinica-de-estetica.png",
  "nail-designer":         "/images/niches/nail-designer.png",
  "studio-de-sobrancelhas":"/images/niches/studio-de-sobrancelhas.png",
  "tatuagem-e-piercing":   "/images/niches/tatuagem-e-piercing.png",
  "massagem-e-spa":        "/images/niches/massagem-e-spa.png",
  "pet-shop":              "/images/niches/pet-shop.png",
  "health-fitness":        "/images/niches/health-fitness.png",
  "educacao-e-aulas":      "/images/niches/educacao-e-aulas.png",
  "fotografia":            "/images/niches/fotografia.png",
  "manutencao-e-reparos":  "/images/niches/manutencao-e-reparos.png",
  "outros":                "/images/niches/outros.png",
}


export function getTheme(id: ThemeId): DesignTheme {
  return THEMES[id] || THEMES.neutro
}

export function getHeroImageForNiche(nicheSlug?: string): string {
  if (!nicheSlug) return NICHE_HERO_IMAGES["outros"]
  return NICHE_HERO_IMAGES[nicheSlug] || NICHE_HERO_IMAGES["outros"]
}

export function getDefaultThemeForNiche(nicheSlug: string): ThemeId {
  return NICHE_DEFAULT_THEME[nicheSlug] || "neutro"
}

export function getAllowedThemes(nicheSlug: string): DesignTheme[] {
  const allowed = NICHE_ALLOWED_THEMES[nicheSlug] || ["neutro", "classico", "ludico", "hightech"]
  return allowed.map(id => THEMES[id])
}

export function getAllThemes(): DesignTheme[] {
  return Object.values(THEMES)
}

/**
 * Generate CSS custom properties from a theme
 * Injects into :root via style tag or inline
 */
export function generateThemeCSS(theme: DesignTheme, mode: "light" | "dark" = "light"): Record<string, string> {
  const colors = mode === "dark" ? theme.colors.dark : theme.colors.light
  return {
    ...theme.cssVariables,
    "--theme-color-primary": colors.primary,
    "--theme-color-secondary": colors.secondary,
    "--theme-color-accent": colors.accent,
    "--theme-color-background": colors.background,
    "--theme-color-surface": colors.surface,
    "--theme-color-text": colors.text,
    "--theme-color-text-muted": colors.textMuted,
    "--theme-color-border": colors.border,
    // Specialized UI Tokens derived from theme
    "--theme-card-radius": theme.cards.borderRadius || theme.spacing.borderRadius || "12px",
    "--theme-card-shadow": theme.cards.shadow === "none" ? "none" : 
                           theme.cards.shadow === "glow" ? "var(--theme-shadow)" : 
                           theme.cards.shadow === "lg" ? "0 20px 50px rgba(0,0,0,0.1)" : "0 4px 12px rgba(0,0,0,0.05)",
    "--theme-btn-radius": theme.buttons.style === "pill" ? "9999px" : 
                          theme.buttons.style === "sharp" ? "0px" : 
                          theme.buttons.style === "soft" ? "4px" : "12px",
    "--theme-section-gap": theme.spacing.gap || "24px",
  }
}

export type { DesignTheme, ThemeId } from "./types"
