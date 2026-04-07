"use server"

import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getEleitoresByTenant(tenantSlug: string) {
  try {
    const tenantResult = await db.query.tenant.findFirst({
      where: eq(schema.tenant.slug, tenantSlug),
    });

    if (!tenantResult) return [];

    const result = await db.query.eleitor.findMany({
      where: eq(schema.eleitor.tenantId, tenantResult.id),
      orderBy: [desc(schema.eleitor.createdAt)],
      with: {
        demandas: true,
      }
    });

    // Mapear para o formato esperado pelo frontend
    return result.map(e => ({
      id: e.id,
      nome: e.nome,
      email: e.email || "",
      telefone: e.telefone || "",
      bairro: e.bairro,
      dataCadastro: e.createdAt.toISOString(),
      totalSolicitacoes: e.demandas.length,
      statusRelacionamento: e.statusRelacionamento,
      observacoes: e.observacoes || "",
      demandas: e.demandas.map(d => ({
        id: d.id,
        tipo: d.tipo,
        descricao: d.descricao,
        data: d.data.toISOString(),
        status: d.status,
      })),
    }));
  } catch (error) {
    console.error("Error fetching eleitores:", error);
    return [];
  }
}

export async function getEleitorWithDemandas(eleitorId: string) {
  try {
    const result = await db.query.eleitor.findFirst({
      where: eq(schema.eleitor.id, eleitorId as any),
      with: {
        demandas: true,
      }
    });
    return result;
  } catch (error) {
    console.error("Error fetching eleitor details:", error);
    return null;
  }
}

export async function updateEleitor(id: string, data: Partial<typeof schema.eleitor.$inferInsert>) {
  try {
    await db.update(schema.eleitor)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.eleitor.id, id as any));
    
    revalidatePath("/[tenant]/dashboard/eleitores", "page");
    return { success: true };
  } catch (error) {
    console.error("Error updating eleitor:", error);
    return { success: false, error: "Erro ao atualizar eleitor" };
  }
}

export async function createEleitor(tenantSlug: string, data: Omit<typeof schema.eleitor.$inferInsert, "id" | "tenantId">) {
  try {
    const tenantResult = await db.query.tenant.findFirst({
      where: eq(schema.tenant.slug, tenantSlug),
    });

    if (!tenantResult) throw new Error("Tenant not found");

    const [inserted] = await db.insert(schema.eleitor).values({
      ...data,
      tenantId: tenantResult.id,
    }).returning();

    revalidatePath("/[tenant]/dashboard/eleitores", "page");
    return { success: true, data: inserted };
  } catch (error) {
    console.error("Error creating eleitor:", error);
    return { success: false, error: "Erro ao criar eleitor" };
  }
}
