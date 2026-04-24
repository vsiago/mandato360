const fs = require('fs');
const content = `\"use client\"

import * as React from \"react\"
import { Calendar as CalendarIcon, Clock, Check, ChevronLeft, ChevronRight, Loader2 } from \"lucide-react\"
import { createPublicAppointmentAction } from \"@/lib/actions/appointments\"
import { toast } from \"sonner\"
import { cn } from \"@/lib/utils\"

interface SchedulingSectionProps {
  tenantId: string
  whatsappNumber: string
  clientName?: string
}

interface SelDay {
  d: number
  m: number
  y: number
}

const MONTHS_PT = [
  \"Janeiro\", \"Fevereiro\", \"Marco\", \"Abril\", \"Maio\", \"Junho\",
  \"Julho\", \"Agosto\", \"Setembro\", \"Outubro\", \"Novembro\", \"Dezembro\",
]

const WEEKDAYS = [\"Dom\", \"Seg\", \"Ter\", \"Qua\", \"Qui\", \"Sex\", \"Sab\"]

const SLOTS = [
  { time: \"09:00\", tag: \"Melhor\", type: \"best\" },
  { time: \"10:00\", tag: \"Livre\", type: \"free\" },
  { time: \"11:00\", tag: \"Melhor\", type: \"best\" },
  { time: \"14:00\", tag: \"Livre\", type: \"free\" },
  { time: \"15:00\", tag: \"Livre\", type: \"free\" },
  { time: \"16:00\", tag: \"Ultimas vagas\", type: \"last\" },
  { time: \"17:00\", tag: \"Livre\", type: \"free\" },
  { time: \"18:00\", tag: \"Livre\", type: \"free\" },
]

function StepIndicator({ current }: { current: 1 | 2 | 3 | 4 }) {
  const steps = [
    { n: 1, label: \"Data\" },
    { n: 2, label: \"Horario\" },
    { n: 3, label: \"Identificacao\" },
    { n: 4, label: \"Confirmar\" },
  ]
  return (
    <div className=\"flex items-center justify-center px-2 py-4 md:py-8 border-b border-stone-100 bg-stone-50/50 text-stone-900\">
      <div className=\"flex items-center justify-between w-full max-w-4xl mx-auto gap-0.5\">
        {steps.map((s) => {
          const isDone = s.n < current
          const isActive = s.n === current
          return (
            <div key={s.n} className=\"flex flex-col items-center gap-1 md:gap-2 flex-1 relative\">
              {s.n !== 1 && (
                <div className={cn(
                  \"absolute top-3.5 md:top-4 left-[-50%] right-[50%] h-0.5 z-0 transition-colors duration-500\",
                  isDone || isActive ? 'bg-amber-500' : 'bg-stone-200'
                )} />
              )}
              <div className={cn(
                \"w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold transition-all duration-300 z-10\",
                isDone || isActive ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-stone-200 text-stone-500'
              )}>
                {isDone ? \"OK\" : s.n}
              </div>
              <span className={cn(
                \"text-[6px] md:text-[8px] font-bold uppercase tracking-widest transition-colors duration-300 text-center\",
                isActive ? 'text-amber-600' : isDone ? 'text-amber-500' : 'text-stone-400'
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
    ? new Date(selDay.y, selDay.m, selDay.d).toLocaleDateString(\"pt-BR\", { day: \"numeric\", month: \"long\" })
    : \"Selecione uma data\"

  return (
    <div className=\"w-full flex flex-col flex-1 animate-in fade-in slide-in-from-right-4 duration-300\">
      <div className=\"flex items-center justify-between px-6 py-4 md:px-10 md:py-8 shadow-[0_4px_20px_rgba(0,0,0,0.01)] text-stone-900\">
        <div className=\"text-lg md:text-xl font-bold\" style={{ fontFamily: 'var(--font-playfair), serif' }}>
          {MONTHS_PT[viewMonth]} <span className=\"text-stone-300 font-light ml-1\">{viewYear}</span>
        </div>
        <div className=\"flex gap-2\">
          <button className=\"w-8 h-8 md:w-10 md:h-10 rounded-lg border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-amber-500 hover:border-amber-500 hover:text-black transition-all disabled:opacity-30\" disabled={viewYear === now.getFullYear() && viewMonth === now.getMonth()} onClick={() => changeMonth(-1)}>
            <ChevronLeft className=\"w-4 h-4\" />
          </button>
          <button className=\"w-8 h-8 md:w-10 md:h-10 rounded-lg border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-amber-500 hover:border-amber-500 hover:text-black transition-all\" onClick={() => changeMonth(1)}>
            <ChevronRight className=\"w-4 h-4\" />
          </button>
        </div>
      </div>
      <div className=\"px-4 md:px-10 py-2 md:py-4 flex-1 text-stone-900\">
        <div className=\"grid grid-cols-7 mb-1\">
          {WEEKDAYS.map(w => (<span key={w} className=\"text-[9px] font-bold text-stone-400 uppercase tracking-widest text-center py-1\">{w}</span>))}
        </div>
        <div className=\"grid grid-cols-7 gap-1\">
          {Array.from({ length: firstDay }).map((_, i) => (<div key={'e-'+i} className=\"h-8 md:h-12\" />))}
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
                    \"h-8 sm:h-12 md:h-16 flex items-center justify-center rounded-lg md:rounded-xl text-sm md:text-base font-medium transition-all\",
                    isSel ? 'bg-amber-500 text-black shadow-md' : isPast ? 'text-stone-200 cursor-not-allowed' : 'text-stone-700 hover:bg-stone-50'
                )}
              >
                {d}
              </button>
            )
          })}
        </div>
      </div>
      <div className=\"flex items-center justify-between p-6 md:p-8 border-t border-stone-100 bg-stone-50/50 mt-auto\">
        <span className=\"text-xs text-stone-500 flex-1 text-left\">{selDay ? formattedDate : \"Selecione uma data\"}</span>
        <button className=\"bg-amber-500 text-black px-6 py-3 md:px-8 md:py-4 rounded-xl text-xs font-bold shadow-md disabled:opacity-50\" disabled={!selDay} onClick={onNext}>
          Horarios →
        </button>
      </div>
    </div>
  )
}

function TimePanel({ selDay, selTime, onSelect, onBack, onNext }: any) {
  const formattedDate = new Date(selDay.y, selDay.m, selDay.d).toLocaleDateString(\"pt-BR\", { day: \"numeric\", month: \"long\" })
  return (
    <div className=\"w-full flex flex-col flex-1 animate-in fade-in slide-in-from-right-4 duration-300\">
      <div className=\"px-6 py-6 md:px-10 md:py-8 text-stone-900 text-left\">
        <h2 className=\"text-lg font-semibold mb-2\">Qual melhor horario?</h2>
        <div className=\"inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1 rounded-lg text-[10px] font-bold\">{formattedDate}</div>
      </div>
      <div className=\"grid grid-cols-2 sm:grid-cols-4 gap-2 px-6 pb-6 md:px-10 overflow-y-auto max-h-80\">
        {SLOTS.map(s => (
          <button 
            key={s.time} 
            onClick={() => onSelect(s.time)} 
            className={cn(
                \"py-4 rounded-lg border transition-all flex flex-col items-center\",
                selTime === s.time ? 'bg-amber-500 border-amber-500 text-black shadow-md font-bold' : 'bg-white border-stone-100 text-stone-600 hover:border-amber-200'
            )}
          >
            <div className=\"text-base\">{s.time}</div>
            <div className=\"text-[7px] uppercase tracking-widest mt-0.5\">{s.tag}</div>
          </button>
        ))}
      </div>
      <div className=\"flex items-center justify-between p-6 md:p-8 border-t border-stone-100 bg-stone-50/50 mt-auto\">
        <button className=\"text-[9px] font-bold text-stone-400 tracking-widest uppercase hover:text-stone-900\" onClick={onBack}>← Voltar</button>
        <button className=\"bg-amber-500 text-black px-6 py-3 md:px-8 md:py-4 rounded-xl text-xs font-bold shadow-md disabled:opacity-50\" disabled={!selTime} onClick={onNext}>Proximo →</button>
      </div>
    </div>
  )
}

function ContactPanel({ name, phone, setName, setPhone, onBack, onNext }: any) {
  return (
    <div className=\"w-full flex flex-col flex-1 animate-in fade-in slide-in-from-right-4 duration-300\">
      <div className=\"px-6 py-6 md:px-10 md:py-10 text-stone-900 text-left\">
        <h2 className=\"text-xl md:text-2xl font-bold mb-2\">So mais um detalhe...</h2>
        <p className=\"text-stone-400 text-xs md:text-sm mb-8\">Precisamos do seu contato para confirmar o agendamento.</p>
        <div className=\"space-y-4 max-w-sm\">
          <div className=\"space-y-1.5\">
            <label className=\"text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1\">Seu Nome Completo</label>
            <input 
                type=\"text\" 
                placeholder=\"Ex: Maria Silva\" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className=\"w-full h-12 md:h-14 bg-stone-50 border border-stone-200 rounded-xl px-4 text-stone-900 focus:ring-2 focus:ring-amber-500/20 outline-none\" 
            />
          </div>
          <div className=\"space-y-1.5\">
            <label className=\"text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1\">Seu WhatsApp</label>
            <input 
                type=\"tel\" 
                placeholder=\"(00) 00000-0000\" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                className=\"w-full h-12 md:h-14 bg-stone-50 border border-stone-200 rounded-xl px-4 text-stone-900 focus:ring-2 focus:ring-amber-500/20 outline-none\" 
            />
          </div>
        </div>
      </div>
      <div className=\"flex items-center justify-between p-6 md:p-8 border-t border-stone-100 bg-stone-50/50 mt-auto\">
        <button className=\"text-[9px] font-bold text-stone-400 tracking-widest uppercase hover:text-stone-900\" onClick={onBack}>← Horario</button>
        <button className=\"bg-amber-500 text-black px-8 py-3 md:px-10 md:py-4 rounded-xl text-xs font-bold shadow-md disabled:opacity-50\" disabled={!name || !phone} onClick={onNext}>Finalizar →</button>
      </div>
    </div>
  )
}

function ConfirmPanel({ selDay, selTime, whatsappNumber, clientName }: any) {
  const formattedDate = new Date(selDay.y, selDay.m, selDay.d).toLocaleDateString(\"pt-BR\", { day: \"numeric\", month: \"long\", year: \"numeric\" })
  const confirmWhatsApp = () => {
    const greeting = clientName ? 'Ola ' + clientName + ', ' : \"Ola, \"
    const msg = encodeURIComponent(greeting + 'gostaria de confirmar meu agendamento para ' + formattedDate + ' as ' + selTime + '.')
    window.open('https://wa.me/' + whatsappNumber + '?text=' + msg, \"_blank\")
  }
  return (
    <div className=\"w-full flex-1 flex flex-col items-center justify-center p-6 md:p-10 text-center text-stone-900 animate-in zoom-in-95 duration-500\">
      <div className=\"w-16 h-16 md:w-20 md:h-20 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 mb-6\">
        <Check className=\"w-10 h-10\" strokeWidth={3} />
      </div>
      <h2 className=\"text-2xl md:text-3xl font-bold mb-2\">Tudo pronto!</h2>
      <p className=\"text-stone-400 text-xs mb-8\">Seu agendamento foi registrado. Confirme no WhatsApp abaixo.</p>
      <div className=\"w-full max-w-lg bg-stone-50 border border-stone-200 rounded-2xl p-6 mb-8 grid grid-cols-2 gap-4 text-left\">
        <div><div className=\"text-[8px] font-bold text-stone-400 uppercase tracking-widest\">Data</div><div className=\"font-bold\">{formattedDate}</div></div>
        <div><div className=\"text-[8px] font-bold text-stone-400 uppercase tracking-widest\">Horario</div><div className=\"font-bold\">{selTime}</div></div>
      </div>
      <button onClick={confirmWhatsApp} className=\"w-full max-w-xs bg-[#25D366] text-white h-14 md:h-18 rounded-2xl font-bold text-lg shadow-lg hover:brightness-110 transition-all active:scale-95\">
        Confirmar no WhatsApp
      </button>
    </div>
  )
}

export function SchedulingSection({ tenantId, whatsappNumber, clientName }: SchedulingSectionProps) {
  const [step, setStep] = React.useState<1 | 2 | 3 | 4>(1)
  const [selDay, setSelDay] = React.useState<SelDay | null>(null)
  const [selTime, setSelTime] = React.useState<string | null>(null)
  const [customerName, setCustomerName] = React.useState(\"\")
  const [customerPhone, setCustomerPhone] = React.useState(\"\")
  const [isSaving, setIsSaving] = React.useState(false)

  const handleFinalize = async () => {
    if (!selDay || !selTime || !customerName || !customerPhone) return
    setIsSaving(true)
    const dateStr = selDay.y + '-' + (selDay.m + 1).toString().padStart(2, '0') + '-' + selDay.d.toString().padStart(2, '0')
    try {
      const res = await createPublicAppointmentAction({ 
        tenantId, 
        customerName, 
        customerPhone, 
        date: dateStr, 
        time: selTime 
      } as any)
      if (res.success) { 
        setStep(4) 
      } else { 
        toast.error(res.error || \"Erro.\") 
      }
    } catch (err) { 
      toast.error(\"Erro de conexao.\") 
    } finally { 
      setIsSaving(false) 
    }
  }

  return (
    <section id=\"agendamento\" className=\"relative py-8 md:py-20 px-2 md:px-4 bg-stone-50\">
      <div className=\"relative z-10 w-full max-w-7xl mx-auto px-1 md:px-6\">
        <div className=\"text-center mb-6 md:mb-12\">
          <h2 className=\"text-2xl md:text-5xl font-bold text-slate-900 mb-2\">
            Agende em <span className=\"text-amber-500 italic\">poucos segundos</span>
          </h2>
          <p className=\"text-stone-400 text-xs uppercase tracking-widest font-medium\">Escolha uma data e horario disponivel</p>
        </div>
        <div className=\"w-full max-w-3xl mx-auto bg-white rounded-2xl md:rounded-3xl shadow-sm border border-stone-100 overflow-hidden flex flex-col min-h-[480px] md:min-h-[560px] relative\">
          <StepIndicator current={step} />
          {isSaving && (
            <div className=\"absolute inset-0 bg-white/60 backdrop-blur-sm z-[100] flex flex-col items-center justify-center\">
                <Loader2 className=\"w-10 h-10 text-amber-500 animate-spin mb-2\" />
                <p className=\"text-sm font-bold text-amber-900 uppercase tracking-widest\">Agendando...</p>
            </div>
          )}
          {step === 1 && <CalendarPanel selDay={selDay} onSelect={(d: any) => { setSelDay(d); setSelTime(null); }} onNext={() => setStep(2)} />}
          {step === 2 && selDay && <TimePanel selDay={selDay} selTime={selTime} onSelect={setSelTime} onBack={() => setStep(1)} onNext={() => setStep(3)} />}
          {step === 3 && selDay && selTime && (
            <ContactPanel name={customerName} phone={customerPhone} setName={setCustomerName} setPhone={setCustomerPhone} onBack={() => setStep(2)} onNext={handleFinalize} />
          )}
          {step === 4 && selDay && selTime && <ConfirmPanel selDay={selDay} selTime={selTime} whatsappNumber={whatsappNumber} clientName={customerName} />}
        </div>
      </div>
    </section>
  )
}
\`;

fs.writeFileSync('c:/Users/iago-note/.gemini/antigravity/playground/dark-kepler/components/scheduling-section.tsx', content, 'utf8');
console.log('SchedulingSection updated with simplified UTF-8');
