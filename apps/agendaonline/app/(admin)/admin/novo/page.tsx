"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { adminCreateTenantAction } from "@/lib/actions/admin"
import { ThemeSelectorOnboarding } from "@/components/theme-selector"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, ChevronLeft, Loader2, Copy, Check, Globe, Key } from "lucide-react"

export default function AdminNewTenantPage() {
    const router = useRouter()
    const [saving, setSaving] = useState(false)
    const [niches, setNiches] = useState<any[]>([])
    const [result, setResult] = useState<any>(null)
    const [copied, setCopied] = useState(false)

    const [data, setData] = useState({
        name: "",
        slug: "",
        businessTypeId: "",
        theme: "neutro",
        demoEmail: "",
        demoPassword: ""
    })

    const generateSlug = (name: string) => name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")

    useEffect(() => {
        fetch("/api/taxonomy/business-types")
            .then(res => res.json())
            .then((types: any[]) => {
                if (Array.isArray(types)) {
                    setNiches(types)
                    if (types.length > 0) setData(p => ({ ...p, businessTypeId: types[0].id }))
                }
            })
            .catch(() => toast.error("Erro ao carregar nichos"))
    }, [])

    const handleAutoGenerate = () => {
        if (!data.name) {
            toast.error("Preencha o nome do negócio primeiro")
            return
        }
        const slug = generateSlug(data.name)
        const demoEmail = `demo@${slug}.com.br`
        const demoPassword = Math.random().toString(36).slice(-8) + "Aa1!"

        setData(prev => ({
            ...prev,
            slug,
            demoEmail,
            demoPassword
        }))
    }

    const handleSubmit = async () => {
        if (!data.name || !data.demoEmail || !data.demoPassword || !data.businessTypeId) {
            toast.error("Preencha todos os campos obrigatórios")
            return
        }

        setSaving(true)
        try {
            const res = await adminCreateTenantAction(data)
            if (res.success) {
                toast.success("Inquilino criado com sucesso!")
                setResult(res)
            } else {
                toast.error(res.error || "Erro ao criar inquilino")
            }
        } catch (err: any) {
            toast.error(err.message || "Erro inesperado")
        } finally {
            setSaving(false)
        }
    }

    const copyCredentials = () => {
        const text = `🎉 *Seu novo site está pronto!*\n\n🌐 *Link*: ${result.siteUrl}\n\n*Acesso ao Painel:*\n📧 E-mail: ${result.demoEmail}\n🔑 Senha: ${result.demoPassword}\n\nAcesse e confira!`
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        toast.success("Credenciais copiadas!")
    }

    if (result) {
        return (
            <div className="max-w-2xl mx-auto mt-10">
                <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 sm:p-12 text-center shadow-xl">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-bold text-foreground mb-4">Inquilino Gerado!</h2>
                    <p className="text-muted-foreground mb-8">O ambiente de demonstração foi criado com sucesso.</p>

                    <div className="bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 text-left space-y-4 mb-8">
                        <div>
                            <Label className="text-xs text-muted-foreground uppercase tracking-wider">URL do Site</Label>
                            <div className="flex items-center gap-2 mt-1">
                                <Globe className="w-4 h-4 text-amber-500" />
                                <span className="font-mono text-foreground font-medium">{result.siteUrl}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Login</Label>
                                <p className="font-mono text-sm text-foreground mt-1">{result.demoEmail}</p>
                            </div>
                            <div>
                                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Senha</Label>
                                <p className="font-mono text-sm text-foreground mt-1">{result.demoPassword}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button 
                            variant="outline" 
                            className="flex-1 h-12 rounded-xl"
                            onClick={() => {
                                setResult(null);
                                setData({name: "", slug: "", businessTypeId: niches[0]?.id, theme: "neutro", demoEmail: "", demoPassword: ""});
                            }}
                        >
                            Criar Outro
                        </Button>
                        <Button 
                            className="flex-1 h-12 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold"
                            onClick={copyCredentials}
                        >
                            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                            {copied ? "Copiado" : "Copiar para WhatsApp"}
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto pb-20">
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" size="icon" onClick={() => router.push("/admin")} className="rounded-full">
                    <ChevronLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Novo Inquilino Express</h1>
                    <p className="text-sm text-muted-foreground">Crie um site de demonstração instantaneamente.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-10">
                {/* Seção do Inquilino */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-4">
                        <Building2 className="w-5 h-5 text-amber-500" />
                        <h2 className="text-lg font-semibold">Dados do Negócio</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Nome do Negócio</Label>
                            <Input 
                                value={data.name} 
                                onChange={e => setData({...data, name: e.target.value})}
                                placeholder="Ex: Studio Demo"
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label>URL Pública</Label>
                                <button type="button" onClick={handleAutoGenerate} className="text-xs text-amber-600 dark:text-amber-500 hover:underline">
                                    Gerar Credenciais
                                </button>
                            </div>
                            <div className="flex items-center h-11 bg-stone-50 dark:bg-stone-950 border border-input rounded-lg overflow-hidden">
                                <span className="text-muted-foreground text-xs px-3 border-r border-input bg-muted/50 h-full flex items-center">ao.app/</span>
                                <input 
                                    value={data.slug} 
                                    onChange={e => setData({...data, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")})}
                                    className="flex-1 h-full bg-transparent text-sm px-3 outline-none min-w-0" 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label>Nicho</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                            {niches.map(niche => (
                                <button 
                                    key={niche.id} 
                                    onClick={() => setData({...data, businessTypeId: niche.id})}
                                    className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border text-center transition-all ${
                                        data.businessTypeId === niche.id
                                            ? "bg-amber-50 dark:bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-500"
                                            : "bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-muted-foreground hover:border-stone-300 dark:hover:border-stone-700"
                                    }`}
                                >
                                    <span className="text-xl">{niche.emoji || niche.icon || '📝'}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest">{niche.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3 pt-4">
                        <Label>Tema Visual</Label>
                        <ThemeSelectorOnboarding 
                            value={data.theme as any} 
                            onChange={v => setData({...data, theme: v})} 
                        />
                    </div>
                </div>

                {/* Seção do Usuário Demo */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-4">
                        <Key className="w-5 h-5 text-amber-500" />
                        <h2 className="text-lg font-semibold">Credenciais de Acesso (Demo)</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>E-mail de Login</Label>
                            <Input 
                                type="email"
                                value={data.demoEmail} 
                                onChange={e => setData({...data, demoEmail: e.target.value})}
                                placeholder="demo@..."
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Senha</Label>
                            <Input 
                                type="text"
                                value={data.demoPassword} 
                                onChange={e => setData({...data, demoPassword: e.target.value})}
                                placeholder="Senha segura"
                                className="h-11"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-stone-100 dark:border-stone-800 flex justify-end">
                    <Button 
                        onClick={handleSubmit} 
                        disabled={saving}
                        className="w-full sm:w-auto h-12 px-8 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl shadow-lg shadow-amber-500/20"
                    >
                        {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {saving ? "Gerando Ambiente..." : "Criar Inquilino e Usuário Demo"}
                    </Button>
                </div>
            </div>
        </div>
    )
}
