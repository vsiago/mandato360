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
    servicesTitle?: string
    servicesSubtitle?: string
    nicheSlug?: string
}

export function buildDefaultEditorConfig(params: DefaultConfigParams) {
    const isAdvocacia = params.nicheSlug === "advocacia"

    const {
        name,
        heroImage,
        primaryColor,
        hoverColor,
        heroHeadline = isAdvocacia
            ? "Advocacia com *excelência* e compromisso"
            : "Excelência em cada detalhe",
        heroBadge = isAdvocacia
            ? "⚖️ ESCRITÓRIO DE ADVOCACIA"
            : "✨ BEM-VINDO",
        description = isAdvocacia
            ? "Assessoria jurídica especializada para proteger seus direitos e patrimônio. Agende sua consulta."
            : "Seja muito bem-vindo ao nosso espaço. Agende seu horário e descubra uma experiência única.",
        ctaText = isAdvocacia ? "Agendar Consulta" : "Agendar Horário",
        servicesTitle = isAdvocacia ? "Áreas de *Atuação*" : "Nossa *Expertise*",
        servicesSubtitle = isAdvocacia
            ? "Assessoria jurídica especializada para proteger seus direitos e patrimônio."
            : "Soluções personalizadas desenvolvidas para atender as suas necessidades com excelência."
    } = params

    // ─── Niche-specific plugin defaults ───
    const trustBadges = isAdvocacia
        ? [
            { text: "Advocacia Especializada", icon: "ShieldCheck" },
            { text: "Sigilo Profissional", icon: "ShieldCheck" },
            { text: "Registro OAB Ativo", icon: "Award" },
            { text: "Atendimento Humanizado", icon: "Heart" },
        ]
        : [
            { text: "Atendimento VIP", icon: "Star" },
            { text: "Ambiente Seguro", icon: "ShieldCheck" },
        ]

    const faqItems = isAdvocacia
        ? [
            { id: "1", question: "Como funciona a primeira consulta?", answer: "A primeira consulta é uma conversa para entendermos o seu caso, analisar documentos relevantes e traçar a melhor estratégia jurídica. Dura em média 50 minutos." },
            { id: "2", question: "Quais documentos preciso levar?", answer: "Depende do caso, mas recomendamos trazer documentos pessoais (RG e CPF), comprovante de residência, e quaisquer documentos relacionados ao caso (contratos, notificações, etc.)." },
            { id: "3", question: "Vocês atuam em quais áreas do Direito?", answer: "Atuamos em diversas áreas, incluindo Direito Civil, Trabalhista, Empresarial, Família e Sucessões, Criminal e Consumidor. Consulte-nos para mais detalhes." },
            { id: "4", question: "Qual o custo dos honorários?", answer: "Os honorários são definidos com transparência na primeira consulta, de acordo com a complexidade do caso e as tabelas da OAB. Trabalhamos com valores justos e opções de parcelamento." },
        ]
        : [
            { id: "1", question: "Como agendar?", answer: "Clique no botão de agendamento e escolha seu serviço." },
        ]

    const aboutDefaults = isAdvocacia
        ? {
            founder: { name: "", bio: "", role: "Advogado(a) | OAB", imageUrl: "" },
            badge: "Compromisso com a Justiça",
            title: "Seu Direito, Nossa *Prioridade*",
        }
        : { founder: { name: "", bio: "", role: "", imageUrl: "" } }

    const practiceAreasPlugin = isAdvocacia
        ? {
            enabled: true,
            title: "Áreas de *Atuação*",
            subtitle: "Assessoria jurídica completa nas principais áreas do Direito.",
            items: [
                { id: "pa-1", name: "Direito Civil", description: "Contratos, responsabilidade civil, direito do consumidor e questões patrimoniais.", icon: "FileText" },
                { id: "pa-2", name: "Direito Trabalhista", description: "Defesa dos seus direitos trabalhistas, rescisões, horas extras e ações judiciais.", icon: "Briefcase" },
                { id: "pa-3", name: "Direito de Família", description: "Divórcio, guarda de filhos, pensão alimentícia, inventário e partilha de bens.", icon: "Heart" },
            ],
        }
        : { enabled: false, title: "", subtitle: "", items: [] }

        const teamPlugin = isAdvocacia
        ? {
            enabled: true,
            title: "Nossa *Equipe*",
            subtitle: "Profissionais altamente qualificados e dedicados à defesa dos seus direitos.",
            items: [
                { id: "m-1", name: `Dr. ${name.split(" ")[0] || "Nome"}`, role: "Sócio Fundador", oab: "OAB/SP 00000", bio: "Especialista com ampla experiência em contencioso e consultoria jurídica.", image: "" },
            ],
        }
        : { enabled: false, title: "", subtitle: "", items: [] }

    const sectionOrder = isAdvocacia
        ? ["header", "hero", "trust", "services", "practiceAreas", "agendamento", "team", "about", "faq", "contact", "footer"]
        : ["header", "hero", "trust", "services", "agendamento", "about", "beforeAfter", "faq", "contact", "footer"]

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
            menuItems: isAdvocacia
                ? [
                    { id: "practiceAreas", label: "Áreas de Atuação", href: "#practiceAreas" },
                    { id: "team", label: "Equipe Jurídica", href: "#team" },
                    { id: "about", label: "Sobre", href: "#about" },
                    { id: "contact", label: "Contato", href: "#contact" }
                ]
                : [
                    { id: "services", label: "Serviços", href: "#services" },
                    { id: "about", label: "Sobre", href: "#about" },
                    { id: "contact", label: "Contato", href: "#contact" }
                ],
            menuFontSize: 14,
            menuSpacing: 32,
            menuStyle: "transparent",
            backgroundColor: "#0f172a",
            logoHeight: 32,
            gradient: {
                enabled: false,
                angle: 180,
                opacity: 100,
                stops: [],
            },
            behavior: "fixed",
            sticky: true,
            height: 80,
            showCta: true,
            ctaText: ctaText,
            scrolled: {
                enabled: true,
                height: 64,
                backgroundColor: primaryColor,
                colors: {
                    logo: "#ffffff",
                    menu: "#ffffff",
                    cta: "#ffffff",
                    hamburger: "#ffffff",
                }
            }
        },
        hero: {
            orientation: "left",
            title: heroHeadline,
            subtitle: "",
            description: description,
            ctaPrimary: ctaText,
            ctaSecondary: isAdvocacia ? "Áreas de Atuação" : "Ver Serviços",
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
            columns: isAdvocacia
                ? [
                    { title: "Navegação", links: ["Início", "Áreas de Atuação", "Equipe"] },
                    { title: "Suporte", links: ["FAQ", "Contato"] },
                ]
                : [
                    { title: "Explorar", links: ["Início", "Serviços", "Sobre"] },
                    { title: "Suporte", links: ["FAQ", "Contato"] },
                ],
        },
        plugins: {
            trust: {
                badges: trustBadges,
                autoplay: true,
                speed: 25,
            },
            services: {
                title: servicesTitle,
                subtitle: servicesSubtitle,
                items: [],
                categories: [],
            },
            practiceAreas: practiceAreasPlugin,
            team: teamPlugin,
            about: aboutDefaults,
            beforeAfter: { items: [] },
            faq: { 
                enabled: true,
                title: "Perguntas *Frequentes*",
                subtitle: isAdvocacia
                    ? "Tire suas dúvidas sobre nossos serviços jurídicos."
                    : "Tire suas dúvidas sobre nossos serviços.",
                items: faqItems,
            },
            contact: { info: { phone: "", whatsapp: "", address: "", instagram: "", mapEmbedUrl: "" } },
            agendamento: {
                title: isAdvocacia ? "Agende sua *Consulta*" : "Agenda *Online*",
                subtitle: isAdvocacia ? "Atendimento personalizado com hora marcada" : "Exclusividade e Precisão em cada detalhe",
            },
        },
        sectionOrder,
    }
}
