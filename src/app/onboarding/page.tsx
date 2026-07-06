"use client";

import { useMemo, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronDown, Mail } from "lucide-react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type StepId = "profile" | "access";

type MainQuestion =
  | "checkout_completion"
  | "product_friction"
  | "repurchase"
  | "digital_role"
  | "measurability"
  | "not_sure";

type DataKey =
  | "spreadsheet"
  | "ecommerce_platform"
  | "erp"
  | "whatsapp"
  | "marketplace"
  | "manual_review"
  | "not_tracking_well";

type Option<T extends string> = {
  value: T;
  label: string;
  description?: string;
};

type PolicyId =
  | "order_completion_quality"
  | "high_friction_product_intent"
  | "post_purchase_continuity"
  | "digital_channel_underuse"
  | "customer_measurability_gap"
  | "cart_recovery_signal"
  | "channel_behavior_concentration";

type Policy = {
  id: PolicyId;
  title: string;
  shortDescription: string;
  usefulFields: string[];
};

type ScoredPolicy = Policy & {
  score: number;
  fitReasons: string[];
};

const steps: Array<{ id: StepId; eyebrow: string; title: string }> = [
  { id: "profile", eyebrow: "01", title: "Contexto" },
  { id: "access", eyebrow: "02", title: "Checklist" },
];

const questionOptions: Array<Option<MainQuestion>> = [
  {
    value: "checkout_completion",
    label: "Pedidos ou carrinhos que não concluem",
    description: "Quero entender onde a intenção deixa de virar venda confirmada.",
  },
  {
    value: "product_friction",
    label: "Produtos que geram interesse, mas pouca compra",
    description: "Quero entender produtos que parecem travar antes da compra.",
  },
  {
    value: "repurchase",
    label: "Clientes que compram uma vez e não voltam",
    description: "Quero entender recompra, continuidade e pós-compra.",
  },
  {
    value: "digital_role",
    label: "O papel do digital na operação",
    description: "Quero entender se o digital vende, apoia ou funciona como vitrine.",
  },
  {
    value: "measurability",
    label: "Dificuldade de medir cliente, canal ou recompra",
    description: "Quero entender se meus dados deixam parte da jornada invisível.",
  },
  {
    value: "not_sure",
    label: "Ainda não sei exatamente",
    description: "Quero começar com uma visão mais simples do que observar.",
  },
];

const dataOptions: Array<Option<DataKey>> = [
  { value: "spreadsheet", label: "Planilha" },
  { value: "ecommerce_platform", label: "Plataforma de e-commerce" },
  { value: "erp", label: "ERP ou sistema de gestão" },
  { value: "whatsapp", label: "WhatsApp/atendimento" },
  { value: "marketplace", label: "Marketplace" },
  { value: "manual_review", label: "Vejo manualmente no fim do dia" },
  { value: "not_tracking_well", label: "Ainda não acompanho bem" },
];

const policies: Policy[] = [
  {
    id: "order_completion_quality",
    title: "Pedidos criados que não viram venda confirmada",
    shortDescription: "Ajuda a revisar se existe perda entre intenção de compra, checkout e confirmação do pedido.",
    usefulFields: ["pedido", "status", "pagamento", "valor", "data"],
  },
  {
    id: "high_friction_product_intent",
    title: "Produtos com interesse, mas baixa conclusão",
    shortDescription: "Ajuda a perceber produtos que geram intenção, mas exigem mais confiança, prova ou atendimento.",
    usefulFields: ["produto", "categoria", "carrinho", "pedido", "preço"],
  },
  {
    id: "post_purchase_continuity",
    title: "Clientes que compram uma vez e não voltam",
    shortDescription: "Ajuda a revisar se a primeira compra vira relacionamento, recompra ou venda complementar.",
    usefulFields: ["cliente", "pedido", "produto", "data", "valor"],
  },
  {
    id: "digital_channel_underuse",
    title: "Canal digital pequeno ou pouco claro",
    shortDescription: "Ajuda a separar se o digital vende, gera intenção, apoia o WhatsApp ou funciona como vitrine.",
    usefulFields: ["canal", "pedido", "origem", "valor", "data"],
  },
  {
    id: "customer_measurability_gap",
    title: "Dados insuficientes para medir continuidade",
    shortDescription: "Ajuda a identificar quando a loja vende, mas parte do cliente, canal ou recompra fica invisível.",
    usefulFields: ["cliente", "telefone", "canal", "pedido", "data"],
  },
  {
    id: "cart_recovery_signal",
    title: "Carrinhos ou intenções que merecem atenção",
    shortDescription: "Ajuda a diferenciar abandono recuperável de ruído, tentativa ruim ou intenção sem qualidade.",
    usefulFields: ["carrinho", "cliente", "produto", "valor", "data"],
  },
  {
    id: "channel_behavior_concentration",
    title: "Dependência ou mistura entre canais",
    shortDescription: "Ajuda a entender se site, WhatsApp, marketplace e físico contam partes diferentes da mesma jornada.",
    usefulFields: ["canal", "pedido", "cliente", "produto", "valor"],
  },
];

function scorePolicies(mainQuestion: MainQuestion | "", availableData: DataKey[]): ScoredPolicy[] {
  return policies
    .map((policy) => {
      let score = 0;
      const fitReasons: string[] = [];
      const has = (key: DataKey) => availableData.includes(key);

      if (policy.id === "order_completion_quality") {
        if (mainQuestion === "checkout_completion") score += 42;
        if (has("ecommerce_platform") || has("spreadsheet")) score += 12;
        if (has("manual_review")) score += 8;
        if (score > 0) fitReasons.push("você indicou interesse em entender pedidos ou carrinhos não concluídos");
      }

      if (policy.id === "high_friction_product_intent") {
        if (mainQuestion === "product_friction") score += 42;
        if (mainQuestion === "checkout_completion") score += 12;
        if (has("ecommerce_platform") || has("spreadsheet")) score += 10;
        if (score > 0) fitReasons.push("produtos podem precisar ser lidos por interesse, atrito e conclusão");
      }

      if (policy.id === "post_purchase_continuity") {
        if (mainQuestion === "repurchase") score += 42;
        if (has("erp") || has("spreadsheet")) score += 12;
        if (has("whatsapp")) score += 8;
        if (score > 0) fitReasons.push("há sinais de que recompra ou continuidade podem importar");
      }

      if (policy.id === "digital_channel_underuse") {
        if (mainQuestion === "digital_role") score += 42;
        if (has("whatsapp") || has("marketplace")) score += 12;
        if (has("manual_review")) score += 8;
        if (score > 0) fitReasons.push("o digital pode estar vendendo, apoiando ou funcionando como vitrine");
      }

      if (policy.id === "customer_measurability_gap") {
        if (mainQuestion === "measurability") score += 42;
        if (mainQuestion === "repurchase") score += 12;
        if (has("not_tracking_well")) score += 16;
        if (has("manual_review")) score += 8;
        if (score > 0) fitReasons.push("a continuidade depende de identificar melhor cliente, canal e origem");
      }

      if (policy.id === "cart_recovery_signal") {
        if (mainQuestion === "checkout_completion") score += 26;
        if (has("ecommerce_platform")) score += 12;
        if (score > 0) fitReasons.push("carrinhos e intenções podem merecer leitura antes de recuperação automática");
      }

      if (policy.id === "channel_behavior_concentration") {
        if (mainQuestion === "digital_role") score += 24;
        if (has("whatsapp") || has("marketplace") || has("erp")) score += 18;
        if (score > 0) fitReasons.push("os canais podem estar contando partes diferentes da mesma jornada");
      }

      if (mainQuestion === "not_sure") score += 10;
      if (has("not_tracking_well")) score += 6;

      return { ...policy, score, fitReasons };
    })
    .filter((policy) => policy.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

export default function OhrlyEcommerceOnboardingStepper() {
  const [currentStep, setCurrentStep] = useState<StepId>("profile");
  const [mainQuestion, setMainQuestion] = useState<MainQuestion | "">("");
  const [availableData, setAvailableData] = useState<DataKey[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [wantsEarlyAccess, setWantsEarlyAccess] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);
  const topPolicies = useMemo(() => scorePolicies(mainQuestion, availableData), [mainQuestion, availableData]);
  const previewPolicies = topPolicies.length > 0 ? topPolicies : policies.slice(0, 5).map((policy) => ({ ...policy, score: 0, fitReasons: [] }));

  const canContinue =
    currentStep === "profile"
      ? Boolean(mainQuestion && availableData.length)
      : email.trim().length >= 5 && email.includes("@");

  function toggleData(key: DataKey) {
    setAvailableData((current) => {
      if (key === "not_tracking_well") {
        return current.includes("not_tracking_well") ? [] : ["not_tracking_well"];
      }

      const withoutNotTracking = current.filter((item) => item !== "not_tracking_well");
      return withoutNotTracking.includes(key)
        ? withoutNotTracking.filter((item) => item !== key)
        : [...withoutNotTracking, key];
    });
  }

  function goNext() {
    if (!canContinue) return;
    setCurrentStep("access");
  }

  function goBack() {
    setCurrentStep("profile");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canContinue) return;

    setSubmitting(true);
    setSubmitError(null);

    const payload = {
      source: "ohrly_ecommerce_checklist_lead_short_flow",
      operationModel: null,
      mainQuestion,
      availableData,
      matchedPolicies: previewPolicies.map(({ id, title, score, fitReasons }) => ({
        id,
        title,
        score,
        fitReasons,
      })),
      refinement: {
        scenario: null,
        channelContext: null,
        behaviorPattern: null,
      },
      checklistRequest: {
        name,
        email,
        leadMagnet: "checklist_desempenho_invisivel_ecommerce",
        intent: "receive_free_checklist",
        wantsEarlyAccess,
        suggestedFocus: previewPolicies.slice(0, 5).map(({ id, title }) => ({ id, title })),
      },
      tracking: {
        landingPath: typeof window !== "undefined" ? window.location.pathname : null,
        referrer: typeof document !== "undefined" ? document.referrer || null : null,
        utmSource: typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("utm_source") : null,
        utmMedium: typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("utm_medium") : null,
        utmCampaign: typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("utm_campaign") : null,
        utmContent: typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("utm_content") : null,
        utmTerm: typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("utm_term") : null,
      },
    };

    try {
      const response = await fetch("/api/ecommerce-onboarding/checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Não foi possível solicitar o checklist agora.");
      }

      setSubmitted(true);
    } catch (error) {
      console.error("Ohrly ecommerce checklist request failed", error);
      setSubmitError(error instanceof Error ? error.message : "Não foi possível solicitar o checklist agora.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fbf9ff] text-slate-950">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section>
          <p className="inline-flex rounded-full border border-violet-100 bg-white px-3 py-1 text-xs font-semibold text-violet-700 shadow-sm shadow-violet-100/60">
            Checklist gratuito para e-commerce
          </p>

          <h1 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.04em] text-slate-950 sm:text-4xl">
            Receba um checklist para revisar o desempenho do seu e-commerce.
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Responda 2 perguntas rápidas e receba um material para observar pedidos não concluídos, produtos com atrito, recompra e dados invisíveis antes de decidir o que fazer amanhã.
          </p>
        </section>

        <section className="relative rounded-[2rem] border border-violet-100 bg-white shadow-sm shadow-violet-100/70">
          <div className="rounded-t-[2rem] border-b border-violet-100 px-4 py-4 sm:px-6">
            <Stepper currentStep={currentStep} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="relative p-4 sm:p-6 lg:p-8">
              {currentStep === "profile" && (
                <div>
                  <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                    <StepIntro
                      eyebrow="Contexto rápido"
                      title="Duas respostas para adaptar o checklist."
                      description="A ideia é reduzir fricção: você informa o que quer entender e como acompanha os resultados hoje. O checklist vem depois no seu e-mail."
                    />

                    <div className="relative z-20 space-y-6">
                      <SelectField
                        label="O que você mais quer entender agora?"
                        placeholder="Selecione a principal dúvida"
                        value={mainQuestion}
                        options={questionOptions}
                        onChange={(value) => setMainQuestion(value as MainQuestion)}
                      />

                      <MultiSelectDropdown
                        label="Como você acompanha os resultados hoje?"
                        placeholder="Selecione uma ou mais opções"
                        values={availableData}
                        options={dataOptions}
                        onToggle={toggleData}
                      />

                    </div>
                  </div>
                  <div className="rounded-3xl border border-violet-100 bg-[#fbf9ff] p-5 mt-5">
                    <p className="text-sm font-semibold text-slate-950">O que você vai receber</p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {[
                        "O que vendeu",
                        "O que travou",
                        "O que merece ação",
                        "Quais dados observar",
                      ].map((item) => (
                        <div key={item} className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-sm text-slate-600">
                          <Check className="h-4 w-4 text-violet-700" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === "access" && (
                <div>
                  <StepIntro
                    eyebrow="Receber checklist"
                    full
                    title="Seu checklist gratuito está quase pronto."
                    description="Com base nas suas respostas, vamos priorizar os sinais mais úteis para revisar o desempenho do seu e-commerce sem pedir planilha, upload ou call agora."
                  />

                  <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                    <div className="rounded-3xl border border-violet-100 bg-[#fbf9ff] p-5">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-700 text-white">
                          <Mail className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-950">Checklist de desempenho invisível</p>
                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            Um material curto para olhar o dia da operação e encontrar sinais de venda, atrito, recompra e dados que merecem atenção.
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 rounded-2xl border border-violet-100 bg-white p-4">
                        <p className="text-sm font-semibold text-slate-950">Seu checklist deve priorizar:</p>
                        <div className="mt-3 space-y-2">
                          {previewPolicies.slice(0, 4).map((policy) => (
                            <div key={policy.id} className="flex gap-3 text-sm leading-5 text-slate-600">
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-600" />
                              <span>{policy.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      {submitted ? (
                        <div className="rounded-3xl border border-violet-100 bg-white p-5">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-700 text-white">
                            <Check className="h-5 w-5" />
                          </div>
                          <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">Checklist solicitado.</h2>
                          <p className="mt-3 text-sm leading-6 text-slate-600">
                            Vamos enviar o checklist gratuito no e-mail informado. Ele não é um diagnóstico da sua loja, mas ajuda a organizar os sinais que uma operação parecida deveria observar.
                          </p>
                          {wantsEarlyAccess && (
                            <p className="mt-3 rounded-2xl border border-violet-100 bg-[#fbf9ff] p-3 text-sm leading-6 text-slate-600">
                              Também registramos seu interesse na versão inicial do Ohrly. Se houver aderência ao seu perfil de operação, enviamos um convite de acesso.
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col justify-evenly h-[100%]">
                          <div className="rounded-3xl border border-violet-100 bg-white p-5">
                            <div className="grid gap-3 sm:grid-cols-2">
                              <label className="block">
                                <span className="text-xs font-semibold text-slate-500">
                                  Nome <span className="font-normal">opcional</span>
                                </span>
                                <input
                                  value={name}
                                  onChange={(event) => setName(event.target.value)}
                                  placeholder="Seu nome"
                                  className="mt-1 h-11 w-full rounded-2xl border border-violet-100 bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
                                />
                              </label>

                              <label className="block">
                                <span className="text-xs font-semibold text-slate-500">E-mail</span>
                                <input
                                  value={email}
                                  onChange={(event) => setEmail(event.target.value)}
                                  placeholder="voce@empresa.com"
                                  type="email"
                                  className="mt-1 h-11 w-full rounded-2xl border border-violet-100 bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
                                />
                              </label>
                            </div>
                            {submitError && (
                              <p className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</p>
                            )}
                          </div>
                          <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-violet-100 bg-[#fbf9ff] p-4 transition hover:border-violet-200">
                            <input
                              type="checkbox"
                              checked={wantsEarlyAccess}
                              onChange={(event) => setWantsEarlyAccess(event.target.checked)}
                              className="mt-1 h-4 w-4 rounded border-violet-200 text-violet-700 focus:ring-violet-500"
                            />
                            <span className="text-sm leading-6 text-slate-600">
                              <span className="font-semibold text-slate-950">Também quero participar da versão inicial do Ohrly.</span>{" "}
                              Estamos liberando acesso exclusivo para poucas operações e podemos enviar um convite se houver aderência.
                            </span>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {!submitted && (
              <div className="flex items-center justify-between gap-3 rounded-b-[2rem] border-t border-violet-100 px-4 py-4 sm:px-6">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={currentStepIndex === 0}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-violet-100 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-violet-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </button>

                {currentStep === "access" ? (
                  <button
                    type="submit"
                    disabled={!canContinue || submitting}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-violet-700 px-5 text-sm font-semibold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    {submitting ? "Enviando..." : "Receber checklist gratuito"}
                    <Mail className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!canContinue}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-violet-700 px-5 text-sm font-semibold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    Continuar
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </form>
        </section>
      </main>
    </div>
  );
}

function Stepper({ currentStep }: { currentStep: StepId }) {
  const currentIndex = steps.findIndex((step) => step.id === currentStep);
  const progress = ((currentIndex + 1) / steps.length) * 100;

  return (
    <div>
      <div className="h-1.5 rounded-full bg-violet-50">
        <div className="h-full rounded-full bg-violet-700 transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {steps.map((step, index) => {
          const active = step.id === currentStep;
          const completed = index < currentIndex;

          return (
            <div key={step.id} className="min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition",
                    active || completed ? "bg-violet-700 text-white" : "bg-violet-50 text-violet-300",
                  )}
                >
                  {completed ? <Check className="h-3.5 w-3.5" /> : step.eyebrow}
                </span>
                <span className={cn("truncate text-xs font-semibold", active ? "text-violet-700" : "text-slate-400")}>{step.title}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepIntro({ eyebrow, title, description, full }: { eyebrow: string; title: string; description: string; full?: boolean }) {
  return (
    <div className={full ? "" : "max-w-md"}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-3xl">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}

function SelectField<T extends string>({
  label,
  placeholder,
  value,
  options,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: T | "";
  options: Array<Option<T>>;
  onChange: (value: T) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <div className="block">
      <p className="text-sm font-semibold text-slate-950">{label}</p>

      <div className="mt-2 rounded-2xl border border-violet-100 bg-white transition focus-within:border-violet-500 focus-within:ring-4 focus-within:ring-violet-500/10">
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="flex min-h-12 w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium outline-none"
          aria-expanded={isOpen}
        >
          <span className={cn("line-clamp-2", selected ? "text-slate-950" : "text-slate-400")}>{selected?.label ?? placeholder}</span>
          <ChevronDown className={cn("h-4 w-4 shrink-0 text-violet-500 transition", isOpen && "rotate-180")} />
        </button>

        {isOpen && (
          <div className="border-t border-violet-50 p-2">
            <div className="max-h-64 overflow-y-auto pr-1">
              {options.map((option) => {
                const isSelected = option.value === value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className="flex w-full items-start justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-violet-50"
                  >
                    <span>
                      <span className={cn("block", isSelected ? "font-semibold text-violet-700" : "font-medium text-slate-700")}>{option.label}</span>
                      {option.description && <span className="mt-0.5 block text-xs leading-5 text-slate-500">{option.description}</span>}
                    </span>
                    <span
                      className={cn(
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                        isSelected ? "border-violet-700 bg-violet-700 text-white" : "border-violet-100 text-transparent",
                      )}
                    >
                      <Check className="h-3 w-3" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {selected?.description && !isOpen && <span className="mt-2 block text-xs leading-5 text-slate-500">{selected.description}</span>}
    </div>
  );
}

function MultiSelectDropdown<T extends string>({
  label,
  placeholder,
  values,
  options,
  onToggle,
}: {
  label: string;
  placeholder: string;
  values: T[];
  options: Array<Option<T>>;
  onToggle: (value: T) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabels = options.filter((option) => values.includes(option.value)).map((option) => option.label);
  const summary = selectedLabels.length ? selectedLabels.join(", ") : placeholder;

  return (
    <div>
      <p className="text-sm font-semibold text-slate-950">{label}</p>

      <div className="mt-2 rounded-2xl border border-violet-100 bg-white transition focus-within:border-violet-500 focus-within:ring-4 focus-within:ring-violet-500/10">
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="flex min-h-12 w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium outline-none"
          aria-expanded={isOpen}
        >
          <span className={cn("line-clamp-2", selectedLabels.length ? "text-slate-950" : "text-slate-400")}>{summary}</span>
          <ChevronDown className={cn("h-4 w-4 shrink-0 text-violet-500 transition", isOpen && "rotate-180")} />
        </button>

        {isOpen && (
          <div className="border-t border-violet-50 p-2">
            <div className="max-h-64 overflow-y-auto pr-1">
              {options.map((option) => {
                const selected = values.includes(option.value);

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onToggle(option.value)}
                    className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-violet-50"
                  >
                    <span className={selected ? "font-semibold text-violet-700" : "font-medium text-slate-700"}>{option.label}</span>
                    <span
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                        selected ? "border-violet-700 bg-violet-700 text-white" : "border-violet-100 text-transparent",
                      )}
                    >
                      <Check className="h-3 w-3" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {selectedLabels.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {selectedLabels.slice(0, 5).map((item) => (
            <span key={item} className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700">
              {item}
            </span>
          ))}
          {selectedLabels.length > 5 && <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700">+{selectedLabels.length - 5}</span>}
        </div>
      )}
    </div>
  );
}
