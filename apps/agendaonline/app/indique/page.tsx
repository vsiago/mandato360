import type { Metadata } from "next"
import Link from "next/link"
import { Gift, Sparkles, Share2, CheckCircle2, Users, Zap } from "lucide-react"

export const metadata: Metadata = {
    title: "Indique e Ganhe | Agenda Online — 1 mês grátis a cada indicação",
    description:
        "Indique um amigo profissional pro Agenda Online e ganhe 1 mês grátis na sua assinatura. Ele também ganha 30% de desconto no primeiro mês. Sem limite de indicações.",
    alternates: { canonical: "/indique" },
    openGraph: {
        title: "Indique e Ganhe | Agenda Online",
        description: "1 mês grátis pra cada amigo que assinar. Sem limite.",
        url: "https://agendaonline.app/indique",
        type: "website",
        locale: "pt_BR",
        images: ["/og-image.png"],
    },
}

export default function IndiquePage() {
    const ld = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Programa de Indicação Agenda Online",
        description: "Ganhe 1 mês grátis pra cada amigo profissional que assinar o Agenda Online.",
        url: "https://agendaonline.app/indique",
        inLanguage: "pt-BR",
    }

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

            <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-50">
                <header role="banner" className="border-b border-stone-200 dark:border-stone-800">
                    <nav aria-label="Principal" className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
                        <Link href="/" className="flex items-center">
                            <img src="/logo-agenda-online.svg" alt="Agenda Online" className="h-10 w-auto" />
                        </Link>
                        <Link href="/registro" className="btn-gold-solid rounded-full px-5 py-2 text-sm border-0">
                            Cadastre-se
                        </Link>
                    </nav>
                </header>

                <main id="conteudo">
                    <article>
                        {/* Hero */}
                        <header className="relative overflow-hidden pt-20 pb-24 bg-gradient-to-br from-amber-50 via-stone-50 to-amber-100/50 dark:from-amber-950/30 dark:via-stone-950 dark:to-amber-900/20">
                            <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-[120px] bg-amber-500/10 dark:bg-amber-400/20 pointer-events-none" />
                            <div className="mx-auto max-w-4xl px-6 text-center relative">
                                <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-8 border border-amber-500/30 bg-white/60 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                                    <Gift className="h-3.5 w-3.5" /> Programa de Indicação
                                </div>
                                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.05]" style={{ fontFamily: 'var(--font-playfair)' }}>
                                    Indique e ganhe <span className="italic text-amber-500 dark:text-amber-400">1 mês grátis</span>
                                </h1>
                                <p className="text-xl md:text-2xl text-stone-600 dark:text-stone-400 mb-10 leading-relaxed max-w-2xl mx-auto">
                                    Pra cada amigo profissional que assinar, você ganha um mês inteiro de Agenda Online <strong>de graça</strong>. Sem limite.
                                </p>
                                <Link
                                    href="/registro?utm_source=indique&utm_campaign=hero"
                                    className="btn-gold-solid inline-flex items-center justify-center px-10 py-5 text-lg rounded-full border-0 shadow-2xl shadow-amber-500/30 hover:-translate-y-1 transition-all"
                                >
                                    <Share2 className="h-5 w-5 mr-2" /> Quero meu link de indicação
                                </Link>
                                <p className="mt-6 text-sm text-stone-500">É só ter uma conta ativa. Já tem? <Link href="/login" className="underline">faça login</Link>.</p>
                            </div>
                        </header>

                        {/* Como funciona */}
                        <section aria-labelledby="como-h" className="py-20 bg-white dark:bg-stone-900 border-y border-stone-100 dark:border-stone-800">
                            <div className="mx-auto max-w-5xl px-6">
                                <header className="text-center mb-16">
                                    <h2 id="como-h" className="text-3xl md:text-5xl font-bold tracking-tight mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
                                        Como funciona em 3 passos
                                    </h2>
                                </header>
                                <ol className="grid md:grid-cols-3 gap-8">
                                    {[
                                        { icon: Share2, n: 1, t: "Compartilhe seu link", d: "Você recebe um link único (suaagenda.online/abc123) pra mandar no WhatsApp, Instagram ou stories." },
                                        { icon: Users, n: 2, t: "Seu amigo assina", d: "Ele clica, cria a conta, testa 7 dias grátis e assina um plano (Profissional ou Completo)." },
                                        { icon: Gift, n: 3, t: "Vocês dois ganham", d: "Você ganha 1 mês grátis na próxima fatura. Ele ganha 30% de desconto no primeiro mês." },
                                    ].map((s, i) => (
                                        <li key={i} className="text-center bg-stone-50 dark:bg-stone-800/30 border border-stone-200 dark:border-stone-800 rounded-3xl p-8">
                                            <div className="h-16 w-16 mx-auto rounded-full bg-amber-500 text-white flex items-center justify-center text-2xl font-bold mb-6 shadow-lg shadow-amber-500/30" style={{ fontFamily: 'var(--font-playfair)' }}>
                                                {s.n}
                                            </div>
                                            <h3 className="text-xl font-bold mb-3">{s.t}</h3>
                                            <p className="text-sm text-stone-500 leading-relaxed">{s.d}</p>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </section>

                        {/* Cálculo */}
                        <section aria-labelledby="ganhos-h" className="py-20">
                            <div className="mx-auto max-w-4xl px-6">
                                <header className="text-center mb-12">
                                    <h2 id="ganhos-h" className="text-3xl md:text-5xl font-bold tracking-tight mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
                                        Quanto dá pra ganhar?
                                    </h2>
                                    <p className="text-stone-500">Sem limite de indicações. A conta é simples:</p>
                                </header>
                                <div className="grid sm:grid-cols-3 gap-6">
                                    {[
                                        { v: "3 amigos", e: "R$ 237", desc: "3 meses grátis no plano Profissional" },
                                        { v: "10 amigos", e: "R$ 790", desc: "Quase 1 ano inteiro grátis" },
                                        { v: "20 amigos", e: "R$ 1.580", desc: "Mais de 1 ano e meio gratuito" },
                                    ].map((g, i) => (
                                        <div key={i} className="bg-white dark:bg-stone-900 border-2 border-amber-400/30 rounded-3xl p-8 text-center shadow-xl shadow-amber-500/5">
                                            <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-3">Você indica</p>
                                            <p className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>{g.v}</p>
                                            <p className="text-5xl font-bold text-amber-500 mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>{g.e}</p>
                                            <p className="text-xs text-stone-500">{g.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Quem indicar */}
                        <section aria-labelledby="quem-h" className="py-20 bg-stone-50 dark:bg-stone-950 border-y border-stone-100 dark:border-stone-800">
                            <div className="mx-auto max-w-4xl px-6">
                                <header className="text-center mb-12">
                                    <h2 id="quem-h" className="text-3xl md:text-4xl font-bold tracking-tight mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
                                        Para quem indicar?
                                    </h2>
                                    <p className="text-stone-500">Qualquer profissional que agenda horários se beneficia:</p>
                                </header>
                                <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {[
                                        "Cabeleireira", "Barbeiro", "Esteticista", "Tatuador", "Manicure",
                                        "Designer de sobrancelhas", "Nutricionista", "Personal trainer", "Massagista",
                                        "Maquiadora", "Podóloga", "Veterinária",
                                    ].map((p, i) => (
                                        <li key={i} className="flex items-center gap-2 p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
                                            <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0" />
                                            <span className="text-sm font-medium">{p}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        {/* Regras */}
                        <section aria-labelledby="regras-h" className="py-20">
                            <div className="mx-auto max-w-3xl px-6">
                                <header className="text-center mb-10">
                                    <h2 id="regras-h" className="text-3xl font-bold tracking-tight mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
                                        Regras simples
                                    </h2>
                                </header>
                                <ul className="space-y-3">
                                    {[
                                        "O bônus é creditado quando o amigo paga a primeira mensalidade (após os 7 dias grátis).",
                                        "Você precisa ter uma assinatura ativa pra receber o crédito.",
                                        "Não há limite de indicações: indique 100, ganhe 100 meses.",
                                        "O bônus vale para os planos Profissional (R$ 79) e Completo (R$ 119).",
                                        "Sem rede multinível: pagamos só pela indicação direta. Sem pirâmide.",
                                        "Se o amigo cancelar antes de 30 dias, o crédito é estornado.",
                                    ].map((r, i) => (
                                        <li key={i} className="flex items-start gap-3 p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
                                            <Sparkles className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                                            <span className="text-sm text-stone-700 dark:text-stone-300">{r}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        {/* CTA Final */}
                        <section className="py-20 bg-amber-500 dark:bg-amber-600">
                            <div className="mx-auto max-w-3xl px-6 text-center">
                                <Zap className="h-12 w-12 mx-auto mb-6 text-white" />
                                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
                                    Pronto pra indicar?
                                </h2>
                                <p className="text-xl text-amber-50 mb-10">Ainda não tem conta? Crie a sua e ganhe seu link de indicação automaticamente.</p>
                                <Link
                                    href="/registro?utm_source=indique&utm_campaign=cta_final"
                                    className="inline-flex items-center bg-white text-amber-700 hover:bg-stone-50 px-10 py-5 rounded-full text-lg font-bold shadow-2xl transition-transform hover:scale-105"
                                >
                                    Criar minha conta + receber link
                                </Link>
                            </div>
                        </section>
                    </article>
                </main>

                <footer role="contentinfo" className="py-12 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950">
                    <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <img src="/logo-agenda-online.svg" alt="Agenda Online" className="h-8 opacity-80" />
                        <p className="text-stone-400 text-sm">© {new Date().getFullYear()} Agenda Online</p>
                    </div>
                </footer>
            </div>
        </>
    )
}
