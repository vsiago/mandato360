---
description: Workflow global para auto-validação autônoma de desenvolvimento usando Cypress.
---

Este workflow define as regras para que o Antigravity valide seu próprio código de forma autônoma, garantindo que novas funcionalidades funcionem e que não haja regressões.

### 1. Regra de Ouro: Validação Zero-Supervisão
- Antes de entregar qualquer tarefa (especialmente refatorações ou novas telas), você **DEVE** criar ou atualizar um teste em `.cypress/e2e/`.
- Os testes devem ser executados em modo headless usando `pnpm cy:run`.
- Se os testes falharem, você deve corrigir o código e rodar os testes novamente até que passem, **sem pedir ajuda ao usuário**.

### 2. Estratégia de Teste
- **Smoke Tests**: Verifique se a página carrega e se os elementos principais estão visíveis.
- **Usabilidade**: Simule cliques em botões, preenchimento de formulários e navegação entre páginas.
- **Regressão**: Sempre que corrigir um bug, adicione um teste que cubra aquele cenário específico para evitar que o bug volte.

### 3. Localização dos Arquivos
- **DIRETÓRIO PROIBIDO**: Nunca coloque arquivos de teste na pasta `app/`, `components/` ou qualquer outra pasta de código-fonte.
- **DIRETÓRIO OBRIGATÓRIO**: Todos os arquivos relacionados ao Cypress devem estar em `.cypress/`.
- Este diretório está no `.gitignore` e não deve ser commitado no repositório principal, a menos que o usuário peça explicitamente para mudar essa regra.

### 4. Checklist de Auto-Validação
- [ ] O código novo foi testado com um script de Cypress?
- [ ] O comando `pnpm cy:run` retornou sucesso?
- [ ] Se houve falha, ela foi documentada e corrigida de forma autônoma?
- [ ] Os arquivos de teste permanecem isolados em `.cypress/`?

### Como Executar:
Para validar seu trabalho atual, execute:
> `pnpm cy:run`

---
*Nota: A confiança no seu desenvolvimento aumenta com a cobertura de testes. Seja rigoroso consigo mesmo.*
