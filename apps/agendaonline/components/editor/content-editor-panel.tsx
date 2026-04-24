"use client"

import React, { useState } from "react"
import { useEditor } from "@/lib/editor-context"
import { cn } from "@/lib/utils"
import {
    Plus, Trash2, GripVertical, ChevronDown, ChevronUp,
    Upload, ImageIcon, HelpCircle, MapPin, Phone, Instagram,
    MessageCircle, Globe, Star, ShieldCheck, X, Edit3
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type {
    TenantService, TenantCategory, TenantFAQ, TenantBeforeAfter, TenantBadge
} from "@/lib/tenant-types"

/* ─── Shared UI Components ─── */
function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
    return (
        <div className="px-4 pt-4 pb-3 border-b border-amber-200/10 dark:border-amber-500/5" style={{ background: 'linear-gradient(135deg, rgba(232,168,58,0.05) 0%, transparent 50%)' }}>
            <h3 className="text-sm font-bold text-foreground">{title}</h3>
            {subtitle && <p className="text-[10px] text-amber-700/50 dark:text-amber-400/40 mt-0.5">{subtitle}</p>}
        </div>
    )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
    return <label className="text-[11px] font-semibold text-amber-700/60 dark:text-amber-400/50 uppercase tracking-wider">{children}</label>
}

function FieldInput({ value, onChange, placeholder, type = "text", multiline = false }: {
    value: string; onChange: (v: string) => void; placeholder?: string; type?: string; multiline?: boolean
}) {
    if (multiline) {
        return (
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={3}
                className="w-full rounded-lg border border-amber-200/20 dark:border-amber-500/10 bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 resize-none"
            />
        )
    }
    return (
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-lg border border-amber-200/20 dark:border-amber-500/10 bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 h-8"
        />
    )
}

function ImageUploadPlaceholder({ label, currentUrl, onUrlChange }: {
    label: string; currentUrl: string; onUrlChange: (v: string) => void
}) {
    return (
        <div className="space-y-1.5">
            <FieldLabel>{label}</FieldLabel>
            {currentUrl ? (
                <div className="relative group rounded-lg overflow-hidden border border-amber-200/20 dark:border-amber-500/10 h-24">
                    <img src={currentUrl} alt={label} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button onClick={() => onUrlChange("")} className="p-1.5 rounded-lg bg-red-500/80 text-white hover:bg-red-600">
                            <Trash2 className="h-3 w-3" />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="border-2 border-dashed border-amber-500/20 rounded-lg p-4 flex flex-col items-center gap-2 hover:border-amber-500/40 hover:bg-amber-500/5 transition-colors cursor-pointer">
                    <Upload className="h-5 w-5 text-muted-foreground/40" />
                    <span className="text-[10px] text-muted-foreground/60">Clique para enviar</span>
                </div>
            )}
            <input
                type="text"
                value={currentUrl}
                onChange={(e) => onUrlChange(e.target.value)}
                placeholder="URL da imagem (ou use upload)"
                className="w-full rounded-lg border border-amber-200/20 dark:border-amber-500/10 bg-background px-3 py-1.5 text-[10px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30"
            />
        </div>
    )
}

/* ─── Header Editor ─── */
function HeaderEditor() {
    const { data, updateField } = useEditor()
    const headerBgColor = data.headerBgColor || '#0f172acc'

    return (
        <div className="space-y-4 p-4">
            <div className="space-y-2">
                <FieldLabel>Cor de Fundo (ao rolar)</FieldLabel>
                <p className="text-[10px] text-muted-foreground/60 -mt-1">A cor que aparece no header quando o visitante rola a página.</p>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <input
                            type="color"
                            value={headerBgColor.slice(0, 7)}
                            onChange={(e) => updateField("headerBgColor", e.target.value + 'cc')}
                            className="w-10 h-10 rounded-xl border border-amber-200/20 dark:border-amber-500/10 cursor-pointer bg-transparent p-0.5"
                        />
                    </div>
                    <input
                        type="text"
                        value={headerBgColor}
                        onChange={(e) => updateField("headerBgColor", e.target.value)}
                        placeholder="#0f172acc"
                        className="flex-1 rounded-lg border border-amber-200/20 dark:border-amber-500/10 bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 h-8 font-mono"
                    />
                </div>
                <div className="mt-3 rounded-xl overflow-hidden border border-amber-200/15 dark:border-amber-500/10">
                    <div className="h-12 flex items-center px-4 gap-3 backdrop-blur-lg" style={{ backgroundColor: headerBgColor }}>
                        <div className="h-6 w-6 rounded-full bg-white/20" />
                        <div className="flex-1" />
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-8 rounded bg-white/40" />
                            <div className="h-2 w-8 rounded bg-white/40" />
                            <div className="h-5 w-16 rounded-md bg-white/90" />
                        </div>
                    </div>
                    <div className="px-3 py-1.5 bg-muted/50">
                        <p className="text-[9px] text-muted-foreground text-center">Preview do header ao rolar</p>
                    </div>
                </div>
            </div>

            <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(232,168,58,0.2), transparent)' }} />

            <div className="space-y-2">
                <FieldLabel>Logo do Site</FieldLabel>
                <ImageUploadPlaceholder
                    label="Logo"
                    currentUrl={data.logoUrl}
                    onUrlChange={(v) => updateField("logoUrl", v)}
                />
            </div>
        </div>
    )
}

/* ─── Trust / Destaques Editor ─── */
function TrustEditor() {
    const { data, updateField } = useEditor()
    const badges = data.trustBadges || []

    const addBadge = () => {
        updateField("trustBadges", [...badges, { text: "Novo Destaque", icon: "ShieldCheck" }])
    }
    const removeBadge = (idx: number) => {
        updateField("trustBadges", badges.filter((_, i) => i !== idx))
    }
    const updateBadge = (idx: number, field: keyof TenantBadge, value: string) => {
        const updated = [...badges]
        updated[idx] = { ...updated[idx], [field]: value }
        updateField("trustBadges", updated)
    }

    return (
        <div className="space-y-3 p-4">
            <div className="flex items-center justify-between">
                <FieldLabel>Destaques ({badges.length})</FieldLabel>
                <Button size="sm" variant="outline" onClick={addBadge} className="h-6 px-2 text-[10px] gap-1 border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-500/5">
                    <Plus className="h-3 w-3" /> Adicionar
                </Button>
            </div>
            <div className="space-y-2">
                {badges.map((badge, idx) => (
                    <div key={idx} className="flex items-center gap-2 rounded-lg p-2 border border-amber-200/10 dark:border-amber-500/5" style={{ background: 'rgba(232,168,58,0.03)' }}>
                        <GripVertical className="h-3 w-3 text-muted-foreground/40 shrink-0" />
                        <input
                            value={typeof badge === 'string' ? badge : badge.text}
                            onChange={(e) => updateBadge(idx, "text", e.target.value)}
                            className="flex-1 bg-transparent text-xs text-foreground focus:outline-none"
                        />
                        <button onClick={() => removeBadge(idx)} className="p-1 text-muted-foreground hover:text-red-500 transition-colors">
                            <X className="h-3 w-3" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

/* ─── Services Editor ─── */
function ServicesEditor() {
    const { data, updateField } = useEditor()
    const categories = data.categories || []
    const services = data.services || []
    const [openService, setOpenService] = useState<string | null>(null)

    // Categories CRUD
    const addCategory = () => {
        const id = `cat-${Date.now()}`
        updateField("categories", [...categories, { id, label: "Nova Categoria" }])
    }
    const removeCategory = (id: string) => {
        updateField("categories", categories.filter(c => c.id !== id))
    }
    const updateCategory = (id: string, label: string) => {
        updateField("categories", categories.map(c => c.id === id ? { ...c, label } : c))
    }

    // Services CRUD
    const addService = () => {
        const id = `svc-${Date.now()}`
        const defaultCatId = categories.length > 0 ? categories[0].id : "todos"
        updateField("services", [...services, {
            id, categoryId: defaultCatId, name: "Novo Serviço",
            description: "Descrição do serviço", image: ""
        }])
        setOpenService(id)
    }
    const removeService = (id: string) => {
        updateField("services", services.filter(s => s.id !== id))
        if (openService === id) setOpenService(null)
    }
    const updateService = (id: string, field: keyof TenantService, value: string) => {
        updateField("services", services.map(s => s.id === id ? { ...s, [field]: value } : s))
    }

    return (
        <div className="space-y-4 p-4">
            {/* Categories */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <FieldLabel>Categorias ({categories.length})</FieldLabel>
                    <Button size="sm" variant="outline" onClick={addCategory} className="h-6 px-2 text-[10px] gap-1 border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-500/5">
                        <Plus className="h-3 w-3" /> Nova
                    </Button>
                </div>
                <div className="space-y-1">
                    {categories.map((cat) => (
                        <div key={cat.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 border border-amber-200/10 dark:border-amber-500/5" style={{ background: 'rgba(232,168,58,0.03)' }}>
                            <input
                                value={cat.label}
                                onChange={(e) => updateCategory(cat.id, e.target.value)}
                                className="flex-1 bg-transparent text-xs text-foreground focus:outline-none"
                            />
                            {cat.id !== "todos" && (
                                <button onClick={() => removeCategory(cat.id)} className="p-1 text-muted-foreground hover:text-red-500">
                                    <X className="h-3 w-3" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(232,168,58,0.2), transparent)' }} />

            {/* Services */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <FieldLabel>Serviços ({services.length})</FieldLabel>
                    <Button size="sm" variant="outline" onClick={addService} className="h-6 px-2 text-[10px] gap-1 border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-500/5">
                        <Plus className="h-3 w-3" /> Novo
                    </Button>
                </div>
                <div className="space-y-2">
                    {services.map((svc) => (
                        <div key={svc.id} className="border border-amber-200/15 dark:border-amber-500/10 rounded-xl overflow-hidden" style={{ background: 'rgba(232,168,58,0.02)' }}>
                            {/* Header */}
                            <div
                                className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-muted/40 transition-colors"
                                onClick={() => setOpenService(openService === svc.id ? null : svc.id)}
                            >
                                {svc.image ? (
                                    <img src={svc.image} alt={svc.name} className="h-8 w-8 rounded-lg object-cover shrink-0" />
                                ) : (
                                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                        <ImageIcon className="h-3.5 w-3.5 text-muted-foreground/40" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-foreground truncate">{svc.name}</p>
                                    <p className="text-[10px] text-muted-foreground truncate">{svc.description}</p>
                                </div>
                                {openService === svc.id ? <ChevronUp className="h-3 w-3 text-muted-foreground" /> : <ChevronDown className="h-3 w-3 text-muted-foreground" />}
                            </div>

                            {/* Expanded form */}
                            {openService === svc.id && (
                                <div className="px-3 pb-3 space-y-3 border-t border-border/30 pt-3">
                                    <div className="space-y-1">
                                        <FieldLabel>Nome</FieldLabel>
                                        <FieldInput value={svc.name} onChange={(v) => updateService(svc.id, "name", v)} />
                                    </div>
                                    <div className="space-y-1">
                                        <FieldLabel>Descrição</FieldLabel>
                                        <FieldInput value={svc.description} onChange={(v) => updateService(svc.id, "description", v)} multiline />
                                    </div>
                                    <div className="space-y-1">
                                        <FieldLabel>Categoria</FieldLabel>
                                        <select
                                            value={svc.categoryId}
                                            onChange={(e) => updateService(svc.id, "categoryId", e.target.value)}
                                            className="w-full rounded-lg border border-amber-200/20 dark:border-amber-500/10 bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500/30 h-8"
                                        >
                                            {categories.map(c => (
                                                <option key={c.id} value={c.id}>{c.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <ImageUploadPlaceholder
                                        label="Foto do Serviço"
                                        currentUrl={svc.image}
                                        onUrlChange={(v) => updateService(svc.id, "image", v)}
                                    />
                                    <Button
                                        size="sm" variant="destructive"
                                        onClick={() => removeService(svc.id)}
                                        className="w-full h-7 text-[10px] gap-1"
                                    >
                                        <Trash2 className="h-3 w-3" /> Remover Serviço
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

/* ─── About / Founder Editor ─── */
function AboutEditor() {
    const { data, updateNestedField } = useEditor()

    return (
        <div className="space-y-3 p-4">
            <div className="space-y-1">
                <FieldLabel>Nome</FieldLabel>
                <FieldInput value={data.founder.name} onChange={(v) => updateNestedField("founder.name", v)} placeholder="Seu nome" />
            </div>
            <div className="space-y-1">
                <FieldLabel>Cargo / Especialidade</FieldLabel>
                <FieldInput value={data.founder.role} onChange={(v) => updateNestedField("founder.role", v)} placeholder="Ex: Fundadora & Especialista" />
            </div>
            <div className="space-y-1">
                <FieldLabel>Bio</FieldLabel>
                <FieldInput value={data.founder.bio} onChange={(v) => updateNestedField("founder.bio", v)} multiline placeholder="Conte sua história..." />
            </div>
            <ImageUploadPlaceholder
                label="Foto de Perfil"
                currentUrl={data.founder.imageUrl}
                onUrlChange={(v) => updateNestedField("founder.imageUrl", v)}
            />
        </div>
    )
}

/* ─── Before & After Editor ─── */
function BeforeAfterEditor() {
    const { data, updateField } = useEditor()
    const items = data.beforeAfter || []

    const addItem = () => {
        const id = `ba-${Date.now()}`
        updateField("beforeAfter", [...items, { id, title: "Novo Resultado", before: "", after: "" }])
    }
    const removeItem = (id: string) => {
        updateField("beforeAfter", items.filter(i => i.id !== id))
    }
    const updateItem = (id: string, field: keyof TenantBeforeAfter, value: string) => {
        updateField("beforeAfter", items.map(i => i.id === id ? { ...i, [field]: value } : i))
    }

    return (
        <div className="space-y-3 p-4">
            <div className="flex items-center justify-between">
                <FieldLabel>Resultados ({items.length})</FieldLabel>
                <Button size="sm" variant="outline" onClick={addItem} className="h-6 px-2 text-[10px] gap-1 border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-500/5">
                    <Plus className="h-3 w-3" /> Adicionar
                </Button>
            </div>
            <div className="space-y-3">
                {items.map((item) => (
                    <div key={item.id} className="border border-amber-200/15 dark:border-amber-500/10 rounded-xl p-3 space-y-3" style={{ background: 'rgba(232,168,58,0.02)' }}>
                        <div className="flex items-center justify-between">
                            <div className="space-y-1 flex-1 mr-2">
                                <FieldLabel>Nome do Serviço</FieldLabel>
                                <FieldInput value={item.title} onChange={(v) => updateItem(item.id, "title", v)} placeholder="Ex: Brow Lamination" />
                            </div>
                            <button onClick={() => removeItem(item.id)} className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors shrink-0">
                                <Trash2 className="h-3.5 w-3.5" />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <ImageUploadPlaceholder
                                label="Antes"
                                currentUrl={item.before}
                                onUrlChange={(v) => updateItem(item.id, "before", v)}
                            />
                            <ImageUploadPlaceholder
                                label="Depois"
                                currentUrl={item.after}
                                onUrlChange={(v) => updateItem(item.id, "after", v)}
                            />
                        </div>
                    </div>
                ))}
                {items.length === 0 && (
                    <div className="text-center py-6 text-muted-foreground/50">
                        <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-40" />
                        <p className="text-[11px]">Nenhum resultado ainda</p>
                        <p className="text-[10px]">Adicione fotos de antes e depois</p>
                    </div>
                )}
            </div>
        </div>
    )
}

/* ─── FAQ Editor ─── */
function FAQEditor() {
    const { data, updateField } = useEditor()
    const items = data.faq || []

    const addItem = () => {
        const id = `faq-${Date.now()}`
        updateField("faq", [...items, { id, question: "Nova pergunta?", answer: "Resposta aqui..." }])
    }
    const removeItem = (id: string) => {
        updateField("faq", items.filter(i => i.id !== id))
    }
    const updateItem = (id: string, field: keyof TenantFAQ, value: string) => {
        updateField("faq", items.map(i => i.id === id ? { ...i, [field]: value } : i))
    }

    return (
        <div className="space-y-3 p-4">
            <div className="flex items-center justify-between">
                <FieldLabel>Perguntas ({items.length})</FieldLabel>
                <Button size="sm" variant="outline" onClick={addItem} className="h-6 px-2 text-[10px] gap-1 border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-500/5">
                    <Plus className="h-3 w-3" /> Adicionar
                </Button>
            </div>
            <div className="space-y-2">
                {items.map((item) => (
                    <div key={item.id} className="border border-amber-200/15 dark:border-amber-500/10 rounded-xl p-3 space-y-2" style={{ background: 'rgba(232,168,58,0.02)' }}>
                        <div className="flex items-start gap-2">
                            <HelpCircle className="h-3.5 w-3.5 text-amber-500 mt-1 shrink-0" />
                            <div className="flex-1 space-y-2">
                                <FieldInput value={item.question} onChange={(v) => updateItem(item.id, "question", v)} placeholder="Pergunta" />
                                <FieldInput value={item.answer} onChange={(v) => updateItem(item.id, "answer", v)} multiline placeholder="Resposta" />
                            </div>
                            <button onClick={() => removeItem(item.id)} className="p-1 text-muted-foreground hover:text-red-500 transition-colors shrink-0">
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

/* ─── Contact Editor ─── */
function ContactEditor() {
    const { data, updateNestedField } = useEditor()

    return (
        <div className="space-y-3 p-4">
            <div className="space-y-1">
                <FieldLabel>Endereço</FieldLabel>
                <FieldInput value={data.contact.address} onChange={(v) => updateNestedField("contact.address", v)} placeholder="Rua, número, bairro, cidade" />
            </div>
            <div className="space-y-1">
                <FieldLabel>Telefone</FieldLabel>
                <FieldInput value={data.contact.phone} onChange={(v) => updateNestedField("contact.phone", v)} placeholder="(21) 99999-9999" />
            </div>
            <div className="space-y-1">
                <FieldLabel>WhatsApp</FieldLabel>
                <FieldInput value={data.contact.whatsapp} onChange={(v) => updateNestedField("contact.whatsapp", v)} placeholder="5521999999999" />
            </div>
            <div className="space-y-1">
                <FieldLabel>Instagram</FieldLabel>
                <FieldInput value={data.contact.instagram} onChange={(v) => updateNestedField("contact.instagram", v)} placeholder="@seuperfil" />
            </div>
            <div className="space-y-1">
                <FieldLabel>Link do Google Maps</FieldLabel>
                <FieldInput value={data.contact.mapEmbedUrl} onChange={(v) => updateNestedField("contact.mapEmbedUrl", v)} placeholder="https://maps.google.com/..." />
            </div>
        </div>
    )
}

/* ─── Footer Editor ─── */
function FooterEditor() {
    const { data, updateField, updateNestedField } = useEditor()

    return (
        <div className="space-y-3 p-4">
            <div className="space-y-1">
                <FieldLabel>Nome do Negócio</FieldLabel>
                <FieldInput value={data.name} onChange={(v) => updateField("name", v)} />
            </div>
            <div className="space-y-1">
                <FieldLabel>Subtítulo / Slogan</FieldLabel>
                <FieldInput value={data.surname} onChange={(v) => updateField("surname", v)} placeholder="Beleza & Bem-Estar" />
            </div>
            <ImageUploadPlaceholder
                label="Logo"
                currentUrl={data.logoUrl}
                onUrlChange={(v) => updateField("logoUrl", v)}
            />
            <ImageUploadPlaceholder
                label="Avatar"
                currentUrl={data.avatarUrl}
                onUrlChange={(v) => updateField("avatarUrl", v)}
            />
        </div>
    )
}

/* ─── Main Content Editor Panel ─── */

const SECTION_TITLES: Record<string, string> = {
    header: "Cabeçalho / Navegação",
    trust: "Faixa de Destaques",
    services: "Serviços",
    about: "Sobre / Fundador(a)",
    beforeAfter: "Antes & Depois",
    faq: "Perguntas Frequentes",
    contact: "Contato & Localização",
    footer: "Rodapé & Marca",
}

export function ContentEditorPanel() {
    const { selectedSection } = useEditor()

    if (!selectedSection || selectedSection === 'scheduling' || selectedSection === 'hero') return null

    const title = SECTION_TITLES[selectedSection] || selectedSection

    return (
        <div className="h-full flex flex-col overflow-hidden">
            <SectionHeader title={title} subtitle="Edite o conteúdo desta seção" />
            <div className="flex-1 overflow-y-auto">
                {selectedSection === 'header' && <HeaderEditor />}

                {selectedSection === 'trust' && <TrustEditor />}
                {selectedSection === 'services' && <ServicesEditor />}
                {selectedSection === 'about' && <AboutEditor />}
                {selectedSection === 'beforeAfter' && <BeforeAfterEditor />}
                {selectedSection === 'faq' && <FAQEditor />}
                {selectedSection === 'contact' && <ContactEditor />}
                {selectedSection === 'footer' && <FooterEditor />}
            </div>
        </div>
    )
}
