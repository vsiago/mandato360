"use server"

import { db } from "@/lib/db";
import { legislativo } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function getLegislativo(tenantId: string, tipo?: "projeto_lei" | "indicacao" | "lei_aprovada") {
  try {
    const conditions = [eq(legislativo.tenantId, tenantId)];
    if (tipo) conditions.push(eq(legislativo.tipo, tipo));

    return await db.query.legislativo.findMany({
      where: and(...conditions),
      orderBy: desc(legislativo.data),
    });
  } catch (error) {
    console.error("Erro ao buscar legislativo:", error);
    return [];
  }
}

export async function createLegislativo(data: {
  tenantId: string;
  tipo: "projeto_lei" | "indicacao" | "lei_aprovada";
  titulo: string;
  numero?: string;
  descricao?: string;
  status: "tramitando" | "aprovado" | "rejeitado" | "arquivado" | "pendente" | "concluido";
  data: Date;
  // visivelLanding?: boolean;
}) {
  const { visivelLanding, ...insertData } = data;
  try {
    const [result] = await db.insert(legislativo).values(insertData as any).returning();
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao criar item legislativo." };
  }
}

export async function updateLegislativo(id: string, data: Partial<{
  titulo: string;
  numero: string;
  descricao: string;
  status: "tramitando" | "aprovado" | "rejeitado" | "arquivado" | "pendente" | "concluido";
  data: Date;
  // visivelLanding: boolean;
}>) {
  try {
    const [result] = await db.update(legislativo).set(data).where(eq(legislativo.id, id)).returning();
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao atualizar item legislativo." };
  }
}

export async function deleteLegislativo(id: string) {
  try {
    await db.delete(legislativo).where(eq(legislativo.id, id));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao excluir item legislativo." };
  }
}

export async function toggleLegislativoVisibility(id: string, visivel: boolean) {
  try {
    // const [result] = await db.update(legislativo).set({ visivelLanding: visivel }).where(eq(legislativo.id, id)).returning();
    // return { success: true, data: result };
    return { success: false, error: "Funcionalidade desativada temporariamente (migração pendente)." };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao alterar visibilidade." };
  }
}
