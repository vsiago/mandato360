import { getTenantBySlug } from "@/lib/actions/tenant"
import { getEleitoresByTenant } from "@/lib/actions/eleitores"
import { getBairros } from "@/lib/actions/bairros"
import { notFound } from "next/navigation"
import { EleitoresPageContent } from "./eleitores-content"

export default async function EleitoresPage({ params }: { params: { tenant: string } }) {
  const { tenant: slug } = await params
  const tenantData = await getTenantBySlug(slug)
  if (!tenantData) return notFound()

  // getEleitoresByTenant recebe slug
  // getBairros recebe tenantId
  const [eleitores, bairros] = await Promise.all([
    getEleitoresByTenant(slug),
    getBairros(tenantData.id),
  ])

  return (
    <EleitoresPageContent 
      tenantId={tenantData.id} 
      tenantSlug={slug}
      initialData={eleitores} 
      bairros={bairros} 
    />
  )
}
