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

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "./ui/dialog"

export function SectionLibrary({
    isOpen,
    onClose,
    plugins,
    activeSectionIds,
    onAddSection,
    accentColor = "#10b981"
}: SectionLibraryProps) {
    const availablePlugins = plugins.filter(p => !activeSectionIds.includes(p.id))

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-2xl gap-0 p-0 overflow-hidden bg-background border-border">
                {/* Header */}
                <DialogHeader className="p-6 pb-0 relative">
                    <div className="space-y-1 text-left">
                        <div className="flex items-center gap-2">
                             <div className="flex -space-x-1">
                                <Sparkles className="h-4 w-4 text-amber-500 fill-amber-500" />
                            </div>
                            <DialogTitle className="text-xl font-black text-foreground tracking-tight italic">Cardápio de Seções</DialogTitle>
                        </div>
                        <DialogDescription className="text-xs font-medium">
                            Turbine sua página com funcionalidades exclusivas para seu negócio.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                {/* Grid */}
                <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                        {availablePlugins.length === 0 ? (
                            <div className="col-span-full py-12 text-center space-y-3">
                                <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center mx-auto">
                                    <Sparkles className="h-6 w-6 text-muted-foreground/30" />
                                </div>
                                <p className="text-sm font-bold text-muted-foreground italic">Você já ativou todas as seções disponíveis!</p>
                            </div>
                        ) : (
                            availablePlugins.map((plugin) => (
                                <div 
                                    key={plugin.id}
                                    className="group relative h-48 rounded-2xl border border-border bg-muted/30 p-5 flex flex-col justify-between hover:border-border/80 hover:bg-muted/50 transition-all cursor-default overflow-hidden"
                                >
                                    {/* Abstract background shape */}
                                    <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full opacity-[0.03] group-hover:opacity-[0.06] transition-opacity" style={{ backgroundColor: accentColor }} />
                                    
                                    <div className="space-y-3">
                                        <div className="h-10 w-10 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform" style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
                                            <plugin.icon className="h-5 w-5" />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-sm font-black text-foreground tracking-tight">{plugin.label}</h3>
                                            <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2">
                                                {getPluginDescription(plugin.id)}
                                            </p>
                                        </div>
                                    </div>

                                    <Button 
                                        size="sm"
                                        onClick={() => onAddSection(plugin.id)}
                                        className="w-full h-8 text-[10px] font-black uppercase tracking-widest bg-foreground hover:bg-foreground/90 text-background transition-colors"
                                    >
                                        <Plus className="mr-2 h-3 w-3" /> Ativar Seção
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Footer Tip */}
                <div className="bg-muted/30 border-t border-border p-4 text-center">
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                        DICA: Você pode reordenar as seções arrastando-as na barra lateral
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function getPluginDescription(id: string) {
    const desc: Record<string, string> = {
        trust: "Exiba suas conquistas, avaliações e números de clientes de forma dinâmica.",
        projetos: "Apresente seus principais serviços e destaques de forma organizada e elegante.",
        perfil: "Sua história, equipe e o diferencial do seu negócio de forma humana.",
        beforeAfter: "Mostre o impacto real do seu trabalho com fotos de antes e depois.",
        faq: "Responda às dúvidas mais frequentes das suas clientes de forma rápida.",
        contact: "Facilite o contato via WhatsApp, Instagram e localização do estabelecimento.",
        transparencia: "Demonstre assiduidade e compromisso com o gasto público de forma clara.",
        prestacaoContas: "Ações realizadas e em andamento para o cidadão acompanhar seu dia a dia.",
        services: "Apresente seus tratamentos e serviços com preços de forma atrativa.",
        team: "Apresente os profissionais do seu negócio e suas especialidades."
    }
    return desc[id] || "Nova funcionalidade para turbinar seu negócio."
}
