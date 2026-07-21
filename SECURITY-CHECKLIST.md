# 🔒 SECURITY IMPLEMENTATION CHECKLIST

**Status:** Em Progresso 🟡  
**Prioridade:** CRÍTICA  
**Deadline:** Esta semana (3-4 dias)

---

## ✅ FASE 1: AUTHORIZATION (2-3 dias)

### Core Infrastructure
- [x] Criar `lib/auth-utils.ts` com `validateTenantAccess()`
- [x] Criar `lib/validations.ts` com Zod schemas
- [x] Criar `lib/rate-limit.ts` com presets
- [x] Criar `SECURITY.md` guia de implementação
- [ ] **Atualizar Better Auth config com roles (TODO)**

### Server Actions - Leads
- [x] ✅ `lib/actions/leads.ts` - DONE
  - [x] getLeads
  - [x] getLeadById
  - [x] createLead
  - [x] updateLead
  - [x] deleteLead
  - [ ] getLeadsCountByFunil

### Server Actions - Outros (DEVE FAZER)
- [ ] `lib/actions/eleitores.ts` - Similar a leads
- [ ] `lib/actions/demandas.ts`
- [ ] `lib/actions/agenda.ts`
- [ ] `lib/actions/liderancas.ts`
- [ ] `lib/actions/assessores.ts`
- [ ] `lib/actions/indicacoes-populares.ts`
- [ ] `lib/actions/legislativo.ts`
- [ ] `lib/actions/pesquisas.ts`
- [ ] `lib/actions/forms.ts`
- [ ] `lib/actions/bairros.ts`
- [ ] `lib/actions/dashboard-stats.ts`

**Template:** Copiar padrão de `leads.ts` para os outros

---

## 🔴 FASE 2: REMOVE CREDENTIALS FROM GIT (1 dia)

### Git Cleanup
- [ ] Remover `.env.local` do git history
  ```bash
  git filter-branch --tree-filter 'rm -f apps/mandato360/.env.local' HEAD
  git push origin --force-with-lease
  ```

- [ ] Adicionar ao `.gitignore`:
  ```
  *.env
  *.env.local
  *.env.*.local
  .env*
  ```

- [ ] Rotacionar credenciais:
  - [ ] Supabase database password
  - [ ] Cloudinary API keys
  - [ ] Qualquer outra chave exposta

### Verification
- [ ] Rodar `git log --all --source -- apps/mandato360/.env.local` (deve estar vazio)

---

## ⏱️ FASE 3: RATE LIMITING (1 dia)

### Login/Auth
- [ ] Implementar rate limiting no `/api/auth/sign-in`
  - [ ] 5 tentativas per 15 minutos
  - [ ] Return 429 Too Many Requests

### API Endpoints
- [ ] All GET endpoints: 100 req/min
- [ ] All POST endpoints: 50 req/min
- [ ] File upload: 10 req/5min
- [ ] Search: 30 req/min

### Middleware
- [ ] Criar middleware que aplica rate limiting globalmente
- [ ] TODO: Migrar de in-memory para Redis em produção

---

## ✔️ FASE 4: VALIDAÇÃO ROBUSTA (1-2 dias)

### Input Validation
- [ ] Todos os endpoints validam com Zod
- [ ] CPF validation (formato + dígitos)
- [ ] Email validation
- [ ] Phone number validation
- [ ] Date of birth validation (age check)
- [ ] File upload validation (MIME types, size)

### Database Constraints
- [ ] NOT NULL constraints
- [ ] UNIQUE constraints
- [ ] Check constraints
- [ ] Foreign key constraints

---

## 📊 FASE 5: TESTES DE SEGURANÇA (2-3 dias)

### Authorization Tests
- [ ] User A não pode acessar dados de User B
  ```typescript
  // Test: accessLeadFromAnotherTenant()
  const userA = await createUser("a@example.com");
  const userB = await createUser("b@example.com");
  
  const leadOfB = await createLead(userB.tenantId);
  
  // Should throw "Access denied"
  await expect(getLeadById(leadOfB.id, userA.tenantId)).rejects.toThrow();
  ```

- [ ] User sem permissão não pode deletar
- [ ] User readonly não pode criar/editar
- [ ] Rate limiting funciona

### Data Validation Tests
- [ ] XSS não funciona (input com `<script>`)
- [ ] SQL injection não funciona
- [ ] Invalid CPF é rejeitado
- [ ] Invalid email é rejeitado
- [ ] File upload rejeita tipos não permitidos

### Session Tests
- [ ] Logout invalida session
- [ ] Expired session não funciona
- [ ] CSRF token é validado

---

## 🚀 DEPLOYMENT REQUIREMENTS

### Pre-Production Checklist
- [ ] Todas as server actions têm `validateTenantAccess()`
- [ ] Nenhuma senha/API key em `.env.local` commitada
- [ ] Rate limiting está ativo
- [ ] Zod validation em 100% dos inputs
- [ ] Teste de penetração feito (ou hire profissional)
- [ ] Audit logging implementado

### Production Monitoring
- [ ] Sentry error tracking ativo
- [ ] Rate limit violations logadas
- [ ] Suspicious auth attempts alertados
- [ ] Daily backup do banco

---

## 📋 COMMANDS

### Remove credentials from git
```bash
# BACKUP FIRST!
git clone --mirror https://github.com/user/mandato360.git

# Remove .env.local from history
git filter-branch --tree-filter 'rm -f apps/mandato360/.env.local' -- --all

# Force push (use with caution)
git push origin --force-with-lease --all
git push origin --force-with-lease --tags
```

### Test authorization bypass
```bash
# TODO: Create script to test
# 1. Create 2 users
# 2. Try to access User B's data as User A
# Should return 403/error
```

---

## 📞 HELP

Se tiver dúvidas:

1. Ver `SECURITY.md` para referência
2. Copiar padrão de `lib/actions/leads.ts`
3. Testar localmente antes de commit
4. Commit + push separado

---

## TIMELINE ESTIMADA

| Fase | Tarefa | Horas | Status |
|------|--------|-------|--------|
| 1 | Auth infrastructure | 2h | ✅ DONE |
| 1 | Update leads.ts | 2h | ✅ DONE |
| 1 | Update outros actions | 8h | 🔴 TODO |
| 2 | Git cleanup + rotate credentials | 2h | 🔴 TODO |
| 3 | Rate limiting endpoints | 2h | 🔴 TODO |
| 4 | Validation testing | 4h | 🔴 TODO |
| 5 | Security tests | 4h | 🔴 TODO |
| **TOTAL** | | **24h** | |

**Dedicação:** 3 dias com ~8h/dia

---

## DÚVIDAS FREQUENTES

**P: Preciso atualizar TODAS as server actions?**  
R: Sim. Qualquer que aceita `tenantId` ou faz query em dados do usuário.

**P: E as rotas `/demo/*` públicas?**  
R: Usar dados mockados, não precisam de validação de tenant (são públicas).

**P: E os endpoints de API do Better Auth?**  
R: Better Auth já tem segurança built-in. Foco em server actions.

**P: Posso usar um middleware global?**  
R: Sim, criar middleware que valida todas requisições (TODO para fase 2).

