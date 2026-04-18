import { getTenantBySlug } from "@/lib/actions/tenant";
import { notFound } from "next/navigation";
import TenantLoginForm from "./login-form";

export default async function TenantLoginPage({ params }: { params: { tenant: string } }) {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);

  if (!tenant) {
    return notFound();
  }

  return <TenantLoginForm tenant={tenant} />;
}
