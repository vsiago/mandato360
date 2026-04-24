import { TenantData, TenantBadge, TenantCategory, TenantService } from "./tenant-types"
import { getAllNichos, getArvoreBySlug } from "@/src/arvores-segmentos"

export type BusinessTypeName =
    | "Salão de Beleza"
    | "Barbearia"
    | "Studio de Estética"
    | "Clínica de Estética"
    | "Nail Designer"
    | "Studio de Sobrancelhas"
    | "Tatuagem e Piercing"
    | "Massagem e SPA"
    | "Pet Shop"
    | "Health & Fitness"
    | "Educação e Aulas"
    | "Fotografia"
    | "Manutenção e Reparos"
    | "Outros"

export function getNicheCategories(nicheName: BusinessTypeName): TenantCategory[] {
    const nichos = getAllNichos()
    const found = nichos.find(n => n.nome === nicheName || n.slug === nicheName)
    const arvore = getArvoreBySlug(found?.slug || "salao-de-beleza")
    
    if (!arvore) return []
    return arvore.categorias.map(c => ({
        id: c.slug,
        label: c.nome
    }))
}

export function getNicheServices(nicheName: BusinessTypeName): TenantService[] {
    const nichos = getAllNichos()
    const found = nichos.find(n => n.nome === nicheName || n.slug === nicheName)
    const arvore = getArvoreBySlug(found?.slug || "salao-de-beleza")
    
    if (!arvore) return []
    return arvore.categorias.flatMap((cat) =>
      cat.servicos.map((svc) => ({
        id: svc.slug,
        categoryId: cat.slug,
        name: svc.nome,
        slug: svc.slug,
        description: svc.descricao,
        image: svc.imagem || "",
        price: svc.preco,
        duration: svc.duracao,
        isActive: true,
        features: svc.features?.map((f) => ({ item: f })),
        addons: svc.addons?.map((a) => ({ name: a.nome, price: a.preco })),
      }))
    )
}

export function getTenantDefaults(niche: BusinessTypeName = "Salão de Beleza"): TenantData {
    return {
        slug: "meu-negocio",
        name: "Meu Negócio",
        surname: "",
        title: "Bem-vindo",
        description: "Seja muito bem-vindo ao nosso espaço.",
        heroBadge: "NOVIDADE",
        heroHeadline: "Excelência em cada detalhe",
        heroHighlight: "Agende seu horário",
        ctaText: "Agendar Agora",
        heroImageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80",
        logoUrl: "",
        avatarUrl: "",
        colors: {
            primary: "#0f172a",
            hover: "#1e293b",
        },
        contact: {
            phone: "",
            whatsapp: "",
            address: "",
            mapEmbedUrl: "",
            instagram: "",
        },
        founder: {
            name: "",
            bio: "",
            role: "",
            imageUrl: "",
        },
        trustBadges: [
            { text: "Atendimento VIP", icon: "Star" },
            { text: "Ambiente Seguro", icon: "ShieldCheck" },
        ],
        categories: getNicheCategories(niche),
        services: getNicheServices(niche),
        faq: [
            { id: "1", question: "Como agendar?", answer: "Clique no botão de agendamento e escolha seu serviço." },
        ],
        beforeAfter: [],
        chat: {
            greeting: "Olá! Como podemos ajudar?",
            avatarUrl: "",
            status: "Online",
        },
        onboardingCompleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
}

export function mergeTenantWithDefaults(dbTenant: any): TenantData {
    const nicheIdentifier = dbTenant.businessType || dbTenant.businessTypeId || "Salão de Beleza"
    const defaults = getTenantDefaults(nicheIdentifier as BusinessTypeName)
    
    // Helper to safe parse JSON
    const safeParse = (val: any, fallback: any) => {
        if (!val) return fallback
        try {
            return typeof val === 'string' ? JSON.parse(val) : val
        } catch (e) {
            return fallback
        }
    }

    return {
        ...defaults,
        ...dbTenant,
        colors: {
            ...defaults.colors,
            ...(dbTenant.colors || {})
        },
        contact: {
            ...defaults.contact,
            ...(dbTenant.contact || {})
        },
        founder: {
            ...defaults.founder,
            ...(dbTenant.founder || {})
        },
        chat: {
            ...defaults.chat,
            ...(dbTenant.chat || {})
        },
        categories: dbTenant.categories || defaults.categories,
        services: dbTenant.services || defaults.services,
        trustBadges: safeParse(dbTenant.trustBadges, defaults.trustBadges),
        faq: safeParse(dbTenant.faq, defaults.faq),
        beforeAfter: safeParse(dbTenant.beforeAfter, defaults.beforeAfter),
        sectionStyles: safeParse(dbTenant.sectionStyles, undefined),
        responsiveOverrides: safeParse(dbTenant.responsiveOverrides, undefined),
        heroImageSettings: safeParse(dbTenant.heroImageSettings, undefined),
    }
}
