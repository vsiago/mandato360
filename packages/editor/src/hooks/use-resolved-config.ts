"use client"

import { useMemo } from "react"
import type { EditorConfig, DeviceType, HeroConfig, HeroOverridableProps, GradientConfig } from "../types"

/**
 * Resolved Hero — all properties fully resolved for a given breakpoint.
 * No optionals: everything has a concrete value.
 */
export interface ResolvedHero {
  orientation: HeroConfig["orientation"]
  title: string
  subtitle: string
  description: string
  ctaPrimary: string
  ctaSecondary: string
  badge: string
  autoHeight: boolean
  height: number
  vignette: HeroConfig["vignette"]
  overlay: HeroConfig["overlay"]
  backgroundColor: string
  gradient: GradientConfig
  // These are already per-device, not overridable
  images: HeroConfig["images"]
  imagePosition: HeroConfig["imagePosition"]
}

/**
 * Resolve Hero config for a specific device using mobile-first cascade:
 *   mobile = base
 *   tablet = base + overrides.tablet
 *   desktop = base + overrides.tablet + overrides.desktop
 */
export function resolveHero(hero: HeroConfig, device: DeviceType): ResolvedHero {
  const base: ResolvedHero = {
    orientation: hero.orientation,
    title: hero.title,
    subtitle: hero.subtitle,
    description: hero.description,
    ctaPrimary: hero.ctaPrimary,
    ctaSecondary: hero.ctaSecondary,
    badge: hero.badge,
    autoHeight: hero.autoHeight,
    height: hero.height,
    vignette: { ...hero.vignette },
    overlay: { ...hero.overlay },
    backgroundColor: hero.backgroundColor || '',
    gradient: hero.gradient ? { ...hero.gradient, stops: hero.gradient.stops.map(s => ({...s})) } : { enabled: false, angle: 135, opacity: 90, stops: [] },
    images: hero.images,
    imagePosition: hero.imagePosition,
  }

  if (device === "mobile") return base

  // Apply tablet overrides
  const tablet = hero.overrides?.tablet
  if (tablet) {
    applyOverrides(base, tablet)
  }

  if (device === "tablet") return base

  // Apply desktop overrides (on top of tablet)
  const desktop = hero.overrides?.desktop
  if (desktop) {
    applyOverrides(base, desktop)
  }

  return base
}

/**
 * Mutates `target` by applying non-undefined values from `overrides`.
 * Handles nested objects (overlay, vignette) correctly.
 */
function applyOverrides(target: ResolvedHero, overrides: HeroOverridableProps): void {
  if (overrides.title !== undefined) target.title = overrides.title
  if (overrides.subtitle !== undefined) target.subtitle = overrides.subtitle
  if (overrides.description !== undefined) target.description = overrides.description
  if (overrides.ctaPrimary !== undefined) target.ctaPrimary = overrides.ctaPrimary
  if (overrides.ctaSecondary !== undefined) target.ctaSecondary = overrides.ctaSecondary
  if (overrides.badge !== undefined) target.badge = overrides.badge
  if (overrides.orientation !== undefined) target.orientation = overrides.orientation
  if (overrides.autoHeight !== undefined) target.autoHeight = overrides.autoHeight
  if (overrides.height !== undefined) target.height = overrides.height
  if (overrides.overlay) target.overlay = { ...target.overlay, ...overrides.overlay }
  if (overrides.vignette) target.vignette = { ...target.vignette, ...overrides.vignette }
  if (overrides.backgroundColor !== undefined) target.backgroundColor = overrides.backgroundColor
  if (overrides.gradient) target.gradient = { ...target.gradient, ...overrides.gradient, stops: overrides.gradient.stops ? overrides.gradient.stops.map(s => ({...s})) : target.gradient.stops }
}

/**
 * Check if a specific property has an override for the given device.
 */
export function hasOverride(hero: HeroConfig, device: DeviceType, prop: keyof HeroOverridableProps): boolean {
  if (device === "mobile") return false // base has no overrides
  const layer = device === "tablet" ? hero.overrides?.tablet : hero.overrides?.desktop
  if (!layer) return false
  return layer[prop] !== undefined
}

/**
 * Hook that returns the resolved Hero for the current device.
 */
export function useResolvedHero(config: EditorConfig, device: DeviceType): ResolvedHero {
  return useMemo(() => resolveHero(config.hero, device), [config.hero, device])
}
