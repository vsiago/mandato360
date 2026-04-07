"use server"

import { db } from "@/lib/db";
import { tenant, tenantMember, user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getTenantBySlug(slug: string) {
  try {
    console.time(`getTenantBySlug:${slug}`);
    const result = await db.query.tenant.findFirst({
      where: eq(tenant.slug, slug),
    });
    console.timeEnd(`getTenantBySlug:${slug}`);
    return result;
  } catch (error) {
    console.error("Error fetching tenant:", error);
    return null;
  }
}

export async function getAllTenants() {
  return await db.query.tenant.findMany();
}

export async function createTenant(data: { name: string; slug: string; config?: string }) {
  try {
    const result = await db.insert(tenant).values({
      name: data.name,
      slug: data.slug,
      config: data.config,
      updatedAt: new Date(),
    }).returning();
    
    return { success: true, data: result[0] };
  } catch (error: any) {
    console.error("Error creating tenant:", error);
    if (error.code === '23505') {
      return { success: false, error: "Este slug já está em uso." };
    }
    return { success: false, error: "Erro ao criar mandato." };
  }
}export async function createTenantWithOwner(data: { 
  name: string; 
  slug: string; 
  config?: string;
  ownerName: string;
  ownerEmail: string;
  ownerPassword: string;
}) {
  try {
    return await db.transaction(async (tx) => {
      // 1. Create Tenant
      const [newTenant] = await tx.insert(tenant).values({
        name: data.name,
        slug: data.slug,
        config: data.config,
        updatedAt: new Date(),
      }).returning();

      // 2. Create User via Better Auth
      // Note: Since this is an admin action, we use the internal API
      const result = await auth.api.signUpEmail({
        body: {
          email: data.ownerEmail,
          password: data.ownerPassword,
          name: data.ownerName,
        },
        headers: await headers()
      }).catch(err => {
        console.error("Better Auth Error:", err);
        throw new Error(err.message || "Erro ao criar usuário proprietário.");
      });

      if (!result || !result.user) {
        throw new Error("Falha ao criar usuário proprietário.");
      }

      // 3. Create Tenant Membership as Owner
      await tx.insert(tenantMember).values({
        tenantId: newTenant.id,
        userId: result.user.id,
        role: "owner",
      });

      return { success: true, data: { tenant: newTenant, user: result.user } };
    });
  } catch (error: any) {
    console.error("Error creating tenant and owner:", error);
    if (error.code === '23505') {
      if (error.constraint_name?.includes('tenant_slug_key')) {
        return { success: false, error: "Este slug já está em uso." };
      }
      if (error.constraint_name?.includes('user_email_key')) {
        return { success: false, error: "Este e-mail já está em uso." };
      }
    }
    return { success: false, error: error.message || "Erro ao processar cadastro." };
  }
}
