# 🚀 QUICKSTART - Mandato360

## Rodar Localmente (Porta 3003)

### 1️⃣ Instalação (primeira vez)
```bash
pnpm install
```

### 2️⃣ Setup automático + servidor
```bash
pnpm start
```

**Isso vai:**
- ✅ Criar usuário de demo
- ✅ Iniciar servidor na porta **3003**
- ✅ Abrir http://localhost:3003

### 3️⃣ Login com credenciais padrão

**Demo User:**
- Email: `demo@mandato360.com`
- Senha: `Demo@123456`

**Admin User:**
- Email: `admin@mandato360.com`
- Senha: `Admin@123456`

---

## Se o servidor já está rodando

```bash
# Apenas criar usuários
pnpm setup

# Apenas rodar servidor (porta 3003)
pnpm dev:mandato
```

---

## Rodar Testes

```bash
# Playwright (recomendado)
npx playwright test --ui

# Cypress
npm run cy:open
```

---

## Documentação

- **Segurança**: [SECURITY.md](SECURITY.md)
- **Testes**: [TESTING-GUIDE.md](TESTING-GUIDE.md)
- **Deploy**: [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md)

---

## 🎯 Próximos passos

1. ✅ Instalar: `pnpm install`
2. ✅ Rodar: `pnpm start`
3. ✅ Login: demo@mandato360.com / Demo@123456
4. ✅ Testar: `npx playwright test --ui`
5. ✅ Deploy: ver [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md)

**Pronto! 🎉**
