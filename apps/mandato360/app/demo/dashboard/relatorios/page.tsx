import { RelatoriosContent } from "@/app/[tenant]/dashboard/relatorios/relatorios-content"
import { demoTenant, demoStats, demoFunilData, demoProjetosChart } from "@/lib/demo-data"

export default function DemoRelatoriosPage() {
  return (
    <RelatoriosContent
      tenantName={demoTenant.name}
      stats={demoStats}
      funilData={demoFunilData}
      projetosChart={demoProjetosChart}
    />
  )
}
