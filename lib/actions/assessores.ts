"use server"

import { db } from "@/lib/db";
import { assessor } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getAssessores(tenantId: string) {
  return await db.query.assessor.findMany({
    where: eq(assessor.tenantId, tenantId),
    orderBy: desc(assessor.createdAt),
  });
}

export async function createAssessor(data: {
  tenantId: string;
  nome: string;
  cargo?: string;
  email?: string;
  telefone?: string;
  bairroAtuacao?: string;
  userId?: string;
}) {
  try {
    const [result] = await db.insert(assessor).values(data).returning();
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao criar assessor." };
  }
}

export async function updateAssessor(id: string, data: Partial<{
  nome: string;
  cargo: string;
  email: string;
  telefone: string;
  bairroAtuacao: string;
  status: "ativo" | "inativo";
}>) {
  try {
    const [result] = await db.update(assessor).set(data).where(eq(assessor.id, id)).returning();
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao atualizar assessor." };
  }
}

export async function deleteAssessor(id: string) {
  try {
    await db.delete(assessor).where(eq(assessor.id, id));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao excluir assessor." };
  }
}
