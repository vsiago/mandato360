"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Save, ExternalLink, Palette, Store, User, Stars, Instagram, Phone, MapPin, ImagePlus, Globe, Loader2, CreditCard, Smartphone, Banknote, Info, ChevronRight, Layout, ShieldCheck, Sparkles, X, MessageCircle } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getMyTenant, saveTenant } from "@/lib/tenant-api"
import type { TenantData } from "@/lib/tenant-types"
import { toast } from "sonner"
import { ImageUpload } from "@/components/ui/image-upload"
import { cn } from "@/lib/utils"

export default function ConfiguracoesPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-brand-primary" /></div>}>
            <ConfiguracoesContent />
        </Suspense>
    )
}

function ConfiguracoesContent() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const searchParams = useSearchParams()
    const [activeTab, setActiveTab] = useState<"business" | "profile" | "brand" | "finance">("business")

    useEffect(() => {
        const tab = searchParams.get("tab") as any
        if (tab && ["business", "profile", "brand", "finance"].includes(tab)) {
            setActiveTab(tab)
        }
    }, [searchParams])

    const [data, setData] = useState<TenantData | null>(null)

    useEffect(() => {
        getMyTenant().then(tenantData => {
            setData(tenantData)
            setLoading(false)
        }).catch(err => {
            console.error("Erro ao carregar configurações:", err)
            toast.error("Erro ao carregar dados")
            setLoading(false)
        })
    }, [])

    const handleSave = async () => {
        if (!data) return
        setSaving(true)
        try {
            await saveTenant(data)
            toast.success("Configurações salvas com sucesso!")
        } catch (err) {
            toast.error("Erro ao salvar configurações")
        } finally {
            setSaving(false)
        }
    }

    if (loading || !data) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
            </div>
        )
    }

    const isAdvocacia = data.segmento === "advocacia"

    const tabs = [
        { key: "business" as const, label: isAdvocacia ? "Escritório" : "Estabelecimento", icon: Store },
        { key: "profile" as const, label: isAdvocacia ? "Advogado(a)" : "Profissional", icon: User },
        { key: "brand" as const, label: "Identidade", icon: Palette },
        { key: "finance" as const, label: "Financeiro", icon: CreditCard },
    ]

    const setField = (key: keyof TenantData, value: any) => {
        setData(prev => prev ? { ...prev, [key]: value } : null)
    }

    const setContact = (key: string, value: string) => {
        setData(prev => prev ? { ...prev, contact: { ...prev.contact, [key]: value } } : null)
    }

    const setFounder = (key: string, value: string) => {
        setData(prev => prev ? { ...prev, founder: { ...prev.founder, [key]: value } } : null)
    }

    const setColors = (key: string, value: string) => {
        setData(prev => prev ? { ...prev, colors: { ...prev.colors, [key]: value } } : null)
    }

    const setPix = (key: string, value: string) => {
        setData(prev => prev ? { ...prev, pix: { ...(prev.pix || { type: 'random', key: '' }), [key]: value } } : null)
    }

    return (
        <div className="flex-1 flex flex-col space-y-4 lg:space-y-6 animate-in fade-in duration-500 pb-12 lg:max-w-4xl lg:mx-auto">

            {/* ── Header ── */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6 mb-1 lg:mb-2">
                <div className="flex-1">
                    <h2 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight flex items-center gap-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                        Configurações
                    </h2>
                    <p className="text-xs lg:text-sm text-muted-foreground mt-0.5 lg:mt-1">
                        Personalize os dados e a identidade visual do seu negócio.
                    </p>
                </div>
                
                <div className="flex items-center gap-2 w-full lg:w-auto">
                     <Button variant="ghost" className="flex-1 lg:flex-none text-stone-500 hover:text-white hover:bg-white/5 rounded-xl font-bold text-xs h-10 lg:h-12 transition-all">
                        Descartar
                    </Button>
                    <Button 
                        onClick={handleSave} 
                        disabled={saving}
                        className="flex-1 lg:flex-none text-white rounded-xl px-6 h-10 lg:h-12 font-bold flex items-center justify-center gap-2 transition-all bg-brand-gold text-[11px] lg:text-sm shadow-lg shadow-brand-gold/10"
                    >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 lg:h-5 lg:w-5" />} Salvar Alterações
                    </Button>
                </div>
            </div>

            {/* ── Tab Navigation (Mobile Native Style) ── */}
            <div className="flex bg-stone-900/40 backdrop-blur-md border border-white/[0.03] p-1 rounded-2xl shadow-xl overflow-x-auto hide-scrollbar sticky top-0 z-30">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={cn(
                            "flex-1 min-w-[90px] flex items-center justify-center gap-2 py-2.5 lg:py-3.5 rounded-xl text-[10px] lg:text-xs font-black uppercase tracking-widest transition-all duration-300",
                            activeTab === tab.key
                                ? "bg-white/[0.05] text-brand-primary shadow-lg border border-white/5"
                                : "text-stone-500 hover:text-stone-300"
                        )}
                    >
                        <tab.icon className={cn("h-3.5 w-3.5 lg:h-4 lg:w-4", activeTab === tab.key ? "text-brand-primary" : "text-stone-500")} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="space-y-6 lg:space-y-8">
                {/* ── Tab: Business ── */}
                {activeTab === "business" && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
                        <div className="bg-stone-900/40 backdrop-blur-md border border-white/[0.03] rounded-2xl p-5 lg:p-8 space-y-6 lg:space-y-8 shadow-2xl">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center shrink-0">
                                    <Store className="h-5 w-5 lg:h-6 lg:w-6 text-brand-primary" />
                                </div>
                                <div>
                                    <h3 className="text-sm lg:text-base font-bold text-white">Dados do {isAdvocacia ? "Escritório" : "Estabelecimento"}</h3>
                                    <p className="text-[10px] lg:text-xs text-stone-500">Informações visíveis na sua página pública</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-stone-500">Nome do Negócio</Label>
                                    <Input value={data.name || ""} onChange={e => setField('name', e.target.value)} className="h-12 bg-stone-950/40 border-white/5 rounded-xl text-sm font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-stone-500">Link Personalizado (URL)</Label>
                                    <div className="relative group">
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-600 group-focus-within:text-brand-primary transition-colors" />
                                        <Input value={data.slug || ""} onChange={e => setField('slug', e.target.value)} className="pl-11 pr-11 h-12 bg-stone-950/40 border-white/5 rounded-xl text-sm font-bold text-brand-primary" />
                                        <a href={`/${data.slug}`} target="_blank" rel="noopener noreferrer" className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-600 hover:text-white transition-colors">
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-stone-500">Telefone para Contato</Label>
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-600 group-focus-within:text-brand-primary transition-colors" />
                                        <Input value={data.contact.phone || ""} onChange={e => setContact('phone', e.target.value)} className="pl-11 h-12 bg-stone-950/40 border-white/5 rounded-xl text-sm font-bold" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-stone-500">WhatsApp para Notificações</Label>
                                    <div className="relative group">
                                        <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-600 group-focus-within:text-brand-primary transition-colors" />
                                        <Input value={data.contact.whatsapp || ""} onChange={e => setContact('whatsapp', e.target.value)} className="pl-11 h-12 bg-stone-950/40 border-white/5 rounded-xl text-sm font-bold" placeholder="Ex: 5521999999999" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-stone-500">Instagram (@usuario)</Label>
                                    <div className="relative group">
                                        <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-600 group-focus-within:text-brand-primary transition-colors" />
                                        <Input value={data.contact.instagram || ""} onChange={e => setContact('instagram', e.target.value)} className="pl-11 h-12 bg-stone-950/40 border-white/5 rounded-xl text-sm font-bold" placeholder="https://instagram.com/..." />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-stone-500">Slogan ou Chamada</Label>
                                    <Input value={data.surname || ""} onChange={e => setField('surname', e.target.value)} className="h-12 bg-stone-950/40 border-white/5 rounded-xl text-sm font-bold" placeholder="Ex: Excelência em cada detalhe" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-stone-500">Endereço de Atendimento</Label>
                                <div className="relative group">
                                    <Input value={data.contact.address || ""} onChange={e => setContact('address', e.target.value)} className="pl-11 h-12 bg-stone-950/40 border-white/5 rounded-xl text-sm font-bold" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Tab: Profile ── */}
                {activeTab === "profile" && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
                        <div className="bg-stone-900/40 backdrop-blur-md border border-white/[0.03] rounded-2xl p-5 lg:p-8 space-y-6 lg:space-y-8 shadow-2xl">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center shrink-0">
                                    <User className="h-5 w-5 lg:h-6 lg:w-6 text-brand-primary" />
                                </div>
                                <div>
                                    <h3 className="text-sm lg:text-base font-bold text-white">Perfil do {isAdvocacia ? "Advogado(a)" : "Profissional"}</h3>
                                    <p className="text-[10px] lg:text-xs text-stone-500">Informações biográficas e fotos de perfil</p>
                                </div>
                            </div>

                            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                                <div className="relative group shrink-0">
                                    <Avatar className="h-24 w-24 lg:h-32 lg:w-32 rounded-2xl border-2 border-white/10 shadow-2xl overflow-hidden">
                                        <img src={data.founder.imageUrl || data.avatarUrl} alt={data.founder.name} className="w-full h-full object-cover" />
                                        <AvatarFallback className="bg-stone-900 text-stone-500 text-xl font-bold">
                                            {data.founder.name?.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl cursor-pointer">
                                        <ImagePlus className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                                <div className="flex-1 space-y-4 w-full">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-stone-500">Foto de Perfil Profissional</Label>
                                        <ImageUpload value={data.founder.imageUrl || ""} onChange={url => setFounder('imageUrl', url)} />
                                    </div>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-stone-500">Nome Completo</Label>
                                            <Input value={data.founder.name || ""} onChange={e => setFounder('name', e.target.value)} className="h-11 bg-stone-950/40 border-white/5 rounded-xl text-sm font-bold" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-stone-500">Cargo / Especialidade</Label>
                                            <Input value={data.founder.role || ""} onChange={e => setFounder('role', e.target.value)} className="h-11 bg-stone-950/40 border-white/5 rounded-xl text-sm font-bold" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-stone-500">Mini Bio (Quem Somos)</Label>
                                <textarea
                                    value={data.founder.bio || ""}
                                    onChange={e => setFounder('bio', e.target.value)}
                                    className="w-full min-h-[120px] bg-stone-950/40 border border-white/5 rounded-xl px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-brand-primary/20 text-stone-300 outline-none font-medium leading-relaxed"
                                    placeholder="Descreva sua trajetória e experiência..."
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Tab: Brand ── */}
                {activeTab === "brand" && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
                        <div className="bg-stone-900/40 backdrop-blur-md border border-white/[0.03] rounded-2xl p-5 lg:p-8 space-y-8 shadow-2xl">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center shrink-0">
                                    <Palette className="h-5 w-5 lg:h-6 lg:w-6 text-brand-primary" />
                                </div>
                                <div>
                                    <h3 className="text-sm lg:text-base font-bold text-white">Identidade Visual</h3>
                                    <p className="text-[10px] lg:text-xs text-stone-500">Cores, logotipos e design system</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                {/* Logo Upload */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-stone-500">Logotipo Principal</Label>
                                        <span className="text-[9px] text-stone-600 italic">Horizontal</span>
                                    </div>
                                    <div className="bg-stone-950/40 border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 min-h-[160px] relative overflow-hidden group">
                                        {data.logoUrl ? (
                                            <div className="relative w-full h-full flex items-center justify-center p-4">
                                                <img src={data.logoUrl} alt="Logo" className="max-h-24 object-contain brightness-110 shadow-2xl" />
                                                <button onClick={() => setField('logoUrl', '')} className="absolute top-0 right-0 h-8 w-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <ImageUpload value={""} onChange={url => setField('logoUrl', url)} />
                                        )}
                                    </div>
                                </div>

                                {/* Mini Logo Upload */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-stone-500">Logotipo Ícone (Variação)</Label>
                                        <span className="text-[9px] text-stone-600 italic">Quadrado</span>
                                    </div>
                                    <div className="bg-stone-950/40 border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 min-h-[160px] relative overflow-hidden group">
                                        {data.logoMiniUrl ? (
                                            <div className="relative w-full h-full flex items-center justify-center p-4">
                                                <img src={data.logoMiniUrl} alt="Logo Mini" className="max-h-20 w-20 object-contain brightness-110 shadow-2xl" />
                                                <button onClick={() => setField('logoMiniUrl', '')} className="absolute top-0 right-0 h-8 w-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <ImageUpload value={""} onChange={url => setField('logoMiniUrl', url)} />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-stone-500">Cor Primária</Label>
                                            <div className="flex items-center gap-3 bg-stone-950/40 border border-white/5 rounded-xl p-2 h-12">
                                                <div className="h-8 w-8 rounded-lg border border-white/10 relative overflow-hidden shrink-0">
                                                    <input type="color" value={data.colors?.primary || "#000000"} onChange={e => setColors('primary', e.target.value)}
                                                        className="absolute inset-0 w-full h-full cursor-pointer scale-150 border-none bg-transparent" />
                                                </div>
                                                <span className="text-xs font-black text-stone-300 uppercase font-mono">{data.colors.primary}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-stone-500">Cor Hover</Label>
                                            <div className="flex items-center gap-3 bg-stone-950/40 border border-white/5 rounded-xl p-2 h-12">
                                                <div className="h-8 w-8 rounded-lg border border-white/10 relative overflow-hidden shrink-0">
                                                    <input type="color" value={data.colors?.hover || "#000000"} onChange={e => setColors('hover', e.target.value)}
                                                        className="absolute inset-0 w-full h-full cursor-pointer scale-150 border-none bg-transparent" />
                                                </div>
                                                <span className="text-xs font-black text-stone-300 uppercase font-mono">{data.colors.hover}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Preview Card */}
                                    <div className="bg-stone-950 rounded-2xl p-6 border border-white/5 space-y-4">
                                        <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Pré-visualização</p>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full flex items-center justify-center text-white text-xs font-black shadow-lg" style={{ backgroundColor: data.colors.primary }}>
                                                {data.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-white leading-none">{data.name}</p>
                                                <p className="text-[10px] text-stone-600 mt-1">agendaonline.com/{data.slug}</p>
                                            </div>
                                        </div>
                                        <Button className="w-full h-10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl transition-all hover:scale-[0.98]" style={{ backgroundColor: data.colors.primary }}>
                                            Botão Primário
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Brand Tip Card */}
                        <div className="bg-stone-900/60 backdrop-blur-md border border-white/[0.03] p-5 lg:p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-5 shadow-lg">
                            <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
                                <div className="h-12 w-12 lg:h-14 lg:w-14 rounded-2xl bg-brand-primary/5 border border-brand-primary/10 flex items-center justify-center shrink-0">
                                    <Sparkles className="h-6 w-6 lg:h-7 lg:w-7 text-brand-primary" />
                                </div>
                                <div>
                                    <h4 className="text-sm lg:text-base font-bold text-white leading-tight">Dica de Design System</h4>
                                    <p className="text-xs text-stone-500 mt-1">
                                        {isAdvocacia 
                                            ? "Tons sóbrios (azul marinho, vinho, dourado) transmitem confiança jurídica." 
                                            : "Tons pastéis e dourados transmitem luxo e bem-estar no nicho da beleza."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Tab: Finance ── */}
                {activeTab === "finance" && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
                        <div className="bg-stone-900/40 backdrop-blur-md border border-white/[0.03] rounded-2xl p-5 lg:p-8 space-y-8 shadow-2xl">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center shrink-0">
                                    <Banknote className="h-5 w-5 lg:h-6 lg:w-6 text-brand-primary" />
                                </div>
                                <div>
                                    <h3 className="text-sm lg:text-base font-bold text-white">Configuração de Recebimentos</h3>
                                    <p className="text-[10px] lg:text-xs text-stone-500">Defina sua chave PIX para pagamentos diretos</p>
                                </div>
                            </div>

                            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-5 flex gap-4">
                                <ShieldCheck className="h-6 w-6 text-emerald-500 shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-emerald-500">Segurança no PIX</p>
                                    <p className="text-xs text-emerald-500/60 leading-relaxed">
                                        Seus dados são criptografados e exibidos apenas no momento do checkout para o cliente que realizou o agendamento.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-stone-500">Tipo de Chave PIX</Label>
                                    <select 
                                        value={data.pix?.type || 'random'} 
                                        onChange={e => setPix('type', e.target.value)}
                                        className="w-full h-12 px-4 bg-stone-950/40 border border-white/5 rounded-xl text-sm font-bold focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none appearance-none cursor-pointer text-stone-300"
                                    >
                                        <option value="email" className="bg-stone-900">E-mail</option>
                                        <option value="phone" className="bg-stone-900">Telefone</option>
                                        <option value="cpf_cnpj" className="bg-stone-900">CPF ou CNPJ</option>
                                        <option value="random" className="bg-stone-900">Chave Aleatória</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-stone-500">A Chave PIX</Label>
                                    <Input 
                                        value={data.pix?.key || ''} 
                                        onChange={e => setPix('key', e.target.value)} 
                                        placeholder="Sua chave aqui..."
                                        className="h-12 bg-stone-950/40 border-white/5 rounded-xl text-sm font-bold text-emerald-500" 
                                    />
                                </div>
                            </div>

                            {/* Modal Mockup Preview */}
                            <div className="pt-8 border-t border-white/[0.03]">
                                <p className="text-[10px] font-black text-stone-600 uppercase tracking-[0.2em] mb-6">MOCKUP DO CHECKOUT</p>
                                <div className="max-w-md mx-auto bg-stone-950 rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
                                    <div className="p-4 bg-stone-900/40 border-b border-white/5 flex items-center justify-between">
                                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Pagamento</p>
                                        <X className="h-3 w-3 text-stone-600" />
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                                            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                                <Smartphone className="h-5 w-5 text-emerald-500" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest">Pague via PIX</p>
                                                <p className="text-xs font-black text-emerald-500 break-all">{data.pix?.key || 'chave@pix.com.br'}</p>
                                            </div>
                                        </div>
                                        <Button className="w-full bg-emerald-500 text-white rounded-xl h-11 text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-500/10">
                                            Copiar Chave
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
