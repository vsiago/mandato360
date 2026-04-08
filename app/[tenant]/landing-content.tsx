"use client"

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Building2,
  Users,
  Stethoscope,
  GraduationCap,
  HardHat,
  HeartHandshake,
  ArrowRight,
  Star,
  MapPin,
  ChevronDown,
  Menu,
  X,
  User,
  Heart,
  Phone,
  MoveRight,
  ArrowLeftRight,
  CheckCircle2,
  LifeBuoy,
  FileText,
  Send,
  Mail
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { submitSupporterAction, submitRequestAction } from "@/lib/actions/forms"
import { toast } from "sonner"

// MOCK DATA for sections not in DB yet
const initialAchievements = [
  { icon: HardHat, title: 'Obras', desc: 'Pavimentação e nova infraestrutura nos bairros.' },
  { icon: Stethoscope, title: 'Saúde', desc: 'Reforma de postos e ampliação do atendimento.' },
  { icon: GraduationCap, title: 'Educação', desc: 'Melhoria nas escolas e merenda de qualidade.' },
  { icon: HeartHandshake, title: 'Social', desc: 'Apoio contínuo às famílias em vulnerabilidade.' },
]

const beforeAfterItems = [
  {
    area: 'Infraestrutura',
    before: { image: '/site/antes.jpg', title: 'Antiga Realidade' },
    after: { image: '/site/depois.jpg', title: 'Transformação em Curso' },
  },
]

const testimonials = [
  {
    name: 'Maria da Conceição',
    text: 'A mudança no nosso bairro é visível. O trabalho sério faz toda a diferença.',
  },
  {
    name: 'João Pedro',
    text: 'O atendimento na saúde melhorou muito. Sinto que agora temos voz.',
  },
]

// HELPER: Format date
function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR').format(date)
}

export default function LandingContent({ tenant, initialData }: { tenant: any, initialData: any }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [supportOpen, setSupportOpen] = useState(false)
  const [requestOpen, setRequestOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // MODEL DATA
  const modelConfig = {
    nome: "Dr. Adriano Lima",
    tagline: "Compromisso Real com Itaguaí",
    foto: "/vereador-modelo.png",
    biografia: "Médico e gestor público, Dr. Adriano Lima dedica-se a transformar a política de Itaguaí através da inovação e transparência total.",
    primaryColor: "#0F2B5B", // Navy
    secondaryColor: "#0D9F6E", // Emerald
    email: "contato@adrianolima.com.br",
    whatsapp: "(21) 99999-8888",
    endereco: "Câmara Municipal, Gabinete 12"
  }

  const isModel = !tenant || tenant.slug === "vereador"
  const primaryColor = isModel ? modelConfig.primaryColor : (tenant?.primaryColor || "#0F2B5B")
  const secondaryColor = isModel ? modelConfig.secondaryColor : (tenant?.secondaryColor || "#0D9F6E")
  const displayNome = isModel ? modelConfig.nome : (tenant?.name || "Vereador")
  const displayBio = isModel ? modelConfig.biografia : (tenant?.biografia || "Trabalhando por você.")
  const displayFoto = isModel ? "/vereador-modelo.png" : (tenant?.fotoPerfilUrl || "/vereador-modelo.png")
  
  const { projetosLei = [], leisAprovadas = [], publicacoes = [], indicacoes = [] } = initialData || {}

  // Sticky Header Effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>, type: 'supporter' | 'request') {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())
    
    const action = type === 'supporter' ? submitSupporterAction : submitRequestAction
    const result = await action(data)
    
    setLoading(false)
    if (result.success) {
      setSubmitted(true)
      toast.success(type === 'supporter' ? "Apoio registrado!" : "Solicitação enviada!")
    } else {
      toast.error("Erro ao processar.")
    }
  }

  return (
    <div 
        className="min-h-screen bg-gray-50 font-sans selection:bg-primary selection:text-white overflow-x-hidden"
        style={{
            // @ts-ignore
            "--primary": primaryColor,
            "--secondary": secondaryColor,
        }}
    >

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 inset-x-0 z-50 h-16 transition-all duration-300 border-b ${isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-gray-100 py-2'
          : 'bg-transparent border-transparent py-4'
          }`}
      >
        <div className="mx-auto max-w-7xl px-4 md:px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-black text-lg transition-all shadow-lg ${isScrolled ? 'bg-primary text-white' : 'bg-white text-primary'}`}>
              {displayNome.charAt(0)}
            </div>
            <div className="flex flex-col justify-center">
              <span className={`text-base font-bold leading-tight ${isScrolled ? 'text-gray-900' : 'text-white drop-shadow-sm'}`}>
                {displayNome}
              </span>
              <span className={`text-[10px] font-black uppercase tracking-widest leading-tight ${isScrolled ? 'text-gray-400' : 'text-white/70 drop-shadow-sm'}`}>
                Mandato Participativo
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            {['realizacoes', 'transformacao', 'depoimentos', 'contato'].map((id) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`text-sm font-bold uppercase tracking-tight transition-colors hover:text-secondary ${isScrolled ? 'text-gray-600' : 'text-white/80'}`}
              >
                {id === 'realizacoes' ? 'Realizações' : id === 'transformacao' ? 'Transformação' : id === 'depoimentos' ? 'Depoimentos' : 'Contato'}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3 md:gap-4">
            <Button
              onClick={() => setSupportOpen(true)}
              className={`rounded-full px-6 font-bold shadow-md transition-all hidden sm:flex h-10 ${isScrolled ? 'bg-primary text-white hover:bg-primary/90' : 'bg-secondary text-white hover:bg-secondary/90'}`}
            >
              Quero Apoiar
            </Button>
            <button
              className={`p-2 rounded-full transition-colors lg:hidden ${isScrolled ? 'text-gray-900 hover:bg-gray-100' : 'text-white hover:bg-white/20'}`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-100 shadow-xl flex flex-col p-4 gap-2 animate-in slide-in-from-top-2">
            {['realizacoes', 'transformacao', 'depoimentos', 'contato'].map((id) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-left py-3 px-4 rounded-xl text-gray-700 font-bold hover:bg-gray-50 hover:text-primary transition-colors capitalize text-sm"
              >
                {id === 'realizacoes' ? 'Realizações' : id === 'transformacao' ? 'Transformação' : id === 'depoimentos' ? 'Depoimentos' : 'Contato'}
              </button>
            ))}
            <Button
              onClick={() => { setSupportOpen(true); setMenuOpen(false) }}
              className="mt-2 bg-primary text-white font-bold rounded-xl h-12"
            >
              Quero Apoiar o Mandato
            </Button>
          </div>
        )}
      </header>

      {/* ── HERO SECTION ────────────────────────── */}
      <section className="relative min-h-[100dvh] flex flex-col justify-center bg-primary overflow-hidden pt-16">

        {/* Background Layers */}
        <div className="absolute inset-0 bg-linear-to-br from-primary via-primary/90 to-primary/80 z-0" />
        {/* Abstract Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[url('/site/hero.png')] bg-cover bg-center mix-blend-overlay blur-sm z-0 pointer-events-none" />

        {/* Candidate Image */}
        <div className="absolute inset-0 z-0 flex justify-end pointer-events-none overflow-hidden">
          {/* Gradient mask on left side */}
          <div className="absolute inset-0 bg-linear-to-r from-primary via-primary/70 to-transparent w-[100%] md:w-[70%] z-10" />
          <div className="absolute inset-y-0 right-[-15%] sm:right-0 w-[140%] sm:w-full md:w-[60%] lg:w-[50%] flex items-end opacity-100">
            <Image
              src={displayFoto}
              alt={displayNome}
              fill
              priority
              className="object-cover object-[55%_top] md:object-top-right drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 md:px-8 py-12 flex flex-col">
          <div className="max-w-2xl flex flex-col items-start gap-6 md:gap-8">

            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/20 shadow-sm">
              <MapPin className="h-3.5 w-3.5 text-white" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">
                Itaguaí • Mandato Transparente
              </span>
            </div>

            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter drop-shadow-md">
              {displayNome.split(' ')[0]}<br />
              <span className="text-secondary">{displayNome.split(' ').slice(1).join(' ')}</span>
            </h1>

            <p className="text-lg md:text-xl text-white/80 font-medium leading-relaxed max-w-md drop-shadow-sm">
              {displayBio}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-2">
              <Button
                onClick={() => setRequestOpen(true)}
                className="bg-secondary text-white hover:bg-secondary/90 hover:scale-105 active:scale-95 transition-all font-black text-lg px-8 py-8 rounded-2xl shadow-xl w-full sm:w-auto"
              >
                Solicitar Demanda
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                onClick={() => scrollTo('realizacoes')}
                variant="outline"
                className="border-2 border-white/20 text-white bg-white/5 hover:bg-white/10 font-bold text-lg px-8 py-8 rounded-2xl w-full sm:w-auto transition-colors"
              >
                Ver Projetos
              </Button>
            </div>
          </div>
        </div>

        {/* Animated Scroll Indicator */}
        <div className="absolute bottom-8 inset-x-0 flex justify-center z-20 pointer-events-none">
          <div className="flex flex-col items-center gap-2 text-white/40 animate-bounce">
            <span className="text-[10px] font-black uppercase tracking-widest">Descer</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 1: REALIZAÇÕES ─────────────────────────────── */}
      <section id="realizacoes" className="py-24 bg-white relative">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <span className="text-secondary font-black uppercase tracking-widest text-xs mb-4 block">Resultado do Trabalho</span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                Realizações por Itaguaí
              </h2>
            </div>
            <div className="h-1.5 w-24 bg-primary rounded-full hidden md:block" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(projetosLei.length > 0 ? projetosLei.slice(0, 4) : initialAchievements).map((item: any, i: number) => (
              <div key={i} className="group p-8 rounded-[2rem] bg-gray-50 hover:bg-white hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 border border-transparent hover:border-primary/10 flex flex-col items-start gap-6">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                  {item.icon ? <item.icon className="h-7 w-7" /> : <FileText className="h-7 w-7" />}
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-2 leading-tight">
                    {item.titulo || item.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed text-sm line-clamp-3">
                    {item.descricao || item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 2: ANTES / DEPOIS ───────────────────────────── */}
      <section id="transformacao" className="py-24 bg-gray-50 border-y border-gray-100 overflow-hidden">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center gap-4">
            <span className="text-secondary font-black uppercase tracking-widest text-xs">Nosso Compromisso</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                Transformação em Realidade
            </h2>
          </div>

          <div className="flex flex-col gap-16">
            {beforeAfterItems.map((item, i) => (
              <div key={i} className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-secondary" />
                  <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">{item.area}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Before */}
                  <div className="relative rounded-[2.5rem] overflow-hidden aspect-video shadow-md group">
                    <Image src={item.before.image} alt="Antes" fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
                      <span className="bg-red-500 text-white text-[10px] font-black uppercase w-fit px-4 py-1.5 rounded-full mb-3">Como era</span>
                      <p className="text-white font-black text-xl drop-shadow-md">{item.before.title}</p>
                    </div>
                  </div>

                  {/* After */}
                  <div className="relative rounded-[2.5rem] overflow-hidden aspect-video shadow-2xl group border-4 border-white">
                    <Image src={item.after.image} alt="Depois" fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-linear-to-t from-secondary/80 via-transparent to-transparent flex flex-col justify-end p-8">
                      <span className="bg-green-500 text-white text-[10px] font-black uppercase w-fit px-4 py-1.5 rounded-full mb-3 shadow-lg">Como está ficando</span>
                      <p className="text-white font-black text-xl drop-shadow-md">{item.after.title}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 3: DEPOIMENTOS ───────────────────────────────── */}
      <section id="depoimentos" className="py-24 bg-white relative overflow-hidden">
        {/* Decorativo BG */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50 pointer-events-none" />

        <div className="mx-auto max-w-7xl px-5 md:px-8 relative z-10">
          <div className="mb-16">
            <span className="text-secondary font-black uppercase tracking-widest text-xs mb-4 block">Voz do Povo</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
              O que dizem sobre<br />nosso trabalho
            </h2>
          </div>

          <div className="flex overflow-x-auto gap-6 pb-12 snap-x snap-mandatory hide-scrollbars -mx-5 px-5 md:mx-0 md:px-0">
            {testimonials.map((t, i) => (
              <div key={i} className="snap-center sm:snap-start shrink-0 w-[85vw] sm:w-[400px] bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm hover:shadow-2xl hover:border-primary/5 transition-all duration-500 flex flex-col gap-8">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-secondary fill-secondary" />
                  ))}
                </div>
                <blockquote className="text-gray-600 text-lg leading-relaxed flex-1 italic font-medium">
                  "{t.text}"
                </blockquote>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="h-12 w-12 rounded-2xl overflow-hidden relative bg-gray-100 shrink-0 border border-gray-100">
                    <User className="absolute inset-0 m-auto text-gray-300 h-6 w-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-gray-900">{t.name}</span>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Cidadão de Itaguaí</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 4: CTA FINAL ─────────────────────────────────── */}
      <section id="contato" className="relative py-32 overflow-hidden flex flex-col items-center justify-center text-center px-5 isolate">
        <div className="absolute inset-0 bg-primary z-0" />
        <div className="absolute inset-0 opacity-20 bg-[url('/site/depois.jpg')] bg-cover bg-center mix-blend-overlay z-0 pointer-events-none blur-sm" />

        <div className="relative z-10 max-w-3xl flex flex-col items-center gap-8">
          <div className="h-20 w-20 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-2xl">
            <Heart className="h-10 w-10 text-white fill-white/20" />
          </div>

          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter text-balance leading-tight drop-shadow-lg">
            Participe do nosso<br />mandato participativo
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full justify-center">
            <Button
                onClick={() => setSupportOpen(true)}
                className="bg-secondary text-white hover:bg-secondary/90 font-black text-xl px-12 py-8 rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all"
            >
                Quero Apoiar
            </Button>
            <Button
                onClick={() => setRequestOpen(true)}
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 font-black text-xl px-12 py-8 rounded-2xl shadow-2xl transition-all"
            >
                Enviar Demanda
            </Button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer className="bg-gray-900 py-20 text-white/50 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/5 pb-20 mb-12">
            <div className="md:col-span-2 flex flex-col gap-6 items-start">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white text-xl font-black shadow-lg">
                  {displayNome.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-white leading-tight tracking-tighter uppercase">{displayNome}</span>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Mandato Dr. Adriano Lima</span>
                </div>
              </div>
              <p className="max-w-sm text-sm leading-relaxed">
                Trabalhando com ética, transparência e tecnologia para transformar Itaguaí em uma referência de gestão pública para o povo.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <span className="text-white font-black tracking-widest text-xs uppercase">Mapa do Site</span>
              <ul className="flex flex-col gap-4">
                {['Realizações', 'Transformação', 'Depoimentos'].map((link, i) => (
                  <li key={i}>
                    <button
                      onClick={() => scrollTo(link.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))}
                      className="text-sm font-bold hover:text-secondary transition-colors"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-6">
              <span className="text-white font-black tracking-widest text-xs uppercase">Canais Diretos</span>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 text-sm font-bold">
                    <Phone className="h-4 w-4 text-secondary" />
                    <span>(21) 99999-8888</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-bold">
                    <Mail className="h-4 w-4 text-secondary" />
                    <span>contato@mandato.com.br</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-bold">
                    <MapPin className="h-4 w-4 text-secondary" />
                    <span>Itaguaí, Rio de Janeiro</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-bold uppercase tracking-widest">
            <span>© 2026 Mandato Participativo {displayNome}</span>
            <Link href="/login" className="hover:text-white transition-colors flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5">
              Portal do Assessor <MoveRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </footer>

      {/* ── MODAIS ────────────────────────────────────────── */}
      
      {/* APOIO */}
      <Dialog open={supportOpen} onOpenChange={(v) => { setSupportOpen(v); if (!v) setSubmitted(false) }}>
        <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden rounded-[2.5rem] border-0 shadow-2xl gap-0">
          {!submitted ? (
            <>
              <div className="bg-primary px-8 pt-10 pb-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Star className="w-32 h-32" />
                </div>
                <div className="relative z-10 flex flex-col gap-2">
                  <DialogTitle className="text-3xl font-black leading-tight tracking-tighter uppercase">
                    Quero apoiar o<br />mandato!
                  </DialogTitle>
                  <DialogDescription className="text-white/60 text-sm font-bold">
                    Cadastre-se para participar das ações.
                  </DialogDescription>
                </div>
              </div>

              <form onSubmit={(e) => handleFormSubmit(e, 'supporter')} className="px-8 py-10 flex flex-col gap-5 bg-white">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="nome" className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nome completo</Label>
                  <Input id="nome" name="nome" placeholder="Ex: Carlos Silva" className="h-14 bg-gray-50 border-transparent rounded-2xl focus-visible:ring-primary focus-visible:bg-white font-bold" required />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="telefone" className="text-[10px] font-black text-gray-400 uppercase tracking-widest">WhatsApp</Label>
                  <Input id="telefone" name="telefone" placeholder="(21) 99999-9999" className="h-14 bg-gray-50 border-transparent rounded-2xl focus-visible:ring-primary focus-visible:bg-white font-bold" required />
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="email" className="text-[10px] font-black text-gray-400 uppercase tracking-widest">E-mail</Label>
                    <Input id="email" name="email" type="email" placeholder="seu@email.com" className="h-14 bg-gray-50 border-transparent rounded-2xl focus-visible:ring-primary focus-visible:bg-white font-bold" required />
                </div>

                <Button type="submit" disabled={loading} className="w-full mt-4 h-16 bg-primary text-white hover:bg-primary/90 font-black text-lg rounded-2xl transition-all shadow-xl uppercase tracking-widest">
                  {loading ? <LifeBuoy className="animate-spin h-6 w-6" /> : 'Confirmar Apoio'}
                </Button>
              </form>
            </>
          ) : (
            <div className="p-12 flex flex-col items-center justify-center text-center bg-white">
              <div className="h-24 w-24 bg-green-50 rounded-full flex items-center justify-center mb-6 text-green-500 shadow-inner">
                <CheckCircle2 className="h-12 w-12" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tighter">Muito Obrigado!</h3>
              <p className="text-gray-500 font-medium leading-relaxed mb-10">
                Seu apoio foi registrado. Juntos somos mais fortes por Itaguaí.
              </p>
              <Button onClick={() => setSupportOpen(false)} className="w-full h-14 bg-gray-100 text-gray-900 hover:bg-gray-200 font-black rounded-2xl uppercase tracking-widest">
                Fechar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* DEMANDA */}
      <Dialog open={requestOpen} onOpenChange={(v) => { setRequestOpen(v); if (!v) setSubmitted(false) }}>
        <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden rounded-[2.5rem] border-0 shadow-2xl gap-0">
          {!submitted ? (
            <>
              <div className="bg-secondary px-8 pt-10 pb-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <HeartHandshake className="w-32 h-32" />
                </div>
                <div className="relative z-10 flex flex-col gap-2">
                  <DialogTitle className="text-3xl font-black leading-tight tracking-tighter uppercase">
                    Enviar Demanda
                  </DialogTitle>
                  <DialogDescription className="text-white/60 text-sm font-bold">
                    Relate um problema no seu bairro.
                  </DialogDescription>
                </div>
              </div>

              <form onSubmit={(e) => handleFormSubmit(e, 'request')} className="px-8 py-10 flex flex-col gap-5 bg-white">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="nome" className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Seu Nome</Label>
                  <Input id="nome" name="nome" placeholder="Ex: Carlos Silva" className="h-12 bg-gray-50 border-transparent rounded-xl focus-visible:ring-secondary font-bold" required />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="telefone" className="text-[10px] font-black text-gray-400 uppercase tracking-widest">WhatsApp</Label>
                  <Input id="telefone" name="telefone" placeholder="(21) 99999-9999" className="h-12 bg-gray-50 border-transparent rounded-xl focus-visible:ring-secondary font-bold" required />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="descricao" className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Descrição</Label>
                  <Textarea id="descricao" name="descricao" placeholder="O que está acontecendo?" className="bg-gray-50 border-transparent rounded-xl focus-visible:ring-secondary min-h-[100px] font-bold" required />
                </div>

                <Button type="submit" disabled={loading} className="w-full mt-4 h-16 bg-secondary text-white hover:bg-secondary/90 font-black text-lg rounded-2xl shadow-xl uppercase tracking-widest">
                  {loading ? <LifeBuoy className="animate-spin h-6 w-6" /> : 'Enviar Protocolo'}
                </Button>
              </form>
            </>
          ) : (
            <div className="p-12 flex flex-col items-center justify-center text-center bg-white">
              <div className="h-24 w-24 bg-green-50 rounded-full flex items-center justify-center mb-6 text-green-500 shadow-inner">
                <CheckCircle2 className="h-12 w-12" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tighter">Recebido!</h3>
              <p className="text-gray-500 font-medium leading-relaxed mb-10">
                Sua demanda foi enviada ao gabinete digital.
              </p>
              <Button onClick={() => setRequestOpen(false)} className="w-full h-14 bg-gray-100 text-gray-900 hover:bg-gray-200 font-black rounded-2xl uppercase tracking-widest">
                Fechar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  )
}
