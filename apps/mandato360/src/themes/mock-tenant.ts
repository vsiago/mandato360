/**
 * Mock Tenant Generator
 *
 * Converts an ArvoreSegmento + DesignTheme → TenantData
 * Used by the admin /templates cockpit for live previews.
 */

import type { ArvoreSegmento } from "@/src/arvores-segmentos/types"
import type { DesignTheme } from "@/src/themes/types"
import type { TenantData } from "@/lib/tenant-types"

export function generateMockTenant(
  arvore: ArvoreSegmento,
  theme: DesignTheme,
  overrides?: Partial<TenantData>
): TenantData {
  const colors = theme.colors.light

  return {
    id: `mock-${arvore.meta.slug}`,
    slug: arvore.meta.slug,
    name: arvore.heroPreset.headline.split(" ").slice(0, 3).join(" ") || arvore.meta.nome,
    surname: arvore.meta.descricao,
    title: `${arvore.meta.nome} | Agendamento Online`,
    description: arvore.heroPreset.subheadline,
    businessTypeId: arvore.meta.slug,

    // Hero
    heroBadge: arvore.heroPreset.badge,
    heroImageUrl: "",
    ctaText: arvore.heroPreset.ctaText,
    heroHeadline: arvore.heroPreset.headline,
    heroHighlight: arvore.heroPreset.highlight,

    // Colors from theme
    colors: {
      primary: colors.accent,
      hover: colors.secondary,
    },

    // Contact mock
    contact: {
      phone: "(21) 99999-9999",
      whatsapp: "5521999999999",
      address: "Av. Exemplar, 123 — Centro, Rio de Janeiro",
      mapEmbedUrl: "",
      instagram: "@" + arvore.meta.slug.replace(/-/g, ""),
    },

    // Founder mock
    founder: {
      name: "Maria Exemplo",
      bio: arvore.copyVoz.fraseImpacto,
      role: `Especialista em ${arvore.meta.nome}`,
      imageUrl: "",
    },

    // Branding
    logoUrl: "",
    avatarUrl: "",

    // Trust badges from niche
    trustBadges: arvore.trustBadges.map((b) => ({
      text: b.texto,
      icon: b.icone,
    })),

    // Chat mock
    chat: {
      greeting: `Olá! Bem-vindo ao nosso ${arvore.meta.nome}. Como posso ajudar?`,
      avatarUrl: "",
      status: "online",
    },

    // Categories from niche tree
    sections: arvore.secoes,
    categories: [
      { id: "todos", label: "Todos" },
      ...arvore.categorias.map((cat) => ({
        id: cat.slug,
        label: cat.nome,
      })),
    ],

    // Services from niche tree
    services: arvore.categorias.flatMap((cat) =>
      cat.servicos.map((svc) => ({
        id: svc.slug,
        categoryId: cat.slug,
        name: svc.nome,
        slug: svc.slug,
        description: svc.descricao,
        image: svc.imagem || "",
        price: svc.preco,
        duration: svc.duracao,
        features: svc.features?.map((f) => ({ item: f })),
        addons: svc.addons?.map((a) => ({ name: a.nome, price: a.preco })),
      }))
    ),

    // FAQ from niche tree
    faq: arvore.faqSugerida.map((f, i) => ({
      id: `faq-${i}`,
      question: f.pergunta,
      answer: f.resposta,
    })),

    // No before/after in mock
    beforeAfter: [],

    // Theme
    theme: theme.id,

    // Meta
    onboardingCompleted: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    plan: "premium",

    ...overrides,
  }
}
