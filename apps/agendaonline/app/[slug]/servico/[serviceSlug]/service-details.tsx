"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft } from "lucide-react"
import { Clock } from "lucide-react"
import { Star } from "lucide-react"
import { ShieldCheck } from "lucide-react"
import { CheckCircle2 } from "lucide-react"
import { Plus } from "lucide-react"
import { Minus } from "lucide-react"
import { ArrowRight } from "lucide-react"
import { ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { TenantData, TenantService } from "@/lib/tenant-types"

interface ServiceClientProps {
    tenant: TenantData
    service: TenantService
    relatedServices?: TenantService[]
}

export function ServiceClient({ tenant, service, relatedServices = [] }: ServiceClientProps) {
    const [selectedAddons, setSelectedAddons] = useState<string[]>([])
    
    const { primary, hover } = tenant.colors
    
    const basePrice = Number(service.price) || 0
    const addonsTotal = (service.addons || [])
        .filter(a => selectedAddons.includes(a.name))
        .reduce((sum, a) => sum + Number(a.price), 0)
    
    const totalPrice = basePrice + addonsTotal

    const toggleAddon = (name: string) => {
        setSelectedAddons(prev => 
            prev.includes(name) 
                ? prev.filter(a => a !== name) 
                : [...prev, name]
        )
    }

    const handleAgendar = () => {
        const addonsText = selectedAddons.length > 0 
            ? `\nAdicionais: ${selectedAddons.join(", ")}` 
            : ""
        const text = `Olá! Tenho interesse no serviço:\n*${service.name}*${addonsText}\nValor Total: R$ ${totalPrice.toFixed(2)}\nGostaria de agendar um horário.`
        window.open(`https://wa.me/${tenant.contact.whatsapp}?text=${encodeURIComponent(text)}`, '_blank')
    }

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-tenant-primary/10 selection:text-tenant-primary">
            <style dangerouslySetInnerHTML={{
                __html: `
                :root {
                    --tenant-primary: ${primary || '#8c6239'};
                    --tenant-hover: ${hover || '#6d4a2a'};
                }
                .bg-tenant-primary { background-color: var(--tenant-primary); }
                .text-tenant-primary { color: var(--tenant-primary); }
                .border-tenant-primary { border-color: var(--tenant-primary); }
                .shadow-premium { shadow: 0 20px 40px -15px rgba(0,0,0,0.1); }
            `}} />

            {/* Header / Nav */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100 flex justify-center">
                <div className="w-full max-w-screen-2xl px-6 lg:px-12 h-20 flex items-center justify-between">
                    <Link href={`/${tenant.slug}`} className="group flex items-center gap-2 text-slate-700 hover:text-tenant-primary transition-colors">
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold text-sm tracking-tight">Voltar</span>
                    </Link>
                    <span className="font-black text-xs tracking-[0.3em] uppercase text-slate-400 pl-10">{tenant.name}</span>
                    <div className="hidden lg:block">
                         <Button variant="ghost" className="text-sm font-bold text-tenant-primary" onClick={handleAgendar}>Agendar Agora</Button>
                    </div>
                    <div className="lg:hidden w-10" />
                </div>
            </header>

            <main className="pt-24 pb-48">
                {/* Immersive Hero Section - Concept UI */}
                <section className="relative min-h-[85vh] flex items-center justify-center mb-16 lg:mb-32">
                    {/* Background Layer with Depth */}
                    <div className="absolute inset-0 z-0 overflow-hidden">
                        {service.image || service.longImage ? (
                            <div className="relative w-full h-full">
                                <Image 
                                    src={service.image || service.longImage || ""} 
                                    alt={service.name}
                                    fill
                                    priority
                                    className="object-cover opacity-30 lg:opacity-50 scale-105"
                                />
                                <div className="absolute inset-0 bg-linear-to-b from-white via-white/40 to-white" />
                            </div>
                        ) : (
                            <div className="w-full h-full bg-slate-50" />
                        )}
                    </div>

                    <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-32 pb-12 lg:py-24">
                        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
                            {/* Content Side */}
                            <div className="w-full lg:w-7/12 space-y-10 order-2 lg:order-1">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-8"
                                >
                                    <div className="space-y-6">
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-tenant-primary/5 text-tenant-primary border border-tenant-primary/10 text-[11px] font-black uppercase tracking-[0.25em] shadow-sm"
                                        >
                                            <Star className="w-3.5 h-3.5 fill-tenant-primary" /> Serviço Premium
                                        </motion.div>
                                        
                                        <h1 className="text-6xl lg:text-9xl font-(family-name:--font-playfair) font-black text-slate-900 leading-[0.8] tracking-tighter drop-shadow-sm">
                                            {service.name}
                                        </h1>

                                        <div className="flex flex-wrap items-center gap-5 pt-4">
                                            <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50">
                                                <div className="w-8 h-8 rounded-full bg-tenant-primary/10 flex items-center justify-center">
                                                    <Clock className="w-4 h-4 text-tenant-primary" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 leading-none mb-1">Duração</span>
                                                    <span className="text-sm font-black text-slate-900">{service.duration} min</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50">
                                                <div className="w-8 h-8 rounded-full bg-tenant-primary/10 flex items-center justify-center">
                                                    <ShieldCheck className="w-4 h-4 text-tenant-primary" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 leading-none mb-1">Qualidade</span>
                                                    <span className="text-sm font-black text-slate-900">Garantia Pro</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-slate-500 text-xl lg:text-2xl font-medium leading-relaxed max-w-2xl border-l-4 border-tenant-primary/20 pl-8 py-2 italic font-(family-name:--font-playfair)">
                                        "{service.description}"
                                    </div>
                                </motion.div>
                            </div>

                            {/* Image Side - Floating Mockup Style */}
                            <div className="w-full lg:w-5/12 order-1 lg:order-2">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                    transition={{ duration: 0.8 }}
                                    className="relative aspect-square lg:aspect-4/5 w-full max-w-md mx-auto group"
                                >
                                    {/* Decorative Layers */}
                                    <div className="absolute -inset-4 bg-tenant-primary/5 rounded-[3rem] blur-2xl group-hover:bg-tenant-primary/10 transition-colors" />
                                    <div className="absolute inset-4 border border-tenant-primary/10 rounded-[2.5rem] -rotate-3 z-0" />
                                    
                                    <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden shadow-2xl shadow-tenant-primary/20 bg-slate-100 z-10 border-4 border-white">
                                        {service.image || service.longImage ? (
                                            <Image 
                                                src={service.image || service.longImage || ""} 
                                                alt={service.name}
                                                fill
                                                priority
                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ImageIcon className="w-20 h-20 text-slate-200" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                                        
                                        {/* Floating Badge on Image */}
                                        <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl">
                                            <div className="flex items-center justify-between gap-4">
                                                <span className="text-white text-xs font-black uppercase tracking-widest">Procedimento Exclusivo</span>
                                                <div className="flex gap-1">
                                                    {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-white/80 text-white/80" />)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="w-full max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-16 lg:gap-32">
                    {/* Main Content Area */}
                    <div className="w-full lg:w-7/12 space-y-24">
                        {/* Description Section */}
                        <div className="space-y-6">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">O Procedimento</h2>
                            <div className="text-slate-600 leading-relaxed text-xl font-medium prose prose-slate max-w-none">
                                {service.fullDescription || service.description}
                            </div>
                        </div>

                        {/* Features / Included */}
                        {(service.features && service.features.length > 0) && (
                            <div className="space-y-8">
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight">O que está incluso</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {service.features.map((feature, idx) => (
                                        <motion.div 
                                            key={idx}
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="flex items-center gap-4 p-5 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-tenant-primary/30 transition-all"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-tenant-primary/10 transition-colors">
                                                <CheckCircle2 className="w-5 h-5 text-tenant-primary" />
                                            </div>
                                            <span className="text-slate-700 font-bold">{feature.item}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Agende Também (Upsell) */}
                        {relatedServices.length > 0 && (
                            <div className="space-y-8 pt-8 border-t border-slate-100">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Agende também</h2>
                                    <div className="relative w-full sm:w-64">
                                        <Plus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input 
                                            type="text" 
                                            placeholder="Buscar outros serviços..."
                                            className="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-tenant-primary/20 transition-all outline-hidden"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {relatedServices.map((rs) => (
                                        <Link 
                                            key={rs.id} 
                                            href={`/${tenant.slug}/servico/${rs.slug}`}
                                            className="group block bg-white border border-slate-100 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500"
                                        >
                                            <div className="relative h-40">
                                                <Image src={rs.image} alt={rs.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                                            </div>
                                            <div className="p-6">
                                                <h3 className="font-black text-lg text-slate-900 mb-1">{rs.name}</h3>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-tenant-primary font-black">R$ {rs.price}</span>
                                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-tenant-primary group-hover:text-white transition-all">
                                                        <Plus className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar / Order Selection */}
                    <aside className="w-full lg:w-5/12 space-y-8">
                        <div className="sticky top-24 space-y-8">
                            {/* Add-ons Card */}
                            {(service.addons && service.addons.length > 0) && (
                                <div className="bg-slate-50/50 backdrop-blur-xl border border-slate-100 rounded-[3rem] p-6 lg:p-10 space-y-10 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Cuidado Extra</h2>
                                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Turbine sua Experiência</p>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white px-4 py-2 rounded-full shadow-xs border border-slate-100">Opcionais</span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        {service.addons.map((addon, idx) => {
                                            const isSelected = selectedAddons.includes(addon.name)
                                            return (
                                                <button 
                                                    key={idx}
                                                    onClick={() => toggleAddon(addon.name)}
                                                    className={`w-full group flex items-center justify-between p-5 rounded-[2rem] border transition-all duration-300 ${
                                                        isSelected 
                                                            ? 'bg-white border-tenant-primary shadow-2xl shadow-tenant-primary/5' 
                                                            : 'bg-white/40 border-slate-100 hover:border-tenant-primary/20 hover:bg-white'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-5">
                                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                                                            isSelected ? 'bg-tenant-primary text-white scale-110' : 'bg-slate-100 text-slate-300'
                                                        }`}>
                                                            {isSelected ? <CheckCircle2 className="w-6 h-6" /> : <Plus className="w-5 h-5" />}
                                                        </div>
                                                        <div className="text-left">
                                                            <div className={`font-black text-lg tracking-tight leading-none mb-1 ${isSelected ? 'text-tenant-primary' : 'text-slate-900'}`}>
                                                                {addon.name}
                                                            </div>
                                                            <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">Sugerido para você</span>
                                                        </div>
                                                    </div>
                                                    <div className={`flex flex-col items-end`}>
                                                        <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isSelected ? 'text-tenant-primary/60' : 'text-slate-400'}`}>Adicional</span>
                                                        <span className={`font-black text-lg ${isSelected ? 'text-tenant-primary' : 'text-slate-700'}`}>
                                                            + R$ {Number(addon.price).toFixed(2)}
                                                        </span>
                                                    </div>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Trust Badge */}
                            <div className="flex items-center gap-4 p-6 bg-tenant-primary/5 rounded-3xl border border-tenant-primary/10">
                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-premium">
                                    <ShieldCheck className="w-6 h-6 text-tenant-primary" />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900">Agendamento Seguro</h4>
                                    <p className="text-xs text-slate-600 font-bold">Confirmação instantânea via WhatsApp</p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            {/* Sticky Bottom Bar - Ultra Premium Refined */}
            <div className="fixed bottom-0 left-0 right-0 z-50 p-6 lg:p-12 pointer-events-none">
                <motion.div 
                    initial={{ y: 200, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", damping: 30, stiffness: 200 }}
                    className="max-w-3xl mx-auto flex items-center justify-between gap-6 lg:gap-12 bg-slate-900 p-4 lg:p-5 rounded-[3rem] border border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] pointer-events-auto"
                >
                    <div className="flex flex-col pl-6">
                        <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] leading-none mb-1.5 selection:bg-transparent">Investimento Total</span>
                        <div className="flex items-baseline gap-1.5 select-none">
                            <span className="text-sm font-black text-tenant-primary">R$</span>
                            <span className="text-4xl lg:text-5xl font-black text-white tracking-tighter">
                                {totalPrice.toFixed(2)}
                            </span>
                        </div>
                    </div>
                    <Button 
                        size="lg"
                        className="flex-1 h-16 lg:h-24 rounded-[2.5rem] bg-tenant-primary hover:bg-tenant-hover text-white font-black text-xl lg:text-2xl shadow-2xl shadow-tenant-primary/40 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-4 group cursor-pointer"
                        onClick={handleAgendar}
                    >
                        <span>Reservar Horário</span>
                        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-tenant-primary transition-all duration-500">
                            <ArrowRight className="w-6 h-6 lg:w-7 lg:h-7" />
                        </div>
                    </Button>
                </motion.div>
            </div>
        </div>
    )
}
