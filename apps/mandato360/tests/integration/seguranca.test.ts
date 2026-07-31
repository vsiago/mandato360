/**
 * Testes de SEGURANCA sobre as server actions.
 *
 * Diferente de cadastros.test.ts (que valida o caminho feliz), aqui cada
 * teste afirma o comportamento CORRETO esperado. Uma falha aqui nao e teste
 * quebrado: e vulnerabilidade real no produto.
 *
 * Cenario: o usuario logado pertence (conceitualmente) ao tenant A e tenta
 * alcancar dados do tenant B.
 */
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { loginReal, semSessao } from "./setup";
import { criarTenantsDeTeste, limparTenantsDeTeste, fecharConexao, type TenantsDeTeste } from "./fixtures";

import { createBairro, updateBairro, deleteBairro, getBairros } from "@/lib/actions/bairros";
import { createLead, getLeads } from "@/lib/actions/leads";
import { createLegislativo, updateLegislativo } from "@/lib/actions/legislativo";
import { createPesquisa, updatePesquisa } from "@/lib/actions/pesquisas";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * Semeia direto no banco, sem passar pelas actions. Necessario porque o
 * usuario do teste (corretamente) nao tem permissao de escrever no tenant B —
 * mas precisamos que exista algo la para tentar alcancar.
 */
async function semearNoTenantB(tabela: any, valores: Record<string, unknown>) {
  const [linha] = await db.insert(tabela).values(valores as any).returning();
  return linha;
}

let T: TenantsDeTeste;

beforeAll(async () => {
  T = await criarTenantsDeTeste();
  // Usuario comum vinculado SO ao tenant A. Tudo que ele alcancar no
  // tenant B e vazamento.
  await loginReal({ email: T.membro.email, password: T.membro.senha });
});

afterAll(async () => {
  if (T) await limparTenantsDeTeste([T.a.id, T.b.id], T.membro.id);
  await fecharConexao();
});

describe("Autenticacao — action sem sessao deve ser recusada", () => {
  it("getLeads sem sessao nao pode devolver dados", async () => {
    await semSessao(async () => {
      await expect(getLeads(T.a.id)).rejects.toThrow();
    });
  });

  it("createBairro sem sessao nao pode gravar", async () => {
    const r: any = await semSessao(() =>
      createBairro({ tenantId: T.a.id, nome: "SEM SESSAO — nao deveria existir" })
    );
    expect(r?.success, "createBairro gravou sem nenhuma sessao").not.toBe(true);
  });

  it("createLegislativo sem sessao nao pode gravar", async () => {
    const r: any = await semSessao(() =>
      createLegislativo({
        tenantId: T.a.id,
        tipo: "projeto_lei",
        titulo: "SEM SESSAO — nao deveria existir",
        status: "tramitando",
        data: new Date(),
      })
    );
    expect(r?.success, "createLegislativo gravou sem nenhuma sessao").not.toBe(true);
  });
});

describe("Isolamento entre tenants — leitura", () => {
  it("nao devolve dados de um tenant ao qual o usuario nao pertence", async () => {
    await semearNoTenantB(schema.bairro, { tenantId: T.b.id, nome: "Segredo do Tenant B" });

    // O usuario logado nao tem vinculo com o tenant B: deve ser barrado.
    let barrou = false;
    let lista: any[] = [];
    try {
      lista = (await getBairros(T.b.id)) as any[];
    } catch {
      barrou = true;
    }

    expect(
      barrou || lista.every((x) => x.nome !== "Segredo do Tenant B"),
      "usuario leu dados de um tenant ao qual nao pertence"
    ).toBe(true);
  });
});

describe("Isolamento entre tenants — escrita cruzada", () => {
  it("nao permite CRIAR dentro de outro tenant", async () => {
    const r: any = await createBairro({ tenantId: T.b.id, nome: "INVASAO" });
    expect(r?.success, "criou registro dentro de outro tenant").not.toBe(true);
  });

  it("nao permite EDITAR registro de outro tenant", async () => {
    const alvo: any = await semearNoTenantB(schema.bairro, { tenantId: T.b.id, nome: "Bairro do B" });

    const r: any = await updateBairro(alvo.id, { nome: "INVADIDO" });
    expect(r?.success, "editou registro de outro tenant").not.toBe(true);

    // Confirma no banco que o dado original continua intacto.
    const depois = await db.query.bairro.findFirst({ where: eq(schema.bairro.id, alvo.id) });
    expect(depois?.nome, "o registro do outro tenant foi alterado").toBe("Bairro do B");
  });

  it("nao permite EXCLUIR registro de outro tenant", async () => {
    const alvo: any = await semearNoTenantB(schema.bairro, { tenantId: T.b.id, nome: "Alvo do B" });

    const r: any = await deleteBairro(alvo.id);
    expect(r?.success, "excluiu registro de outro tenant").not.toBe(true);

    const depois = await db.query.bairro.findFirst({ where: eq(schema.bairro.id, alvo.id) });
    expect(depois, "o registro do outro tenant foi apagado").toBeTruthy();
  });

  it("nao permite EDITAR legislativo de outro tenant", async () => {
    const alvo: any = await semearNoTenantB(schema.legislativo, {
      tenantId: T.b.id,
      tipo: "projeto_lei",
      titulo: "PL do B",
      status: "tramitando",
      data: new Date(),
    });
    const r: any = await updateLegislativo(alvo.id, { titulo: "INVADIDO" });
    expect(r?.success, "editou legislativo de outro tenant").not.toBe(true);
  });

  it("nao permite EDITAR pesquisa de outro tenant", async () => {
    const alvo: any = await semearNoTenantB(schema.pesquisa, {
      tenantId: T.b.id,
      titulo: "Pesquisa do B",
    });
    const r: any = await updatePesquisa(alvo.id, { titulo: "INVADIDO" });
    expect(r?.success, "editou pesquisa de outro tenant").not.toBe(true);
  });
});

describe("Validacao de entrada", () => {
  it("rejeita nome vazio", async () => {
    const r: any = await createLead({ tenantId: T.a.id, nome: "" });
    expect(r?.success, "aceitou lead com nome vazio").not.toBe(true);
  });

  it("rejeita e-mail invalido", async () => {
    const r: any = await createLead({ tenantId: T.a.id, nome: "Fulano", email: "nao-e-email" });
    expect(r?.success, "aceitou e-mail invalido").not.toBe(true);
  });

  it("rejeita tenantId que nao e UUID", async () => {
    const r: any = await createLead({ tenantId: "'; DROP TABLE eleitor; --", nome: "Fulano" });
    expect(r?.success, "aceitou tenantId malformado").not.toBe(true);
  });
});
