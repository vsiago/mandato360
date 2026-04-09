import { getTenantBySlug } from "@/lib/actions/tenant"
import { getLegislativo } from "@/lib/actions/legislativo"
import { notFound } from "next/navigation"
import { LeisPageContent } from "../leis/leis-content"

export default async function IndicacoesPage({ params }: { params: { tenant: string } }) {
  const { tenant: slug } = await params
  const tenantData = await getTenantBySlug(slug)
  if (!tenantData) return notFound()

  const data = await getLegislativo(tenantData.id, "indicacao")
  // Reuse Leis content component but for "indicacao" type
  return <LeisPageContent tenantId={tenantData.id} initialData={data} />
}
