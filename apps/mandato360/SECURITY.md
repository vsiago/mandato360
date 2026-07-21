# 🔒 Guia de Segurança - Mandato360

## Implementação de Segurança Integrada

Este documento descreve como aplicar as correções de segurança em todas as server actions.

---

## 1️⃣ ARQUITETURA DE SEGURANÇA

```
Client (React Component)
    ↓
Server Action ("use server")
    ↓
┌─────────────────────────────────────┐
│ 1. AUTENTICAÇÃO (getSession)        │ ← Verifica se usuário está logado
│ 2. AUTORIZAÇÃO (validateTenantAccess)│ ← Valida acesso ao tenant
│ 3. RATE LIMITING (checkRateLimit)   │ ← Previne abuso
│ 4. VALIDAÇÃO (Zod schemas)          │ ← Valida inputs
│ 5. AUTORIZAÇÃO DE DADOS             │ ← Verifica ownership do recurso
└─────────────────────────────────────┘
    ↓
Database (Drizzle ORM)
```

---

## 2️⃣ PADRÃO SEGURO PARA SERVER ACTIONS

### Template Básico

```typescript
"use server"

import { validateTenantAccess } from "@/lib/auth-utils";
import { leadSchemas } from "@/lib/validations";
import { checkRateLimit, rateLimitPresets } from "@/lib/rate-limit";
import { db } from "@/lib/db";

export async function getLeads(
  tenantId: string,
  options?: { limit?: number; offset?: number }
) {
  try {
    // ✅ 1. AUTENTICAÇÃO (automático no server action)
    // ✅ 2. AUTORIZAÇÃO - Validar tenant access
    const auth = await validateTenantAccess(tenantId, "readonly");

    // ✅ 3. RATE LIMITING - Prevenir abuso
    await checkRateLimit(rateLimitPresets.api);

    // ✅ 4. VALIDAÇÃO - Zod schema
    const validated = leadSchemas.list.parse({
      tenantId,
      limit: options?.limit,
      offset: options?.offset,
    });

    // ✅ 5. QUERY - Sempre incluir tenantId WHERE
    const results = await db.query.lead.findMany({
      where: eq(lead.tenantId, validated.tenantId),
      // ...
    });

    return results;
  } catch (error) {
    console.error("[Action Error]", error);
    throw error; // ✅ Não hide errors
  }
}
```

---

## 3️⃣ APLICAR EM TODAS SERVER ACTIONS

### Checklist por Action:

#### `lib/actions/leads.ts` ✅ DONE
- [x] getLeads
- [x] getLeadById
- [x] createLead
- [x] updateLead
- [x] deleteLead
- [x] getLeadsCountByFunil

#### `lib/actions/eleitores.ts` 
- [ ] Adicionar auth check
- [ ] Adicionar tenant validation
- [ ] Adicionar rate limiting
- [ ] Adicionar Zod validation

#### `lib/actions/demandas.ts`
- [ ] Mesma coisa acima

#### `lib/actions/agenda.ts`
- [ ] Mesma coisa acima

#### `lib/actions/liderancas.ts`
- [ ] Mesma coisa acima

#### `lib/actions/assessores.ts`
- [ ] Mesma coisa acima

#### `lib/actions/indicacoes-populares.ts`
- [ ] Mesma coisa acima

#### `lib/actions/legislativo.ts`
- [ ] Mesma coisa acima

#### `lib/actions/pesquisas.ts`
- [ ] Mesma coisa acima

---

## 4️⃣ RATE LIMITING PRESETS

Use os presets apropriados:

```typescript
// Login/Auth
await checkRateLimit(rateLimitPresets.login);     // 5 req/15min

// Read API
await checkRateLimit(rateLimitPresets.api);       // 100 req/min

// Search
await checkRateLimit(rateLimitPresets.search);    // 30 req/min

// File uploads
await checkRateLimit(rateLimitPresets.upload);    // 10 req/5min

// Form submissions
await checkRateLimit(rateLimitPresets.form);      // 10 req/10min

// Public API
await checkRateLimit(rateLimitPresets.publicApi); // 1000 req/hour
```

---

## 5️⃣ ROLE-BASED ACCESS CONTROL (RBAC)

Roles disponíveis:
- `admin` - Acesso total, pode deletar
- `assessor` - Pode criar/editar dados
- `readonly` - Apenas leitura
- `user` - Acesso básico

Exemplo:
```typescript
// Apenas admin pode deletar
await validateTenantAccess(tenantId, "admin");

// Assessor+ pode criar
await validateTenantAccess(tenantId, "assessor");

// Qualquer um pode ler
await validateTenantAccess(tenantId, "readonly");
```

---

## 6️⃣ VALIDAÇÃO COM ZOD

Schemas disponíveis:

```typescript
import { leadSchemas, demandaSchemas, agendaSchemas } from "@/lib/validations";

// Validar criação de lead
const validated = leadSchemas.create.parse(data);

// Validar atualização
const validated = leadSchemas.update.parse(data);

// Validar listagem
const validated = leadSchemas.list.parse({
  tenantId,
  limit: 50,
  offset: 0,
  search: "João",
});

// Custom validation
const email = schemas.email.parse(input.email);
const phone = schemas.phone.parse(input.telefone);
const cpf = schemas.cpf.parse(input.cpf);
```

---

## 7️⃣ TRATAMENTO DE ERROS

✅ **CORRETO:**
```typescript
if (!resource) {
  throw new Error("Resource not found or access denied");
}
```

❌ **ERRADO:**
```typescript
if (!resource) {
  return null; // Não revela que existe o recurso
}
```

---

## 8️⃣ PRINCÍPIOS DE SEGURANÇA

### Defense in Depth
- Múltiplas camadas de validação
- Cada layer é independente

### Fail Secure
- Em caso de dúvida, negar acesso
- Never trust user input

### Least Privilege
- Usuários têm apenas permissões necessárias
- Roles são granulares

### Audit Trail (TODO)
- Log todas as ações críticas
- Quem fez o quê e quando

---

## 9️⃣ PRÓXIMOS PASSOS

### CRÍTICO (Esta semana)
1. [ ] Aplicar padrão em todos `lib/actions/*`
2. [ ] Testar authorization bypass
3. [ ] Implementar audit logging
4. [ ] Rotacionar credenciais no git

### IMPORTANTE (Próxima semana)
5. [ ] Rate limiting em endpoints públicos
6. [ ] Email verification
7. [ ] 2FA (Two-factor authentication)
8. [ ] CSRF tokens em forms

### MELHORIAS (Semana 3)
9. [ ] Webhooks para audit trail
10. [ ] API key management
11. [ ] Data encryption at rest
12. [ ] Session timeout

---

## 🔟 TESTE DE SEGURANÇA

Para testar se o authorization está funcionando:

```bash
# 1. Login como User A
# 2. Obter tenantId de User A
# 3. Tentar acessar tenantId de User B
# Deve retornar: "Access denied to this tenant"
```

---

## Referências

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Better Auth Docs](https://better-auth.vercel.app/)
- [Zod Validation](https://zod.dev/)
- [Rate Limiting Pattern](https://en.wikipedia.org/wiki/Rate_limiting)

