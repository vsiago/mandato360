import Link from "next/link"

/**
 * Usuario autenticado que nao esta vinculado a nenhum mandato.
 * Antes a raiz devolvia para /login, o que dava a impressao de que o login
 * tinha falhado — a pessoa entrava, voltava para a tela de login e nao
 * entendia o motivo.
 */
export default function SemAcessoPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A192F] px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#112240]/80 p-8 text-center shadow-2xl backdrop-blur-xl">
        <h1 className="text-2xl font-outfit font-black uppercase tracking-tight text-white">
          Conta sem mandato
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-white/60">
          Seu login funcionou, mas esta conta ainda não está vinculada a nenhum
          mandato. Peça ao administrador para liberar seu acesso.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block rounded-xl bg-[#0D9F6E] px-5 py-3 text-sm font-bold text-white transition-all hover:bg-[#0D9F6E]/90"
        >
          Entrar com outra conta
        </Link>
      </div>
    </div>
  )
}
