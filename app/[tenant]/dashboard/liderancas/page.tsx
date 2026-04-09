import { getTenantBySlug } from "@/lib/actions/tenant"
import { getLiderancas } from "@/lib/actions/liderancas"
import { getBairros } from "@/lib/actions/bairros"
import { notFound } from "next/navigation"
import { LiderancasPageContent } from "./liderancas-content"

export default async function LiderancasPage({ params }: { params: { tenant: string } }) {
  const { tenant: slug } = await params
  const tenantData = await getTenantBySlug(slug)
  if (!tenantData) return notFound()

  const [liderancas, bairros] = await Promise.all([
    getLiderancas(tenantData.id),
    getBairros(tenantData.id),
  ])

  return <LiderancasPageContent tenantId={tenantData.id} initialData={liderancas} bairros={bairros} />
}
