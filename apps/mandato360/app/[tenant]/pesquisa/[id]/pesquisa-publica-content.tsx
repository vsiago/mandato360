"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { ClipboardList, Send, CheckCircle2 } from "lucide-react"
import { submitPesquisaResposta } from "@/lib/actions/pesquisas"
import type { PesquisaPergunta } from "@/lib/db/schema"

interface PesquisaPublicaProps {
  pesquisa: {
    id: string
    titulo: string
    descricao?: string | null
    perguntas: PesquisaPergunta[]
  }
  primaryColor: string
}

export function PesquisaPublicaContent({ pesquisa, primaryColor }: PesquisaPublicaProps) {
  const [respostas, setRespostas] = useState<Record<string, string | string[]>>({})
  const [respondente, setRespondente] = useState("")
  const [telefone, setTelefone] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    // Validate required
    for (const p of pesquisa.perguntas) {
      if (p.required && (!respostas[p.id] || (Array.isArray(respostas[p.id]) && (respostas[p.id] as string[]).length === 0))) {
        alert(`Pergunta obrigatória: ${p.question}`)
        return
      }
    }
    setSubmitting(true)
    try {
      const result = await submitPesquisaResposta({ pesquisaId: pesquisa.id, respostas, respondente, telefone })
      if (result.success) setSubmitted(true)
    } finally { setSubmitting(false) }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-0 shadow-xl rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full mb-4" style={{ backgroundColor: `${primaryColor}15` }}>
              <CheckCircle2 className="h-8 w-8" style={{ color: primaryColor }} />
            </div>
            <h2 className="text-xl font-bold text-foreground">Obrigado!</h2>
            <p className="text-sm text-muted-foreground mt-2">Sua resposta foi registrada com sucesso.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
          <div className="h-2" style={{ backgroundColor: primaryColor }} />
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold text-foreground">{pesquisa.titulo}</h1>
            {pesquisa.descricao && <p className="text-sm text-muted-foreground mt-2">{pesquisa.descricao}</p>}
          </CardContent>
        </Card>

        {/* Respondente */}
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6 space-y-3">
            <div className="space-y-2">
              <Label>Seu Nome (opcional)</Label>
              <Input value={respondente} onChange={(e) => setRespondente(e.target.value)} className="rounded-xl" placeholder="Nome" />
            </div>
            <div className="space-y-2">
              <Label>Telefone (opcional)</Label>
              <Input value={telefone} onChange={(e) => setTelefone(e.target.value)} className="rounded-xl" placeholder="(21) 99999-1234" />
            </div>
          </CardContent>
        </Card>

        {/* Perguntas */}
        {pesquisa.perguntas.map((p, i) => (
          <Card key={p.id} className="border-0 shadow-sm rounded-2xl">
            <CardContent className="p-6">
              <Label className="text-base font-semibold flex items-center gap-1">
                {p.question}
                {p.required && <span className="text-red-500">*</span>}
              </Label>

              <div className="mt-4">
                {p.type === "text" && (
                  <Textarea
                    value={(respostas[p.id] as string) || ""}
                    onChange={(e) => setRespostas(prev => ({ ...prev, [p.id]: e.target.value }))}
                    className="rounded-xl"
                    placeholder="Sua resposta..."
                    rows={3}
                  />
                )}

                {p.type === "choice" && p.options && (
                  <RadioGroup
                    value={(respostas[p.id] as string) || ""}
                    onValueChange={(v) => setRespostas(prev => ({ ...prev, [p.id]: v }))}
                    className="space-y-2"
                  >
                    {p.options.map((opt, oi) => (
                      <div key={oi} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value={opt} id={`${p.id}-${oi}`} />
                        <Label htmlFor={`${p.id}-${oi}`} className="cursor-pointer font-normal">{opt}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {p.type === "checkbox" && p.options && (
                  <div className="space-y-2">
                    {p.options.map((opt, oi) => {
                      const selected = (respostas[p.id] as string[]) || []
                      return (
                        <div key={oi} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                          <Checkbox
                            id={`${p.id}-${oi}`}
                            checked={selected.includes(opt)}
                            onCheckedChange={(checked) => {
                              setRespostas(prev => ({
                                ...prev,
                                [p.id]: checked ? [...selected, opt] : selected.filter(s => s !== opt)
                              }))
                            }}
                          />
                          <Label htmlFor={`${p.id}-${oi}`} className="cursor-pointer font-normal">{opt}</Label>
                        </div>
                      )
                    })}
                  </div>
                )}

                {p.type === "scale" && (
                  <div className="flex gap-2 mt-2">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                      <button
                        key={n}
                        onClick={() => setRespostas(prev => ({ ...prev, [p.id]: String(n) }))}
                        className={`h-10 w-10 rounded-xl font-bold text-sm transition-all ${
                          respostas[p.id] === String(n) 
                            ? "text-white shadow-md" 
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                        style={respostas[p.id] === String(n) ? { backgroundColor: primaryColor } : {}}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        <Button onClick={handleSubmit} disabled={submitting} className="w-full rounded-xl py-6 text-base font-bold gap-2" style={{ backgroundColor: primaryColor }}>
          <Send className="h-5 w-5" />
          {submitting ? "Enviando..." : "Enviar Resposta"}
        </Button>
      </div>
    </div>
  )
}
