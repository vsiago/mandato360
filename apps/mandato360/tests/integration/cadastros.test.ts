/**
 * E2E dos cadastros — roda as server actions de verdade contra o banco real.
 *
 * Cada entidade passa pelo ciclo completo: CRIAR -> LISTAR -> EDITAR -> EXCLUIR
 * -> confirmar que sumiu. Nada e mockado alem do contexto de request do Next
 * (ver setup.ts); auth, Zod, rate limit e banco sao os reais.
 */
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { loginReal } from "./setup";
import { criarTenantsDeTeste, limparTenantsDeTeste, fecharConexao, type TenantsDeTeste } from "./fixtures";

import { createBairro, updateBairro, deleteBairro, getBairros } from "@/lib/actions/bairros";
import { createLead, updateLead, deleteLead, getLeads } from "@/lib/actions/leads";
import { createLideranca, updateLideranca, deleteLideranca, getLiderancas } from "@/lib/actions/liderancas";
import { createAssessor, updateAssessor, deleteAssessor, getAssessores } from "@/lib/actions/assessores";
import { createAgenda, updateAgenda, deleteAgenda, getAgendas } from "@/lib/actions/agenda";
import { createLegislativo, updateLegislativo, deleteLegislativo, getLegislativo } from "@/lib/actions/legislativo";
import { createPesquisa, updatePesquisa, deletePesquisa, getPesquisas } from "@/lib/actions/pesquisas";
import {
  createIndicacaoPopular,
  updateIndicacaoPopular,
  deleteIndicacaoPopular,
  getIndicacoesPopulares,
} from "@/lib/actions/indicacoes-populares";

let T: TenantsDeTeste;

beforeAll(async () => {
  T = await criarTenantsDeTeste();
  // Roda como usuario COMUM vinculado ao tenant A (nao como admin da
  // plataforma): prova que um assessor de verdade consegue operar o sistema.
  await loginReal({ email: T.membro.email, password: T.membro.senha });
});

afterAll(async () => {
  if (T) await limparTenantsDeTeste([T.a.id, T.b.id], T.membro.id);
  await fecharConexao();
});

/** Normaliza retorno: algumas actions devolvem {success,data}, outras o array cru. */
function ok(r: any) {
  if (r && typeof r === "object" && "success" in r) {
    expect(r.error ?? null, `action retornou erro: ${r.error}`).toBeNull();
    expect(r.success).toBe(true);
    return r.data;
  }
  return r;
}

function listaDe(r: any): any[] {
  if (Array.isArray(r)) return r;
  if (r && Array.isArray(r.data)) return r.data;
  if (r && r.data && Array.isArray(r.data.items)) return r.data.items;
  return [];
}

describe("BAIRRO — ciclo completo", () => {
  let id: string;

  it("cria", async () => {
    const d = ok(await createBairro({ tenantId: T.a.id, nome: "Centro E2E", zona: "Centro" }));
    expect(d?.id).toBeTruthy();
    expect(d.nome).toBe("Centro E2E");
    id = d.id;
  });

  it("aparece na listagem do tenant", async () => {
    const lista = listaDe(await getBairros(T.a.id));
    expect(lista.some((x) => x.id === id)).toBe(true);
  });

  it("edita e persiste", async () => {
    const d = ok(await updateBairro(id, { nome: "Centro E2E Editado", zona: "Norte" }));
    expect(d.nome).toBe("Centro E2E Editado");
    const lista = listaDe(await getBairros(T.a.id));
    expect(lista.find((x) => x.id === id)?.nome).toBe("Centro E2E Editado");
  });

  it("exclui e some da listagem", async () => {
    ok(await deleteBairro(id));
    const lista = listaDe(await getBairros(T.a.id));
    expect(lista.some((x) => x.id === id)).toBe(false);
  });
});

describe("LEAD/ELEITOR — ciclo completo", () => {
  let id: string;

  it("cria", async () => {
    const d = ok(
      await createLead({
        tenantId: T.a.id,
        nome: "Maria E2E",
        email: "maria.e2e@teste.com",
        telefone: "21999998888",
        funil: "novo",
      })
    );
    expect(d?.id).toBeTruthy();
    id = d.id;
  });

  it("aparece na listagem do tenant", async () => {
    const lista = listaDe(await getLeads(T.a.id));
    expect(lista.some((x) => x.id === id)).toBe(true);
  });

  it("edita e persiste", async () => {
    ok(await updateLead(id, T.a.id, { nome: "Maria E2E Editada", funil: "apoiador" }));
    const lista = listaDe(await getLeads(T.a.id));
    const achado = lista.find((x) => x.id === id);
    expect(achado?.nome).toBe("Maria E2E Editada");
    expect(achado?.funil).toBe("apoiador");
  });

  it("exclui e some da listagem", async () => {
    ok(await deleteLead(id, T.a.id));
    const lista = listaDe(await getLeads(T.a.id));
    expect(lista.some((x) => x.id === id)).toBe(false);
  });
});

describe("LIDERANCA — ciclo completo", () => {
  let id: string;

  it("cria", async () => {
    const d = ok(
      await createLideranca({
        tenantId: T.a.id,
        nome: "Joao Lider E2E",
        tipo: "lider_comunitario",
        telefone: "21988887777",
      })
    );
    expect(d?.id).toBeTruthy();
    id = d.id;
  });

  it("aparece na listagem do tenant", async () => {
    const lista = listaDe(await getLiderancas(T.a.id));
    expect(lista.some((x) => x.id === id)).toBe(true);
  });

  it("edita e persiste", async () => {
    ok(await updateLideranca(id, T.a.id, { nome: "Joao Lider Editado" }));
    const lista = listaDe(await getLiderancas(T.a.id));
    expect(lista.find((x) => x.id === id)?.nome).toBe("Joao Lider Editado");
  });

  it("exclui e some da listagem", async () => {
    ok(await deleteLideranca(id, T.a.id));
    const lista = listaDe(await getLiderancas(T.a.id));
    expect(lista.some((x) => x.id === id)).toBe(false);
  });
});

describe("ASSESSOR — ciclo completo", () => {
  let id: string;

  it("cria", async () => {
    const d = ok(
      await createAssessor({ tenantId: T.a.id, nome: "Assessor E2E", cargo: "Chefe de Gabinete" })
    );
    expect(d?.id).toBeTruthy();
    id = d.id;
  });

  it("aparece na listagem do tenant", async () => {
    const lista = listaDe(await getAssessores(T.a.id));
    expect(lista.some((x) => x.id === id)).toBe(true);
  });

  it("edita e persiste", async () => {
    ok(await updateAssessor(id, T.a.id, { nome: "Assessor E2E Editado", status: "inativo" }));
    const lista = listaDe(await getAssessores(T.a.id));
    expect(lista.find((x) => x.id === id)?.nome).toBe("Assessor E2E Editado");
  });

  it("exclui e some da listagem", async () => {
    ok(await deleteAssessor(id, T.a.id));
    const lista = listaDe(await getAssessores(T.a.id));
    expect(lista.some((x) => x.id === id)).toBe(false);
  });
});

describe("AGENDA PUBLICA — ciclo completo", () => {
  let id: string;

  it("cria", async () => {
    const d = ok(
      await createAgenda({
        tenantId: T.a.id,
        titulo: "Audiencia E2E",
        dataEvento: new Date(Date.now() + 86400000),
        tipo: "audiencia",
        local: "Camara",
      })
    );
    expect(d?.id).toBeTruthy();
    id = d.id;
  });

  it("aparece na listagem do tenant", async () => {
    const lista = listaDe(await getAgendas(T.a.id));
    expect(lista.some((x) => x.id === id)).toBe(true);
  });

  it("edita e persiste", async () => {
    ok(await updateAgenda(id, T.a.id, { titulo: "Audiencia E2E Editada" }));
    const lista = listaDe(await getAgendas(T.a.id));
    expect(lista.find((x) => x.id === id)?.titulo).toBe("Audiencia E2E Editada");
  });

  it("exclui e some da listagem", async () => {
    ok(await deleteAgenda(id, T.a.id));
    const lista = listaDe(await getAgendas(T.a.id));
    expect(lista.some((x) => x.id === id)).toBe(false);
  });
});

describe("LEGISLATIVO — ciclo completo", () => {
  let id: string;

  it("cria", async () => {
    const d = ok(
      await createLegislativo({
        tenantId: T.a.id,
        tipo: "projeto_lei",
        titulo: "PL E2E",
        numero: "001/2026",
        status: "tramitando",
        data: new Date(),
      })
    );
    expect(d?.id).toBeTruthy();
    id = d.id;
  });

  it("aparece na listagem do tenant", async () => {
    const lista = listaDe(await getLegislativo(T.a.id));
    expect(lista.some((x) => x.id === id)).toBe(true);
  });

  it("edita e persiste", async () => {
    ok(await updateLegislativo(id, { titulo: "PL E2E Editado", status: "aprovado" }));
    const lista = listaDe(await getLegislativo(T.a.id));
    expect(lista.find((x) => x.id === id)?.titulo).toBe("PL E2E Editado");
  });

  it("exclui e some da listagem", async () => {
    ok(await deleteLegislativo(id));
    const lista = listaDe(await getLegislativo(T.a.id));
    expect(lista.some((x) => x.id === id)).toBe(false);
  });
});

describe("PESQUISA — ciclo completo", () => {
  let id: string;

  it("cria", async () => {
    const d = ok(
      await createPesquisa({
        tenantId: T.a.id,
        titulo: "Pesquisa E2E",
        descricao: "teste",
        perguntas: [{ id: "q1", type: "text", question: "Qual sua principal demanda?", required: true }],
      })
    );
    expect(d?.id).toBeTruthy();
    id = d.id;
  });

  it("aparece na listagem do tenant", async () => {
    const lista = listaDe(await getPesquisas(T.a.id));
    expect(lista.some((x) => x.id === id)).toBe(true);
  });

  it("edita e persiste", async () => {
    ok(await updatePesquisa(id, { titulo: "Pesquisa E2E Editada", status: "ativa" }));
    const lista = listaDe(await getPesquisas(T.a.id));
    expect(lista.find((x) => x.id === id)?.titulo).toBe("Pesquisa E2E Editada");
  });

  it("exclui e some da listagem", async () => {
    ok(await deletePesquisa(id));
    const lista = listaDe(await getPesquisas(T.a.id));
    expect(lista.some((x) => x.id === id)).toBe(false);
  });
});

describe("INDICACAO POPULAR — ciclo completo", () => {
  let id: string;

  it("cria", async () => {
    const d = ok(
      await createIndicacaoPopular({
        tenantId: T.a.id,
        descricao: "Buraco na rua principal E2E",
        tipo: "infraestrutura",
      })
    );
    expect(d?.id).toBeTruthy();
    id = d.id;
  });

  it("aparece na listagem do tenant", async () => {
    const lista = listaDe(await getIndicacoesPopulares(T.a.id));
    expect(lista.some((x) => x.id === id)).toBe(true);
  });

  it("edita e persiste", async () => {
    ok(await updateIndicacaoPopular(id, { descricao: "Buraco E2E Editado", status: "encaminhada" }));
    const lista = listaDe(await getIndicacoesPopulares(T.a.id));
    expect(lista.find((x) => x.id === id)?.descricao).toBe("Buraco E2E Editado");
  });

  it("exclui e some da listagem", async () => {
    ok(await deleteIndicacaoPopular(id));
    const lista = listaDe(await getIndicacoesPopulares(T.a.id));
    expect(lista.some((x) => x.id === id)).toBe(false);
  });
});
