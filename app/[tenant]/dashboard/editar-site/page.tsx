"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { getTenantBySlug } from "@/lib/actions/tenant"
import { updateTenantSiteAction } from "@/lib/actions/tenant"
import { uploadImageAction } from "@/lib/actions/upload"
import { SiteEditor, type EditorConfig, type EditorPlugin, type PluginSectionProps, type PluginSidebarProps } from "@mandato360/editor"
import "@mandato360/editor/styles"
import { siteConfigToEditorConfig, editorConfigToSiteConfig, extractEditorConfig } from "@/lib/editor/adapter"
import { SiteConfig } from "@/lib/editor/types"
import {
    AlertTriangle, Loader2,
    Award, FileText, User, ArrowLeftRight, HelpCircle, MapPin,
    CheckCircle2, Phone, MessageCircle, Mail, ChevronRight,
} from "lucide-react"

/* ─── Plugin Preview Components ─── */

function TrustPreview({ config, device, themeColors }: PluginSectionProps) {
    const badges = config.badges || []
    if (badges.length === 0) return null
    return (
        <div className="bg-slate-900 py-4 overflow-hidden border-y border-white/5">
            <div className="flex items-center gap-8 whitespace-nowrap px-6 overflow-x-auto">
                {badges.map((badge: any, i: number) => (
                    <div key={i} className="flex items-center gap-2 shrink-0">
                        <CheckCircle2 className="h-4 w-4" style={{ color: themeColors.secondary || themeColors.accent }} />
                        <span className="text-white font-bold uppercase tracking-[0.12em] text-[9px]">{badge.text}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

function ProjetosPreview({ config, device, themeColors }: PluginSectionProps) {
    const items = config.items || []
    const title = config.title || "Ações e Projetos"
    return (
        <div className="bg-white py-8 px-4" style={device === "desktop" ? { padding: "3rem 2rem" } : undefined}>
            <h2 className="text-lg font-black text-gray-900 tracking-tight mb-4" style={device === "desktop" ? { fontSize: "1.5rem", marginBottom: "1.5rem" } : undefined}>
                {title}
            </h2>
            <div className={`grid gap-3 ${device === "desktop" ? "grid-cols-3" : device === "tablet" ? "grid-cols-2" : "grid-cols-1"}`}>
                {(items.length > 0 ? items.slice(0, 3) : [
                    { name: "Projeto Exemplo 1", description: "Descrição do projeto" },
                    { name: "Projeto Exemplo 2", description: "Descrição do projeto" },
                ]).map((item: any, i: number) => (
                    <div key={i} className="rounded-xl bg-gray-50 p-4 border border-gray-100">
                        <div className="h-8 w-8 rounded-lg mb-2 flex items-center justify-center" style={{ backgroundColor: `${themeColors.primary}15`, color: themeColors.primary }}>
                            <FileText className="h-4 w-4" />
                        </div>
                        <h3 className="text-xs font-bold text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-[10px] text-gray-500 line-clamp-2">{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

function PerfilPreview({ config, device, themeColors }: PluginSectionProps) {
    const title = config.title || "O Vereador"
    return (
        <div className="bg-gray-50 py-8 px-4" style={device === "desktop" ? { padding: "3rem 2rem" } : undefined}>
            <div className={`flex gap-6 ${device === "desktop" ? "flex-row items-center" : "flex-col"}`}>
                <div className="aspect-square rounded-2xl bg-gray-200 flex items-center justify-center overflow-hidden" style={device === "desktop" ? { width: "180px", flexShrink: 0 } : { width: "100%", maxWidth: "200px" }}>
                    {config.imageUrl ? (
                        <img src={config.imageUrl} alt={config.name} className="w-full h-full object-cover" />
                    ) : (
                        <User className="h-12 w-12 text-gray-400" />
                    )}
                </div>
                <div>
                    <h2 className="text-lg font-black text-gray-900 tracking-tight mb-2">{title}</h2>
                    <p className="text-xs text-gray-600 italic mb-2">"{config.bio || "Trabalhando por você."}"</p>
                    <h3 className="text-sm font-black uppercase" style={{ color: themeColors.primary }}>{config.name || "Nome"}</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{config.role || "Vereador"}</p>
                </div>
            </div>
        </div>
    )
}

function BeforeAfterPreview({ config, device, themeColors }: PluginSectionProps) {
    const items = config.items || []
    if (items.length === 0) return null
    return (
        <div className="bg-white py-8 px-4 border-t border-gray-100" style={device === "desktop" ? { padding: "3rem 2rem" } : undefined}>
            <h2 className="text-lg font-black text-gray-900 tracking-tight mb-4 text-center">{config.title || "Resultados"}</h2>
            <div className={`grid gap-3 ${device === "desktop" ? "grid-cols-3" : "grid-cols-1"}`}>
                {items.slice(0, 3).map((item: any, i: number) => (
                    <div key={i} className="rounded-xl bg-gray-50 border border-gray-100 overflow-hidden">
                        <div className="grid grid-cols-2 h-20">
                            <div className="bg-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-400">ANTES</div>
                            <div className="bg-gray-100 flex items-center justify-center text-[8px] font-bold text-gray-400">DEPOIS</div>
                        </div>
                        <div className="p-3">
                            <p className="text-[10px] font-bold text-gray-900">{item.title}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function FAQPreview({ config, device, themeColors }: PluginSectionProps) {
    const items = config.items || []
    if (items.length === 0) return null
    return (
        <div className="bg-gray-50 py-8 px-4" style={device === "desktop" ? { padding: "3rem 2rem" } : undefined}>
            <h2 className="text-lg font-black text-gray-900 tracking-tight mb-4 text-center">{config.title || "Perguntas Frequentes"}</h2>
            <div className="space-y-2 max-w-md mx-auto">
                {items.slice(0, 3).map((item: any, i: number) => (
                    <div key={i} className="bg-white rounded-lg border border-gray-100 p-3">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-gray-900">{item.question}</span>
                            <ChevronRight className="h-3 w-3 text-gray-400" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function ContactPreview({ config, device, themeColors }: PluginSectionProps) {
    const hasContent = config.phone || config.whatsapp || config.email
    if (!hasContent) return null
    return (
        <div className="bg-white py-8 px-4 border-t border-gray-100" style={device === "desktop" ? { padding: "3rem 2rem" } : undefined}>
            <h2 className="text-lg font-black text-gray-900 tracking-tight mb-4 text-center">{config.title || "Contato"}</h2>
            <div className={`grid gap-3 max-w-lg mx-auto ${device === "desktop" ? "grid-cols-3" : "grid-cols-1"}`}>
                {config.phone && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}>
                            <Phone className="h-3.5 w-3.5" />
                        </div>
                        <div>
                            <p className="text-[8px] font-bold text-gray-400 uppercase">Telefone</p>
                            <p className="text-[10px] font-bold text-gray-900">{config.phone}</p>
                        </div>
                    </div>
                )}
                {config.whatsapp && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="h-8 w-8 rounded-lg bg-green-500/10 text-green-600 flex items-center justify-center">
                            <MessageCircle className="h-3.5 w-3.5" />
                        </div>
                        <div>
                            <p className="text-[8px] font-bold text-gray-400 uppercase">WhatsApp</p>
                            <p className="text-[10px] font-bold text-gray-900">{config.whatsapp}</p>
                        </div>
                    </div>
                )}
                {config.email && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}>
                            <Mail className="h-3.5 w-3.5" />
                        </div>
                        <div>
                            <p className="text-[8px] font-bold text-gray-400 uppercase">E-mail</p>
                            <p className="text-[10px] font-bold text-gray-900">{config.email}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

/* ─── Plugin Sidebar Components ─── */

function TrustSidebar({ config, onChange }: PluginSidebarProps) {
    const badges = config.badges || []
    return (
        <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-wider text-white/50">Destaques / Conquistas</p>
            {badges.map((badge: any, i: number) => (
                <div key={i} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={badge.text}
                        onChange={(e) => {
                            const newBadges = [...badges]
                            newBadges[i] = { ...badge, text: e.target.value }
                            onChange({ badges: newBadges })
                        }}
                        className="flex-1 h-8 rounded-md border border-white/5 bg-white/[0.03] px-3 text-xs text-white/80 placeholder:text-white/20"
                    />
                    <button
                        onClick={() => {
                            const newBadges = badges.filter((_: any, j: number) => j !== i)
                            onChange({ badges: newBadges })
                        }}
                        className="h-8 w-8 rounded-md flex items-center justify-center text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                        ×
                    </button>
                </div>
            ))}
            <button
                onClick={() => onChange({ badges: [...badges, { text: "Novo Destaque", icon: "Check" }] })}
                className="w-full h-8 rounded-md border border-dashed border-white/20 text-xs text-white/40 hover:text-white/60 hover:border-white/30 transition-colors"
            >
                + Adicionar
            </button>
        </div>
    )
}

function ProjetosSidebar({ config, onChange }: PluginSidebarProps) {
    const items = config.items || []
    return (
        <div className="space-y-4">
            <div>
                <p className="text-[10px] text-white/40 mb-1">Título da Seção</p>
                <input
                    type="text"
                    value={config.title || ""}
                    onChange={(e) => onChange({ title: e.target.value })}
                    className="w-full h-8 rounded-md border border-white/5 bg-white/[0.03] px-3 text-xs text-white/80"
                />
            </div>
            <p className="text-xs font-medium uppercase tracking-wider text-white/50">Projetos ({items.length})</p>
            {items.slice(0, 5).map((item: any, i: number) => (
                <div key={i} className="p-3 rounded-lg border border-white/5 bg-white/[0.02] space-y-2">
                    <input
                        type="text"
                        value={item.name || ""}
                        onChange={(e) => {
                            const newItems = [...items]
                            newItems[i] = { ...item, name: e.target.value }
                            onChange({ items: newItems })
                        }}
                        placeholder="Nome"
                        className="w-full h-7 rounded border border-white/5 bg-white/[0.03] px-2 text-[10px] text-white/80 placeholder:text-white/20"
                    />
                    <input
                        type="text"
                        value={item.description || ""}
                        onChange={(e) => {
                            const newItems = [...items]
                            newItems[i] = { ...item, description: e.target.value }
                            onChange({ items: newItems })
                        }}
                        placeholder="Descrição"
                        className="w-full h-7 rounded border border-white/5 bg-white/[0.03] px-2 text-[10px] text-white/80 placeholder:text-white/20"
                    />
                </div>
            ))}
            <button
                onClick={() => onChange({ items: [...items, { id: Date.now().toString(), name: "", description: "", image: "", categoryId: "", slug: "" }] })}
                className="w-full h-8 rounded-md border border-dashed border-white/20 text-xs text-white/40 hover:text-white/60 hover:border-white/30 transition-colors"
            >
                + Adicionar Projeto
            </button>
        </div>
    )
}

function PerfilSidebar({ config, onChange }: PluginSidebarProps) {
    return (
        <div className="space-y-4">
            <div>
                <p className="text-[10px] text-white/40 mb-1">Título da Seção</p>
                <input type="text" value={config.title || ""} onChange={(e) => onChange({ title: e.target.value })} className="w-full h-8 rounded-md border border-white/5 bg-white/[0.03] px-3 text-xs text-white/80" />
            </div>
            <div>
                <p className="text-[10px] text-white/40 mb-1">Nome</p>
                <input type="text" value={config.name || ""} onChange={(e) => onChange({ name: e.target.value })} className="w-full h-8 rounded-md border border-white/5 bg-white/[0.03] px-3 text-xs text-white/80" />
            </div>
            <div>
                <p className="text-[10px] text-white/40 mb-1">Cargo</p>
                <input type="text" value={config.role || ""} onChange={(e) => onChange({ role: e.target.value })} className="w-full h-8 rounded-md border border-white/5 bg-white/[0.03] px-3 text-xs text-white/80" />
            </div>
            <div>
                <p className="text-[10px] text-white/40 mb-1">Biografia</p>
                <textarea value={config.bio || ""} onChange={(e) => onChange({ bio: e.target.value })} rows={3} className="w-full rounded-md border border-white/5 bg-white/[0.03] px-3 py-2 text-xs text-white/80 resize-none" />
            </div>
        </div>
    )
}

function FAQSidebar({ config, onChange }: PluginSidebarProps) {
    const items = config.items || []
    return (
        <div className="space-y-4">
            <div>
                <p className="text-[10px] text-white/40 mb-1">Título da Seção</p>
                <input type="text" value={config.title || ""} onChange={(e) => onChange({ title: e.target.value })} className="w-full h-8 rounded-md border border-white/5 bg-white/[0.03] px-3 text-xs text-white/80" />
            </div>
            <p className="text-xs font-medium uppercase tracking-wider text-white/50">Perguntas ({items.length})</p>
            {items.map((item: any, i: number) => (
                <div key={i} className="p-3 rounded-lg border border-white/5 bg-white/[0.02] space-y-2">
                    <input
                        type="text"
                        value={item.question || ""}
                        onChange={(e) => {
                            const newItems = [...items]
                            newItems[i] = { ...item, question: e.target.value }
                            onChange({ items: newItems })
                        }}
                        placeholder="Pergunta"
                        className="w-full h-7 rounded border border-white/5 bg-white/[0.03] px-2 text-[10px] text-white/80 placeholder:text-white/20"
                    />
                    <textarea
                        value={item.answer || ""}
                        onChange={(e) => {
                            const newItems = [...items]
                            newItems[i] = { ...item, answer: e.target.value }
                            onChange({ items: newItems })
                        }}
                        placeholder="Resposta"
                        rows={2}
                        className="w-full rounded border border-white/5 bg-white/[0.03] px-2 py-1 text-[10px] text-white/80 placeholder:text-white/20 resize-none"
                    />
                    <button onClick={() => { const n = items.filter((_: any, j: number) => j !== i); onChange({ items: n }) }} className="text-[10px] text-red-400 hover:text-red-300">Remover</button>
                </div>
            ))}
            <button
                onClick={() => onChange({ items: [...items, { id: Date.now().toString(), question: "", answer: "" }] })}
                className="w-full h-8 rounded-md border border-dashed border-white/20 text-xs text-white/40 hover:text-white/60 hover:border-white/30 transition-colors"
            >
                + Adicionar Pergunta
            </button>
        </div>
    )
}

function ContactSidebar({ config, onChange }: PluginSidebarProps) {
    return (
        <div className="space-y-4">
            <div>
                <p className="text-[10px] text-white/40 mb-1">Título da Seção</p>
                <input type="text" value={config.title || ""} onChange={(e) => onChange({ title: e.target.value })} className="w-full h-8 rounded-md border border-white/5 bg-white/[0.03] px-3 text-xs text-white/80" />
            </div>
            <div>
                <p className="text-[10px] text-white/40 mb-1">Telefone</p>
                <input type="text" value={config.phone || ""} onChange={(e) => onChange({ phone: e.target.value })} className="w-full h-8 rounded-md border border-white/5 bg-white/[0.03] px-3 text-xs text-white/80" />
            </div>
            <div>
                <p className="text-[10px] text-white/40 mb-1">WhatsApp</p>
                <input type="text" value={config.whatsapp || ""} onChange={(e) => onChange({ whatsapp: e.target.value })} className="w-full h-8 rounded-md border border-white/5 bg-white/[0.03] px-3 text-xs text-white/80" />
            </div>
            <div>
                <p className="text-[10px] text-white/40 mb-1">E-mail</p>
                <input type="text" value={config.email || ""} onChange={(e) => onChange({ email: e.target.value })} className="w-full h-8 rounded-md border border-white/5 bg-white/[0.03] px-3 text-xs text-white/80" />
            </div>
            <div>
                <p className="text-[10px] text-white/40 mb-1">Instagram</p>
                <input type="text" value={config.instagram || ""} onChange={(e) => onChange({ instagram: e.target.value })} className="w-full h-8 rounded-md border border-white/5 bg-white/[0.03] px-3 text-xs text-white/80" />
            </div>
            <div>
                <p className="text-[10px] text-white/40 mb-1">Endereço</p>
                <input type="text" value={config.address || ""} onChange={(e) => onChange({ address: e.target.value })} className="w-full h-8 rounded-md border border-white/5 bg-white/[0.03] px-3 text-xs text-white/80" />
            </div>
        </div>
    )
}

function BeforeAfterSidebar({ config, onChange }: PluginSidebarProps) {
    const items = config.items || []
    return (
        <div className="space-y-4">
            <div>
                <p className="text-[10px] text-white/40 mb-1">Título da Seção</p>
                <input type="text" value={config.title || ""} onChange={(e) => onChange({ title: e.target.value })} className="w-full h-8 rounded-md border border-white/5 bg-white/[0.03] px-3 text-xs text-white/80" />
            </div>
            <p className="text-xs font-medium uppercase tracking-wider text-white/50">Resultados ({items.length})</p>
            {items.map((item: any, i: number) => (
                <div key={i} className="p-3 rounded-lg border border-white/5 bg-white/[0.02] space-y-2">
                    <input type="text" value={item.title || ""} onChange={(e) => { const n = [...items]; n[i] = { ...item, title: e.target.value }; onChange({ items: n }) }} placeholder="Título" className="w-full h-7 rounded border border-white/5 bg-white/[0.03] px-2 text-[10px] text-white/80 placeholder:text-white/20" />
                    <button onClick={() => { const n = items.filter((_: any, j: number) => j !== i); onChange({ items: n }) }} className="text-[10px] text-red-400 hover:text-red-300">Remover</button>
                </div>
            ))}
            <button onClick={() => onChange({ items: [...items, { id: Date.now().toString(), title: "", before: "", after: "" }] })} className="w-full h-8 rounded-md border border-dashed border-white/20 text-xs text-white/40 hover:text-white/60 hover:border-white/30 transition-colors">+ Adicionar</button>
        </div>
    )
}

/* ─── Define Mandato360 Plugins ─── */
const mandatoPlugins: EditorPlugin[] = [
    {
        id: "trust",
        label: "Destaques",
        icon: Award,
        previewComponent: TrustPreview,
        sidebarComponent: TrustSidebar,
        defaultConfig: { badges: [] },
    },
    {
        id: "projetos",
        label: "Ações",
        icon: FileText,
        previewComponent: ProjetosPreview,
        sidebarComponent: ProjetosSidebar,
        defaultConfig: { title: "Ações e Projetos", items: [], categories: [] },
    },
    {
        id: "perfil",
        label: "Sobre",
        icon: User,
        previewComponent: PerfilPreview,
        sidebarComponent: PerfilSidebar,
        defaultConfig: { title: "O Vereador", name: "", bio: "", role: "Vereador", imageUrl: "" },
    },
    {
        id: "beforeAfter",
        label: "Resultados",
        icon: ArrowLeftRight,
        previewComponent: BeforeAfterPreview,
        sidebarComponent: BeforeAfterSidebar,
        defaultConfig: { title: "Transformando a Cidade", items: [] },
    },
    {
        id: "faq",
        label: "Dúvidas",
        icon: HelpCircle,
        previewComponent: FAQPreview,
        sidebarComponent: FAQSidebar,
        defaultConfig: { title: "Perguntas Frequentes", items: [] },
    },
    {
        id: "contact",
        label: "Contato",
        icon: MapPin,
        previewComponent: ContactPreview,
        sidebarComponent: ContactSidebar,
        defaultConfig: { title: "Entre em Contato", phone: "", whatsapp: "", email: "", instagram: "", address: "" },
    },
]

/* ─── Build SiteConfig from tenant DB row (reused from original) ─── */
function buildConfigFromTenant(tenant: any): SiteConfig {
    const defaultConfig: SiteConfig = {
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
        contact: { phone: "", whatsapp: "", address: "", email: "", instagram: "" },
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
        theme: "neutro" as any,
        fontHeading: "",
        fontBody: "",
        projetosTitle: "Ações e Projetos",
        perfilTitle: "O Vereador",
        resultsTitle: "Transformando a Cidade",
        faqTitle: "Perguntas Frequentes",
        contactTitle: "Entre em Contato",
        sectionStyles: {
            hero: {
                background: 'gradient',
                gradient: {
                    angle: 90,
                    stops: [
                        { color: tenant.primaryColor || "#0F2B5B", position: 0, opacity: 100 },
                        { color: tenant.secondaryColor || "#0D9F6E", position: 50, opacity: 80 },
                        { color: "#000000", position: 100, opacity: 70 }
                    ]
                }
            }
        },
        heroImageSettings: {
            positionX: 50,
            positionY: 20,
            zoom: 1,
            layout: 'left',
            overlayEnabled: true,
            overlay: {
                angle: 90,
                stops: [
                    { color: tenant.primaryColor || "#0F2B5B", position: 0, opacity: 100 },
                    { color: tenant.primaryColor || "#0F2B5B", position: 50, opacity: 100 },
                    { color: tenant.primaryColor || "#0F2B5B", position: 100, opacity: 0 }
                ]
            }
        },
    }

    if (tenant.config) {
        try {
            const parsed = JSON.parse(tenant.config) as Partial<SiteConfig>
            return {
                ...defaultConfig,
                ...parsed,
                slug: tenant.slug,
                colors: { ...defaultConfig.colors, ...parsed.colors },
                contact: { ...defaultConfig.contact, ...parsed.contact },
                perfil: {
                    ...defaultConfig.perfil,
                    ...parsed.perfil,
                    imageUrl: tenant.fotoPerfilUrl || parsed.perfil?.imageUrl || ""
                },
                logoUrl: tenant.logoUrl || parsed.logoUrl || "",
            }
        } catch (e) {
            console.error("Failed to parse tenant config JSON:", e)
        }
    }

    return defaultConfig
}

/* ─── Main Page Component ─── */
export default function EditarSitePage() {
    const params = useParams()
    const slug = params.tenant as string
    const [editorConfig, setEditorConfig] = useState<EditorConfig | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [tenantPrimaryColor, setTenantPrimaryColor] = useState("#10b981")

    useEffect(() => {
        getTenantBySlug(slug).then(tenant => {
            if (!tenant) {
                setError("Mandato não encontrado.")
                setLoading(false)
                return
            }

            // Build SiteConfig from tenant, then convert to EditorConfig
            const siteConfig = buildConfigFromTenant(tenant)
            const config = extractEditorConfig(siteConfig)
            setEditorConfig(config)
            setTenantPrimaryColor(tenant.primaryColor || siteConfig.colors?.primary || "#10b981")
            setLoading(false)
        }).catch(err => {
            console.error("Error loading tenant:", err)
            setError("Erro ao carregar dados do mandato.")
            setLoading(false)
        })
    }, [slug])

    const handleSave = async (config: EditorConfig) => {
        // Convert EditorConfig → SiteConfig for persistence
        const siteConfig = editorConfigToSiteConfig(config, slug)
        const result = await updateTenantSiteAction(slug, siteConfig)
        if (!result.success) {
            throw new Error(result.error || "Falha ao salvar")
        }
    }

    const handleUpload = async (file: File) => {
        const formData = new FormData()
        formData.append("file", file)
        const result = await uploadImageAction(formData)
        if (!result.success) {
            throw new Error(result.error || "Erro ao fazer upload da imagem")
        }
        return result.url
    }

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

    if (loading || !editorConfig) {
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
        <SiteEditor
            initialConfig={editorConfig}
            onSave={handleSave}
            onImageUpload={handleUpload}
            previewUrl={`/${slug}`}
            tenantName={editorConfig.header.logoText || slug}
            plugins={mandatoPlugins}
            autoSave={true}
            autoSaveDelay={2000}
            accentColor={tenantPrimaryColor}
            className="w-full h-full -mx-0 -my-0 lg:-mx-0 lg:-my-0"
        />
    )
}
