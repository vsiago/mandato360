"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
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
import { Loader2, UserPlus, Mail, Lock, User } from "lucide-react"

const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
})

type RegisterValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  
  // Registration is currently disabled. Redirecting to login.
  useEffect(() => {
    router.push("/login")
  }, [router])

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: RegisterValues) {
    setIsLoading(true)
    const { error } = await authClient.signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
      callbackURL: "/",
    })

    if (error) {
      toast.error(error.message || "Erro ao criar conta")
      setIsLoading(false)
      return
    }

    toast.success("Conta criada com sucesso!")
    router.push("/login")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A192F] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-primary/20 via-transparent to-accent/10 pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
      
      <Card className="w-full max-w-md relative z-10 border-white/10 bg-[#112240]/80 backdrop-blur-xl shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-6">
            <Image 
              src="/images/logo-mandato360.png" 
              alt="Mandato360 Logo" 
              width={180} 
              height={50} 
              className="h-12 w-auto object-contain mx-auto"
              priority
            />
          </div>
          <CardTitle className="text-3xl font-outfit font-black text-white uppercase tracking-tight">Criar Conta</CardTitle>
          <CardDescription className="text-white/60 font-outfit">
            Junte-se ao ecossistema Mandato360 e potencialize sua gestão.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white/80">Nome Completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                <Input
                  id="name"
                  placeholder="Seu nome"
                  {...form.register("name")}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-accent"
                />
              </div>
              {form.formState.errors.name && (
                <p className="text-xs text-red-400">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                <Input
                  id="email"
                  type="email"
                  placeholder="exemplo@email.com"
                  {...form.register("email")}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-accent"
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-xs text-red-400">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/80">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...form.register("password")}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-accent"
                />
              </div>
              {form.formState.errors.password && (
                <p className="text-xs text-red-400">{form.formState.errors.password.message}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0D9F6E] hover:bg-[#0D9F6E]/90 text-white font-bold py-6 rounded-xl transition-all shadow-lg hover:shadow-[#0D9F6E]/40"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Criar Minha Conta"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-sm text-white/40 font-outfit">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-accent hover:underline font-bold">
              Entrar agora
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
