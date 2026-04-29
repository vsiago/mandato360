"use client";

import Link from "next/link"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CalendarDays, MessageCircle, LayoutTemplate, Zap, Users, Star, CheckCircle2, Clock, Camera, XCircle, Check, ShieldCheck } from "lucide-react"
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


      {/* Hero — CRO Optimized */}
      <section className="relative pt-20 pb-0 lg:pt-28 lg:pb-0 overflow-hidden bg-hero select-none transition-colors duration-300">

        {/* Deep ambient background glows */}
        <div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 w-200 h-200 rounded-full blur-[140px] pointer-events-none opacity-40 dark:opacity-100" style={{ background: 'radial-gradient(circle, rgba(216,155,60,0.12) 0%, transparent 60%)' }} />
        <div className="absolute bottom-1/4 right-0 translate-x-1/4 w-150 h-150 rounded-full blur-[120px] pointer-events-none opacity-40 dark:opacity-100" style={{ background: 'radial-gradient(circle, rgba(244,196,106,0.08) 0%, transparent 60%)' }} />
        <div className="absolute top-1/4 right-1/4 w-75 h-75 rounded-full blur-[80px] pointer-events-none opacity-40 dark:opacity-100" style={{ background: 'radial-gradient(circle, rgba(226,167,64,0.05) 0%, transparent 50%)' }} />

        {/* Estrelas */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full mix-blend-screen opacity-30 dark:opacity-70 md:opacity-40 dark:mix-blend-lighten" xmlns="http://www.w3.org/2000/svg">
          <pattern id="stars-1" width="181" height="181" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="0.4" fill="#fff" opacity="0.55"></circle>
            <circle cx="45" cy="30" r="0.6" fill="#fff" opacity="0.75"></circle>
            <circle cx="80" cy="15" r="0.5" fill="#fff" opacity="0.65"></circle>
            <circle cx="140" cy="85" r="0.7" fill="#fde68a" opacity="0.75"></circle>
            <circle cx="65" cy="165" r="0.4" fill="#fff" opacity="0.7"></circle>
          </pattern>
          <pattern id="stars-2" width="347" height="347" patternUnits="userSpaceOnUse">
            <circle cx="25" cy="15" r="0.8" fill="#fef3c7" opacity="0.8"></circle>
            <circle cx="140" cy="50" r="0.5" fill="#fff" opacity="0.65"></circle>
            <circle cx="160" cy="240" r="0.7" fill="#fde68a" opacity="0.75"></circle>
            <circle cx="310" cy="260" r="0.5" fill="#fff" opacity="0.65"></circle>
          </pattern>
          <rect width="100%" height="100%" fill="url(#stars-1)"></rect>
          <rect width="100%" height="100%" fill="url(#stars-2)"></rect>
        </svg>

        <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-2/3 bg-linear-to-t from-amber-500/10 via-amber-200/5 to-transparent dark:from-amber-900/30 dark:via-black/10 dark:to-transparent z-0"></div>

        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">

            {/* Left side — Copy */}
            <div className="text-center lg:text-left pt-4">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium tracking-wide mb-8 border border-amber-500/30 dark:border-[#E2A740]/30 text-amber-700 dark:text-[#E2A740] bg-white/50 dark:bg-transparent backdrop-blur-sm">
                <span>🌟 O fim do "Qual horário você tem disponível?"</span>
              </div>

              <h1 className="text-[40px] leading-tight sm:text-5xl md:text-6xl lg:text-[64px] font-bold tracking-tight md:leading-[1.05] mb-6 text-stone-900 dark:text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
                Pare de marcar horários no WhatsApp.{' '}
                <span className="italic text-gold-smooth pr-2">Deixe seu site</span> vender por você.
              </h1>

              <p className="text-lg md:text-xl md:max-w-145 lg:max-w-162.5 mx-auto lg:mx-0 mb-10 leading-[1.6] font-normal text-stone-600 dark:text-[#A0A0A0]">
                Não é apenas uma agenda. É o seu site profissional. Seus clientes acessam, veem seu trabalho e agendam sozinhos 24 horas por dia. Você só recebe a notificação e atende.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                <Link href="/registro"
                  className="btn-gold-solid inline-flex items-center justify-center px-10 py-4.5 text-[17px] rounded-full cursor-pointer border-0 shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 transition-all hover:-translate-y-1">
                  Criar Meu Site (7 dias grátis)
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 text-[13px] text-stone-500 dark:text-[#888888] font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-500/70" />
                  <span className="whitespace-nowrap">Lembretes no WhatsApp</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-500/70" />
                  <span className="whitespace-nowrap">Site no ar em 3 minutos</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-500/70" />
                  <span className="whitespace-nowrap">Zero taxas por agendamento</span>
                </div>
              </div>

              <div className="mt-14 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
                <div className="flex gap-1 shrink-0">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500 dark:fill-[#F4C46A]" />)}
                </div>
                <p className="text-[14px] sm:text-[15px] leading-relaxed max-w-xs sm:max-w-sm text-center sm:text-left text-stone-500 dark:text-[#999999]">
                  <span className="font-medium text-stone-800 dark:text-[#B0B0B0]">(5.0)</span> "Minha agenda vive cheia e eu parei de perder tempo respondendo WhatsApp de madrugada." <span className="text-stone-400 dark:text-[#666666]">― Cláudia S., Salão Beauty</span>
                </p>
              </div>
            </div>

            {/* Right side — Dashboard Mockup */}
            <div className="relative hidden lg:block mt-2 xl:mt-0 perspective-1000 transform lg:scale-100 xl:scale-105 origin-left transition-transform duration-500">
              <DashboardMockup className="max-w-120 xl:max-w-130" />
              <HeroOutcomeUI />
            </div>

          </div>
        </div>

        {/* Marquee Footer */}
        <div className="relative mt-12 sm:mt-16 w-full border-t border-b border-stone-200/20 dark:border-white/5 bg-black/80 dark:bg-black/90 backdrop-blur-xl overflow-hidden flex items-center h-12 sm:h-14 z-20">
          <div className="flex w-fit animate-marquee hover-pause items-center">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex shrink-0 items-center justify-around gap-8 sm:gap-12 px-4 sm:px-6 text-[12px] sm:text-sm font-medium tracking-wide text-stone-300 dark:text-stone-400">
                <span className="flex items-center gap-2 whitespace-nowrap"><CheckCircle2 className="h-3.5 w-3.5 text-amber-500/80" /> Agendamento 24/7</span>
                <span className="flex items-center gap-2 whitespace-nowrap"><CheckCircle2 className="h-3.5 w-3.5 text-amber-500/80" /> Lembretes no WhatsApp</span>
                <span className="flex items-center gap-2 whitespace-nowrap"><CheckCircle2 className="h-3.5 w-3.5 text-amber-500/80" /> Link na Bio</span>
                <span className="flex items-center gap-2 whitespace-nowrap"><CheckCircle2 className="h-3.5 w-3.5 text-amber-500/80" /> Site Personalizado</span>
                <span className="flex items-center gap-2 whitespace-nowrap"><CheckCircle2 className="h-3.5 w-3.5 text-amber-500/80" /> Zero Taxas</span>
                <span className="flex items-center gap-2 whitespace-nowrap"><CheckCircle2 className="h-3.5 w-3.5 text-amber-500/80" /> Gestão de Clientes</span>
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
            <Star className="h-3 w-3" /> Fica lindo no celular
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
            Seu cliente <span className="text-amber-500 dark:text-amber-400 italic">vai amar</span> agendar.
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed px-4">Uma interface limpa, premium e sem complicação. Ele não precisa de senha, não precisa baixar app. É só clicar e agendar.</p>
        </div>

        <div className="relative mx-auto w-full max-w-90 perspective-1000 mt-16 mb-20 z-20">
          <div className="transform scale-[0.95] origin-top transition-transform hover:scale-100 duration-500">
            <DashboardMockup />
            <div className="absolute -bottom-16 -right-2 w-full max-w-[110%] scale-[0.85] origin-bottom-right z-30 pointer-events-none">
              <HeroOutcomeUI />
            </div>
          </div>
        </div>
      </section>

      {/* Diferenciação */}
      <section className="py-24 bg-white dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
              Por que somos diferentes dos <span className="text-amber-500 dark:text-amber-400 italic">"sistemas de agenda"?</span>
            </h2>
            <p className="text-lg text-stone-500 dark:text-stone-400 max-w-2xl mx-auto">
              Seu trabalho é sobre beleza e estética. Seu agendamento também deveria ser. Chega de enviar links que parecem planilhas de contabilidade para suas clientes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* O Padrão */}
            <div className="bg-stone-50 dark:bg-stone-800/30 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 lg:p-10 opacity-90">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                  <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Sistemas Comuns</h3>
              </div>
              <ul className="space-y-5">
                <li className="flex items-start gap-3"><XCircle className="h-5 w-5 text-red-500/50 shrink-0 mt-0.5" /><span className="text-stone-600 dark:text-stone-400 text-base">Design feio, genérico e confuso para a cliente</span></li>
                <li className="flex items-start gap-3"><XCircle className="h-5 w-5 text-red-500/50 shrink-0 mt-0.5" /><span className="text-stone-600 dark:text-stone-400 text-base">Obriga a cliente a criar e lembrar de senhas</span></li>
                <li className="flex items-start gap-3"><XCircle className="h-5 w-5 text-red-500/50 shrink-0 mt-0.5" /><span className="text-stone-600 dark:text-stone-400 text-base">Apenas exibe horários (não valoriza seu trabalho)</span></li>
                <li className="flex items-start gap-3"><XCircle className="h-5 w-5 text-red-500/50 shrink-0 mt-0.5" /><span className="text-stone-600 dark:text-stone-400 text-base">Você é apenas "mais um negócio" no app deles</span></li>
              </ul>
            </div>

            {/* Agenda Online */}
            <div className="bg-white dark:bg-stone-900 border-2 border-amber-400 dark:border-amber-500/50 rounded-3xl p-8 lg:p-10 shadow-2xl shadow-amber-500/10 relative overflow-hidden transform md:-translate-y-4">
              <div className="absolute top-0 right-0 p-4">
                <span className="bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">A Nova Escolha</span>
              </div>
              <div className="flex items-center gap-4 mb-8">
                <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                  <Check className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Agenda Online</h3>
              </div>
              <ul className="space-y-5">
                <li className="flex items-start gap-3"><Check className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" /><span className="text-stone-800 dark:text-stone-200 text-base font-medium">Um site premium com a SUA própria identidade visual</span></li>
                <li className="flex items-start gap-3"><Check className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" /><span className="text-stone-800 dark:text-stone-200 text-base font-medium">Agendamento rápido em 3 cliques, sem burocracia</span></li>
                <li className="flex items-start gap-3"><Check className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" /><span className="text-stone-800 dark:text-stone-200 text-base font-medium">Portfólio de Antes & Depois para gerar desejo imediato</span></li>
                <li className="flex items-start gap-3"><Check className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" /><span className="text-stone-800 dark:text-stone-200 text-base font-medium">A sua marca é a grande estrela, como deve ser</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-24 bg-stone-50 dark:bg-stone-950 border-t border-stone-100 dark:border-stone-800/50 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
              Pronto para vender em <span className="text-amber-500 dark:text-amber-400 italic">3 passos</span>
            </h2>
            <p className="text-lg text-stone-500 dark:text-stone-400 max-w-2xl mx-auto">
              Simples assim. Você não precisa entender de tecnologia para ter uma presença digital impecável.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative max-w-5xl mx-auto">
            <div className="hidden md:block absolute top-[25%] left-[20%] right-[20%] h-[2px] bg-stone-200 dark:bg-stone-800 z-0"></div>

            {[
              { step: "1", title: "Crie sua Identidade", desc: "Adicione sua logo, escolha suas cores e insira fotos do seu espaço em minutos." },
              { step: "2", title: "Defina seus Serviços", desc: "Diga o que você faz, o valor e o tempo. O sistema organiza sua grade automaticamente." },
              { step: "3", title: "Receba Clientes", desc: "Coloque seu link na bio. O cliente entra, vê seu trabalho e agenda o próprio horário 24/7." }
            ].map((s, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-[2rem] p-8 shadow-sm transition-transform hover:-translate-y-1">
                <div className="h-16 w-16 rounded-full bg-amber-500 text-white flex items-center justify-center text-2xl font-bold mb-6 shadow-lg shadow-amber-500/20" style={{ fontFamily: 'var(--font-playfair)' }}>
                  {s.step}
                </div>
                <h3 className="text-xl font-bold mb-3 text-stone-900 dark:text-stone-100">{s.title}</h3>
                <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features focadas em benefício */}
      <section id="features" className="py-24 lg:py-32 bg-white dark:bg-stone-900/30 border-t border-stone-100 dark:border-stone-800/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
              Tudo para você <span className="text-amber-500 dark:text-amber-400 italic">faturar mais</span>
            </h2>
            <p className="text-lg text-stone-500 dark:text-stone-400 max-w-2xl mx-auto">
              Nossas funcionalidades foram desenhadas para uma única coisa: facilitar sua rotina e aumentar a conversão de visitantes em clientes na sua cadeira.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: LayoutTemplate, title: "Site Premium Personalizado", desc: "Sua marca importa. Tenha uma página que reflete a qualidade do seu serviço e passa confiança imediata." },
              { icon: CalendarDays, title: "Agenda Inteligente 24h", desc: "Seu salão fechou, mas seu site continua agendando. Clientes marcam horários de madrugada, sem te incomodar." },
              { icon: MessageCircle, title: "Lembretes Automáticos", desc: "Adeus faltas! O sistema envia avisos direto no WhatsApp do cliente. Se ele não puder ir, você sabe na hora." },
              { icon: Camera, title: "Portfólio que Vende", desc: "Clientes compram com os olhos. Exiba galerias de trabalhos que geram desejo instantâneo e vendem por você." },
              { icon: Users, title: "Histórico de Clientes", desc: "Saiba exatamente quem é a cliente, quantas vezes ela veio e o que ela costuma fazer. Atendimento VIP." },
              { icon: Zap, title: "Configuração em 3 minutos", desc: "Não precisa de programador. Se você sabe usar o Instagram, vai saber montar seu site no Agenda Online." },
            ].map((f, i) => (
              <div key={i} className="group bg-stone-50/50 dark:bg-stone-800/30 border border-stone-200/60 dark:border-stone-800 rounded-[2rem] p-8 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-200 dark:hover:shadow-none hover:bg-white dark:hover:bg-stone-800">
                <div className="h-14 w-14 rounded-2xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center mb-6 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-stone-900 dark:text-stone-100">{f.title}</h3>
                <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prova / Demonstração */}
      <section id="demo" className="py-24 lg:py-32 bg-stone-50 dark:bg-stone-950 border-y border-stone-100 dark:border-stone-800/50">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-8 border border-amber-500/20 bg-amber-500/10">
            <Star className="h-3.5 w-3.5" /> A Experiência Perfeita
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-8" style={{ fontFamily: 'var(--font-playfair)' }}>
            Como o seu <span className="text-amber-500 dark:text-amber-400 italic">cliente</span> vai ver?
          </h2>
          <p className="text-lg text-stone-500 dark:text-stone-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Em vez de trocar 15 mensagens no WhatsApp apenas para achar um horário vazio, seu cliente entra no seu link, vê seu catálogo profissional e agenda sozinho em 15 segundos. 
          </p>
          
          <div className="bg-white dark:bg-stone-900 p-8 rounded-[2rem] border border-stone-200 dark:border-stone-800 shadow-xl mb-12 max-w-2xl mx-auto text-left transform rotate-1 hover:rotate-0 transition-transform duration-300">
            <div className="flex gap-4 items-start mb-6">
              <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                <MessageCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-stone-400 uppercase tracking-wider font-bold mb-2">Notificação Automática</p>
                <div className="bg-stone-100 dark:bg-stone-800 p-4 rounded-2xl rounded-tl-none inline-block border border-stone-200 dark:border-stone-700">
                  <p className="text-stone-800 dark:text-stone-200 text-sm font-medium leading-relaxed">
                    "Olá! Seu agendamento para <span className="font-bold">Mechas + Hidratação</span> está confirmado para amanhã às <span className="font-bold">15h</span>. Te esperamos!"
                  </p>
                </div>
              </div>
            </div>
            <div className="border-t border-stone-100 dark:border-stone-800 pt-6 text-center">
              <p className="text-stone-500 dark:text-stone-400 text-sm italic">É assim que negócios profissionais se comunicam hoje.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center">
            <Link href="https://jaquegeovanelle.com.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 btn-gold-outline px-8 py-4.5 rounded-full text-base font-semibold transition-all hover:bg-amber-50 dark:hover:bg-amber-900/20"
            >
              <LayoutTemplate className="h-5 w-5 shrink-0" /> Ver um site real em ação
            </Link>
          </div>
        </div>
      </section>

      {/* Oferta */}
      <section id="pricing" className="py-24 lg:py-32 bg-white dark:bg-stone-900/30">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
              Um sistema que <span className="text-amber-500 dark:text-amber-400 italic">se paga sozinho</span>
            </h2>
            <p className="text-lg text-stone-500 dark:text-stone-400 max-w-2xl mx-auto mb-8">
              Evite apenas 1 falta de cliente por mês com nossos lembretes automáticos e o sistema já pagou a si mesmo.
            </p>
            <div className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-4 py-2 rounded-full text-sm font-bold animate-pulse">
              <Clock className="h-4 w-4" /> Oferta especial de lançamento: Teste 7 dias grátis
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            {/* Profissional ⭐ */}
            <div className="relative bg-white dark:bg-stone-900 border-2 border-amber-400/50 dark:border-amber-500/40 rounded-[2.5rem] p-8 lg:p-10 overflow-hidden shadow-2xl shadow-amber-500/10 flex flex-col transform md:-translate-y-4">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.08)_0%,transparent_70%)]" />
              <div className="relative z-10 grow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-50" style={{ fontFamily: 'var(--font-playfair)' }}>Profissional</h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 text-white px-3 py-1 text-xs font-bold uppercase tracking-widest shadow-lg shadow-amber-500/20">
                    <Star className="h-3 w-3 fill-white" /> Popular
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-bold text-stone-900 dark:text-stone-50" style={{ fontFamily: 'var(--font-playfair)' }}>R$79</span>
                  <span className="text-sm text-stone-400 dark:text-stone-500">/mês</span>
                </div>
                <ul className="space-y-4 mb-10">
                  {[
                    "Site premium com a sua marca",
                    "Agendamento automático 24 horas",
                    "Lembretes anti-falta via WhatsApp",
                    "Catálogo de serviços com preços",
                    "Gestão de múltiplos profissionais",
                    "Link exclusivo para bio do Instagram",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-stone-700 dark:text-stone-300 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative z-10 mt-auto pt-6 border-t border-stone-100 dark:border-stone-800">
                <button 
                  onClick={() => handleCheckout("profissional")}
                  className="block w-full text-center btn-gold-solid py-4 rounded-2xl text-base font-bold shadow-xl shadow-amber-500/20 cursor-pointer border-0 transition-transform hover:scale-[1.02]"
                >
                  Começar Teste Grátis
                </button>
                <p className="text-center text-xs text-stone-400 dark:text-stone-500 mt-4">Cancelamento fácil a qualquer momento.</p>
              </div>
            </div>

            {/* Completo */}
            <div className="relative bg-stone-50 dark:bg-stone-800/30 border border-stone-200 dark:border-stone-700 rounded-[2.5rem] p-8 lg:p-10 flex flex-col opacity-95">
              <div className="relative z-10 grow">
                <h3 className="text-2xl font-bold mb-4 text-stone-900 dark:text-stone-50" style={{ fontFamily: 'var(--font-playfair)' }}>Completo</h3>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-bold text-stone-900 dark:text-stone-50" style={{ fontFamily: 'var(--font-playfair)' }}>R$119</span>
                  <span className="text-sm text-stone-400 dark:text-stone-500">/mês</span>
                </div>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-stone-400 dark:text-stone-500 shrink-0 mt-0.5" />
                    <span className="text-sm font-bold text-stone-900 dark:text-stone-100">Tudo do Profissional, e mais:</span>
                  </li>
                  {[
                    "Galeria de portfólio (Antes & Depois)",
                    "Personalização avançada de cores do site",
                    "Relatórios detalhados de faturamento",
                    "Destaque do salão nas buscas",
                    "Suporte VIP prioritário",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-stone-400 dark:text-stone-600 shrink-0 mt-0.5" />
                      <span className="text-sm text-stone-600 dark:text-stone-400">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative z-10 mt-auto pt-6 border-t border-stone-200 dark:border-stone-700">
                <button 
                  onClick={() => handleCheckout("premium")}
                  className="block w-full text-center bg-stone-800 hover:bg-stone-900 dark:bg-white dark:hover:bg-stone-100 text-white dark:text-stone-900 py-4 rounded-2xl text-base font-bold transition-transform hover:scale-[1.02] cursor-pointer border-0"
                >
                  Assinar Plano Completo
                </button>
              </div>
            </div>
          </div>
          
          <p className="text-center text-xs text-stone-400 dark:text-stone-500 mt-12 max-w-lg mx-auto">
            🔒 Condição especial válida apenas para os próximos 50 profissionais cadastrados. Garantia incondicional de 7 dias.
          </p>
        </div>
      </section>

      {/* FAQ / AEO */}
      <FAQAEO />

      {/* CTA Final */}
      <section className="py-24 lg:py-32 bg-amber-500 dark:bg-amber-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,white_0%,transparent_100%)] mix-blend-overlay"></div>
        <div className="mx-auto max-w-4xl px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
            Sua agenda não pode depender só de você.
          </h2>
          <p className="text-xl text-amber-50 mb-10 max-w-2xl mx-auto">
            Automatize seus agendamentos, passe uma imagem premium para o mercado e foque no que realmente importa: atender bem seus clientes.
          </p>
          <Link href="/registro" className="inline-flex items-center justify-center bg-white text-amber-700 hover:bg-stone-50 px-10 py-5 rounded-full text-lg font-bold shadow-2xl transition-transform hover:scale-105 border-0">
            Quero Criar Meu Site Agora
          </Link>
          <p className="mt-6 text-sm text-amber-100 font-medium">Você tem 7 dias grátis para testar. Risco zero.</p>
        </div>
      </section>

      <footer className="py-12 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
            <div className="flex items-center">
              <img src="/logo-agenda-online.svg" alt="Agenda Online" className="h-8 md:h-10 w-auto opacity-80 hover:opacity-100 transition-opacity filter dark:invert" />
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
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  )
}
