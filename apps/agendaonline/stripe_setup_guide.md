# Guia de Configuração do Stripe - Agenda Online

Siga estes passos exatos para configurar sua conta Stripe e começar a receber pagamentos.

## 1. Criar Conta no Stripe
1. Acesse [stripe.com](https://stripe.com) e crie sua conta (ou faça login).
2. No Dashboard, certifique-se de estar no modo de **Teste** (Test Mode) para configurar tudo primeiro.

## 2. Criar os Produtos (Planos)
Vá em **Product Catalog > Add Product** e crie os 3 planos seguindo as configurações abaixo:

### Plano 1: Essencial
- **Nome**: `Essencial`
- **Descrição**: `Página profissional personalizada, agendamento automático via WhatsApp e link exclusivo para sua bio do Instagram.`
- **Preços**: Marque **Recorrente**.
- **Valor**: `R$ 49,00` (BRL).
- **Período de faturamento**: `Mensal`.
- **ID do Preço**: Após salvar, copie o `price_...` e salve na sua `.env` como `NEXT_PUBLIC_STRIPE_PRICE_ESSENCIAL`.

### Plano 2: Profissional
- **Nome**: `Profissional`
- **Descrição**: `Plano ideal para salões com até 3 profissionais. Inclui agenda inteligente, lembretes automáticos e gestão simplificada.`
- **Preços**: Marque **Recorrente**.
- **Valor**: `R$ 79,00` (BRL).
- **Período de faturamento**: `Mensal`.
- **ID do Preço**: Após salvar, copie o `price_...` e salve na sua `.env` como `NEXT_PUBLIC_STRIPE_PRICE_PROFISSIONAL`.

### Plano 3: Completo
- **Nome**: `Completo`
- **Descrição**: `Presença digital completa: galeria de fotos, personalização avançada, relatórios de performance e suporte prioritário.`
- **Preços**: Marque **Recorrente**.
- **Valor**: `R$ 119,00` (BRL).
- **Período de faturamento**: `Mensal`.
- **ID do Preço**: Após salvar, copie o `price_...` e salve na sua `.env` como `NEXT_PUBLIC_STRIPE_PRICE_PREMIUM`.

## 3. Obter as Chaves de API
Vá em **Developers > API keys**:
1. Copie a **Publishable key** (`pk_test_...`) e salve no seu `.env` como `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
2. Copie a **Secret key** (`sk_test_...`) e salve no seu `.env` como `STRIPE_SECRET_KEY`.

## 4. Configurar Webhooks
Vá em **Developers > Webhooks**:
1. Clique em **Add endpoint**.
2. **Endpoint URL**: `https://seu-dominio.com/api/stripe/webhook` (Para testes locais, use o Stripe CLI).
3. **Select events**: Selecione:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Após criar, copie o **Signing secret** (`whsec_...`) e salve no seu `.env` como `STRIPE_WEBHOOK_SECRET`.

## 5. Resumo das Variáveis de Ambiente (.env)
Seu arquivo `.env` deve ficar assim:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PRICE_ESSENCIAL=price_...
NEXT_PUBLIC_STRIPE_PRICE_PROFISSIONAL=price_...
NEXT_PUBLIC_STRIPE_PRICE_PREMIUM=price_...
STRIPE_PRICE_ESSENCIAL=price_...
STRIPE_PRICE_PROFISSIONAL=price_...
STRIPE_PRICE_PREMIUM=price_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
