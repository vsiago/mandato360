"use client"

import { useEditor } from "@/lib/editor/context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
    Plus, Trash2, GripVertical, FileText, 
    HelpCircle, Award, ChevronRight, Hash,
    ArrowLeftRight, Edit3
} from "lucide-react"

export function ContentEditorPanel() {
    const { data, selectedSection, updateField } = useEditor()

    if (!selectedSection) return null

    const renderProjetos = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-emerald-500" />
                    <h3 className="text-sm font-bold uppercase tracking-tighter">Ações e Projetos</h3>
                </div>
                <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs" onClick={() => {
                    const newProj = { id: Date.now().toString(), name: "Novo Projeto", description: "Descrição do projeto...", image: "" }
                    updateField("projetos", [...data.projetos, newProj as any])
                }}>
                    <Plus className="h-3 w-3 mr-1" /> Add
                </Button>
            </div>
            
            <div className="space-y-4">
                {data.projetos.map((proj, idx) => (
                    <div key={proj.id || idx} className="p-4 rounded-2xl border border-stone-100 bg-stone-50/50 space-y-3 relative group">
                        <button 
                            className="absolute top-2 right-2 p-1.5 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            onClick={() => {
                                const newProjs = data.projetos.filter((_, i) => i !== idx)
                                updateField("projetos", newProjs)
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                        
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-stone-400">Título do Projeto</Label>
                            <Input 
                                value={proj.name} 
                                onChange={(e) => {
                                    const newProjs = [...data.projetos]
                                    newProjs[idx] = { ...newProjs[idx], name: e.target.value }
                                    updateField("projetos", newProjs)
                                }}
                                className="h-9 rounded-xl border-stone-200 bg-white font-bold text-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-stone-400">Descrição Curta</Label>
                            <Textarea 
                                value={projeto.description} 
                                onChange={(e) => {
                                    const newProjs = [...data.projetos]
                                    newProjs[idx] = { ...newProjs[idx], description: e.target.value }
                                    updateField("projetos", newProjs)
                                }}
                                className="rounded-xl border-stone-200 bg-white text-xs min-h-[80px]"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

    const renderFAQ = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-emerald-500" />
                    <h3 className="text-sm font-bold uppercase tracking-tighter">Perguntas Frequentes</h3>
                </div>
                <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs" onClick={() => {
                    const newFaq = { id: Date.now().toString(), question: "Nova Pergunta?", answer: "Resposta..." }
                    updateField("faq", [...data.faq, newFaq])
                }}>
                    <Plus className="h-3 w-3 mr-1" /> Add
                </Button>
            </div>
            
            <div className="space-y-4">
                {data.faq.map((item, idx) => (
                    <div key={item.id || idx} className="p-4 rounded-2xl border border-stone-100 bg-stone-50/50 space-y-3 relative group">
                         <button 
                            className="absolute top-2 right-2 p-1.5 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            onClick={() => {
                                const newFaq = data.faq.filter((_, i) => i !== idx)
                                updateField("faq", newFaq)
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-stone-400">Pergunta</Label>
                            <Input 
                                value={item.question} 
                                onChange={(e) => {
                                    const newFaq = [...data.faq]
                                    newFaq[idx] = { ...newFaq[idx], question: e.target.value }
                                    updateField("faq", newFaq)
                                }}
                                className="h-9 rounded-xl border-stone-200 bg-white font-bold text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-stone-400">Resposta</Label>
                            <Textarea 
                                value={item.answer} 
                                onChange={(e) => {
                                    const newFaq = [...data.faq]
                                    newFaq[idx] = { ...newFaq[idx], answer: e.target.value }
                                    updateField("faq", newFaq)
                                }}
                                className="rounded-xl border-stone-200 bg-white text-xs min-h-[80px]"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

    const renderTrust = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-emerald-500" />
                    <h3 className="text-sm font-bold uppercase tracking-tighter">Conquistas e Números</h3>
                </div>
                <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs" onClick={() => {
                    updateField("trustBadges", [...data.trustBadges, { text: "Nova Conquista", icon: "Check" }])
                }}>
                    <Plus className="h-3 w-3 mr-1" /> Add
                </Button>
            </div>
            
            <div className="space-y-2">
                {data.trustBadges.map((badge, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-stone-50 rounded-xl border border-stone-100 group">
                        <GripVertical className="h-4 w-4 text-stone-300" />
                        <Input 
                            value={badge.text} 
                            onChange={(e) => {
                                const newBadges = [...data.trustBadges]
                                newBadges[idx] = { ...newBadges[idx], text: e.target.value }
                                updateField("trustBadges", newBadges)
                            }}
                            className="h-8 border-transparent bg-transparent focus-visible:bg-white focus-visible:ring-emerald-500 font-bold text-xs"
                        />
                         <button 
                            className="p-1 opacity-0 group-hover:opacity-100 hover:text-red-500"
                            onClick={() => {
                                const newBadges = data.trustBadges.filter((_, i) => i !== idx)
                                updateField("trustBadges", newBadges)
                            }}
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )

    const renderBeforeAfter = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <ArrowLeftRight className="h-4 w-4 text-emerald-500" />
                    <h3 className="text-sm font-bold uppercase tracking-tighter">Resultados Reais</h3>
                </div>
            </div>
            <div className="space-y-4">
                {data.beforeAfter.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-2xl border border-stone-100 bg-stone-50/50 space-y-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-stone-400">Título da Transformação</Label>
                            <Input 
                                value={item.title} 
                                onChange={(e) => {
                                    const newItems = [...data.beforeAfter]
                                    newItems[idx] = { ...newItems[idx], title: e.target.value }
                                    updateField("beforeAfter", newItems)
                                }}
                                className="h-9 rounded-xl border-stone-200 bg-white font-bold text-sm"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <Label className="text-[8px] font-black uppercase">URL Foto Antes</Label>
                                <Input 
                                    value={item.before} 
                                    onChange={(e) => {
                                        const newItems = [...data.beforeAfter]
                                        newItems[idx] = { ...newItems[idx], before: e.target.value }
                                        updateField("beforeAfter", newItems)
                                    }}
                                    className="h-7 text-[10px] rounded-lg"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[8px] font-black uppercase">URL Foto Depois</Label>
                                <Input 
                                    value={item.after} 
                                    onChange={(e) => {
                                        const newItems = [...data.beforeAfter]
                                        newItems[idx] = { ...newItems[idx], after: e.target.value }
                                        updateField("beforeAfter", newItems)
                                    }}
                                    className="h-7 text-[10px] rounded-lg"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

    return (
        <div className="flex flex-col h-full bg-white dark:bg-stone-950 overflow-y-auto border-l border-emerald-500/10">
            <div className="p-4 border-b border-emerald-500/10 bg-emerald-500/5">
                <div className="flex items-center gap-2">
                    <Edit3 className="h-4 w-4 text-emerald-600" />
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-tighter">Editar Conteúdo</h3>
                </div>
            </div>

            <div className="p-5 flex-1">
                {selectedSection === "projetos" && renderProjetos()}
                {selectedSection === "faq" && renderFAQ()}
                {selectedSection === "trust" && renderTrust()}
                {selectedSection === "beforeAfter" && renderBeforeAfter()}
                
                {!["projetos", "faq", "trust", "beforeAfter"].includes(selectedSection) && (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-center opacity-40 grayscale">
                        <ChevronRight className="h-12 w-12 text-stone-300 mb-4 animate-pulse" />
                        <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Edite diretamente na<br />prévia do site</p>
                    </div>
                )}
            </div>
        </div>
    )
}
