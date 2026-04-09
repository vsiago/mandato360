import { getTenantBySlug } from "@/lib/actions/tenant"
import { getAssessores } from "@/lib/actions/assessores"
import { notFound } from "next/navigation"
import { AssessoresPageContent } from "./assessores-content"

export default async function AssessoresPage({ params }: { params: { tenant: string } }) {
  const { tenant: slug } = await params
  const tenantData = await getTenantBySlug(slug)
  if (!tenantData) return notFound()

  const data = await getAssessores(tenantData.id)
  return <AssessoresPageContent tenantId={tenantData.id} initialData={data} />
}
