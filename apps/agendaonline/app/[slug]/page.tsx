import { notFound } from "next/navigation"
import { Clock } from "lucide-react"
import { TenantDisplay } from "./tenant-client"
import { buildTenantConfig, configToTenantData } from "@/lib/tenant-config-builder"

interface PageProps {
    params: Promise<{ slug: string }>
}

export default async function TenantPage({ params }: PageProps) {
    const { slug } = await params

    // Single centralized config builder — no more duplicate logic
    const config = await buildTenantConfig(slug)

    if (!config) {
        notFound()
    }

    // Convert TenantConfig → TenantData for backward-compatible rendering
    const data = configToTenantData(config)

    if (config.trialStatus?.isExpired) {
        return (
            <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center p-6 text-center">
                <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="h-20 w-20 bg-amber-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-amber-500/20">
                        <Clock className="h-10 w-10 text-amber-500" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4 text-stone-900 dark:text-stone-50" style={{ fontFamily: 'var(--font-playfair)' }}>
                        Site Temporariamente Indisponível
                    </h1>
                    <p className="text-stone-500 dark:text-stone-400 mb-10 leading-relaxed">
                        Este site está aguardando ativação. Se você é o proprietário, por favor acesse seu painel para ativar sua assinatura.
                    </p>
                    <div className="h-px bg-stone-200 dark:bg-stone-800 w-full mb-10" />
                    <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">
                        Powered by Agenda Online
                    </p>
                </div>
            </div>
        )
    }

    return (
        <TenantDisplay
            data={data}
            services={config.services}
            categories={config.categories}
        />
    )
}
