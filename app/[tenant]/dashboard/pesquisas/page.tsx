import { getTenantBySlug } from "@/lib/actions/tenant"
import { getPesquisas } from "@/lib/actions/pesquisas"
import { notFound } from "next/navigation"
import { PesquisasPageContent } from "./pesquisas-content"

export default async function PesquisasPage({ params }: { params: { tenant: string } }) {
  const { tenant: slug } = await params
  const tenantData = await getTenantBySlug(slug)
  if (!tenantData) return notFound()

  const data = await getPesquisas(tenantData.id)
  return <PesquisasPageContent tenantId={tenantData.id} tenantSlug={slug} initialData={data} />
}
