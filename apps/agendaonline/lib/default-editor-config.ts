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
    const isBarbearia = params.nicheSlug === "barbearia"

    // ─── Niche-specific hero text defaults ───
    const {
        name,
        heroImage,
        primaryColor,
        hoverColor,
        heroHeadline = isBarbearia
            ? "Tradição e *Estilo* desde o primeiro corte"
            : isAdvocacia
            ? "Advocacia com *excelência* e compromisso"
            : "Excelência em cada detalhe",
        heroBadge = isBarbearia
            ? "💈 BARBEARIA CLÁSSICA"
            : isAdvocacia
            ? "⚖️ ESCRITÓRIO DE ADVOCACIA"
            : "✨ BEM-VINDO",
        description = isBarbearia
            ? "Mais do que um corte — uma experiência. Navalha artesanal, ambiente exclusivo e o cuidado que todo homem merece."
            : isAdvocacia
            ? "Assessoria jurídica especializada para proteger seus direitos e patrimônio. Agende sua consulta."
            : "Seja muito bem-vindo ao nosso espaço. Agende seu horário e descubra uma experiência única.",
        ctaText = isBarbearia ? "Agendar Corte" : isAdvocacia ? "Agendar Consulta" : "Agendar Horário",
        servicesTitle = isBarbearia
            ? "Nossos *Serviços*"
            : isAdvocacia ? "Áreas de *Atuação*" : "Nossa *Expertise*",
        servicesSubtitle = isBarbearia
            ? "Cortes clássicos, barbas impecáveis e tratamentos exclusivos para o homem moderno."
            : isAdvocacia
            ? "Assessoria jurídica especializada para proteger seus direitos e patrimônio."
            : "Soluções personalizadas desenvolvidas para atender as suas necessidades com excelência."
    } = params

    // ─── Niche-specific plugin defaults ───
    const trustBadges = isBarbearia
        ? [
            { text: "Navalha Artesanal", icon: "Star" },
            { text: "Ambiente Exclusivo", icon: "ShieldCheck" },
            { text: "Tradição & Estilo", icon: "Award" },
            { text: "Atendimento Premium", icon: "Heart" },
        ]
        : isAdvocacia
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

    const faqItems = isBarbearia
        ? [
            { id: "1", question: "Preciso agendar ou posso ir sem hora?", answer: "Recomendamos sempre agendar para garantir seu horário. Use nosso sistema de agendamento online — é rápido e prático." },
            { id: "2", question: "Quanto tempo leva um corte completo?", answer: "Um corte com barba leva em média 45 a 60 minutos. Corte simples, cerca de 30 minutos. Reservamos tempo suficiente para um trabalho impecável." },
            { id: "3", question: "Vocês trabalham com barba na navalha?", answer: "Sim! A barba artesanal com navalha é nossa especialidade. Toalha quente, espuma cremosa e acabamento perfeito." },
            { id: "4", question: "Aceitam cartão e Pix?", answer: "Sim, aceitamos todas as formas de pagamento: dinheiro, cartão de débito/crédito e Pix." },
        ]
        : isAdvocacia
        ? [
            { id: "1", question: "Como funciona a primeira consulta?", answer: "A primeira consulta é uma conversa para entendermos o seu caso, analisar documentos relevantes e traçar a melhor estratégia jurídica. Dura em média 50 minutos." },
            { id: "2", question: "Quais documentos preciso levar?", answer: "Depende do caso, mas recomendamos trazer documentos pessoais (RG e CPF), comprovante de residência, e quaisquer documentos relacionados ao caso (contratos, notificações, etc.)." },
            { id: "3", question: "Vocês atuam em quais áreas do Direito?", answer: "Atuamos em diversas áreas, incluindo Direito Civil, Trabalhista, Empresarial, Família e Sucessões, Criminal e Consumidor. Consulte-nos para mais detalhes." },
            { id: "4", question: "Qual o custo dos honorários?", answer: "Os honorários são definidos com transparência na primeira consulta, de acordo com a complexidade do caso e as tabelas da OAB. Trabalhamos com valores justos e opções de parcelamento." },
        ]
        : [
            { id: "1", question: "Como agendar?", answer: "Clique no botão de agendamento e escolha seu serviço." },
        ]

    const aboutDefaults = isBarbearia
        ? {
            founder: { name: "", bio: "", role: "Barbeiro | Proprietário", imageUrl: "" },
            badge: "Tradição em Cada Detalhe",
            title: "A Arte da *Barbearia*",
        }
        : isAdvocacia
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

    // ─── Theme / Design System — Niche-aware defaults ───
    const resolvedPrimary = isBarbearia ? "#c4956a" : primaryColor
    const resolvedSecondary = isBarbearia ? "#0c0a08" : (hoverColor || "#0f172a")
    const resolvedBg = isBarbearia ? "#0c0a08" : "#0f172a"
    const resolvedText = "#ffffff"

    const designSystemPreset = isBarbearia ? "classico" : "neutral"
    const designSystemFonts = isBarbearia
        ? { primary: "Playfair Display", secondary: "Cormorant Garamond" }
        : { primary: "sans", secondary: "sans" }

    return {
        theme: {
            designSystem: {
                preset: designSystemPreset,
                fonts: designSystemFonts,
                borderRadius: isBarbearia ? "sm" : "md",
                shadows: "subtle",
                animations: isBarbearia ? true : false,
            },
            colors: {
                primary: resolvedPrimary,
                secondary: resolvedSecondary,
                accent: isBarbearia ? "#d4a574" : resolvedPrimary,
                background: resolvedBg,
                text: resolvedText,
            },
            gradient: {
                enabled: true,
                angle: isBarbearia ? 160 : 135,
                opacity: isBarbearia ? 50 : 40,
                stops: [
                    { color: resolvedPrimary, position: 0 },
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
                : isBarbearia
                ? [
                    { id: "services", label: "Serviços", href: "#services" },
                    { id: "agendamento", label: "Agendar", href: "#agendamento" },
                    { id: "about", label: "Sobre", href: "#about" },
                    { id: "contact", label: "Contato", href: "#contact" }
                ]
                : [
                    { id: "services", label: "Serviços", href: "#services" },
                    { id: "about", label: "Sobre", href: "#about" },
                    { id: "contact", label: "Contato", href: "#contact" }
                ],
            menuFontSize: isBarbearia ? 13 : 14,
            menuSpacing: isBarbearia ? 36 : 32,
            menuStyle: "transparent",
            backgroundColor: resolvedBg,
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
                backgroundColor: resolvedPrimary,
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
            ctaSecondary: isBarbearia ? "Ver Serviços" : isAdvocacia ? "Áreas de Atuação" : "Ver Serviços",
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
            vignette: { enabled: true, intensity: isBarbearia ? 55 : 40, color: "#000000" },
            overlay: { enabled: true, color: isBarbearia ? "#1a1410" : "#000000", opacity: isBarbearia ? 40 : 30 },
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
                speed: isBarbearia ? 20 : 25,
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
                title: isBarbearia ? "Dúvidas *Frequentes*" : "Perguntas *Frequentes*",
                subtitle: isBarbearia
                    ? "Tudo que você precisa saber antes da sua visita."
                    : isAdvocacia
                    ? "Tire suas dúvidas sobre nossos serviços jurídicos."
                    : "Tire suas dúvidas sobre nossos serviços.",
                items: faqItems,
            },
            contact: { info: { phone: "", whatsapp: "", address: "", instagram: "", mapEmbedUrl: "" } },
            agendamento: {
                title: isBarbearia ? "Agende seu *Horário*" : isAdvocacia ? "Agende sua *Consulta*" : "Agenda *Online*",
                subtitle: isBarbearia ? "Escolha o serviço, o profissional e o melhor horário para você" : isAdvocacia ? "Atendimento personalizado com hora marcada" : "Exclusividade e Precisão em cada detalhe",
            },
        },
        sectionOrder,
    }
}
