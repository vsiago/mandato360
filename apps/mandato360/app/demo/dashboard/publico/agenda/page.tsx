import { AgendaPageContent } from "@/app/[tenant]/dashboard/publico/agenda/agenda-content"
import { demoTenant, demoAgenda } from "@/lib/demo-data"

export default function DemoAgendaPage() {
  return (
    <AgendaPageContent
      tenantId={demoTenant.id}
      initialData={demoAgenda}
    />
  )
}
