"use client"

import React from "react"
import { useEditor } from "@/lib/editor-context"
import { EditableSection } from "./editable-section"
import { EditableText } from "./editable-text"
import { EditableImage } from "./editable-image"
import Image from "next/image"
import {
    Activity, ShieldCheck, MapPin, Phone,
    ArrowRight, MessageCircle, Instagram, Award, Star, Menu
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { resolveSectionBackground, buildGradientString } from "@/lib/style-utils"
import { getTheme, generateThemeCSS, getHeroImageForNiche } from "@/src/themes"
import { SchedulingSection } from "@/components/scheduling-section"

export function LivePreview() {
    const { data, breakpoint, selectSection, selectElement, selectedSection } = useEditor()
    const { primary, hover } = data.colors

    // Check if user has set a custom background on the hero section
    const heroSectionBg = resolveSectionBackground(data, 'hero')
    const hasCustomHeroBg = Object.keys(heroSectionBg).length > 0

    const activeTheme = getTheme((data.theme as any) || "neutro")
    const themeCSSVars = generateThemeCSS(activeTheme, "light")
    const resolvedHeroImageUrl = data.heroImageUrl || getHeroImageForNiche(data.businessTypeId)

    return (
        <div
            className="min-h-full bg-(--theme-color-background) font-sans text-slate-900 overflow-y-auto tenant-theme-root @container"
            data-theme={data.theme || "neutro"}
            style={{
                ...themeCSSVars,
                ['--tenant-primary' as string]: primary || themeCSSVars['--theme-color-primary'],
                ['--tenant-hover' as string]: hover,
                ['--tenant-accent' as string]: themeCSSVars['--theme-color-accent'] || '#eec584',
                ['--tenant-hero-overlay' as string]: primary,
                fontFamily: 'var(--theme-font-body)',
            } as React.CSSProperties}
            onClick={(e) => {
                // Deselect when clicking empty space
                if (e.target === e.currentTarget) {
                    // handled by EditorProvider
                }
            }}
        >
            {/* ─── Hero (includes nav overlay, matching production /[slug]) ─── */}
            <EditableSection sectionId="hero" label="Hero (Banner Principal)">
                <div className="relative w-full">
                    {/* Nav — transparent overlay matching production */}
                    <nav className="absolute top-0 left-0 right-0 z-50 bg-transparent">
                        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 @lg:py-6">
                            {data.logoUrl ? (
                                <img src={data.logoUrl} alt={data.name} className="h-12 @lg:h-16 w-auto object-contain" />
                            ) : (
                                <EditableText
                                    fieldPath="name"
                                    elementId="nav-name"
                                    sectionId="hero"
                                    as="span"
                                    className="font-bold text-white text-lg @lg:text-2xl"
                                    style={{ fontFamily: 'var(--theme-font-heading)' }}
                                    data-element-id="nav-name"
                                />
                            )}
                            <div className="hidden @lg:flex items-center gap-8">
                                {["Início", "Serviços", "Dúvidas", "Contato"].map((item) => (
                                    <span key={item} className="text-sm font-bold text-white hover:text-white/80 cursor-default transition-colors">{item}</span>
                                ))}
                                <Button size="sm" className="bg-white text-[var(--tenant-primary)] hover:bg-slate-50 font-bold rounded-(--theme-btn-radius) px-6 shadow-sm">
                                    Agendar Agora
                                </Button>
                            </div>
                            <div className="@lg:hidden">
                                <Button variant="ghost" className="transition-all p-0 duration-300 text-white hover:bg-white/10 hover:backdrop-blur-md rounded-xl w-14 h-14 flex items-center justify-center active:scale-95">
                                    <Menu size={32} style={{ width: '32px', height: '32px' }} strokeWidth={1.2} />
                                </Button>
                            </div>
                        </div>
                    </nav>

                <section
                    className={cn(
                        "relative overflow-hidden",
                        data.heroImageSettings?.layout === 'center' 
                            ? "min-h-[90vh] @lg:min-h-screen flex flex-col justify-center items-center"
                            : "pb-10 @lg:pb-0 min-h-[80vh] @lg:min-h-[calc(100vh-80px)] flex items-center"
                    )}
                    style={{ 
                        paddingTop: data.heroImageSettings?.layout === 'center' ? '6rem' : '8rem',
                        paddingBottom: data.heroImageSettings?.layout === 'center' ? '4rem' : undefined
                    }}
                >
                    {/* LAYER 0 — Solid base */}
                    <div className="absolute inset-0 z-0 bg-[var(--tenant-primary)]" />

                    {/* LAYER 1 — Section gradient */}
                    {hasCustomHeroBg && (
                        <div className="absolute inset-0 z-1" style={heroSectionBg} />
                    )}

                    {/* LAYER 2 — Hero image */}
                    {resolvedHeroImageUrl && (
                        <>
                            {/* Mobile: full viewport */}
                            <div className="absolute inset-0 z-2 @lg:hidden overflow-hidden">
                                <EditableImage fieldPath="heroImageUrl" elementId="hero-bg-image" sectionId="hero" className="w-full h-full">
                                    <Image
                                        src={resolvedHeroImageUrl}
                                        alt={data.name}
                                        fill
                                        sizes="100vw"
                                        priority
                                        quality={90}
                                        className="object-cover"
                                        style={{
                                            objectPosition: `${data.heroImageSettings?.mobile?.positionX ?? data.heroImageSettings?.positionX ?? 50}% ${data.heroImageSettings?.mobile?.positionY ?? data.heroImageSettings?.positionY ?? 20}%`,
                                            transform: `scale(${data.heroImageSettings?.mobile?.zoom ?? data.heroImageSettings?.zoom ?? 1})`,
                                            transformOrigin: 'center center',
                                        }}
                                    />
                                </EditableImage>
                            </div>
                            {/* Desktop: conditional width */}
                            <div className={cn("hidden @lg:block absolute z-2 overflow-hidden", data.heroImageSettings?.layout === 'center' ? "inset-0" : "top-0 right-0 bottom-0 w-[50%]")}>
                                <EditableImage fieldPath="heroImageUrl" elementId="hero-bg-image-desktop" sectionId="hero" className="w-full h-full">
                                    <Image
                                        src={resolvedHeroImageUrl}
                                        alt={data.name}
                                        fill
                                        sizes="50vw"
                                        priority
                                        quality={100}
                                        className="object-cover"
                                        style={{
                                            objectPosition: `${data.heroImageSettings?.positionX ?? 50}% ${data.heroImageSettings?.positionY ?? 20}%`,
                                            transform: `scale(${data.heroImageSettings?.zoom ?? 1})`,
                                            transformOrigin: 'center center',
                                        }}
                                    />
                                </EditableImage>
                                {data.heroImageSettings?.layout === 'center' && <div className="absolute inset-0 bg-black/40 mix-blend-multiply pointer-events-none" />}
                            </div>
                        </>
                    )}

                    {/* LAYER 3 — Vinheta / Image overlay */}
                    {data.heroImageSettings?.overlayEnabled && data.heroImageSettings.overlay && (
                        <>
                            {/* Mobile: covers full viewport */}
                            <div
                                className="absolute inset-0 z-3 @lg:hidden pointer-events-none"
                                style={{ background: buildGradientString(data.heroImageSettings.overlay) }}
                            />
                            {/* Desktop: conditional width */}
                            <div
                                className={cn("hidden @lg:block absolute z-3 pointer-events-none", data.heroImageSettings?.layout === 'center' ? "inset-0" : "top-0 right-0 bottom-0 w-[50%]")}
                                style={{ background: buildGradientString(data.heroImageSettings.overlay) }}
                            />
                        </>
                    )}

                    {/* LAYER 4 — Content */}
                    <div className={cn("relative z-10 mx-auto max-w-7xl px-6 w-full", data.heroImageSettings?.layout === 'center' && "flex flex-col justify-center items-center")}>
                        <div className={cn("space-y-8", data.heroImageSettings?.layout === 'center' ? "max-w-3xl @lg:max-w-4xl flex flex-col items-center text-center" : "max-w-xl @lg:max-w-2xl")}>
                            <EditableText
                                fieldPath="heroBadge"
                                elementId="hero-badge"
                                sectionId="hero"
                                as="div"
                                className={cn("inline-flex items-center gap-2 rounded-(--theme-btn-radius) border border-white/20 bg-white/20 backdrop-blur-md px-4 py-1.5 text-[9px] @md:text-xs font-bold uppercase tracking-widest text-white shadow-sm", data.heroImageSettings?.layout === 'center' ? "mt-4 @md:mt-0" : "")}
                                data-element-id="hero-badge"
                            >
                                <Activity className="h-3.5 w-3.5 inline mr-1" />{data.heroBadge}
                            </EditableText>

                            <h1 className="text-5xl @md:text-6xl @lg:text-7xl font-sans tracking-tight text-white leading-[1.05]" style={{ fontFamily: 'var(--theme-font-heading)' }}>
                                <EditableText
                                    fieldPath="heroHeadline"
                                    elementId="hero-headline"
                                    sectionId="hero"
                                    as="span"
                                    data-element-id="hero-headline"
                                />
                                {" "}
                                <EditableText
                                    fieldPath="heroHighlight"
                                    elementId="hero-highlight"
                                    sectionId="hero"
                                    as="span"
                                    className="font-light italic"
                                    style={{ color: 'var(--tenant-accent)', textShadow: `0 0 15px #eec58466` }}
                                    data-element-id="hero-highlight"
                                />.
                            </h1>

                            <EditableText
                                fieldPath="description"
                                elementId="hero-description"
                                sectionId="hero"
                                as="p"
                                multiline
                                className={cn("text-lg @md:text-xl text-white/90 leading-relaxed font-light", data.heroImageSettings?.layout === 'center' ? "max-w-2xl mx-auto" : "max-w-xl")}
                                data-element-id="hero-description"
                            />

                            <div className={cn("flex flex-col @sm:flex-row gap-4 pt-4", data.heroImageSettings?.layout === 'center' && "justify-center w-full")}>
                                <Button size="lg" className="h-14 bg-white hover:bg-slate-50 text-[var(--tenant-primary)] text-lg font-bold px-10 rounded-(--theme-btn-radius) shadow-xl shadow-black/10 transition-all">
                                    Agendar Horário
                                </Button>
                                <Button size="lg" variant="ghost" className="h-14 w-full @sm:w-auto text-white bg-white/10 hover:bg-white/20 backdrop-blur-md font-bold px-8 rounded-full border border-white/20 shadow-sm transition-all flex items-center justify-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                                        <ArrowRight className="h-3 w-3 text-[var(--tenant-primary)]" />
                                    </div>
                                    Ver Tratamentos
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
                </div>
            </EditableSection>

            {/* ─── Trust Strip ─── */}
            <div data-section-id="trust" onClick={() => { selectSection('trust'); selectElement(null) }} className={cn("relative group/section cursor-pointer transition-all", selectedSection === 'trust' && "ring-2 ring-blue-500 ring-offset-2")}>
                <div className="bg-slate-900 py-5 overflow-hidden border-y border-white/5">
                    <div className="flex items-center gap-12 whitespace-nowrap px-6 overflow-x-auto">
                        {data.trustBadges.map((badge, i) => (
                            <div key={i} className="flex items-center gap-3 shrink-0">
                                <ShieldCheck className="h-5 w-5 text-[var(--tenant-primary)]" />
                                <span className="text-white font-bold uppercase tracking-[0.2em] text-[10px]">
                                    {typeof badge === 'string' ? badge : badge.text}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ─── Services ─── */}
            <div data-section-id="services" onClick={() => { selectSection('services'); selectElement(null) }} className={cn("relative group/section cursor-pointer transition-all", selectedSection === 'services' && "ring-2 ring-blue-500 ring-offset-2")}>
                <section className="py-16 bg-(--theme-color-background)">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="mb-12 text-center">
                            <h2 className="text-3xl @md:text-4xl font-bold tracking-tight text-slate-900 mb-4" style={{ fontFamily: 'var(--theme-font-heading)' }}>
                                Nossa <span className="text-[var(--tenant-primary)] italic">Expertise</span>
                            </h2>
                            <p className="text-base text-slate-600">Procedimentos personalizados para valorizar a sua beleza natural.</p>
                        </div>
                        <div className="grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 gap-(--theme-section-gap)">
                            {data.services.slice(0, 6).map((service) => (
                                <div key={service.id} className="group bg-(--theme-color-surface) rounded-(--theme-card-radius) border border-slate-100 hover:border-[var(--tenant-primary)]/20 hover:shadow-(--theme-card-shadow) transition-all overflow-hidden shadow-sm">
                                    <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                                        {service.image ? (
                                            <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">Sem foto</div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <h4 className="text-lg font-bold text-slate-900 mb-2">{service.name}</h4>
                                        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">{service.description}</p>
                                        <button className="mt-4 w-full bg-[var(--tenant-primary)] text-white font-bold rounded-(--theme-btn-radius) h-10 text-sm transition-all hover:opacity-90">
                                            Agendar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>

            {/* ─── Agendamento ─── */}
            <div data-section-id="agendamento" onClick={() => { selectSection('agendamento'); selectElement(null) }} className={cn("relative group/section cursor-pointer transition-all", selectedSection === 'agendamento' && "ring-2 ring-blue-500 ring-offset-2")}>
                <SchedulingSection whatsappNumber={data.contact.whatsapp} clientName={data.name} />
            </div>

            {data.founder.name && data.founder.name !== 'Seu Nome' && (
                <div data-section-id="about" onClick={() => { selectSection('about'); selectElement(null) }} className={cn("relative group/section cursor-pointer transition-all", selectedSection === 'about' && "ring-2 ring-blue-500 ring-offset-2")}>
                    <section className="py-16 bg-(--theme-color-background) overflow-hidden">
                        <div className="mx-auto max-w-7xl px-6">
                            <div className="grid @lg:grid-cols-2 gap-12 items-center">
                                <div className="relative">
                                    <div className="relative aspect-[4/5] max-w-sm mx-auto rounded-(--theme-card-radius) bg-(--theme-color-surface) overflow-hidden shadow-(--theme-card-shadow) border border-slate-100">
                                        {data.founder.imageUrl ? (
                                            <Image src={data.founder.imageUrl} alt={data.founder.name} fill className="object-cover object-top" sizes="400px" />
                                        ) : (
                                            <div className="w-full h-full bg-[var(--tenant-primary)]/10 flex items-center justify-center"><span className="text-6xl">👤</span></div>
                                        )}
                                        <div className="absolute bottom-4 left-4 right-4 p-4 bg-white/70 backdrop-blur-xl rounded-(--theme-card-radius) border border-white/60 shadow-sm">
                                            <p className="text-[8px] font-extrabold uppercase tracking-[0.2em] text-[var(--tenant-primary)] mb-0.5">Fundadora & Especialista</p>
                                            <h4 className="font-bold text-slate-900">{data.founder.name}</h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="inline-flex items-center gap-2 rounded-(--theme-btn-radius) border border-[var(--tenant-primary)]/20 bg-[var(--tenant-primary)]/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--tenant-primary)]">
                                        <Star className="h-3.5 w-3.5" style={{ fill: 'var(--tenant-primary)' }} /> Compromisso com a Excelência
                                    </div>
                                    <h2 className="text-3xl @lg:text-4xl font-bold tracking-tight text-slate-900 leading-[1.1]" style={{ fontFamily: 'var(--theme-font-heading)' }}>
                                        A <span className="text-[var(--tenant-primary)] italic">Expert</span> cuidando da sua autoestima.
                                    </h2>
                                    <div className="w-16 h-1 bg-[var(--tenant-primary)]/20 rounded-full" />
                                    <p className="text-lg text-slate-600 leading-relaxed font-light italic">{data.founder.bio}</p>
                                    <div className="pt-6 border-t border-slate-100">
                                        <h3 className="text-2xl font-bold text-[var(--tenant-primary)]" style={{ fontFamily: 'var(--theme-font-heading)' }}>{data.founder.name}</h3>
                                        <p className="text-sm text-slate-400 font-medium tracking-widest uppercase mt-1">{data.founder.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            )}

            {data.beforeAfter.length > 0 && (
                <div data-section-id="beforeAfter" onClick={() => { selectSection('beforeAfter'); selectElement(null) }} className={cn("relative group/section cursor-pointer transition-all", selectedSection === 'beforeAfter' && "ring-2 ring-blue-500 ring-offset-2")}>
                    <section className="py-16 bg-(--theme-color-surface) border-t border-slate-100">
                        <div className="mx-auto max-w-7xl px-6">
                            <h2 className="text-3xl font-bold text-center text-slate-900 mb-8" style={{ fontFamily: 'var(--theme-font-heading)' }}>
                                Resultados <span className="text-[var(--tenant-primary)] italic">Reais</span>
                            </h2>
                            <div className="grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 gap-6">
                                {data.beforeAfter.slice(0, 3).map((item, idx) => (
                                    <div key={item.id || `ba-${idx}`} className="bg-(--theme-color-background) rounded-(--theme-card-radius) border overflow-hidden shadow-sm">
                                        <div className="grid grid-cols-2 h-40">
                                            <div className="bg-slate-100 relative">
                                                {item.before && <img src={item.before} alt="Antes" className="w-full h-full object-cover" />}
                                                <span className="absolute bottom-1 left-2 text-[8px] font-bold text-white bg-black/50 px-1.5 py-0.5 rounded">ANTES</span>
                                            </div>
                                            <div className="bg-slate-100 relative">
                                                {item.after && <img src={item.after} alt="Depois" className="w-full h-full object-cover" />}
                                                <span className="absolute bottom-1 left-2 text-[8px] font-bold text-white bg-black/50 px-1.5 py-0.5 rounded">DEPOIS</span>
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <p className="text-sm font-bold text-slate-900">{item.title}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            )}

            {/* ─── FAQ ─── */}
            <div data-section-id="faq" onClick={() => { selectSection('faq'); selectElement(null) }} className={cn("relative group/section cursor-pointer transition-all", selectedSection === 'faq' && "ring-2 ring-blue-500 ring-offset-2")}>
                <section className="py-16 bg-(--theme-color-background) border-t border-slate-100">
                    <div className="mx-auto max-w-3xl px-6">
                        <h2 className="text-3xl font-bold text-center text-slate-900 mb-8" style={{ fontFamily: 'var(--theme-font-heading)' }}>
                            Principais <span className="text-[var(--tenant-primary)] italic">Dúvidas</span>
                        </h2>
                        <div className="space-y-3">
                            {data.faq.map((item, idx) => (
                                <div key={item.id || `faq-${idx}`} className="border border-slate-200 bg-(--theme-color-surface) px-6 py-4 rounded-(--theme-card-radius)">
                                    <p className="font-bold text-slate-900">{item.question}</p>
                                    <p className="text-slate-600 text-sm mt-2">{item.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>

            {/* ─── Contact ─── */}
            <div data-section-id="contact" onClick={() => { selectSection('contact'); selectElement(null) }} className={cn("relative group/section cursor-pointer transition-all", selectedSection === 'contact' && "ring-2 ring-blue-500 ring-offset-2")}>
                <section className="py-16 bg-(--theme-color-surface) border-t border-slate-200">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="grid @lg:grid-cols-2 gap-12">
                            <div className="space-y-8">
                                <h2 className="text-3xl font-bold tracking-tight text-slate-900" style={{ fontFamily: 'var(--theme-font-heading)' }}>
                                    Onde estamos <span className="text-[var(--tenant-primary)] italic">Localizados</span>
                                </h2>
                                <div className="space-y-6">
                                    <div className="flex gap-4 items-start">
                                        <div className="h-10 w-10 rounded-(--theme-btn-radius) bg-white border border-slate-200 flex items-center justify-center shrink-0">
                                            <MapPin className="h-5 w-5 text-[var(--tenant-primary)]" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 mb-0.5">Endereço</h4>
                                            <p className="text-slate-600 text-sm">{data.contact.address}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-start">
                                        <div className="h-10 w-10 rounded-(--theme-btn-radius) bg-white border border-slate-200 flex items-center justify-center shrink-0">
                                            <Phone className="h-5 w-5 text-[var(--tenant-primary)]" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 mb-0.5">Contato</h4>
                                            <p className="text-slate-600 text-sm">{data.contact.phone}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-200 rounded-(--theme-card-radius) h-64 flex items-center justify-center text-slate-400 text-sm">
                                Google Maps Preview
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* ─── Footer ─── */}
            <div data-section-id="footer" onClick={() => { selectSection('footer'); selectElement(null) }} className={cn("relative group/section cursor-pointer transition-all", selectedSection === 'footer' && "ring-2 ring-blue-500 ring-offset-2")}>
                <footer className="py-12 bg-[var(--tenant-primary)] relative overflow-hidden">
                    <div className="mx-auto max-w-7xl px-6 relative z-10">
                        <div className="grid grid-cols-1 @md:grid-cols-3 gap-8 items-center">
                            <div className="flex flex-col items-center @md:items-start gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-full overflow-hidden border border-white/30 bg-white/10 relative shrink-0">
                                        {data.avatarUrl ? (
                                            <Image src={data.avatarUrl} alt={data.name} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">{data.name.charAt(0)}</div>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-white tracking-widest uppercase text-xs">{data.name}</h3>
                                </div>
                                <p className="text-white/60 text-[10px] tracking-widest uppercase font-medium">{data.surname}</p>
                            </div>
                            <div className="flex flex-col items-center gap-4">
                                <div className="flex items-center gap-4">
                                    {data.contact.instagram && (
                                        <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20">
                                            <Instagram className="h-5 w-5" />
                                        </div>
                                    )}
                                    {data.contact.whatsapp && (
                                        <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20">
                                            <MessageCircle className="h-5 w-5" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col items-center @md:items-end gap-2">
                                <span className="text-white/40 text-[10px] uppercase tracking-widest">© {new Date().getFullYear()} Todos os direitos reservados</span>
                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/50">Powered by Agenda Online</span>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    )
}
