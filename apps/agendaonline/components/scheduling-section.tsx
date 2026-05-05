"use client"

import * as React from "react"
import { Calendar as CalendarIcon, Clock, Check, ChevronLeft, ChevronRight, Loader2, User, Phone, ArrowRight, ShieldCheck, Star, X } from "lucide-react"
import { createPublicAppointmentAction, getPublicAppointmentsByDateAction } from "@/lib/actions/appointments"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// Helper to render simple markdown-like syntax from editor
function renderEditorText(text: string = "") {
    if (!text) return ""
    return text
        .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/__(.*?)__/g, '<u>$1</u>')
        .replace(/<lg>(.*?)<\/lg>/g, '<span class="text-[1.25em]">$1</span>')
        .replace(/<md>(.*?)<\/md>/g, '<span class="text-[1em]">$1</span>')
        .replace(/<sm>(.*?)<\/sm>/g, '<span class="text-[0.75em]">$1</span>')
}

interface SchedulingSectionProps {
  tenantId: string
  whatsappNumber: string
  services?: any[]
  initialServiceId?: string
  isModal?: boolean
  businessHours?: any
  config?: {
    title?: string
    subtitle?: string
  }
  themeColors?: any
}

interface SelDay {
  d: number
  m: number
  y: number
}

const MONTHS_PT = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
]

const WEEKDAYS = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"]

const ALL_TIME_SLOTS = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`)

const SelectionSummary = ({ selDay, selTime, selectedService }: any) => {
  const date = selDay ? new Date(selDay.y, selDay.m, selDay.d) : null;
  const formattedDate = date ? date.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : null;
  const capitalizedDate = formattedDate ? formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1) : null;

  return (
    <div className="flex flex-col gap-3 w-full animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Service Summary (If Selected) */}
      {selectedService && (
        <div className="bg-white rounded-2xl p-4 border border-stone-100 flex items-center gap-4 shadow-sm w-full">
          <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-stone-100 border border-stone-100">
            {selectedService.image ? (
               <img src={selectedService.image} alt={selectedService.name} className="w-full h-full object-cover" />
            ) : (
               <div className="w-full h-full flex items-center justify-center">
                 <Star className="w-6 h-6" style={{ color: 'var(--tenant-hover)' }} />
               </div>
            )}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Serviço selecionado:</span>
            <span className="text-stone-900 font-bold text-sm leading-tight">{selectedService.name}</span>
            <span className="text-tenant-primary font-black text-[10px] uppercase mt-0.5">R$ {parseFloat(selectedService.price).toFixed(0)}</span>
          </div>
        </div>
      )}

      {/* Date/Time Summary */}
      {selDay && (
        <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100 flex items-center gap-4 shadow-sm w-full">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-stone-100/50 flex-shrink-0">
            <CalendarIcon className="w-6 h-6" style={{ color: 'var(--tenant-hover)' }} />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
              {selTime ? "Agendamento para:" : "Data selecionada:"}
            </span>
            <span className="text-stone-900 font-bold text-sm">
              {capitalizedDate}
              {selTime && (
                <span className="text-tenant-primary ml-2 italic lowercase font-black">
                  às {selTime}
                </span>
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

function StepIndicator({ current }: { current: 1 | 2 | 3 | 4 }) {
  const steps = [
    { n: 1, label: "1. DATA", sub: "Escolha o dia", icon: CalendarIcon },
    { n: 2, label: "2. HORÁRIO", sub: "Veja os horários", icon: Clock },
    { n: 3, label: "3. IDENTIFICAÇÃO", sub: "Seus dados", icon: User },
    { n: 4, label: "4. CONFIRMAR", sub: "Confirme seu agendamento", icon: Check },
  ]
  
  const progressPercent = ((current - 1) / (steps.length - 1)) * 100

  return (
    <div className="flex items-center justify-center px-2 py-1.5 border-b border-stone-100 relative rounded-t-2xl md:rounded-t-[2rem] z-10 bg-white">
      <div className="flex items-center justify-between w-full max-w-4xl mx-auto relative group">
        
        {/* Track Background Line */}
        <div className="absolute top-[18px] md:top-[22px] left-0 w-full h-0.5 bg-stone-100 z-0" />
        
        {/* Active Progress Line */}
        <div 
          className="absolute top-[18px] md:top-[22px] left-0 h-0.5 z-0 transition-all duration-700 ease-in-out shadow-sm"           style={{ width: `${progressPercent}%`, backgroundColor: 'var(--tenant-hover)' }}
        />

        {steps.map((s) => {
          const isDone = s.n < current
          const isActive = s.n === current
          const Icon = s.icon
          return (
            <div key={s.n} className="flex flex-col items-center gap-1 relative z-10 w-24 md:w-32 text-center">
              <div className={cn(
                "w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-all duration-500 ring-[2px] md:ring-[4px] ring-white border",
                isDone || isActive ? 'bg-[var(--tenant-primary)] text-white border-[var(--tenant-primary)]' : 'bg-stone-50 text-stone-400 border-stone-200'
              )}>
                <Icon className="w-4 h-4 md:w-5 md:h-5" strokeWidth={isDone || isActive ? 2.5 : 2} />
              </div>
              <div className="flex flex-col items-center mt-1 md:mt-2">
                <span className={cn(
                  "text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-colors duration-300",
                  isActive || isDone ? 'text-stone-800' : 'text-stone-400'
                )}>
                  {s.label}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CalendarPanel({ selDay, onSelect, onNext, businessHours, isModal, selectedService }: any) {
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

  const goToday = () => {
    setViewMonth(now.getMonth())
    setViewYear(now.getFullYear())
  }

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const BenefitsSidebar = () => (
    <div className="flex flex-col gap-6 w-full">
      <SelectionSummary selDay={selDay} selectedService={selectedService} />

      <button 
        className="w-full bg-[var(--tenant-primary)] text-white px-8 h-[50px] rounded-xl text-[15px] font-bold shadow-md disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-3 hover:-translate-y-0.5" 
        disabled={!selDay} 
        onClick={onNext}
      >
        Escolher horário <ArrowRight className="w-4 h-4" />
      </button>

      {/* Benefits */}
      <div className="flex flex-col gap-5 pt-2">
        <div className="flex items-start gap-4 text-left">
          <div className="mt-1 w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 stroke-[1.5]" style={{ color: 'var(--tenant-hover)' }} />
          </div>
          <div>
            <h4 className="font-bold text-stone-800 text-sm">Agendamento fácil e rápido</h4>
            <p className="text-stone-500 text-xs mt-1 leading-relaxed">Escolha a data e horário que melhor se encaixa na sua rotina.</p>
          </div>
        </div>
        <div className="flex items-start gap-4 text-left">
          <div className="mt-1 w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5 stroke-[1.5]" style={{ color: 'var(--tenant-hover)' }} />
          </div>
          <div>
            <h4 className="font-bold text-stone-800 text-sm">Ambiente seguro</h4>
            <p className="text-stone-500 text-xs mt-1 leading-relaxed">Seus dados estão protegidos com total privacidade.</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="w-full flex flex-col flex-1 animate-in fade-in duration-500">
      
      <div className={cn(
        "flex flex-col p-3 px-4 md:p-6 gap-6 flex-1",
        !isModal && "lg:flex-row"
      )}>
        {/* Left Col: Calendar */}
        <div className={cn("flex-1 w-full", !isModal && "max-w-md mx-auto")}>
          <div className="flex items-center justify-between mb-4 gap-2">
            <div className="text-xl md:text-2xl font-bold tracking-tight text-[#0B1426] text-left whitespace-nowrap">
              <span className="font-serif">{MONTHS_PT[viewMonth]}</span> <span className="font-sans font-normal ml-0.5 text-stone-400">{viewYear}</span>
            </div>
            <div className="flex gap-2 justify-end items-center">
              <button className="w-10 h-10 rounded-xl border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-50 transition-all disabled:opacity-30 active:scale-95" disabled={viewYear === now.getFullYear() && viewMonth === now.getMonth()} onClick={() => changeMonth(-1)}>
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-xl border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-50 transition-all active:scale-95" onClick={() => changeMonth(1)}>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 mb-4">
            {WEEKDAYS.map(w => (<span key={w} className="text-[10px] font-bold text-stone-400 uppercase tracking-wider text-center">{w}</span>))}
          </div>
          
          <div className="grid grid-cols-7 gap-y-2 gap-x-1">
            {Array.from({ length: firstDay }).map((_, i) => (<div key={'e-'+i} className="aspect-square w-full" />))}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
              const date = new Date(viewYear, viewMonth, d)
              const isPast = date < today
              const isSel = selDay?.d === d && selDay?.m === viewMonth && selDay?.y === viewYear
              // Available if not past and either no specific config or config says isOpen
              const dayOfWeek = date.getDay().toString()
              const config = businessHours?.[dayOfWeek]
              const isAvailable = !isPast && (!businessHours || !config || config.isOpen)

              return (
                <div key={d} className="aspect-square p-0.5 sm:p-1">
                  <button 
                    disabled={isPast || !isAvailable} 
                    onClick={() => onSelect({ d, m: viewMonth, y: viewYear })} 
                    className={cn(
                        "w-full h-full flex flex-col items-center justify-center rounded-[0.8rem] text-sm font-bold transition-all relative group",
                        isSel ? 'bg-[var(--tenant-primary)] text-white shadow-md' : 
                        isPast || !isAvailable ? 'text-stone-300 opacity-50' : 
                        'text-stone-600 hover:bg-stone-50 hover:text-[var(--tenant-primary)]'
                    )}
                  >
                    <span>{d}</span>
                    <div className="absolute bottom-1.5 flex justify-center w-full">
                       {isAvailable && !isSel && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--tenant-hover)' }} />}
                       {isSel && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--tenant-hover)' }} />}
                    </div>
                  </button>
                </div>
              )
            })}
          </div>

          <div className="flex flex-wrap items-center justify-start gap-3 sm:gap-4 mt-6">
            <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--tenant-hover)' }}></div><span className="text-[10px] text-stone-500 font-medium">Disponível</span></div>
            <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-stone-200"></div><span className="text-[10px] text-stone-500 font-medium">Indisponível</span></div>
          </div>
        </div>

        {/* Right Col: Benefits Sidebar */}
        <div className={cn("hidden w-px bg-stone-100 my-4", !isModal && "lg:block")} />
        
        <div className={cn("flex-1 w-full flex flex-col justify-start pt-12", !isModal && "hidden lg:flex max-w-sm mx-auto")}>
           <BenefitsSidebar />
        </div>
      </div>
      
      {/* Footer Area (For Main Page) */}
      {!isModal && (
        <div className="p-4 md:p-6 bg-white border-t border-stone-100 mt-auto lg:hidden">
          <div className="max-w-5xl mx-auto flex items-center justify-center">
            <button 
              className="w-full bg-[var(--tenant-primary)] text-white px-8 py-4 rounded-xl text-sm font-bold shadow-md disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-3 hover:-translate-y-0.5" 
              disabled={!selDay} 
              onClick={onNext}
            >
              Escolher horário <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function TimePanel({ selDay, selTime, onSelect, onBack, onNext, availableSlots, isLoading, selectedService }: any) {
  return (
    <div className="w-full flex flex-col flex-1 animate-in fade-in slide-in-from-right-8 duration-500 text-left">
      <div className="px-5 py-4 md:px-8 md:py-6 border-b border-stone-100 bg-white">
        <SelectionSummary selDay={selDay} selTime={selTime} selectedService={selectedService} />
        
        {!selTime && (
          <div className="mt-6 animate-in fade-in slide-in-from-top-2 duration-700">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#0B1426] mb-1 font-serif">Escolha o Horário</h2>
            <p className="text-stone-500 text-xs md:text-sm leading-relaxed max-w-sm">Selecione o momento ideal para o seu atendimento.</p>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto bg-stone-50/50 p-5 md:p-8 min-h-[250px]">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-w-5xl mx-auto">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-white border border-stone-100 animate-pulse flex flex-col items-center justify-center gap-2">
                <div className="h-4 w-12 bg-stone-100 rounded" />
                <div className="h-2 w-8 bg-stone-50 rounded" />
              </div>
            ))}
          </div>
        ) : availableSlots.length === 0 ? (
          <div className="h-full w-full flex flex-col items-center justify-center gap-4 text-center px-6">
            <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 border border-stone-200">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-base font-bold text-stone-900">Nenhum horário disponível</p>
              <p className="text-xs text-stone-500 mt-1">Infelizmente não há mais vagas para esta data. Tente outro dia.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-w-5xl mx-auto">
            {availableSlots.map((s: any) => (
              <button 
                key={s.time} 
                onClick={() => onSelect(s.time)} 
                className={cn(
                    "py-4 rounded-xl border transition-all flex flex-col items-center gap-1 active:scale-95 group",
                    selTime === s.time 
                      ? 'bg-[var(--tenant-primary)] border-[var(--tenant-primary)] text-white shadow-md' 
                      : 'bg-white border-stone-200 text-stone-600 hover:border-[var(--tenant-primary)] hover:text-[var(--tenant-primary)] hover:shadow-sm'
                )}
              >
                <span className="text-lg font-bold">{s.time}</span>
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-wider",
                  selTime === s.time ? "text-white/70" : "text-stone-400 group-hover:text-stone-500"
                )}>{s.tag}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between p-4 md:p-6 bg-white border-t border-stone-100 mt-auto">
        <button className="text-[11px] md:text-xs font-bold text-stone-500 hover:text-[var(--tenant-primary)] hover:bg-stone-50 px-4 py-3 rounded-xl transition-colors flex items-center gap-2 uppercase tracking-widest" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" /> Voltar
        </button>
        <button className="bg-[var(--tenant-primary)] text-white px-8 h-[50px] rounded-xl text-[15px] font-bold shadow-md disabled:opacity-50 transition-all active:scale-95 flex items-center gap-2 hover:-translate-y-0.5" disabled={!selTime} onClick={onNext}>
          Identificação <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function ContactPanel({ name, phone, setName, setPhone, onBack, onNext, isSaving, selDay, selTime, selectedService }: any) {
  return (
    <div className="w-full flex flex-col flex-1 animate-in fade-in slide-in-from-right-8 duration-500 text-left">
      <div className="px-5 py-4 md:px-8 md:py-6 border-b border-stone-100 bg-white">
        <SelectionSummary selDay={selDay} selTime={selTime} selectedService={selectedService} />
      </div>

      <div className="px-5 py-6 md:px-10 md:py-10 flex-1 flex flex-col justify-center bg-stone-50/30">
        <div className="max-w-md mx-auto w-full bg-white p-8 rounded-3xl border border-stone-100 shadow-sm">
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#0B1426] mb-1 font-serif">Seus Dados</h2>
            <p className="text-stone-500 text-xs md:text-sm leading-relaxed">Última etapa! Por favor, preencha seus dados para finalizar a reserva.</p>
          </div>
          
          <div className="space-y-5">
            <div className="space-y-2 group">
              <label className="text-[10px] font-extrabold text-stone-400 uppercase tracking-[0.2em] ml-1">Seu Nome Completo</label>
              <div className="relative flex items-center h-14 bg-stone-50/50 border border-stone-200 rounded-xl overflow-hidden transition-all focus-within:border-[var(--tenant-primary)] focus-within:bg-white focus-within:ring-2 focus-within:ring-[var(--tenant-primary)]/10">
                <div className="w-14 h-full flex items-center justify-center text-stone-400 group-focus-within:text-[var(--tenant-primary)] transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <div className="w-px h-6 bg-stone-200 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Ex: Amanda Silva" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="flex-1 h-full px-5 text-stone-900 placeholder:text-stone-400 outline-none text-sm font-semibold bg-transparent" 
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-[10px] font-extrabold text-stone-400 uppercase tracking-[0.2em] ml-1">Seu WhatsApp</label>
              <div className="relative flex items-center h-14 bg-stone-50/50 border border-stone-200 rounded-xl overflow-hidden transition-all focus-within:border-[var(--tenant-primary)] focus-within:bg-white focus-within:ring-2 focus-within:ring-[var(--tenant-primary)]/10">
                <div className="w-14 h-full flex items-center justify-center text-stone-400 group-focus-within:text-[var(--tenant-primary)] transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="w-px h-6 bg-stone-200 transition-colors" />
                <input 
                    type="tel" 
                    placeholder="(00) 90000-0000" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    className="flex-1 h-full px-5 text-stone-900 placeholder:text-stone-400 outline-none text-sm font-semibold bg-transparent" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-5 md:p-8 bg-white border-t border-stone-100 mt-auto sticky bottom-0 z-20 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
        <button className="text-[11px] md:text-xs font-bold text-stone-500 hover:text-[var(--tenant-primary)] hover:bg-stone-50 px-4 py-3 rounded-xl transition-colors flex items-center gap-2 uppercase tracking-widest" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" /> Horário
        </button>
        <button 
          className="bg-[var(--tenant-primary)] text-white px-6 md:px-12 py-4 md:py-5 rounded-2xl text-[13px] md:text-sm font-black shadow-xl  disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-3 hover:-translate-y-1 hover:shadow-2xl  w-full sm:w-auto uppercase tracking-wider" 
          disabled={!name || name.length < 3 || !phone || phone.length < 8 || isSaving} 
          onClick={onNext}
        >
          {isSaving ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Processando...</>
          ) : (
            <>Continuar <ArrowRight className="w-5 h-5" strokeWidth={3} /></>
          )}
        </button>
      </div>
    </div>
  )
}

function ReviewPanel({ selDay, selTime, name, phone, selectedService, services, onSelectService, onBack, onFinalize, isSaving }: any) {
  const [showModal, setShowModal] = React.useState(false)

  const handleServiceSelect = (id: string) => {
    onSelectService(id)
    setShowModal(false)
  }

  return (
    <div className="w-full flex flex-col flex-1 animate-in fade-in slide-in-from-right-8 duration-500 text-left">
      <div className="px-5 py-6 md:px-10 md:py-10 flex-1 flex flex-col justify-center bg-stone-50/30">
        <div className="max-w-md mx-auto w-full bg-white p-8 rounded-3xl border border-stone-100 shadow-sm">
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#0B1426] mb-1 font-serif">Revisão</h2>
            <p className="text-stone-500 text-xs md:text-sm leading-relaxed">Confirme os dados do seu agendamento antes de finalizar.</p>
          </div>
          
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-[0.2em] ml-1">Serviço</span>
              {selectedService ? (
                <div className="flex items-center justify-between bg-stone-50 p-4 rounded-xl border border-stone-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-stone-200">
                        {selectedService.image ? (
                            <img src={selectedService.image} alt={selectedService.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-stone-100 flex items-center justify-center">
                                <Star className="w-4 h-4 text-stone-300" />
                            </div>
                        )}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-stone-900">{selectedService.name}</p>
                      <p className="text-tenant-primary text-xs font-black">R$ {parseFloat(selectedService.price).toFixed(0)}</p>
                    </div>
                  </div>
                  <button onClick={() => setShowModal(true)} className="text-[10px] uppercase font-bold text-stone-400 hover:text-[var(--tenant-primary)]">Alterar</button>
                </div>
              ) : (
                <button onClick={() => setShowModal(true)} className="w-full py-4 rounded-xl border border-dashed border-stone-300 text-stone-500 hover:border-[var(--tenant-primary)] hover:text-[var(--tenant-primary)] hover:bg-stone-50 transition-colors font-bold text-sm">
                  + Escolha um serviço (Opcional)
                </button>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-[0.2em] ml-1">Data e Hora</span>
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 font-bold text-sm text-stone-900">
                {selDay && new Date(selDay.y, selDay.m, selDay.d).toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })} às <span className="text-tenant-primary">{selTime}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-[0.2em] ml-1">Seus Dados</span>
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 flex flex-col gap-1">
                <span className="font-bold text-sm text-stone-900">{name}</span>
                <span className="text-xs text-stone-500">{phone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-5 md:p-8 bg-white border-t border-stone-100 mt-auto sticky bottom-0 z-20 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
        <button className="text-[11px] md:text-xs font-bold text-stone-500 hover:text-[var(--tenant-primary)] hover:bg-stone-50 px-4 py-3 rounded-xl transition-colors flex items-center gap-2 uppercase tracking-widest" onClick={onBack} disabled={isSaving}>
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" /> Identificação
        </button>
        <button 
          className="bg-[var(--tenant-primary)] text-white px-6 md:px-12 py-4 md:py-5 rounded-2xl text-[13px] md:text-sm font-black shadow-xl  disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-3 hover:-translate-y-1 hover:shadow-2xl  w-full sm:w-auto uppercase tracking-wider" 
          disabled={isSaving} 
          onClick={onFinalize}
        >
          {isSaving ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Processando...</>
          ) : (
            <>Finalizar Agendamento <Check className="w-5 h-5" strokeWidth={3} /></>
          )}
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl h-[80vh] md:h-[600px] rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 md:slide-in-from-bottom-0 md:zoom-in-95 duration-300 absolute bottom-0 md:relative">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
              <h3 className="font-bold text-lg text-[#0B1426]">Escolha um Serviço</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center hover:bg-stone-200 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ServicePanel services={services} onSelect={handleServiceSelect} selectedServiceId={selectedService?.id} hideFooter={true} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SuccessPanel({ selDay, selTime, whatsappNumber, clientName, selectedService }: any) {
  const formattedDate = new Date(selDay.y, selDay.m, selDay.d).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })
  const confirmWhatsApp = () => {
    const greeting = clientName ? 'Olá ' + clientName + ', ' : "Olá, "
    const msg = encodeURIComponent(greeting + 'gostaria de confirmar meu agendamento de ' + (selectedService?.name || 'serviço') + ' para o dia ' + formattedDate + ' às ' + selTime + '.')
    window.open('https://wa.me/' + whatsappNumber + '?text=' + msg, "_blank")
  }
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-8 md:p-16 text-center animate-in zoom-in-95 duration-700 bg-white">
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 mb-6 border-4 border-emerald-100 shadow-sm animate-in zoom-in slide-in-from-bottom-4 duration-1000">
        <Check className="w-8 h-8 md:w-10 md:h-10" strokeWidth={3} />
      </div>
      <h2 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight text-[#0B1426] font-serif">Agendamento<br/>Confirmado!</h2>
      <p className="text-stone-500 text-sm md:text-base mb-10 max-w-md leading-relaxed">Parabéns! Seu horário foi reservado com sucesso.</p>
      
      <div className="w-full max-w-md bg-stone-50 border border-stone-100 rounded-3xl p-6 md:p-8 mb-10 grid grid-cols-2 gap-6 text-left shadow-sm">
        <div className="space-y-2">
          <div className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest flex items-center gap-1.5"><Star className="w-3 h-3" style={{ color: 'var(--tenant-hover)' }}/> Procedimento</div>
          <div className="font-bold text-base text-[#0B1426] leading-tight">{selectedService?.name || "Serviço"}</div>
        </div>
        <div className="space-y-2 border-l border-stone-200 pl-6">
          <div className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest flex items-center gap-1.5"><CalendarIcon className="w-3 h-3" style={{ color: 'var(--tenant-hover)' }}/> Data & Hora</div>
          <div className="font-bold text-sm text-[#0B1426] leading-tight">{formattedDate}<br/>às <span style={{ color: 'var(--tenant-hover)' }}>{selTime}</span></div>
        </div>
      </div>

      <button onClick={confirmWhatsApp} className="w-full max-w-sm bg-[#25D366] text-white h-16 rounded-2xl font-bold text-base shadow-lg shadow-[#25D366]/20 hover:brightness-105 hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-3 group">
        Confirmar no WhatsApp <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  )
}

function ServicePanel({ services, onSelect, onNext, selectedServiceId }: any) {
    return (
        <div className="w-full flex flex-col flex-1 animate-in fade-in duration-500">
            <div className="px-5 py-6 md:px-8 md:py-8 border-b border-stone-100 bg-white text-left">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#0B1426] mb-1 font-serif">Selecione o Serviço</h2>
                <p className="text-stone-500 text-xs md:text-sm leading-relaxed max-w-sm">Escolha o procedimento que deseja realizar conosco.</p>
            </div>
            
            <div className="flex-1 overflow-y-auto bg-stone-50/50 p-4 md:p-6 custom-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-5xl mx-auto">
                    {services.map((s: any) => (
                        <button 
                            key={s.id} 
                            onClick={() => onSelect(s.id)}
                            className={cn(
                                "flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group active:scale-[0.98]",
                                selectedServiceId === s.id 
                                    ? "bg-[var(--tenant-primary)] border-[var(--tenant-primary)] text-white shadow-lg" 
                                    : "bg-white border-stone-100 hover:border-stone-200 hover:shadow-md"
                            )}
                        >
                            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-stone-100">
                                {s.image ? (
                                    <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-stone-50 flex items-center justify-center">
                                        <Star className="w-6 h-6 text-stone-200" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className={cn("font-bold text-sm truncate", selectedServiceId === s.id ? "text-white" : "text-stone-900")}>{s.name}</h4>
                                <p className={cn("text-[10px] mt-0.5 line-clamp-1", selectedServiceId === s.id ? "text-stone-300" : "text-stone-500")}>{s.description}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={cn("text-xs font-black", selectedServiceId === s.id ? "text-white" : "text-tenant-primary")}>R$ {parseFloat(s.price).toFixed(0)}</span>
                                    <span className="text-[10px] text-stone-400 opacity-50">•</span>
                                    <span className={cn("text-[10px] font-bold", selectedServiceId === s.id ? "text-stone-400" : "text-stone-400")}>{s.duration} min</span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-4 md:p-6 bg-white border-t border-stone-100 mt-auto flex justify-end">
                <button 
                    className="bg-[var(--tenant-primary)] text-white px-8 h-[50px] rounded-xl text-[15px] font-bold shadow-md disabled:opacity-50 transition-all active:scale-95 flex items-center gap-2 hover:-translate-y-0.5" 
                    disabled={!selectedServiceId} 
                    onClick={onNext}
                >
                    Continuar <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}

export function SchedulingSection({ tenantId, whatsappNumber, services = [], initialServiceId, isModal = false, businessHours, config, themeColors }: SchedulingSectionProps) {
  const [step, setStep] = React.useState<1 | 2 | 3 | 4 | 5>(1)
  const [selDay, setSelDay] = React.useState<SelDay | null>(null)
  const [selTime, setSelTime] = React.useState<string | null>(null)
  const [customerName, setCustomerName] = React.useState("")
  const [customerPhone, setCustomerPhone] = React.useState("")
  const [isSaving, setIsSaving] = React.useState(false)
  const [serviceId, setServiceId] = React.useState<string>(initialServiceId || "")
  const [availableSlots, setAvailableSlots] = React.useState<any[]>([])
  const [isLoadingSlots, setIsLoadingSlots] = React.useState(false)

  React.useEffect(() => {
    if (initialServiceId) {
        setServiceId(initialServiceId)
        setStep(1)
    }
  }, [initialServiceId])

  React.useEffect(() => {
    if (step === 2 && selDay) {
        fetchDayData()
    }
  }, [step, selDay])

  const fetchDayData = async () => {
    if (!selDay || !tenantId) return
    setIsLoadingSlots(true)
    const dateStr = selDay.y + '-' + (selDay.m + 1).toString().padStart(2, '0') + '-' + selDay.d.toString().padStart(2, '0')
    
    try {
        const res = await getPublicAppointmentsByDateAction(tenantId, dateStr)
        if (res.success && res.appointments) {
            calculateSlots(res.appointments)
        }
    } catch (error) {
        console.error("Error fetching slots:", error)
    } finally {
        setIsLoadingSlots(false)
    }
  }

  const calculateSlots = (apts: any[]) => {
    if (!selDay) return
    const date = new Date(selDay.y, selDay.m, selDay.d)
    const dayOfWeek = date.getDay().toString()
    const config = businessHours?.[dayOfWeek]

    const slots: any[] = []
    
    ALL_TIME_SLOTS.forEach(time => {
        const apt = apts.find(a => a.time === time)
        const isOccupied = apt && apt.status !== 'liberado' && apt.status !== 'cancelled'
        const isBlocked = apt && apt.status === 'blocked'
        const isLiberado = apt && apt.status === 'liberado'

        let isOpen = false
        if (config && config.isOpen) {
            const [h, m] = time.split(':').map(Number)
            const [openH, openM] = config.open.split(':').map(Number)
            const [closeH, closeM] = config.close.split(':').map(Number)
            const timeVal = h * 60 + m
            const openVal = openH * 60 + openM
            const closeVal = closeH * 60 + closeM
            isOpen = timeVal >= openVal && timeVal < closeVal
        } else if (!config || !businessHours) {
            // Default 08:00 to 18:00 if no specific configuration
            const [h, m] = time.split(':').map(Number)
            const timeVal = h * 60 + m
            isOpen = timeVal >= 8 * 60 && timeVal < 18 * 60
        }

        // Available if: (Open by config OR Manual Liberado) AND NOT (Occupied OR Blocked)
        const isAvailable = (isOpen || isLiberado) && !isOccupied && !isBlocked

        if (isAvailable) {
            let tag = "Livre"
            if (isLiberado) tag = "Exceção"
            else if (time < "12:00") tag = "Manhã"
            else if (time < "18:00") tag = "Tarde"
            else tag = "Noite"

            slots.push({ time, tag })
        }
    })

    setAvailableSlots(slots)
  }

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
        serviceId: serviceId
      } as any)
      
      if (res.success) { setStep(5) } 
      else { toast.error(res.error || "Erro ao registrar agendamento.") }
    } catch (err) { 
      toast.error("Erro de conexão.") 
    } finally { 
      setIsSaving(false) 
    }
  }

  const InnerContent = (
    <div className={cn(
      "w-full bg-white flex flex-col relative",
      !isModal && "rounded-2xl md:rounded-[2rem] shadow-xl border border-stone-200/50"
    )}>
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px !important; height: 6px !important; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent !important; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: color-mix(in srgb, var(--tenant-hover, #6d4a2a) 30%, transparent) !important; border-radius: 10px !important; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--tenant-hover, #6d4a2a) !important; }
        .custom-scrollbar { scrollbar-width: thin !important; scrollbar-color: color-mix(in srgb, var(--tenant-hover, #6d4a2a) 30%, transparent) transparent !important; }
      `}} />
      <StepIndicator current={(step === 0 ? 1 : step) as any} />
      
      <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar min-h-[500px]">
        {step === 1 && <CalendarPanel selDay={selDay} onSelect={(d: any) => { setSelDay(d); setSelTime(null); }} onNext={() => setStep(2)} businessHours={businessHours} isModal={isModal} selectedService={selectedService} />}
        {step === 2 && selDay && (
          <TimePanel 
            selDay={selDay} 
            selTime={selTime} 
            onSelect={setSelTime} 
            onBack={() => setStep(1)} 
            onNext={() => setStep(3)} 
            availableSlots={availableSlots}
            isLoading={isLoadingSlots}
            selectedService={selectedService}
          />
        )}
        {step === 3 && selDay && selTime && (
          <ContactPanel name={customerName} phone={customerPhone} setName={setCustomerName} setPhone={setCustomerPhone} onBack={() => setStep(2)} onNext={() => setStep(4)} isSaving={false} selDay={selDay} selTime={selTime} selectedService={selectedService} />
        )}
        {step === 4 && selDay && selTime && (
          <ReviewPanel selDay={selDay} selTime={selTime} name={customerName} phone={customerPhone} selectedService={selectedService} services={services} onSelectService={setServiceId} onBack={() => setStep(3)} onFinalize={handleFinalize} isSaving={isSaving} />
        )}
        {step === 5 && selDay && selTime && <SuccessPanel selDay={selDay} selTime={selTime} whatsappNumber={whatsappNumber} clientName={customerName} selectedService={selectedService} />}
      </div>
    </div>
  )

  if (isModal) return InnerContent

  const highlightColor = themeColors?.primary || 'var(--tenant-primary)'
  
  return (
    <section 
      id="agendamento" 
      className="relative py-16 md:py-24 px-4 overflow-hidden border-t border-slate-100" 
      style={{ 
        backgroundColor: 'var(--theme-color-surface, #fafaf9)',
        ['--tenant-hover' as any]: themeColors?.hover || themeColors?.primary || 'var(--tenant-hover)',
      }}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,color-mix(in_srgb,var(--tenant-hover)_10%,transparent)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6" style={{ fontFamily: 'var(--theme-font-heading, serif)' }}
              dangerouslySetInnerHTML={{ __html: renderEditorText(config?.title || "Agenda *Online*").replace(/<em>(.*?)<\/em>/g, `<span class="italic" style="color: ${highlightColor}">$1</span>`) }}
          />
          <div className="flex items-center justify-center gap-4">
             <div className="h-px w-12 md:w-24 bg-slate-200" />
             <p className="text-slate-500 text-[10px] md:text-xs uppercase tracking-[0.3em] font-extrabold">{config?.subtitle || "Exclusividade e Precisão em cada detalhe"}</p>
             <div className="h-px w-12 md:w-24 bg-slate-200" />
          </div>
        </div>

        {InnerContent}
      </div>
    </section>
  )
}
