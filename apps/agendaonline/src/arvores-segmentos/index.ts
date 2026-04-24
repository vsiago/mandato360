/**
 * Árvores de Segmentos — Index / Registry
 *
 * Importa todos os JSONs de nicho e exporta helpers para acesso.
 * Esta é a ÚNICA fonte de verdade para os presets de nicho.
 */

import type { ArvoreSegmento } from "./types"

import salaoDeBeleza from "./salao-de-beleza.json"
import barbearia from "./barbearia.json"
import studioDeEstetica from "./studio-de-estetica.json"
import clinicaDeEstetica from "./clinica-de-estetica.json"
import nailDesigner from "./nail-designer.json"
import studioDeSobrancelhas from "./studio-de-sobrancelhas.json"
import tatuagemEPiercing from "./tatuagem-e-piercing.json"
import massagemESpa from "./massagem-e-spa.json"
import petShop from "./pet-shop.json"
import healthFitness from "./health-fitness.json"
import educacaoEAulas from "./educacao-e-aulas.json"
import fotografia from "./fotografia.json"
import manutencaoEReparos from "./manutencao-e-reparos.json"
import outros from "./outros.json"

export const ARVORES_SEGMENTOS: Record<string, ArvoreSegmento> = {
  "salao-de-beleza": salaoDeBeleza as unknown as ArvoreSegmento,
  "barbearia": barbearia as unknown as ArvoreSegmento,
  "studio-de-estetica": studioDeEstetica as unknown as ArvoreSegmento,
  "clinica-de-estetica": clinicaDeEstetica as unknown as ArvoreSegmento,
  "nail-designer": nailDesigner as unknown as ArvoreSegmento,
  "studio-de-sobrancelhas": studioDeSobrancelhas as unknown as ArvoreSegmento,
  "tatuagem-e-piercing": tatuagemEPiercing as unknown as ArvoreSegmento,
  "massagem-e-spa": massagemESpa as unknown as ArvoreSegmento,
  "pet-shop": petShop as unknown as ArvoreSegmento,
  "health-fitness": healthFitness as unknown as ArvoreSegmento,
  "educacao-e-aulas": educacaoEAulas as unknown as ArvoreSegmento,
  "fotografia": fotografia as unknown as ArvoreSegmento,
  "manutencao-e-reparos": manutencaoEReparos as unknown as ArvoreSegmento,
  "outros": outros as unknown as ArvoreSegmento,
}

export function getArvoreBySlug(slug: string): ArvoreSegmento | null {
  return ARVORES_SEGMENTOS[slug] || null
}

export function getAllNichos() {
  return Object.values(ARVORES_SEGMENTOS).map((a) => ({
    nome: a.meta?.nome || "Sem Nome",
    slug: a.meta?.slug || "sem-slug",
    icone: a.meta?.icone || "❓",
    cor: a.meta?.cor || "#ccc",
    descricao: a.meta?.descricao || "",
    totalServicos: a.categorias?.reduce((acc, cat) => acc + (cat?.servicos?.length || 0), 0) || 0,
    totalSecoes: a.secoes?.filter((s) => s.enabled)?.length || 0,
    totalPro: a.funcionalidadesPro?.length || 0,
  }))
}

export function getNichoSlugs(): string[] {
  return Object.keys(ARVORES_SEGMENTOS)
}

export type { ArvoreSegmento } from "./types"
