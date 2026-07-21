import { DashboardContent } from "@/app/[tenant]/dashboard/dashboard-content"
import { demoTenant, demoStats, demoFunilData, demoProjetosChart, demoAgenda, demoRecentLeads } from "@/lib/demo-data"

export default function DemoDashboardPage() {
  return (
    <DashboardContent
      tenantName={demoTenant.name}
      stats={demoStats}
      funilData={demoFunilData}
      projetosChart={demoProjetosChart}
      agenda={demoAgenda}
      recentLeads={demoRecentLeads}
    />
  )
}
