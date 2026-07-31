/**
 * Security utilities for Authorization & RBAC
 * Integrates with Better Auth sessions
 */

import { headers } from "next/headers";
import { db } from "./db";
import { and, eq } from "drizzle-orm";
import * as schema from "./db/schema";

export type UserRole = "admin" | "assessor" | "readonly" | "user";

export interface AuthContext {
  userId: string;
  email: string;
  role: UserRole;
  tenantId: string | null;
  tenantIds: string[]; // All tenants user has access to
}

/**
 * Get current user session from Better Auth
 * ⚠️ MUST be called only in Server Components or Server Actions
 */
export async function getSession() {
  try {
    const headersList = await headers();
    const cookie = headersList.get("cookie") || "";

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/get-session`,
      {
        headers: { cookie },
        cache: "no-store",
      }
    );

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("[Auth] Failed to get session:", error);
    return null;
  }
}

/**
 * Get authenticated user context with tenant information
 * Throws error if user is not authenticated
 */
export async function getAuthContext(): Promise<AuthContext> {
  const session = await getSession();

  if (!session?.user) {
    throw new Error("Unauthorized: No active session");
  }

  const user = session.user;

  // Tenants aos quais este usuario esta efetivamente vinculado.
  const vinculos = await db.query.tenantMember.findMany({
    where: eq(schema.tenantMember.userId, user.id),
    columns: { tenantId: true },
  });

  return {
    userId: user.id,
    email: user.email,
    role: (user.role as UserRole) || "user",
    tenantId: null, // definido por validateTenantAccess conforme o contexto
    tenantIds: vinculos.map((v) => v.tenantId),
  };
}

/** Papel dentro do tenant -> nivel na hierarquia de permissao. */
const NIVEL_POR_PAPEL_NO_TENANT: Record<string, number> = {
  owner: 3, // dono do mandato
  admin: 3,
  staff: 2, // assessor
};

const NIVEL_MINIMO: Record<UserRole, number> = {
  admin: 3,
  assessor: 2,
  readonly: 1,
  user: 0,
};

/**
 * Validate that user has access to a specific tenant
 * Throws error if access is denied
 */
export async function validateTenantAccess(
  tenantId: string,
  minRole: UserRole = "readonly"
): Promise<AuthContext> {
  const auth = await getAuthContext();

  if (!tenantId) {
    throw new Error("Invalid tenant ID");
  }

  const tenant = await db.query.tenant.findFirst({
    where: eq(schema.tenant.id, tenantId as any),
  });

  if (!tenant) {
    throw new Error("Tenant not found");
  }

  // Admin da plataforma (role global) atravessa qualquer tenant — e o que
  // sustenta as telas /master. Todo o resto precisa de vinculo explicito.
  if (auth.role === "admin") {
    return { ...auth, tenantId };
  }

  const vinculo = await db.query.tenantMember.findFirst({
    where: and(
      eq(schema.tenantMember.userId, auth.userId),
      eq(schema.tenantMember.tenantId, tenantId as any)
    ),
  });

  if (!vinculo) {
    throw new Error("Access denied to this tenant");
  }

  const nivelDoUsuario = NIVEL_POR_PAPEL_NO_TENANT[vinculo.role ?? "staff"] ?? 0;
  if (nivelDoUsuario < NIVEL_MINIMO[minRole]) {
    throw new Error(`Insufficient permissions. Required: ${minRole}`);
  }

  return { ...auth, tenantId };
}

/**
 * Autoriza a partir do PROPRIO registro, quando a action so recebe o `id`.
 * Busca o dono do registro e valida o acesso aquele tenant — impedindo que
 * alguem edite/apague dado de outro mandato so por conhecer o UUID.
 */
export async function validateOwnership<T extends { tenantId: string }>(
  registro: T | undefined | null,
  minRole: UserRole = "assessor"
): Promise<T> {
  if (!registro) {
    throw new Error("Registro nao encontrado");
  }
  await validateTenantAccess(registro.tenantId, minRole);
  return registro;
}

/**
 * Safe wrapper for server actions with automatic authorization
 */
export async function withAuth<T>(
  handler: (auth: AuthContext) => Promise<T>,
  minRole?: UserRole
): Promise<T> {
  try {
    const auth = await getAuthContext();
    if (minRole && !canAccess(auth.role, minRole)) {
      throw new Error(`Insufficient permissions. Required: ${minRole}`);
    }
    return await handler(auth);
  } catch (error) {
    console.error("[Auth Error]", error);
    throw error;
  }
}

/**
 * Check if user role has required permission level
 */
function canAccess(userRole: UserRole, requiredRole: UserRole): boolean {
  const hierarchy: Record<UserRole, number> = {
    admin: 3,
    assessor: 2,
    readonly: 1,
    user: 0,
  };

  return hierarchy[userRole] >= hierarchy[requiredRole];
}

/**
 * Verify user is authenticated (quick check)
 */
export async function ensureAuthenticated() {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session.user;
}
