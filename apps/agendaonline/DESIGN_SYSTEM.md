# Agenda Online — Design System

> **Single source of truth** for every `/painel` dashboard page.
> All components MUST follow these rules. No exceptions, no ad-hoc values.

---

## 1. Typography

| Token | Class | Size | Usage |
|---|---|---|---|
| **Display** | `text-2xl font-semibold` | 24px | Page titles (Playfair Display) |
| **Heading** | `text-lg font-semibold` | 18px | Card/section titles |
| **Subheading** | `text-sm font-medium` | 14px | Card subtitles, secondary headings |
| **Body** | `text-sm font-normal` | 14px | Default body text |
| **Caption** | `text-xs font-medium` | 12px | Labels, metadata, timestamps |
| **Overline** | `text-xs font-medium uppercase tracking-wide` | 12px | Category labels, section dividers |
| **Metric** | `text-2xl font-bold` | 24px | Stat numbers, KPIs |

### Rules

- **Playfair Display** → page-level titles ONLY (`text-2xl`)
- **Inter** → everything else (UI font)
- **No arbitrary sizes** → never use `text-[9px]`, `text-[10px]`, `text-[11px]`, `text-[7px]`
- **Max 3 weight levels per view** → `font-normal`, `font-medium`, `font-semibold`
- **`font-bold`** → metrics and strong emphasis only
- **`font-black` / `font-extrabold`** → never

---

## 2. Colors (Semantic)

Use shadcn semantic tokens wherever possible.

| Token | Light | Dark | Usage |
|---|---|---|---|
| `text-foreground` | stone-900 | stone-50 | Primary text |
| `text-muted-foreground` | stone-500 | stone-400 | Secondary text, labels |
| `bg-card` | white | stone-900 | Card backgrounds |
| `bg-muted` | stone-100 | stone-800 | Sunken/secondary surfaces |
| `border` | stone-200 | stone-800 | Default borders |
| Accent | amber-500 | amber-400 | CTAs, active states ONLY |

### Status Colors

| Status | Light bg | Light text | Dark bg | Dark text |
|---|---|---|---|---|
| Confirmed | `bg-emerald-50` | `text-emerald-700` | `bg-emerald-950` | `text-emerald-400` |
| Pending | `bg-amber-50` | `text-amber-700` | `bg-amber-950` | `text-amber-400` |
| Cancelled | `bg-red-50` | `text-red-700` | `bg-red-950` | `text-red-400` |
| Neutral | `bg-muted` | `text-muted-foreground` | `bg-muted` | `text-muted-foreground` |

---

## 3. Spacing

| Token | Value | Usage |
|---|---|---|
| `gap-4` | 16px | Grid gutter, card internal gap |
| `gap-6` | 24px | Section gap, major grid gutter |
| `p-4` | 16px | Compact card padding |
| `p-5` | 20px | Default card padding |
| `p-6` | 24px | Spacious card padding, panels |
| `space-y-6` | 24px | Vertical section spacing |
| `space-y-8` | 32px | Page-level section spacing |

### Rules

- **Card internal padding** → `p-5` (default), `p-6` (spacious panels)
- **Card header padding** → `px-5 py-4`
- **List item padding** → `px-5 py-4`
- **No mixing** → don't use `px-8 py-6` in one card and `px-6 py-5` in another

---

## 4. Border Radius

| Token | Class | Usage |
|---|---|---|
| Small | `rounded-lg` | Buttons, inputs, badges, small elements |
| Medium | `rounded-xl` | **Cards** (the standard) |
| Large | `rounded-2xl` | Modal dialogs, large panels |
| Full | `rounded-full` | Avatars, status dots |

### Rules

- **All cards** → `rounded-xl` (no exceptions)
- **Never** → `rounded-3xl`, `rounded-[2rem]`, `rounded-[1.5rem]`, `rounded-[1.25rem]`
- **Buttons** → `rounded-lg`
- **Badges** → `rounded-full` or `rounded-md`

---

## 5. Shadows

| Token | Usage |
|---|---|
| `shadow-sm` | Default card resting state |
| `shadow-md` | Card hover state |
| None (dark) | Use `border` instead in dark mode |

### Rules

- **No colored shadows** → never `shadow-amber-500/20`, `shadow-xl`
- **Hover** → `hover:shadow-md transition-all duration-200`

---

## 6. Grid System (Dashboard)

### Stats Grid (KPI cards)

```
grid grid-cols-1 sm:grid-cols-3 gap-4
```

> **Why `sm:grid-cols-3`?** The sidebar is 256px. At `lg` (1024px viewport),
> the content area is ~768px. With `sm` breakpoint (640px), 3 columns
> activate correctly because the content area always exceeds 640px on desktop.
> Using `xl:grid-cols-3` breaks because 1280 - 256 = 1024px, and the
> content area never reaches the `xl` threshold.

### Content + Sidebar Layout

```
grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6
```

### Quick Nav Grid

```
grid grid-cols-2 lg:grid-cols-4 gap-4
```

---

## 7. Component Patterns

### Card (Standard)

```tsx
<div className="bg-card rounded-xl border shadow-sm">
  <div className="px-5 py-4 border-b">
    {/* header */}
  </div>
  <div className="p-5">
    {/* content */}
  </div>
</div>
```

Hover (optional): `hover:shadow-md transition-all duration-200`

### Stat Card

```tsx
<div className="bg-card rounded-xl border shadow-sm p-5">
  <div className="flex items-center justify-between mb-3">
    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
      <Icon className="h-5 w-5 text-muted-foreground" />
    </div>
    <span className="text-xs text-muted-foreground">+12%</span>
  </div>
  <p className="text-2xl font-bold text-foreground">480</p>
  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mt-1">
    Receita Prevista
  </p>
</div>
```

### List Item (Appointments)

```tsx
<div className="flex items-center gap-4 px-5 py-4 hover:bg-muted/50 transition-colors">
  <div className="text-center shrink-0">
    <span className="text-xs font-semibold text-foreground">09:00</span>
  </div>
  <div className="flex-1 min-w-0">
    <p className="text-sm font-medium text-foreground truncate">Maria Silva</p>
    <p className="text-xs text-muted-foreground truncate">Brow Lamination · R$ 120</p>
  </div>
  <Badge variant="secondary">Confirmado</Badge>
</div>
```

### Primary Button

```tsx
<Button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg px-4">
  <Icon className="h-4 w-4 mr-2" /> Label
</Button>
```

### Section Header

```tsx
<div className="flex items-center justify-between">
  <div>
    <h3 className="text-lg font-semibold text-foreground">Title</h3>
    <p className="text-xs text-muted-foreground">Subtitle</p>
  </div>
  <Link className="text-xs font-medium text-amber-600 hover:text-amber-700">
    Action →
  </Link>
</div>
```

---

## 8. Anti-Patterns (Never Do)

| ❌ Don't | ✅ Do |
|---|---|
| `text-[9px]`, `text-[10px]` | `text-xs` (12px) |
| `rounded-3xl`, `rounded-[2rem]` | `rounded-xl` |
| `shadow-xl`, colored shadows | `shadow-sm`, `hover:shadow-md` |
| `font-black`, `font-extrabold` | `font-bold` max |
| `tracking-widest` on labels | `tracking-wide` |
| Decorative watermark icons | Clean negative space |
| `xl:grid-cols-3` for stats | `sm:grid-cols-3` |
| Mixing `text-stone-400` and `text-muted-foreground` | Always `text-muted-foreground` |
| `px-8 py-6` on cards | `p-5` consistent |

---

## 9. Icon Guidelines

- **Library:** `lucide-react` exclusively
- **UI icons:** `h-4 w-4` (16px) — buttons, nav, inline
- **Feature icons:** `h-5 w-5` (20px) — card icon containers
- **Icon containers:** `h-10 w-10 rounded-lg bg-muted` with icon at `h-5 w-5`
- **Never** use h-6+, h-8+, or watermark-style background icons
