"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Save, ExternalLink, Palette, Store, User, Stars, Instagram, Phone, MapPin, ImagePlus, Globe, Loader2, CreditCard, Smartphone, Banknote, Info } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getMyTenant, saveTenant } from "@/lib/tenant-api"
import type { TenantData } from "@/lib/tenant-types"
import { toast } from "sonner"
import { ImageUpload } from "@/components/ui/image-upload"

export default function ConfiguracoesPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [activeTab, setActiveTab] = useState<"business" | "profile" | "brand" | "finance">("business")

    const [data, setData] = useState<TenantData | null>(null)

    useEffect(() => {
        getMyTenant().then(tenantData => {
            setData(tenantData)
            setLoading(false)
        }).catch(err => {
            console.error("Erro ao carregar configurações:", err)
            toast.error("Erro ao carregar dados do salão")
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
                <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            </div>
        )
    }

    const tabs = [
        { key: "business" as const, label: "Estabelecimento", icon: Store },
        { key: "profile" as const, label: "Profissional", icon: User },
        { key: "brand" as const, label: "Identidade", icon: Palette },
        { key: "finance" as const, label: "Finanças", icon: CreditCard },
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
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">

            {/* ── Header ── */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-foreground tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>Configurações</h2>
                    <p className="text-sm text-muted-foreground mt-1">Personalize a identidade do seu negócio.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" className="rounded-lg text-xs font-medium text-muted-foreground hidden sm:flex">
                        Descartar
                    </Button>
                    <Button onClick={handleSave} disabled={saving} className="btn-gold-solid font-semibold rounded-lg px-4">
                        {saving ? (
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <span className="flex items-center gap-2"><Save className="h-4 w-4" /> Salvar</span>
                        )}
                    </Button>
                </div>
            </div>

            {/* ── Tab Navigation ── */}
            <div className="flex gap-1 p-1 rounded-lg border border-amber-200/20 dark:border-amber-500/10 bg-white/50 dark:bg-stone-900/50">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-xs font-medium transition-all duration-200 ${activeTab === tab.key
                            ? "bg-card text-foreground shadow-sm border border-amber-500/20"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <tab.icon className="h-3.5 w-3.5" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ── Tab: Business ── */}
            {activeTab === "business" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                    {/* Salon Info Card */}
                    <div className="relative rounded-xl border border-amber-200/20 dark:border-amber-500/10 p-6 space-y-6 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm overflow-hidden">
                        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(232,168,58,0.03) 0%, transparent 40%)' }} />
                        <div className="relative z-10 flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(232,168,58,0.2) 0%, rgba(232,168,58,0.05) 100%)', border: '1px solid rgba(232,168,58,0.2)' }}>
                                <Store className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-foreground">Dados do Estabelecimento</h3>
                                <p className="text-xs text-muted-foreground">Visíveis na sua página pública de agendamento</p>
                            </div>
                        </div>

                        <div className="relative z-10 grid gap-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-muted-foreground">Nome do salão</Label>
                                    <Input value={data.name} onChange={e => setField('name', e.target.value)} className="h-10 bg-muted border-none rounded-lg text-sm" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-muted-foreground">Link público</Label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                        <Input value={data.slug} onChange={e => setField('slug', e.target.value)} className="h-10 bg-muted border-none rounded-lg text-sm pl-9 pr-9" />
                                        <a href={`/${data.slug}`} target="_blank" rel="noopener noreferrer" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-amber-500 transition-colors">
                                            <ExternalLink className="h-3.5 w-3.5" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-muted-foreground">Telefone</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                        <Input value={data.contact.phone} onChange={e => setContact('phone', e.target.value)} className="h-10 bg-muted border-none rounded-lg text-sm pl-9" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-muted-foreground">WhatsApp</Label>
                                    <div className="relative">
                                        <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                        <Input value={data.contact.whatsapp} onChange={e => setContact('whatsapp', e.target.value)} className="h-10 bg-muted border-none rounded-lg text-sm pl-9" placeholder="5521999999999" />
                                    </div>
                                </div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-muted-foreground">Instagram (URL)</Label>
                                    <div className="relative">
                                        <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                        <Input value={data.contact.instagram} onChange={e => setContact('instagram', e.target.value)} className="h-10 bg-muted border-none rounded-lg text-sm pl-9" placeholder="https://instagram.com/..." />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-muted-foreground">Slogan / Subtítulo</Label>
                                    <Input value={data.surname} onChange={e => setField('surname', e.target.value)} className="h-10 bg-muted border-none rounded-lg text-sm" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-muted-foreground">Endereço completo</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                    <Input value={data.contact.address} onChange={e => setContact('address', e.target.value)} className="h-10 bg-muted border-none rounded-lg text-sm pl-9" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Tab: Profile ── */}
            {activeTab === "profile" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="relative rounded-xl border border-amber-200/20 dark:border-amber-500/10 p-6 space-y-6 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm overflow-hidden">
                        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(232,168,58,0.03) 0%, transparent 40%)' }} />
                        <div className="relative z-10 flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(232,168,58,0.2) 0%, rgba(232,168,58,0.05) 100%)', border: '1px solid rgba(232,168,58,0.2)' }}>
                                <User className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-foreground">Perfil da Profissional</h3>
                                <p className="text-xs text-muted-foreground">Informações para a seção "Quem somos"</p>
                            </div>
                        </div>

                        {/* Avatar upload area */}
                        <div className="flex items-center gap-5">
                            <div className="relative group">
                                <Avatar className="h-20 w-20 ring-4 ring-muted">
                                    <AvatarFallback className="bg-linear-to-br from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800 text-amber-700 dark:text-amber-300 text-lg font-bold">
                                        {data.founder.name?.slice(0, 2).toUpperCase() || "US"}
                                    </AvatarFallback>
                                </Avatar>
                                <button className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all">
                                    <ImagePlus className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-foreground">Foto de perfil</p>
                                <p className="text-xs text-muted-foreground mt-0.5 mb-2">JPG, PNG ou WebP. Máx 5MB.</p>
                                <ImageUpload
                                    value={data.founder.imageUrl || ""}
                                    onChange={url => setFounder('imageUrl', url)}
                                />
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-muted-foreground">Nome completo</Label>
                                <Input value={data.founder.name} onChange={e => setFounder('name', e.target.value)} className="h-10 bg-muted border-none rounded-lg text-sm" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-muted-foreground">Cargo / Especialidade</Label>
                                <Input value={data.founder.role} onChange={e => setFounder('role', e.target.value)} className="h-10 bg-muted border-none rounded-lg text-sm" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-muted-foreground">Bio (opcional)</Label>
                            <textarea
                                value={data.founder.bio}
                                onChange={e => setFounder('bio', e.target.value)}
                                className="w-full min-h-24 bg-muted border-none rounded-lg px-3 py-2.5 text-sm resize-none focus:ring-2 focus:ring-ring"
                                placeholder="Conte um pouco sobre sua trajetória e especialidades..."
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* ── Tab: Brand ── */}
            {activeTab === "brand" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="relative rounded-xl border border-amber-200/20 dark:border-amber-500/10 p-6 space-y-6 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm overflow-hidden">
                        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(232,168,58,0.03) 0%, transparent 40%)' }} />
                        <div className="relative z-10 flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(232,168,58,0.2) 0%, rgba(232,168,58,0.05) 100%)', border: '1px solid rgba(232,168,58,0.2)' }}>
                                <Palette className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-foreground">Identidade Visual</h3>
                                <p className="text-xs text-muted-foreground">Cores aplicadas na sua página e botões</p>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6 pb-6 border-b border-amber-500/10">
                            <div>
                                <h4 className="text-sm font-semibold text-foreground">Logotipo Oficial</h4>
                                <p className="text-xs text-muted-foreground mt-0.5 mb-2">Recomendamos PNG plano com fundo transparente</p>
                            </div>
                            <ImageUpload
                                value={data.logoUrl || ""}
                                onChange={url => setField('logoUrl', url)}
                                className="h-24 w-48"
                            />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-muted-foreground">Cor Principal</Label>
                                <div className="flex bg-muted p-2 rounded-lg items-center gap-3">
                                    <div className="h-8 w-8 rounded-md border relative overflow-hidden shrink-0">
                                        <input type="color" value={data.colors.primary} onChange={e => setColors('primary', e.target.value)}
                                            className="absolute inset-0 w-full h-full cursor-pointer scale-150" />
                                    </div>
                                    <Input value={data.colors.primary} onChange={e => setColors('primary', e.target.value)} className="bg-transparent border-none h-7 text-xs font-bold p-0 focus:ring-0 uppercase" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-muted-foreground">Cor Hover</Label>
                                <div className="flex bg-muted p-2 rounded-lg items-center gap-3">
                                    <div className="h-8 w-8 rounded-md border relative overflow-hidden shrink-0">
                                        <input type="color" value={data.colors.hover} onChange={e => setColors('hover', e.target.value)}
                                            className="absolute inset-0 w-full h-full cursor-pointer scale-150" />
                                    </div>
                                    <Input value={data.colors.hover} onChange={e => setColors('hover', e.target.value)} className="bg-transparent border-none h-7 text-xs font-bold p-0 focus:ring-0 uppercase" />
                                </div>
                            </div>
                        </div>



                        {/* Live preview */}
                        <div className="space-y-2 pt-2">
                            <Label className="text-xs font-medium text-muted-foreground">Pré-visualização ao vivo</Label>
                            <div className="bg-muted rounded-lg p-5">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-10 w-10 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: data.colors.primary }}>
                                        {data.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">{data.name}</p>
                                        <p className="text-xs text-muted-foreground">agendaonline.com/{data.slug}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="flex-1 h-9 rounded-lg text-xs font-semibold text-white transition-transform hover:scale-[0.98]" style={{ backgroundColor: data.colors.primary }}>
                                        Agendar Agora
                                    </button>
                                    <button className="flex-1 h-9 rounded-lg text-xs font-semibold text-white transition-transform hover:scale-[0.98]" style={{ backgroundColor: data.colors.hover }}>
                                        Ver Serviços
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Brand tip */}
                    <div className="bg-stone-900 rounded-xl border border-stone-800 p-5 text-white">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-amber-400">✨</span>
                            <span className="text-xs font-medium text-stone-400">Dica de Marca</span>
                        </div>
                        <p className="text-sm font-semibold text-white mb-1">Cores definem percepção de valor</p>
                        <p className="text-xs text-stone-400 leading-relaxed">Tons terrosos e dourados transmitem sofisticação e exclusividade. Evite cores vibrantes demais para manter a elegância.</p>
                    </div>
                </div>
            )}

            {/* ── Tab: Finance ── */}
            {activeTab === "finance" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="relative rounded-xl border border-amber-200/20 dark:border-amber-500/10 p-6 space-y-6 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm overflow-hidden">
                        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(232,168,58,0.03) 0%, transparent 40%)' }} />
                        <div className="relative z-10 flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(232,168,58,0.2) 0%, rgba(232,168,58,0.05) 100%)', border: '1px solid rgba(232,168,58,0.2)' }}>
                                <Smartphone className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-foreground">Configuração de Pagamentos</h3>
                                <p className="text-xs text-muted-foreground">Defina os dados para recebimento</p>
                            </div>
                        </div>

                        <div className="space-y-6 relative z-10">
                            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 flex gap-3">
                                <Info className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-400">Configuração de PIX</p>
                                    <p className="text-xs text-emerald-700/70 dark:text-emerald-400/60 leading-relaxed">
                                        Estas informações serão exibidas no modal de conclusão de atendimento para facilitar o pagamento dos seus clientes.
                                    </p>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-xs font-medium text-muted-foreground">Tipo de Chave PIX</Label>
                                    <select 
                                        value={data.pix?.type || 'random'} 
                                        onChange={e => setPix('type', e.target.value)}
                                        className="w-full h-10 px-3 bg-muted border-none rounded-lg text-sm focus:ring-2 focus:ring-amber-500/20 transition-all outline-hidden appearance-none cursor-pointer"
                                    >
                                        <option value="email">E-mail</option>
                                        <option value="phone">Telefone</option>
                                        <option value="cpf_cnpj">CPF ou CNPJ</option>
                                        <option value="random">Chave Aleatória</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-medium text-muted-foreground">Chave PIX</Label>
                                    <Input 
                                        value={data.pix?.key || ''} 
                                        onChange={e => setPix('key', e.target.value)} 
                                        placeholder="Sua chave aqui..."
                                        className="h-10 bg-muted border-none rounded-lg text-sm" 
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-amber-500/10">
                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-stone-950 border border-white/5">
                                    <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                        <Banknote className="h-5 w-5 text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Visualização no Modal</p>
                                        <p className="text-xs font-bold text-foreground">
                                            {data.pix?.type === 'email' ? 'E-mail' : 
                                             data.pix?.type === 'phone' ? 'Telefone' : 
                                             data.pix?.type === 'cpf_cnpj' ? 'CPF/CNPJ' : 'Chave'} • <span className="text-emerald-500">{data.pix?.key || 'Não configurada'}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

