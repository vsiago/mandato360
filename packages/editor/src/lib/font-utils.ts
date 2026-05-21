/* ─── Font resolution shared between the editor preview and the public site ─── */

export const SYSTEM_FONT_STACKS: Record<string, string> = {
  sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
  serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  display: 'Graphik, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
}

export function isSystemFont(font: string | undefined | null): boolean {
  return !!font && font in SYSTEM_FONT_STACKS
}

export function getFontStack(font: string | undefined | null): string {
  if (!font) return SYSTEM_FONT_STACKS.sans
  if (SYSTEM_FONT_STACKS[font]) return SYSTEM_FONT_STACKS[font]
  if (font.includes("'") || font.includes('"')) return font
  return `'${font}', sans-serif`
}

export function buildGoogleFontsUrl(fonts: Array<string | undefined | null>): string | null {
  const unique = Array.from(
    new Set(
      fonts
        .filter((f): f is string => !!f && !isSystemFont(f))
        .map((f) => f.trim())
        .filter(Boolean),
    ),
  )
  if (unique.length === 0) return null
  const families = unique
    .map((f) => `family=${f.replace(/\s+/g, '+')}:ital,wght@0,400;0,500;0,700;0,900;1,400;1,700`)
    .join('&')
  return `https://fonts.googleapis.com/css2?${families}&display=swap`
}
