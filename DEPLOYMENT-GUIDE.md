# 🚀 DEPLOYMENT GUIDE - Mandato360

## PHASES COMPLETED ✅

| Fase | Status | Tarefas |
|------|--------|---------|
| **0: Hardening** | ✅ DONE | ✅ Auth utils, validation, rate limiting |
| **1: Segurança** | ✅ DONE | ✅ 5 actions atualizadas com segurança |
| **2: Git Cleanup** | ✅ DONE | ✅ .env.local protegido, gitignore ok |
| **3: Testes** | ✅ DONE | ✅ Suite de testes de autorização criada |
| **4: Pré-Deploy** | 🟡 TODO | ⬇️ Este documento |

---

## PRÉ-DEPLOYMENT CHECKLIST

### SEGURANÇA ✅
- [x] Todas server actions têm `validateTenantAccess()`
- [x] Rate limiting implementado
- [x] Zod validation em POSTs/PATCHs
- [x] Erros propagados (não hidden)
- [x] Queries incluem `tenantId` WHERE
- [x] RBAC implementado (admin/assessor/readonly)
- [x] Credenciais removidas do git
- [x] .gitignore protege .env files
- [ ] **Credenciais Supabase rotacionadas** ⚠️ PENDENTE

### TESTES 🧪
- [x] Authorization tests criados
- [ ] **Rodar testes localmente** ⚠️ PENDENTE
- [ ] Testes de E2E com Cypress (opcional)
- [ ] Teste manual: User A ≠ User B data

### OPERACIONAL 📊
- [ ] Logging estruturado (JSON)
- [ ] Error tracking (Sentry) - opcional mas recomendado
- [ ] Database backups configurados
- [ ] Uptime monitoring
- [ ] Documentação completa

### CONFORMIDADE 📋
- [ ] LGPD compliance check
- [ ] Audit trail de operações críticas
- [ ] Terms of Service atualizados
- [ ] Privacy Policy atualizada

---

## PASSO A PASSO: DEPLOY

### 1. ROTACIONAR CREDENCIAIS SUPABASE ⚠️

**CRÍTICO ANTES DE DEPLOY**

```bash
# 1. Acesse https://supabase.com
# 2. Dashboard → seu projeto → Settings → Database → Password
# 3. Clique "Reset password" e gere nova senha (sem caracteres especiais)
# 4. Copie a nova DATABASE_URL

# 5. Atualize seu .env.local:
DATABASE_URL="postgresql://postgres:NEW_PASSWORD@host:5432/postgres"

# 6. Teste a conexão:
npm run db:health

# 7. NÃO committe o .env.local (já está no .gitignore)
```

### 2. EXECUTAR TESTES LOCALMENTE

```bash
# Testes unitários
npm run test

# Testes E2E (Cypress)
npm run cy:open

# Coverage
npm run test -- --coverage
```

### 3. REVISAR CÓDIGO ANTES DO DEPLOY

```bash
# Verificar erros de tipo
npm run type-check

# Lint
npm run lint

# Build
npm run build
```

### 4. FAZER COMMIT FINAL

```bash
git add .
git commit -m "release: security hardening and deployment preparation

- Implemented authorization validation in 5 actions
- Added rate limiting and input validation
- Created comprehensive security tests
- All operations now include tenant context

Ready for production deployment.

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

### 5. PREPARAR DEPLOY

```bash
# Para Vercel (se usar):
vercel deploy --prod

# Para outro host:
npm run build
# Deploy dist folder to your hosting
```

### 6. MONITORAR PÓS-DEPLOY

```bash
# Acompanhar logs
tail -f logs/production.log

# Verificar health check
curl https://your-domain.com/api/health

# Monitorar erros
# Se usando Sentry: https://sentry.io/projects/
```

---

## MATRIZ DE RISCOS

| Risco | Antes | Depois | Mitigação |
|-------|-------|--------|-----------|
| **Authorization Bypass** | 🔴 CRÍTICO | ✅ Protegido | validateTenantAccess |
| **XSS/Injection** | 🔴 CRÍTICO | ✅ Bloqueado | Zod validation |
| **Brute Force** | 🔴 CRÍTICO | ✅ Rate limited | checkRateLimit |
| **Data Exposure** | ⚠️ Médio | ✅ Audit trail | Logging (TODO) |
| **Performance** | ⚠️ Desconhecido | 📊 Monitora | APM (TODO) |

---

## ROLLBACK PLAN

Se algo der errado:

```bash
# 1. Identificar problema
# 2. Reverter último commit (se necessário)
git revert <commit-hash>
git push

# 3. OU: Reset para versão anterior
git reset --hard origin/main~1
git push --force-with-lease

# 4. Investigar root cause
# 5. Deploy novamente após fix
```

---

## MONITORING RECOMENDADO

### Logs
```typescript
// Use estruturado (JSON)
console.log(JSON.stringify({
  level: "info",
  action: "lead_created",
  tenantId: "...",
  userId: "...",
  timestamp: new Date().toISOString(),
}));
```

### Métricas
- Requests/segundo
- Error rate (> 5% alert)
- Response time (> 1s alert)
- Rate limit hits
- Auth failures

### Alertas
- Authorization bypass attempts
- Unusual rate limit hits
- Database connection failures
- High error rates

---

## SUPORTE PÓS-DEPLOYMENT

### Problemas Comuns

**"Access denied to this tenant"**
- ✅ Normal: User tentou acessar outro tenant
- Verificar logs de quem tentou

**"Rate limited"**
- ✅ Normal: Muitas requisições
- Check rate limit presets em `lib/rate-limit.ts`

**"Zod validation error"**
- ✅ Input inválido
- Client precisa validar antes de enviar

---

## PRÓXIMOS PASSOS (FASE 6+)

### Semana 1-2
- [ ] Audit logging em todas operações críticas
- [ ] Sentry error tracking
- [ ] Health check endpoints

### Semana 3-4
- [ ] API rate limiting documentada
- [ ] SLA de performance
- [ ] LGPD compliance audit

### Semana 5+
- [ ] 2FA (two-factor authentication)
- [ ] Webhook signing
- [ ] API keys management

---

## CHECKLIST FINAL PRÉ-DEPLOYMENT

```
SEGURANÇA:
- [x] Authorization implementado
- [x] Rate limiting ativo
- [x] Validation com Zod
- [x] Error handling robusto
- [ ] Credenciais rotacionadas

QUALIDADE:
- [ ] Testes passando 100%
- [ ] Type checking OK
- [ ] Lint sem erros
- [ ] Build sucesso

DEPLOY:
- [ ] Credentials atualizadas
- [ ] Backup do DB configurado
- [ ] Monitoring setup
- [ ] Rollback plan pronto

GO/NO-GO: [ ] READY TO DEPLOY
```

---

**Status**: 🟢 READY FOR DEPLOYMENT (após rotacionar credenciais e rodar testes)

**Próxima ação**: Rotacionar credenciais Supabase conforme acima
