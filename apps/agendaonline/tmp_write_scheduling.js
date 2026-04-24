const fs = require('fs');
const content = `\"use client\"

import * as React from \"react\"
import { Calendar as CalendarIcon, Clock, Check, ChevronLeft, ChevronRight, Loader2, User, Phone, ArrowRight } from \"lucide-react\"
import { createPublicAppointmentAction } from \"@/lib/actions/appointments\"
import { toast } from \"sonner\"
import { cn } from \"@/lib/utils\"

interface SchedulingSectionProps {
  tenantId: string
  whatsappNumber: string
}

interface SelDay {
  d: number
  m: number
  y: number
}

const MONTHS_PT = [
  \"Janeiro\", \"Fevereiro\", \"Mar\\u00E7o\", \"Abril\", \"Maio\", \"Junho\",
  \"Julho\", \"Agosto\", \"Setembro\", \"Outubro\", \"Novembro\", \"Dezembro\",
]

const WEEKDAYS = [\"Dom\", \"Seg\", \"Ter\", \"Qua\", \"Qui\", \"Sex\", \"Sab\"]

const SLOTS = [
  { time: \"08:00\", tag: \"Inicio\", type: \"free\" },
  { time: \"09:00\", tag: \"Melhor\", type: \"best\" },
  { time: \"10:00\", tag: \"Livre\", type: \"free\" },
  { time: \"11:00\", tag: \"Melhor\", type: \"best\" },
  { time: \"12:00\", tag: \"Intervalo\", type: \"free\" },
  { time: \"13:00\", tag: \"Livre\", type: \"free\" },
  { time: \"14:00\", tag: \"Livre\", type: \"free\" },
  { time: \"15:00\", tag: \"Livre\", type: \"free\" },
  { time: \"16:00\", tag: \"Ultimas vagas\", type: \"last\" },
  { time: \"17:00\", tag: \"Livre\", type: \"free\" },
  { time: \"18:00\", tag: \"Livre\", type: \"free\" },
  { time: \"19:00\", tag: \"Noite\", type: \"free\" },
]

function StepIndicator({ current }: { current: 1 | 2 | 3 | 4 }) {
  const steps = [
    { n: 1, label: \"Data\" },
    { n: 2, label: \"Horario\" },
    { n: 3, label: \"Identificacao\" },
    { n: 4, label: \"Confirmar\" },
  ]
  return (
    <div className=\"flex items-center justify-center px-4 py-6 md:py-10 border-b border-stone-100 bg-stone-50/50\">
      <div className=\"flex items-center justify-between w-full max-w-2xl mx-auto gap-1 relative\">
        {steps.map((s) => {
          const isDone = s.n < current
          const isActive = s.n === current
          return (
            <div key={s.n} className=\"flex flex-col items-center gap-2 flex-1 relative z-10\">
              {s.n !== 1 && (
                <div className={cn(
                  \"absolute top-4 left-[-50%] right-[50%] h-[2px] z-0 transition-colors duration-500\",
                  isDone || isActive ? 'bg-amber-500' : 'bg-stone-200'
                )} />
              )}
              <div className={cn(
                \"w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-bold transition-all duration-300 shadow-sm\",
                isDone || isActive ? 'bg-amber-500 text-black shadow-amber-500/20' : 'bg-stone-200 text-stone-400'
              )}>
                {isDone ? \"OK\" : s.n}
              </div>
              <span className={cn(
                \"text-[8px] md:text-[10px] font-bold uppercase tracking-widest transition-colors duration-300\",
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
    <div className=\"w-full flex flex-col flex-1 animate-in fade-in slide-in-from-right-8 duration-500\">
      <div className=\"flex items-center justify-between px-6 py-4 md:px-10 md:py-8 border-b border-stone-50\">
        <div className=\"text-lg md:text-xl font-bold text-stone-900\">
          {MONTHS_PT[viewMonth]} <span className=\"text-stone-300 font-light ml-1\">{viewYear}</span>
        </div>
        <div className=\"flex gap-2\">
          <button className=\"w-10 h-10 rounded-xl border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-amber-500 hover:border-amber-500 hover:text-black transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xs active:scale-95\" disabled={viewYear === now.getFullYear() && viewMonth === now.getMonth()} onClick={() => changeMonth(-1)}>
            <ChevronLeft className=\"w-5 h-5\" />
          </button>
          <button className=\"w-10 h-10 rounded-xl border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-amber-500 hover:border-amber-500 hover:text-black transition-all shadow-xs active:scale-95\" onClick={() => changeMonth(1)}>
            <ChevronRight className=\"w-5 h-5\" />
          </button>
        </div>
      </div>
      
      <div className=\"px-4 md:px-10 py-6 flex-1\">
        <div className=\"grid grid-cols-7 mb-4\">
          {WEEKDAYS.map(w => (<span key={w} className=\"text-[10px] font-bold text-stone-400 uppercase tracking-widest text-center\">{w}</span>))}
        </div>
        <div className=\"grid grid-cols-7 gap-1 md:gap-2\">
          {Array.from({ length: firstDay }).map((_, i) => (<div key={'e-'+i} className=\"aspect-square\" />))}
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
                    \"aspect-square flex items-center justify-center rounded-xl md:rounded-2xl text-sm md:text-lg font-semibold transition-all shadow-xs active:scale-95\",
                    isSel ? 'bg-amber-500 text-black shadow-md' : isPast ? 'text-stone-200' : 'text-stone-700 bg-white border border-stone-100 hover:border-amber-400 hover:text-amber-600'
                )}
              >
                {d}
              </button>
            )
          })}
        </div>
      </div>

      <div className=\"flex items-center justify-between p-6 md:p-10 bg-stone-50 border-t border-stone-100\">
        <div className=\"flex flex-col\">
          <span className=\"text-[10px] uppercase font-bold text-stone-400 tracking-tighter text-left\">Data selecionada</span>
          <span className=\"text-sm font-bold text-stone-900\">{selDay ? formattedDate : \"--- --- ---\"}</span>
        </div>
        <button className=\"bg-amber-500 text-black px-8 py-4 rounded-2xl text-sm font-bold shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95 flex items-center gap-2 group\" disabled={!selDay} onClick={onNext}>
          Escolher Horario <ArrowRight className=\"w-4 h-4 transition-transform group-hover:translate-x-1\" />
        </button>
      </div>
    </div>
  )
}

function TimePanel({ selDay, selTime, onSelect, onBack, onNext }: any) {
  const formattedDate = new Date(selDay.y, selDay.m, selDay.d).toLocaleDateString(\"pt-BR\", { day: \"numeric\", month: \"long\" })
  return (
    <div className=\"w-full flex flex-col flex-1 animate-in fade-in slide-in-from-right-8 duration-500\">
      <div className=\"px-6 py-6 md:px-10 md:py-10 text-left\">
        <div className=\"inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest mb-4 border border-amber-100\">
          <CalendarIcon className=\"w-3 h-3\" /> {formattedDate}
        </div>
        <h2 className=\"text-2xl md:text-3xl font-bold text-stone-900 mb-2\">Horarios Disponiveis</h2>
        <p className=\"text-stone-400 text-sm\">Selecione o melhor momento para o seu atendimento.</p>
      </div>

      <div className=\"grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-3 px-6 pb-6 md:px-10 overflow-y-auto max-h-[400px] custom-scrollbar\">
        {SLOTS.map(s => (
          <button 
            key={s.time} 
            onClick={() => onSelect(s.time)} 
            className={cn(
                \"py-5 rounded-2xl border transition-all flex flex-col items-center gap-1 active:scale-95\",
                selTime === s.time 
                  ? 'bg-amber-500 border-amber-500 text-black shadow-lg shadow-amber-500/20 font-bold' 
                  : 'bg-white border-stone-100 text-stone-600 hover:border-amber-300 hover:bg-amber-50/30'
            )}
          >
            <span className=\"text-xl\">{s.time}</span>
            <span className={cn(
              \"text-[8px] uppercase tracking-tighter\",
              selTime === s.time ? \"text-black/60\" : \"text-stone-400\"
            )}>{s.tag}</span>
          </button>
        ))}
      </div>

      <div className=\"flex items-center justify-between p-6 md:p-10 bg-stone-50 border-t border-stone-100\">
        <button className=\"text-xs font-bold text-stone-400 hover:text-stone-900 transition-colors flex items-center gap-1\" onClick={onBack}>
          <ChevronLeft className=\"w-4 h-4\" /> Redefinir Data
        </button>
        <button className=\"bg-amber-500 text-black px-8 py-4 rounded-2xl text-sm font-bold shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95 flex items-center gap-2 group\" disabled={!selTime} onClick={onNext}>
          Continuar <ArrowRight className=\"w-4 h-4 transition-transform group-hover:translate-x-1\" />
        </button>
      </div>
    </div>
  )
}

function ContactPanel({ name, phone, setName, setPhone, onBack, onNext, isSaving }: any) {
  return (
    <div className=\"w-full flex flex-col flex-1 animate-in fade-in slide-in-from-right-8 duration-500\">
      <div className=\"px-6 py-6 md:px-10 md:py-12 text-left\">
        <div className=\"max-w-md\">
          <h2 className=\"text-2xl md:text-4xl font-bold text-stone-900 mb-4\">So mais um passo...</h2>
          <p className=\"text-stone-500 text-sm md:text-base mb-10 leading-relaxed\">Para confirmar seu agendamento, por favor informe seus dados de contato.</p>
          
          <div className=\"space-y-6\">
            <div className=\"space-y-2\">
              <label className=\"text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] ml-1\">Seu Nome Completo</label>
              <div className=\"relative group\">
                <div className=\"absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 transition-colors group-focus-within:text-amber-500\">
                  <User className=\"w-5 h-5\" />
                </div>
                <input 
                    type=\"text\" 
                    placeholder=\"Ex: Maria Oliveira\" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className=\"w-full h-14 bg-white border border-stone-200 rounded-2xl pl-12 pr-4 text-stone-900 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all text-base\" 
                />
              </div>
            </div>

            <div className=\"space-y-2\">
              <label className=\"text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] ml-1\">Seu WhatsApp</label>
              <div className=\"relative group\">
                <div className=\"absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 transition-colors group-focus-within:text-amber-500\">
                  <Phone className=\"w-5 h-5\" />
                </div>
                <input 
                    type=\"tel\" 
                    placeholder=\"(21) 98888-7777\" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    className=\"w-full h-14 bg-white border border-stone-200 rounded-2xl pl-12 pr-4 text-stone-900 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all text-base\" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className=\"flex items-center justify-between p-6 md:p-10 bg-stone-50 border-t border-stone-100\">
        <button className=\"text-xs font-bold text-stone-400 hover:text-stone-900 transition-colors flex items-center gap-1\" onClick={onBack}>
          <ChevronLeft className=\"w-4 h-4\" /> Alterar Horario
        </button>
        <button className=\"bg-amber-500 text-black px-10 py-4 rounded-2xl text-base font-black shadow-xl shadow-amber-500/30 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95 flex items-center gap-3 uppercase tracking-wider\" disabled={!name || name.length < 3 || !phone || phone.length < 8 || isSaving} onClick={onNext}>
          {isSaving ? (
            <><Loader2 className=\"w-5 h-5 animate-spin\" /> Agendando...</>
          ) : (
            <>Finalizar Agendamento <Check className=\"w-5 h-5\" /></>
          )}
        </button>
      </div>
    </div>
  )
}

function ConfirmPanel({ selDay, selTime, whatsappNumber, clientName }: any) {
  const formattedDate = new Date(selDay.y, selDay.m, selDay.d).toLocaleDateString(\"pt-BR\", { day: \"numeric\", month: \"long\", year: \"numeric\" })
  const confirmWhatsApp = () => {
    const greeting = clientName ? 'Ola ' + clientName + ', ' : \"Ola, \"
    const msg = encodeURIComponent(greeting + 'gostaria de confirmar meu agendamento na sua agenda para o dia ' + formattedDate + ' as ' + selTime + '.')
    window.open('https://wa.me/' + whatsappNumber + '?text=' + msg, \"_blank\")
  }
  return (
    <div className=\"w-full flex-1 flex flex-col items-center justify-center p-8 md:p-16 text-center text-stone-900 animate-in zoom-in-95 duration-700\">
      <div className=\"w-20 h-20 md:w-24 md:h-24 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 mb-8 border border-emerald-100 shadow-xl shadow-emerald-500/10\">
        <Check className=\"w-10 h-10 md:w-12 md:h-12\" strokeWidth={3} />
      </div>
      <h2 className=\"text-3xl md:text-5xl font-black mb-4 tracking-tighter\">Tudo Pronto!</h2>
      <p className=\"text-stone-400 text-sm md:text-base mb-10 max-w-sm\">Seu agendamento foi registrado com sucesso. Clique abaixo para confirmar em nosso WhatsApp agora mesmo.</p>
      
      <div className=\"w-full max-w-md bg-stone-50 border border-stone-200 rounded-3xl p-6 md:p-8 mb-10 grid grid-cols-2 gap-6 text-left shadow-sm\">
        <div className=\"space-y-1\">
          <div className=\"text-[10px] font-bold text-stone-400 uppercase tracking-widest\">Data Marcada</div>
          <div className=\"font-bold text-lg text-stone-900\">{formattedDate}</div>
        </div>
        <div className=\"space-y-1\">
          <div className=\"text-[10px] font-bold text-stone-400 uppercase tracking-widest\">Horario</div>
          <div className=\"font-bold text-lg text-stone-900\">{selTime}</div>
        </div>
      </div>

      <button onClick={confirmWhatsApp} className=\"w-full max-w-md bg-[#25D366] text-white h-16 md:h-20 rounded-3xl font-black text-xl shadow-2xl shadow-emerald-500/30 hover:brightness-110 hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-4\">
        Avisar por WhatsApp <span className=\"w-8 h-8 rounded-full bg-white/20 flex items-center justify-center\"><ArrowRight className=\"w-5 h-5\" /></span>
      </button>
    </div>
  )
}

export function SchedulingSection({ tenantId, whatsappNumber }: SchedulingSectionProps) {
  const [step, setStep] = React.useState<1 | 2 | 3 | 4>(1)
  const [selDay, setSelDay] = React.useState<SelDay | null>(null)
  const [selTime, setSelTime] = React.useState<string | null>(null)
  const [customerName, setCustomerName] = React.useState(\"\")
  const [customerPhone, setCustomerPhone] = React.useState(\"\")
  const [isSaving, setIsSaving] = React.useState(false)

  const handleFinalize = async () => {
    if (!selDay || !selTime || !customerName || !customerPhone || !tenantId) return
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
        toast.error(res.error || \"Erro ao agendar.\") 
      }
    } catch (err) { 
      toast.error(\"Erro de conexao com o servidor.\") 
    } finally { 
      setIsSaving(false) 
    }
  }

  return (
    <section id=\"agendamento\" className=\"relative py-12 md:py-32 px-4 bg-stone-50 overflow-hidden\">
      <div className=\"absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none\" />
      
      <div className=\"relative z-10 w-full max-w-4xl mx-auto\">
        <div className=\"text-center mb-10 md:mb-16\">
          <h2 className=\"text-3xl md:text-6xl font-black text-stone-900 mb-4 tracking-tighter\">
            Agende em <span className=\"text-amber-500\">3 cliques</span>
          </h2>
          <p className=\"text-stone-400 text-xs md:text-sm uppercase tracking-[0.3em] font-bold\">Simples, rapido e sem esforco</p>
        </div>

        <div className=\"w-full bg-white rounded-[2.5rem] md:rounded-[4rem] shadow-2xl shadow-stone-200/50 border border-stone-100 overflow-hidden flex flex-col min-h-[600px] md:min-h-[720px] relative\">
          <StepIndicator current={step} />
          
          <div className=\"flex-1 flex flex-col\">
            {step === 1 && <CalendarPanel selDay={selDay} onSelect={(d: any) => { setSelDay(d); setSelTime(null); }} onNext={() => setStep(2)} />}
            {step === 2 && selDay && <TimePanel selDay={selDay} selTime={selTime} onSelect={setSelTime} onBack={() => setStep(1)} onNext={() => setStep(3)} />}
            {step === 3 && selDay && selTime && (
              <ContactPanel name={customerName} phone={customerPhone} setName={setCustomerName} setPhone={setCustomerPhone} onBack={() => setStep(2)} onNext={handleFinalize} isSaving={isSaving} />
            )}
            {step === 4 && selDay && selTime && <ConfirmPanel selDay={selDay} selTime={selTime} whatsappNumber={whatsappNumber} clientName={customerName} />}
          </div>
        </div>

        <div className=\"mt-12 text-center\">
          <p className=\"text-stone-400 text-xs flex items-center justify-center gap-2 font-medium\">
            <Check className=\"w-4 h-4 text-emerald-500\" /> Seus dados estao seguros e nao serao compartilhados.
          </p>
        </div>
      </div>
    </section>
  )
}
\`;

fs.writeFileSync('c:/Users/iago-note/.gemini/antigravity/playground/dark-kepler/components/scheduling-section.tsx', content, 'utf8');
console.log('SchedulingSection written with clean ASCII/UTF-8');
