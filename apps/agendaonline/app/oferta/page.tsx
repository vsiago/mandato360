"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { CheckCircle2, Star, Sparkles, Zap, ArrowRight, ShieldCheck, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OfertaFundadorPage() {
    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-amber-500/30 overflow-hidden font-sans">
            
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-amber-500/10 blur-[120px]" />
                <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-amber-600/5 blur-[100px]" />
                <div className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-amber-400/5 blur-[80px]" />
            </div>

            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/5">
                <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
                    <Link href="/">
                        <img src="/logo-agenda-online.svg" alt="Agenda Online" className="h-10 w-auto filter invert" />
                    </Link>
                    <div className="hidden sm:flex items-center gap-6">
                        <span className="text-xs font-bold uppercase tracking-widest text-amber-500/80">Oferta Exclusiva</span>
                    </div>
                </div>
            </nav>

            <main className="pt-32 pb-24 px-6 relative z-10">
                <div className="mx-auto max-w-4xl text-center">
                    
                    {/* Badge */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-amber-500/30 text-amber-500 bg-amber-500/10 backdrop-blur-sm"
                    >
                        <Star className="h-3 w-3 fill-amber-500" /> Seja um de nossos 10 Fundadores
                    </motion.div>

                    {/* Headline */}
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]"
                        style={{ fontFamily: 'var(--font-playfair)' }}
                    >
                        Seu agendamento premium por apenas <span className="italic text-amber-500">R$ 29/mês.</span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg sm:text-xl text-stone-400 max-w-2xl mx-auto mb-12 leading-relaxed"
                    >
                        Estamos selecionando apenas 10 profissionais para serem nossos parceiros fundadores. Tenha todas as ferramentas do plano Profissional com um desconto vitalício de 60%.
                    </motion.p>

                    {/* Offer Card */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="relative mx-auto max-w-lg"
                    >
                        {/* Glow effect behind card */}
                        <div className="absolute inset-0 bg-amber-500/20 blur-3xl -z-10" />
                        
                        <div className="bg-stone-900/80 backdrop-blur-xl border border-amber-500/20 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6">
                                <Zap className="h-12 w-12 text-amber-500/5" />
                            </div>

                            <div className="text-left mb-10">
                                <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Plano Fundador</h3>
                                <p className="text-sm text-stone-500">Acesso completo e vitalício a este valor</p>
                            </div>

                            <div className="flex items-baseline gap-2 mb-10">
                                <span className="text-stone-500 text-2xl line-through decoration-red-500/50 decoration-2">R$79</span>
                                <span className="text-6xl font-black text-white" style={{ fontFamily: 'var(--font-playfair)' }}>R$29</span>
                                <span className="text-stone-500 font-medium">/mês</span>
                            </div>

                            <div className="space-y-4 mb-12">
                                {[
                                    "Site premium com sua marca",
                                    "Agendamento automático 24h",
                                    "Lembretes via WhatsApp",
                                    "Selo de Parceiro Fundador no site",
                                    "Suporte prioritário direto no Whats",
                                ].map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="mt-1 h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
                                            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                                        </div>
                                        <span className="text-sm text-stone-300 font-medium">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Link href="/registro?plan=fundador" className="block">
                                <Button className="w-full h-16 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-lg rounded-2xl transition-all shadow-xl shadow-amber-500/20 group">
                                    GARANTIR MINHA VAGA
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            
                            <div className="mt-6 flex items-center justify-center gap-2">
                                <Clock className="h-4 w-4 text-red-500 animate-pulse" />
                                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-widest">Apenas 10 vagas disponíveis</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Social Proof Mini */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-16 flex flex-col items-center gap-6"
                    >
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <img key={i} src={`https://i.pravatar.cc/100?u=${i + 10}`} className="w-10 h-10 rounded-full border-2 border-stone-950" alt="user" />
                            ))}
                        </div>
                        <p className="text-stone-500 text-sm font-medium">Junte-se a outros profissionais que já estão modernizando seus negócios.</p>
                    </motion.div>

                    {/* Trust Badges */}
                    <div className="mt-24 pt-12 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40">
                        <div className="flex items-center justify-center gap-2">
                            <ShieldCheck className="h-5 w-5" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">7 Dias Grátis</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <Users className="h-5 w-5" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">100% Brasileiro</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <Sparkles className="h-5 w-5" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Premium UI</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <Zap className="h-5 w-5" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Setup em 3m</span>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-12 border-t border-white/5 text-center">
                <p className="text-stone-600 text-xs">© {new Date().getFullYear()} Agenda Online. Todos os direitos reservados.</p>
            </footer>
        </div>
    )
}
