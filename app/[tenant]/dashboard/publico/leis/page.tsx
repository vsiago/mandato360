import { getTenantBySlug } from "@/lib/actions/tenant"
import { getLegislativo } from "@/lib/actions/legislativo"
import { notFound } from "next/navigation"
import { LeisPageContent } from "./leis-content"

export default async function LeisPage({ params }: { params: { tenant: string } }) {
  const { tenant: slug } = await params
  const tenantData = await getTenantBySlug(slug)
  if (!tenantData) return notFound()

  const data = await getLegislativo(tenantData.id, "projeto_lei")
  return <LeisPageContent tenantId={tenantData.id} initialData={data} />
}
