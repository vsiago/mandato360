---
description: Aplica o Design System "Quiet UI" (Pilar Saúde/Mandato360) em qualquer interface.
---

Este workflow define as regras de ouro para manter a perfeição visual e consistência do Mandato360. Toda nova interface ou refatoração deve seguir rigorosamente estes padrões.

### 1. Paleta de Cores (Tokens Master)
- **Primary (Marinho)**: `#0F2B5B` - Padrão para a área administrativa /master.
- **Secondary (Esmeralda)**: `#0D9F6E` - Padrão para ações e sucessos.
- **Background (Azul Gelo)**: `#F0F3F8` - Fundo de toda a área de conteúdo.
- **PROIBIDO**: Tons quentes (amarelo, laranja, vermelho tijolo) na UI Master, exceto para alertas críticos de erro. Substitua sempre por nuances de Esmeralda ou Azul Azure.

### 2. Contexto de Multi-Tenancy (/[tenant]/dashboard)
Ao trabalhar em telas dentro de `/[tenant]`, as regras mudam ligeiramente para respeitar a **Marca do Inquilino**:
- **Cor Dinâmica**: O Primary (`#0F2B5B`) e Secondary (`#0D9F6E`) devem ser substituídos pelas cores configuradas no Banco de Dados para aquele tenant (geralmente vindo de `config.primaryColor`).
- **Adaptabilidade**: Use variáveis CSS ou estilos inline (ex: `style={{ backgroundColor: tenantColor }}`) para garantir que a interface mude conforme o cliente.
- **Consistência**: Mesmo com cores de marca diferentes, o fundo `@F0F3F8` e a estrutura de Cards arredondados (`rounded-xl`) devem ser preservados para manter o DNA do sistema.

### 3. Estrutura de Layout
- **Full Width**: Nunca use containers com `max-w-6xl` ou similares. A interface deve ser `flex-1` e ocupar toda a tela.
- **Camadas**:
  1. `Sidebar` (Fixo à esquerda no desktop).
  2. `Topbar` (Branco, fixo no topo, com breadcrumbs e busca).
  3. `Main Content` (Fundo `#F0F3F8`, scrollable, padding generoso `px-8 py-6`).
  4. `Bottombar` (Fixo no rodapé apenas em dispositivos mobile).

### 4. Componentes & Estilo
- **Cards**: Devem ter `rounded-xl`, `border-border`, `bg-card` e `shadow-sm`.
- **Tipografia**:
  - Títulos de seção: `text-xl font-semibold text-foreground tracking-tight`.
  - Descrições: `text-sm text-muted-foreground font-medium`.
  - Badges: Sempre `font-bold` e fundos de baixa opacidade.

### 5. Checklist de Aplicação
- [ ] O fundo da página é `#F0F3F8`?
- [ ] Tons de amarelo/laranja foram banidos da UI Master?
- [ ] Se estiver em `/[tenant]`, a cor primária é dinâmica baseada no inquilino?
- [ ] A largura é total (sem `max-width` rígido)?
- [ ] Topbar e Bottombar estão presentes?

### Como Usar:
Ao criar uma nova página, peça ao Antigravity:
> "/quiet-ui aplique os padrões nesta tela de [Nome da Feature]"

---
*Nota: A interface deve ser "Quiet" — silenciosa, elegante e focar nos dados, usando cores frias e muito respiro.*
