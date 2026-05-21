import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Clock, Calendar } from "lucide-react"
import { BLOG_POSTS, BLOG_SLUGS } from "@/lib/blog-posts"
import { NICHOS } from "@/lib/seo-catalog"

export async function generateStaticParams() {
    return BLOG_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const p = BLOG_POSTS[slug]
    if (!p) return {}

    return {
        title: `${p.title} | Agenda Online`,
        description: p.description,
        keywords: [p.keyword],
        alternates: { canonical: `/blog/${p.slug}` },
        openGraph: {
            title: p.title,
            description: p.description,
            url: `https://agendaonline.app/blog/${p.slug}`,
            type: "article",
            locale: "pt_BR",
            publishedTime: p.publishedAt,
            authors: ["Agenda Online"],
        },
        twitter: {
            card: "summary_large_image",
            title: p.title,
            description: p.description,
        },
    }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const p = BLOG_POSTS[slug]
    if (!p) notFound()

    const articleLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: p.title,
        description: p.description,
        author: { "@type": "Organization", name: "Agenda Online", url: "https://agendaonline.app" },
        publisher: {
            "@type": "Organization",
            name: "Agenda Online",
            logo: { "@type": "ImageObject", url: "https://agendaonline.app/logo-agenda-online.svg" },
        },
        datePublished: p.publishedAt,
        dateModified: p.publishedAt,
        mainEntityOfPage: `https://agendaonline.app/blog/${p.slug}`,
        keywords: p.keyword,
        inLanguage: "pt-BR",
    }

    const breadcrumbLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Início", item: "https://agendaonline.app/" },
            { "@type": "ListItem", position: 2, name: "Blog", item: "https://agendaonline.app/blog" },
            { "@type": "ListItem", position: 3, name: p.title, item: `https://agendaonline.app/blog/${p.slug}` },
        ],
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
                        <Link href="/registro" className="btn-gold-solid rounded-full px-5 py-2 text-sm border-0">
                            Cadastre-se
                        </Link>
                    </nav>
                </header>

                <main id="conteudo">
                    <article className="mx-auto max-w-3xl px-6 py-16">
                        <nav aria-label="Migalhas" className="text-xs text-stone-500 mb-8">
                            <ol className="flex flex-wrap gap-2">
                                <li><Link href="/" className="hover:text-amber-600">Início</Link></li>
                                <li aria-hidden="true">›</li>
                                <li><Link href="/blog" className="hover:text-amber-600">Blog</Link></li>
                                <li aria-hidden="true">›</li>
                                <li aria-current="page" className="text-stone-700 dark:text-stone-300 truncate max-w-xs">{p.title}</li>
                            </ol>
                        </nav>

                        <header className="mb-12">
                            <div className="flex items-center gap-4 mb-6 text-xs">
                                <span className="font-bold uppercase tracking-widest text-amber-600">{p.category}</span>
                                <span className="text-stone-400 flex items-center gap-1"><Clock className="h-3 w-3" /> {p.readingTime}</span>
                                <span className="text-stone-400 flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(p.publishedAt).toLocaleDateString("pt-BR")}</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-[1.1]" style={{ fontFamily: 'var(--font-playfair)' }}>
                                {p.title}
                            </h1>
                            <p className="text-xl text-stone-600 dark:text-stone-400 leading-relaxed">{p.description}</p>
                        </header>

                        <aside aria-label="Resumo" className="mb-12 p-6 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 rounded-r-2xl">
                            <p className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-2">TL;DR</p>
                            <p className="text-stone-800 dark:text-stone-200 leading-relaxed">{p.tldr}</p>
                        </aside>

                        <div className="prose prose-stone dark:prose-invert max-w-none">
                            {p.body.map((block, i) => {
                                if (block.type === "h2") {
                                    return <h2 key={i} className="text-3xl font-bold mt-12 mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>{block.content as string}</h2>
                                }
                                if (block.type === "h3") {
                                    return <h3 key={i} className="text-2xl font-bold mt-8 mb-3">{block.content as string}</h3>
                                }
                                if (block.type === "p") {
                                    return <p key={i} className="text-lg leading-relaxed mb-5 text-stone-700 dark:text-stone-300">{block.content as string}</p>
                                }
                                if (block.type === "ul") {
                                    return (
                                        <ul key={i} className="list-disc pl-6 mb-6 space-y-2 text-stone-700 dark:text-stone-300">
                                            {(block.content as string[]).map((item, j) => <li key={j} className="leading-relaxed">{item}</li>)}
                                        </ul>
                                    )
                                }
                                if (block.type === "ol") {
                                    return (
                                        <ol key={i} className="list-decimal pl-6 mb-6 space-y-2 text-stone-700 dark:text-stone-300">
                                            {(block.content as string[]).map((item, j) => <li key={j} className="leading-relaxed">{item}</li>)}
                                        </ol>
                                    )
                                }
                                if (block.type === "callout") {
                                    return (
                                        <blockquote key={i} className="my-8 p-6 bg-stone-100 dark:bg-stone-800/50 border-l-4 border-amber-500 rounded-r-2xl text-stone-800 dark:text-stone-200 italic">
                                            {block.content as string}
                                        </blockquote>
                                    )
                                }
                                if (block.type === "table") {
                                    const t = block.content as { headers: string[]; rows: string[][] }
                                    return (
                                        <div key={i} className="my-8 overflow-x-auto rounded-2xl border border-stone-200 dark:border-stone-800">
                                            <table className="w-full text-sm">
                                                <thead className="bg-stone-100 dark:bg-stone-800/50">
                                                    <tr>{t.headers.map((h, j) => <th key={j} scope="col" className="text-left p-3 font-bold">{h}</th>)}</tr>
                                                </thead>
                                                <tbody>
                                                    {t.rows.map((row, j) => (
                                                        <tr key={j} className="border-t border-stone-100 dark:border-stone-800">
                                                            {row.map((cell, k) => <td key={k} className="p-3 text-stone-700 dark:text-stone-300">{cell}</td>)}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )
                                }
                                return null
                            })}
                        </div>

                        <aside className="mt-16 p-8 bg-gradient-to-br from-amber-400 to-amber-600 dark:from-amber-500 dark:to-amber-700 rounded-3xl text-white text-center">
                            <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
                                Pronto pra aplicar tudo isso?
                            </h2>
                            <p className="text-amber-50 mb-6">O Agenda Online faz automático. 7 dias grátis, sem cartão.</p>
                            <Link href="/registro?utm_source=blog&utm_campaign=cta" className="inline-flex bg-white text-amber-700 hover:bg-stone-50 px-8 py-3 rounded-full font-bold shadow-xl">
                                Criar meu site agora
                            </Link>
                        </aside>

                        {p.relatedNichos.length > 0 && (
                            <nav aria-label="Páginas relacionadas" className="mt-12 pt-12 border-t border-stone-200 dark:border-stone-800">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-stone-500 mb-4">Veja também</h2>
                                <ul className="flex flex-wrap gap-2">
                                    {p.relatedNichos.map((slug) => {
                                        const n = NICHOS[slug]
                                        if (!n) return null
                                        return (
                                            <li key={slug}>
                                                <Link
                                                    href={`/para/${slug}`}
                                                    className="inline-flex items-center gap-2 bg-stone-100 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-amber-900/30 px-4 py-2 rounded-full text-sm transition-colors"
                                                >
                                                    {n.emoji} Para {n.nomePlural}
                                                </Link>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </nav>
                        )}
                    </article>
                </main>

                <footer role="contentinfo" className="py-12 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
                    <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <img src="/logo-agenda-online.svg" alt="Agenda Online" className="h-8 opacity-80" />
                        <p className="text-stone-400 text-sm">© {new Date().getFullYear()} Agenda Online</p>
                    </div>
                </footer>
            </div>
        </>
    )
}
