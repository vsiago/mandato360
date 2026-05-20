"use client" // force rebuild

import { useState, useEffect } from "react"
import { getMyTenant, normalizeSlug } from "@/lib/tenant-api"
import type { TenantData } from "@/lib/tenant-types"
import { SiteEditor, type EditorConfig } from "@mandato360/editor"
import "@mandato360/editor/styles"
import { Loader2 } from "lucide-react"
import { tenantToEditorConfig, editorConfigToTenant } from "@/lib/editor-adapter"
import { AGENDA_PLUGINS } from "@/components/editor/plugins"
import { saveTenantAction } from "@/lib/actions/tenant"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

/* ─── Page ─── */
export default function EditarSitePage() {
    const [editorConfig, setEditorConfig] = useState<EditorConfig | null>(null)
    const [data, setData] = useState<TenantData | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        getMyTenant().then(tenantData => {
            if (tenantData) {
                setData(tenantData)
                // Initialize editor config once from tenant data
                setEditorConfig(tenantToEditorConfig(tenantData))
            }
            setLoading(false)
        })
    }, [])

    const handleSave = async (config: EditorConfig) => {
        if (!data) return
        try {
            // Persist the full config which contains breakpoint-specific overrides
            const updatedTenant = editorConfigToTenant(config, data)
            const res = await saveTenantAction(updatedTenant)
            
            if (res.success) {
                // Keep local tenant data in sync, but don't re-initialize editorConfig 
                // to avoid losing the current editor state or UI position
                setData(updatedTenant)
                toast.success("Site salvo com sucesso!")
            } else {
                toast.error("Erro ao salvar: " + res.error)
            }
        } catch (err) {
            toast.error("Erro inesperado ao salvar.")
        }
    }

    const handleImageUpload = async (file: File): Promise<string> => {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        })

        if (!response.ok) {
            throw new Error("Falha no upload")
        }

        const data = await response.json()
        return data.url
    }

    if (loading || !editorConfig || !data) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#0f0f12]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
                    <p className="text-sm text-white/50">Carregando editor responsivo...</p>
                </div>
            </div>
        )
    }

    return (
        <SiteEditor 
            initialConfig={editorConfig}
            onSave={handleSave}
            tenantName={data.name}
            plugins={AGENDA_PLUGINS}
            accentColor={data.colors.primary}
            previewUrl={`/${data.slug || normalizeSlug(data.name)}`}
            onImageUpload={handleImageUpload}
            autoSave={false}
            placeholders={{
                title: data.heroHeadline,
                description: data.description,
                badge: data.heroBadge,
                ctaPrimary: data.ctaText,
                ctaSecondary: "Ver Serviços"
            }}
            onExit={() => router.push("/painel")}
        />
    )
}


