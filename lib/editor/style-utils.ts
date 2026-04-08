import type { SiteConfig, SectionStyle, ElementStyle, Breakpoint, GradientStop, Gradient } from "./types"

/* ─── Gradient CSS Builder ─── */

export function buildGradientString(gradient?: Gradient): string | undefined {
    if (!gradient || gradient.stops.length === 0) return undefined
    const { angle, stops } = gradient
    const sortedStops = [...stops].sort((a, b) => a.position - b.position)
    const stopsCSS = sortedStops.map(s => {
        const r = parseInt(s.color.slice(1, 3), 16)
        const g = parseInt(s.color.slice(3, 5), 16)
        const b = parseInt(s.color.slice(5, 7), 16)
        return `rgba(${r},${g},${b},${s.opacity / 100}) ${s.position}%`
    }).join(', ')
    return `linear-gradient(${angle}deg, ${stopsCSS})`
}

/**
 * Build a CSS linear-gradient string from a SectionStyle's gradient config.
 */
export function buildGradientCSS(style?: SectionStyle): string | undefined {
    if (!style || style.background !== 'gradient' || !style.gradient) return undefined
    return buildGradientString(style.gradient)
}

/* ─── Section Background Resolver ─── */

/**
 * Resolve a section's background into a React CSSProperties object.
 */
export function resolveSectionBackground(data: SiteConfig, sectionId: string): React.CSSProperties {
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
 */
export function resolveElementStyle(
    data: SiteConfig,
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
    if (style.textAlign) css.textAlign = style.textAlign
    return css
}
