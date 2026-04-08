"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { getTenantBySlug } from "@/lib/actions/tenant"
import { EditorProvider, useEditor } from "@/lib/editor/context"
import { LivePreview } from "@/components/editor/live-preview"
import { FloatingToolbar } from "@/components/editor/floating-toolbar"
import { PropertiesPanel } from "@/components/editor/properties-panel"
import { ContentEditorPanel } from "@/components/editor/content-editor-panel"
import { ThemeSelector } from "@/components/theme-selector"
import { SiteConfig, EditorSectionId } from "@/lib/editor/types"
import { ThemeId } from "@/src/themes/types"
import {
    Globe, Award, User, MapPin, HelpCircle, Palette, 
    Smartphone, Tablet, Monitor, Save, Loader2,
    AlertTriangle, CheckCircle, FileText, ChevronLeft, ChevronRight, PanelTop, Sparkles,
    ArrowLeftRight, HeartHandshake, ExternalLink
} from "lucide-react"
import { Button } from "@/components/ui/button"

/* ─── Shared Section Config ─── */
const SECTIONS: { id: EditorSectionId | 'design-system'; label: string; icon: any }[] = [
    { id: "header", label: "Topo", icon: PanelTop },
    { id: "hero", label: "Hero", icon: Globe },
    { id: "trust", label: "Destaques", icon: Award },
    { id: "projetos", label: "Ações", icon: FileText },
    { id: "perfil", label: "Sobre", icon: User },
    { id: "beforeAfter", label: "Resultados", icon: ArrowLeftRight },
    { id: "faq", label: "Dúvidas", icon: HelpCircle },
    { id: "contact", label: "Contato", icon: MapPin },
    { id: "footer", label: "Rodapé", icon: Globe },
    { id: "design-system", label: "Tema", icon: Palette },
]

/* ─── Inner Editor ─── */
function EditorInner() {
    const {
        data, isDirty, saving, saved, save,
        selectedSection, selectSection, selectElement,
        breakpoint, setBreakpoint, updateField
    } = useEditor()

    const [propertiesOpen, setPropertiesOpen] = useState(true)

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] -mx-6 -my-6 overflow-hidden bg-white dark:bg-stone-950">

            {/* ─── Unsaved changes banner ─── */}
            {isDirty && (
                <div className="shrink-0 px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between gap-3 animate-in slide-in-from-top-1 duration-300">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                            Alterações não salvas — salve para aplicar no site
                        </span>
                    </div>
                    <Button
                        size="sm"
                        onClick={save}
                        disabled={saving}
                        className="rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white h-7 px-4"
                    >
                        {saving ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Save className="h-3 w-3 mr-1" />}
                        {saving ? "Salvando..." : "Salvar Agora"}
                    </Button>
                </div>
            )}

            {/* Saved banner */}
            {saved && !isDirty && (
                <div className="shrink-0 px-4 py-2 bg-green-500/10 border-b border-green-500/20 flex items-center gap-2 animate-in slide-in-from-top-1 duration-300">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-xs font-medium text-green-700 dark:text-green-400">
                        Salvo com sucesso! As alterações já estão no ar.
                    </span>
                </div>
            )}

            {/* ─── Main layout ─── */}
            <div className="flex flex-1 min-h-0">

                {/* Left Navigator */}
                <div className="hidden lg:flex flex-col w-16 border-r border-stone-100 dark:border-stone-800 shrink-0 bg-stone-50/30 dark:bg-stone-900/10">
                    <div className="flex-1 flex flex-col items-center py-4 gap-1">
                        {SECTIONS.map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => {
                                    selectSection(id as any)
                                    selectElement(null)
                                    // Scroll to section in preview
                                    const el = document.querySelector(`[data-section-id="${id}"]`)
                                    el?.scrollIntoView({ behavior: "smooth", block: "center" })
                                }}
                                className={cn(
                                    "group w-12 h-12 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-200 relative",
                                    selectedSection === id
                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm"
                                        : "text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-600 dark:hover:text-stone-300"
                                )}
                                title={label}
                            >
                                {selectedSection === id && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-emerald-500" />
                                )}
                                <Icon className="h-4 w-4" />
                                <span className="text-[7px] font-black uppercase tracking-tighter leading-none">{label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ─── Live Preview Area ─── */}
                <div className="flex-1 flex flex-col min-w-0 bg-stone-100/50 dark:bg-stone-900/50">
                    {/* Preview toolbar */}
                    <div className="border-b border-stone-100 dark:border-stone-800 px-6 py-2.5 flex items-center justify-between shrink-0 bg-white/50 dark:bg-stone-950/50 backdrop-blur-sm">
                        <div className="flex items-center gap-4">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-400/30 border border-red-500/20" />
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-400/30 border border-amber-500/20" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-400/30 border border-green-500/20" />
                            </div>
                            <span className="text-[10px] text-stone-400 font-mono hidden xl:inline">
                                mandato360.com.br/{data.slug}
                            </span>
                        </div>

                        {/* Device toggles */}
                        <div className="flex items-center gap-1 p-1 rounded-xl bg-stone-100/50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-700">
                            {([
                                { id: "mobile" as const, icon: Smartphone, label: "Celular" },
                                { id: "tablet" as const, icon: Tablet, label: "Tablet" },
                                { id: "desktop" as const, icon: Monitor, label: "Desktop" },
                            ]).map(({ id, icon: DevIcon, label }) => (
                                <button
                                    key={id}
                                    onClick={() => setBreakpoint(id)}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                        breakpoint === id
                                            ? "bg-white dark:bg-stone-700 text-emerald-600 shadow-sm border border-stone-100 dark:border-stone-600"
                                            : "text-stone-400 hover:text-stone-600"
                                    )}
                                >
                                    <DevIcon className="h-3.5 w-3.5" />
                                    <span className="hidden xl:inline">{label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-3">
                            <Button variant="outline" size="sm" className="rounded-xl text-[10px] font-black uppercase tracking-widest h-8 px-4 border-stone-200" asChild>
                                <a href={`/${data.slug}`} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-3.5 w-3.5 mr-2" /> Site Final
                                </a>
                            </Button>
                            <Button
                                size="sm"
                                onClick={save}
                                disabled={saving}
                                className={cn(
                                    "rounded-xl text-[10px] font-black uppercase tracking-widest h-8 px-5 transition-all shadow-lg",
                                    saved && !isDirty
                                        ? "bg-green-500 hover:bg-green-600 text-white"
                                        : "bg-emerald-600 hover:bg-emerald-700 text-white"
                                )}
                            >
                                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" /> : <Save className="h-3.5 w-3.5 mr-2" />}
                                {saved && !isDirty ? "Salvo ✓" : saving ? "Salvando..." : "Salvar"}
                            </Button>
                            <button
                                onClick={() => setPropertiesOpen(!propertiesOpen)}
                                className={cn(
                                    "h-8 w-8 rounded-xl flex items-center justify-center transition-colors border",
                                    propertiesOpen ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" : "bg-stone-50 border-stone-200 text-stone-400 hover:bg-stone-100"
                                )}
                            >
                                {propertiesOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Preview container */}
                    <div className="flex-1 overflow-hidden relative flex items-start justify-center p-6 lg:p-12">
                        {/* Device frame */}
                        <div
                            className={cn(
                                "relative transition-all duration-700 ease-in-out h-full",
                                breakpoint === "mobile" && "w-[375px] max-w-full",
                                breakpoint === "tablet" && "w-[768px] max-w-full",
                                breakpoint === "desktop" && "w-full",
                            )}
                        >
                            {/* Device frames and live rendered content */}
                            <div className={cn(
                                "relative w-full h-full overflow-auto bg-white shadow-[0_0_50px_rgba(0,0,0,0.1)] ring-1 ring-stone-900/5",
                                breakpoint === "mobile" && "rounded-[3rem] border-[8px] border-stone-800",
                                breakpoint === "tablet" && "rounded-[2rem] border-[6px] border-stone-800",
                                breakpoint === "desktop" && "rounded-2xl border-stone-100",
                            )}>
                                <LivePreview />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── Right Panel ─── */}
                <div className={cn(
                    "hidden lg:block transition-all duration-300 overflow-hidden shrink-0",
                    propertiesOpen ? "w-80" : "w-0"
                )}>
                    {propertiesOpen && (
                         selectedSection === 'design-system' ? (
                            <div className="h-full bg-white dark:bg-stone-950 flex flex-col">
                                <div className="p-5 border-b border-stone-100 dark:border-stone-800 bg-emerald-500/5">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Sparkles className="h-4 w-4 text-emerald-600" />
                                        <h3 className="text-sm font-black text-stone-900 dark:text-stone-100 uppercase tracking-widest">Identidade Visual</h3>
                                    </div>
                                    <p className="text-[10px] text-stone-400 font-medium">Escolha o tema do Mandato</p>
                                </div>
                                <div className="p-6 overflow-y-auto">
                                    <ThemeSelector
                                        value={(data.theme as ThemeId) || "neutro"}
                                        onChange={(themeId) => updateField("theme", themeId)}
                                        variant="grid"
                                    />
                                    <div className="mt-8 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30">
                                        <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium leading-relaxed">
                                            💡 O tema altera tipografia, cores e animações de todo o site automaticamente.
                                        </p>
                                    </div>
                                </div>
                            </div>
                         ) : selectedSection === 'hero' ? (
                            <PropertiesPanel />
                         ) : selectedSection ? (
                            <ContentEditorPanel />
                         ) : (
                            <div className="flex flex-col items-center justify-center h-full px-6 text-center bg-white dark:bg-stone-950">
                                <div className="h-14 w-14 rounded-2xl flex items-center justify-center mb-4 bg-emerald-500/5 border border-emerald-500/10 shadow-sm">
                                    <Sparkles className="h-6 w-6 text-emerald-500/50" />
                                </div>
                                <p className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-tighter">Selecione uma seção</p>
                                <p className="text-[10px] text-stone-400 mt-1 max-w-48 leading-relaxed font-medium">
                                    Clique em uma seção na barra lateral para editar seu conteúdo e propriedades.
                                </p>
                            </div>
                         )
                    )}
                </div>
            </div>

            {/* ─── Mobile section tabs ─── */}
            <div className="lg:hidden fixed bottom-16 left-4 right-4 z-50 bg-white/80 backdrop-blur-lg border border-stone-200 shadow-2xl rounded-2xl">
                <div className="flex items-center overflow-x-auto px-2 py-2 gap-1 no-scrollbar text-stone-900">
                    {SECTIONS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => {
                                selectSection(id as any)
                                selectElement(null)
                            }}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0",
                                selectedSection === id
                                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                                    : "text-stone-400 hover:bg-stone-50"
                            )}
                        >
                            <Icon className="h-3.5 w-3.5" />{label}
                        </button>
                    ))}
                </div>
            </div>
            
            <FloatingToolbar />
        </div>
    )
}

/* ─── Build SiteConfig from tenant DB row ─── */
function buildConfigFromTenant(tenant: any): SiteConfig {
    // If tenant has a full config JSON, use it (merging DB-level fields as ultimate source of truth for media)
    if (tenant.config) {
        try {
            const parsed = JSON.parse(tenant.config) as SiteConfig
            // Always ensure slug matches
            parsed.slug = tenant.slug
            // Merge DB-level photo fields (these are the canonical source after save)
            if (tenant.fotoPerfilUrl && parsed.perfil) {
                parsed.perfil.imageUrl = tenant.fotoPerfilUrl
            }
            if (tenant.logoUrl) {
                parsed.logoUrl = tenant.logoUrl
            }
            return parsed
        } catch (e) {
            console.error("Failed to parse tenant config JSON:", e)
        }
    }

    // No config JSON — build from individual DB columns
    return {
        slug: tenant.slug,
        name: tenant.name || "Vereador",
        tagline: "Mandato Participativo",
        description: "Trabalhando pela transparência e inovação política.",
        heroBadge: "Mandato Participativo",
        heroImageUrl: "",
        heroHeadline: "Por uma cidade de",
        heroHighlight: "Resultados",
        ctaText: "Solicitar Demanda",
        colors: {
            primary: tenant.primaryColor || "#0F2B5B",
            secondary: tenant.secondaryColor || "#0D9F6E",
        },
        contact: {
            phone: "",
            whatsapp: "",
            address: "",
            email: "",
            instagram: "",
        },
        perfil: {
            name: tenant.name || "Vereador",
            bio: tenant.biografia || "",
            role: "Vereador",
            imageUrl: tenant.fotoPerfilUrl || "",
        },
        logoUrl: tenant.logoUrl || "",
        avatarUrl: "",
        trustBadges: [
            { text: "Compromisso com a Cidade", icon: "Check" },
            { text: "Transparência Total", icon: "Check" },
        ],
        categories: [],
        projetos: [],
        faq: [],
        beforeAfter: [],
        theme: "neutro" as ThemeId,
    }
}

export default function EditarSitePage() {
    const params = useParams()
    const slug = params.tenant as string
    const [data, setData] = useState<SiteConfig | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        getTenantBySlug(slug).then(tenant => {
            if (!tenant) {
                setError("Mandato não encontrado.")
                setLoading(false)
                return
            }
            setData(buildConfigFromTenant(tenant))
            setLoading(false)
        }).catch(err => {
            console.error("Error loading tenant:", err)
            setError("Erro ao carregar dados do mandato.")
            setLoading(false)
        })
    }, [slug])

    if (error) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="text-center space-y-3">
                    <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto" />
                    <p className="text-sm text-stone-500 font-medium">{error}</p>
                </div>
            </div>
        )
    }

    if (loading || !data) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="animate-spin h-8 w-8 text-emerald-500" />
                    <p className="text-sm text-stone-400 font-medium">Carregando editor visual...</p>
                </div>
            </div>
        )
    }

    return (
        <EditorProvider initialData={data}>
            <EditorInner />
        </EditorProvider>
    )
}
