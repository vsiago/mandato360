"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Building2, Users, Stethoscope, GraduationCap, HardHat, HeartHandshake,
  ArrowRight, Star, MapPin, ChevronDown, Menu, X, User, Heart, Phone,
  MoveRight, ArrowLeftRight, CheckCircle2, LifeBuoy, FileText, Send, Mail,
  Share2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { submitSupporterAction, submitRequestAction } from "@/lib/actions/forms"
import { toast } from "sonner"
import { cn } from '@/lib/utils'
import { getTheme, generateThemeCSS } from "@/src/themes"
import { SiteConfig } from "@/lib/editor/types"

export default function LandingContent({ tenant, initialData }: { tenant: any, initialData: any }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // ─── Resolve Data (Config vs DB) ───
  const hasConfig = !!tenant?.config
  let config: SiteConfig | null = null
  if (hasConfig) {
      try {
          config = JSON.parse(tenant.config)
      } catch (e) {
          console.error("Failed to parse tenant config")
      }
  }

  // Fallback / Merged Data
  const primaryColor = config?.colors?.primary || tenant?.primaryColor || "#0F2B5B"
  const secondaryColor = config?.colors?.secondary || tenant?.secondaryColor || "#0D9F6E"
  const displayName = config?.name || tenant?.name || "Vereador"
  const displayBio = config?.perfil?.bio || tenant?.biografia || "Trabalhando por você."
  const displayFoto = config?.perfil?.imageUrl || tenant?.fotoPerfilUrl || "/vereador-modelo.png"
  const heroBadge = config?.heroBadge || "Mandato Participativo"
  const heroHeadline = config?.heroHeadline || "Por uma cidade de"
  const heroHighlight = config?.heroHighlight || "Resultados"
  const heroImageUrl = config?.heroImageUrl || "/site/hero.png"

  const activeTheme = getTheme((config?.theme as any) || "neutro")
  const themeCSSVars = generateThemeCSS(activeTheme, "light")

  // Data from initialData (DB)
  const { projetosLei = [], leisAprovadas = [], publicacoes = [], indicacoes = [] } = initialData || {}

  // List of projects: prefer config if it has content, else use DB
  const displayProjetos = (config?.projetos && config.projetos.length > 0) 
    ? config.projetos.slice(0, 6) 
    : projetosLei.slice(0, 6).map((p: any) => ({ name: p.titulo, description: p.descricao, image: "" }))

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <div 
        className="min-h-screen bg-gray-50 font-sans selection:bg-primary selection:text-white overflow-x-hidden"
        style={{
            ...themeCSSVars,
            // @ts-ignore
            "--primary": primaryColor,
            "--secondary": secondaryColor,
            "--tenant-primary": primaryColor,
            "--tenant-secondary": secondaryColor,
        }}
    >
      {/* HEADER */}
      <header className={`fixed top-0 inset-x-0 z-50 h-16 transition-all duration-300 border-b ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-gray-100' : 'bg-transparent border-transparent'}`}>
        <div className="mx-auto max-w-7xl px-6 h-full flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl font-black transition-all ${isScrolled ? 'bg-primary text-white' : 'bg-white text-primary'}`}>
                {displayName.charAt(0)}
              </div>
              <span className={`text-base font-bold ${isScrolled ? 'text-gray-900' : 'text-white drop-shadow-sm'}`}>{displayName}</span>
           </div>
           <nav className="hidden lg:flex items-center gap-8">
              {['projetos', 'perfil', 'contato'].map((id) => (
                <button key={id} onClick={() => scrollTo(id)} className={`text-sm font-bold uppercase tracking-tight hover:text-secondary ${isScrolled ? 'text-gray-600' : 'text-white/80'}`}>
                  {id === 'projetos' ? 'Projetos' : id === 'perfil' ? 'Perfil' : 'Contato'}
                </button>
              ))}
           </nav>
           <Button className={`rounded-full px-6 font-bold shadow-md transition-all h-10 ${isScrolled ? 'bg-primary text-white' : 'bg-secondary text-white'}`}>
              Quero Apoiar
           </Button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative min-h-[90vh] flex flex-col justify-center bg-primary pt-16">
        <div className="absolute inset-0 bg-linear-to-br from-primary via-primary/90 to-primary/80 z-0" />
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
             <div className={cn("absolute z-2 overflow-hidden", config?.heroImageSettings?.layout === 'center' ? "inset-0 opacity-20" : "top-0 right-0 bottom-0 w-[50%]")}>
                <Image 
                    src={heroImageUrl} 
                    alt={displayName || "Vereador"} 
                    fill 
                    className="object-cover" 
                    style={{
                        objectPosition: `${config?.heroImageSettings?.positionX ?? 50}% ${config?.heroImageSettings?.positionY ?? 20}%`,
                        transform: `scale(${config?.heroImageSettings?.zoom ?? 1})`,
                    }}
                />
             </div>
        </div>

        <div className={cn("relative z-10 mx-auto w-full max-w-7xl px-8 py-12 flex flex-col", config?.heroImageSettings?.layout === 'center' && "items-center text-center")}>
          <div className="max-w-3xl flex flex-col gap-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/20 w-fit">
              <HeartHandshake className="h-3.5 w-3.5 text-white" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">{heroBadge}</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white leading-tight tracking-tighter shadow-sm">
                {heroHeadline} <span className="text-secondary">{heroHighlight}</span>
            </h1>
            <p className="text-xl text-white/80 font-medium max-w-xl">{displayBio}</p>
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <Button className="bg-secondary text-white font-black text-xl px-12 py-8 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all">Solicitar Demanda</Button>
              <Button variant="outline" className="border-2 border-white/20 text-white bg-white/5 font-bold text-lg px-8 py-8 rounded-2xl" onClick={() => scrollTo('projetos')}>Ver Projetos</Button>
            </div>
          </div>
        </div>
      </section>

      {/* PROJETOS */}
      <section id="projetos" className="py-24 bg-white relative">
        <div className="mx-auto max-w-7xl px-8">
           <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-16">Ações e Projetos</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayProjetos.map((proj: any, i: number) => (
                <div key={i} className="group p-8 rounded-[2rem] bg-gray-50 hover:bg-white hover:shadow-2xl transition-all border border-transparent hover:border-primary/10">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all mb-6">
                    <FileText className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-2">{proj.name}</h3>
                  <p className="text-gray-500 leading-relaxed text-sm line-clamp-3">{proj.description}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* PERFIL */}
      <section id="perfil" className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-8">
           <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
                 <Image src={displayFoto} alt={displayName} fill className="object-cover object-top" />
              </div>
              <div className="space-y-8">
                 <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">O Vereador</h2>
                 <p className="text-xl text-gray-600 leading-relaxed italic">"{displayBio}"</p>
                 <div className="pt-8 border-t border-gray-200">
                    <h3 className="text-3xl font-black text-primary uppercase">{displayName}</h3>
                    <p className="text-gray-400 font-bold uppercase tracking-widest mt-1">Mandato Participativo</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="bg-gray-900 py-20 text-white/50 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-8 flex flex-col md:flex-row justify-between items-center gap-12">
           <div className="flex flex-col items-center md:items-start gap-4">
              <span className="text-3xl font-black text-white uppercase tracking-tighter">{displayName}</span>
              <p className="max-w-xs text-sm">Trabalhando com ética e transparência para o povo.</p>
           </div>
           <div className="flex gap-6">
              <Share2 className="w-8 h-8 text-white/30 hover:text-secondary transition-colors" />
           </div>
           <p className="text-[10px] uppercase font-black tracking-widest">© 2026 Mandato360</p>
        </div>
      </footer>
    </div>
  )
}
