"use client"

import * as React from "react"
import { Calendar as CalendarIcon, Clock, Check, ChevronLeft, ChevronRight, Loader2, User, Phone, ArrowRight } from "lucide-react"
import { createPublicAppointmentAction } from "@/lib/actions/appointments"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface SchedulingSectionProps {
  tenantId: string
  whatsappNumber: string
  services?: any[]
  initialServiceId?: string
  isModal?: boolean
}

interface SelDay {
  d: number
  m: number
  y: number
}

const MONTHS_PT = [
  "Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
]

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"]

const SLOTS = [
  { time: "08:00", tag: "Inicio", type: "free" },
  { time: "09:00", tag: "Melhor", type: "best" },
  { time: "10:00", tag: "Livre", type: "free" },
  { time: "11:00", tag: "Melhor", type: "best" },
  { time: "12:00", tag: "Intervalo", type: "free" },
  { time: "13:00", tag: "Livre", type: "free" },
  { time: "14:00", tag: "Livre", type: "free" },
  { time: "15:00", tag: "Livre", type: "free" },
  { time: "16:00", tag: "Ultimas vagas", type: "last" },
  { time: "17:00", tag: "Livre", type: "free" },
  { time: "18:00", tag: "Livre", type: "free" },
  { time: "19:00", tag: "Noite", type: "free" },
]

function StepIndicator({ current }: { current: 1 | 2 | 3 | 4 }) {
  const steps = [
    { n: 1, label: "Data" },
    { n: 2, label: "Horario" },
    { n: 3, label: "Identificacao" },
    { n: 4, label: "Confirmar" },
  ]
  
  // Calculate progress percentage for the background line
  const progressPercent = ((current - 1) / (steps.length - 1)) * 100

  return (
    <div className="flex items-center justify-center px-4 py-4 md:py-6 border-b border-stone-100 bg-white/50 relative">
      <div className="flex items-center justify-between w-full max-w-2xl mx-auto relative group">
        
        {/* Track Background Line */}
        <div className="absolute top-[10px] md:top-[12px] left-0 w-full h-0.5 bg-stone-100 z-0" />
        
        {/* Active Progress Line */}
        <div 
          className="absolute top-[10px] md:top-[12px] left-0 h-0.5 bg-tenant-primary z-0 transition-all duration-700 ease-in-out shadow-sm" 
          style={{ width: `${progressPercent}%` }}
        />

        {steps.map((s) => {
          const isDone = s.n < current
          const isActive = s.n === current
          return (
            <div key={s.n} className="flex flex-col items-center gap-3 relative z-10">
              <div className={cn(
                "w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-[8px] md:text-[10px] font-bold transition-all duration-500 ring-4 ring-white shadow-sm",
                isDone || isActive ? 'bg-tenant-primary text-white' : 'bg-stone-100 text-stone-400'
              )}>
                {isDone ? <Check className="w-2.5 h-2.5 md:w-3 md:h-3" strokeWidth={4} /> : s.n}
              </div>
              <span className={cn(
                "text-[8px] md:text-[9px] font-extrabold uppercase tracking-widest transition-colors duration-300",
                isActive ? 'text-tenant-primary' : isDone ? 'text-stone-900' : 'text-stone-400'
              )}>
                {s.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CalendarPanel({ selDay, onSelect, onNext }: any) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const [viewYear, setViewYear] = React.useState(now.getFullYear())
  const [viewMonth, setViewMonth] = React.useState(now.getMonth())

  const changeMonth = (dir: number) => {
    let newMonth = viewMonth + dir
    let newYear = viewYear
    if (newMonth > 11) { newMonth = 0; newYear++; }
    else if (newMonth < 0) { newMonth = 11; newYear--; }
    setViewMonth(newMonth)
    setViewYear(newYear)
  }

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const formattedDate = selDay
    ? new Date(selDay.y, selDay.m, selDay.d).toLocaleDateString("pt-BR", { day: "numeric", month: "long" })
    : "Selecione uma data"

  return (
    <div className="w-full flex flex-col flex-1 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex items-center justify-between px-6 py-2 md:px-8 md:py-3 border-b border-stone-50/50">
        <div className="text-base md:text-lg font-bold tracking-tight text-stone-900 text-left">
          {MONTHS_PT[viewMonth]} <span className="text-stone-300 font-light ml-1">{viewYear}</span>
        </div>
        <div className="flex gap-3">
          <button className="w-10 h-10 rounded-2xl border border-stone-100 flex items-center justify-center text-stone-400 hover:bg-stone-50 hover:text-stone-900 transition-all disabled:opacity-20 active:scale-95" disabled={viewYear === now.getFullYear() && viewMonth === now.getMonth()} onClick={() => changeMonth(-1)}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-2xl border border-stone-100 flex items-center justify-center text-stone-400 hover:bg-stone-50 hover:text-stone-900 transition-all active:scale-95" onClick={() => changeMonth(1)}>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="px-6 md:px-10 py-3 flex-1 flex flex-col">
        <div className="grid grid-cols-7 mb-2">
          {WEEKDAYS.map(w => (<span key={w} className="text-[8px] font-bold text-stone-400 uppercase tracking-widest text-center">{w}</span>))}
        </div>
        <div className="grid grid-cols-7 gap-1 flex-1">
          {Array.from({ length: firstDay }).map((_, i) => (<div key={'e-'+i} className="h-8 w-full" />))}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
            const date = new Date(viewYear, viewMonth, d)
            const isPast = date < today
            const isSel = selDay?.d === d && selDay?.m === viewMonth && selDay?.y === viewYear
            return (
              <button 
                key={d} 
                disabled={isPast} 
                onClick={() => onSelect({ d, m: viewMonth, y: viewYear })} 
                className={cn(
                    "h-full min-h-[40px] flex flex-col items-center justify-center rounded-lg text-xs md:text-sm font-bold transition-all relative group",
                    isSel ? 'bg-tenant-primary text-white shadow-md' : isPast ? 'text-stone-300 opacity-60' : 'text-stone-600 hover:bg-stone-50 hover:text-tenant-primary'
                )}
              >
                {d}
                {isSel && <div className="absolute bottom-1 w-0.5 h-0.5 bg-white rounded-full" />}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex items-center justify-between p-3 md:p-4 bg-stone-50/50 border-t border-stone-100/50">
        <div className="flex flex-col">
          <span className="text-[8px] uppercase font-bold text-stone-400 tracking-[0.2em] mb-0.5 text-left">Data</span>
          <span className="text-[10px] md:text-xs font-bold text-stone-900">{selDay ? formattedDate : "--- --- ---"}</span>
        </div>
        <button className="bg-tenant-primary text-white px-6 py-2.5 rounded-lg text-[9px] md:text-[10px] font-black shadow-md disabled:opacity-50 transition-all active:scale-95 flex items-center gap-2 uppercase tracking-wider hover:-translate-y-0.5" disabled={!selDay} onClick={onNext}>
          Horário <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </button>
      </div>
    </div>
  )
}

function TimePanel({ selDay, selTime, onSelect, onBack, onNext }: any) {
  const formattedDate = new Date(selDay.y, selDay.m, selDay.d).toLocaleDateString("pt-BR", { day: "numeric", month: "long" })
  return (
    <div className="w-full flex flex-col flex-1 animate-in fade-in slide-in-from-right-8 duration-500 text-left">
      <div className="px-6 py-4 md:px-8 md:py-5 border-b border-stone-50/50">
        <div className="inline-flex items-center gap-2 bg-stone-50 text-stone-500 px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-[0.2em] mb-2 border border-stone-100/50">
          <CalendarIcon className="w-2.5 h-2.5" /> {formattedDate}
        </div>
        <h2 className="text-lg md:text-xl font-bold tracking-tight text-stone-900 mb-1">Escolha o Horário</h2>
        <p className="text-stone-500 text-[10px] leading-relaxed max-w-sm">Selecione o momento ideal para o seu atendimento exclusivo.</p>
      </div>

      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2 p-5 md:p-6 overflow-y-auto max-h-60 custom-scrollbar flex-1 bg-stone-50/30">
        {SLOTS.map(s => (
          <button 
            key={s.time} 
            onClick={() => onSelect(s.time)} 
            className={cn(
                "py-3 rounded-lg border transition-all flex flex-col items-center gap-0.5 active:scale-95 group",
                selTime === s.time 
                  ? 'bg-tenant-primary border-tenant-primary text-white shadow-md' 
                  : 'bg-white border-stone-200 text-stone-600 hover:border-tenant-primary hover:text-tenant-primary'
            )}
          >
            <span className="text-base font-bold">{s.time}</span>
            <span className={cn(
              "text-[9px] font-bold uppercase tracking-wider",
              selTime === s.time ? "text-white/70" : "text-stone-400 group-hover:text-tenant-primary"
            )}>{s.tag}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between p-3 md:p-4 bg-white border-t border-stone-100">
        <button className="text-[10px] md:text-xs font-bold text-stone-400 hover:text-tenant-primary hover:bg-stone-50 px-3 py-2 rounded-lg transition-colors flex items-center gap-1 uppercase tracking-widest" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" /> Voltar
        </button>
        <button className="bg-tenant-primary text-white px-6 py-2.5 rounded-lg text-[9px] md:text-[10px] font-black shadow-md disabled:opacity-50 transition-all active:scale-95 flex items-center gap-2 uppercase tracking-wider hover:-translate-y-0.5" disabled={!selTime} onClick={onNext}>
          Avançar <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </button>
      </div>
    </div>
  )
}

function ContactPanel({ name, phone, setName, setPhone, onBack, onNext, isSaving }: any) {
  return (
    <div className="w-full flex flex-col flex-1 animate-in fade-in slide-in-from-right-8 duration-500 text-left">
      <div className="px-6 py-8 md:px-10 md:py-10 flex-1">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-xl md:text-3xl font-bold tracking-tight text-stone-900 mb-2">Informações de Contato</h2>
            <p className="text-stone-500 text-xs leading-relaxed">Última etapa! Por favor, preencha seus dados para finalizar a reserva do seu horário.</p>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2 group">
              <label className="text-[9px] font-extrabold text-stone-400 uppercase tracking-[0.25em] ml-1">Seu Nome Completo</label>
              <div className="relative flex items-center h-14 bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm transition-all focus-within:border-tenant-primary/40 focus-within:bg-stone-50/50" style={{ '--tw-ring-color': 'color-mix(in srgb, var(--tenant-primary) 15%, transparent)' } as React.CSSProperties}>
                <div className="w-12 h-full flex items-center justify-center text-stone-400 group-focus-within:text-tenant-primary transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <div className="w-px h-6 transition-colors" style={{ backgroundColor: 'color-mix(in srgb, var(--tenant-primary, #8c6239) 15%, #e5e7eb)' }} />
                <input 
                    type="text" 
                    placeholder="Ex: Amanda Silva" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="flex-1 h-full px-5 text-stone-900 placeholder:text-stone-400 outline-none text-sm font-semibold focus:ring-4 focus:ring-[var(--tw-ring-color)] bg-transparent" 
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-[9px] font-extrabold text-stone-400 uppercase tracking-[0.25em] ml-1">Seu WhatsApp</label>
              <div className="relative flex items-center h-14 bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm transition-all focus-within:border-tenant-primary/40 focus-within:bg-stone-50/50" style={{ '--tw-ring-color': 'color-mix(in srgb, var(--tenant-primary) 15%, transparent)' } as React.CSSProperties}>
                <div className="w-12 h-full flex items-center justify-center text-stone-400 group-focus-within:text-tenant-primary transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="w-px h-6 transition-colors" style={{ backgroundColor: 'color-mix(in srgb, var(--tenant-primary, #8c6239) 15%, #e5e7eb)' }} />
                <input 
                    type="tel" 
                    placeholder="(21) 99999-0000" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    className="flex-1 h-full px-5 text-stone-900 placeholder:text-stone-400 outline-none text-sm font-semibold focus:ring-4 focus:ring-[var(--tw-ring-color)] bg-transparent" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 md:p-6 bg-stone-50/50 border-t border-stone-100 mt-auto">
        <button className="text-[10px] md:text-xs font-bold text-stone-400 hover:text-tenant-primary hover:bg-stone-100 px-3 py-2 rounded-lg transition-colors flex items-center gap-1 uppercase tracking-widest" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" /> Dados
        </button>
        <button 
          className="bg-tenant-primary text-white px-10 py-3.5 md:py-4 rounded-xl text-[10px] md:text-xs font-black shadow-md disabled:opacity-50 transition-all active:scale-95 flex items-center gap-2 uppercase tracking-wider hover:-translate-y-0.5" 
          disabled={!name || name.length < 3 || !phone || phone.length < 8 || isSaving} 
          onClick={onNext}
        >
          {isSaving ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> ...</>
          ) : (
            <>Finalizar <ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      </div>
    </div>
  )
}

function ConfirmPanel({ selDay, selTime, whatsappNumber, clientName, selectedService }: any) {
  const formattedDate = new Date(selDay.y, selDay.m, selDay.d).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })
  const confirmWhatsApp = () => {
    const greeting = clientName ? 'Olá ' + clientName + ', ' : "Olá, "
    const msg = encodeURIComponent(greeting + 'gostaria de confirmar meu agendamento de ' + (selectedService?.name || 'serviço') + ' para o dia ' + formattedDate + ' às ' + selTime + '.')
    window.open('https://wa.me/' + whatsappNumber + '?text=' + msg, "_blank")
  }
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-6 md:p-10 text-center animate-in zoom-in-95 duration-700">
      <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 mb-4 border border-emerald-100 shadow-[0_15px_30px_rgba(16,185,129,0.08)]">
        <Check className="w-6 h-6 md:w-8 md:h-8" strokeWidth={3} />
      </div>
      <h2 className="text-2xl md:text-5xl font-bold mb-2 tracking-tight text-stone-900">Agendamento<br/><span className="text-emerald-500 italic">Confirmado!</span></h2>
      <p className="text-stone-400 text-xs md:text-base mb-6 md:mb-8 max-w-sm leading-relaxed">Parabéns! Seu horário foi reservado com sucesso em nosso sistema.</p>
      
      <div className="w-full max-w-sm bg-stone-50 border border-stone-200 rounded-2xl p-4 md:p-6 mb-6 md:mb-8 grid grid-cols-2 gap-4 text-left relative overflow-hidden shadow-sm">
        <div className="space-y-1 relative z-10">
          <div className="text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Procedimento</div>
          <div className="font-bold text-sm text-stone-900 leading-tight truncate">{selectedService?.name || "Serviço"}</div>
        </div>
        <div className="space-y-1 relative z-10 border-l border-stone-200 pl-4">
          <div className="text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Informações</div>
          <div className="font-bold text-[10px] text-stone-600 leading-tight">{formattedDate}<br/>às {selTime}</div>
        </div>
      </div>

      <button onClick={confirmWhatsApp} className="w-full max-w-sm bg-[#25D366] text-white h-16 rounded-full font-bold text-base shadow-[0_15px_30px_rgba(37,211,102,0.15)] hover:brightness-105 hover:scale-[1.01] transition-all active:scale-95 flex items-center justify-center gap-3 group">
        Confirmar no WhatsApp <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  )
}

export function SchedulingSection({ tenantId, whatsappNumber, services = [], initialServiceId, isModal = false }: SchedulingSectionProps) {
  const [step, setStep] = React.useState<1 | 2 | 3 | 4>(1)
  const [selDay, setSelDay] = React.useState<SelDay | null>(null)
  const [selTime, setSelTime] = React.useState<string | null>(null)
  const [customerName, setCustomerName] = React.useState("")
  const [customerPhone, setCustomerPhone] = React.useState("")
  const [isSaving, setIsSaving] = React.useState(false)
  const [serviceId, setServiceId] = React.useState<string>(initialServiceId || "")

  React.useEffect(() => {
    if (initialServiceId) setServiceId(initialServiceId)
  }, [initialServiceId])

  const selectedService = services.find(s => s.id === serviceId)

  const handleFinalize = async () => {
    if (!selDay) return toast.error("Por favor, selecione uma data.")
    if (!selTime) return toast.error("Por favor, selecione um horário.")
    if (!customerName || customerName.length < 3) return toast.error("Por favor, informe seu nome completo.")
    if (!customerPhone || customerPhone.length < 8) return toast.error("Por favor, informe seu WhatsApp.")
    if (!tenantId) return toast.error("Erro interno. Recarregue a página.")

    setIsSaving(true)
    const dateStr = selDay.y + '-' + (selDay.m + 1).toString().padStart(2, '0') + '-' + selDay.d.toString().padStart(2, '0')
    
    try {
      const res = await createPublicAppointmentAction({ 
        tenantId, 
        customerName: customerName.trim(), 
        customerPhone: customerPhone.trim(), 
        date: dateStr, 
        time: selTime,
        serviceId: serviceId || undefined
      } as any)
      
      if (res.success) { setStep(4) } 
      else { toast.error(res.error || "Erro ao registrar agendamento.") }
    } catch (err) { 
      toast.error("Erro de conexão.") 
    } finally { 
      setIsSaving(false) 
    }
  }

  const InnerContent = (
    <div className={cn(
      "w-full bg-white overflow-hidden flex flex-col min-h-125 md:min-h-155 relative",
      !isModal && "rounded-2xl md:rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-stone-200/60"
    )} style={{ height: isModal ? 'auto' : '620px' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px !important;
          height: 5px !important;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent !important;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: color-mix(in srgb, var(--tenant-primary, #8c6239) 30%, transparent) !important;
          border-radius: 10px !important;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--tenant-primary, #8c6239) !important;
        }
        .custom-scrollbar {
          scrollbar-width: thin !important;
          scrollbar-color: color-mix(in srgb, var(--tenant-primary, #8c6239) 30%, transparent) transparent !important;
        }
      `}} />
      <StepIndicator current={step} />
      
      <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
        {step === 1 && <CalendarPanel selDay={selDay} onSelect={(d: any) => { setSelDay(d); setSelTime(null); }} onNext={() => setStep(2)} />}
        {step === 2 && selDay && <TimePanel selDay={selDay} selTime={selTime} onSelect={setSelTime} onBack={() => setStep(1)} onNext={() => setStep(3)} />}
        {step === 3 && selDay && selTime && (
          <ContactPanel name={customerName} phone={customerPhone} setName={setCustomerName} setPhone={setCustomerPhone} onBack={() => setStep(2)} onNext={handleFinalize} isSaving={isSaving} />
        )}
        {step === 4 && selDay && selTime && <ConfirmPanel selDay={selDay} selTime={selTime} whatsappNumber={whatsappNumber} clientName={customerName} selectedService={selectedService} />}
      </div>
    </div>
  )

  if (isModal) return InnerContent

  return (
    <section id="agendamento" className="relative py-12 md:py-20 px-4 bg-white overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-250 h-150 bg-stone-50 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-stone-900 mb-4 tracking-tight">
            Agenda <span className="text-tenant-primary italic">Online</span>
          </h2>
          <p className="text-stone-400 text-[10px] uppercase tracking-[0.4em] font-extrabold">Exclusividade e Precisão em cada detalhe</p>
        </div>

        {InnerContent}

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full border border-stone-200 shadow-sm">
            <Check className="w-4 h-4 text-tenant-primary" />
            <span className="text-stone-500 text-[10px] font-bold uppercase tracking-widest">Agendamento 100% Seguro</span>
          </div>
        </div>
      </div>
    </section>
  )
}
