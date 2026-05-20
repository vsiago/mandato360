"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { createTenantAction } from "@/lib/actions/tenant"
import { toast } from "sonner"
import { getTenantDefaults } from "@/lib/tenant-defaults"
import type { TenantData } from "@/lib/tenant-types"
import {
    Building2, Phone, Palette, Rocket,
    ChevronRight, ChevronLeft, Check, Loader2,
    Instagram, MapPin, Smartphone, User, Globe
} from "lucide-react"
import { useSession } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeSelectorOnboarding } from "@/components/theme-selector"
import { getDefaultThemeForNiche, getTheme } from "@/src/themes"
import type { ThemeId } from "@/src/themes/types"

const STEPS = [
    { id: 1, title: "Negócio", icon: Building2, description: "Identidade básica da sua marca" },
    { id: 2, title: "Pronto", icon: Check, description: "Seu site está no ar" },
]

interface BusinessTypeOption {
    id: string
    name: string
    slug: string
    emoji: string | null
    icon: string | null
    description: string | null
}

export default function OnboardingPage() {
    const router = useRouter()
    const generateSlug = (name: string) => {
        return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    }
    const [step, setStep] = useState(1)
    const [saving, setSaving] = useState(false)
    const [niches, setNiches] = useState<BusinessTypeOption[]>([])
    const [nichesLoading, setNichesLoading] = useState(true)
    const [data, setData] = useState<Partial<TenantData>>({
        name: "",
        slug: "",
        businessTypeId: "",
        contact: { phone: "", whatsapp: "", address: "", mapEmbedUrl: "", instagram: "" },
        colors: { primary: "#F59E0B", hover: "#D97706" }, // Agenda Online Amber
        founder: { name: "", bio: "", role: "", imageUrl: "" },
        logoUrl: "",
        theme: "neutro" as ThemeId,
    })
    const { data: session } = useSession()
    const [mounted, setMounted] = useState(false)

    // Root users should always be in the admin area
    useEffect(() => {
        if (session?.user?.role === "root") {
            router.push("/admin")
        }
    }, [session, router])

    const storageKey = session?.user?.id ? `agenda_onboarding_${session.user.id}` : null

    useEffect(() => {
        setMounted(true)
        if (!storageKey) return

        const saved = localStorage.getItem(storageKey)
        const hash = window.location.hash
        
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                if (parsed.data) setData(prev => ({ ...prev, ...parsed.data }))
                if (parsed.step) setStep(parsed.step)
            } catch (e) {
                console.error("Error loading onboarding state", e)
            }
        }

        if (hash.startsWith("#")) {
            const stepId = hash.replace("#", "")
            const foundStep = STEPS.find(s => generateSlug(s.title) === stepId)
            if (foundStep) setStep(foundStep.id)
        }
    }, [storageKey])

    // Save to LocalStorage and update hash on change
    useEffect(() => {
        if (!mounted || !storageKey) return
        localStorage.setItem(storageKey, JSON.stringify({ data, step }))
        if (step < 2) {
            const stepId = generateSlug(STEPS[step - 1].title)
            const newHash = `#${stepId}`
            if (window.location.hash !== newHash) {
                window.history.replaceState(null, "", newHash)
            }
        }
    }, [data, step, mounted, storageKey])

    // Load business types from DB
    useEffect(() => {
        fetch("/api/taxonomy/business-types")
            .then(res => res.json())
            .then((types: BusinessTypeOption[]) => {
                if (Array.isArray(types)) {
                    setNiches(types)
                    // Only set default if not already set by LocalStorage
                    setData(prev => {
                        if (types.length > 0 && !prev.businessTypeId) {
                            return { ...prev, businessTypeId: types[0].id }
                        }
                        return prev
                    })
                } else {
                    toast.error("Erro no formato dos dados")
                    setNiches([])
                }
            })
            .catch(() => toast.error("Erro ao carregar tipos de negócio"))
            .finally(() => setNichesLoading(false))
    }, [])

    const set = <K extends keyof TenantData>(key: K, value: any) => {
        setData(prev => ({ ...prev, [key]: value }))
    }
    const setContact = (key: string, value: string) => {
        setData(prev => ({ ...prev, contact: { ...prev.contact!, [key]: value } }))
    }
    const setFounder = (key: string, value: string) => {
        setData(prev => ({ ...prev, founder: { ...prev.founder!, [key]: value } }))
    }
    const setColors = (key: string, value: string) => {
        setData(prev => ({ ...prev, colors: { ...prev.colors!, [key]: value } }))
    }


    const handleNext = () => {
        if (step < 2) setStep(step + 1)
    }
    const handlePrev = () => {
        if (step > 1) setStep(step - 1)
    }

    const handleFinish = async () => {
        setSaving(true)
        const defaults = getTenantDefaults(data.businessTypeId)
        const slug = data.slug || generateSlug(data.name || "meu-negocio")

        try {
            const result = await createTenantAction({
                ...data,
                slug,
                surname: data.surname || defaults.surname,
                description: data.description || defaults.description,
                heroBadge: data.heroBadge || defaults.heroBadge,
                heroHeadline: data.heroHeadline || defaults.heroHeadline,
                heroHighlight: data.heroHighlight || defaults.heroHighlight,
                title: data.title || `${data.name} | Agendamento Online`,
                ctaText: data.ctaText || "Agendar Horário",
                trustBadges: data.trustBadges || defaults.trustBadges,
                chat: data.chat || defaults.chat,
                faq: data.faq || defaults.faq,
                categories: data.categories || defaults.categories,
                services: (data.services && data.services.length > 0) ? data.services : defaults.services,
                beforeAfter: data.beforeAfter || [],
                theme: data.theme || "neutro",
                onboardingCompleted: true,
            })

            if (!result.success) {
                setSaving(false)
                toast.error(result.error || "Erro ao criar seu site")
                return
            }

            setSaving(false)
            setStep(2)
            if (storageKey) localStorage.removeItem(storageKey)
            toast.success("Site criado com sucesso!")
        } catch (error: any) {
            setSaving(false)
            console.error("Error creating tenant:", error)
            toast.error(error.message || "Erro ao criar seu site")
        }
    }

    const canProceed = () => {
        switch (step) {
            case 1: return !!(
                data.name && 
                data.name.length > 2 && 
                data.businessTypeId && 
                data.contact?.whatsapp && 
                data.contact.whatsapp.length >= 10
            )
            default: return true
        }
    }

    return (
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-0 sm:p-4 md:p-8 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-500/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-stone-800/20 blur-[120px] rounded-full" />

            <div className="w-full max-w-3xl relative z-10 flex flex-col min-h-screen sm:min-h-0">
                {/* Header/Logo (Floating on Mobile) */}
                <div className="pt-8 pb-6 px-6 sm:px-0 flex justify-between items-center sm:block">
                    <div className="flex items-center gap-2 mb-2 group cursor-pointer" onClick={() => router.push('/')}>
                        <div className="w-8 h-8 md:w-9 md:h-9 bg-amber-500 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                            <Building2 className="w-5 h-5 text-black" />
                        </div>
                        <span className="text-xl md:text-2xl font-bold text-white tracking-tight">
                            AgendaOnline
                        </span>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="px-6 sm:px-0 mb-8 sm:mb-12">
                    <div className="flex items-center justify-between relative">
                        {/* Connector Line */}
                        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-stone-800 z-0" />
                        <motion.div 
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-amber-500 z-10"
                            initial={{ width: "0%" }}
                            animate={{ width: `${(step - 1) * 100}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        />

                        {STEPS.map((s) => (
                            <div key={s.id} className="relative z-20 flex flex-col items-center">
                                <motion.div
                                    animate={{
                                        scale: step >= s.id ? 1 : 0.9,
                                        backgroundColor: step >= s.id ? "#F59E0B" : "#1C1917",
                                        borderColor: step >= s.id ? "#F59E0B" : "#292524"
                                    }}
                                    className={cn(
                                        "w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-colors",
                                        step >= s.id ? "text-stone-950" : "text-stone-600 border border-stone-800"
                                    )}
                                >
                                    {step > s.id ? <Check className="h-4 w-4 sm:h-5 sm:w-5" /> : <s.icon className="h-4 w-4 sm:h-5 sm:w-5" />}
                                </motion.div>
                                <span className={cn(
                                    "hidden sm:block absolute -bottom-7 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap",
                                    step >= s.id ? "text-amber-500" : "text-stone-600"
                                )}>
                                    {s.title}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content Card */}
                <motion.div 
                    layout
                    className="flex-1 sm:w-full sm:max-w-3xl mx-auto sm:bg-stone-900/20 sm:backdrop-blur-md sm:border border-stone-800/30 sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                >
                    <div className="flex-1 p-6 sm:p-10 md:p-14">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                                className="w-full mx-auto"
                            >
                                {/* Step Header */}
                                {step < 2 && (
                                    <div className="mb-10 text-center sm:text-left border-l-2 border-amber-500/30 pl-6">
                                        <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                                            {STEPS[step - 1].title}
                                        </h2>
                                        <p className="text-stone-500 text-sm sm:text-base">{STEPS[step - 1].description}</p>
                                    </div>
                                )}

                                {/* Step 1: Business Info */}
                                {step === 1 && (
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-semibold text-stone-400 uppercase tracking-widest pl-1">Nome do Negócio</Label>
                                                <Input 
                                                    value={data.name} 
                                                    onChange={e => { set("name", e.target.value); set("slug", generateSlug(e.target.value)) }}
                                                    placeholder="Ex: Studio Maria Oliveira"
                                                    className="h-11 bg-stone-900/50 border-stone-800 rounded-lg text-white placeholder:text-stone-600 text-sm transition-all shadow-sm" 
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <Smartphone className="w-3.5 h-3.5 text-stone-400" />
                                                    <Label className="text-xs font-semibold text-stone-400 uppercase tracking-widest pl-1">WhatsApp Principal</Label>
                                                </div>
                                                <Input 
                                                    value={data.contact?.whatsapp} 
                                                    onChange={e => setContact("whatsapp", e.target.value)}
                                                    placeholder="5521999999999" 
                                                    type="tel"
                                                    className="h-11 bg-stone-900/50 border-stone-800 rounded-lg text-white text-sm focus:border-amber-500 transition-all shadow-sm" 
                                                />
                                                <p className="text-[10px] text-stone-600 px-1">Inclua 55 + DDD + número</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <Label className="text-sm font-semibold text-stone-200">Escolha o seu nicho profissional</Label>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-75 sm:max-h-100 overflow-y-auto pr-2 custom-scrollbar pb-2">
                                                {nichesLoading ? (
                                                    Array.from({ length: 9 }).map((_, i) => (
                                                        <div key={i} className="h-20 rounded-2xl bg-stone-800/30 border border-stone-800/50 animate-pulse" />
                                                    ))
                                                ) : (
                                                    niches.map(niche => (
                                                        <button 
                                                            key={niche.id} 
                                                            onClick={() => {
                                                                set("businessTypeId", niche.id);
                                                                set("theme", getDefaultThemeForNiche(niche.slug));
                                                            }}
                                                            className={cn(
                                                                "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border text-center transition-all group",
                                                                data.businessTypeId === niche.id
                                                                    ? "bg-amber-500/10 border-amber-500/50 text-amber-500"
                                                                    : "bg-stone-950 border-stone-800 text-stone-500 hover:border-stone-700 hover:bg-stone-900"
                                                            )}
                                                        >
                                                            <span className="text-2xl group-hover:scale-110 transition-transform">{niche.emoji || niche.icon || '📝'}</span>
                                                            <span className="text-[10px] font-bold uppercase tracking-widest">{niche.name}</span>
                                                        </button>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Finalized! */}
                                {step === 2 && (
                                    <div className="text-center py-10 space-y-8">
                                        <div className="relative inline-block">
                                            <motion.div 
                                                className="w-20 h-20 rounded-2xl bg-amber-500 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/10"
                                                initial={{ scale: 0, rotate: -10 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                            >
                                                <Check className="h-10 w-10 text-stone-950" />
                                            </motion.div>
                                        </div>
                                        
                                        <div>
                                            <h1 className="text-3xl sm:text-4xl font-semibold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                                                Seu site está pronto
                                            </h1>
                                            <p className="text-stone-500 text-base max-w-sm mx-auto leading-relaxed">
                                                Configurações aplicadas com sucesso. Seu link profissional já está disponível.
                                            </p>
                                        </div>

                                        <div className="bg-stone-950/50 p-6 rounded-2xl border border-stone-800 max-w-sm mx-auto">
                                            <Label className="text-[10px] font-bold uppercase text-stone-600 tracking-widest block mb-3 text-center">URL do Site</Label>
                                            <div className="flex items-center justify-between gap-3 bg-stone-950 p-2 rounded-lg border border-stone-800 select-all">
                                                <p className="text-stone-200 font-mono text-sm truncate flex-1 pl-2">agendaonline.com.br/{data.slug}</p>
                                                <button onClick={() => {
                                                    navigator.clipboard.writeText(`https://agendaonline.com.br/${data.slug}`)
                                                    toast.success("Copiado!")
                                                }} className="p-2 bg-stone-900 rounded-md hover:bg-stone-800 transition-colors">
                                                    <Check className="w-4 h-4 text-amber-500" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
                                            <Button 
                                                onClick={() => router.push("/painel")}
                                                className="flex-1 h-11 bg-amber-500 hover:bg-amber-600 text-stone-950 font-semibold rounded-lg text-sm"
                                            >
                                                Acessar Painel
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                onClick={() => window.open(`/${data.slug}`, '_blank')}
                                                className="flex-1 h-11 border-stone-800 bg-stone-900/50 hover:bg-stone-800 text-stone-300 font-medium rounded-lg text-sm"
                                            >
                                                Ver Site
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Footer Actions */}
                    {step < 2 && (
                        <div className="p-6 sm:px-10 md:px-14 pb-8 sm:pb-12 bg-stone-950/20 border-t border-stone-800/50 flex flex-col sm:flex-row items-center justify-center gap-6 mt-auto">
                            <Button 
                                onClick={handleFinish} 
                                disabled={saving || !canProceed()}
                                className="w-full sm:w-64 h-12 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl shadow-lg shadow-amber-500/10 disabled:opacity-50 transition-all overflow-hidden relative font-sans text-base"
                            >
                                {saving && <div className="absolute inset-0 bg-stone-950/20 flex items-center justify-center"><Loader2 className="animate-spin h-5 w-5" /></div>}
                                <div className="flex items-center justify-center gap-2">
                                    {saving ? "Configurando tudo..." : "Concluir e Ver Meu Site"}
                                </div>
                            </Button>
                        </div>
                    )}
                </motion.div>

                {/* Footer Security */}
                {step < 2 && (
                    <div className="py-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-center gap-6 opacity-30 group grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest">Enviando dados via TLS 1.3</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-3 h-3 text-stone-300" />
                            <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest">LGPD Compliant Cloud</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function ShieldCheck(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    )
}
