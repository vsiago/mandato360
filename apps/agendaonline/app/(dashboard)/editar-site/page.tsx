"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { getMyTenant, normalizeSlug } from "@/lib/tenant-api"
import type { TenantData, EditorSectionId } from "@/lib/tenant-types"
import { EditorProvider, useEditor } from "@/lib/editor-context"
import { SiteEditor } from "@mandato360/editor"
import "@mandato360/editor/styles"
import { Loader2 } from "lucide-react"
import { tenantToEditorConfig, editorConfigToTenant } from "@/lib/editor-adapter"
import { AGENDA_PLUGINS } from "@/components/editor/plugins"
import { saveTenantAction } from "@/lib/actions/tenant"
import { toast } from "sonner"

/* ─── Page ─── */
export default function EditarSitePage() {
    const [data, setData] = useState<TenantData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getMyTenant().then(tenantData => {
            setData(tenantData)
            setLoading(false)
        })
    }, [])

    const handleSave = async (config: any) => {
        if (!data) return
        try {
            const updatedTenant = editorConfigToTenant(config, data)
            const res = await saveTenantAction(updatedTenant)
            if (res.success) {
                setData(updatedTenant)
                toast.success("Site salvo com sucesso!")
            } else {
                toast.error("Erro ao salvar: " + res.error)
            }
        } catch (err) {
            toast.error("Erro inesperado ao salvar.")
        }
    }

    if (loading || !data) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#0f0f12]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
                    <p className="text-sm text-white/50">Iniciando editor do monorepo...</p>
                </div>
            </div>
        )
    }

    return (
        <SiteEditor 
            initialConfig={tenantToEditorConfig(data)}
            onSave={handleSave}
            tenantName={data.name}
            plugins={AGENDA_PLUGINS}
            accentColor={data.colors.primary}
            previewUrl={`/${data.slug || normalizeSlug(data.name)}`}
        />
    )
}

