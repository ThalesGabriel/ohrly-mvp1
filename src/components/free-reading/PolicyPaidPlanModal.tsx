"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  BellRing,
  CheckCircle2,
  History,
  Lightbulb,
  Lock,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type PaidPlanPolicy = {
  id: string;
  title: string;
  status: string;
  impact: string;
  message: string;
  freeReading: string;
};

type PolicyPaidPlanModalProps = {
  open: boolean;
  sessionToken: string | null;
  policy: PaidPlanPolicy | null;
  priceLabel?: string;
  planName?: string;
  onClose: () => void;
};

export function PolicyPaidPlanModal({
  open,
  sessionToken,
  policy,
  priceLabel = "R$ 97/mês",
  planName = "Ohrly Acompanhamento",
  onClose,
}: PolicyPaidPlanModalProps) {
  const [contact, setContact] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasJoinedWaitlist, setHasJoinedWaitlist] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setContact("");
    setIsSubmitting(false);
    setHasJoinedWaitlist(false);
    setErrorMessage(null);
  }, [open]);

  if (!open || !policy) return null;

  async function handleJoinWaitlist() {
    if (!policy) return;

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const response = await fetch("/api/free-readings/paid-interest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionToken,
          contact: contact.trim() || null,

          policyId: policy.id,
          policyTitle: policy.title,
          policyStatus: policy.status,
          policyImpact: policy.impact,

          planName,
          priceLabel,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(
          result.error ?? "Não foi possível registrar seu interesse.",
        );
        return;
      }

      setHasJoinedWaitlist(true);
    } catch (error) {
      console.error("[PolicyPaidPlanModal]", error);
      setErrorMessage("Erro inesperado ao registrar interesse.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-950/20">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-5 sm:px-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
              <Lock className="h-6 w-6" />
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-wide text-violet-700">
                Plano pago
              </p>

              <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
                Entenda a policy por trás desse sinal
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                A leitura gratuita mostra o sinal. O plano pago explica a causa
                provável, sugere oportunidades e acompanha se o comportamento
                melhora, sustenta ou volta a degradar.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {hasJoinedWaitlist ? (
          <div className="px-5 py-8 sm:px-6">
            <div className="mx-auto max-w-2xl rounded-[2rem] border border-emerald-200 bg-emerald-50 p-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <h3 className="mt-5 text-2xl font-black text-emerald-950">
                Interesse registrado
              </h3>

              <p className="mt-3 text-sm font-semibold leading-6 text-emerald-900/80">
                Você entrou na lista de espera do {planName}. Quando abrirmos
                os primeiros acessos pagos, essa leitura vai nos ajudar a
                entender quais policies fazem mais sentido para você.
              </p>

              <button
                type="button"
                onClick={onClose}
                className="mt-6 rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-800"
              >
                Voltar para a leitura
              </button>
            </div>
          </div>
        ) : (
          <div className="grid max-h-[calc(92vh-250px)] grid-cols-1 overflow-y-auto lg:grid-cols-[1.08fr_0.92fr]">
            <main className="px-5 py-5 sm:px-6">
              <div className="rounded-3xl border border-violet-200 bg-violet-50 p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-violet-700">
                      Policy selecionada
                    </p>

                    <h3 className="mt-1 text-xl font-black text-violet-950">
                      {policy.title}
                    </h3>

                    <p className="mt-2 text-sm font-semibold leading-6 text-violet-900/80">
                      {policy.message}
                    </p>
                  </div>

                  <span className="inline-flex w-fit shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-black text-violet-700 shadow-sm">
                    {policy.status}
                  </span>
                </div>

                <div className="mt-4 rounded-2xl bg-white/80 p-4 text-sm leading-6 text-slate-700">
                  <strong>O que a leitura gratuita mostrou:</strong>{" "}
                  {policy.freeReading}
                </div>
              </div>

              <section className="mt-5">
                <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                  O que entra no plano pago
                </p>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <PaidPlanBenefit
                    icon={Lightbulb}
                    title="Causa provável"
                    description="Explicação do que pode estar puxando esse sinal, sem tratar inferência como certeza."
                  />

                  <PaidPlanBenefit
                    icon={TrendingUp}
                    title="Oportunidade prática"
                    description="Sugestão de teste, ação ou acompanhamento a partir da policy detectada."
                  />

                  <PaidPlanBenefit
                    icon={History}
                    title="Histórico e recorrência"
                    description="Comparação com outros dias para entender se o sinal é novo ou recorrente."
                  />

                  <PaidPlanBenefit
                    icon={BellRing}
                    title="Acompanhamento"
                    description="Leitura de melhora, sustentação ou nova degradação depois da ação."
                  />
                </div>
              </section>

              <div className="mt-5 rounded-3xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />

                  <p className="text-sm font-semibold leading-6 text-amber-950">
                    O Ohrly não promete aumento garantido de faturamento. A
                    proposta é transformar sinais da operação em decisões mais
                    claras, acompanháveis e menos dependentes de feeling.
                  </p>
                </div>
              </div>
            </main>

            <aside className="border-t border-slate-200 bg-slate-50 px-5 py-5 sm:px-6 lg:border-l lg:border-t-0">
              <div className="sticky top-5 space-y-4">
                <div className="rounded-[2rem] border border-violet-200 bg-white p-5">
                  <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-violet-700">
                    <Sparkles className="h-4 w-4" />
                    Beta de validação
                  </div>

                  <h3 className="mt-4 text-2xl font-black text-slate-950">
                    {planName}
                  </h3>

                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                    Para quem quer sair da leitura pontual e acompanhar as
                    janelas de decisão da operação.
                  </p>

                  <div className="mt-5 rounded-3xl bg-violet-700 p-5 text-white">
                    <p className="text-xs font-black uppercase tracking-wide text-violet-100">
                      Preço previsto
                    </p>

                    <p className="mt-2 text-4xl font-black tracking-tight">
                      {priceLabel}
                    </p>

                    <p className="mt-2 text-xs font-bold text-violet-100">
                      Preço de validação. Sem cobrança agora.
                    </p>
                  </div>

                  <div className="mt-5 space-y-2 text-sm font-semibold text-slate-600">
                    <PlanIncludedRow text="Explicação das policies detectadas" />
                    <PlanIncludedRow text="Oportunidades e próximos testes" />
                    <PlanIncludedRow text="Histórico das leituras" />
                    <PlanIncludedRow text="Acompanhamento de evolução" />
                  </div>
                </div>

                <div className="rounded-[2rem] border border-slate-200 bg-white p-5">
                  <p className="text-sm font-black text-slate-950">
                    Entrar na lista de espera
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Use o contato informado na leitura gratuita ou deixe outro
                    e-mail/WhatsApp abaixo.
                  </p>

                  <label className="mt-4 block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-400">
                      <MessageCircle className="h-3.5 w-3.5" />
                      Contato opcional
                    </span>

                    <input
                      value={contact}
                      onChange={(event) => setContact(event.target.value)}
                      placeholder="E-mail ou WhatsApp"
                      className="mt-2 w-full bg-transparent text-sm font-black text-slate-800 outline-none placeholder:text-slate-400"
                    />
                  </label>

                  {errorMessage ? (
                    <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                      {errorMessage}
                    </div>
                  ) : null}

                  <button
                    type="button"
                    onClick={handleJoinWaitlist}
                    disabled={isSubmitting}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-700 px-5 py-4 text-sm font-black text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting
                      ? "Registrando interesse..."
                      : "Entrar na lista de espera"}
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <p className="mt-3 text-center text-xs font-semibold leading-5 text-slate-400">
                    Não é compra. É apenas sinal de interesse para priorizar os
                    primeiros acessos.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

function PaidPlanBenefit({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
        <Icon className="h-5 w-5" />
      </div>

      <p className="mt-3 text-sm font-black text-slate-950">{title}</p>

      <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}

function PlanIncludedRow({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2">
      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
      <span>{text}</span>
    </div>
  );
}