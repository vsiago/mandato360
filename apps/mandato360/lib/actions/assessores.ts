"use server"

import { db } from "@/lib/db";
import { assessor } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { validateTenantAccess } from "@/lib/auth-utils";
import { checkRateLimit, rateLimitPresets } from "@/lib/rate-limit";

export async function getAssessores(tenantId: string) {
  try {
    // ✅ SECURITY: Validate tenant access
    await validateTenantAccess(tenantId, "readonly");

    // ✅ SECURITY: Rate limiting
    await checkRateLimit(rateLimitPresets.api);

    return await db.query.assessor.findMany({
      where: eq(assessor.tenantId, tenantId),
      orderBy: desc(assessor.createdAt),
    });
  } catch (error) {
    console.error("Error fetching assessores:", error);
    throw error;
  }
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
    // ✅ SECURITY: Validate tenant access (requires assessor role)
    await validateTenantAccess(data.tenantId, "assessor");

    // ✅ SECURITY: Rate limiting
    await checkRateLimit(rateLimitPresets.form);

    const [result] = await db.insert(assessor).values(data).returning();
    return { success: true, data: result };
  } catch (error: any) {
    console.error("[createAssessor Error]", error);
    return { success: false, error: error.message || "Erro ao criar assessor." };
  }
}

export async function updateAssessor(
  id: string,
  tenantId: string,
  data: Partial<{
    nome: string;
    cargo: string;
    email: string;
    telefone: string;
    bairroAtuacao: string;
    status: "ativo" | "inativo";
  }>
) {
  try {
    // ✅ SECURITY: Validate tenant access
    await validateTenantAccess(tenantId, "assessor");

    // ✅ SECURITY: Rate limiting
    await checkRateLimit(rateLimitPresets.form);

    // ✅ SECURITY: Verify assessor belongs to tenant
    const existingAssessor = await db.query.assessor.findFirst({
      where: and(eq(assessor.id, id), eq(assessor.tenantId, tenantId)),
    });

    if (!existingAssessor) {
      throw new Error("Assessor not found or access denied");
    }

    const [result] = await db
      .update(assessor)
      .set(data)
      .where(and(eq(assessor.id, id), eq(assessor.tenantId, tenantId)))
      .returning();
    return { success: true, data: result };
  } catch (error: any) {
    console.error("[updateAssessor Error]", error);
    return { success: false, error: error.message || "Erro ao atualizar assessor." };
  }
}

export async function deleteAssessor(id: string, tenantId: string) {
  try {
    // ✅ SECURITY: Validate tenant access (requires admin role)
    await validateTenantAccess(tenantId, "admin");

    // ✅ SECURITY: Rate limiting
    await checkRateLimit(rateLimitPresets.form);

    // ✅ SECURITY: Verify assessor belongs to tenant
    const existingAssessor = await db.query.assessor.findFirst({
      where: and(eq(assessor.id, id), eq(assessor.tenantId, tenantId)),
    });

    if (!existingAssessor) {
      throw new Error("Assessor not found or access denied");
    }

    await db
      .delete(assessor)
      .where(and(eq(assessor.id, id), eq(assessor.tenantId, tenantId)));
    return { success: true };
  } catch (error: any) {
    console.error("[deleteAssessor Error]", error);
    return { success: false, error: error.message || "Erro ao excluir assessor." };
  }
}
