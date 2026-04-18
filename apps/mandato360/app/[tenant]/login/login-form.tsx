"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { Loader2, LogIn, Mail, Lock, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "A senha é obrigatória"),
})

type LoginValues = z.infer<typeof loginSchema>

export default function TenantLoginForm({ tenant }: { tenant: any }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  
  const config = tenant.config ? JSON.parse(tenant.config) : {}
  const primaryColor = config.primaryColor || "#0F2B5B"
  const secondaryColor = config.secondaryColor || "#0D9F6E"
  const tenantName = config.nome || tenant.name

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: LoginValues) {
    setIsLoading(true)
    const { error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
      callbackURL: `/${tenant.slug}/dashboard`,
    })

    if (error) {
      toast.error(error.message || "Erro ao entrar")
      setIsLoading(false)
      return
    }

    toast.success("Login realizado!")
    router.push(`/${tenant.slug}/dashboard`)
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F3F8] relative overflow-hidden">
      {/* Dynamic Background decoration */}
      <div 
        className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" 
        style={{ backgroundColor: primaryColor }}
      />
      
      <div 
        className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full blur-[120px] opacity-20"
        style={{ backgroundColor: secondaryColor }}
      />
      
      <Card className="w-full max-w-md relative z-10 border-border bg-white shadow-xl rounded-2xl overflow-hidden">
        <div 
            className="h-2 w-full" 
            style={{ backgroundColor: primaryColor }}
        />
        
        <CardHeader className="space-y-1 text-center pt-8">
          <div 
            className="mx-auto p-3 rounded-2xl w-fit mb-4"
            style={{ backgroundColor: `${primaryColor}10` }}
          >
            <LayoutDashboard className="h-8 w-8" style={{ color: primaryColor }} />
          </div>
          <CardTitle className="text-2xl font-outfit font-black text-foreground uppercase tracking-tight">
            {tenantName}
          </CardTitle>
          <CardDescription className="text-muted-foreground font-outfit font-medium">
            Painel Administrativo do Mandato
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4 px-8">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/40" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  {...form.register("email")}
                  className="pl-10 bg-muted/30 border-border h-11 text-sm focus:bg-white transition-colors rounded-lg"
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-xs text-red-500 font-medium">{form.formState.errors.email.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Senha</Label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/40" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...form.register("password")}
                  className="pl-10 bg-muted/30 border-border h-11 text-sm focus:bg-white transition-colors rounded-lg"
                />
              </div>
              {form.formState.errors.password && (
                <p className="text-xs text-red-500 font-medium">{form.formState.errors.password.message}</p>
              )}
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl transition-all shadow-md font-bold uppercase tracking-widest text-xs"
              style={{ 
                backgroundColor: primaryColor,
                color: '#FFFFFF' 
              }}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                    Entrar no Sistema
                    <LogIn className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4 pb-8 px-8">
          <div className="w-full pt-4 border-t border-border/50 text-center">
            <Link 
                href={`/${tenant.slug}`} 
                className="text-[10px] text-muted-foreground hover:text-foreground transition-colors uppercase font-bold tracking-[0.2em]"
            >
              Voltar ao Site Público
            </Link>
          </div>
        </CardFooter>
      </Card>
      
      {/* System Footer Info */}
      <div className="absolute bottom-6 w-full text-center">
        <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-muted-foreground/40">
            Powered by Mandato360 Quiet UI
        </p>
      </div>
    </div>
  )
}
