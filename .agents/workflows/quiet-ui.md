## Quiet UI — Design System Workflow (Mandato360)

Este workflow define regras **pesadas e definitivas** para manter a perfeição visual do Mandato360. 
Toda nova interface ou refatoração deve seguir rigorosamente estes padrões.

---

### 1. Tokens de Cor (Master /master)

| Token             | Hex       | Uso                                              |
|-------------------|-----------|--------------------------------------------------|
| `--primary`       | `#0F2B5B` | Sidebar bg, botões primários, badges na master    |
| `--secondary`     | `#0D9F6E` | Ícones ativos, badges de sucesso, ações positivas |
| `--background`    | `#F0F3F8` | Fundo de toda a área de conteúdo                  |
| `--card`          | `#FFFFFF` | Fundo de cards                                    |
| `--border`        | `#E2E8F0` | Bordas de cards, dividers, inputs                 |
| `--muted`         | `#F1F4F8` | Fundos hover, áreas de input                      |
| `--muted-fg`      | `#4B5C72` | Textos descritivos, labels                        |
| `--foreground`    | `#0A1628` | Textos principais, títulos                        |
| `--destructive`   | `#DC2626` | Apenas para erros críticos                        |

> [!CAUTION]
> **PROIBIDO**: Amarelo (`amber`), laranja (`orange`), vermelho tijolo na área Master. Use variações de `blue`, `emerald`, `violet`, `cyan`, `indigo` para badges de KPI.

---

### 2. Tokens de Cor (Tenant /[tenant]/dashboard)

O tenant é **white-label**. Todas as cores primárias e secundárias vêm do banco de dados:

```tsx
// Em layout.tsx do tenant:
const primaryColor = tenantData.primaryColor || "#0F2B5B"
const secondaryColor = tenantData.secondaryColor || "#0D9F6E"

// Aplicado via CSS custom properties:
style={{
  "--primary": primaryColor,
  "--secondary": secondaryColor,
  "--ring": primaryColor,
  "--sidebar": primaryColor,
  "--sidebar-primary": secondaryColor,
}}
```

**Regras para componentes tenant:**
- Sidebar bg: `style={{ backgroundColor: primaryColor }}`
- Ícone ativo: `style={{ color: secondaryColor }}`
- Bottombar indicator: `style={{ backgroundColor: primaryColor }}`
- Notification dot: `style={{ backgroundColor: secondaryColor }}`
- **NUNCA** usar `bg-primary` ou `text-secondary` hardcoded em componentes tenant — usar `style` dinâmico

---

### 3. Estrutura de Layout (Obrigatória)

```
┌──────────────────────────────────────────────────┐
│ flex h-[100dvh] overflow-hidden bg-[#F0F3F8]     │
│ ┌─────────┬──────────────────────────────────┐   │
│ │ Sidebar │ ┌──────────────  Topbar  ─────┐  │   │
│ │ 220px   │ │ h-14 bg-card border-b       │  │   │
│ │ lg:flex  │ │ Breadcrumbs + Search + Bell │  │   │
│ │ collapse │ ├─────────────────────────────┤  │   │
│ │ → 68px  │ │ Main Content (scrollable)   │  │   │
│ │         │ │ px-4 py-5 pb-24 lg:px-8     │  │   │
│ │         │ │ lg:py-6 lg:pb-6             │  │   │
│ └─────────┘ └─────────────────────────────┘  │   │
│                                               │   │
│ ┌─── Bottombar (mobile only, fixed bottom) ──┐   │
│ │ bg-card/95 backdrop-blur-md z-50           │   │
│ │ safe-area-inset-bottom                     │   │
│ └────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────┘
```

**Regras:**
- Layout é `flex h-[100dvh] overflow-hidden` — ZERO scroll no body
- Sidebar: `hidden lg:flex`, colapsável com animação 300ms
- Topbar: `h-14 shrink-0 border-b border-border bg-card`
- Content: `flex-1 overflow-y-auto` — único scroll da página
- Bottombar: `fixed bottom-0 z-50 lg:hidden`
- **PROIBIDO**: `min-h-screen`, `max-w-6xl`, `max-w-7xl`, containers com largura fixa

---

### 4. Cards e Componentes

```tsx
// Card padrão Quiet UI:
<div className="rounded-xl border border-border bg-card p-5 shadow-sm">
  <div className="mb-4 flex items-center justify-between">
    <h2 className="text-sm font-semibold text-foreground">Título</h2>
    <span className="text-xs text-muted-foreground">Subtítulo</span>
  </div>
  {/* content */}
</div>

// KPI Card (4 colunas):
<div className="rounded-xl border border-border bg-card p-4 md:p-5 shadow-sm">
  <div className="flex items-start justify-between">
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted-foreground">Label</span>
      <span className="text-2xl md:text-3xl font-bold text-foreground">42</span>
    </div>
    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
      <Icon className="h-4 w-4" />
    </div>
  </div>
  <div className="mt-3 flex items-center gap-1.5">
    <ArrowUpRight className="h-3.5 w-3.5 text-secondary" />
    <span className="text-xs font-medium text-secondary">+12%</span>
    <span className="text-xs text-muted-foreground">vs. mês anterior</span>
  </div>
</div>
```

---

### 5. Tipografia

| Elemento              | Classes                                              |
|----------------------|------------------------------------------------------|
| Título de página     | `text-xl font-semibold text-foreground tracking-tight` |
| Subtítulo de página  | `text-sm text-muted-foreground`                       |
| Título de card       | `text-sm font-semibold text-foreground`                |
| Label de KPI         | `text-xs font-medium text-muted-foreground`            |
| Valor de KPI         | `text-2xl md:text-3xl font-bold text-foreground`       |
| Delta positivo       | `text-xs font-medium text-secondary`                   |
| Badge                | `text-[10px] font-bold` + bg de baixa opacidade        |
| Item de lista (nome) | `text-sm font-medium text-foreground truncate`         |
| Item de lista (sub)  | `text-xs text-muted-foreground`                        |
| Navegação sidebar    | `text-sm font-medium`                                  |
| Bottombar labels     | `text-[10px] font-semibold`                            |

---

### 6. Sidebar (Desktop)

- Fundo: `primaryColor` do tenant (ou `#0F2B5B` na master)
- Largura expandida: `220px`, colapsada: `68px`
- Transição: `transition-all duration-300`
- Itens ativos: `bg-white/10 text-white` + ícone em `secondaryColor`
- Itens inativos: `text-white/55 hover:bg-white/[0.08] hover:text-white/90`
- Ícones inativos: `text-white/40 group-hover:text-white/70`
- Indicador ativo: bolinha `1.5w 1.5h rounded-full` em `secondaryColor`
- Seções: collapsíveis com `ChevronDown rotate-180` animado
- Labels de grupo: `text-[10px] font-bold uppercase tracking-wider text-white/30`
- Bordar: `border-r border-white/10`
- Toggle: botão circular `-right-3 top-[72px]` com `border bg-card shadow-sm`

---

### 7. Topbar

- Altura: `h-14`, `border-b border-border bg-card`
- Desktop: `{tenant.name} / {currentPage}` breadcrumbs
- Mobile: Logo compacto + nome da página
- Search: `rounded-lg border bg-muted/40 px-3 py-1.5` com kbd `⌘K`
- Notifications: `h-8 w-8 rounded-lg hover:bg-muted` com dot animado
- Picker: `rounded-lg border bg-card px-3 py-1.5` com avatar + nome + chevron

---

### 8. Bottombar (Mobile)

- `fixed bottom-0 z-50 lg:hidden`
- `bg-card/95 backdrop-blur-md border-t border-border`
- Safe area: `paddingBottom: env(safe-area-inset-bottom)`
- 5 itens: 4 fixos + "Mais" com dropdown upward
- Ativo: pílula `h-0.5 w-8 bg-primary` no topo absoluto + `scale-110` no ícone
- Inativo: `text-muted-foreground`
- Labels: `text-[10px] font-semibold`
- Dropdown: `rounded-2xl border shadow-2xl` com animação `slide-in-from-bottom-2`

---

### 9. Charts e Gráficos

- Container: `rounded-xl border border-border bg-card p-5 shadow-sm`
- Tooltip: `borderRadius: 8, border: "1px solid #E2E8F0", boxShadow: "0 4px 12px rgba(0,0,0,0.06)", fontSize: 12`
- Grid: `strokeDasharray="3 3" stroke="#E2E8F0" vertical={false}`
- Eixos: `tick={{ fontSize: 11, fill: "#4B5C72" }} axisLine={false} tickLine={false}`
- Gradients para AreaChart:
  ```tsx
  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="5%" stopColor="#0D9F6E" stopOpacity={0.15} />
    <stop offset="95%" stopColor="#0D9F6E" stopOpacity={0} />
  </linearGradient>
  ```
- Cores de séries: `#0F2B5B` (primary), `#0D9F6E` (secondary), `#3B82F6` (blue), `#8B5CF6` (violet)
- PieChart: `innerRadius` sempre presente (donut style), `paddingAngle={2}`
- BarChart: `radius={[0, 6, 6, 0]}` ou `[4, 4, 0, 0]`

---

### 10. Paleta de Badges para KPIs (cores frias SOMENTE)

| Contexto       | Background       | Text              |
|---------------|------------------|--------------------|
| Eleitores     | `bg-blue-50`     | `text-blue-600`    |
| Lideranças    | `bg-violet-50`   | `text-violet-600`  |
| Sucesso/OK    | `bg-secondary/10`| `text-secondary`   |
| Projetos      | `bg-cyan-50`     | `text-cyan-600`    |
| Território    | `bg-emerald-50`  | `text-emerald-600` |
| Equipe        | `bg-indigo-50`   | `text-indigo-600`  |

---

### 11. Checklist de Aplicação

- [ ] Layout é `flex h-[100dvh] overflow-hidden`?
- [ ] **Zero** `min-h-screen` ou `max-w-*` no conteúdo?
- [ ] Fundo da área de conteúdo é `#F0F3F8`?
- [ ] Cards usam `rounded-xl border border-border bg-card shadow-sm`?
- [ ] Tons quentes (amber/orange/rose) foram **banidos** na Master?
- [ ] Se `/[tenant]`, cores são dinâmicas via `style={{ }}` e não classes?
- [ ] Sidebar colapsável presente no desktop?
- [ ] Topbar com breadcrumbs e busca presente?
- [ ] Bottombar com glassmorphism e safe-area presente no mobile?
- [ ] Tipografia segue a tabela (seção 5)?
- [ ] Charts usam tooltip estilizado e gradients?
- [ ] KPIs usam layout icon-right com delta + sub?
- [ ] Items de lista usam `hover:bg-muted/50 transition-colors`?
- [ ] Font-family é `Outfit / Inter`?
- [ ] Nenhum `<Card />` com `border-0`? (sempre `border border-border`)

---

### Como Usar

Ao criar uma nova página, instruir o Antigravity:

> "/quiet-ui aplique os padrões nesta tela de [Nome da Feature]"

O agente DEVE:
1. Verificar cada item da checklist (seção 11)
2. Usar os tokens exatos (seção 1 ou 2)
3. Seguir a estrutura de layout (seção 3)
4. Copiar os snippets de referência (seção 4)
5. Não inventar cores — consultar a paleta (seção 10)

---

*A interface é "Quiet" — silenciosa, elegante, focada nos dados, com cores frias, muito respiro, e uma experiência nativa no mobile.*
