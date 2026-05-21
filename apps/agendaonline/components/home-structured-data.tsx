export function HomeStructuredData() {
    const softwareLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Agenda Online",
        applicationCategory: "BusinessApplication",
        applicationSubCategory: "Scheduling Software",
        operatingSystem: "Web",
        url: "https://agendaonline.app",
        description:
            "Plataforma que cria sites profissionais com agenda 24h integrada para salões, barbearias, clínicas de estética e profissionais autônomos.",
        inLanguage: "pt-BR",
        offers: [
            {
                "@type": "Offer",
                name: "Profissional",
                price: "79.00",
                priceCurrency: "BRL",
                availability: "https://schema.org/InStock",
                priceValidUntil: "2026-12-31",
                url: "https://agendaonline.app/registro?plan=profissional",
            },
            {
                "@type": "Offer",
                name: "Completo",
                price: "119.00",
                priceCurrency: "BRL",
                availability: "https://schema.org/InStock",
                priceValidUntil: "2026-12-31",
                url: "https://agendaonline.app/registro?plan=premium",
            },
        ],
        featureList: [
            "Site profissional com a sua marca",
            "Agendamento automático 24h",
            "Lembretes anti-falta no WhatsApp",
            "Catálogo de serviços com preços",
            "Gestão de múltiplos profissionais",
            "Link único pra bio do Instagram",
            "Portfólio antes e depois",
            "Histórico completo de clientes",
            "Zero taxa por agendamento",
        ],
        screenshot: "https://agendaonline.app/og-image.png",
    }

    const productLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: "Agenda Online — Site profissional com agenda 24h",
        description:
            "Site profissional + agenda online para salões de beleza, barbearias, clínicas de estética, estúdios de tatuagem, pet shops e profissionais autônomos.",
        brand: { "@type": "Brand", name: "Agenda Online" },
        image: "https://agendaonline.app/og-image.png",
        offers: {
            "@type": "AggregateOffer",
            priceCurrency: "BRL",
            lowPrice: "79.00",
            highPrice: "119.00",
            offerCount: 2,
            url: "https://agendaonline.app/#pricing",
        },
    }

    const breadcrumbLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Início", item: "https://agendaonline.app/" },
        ],
    }

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
        </>
    )
}
