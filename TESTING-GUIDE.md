# 🧪 GUIA DE TESTES COMPLETO - Mandato360

## TIPOS DE TESTES DISPONÍVEIS

### 1️⃣ TESTES PLAYWRIGHT (Autônomos)
```bash
# Rodar todos os testes
npx playwright test

# Rodar com UI (mais visual)
npx playwright test --ui

# Rodar em um navegador específico
npx playwright test --project=chromium

# Rodar em modo mobile
npx playwright test --project="Mobile Chrome"

# Rodar um teste específico
npx playwright test security.spec.ts

# Debug mode
npx playwright test --debug
```

**Resultado**: Relatório HTML em `playwright-report/`

### 2️⃣ TESTES CYPRESS (E2E Manual)
```bash
# Abrir interface Cypress
npm run cy:open

# Rodar headless
npm run cy:run

# Rodar teste específico
npx cypress run --spec "cypress/e2e/security.cy.ts"
```

### 3️⃣ TESTES API (Curl/Postman)
```bash
# Ver exemplos abaixo
```

---

## TESTE MANUAL PASSO-A-PASSO

### 📋 Setup Inicial

1. **Iniciar servidor**
```bash
npm run dev:mandato
# Acesse http://localhost:3000
```

2. **Criar contas de teste** (se não existem):
   - Admin: `admin@test.com` / `Admin@123456`
   - Assessor: `assessor@test.com` / `Assessor@123456`
   - Readonly: `readonly@test.com` / `Readonly@123456`

---

### ✅ TESTE 1: LOGIN & AUTHENTICATION

**O que testar:**
- ✅ Login com credenciais válidas
- ❌ Login com email inválido
- ❌ Login com senha errada
- ✅ Logout funciona
- ❌ Sem autenticação não acessa /dashboard

**Passo a passo:**
1. Acesse `http://localhost:3000/login`
2. Digite email: `admin@test.com`
3. Digite senha: `Admin@123456`
4. Clique "Entrar"
5. ✅ Deve redirecionar para `/dashboard`
6. Abra menu (canto superior direito)
7. Clique "Sair"
8. ✅ Deve voltar para `/login`

**Resultado esperado:**
```
✅ Login bem-sucedido
✅ Logout bem-sucedido
✅ Sessão finalizada
```

---

### 🔴 TESTE 2: AUTHORIZATION BYPASS (Deve Falhar)

**O que testar:**
- ❌ User A NÃO consegue acessar dados de User B
- ❌ Readonly NÃO consegue criar eleitores
- ❌ Assessor NÃO consegue deletar

**Passo a passo:**

#### 2A: Dados de User A
1. Login como **Admin** (`admin@test.com`)
2. Crie um eleitor: João Silva (admin@example.com)
3. Anote o ID da URL ou copie um dado
4. **Logout**

#### 2B: Tentativa de User B
1. Login como **Readonly** (`readonly@test.com`)
2. Tente acessar `/dashboard/eleitores/[ID-DO-JOAO]`
3. ❌ Deve mostrar: "Acesso negado" ou 403

#### 2C: Permissions
1. Login como **Readonly**
2. Vá para `/dashboard/eleitores`
3. ❌ Botão "Novo Eleitor" deve estar DESABILITADO
4. ❌ Não deve ter botão de Delete

**Resultado esperado:**
```
❌ Access denied to this tenant
❌ Insufficient permissions
❌ Buttons disabled for readonly user
```

---

### 🛡️ TESTE 3: INPUT VALIDATION

**O que testar:**
- ✅ Email válido aceito
- ❌ Email inválido rejeitado
- ❌ Campos obrigatórios
- ❌ XSS não funciona
- ❌ Telefone com formato correto

**Passo a passo:**

#### 3A: Email inválido
1. Login como Admin
2. Clique "Novo Eleitor"
3. Digite Nome: "Test"
4. Digite Email: `invalid-email` (SEM @)
5. Clique "Salvar"
6. ❌ Deve mostrar erro: "Email inválido"

#### 3B: Campo obrigatório
1. Clique "Novo Eleitor"
2. Deixe Nome vazio
3. Digite Email: `test@example.com`
4. Clique "Salvar"
5. ❌ Deve mostrar erro: "Nome é obrigatório"

#### 3C: XSS Payload
1. Clique "Novo Eleitor"
2. Digite Nome: `<script>alert('xss')</script>`
3. Digite Email: `test@example.com`
4. Clique "Salvar"
5. ✅ Deve aceitar, mas SEM executar script
6. Recarregue página (F5)
7. ❌ Não deve ver `<script>` no nome (sanitizado)

#### 3D: Telefone format
1. Clique "Novo Eleitor"
2. Digite Telefone: `123` (formato errado)
3. Clique "Salvar"
4. ❌ Deve rejei tar com erro de formato

**Resultado esperado:**
```
✅ Validações funcionam
✅ XSS sanitizado
✅ Formatos checados
```

---

### ⏱️ TESTE 4: RATE LIMITING

**O que testar:**
- ✅ Muitas requisições rápidas são bloqueadas
- ✅ Mensagem de "rate limit" aparece

**Passo a passo:**

#### Via Browser (Difícil)
1. Abra DevTools (F12)
2. Vá para Console
3. Execute (copiar/colar):
```javascript
async function spamRequests() {
  for(let i = 0; i < 100; i++) {
    try {
      const r = await fetch('/api/leads?tenantId=test1');
      console.log(`Req ${i}: ${r.status}`);
      if(r.status === 429) {
        console.log('🚫 RATE LIMITED!');
        break;
      }
    } catch(e) { console.error(e); }
  }
}
spamRequests();
```

4. ✅ Deve ver `429` em algum ponto

#### Via Curl (Fácil)
```bash
for i in {1..100}; do
  curl -s http://localhost:3000/api/leads?tenantId=test1 \
    -H "Cookie: better-auth.session_token=YOUR_TOKEN" \
    -w "\n%{http_code}\n" | tail -1
done | grep 429
```

**Resultado esperado:**
```
✅ Status 429 (Too Many Requests)
✅ "Rate limited" message
```

---

### 📱 TESTE 5: RESPONSIVENESS

**O que testar:**
- ✅ Mobile menu funciona
- ✅ Layout responsivo
- ✅ Elementos não quebram

**Passo a passo:**

#### Desktop
1. Acesse `http://localhost:3000`
2. ✅ Deve ver navbar normal (Desktop)

#### Mobile (DevTools)
1. Pressione F12
2. Clique ícone "Toggle device toolbar" (ou Ctrl+Shift+M)
3. Selecione "iPhone 12"
4. Recarregue
5. ✅ Deve ver menu hambúrguer
6. Clique hambúrguer (☰)
7. ✅ Menu deve abrir
8. Clique item do menu
9. ✅ Menu deve fechar

#### Tablet
1. Selecione "iPad"
2. ✅ Deve se adaptar também

**Resultado esperado:**
```
✅ Responsivo em desktop
✅ Responsivo em mobile
✅ Menu funciona
```

---

### 🔍 TESTE 6: ACCESSIBILITY

**O que testar:**
- ✅ Keyboard navigation funciona
- ✅ Screen reader support
- ✅ Contrast adequado

**Passo a passo:**

#### Navegação por Teclado
1. Abra `http://localhost:3000/dashboard`
2. Pressione `Tab` várias vezes
3. ✅ Deve navegar por botões
4. Pressione `Enter` em um botão
5. ✅ Deve executar a ação
6. Pressione `Escape`
7. ✅ Deve fechar modal (se houver)

#### Cores/Contraste
1. Abra DevTools (F12)
2. Vá para Lighthouse (aba)
3. Clique "Analyze page load"
4. ✅ Accessibility score deve ser > 90

---

### 📊 TESTE 7: DASHBOARD

**O que testar:**
- ✅ Stats carregam
- ✅ Gráficos renderizam
- ✅ Dados são números válidos

**Passo a passo:**
1. Login como Admin
2. Vá para Dashboard (home)
3. ✅ Deve ver cards com:
   - Eleitores: número
   - Demandas: número
   - Agenda: número
4. ✅ Gráficos devem estar visíveis
5. Abra DevTools > Console
6. ✅ Nenhum erro vermelho

---

### 🔄 TESTE 8: CRUD COMPLETO

**O que testar:**
- ✅ CREATE: Criar eleitor
- ✅ READ: Listar eleitores
- ✅ UPDATE: Editar eleitor
- ✅ DELETE: Deletar eleitor

**Passo a passo:**

#### CREATE
1. Login como Admin
2. Vá para Eleitores
3. Clique "Novo Eleitor"
4. Preencha:
   - Nome: "Test User"
   - Email: "test@example.com"
   - Telefone: "(21) 99999-8888"
   - Bairro: "Centro"
5. Clique "Salvar"
6. ✅ Deve ver mensagem "Eleitor criado"

#### READ
1. ✅ "Test User" deve estar na lista

#### UPDATE
1. Clique no eleitor na tabela
2. Mude o Telefone para "(21) 88888-8888"
3. Clique "Salvar"
4. ✅ Deve ver "Eleitor atualizado"

#### DELETE
1. Clique ícone Delete (lixeira)
2. Confirme na janela
3. ✅ Deve ver "Eleitor deletado"
4. ❌ "Test User" não deve estar mais na lista

---

## TESTES API COM CURL

### Login (Get Token)
```bash
curl -X POST http://localhost:3000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "Admin@123456"
  }'
```

### Listar Eleitores
```bash
TOKEN="your_token_here"
curl http://localhost:3000/api/leads?tenantId=test1 \
  -H "Authorization: Bearer $TOKEN"
```

### Criar Eleitor
```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tenantId": "test1",
    "nome": "João Silva",
    "email": "joao@example.com",
    "telefone": "(21) 99999-8888"
  }'
```

### Testar Authorization Bypass (Deve falhar com 403)
```bash
# User A Token
TOKEN_A="admin_token"

# User B Token
TOKEN_B="readonly_token"

# User A cria eleitor
LEAD_ID=$(curl -X POST http://localhost:3000/api/leads \
  -H "Authorization: Bearer $TOKEN_A" \
  -d '...' | jq '.data.id')

# User B tenta acessar (DEVE FALHAR)
curl http://localhost:3000/api/leads/$LEAD_ID \
  -H "Authorization: Bearer $TOKEN_B"
# Resultado esperado: 403 Forbidden
```

---

## CHECKLIST DE TESTES FINAIS

```
AUTHENTICATION:
- [ ] Login funciona
- [ ] Logout funciona
- [ ] Sem token → 401

AUTHORIZATION:
- [ ] User A ≠ User B data
- [ ] Readonly sem create
- [ ] Assessor sem delete
- [ ] Admin pode fazer tudo

VALIDATION:
- [ ] Email inválido rejeitado
- [ ] Campos obrigatórios
- [ ] XSS sanitizado
- [ ] Phone format validado

RATE LIMITING:
- [ ] Muitas requisições bloqueadas
- [ ] 429 status code retornado

RESPONSIVENESS:
- [ ] Desktop OK
- [ ] Mobile OK
- [ ] Tablet OK

ACCESSIBILITY:
- [ ] Keyboard navigation
- [ ] Lighthouse score > 90

CRUD:
- [ ] CREATE OK
- [ ] READ OK
- [ ] UPDATE OK
- [ ] DELETE OK

UI/UX:
- [ ] Dashboard loads
- [ ] Gráficos aparecem
- [ ] Mensagens de sucesso
- [ ] Mensagens de erro
```

---

## TROUBLESHOOTING

**"Cannot find module"**
```bash
npm install
pnpm install
```

**"Port 3000 already in use"**
```bash
# Kill processo
lsof -ti:3000 | xargs kill -9
# Or change port
BASE_URL=http://localhost:3001 npx playwright test
```

**"Tests timeout"**
```bash
# Aumentar timeout
npx playwright test --timeout=60000
```

**"Cookies not persisting"**
```bash
# Clear storage
npx playwright test --headed
# Then manually clear cookies in DevTools
```

---

**Pronto para testar! 🚀**
