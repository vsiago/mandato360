/**
 * Google Fonts Database
 * Curated list of high-quality fonts for different styles.
 */

export interface GoogleFont {
    name: string
    family: string
    category: 'serif' | 'sans-serif' | 'display' | 'monospace'
}

export const CURATED_FONTS: GoogleFont[] = [
    { name: 'Inter', family: 'Inter', category: 'sans-serif' },
    { name: 'Montserrat', family: 'Montserrat', category: 'sans-serif' },
    { name: 'Roboto', family: 'Roboto', category: 'sans-serif' },
    { name: 'Open Sans', family: 'Open Sans', category: 'sans-serif' },
    { name: 'Playfair Display', family: 'Playfair Display', category: 'serif' },
    { name: 'Lora', family: 'Lora', category: 'serif' },
    { name: 'Merriweather', family: 'Merriweather', category: 'serif' },
    { name: 'Oswald', family: 'Oswald', category: 'sans-serif' },
    { name: 'Poppins', family: 'Poppins', category: 'sans-serif' },
    { name: 'Raleway', family: 'Raleway', category: 'sans-serif' },
    { name: 'Fraunces', family: 'Fraunces', category: 'serif' },
    { name: 'Unbounded', family: 'Unbounded', category: 'display' },
]

/**
 * Builds a Google Fonts import URL for chosen fonts.
 * Default weights: 400, 500, 700, 900 + italics
 */
export function buildGoogleFontsUrl(fontFamilies: string[]): string | null {
    if (!fontFamilies || fontFamilies.length === 0) return null

    const familiesParam = fontFamilies
        .map(f => `family=${f.replace(/ /g, '+')}:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900`)
        .join('&')

    return `https://fonts.googleapis.com/css2?${familiesParam}&display=swap`
}
