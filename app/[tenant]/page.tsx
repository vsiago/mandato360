import { getTenantBySlug } from "@/lib/actions/tenant";
import LandingContent from "./landing-content";
import { 
  configuracaoVereador, 
  projetosLei, 
  leisAprovadas, 
  publicacoes, 
  indicacoes, 
  bairros 
} from "@/lib/mock-data";
import { notFound } from "next/navigation";

export default async function LandingPage({ params }: { params: { tenant: string } }) {
  const { tenant: slug } = await params;
  
  // Try to fetch real tenant data
  const tenant = await getTenantBySlug(slug);
  
  // If no tenant found in DB, and it's not the mock-demo "vereador", we could 404
  // But for now, let's fallback to mock data if slug is "vereador" or not found
  if (!tenant && slug !== "vereador") {
    // In production, we might want to return notFound()
    // return notFound();
  }

  // Combine real data with mocks for now
  const initialData = {
    config: configuracaoVereador,
    projetosLei,
    leisAprovadas,
    publicacoes,
    indicacoes,
    bairros
  };

  return <LandingContent tenant={tenant} initialData={initialData} />;
}
