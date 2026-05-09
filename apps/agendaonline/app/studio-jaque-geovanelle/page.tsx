"use client"

import Link from "next/link"
import Image from "next/image"
import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useAnimationFrame, useMotionValue, useTransform, wrap } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
    Activity,
    Award,
    CheckCircle2,
    MapPin,
    Menu,
    Phone,
    ShieldCheck,
    Star,
    ArrowRight,
    MessageCircle,
    Sparkles,
    Send,
    X,
    ChevronLeft,
    ChevronRight,
    Clock,
    Instagram,
    User
} from "lucide-react"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose
} from "@/components/ui/sheet"
import { SchedulingSection } from "@/components/scheduling-section"
import { ServiceLogo } from "@/components/service-logo"

const DATA = {
    niche: 'Salão de Beleza',
    name: 'Jaque Geovanelle',
    surname: 'Micropigmentação & Brow Lamination',
    title: 'Studio Jaque Geovanelle | Brow Lamination & Micropigmentação',
    description: 'Especialista em Brow Lamination, Micropigmentação de sobrancelhas e labial. Realce sua beleza natural com técnicas exclusivas no Centro de Itaguaí.',
    colors: {
        primary: '#8c6239', // Bronze Gold Sofisticado
        hover: '#6d4a2a',    // Bronze Profundo
        bgLight: 'bg-[#8c6239]/5',
    },
    contact: {
        phone: '(21) 96655-9255',
        whatsapp: '5521966559255',
        address: 'R. Aníbal Alves, 106 - Centro, Itaguaí - RJ, 23810-390',
        addressDetails: 'Rua atrás do shopping (galeria), vira à esquerda. Na rua entre a sorveteria Oggi e a igreja Batista.',
        mapEmbedUrl: ''
    },
    categories: [
        { id: 'todos', label: 'Todos' },
        { id: 'sobrancelhas', label: 'Sobrancelhas' },
        { id: 'labios', label: 'Lábios' },
        { id: 'pele', label: 'Pele' }
    ],
    services: [
        { id: 'design-personalizado', categoryId: 'sobrancelhas', name: "Design Personalizado", description: "Técnica exclusiva para desenhar a sobrancelha ideal para o seu formato de rosto.", image: "https://negociosdebeleza.beautyfair.com.br/wp-content/uploads/2024/08/design-de-sobrancelhas-1.webp" },
        { id: 'design-com-tintura', categoryId: 'sobrancelhas', name: "Design com Tintura", description: "Design perfeito alinhado com coloração para destacar e preencher fios claros ou finos.", image: "https://negociosdebeleza.beautyfair.com.br/wp-content/uploads/2024/07/coloracao-para-sobrancelhas-capa-1.webp" },
        { id: 'design-masculino', categoryId: 'sobrancelhas', name: "Design Masculino", description: "Limpeza e alinhamento natural dos fios, mantendo a expressão e masculinidade do olhar.", image: "https://vocemerecetudo.com/wp-content/uploads/2025/07/4-8-1.webp" },
        { id: 'brow-lamination', categoryId: 'sobrancelhas', name: "Brow Lamination", description: "Alinhamento dos fios, proporcionando volume, preenchimento e aspecto natural.", image: "https://www.maybelline.com.br/-/media/project/loreal/brand-sites/mny/americas/br/artigos/2024/olhos/sobrancelha/brow-lamination/brow-lamination.jpg?rev=9503a04edfeb40d9846f1f1812a530b8&cx=0.45&cy=0.61&cw=650&ch=650&hash=1818B76889E7DC36CB7F2CA1A8DDC5BE" },
        { id: 'micropigmentacao-fio-a-fio', categoryId: 'sobrancelhas', name: "Micropigmentação Fio a Fio", description: "Fios perfeitamente desenhados com precisão para corrigir falhas e garantir naturalidade.", image: "/sombrancelha.png" },
        { id: 'micropigmentacao-labial', categoryId: 'labios', name: "Micropigmentação Labial", description: "Revitalização profunda. Traz uma cor saudável, contorno definido e efeito de lábios hidratados.", image: "https://static.wixstatic.com/media/0a37dc_c1018d0587fe466e8d0126e10609a8cd~mv2.png/v1/fill/w_568,h_370,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/0a37dc_c1018d0587fe466e8d0126e10609a8cd~mv2.png" },
        { id: 'hidragloss', categoryId: 'labios', name: "Hidragloss", description: "Tratamento de super hidratação e rejuvenescimento labial que devolve o brilho e maciez.", image: "https://static.wixstatic.com/media/8b1c0b_54438c4e1beb4fe2bf73f61d92c2c7b5~mv2.jpg/v1/fill/w_568,h_520,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/8b1c0b_54438c4e1beb4fe2bf73f61d92c2c7b5~mv2.jpg" },
        { id: 'dermaplaning', categoryId: 'pele', name: "Dermaplaning", description: "Tratamentos faciais para revitalização, limpeza profunda e hidratação, devolvendo o viço e a saúde do seu rosto.", image: "/pele-rosto.png" }
    ],
    faq: [
        { question: "O que é Brow Lamination?", answer: "A Brow Lamination é uma técnica não invasiva que alinha e fixa os fios naturais das sobrancelhas, criando um design mais volumoso, encorpado e moderno." },
        { question: "A micropigmentação dói?", answer: "O procedimento é altamente tolerável. Utilizamos anestésicos tópicos de qualidade premium para garantir o máximo de conforto durante todo o processo." },
        { question: "Quanto tempo dura a micropigmentação?", answer: "A durabilidade varia de acordo com o tipo de pele e os cuidados pós-procedimento, mas em média, a micropigmentação (sobrancelhas ou lábios) dura de 8 meses a 2 anos." },
        { question: "Onde o studio está localizado?", answer: "Estamos na Casa Beauty, Rua Aníbal Alves, 106, Centro, Itaguaí Rua atrás do shopping (galeria), vira à esquerda. Na rua entre a sorveteria Oggi e a igreja Batista." }
    ] as any,
    localContext: {
        neighborhood: 'Centro de Itaguaí',
        landmarks: 'Edifício Manancial - Casa Beauty'
    },
    founder: {
        name: 'Jaque Geovanelle',
        bio: 'Empreendedora da beleza, apaixonada por transformar vidas através da autoestima. Minha missão é entregar naturalidade e excelência em cada detalhe, realçando a beleza única de cada cliente na Casa Beauty.',
        role: 'Especialista em Micropigmentação & Brow Lamination'
    },
    trustBadges: ['Avaliação 5.0 (152)', 'Empresa de Empreendedoras'],
    beforeAfter: [
        { title: "Micropigmentação Fio a Fio", before: "/jaque-studio-antes-e-depois/Brow Antes-100.jpg", after: "/jaque-studio-antes-e-depois/Brow Depois-100.jpg" },
        { title: "Brow Lamination", before: "/jaque-studio-antes-e-depois/Brow Lamination Antes-100.jpg", after: "/jaque-studio-antes-e-depois/Brow Lamination Depois-100.jpg" },
        { title: "Brow Lamination", before: "/jaque-studio-antes-e-depois/Brow Lamination Antes_1-100.jpg", after: "/jaque-studio-antes-e-depois/Brow Lamination Depois_1-100.jpg" },
        { title: "Design Masculino", before: "/jaque-studio-antes-e-depois/Design Masculino Antes-100.jpg", after: "/jaque-studio-antes-e-depois/Design Masculino Depois-100.jpg" },
        { title: "Design Personalizado", before: "/jaque-studio-antes-e-depois/Design Personalizado Antes-100.jpg", after: "/jaque-studio-antes-e-depois/Design Personalizado Depois-100.jpg" },
        { title: "Hidragloss", before: "/jaque-studio-antes-e-depois/Hidragloss Antes-100.jpg", after: "/jaque-studio-antes-e-depois/Hidragloss Depois-100.jpg" },
        { title: "Micropigmentação Labial", before: "/jaque-studio-antes-e-depois/Micro Labial Antes-100.jpg", after: "/jaque-studio-antes-e-depois/Micro Labial Depois-100.jpg" },
    ]
}

// Image Comparison Slider Component
const ImageComparisonSlider = ({ before, after }: { before: string; after: string }) => {
    const [sliderPos, setSliderPos] = useState(50)
    const containerRef = useRef<HTMLDivElement>(null)
    const handleRef = useRef<HTMLDivElement>(null)
    const isDragging = useRef(false)

    const updatePosition = (clientX: number) => {
        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        const x = clientX - rect.left
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
        setSliderPos(percentage)
    }

    useEffect(() => {
        const handle = handleRef.current
        if (!handle) return

        const onPointerDown = (e: PointerEvent) => {
            e.stopPropagation()
            e.preventDefault()
            isDragging.current = true
            handle.setPointerCapture(e.pointerId)
            updatePosition(e.clientX)
        }

        const onPointerMove = (e: PointerEvent) => {
            if (!isDragging.current) return
            e.preventDefault()
            updatePosition(e.clientX)
        }

        const onPointerUp = (e: PointerEvent) => {
            isDragging.current = false
            handle.releasePointerCapture(e.pointerId)
        }

        handle.addEventListener('pointerdown', onPointerDown)
        handle.addEventListener('pointermove', onPointerMove)
        handle.addEventListener('pointerup', onPointerUp)
        handle.addEventListener('pointercancel', onPointerUp)

        return () => {
            handle.removeEventListener('pointerdown', onPointerDown)
            handle.removeEventListener('pointermove', onPointerMove)
            handle.removeEventListener('pointerup', onPointerUp)
            handle.removeEventListener('pointercancel', onPointerUp)
        }
    }, [])

    return (
        <div
            ref={containerRef}
            className="relative aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 select-none"
        >
            {/* After image (full background) */}
            {after && <img src={after} alt="Depois" className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none" draggable={false} />}

            {/* Before image (clipped) */}
            <div className="absolute inset-0 pointer-events-none" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
                {before && <img src={before} alt="Antes" className="absolute inset-0 w-full h-full object-cover select-none" draggable={false} />}
            </div>

            {/* Divider + Handle — uses setPointerCapture for reliable tracking */}
            <div
                ref={handleRef}
                className="absolute top-0 bottom-0 z-20 cursor-ew-resize touch-none"
                style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)', width: '44px' }}
            >
                <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-white shadow-[0_0_8px_rgba(0,0,0,0.3)]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border border-slate-200">
                    <div className="flex items-center gap-0.5">
                        <ChevronLeft className="h-3 w-3 text-slate-500 -mr-1" />
                        <ChevronRight className="h-3 w-3 text-slate-500 -ml-1" />
                    </div>
                </div>
            </div>

            {/* Corner labels */}
            <div className="absolute top-2 left-2 z-10 bg-slate-900/60 backdrop-blur-md text-white text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-wider pointer-events-none">Antes</div>
            <div className="absolute top-2 right-2 z-10 bg-tenant-primary text-white text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-md pointer-events-none">Depois</div>
        </div>
    )
}

const DraggableCarousel = ({ items }: { items: any[] }) => {
    const x = useMotionValue(0)
    const containerRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const [paused, setPaused] = useState(false)
    const lastInteractionTime = useRef(Date.now())
    const [itemWidth, setItemWidth] = useState(0)

    useEffect(() => {
        if (contentRef.current) {
            const totalWidth = contentRef.current.scrollWidth
            setItemWidth(totalWidth / 4)
        }
    }, [items])

    useEffect(() => {
        if (itemWidth) {
            x.set(-itemWidth)
        }
    }, [itemWidth])

    useAnimationFrame((t, delta) => {
        if (!paused && Date.now() - lastInteractionTime.current > 2000) {
            const speed = 0.5
            const moveBy = speed * (delta / 16.66)
            x.set(x.get() - moveBy)
        }
    })

    useEffect(() => {
        return x.on("change", (v) => {
            if (itemWidth <= 0) return
            if (v <= -itemWidth * 2) {
                x.set(v + itemWidth)
            } else if (v >= 0) {
                x.set(v - itemWidth)
            }
        })
    }, [itemWidth])

    const handleInteractionStart = () => {
        setPaused(true)
        lastInteractionTime.current = Date.now()
    }
    const handleInteractionEnd = () => {
        setPaused(false)
        lastInteractionTime.current = Date.now()
    }

    return (
        <div
            className="w-full overflow-hidden flex relative touch-pan-y"
            ref={containerRef}
            onMouseEnter={handleInteractionStart}
            onMouseLeave={handleInteractionEnd}
        >
            <motion.div
                ref={contentRef}
                className="flex items-center"
                style={{ x }}
                drag="x"
                dragConstraints={{ left: -10000, right: 10000 }}
                onDragStart={handleInteractionStart}
                onDragEnd={handleInteractionEnd}
                onDrag={() => {
                    lastInteractionTime.current = Date.now()
                }}
            >
                {[...items, ...items, ...items, ...items].map((item, i) => (
                    <div key={i} className="flex-shrink-0 w-[88vw] md:w-[45vw] lg:w-[23vw] mx-2 bg-white rounded-xl p-2.5 shadow-lg shadow-slate-200/50 border border-slate-100/80 hover:shadow-2xl hover:border-tenant-primary/30 transition-all duration-300 hover:-translate-y-1 pointer-events-auto select-none">
                        <ImageComparisonSlider before={item.before} after={item.after} />
                        <h4 className="text-center font-bold text-slate-900 text-sm mt-3 pointer-events-none">{item.title}</h4>
                    </div>
                ))}
            </motion.div>
        </div>
    )
}


// Expandable Service Description Component
const ServiceDescription = ({ description }: { description: string }) => {
    const [expanded, setExpanded] = useState(false)
    const textRef = useRef<HTMLParagraphElement>(null)
    const [isClamped, setIsClamped] = useState(false)

    useEffect(() => {
        const el = textRef.current
        if (el) {
            // Check if text is actually overflowing (clamped)
            setIsClamped(el.scrollHeight > el.clientHeight + 1)
        }
    }, [description])

    return (
        <div className="mb-6">
            <p
                ref={textRef}
                className={`text-slate-500 text-sm leading-relaxed transition-all duration-300 ${!expanded ? 'line-clamp-2' : ''}`}
            >
                {description}
            </p>
            {(isClamped || expanded) && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="mt-2 text-xs font-semibold text-tenant-primary hover:underline transition-colors duration-200 flex items-center gap-1"
                >
                    {expanded ? 'Mostrar menos' : 'Mostrar mais'}
                    <motion.span
                        animate={{ rotate: expanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="inline-block"
                    >
                        ▾
                    </motion.span>
                </button>
            )}
        </div>
    )
}

export default function MasterServiceBlueprintPage() {
    const { primary, hover } = DATA.colors
    const [isScrolled, setIsScrolled] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedService, setSelectedService] = useState("")
    const [activeCategory, setActiveCategory] = useState("todos")
    const [selectedDateObj, setSelectedDateObj] = useState<Date | null>(null)
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [selectedTime, setSelectedTime] = useState("")

    const handleOpenModal = (serviceName: string) => {
        setSelectedService(serviceName)
        setIsModalOpen(true)
    }

    const handleConfirmSchedule = () => {
        if (!selectedDateObj || !selectedTime) return

        const dateStr = `${selectedDateObj.getDate().toString().padStart(2, '0')}/${(selectedDateObj.getMonth() + 1).toString().padStart(2, '0')}/${selectedDateObj.getFullYear()}`
        const text = `Olá, gostaria de agendar:\nServiço: ${selectedService}\nData: ${dateStr}\nHorário: ${selectedTime}`
        const whatsappUrl = `https://wa.me/${DATA.contact.whatsapp}?text=${encodeURIComponent(text)}`
        window.open(whatsappUrl, '_blank')
        setIsModalOpen(false)
        setSelectedDateObj(null)
        setSelectedTime("")
    }

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const weekDays = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];
    const fullWeekDays = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];

    const formattedSelectedDate = selectedDateObj
        ? `${fullWeekDays[selectedDateObj.getDay()]}, ${selectedDateObj.getDate()} De ${monthNames[selectedDateObj.getMonth()]}`
        : "Selecione uma data acima";

    const availableTimes = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

    const renderCalendarDays = () => {
        const days = [];
        const daysInMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
        const firstDay = getFirstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth());

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            const isSelected = selectedDateObj && date.getTime() === selectedDateObj.getTime();
            const isPast = date < today;

            days.push(
                <button
                    key={day}
                    disabled={isPast}
                    onClick={() => setSelectedDateObj(date)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full text-[15px] font-medium transition-all
                        ${isSelected ? 'bg-[#b38867] text-white shadow-md scale-110 shadow-[#b38867]/30' :
                            isPast ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-100 hover:scale-110'}
                    `}
                >
                    {day}
                </button>
            );
        }
        return days;
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        handleScroll()
        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-tenant-primary/10 selection:text-tenant-primary scroll-smooth">
            <style dangerouslySetInnerHTML={{
                __html: `
                :root {
                    --tenant-primary: ${primary};
                    --tenant-hover: ${hover};
                }
                .bg-tenant-primary { background-color: var(--tenant-primary); }
                .text-tenant-primary { color: var(--tenant-primary); }
                .border-tenant-primary { border-color: var(--tenant-primary); }
                .hover\\:bg-tenant-hover:hover { background-color: var(--tenant-hover); }
                .group:hover .group-hover\\:bg-tenant-primary { background-color: var(--tenant-primary); }
                .group:hover .group-hover\\:text-white { color: #ffffff; }
            `}} />

            {/* Nav */}
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-tenant-primary shadow-lg' : ''}`}
                style={!isScrolled ? { background: 'linear-gradient(to right, rgba(62, 39, 10, 0.8) 0%, rgba(62, 39, 10, 0.4) 30%, transparent 60%)' } : {}}
            >
                <div className={`mx-auto flex max-w-7xl items-center justify-between px-6 transition-all duration-300 ${!isScrolled ? 'py-4' : 'py-2'}`}>
                    <Link href="#inicio" className="flex items-center group">
                        <img
                            src="/logo-studio-jaqueline.png"
                            alt="Studio Jaque Geovanelle"
                            className={`w-auto object-contain transition-all duration-300 group-hover:scale-105 ${!isScrolled ? 'h-16' : 'h-12 brightness-0 invert'}`}
                        />
                    </Link>

                    <div className="hidden items-center gap-8 lg:flex">
                        {["Início", "Serviços", "Dúvidas", "Contato"].map((item) => (
                            <Link
                                key={item}
                                href={`#${item.toLowerCase().replace('í', 'i')}`}
                                className="text-sm font-bold text-white hover:text-white/80 transition-colors"
                            >
                                {item}
                            </Link>
                        ))}
                        
                        <Link href="/login" className="transition-all hover:opacity-80">
                            <Button 
                                variant="ghost" 
                                className="font-bold text-[11px] uppercase tracking-widest h-10 px-4 rounded-xl text-white hover:bg-white/10"
                            >
                                <User className="w-4 h-4 mr-2" />
                                Login
                            </Button>
                        </Link>

                        <Link href={`https://wa.me/${DATA.contact.whatsapp}?text=Ol%C3%A1%20${DATA.name}%2C%20vi%20seu%20site%20e%20gostaria%20de%20agendar%20um%20hor%C3%A1rio.`} target="_blank">
                             <Button className="h-[50px] px-8 bg-white text-tenant-primary hover:bg-slate-50 font-bold rounded-lg shadow-sm text-[15px] transition-all">
                                 Agendar Agora
                             </Button>
                        </Link>
                    </div>

                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" className="transition-all p-0 duration-300 text-white hover:bg-white/10 hover:backdrop-blur-md rounded-xl w-14 h-14 flex items-center justify-center active:scale-95">
                                    <Menu size={32} style={{ width: '32px', height: '32px' }} strokeWidth={1.2} />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[320px] bg-[#fdfbf9] border-l border-slate-200 p-0 flex flex-col">
                                <SheetHeader className="p-8 border-b border-tenant-primary/10 flex-row items-center justify-center bg-white shadow-sm">
                                    <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
                                    <div className="relative w-48 h-20 flex justify-center items-center">
                                        <img
                                            src="/logo-studio-jaqueline.png"
                                            alt="Studio Jaque Geovanelle"
                                            className="h-full w-auto object-contain"
                                            style={{
                                                /* Converte o dourado/transparente em marrom escuro sólido */
                                                filter: 'brightness(0) saturate(100%) invert(18%) sepia(34%) saturate(2283%) hue-rotate(346deg) brightness(93%) contrast(92%)'
                                            }}
                                        />
                                    </div>
                                </SheetHeader>
                                <div className="flex flex-col flex-1 gap-1 px-4 py-6 overflow-y-auto">
                                    {["Início", "Serviços", "Dúvidas", "Contato"].map((item) => (
                                        <SheetClose asChild key={item}>
                                            <Link
                                                href={`#${item.toLowerCase().replace('í', 'i')}`}
                                                className="group flex items-center justify-between text-[17px] font-medium text-slate-600 hover:text-tenant-primary hover:bg-white hover:shadow-sm px-5 py-4 rounded-2xl transition-all duration-300"
                                            >
                                                {item}
                                                <ArrowRight className="h-4 w-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-tenant-primary" />
                                            </Link>
                                        </SheetClose>
                                    ))}
                                    
                                    <div className="h-px bg-slate-100 my-2 mx-4" />
                                    
                                    <SheetClose asChild>
                                        <Link href="/login"
                                            className="group flex items-center justify-between text-[17px] font-bold text-slate-900 hover:text-tenant-primary hover:bg-white hover:shadow-sm px-5 py-4 rounded-2xl transition-all duration-300">
                                            <div className="flex items-center gap-3">
                                                <User className="h-5 w-5 text-slate-400 group-hover:text-tenant-primary transition-colors" />
                                                Login
                                            </div>
                                            <ArrowRight className="h-4 w-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-tenant-primary" />
                                        </Link>
                                    </SheetClose>
                                </div>
                                <div className="mt-auto p-6 bg-white border-t border-slate-100">
                                    <Link href={`https://wa.me/${DATA.contact.whatsapp}`}>
                                        <Button className="w-full h-14 bg-tenant-primary hover:bg-tenant-hover text-white font-bold rounded-2xl text-[11px] tracking-widest uppercase shadow-[0_10px_30px_rgba(173,133,81,0.25)] transition-all active:scale-95 hover:scale-[1.02] flex items-center justify-center gap-2">
                                            <MessageCircle className="w-5 h-5" /> Como podemos ajudar?
                                        </Button>
                                    </Link>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </nav>

            {/* Immersive Client Hero */}
            <section id="inicio" className={`relative pt-32 pb-10 lg:pt-32 lg:pb-32 min-h-[80vh] lg:min-h-[calc(100vh-80px)] flex items-center overflow-hidden`}>

                <div className="absolute inset-0 z-0 overflow-hidden bg-tenant-primary">
                    <Image
                        src="/studio-jaqueline.png"
                        alt={DATA.name}
                        fill
                        priority
                        quality={100}
                        className="object-cover object-[70%_top] md:object-[65%_top] lg:object-[75%_top]"
                    />
                    {/* Mobile Gradient Overlay */}
                    <div
                        className="absolute inset-0 lg:hidden"
                        style={{
                            background: 'linear-gradient(to top right, var(--tenant-primary) 20%, rgba(109, 74, 42, 0.8) 60%, transparent 100%)'
                        }}
                    />
                    {/* PC Gradient Overlay (re-added for smoothness) */}
                    <div
                        className="hidden lg:block absolute inset-0"
                        style={{
                            background: 'linear-gradient(to right, var(--tenant-primary) 30%, transparent 60%)'
                        }}
                    />
                </div>

                <div className="relative z-10 mx-auto max-w-7xl px-6 w-full grid lg:grid-cols-12 gap-8 items-center">

                    {/* Left Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-6 space-y-8"
                    >
                        <div className="inline-flex items-center -mt-20 md:-mt-0 gap-2 rounded-full border border-white/20 bg-white/20 backdrop-blur-md px-4 py-1.5 text-[9px] md:text-xs font-bold uppercase tracking-widest text-white shadow-sm">
                            <Activity className="h-3.5 w-3.5" /> Especialista em Sobrancelhas & Lábios
                        </div>

                        <h1 className="text-5xl max-w-[80%] md:text-7xl font-sans tracking-tight text-white leading-[1.05] break-words" style={{ fontFamily: 'var(--font-playfair)' }}>
                            Realce sua beleza de forma <span className="font-light italic" style={{ color: '#eec584', textShadow: '0 0 15px rgba(238,197,132,0.4)' }}>Natural e Perfeita</span>.
                        </h1>

                        <p className="text-lg md:text-xl text-white/90 leading-relaxed font-light max-w-xl">
                            {DATA.description}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link href="#agendamento" className="w-full sm:w-auto">
                                <Button size="lg" className="h-14 w-full bg-white hover:bg-slate-50 text-tenant-primary text-lg font-bold px-10 rounded-full shadow-xl shadow-black/10 transition-all active:scale-95">
                                    Agendar Horário
                                </Button>
                            </Link>
                            <Link href="#servicos" className="w-full sm:w-auto">
                                <Button size="lg" variant="ghost" className="h-14 w-full sm:w-auto text-white bg-white/10 hover:bg-white/20 backdrop-blur-md font-bold px-8 rounded-full border border-white/20 shadow-sm transition-all flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                                        <ArrowRight className="h-3 w-3 text-tenant-primary" />
                                    </div>
                                    Ver Tratamentos
                                </Button>
                            </Link>
                        </div>

                        {/* Elegant Stats */}
                        <div className="pt-4 grid grid-cols-2 gap-2 border-t border-white/20 max-w-md items-start">
                            <div>
                                <div className="flex items-center">
                                    <div className="text-4xl font-light text-white mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>5.0</div>
                                    <Star className="h-5 w-5 ml-2 mt-2" style={{ fill: '#FDE047', color: '#FDE047', filter: 'drop-shadow(0 0 8px rgba(253,224,71,0.6))' }} />
                                </div>
                                <div className="text-xs font-bold text-white/70 uppercase tracking-widest leading-relaxed">No Google<br />(152+ Avaliações)</div>
                            </div>
                            <div>
                                <div className="text-2xl font-light text-white mb-1 mt-2">Premium</div>
                                <div className="text-xs font-bold text-white/70 uppercase tracking-widest leading-relaxed">Excelência em cada<br />detalhe</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Side - Floating Glassmorphism Elements over Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="hidden lg:block lg:col-span-6 relative h-[600px] w-full"
                    >
                        {/* Interactive Floating Pulse Elements */}
                        <div className="absolute top-[25%] left-[20%] w-8 h-8 rounded-full bg-white/30 backdrop-blur-md border border-white/60 flex items-center justify-center shadow-lg animate-pulse hover:bg-white/60 transition-colors">
                            <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_2px_rgba(255,255,255,0.8)]" />
                        </div>
                        <div className="absolute bottom-[45%] right-[10%] w-8 h-8 rounded-full bg-white/30 backdrop-blur-md border border-white/60 flex items-center justify-center shadow-lg animate-pulse hover:bg-white/60 transition-colors" style={{ animationDelay: '1s' }}>
                            <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_2px_rgba(255,255,255,0.8)]" />
                        </div>

                        {/* Floating Moisture Card */}
                        <motion.div
                            animate={{ y: [-10, 10, -10] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-[40%] left-[5%] bg-white/50 backdrop-blur-xl border border-white/60 p-4 rounded-3xl shadow-2xl flex flex-col items-center gap-3"
                        >
                            <span className="text-xs font-extrabold text-slate-900 tracking-wider">Satisfação</span>
                            <div className="relative w-16 h-16 rounded-full flex items-center justify-center bg-white/40 shadow-inner">
                                <svg className="absolute inset-0 w-full h-full -rotate-90">
                                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-tenant-primary/20" />
                                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="175" strokeDashoffset="40" className="text-tenant-primary drop-shadow-md" strokeLinecap="round" />
                                </svg>
                                <span className="font-bold text-slate-900">100%</span>
                            </div>
                        </motion.div>

                        {/* Floating Treatment Card */}
                        <motion.div
                            animate={{ y: [10, -10, 10] }}
                            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute bottom-5 right-5 bg-white/60 backdrop-blur-xl border border-white/60 p-5 rounded-3xl shadow-2xl w-72"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm font-extrabold text-slate-900 drop-shadow-sm">Nossos Serviços</span>
                                <ArrowRight className="h-4 w-4 text-slate-600" />
                            </div>
                            <div className="flex gap-2 mb-4">
                                <img src="https://plus.unsplash.com/premium_photo-1663050996462-4671145bf66f?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="w-[68px] h-[68px] rounded-2xl object-cover border-2 border-white shadow-sm" alt="Sobrancelhas" />

                                <img src="https://images.unsplash.com/photo-1585885970325-81cba4494c27?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="w-[68px] h-[68px] rounded-2xl object-cover border-2 border-white shadow-sm" alt="Micropigmentação" />

                                <img src="https://images.unsplash.com/photo-1654375078795-7229b6458d25?q=80&w=764&auto=format&fit=crop" className="w-[68px] h-[68px] rounded-2xl object-cover border-2 border-white shadow-sm" alt="Lábios" />
                            </div>
                            <Button variant="ghost" className="w-full bg-white text-slate-900 hover:bg-slate-50 font-bold rounded-xl text-[10px] h-14 shadow-sm border border-slate-100 uppercase tracking-widest transition-all">
                                Conhecer Técnicas
                            </Button>
                        </motion.div>

                        {/* Scan Tag */}
                        <motion.div
                            animate={{ y: [-5, 5, -5] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                            className="absolute top-16 -right-20 bg-white/60 backdrop-blur-md border border-white/60 px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2"
                        >
                            <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-tenant-primary shadow-sm">
                                <Award className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold text-slate-900 drop-shadow-sm">Empreendedoras</span>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Trust Strip */}
            <div className="bg-slate-900 py-6 overflow-hidden border-y border-white/5">
                <motion.div
                    animate={{ x: [0, -1000] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="flex items-center gap-12 whitespace-nowrap"
                >
                    {[...DATA.trustBadges, ...DATA.trustBadges, ...DATA.trustBadges].map((badge, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <ShieldCheck className="h-5 w-5 text-tenant-primary" />
                            <span className="text-white font-bold uppercase tracking-[0.2em] text-[10px]">{badge}</span>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Services */}
            <section id="servicos" className="py-24 bg-white">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="mb-16 text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
                            Nossa <span className="text-tenant-primary italic">Expertise</span>
                        </h2>
                        <p className="text-lg text-slate-600">
                            Procedimentos personalizados para valorizar a arquitetura do seu rosto e realçar a sua beleza natural.
                        </p>
                    </div>

                    <div className="flex justify-center flex-wrap gap-4 mb-16">
                        {DATA.categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 ${activeCategory === cat.id
                                    ? "bg-tenant-primary text-white shadow-lg shadow-tenant-primary/30"
                                    : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    <div className="max-w-6xl mx-auto flex flex-col gap-10">
                        {DATA.categories
                            .filter(c => c.id !== 'todos' && (activeCategory === 'todos' || activeCategory === c.id))
                            .map((category) => {
                                const categoryServices = DATA.services.filter(s => s.categoryId === category.id);
                                if (categoryServices.length === 0) return null;

                                return (
                                    <div key={category.id} className="flex flex-col mb-10 last:mb-0">
                                        {(activeCategory === 'todos') && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex items-center gap-4 mb-10 w-full"
                                            >
                                                <div className="h-px bg-slate-200 flex-1"></div>
                                                <h3 className="text-2xl font-bold tracking-widest text-slate-400 uppercase">{category.label}</h3>
                                                <div className="h-px bg-slate-200 flex-1"></div>
                                            </motion.div>
                                        )}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {categoryServices.map((service, i) => (
                                                <motion.div
                                                    key={service.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: i * 0.1 }}
                                                    className="group bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:border-tenant-primary/20 hover:bg-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
                                                >
                                                    <div className="relative h-56 w-full overflow-hidden bg-slate-100 flex items-center justify-center">
                                                        <img
                                                            src={service.image}
                                                            alt={service.name}
                                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                    </div>
                                                    <div className="p-8 flex flex-col flex-1">
                                                        <h4 className="text-xl font-bold text-slate-900 mb-3">{service.name}</h4>
                                                        <ServiceDescription description={service.description} />
                                                        <div className="mt-auto">
                                                            <button
                                                                onClick={() => handleOpenModal(service.name)}
                                                                className="w-full flex items-center justify-center bg-tenant-primary text-white border border-transparent hover:bg-white hover:!text-[#ad8551] hover:!border-[#ad8551] font-bold rounded-2xl h-[50px] transition-all shadow-md group-hover:shadow-[0_8px_25px_rgba(173,133,81,0.25)] text-[15px]"
                                                            >
                                                                Agendar
                                                            </button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}
                    </div>
                </div>
            </section>

            {/* Scheduling */}
            <SchedulingSection
                whatsappNumber={DATA.contact.whatsapp}
                clientName={DATA.name}
            />

            {/* Founder Section */}
            {DATA.founder.name && (
                <section id="sobre" className="relative py-24 lg:py-32 bg-white overflow-hidden">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,var(--tenant-primary)_0%,transparent_40%)] opacity-[0.03]" />
                    <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,var(--tenant-primary)_0%,transparent_40%)] opacity-[0.03]" />

                    <div className="mx-auto max-w-7xl px-6 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">

                            {/* Left Side: Elegant Image Frame */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="relative pb-10"
                            >
                                <div className="absolute -inset-4 lg:-inset-8 bg-tenant-primary/10 rounded-[3rem] blur-3xl opacity-60" />
                                <div className="relative aspect-[4/5] max-w-md mx-auto rounded-[2.5rem] bg-slate-50 overflow-hidden shadow-[0_30px_60px_rgba(158,115,24,0.2)] border border-slate-100 group">
                                    <Image
                                        src="/studio-jaqueline-perfil.jpg"
                                        alt={DATA.founder.name}
                                        fill
                                        className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                        sizes="(max-w-width: 768px) 100vw, 50vw"
                                    />
                                    {/* Glassmorphism Name Tag */}
                                    <div className="absolute bottom-6 left-6 right-6 p-5 bg-white/70 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.05)] transform transition-transform duration-500 group-hover:-translate-y-2">
                                        <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-tenant-primary mb-1">Fundadora & Especialista</p>
                                        <h4 className="font-bold text-slate-900 text-lg">{DATA.founder.name}</h4>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Right Side: Fashion Context */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="space-y-8"
                            >
                                <div className="inline-flex items-center gap-2 rounded-full border border-tenant-primary/20 bg-tenant-primary/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-tenant-primary">
                                    <Star className="h-3.5 w-3.5 fill-tenant-primary" /> Compromisso com a Excelência
                                </div>

                                <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.1]" style={{ fontFamily: 'var(--font-playfair)' }}>
                                    A <span className="text-tenant-primary italic">Expert</span> cuidando da sua autoestima.
                                </h2>

                                <div className="w-16 h-1 bg-tenant-primary/20 rounded-full" />

                                <p className="text-xl text-slate-600 leading-relaxed font-light italic">
                                    "{DATA.founder.bio}"
                                </p>

                                <div className="pt-8 border-t border-slate-100">
                                    <h3 className="text-3xl font-bold text-tenant-primary" style={{ fontFamily: 'var(--font-playfair)' }}>
                                        {DATA.founder.name}
                                    </h3>
                                    <p className="text-sm text-slate-400 font-medium tracking-widest uppercase mt-1">
                                        {DATA.founder.role}
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>
            )}

            {/* Before and After Carousel */}
            <section className="py-24 bg-slate-50 overflow-hidden border-t border-slate-100 flex flex-col items-center">
                <div className="mt-8 mb-4 w-full cursor-grab active:cursor-grabbing">
                    <DraggableCarousel items={DATA.beforeAfter} />
                </div>
            </section>

            {/* FAQ */}
            <section id="duvidas" className="py-24 bg-white border-t border-slate-100">
                <div className="mx-auto max-w-3xl px-6">
                    <div className="mb-16 text-center">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
                            Principais <span className="text-tenant-primary italic">Dúvidas</span>
                        </h2>
                    </div>
                    <Accordion type="single" collapsible className="space-y-4">
                        {DATA.faq.map((item: any, i: number) => (
                            <AccordionItem key={i} value={`item-${i}`} className="border border-slate-200 bg-slate-50 px-8 rounded-3xl data-[state=open]:bg-white data-[state=open]:border-tenant-primary/20 transition-all">
                                <AccordionTrigger className="font-bold text-slate-900 py-6 hover:no-underline">
                                    {item.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-600 pb-6">
                                    {item.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </section>

            {/* Contact */}
            <section id="contato" className="py-24 bg-slate-50 border-t border-slate-200">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                        <div className="space-y-12">
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900" style={{ fontFamily: 'var(--font-playfair)' }}>Onde estamos <span className="text-tenant-primary italic">Localizados</span></h2>
                            <div className="space-y-8">
                                <div className="flex gap-6 items-start">
                                    <div className="h-12 w-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                                        <MapPin className="h-6 w-6 text-tenant-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-slate-900 mb-1">Localização</h4>
                                        <p className="text-slate-700 font-bold">{DATA.contact.address}</p>
                                        <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                                            {DATA.contact.addressDetails}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-6 items-start">
                                    <div className="h-12 w-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                                        <Phone className="h-6 w-6 text-tenant-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-slate-900 mb-1">Contato Direto</h4>
                                        <p className="text-slate-600">{DATA.contact.phone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {(() => {
                            const mapUrl = DATA.contact.mapEmbedUrl ||
                                (DATA.contact.address ? `https://maps.google.com/maps?q=${encodeURIComponent(DATA.contact.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed` : null);

                            return mapUrl && (
                                <div className="relative aspect-video lg:aspect-square rounded-[48px] overflow-hidden border border-slate-200 shadow-2xl">
                                    <iframe src={mapUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" className="transition-all duration-500 hover:brightness-110"></iframe>
                                </div>
                            )
                        })()}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-16 bg-tenant-primary relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-px bg-white/10" />
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/5 rounded-full blur-3xl" />

                <div className="mx-auto max-w-7xl px-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
                        {/* Brand Section */}
                        <div className="flex flex-col items-center md:items-start gap-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full overflow-hidden border border-white/30 shrink-0 relative bg-white/10">
                                    <Image
                                        src="/avatar-tenant-jaque.jpg"
                                        alt={DATA.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <h3 className="font-bold text-white tracking-widest uppercase text-xs">
                                    {DATA.name} {DATA.surname}
                                </h3>
                            </div>
                            <p className="text-white/60 text-[10px] tracking-widest uppercase font-medium text-center md:text-left">
                                Micropigmentação & Brow Lamination
                            </p>
                        </div>

                        {/* Social Section */}
                        <div className="flex flex-col items-center gap-6">
                            <div className="flex items-center gap-6">
                                <a
                                    href="https://www.instagram.com/jaquegeovanellesobrancelhas/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center text-white hover:bg-white hover:!text-[#ad8551] transition-all duration-300 border border-white/20 group"
                                >
                                    <Instagram className="h-6 w-6 transition-transform duration-300 group-hover:scale-110 group-hover:!text-[#ad8551]" />
                                </a>
                                <a
                                    href={`https://wa.me/${DATA.contact.whatsapp}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center text-white hover:bg-white hover:!text-[#ad8551] transition-all duration-300 border border-white/20 group"
                                >
                                    <MessageCircle className="h-6 w-6 transition-transform duration-300 group-hover:scale-110 group-hover:!text-[#ad8551]" />
                                </a>
                            </div>
                            <p className="text-white/40 text-[9px] tracking-[0.3em] uppercase font-bold">Acompanhe no Instagram</p>
                        </div>

                        {/* Copyright Section */}
                        <div className="flex flex-col items-center md:items-end gap-3">
                            <span className="text-white/40 text-[10px] uppercase tracking-widest">© {new Date().getFullYear()} Todos os direitos reservados</span>
                            <Link href="/" className="group flex items-center gap-2">
                                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 group-hover:text-white transition-colors">Powered by</span>
                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/50 group-hover:text-white transition-colors">IagoTech</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>

            <TenantWhatsapp DATA={DATA} primary={primary} />

            {/* Scheduling Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-6 bg-slate-900/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-[#f0eadd] rounded-[2.5rem] w-[95%] max-w-md md:max-w-3xl lg:max-w-[950px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] relative"
                            style={{ background: 'linear-gradient(135deg, #fefdfb 0%, #ecdrc1 100%)', backgroundColor: '#fdfbf9' }}
                        >
                            {/* Header */}
                            <div className="p-6 flex justify-between items-center sticky top-0 z-20">
                                <h3 className="text-lg font-bold text-[#4a4a4a] pr-4 bg-white/50 px-4 py-2 rounded-2xl backdrop-blur-md shadow-sm border border-white/60">Agendamento</h3>
                                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center shrink-0 rounded-full bg-white/50 text-[#4a4a4a] hover:bg-white transition-all backdrop-blur-md shadow-sm border border-white/60">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="overflow-y-auto px-6 pb-6 flex flex-col md:flex-row gap-6 hide-scrollbar custom-scrollbar relative z-10">
                                {/* Calendar Component */}
                                <div className="bg-white/70 backdrop-blur-md p-6 rounded-[2rem] shadow-sm border border-white flex-1">
                                    <div className="flex items-center justify-between mb-8">
                                        <button onClick={handlePrevMonth} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white transition-all text-[#2a303c] border border-white shadow-sm bg-white/50">
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <h4 className="font-bold text-[#1f2937] text-lg tracking-wide">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h4>
                                        <button onClick={handleNextMonth} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white transition-all text-[#2a303c] border border-white shadow-sm bg-white/50">
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-7 gap-1 mb-4">
                                        {weekDays.map(day => (
                                            <div key={day} className="text-center text-[10px] font-bold text-slate-400 tracking-widest leading-none mb-2">{day}</div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-7 gap-y-2 gap-x-1 justify-items-center">
                                        {renderCalendarDays()}
                                    </div>
                                </div>

                                {/* Time Component */}
                                <div className="bg-white/70 backdrop-blur-md p-6 md:p-8 rounded-[2rem] shadow-sm border border-white flex-1 flex flex-col">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="text-[#b38867] shrink-0">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase leading-none mb-1 text-left">Data Selecionada</span>
                                            <span className="text-[16px] font-bold text-[#1f2937] leading-none text-left">{formattedSelectedDate}</span>
                                        </div>
                                    </div>

                                    {selectedDateObj ? (
                                        <div className="grid grid-cols-3 gap-3">
                                            {availableTimes.map(time => (
                                                <button
                                                    key={time}
                                                    onClick={() => setSelectedTime(time)}
                                                    className={`py-3 rounded-2xl font-bold text-[15px] transition-all
                                                        ${selectedTime === time
                                                            ? 'bg-[#b38867] text-white shadow-lg shadow-[#b38867]/30 scale-[1.03]'
                                                            : 'bg-white text-slate-600 shadow-sm border border-white hover:border-[#b38867]/30 hover:shadow-md'}
                                                    `}
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-6 text-center text-sm font-medium text-slate-500 bg-white/50 rounded-2xl border border-white">
                                            Escolha o dia ideal no calendário acima.
                                        </div>
                                    )}

                                    <div className="mt-8 mb-2 md:mt-auto">
                                        <p className="text-center text-slate-500 italic font-medium text-[15px]" style={{ fontFamily: 'var(--font-playfair)' }}>
                                            "Seu momento de cuidado começa aqui."
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Submit */}
                            <div className="px-6 pb-6 pt-2 mt-auto relative z-10 hidden-gradient-mask">
                                <Button
                                    onClick={handleConfirmSchedule}
                                    disabled={!selectedDateObj || !selectedTime}
                                    className="w-full h-[60px] rounded-[1.25rem] bg-[#b38867] text-white font-bold text-[16px] hover:bg-[#a07456] disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-[0_10px_30px_rgba(179,136,103,0.3)] flex items-center justify-center gap-2"
                                >
                                    <span className="text-xl">💎</span> Reservar Minha Transformação
                                </Button>
                            </div>

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function TenantWhatsapp({ DATA, primary }: { DATA: any, primary: string }) {
    const [isOpen, setIsOpen] = useState(false)
    const [message, setMessage] = useState("")
    const [showButton, setShowButton] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerWidth < 1024) {
                setShowButton(window.scrollY > 300)
            } else {
                setShowButton(true)
            }
        }

        handleScroll()

        window.addEventListener("scroll", handleScroll, { passive: true })
        window.addEventListener("resize", handleScroll, { passive: true })

        return () => {
            window.removeEventListener("scroll", handleScroll)
            window.removeEventListener("resize", handleScroll)
        }
    }, [])

    const handleSend = () => {
        if (!message.trim()) return
        const whatsappUrl = `https://wa.me/${DATA.contact.whatsapp}?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, '_blank')
        setIsOpen(false)
        setMessage("")
    }

    return (
        <AnimatePresence>
            {showButton && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4 pointer-events-none"
                >
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: "bottom right" }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="pointer-events-auto w-[300px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
                            >
                                <div className="bg-tenant-primary px-6 py-5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/30 shrink-0 relative">
                                            <Image
                                                src="/avatar-tenant-jaque.jpg"
                                                alt={DATA.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-white text-sm leading-tight line-clamp-1">{DATA.name}</span>
                                            <span className="text-[10px] text-white/80 uppercase tracking-widest mt-0.5 font-medium">Online agora</span>
                                        </div>
                                    </div>
                                    <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="p-5 bg-slate-50/50">
                                    <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm border border-slate-100 mb-4 ml-2 mr-6 text-sm text-slate-700">
                                        Olá esplendorosa! ✨<br />Como posso ajudar a realçar sua beleza hoje?
                                    </div>
                                    <div className="relative flex items-center gap-2">
                                        <input
                                            type="text"
                                            placeholder="Digite sua dúvida..."
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                            className="w-full h-12 pl-4 pr-12 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:border-tenant-primary focus:ring-1 focus:ring-tenant-primary transition-all shadow-sm"
                                        />
                                        <button
                                            onClick={handleSend}
                                            className="absolute right-1 top-1 h-10 w-10 bg-tenant-primary text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-md disabled:opacity-50 disabled:hover:scale-100"
                                            disabled={!message.trim()}
                                        >
                                            <Send className="h-4 w-4 ml-0.5" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.button
                        onClick={() => setIsOpen(!isOpen)}
                        className="pointer-events-auto flex items-center justify-center h-14 w-14 rounded-full bg-tenant-primary text-white shadow-xl shadow-tenant-primary/30 hover:scale-110 active:scale-95 transition-all"
                    >
                        <AnimatePresence mode="wait">
                            {isOpen ? (
                                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                                    <X className="h-6 w-6" />
                                </motion.div>
                            ) : (
                                <motion.div key="icon" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
                                    <MessageCircle className="h-6 w-6" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
