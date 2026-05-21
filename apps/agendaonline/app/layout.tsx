import type { Metadata } from "next"


import { Inter, Playfair_Display } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Agenda Online | Site Profissional com Agenda Inclusa para seu Negócio",
  description:
    "Crie em 3 minutos o site da sua marca com agenda 24h, lembretes automáticos no WhatsApp e zero taxa por reserva. 7 dias grátis, sem cartão.",
  keywords: [
    "agenda online",
    "site com agendamento online",
    "criar site para salão de beleza",
    "agenda online para barbearia",
    "sistema de agendamento para salão",
    "agenda para clínica de estética",
    "agendamento online estúdio de tatuagem",
    "agenda online pet shop",
    "agenda online nutricionista",
    "agenda online manicure",
    "site profissional para profissional autônomo",
    "lembrete de agendamento whatsapp",
    "agenda online grátis",
  ],
  authors: [{ name: "Agenda Online" }],
  creator: "Agenda Online",
  publisher: "Agenda Online",
  category: "business",
  applicationName: "Agenda Online",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://agendaonline.app"),
  alternates: {
    canonical: "/",
    languages: {
      "pt-BR": "/",
    },
  },
  openGraph: {
    title: "Agenda Online | Site profissional com agenda 24h inclusa",
    description:
      "Não é só uma agenda. É o site da sua marca. Pronto em 3 minutos, com agendamento automático e lembretes no WhatsApp. 7 dias grátis.",
    url: "https://agendaonline.app",
    siteName: "Agenda Online",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Agenda Online — site profissional com agenda 24h inclusa",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agenda Online | Site + agenda 24h em 3 minutos",
    description: "O site da sua marca com agendamento automático e lembretes no WhatsApp. 7 dias grátis.",
    images: ["/og-image.png"],
    creator: "@agendaonlineapp",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
}

import { Toaster } from "../components/ui/sonner"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Agenda Online",
    alternateName: "AgendaOnline",
    url: "https://agendaonline.app",
    logo: "https://agendaonline.app/logo-agenda-online.svg",
    description:
      "Plataforma brasileira que cria sites profissionais com agenda 24h integrada para salões, barbearias, clínicas de estética e profissionais autônomos.",
    foundingDate: "2024",
    areaServed: { "@type": "Country", name: "Brasil" },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      areaServed: "BR",
      availableLanguage: "Portuguese",
    },
    sameAs: [
      "https://instagram.com/agendaonlineapp",
      "https://www.tiktok.com/@agendaonlineapp",
    ],
  }

  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Agenda Online",
    url: "https://agendaonline.app",
    inLanguage: "pt-BR",
    publisher: { "@id": "https://agendaonline.app/#organization" },
    potentialAction: {
      "@type": "SearchAction",
      target: "https://agendaonline.app/blog?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <html lang="pt-BR" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <TooltipProvider>
            {children}
            <Toaster richColors position="top-right" />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

