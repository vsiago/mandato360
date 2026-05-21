"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, UserPlus, Star, Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { PLANS, type PlanKey } from "@/lib/asaas"
import { motion, AnimatePresence } from "framer-motion"

function RegistroContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const planParam = searchParams.get("plan") as PlanKey | null
    const selectedPlan = planParam && planParam in PLANS ? PLANS[planParam] : null

    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        const redirectPath = planParam
            ? `/checkout?plan=${planParam}`
            : "/onboarding"

        try {
            await authClient.signUp.email({
                email,
                password,
                name,
                callbackURL: redirectPath,
            }, {
                onRequest: () => setIsLoading(true),
                onSuccess: () => {
                    setIsLoading(false)
                    toast.success("Conta criada com sucesso!")
                    router.push("/verificar-email")
                },
                onError: (ctx) => {
                    setIsLoading(false)
                    toast.error(ctx.error.message || "Erro ao criar conta")
                }
            })
        } catch {
            setIsLoading(false)
            toast.error("Ocorreu um erro inesperado")
        }
    }

    return (
        <main id="conteudo" className="w-full max-w-5xl mx-auto sm:px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`grid ${selectedPlan ? 'lg:grid-cols-[1fr_1.1fr]' : 'max-w-md mx-auto'} gap-0 items-stretch overflow-hidden sm:rounded-3xl shadow-2xl shadow-black/20 dark:shadow-black/40`}
            >

                {/* ── Left Column: Plan Card (desktop) ── */}
                {selectedPlan && (
                    <div className="hidden lg:flex flex-col justify-center relative overflow-hidden bg-[#0A0A0A]">
                        {/* Animated background elements */}
                        <motion.div 
                            animate={{ 
                                scale: [1, 1.2, 1],
                                opacity: [0.1, 0.2, 0.1]
                            }}
                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-amber-500/10 blur-[100px]" 
                        />
                        <motion.div 
                            animate={{ 
                                scale: [1, 1.3, 1],
                                opacity: [0.05, 0.15, 0.05]
                            }}
                            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute -bottom-40 -left-20 w-[500px] h-[500px] rounded-full bg-amber-600/5 blur-[120px]" 
                        />

                        <div className="relative z-10 p-10 xl:p-12 flex flex-col h-full border-r border-stone-800/30">
                            <div className="flex-1 flex flex-col justify-center">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                                            <Sparkles className="h-6 w-6 text-black" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-white tracking-tight leading-none" style={{ fontFamily: 'var(--font-playfair)' }}>
                                                {selectedPlan.name}
                                            </h2>
                                            {'popular' in selectedPlan && selectedPlan.popular && (
                                                <div className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-amber-500 text-black px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter">
                                                    <Star className="h-2.5 w-2.5 fill-black" /> Recomendado
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-baseline gap-2 mb-8">
                                        <span className="text-6xl font-black text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
                                            {selectedPlan.displayPrice}
                                        </span>
                                        <span className="text-stone-500 font-medium">/mês</span>
                                    </div>

                                    <div className="space-y-4 mb-10">
                                        {selectedPlan.features.slice(0, 5).map((feature, i) => (
                                            <motion.div 
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.4 + (i * 0.1) }}
                                                className="flex items-start gap-3 group"
                                            >
                                                <div className="mt-1 h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                                                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                                                </div>
                                                <span className="text-sm text-stone-300 font-medium group-hover:text-white transition-colors">{feature}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>

                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                    className="p-6 rounded-2xl bg-stone-900/50 backdrop-blur-sm border border-stone-800/50 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-3">
                                        <Zap className="h-10 w-10 text-amber-500/5" />
                                    </div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-bold text-stone-400">Total HOJE</span>
                                        <span className="text-2xl font-black text-emerald-400">R$ 0,00</span>
                                    </div>
                                    <p className="text-[11px] text-stone-500 font-medium tracking-wide">Teste grátis por 7 dias. Sem compromisso.</p>
                                </motion.div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-stone-800/50 flex items-center justify-between">
                                <div className="flex -space-x-2">
                                    {[1,2,3,4].map(i => (
                                        <div key={i} className="h-8 w-8 rounded-full border-2 border-stone-900 bg-stone-800 flex items-center justify-center overflow-hidden">
                                            <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" className="h-full w-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                                        </div>
                                    ))}
                                </div>
                                <span className="text-[10px] text-stone-500 font-bold uppercase tracking-widest">+500 negócios usam</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Right Column: Registration Form ── */}
                <div className={`flex flex-col justify-center relative bg-white dark:bg-[#0D0D0D] p-6 sm:p-10 lg:p-12 h-full border-t lg:border-t-0 border-stone-200 dark:border-stone-800 shadow-inner shadow-black/5`}>
                    
                    {/* Animated side glow for dark mode */}
                    <div className="absolute top-1/4 right-0 w-32 h-64 bg-amber-500/5 blur-[80px] pointer-events-none hidden dark:block" />

                    {/* Mobile plan badge — redesigned for "Concept UI" native feel */}
                    {selectedPlan && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="lg:hidden mb-8"
                        >
                            <div className="relative overflow-hidden bg-stone-900 rounded-2xl p-4 border border-stone-800 shadow-xl shadow-black/20">
                                <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-500/10 blur-2xl" />
                                <div className="flex items-center justify-between relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
                                            <Sparkles className="h-5 w-5 text-black" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-stone-500 font-black uppercase tracking-widest leading-none mb-1">Assinando agora</p>
                                            <p className="text-lg font-black text-white leading-none tracking-tight">Plano {selectedPlan.name}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mb-1 animate-pulse">Grátis 7 dias</p>
                                        <p className="text-xl font-black text-white leading-none">{selectedPlan.displayPrice}<span className="text-[10px] text-stone-500 ml-0.5">/mês</span></p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Header */}
                    <motion.header
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8"
                    >
                        <div className="mb-6 flex items-center gap-2 text-xs">
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 font-bold uppercase tracking-wider">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Etapa 1 de 3
                            </span>
                            <span className="text-stone-400 dark:text-stone-600">Criar conta · Personalizar site · Receber clientes</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-semibold text-stone-900 dark:text-white mb-3 tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
                            Crie sua conta grátis
                        </h1>
                        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed max-w-sm">
                            {selectedPlan
                                ? `Experimente o ${selectedPlan.name} por 7 dias. Não cobramos nada hoje e você cancela em 1 clique.`
                                : "Site profissional + agenda 24h em 3 minutos. 7 dias grátis, sem cartão."
                            }
                        </p>
                    </motion.header>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-2"
                        >
                            <Label htmlFor="reg-name" className="text-xs font-medium text-stone-500 dark:text-stone-400 ml-1">
                                Nome da Empresa ou Profissional
                            </Label>
                            <Input
                                id="reg-name"
                                placeholder="Ex: Studio VIP"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-11 px-4 rounded-lg bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-600 font-medium focus-visible:ring-amber-500/20 focus-visible:border-amber-500 transition-all text-sm shadow-sm"
                            />
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-2"
                        >
                            <Label htmlFor="reg-email" className="text-xs font-medium text-stone-500 dark:text-stone-400 ml-1">
                                E-mail de acesso
                            </Label>
                            <Input
                                id="reg-email"
                                type="email"
                                placeholder="seu@email.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-11 px-4 rounded-lg bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-600 font-medium focus-visible:ring-amber-500/20 focus-visible:border-amber-500 transition-all text-sm shadow-sm"
                            />
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="space-y-2"
                        >
                            <Label htmlFor="reg-password" className="text-xs font-medium text-stone-500 dark:text-stone-400 ml-1">
                                Crie uma senha segura
                            </Label>
                            <div className="relative group">
                                <Input
                                    id="reg-password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="No mínimo 6 caracteres"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-11 px-4 rounded-lg bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-600 font-medium pr-12 focus-visible:ring-amber-500/20 focus-visible:border-amber-500 transition-all text-sm shadow-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-amber-500 dark:text-stone-600 dark:hover:text-amber-500 transition-colors p-2 cursor-pointer"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-11 bg-amber-500 hover:bg-amber-600 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-stone-950 font-semibold text-sm rounded-lg transition-all duration-200 disabled:opacity-50 group overflow-hidden relative cursor-pointer shadow-sm"
                            >
                                <AnimatePresence mode="wait">
                                    {isLoading ? (
                                        <motion.div 
                                            key="loading"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="h-6 w-6 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" 
                                        />
                                    ) : (
                                        <motion.span 
                                            key="content"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center gap-2"
                                        >
                                            <UserPlus className="h-5 w-5 mr-1" /> Criar minha conta
                                            <motion.div
                                                animate={{ x: [0, 5, 0] }}
                                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                            >
                                                <ArrowRight className="h-5 w-5 ml-1" />
                                            </motion.div>
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                                
                                {/* Button hover shine effect */}
                                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                            </Button>
                        </motion.div>
                    </form>

                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="mt-8 pt-8 border-t border-stone-100 dark:border-stone-800/50 text-center"
                    >
                        <p className="text-sm font-medium text-stone-500 dark:text-stone-500">
                            Já utiliza a plataforma?{" "}
                            <Link
                                href={planParam ? `/login?plan=${planParam}` : "/login"}
                                className="text-stone-900 dark:text-stone-100 underline underline-offset-4 decoration-stone-300 dark:decoration-stone-700 hover:decoration-amber-500 font-semibold transition-all"
                            >
                                Fazer login agora
                            </Link>
                        </p>
                    </motion.div>

                    <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10px] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-600">
                        <li className="flex items-center gap-1.5">
                            <ShieldCheck className="h-4 w-4" />
                            <span>SSL · LGPD</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500/70" />
                            <span>Sem cartão</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500/70" />
                            <span>Cancele em 1 clique</span>
                        </li>
                    </ul>
                </div>
            </motion.div>
        </main>
    )
}

export default function RegistroPage() {
    return (
        <Suspense fallback={null}>
            <RegistroContent />
        </Suspense>
    )
}
