"use client"

import { cn } from "../lib/utils"
import { 
    X, Sparkles, Plus, 
    Award, FileText, User, 
    ArrowLeftRight, HelpCircle, 
    Shield, Gem 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { EditorPlugin } from "../types"

interface SectionLibraryProps {
    isOpen: boolean
    onClose: () => void
    plugins: EditorPlugin[]
    activeSectionIds: string[]
    onAddSection: (pluginId: string) => void
    accentColor?: string
}

export function SectionLibrary({
    isOpen,
    onClose,
    plugins,
    activeSectionIds,
    onAddSection,
    accentColor = "#10b981"
}: SectionLibraryProps) {
    if (!isOpen) return null

    const availablePlugins = plugins.filter(p => !activeSectionIds.includes(p.id))

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
                {/* Header */}
                <div className="relative p-6 pb-0 flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                             <div className="flex -space-x-1">
                                <Sparkles className="h-4 w-4 text-amber-500 fill-amber-500" />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight italic">Cardápio de Seções</h2>
                        </div>
                        <p className="text-xs text-slate-400 font-medium">Turbine sua página com funcionalidades exclusivas para seu mandato.</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="h-8 w-8 rounded-full flex items-center justify-center text-slate-300 hover:text-slate-900 hover:bg-slate-100 transition-all"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Grid */}
                <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                        {availablePlugins.length === 0 ? (
                            <div className="col-span-full py-12 text-center space-y-3">
                                <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto">
                                    <Sparkles className="h-6 w-6 text-slate-200" />
                                </div>
                                <p className="text-sm font-bold text-slate-400 italic">Você já ativou todas as seções disponíveis!</p>
                            </div>
                        ) : (
                            availablePlugins.map((plugin) => (
                                <div 
                                    key={plugin.id}
                                    className="group relative h-48 rounded-2xl border border-slate-100 bg-slate-50/50 p-5 flex flex-col justify-between hover:border-slate-200 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-default overflow-hidden"
                                >
                                    {/* Abstract background shape */}
                                    <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full opacity-[0.03] group-hover:opacity-[0.06] transition-opacity" style={{ backgroundColor: accentColor }} />
                                    
                                    <div className="space-y-3">
                                        <div className="h-10 w-10 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform" style={{ backgroundColor: `${accentColor}10`, color: accentColor }}>
                                            <plugin.icon className="h-5 w-5" />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-sm font-black text-slate-900 tracking-tight">{plugin.label}</h3>
                                            <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2">
                                                {getPluginDescription(plugin.id)}
                                            </p>
                                        </div>
                                    </div>

                                    <Button 
                                        size="sm"
                                        onClick={() => onAddSection(plugin.id)}
                                        className="w-full h-8 text-[10px] font-black uppercase tracking-widest bg-slate-900 hover:bg-slate-800 transition-colors"
                                    >
                                        <Plus className="mr-2 h-3 w-3" /> Ativar Seção
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Footer Tip */}
                <div className="bg-slate-50/50 border-t border-slate-50 p-4 text-center">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        DICA: Você pode reordenar as seções arrastando-as na barra lateral
                    </p>
                </div>
            </div>
        </div>
    )
}

function getPluginDescription(id: string) {
    const desc: Record<string, string> = {
        trust: "Exiba suas conquistas e números em uma faixa dinâmica que chama a atenção.",
        projetos: "Apresente seus projetos de lei e ações sociais de forma organizada e elegante.",
        perfil: "Sua história, biografia e compromissos com o eleitor de forma humana.",
        beforeAfter: "Mostre o impacto real do seu antes e depois em obras e melhorias municipais.",
        faq: "Responda às dúvidas mais frequentes da população de forma rápida e clara.",
        contact: "Facilite o contato via WhatsApp, E-mail e redes sociais para seus eleitores.",
        transparencia: "Demonstre assiduidade e compromisso com o gasto público de forma clara.",
        prestacaoContas: "Ações realizadas e em andamento para o cidadão acompanhar seu dia a dia."
    }
    return desc[id] || "Nova funcionalidade para turbinar seu mandato digital."
}
