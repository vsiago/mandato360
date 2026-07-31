import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { db } from "@/lib/db"
import { tenantMember, tenant } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }


  // O dono da plataforma vai para o painel administrativo, SEMPRE — mesmo
  // que por algum motivo esteja vinculado a um mandato. Checar o vinculo
  // antes disto jogava o superadmin no dashboard de um vereador.
  if (session.user.role === "admin") {
    redirect("/master/tenants")
  }

  // Demais usuarios: primeiro mandato ao qual pertencem.
  const member = await db
    .select({ slug: tenant.slug })
    .from(tenantMember)
    .innerJoin(tenant, eq(tenantMember.tenantId, tenant.id))
    .where(eq(tenantMember.userId, session.user.id))
    .limit(1)

  if (member.length > 0) {
    redirect(`/${member[0].slug}/dashboard`)
  }

  // Autenticado, mas sem mandato vinculado: nao ha para onde ir.
  redirect("/sem-acesso")
}
