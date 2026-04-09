"use server"

import { db } from "@/lib/db";
import { lideranca } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getLiderancas(tenantId: string) {
  return await db.query.lideranca.findMany({
    where: eq(lideranca.tenantId, tenantId),
    orderBy: desc(lideranca.createdAt),
    with: {
      bairroRef: true,
      leads: true,
      indicacoes: true,
    },
  });
}

export async function getLiderancaById(id: string) {
  return await db.query.lideranca.findFirst({
    where: eq(lideranca.id, id),
    with: { bairroRef: true, leads: true, indicacoes: true },
  });
}

export async function createLideranca(data: {
  tenantId: string;
  nome: string;
  telefone?: string;
  email?: string;
  cpf?: string;
  bairroId?: string;
  bairro?: string;
  tipo: "lider_comunitario" | "religioso" | "comerciante" | "sindico" | "presidente_associacao" | "outro";
  influenciaEstimada?: string;
  endereco?: string;
  anotacoes?: string;
}) {
  try {
    const [result] = await db.insert(lideranca).values(data).returning();
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao criar liderança." };
  }
}

export async function updateLideranca(id: string, data: Partial<{
  nome: string;
  telefone: string;
  email: string;
  cpf: string;
  bairroId: string;
  bairro: string;
  tipo: "lider_comunitario" | "religioso" | "comerciante" | "sindico" | "presidente_associacao" | "outro";
  influenciaEstimada: string;
  endereco: string;
  anotacoes: string;
}>) {
  try {
    const [result] = await db.update(lideranca).set(data).where(eq(lideranca.id, id)).returning();
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao atualizar liderança." };
  }
}

export async function deleteLideranca(id: string) {
  try {
    await db.delete(lideranca).where(eq(lideranca.id, id));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao excluir liderança." };
  }
}
