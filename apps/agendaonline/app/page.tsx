"use client";

import Link from "next/link"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CalendarDays, MessageCircle, ShieldCheck, LayoutTemplate, Shield, Zap, Users, ArrowRight, Star, CheckCircle2, Clock, CreditCard, Headphones, User, ChevronRight, MoreHorizontal, Folder, SlidersHorizontal } from "lucide-react"
import { ThemeToggle } from "../components/theme-toggle"
import { HeroOutcomeUI } from "@/components/hero-outcome-ui"
import { DashboardMockup } from "@/components/dashboard-mockup"
import { FAQAEO } from "@/components/faq-aeo"
import { WaitlistModal } from "@/components/waitlist-modal"
function HomeContent() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const canceled = searchParams.get("canceled");
    if (canceled === "true") {
      alert("Pagamento cancelado. Você pode tentar novamente quando estiver pronto.");
      window.history.replaceState({}, "", "/");
    }
  }, [searchParams]);

  const handleCheckout = (plan: string) => {
    router.push(`/checkout?plan=${plan}`);
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-50 font-sans selection:bg-amber-500/20 selection:text-amber-600 dark:selection:text-amber-300">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/40 dark:bg-stone-950/40 backdrop-blur-md border-b border-white/20 dark:border-stone-800/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center">
            <img src="/logo-agenda-online.svg" alt="Agenda Online" className="h-10 md:h-12 w-auto" />
          </Link>
          <div className="flex items-center gap-8">
            <Link href="#features" className="hidden md:inline text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Recursos</Link>
            <Link href="#pricing" className="hidden md:inline text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Preços</Link>
            <Link href="#demo" className="hidden md:inline text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Demo</Link>
            <ThemeToggle />
            <div className="hidden md:flex flex-1 justify-end">
              <Link
                href="/registro"
                className="btn-gold-solid rounded-full px-5 py-2 text-sm cursor-pointer border-0"
              >
                Cadastre-se
              </Link>
            </div>
          </div>
        </div>
      </nav>


      {/* Hero — Exact Match Aesthetic */}
      <section className="relative pt-20 pb-0 lg:pt-28 lg:pb-0 overflow-hidden bg-hero select-none transition-colors duration-300">

        {/* Deep ambient background glows */}
        <div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 w-200 h-200 rounded-full blur-[140px] pointer-events-none opacity-40 dark:opacity-100" style={{ background: 'radial-gradient(circle, rgba(216,155,60,0.12) 0%, transparent 60%)' }} />
        <div className="absolute bottom-1/4 right-0 translate-x-1/4 w-150 h-150 rounded-full blur-[120px] pointer-events-none opacity-40 dark:opacity-100" style={{ background: 'radial-gradient(circle, rgba(244,196,106,0.08) 0%, transparent 60%)' }} />
        <div className="absolute top-1/4 right-1/4 w-75 h-75 rounded-full blur-[80px] pointer-events-none opacity-40 dark:opacity-100" style={{ background: 'radial-gradient(circle, rgba(226,167,64,0.05) 0%, transparent 50%)' }} />

        {/* Estrelas (Camadas de paralaxe simulado em SVG) */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full mix-blend-screen opacity-30 dark:opacity-70 md:opacity-40 dark:mix-blend-lighten" xmlns="http://www.w3.org/2000/svg">
          {/* Padrão 1: Micro estrelas espalhadas */}
          <pattern id="stars-1" width="181" height="181" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="0.4" fill="#fff" opacity="0.55"></circle>
            <circle cx="45" cy="30" r="0.6" fill="#fff" opacity="0.75"></circle>
            <circle cx="80" cy="15" r="0.5" fill="#fff" opacity="0.65"></circle>
            <circle cx="20" cy="70" r="0.4" fill="#fff" opacity="0.55"></circle>
            <circle cx="140" cy="85" r="0.7" fill="#fde68a" opacity="0.75"></circle>
            <circle cx="135" cy="140" r="0.5" fill="#fff" opacity="0.65"></circle>
            <circle cx="65" cy="165" r="0.4" fill="#fff" opacity="0.7"></circle>
          </pattern>

          {/* Padrão 2: Estrelas médias */}
          <pattern id="stars-2" width="347" height="347" patternUnits="userSpaceOnUse">
            <circle cx="25" cy="15" r="0.8" fill="#fef3c7" opacity="0.8"></circle>
            <circle cx="140" cy="50" r="0.5" fill="#fff" opacity="0.65"></circle>
            <circle cx="285" cy="120" r="0.6" fill="#fff" opacity="0.75"></circle>
            <circle cx="160" cy="240" r="0.7" fill="#fde68a" opacity="0.75"></circle>
            <circle cx="50" cy="310" r="0.4" fill="#fff" opacity="0.6"></circle>
            <circle cx="310" cy="260" r="0.5" fill="#fff" opacity="0.65"></circle>
          </pattern>

          {/* Padrão 3: Estrelas raras mais brilhantes */}
          <pattern id="stars-3" width="503" height="503" patternUnits="userSpaceOnUse">
            <circle cx="40" cy="80" r="0.4" fill="#fff" opacity="0.65"></circle>
            <circle cx="200" cy="30" r="0.9" fill="#fef3c7" opacity="0.9"></circle>
            <circle cx="380" cy="210" r="0.5" fill="#fff" opacity="0.65"></circle>
            <circle cx="90" cy="380" r="0.7" fill="#fde68a" opacity="0.75"></circle>
            <circle cx="430" cy="110" r="0.6" fill="#fff" opacity="0.75"></circle>
            <circle cx="230" cy="450" r="0.4" fill="#fff" opacity="0.65"></circle>
            <circle cx="470" cy="450" r="0.9" fill="#fff" opacity="0.85"></circle>
          </pattern>

          <rect width="100%" height="100%" fill="url(#stars-1)"></rect>
          <rect width="100%" height="100%" fill="url(#stars-2)"></rect>
          <rect width="100%" height="100%" fill="url(#stars-3)"></rect>
        </svg>

        {/* Iluminação da borda inferior (Horizonte) */}
        <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-2/3 bg-linear-to-t from-amber-500/10 via-amber-200/5 to-transparent dark:from-amber-900/30 dark:via-black/10 dark:to-transparent z-0"></div>

        {/* Floating motes of dust */}
        {[
          { top: 56, left: 32, size: 5, opacity: 0.45, duration: 8.2, delay: 1.1 },
          { top: 22, left: 68, size: 3, opacity: 0.25, duration: 6.5, delay: 0.5 },
          { top: 45, left: 25, size: 5, opacity: 0.55, duration: 9.1, delay: 1.8 },
          { top: 70, left: 55, size: 3, opacity: 0.35, duration: 7.3, delay: 0.2 },
          { top: 38, left: 45, size: 5, opacity: 0.48, duration: 8.8, delay: 1.4 },
          { top: 62, left: 75, size: 3, opacity: 0.28, duration: 6.9, delay: 0.8 },
          { top: 28, left: 52, size: 5, opacity: 0.52, duration: 9.5, delay: 1.6 },
          { top: 50, left: 82, size: 3, opacity: 0.32, duration: 7.7, delay: 0.4 },
        ].map((mote, i) => (
          <div key={`mote-${i}`} className="dust-mote" style={{
            top: `${mote.top}%`,
            left: `${mote.left}%`,
            width: `${mote.size}px`,
            height: `${mote.size}px`,
            opacity: mote.opacity,
            animation: `float-slow ${mote.duration}s ease-in-out infinite ${mote.delay}s`
          }} />
        ))}

        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">

            {/* Left side — Typography and CTAs */}
            <div className="text-center lg:text-left pt-4">
              {/* Social Proof Badge */}
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium tracking-wide mb-8 border border-amber-500/30 dark:border-[#E2A740]/30 text-amber-700 dark:text-[#E2A740] bg-white/50 dark:bg-transparent backdrop-blur-sm">
                <span>Site profissional + Agendamento <span className="font-bold text-amber-600 dark:text-[#F4C46A]">automático</span></span>
              </div>

              {/* Main Headline */}
              <h1 className="text-[40px] leading-tight sm:text-5xl md:text-6xl lg:text-[72px] lg:w-[120%] lg:min-w-175 font-bold tracking-tight md:leading-[1.05] mb-6 text-stone-900 dark:text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
                Crie o site do seu salão{' '}
                <br className="hidden md:block" />
                com agendamento{' '}
                <br className="hidden md:block" />
                online <span className="italic text-gold-smooth pr-2">automático</span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg md:text-xl md:max-w-145 lg:max-w-162.5 mx-auto lg:mx-0 mb-10 leading-[1.6] font-normal text-stone-600 dark:text-[#A0A0A0]">
                Seus clientes marcam horário sozinhos enquanto você organiza sua agenda.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                <Link href="/registro"
                  className="btn-gold-solid inline-flex items-center justify-center px-10 py-4.5 text-[17px] rounded-full cursor-pointer border-0">
                  Começar Agora — É Grátis
                </Link>
                <Link href="#pricing"
                  className="btn-gold-outline inline-flex items-center justify-center gap-2 px-8 py-4.5 text-[17px] rounded-full">
                  Assinar o plano <ArrowRight className="h-5 w-5" />
                </Link>
              </div>

              {/* Conversion Micro-bullets */}
              <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 text-[13px] text-stone-500 dark:text-[#888888] font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-500/70" />
                  <span className="whitespace-nowrap">Confirmação via WhatsApp</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-500/70" />
                  <span className="whitespace-nowrap">Lembrete anti-faltas</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-500/70" />
                  <span className="whitespace-nowrap">Pagamento antecipado</span>
                </div>
              </div>

              {/* Trust/Testimonial Area */}
              <div className="mt-14 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
                <div className="flex gap-1 shrink-0">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500 dark:fill-[#F4C46A] dark:text-[#F4C46A]" />)}
                </div>
                <p className="text-[14px] sm:text-[15px] leading-relaxed max-w-xs sm:max-w-sm text-center sm:text-left text-stone-500 dark:text-[#999999]">
                  <span className="font-medium text-stone-800 dark:text-[#B0B0B0]">(5.0)</span> "Agora minhas clientes agendam sozinhas pelo WhatsApp." <span className="text-stone-400 dark:text-[#666666]">― Cláudia S., Studio Beauty</span>
                </p>
              </div>
            </div>

            {/* Right side — Dashboard Mockup */}
            <div className="relative hidden lg:block mt-2 xl:mt-0 perspective-1000 transform lg:scale-100 xl:scale-105 origin-left transition-transform duration-500">


              {/* The Dashboard Card */}
              <DashboardMockup className="max-w-120 xl:max-w-130" />

              {/* Floating Notifications */}
              <HeroOutcomeUI />
            </div>

          </div>
        </div>

        {/* Premium Dark Infinite Marquee Footer */}
        <div className="relative mt-12 sm:mt-16 w-full border-t border-b border-stone-200/20 dark:border-white/5 bg-black/80 dark:bg-black/90 backdrop-blur-xl overflow-hidden flex items-center h-12 sm:h-14 z-20">
          <div className="flex w-fit animate-marquee hover-pause items-center">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex shrink-0 items-center justify-around gap-8 sm:gap-12 px-4 sm:px-6 text-[12px] sm:text-sm font-medium tracking-wide text-stone-300 dark:text-stone-400">
                <span className="flex items-center gap-2 whitespace-nowrap"><CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-500/80" /> Agendamento 24/7</span>
                <span className="flex items-center gap-2 whitespace-nowrap"><CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-500/80" /> Lembretes Automáticos</span>
                <span className="flex items-center gap-2 whitespace-nowrap"><CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-500/80" /> Link na Bio</span>
                <span className="flex items-center gap-2 whitespace-nowrap"><CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-500/80" /> Pagamento Antecipado</span>
                <span className="flex items-center gap-2 whitespace-nowrap"><CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-500/80" /> Zero Taxas</span>
                <span className="flex items-center gap-2 whitespace-nowrap"><CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-500/80" /> Confirmação no WhatsApp</span>
                <span className="flex items-center gap-2 whitespace-nowrap"><CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-500/80" /> Gestão Completa</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Mobile Section (Apenas Mobile/Tablet) */}
      <section className="block lg:hidden pt-8 pb-32 px-4 bg-stone-50 dark:bg-stone-950 overflow-hidden relative border-t border-stone-100 dark:border-stone-800/50">
        <div className="absolute inset-0 bg-linear-to-b from-stone-100/50 to-transparent dark:from-stone-800/20" />
        <div className="mx-auto max-w-md relative z-10 text-center mt-12 mb-12">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase mb-6 border border-amber-500/20 text-amber-600 dark:text-amber-400 bg-amber-500/10 backdrop-blur-sm">
            <Star className="h-3 w-3" /> Design Intuitivo
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
            A experiência por <span className="text-amber-500 dark:text-amber-400 italic">dentro</span>
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed px-4">Uma interface limpa e elegante, pensada para facilitar o seu dia a dia e impressionar a cada clique.</p>
        </div>

        {/* Container do Mockup Mobile */}
        <div className="relative mx-auto w-full max-w-90 perspective-1000 mt-16 mb-20 z-20">
          <div className="transform scale-[0.95] origin-top transition-transform hover:scale-100 duration-500">
            <DashboardMockup />

            {/* Micro-interações reposicionadas para mobile */}
            <div className="absolute -bottom-16 -right-2 w-full max-w-[110%] scale-[0.85] origin-bottom-right z-30 pointer-events-none">
              <HeroOutcomeUI />
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-24 bg-stone-50 dark:bg-stone-950 border-t border-stone-100 dark:border-stone-800/50 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
              Do zero ao seu <span className="text-amber-500 dark:text-amber-400 italic">site profissional</span>
            </h2>
            <p className="text-lg text-stone-500 dark:text-stone-400 max-w-2xl mx-auto leading-relaxed">
              Um fluxo inteligente criado para donos de salão que querem presença digital forte sem complicação.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
            <div className="hidden md:block absolute top-[40%] left-[15%] right-[15%] h-0.5 bg-linear-to-r from-transparent via-amber-200 dark:via-amber-800/40 to-transparent -translate-y-1/2 z-0"></div>

            {[
              { step: "1", title: "Crie seu site", desc: "Personalize sua página profissional com logo, cores e as fotos do seu espaço em minutos." },
              { step: "2", title: "Configure serviços", desc: "Adicione seu catálogo de serviços, defina preços, duração e profissionais disponíveis." },
              { step: "3", title: "Clientes agendam", desc: "Compartilhe seu link. Seus clientes acessam seu site, escolhem o horário e agendam sozinhos." }
            ].map((s, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center bg-white/60 dark:bg-stone-900/60 backdrop-blur-sm border border-stone-200/50 dark:border-stone-800/50 rounded-3xl p-8 lg:p-10 transition-transform hover:-translate-y-1">
                <div className="h-16 w-16 lg:h-20 lg:w-20 rounded-full bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-2xl lg:text-3xl font-bold mb-6 text-amber-600 dark:text-amber-400" style={{ fontFamily: 'var(--font-playfair)' }}>
                  {s.step}
                </div>
                <h3 className="text-xl lg:text-2xl font-bold mb-3 text-stone-900 dark:text-stone-50" style={{ fontFamily: 'var(--font-playfair)' }}>{s.title}</h3>
                <p className="text-stone-500 dark:text-stone-400 leading-relaxed text-sm md:text-base">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 lg:py-32 bg-white dark:bg-stone-900/50 border-t border-stone-100 dark:border-stone-800/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-20 lg:mb-24">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
              O seu salão precisa de um <span className="text-amber-500 dark:text-amber-400 italic">site completo</span>
            </h2>
            <p className="text-lg text-stone-500 dark:text-stone-400 max-w-2xl mx-auto leading-relaxed">Muito mais que um simples link na bio. Uma plataforma elegante para profissionalizar seu atendimento, ter uma agenda organizada e encantar clientes.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: LayoutTemplate, title: "Página Profissional", desc: "Seu próprio site premium com hero, serviços, fotos e diferenciais. Sua marca com a sofisticação que merece." },
              { icon: CalendarDays, title: "Agendamento Automático", desc: "Calendário interativo 24h. Sua cliente escolhe o melhor horário e agenda sozinha, sem precisar de você." },
              { icon: Folder, title: "Agenda Organizada", desc: "Controle total dos horários e da equipe em um painel simples. Diga adeus aos choques de horário." },
              { icon: MessageCircle, title: "Integração WhatsApp", desc: "Confirmações, lembretes e avisos diretamente no WhatsApp da sua cliente. Zero complicação." },
              { icon: Shield, title: "Marca Personalizada", desc: "Cores, logo e identidade visual exclusivas. Seu site, com a cara do seu salão, transmitindo credibilidade." },
              { icon: Users, title: "Multi-Profissionais", desc: "Gerencie agendas de vários profissionais no mesmo site. Ideal para salões que estão crescendo." },
            ].map((f, i) => (
              <div key={i} className="group bg-stone-50/50 dark:bg-stone-900/40 border border-stone-200/50 dark:border-stone-800/50 rounded-[2rem] p-6 lg:p-8 transition-all duration-300 hover:bg-white dark:hover:bg-stone-900/80 hover:-translate-y-1 hover:shadow-2xl hover:shadow-stone-200 dark:hover:shadow-black/40">
                <div className="h-12 w-12 lg:h-14 lg:w-14 rounded-2xl bg-white dark:bg-stone-800 flex items-center justify-center mb-5 lg:mb-8 border border-stone-100 dark:border-stone-700 shadow-sm group-hover:bg-amber-50 dark:group-hover:bg-amber-950 transition-colors">
                  <f.icon className="h-5 w-5 lg:h-6 lg:w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-lg lg:text-xl font-bold mb-3 lg:mb-4 text-stone-900 dark:text-stone-50" style={{ fontFamily: 'var(--font-playfair)' }}>{f.title}</h3>
                <p className="text-stone-500 dark:text-stone-400 leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              Um investimento que <span className="text-amber-500 dark:text-amber-400 italic">se paga sozinho</span>
            </h2>
            <p className="text-lg text-stone-500 dark:text-stone-400 max-w-2xl mx-auto leading-relaxed">
              Seu salão merece mais organização e presença profissional online. Com o AgendaOnline você cria <span className="font-bold text-stone-900 dark:text-stone-100">seu site profissional e recebe agendamentos automáticos</span>, tudo em um só lugar.<br className="hidden sm:block" /><br className="hidden sm:block" /> Escolha o plano ideal para sua fase atual.
            </p>
          </div>


          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Essencial */}
            <div className="relative bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-3xl lg:rounded-[2.5rem] p-5 lg:p-8 overflow-hidden shadow-sm flex flex-col h-full">
              <div className="relative z-10 grow">
                <h3 className="text-xl font-bold mb-1 text-stone-900 dark:text-stone-50" style={{ fontFamily: 'var(--font-playfair)' }}>Essencial</h3>
                <p className="text-[10px] text-stone-400 dark:text-stone-500 mb-5 lg:mb-8 uppercase tracking-widest font-semibold">Para profissionais autônomas</p>
                <div className="flex items-baseline gap-1 mb-5 lg:mb-8">
                  <span className="text-5xl font-bold text-stone-900 dark:text-stone-50" style={{ fontFamily: 'var(--font-playfair)' }}>R$49</span>
                  <span className="text-sm text-stone-400 dark:text-stone-500">/mês</span>
                </div>
                <ul className="space-y-3 lg:space-y-4 mb-6 lg:mb-10">
                  {[
                    "Página profissional personalizada",
                    "Catálogo de serviços e preços",
                    "Link exclusivo para sua bio do Instagram",
                    "Agendamento online para clientes",
                    "Integração com WhatsApp",
                    "Painel simples para gerenciar horários",
                    "Otimização básica para buscadores (SEO)",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-stone-300 dark:text-stone-600 shrink-0 mt-0.5" />
                      <span className="text-[13px] lg:text-sm text-stone-600 dark:text-stone-400 leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative z-10 mt-auto pt-6">
                <button 
                  onClick={() => handleCheckout("essencial")}
                  className="block w-full text-center bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold py-3.5 lg:py-4 rounded-2xl text-sm transition-all cursor-pointer border-0">
                  Começar agora
                </button>
                <div className="flex items-center justify-center gap-4 mt-6 text-[10px] text-stone-400 dark:text-stone-500 font-medium">
                  <span>✔ 7 dias de garantia</span>
                  <span>✔ Sem fidelidade</span>
                </div>
              </div>
            </div>

            {/* Profissional ⭐ */}
            <div className="relative bg-white dark:bg-stone-900 border-2 border-amber-400/50 dark:border-amber-500/40 rounded-3xl lg:rounded-[2.5rem] p-5 lg:p-8 overflow-hidden shadow-2xl shadow-amber-500/10 hover:shadow-amber-500/20 transition-all duration-500 flex flex-col h-full transform md:-translate-y-4">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.08)_0%,transparent_70%)]" />
              <div className="relative z-10 grow">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xl font-bold text-stone-900 dark:text-stone-50" style={{ fontFamily: 'var(--font-playfair)' }}>Profissional</h3>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 text-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-amber-500/20">
                    <Star className="h-3 w-3 fill-white" /> Popular
                  </span>
                </div>
                <p className="text-[10px] text-stone-400 dark:text-stone-500 mb-5 lg:mb-8 uppercase tracking-widest font-semibold">Para salões com até 3 profissionais</p>
                <div className="flex items-baseline gap-1 mb-5 lg:mb-8">
                  <span className="text-5xl font-bold text-stone-900 dark:text-stone-50" style={{ fontFamily: 'var(--font-playfair)' }}>R$79</span>
                  <span className="text-sm text-stone-400 dark:text-stone-500">/mês</span>
                </div>
                <ul className="space-y-3 lg:space-y-4 mb-6 lg:mb-10">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                    <span className="text-[13px] lg:text-sm font-bold text-stone-900 dark:text-stone-100 leading-snug">Tudo do plano Essencial +</span>
                  </li>
                  {[
                    "Agenda inteligente em tempo real",
                    "Gestão de múltiplos profissionais",
                    "Bloqueio automático de horários",
                    "Lembretes automáticos para clientes",
                    "Cadastro de clientes",
                    "Relatórios básicos de agendamentos",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-amber-500/70 dark:text-amber-400/70 shrink-0 mt-0.5" />
                      <span className="text-[13px] lg:text-sm text-stone-600 dark:text-stone-400 leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative z-10 mt-auto pt-6">
                <button 
                  onClick={() => handleCheckout("profissional")}
                  className="block w-full text-center btn-gold-solid py-3.5 lg:py-4 rounded-2xl text-sm cursor-pointer border-0"
                >
                  Mais escolhido pelos salões
                </button>
                <div className="flex items-center justify-center gap-4 mt-6 text-[10px] text-stone-400 dark:text-stone-500 font-medium">
                  <span>✔ Ativação imediata</span>
                  <span>✔ Suporte via WhatsApp</span>
                </div>
              </div>
            </div>

            {/* Completo */}
            <div className="relative bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-3xl lg:rounded-[2.5rem] p-5 lg:p-8 overflow-hidden shadow-sm flex flex-col h-full">
              <div className="relative z-10 grow">
                <h3 className="text-xl font-bold mb-1 text-stone-900 dark:text-stone-50" style={{ fontFamily: 'var(--font-playfair)' }}>Completo</h3>
                <p className="text-[10px] text-stone-400 dark:text-stone-500 mb-5 lg:mb-8 uppercase tracking-widest font-semibold">Para salões que querem presença digital completa</p>
                <div className="flex items-baseline gap-1 mb-5 lg:mb-8">
                  <span className="text-5xl font-bold text-stone-900 dark:text-stone-50" style={{ fontFamily: 'var(--font-playfair)' }}>R$119</span>
                  <span className="text-sm text-stone-400 dark:text-stone-500">/mês</span>
                </div>
                <ul className="space-y-3 lg:space-y-4 mb-6 lg:mb-10">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-stone-400 dark:text-stone-500 shrink-0 mt-0.5" />
                    <span className="text-[13px] lg:text-sm font-bold text-stone-900 dark:text-stone-100 leading-snug">Tudo do plano Profissional +</span>
                  </li>
                  {[
                    "Site completo do salão",
                    "Galeria de trabalhos (Antes & Depois)",
                    "Página pública de agendamento",
                    "Personalização avançada do site",
                    "Relatórios de performance",
                    "Destaque do salão no sistema",
                    "Suporte prioritário",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-stone-300 dark:text-stone-600 shrink-0 mt-0.5" />
                      <span className="text-[13px] lg:text-sm text-stone-600 dark:text-stone-400 leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative z-10 mt-auto pt-6">
                <button 
                  onClick={() => handleCheckout("premium")}
                  className="block w-full text-center bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-stone-50 dark:text-stone-900 font-bold py-3.5 lg:py-4 rounded-2xl text-sm transition-all cursor-pointer border-0">
                  Criar site do meu salão
                </button>
                <div className="flex items-center justify-center gap-4 mt-6 text-[10px] text-stone-400 dark:text-stone-500 font-medium">
                  <span>✔ Suporte dedicado</span>
                  <span>✔ Atualizações contínuas</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom note */}
          <p className="text-center text-xs text-stone-400 dark:text-stone-500 mt-10 max-w-lg mx-auto">
            🔒 15 primeiros clientes ganham preço vitalício. Garantia incondicional de 7 dias — se não gostar, devolvemos 100%.
          </p>
        </div>
      </section>

      {/* FAQ / AEO */}
      <FAQAEO />

      {/* Demo */}
      <section id="demo" className="py-24 lg:py-32 bg-stone-50/50 dark:bg-stone-900/40 border-y border-stone-100 dark:border-stone-800/50">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 dark:bg-amber-500/20 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-8 border border-amber-500/20">
            <LayoutTemplate className="h-3.5 w-3.5" /> Exemplo Real
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8" style={{ fontFamily: 'var(--font-playfair)' }}>
            Veja um <span className="text-amber-500 dark:text-amber-400 italic">site real</span> em ação
          </h2>
          <p className="text-lg text-stone-500 dark:text-stone-400 max-w-xl mx-auto mb-12 leading-relaxed">Confira o site do Studio Jaque Geovanelle — um exemplo prático de presença digital forte e agenda organizada.</p>
          <div className="flex flex-col sm:flex-row justify-center items-center">
            <Link href="https://jaquegeovanelle.com.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 sm:gap-4 btn-gold-solid px-8 sm:px-12 py-4 sm:py-5 rounded-[2rem] text-lg sm:text-xl w-full sm:w-auto text-center"
            >
              <CalendarDays className="h-5 w-5 sm:h-6 sm:w-6 shrink-0" /> <span className="whitespace-nowrap">Acessar Demo Ao Vivo</span>
            </Link>
          </div>
        </div>
      </section>


      <footer className="py-12 border-t border-stone-200 dark:border-stone-800">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
            <div className="flex items-center">
              <img src="/logo-agenda-online.svg" alt="Agenda Online" className="h-8 md:h-10 w-auto opacity-80 hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-stone-400 dark:text-stone-500 text-sm text-center md:text-right">
              © {new Date().getFullYear()} Agenda Online. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
      />
    </div >
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  )
}
