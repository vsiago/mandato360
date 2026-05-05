"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { getClientDetails, repairTenantServices } from "@/lib/actions/admin"
import { 
    Mail, 
    Calendar, 
    ShieldCheck, 
    User as UserIcon,
    CheckCircle2,
    XCircle,
    ArrowLeft,
    Phone,
    Instagram,
    MapPin,
    Globe,
    CreditCard,
    ExternalLink,
    Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"

export default function ClientProfilePage() {
    const { id } = useParams()
    const router = useRouter()
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [repairing, setRepairing] = useState(false)

    useEffect(() => {
        if (id) fetchDetails()
    }, [id])

    async function fetchDetails() {
        try {
            const result = await getClientDetails(id as string)
            if (!result) {
                toast.error("Cliente não encontrado")
                router.push("/admin/clientes")
                return
            }
            setData(result)
        } catch (err) {
            toast.error("Erro ao carregar detalhes")
        } finally {
            setLoading(false)
        }
    }

    async function handleRepair() {
        if (!tenant?.id) return
        setRepairing(true)
        try {
            const res = await repairTenantServices(tenant.id)
            if (res.success) {
                toast.success("Serviços reparados com sucesso!")
            } else {
                toast.error("Erro ao reparar serviços")
            }
        } catch (err) {
            toast.error("Falha na comunicação com o servidor")
        } finally {
            setRepairing(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
            </div>
        )
    }

    if (!data) return null

    const { user, tenant } = data

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => router.back()}
                    className="h-10 w-10 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-800"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-stone-900 dark:text-white tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
                        Perfil do Cliente
                    </h1>
                    <p className="text-stone-500 dark:text-stone-400">Informações detalhadas da conta e do inquilino.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Account Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8 shadow-sm">
                        <div className="flex flex-col items-center text-center">
                            <div className="h-24 w-24 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-3xl text-stone-500 font-bold border-4 border-white dark:border-stone-900 shadow-xl mb-6">
                                {user.name?.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-1">{user.name}</h2>
                            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full mb-6">
                                {user.role === 'root' && <ShieldCheck className="h-3 w-3" />}
                                {user.role}
                            </div>

                            <div className="w-full space-y-4 text-left">
                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800">
                                    <Mail className="h-5 w-5 text-stone-400 shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">E-mail</p>
                                        <p className="text-sm font-medium text-stone-700 dark:text-stone-200 truncate">{user.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800">
                                    <Calendar className="h-5 w-5 text-stone-400 shrink-0" />
                                    <div>
                                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Cadastro em</p>
                                        <p className="text-sm font-medium text-stone-700 dark:text-stone-200">
                                            {format(new Date(user.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800">
                                    {user.emailVerified ? (
                                        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                                    ) : (
                                        <XCircle className="h-5 w-5 text-amber-500 shrink-0" />
                                    )}
                                    <div>
                                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Verificação</p>
                                        <p className={cn("text-sm font-bold", user.emailVerified ? "text-emerald-500" : "text-amber-500")}>
                                            {user.emailVerified ? "E-mail Verificado" : "E-mail Pendente"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Tenant Info */}
                <div className="lg:col-span-2 space-y-6">
                    {tenant ? (
                        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm">
                            <div className="bg-stone-50 dark:bg-stone-800/50 p-8 border-b border-stone-100 dark:border-stone-800 flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Globe className="h-4 w-4 text-amber-500" />
                                        <span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em]">Configuração do Site</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-stone-900 dark:text-white">{tenant.name}</h3>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <p className="text-stone-500 dark:text-stone-400 text-sm">Slug: <span className="font-mono text-amber-600">{tenant.slug}</span></p>
                                        <span className="text-[10px] font-bold text-stone-400 bg-stone-200/50 dark:bg-stone-800 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                            {tenant.businessType || 'Outros'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {tenant && (
                                        <Button 
                                            variant="outline"
                                            size="sm"
                                            disabled={repairing}
                                            onClick={handleRepair}
                                            className="rounded-xl border-amber-200 dark:border-amber-900/50 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 h-10 px-4"
                                        >
                                            <Zap className={cn("h-4 w-4 mr-2", repairing && "animate-pulse")} />
                                            {repairing ? "Reparando..." : "Reparar Serviços"}
                                        </Button>
                                    )}
                                    <Link href={`/${tenant.slug}`} target="_blank">
                                        <Button className="rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 gap-2 shadow-sm h-10 px-4">
                                            <ExternalLink className="h-4 w-4" />
                                            Acessar Site
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                                            <Phone className="h-3.5 w-3.5" /> Contato Direto
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800">
                                                <span className="text-sm text-stone-500 font-medium">WhatsApp</span>
                                                <a href={`https://wa.me/${tenant.whatsapp}`} target="_blank" className="text-sm font-bold text-stone-900 dark:text-white hover:text-amber-600 transition-colors">
                                                    {tenant.whatsapp || "Não cadastrado"}
                                                </a>
                                            </div>
                                            <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800">
                                                <span className="text-sm text-stone-500 font-medium">Instagram</span>
                                                <a href={`https://instagram.com/${tenant.instagram}`} target="_blank" className="text-sm font-bold text-stone-900 dark:text-white hover:text-amber-600 transition-colors flex items-center gap-2">
                                                    <Instagram className="h-4 w-4" /> @{tenant.instagram || "-"}
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                                            <MapPin className="h-3.5 w-3.5" /> Localização
                                        </h4>
                                        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800">
                                            <p className="text-sm font-medium text-stone-900 dark:text-white leading-relaxed">
                                                {tenant.address || "Endereço não cadastrado"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                                            <CreditCard className="h-3.5 w-3.5" /> Plano e Assinatura
                                        </h4>
                                        <div className="p-6 rounded-2xl bg-linear-to-br from-stone-900 to-stone-800 text-white border border-stone-800 shadow-lg relative overflow-hidden group">
                                            <Zap className="absolute -right-4 -top-4 h-24 w-24 text-amber-500/10 group-hover:scale-125 transition-transform duration-700" />
                                            <div className="relative z-10">
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Plano Atual</span>
                                                    {tenant.isDemo && (
                                                        <span className="text-[10px] font-black bg-white/10 px-2 py-0.5 rounded-md uppercase">DEMO</span>
                                                    )}
                                                </div>
                                                <p className="text-2xl font-bold capitalize">{tenant.plan || 'Free'}</p>
                                                <p className="text-xs text-stone-400 mt-1">Iniciado em {format(new Date(tenant.createdAt), "dd/MM/yyyy")}</p>
                                                
                                                <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                                                    <span className="text-xs font-medium text-stone-400">Status</span>
                                                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                                                        <CheckCircle2 className="h-3.5 w-3.5" /> Ativo
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                                            <Zap className="h-3.5 w-3.5" /> Estado da Conta
                                        </h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800">
                                                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Reivindicado</p>
                                                <p className="text-sm font-bold text-stone-900 dark:text-white">{tenant.claimed ? "Sim" : "Não"}</p>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800">
                                                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Tipo</p>
                                                <p className="text-sm font-bold text-stone-900 dark:text-white">{tenant.isDemo ? "Demonstração" : "Real"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-stone-100 dark:bg-stone-900/50 border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-3xl p-20 text-center">
                            <div className="h-16 w-16 bg-stone-200 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Globe className="h-8 w-8 text-stone-400" />
                            </div>
                            <h3 className="text-lg font-bold text-stone-900 dark:text-white">Nenhum Inquilino</h3>
                            <p className="text-stone-500 dark:text-stone-400 text-sm max-w-xs mx-auto mt-2">
                                Este usuário ainda não configurou um site ou negócio na plataforma.
                            </p>
                            <Button className="mt-8 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold shadow-lg shadow-amber-500/20">
                                Vincular Inquilino
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(" ")
}
