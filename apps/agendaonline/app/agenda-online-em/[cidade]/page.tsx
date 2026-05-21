import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CheckCircle2, MapPin, Star } from "lucide-react"
import { CIDADES, CIDADE_SLUGS, NICHOS, NICHO_SLUGS } from "@/lib/seo-catalog"

export async function generateStaticParams() {
    return CIDADE_SLUGS.map((cidade) => ({ cidade }))
}

export async function generateMetadata({ params }: { params: Promise<{ cidade: string }> }): Promise<Metadata> {
    const { cidade } = await params
    const c = CIDADES.find((x) => x.slug === cidade)
    if (!c) return {}

    const title = `Agenda Online ${c.artigo} ${c.nome} ${c.uf} | Site + agendamento 24h`
    const description = `Sistema de agenda online para profissionais de beleza, estética, saúde e pet ${c.artigo} ${c.nome} (${c.uf}). Site profissional, lembrete WhatsApp, 7 dias grátis.`

    return {
        title,
        description,
        keywords: [
            `agenda online ${c.nome.toLowerCase()}`,
            `sistema de agendamento ${c.nome.toLowerCase()}`,
            `site para salão de beleza ${c.nome.toLowerCase()}`,
            `agenda barbearia ${c.nome.toLowerCase()}`,
            `agendamento online ${c.uf.toLowerCase()}`,
        ],
        alternates: { canonical: `/agenda-online-em/${c.slug}` },
        openGraph: {
            title,
            description,
            url: `https://agendaonline.app/agenda-online-em/${c.slug}`,
            type: "website",
            locale: "pt_BR",
        },
    }
}

export default async function CidadePage({ params }: { params: Promise<{ cidade: string }> }) {
    const { cidade } = await params
    const c = CIDADES.find((x) => x.slug === cidade)
    if (!c) notFound()

    const localBusinessLd = {
        "@context": "https://schema.org",
        "@type": "Service",
        name: `Agenda Online ${c.artigo} ${c.nome}`,
        provider: {
            "@type": "Organization",
            name: "Agenda Online",
            url: "https://agendaonline.app",
        },
        areaServed: {
            "@type": "City",
            name: c.nome,
            addressRegion: c.uf,
            addressCountry: "BR",
        },
        serviceType: "Sistema de agendamento online",
        description: `Sistema de agenda online ${c.artigo} ${c.nome} (${c.uf}) para profissionais de beleza, estética, saúde e pet.`,
    }

    const breadcrumbLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Início", item: "https://agendaonline.app/" },
            { "@type": "ListItem", position: 2, name: `Agenda Online ${c.artigo} ${c.nome}`, item: `https://agendaonline.app/agenda-online-em/${c.slug}` },
        ],
    }

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

            <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-50">
                <header role="banner" className="border-b border-stone-200 dark:border-stone-800">
                    <nav aria-label="Principal" className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
                        <Link href="/" className="flex items-center">
                            <img src="/logo-agenda-online.svg" alt="Agenda Online" className="h-10 w-auto" />
                        </Link>
                        <Link
                            href={`/registro?utm_source=cidade&utm_campaign=${c.slug}`}
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
                                Agenda online {c.artigo} {c.nome}
                            </li>
                        </ol>
                    </nav>

                    <article>
                        <header className="mx-auto max-w-4xl px-6 pt-12 pb-16 text-center">
                            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium mb-6 border border-amber-500/30 text-amber-700 dark:text-amber-400 bg-amber-50/50 dark:bg-transparent">
                                <MapPin className="h-3.5 w-3.5" /> {c.nome} — {c.uf}
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-[1.05]" style={{ fontFamily: 'var(--font-playfair)' }}>
                                Agenda online <span className="italic text-amber-500">{c.artigo} {c.nome}</span>
                            </h1>
                            <p className="text-lg md:text-xl text-stone-600 dark:text-stone-400 mb-10 leading-relaxed max-w-2xl mx-auto">
                                Profissionais de beleza, estética, saúde e pet {c.artigo} {c.nome} já usam o Agenda Online pra organizar a agenda, parar de perder cliente no WhatsApp e ter um site profissional.
                            </p>
                            <Link
                                href={`/registro?utm_source=cidade&utm_campaign=${c.slug}`}
                                className="btn-gold-solid inline-flex items-center justify-center px-10 py-4 text-base rounded-full border-0 shadow-xl shadow-amber-500/20"
                            >
                                Criar meu site (7 dias grátis)
                            </Link>
                        </header>

                        <section aria-labelledby="quem-h" className="py-16 bg-white dark:bg-stone-900 border-y border-stone-100 dark:border-stone-800">
                            <div className="mx-auto max-w-5xl px-6">
                                <header className="text-center mb-12">
                                    <h2 id="quem-h" className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
                                        Quem usa {c.artigo} {c.nome}
                                    </h2>
                                    <p className="text-stone-500">Profissionais autônomos e pequenos negócios da cidade.</p>
                                </header>
                                <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {NICHO_SLUGS.map((slug) => {
                                        const n = NICHOS[slug]
                                        return (
                                            <li key={slug}>
                                                <Link
                                                    href={`/para/${slug}`}
                                                    className="block bg-stone-50 dark:bg-stone-800/30 hover:bg-amber-50 dark:hover:bg-amber-900/20 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 transition-colors text-center"
                                                >
                                                    <div className="text-3xl mb-2">{n.emoji}</div>
                                                    <div className="text-sm font-medium capitalize">{n.nome}</div>
                                                </Link>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        </section>

                        <section aria-labelledby="beneficios-cidade-h" className="py-16">
                            <div className="mx-auto max-w-4xl px-6">
                                <header className="text-center mb-12">
                                    <h2 id="beneficios-cidade-h" className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
                                        Por que profissionais {c.artigo} {c.nome} escolhem o Agenda Online
                                    </h2>
                                </header>
                                <ul className="space-y-4">
                                    {[
                                        `Site profissional em português, com fuso horário do Brasil e DDD ${c.uf === 'SP' ? '11' : 'local'} integrado ao WhatsApp.`,
                                        `Pagamento em reais via Pix, cartão ou boleto — sem precisar de cartão internacional.`,
                                        `Suporte humano em português, atendimento Brasília.`,
                                        `Lembrete WhatsApp no fuso de ${c.nome} pra não acordar sua cliente às 5 da manhã.`,
                                        `Endereço único pra bio do Instagram que cliente em ${c.nome} reconhece e confia.`,
                                    ].map((b, i) => (
                                        <li key={i} className="flex items-start gap-3 p-5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800">
                                            <CheckCircle2 className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
                                            <span className="text-stone-700 dark:text-stone-300">{b}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        <section className="py-16 bg-amber-500 dark:bg-amber-600">
                            <div className="mx-auto max-w-3xl px-6 text-center">
                                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
                                    Comece hoje em {c.nome}
                                </h2>
                                <p className="text-xl text-amber-50 mb-10">7 dias grátis. Sem cartão. Cancela em 1 clique.</p>
                                <Link
                                    href={`/registro?utm_source=cidade&utm_campaign=${c.slug}_cta`}
                                    className="inline-flex bg-white text-amber-700 hover:bg-stone-50 px-10 py-5 rounded-full text-lg font-bold shadow-2xl"
                                >
                                    Criar meu site agora
                                </Link>
                            </div>
                        </section>
                    </article>
                </main>

                <footer role="contentinfo" className="py-12 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950">
                    <div className="mx-auto max-w-7xl px-6">
                        <nav aria-label="Outras cidades" className="text-xs text-stone-500 mb-6">
                            <p className="font-bold uppercase tracking-widest mb-3">Disponível também em:</p>
                            <ul className="flex flex-wrap gap-x-3 gap-y-1.5">
                                {CIDADES.filter((x) => x.slug !== c.slug).slice(0, 30).map((other) => (
                                    <li key={other.slug}>
                                        <Link href={`/agenda-online-em/${other.slug}`} className="hover:text-amber-600">
                                            {other.nome}/{other.uf}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-stone-200 dark:border-stone-800">
                            <img src="/logo-agenda-online.svg" alt="Agenda Online" className="h-8 opacity-80" />
                            <p className="text-stone-400 text-sm">© {new Date().getFullYear()} Agenda Online</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    )
}
