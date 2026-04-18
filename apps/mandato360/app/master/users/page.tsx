"use client"

import { Users, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function UsersPage() {
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">Administradores Globais</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">
            Gerencie quem tem acesso total à plataforma Master.
          </p>
        </div>
        <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold rounded-xl h-11 px-5 shadow-sm gap-2">
          <UserPlus className="h-4 w-4" />
          Novo Administrador
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-3xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-12 text-center">
        <div className="h-20 w-20 bg-muted/30 rounded-full flex items-center justify-center text-muted-foreground/30 mb-6">
          <Users size={40} />
        </div>
        <h2 className="text-xl font-bold text-primary mb-2">Nenhum administrador encontrado</h2>
        <p className="text-muted-foreground max-w-xs mx-auto text-sm font-medium">
          A listagem de usuários globais está em fase de desenvolvimento e integração com o sistema de autenticação.
        </p>
      </div>
    </div>
  );
}
