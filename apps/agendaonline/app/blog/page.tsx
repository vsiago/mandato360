import type { Metadata } from "next"
import Link from "next/link"
import { Clock, ArrowRight } from "lucide-react"
import { BLOG_POSTS } from "@/lib/blog-posts"

export const metadata: Metadata = {
    title: "Blog Agenda Online | Guias para salões, barbearias e clínicas",
    description: "Guias práticos sobre agenda online, redução de faltas, comparativos de sistemas e gestão de salão de beleza, barbearia e clínica de estética.",
    alternates: { canonical: "/blog" },
    openGraph: {
        title: "Blog Agenda Online",
        description: "Guias práticos para profissionais que agendam horários.",
        url: "https://agendaonline.app/blog",
        type: "website",
        locale: "pt_BR",
    },
}

export default function BlogPage() {
    const posts = Object.values(BLOG_POSTS).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

    const blogLd = {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "Blog Agenda Online",
        url: "https://agendaonline.app/blog",
        publisher: { "@id": "https://agendaonline.app/#organization" },
        blogPost: posts.map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            description: p.description,
            datePublished: p.publishedAt,
            url: `https://agendaonline.app/blog/${p.slug}`,
        })),
    }

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogLd) }} />

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

                <main id="conteudo" className="mx-auto max-w-5xl px-6 py-16">
                    <header className="mb-16 text-center">
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
                            Blog Agenda Online
                        </h1>
                        <p className="text-lg text-stone-500 max-w-2xl mx-auto">
                            Guias práticos pra você lotar a agenda, reduzir faltas e crescer com marca própria.
                        </p>
                    </header>

                    <section aria-label="Artigos">
                        <ul className="grid md:grid-cols-2 gap-6">
                            {posts.map((p) => (
                                <li key={p.slug}>
                                    <article className="h-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 transition-all hover:-translate-y-1 hover:shadow-xl">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-xs font-bold uppercase tracking-widest text-amber-600">{p.category}</span>
                                            <span className="text-xs text-stone-400 flex items-center gap-1"><Clock className="h-3 w-3" /> {p.readingTime}</span>
                                        </div>
                                        <h2 className="text-2xl font-bold mb-3 leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
                                            <Link href={`/blog/${p.slug}`} className="hover:text-amber-600 transition-colors">
                                                {p.title}
                                            </Link>
                                        </h2>
                                        <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-6">{p.description}</p>
                                        <Link href={`/blog/${p.slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-amber-600 hover:gap-3 transition-all">
                                            Ler artigo <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </article>
                                </li>
                            ))}
                        </ul>
                    </section>
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
