import { NextResponse } from 'next/server';
import { buildTenantConfig } from "@/lib/tenant-config-builder";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const slug = url.searchParams.get('slug');
  
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  // 1. Fetch Tenant Configuration
  const config = await buildTenantConfig(slug);
  
  // 2. Define Fallbacks for Agenda Online Brand
  const fallback = {
    name: "Agenda Online",
    short_name: "Agenda",
    theme_color: "#121212",
    primary_color: "#D4AF37",
    icon_url: "/logo-agenda-online-icon.svg",
    icon_url_large: "/logo-agenda-online-icon.svg",
  };

  if (!config) {
    return NextResponse.json(generateManifest(fallback, slug));
  }

  // 3. Extract Tenant Branding
  const tenant = {
    name: config.branding.name || fallback.name,
    short_name: config.branding.name?.split(' ')[0] || fallback.short_name,
    theme_color: config.branding.headerBgColor || fallback.theme_color,
    primary_color: config.branding.primaryColor || fallback.primary_color,
    // Use logoUrl or avatarUrl as icons
    icon_url: config.branding.logoUrl || config.branding.avatarUrl || fallback.icon_url,
    icon_url_large: config.branding.logoUrl || config.branding.avatarUrl || fallback.icon_url_large,
  };

  return NextResponse.json(generateManifest(tenant, slug));
}

function generateManifest(tenant: any, slug: string) {
  return {
    name: tenant.name,
    short_name: tenant.short_name,
    description: "Agendamento online e gestão profissional.",
    start_url: `/${slug}`,
    display: "standalone",
    background_color: tenant.theme_color,
    theme_color: tenant.primary_color,
    icons: [
      {
        src: tenant.icon_url,
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: tenant.icon_url_large,
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable"
      }
    ]
  };
}
