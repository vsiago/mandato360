/**
 * Setup das integration tests.
 *
 * Estrategia: as server actions rodam de verdade (banco real, Zod real,
 * rate limit real, better-auth real). So os dois modulos que exigem
 * contexto de request do Next sao substituidos:
 *
 *  - next/headers  -> devolve o cookie de uma sessao REAL, obtida fazendo
 *                     login de verdade no servidor dev. Nao e sessao falsa:
 *                     o better-auth valida esse cookie contra o banco.
 *  - next/cache    -> revalidatePath/revalidateTag viram no-op (so existem
 *                     dentro do runtime do Next).
 */
import { vi, beforeEach } from "vitest";
import { config } from "dotenv";
import { fileURLToPath } from "node:url";

config({ path: fileURLToPath(new URL("../../.env.local", import.meta.url)) });

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3003";

export const TEST_CREDENTIALS = {
  email: "admin@mandato360.com",
  password: "Admin@123456",
};

// Preenchido pelo login real abaixo; lido pelo mock de next/headers.
const state: { cookie: string; ip: string } = { cookie: "", ip: "10.0.0.1" };

/**
 * O rate limiter e in-memory e chaveado por IP. Sem isso, todos os testes
 * caem no mesmo balde e passam a falhar por "Rate limited" em vez de pelo
 * motivo real. Cada teste recebe um IP proprio — o limitador continua ativo
 * DENTRO de um mesmo teste (é assim que o teste de rate limit funciona).
 */
let contadorIp = 0;
beforeEach(() => {
  contadorIp += 1;
  state.ip = `10.${(contadorIp >> 16) & 255}.${(contadorIp >> 8) & 255}.${contadorIp & 255}`;
});

export function fixarIp(ip: string) {
  state.ip = ip;
}

vi.mock("next/headers", () => ({
  headers: async () =>
    new Headers({ cookie: state.cookie, "x-forwarded-for": state.ip }),
  cookies: async () => ({
    get: (name: string) => {
      const m = state.cookie.match(new RegExp(`${name}=([^;]+)`));
      return m ? { name, value: m[1] } : undefined;
    },
    getAll: () => [],
    set: () => {},
    delete: () => {},
  }),
}));

vi.mock("next/cache", () => ({
  revalidatePath: () => {},
  revalidateTag: () => {},
  unstable_cache: (fn: unknown) => fn,
}));

/** Faz login de verdade e guarda o cookie de sessao. */
export async function loginReal(): Promise<string> {
  const res = await fetch(`${APP_URL}/api/auth/sign-in/email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // better-auth rejeita requisicao sem Origin (MISSING_OR_NULL_ORIGIN)
      Origin: APP_URL,
    },
    body: JSON.stringify(TEST_CREDENTIALS),
  });

  if (!res.ok) {
    throw new Error(
      `Login falhou (${res.status}). O servidor dev esta rodando em ${APP_URL}? Resposta: ${await res.text()}`
    );
  }

  const setCookie = res.headers.getSetCookie?.() ?? [];
  const cookie = setCookie.map((c) => c.split(";")[0]).join("; ");
  if (!cookie) throw new Error("Login OK mas nenhum cookie de sessao retornado.");

  state.cookie = cookie;
  return cookie;
}

/** Roda um trecho SEM sessao, para provar que a action exige autenticacao. */
export async function semSessao<T>(fn: () => Promise<T>): Promise<T> {
  const anterior = state.cookie;
  state.cookie = "";
  try {
    return await fn();
  } finally {
    state.cookie = anterior;
  }
}

export { APP_URL };
