import type { TenantData, SectionStyle, ElementStyle, Breakpoint, GradientStop } from "./tenant-types"

/* ─── Gradient CSS Builder ─── */

export function hexToRgba(hex: string, opacity: number = 100) {
    if (!hex || hex === 'transparent') return 'transparent'
    let color = hex.replace('#', '')
    if (color.length === 3) {
        color = color.split('').map(c => c + c).join('')
    }
    const r = parseInt(color.substring(0, 2), 16) || 0
    const g = parseInt(color.substring(2, 4), 16) || 0
    const b = parseInt(color.substring(4, 6), 16) || 0
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`
}

export function buildGradientString(gradient?: import("./tenant-types").Gradient): string | undefined {
    if (!gradient || !gradient.stops || gradient.stops.length === 0) return undefined
    const { angle, stops, type = 'linear' } = gradient
    const sortedStops = [...stops].sort((a, b) => a.position - b.position)
    
    const stopsCSS = sortedStops.map(s => {
        return `${hexToRgba(s.color, s.opacity ?? 100)} ${s.position}%`
    }).join(', ')
    
    if (type === 'radial') {
        return `radial-gradient(circle at center, ${stopsCSS})`
    }
    return `linear-gradient(${angle}deg, ${stopsCSS})`
}

/**
 * Build a CSS linear-gradient string from a SectionStyle's gradient config.
 * Returns undefined if no valid gradient is configured.
 */
export function buildGradientCSS(style?: SectionStyle): string | undefined {
    if (!style || style.background !== 'gradient' || !style.gradient) return undefined
    return buildGradientString(style.gradient)
}

/* ─── Section Background Resolver ─── */

/**
 * Resolve a section's background into a React CSSProperties object.
 * Handles solid, gradient, and image backgrounds.
 */
export function resolveSectionBackground(data: TenantData, sectionId: string): React.CSSProperties {
    const style = data.sectionStyles?.[sectionId]
    if (!style) return {}

    const result: React.CSSProperties = {}

    if (style.background === 'solid' && style.bgColor) {
        result.backgroundColor = style.bgColor
    } else if (style.background === 'gradient') {
        const gradient = buildGradientCSS(style)
        if (gradient) result.background = gradient
    } else if (style.background === 'image' && style.bgImage) {
        result.backgroundImage = `url(${style.bgImage})`
        result.backgroundSize = 'cover'
        result.backgroundPosition = 'center'
    }

    if (style.paddingTop !== undefined) result.paddingTop = style.paddingTop
    if (style.paddingBottom !== undefined) result.paddingBottom = style.paddingBottom

    return result
}

/* ─── Element Style Resolver ─── */

/**
 * Resolve an element's style from responsive overrides.
 * Desktop is the base; other breakpoints layer on top.
 */
export function resolveElementStyle(
    data: TenantData,
    sectionId: string,
    elementId: string,
    breakpoint: Breakpoint = 'desktop'
): ElementStyle {
    const base: ElementStyle = {}
    const desktopOverride = data.responsiveOverrides?.desktop?.[sectionId]?.[elementId]
    const bpOverride = data.responsiveOverrides?.[breakpoint]?.[sectionId]?.[elementId]
    return { ...base, ...desktopOverride, ...(breakpoint !== 'desktop' ? bpOverride : {}) }
}

/**
 * Convert an ElementStyle into React CSSProperties.
 */
export function elementStyleToCSS(style: ElementStyle): React.CSSProperties {
    const css: React.CSSProperties = {}
    if (style.fontSize) css.fontSize = style.fontSize
    if (style.color) css.color = style.color
    if (style.fontWeight) css.fontWeight = style.fontWeight
    if ((style as any).fontFamily) css.fontFamily = (style as any).fontFamily
    if ((style as any).fontStyle) css.fontStyle = (style as any).fontStyle
    if (style.textAlign) css.textAlign = style.textAlign
    return css
}

const FONT_STACKS = {
  sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
  serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  display: 'Graphik, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
}

export function getFontStack(font: string) {
  if (FONT_STACKS[font as keyof typeof FONT_STACKS]) return FONT_STACKS[font as keyof typeof FONT_STACKS]
  if (!font) return FONT_STACKS.sans
  if (font.includes("'") || font.includes('"')) return font
  return `'${font}', sans-serif`
}

export function buildGoogleFontsUrl(fonts: string[]) {
  const uniqueFonts = Array.from(new Set(fonts)).filter(f => f && !FONT_STACKS[f as keyof typeof FONT_STACKS])
  if (uniqueFonts.length === 0) return null
  const families = uniqueFonts.map(f => `family=${f.replace(/\s+/g, '+')}:wght@400;700`).join('&')
  return `https://fonts.googleapis.com/css2?${families}&display=swap`
}
