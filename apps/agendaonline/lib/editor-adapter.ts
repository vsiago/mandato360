import { TenantData } from "./tenant-types"
import { EditorConfig } from "@mandato360/editor"

/**
 * Adapts TenantData (Agenda Online) to EditorConfig (@mandato360/editor)
 */
export function tenantToEditorConfig(tenant: TenantData): EditorConfig {
  const defaultConfig = {
    theme: {
      designSystem: tenant.designSystem || {
        preset: "neutral",
        fonts: { primary: "sans" as any, secondary: "sans" },
        borderRadius: "md",
        shadows: "subtle",
        animations: false,
      },
      colors: {
        primary: tenant.colors.primary,
        secondary: tenant.colors.hover || "#0f172a",
        accent: tenant.colors.primary,
        background: "#0f172a",
        text: "#ffffff",
      },
      gradient: {
        enabled: true,
        angle: 135,
        opacity: 40,
        stops: [
          { color: tenant.colors.primary, position: 0 },
          { color: "transparent", position: 100 },
        ],
      },
    },
    header: {
      logo: tenant.logoUrl,
      logoText: tenant.name,
      menuItems: ["Serviços", "Sobre", "Contato"],
      menuStyle: "transparent",
      backgroundColor: "#0f172a",
      logoHeight: 32,
      gradient: {
        enabled: true,
        angle: 90,
        opacity: 100,
        stops: [
          { color: tenant.colors.primary, position: 0, opacity: 100 },
          { color: tenant.colors.primary, position: 100, opacity: 0 },
        ],
      },
      sticky: true,
      height: 80,
      showCta: true,
      ctaText: tenant.ctaText || "Agendar",
    },
    hero: {
      orientation: tenant.heroImageSettings?.layout || "left",
      title: tenant.heroHeadline,
      subtitle: tenant.heroHighlight || "",
      description: tenant.description,
      ctaPrimary: tenant.ctaText || "Agendar",
      ctaSecondary: "Ver Serviços",
      badge: tenant.heroBadge,
      images: {
        mobile: tenant.heroImageUrl,
        tablet: tenant.heroImageUrl,
        desktop: tenant.heroImageUrl,
      },
      imagePosition: {
        mobile: { 
          x: tenant.heroImageSettings?.mobile?.positionX ?? 50, 
          y: tenant.heroImageSettings?.mobile?.positionY ?? 50, 
          scale: (tenant.heroImageSettings?.mobile?.zoom ?? 1) * 100 
        },
        tablet: { 
          x: tenant.heroImageSettings?.tablet?.positionX ?? 50, 
          y: tenant.heroImageSettings?.tablet?.positionY ?? 50, 
          scale: (tenant.heroImageSettings?.tablet?.zoom ?? 1) * 100 
        },
        desktop: { 
          x: tenant.heroImageSettings?.positionX ?? 50, 
          y: tenant.heroImageSettings?.positionY ?? 20, 
          scale: (tenant.heroImageSettings?.zoom ?? 1) * 100 
        },
      },
      vignette: { enabled: true, intensity: 40, color: "#000000" },
      overlay: { enabled: true, color: "#000000", opacity: 30 },
      autoHeight: true,
      height: 600,
    },
    footer: {
      style: "columns",
      showSocial: true,
      socialLinks: {
        instagram: tenant.contact.instagram,
        facebook: "",
        twitter: "",
        linkedin: "",
      },
      copyright: `© ${new Date().getFullYear()} ${tenant.name}. Todos os direitos reservados.`,
      showNewsletter: false,
      newsletterTitle: "Newsletter",
      columns: [
        { title: "Explorar", links: ["Início", "Serviços", "Sobre"] },
        { title: "Suporte", links: ["FAQ", "Contato"] },
      ],
    },
    plugins: {
      trust: {
        badges: tenant.trustBadges,
        autoplay: true,
        speed: 25,
      },
      services: {
        title: "Nossa *Expertise*",
        subtitle: "Procedimentos personalizados para valorizar a arquitetura do seu rosto e realçar a sua beleza natural.",
        items: tenant.services,
        categories: tenant.categories,
      },
      about: { founder: tenant.founder },
      beforeAfter: { items: tenant.beforeAfter },
      faq: { items: tenant.faq },
      contact: { info: tenant.contact },
    },
    sectionOrder: ["header", "hero", "trust", "services", "about", "beforeAfter", "faq", "contact", "footer"],
  }

  // If we have a saved config, deep merge it with the defaults to avoid "undefined" crashes
  if (tenant.config) {
    const savedConfig = tenant.config as any
    return {
      ...defaultConfig,
      ...savedConfig,
      // Ensure nested objects are also merged or exist
      theme: { ...defaultConfig.theme, ...savedConfig.theme },
      header: { ...defaultConfig.header, ...savedConfig.header, logo: tenant.logoUrl, logoText: tenant.name },
      hero: { ...defaultConfig.hero, ...savedConfig.hero },
      footer: { ...defaultConfig.footer, ...savedConfig.footer },
      plugins: {
        ...defaultConfig.plugins,
        ...savedConfig.plugins,
        trust: {
          ...defaultConfig.plugins.trust,
          ...(savedConfig.plugins?.trust || {}),
          badges: (savedConfig.plugins?.trust?.badges || tenant.trustBadges || defaultConfig.plugins.trust.badges),
        },
        services: {
          ...defaultConfig.plugins.services,
          ...(savedConfig.plugins?.services || {}),
          items: tenant.services,
          categories: tenant.categories,
        },
        about: { founder: tenant.founder },
        contact: { info: tenant.contact },
      }
    }
  }

  return defaultConfig
}

/**
 * Adapts EditorConfig back to TenantData for saving
 */
export function editorConfigToTenant(config: EditorConfig, original: TenantData): TenantData {
  return {
    ...original,
    // Basic Hero mapping
    heroHeadline: config.hero.title,
    heroHighlight: config.hero.subtitle,
    description: config.hero.description,
    heroBadge: config.hero.badge,
    ctaText: config.hero.ctaPrimary,
    
    // Image mapping
    heroImageUrl: config.hero.images.desktop || original.heroImageUrl,
    heroImageSettings: {
      ...original.heroImageSettings,
      layout: config.hero.orientation as any,
      positionX: config.hero.imagePosition.desktop.x,
      positionY: config.hero.imagePosition.desktop.y,
      zoom: config.hero.imagePosition.desktop.scale / 100,
      mobile: {
        positionX: config.hero.imagePosition.mobile.x,
        positionY: config.hero.imagePosition.mobile.y,
        zoom: config.hero.imagePosition.mobile.scale / 100,
      },
      tablet: {
        positionX: config.hero.imagePosition.tablet.x,
        positionY: config.hero.imagePosition.tablet.y,
        zoom: config.hero.imagePosition.tablet.scale / 100,
      }
    },

    // Logo
    logoUrl: config.header.logo || original.logoUrl,

    // Plugins mapping
    trustBadges: config.plugins?.trust?.badges || original.trustBadges,
    services: config.plugins?.services?.items || original.services,
    categories: config.plugins?.services?.categories || original.categories,
    founder: config.plugins?.about?.founder || original.founder,
    beforeAfter: config.plugins?.beforeAfter?.items || original.beforeAfter,
    faq: config.plugins?.faq?.items || original.faq,
    contact: {
      ...original.contact,
      ...config.plugins?.contact?.info
    },
    designSystem: config.theme.designSystem,
    config: config,
  }
}
