"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

const mainQuestions = [
  "Pedidos/carrinhos que não concluem",
  "Produtos que geram interesse, mas não compra",
  "Clientes que compram uma vez e não voltam",
  "Entender se o digital está funcionando",
  "Organizar melhor os dados da loja",
];

const dataSources = [
  "Planilha",
  "Plataforma de e-commerce",
  "ERP/sistema de gestão",
  "Marketplace",
  "WhatsApp/atendimento",
  "Ainda não acompanho bem",
];

export function EcommerceInterestForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mainQuestion, setMainQuestion] = useState("");
  const [dataSource, setDataSource] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = email.includes("@") && mainQuestion && dataSource && !submitting;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/ecommerce-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "post_checklist_ecommerce_landing",
          name,
          email,
          mainQuestion,
          dataSource,
          wantsEarlyAccess: true,
          landingPath: typeof window !== "undefined" ? window.location.pathname : null,
          referrer: typeof document !== "undefined" ? document.referrer : null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Não foi possível enviar agora.");
      }

      setSubmitted(true);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível enviar agora.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-[2rem] border border-emerald-200 bg-emerald-50/80 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white">
            <CheckCircle2 className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-xl font-semibold tracking-[-0.03em] text-emerald-950">
              Recebemos seu interesse.
            </h3>
            <p className="mt-2 text-sm leading-6 text-emerald-900/80">
              Vamos usar suas respostas para entender se sua operação tem aderência à versão
              inicial do Ohrly para e-commerce. Não é necessário enviar planilha agora.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[2rem] border border-violet-100 bg-white p-5 shadow-xl shadow-violet-900/5 sm:p-6">
      <div>
        <span className="inline-flex rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-700">
          Versão inicial
        </span>
        <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-[#21152f]">
          Quer ver se sua loja tem aderência ao Ohrly?
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Responda 2 pontos rápidos e deixe seu e-mail. A ideia é entender se faz sentido
          convidar sua operação para uma primeira leitura.
        </p>
      </div>

      <div className="mt-6 grid gap-4">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-[#21152f]">O que você mais quer entender agora?</span>
          <select
            value={mainQuestion}
            onChange={(event) => setMainQuestion(event.target.value)}
            className="h-12 rounded-2xl border border-violet-100 bg-[#fbf9ff] px-4 text-sm font-semibold text-[#21152f] outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
          >
            <option value="">Selecione uma opção</option>
            {mainQuestions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-[#21152f]">Como você acompanha os resultados hoje?</span>
          <select
            value={dataSource}
            onChange={(event) => setDataSource(event.target.value)}
            className="h-12 rounded-2xl border border-violet-100 bg-[#fbf9ff] px-4 text-sm font-semibold text-[#21152f] outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
          >
            <option value="">Selecione uma opção</option>
            {dataSources.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-[#21152f]">Nome <span className="font-semibold text-slate-400">opcional</span></span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Seu nome"
            className="h-12 rounded-2xl border border-violet-100 bg-[#fbf9ff] px-4 text-sm font-semibold text-[#21152f] outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-[#21152f]">E-mail</span>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="voce@empresa.com.br"
            className="h-12 rounded-2xl border border-violet-100 bg-[#fbf9ff] px-4 text-sm font-semibold text-[#21152f] outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
          />
        </label>
      </div>

      {error && (
        <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-violet-700 px-5 text-sm font-semibold text-white shadow-lg shadow-violet-900/10 transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:bg-violet-300"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            Quero participar da versão inicial
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      <p className="mt-4 text-center text-xs leading-5 text-slate-500">
        Não vamos pedir dados sensíveis sem antes entender se existe aderência.
      </p>
    </form>
  );
}
