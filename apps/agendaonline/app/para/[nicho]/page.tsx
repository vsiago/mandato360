import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CheckCircle2, Star, Clock, MessageCircle, CalendarDays, Camera, Users, Zap, Sparkles } from "lucide-react"
import { NICHOS, NICHO_SLUGS } from "@/lib/seo-catalog"
import { FAQAEO } from "@/components/faq-aeo"

export async function generateStaticParams() {
    return NICHO_SLUGS.map((nicho) => ({ nicho }))
}

export async function generateMetadata({ params }: { params: Promise<{ nicho: string }> }): Promise<Metadata> {
    const { nicho } = await params
    const n = NICHOS[nicho]
    if (!n) return {}

    return {
        title: n.metaTitle,
        description: n.metaDescription,
        keywords: [n.keywordPrincipal, ...n.keywordsSecundarias],
        alternates: { canonical: `/para/${n.slug}` },
        openGraph: {
            title: n.metaTitle,
            description: n.metaDescription,
            url: `https://agendaonline.app/para/${n.slug}`,
            type: "website",
            locale: "pt_BR",
            images: ["/og-image.png"],
        },
        twitter: {
            card: "summary_large_image",
            title: n.metaTitle,
            description: n.metaDescription,
            images: ["/og-image.png"],
        },
    }
}

export default async function NichoPage({ params }: { params: Promise<{ nicho: string }> }) {
    const { nicho } = await params
    const n = NICHOS[nicho]
    if (!n) notFound()

    const productLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: `Agenda Online para ${n.nome}`,
        description: n.metaDescription,
        brand: { "@type": "Brand", name: "Agenda Online" },
        category: `Software de agendamento para ${n.nome}`,
        offers: [
            {
                "@type": "Offer",
                name: "Plano Profissional",
                price: "79.00",
                priceCurrency: "BRL",
                availability: "https://schema.org/InStock",
                url: "https://agendaonline.app/registro?plan=profissional",
            },
            {
                "@type": "Offer",
                name: "Plano Completo",
                price: "119.00",
                priceCurrency: "BRL",
                availability: "https://schema.org/InStock",
                url: "https://agendaonline.app/registro?plan=premium",
            },
        ],
    }

    const faqLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: n.perguntas.map((p) => ({
            "@type": "Question",
            name: p.q,
            acceptedAnswer: { "@type": "Answer", text: p.a },
        })),
    }

    const breadcrumbLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Início", item: "https://agendaonline.app/" },
            { "@type": "ListItem", position: 2, name: `Para ${n.nomePlural}`, item: `https://agendaonline.app/para/${n.slug}` },
        ],
    }

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

            <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-50">
                <header role="banner" className="border-b border-stone-200 dark:border-stone-800">
                    <nav aria-label="Principal" className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
                        <Link href="/" className="flex items-center">
                            <img src="/logo-agenda-online.svg" alt="Agenda Online" className="h-10 w-auto" />
                        </Link>
                        <Link
                            href={`/registro?utm_source=nicho&utm_campaign=${n.slug}`}
                            className="btn-gold-solid rounded-full px-5 py-2 text-sm border-0"
                        >
                            Cadastre-se
                        </Link>
                    </nav>
                </header>

                <main id="conteudo">
                    <nav aria-label="Migalhas" className="mx-auto max-w-7xl px-6 pt-6 text-xs text-stone-500">
                        <ol className="flex flex-wrap gap-2">
                            <li><Link href="/" className="hover:text-amber-600">Início</Link></li>
                            <li aria-hidden="true">›</li>
                            <li aria-current="page" className="font-medium text-stone-700 dark:text-stone-300">
                                Para {n.nomePlural}
                            </li>
                        </ol>
                    </nav>

                    <article>
                        {/* Hero */}
                        <header className="mx-auto max-w-7xl px-6 pt-12 pb-20 lg:pt-20 lg:pb-28">
                            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
                                <div>
                                    <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium mb-6 border border-amber-500/30 text-amber-700 dark:text-amber-400 bg-amber-50/50 dark:bg-transparent">
                                        <span>{n.emoji} Especial para {n.nomePlural}</span>
                                    </div>

                                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.05]" style={{ fontFamily: 'var(--font-playfair)' }}>
                                        {n.h1}
                                    </h1>

                                    <p className="text-lg md:text-xl text-stone-600 dark:text-stone-400 mb-6 leading-relaxed">
                                        <strong>{n.dor}</strong>
                                    </p>

                                    <p className="text-lg text-stone-600 dark:text-stone-400 mb-10 leading-relaxed">
                                        {n.promessa}
                                    </p>

                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Link
                                            href={`/registro?plan=profissional&utm_source=nicho&utm_campaign=${n.slug}`}
                                            className="btn-gold-solid inline-flex items-center justify-center px-10 py-4 text-base rounded-full border-0 shadow-xl shadow-amber-500/20 hover:-translate-y-0.5 transition-all"
                                        >
                                            Criar meu site (7 dias grátis)
                                        </Link>
                                    </div>

                                    <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-stone-500">
                                        <li className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Sem cartão</li>
                                        <li className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Site no ar em 3 min</li>
                                        <li className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Zero taxa por agendamento</li>
                                    </ul>
                                </div>

                                {/* Card de exemplo de serviços */}
                                <aside aria-label="Exemplos de serviços" className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 shadow-xl">
                                    <h2 className="text-sm font-bold uppercase tracking-widest text-amber-600 mb-4">Catálogo pronto</h2>
                                    <p className="text-stone-600 dark:text-stone-400 mb-6 text-sm">
                                        Já criamos os serviços mais comuns de {n.nomePlural}. Você só ajusta preço e tempo:
                                    </p>
                                    <ul className="space-y-3">
                                        {n.servicosExemplo.map((s, i) => (
                                            <li key={i} className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50">
                                                <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                                                <span className="text-sm font-medium">{s}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </aside>
                            </div>
                        </header>

                        {/* Benefícios */}
                        <section aria-labelledby="beneficios-h" className="py-20 bg-white dark:bg-stone-900 border-y border-stone-100 dark:border-stone-800">
                            <div className="mx-auto max-w-7xl px-6">
                                <header className="text-center mb-16">
                                    <h2 id="beneficios-h" className="text-3xl md:text-5xl font-bold tracking-tight mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
                                        Tudo que {n.nomePlural} precisam
                                    </h2>
                                    <p className="text-lg text-stone-500 max-w-2xl mx-auto">
                                        Funcionalidades pensadas pra rotina de {n.nomePlural} brasileiros.
                                    </p>
                                </header>

                                <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[
                                        { icon: CalendarDays, title: "Agenda 24h", desc: `Seu cliente marca às 3 da manhã. Você acorda com a agenda cheia.` },
                                        { icon: MessageCircle, title: "Lembrete WhatsApp", desc: "Mensagem automática 24h e 1h antes. Reduz faltas em até 60%." },
                                        { icon: Camera, title: "Portfólio visual", desc: "Galeria que vende seu trabalho antes do cliente perguntar preço." },
                                        { icon: Users, title: "Múltiplos profissionais", desc: "Cada profissional com sua agenda, no mesmo site." },
                                        { icon: Zap, title: "3 minutos pra subir", desc: "Sem programador, sem designer, sem complicação." },
                                        { icon: Sparkles, title: "Link na bio", desc: `Endereço único pro Instagram: seunome.agendaonline.app` },
                                    ].map((f, i) => (
                                        <li key={i} className="bg-stone-50 dark:bg-stone-800/30 border border-stone-200 dark:border-stone-800 rounded-2xl p-6">
                                            <div className="h-12 w-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4 text-amber-600">
                                                <f.icon className="h-5 w-5" />
                                            </div>
                                            <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                                            <p className="text-sm text-stone-500">{f.desc}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        {/* Depoimento */}
                        <section aria-label="Depoimento" className="py-20 bg-stone-50 dark:bg-stone-950 border-b border-stone-100 dark:border-stone-800">
                            <div className="mx-auto max-w-3xl px-6 text-center">
                                <div className="flex justify-center gap-1 mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-5 w-5 fill-amber-500 text-amber-500" />
                                    ))}
                                </div>
                                <blockquote className="text-2xl md:text-3xl font-medium text-stone-800 dark:text-stone-200 italic mb-6 leading-relaxed" style={{ fontFamily: 'var(--font-playfair)' }}>
                                    "{n.depoimento.texto}"
                                </blockquote>
                                <cite className="not-italic text-stone-500 text-sm">
                                    — <strong>{n.depoimento.nome}</strong>, {n.nomePlural.charAt(0).toUpperCase() + n.nomePlural.slice(1)} em {n.depoimento.cidade}
                                </cite>
                            </div>
                        </section>

                        {/* Preços */}
                        <section aria-labelledby="pricing-h" id="pricing" className="py-20 bg-white dark:bg-stone-900">
                            <div className="mx-auto max-w-4xl px-6">
                                <header className="text-center mb-12">
                                    <h2 id="pricing-h" className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
                                        Um preço que cabe na agenda
                                    </h2>
                                    <p className="text-stone-500">Evite 1 falta por mês com os lembretes e o sistema se paga sozinho.</p>
                                </header>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <article className="border-2 border-amber-400 rounded-3xl p-8 bg-white dark:bg-stone-900 shadow-xl shadow-amber-500/10">
                                        <h3 className="text-2xl font-bold mb-2">Profissional</h3>
                                        <p className="text-4xl font-bold mb-6">R$ 79<span className="text-base font-normal text-stone-500">/mês</span></p>
                                        <ul className="space-y-3 mb-8 text-sm">
                                            <li className="flex gap-2"><CheckCircle2 className="h-5 w-5 text-amber-500 shrink-0" /> Site profissional com sua marca</li>
                                            <li className="flex gap-2"><CheckCircle2 className="h-5 w-5 text-amber-500 shrink-0" /> Agendamento automático 24h</li>
                                            <li className="flex gap-2"><CheckCircle2 className="h-5 w-5 text-amber-500 shrink-0" /> Lembretes WhatsApp</li>
                                            <li className="flex gap-2"><CheckCircle2 className="h-5 w-5 text-amber-500 shrink-0" /> Catálogo com preços</li>
                                            <li className="flex gap-2"><CheckCircle2 className="h-5 w-5 text-amber-500 shrink-0" /> Link na bio do Instagram</li>
                                        </ul>
                                        <Link
                                            href={`/registro?plan=profissional&utm_source=nicho&utm_campaign=${n.slug}`}
                                            className="block text-center btn-gold-solid py-3 rounded-xl border-0 font-bold"
                                        >
                                            Começar grátis
                                        </Link>
                                    </article>
                                    <article className="border border-stone-200 dark:border-stone-700 rounded-3xl p-8 bg-stone-50 dark:bg-stone-800/30">
                                        <h3 className="text-2xl font-bold mb-2">Completo</h3>
                                        <p className="text-4xl font-bold mb-6">R$ 119<span className="text-base font-normal text-stone-500">/mês</span></p>
                                        <ul className="space-y-3 mb-8 text-sm">
                                            <li className="flex gap-2"><CheckCircle2 className="h-5 w-5 text-stone-400 shrink-0" /> Tudo do Profissional, e:</li>
                                            <li className="flex gap-2"><CheckCircle2 className="h-5 w-5 text-stone-400 shrink-0" /> Portfólio antes/depois</li>
                                            <li className="flex gap-2"><CheckCircle2 className="h-5 w-5 text-stone-400 shrink-0" /> Personalização avançada</li>
                                            <li className="flex gap-2"><CheckCircle2 className="h-5 w-5 text-stone-400 shrink-0" /> Relatórios de faturamento</li>
                                            <li className="flex gap-2"><CheckCircle2 className="h-5 w-5 text-stone-400 shrink-0" /> Suporte VIP</li>
                                        </ul>
                                        <Link
                                            href={`/registro?plan=premium&utm_source=nicho&utm_campaign=${n.slug}`}
                                            className="block text-center bg-stone-800 hover:bg-stone-900 dark:bg-white dark:hover:bg-stone-100 text-white dark:text-stone-900 py-3 rounded-xl font-bold"
                                        >
                                            Assinar Completo
                                        </Link>
                                    </article>
                                </div>
                            </div>
                        </section>

                        {/* FAQ específica */}
                        <section aria-labelledby="faq-h" className="py-20 bg-stone-50 dark:bg-stone-950 border-y border-stone-100 dark:border-stone-800">
                            <div className="mx-auto max-w-3xl px-6">
                                <header className="text-center mb-12">
                                    <h2 id="faq-h" className="text-3xl md:text-5xl font-bold tracking-tight mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
                                        Perguntas de {n.nomePlural}
                                    </h2>
                                </header>
                                <dl className="space-y-6">
                                    {n.perguntas.map((p, i) => (
                                        <div key={i} className="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800">
                                            <dt className="text-lg font-bold mb-3 text-stone-900 dark:text-stone-100">{p.q}</dt>
                                            <dd className="text-stone-600 dark:text-stone-400 leading-relaxed">{p.a}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        </section>

                        {/* CTA final */}
                        <section className="py-20 bg-amber-500 dark:bg-amber-600">
                            <div className="mx-auto max-w-3xl px-6 text-center">
                                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
                                    Pronto para {n.nomePlural} sairem do WhatsApp?
                                </h2>
                                <p className="text-xl text-amber-50 mb-10">Crie seu site em 3 minutos. Os primeiros 7 dias são por nossa conta.</p>
                                <Link
                                    href={`/registro?plan=profissional&utm_source=nicho&utm_campaign=${n.slug}_cta_final`}
                                    className="inline-flex items-center justify-center bg-white text-amber-700 hover:bg-stone-50 px-10 py-5 rounded-full text-lg font-bold shadow-2xl transition-transform hover:scale-105"
                                >
                                    Criar meu site agora
                                </Link>
                            </div>
                        </section>
                    </article>

                    <FAQAEO />
                </main>

                <footer role="contentinfo" className="py-12 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950">
                    <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        <img src="/logo-agenda-online.svg" alt="Agenda Online" className="h-8 opacity-80" />
                        <nav aria-label="Outros nichos" className="text-xs text-stone-500">
                            <ul className="flex flex-wrap gap-x-4 gap-y-2 justify-center">
                                {NICHO_SLUGS.filter((s) => s !== n.slug).map((slug) => (
                                    <li key={slug}>
                                        <Link href={`/para/${slug}`} className="hover:text-amber-600">
                                            {NICHOS[slug].nome}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                        <p className="text-stone-400 text-sm">© {new Date().getFullYear()} Agenda Online</p>
                    </div>
                </footer>
            </div>
        </>
    )
}
