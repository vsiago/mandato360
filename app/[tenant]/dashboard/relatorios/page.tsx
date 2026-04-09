import { getTenantBySlug } from "@/lib/actions/tenant"
import { getDashboardStats, getLeadsByFunil, getProjetosStatusChart } from "@/lib/actions/dashboard-stats"
import { notFound } from "next/navigation"
import { RelatoriosContent } from "./relatorios-content"

export default async function RelatoriosPage({ params }: { params: { tenant: string } }) {
  const { tenant: slug } = await params
  const tenantData = await getTenantBySlug(slug)
  if (!tenantData) return notFound()

  const [stats, funilData, projetosChart] = await Promise.all([
    getDashboardStats(tenantData.id),
    getLeadsByFunil(tenantData.id),
    getProjetosStatusChart(tenantData.id),
  ])

  return <RelatoriosContent tenantName={tenantData.name} stats={stats} funilData={funilData} projetosChart={projetosChart} />
}
