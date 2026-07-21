"use server"

import { db } from "@/lib/db";
import { lideranca } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { validateTenantAccess } from "@/lib/auth-utils";
import { checkRateLimit, rateLimitPresets } from "@/lib/rate-limit";

export async function getLiderancas(tenantId: string) {
  try {
    // ✅ SECURITY: Validate tenant access
    await validateTenantAccess(tenantId, "readonly");

    // ✅ SECURITY: Rate limiting
    await checkRateLimit(rateLimitPresets.api);

    return await db.query.lideranca.findMany({
      where: eq(lideranca.tenantId, tenantId),
      orderBy: desc(lideranca.createdAt),
      with: {
        // bairroRef: true,
        leads: true,
        indicacoes: true,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar lideranças:", error);
    throw error;
  }
}

export async function getLiderancaById(id: string, tenantId: string) {
  try {
    // ✅ SECURITY: Validate tenant access
    await validateTenantAccess(tenantId, "readonly");

    // ✅ SECURITY: Rate limiting
    await checkRateLimit(rateLimitPresets.api);

    const result = await db.query.lideranca.findFirst({
      where: and(eq(lideranca.id, id), eq(lideranca.tenantId, tenantId)),
      with: {
        // bairroRef: true,
        leads: true,
        indicacoes: true
      },
    });

    if (!result) {
      throw new Error("Liderança not found or access denied");
    }

    return result;
  } catch (error) {
    console.error("Erro ao buscar liderança por ID:", error);
    throw error;
  }
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
    // ✅ SECURITY: Validate tenant access (requires assessor role)
    await validateTenantAccess(data.tenantId, "assessor");

    // ✅ SECURITY: Rate limiting
    await checkRateLimit(rateLimitPresets.form);

    const [result] = await db.insert(lideranca).values(data).returning();
    return { success: true, data: result };
  } catch (error: any) {
    console.error("[createLideranca Error]", error);
    return { success: false, error: error.message || "Erro ao criar liderança." };
  }
}

export async function updateLideranca(
  id: string,
  tenantId: string,
  data: Partial<{
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
  }>
) {
  try {
    // ✅ SECURITY: Validate tenant access
    await validateTenantAccess(tenantId, "assessor");

    // ✅ SECURITY: Rate limiting
    await checkRateLimit(rateLimitPresets.form);

    // ✅ SECURITY: Verify lideranca belongs to tenant
    const existingLideranca = await db.query.lideranca.findFirst({
      where: and(eq(lideranca.id, id), eq(lideranca.tenantId, tenantId)),
    });

    if (!existingLideranca) {
      throw new Error("Liderança not found or access denied");
    }

    const [result] = await db
      .update(lideranca)
      .set(data)
      .where(and(eq(lideranca.id, id), eq(lideranca.tenantId, tenantId)))
      .returning();
    return { success: true, data: result };
  } catch (error: any) {
    console.error("[updateLideranca Error]", error);
    return { success: false, error: error.message || "Erro ao atualizar liderança." };
  }
}

export async function deleteLideranca(id: string, tenantId: string) {
  try {
    // ✅ SECURITY: Validate tenant access (requires admin role)
    await validateTenantAccess(tenantId, "admin");

    // ✅ SECURITY: Rate limiting
    await checkRateLimit(rateLimitPresets.form);

    // ✅ SECURITY: Verify lideranca belongs to tenant
    const existingLideranca = await db.query.lideranca.findFirst({
      where: and(eq(lideranca.id, id), eq(lideranca.tenantId, tenantId)),
    });

    if (!existingLideranca) {
      throw new Error("Liderança not found or access denied");
    }

    await db
      .delete(lideranca)
      .where(and(eq(lideranca.id, id), eq(lideranca.tenantId, tenantId)));
    return { success: true };
  } catch (error: any) {
    console.error("[deleteLideranca Error]", error);
    return { success: false, error: error.message || "Erro ao excluir liderança." };
  }
}
