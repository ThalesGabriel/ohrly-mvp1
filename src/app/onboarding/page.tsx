"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Mail,
} from "lucide-react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type StepId = "profile" | "policies" | "refine" | "access";

type OperationModel =
  | "online_only"
  | "hybrid_physical_online"
  | "online_whatsapp"
  | "online_marketplace"
  | "physical_social"
  | "starting_digital";

type MainQuestion =
  | "conversion"
  | "checkout_completion"
  | "products"
  | "repurchase"
  | "digital_potential"
  | "not_sure";

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

type ScenarioId =
  | "non_completed_orders"
  | "product_friction"
  | "post_purchase"
  | "digital_role"
  | "measurability"
  | "channel_mix";

type ChannelContext =
  | "online_store"
  | "whatsapp"
  | "marketplace"
  | "physical_store"
  | "specific_product"
  | "unknown";

type BehaviorPattern = "punctual" | "recurring" | "gradual" | "localized" | "unknown";

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
  | "channel_behavior_concentration"
  | "assisted_sale_visibility";

type Policy = {
  id: PolicyId;
  title: string;
  shortDescription: string;
  simulationLine: string;
  signals: string[];
  usefulFields: string[];
};

type ScoredPolicy = Policy & {
  score: number;
  fitReasons: string[];
};

const steps: Array<{ id: StepId; eyebrow: string; title: string }> = [
  { id: "profile", eyebrow: "01", title: "Contexto" },
  { id: "policies", eyebrow: "02", title: "Características" },
  { id: "refine", eyebrow: "03", title: "Simulação" },
  { id: "access", eyebrow: "04", title: "Checklist" },
];

const operationOptions: Array<Option<OperationModel>> = [
  { value: "online_only", label: "Só loja online", description: "A venda acontece principalmente no site." },
  { value: "hybrid_physical_online", label: "Loja física + online", description: "Existe operação presencial e canal digital ativo." },
  { value: "online_whatsapp", label: "Online + WhatsApp/Instagram", description: "Checkout e atendimento assistido convivem." },
  { value: "online_marketplace", label: "Online + marketplace", description: "A venda se distribui entre canal próprio e terceiros." },
  { value: "physical_social", label: "Loja física + redes sociais", description: "O digital apoia venda local ou assistida." },
  { value: "starting_digital", label: "Estou estruturando o digital", description: "Ainda existe pouca clareza sobre os dados." },
];

const questionOptions: Array<Option<MainQuestion>> = [
  { value: "conversion", label: "Visitas não viram pedidos" },
  { value: "checkout_completion", label: "Carrinhos ou pedidos não concluem" },
  { value: "products", label: "Produtos puxam ou travam o resultado" },
  { value: "repurchase", label: "Clientes compram uma vez e não voltam" },
  { value: "digital_potential", label: "O digital parece pequeno demais" },
  { value: "not_sure", label: "Ainda não sei exatamente" },
];

const dataOptions: Array<Option<DataKey>> = [
  { value: "spreadsheet", label: "Planilha própria" },
  { value: "orders", label: "Pedidos" },
  { value: "products", label: "Produtos" },
  { value: "customers", label: "Clientes" },
  { value: "carts", label: "Carrinhos" },
  { value: "visits", label: "Visitas" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "physical_sales", label: "Vendas físicas" },
  { value: "marketplace", label: "Marketplace" },
  { value: "not_sure", label: "Não sei" },
];

const scenarioOptions: Array<Option<ScenarioId>> = [
  { value: "non_completed_orders", label: "Intenção digital com baixa conclusão", description: "Pedidos ou carrinhos aparecem, mas parte não vira venda confirmada." },
  { value: "product_friction", label: "Produto com atrito de compra", description: "Alguns produtos geram interesse, mas exigem mais confiança ou atendimento." },
  { value: "post_purchase", label: "Baixa continuidade pós-compra", description: "A compra acontece, mas não vira recompra ou complementaridade." },
  { value: "digital_role", label: "Digital pequeno ou pouco claro", description: "O canal online talvez funcione como vitrine, apoio ou extensão local." },
  { value: "measurability", label: "Dificuldade de medir cliente e recompra", description: "A operação vende, mas parte da jornada fica invisível nos dados." },
  { value: "channel_mix", label: "Canais misturados", description: "Site, WhatsApp, marketplace e físico podem estar contando histórias diferentes." },
];

const channelOptions: Array<Option<ChannelContext>> = [
  { value: "online_store", label: "Loja online" },
  { value: "whatsapp", label: "WhatsApp/Instagram" },
  { value: "marketplace", label: "Marketplace" },
  { value: "physical_store", label: "Loja física" },
  { value: "specific_product", label: "Produto específico" },
  { value: "unknown", label: "Não sei" },
];

const patternOptions: Array<Option<BehaviorPattern>> = [
  { value: "punctual", label: "Parece pontual" },
  { value: "recurring", label: "Aparece com frequência" },
  { value: "gradual", label: "Vem piorando aos poucos" },
  { value: "localized", label: "Acontece em alguns canais/produtos" },
  { value: "unknown", label: "Não sei" },
];

const policies: Policy[] = [
  {
    id: "order_completion_quality",
    title: "Pedidos criados que não viram venda confirmada",
    shortDescription: "Entende se existe perda recorrente entre intenção de compra, checkout e confirmação.",
    simulationLine: "O Ohrly olharia para a distância entre pedido criado, pagamento e confirmação.",
    signals: ["pedido criado", "status do pedido", "pagamento aprovado", "pedido cancelado"],
    usefulFields: ["order_id", "created_at", "paid_at", "order_status", "payment_status", "order_value"],
  },
  {
    id: "high_friction_product_intent",
    title: "Produtos com interesse, mas baixa conclusão",
    shortDescription: "Ajuda a separar produto com demanda de produto que exige confiança, atendimento ou prova.",
    simulationLine: "O Ohrly olharia para produtos que aparecem na intenção, mas não aparecem na venda final.",
    signals: ["produto visitado", "produto no carrinho", "pedido não concluído", "categoria"],
    usefulFields: ["product_id", "product_name", "category", "cart_id", "order_id", "quantity", "price"],
  },
  {
    id: "post_purchase_continuity",
    title: "Clientes que compram uma vez e não voltam",
    shortDescription: "Mostra se a primeira compra está virando relacionamento, recompra ou complementaridade.",
    simulationLine: "O Ohrly olharia para continuidade pós-compra e compras complementares.",
    signals: ["primeira compra", "segunda compra", "intervalo de retorno", "produto complementar"],
    usefulFields: ["customer_id", "order_id", "paid_at", "product_id", "category", "order_value"],
  },
  {
    id: "digital_channel_underuse",
    title: "Canal digital pequeno em relação à operação",
    shortDescription: "Ajuda a entender se o digital vende, gera intenção, apoia WhatsApp ou estende a loja física.",
    simulationLine: "O Ohrly olharia para o papel do online dentro da operação total.",
    signals: ["receita por canal", "pedidos por canal", "venda assistida", "retirada local"],
    usefulFields: ["channel", "order_id", "paid_at", "order_value", "store_origin", "fulfillment_type"],
  },
  {
    id: "customer_measurability_gap",
    title: "Dados insuficientes para medir continuidade",
    shortDescription: "Identifica quando há venda, mas pouco rastro para medir recompra, LTV ou jornada real.",
    simulationLine: "O Ohrly olharia para vendas com cliente genérico, anônimo ou difícil de acompanhar.",
    signals: ["cliente genérico", "venda anônima", "concentração em poucos cadastros", "origem ausente"],
    usefulFields: ["customer_id", "customer_phone", "channel", "order_id", "seller_id", "created_at"],
  },
  {
    id: "cart_recovery_signal",
    title: "Carrinhos ou intenções que merecem recuperação",
    shortDescription: "Diferencia abandono recuperável de ruído, tentativa ruim ou intenção sem qualidade.",
    simulationLine: "O Ohrly olharia se os abandonos parecem oportunidade real ou apenas ruído.",
    signals: ["carrinho criado", "checkout iniciado", "abandono", "nova tentativa"],
    usefulFields: ["cart_id", "created_at", "checkout_started_at", "customer_id", "product_id", "cart_value"],
  },
  {
    id: "channel_behavior_concentration",
    title: "Dependência excessiva de um canal",
    shortDescription: "Mostra se o resultado está concentrado demais em loja física, marketplace, WhatsApp ou site.",
    simulationLine: "O Ohrly olharia para concentração de resultado e risco de leitura incompleta.",
    signals: ["receita por canal", "pedidos por canal", "clientes por canal", "mix por canal"],
    usefulFields: ["channel", "order_id", "customer_id", "order_value", "product_id", "paid_at"],
  },
  {
    id: "assisted_sale_visibility",
    title: "Venda assistida que não aparece no e-commerce",
    shortDescription: "Ajuda a perceber quando WhatsApp, Instagram ou balcão seguram uma intenção que nasceu no digital.",
    simulationLine: "O Ohrly olharia para a ponte entre intenção digital e venda assistida.",
    signals: ["origem da conversa", "produto citado", "atendimento", "pedido posterior"],
    usefulFields: ["conversation_id", "started_at", "channel", "customer_id", "product_reference", "order_id"],
  },
];

const policyScenarioMap: Record<PolicyId, ScenarioId> = {
  order_completion_quality: "non_completed_orders",
  high_friction_product_intent: "product_friction",
  post_purchase_continuity: "post_purchase",
  digital_channel_underuse: "digital_role",
  customer_measurability_gap: "measurability",
  cart_recovery_signal: "non_completed_orders",
  channel_behavior_concentration: "channel_mix",
  assisted_sale_visibility: "channel_mix",
};

function scorePolicies(
  operationModel: OperationModel | "",
  mainQuestion: MainQuestion | "",
  availableData: DataKey[],
): ScoredPolicy[] {
  return policies
    .map((policy) => {
      let score = 0;
      const fitReasons: string[] = [];
      const has = (key: DataKey) => availableData.includes(key);

      if (policy.id === "order_completion_quality") {
        if (mainQuestion === "checkout_completion") score += 38;
        if (mainQuestion === "conversion") score += 22;
        if (has("orders")) score += 18;
        if (has("carts")) score += 12;
        if (["online_only", "online_whatsapp", "online_marketplace"].includes(operationModel)) score += 10;
        if (score > 0) fitReasons.push("você indicou interesse em entender conclusão de intenção ou pedidos");
      }

      if (policy.id === "high_friction_product_intent") {
        if (mainQuestion === "products") score += 38;
        if (mainQuestion === "conversion") score += 14;
        if (has("products")) score += 18;
        if (has("visits") || has("carts")) score += 12;
        if (["online_whatsapp", "physical_social"].includes(operationModel)) score += 8;
        if (score > 0) fitReasons.push("produtos podem precisar ser lidos por interesse, atrito e conclusão");
      }

      if (policy.id === "post_purchase_continuity") {
        if (mainQuestion === "repurchase") score += 40;
        if (has("customers")) score += 20;
        if (has("orders")) score += 12;
        if (has("products")) score += 8;
        if (["hybrid_physical_online", "physical_social"].includes(operationModel)) score += 8;
        if (score > 0) fitReasons.push("há sinais de que recompra ou complementaridade podem importar");
      }

      if (policy.id === "digital_channel_underuse") {
        if (mainQuestion === "digital_potential") score += 40;
        if (["hybrid_physical_online", "physical_social", "starting_digital"].includes(operationModel)) score += 24;
        if (has("physical_sales")) score += 14;
        if (has("orders")) score += 8;
        if (score > 0) fitReasons.push("sua operação pode precisar separar venda direta, vitrine e venda assistida");
      }

      if (policy.id === "customer_measurability_gap") {
        if (mainQuestion === "repurchase") score += 18;
        if (["hybrid_physical_online", "physical_social", "starting_digital"].includes(operationModel)) score += 20;
        if (has("physical_sales")) score += 16;
        if (has("customers")) score += 8;
        if (has("not_sure")) score += 16;
        if (score > 0) fitReasons.push("a continuidade pode depender de identificar melhor o cliente entre canais");
      }

      if (policy.id === "cart_recovery_signal") {
        if (mainQuestion === "checkout_completion") score += 25;
        if (mainQuestion === "conversion") score += 22;
        if (has("carts")) score += 25;
        if (has("visits")) score += 10;
        if (score > 0) fitReasons.push("carrinhos e intenções podem merecer leitura antes de recuperação automática");
      }

      if (policy.id === "channel_behavior_concentration") {
        if (["hybrid_physical_online", "online_marketplace", "online_whatsapp", "physical_social"].includes(operationModel)) score += 24;
        if (has("marketplace") || has("whatsapp") || has("physical_sales")) score += 20;
        if (mainQuestion === "digital_potential") score += 12;
        if (score > 0) fitReasons.push("os canais podem estar contando partes diferentes da mesma jornada");
      }

      if (policy.id === "assisted_sale_visibility") {
        if (["online_whatsapp", "physical_social"].includes(operationModel)) score += 28;
        if (has("whatsapp")) score += 24;
        if (mainQuestion === "products" || mainQuestion === "conversion") score += 10;
        if (score > 0) fitReasons.push("a venda pode estar acontecendo fora do checkout tradicional");
      }

      if (mainQuestion === "not_sure") score += 6;
      if (has("not_sure")) score += 4;

      return { ...policy, score, fitReasons };
    })
    .filter((policy) => policy.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

export default function OhrlyEcommerceOnboardingStepper() {
  const [currentStep, setCurrentStep] = useState<StepId>("profile");
  const [operationModel, setOperationModel] = useState<OperationModel | "">("");
  const [mainQuestion, setMainQuestion] = useState<MainQuestion | "">("");
  const [availableData, setAvailableData] = useState<DataKey[]>([]);
  const [scenario, setScenario] = useState<ScenarioId | "">("");
  const [channelContext, setChannelContext] = useState<ChannelContext | "">("");
  const [behaviorPattern, setBehaviorPattern] = useState<BehaviorPattern | "">("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [wantsEarlyAccess, setWantsEarlyAccess] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);
  const topPolicies = useMemo(
    () => scorePolicies(operationModel, mainQuestion, availableData),
    [operationModel, mainQuestion, availableData],
  );

  const selectedScenario: ScenarioId = scenario || (topPolicies[0] ? policyScenarioMap[topPolicies[0].id] : "non_completed_orders");
  const simulationPolicies = topPolicies.length > 0 ? topPolicies : policies.slice(0, 5).map((policy) => ({ ...policy, score: 0, fitReasons: [] }));

  const canContinue =
    currentStep === "profile"
      ? Boolean(operationModel && mainQuestion && availableData.length)
      : currentStep === "policies"
        ? topPolicies.length > 0
        : currentStep === "refine"
          ? Boolean((scenario || selectedScenario) && channelContext && behaviorPattern)
          : email.trim().length >= 5 && email.includes("@");

  function toggleData(key: DataKey) {
    setAvailableData((current) => {
      if (key === "not_sure") return current.includes("not_sure") ? [] : ["not_sure"];
      const withoutNotSure = current.filter((item) => item !== "not_sure");
      return withoutNotSure.includes(key)
        ? withoutNotSure.filter((item) => item !== key)
        : [...withoutNotSure, key];
    });
  }

  function goNext() {
    if (!canContinue) return;

    if (currentStep === "profile") setCurrentStep("policies");
    if (currentStep === "policies") {
      if (!scenario && topPolicies[0]) setScenario(policyScenarioMap[topPolicies[0].id]);
      setCurrentStep("refine");
    }
    if (currentStep === "refine") setCurrentStep("access");
  }

  function goBack() {
    if (currentStep === "policies") setCurrentStep("profile");
    if (currentStep === "refine") setCurrentStep("policies");
    if (currentStep === "access") setCurrentStep("refine");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canContinue) return;

    setSubmitting(true);
    setSubmitError(null);

    const payload = {
      source: "ohrly_ecommerce_checklist_lead_stepper",
      operationModel,
      mainQuestion,
      availableData,
      matchedPolicies: topPolicies.map(({ id, title, score, fitReasons }) => ({
        id,
        title,
        score,
        fitReasons,
      })),
      refinement: {
        scenario: scenario || selectedScenario,
        channelContext,
        behaviorPattern,
      },
      checklistRequest: {
        name,
        email,
        leadMagnet: "checklist_desempenho_invisivel_ecommerce",
        intent: "receive_free_checklist",
        wantsEarlyAccess,
        suggestedFocus: simulationPolicies
          .slice(0, 5)
          .map(({ id, title }) => ({ id, title })),
      },
      tracking: {
        landingPath:
          typeof window !== "undefined" ? window.location.pathname : null,
        referrer:
          typeof document !== "undefined" ? document.referrer || null : null,
        utmSource:
          typeof window !== "undefined"
            ? new URLSearchParams(window.location.search).get("utm_source")
            : null,
        utmMedium:
          typeof window !== "undefined"
            ? new URLSearchParams(window.location.search).get("utm_medium")
            : null,
        utmCampaign:
          typeof window !== "undefined"
            ? new URLSearchParams(window.location.search).get("utm_campaign")
            : null,
        utmContent:
          typeof window !== "undefined"
            ? new URLSearchParams(window.location.search).get("utm_content")
            : null,
        utmTerm:
          typeof window !== "undefined"
            ? new URLSearchParams(window.location.search).get("utm_term")
            : null,
      },
    };

    try {
      const response = await fetch("/api/ecommerce-onboarding/checklist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message || "Não foi possível solicitar o checklist agora."
        );
      }

      setSubmitted(true);
    } catch (error) {
      console.error("Ohrly ecommerce checklist request failed", error);

      setSubmitError(
        error instanceof Error
          ? error.message
          : "Não foi possível solicitar o checklist agora."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fbf9ff] text-slate-950">

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="">
          <div>
            <h1 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.04em] text-slate-950">
              Como anda o desempenho do seu e-commerce
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Responda algumas perguntas rápidas para entender quais sinais de desempenho fazem mais sentido para o seu e-commerce.
            </p>
          </div>
        </section>

        <section className="relative rounded-[2rem] border border-violet-100 bg-white shadow-sm shadow-violet-100/70">
          <div className="rounded-t-[2rem] border-b border-violet-100 px-4 py-4 sm:px-6">
            <Stepper currentStep={currentStep} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="relative p-4 sm:p-6 lg:p-8">
              {currentStep === "profile" && (
                <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                  <StepIntro
                    eyebrow="Primeiro contexto"
                    title="Vamos entender que tipo de e-commerce está chegando."
                    description="Algumas informações iniciais para classificarmos sua operação e como podemos gerar valor para você e seu negócio."
                  />

                  <div className="relative z-20 space-y-6">
                    <SelectField
                      label="Como sua loja vende hoje?"
                      placeholder="Selecione o modelo da loja"
                      value={operationModel}
                      options={operationOptions}
                      onChange={(value) => setOperationModel(value as OperationModel)}
                    />

                    <SelectField
                      label="O que parece mais importante entender agora?"
                      placeholder="Selecione a principal dúvida"
                      value={mainQuestion}
                      options={questionOptions}
                      onChange={(value) => setMainQuestion(value as MainQuestion)}
                    />

                    <MultiSelectDropdown
                      label="O que você usa para acompanhar o desempenho da sua loja?"
                      placeholder="Selecione os dados disponíveis"
                      values={availableData}
                      options={dataOptions}
                      onToggle={toggleData}
                    />
                  </div>
                </div>
              )}

              {currentStep === "policies" && (
                <div >
                  <StepIntro
                    eyebrow="Características"
                    full
                    title="Estas características fazem parte do desempenho do seu e-commerce."
                    description="Observamos elas para estimar o desempenho do seu negócio para potencializar seus resultados."
                  />

                  <div className="space-y-3 mt-5 grid sm:grid-cols-3 gap-5">
                    {topPolicies.map((policy, index) => (
                      <PolicyCard key={policy.id} policy={policy} index={index} />
                    ))}
                  </div>
                </div>
              )}

              {currentStep === "refine" && (
                <div className="">
                  <div className="space-y-7">
                    <StepIntro
                      eyebrow="Refinar contexto"
                      title="O que é mais importante para você entender sobre seu negócio?"
                      full
                      description="Queremos entender um pouco mais o seu objetivo e o que te traz até aqui."
                    />

                    <div className="relative z-20 space-y-5">
                      <SelectField
                        label="Alguma dessas situações acontece com você?"
                        placeholder="Selecione o cenário"
                        value={scenario || selectedScenario}
                        options={scenarioOptions}
                        onChange={(value) => setScenario(value as ScenarioId)}
                      />

                      <SelectField
                        label="Onde isso parece acontecer mais?"
                        placeholder="Selecione o ponto da jornada"
                        value={channelContext}
                        options={channelOptions}
                        onChange={(value) => setChannelContext(value as ChannelContext)}
                      />

                      <SelectField
                        label="Esse comportamento parece ser mais…"
                        placeholder="Selecione o padrão percebido"
                        value={behaviorPattern}
                        options={patternOptions}
                        onChange={(value) => setBehaviorPattern(value as BehaviorPattern)}
                      />
                    </div>
                  </div>

                </div>
              )}

              {currentStep === "access" && (
                <div className="">
                  <StepIntro
                    eyebrow="Checklist gratuito"
                    full
                    title="Receba um checklist baseado no seu contexto."
                    description="Em vez de pedir planilha ou marcar uma conversa agora, vamos te enviar um material de entrada para avaliar onde seu e-commerce pode estar perdendo desempenho sem parecer quebrado."
                  />

                  <div className="space-y-5 mt-5">
                    {submitted ? (
                      <div className="rounded-3xl border border-violet-100 bg-violet-50 p-6">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-700 text-white">
                          <Check className="h-5 w-5" />
                        </div>
                        <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">Checklist solicitado.</h2>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          Vamos enviar o checklist gratuito no e-mail informado. Ele não é um diagnóstico da sua loja, mas ajuda a organizar os sinais que uma operação parecida deveria observar.
                        </p>
                        {wantsEarlyAccess && (
                          <p className="mt-3 rounded-2xl border border-violet-100 bg-white p-3 text-sm leading-6 text-slate-600">
                            Também registramos seu interesse na versão inicial do Ohrly. Se houver aderência ao seu perfil de operação, enviamos um convite de acesso.
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="rounded-3xl border border-violet-100 bg-[#fbf9ff] p-5">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-700 text-white">
                            <Mail className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-950">Checklist de desempenho invisível para e-commerce</p>
                            <p className="mt-1 text-sm leading-6 text-slate-600">
                              Um material curto para revisar conclusão de pedidos, produtos com atrito, papel do digital, continuidade de clientes e qualidade dos dados disponíveis.
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 rounded-2xl border border-violet-100 bg-white p-4">
                          <p className="text-sm font-semibold text-slate-950">Seu checklist deve priorizar:</p>
                          <div className="mt-3 space-y-2">
                            {simulationPolicies.slice(0, 4).map((policy) => (
                              <div key={policy.id} className="flex gap-3 text-sm leading-5 text-slate-600">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-600" />
                                <span>{policy.title}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                          <label className="block">
                            <span className="text-xs font-semibold text-slate-500">Nome <span className="font-normal">opcional</span></span>
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

                        <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-violet-100 bg-white p-4 transition hover:border-violet-200">
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
                    {currentStep === "profile" && "Ver características relevantes"}
                    {currentStep === "policies" && "Aproximar leitura"}
                    {currentStep === "refine" && "Receber checklist"}
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

      <div className="mt-4 grid grid-cols-4 gap-2">
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

function StepIntro({ eyebrow, title, description, full }: { eyebrow: string; title: string; description: string, full?: boolean }) {
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

function PolicyCard({ policy, index }: { policy: ScoredPolicy; index: number }) {
  return (
    <article className="rounded-3xl border border-violet-100 bg-white p-5 transition hover:border-violet-200 hover:bg-[#fbf9ff]">
      <div className="flex items-start gap-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-sm font-bold text-violet-700">{index + 1}</div>
        <div>
          <h3 className="text-base font-semibold leading-snug text-slate-950">{policy.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{policy.shortDescription}</p>
        </div>
      </div>
    </article>
  );
}
