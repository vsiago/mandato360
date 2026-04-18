"use server"

import { db } from "@/lib/db";
import { indicacaoPopular } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";

export async function getIndicacoesPopulares(tenantId: string) {
  return await db.query.indicacaoPopular.findMany({
    where: eq(indicacaoPopular.tenantId, tenantId),
    orderBy: desc(indicacaoPopular.createdAt),
    with: {
      liderancaRef: true,
      bairroRef: true,
    },
  });
}

export async function getIndicacoesByLideranca(liderancaId: string) {
  return await db.query.indicacaoPopular.findMany({
    where: eq(indicacaoPopular.liderancaId, liderancaId),
    orderBy: desc(indicacaoPopular.createdAt),
    with: { bairroRef: true },
  });
}

export async function createIndicacaoPopular(data: {
  tenantId: string;
  liderancaId?: string;
  bairroId?: string;
  descricao: string;
  tipo?: string;
  observacoes?: string;
}) {
  try {
    const [result] = await db.insert(indicacaoPopular).values(data).returning();
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao criar indicação." };
  }
}

export async function updateIndicacaoPopular(id: string, data: Partial<{
  descricao: string;
  tipo: string;
  status: "pendente" | "analise" | "encaminhada" | "resolvida" | "rejeitada";
  observacoes: string;
  liderancaId: string;
  bairroId: string;
}>) {
  try {
    const [result] = await db.update(indicacaoPopular).set({ ...data, updatedAt: new Date() }).where(eq(indicacaoPopular.id, id)).returning();
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao atualizar indicação." };
  }
}

export async function deleteIndicacaoPopular(id: string) {
  try {
    await db.delete(indicacaoPopular).where(eq(indicacaoPopular.id, id));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao excluir indicação." };
  }
}
