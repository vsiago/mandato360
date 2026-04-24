/**
 * Árvore de Segmento — Estrutura completa por nicho de negócio
 *
 * Cada JSON em /src/arvores-segmentos/ segue este contrato.
 * É o blueprint que define TUDO que um inquilino recebe ao escolher seu nicho.
 */

/* ─── Meta / Identidade ─── */

export interface NicheMeta {
  nome: string
  slug: string
  icone: string
  emoji: string
  cor: string            // hex brand color suggestion
  descricao: string
  keywords: string[]     // SEO keywords for this niche
}

/* ─── Hero Preset ─── */

export interface HeroPreset {
  badge: string
  headline: string
  highlight: string
  ctaText: string
  imagemSugerida: string
  subheadline: string
}

/* ─── Seções do Site ─── */

export type SectionType =
  | "hero"
  | "trust_badges"
  | "servicos"
  | "sobre"
  | "antes_depois"
  | "depoimentos"
  | "faq"
  | "contato"
  | "agendamento"
  | "galeria"
  | "cases"
  | "areas_atuacao"
  | "conteudo"
  | "planos"
  | "jornada_tratamento"
  | "equipe"

export interface SectionConfig {
  type: SectionType
  enabled: boolean
  label: string
  order: number
  pro: boolean           // requires Pro plan?
  config?: Record<string, unknown>
}

/* ─── Módulos Especiais ─── */

export type ModuleType =
  | "before_after_gallery"
  | "case_list"
  | "treatment_journey"
  | "pricing_plans"
  | "content_hub"
  | "team_showcase"
  | "portfolio_grid"

export interface ModuloEspecial {
  type: ModuleType
  label: string
  descricao: string
  enabled: boolean
  pro: boolean
  icon: string
}

/* ─── Categorias + Serviços ─── */

export interface ServicoPreset {
  nome: string
  slug: string
  descricao: string
  duracao: number        // minutes
  preco: number
  imagem: string
  placeholder: string
  features?: string[]
  addons?: { nome: string; preco: number }[]
}

export interface CategoriaPreset {
  nome: string
  slug: string
  ordem: number
  servicos: ServicoPreset[]
}

/* ─── FAQ ─── */

export interface FAQItem {
  pergunta: string
  resposta: string
}

/* ─── Dashboard Widgets ─── */

export interface DashboardWidget {
  type: string
  label: string
  descricao: string
  enabled: boolean
  pro: boolean
  icon: string
}

/* ─── Funcionalidades Pro ─── */

export interface FuncionalidadePro {
  id: string
  nome: string
  descricao: string
  icone: string
  ativa: boolean
  categoria: "conversao" | "gestao" | "marketing" | "analytics"
}

/* ─── Trust Badges ─── */

export interface TrustBadgePreset {
  texto: string
  icone: string          // lucide icon name
}

/* ─── Copy / Voz ─── */

export interface CopyVoz {
  tom: string            // e.g. "Sofisticado e acolhedor"
  exemplosCTA: string[]
  fraseImpacto: string
}

/* ─── Árvore Completa ─── */

export interface ArvoreSegmento {
  version: string        // schema version
  meta: NicheMeta
  heroPreset: HeroPreset
  secoes: SectionConfig[]
  modulosEspeciais: ModuloEspecial[]
  categorias: CategoriaPreset[]
  faqSugerida: FAQItem[]
  dashboardWidgets: DashboardWidget[]
  funcionalidadesPro: FuncionalidadePro[]
  trustBadges: TrustBadgePreset[]
  copyVoz: CopyVoz
}
