import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Criar conta grátis | Agenda Online — Site + agenda em 3 minutos",
    description:
        "Crie sua conta no Agenda Online em 30 segundos. Site profissional com agenda 24h, lembretes WhatsApp e zero taxa por agendamento. 7 dias grátis, sem cartão.",
    alternates: { canonical: "/registro" },
    openGraph: {
        title: "Criar conta grátis | Agenda Online",
        description: "Site profissional + agenda online em 3 minutos. 7 dias grátis, sem cartão.",
        url: "https://agendaonline.app/registro",
        type: "website",
        locale: "pt_BR",
        images: ["/og-image.png"],
    },
    twitter: {
        card: "summary_large_image",
        title: "Criar conta grátis | Agenda Online",
        description: "Site + agenda em 3 minutos. 7 dias grátis.",
        images: ["/og-image.png"],
    },
    robots: {
        index: true,
        follow: true,
    },
}

export default function RegistroLayout({ children }: { children: React.ReactNode }) {
    const ld = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Criar conta — Agenda Online",
        description: "Página de cadastro do Agenda Online: site profissional com agenda 24h, 7 dias grátis sem cartão.",
        url: "https://agendaonline.app/registro",
        inLanguage: "pt-BR",
        isPartOf: { "@id": "https://agendaonline.app/#website" },
        breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: "Início", item: "https://agendaonline.app/" },
                { "@type": "ListItem", position: 2, name: "Criar conta", item: "https://agendaonline.app/registro" },
            ],
        },
    }

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
            {children}
        </>
    )
}
