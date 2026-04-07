"use client"

import { Settings, ShieldAlert, Database, Cloud } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function SettingsPage() {
  const sections = [
    { title: "Geral", icon: Settings, description: "Configurações da plataforma master." },
    { title: "Segurança", icon: ShieldAlert, description: "Políticas de acesso e backup." },
    { title: "Banco de Dados", icon: Database, description: "Recursos e instâncias RDS." },
    { title: "Infraestrutura", icon: Cloud, description: "Provisionamento automoático." },
  ]

  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <h1 className="text-3xl font-bold text-primary tracking-tight">Configurações Master</h1>
        <p className="text-muted-foreground mt-1 text-sm font-medium">
          Ajustes globais do ecossistema Mandato360.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sections.map((s) => (
          <Card key={s.title} className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white cursor-not-allowed opacity-60 hover:opacity-100 transition-all">
            <CardHeader className="pb-4">
              <div className="h-10 w-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary mb-2">
                <s.icon size={20} />
              </div>
              <CardTitle className="text-base font-bold text-primary">{s.title}</CardTitle>
              <CardDescription className="text-[11px]">{s.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="bg-white rounded-3xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-12 text-center">
         <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Módulo em fase de homologação</p>
      </div>
    </div>
  );
}
