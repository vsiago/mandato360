"use client"

import React from "react"
import { useEditor } from "@/lib/editor/context"
import { EditableSection } from "./editable-section"
import { EditableText } from "./editable-text"
import { EditableImage } from "./editable-image"
import Image from "next/image"
import {
    Activity, ShieldCheck, MapPin, Phone,
    ArrowRight, MessageCircle, Share2, Award, Star, Menu,
    Mail, HeartHandshake, FileText, CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { resolveSectionBackground, buildGradientString } from "@/lib/editor/style-utils"
import { getTheme, generateThemeCSS } from "@/src/themes"

export function LivePreview() {
    const { data, breakpoint, selectSection, selectElement, selectedSection } = useEditor()
    const { primary, secondary } = data.colors || { primary: "#0F2B5B", secondary: "#0D9F6E" }

    const heroSectionBg = resolveSectionBackground(data, 'hero')
    const hasCustomHeroBg = Object.keys(heroSectionBg).length > 0

    const activeTheme = getTheme((data.theme as any) || "neutro")
    const themeCSSVars = generateThemeCSS(activeTheme, "light")
    const resolvedHeroImageUrl = data.heroImageUrl || "/site/hero.png"

    return (
        <div
            className="min-h-full bg-(--theme-color-background) font-sans text-slate-900 overflow-y-auto tenant-theme-root @container"
            data-theme={data.theme || "neutro"}
            style={{
                ...themeCSSVars,
                ['--tenant-primary' as string]: primary || themeCSSVars['--theme-color-primary'],
                ['--tenant-secondary' as string]: secondary || themeCSSVars['--theme-color-secondary'],
                ['--tenant-hover' as string]: secondary,
                ['--tenant-accent' as string]: secondary || '#eec584',
                ['--tenant-hero-overlay' as string]: primary,
                fontFamily: 'var(--theme-font-body)',
            } as React.CSSProperties}
        >
            {/* ─── Hero ─── */}
            <EditableSection sectionId="hero" label="Topo (Hero)">
                <div className="relative w-full">
                    <nav className="absolute top-0 left-0 right-0 z-50 bg-transparent">
                        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 @lg:py-6">
                            {data.logoUrl ? (
                                <img src={data.logoUrl} alt={data.name || "Logo"} className="h-12 @lg:h-16 w-auto object-contain" />
                            ) : (
                                <EditableText
                                    fieldPath="name"
                                    elementId="nav-name"
                                    sectionId="hero"
                                    as="span"
                                    className="font-bold text-white text-lg @lg:text-2xl"
                                    style={{ fontFamily: 'var(--theme-font-heading)' }}
                                />
                            )}
                            <div className="hidden @lg:flex items-center gap-8">
                                {["Início", "Projetos", "Sobre", "Contato"].map((item) => (
                                    <span key={item} className="text-sm font-bold text-white hover:text-white/80 cursor-default transition-colors">{item}</span>
                                ))}
                                <Button size="sm" className="bg-white text-[var(--tenant-primary)] hover:bg-slate-50 font-bold rounded-(--theme-btn-radius) px-6 shadow-sm">
                                    Quero Apoiar
                                </Button>
                            </div>
                        </div>
                    </nav>

                <section
                    className={cn(
                        "relative overflow-hidden transition-all duration-500",
                        data.heroImageSettings?.layout === 'center' 
                            ? "min-h-[90vh] @lg:min-h-screen flex flex-col justify-center items-center"
                            : "pb-10 @lg:pb-0 min-h-[80vh] @lg:min-h-[calc(100vh-80px)] flex items-center"
                    )}
                    style={{ 
                        paddingTop: data.heroImageSettings?.layout === 'center' ? '6rem' : '8rem',
                    }}
                >
                    {/* Background Layer: Base Color */}
                    <div className="absolute inset-0 z-0 bg-[var(--tenant-primary)]" />
                    
                    {/* Background Layer: Section Gradient/Visual Styles */}
                    {hasCustomHeroBg && <div className="absolute inset-0 z-1" style={heroSectionBg} />}
                    
                    {/* Background Layer: Hero Image */}
                    {resolvedHeroImageUrl && (
                        <>
                            {/* Mobile Image */}
                            <div className="absolute inset-0 z-2 @lg:hidden overflow-hidden">
                                <EditableImage fieldPath="heroImageUrl" elementId="hero-bg-image" sectionId="hero" className="w-full h-full">
                                    <Image
                                        src={resolvedHeroImageUrl}
                                        alt={data.name || "Hero"}
                                        fill
                                        sizes="100vw"
                                        priority
                                        className="object-cover"
                                        style={{
                                            objectPosition: `${data.heroImageSettings?.mobile?.positionX ?? data.heroImageSettings?.positionX ?? 50}% ${data.heroImageSettings?.mobile?.positionY ?? data.heroImageSettings?.positionY ?? 20}%`,
                                            transform: `scale(${data.heroImageSettings?.mobile?.zoom ?? data.heroImageSettings?.zoom ?? 1})`,
                                        }}
                                    />
                                </EditableImage>
                            </div>
                            {/* Desktop Image */}
                            <div className={cn("hidden @lg:block absolute z-2 overflow-hidden", data.heroImageSettings?.layout === 'center' ? "inset-0" : "top-0 right-0 bottom-0 w-[50%]")}>
                                <EditableImage fieldPath="heroImageUrl" elementId="hero-bg-image-desktop" sectionId="hero" className="w-full h-full">
                                    <Image
                                        src={resolvedHeroImageUrl}
                                        alt={data.name || "Hero"}
                                        fill
                                        sizes="50vw"
                                        priority
                                        className="object-cover transition-all duration-700"
                                        style={{
                                            objectPosition: `${data.heroImageSettings?.positionX ?? 50}% ${data.heroImageSettings?.positionY ?? 20}%`,
                                            transform: `scale(${data.heroImageSettings?.zoom ?? 1})`,
                                        }}
                                    />
                                </EditableImage>
                            </div>
                        </>
                    )}

                    {/* Gradient Overlay Layer (Accessibility & Premium Look) */}
                    {data.heroImageSettings?.overlayEnabled && data.heroImageSettings.overlay && (
                         <div 
                            className="absolute inset-0 z-3 pointer-events-none transition-opacity duration-500"
                            style={{ background: buildGradientString(data.heroImageSettings.overlay) }}
                         />
                    )}

                    <div className={cn("relative z-10 mx-auto max-w-7xl px-6 w-full", data.heroImageSettings?.layout === 'center' && "flex flex-col justify-center items-center")}>
                        <div className={cn("space-y-8", data.heroImageSettings?.layout === 'center' ? "max-w-3xl @lg:max-w-4xl flex flex-col items-center text-center" : "max-w-xl @lg:max-w-2xl")}>
                            <EditableText
                                fieldPath="heroBadge"
                                elementId="hero-badge"
                                sectionId="hero"
                                as="div"
                                className={cn("inline-flex items-center gap-2 rounded-(--theme-btn-radius) border border-white/20 bg-white/20 backdrop-blur-md px-4 py-1.5 text-[9px] @md:text-xs font-bold uppercase tracking-widest text-white shadow-sm")}
                            >
                                <HeartHandshake className="h-3.5 w-3.5 inline mr-1" />{data.heroBadge}
                            </EditableText>

                            <h1 className="text-5xl @md:text-6xl @lg:text-7xl font-sans tracking-tight text-white leading-[1.05]" style={{ fontFamily: 'var(--theme-font-heading)' }}>
                                <EditableText fieldPath="heroHeadline" elementId="hero-headline" sectionId="hero" as="span" />
                                {" "}
                                <EditableText fieldPath="heroHighlight" elementId="hero-highlight" sectionId="hero" as="span" className="font-light italic" style={{ color: 'var(--tenant-secondary)' }} />.
                            </h1>

                            <EditableText
                                fieldPath="description"
                                elementId="hero-description"
                                sectionId="hero"
                                as="p"
                                multiline
                                className={cn("text-lg @md:text-xl text-white/90 leading-relaxed font-light", data.heroImageSettings?.layout === 'center' ? "max-w-2xl mx-auto" : "max-w-xl")}
                            />

                            <div className={cn("flex flex-col @sm:flex-row gap-4 pt-4", data.heroImageSettings?.layout === 'center' && "justify-center w-full")}>
                                <Button size="lg" className="h-14 bg-white hover:bg-slate-50 text-[var(--tenant-primary)] text-lg font-bold px-10 rounded-(--theme-btn-radius) shadow-xl shadow-black/10 transition-all">
                                    Solicitar Demanda
                                </Button>
                                <Button size="lg" variant="ghost" className="h-14 w-full @sm:w-auto text-white bg-white/10 hover:bg-white/20 backdrop-blur-md font-bold px-8 rounded-full border border-white/20 shadow-sm transition-all flex items-center justify-center gap-3">
                                    Ver Projetos
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
                </div>
            </EditableSection>

            {/* ─── Trust / Conquistas ─── */}
            <EditableSection sectionId="trust" label="Conquistas e Números">
                <div className="bg-slate-900 py-6 overflow-hidden border-y border-white/5">
                    <div className="flex items-center gap-12 whitespace-nowrap px-6 overflow-x-auto">
                        {(data.trustBadges || []).map((badge, i) => (
                            <div key={i} className="flex items-center gap-3 shrink-0">
                                <CheckCircle2 className="h-5 w-5 text-[var(--tenant-secondary)]" />
                                <span className="text-white font-bold uppercase tracking-[0.15em] text-[10px]">
                                    {badge.text}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </EditableSection>

            {/* ─── Projetos ─── */}
            <EditableSection sectionId="projetos" label="Ações e Projetos">
                <section className="py-16 bg-(--theme-color-background)">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="mb-12 text-center text-stone-900">
                            <h2 className="text-3xl @md:text-4xl font-bold tracking-tight mb-4" style={{ fontFamily: 'var(--theme-font-heading)' }}>
                                Nossas <span className="text-[var(--tenant-primary)] italic">Ações</span>
                            </h2>
                            <p className="text-base text-slate-600">Projetos de lei e iniciativas para a nossa cidade.</p>
                        </div>
                        <div className="grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 gap-(--theme-section-gap)">
                            {(data.projetos || []).slice(0, 3).map((projeto) => (
                                <div key={projeto.id} className="group bg-(--theme-color-surface) rounded-(--theme-card-radius) border border-slate-100 hover:border-[var(--tenant-primary)]/20 hover:shadow-(--theme-card-shadow) transition-all overflow-hidden shadow-sm">
                                    <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                                        {projeto.image ? (
                                            <img src={projeto.image} alt={projeto.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300"><FileText className="w-8 h-8" /></div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <h4 className="text-lg font-bold text-slate-900 mb-2">{projeto.name}</h4>
                                        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">{projeto.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </EditableSection>

            {/* ─── Perfil ─── */}
            <EditableSection sectionId="perfil" label="Perfil do Vereador">
                <section className="py-16 bg-(--theme-color-background) overflow-hidden">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="relative">
                                <div className="relative aspect-[4/5] max-w-sm mx-auto rounded-(--theme-card-radius) bg-(--theme-color-surface) overflow-hidden shadow-(--theme-card-shadow) border border-slate-100">
                                    {data.perfil?.imageUrl ? (
                                        <Image src={data.perfil.imageUrl} alt={data.perfil.name || "Foto"} fill className="object-cover object-top" sizes="400px" />
                                    ) : (
                                        <div className="w-full h-full bg-[var(--tenant-primary)]/10 flex items-center justify-center"><span className="text-6xl">👤</span></div>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-6">
                                <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 font-heading" style={{ fontFamily: 'var(--theme-font-heading)' }}>
                                    Trabalho e <span className="text-[var(--tenant-primary)] italic">Transparência</span>.
                                </h2>
                                <p className="text-lg text-slate-600 leading-relaxed font-light italic">{data.perfil?.bio}</p>
                                <div className="pt-6 border-t border-slate-100">
                                    <h3 className="text-2xl font-bold text-[var(--tenant-primary)]">{data.perfil?.name}</h3>
                                    <p className="text-sm text-slate-400 font-medium tracking-widest uppercase mt-1">{data.perfil?.role}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </EditableSection>

            {/* ─── Antes/Depois e FAQ (simplified for mandatos) ─── */}
            <EditableSection sectionId="beforeAfter" label="Resultados Reais (Antes/Depois)">
                <section className="py-16 bg-(--theme-color-surface) border-t border-slate-100">
                    <div className="mx-auto max-w-7xl px-6">
                        <h2 className="text-3xl font-bold text-center text-slate-900 mb-8" style={{ fontFamily: 'var(--theme-font-heading)' }}>
                            Transformando a <span className="text-[var(--tenant-primary)] italic">Cidade</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(data.beforeAfter || []).slice(0, 3).map((item, idx) => (
                                <div key={idx} className="bg-(--theme-color-background) rounded-3xl border overflow-hidden shadow-sm">
                                    <div className="grid grid-cols-2 h-40">
                                        <div className="relative">{item.before && <img src={item.before} alt="Antes" className="w-full h-full object-cover grayscale" />}</div>
                                        <div className="relative">{item.after && <img src={item.after} alt="Depois" className="w-full h-full object-cover" />}</div>
                                    </div>
                                    <div className="p-4"><p className="text-sm font-bold text-slate-900">{item.title}</p></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </EditableSection>

            {/* ─── Footer ─── */}
            <EditableSection sectionId="footer" label="Rodapé">
                <footer className="py-12 bg-[var(--tenant-primary)] text-white/60">
                    <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex flex-col items-center md:items-start gap-2">
                             <h3 className="font-black text-white uppercase text-xl">{data.name}</h3>
                             <p className="text-xs tracking-widest uppercase">Mandato Participativo</p>
                        </div>
                        <div className="flex items-center gap-6">
                             {data.contact?.instagram && <Share2 className="w-6 h-6" />}
                             {data.contact?.whatsapp && <MessageCircle className="w-6 h-6" />}
                        </div>
                        <p className="text-[10px] uppercase font-bold">© {new Date().getFullYear()} - Mandato360</p>
                    </div>
                </footer>
            </EditableSection>
        </div>
    )
}
