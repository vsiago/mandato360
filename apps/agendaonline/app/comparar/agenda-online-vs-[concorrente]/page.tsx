import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Check, X } from "lucide-react"
import { CONCORRENTES, CONCORRENTE_SLUGS } from "@/lib/seo-catalog"

export async function generateStaticParams() {
    return CONCORRENTE_SLUGS.map((concorrente) => ({ concorrente }))
}

export async function generateMetadata({ params }: { params: Promise<{ concorrente: string }> }): Promise<Metadata> {
    const { concorrente } = await params
    const k = CONCORRENTES[concorrente]
    if (!k) return {}

    return {
        title: `Agenda Online vs ${k.nome} | Qual o melhor para seu negócio?`,
        description: `Comparativo honesto entre Agenda Online e ${k.nome}: preço, recursos, taxa por agendamento e diferenças. Veja qual encaixa melhor.`,
        alternates: { canonical: `/comparar/agenda-online-vs-${k.slug}` },
        openGraph: {
            title: `Agenda Online vs ${k.nome}`,
            description: `Comparativo completo. Veja qual sistema escolher.`,
            url: `https://agendaonline.app/comparar/agenda-online-vs-${k.slug}`,
            type: "article",
            locale: "pt_BR",
        },
    }
}

type ComparisonRow = { recurso: string; ao: string | boolean; conc: string | boolean; }

export default async function CompararPage({ params }: { params: Promise<{ concorrente: string }> }) {
    const { concorrente } = await params
    const k = CONCORRENTES[concorrente]
    if (!k) notFound()

    const rows: ComparisonRow[] = [
        { recurso: "Site profissional com sua marca", ao: true, conc: false },
        { recurso: "Portfólio antes/depois", ao: true, conc: "Limitado" },
        { recurso: "Cliente precisa criar senha", ao: false, conc: true },
        { recurso: "Cliente precisa baixar app", ao: false, conc: k.slug === "booksy" ? true : false },
        { recurso: "Taxa por agendamento", ao: "R$ 0", conc: k.taxaPorAgendamento },
        { recurso: "Tempo de configuração", ao: "3 minutos", conc: "1–2 dias" },
        { recurso: "Lembrete WhatsApp automático", ao: true, conc: true },
        { recurso: "Personalização visual total", ao: true, conc: false },
        { recurso: "Link único pra bio do Instagram", ao: true, conc: "Limitado" },
        { recurso: "Plano inicial", ao: "R$ 79/mês", conc: k.precoMedio },
        { recurso: "Teste grátis", ao: "7 dias sem cartão", conc: "Varia" },
    ]

    const articleLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: `Agenda Online vs ${k.nome}: comparativo completo`,
        author: { "@type": "Organization", name: "Agenda Online" },
        publisher: {
            "@type": "Organization",
            name: "Agenda Online",
            logo: { "@type": "ImageObject", url: "https://agendaonline.app/logo-agenda-online.svg" },
        },
        datePublished: "2026-05-20",
        dateModified: "2026-05-20",
        description: `Comparativo honesto entre Agenda Online e ${k.nome}: preço, recursos e diferenças.`,
        mainEntityOfPage: `https://agendaonline.app/comparar/agenda-online-vs-${k.slug}`,
    }

    const breadcrumbLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Início", item: "https://agendaonline.app/" },
            { "@type": "ListItem", position: 2, name: "Comparativos", item: "https://agendaonline.app/comparar" },
            { "@type": "ListItem", position: 3, name: `vs ${k.nome}`, item: `https://agendaonline.app/comparar/agenda-online-vs-${k.slug}` },
        ],
    }

    const renderCell = (v: string | boolean, ours: boolean) => {
        if (v === true) return <Check className={`h-5 w-5 mx-auto ${ours ? "text-amber-500" : "text-stone-400"}`} />
        if (v === false) return <X className="h-5 w-5 mx-auto text-red-400" />
        return <span className={`text-sm ${ours ? "font-bold text-amber-600 dark:text-amber-400" : "text-stone-500"}`}>{v}</span>
    }

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

            <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-50">
                <header role="banner" className="border-b border-stone-200 dark:border-stone-800">
                    <nav aria-label="Principal" className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
                        <Link href="/" className="flex items-center">
                            <img src="/logo-agenda-online.svg" alt="Agenda Online" className="h-10 w-auto" />
                        </Link>
                        <Link href={`/registro?utm_source=comparar&utm_campaign=${k.slug}`} className="btn-gold-solid rounded-full px-5 py-2 text-sm border-0">
                            Cadastre-se
                        </Link>
                    </nav>
                </header>

                <main id="conteudo">
                    <article className="mx-auto max-w-4xl px-6 py-16">
                        <nav aria-label="Migalhas" className="text-xs text-stone-500 mb-6">
                            <ol className="flex flex-wrap gap-2">
                                <li><Link href="/" className="hover:text-amber-600">Início</Link></li>
                                <li aria-hidden="true">›</li>
                                <li aria-current="page" className="text-stone-700 dark:text-stone-300">Agenda Online vs {k.nome}</li>
                            </ol>
                        </nav>

                        <header className="mb-12">
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
                                Agenda Online <span className="text-stone-400">vs</span> <span className="italic">{k.nome}</span>
                            </h1>
                            <p className="text-lg text-stone-600 dark:text-stone-400 leading-relaxed">
                                {k.nome}: {k.descricaoCurta} Agenda Online: site profissional + agenda 24h em 3 minutos, sem taxa por agendamento.
                            </p>
                        </header>

                        <section aria-labelledby="tabela-h" className="mb-12">
                            <h2 id="tabela-h" className="text-2xl font-bold mb-6">Comparativo lado a lado</h2>
                            <div className="overflow-x-auto rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
                                <table className="w-full text-sm">
                                    <caption className="sr-only">Tabela comparativa entre Agenda Online e {k.nome}</caption>
                                    <thead className="bg-stone-50 dark:bg-stone-800/50">
                                        <tr>
                                            <th scope="col" className="text-left p-4 font-bold">Recurso</th>
                                            <th scope="col" className="text-center p-4 font-bold text-amber-600 dark:text-amber-400">Agenda Online</th>
                                            <th scope="col" className="text-center p-4 font-bold text-stone-500">{k.nome}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((r, i) => (
                                            <tr key={i} className="border-t border-stone-100 dark:border-stone-800">
                                                <th scope="row" className="text-left p-4 font-medium text-stone-700 dark:text-stone-300">{r.recurso}</th>
                                                <td className="text-center p-4">{renderCell(r.ao, true)}</td>
                                                <td className="text-center p-4">{renderCell(r.conc, false)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section aria-labelledby="quando-h" className="mb-12">
                            <h2 id="quando-h" className="text-2xl font-bold mb-6">Quando escolher cada um</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-400 rounded-2xl p-6">
                                    <h3 className="text-lg font-bold mb-3 text-amber-700 dark:text-amber-400">Escolha o Agenda Online se:</h3>
                                    <ul className="space-y-2 text-sm text-stone-700 dark:text-stone-300">
                                        <li>• Você quer um site com sua marca, não só uma agenda</li>
                                        <li>• Você não quer pagar taxa por agendamento</li>
                                        <li>• Suas clientes não querem baixar mais um app</li>
                                        <li>• Você quer começar em 3 minutos</li>
                                        <li>• Você quer suporte em português</li>
                                    </ul>
                                </div>
                                <div className="bg-stone-50 dark:bg-stone-800/30 border border-stone-200 dark:border-stone-700 rounded-2xl p-6">
                                    <h3 className="text-lg font-bold mb-3">Escolha {k.nome} se:</h3>
                                    <ul className="space-y-2 text-sm text-stone-600 dark:text-stone-400">
                                        <li>• {k.pontoForte}</li>
                                        <li>• Você prefere o ecossistema deles</li>
                                        <li>• Marca própria não é prioridade</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section aria-labelledby="veredito-h">
                            <h2 id="veredito-h" className="text-2xl font-bold mb-4">Veredito</h2>
                            <p className="text-stone-700 dark:text-stone-300 leading-relaxed mb-6">
                                Se você é profissional autônomo ou pequeno negócio que quer crescer com marca própria e não quer dividir receita com plataforma, <strong>Agenda Online é a escolha mais direta</strong>. Se você depende de marketplace pra captar cliente novo, {k.nome} pode somar — mas você ainda vai querer um site próprio em algum momento.
                            </p>
                            <Link
                                href={`/registro?plan=profissional&utm_source=comparar&utm_campaign=${k.slug}`}
                                className="btn-gold-solid inline-flex items-center justify-center px-10 py-4 text-base rounded-full border-0 shadow-xl shadow-amber-500/20"
                            >
                                Testar Agenda Online grátis por 7 dias
                            </Link>
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
