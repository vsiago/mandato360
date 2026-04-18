"use server"

import { db } from "@/lib/db";
import { pesquisa, pesquisaResposta, type PesquisaPergunta } from "@/lib/db/schema";
import { eq, desc, count } from "drizzle-orm";

export async function getPesquisas(tenantId: string) {
  return await db.query.pesquisa.findMany({
    where: eq(pesquisa.tenantId, tenantId),
    orderBy: desc(pesquisa.createdAt),
  });
}

export async function getPesquisaById(id: string) {
  return await db.query.pesquisa.findFirst({
    where: eq(pesquisa.id, id),
    with: { respostas: true },
  });
}

export async function getPesquisaPublica(id: string) {
  const result = await db.query.pesquisa.findFirst({
    where: eq(pesquisa.id, id),
  });
  if (!result || !result.publica || result.status !== "ativa") return null;
  return result;
}

export async function createPesquisa(data: {
  tenantId: string;
  titulo: string;
  descricao?: string;
  perguntas?: PesquisaPergunta[];
  publica?: boolean;
}) {
  try {
    const [result] = await db.insert(pesquisa).values(data).returning();
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao criar pesquisa." };
  }
}

export async function updatePesquisa(id: string, data: Partial<{
  titulo: string;
  descricao: string;
  status: "rascunho" | "ativa" | "encerrada";
  publica: boolean;
  perguntas: PesquisaPergunta[];
}>) {
  try {
    const [result] = await db.update(pesquisa).set({ ...data, updatedAt: new Date() }).where(eq(pesquisa.id, id)).returning();
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao atualizar pesquisa." };
  }
}

export async function deletePesquisa(id: string) {
  try {
    await db.delete(pesquisaResposta).where(eq(pesquisaResposta.pesquisaId, id));
    await db.delete(pesquisa).where(eq(pesquisa.id, id));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao excluir pesquisa." };
  }
}

export async function submitPesquisaResposta(data: {
  pesquisaId: string;
  respostas: Record<string, string | string[]>;
  respondente?: string;
  telefone?: string;
}) {
  try {
    const [result] = await db.insert(pesquisaResposta).values(data).returning();
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao enviar resposta." };
  }
}

export async function getRespostasCount(pesquisaId: string) {
  const result = await db.select({ count: count() }).from(pesquisaResposta).where(eq(pesquisaResposta.pesquisaId, pesquisaId));
  return result[0].count;
}
