"use client"

import { useEditor } from "@/lib/editor/context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ImageUpload } from "@/components/ui/image-upload"
import { 
    Plus, Trash2, GripVertical, FileText, 
    HelpCircle, Award, ChevronRight, Hash,
    ArrowLeftRight, Edit3, User, Phone, Mail,
    MapPin, MessageCircle, Globe, PanelTop, Image as ImageIcon
} from "lucide-react"

export function ContentEditorPanel() {
    const { data, selectedSection, updateField, updateNestedField } = useEditor()

    if (!selectedSection) return null

    /* ═══ HEADER ═══ */
    const renderHeader = () => (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <PanelTop className="h-4 w-4 text-emerald-500" />
                <h3 className="text-sm font-bold uppercase tracking-tighter">Topo do Site</h3>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-stone-400">Logo do Mandato</Label>
                    <ImageUpload
                        value={data.logoUrl}
                        onChange={(url) => updateField("logoUrl", url)}
                        className="aspect-[3/1] h-24"
                    />
                    <p className="text-[9px] text-stone-400 italic">Recomendado: PNG transparente, 400×150px</p>
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-stone-400">Nome exibido (se sem logo)</Label>
                    <Input
                        value={data.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        className="h-9 rounded-xl border-stone-200 bg-white font-bold text-sm"
                        placeholder="Nome do Vereador"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-stone-400">Cor de fundo do menu (scroll)</Label>
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-stone-100 bg-stone-50/50">
                        <div className="relative shrink-0">
                            <div className="h-10 w-10 rounded-lg border shadow-sm" style={{ backgroundColor: data.headerBgColor || data.colors.primary }} />
                            <input type="color" value={data.headerBgColor || data.colors.primary} onChange={e => updateField("headerBgColor", e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                        <div className="flex-1 space-y-1">
                            <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Hex</span>
                            <Input value={data.headerBgColor || data.colors.primary} onChange={e => updateField("headerBgColor", e.target.value)} className="h-8 bg-white border-stone-100 rounded-lg px-2 text-xs font-mono font-bold" placeholder="#0F2B5B" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    /* ═══ PERFIL ═══ */
    const renderPerfil = () => (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <User className="h-4 w-4 text-emerald-500" />
                <h3 className="text-sm font-bold uppercase tracking-tighter">Perfil do Vereador</h3>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-stone-400">Foto do Vereador</Label>
                    <ImageUpload
                        value={data.perfil?.imageUrl}
                        onChange={(url) => {
                            updateField("perfil", { ...data.perfil, imageUrl: url })
                        }}
                        className="aspect-[4/5] max-h-56"
                    />
                    <p className="text-[9px] text-stone-400 italic">Foto profissional, formato retrato (4:5)</p>
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-stone-400">Nome Completo</Label>
                    <Input
                        value={data.perfil?.name || ""}
                        onChange={(e) => updateField("perfil", { ...data.perfil, name: e.target.value })}
                        className="h-9 rounded-xl border-stone-200 bg-white font-bold text-sm"
                        placeholder="Dr. João da Silva"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-stone-400">Cargo / Função</Label>
                    <Input
                        value={data.perfil?.role || ""}
                        onChange={(e) => updateField("perfil", { ...data.perfil, role: e.target.value })}
                        className="h-9 rounded-xl border-stone-200 bg-white font-bold text-sm"
                        placeholder="Vereador Titular"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-stone-400">Biografia / Descrição</Label>
                    <Textarea
                        value={data.perfil?.bio || ""}
                        onChange={(e) => updateField("perfil", { ...data.perfil, bio: e.target.value })}
                        className="rounded-xl border-stone-200 bg-white text-xs min-h-[120px]"
                        placeholder="Médico e gestor público focado em resultados reais para a população..."
                    />
                </div>
            </div>
        </div>
    )

    /* ═══ CONTACT ═══ */
    const renderContact = () => (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-4 w-4 text-emerald-500" />
                <h3 className="text-sm font-bold uppercase tracking-tighter">Informações de Contato</h3>
            </div>

            <div className="space-y-4">
                {([
                    { key: "phone", label: "Telefone", icon: Phone, placeholder: "(21) 99999-8888" },
                    { key: "whatsapp", label: "WhatsApp", icon: MessageCircle, placeholder: "(21) 99999-8888" },
                    { key: "email", label: "E-mail", icon: Mail, placeholder: "contato@mandato.com.br" },
                    { key: "address", label: "Endereço / Gabinete", icon: MapPin, placeholder: "Câmara Municipal de..." },
                    { key: "instagram", label: "Instagram", icon: Globe, placeholder: "@vereador" },
                ] as const).map(({ key, label, icon: Icon, placeholder }) => (
                    <div key={key} className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-stone-400 flex items-center gap-1.5">
                            <Icon className="h-3 w-3" /> {label}
                        </Label>
                        <Input
                            value={(data.contact as any)?.[key] || ""}
                            onChange={(e) => updateField("contact", { ...data.contact, [key]: e.target.value })}
                            className="h-9 rounded-xl border-stone-200 bg-white text-sm"
                            placeholder={placeholder}
                        />
                    </div>
                ))}
            </div>
        </div>
    )

    /* ═══ FOOTER ═══ */
    const renderFooter = () => (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <Globe className="h-4 w-4 text-emerald-500" />
                <h3 className="text-sm font-bold uppercase tracking-tighter">Rodapé do Site</h3>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-2">
                <p className="text-[10px] text-emerald-700 font-medium leading-relaxed">
                    💡 O rodapé usa automaticamente o nome do mandato, as redes sociais do Contato e as cores primárias. Edite essas informações nas seções <strong>Topo</strong> e <strong>Contato</strong>.
                </p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-stone-400">Nome do Mandato</Label>
                    <Input
                        value={data.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        className="h-9 rounded-xl border-stone-200 bg-white font-bold text-sm"
                        disabled
                    />
                    <p className="text-[9px] text-stone-400 italic">Editável na seção "Topo"</p>
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-stone-400">Slogan</Label>
                    <Input
                        value={data.tagline || ""}
                        onChange={(e) => updateField("tagline", e.target.value)}
                        className="h-9 rounded-xl border-stone-200 bg-white text-sm"
                        placeholder="Mandato Participativo"
                    />
                </div>
            </div>
        </div>
    )

    /* ═══ PROJETOS ═══ */
    const renderProjetos = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-emerald-500" />
                    <h3 className="text-sm font-bold uppercase tracking-tighter">Ações e Projetos</h3>
                </div>
                <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs" onClick={() => {
                    const newProj = { id: Date.now().toString(), categoryId: "", name: "Novo Projeto", description: "Descrição do projeto...", image: "", slug: "" }
                    updateField("projetos", [...data.projetos, newProj])
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
                                value={proj.description} 
                                onChange={(e) => {
                                    const newProjs = [...data.projetos]
                                    newProjs[idx] = { ...newProjs[idx], description: e.target.value }
                                    updateField("projetos", newProjs)
                                }}
                                className="rounded-xl border-stone-200 bg-white text-xs min-h-[80px]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-stone-400">Imagem do Projeto</Label>
                            <ImageUpload
                                value={proj.image}
                                onChange={(url) => {
                                    const newProjs = [...data.projetos]
                                    newProjs[idx] = { ...newProjs[idx], image: url }
                                    updateField("projetos", newProjs)
                                }}
                                className="aspect-video h-28"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

    /* ═══ FAQ ═══ */
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

    /* ═══ TRUST ═══ */
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

    /* ═══ BEFORE/AFTER ═══ */
    const renderBeforeAfter = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <ArrowLeftRight className="h-4 w-4 text-emerald-500" />
                    <h3 className="text-sm font-bold uppercase tracking-tighter">Resultados Reais</h3>
                </div>
                <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs" onClick={() => {
                    updateField("beforeAfter", [...data.beforeAfter, { id: Date.now().toString(), title: "Nova Transformação", before: "", after: "" }])
                }}>
                    <Plus className="h-3 w-3 mr-1" /> Add
                </Button>
            </div>
            <div className="space-y-4">
                {data.beforeAfter.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-2xl border border-stone-100 bg-stone-50/50 space-y-4 relative group">
                        <button 
                            className="absolute top-2 right-2 p-1.5 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            onClick={() => {
                                const newItems = data.beforeAfter.filter((_, i) => i !== idx)
                                updateField("beforeAfter", newItems)
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
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
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label className="text-[8px] font-black uppercase text-stone-400">Foto Antes</Label>
                                <ImageUpload
                                    value={item.before}
                                    onChange={(url) => {
                                        const newItems = [...data.beforeAfter]
                                        newItems[idx] = { ...newItems[idx], before: url }
                                        updateField("beforeAfter", newItems)
                                    }}
                                    className="aspect-video h-20"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[8px] font-black uppercase text-stone-400">Foto Depois</Label>
                                <ImageUpload
                                    value={item.after}
                                    onChange={(url) => {
                                        const newItems = [...data.beforeAfter]
                                        newItems[idx] = { ...newItems[idx], after: url }
                                        updateField("beforeAfter", newItems)
                                    }}
                                    className="aspect-video h-20"
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
                {selectedSection === "header" && renderHeader()}
                {selectedSection === "projetos" && renderProjetos()}
                {selectedSection === "faq" && renderFAQ()}
                {selectedSection === "trust" && renderTrust()}
                {selectedSection === "beforeAfter" && renderBeforeAfter()}
                {selectedSection === "perfil" && renderPerfil()}
                {selectedSection === "contact" && renderContact()}
                {selectedSection === "footer" && renderFooter()}
            </div>
        </div>
    )
}
