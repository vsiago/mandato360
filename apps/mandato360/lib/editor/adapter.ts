/**
 * Adapter: SiteConfig (Mandato360) ↔ EditorConfig (@mandato360/editor)
 * 
 * Converts between the legacy Mandato360 format and the editor package format
 * to ensure backward compatibility while using the new editor.
 */

import type { EditorConfig, GradientStop as EditorGradientStop } from "@mandato360/editor"
import type { SiteConfig, GradientStop as SiteGradientStop } from "./types"

/**
 * Convert a SiteConfig (from the database / tenant.config) into an EditorConfig
 * that the SiteEditor component can consume.
 */
export function siteConfigToEditorConfig(site: SiteConfig): EditorConfig {
  const primaryColor = site.colors?.primary || "#0F2B5B"
  const secondaryColor = site.colors?.secondary || "#0D9F6E"

  // Build gradient stops for the editor from hero section style
  const heroGradient = site.sectionStyles?.hero?.gradient
  const editorGradientStops: EditorGradientStop[] = heroGradient?.stops
    ? heroGradient.stops.map((s: SiteGradientStop) => ({
        color: s.color,
        position: s.position,
        opacity: s.opacity,
      }))
    : [
        { color: primaryColor, position: 0 },
        { color: secondaryColor, position: 50 },
        { color: "#000000", position: 100 },
      ]

  // Build overlay gradient for the editor
  const overlayGradient = site.heroImageSettings?.overlay
  const overlayEnabled = site.heroImageSettings?.overlayEnabled ?? false

  return {
    theme: {
      designSystem: {
        preset: "custom",
        fonts: { primary: "serif", secondary: "sans" },
        borderRadius: "lg",
        shadows: "medium",
        animations: true,
      },
      colors: {
        primary: primaryColor,
        secondary: secondaryColor,
        accent: secondaryColor,
        background: primaryColor,
        text: "#ffffff",
      },
      gradient: {
        enabled: heroGradient ? true : false,
        angle: heroGradient?.angle ?? 135,
        opacity: 90,
        stops: editorGradientStops,
      },
    },
    header: {
      logo: site.logoUrl || null,
      logoText: site.name || "Logo",
      menuItems: ["Projetos", "Sobre", "Contato"],
      menuStyle: "transparent",
      backgroundColor: primaryColor,
      logoHeight: 32,
      gradient: {
        enabled: true,
        angle: 180,
        opacity: 100,
        stops: [
          { color: primaryColor, position: 0 },
          { color: "transparent", position: 100 },
        ],
      },
      sticky: true,
      height: 80,
      showCta: true,
      ctaText: site.ctaText || "Fale Conosco",
    },
    hero: {
      orientation: (site.heroImageSettings?.layout === "right" ? "right" : site.heroImageSettings?.layout === "center" ? "center" : "left") as any,
      title: site.heroHeadline
        ? `${site.heroHeadline} ${site.heroHighlight || ""}`
        : "Construindo o Futuro",
      subtitle: site.tagline || "",
      description: site.description || "Trabalhando pela transparência e inovação.",
      ctaPrimary: site.ctaText || "Solicitar Demanda",
      ctaSecondary: "Ver Projetos",
      badge: site.heroBadge || "Mandato Participativo",
      images: {
        mobile: site.heroImageUrl || null,
        tablet: site.heroImageUrl || null,
        desktop: site.heroImageUrl || null,
      },
      imagePosition: {
        mobile: {
          x: site.heroImageSettings?.positionX ?? 50,
          y: site.heroImageSettings?.positionY ?? 50,
          scale: (site.heroImageSettings?.zoom ?? 1) * 100,
        },
        tablet: {
          x: site.heroImageSettings?.positionX ?? 50,
          y: site.heroImageSettings?.positionY ?? 50,
          scale: (site.heroImageSettings?.zoom ?? 1) * 100,
        },
        desktop: {
          x: site.heroImageSettings?.positionX ?? 50,
          y: site.heroImageSettings?.positionY ?? 20,
          scale: (site.heroImageSettings?.zoom ?? 1) * 100,
        },
      },
      vignette: {
        enabled: false,
        intensity: 40,
        color: "#000000",
      },
      overlay: {
        enabled: overlayEnabled,
        color: overlayGradient?.stops?.[0]?.color || primaryColor,
        opacity: overlayGradient?.stops?.[0]?.opacity ?? 60,
      },
      autoHeight: site.heroImageSettings?.autoHeight ?? true,
      height: site.heroImageSettings?.height ?? 600,
    },
    footer: {
      style: "columns",
      showSocial: !!(site.contact?.instagram),
      socialLinks: {
        instagram: site.contact?.instagram || "",
        facebook: "",
        twitter: "",
        linkedin: "",
      },
      copyright: "2024 Todos os direitos reservados.",
      showNewsletter: true,
      newsletterTitle: "Receba nossas novidades",
      columns: [
        { title: "Links", links: ["Início", "Sobre", "Projetos"] },
        { title: "Contato", links: [site.contact?.email || "Email", site.contact?.phone || "Telefone", "WhatsApp"] },
      ],
    },
    // Carry over plugin data
    plugins: {
      projetos: {
        title: site.projetosTitle || "Ações e Projetos",
        items: site.projetos || [],
        categories: site.categories || [],
      },
      perfil: {
        title: site.perfilTitle || "O Vereador",
        name: site.perfil?.name || site.name || "",
        bio: site.perfil?.bio || "",
        role: site.perfil?.role || "Vereador",
        imageUrl: site.perfil?.imageUrl || "",
      },
      faq: {
        title: site.faqTitle || "Perguntas Frequentes",
        items: site.faq || [],
      },
      contact: {
        title: site.contactTitle || "Entre em Contato",
        phone: site.contact?.phone || "",
        whatsapp: site.contact?.whatsapp || "",
        email: site.contact?.email || "",
        instagram: site.contact?.instagram || "",
        address: site.contact?.address || "",
      },
      trust: {
        badges: site.trustBadges || [],
      },
      beforeAfter: {
        title: site.resultsTitle || "Transformando a Cidade",
        items: site.beforeAfter || [],
      },
    },
    sectionOrder: ["header", "hero", "trust", "projetos", "perfil", "beforeAfter", "faq", "contact", "footer"],
  }
}

/**
 * Convert an EditorConfig back into a SiteConfig for persistence.
 * This ensures backward compatibility with the existing landing page renderer.
 */
export function editorConfigToSiteConfig(editor: EditorConfig, originalSlug: string): SiteConfig {
  const plugins = editor.plugins || {}
  const projetosPlugin = plugins.projetos || {}
  const perfilPlugin = plugins.perfil || {}
  const faqPlugin = plugins.faq || {}
  const contactPlugin = plugins.contact || {}
  const trustPlugin = plugins.trust || {}
  const beforeAfterPlugin = plugins.beforeAfter || {}

  // Convert editor gradient stops to site gradient stops
  const siteGradientStops: SiteGradientStop[] = editor.theme.gradient.stops.map((s) => ({
    color: s.color,
    position: s.position,
    opacity: Math.round(((s as any).opacity ?? 100) * (editor.theme.gradient.opacity / 100)),
  }))

  return {
    slug: originalSlug,
    name: perfilPlugin.name || editor.header.logoText || "Vereador",
    tagline: editor.hero.subtitle || "Mandato Participativo",
    description: editor.hero.description,
    heroBadge: editor.hero.badge,
    heroImageUrl: editor.hero.images.desktop || "",
    heroHeadline: editor.hero.title,
    heroHighlight: "",
    ctaText: editor.hero.ctaPrimary,
    colors: {
      primary: editor.theme.colors.primary,
      secondary: editor.theme.colors.secondary,
    },
    contact: {
      phone: contactPlugin.phone || "",
      whatsapp: contactPlugin.whatsapp || "",
      address: contactPlugin.address || "",
      email: contactPlugin.email || "",
      instagram: contactPlugin.instagram || "",
    },
    perfil: {
      name: perfilPlugin.name || "",
      bio: perfilPlugin.bio || "",
      role: perfilPlugin.role || "Vereador",
      imageUrl: perfilPlugin.imageUrl || "",
    },
    logoUrl: editor.header.logo || "",
    avatarUrl: "",
    trustBadges: trustPlugin.badges || [],
    categories: projetosPlugin.categories || [],
    projetos: projetosPlugin.items || [],
    faq: faqPlugin.items || [],
    beforeAfter: beforeAfterPlugin.items || [],
    sectionStyles: {
      hero: {
        background: editor.theme.gradient.enabled ? "gradient" : "solid",
        gradient: {
          angle: editor.theme.gradient.angle,
          stops: siteGradientStops,
        },
      },
    },
    heroImageSettings: {
      positionX: editor.hero.imagePosition.desktop.x,
      positionY: editor.hero.imagePosition.desktop.y,
      zoom: editor.hero.imagePosition.desktop.scale / 100,
      layout: editor.hero.orientation,
      overlayEnabled: editor.hero.overlay.enabled,
      overlay: editor.hero.overlay.enabled
        ? {
            angle: 90,
            stops: [
              { color: editor.hero.overlay.color, position: 0, opacity: editor.hero.overlay.opacity },
              { color: editor.hero.overlay.color, position: 50, opacity: editor.hero.overlay.opacity },
              { color: editor.hero.overlay.color, position: 100, opacity: 0 },
            ],
          }
        : undefined,
      autoHeight: editor.hero.autoHeight,
      height: editor.hero.height,
    },
    projetosTitle: projetosPlugin.title || "Ações e Projetos",
    perfilTitle: perfilPlugin.title || "O Vereador",
    resultsTitle: beforeAfterPlugin.title || "Transformando a Cidade",
    faqTitle: faqPlugin.title || "Perguntas Frequentes",
    contactTitle: contactPlugin.title || "Entre em Contato",
    theme: (editor.theme.designSystem.preset || "neutro") as any,
    fontHeading: editor.theme.designSystem.fonts.primary || "",
    fontBody: editor.theme.designSystem.fonts.secondary || "",
    // Store the raw editor config for lossless round-trip
    __editorConfig: editor as any,
  }
}

/**
 * Check if a SiteConfig was saved by the new editor (has raw editor config embedded)
 */
export function hasEditorConfig(site: SiteConfig): boolean {
  return !!(site as any).__editorConfig
}

/**
 * Extract EditorConfig from a SiteConfig if it was saved by the new editor.
 * Falls back to conversion if not available.
 */
export function extractEditorConfig(site: SiteConfig): EditorConfig {
  const raw = (site as any).__editorConfig
  if (raw) return raw as EditorConfig
  return siteConfigToEditorConfig(site)
}
