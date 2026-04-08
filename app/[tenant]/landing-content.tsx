"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Building2, Users, Stethoscope, GraduationCap, HardHat, HeartHandshake,
  ArrowRight, Star, MapPin, ChevronDown, Menu, X, User, Heart, Phone,
  MoveRight, ArrowLeftRight, CheckCircle2, LifeBuoy, FileText, Send, Mail,
  Share2, MessageCircle, HelpCircle, ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { submitSupporterAction, submitRequestAction } from "@/lib/actions/forms"
import { toast } from "sonner"
import { cn } from '@/lib/utils'
import { getTheme, generateThemeCSS } from "@/src/themes"
import { SiteConfig } from "@/lib/editor/types"
import { buildGradientString } from "@/lib/editor/style-utils"

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
  const displayFoto = config?.perfil?.imageUrl || tenant?.fotoPerfilUrl || ""
  const displayRole = config?.perfil?.role || "Vereador"
  const heroBadge = config?.heroBadge || "Mandato Participativo"
  const heroHeadline = config?.heroHeadline || "Por uma cidade de"
  const heroHighlight = config?.heroHighlight || "Resultados"
  const heroImageUrl = config?.heroImageUrl || ""
  const heroDescription = config?.description || "Trabalhando pela transparência e inovação política."
  const displayTagline = config?.tagline || "Mandato Participativo"
  const logoUrl = config?.logoUrl || tenant?.logoUrl || ""

  // Hero image settings
  const heroSettings = config?.heroImageSettings
  const heroLayout = heroSettings?.layout || 'left'

  // Section styles (for gradient backgrounds)
  const heroSectionStyle = config?.sectionStyles?.hero
  const hasHeroGradient = heroSectionStyle?.background === 'gradient' && heroSectionStyle?.gradient
  const heroOverlay = heroSettings?.overlayEnabled && heroSettings?.overlay

  const activeTheme = getTheme((config?.theme as any) || "neutro")
  const themeCSSVars = generateThemeCSS(activeTheme, "light")

  // Data from initialData (DB)
  const { projetosLei = [], leisAprovadas = [], publicacoes = [], indicacoes = [] } = initialData || {}

  // Lists: prefer config if it has content, else use DB fallbacks
  const displayProjetos = (config?.projetos && config.projetos.length > 0) 
    ? config.projetos.slice(0, 6) 
    : projetosLei.slice(0, 6).map((p: any) => ({ name: p.titulo, description: p.descricao, image: "" }))

  const displayTrustBadges = config?.trustBadges || []
  const displayFAQ = config?.faq || []
  const displayBeforeAfter = config?.beforeAfter || []
  const displayContact = config?.contact || {}

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
              {logoUrl ? (
                <img src={logoUrl} alt={displayName} className="h-10 w-auto object-contain" />
              ) : (
                <>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl font-black transition-all ${isScrolled ? 'bg-[var(--tenant-primary)] text-white' : 'bg-white text-[var(--tenant-primary)]'}`}>
                    {displayName.charAt(0)}
                  </div>
                  <span className={`text-base font-bold ${isScrolled ? 'text-gray-900' : 'text-white drop-shadow-sm'}`}>{displayName}</span>
                </>
              )}
           </div>
           <nav className="hidden lg:flex items-center gap-8">
              {['projetos', 'perfil', 'contato'].map((id) => (
                <button key={id} onClick={() => scrollTo(id)} className={`text-sm font-bold uppercase tracking-tight hover:text-[var(--tenant-secondary)] ${isScrolled ? 'text-gray-600' : 'text-white/80'}`}>
                  {id === 'projetos' ? 'Projetos' : id === 'perfil' ? 'Perfil' : 'Contato'}
                </button>
              ))}
           </nav>
           <Button className={`rounded-full px-6 font-bold shadow-md transition-all h-10 ${isScrolled ? 'bg-[var(--tenant-primary)] text-white' : 'bg-[var(--tenant-secondary)] text-white'}`}>
              Quero Apoiar
           </Button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative min-h-[90vh] flex flex-col justify-center pt-16" style={{ backgroundColor: primaryColor }}>
        {/* Base gradient or solid */}
        {hasHeroGradient ? (
          <div className="absolute inset-0 z-0" style={{ background: buildGradientString(heroSectionStyle!.gradient!) }} />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-[var(--tenant-primary)] via-[var(--tenant-primary)]/90 to-[var(--tenant-primary)]/80 z-0" />
        )}

        {/* Hero Image */}
        {heroImageUrl && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
             <div className={cn(
               "absolute z-2 overflow-hidden",
               heroLayout === 'center' ? "inset-0" : "top-0 right-0 bottom-0 w-full lg:w-[50%]"
             )}>
                <Image 
                    src={heroImageUrl} 
                    alt={displayName || "Vereador"} 
                    fill 
                    className="object-cover" 
                    sizes={heroLayout === 'center' ? "100vw" : "50vw"}
                    priority
                    style={{
                        objectPosition: `${heroSettings?.positionX ?? 50}% ${heroSettings?.positionY ?? 20}%`,
                        transform: `scale(${heroSettings?.zoom ?? 1})`,
                    }}
                />
             </div>
          </div>
        )}

        {/* Hero Overlay Gradient */}
        {heroOverlay && (
          <div 
            className="absolute inset-0 z-[2] pointer-events-none"
            style={{ background: buildGradientString(heroSettings!.overlay!) }}
          />
        )}

        <div className={cn(
          "relative z-10 mx-auto w-full max-w-7xl px-8 py-12 flex flex-col",
          heroLayout === 'center' && "items-center text-center"
        )}>
          <div className={cn("max-w-3xl flex flex-col gap-8", heroLayout === 'center' && "items-center")}>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/20 w-fit">
              <HeartHandshake className="h-3.5 w-3.5 text-white" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">{heroBadge}</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white leading-tight tracking-tighter">
                {heroHeadline} <span style={{ color: secondaryColor }}>{heroHighlight}</span>
            </h1>
            <p className={cn("text-xl text-white/80 font-medium", heroLayout === 'center' ? "max-w-2xl" : "max-w-xl")}>{heroDescription}</p>
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <Button className="bg-[var(--tenant-secondary)] text-white font-black text-xl px-12 py-8 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all">Solicitar Demanda</Button>
              <Button variant="outline" className="border-2 border-white/20 text-white bg-white/5 font-bold text-lg px-8 py-8 rounded-2xl" onClick={() => scrollTo('projetos')}>Ver Projetos</Button>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      {displayTrustBadges.length > 0 && (
        <section className="bg-slate-900 py-6 overflow-hidden border-y border-white/5">
          <div className="flex items-center gap-12 whitespace-nowrap px-6 overflow-x-auto">
            {displayTrustBadges.map((badge: any, i: number) => (
              <div key={i} className="flex items-center gap-3 shrink-0">
                <CheckCircle2 className="h-5 w-5" style={{ color: secondaryColor }} />
                <span className="text-white font-bold uppercase tracking-[0.15em] text-[10px]">
                  {badge.text}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PROJETOS */}
      <section id="projetos" className="py-24 bg-white relative">
        <div className="mx-auto max-w-7xl px-8">
           <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-16">Ações e Projetos</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayProjetos.map((proj: any, i: number) => (
                <div key={i} className="group rounded-[2rem] bg-gray-50 hover:bg-white hover:shadow-2xl transition-all border border-transparent hover:border-gray-200 overflow-hidden">
                  {proj.image ? (
                    <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                      <img src={proj.image} alt={proj.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ) : (
                    <div className="p-8 pb-0">
                      <div className="h-14 w-14 rounded-2xl flex items-center justify-center mb-6 transition-all"
                        style={{ backgroundColor: `${primaryColor}10`, color: primaryColor }}
                      >
                        <FileText className="h-7 w-7" />
                      </div>
                    </div>
                  )}
                  <div className="p-8">
                    <h3 className="text-xl font-black text-gray-900 mb-2">{proj.name}</h3>
                    <p className="text-gray-500 leading-relaxed text-sm line-clamp-3">{proj.description}</p>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* PERFIL */}
      <section id="perfil" className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-8">
           <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl bg-slate-200">
                {displayFoto ? (
                  <Image src={displayFoto} alt={displayName} fill className="object-cover object-top" sizes="600px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor}10` }}>
                    <User className="h-24 w-24 text-slate-300" />
                  </div>
                )}
              </div>
              <div className="space-y-8">
                 <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">O Vereador</h2>
                 <p className="text-xl text-gray-600 leading-relaxed italic">"{displayBio}"</p>
                 <div className="pt-8 border-t border-gray-200">
                    <h3 className="text-3xl font-black uppercase" style={{ color: primaryColor }}>{displayName}</h3>
                    <p className="text-gray-400 font-bold uppercase tracking-widest mt-1">{displayRole}</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* BEFORE/AFTER */}
      {displayBeforeAfter.length > 0 && (
        <section className="py-24 bg-white border-t border-gray-100">
          <div className="mx-auto max-w-7xl px-8">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-16 text-center">
              Transformando a <span style={{ color: primaryColor }} className="italic">Cidade</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayBeforeAfter.map((item: any, idx: number) => (
                <div key={idx} className="bg-gray-50 rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all">
                  <div className="grid grid-cols-2 h-44">
                    <div className="relative overflow-hidden">
                      {item.before ? (
                        <img src={item.before} alt="Antes" className="w-full h-full object-cover grayscale" />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center"><span className="text-xs text-gray-400 font-bold">ANTES</span></div>
                      )}
                    </div>
                    <div className="relative overflow-hidden">
                      {item.after ? (
                        <img src={item.after} alt="Depois" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center"><span className="text-xs text-gray-400 font-bold">DEPOIS</span></div>
                      )}
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-sm font-bold text-gray-900">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {displayFAQ.length > 0 && (
        <section className="py-24 bg-gray-50">
          <div className="mx-auto max-w-3xl px-8">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-16 text-center">
              Perguntas <span style={{ color: primaryColor }} className="italic">Frequentes</span>
            </h2>
            <div className="space-y-4">
              {displayFAQ.map((item: any, idx: number) => (
                <details key={idx} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                  <summary className="flex items-center justify-between px-6 py-5 cursor-pointer select-none list-none hover:bg-gray-50 transition-colors">
                    <span className="text-base font-bold text-gray-900">{item.question}</span>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-open:rotate-90 transition-transform shrink-0 ml-4" />
                  </summary>
                  <div className="px-6 pb-5 text-gray-600 leading-relaxed text-sm">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CONTACT */}
      {(displayContact as any)?.phone || (displayContact as any)?.whatsapp || (displayContact as any)?.email ? (
        <section id="contato" className="py-24 bg-white border-t border-gray-100">
          <div className="mx-auto max-w-4xl px-8">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-16 text-center">
              Entre em <span style={{ color: primaryColor }} className="italic">Contato</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(displayContact as any)?.phone && (
                <a href={`tel:${(displayContact as any).phone}`} className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-lg transition-all group">
                  <div className="h-12 w-12 rounded-xl flex items-center justify-center transition-all" style={{ backgroundColor: `${primaryColor}10`, color: primaryColor }}>
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Telefone</p>
                    <p className="text-sm font-bold text-gray-900">{(displayContact as any).phone}</p>
                  </div>
                </a>
              )}
              {(displayContact as any)?.whatsapp && (
                <a href={`https://wa.me/55${(displayContact as any).whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-lg transition-all group">
                  <div className="h-12 w-12 rounded-xl bg-green-500/10 text-green-600 flex items-center justify-center">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">WhatsApp</p>
                    <p className="text-sm font-bold text-gray-900">{(displayContact as any).whatsapp}</p>
                  </div>
                </a>
              )}
              {(displayContact as any)?.email && (
                <a href={`mailto:${(displayContact as any).email}`} className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-lg transition-all group">
                  <div className="h-12 w-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${primaryColor}10`, color: primaryColor }}>
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">E-mail</p>
                    <p className="text-sm font-bold text-gray-900">{(displayContact as any).email}</p>
                  </div>
                </a>
              )}
              {(displayContact as any)?.address && (
                <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100 md:col-span-2 lg:col-span-3">
                  <div className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${primaryColor}10`, color: primaryColor }}>
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Endereço</p>
                    <p className="text-sm font-bold text-gray-900">{(displayContact as any).address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      ) : null}

      {/* FOOTER */}
      <footer id="contact" className="bg-gray-900 py-20 text-white/50 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-8 flex flex-col md:flex-row justify-between items-center gap-12">
           <div className="flex flex-col items-center md:items-start gap-4">
              <span className="text-3xl font-black text-white uppercase tracking-tighter">{displayName}</span>
              <p className="max-w-xs text-sm">{displayTagline}</p>
           </div>
           <div className="flex gap-6">
              {(displayContact as any)?.instagram && (
                <a href={`https://instagram.com/${(displayContact as any).instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                  <Share2 className="w-8 h-8 text-white/30 hover:text-[var(--tenant-secondary)] transition-colors" />
                </a>
              )}
              {(displayContact as any)?.whatsapp && (
                <a href={`https://wa.me/55${(displayContact as any).whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-8 h-8 text-white/30 hover:text-green-400 transition-colors" />
                </a>
              )}
           </div>
           <p className="text-[10px] uppercase font-black tracking-widest">© 2026 Mandato360</p>
        </div>
      </footer>
    </div>
  )
}
