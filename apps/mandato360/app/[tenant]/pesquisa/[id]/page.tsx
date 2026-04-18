import { getPesquisaPublica } from "@/lib/actions/pesquisas"
import { getTenantBySlug } from "@/lib/actions/tenant"
import { notFound } from "next/navigation"
import { PesquisaPublicaContent } from "./pesquisa-publica-content"

export default async function PesquisaPublicaPage({ params }: { params: { tenant: string; id: string } }) {
  const { tenant: slug, id } = await params
  const tenantData = await getTenantBySlug(slug)
  if (!tenantData) return notFound()

  const pesquisa = await getPesquisaPublica(id)
  if (!pesquisa) return notFound()

  return (
    <PesquisaPublicaContent
      pesquisa={pesquisa as any}
      primaryColor={tenantData.primaryColor || "#0F2B5B"}
    />
  )
}
