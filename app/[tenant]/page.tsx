import { getTenantBySlug } from "@/lib/actions/tenant";
import { getLegislativo } from "@/lib/actions/legislativo";
import { getAgendasPublicas } from "@/lib/actions/agenda";
import LandingContent from "./landing-content";
import { notFound } from "next/navigation";

export default async function LandingPage({ params }: { params: { tenant: string } }) {
  const { tenant: slug } = await params;

  // Ignore system assets and reserved words
  const isAsset = slug.includes(".") || slug === "favicon.ico" || slug === "master";
  if (isAsset) {
    return notFound();
  }
  
  const tenant = await getTenantBySlug(slug);
  
  if (!tenant && slug !== "vereador") {
    // Allow demo slug "vereador" even without DB
  }

  // Fetch real data from DB
  const [projetosLei, indicacoes, agenda] = tenant ? await Promise.all([
    getLegislativo(tenant.id, "projeto_lei"),
    getLegislativo(tenant.id, "indicacao"),
    getAgendasPublicas(tenant.id),
  ]) : [[], [], []];

  const initialData = {
    projetosLei: projetosLei.filter((p: any) => p.visivelLanding !== false),
    indicacoes: indicacoes.filter((i: any) => i.visivelLanding !== false),
    agenda,
  };

  return (
    <LandingContent tenant={tenant} initialData={initialData} />
  );
}
