"use server"

import { db } from "@/lib/db";
import { bairro } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getBairros(tenantId: string) {
  return await db.query.bairro.findMany({
    where: eq(bairro.tenantId, tenantId),
    orderBy: bairro.nome,
  });
}

export async function createBairro(data: { tenantId: string; nome: string; zona?: string; observacoes?: string }) {
  try {
    const [result] = await db.insert(bairro).values(data).returning();
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao criar bairro." };
  }
}

export async function updateBairro(id: string, data: { nome?: string; zona?: string; observacoes?: string }) {
  try {
    const [result] = await db.update(bairro).set(data).where(eq(bairro.id, id)).returning();
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao atualizar bairro." };
  }
}

export async function deleteBairro(id: string) {
  try {
    await db.delete(bairro).where(eq(bairro.id, id));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao excluir bairro." };
  }
}
