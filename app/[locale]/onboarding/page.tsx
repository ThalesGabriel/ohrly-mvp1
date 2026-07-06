"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Check,
  Download,
  Mail,
  Sparkles,
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type OperationModel =
  | "online_only"
  | "hybrid_physical_online"
  | "online_whatsapp"
  | "online_marketplace"
  | "physical_social"
  | "starting_digital";

type MainQuestion =
  | "checkout_completion"
  | "product_friction"
  | "daily_decision"
  | "repurchase"
  | "digital_role"
  | "not_sure";

type TrackingMethod =
  | "spreadsheet"
  | "ecommerce_platform"
  | "erp"
  | "marketplace"
  | "whatsapp"
  | "not_tracking_well";

type DataKey =
  | "spreadsheet"
  | "orders"
  | "products"
  | "customers"
  | "carts"
  | "visits"
  | "whatsapp"
  | "physical_sales"
  | "marketplace"
  | "not_sure";

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
  | "cart_recovery_signal";

type Policy = {
  id: PolicyId;
  title: string;
  shortDescription: string;
  signals: string[];
};

type ScoredPolicy = Policy & {
  score: number;
  fitReasons: string[];
};

const CHECKLIST_URL = "/materials/checklist_desempenho_invisivel_ecommerce_ohrly.pdf";

const operationOptions: Array<Option<OperationModel>> = [
  { value: "online_only", label: "Só loja online" },
  { value: "hybrid_physical_online", label: "Loja física + online" },
  { value: "online_whatsapp", label: "Online + WhatsApp/Instagram" },
  { value: "online_marketplace", label: "Online + marketplace" },
  { value: "physical_social", label: "Loja física + redes sociais" },
  { value: "starting_digital", label: "Estou estruturando o digital" },
];

const questionOptions: Array<Option<MainQuestion>> = [
  { value: "daily_decision", label: "Olhar o dia e decidir o que fazer amanhã" },
  { value: "checkout_completion", label: "Pedidos ou carrinhos que não concluem" },
  { value: "product_friction", label: "Produtos que chamam atenção, mas não vendem" },
  { value: "repurchase", label: "Clientes que compram uma vez e não voltam" },
  { value: "digital_role", label: "Entender o papel do digital na operação" },
  { value: "not_sure", label: "Ainda não sei exatamente" },
];

const trackingOptions: Array<Option<TrackingMethod>> = [
  { value: "spreadsheet", label: "Planilha" },
  { value: "ecommerce_platform", label: "Plataforma de e-commerce" },
  { value: "erp", label: "ERP ou sistema de gestão" },
  { value: "marketplace", label: "Marketplace" },
  { value: "whatsapp", label: "WhatsApp/atendimento" },
  { value: "not_tracking_well", label: "Ainda não acompanho bem" },
];

const policies: Policy[] = [
  {
    id: "order_completion_quality",
    title: "Pedidos criados que não viram venda confirmada",
    shortDescription: "Entender se a intenção de compra está travando entre carrinho, checkout, pagamento e confirmação.",
    signals: ["pedido criado", "status", "pagamento", "valor"],
  },
  {
    id: "high_friction_product_intent",
    title: "Produtos com interesse, mas baixa conclusão",
    shortDescription: "Separar produto com demanda de produto que exige confiança, prova, atendimento ou explicação.",
    signals: ["produto", "categoria", "carrinho", "pedido"],
  },
  {
    id: "post_purchase_continuity",
    title: "Clientes que compram uma vez e não voltam",
    shortDescription: "Ver se a primeira compra está virando recompra, complementaridade ou relacionamento.",
    signals: ["cliente", "primeira compra", "retorno", "produto complementar"],
  },
  {
    id: "digital_channel_underuse",
    title: "Canal digital pequeno em relação à operação",
    shortDescription: "Entender se o digital vende, gera intenção, apoia WhatsApp ou funciona como vitrine local.",
    signals: ["canal", "receita", "pedidos", "origem"],
  },
  {
    id: "customer_measurability_gap",
    title: "Dados insuficientes para medir continuidade",
    shortDescription: "Identificar quando há venda, mas pouco rastro para medir cliente, recompra e jornada real.",
    signals: ["cliente", "canal", "origem", "venda anônima"],
  },
  {
    id: "cart_recovery_signal",
    title: "Carrinhos ou intenções que merecem recuperação",
    shortDescription: "Diferenciar abandono recuperável de tentativa ruim, ruído ou intenção sem qualidade.",
    signals: ["carrinho", "checkout", "nova tentativa", "cliente"],
  },
];

function trackingMethodToAvailableData(method: TrackingMethod | ""): DataKey[] {
  if (method === "spreadsheet") return ["spreadsheet", "orders", "products"];
  if (method === "ecommerce_platform") return ["orders", "products", "customers", "carts"];
  if (method === "erp") return ["orders", "products", "customers", "physical_sales"];
  if (method === "marketplace") return ["marketplace", "orders", "products"];
  if (method === "whatsapp") return ["whatsapp", "customers", "orders"];
  return ["not_sure"];
}

function scorePolicies(
  operationModel: OperationModel | "",
  mainQuestion: MainQuestion | "",
  trackingMethod: TrackingMethod | "",
): ScoredPolicy[] {
  const availableData = trackingMethodToAvailableData(trackingMethod);
  const has = (key: DataKey) => availableData.includes(key);

  return policies
    .map((policy) => {
      let score = 0;
      const fitReasons: string[] = [];

      if (policy.id === "order_completion_quality") {
        if (mainQuestion === "checkout_completion") score += 40;
        if (mainQuestion === "daily_decision") score += 18;
        if (has("orders")) score += 18;
        if (has("carts")) score += 14;
        if (["online_only", "online_whatsapp", "online_marketplace"].includes(operationModel)) score += 8;
        if (score > 0) fitReasons.push("pedidos e conclusão aparecem como um ponto provável de leitura");
      }

      if (policy.id === "high_friction_product_intent") {
        if (mainQuestion === "product_friction") score += 42;
        if (mainQuestion === "daily_decision") score += 16;
        if (has("products")) score += 20;
        if (["online_whatsapp", "physical_social", "hybrid_physical_online"].includes(operationModel)) score += 10;
        if (score > 0) fitReasons.push("produtos podem precisar ser lidos por interesse, atrito e conclusão");
      }

      if (policy.id === "post_purchase_continuity") {
        if (mainQuestion === "repurchase") score += 42;
        if (has("customers")) score += 18;
        if (has("orders")) score += 12;
        if (["hybrid_physical_online", "physical_social"].includes(operationModel)) score += 10;
        if (score > 0) fitReasons.push("continuidade e recompra podem estar escondidas nos dados");
      }

      if (policy.id === "digital_channel_underuse") {
        if (mainQuestion === "digital_role") score += 42;
        if (["hybrid_physical_online", "physical_social", "starting_digital"].includes(operationModel)) score += 22;
        if (has("physical_sales") || has("whatsapp") || has("marketplace")) score += 14;
        if (score > 0) fitReasons.push("o digital pode estar cumprindo mais de um papel na operação");
      }

      if (policy.id === "customer_measurability_gap") {
        if (mainQuestion === "repurchase") score += 18;
        if (trackingMethod === "not_tracking_well") score += 24;
        if (["hybrid_physical_online", "physical_social", "starting_digital"].includes(operationModel)) score += 16;
        if (has("customers")) score += 8;
        if (score > 0) fitReasons.push("medir cliente real pode ser pré-condição para entender recompra");
      }

      if (policy.id === "cart_recovery_signal") {
        if (mainQuestion === "checkout_completion") score += 28;
        if (has("carts")) score += 26;
        if (mainQuestion === "daily_decision") score += 12;
        if (score > 0) fitReasons.push("nem toda intenção abandonada deve ser tratada do mesmo jeito");
      }

      if (mainQuestion === "not_sure") score += 8;
      if (trackingMethod === "not_tracking_well") score += 4;

      return { ...policy, score, fitReasons };
    })
    .filter((policy) => policy.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
}

function getTrackingPayload() {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);

  return {
    landingPath: window.location.pathname,
    referrer: typeof document !== "undefined" ? document.referrer || null : null,
    utmSource: params.get("utm_source"),
    utmMedium: params.get("utm_medium"),
    utmCampaign: params.get("utm_campaign"),
    utmContent: params.get("utm_content"),
    utmTerm: params.get("utm_term"),
  };
}

export default function OhrlyEcommerceChecklistDownloadFirst() {
  const [downloaded, setDownloaded] = useState(false);
  const [operationModel, setOperationModel] = useState<OperationModel | "">("");
  const [mainQuestion, setMainQuestion] = useState<MainQuestion | "">("");
  const [trackingMethod, setTrackingMethod] = useState<TrackingMethod | "">("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [wantsEarlyAccess, setWantsEarlyAccess] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const topPolicies = useMemo(
    () => scorePolicies(operationModel, mainQuestion, trackingMethod),
    [operationModel, mainQuestion, trackingMethod],
  );

  const suggestedFocus = topPolicies.length > 0 ? topPolicies : policies.slice(0, 3).map((policy) => ({ ...policy, score: 0, fitReasons: [] }));
  const availableData = trackingMethodToAvailableData(trackingMethod);
  const canSubmit = email.trim().length >= 5 && email.includes("@");

  function handleDownloadClick() {
    setDownloaded(true);

    if (typeof window !== "undefined") {
      window.setTimeout(() => {
        document.getElementById("after-download")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 250);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setSubmitError(null);

    const payload = {
      source: "ohrly_ecommerce_checklist_download_first_followup",
      operationModel: operationModel || null,
      mainQuestion: mainQuestion || null,
      availableData,
      matchedPolicies: topPolicies.map(({ id, title, score, fitReasons }) => ({
        id,
        title,
        score,
        fitReasons,
      })),
      refinement: {
        scenario: mainQuestion || "post_download_context",
        channelContext: operationModel || "not_informed",
        behaviorPattern: trackingMethod || "not_informed",
      },
      checklistRequest: {
        name,
        email,
        leadMagnet: "checklist_desempenho_invisivel_ecommerce",
        intent: "downloaded_checklist_and_shared_context",
        wantsEarlyAccess,
        suggestedFocus: suggestedFocus.slice(0, 4).map(({ id, title }) => ({ id, title })),
      },
      tracking: getTrackingPayload(),
    };

    try {
      const response = await fetch("/api/ecommerce-onboarding/checklist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message || "Não foi possível salvar suas respostas agora.");
      }

      setSubmitted(true);
    } catch (error) {
      console.error("Ohrly checklist follow-up failed", error);
      setSubmitError(error instanceof Error ? error.message : "Não foi possível salvar suas respostas agora.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell>
      <main className="">
        <section className="mx-auto grid min-h-[90vh] w-full max-w-6xl items-center gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_0.92fr] lg:px-8">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white px-3 py-1.5 text-xs font-medium text-violet-700 shadow-sm shadow-violet-100/70">
              <Sparkles className="h-3.5 w-3.5" />
              Checklist gratuito para e-commerce
            </div>

            <div className="space-y-5">
              <h1 className="max-w-3xl text-4xl font-semibold leading-[1.04] tracking-[-0.055em] text-slate-950 sm:text-5xl lg:text-6xl">
                Fechou o dia. E agora, o que fazer amanhã?
              </h1>

              <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Baixe um checklist simples para olhar sua planilha, seus pedidos ou sua plataforma e encontrar sinais de venda, atrito e recompra que merecem atenção.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <ValuePill>Pedidos não concluídos</ValuePill>
              <ValuePill>Produtos com atrito</ValuePill>
              <ValuePill>Clientes que não voltam</ValuePill>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={CHECKLIST_URL}
                target="_blank"
                rel="noreferrer"
                onClick={handleDownloadClick}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-700 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-800"
              >
                <Download className="h-4 w-4" />
                Baixar checklist gratuito
              </a>

              <button
                type="button"
                onClick={() => {
                  setDownloaded(true);
                  document.getElementById("after-download")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-violet-100 bg-white px-6 py-4 text-sm font-semibold text-violet-800 shadow-sm shadow-violet-100/70 transition hover:border-violet-200 hover:bg-violet-50"
              >
                Entender seu ecommerce
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <p className="max-w-xl text-xs leading-6 text-slate-500">
              Sem cadastro obrigatório para abrir o material. Depois do download, você pode responder algumas perguntas rápidas para receber uma sugestão mais próxima da sua operação.
            </p>
          </div>

          <ChecklistPreview />
        </section>

        {downloaded && (
          <section id="after-download" className="border-t border-violet-100 bg-white/60 px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.82fr_1.18fr]">
              <div className="rounded-[2rem] border border-violet-100 bg-white p-6 shadow-sm shadow-violet-100/70">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                  <Check className="h-5 w-5" />
                </div>

                <h2 className="mt-5 text-2xl font-semibold tracking-[-0.035em] text-slate-950">
                  Checklist liberado.
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Agora, se quiser, responda algumas informações para receber também uma versão por e-mail e indicar se quer participar da primeira versão do Ohrly.
                </p>

                <div className="mt-6 rounded-2xl bg-violet-50 p-4 text-sm leading-6 text-violet-950">
                  A intenção aqui é entender se sua operação combina com uma leitura inicial do Ohrly. Não precisa enviar planilha agora.
                </div>
              </div>

              <form onSubmit={handleSubmit} className="rounded-[2rem] border border-violet-100 bg-white p-4 shadow-sm shadow-violet-100/70 sm:p-6 lg:p-8">
                {submitted ? (
                  <div className="space-y-5">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                      <Check className="h-5 w-5" />
                    </div>

                    <div>
                      <h3 className="text-2xl font-semibold tracking-[-0.035em] text-slate-950">
                        Respostas recebidas.
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        Também enviamos o checklist para o e-mail informado. Se houver aderência à versão inicial do Ohrly, entraremos em contato com próximos passos.
                      </p>
                    </div>

                    <a
                      href={CHECKLIST_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-violet-100 bg-violet-50 px-5 py-3 text-sm font-semibold text-violet-800 transition hover:bg-violet-100"
                    >
                      Abrir checklist novamente
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-600">
                        Opcional
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-slate-950">
                        Quer uma sugestão mais próxima da sua loja?
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        Responda 3 perguntas rápidas. Isso ajuda a entender quais sinais do checklist fazem mais sentido para seu momento.
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <SelectField
                        label="O que você mais quer entender agora?"
                        value={mainQuestion}
                        placeholder="Selecione uma opção"
                        options={questionOptions}
                        onChange={(value) => setMainQuestion(value as MainQuestion)}
                      />

                      <SelectField
                        label="Como acompanha os resultados hoje?"
                        value={trackingMethod}
                        placeholder="Selecione uma opção"
                        options={trackingOptions}
                        onChange={(value) => setTrackingMethod(value as TrackingMethod)}
                      />
                    </div>

                    <SelectField
                      label="Como sua operação vende hoje?"
                      value={operationModel}
                      placeholder="Opcional, mas ajuda a aproximar a leitura"
                      options={operationOptions}
                      onChange={(value) => setOperationModel(value as OperationModel)}
                    />

                    {(mainQuestion || trackingMethod || operationModel) && (
                      <div className="rounded-3xl border border-violet-100 bg-[#fbf9ff] p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">
                          Comece olhando por aqui
                        </p>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          {suggestedFocus.slice(0, 4).map((policy) => (
                            <div key={policy.id} className="rounded-2xl border border-violet-100 bg-white p-4">
                              <p className="text-sm font-semibold leading-5 text-slate-950">{policy.title}</p>
                              <p className="mt-2 text-xs leading-5 text-slate-500">{policy.shortDescription}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid gap-4 sm:grid-cols-[0.8fr_1.2fr]">
                      <InputField
                        label="Nome"
                        placeholder="Opcional"
                        value={name}
                        onChange={setName}
                      />

                      <InputField
                        label="E-mail"
                        placeholder="seu@email.com"
                        type="email"
                        value={email}
                        onChange={setEmail}
                        required
                      />
                    </div>

                    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-violet-100 bg-violet-50/70 p-4 text-sm leading-6 text-slate-700">
                      <input
                        type="checkbox"
                        checked={wantsEarlyAccess}
                        onChange={(event) => setWantsEarlyAccess(event.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-violet-300 text-violet-700 focus:ring-violet-500"
                      />
                      <span>
                        Também quero saber quando a versão inicial do Ohrly estiver disponível para testar com lojas digitais.
                      </span>
                    </label>

                    {submitError && (
                      <p className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {submitError}
                      </p>
                    )}

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <a
                        href={CHECKLIST_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-violet-700 underline-offset-4 hover:underline"
                      >
                        Abrir checklist sem responder
                      </a>

                      <button
                        type="submit"
                        disabled={!canSubmit || submitting}
                        className={cn(
                          "inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-semibold transition",
                          canSubmit && !submitting
                            ? "bg-violet-700 text-white shadow-lg shadow-violet-200 hover:bg-violet-800"
                            : "cursor-not-allowed bg-slate-100 text-slate-400",
                        )}
                      >
                        {submitting ? "Enviando..." : "Enviar respostas"}
                        {!submitting && <Mail className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </section>
        )}
      </main>
    </PageShell>
  );
}

function ValuePill({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-violet-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm shadow-violet-100/60">
      <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700">
        <Check className="h-3.5 w-3.5" />
      </span>
      {children}
    </div>
  );
}

function ChecklistPreview() {
  return (
    <div className="relative mx-auto w-full max-w-md rounded-[2rem] border border-violet-100 bg-white p-5 shadow-xl shadow-violet-100/80">
      <div className="rounded-[1.5rem] bg-gradient-to-br from-violet-700 to-violet-500 p-5 text-white">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Ohrly</p>
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
            gratuito
          </span>
        </div>

        <h2 className="mt-14 text-3xl font-semibold leading-tight tracking-[-0.045em]">
          Checklist de Desempenho Invisível para E-commerce
        </h2>

        <p className="mt-4 text-sm leading-6 text-violet-50">
          7 sinais para revisar pedidos, produtos, canais, recompra e dados antes de decidir o que fazer amanhã.
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {[
          "O que vendeu",
          "O que travou",
          "O que merece ação",
        ].map((item) => (
          <div key={item} className="flex items-center gap-3 rounded-2xl border border-violet-100 bg-[#fbf9ff] px-4 py-3">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-violet-700">
              <Check className="h-4 w-4" />
            </span>
            <span className="text-sm font-medium text-slate-700">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SelectField<T extends string>({
  label,
  value,
  placeholder,
  options,
  onChange,
}: {
  label: string;
  value: T | "";
  placeholder: string;
  options: Array<Option<T>>;
  onChange: (value: T) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-800">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className={cn(
          "mt-2 h-12 w-full rounded-2xl border bg-white px-4 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100",
          value ? "border-violet-200 text-slate-950" : "border-violet-100 text-slate-400",
        )}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-800">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 h-12 w-full rounded-2xl border border-violet-100 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
      />
    </label>
  );
}
