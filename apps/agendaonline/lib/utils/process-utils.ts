import { format } from "date-fns"

export const LEGAL_STATUSES = [
    { id: "triagem", label: "Triagem", color: "text-blue-500", bgColor: "bg-blue-500/10", borderColor: "border-blue-500/20" },
    { id: "protocolo", label: "Em Protocolo", color: "text-amber-500", bgColor: "bg-amber-500/10", borderColor: "border-amber-500/20" },
    { id: "instrucao", label: "Em Instrução", color: "text-purple-500", bgColor: "bg-purple-500/10", borderColor: "border-purple-500/20" },
    { id: "concluso", label: "Concluso", color: "text-emerald-500", bgColor: "bg-emerald-500/10", borderColor: "border-emerald-500/20" },
    { id: "finalizado", label: "Finalizado", color: "text-stone-500", bgColor: "bg-stone-500/10", borderColor: "border-stone-500/20" },
]

/**
 * Generates a unique process number for legal records.
 * Format: PROC-[YEAR]-[RANDOM_SUFFIX]
 */
export function generateProcessNumber() {
    const year = format(new Date(), "yyyy")
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `PROC-${year}-${random}`
}

/**
 * Maps DB status to the legal kanban columns.
 * Fallback to 'triagem' if unknown.
 */
export function mapStatusToLegal(status: string): string {
    const validStatuses = LEGAL_STATUSES.map(s => s.id)
    if (validStatuses.includes(status)) return status
    
    // Default mapping for existing generic statuses
    switch(status) {
        case 'pending': return 'triagem'
        case 'confirmed': return 'protocolo'
        case 'completed': return 'finalizado'
        case 'cancelled': return 'finalizado'
        default: return 'triagem'
    }
}
