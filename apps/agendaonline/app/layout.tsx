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
  title: "Agenda Online | O Melhor Agendamento Online via WhatsApp",
  description:
    "Transforme seu WhatsApp em uma máquina de agendamentos. Site profissional com agendamento automático para salões de beleza, clínicas de estética, barbearias, estúdios de tatuagem e mais.",
  keywords: [
    "agenda online", 
    "agendamento salão de beleza", 
    "sistema para salão", 
    "gestão de salão", 
    "agendamento whatsapp", 
    "agenda estética", 
    "barbearia agendamento",
    "agendamento estúdio de tatuagem",
    "sistema pet shop",
    "agendamento para nutricionistas",
    "site profissional para profissionais liberais"
  ],
  authors: [{ name: "Agenda Online Team" }],
  creator: "Agenda Online",
  publisher: "Agenda Online",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://agendaonline.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Agenda Online | Agendamento Profissional para seu Negócio",
    description:
      "Transforme seu WhatsApp em uma máquina de agendamentos. Página profissional, moderna e focada em conversão para salões e clínicas.",
    url: "https://agendaonline.app",
    siteName: "Agenda Online",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Agenda Online - Agendamento via WhatsApp",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agenda Online | Agendamento via WhatsApp",
    description: "Sua agenda profissional no WhatsApp em menos de 5 minutos.",
    images: ["/og-image.png"],
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
}

import { Toaster } from "../components/ui/sonner"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth" suppressHydrationWarning>
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

