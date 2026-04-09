import { getTenantBySlug } from "@/lib/actions/tenant"
import { getDashboardStats, getLeadsByFunil, getProjetosStatusChart, getUpcomingAgenda, getRecentLeads } from "@/lib/actions/dashboard-stats"
import { notFound } from "next/navigation"
import { DashboardContent } from "./dashboard-content"

export default async function DashboardPage({ params }: { params: { tenant: string } }) {
  const { tenant: slug } = await params
  const tenantData = await getTenantBySlug(slug)
  if (!tenantData) return notFound()

  const [stats, funilData, projetosChart, agenda, recentLeads] = await Promise.all([
    getDashboardStats(tenantData.id),
    getLeadsByFunil(tenantData.id),
    getProjetosStatusChart(tenantData.id),
    getUpcomingAgenda(tenantData.id, 5),
    getRecentLeads(tenantData.id, 5),
  ])

  return (
    <DashboardContent
      tenantName={tenantData.name}
      stats={stats}
      funilData={funilData}
      projetosChart={projetosChart}
      agenda={agenda}
      recentLeads={recentLeads}
    />
  )
}
