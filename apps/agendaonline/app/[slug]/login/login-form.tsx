"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, LogIn, ArrowRight, ShieldCheck, Lock } from "lucide-react"
import type { TenantConfig } from "@/lib/tenant-config"

interface TenantLoginFormProps {
  config: TenantConfig
}

export function TenantLoginForm({ config }: TenantLoginFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Prioritize config colors (from editor) over top-level branding colors
  const primaryColor = config.config?.theme?.colors?.primary || config.branding.primaryColor || "#8c6239"
  
  // Card rounding is always 2xl for professional look
  const cardRadius = "rounded-2xl"
  
  // Button rounding follows design system
  const buttonRadius = config.designSystem?.borderRadius === "full" ? "rounded-full" : 
                   config.designSystem?.borderRadius === "none" ? "rounded-none" : "rounded-xl"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await authClient.signIn.email({
        email,
        password,
      }, {
        onSuccess: async (ctx) => {
          // After successful login, check if this user is the owner of THIS tenant
          const user = ctx.data.user
          
          if (user.id !== config.ownerId && user.role !== 'root' && user.role !== 'admin') {
            toast.error("Acesso negado. Esta página de login é exclusiva para o proprietário deste site.")
            await authClient.signOut()
            setIsLoading(false)
            return
          }

          toast.success(`Bem-vindo de volta, ${user.name}!`)
          router.push("/painel")
        },
        onError: (ctx) => {
          setIsLoading(false)
          toast.error(ctx.error.message || "Erro ao realizar login")
        }
      })
    } catch {
      setIsLoading(false)
      toast.error("Ocorreu um erro inesperado")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-stone-950 border border-border/50 shadow-2xl overflow-hidden ${cardRadius}`}
    >
      <div className="p-8 sm:p-10 flex flex-col items-center">
        {/* Logo / Identity */}
        <div className="mb-8 flex flex-col items-center">
          {config.branding.logoUrl ? (
            <div className="h-16 w-auto mb-4">
              <img 
                src={config.branding.logoUrl} 
                alt={config.branding.name} 
                className="h-full w-auto object-contain"
              />
            </div>
          ) : (
            <div 
              className="h-16 w-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
              style={{ backgroundColor: primaryColor }}
            >
              <Lock className="h-8 w-8 text-white" />
            </div>
          )}
          <h1 className="text-xl font-bold text-foreground tracking-tight text-center">
            Painel Administrativo
          </h1>
          <p className="text-sm text-muted-foreground font-medium text-center mt-1">
            {config.branding.name} {config.branding.surname}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/70 ml-1">
              E-mail de Acesso
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-muted/30 border-border/50 focus-visible:ring-offset-0 focus-visible:ring-1"
              style={{ ['--tw-ring-color' as any]: primaryColor }}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/70 ml-1">
                Senha
              </Label>
              <button 
                type="button"
                className="text-[10px] font-bold uppercase tracking-widest hover:underline"
                style={{ color: primaryColor }}
              >
                Esqueceu?
              </button>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 bg-muted/30 border-border/50 pr-12 focus-visible:ring-offset-0 focus-visible:ring-1"
                style={{ ['--tw-ring-color' as any]: primaryColor }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className={`w-full h-12 text-white font-bold text-sm shadow-lg shadow-black/10 transition-all hover:scale-[1.02] active:scale-[0.98] ${buttonRadius}`}
            style={{ backgroundColor: primaryColor }}
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                />
              ) : (
                <motion.div 
                  key="text"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  Acessar Painel
                  <ArrowRight className="h-4 w-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </form>

        <div className="mt-8 flex items-center gap-2 grayscale opacity-30">
          <ShieldCheck className="h-3 w-3" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Conexão Segura SSL</span>
        </div>
      </div>
    </motion.div>
  )
}
