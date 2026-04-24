"use client"

import {
    Gavel,
    Calculator,
    Building2,
    Stethoscope,
    Briefcase,
    Wrench,
    Utensils,
    GraduationCap,
    Heart,
    Dumbbell,
    Scissors,
    Dog,
    Home,
    Camera,
    MapPin,
    type LucideIcon
} from "lucide-react"

interface ServiceLogoProps {
    businessTypeName: string
    className?: string
}

const NICHE_MAP: Record<string, LucideIcon> = {
    "advogado": Gavel,
    "advocacia": Gavel,
    "contador": Calculator,
    "contabilidade": Calculator,
    "arquiteto": Building2,
    "arquitetura": Building2,
    "medico": Stethoscope,
    "clinica": Stethoscope,
    "odontologia": Stethoscope,
    "dentista": Stethoscope,
    "consultor": Briefcase,
    "servicos": Briefcase,
    "mecanico": Wrench,
    "oficina": Wrench,
    "restaurante": Utensils,
    "escola": GraduationCap,
    "bem-estar": Heart,
    "personal": Dumbbell,
    "trainer": Dumbbell,
    "salao": Scissors,
    "estetica": Scissors,
    "barbearia": Scissors,
    "pet": Dog,
    "veterinario": Dog,
    "imobiliaria": Home,
    "fotografo": Camera,
    "fotografia": Camera,
    "terapia": Heart,
    "psicologo": Heart,
    "gastronomia": Utensils,
    "financeiro": Calculator,
    "eventos": Camera,
    "turismo": MapPin,
    "engenheiro": Building2,
}

export function ServiceLogo({ businessTypeName, className }: ServiceLogoProps) {
    const normalized = businessTypeName.toLowerCase()
    const Icon = NICHE_MAP[normalized] || Briefcase

    return (
        <div className={`p-2 rounded-xl bg-tenant-primary/10 flex items-center justify-center ${className}`}>
            <Icon className="text-tenant-primary h-full w-full" />
        </div>
    )
}
