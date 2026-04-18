import { getTenantBySlug } from "@/lib/actions/tenant"
import { getBairros } from "@/lib/actions/bairros"
import { notFound } from "next/navigation"
import { BairrosPageContent } from "./bairros-content"

export default async function BairrosPage({ params }: { params: { tenant: string } }) {
  const { tenant: slug } = await params
  const tenantData = await getTenantBySlug(slug)
  if (!tenantData) return notFound()

  const data = await getBairros(tenantData.id)
  return <BairrosPageContent tenantId={tenantData.id} initialData={data} />
}
