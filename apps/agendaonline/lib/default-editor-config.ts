/**
 * Generates a COMPLETE default EditorConfig for a new tenant.
 * This ensures 100% visual parity between /[slug] and /editar-site from day zero.
 * 
 * The public site (tenant-client.tsx) reads hero.title, hero.description,
 * theme.colors, theme.gradient, hero.overlay, hero.vignette from config.
 * If any of these are missing, the site renders blank.
 */

import { getHeroImageForNiche } from "@/src/themes"

interface DefaultConfigParams {
    name: string
    heroImage: string
    primaryColor: string
    hoverColor: string
    heroHeadline?: string
    heroBadge?: string
    description?: string
    ctaText?: string
}

export function buildDefaultEditorConfig(params: DefaultConfigParams) {
    const {
        name,
        heroImage,
        primaryColor,
        hoverColor,
        heroHeadline = "Excelência em cada detalhe",
        heroBadge = "✨ BEM-VINDO",
        description = "Seja muito bem-vindo ao nosso espaço. Agende seu horário e descubra uma experiência única.",
        ctaText = "Agendar Horário",
    } = params

    return {
        theme: {
            designSystem: {
                preset: "neutral",
                fonts: { primary: "sans", secondary: "sans" },
                borderRadius: "md",
                shadows: "subtle",
                animations: false,
            },
            colors: {
                primary: primaryColor,
                secondary: hoverColor || "#0f172a",
                accent: primaryColor,
                background: "#0f172a",
                text: "#ffffff",
            },
            gradient: {
                enabled: true,
                angle: 135,
                opacity: 40,
                stops: [
                    { color: primaryColor, position: 0 },
                    { color: "transparent", position: 100 },
                ],
            },
        },
        header: {
            logo: "",
            logoText: name,
            menuItems: ["Serviços", "Sobre", "Contato"],
            menuStyle: "transparent",
            backgroundColor: "#0f172a",
            logoHeight: 32,
            gradient: {
                enabled: false,
                angle: 180,
                opacity: 100,
                stops: [],
            },
            sticky: true,
            height: 80,
            showCta: true,
            ctaText: ctaText,
        },
        hero: {
            orientation: "left",
            title: heroHeadline,
            subtitle: "",
            description: description,
            ctaPrimary: ctaText,
            ctaSecondary: "Ver Serviços",
            badge: heroBadge,
            images: {
                desktop: heroImage,
                tablet: heroImage,
                mobile: heroImage,
            },
            imagePosition: {
                desktop: { x: 50, y: 50, scale: 100 },
                tablet: { x: 50, y: 50, scale: 100 },
                mobile: { x: 50, y: 50, scale: 100 },
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
                instagram: "",
                facebook: "",
                twitter: "",
                linkedin: "",
            },
            copyright: `© ${new Date().getFullYear()} ${name}. Todos os direitos reservados.`,
            showNewsletter: false,
            newsletterTitle: "Newsletter",
            columns: [
                { title: "Explorar", links: ["Início", "Serviços", "Sobre"] },
                { title: "Suporte", links: ["FAQ", "Contato"] },
            ],
        },
        plugins: {
            trust: { badges: [
                { text: "Atendimento VIP", icon: "Star" },
                { text: "Ambiente Seguro", icon: "ShieldCheck" },
            ]},
            services: { items: [], categories: [] },
            about: { founder: { name: "", bio: "", role: "", imageUrl: "" } },
            beforeAfter: { items: [] },
            faq: { items: [
                { id: "1", question: "Como agendar?", answer: "Clique no botão de agendamento e escolha seu serviço." },
            ]},
            contact: { info: { phone: "", whatsapp: "", address: "", instagram: "", mapEmbedUrl: "" } },
        },
        sectionOrder: ["header", "hero", "trust", "services", "about", "beforeAfter", "faq", "contact", "footer"],
    }
}
