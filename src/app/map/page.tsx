"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowRight,
  BarChart3,
  CircleDollarSign,
  Compass,
  Map,
  MousePointerClick,
  Route,
  Settings2,
  SlidersHorizontal,
  Store,
  Target,
  Users,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AppShell } from "@/components/AppShell";

type TabKey = "market" | "position" | "target";

type StoreMetric = {
  id: string;
  title: string;
  storeValue: string;
  reading: string;
};

type PositioningGoal = {
  id: string;
  title: string;
  description: string;
  priorities: string[];
  metricsToWatch: string[];
  diagnosticsToPrioritize: string[];
  icon: LucideIcon;
};

const storeMetrics: StoreMetric[] = [
  {
    id: "revenue-analyzed",
    title: "Receita analisada",
    storeValue: "R$ 704.273,28",
    reading:
      "O volume analisado já permite enxergar padrões comerciais úteis, especialmente por canal, identificação e mix.",
  },
  {
    id: "physical-share",
    title: "Receita no ponto de venda",
    storeValue: "94,26%",
    reading:
      "A força física é clara. O risco não é vender no físico; é não transformar essa força em relacionamento, dados e continuidade.",
  },
  {
    id: "digital-share",
    title: "Participação digital",
    storeValue: "5,17%",
    reading:
      "O digital ainda é pequeno. A oportunidade pode ser começar com categorias ponte, recompra e compra assistida.",
  },
  {
    id: "customer-memory",
    title: "Receita reconhecida",
    storeValue: "38,45%",
    reading:
      "A loja perde memória de cliente em parte relevante da operação, o que trava recompra, campanhas e segmentação.",
  },
];

const positioningGoals: PositioningGoal[] = [
  {
    id: "physical-first-digital-support",
    title: "Físico forte com digital de apoio",
    description:
      "A loja continua usando o ponto de venda como motor principal, mas o digital passa a apoiar vitrine, consulta, WhatsApp, recompra e continuidade.",
    priorities: [
      "Melhorar identificação no balcão",
      "Mapear categorias que geram intenção digital",
      "Medir WhatsApp como ponte entre digital e físico",
    ],
    metricsToWatch: [
      "Receita identificada",
      "Participação digital assistida",
      "Categorias mais acessadas",
      "Recompra de clientes identificados",
    ],
    diagnosticsToPrioritize: [
      "Canal dominante sem memória de cliente",
      "Categorias físicas como vitrine digital",
      "Continuidade/recompra",
    ],
    icon: Store,
  },
  {
    id: "digital-as-growth-channel",
    title: "Digital como canal relevante",
    description:
      "A loja quer aumentar participação do online na receita, sem depender apenas de tráfego pago ou visitas sem compra.",
    priorities: [
      "Aumentar conversão digital",
      "Escolher categorias ponte",
      "Reduzir abandono e intenção sem compra",
    ],
    metricsToWatch: [
      "Conversão digital",
      "Participação digital",
      "Abandono de carrinho",
      "Ticket digital",
    ],
    diagnosticsToPrioritize: [
      "Conversão digital",
      "Papel do digital",
      "Intenção digital sem compra",
    ],
    icon: MousePointerClick,
  },
  {
    id: "repurchase-and-relationship",
    title: "Recompra e relacionamento",
    description:
      "A loja quer crescer chamando clientes de volta, usando histórico, WhatsApp, segmentação e pós-venda.",
    priorities: [
      "Reduzir receita sem comprador confiável",
      "Criar rotina de pós-venda",
      "Separar clientes por recorrência e categoria",
    ],
    metricsToWatch: [
      "Receita reconhecida",
      "Clientes recorrentes",
      "Frequência de compra",
      "Receita por cliente identificado",
    ],
    diagnosticsToPrioritize: [
      "Mensurabilidade",
      "Continuidade/recompra",
      "Engajamento pós-lead",
    ],
    icon: Users,
  },
  {
    id: "top-segment-benchmark",
    title: "Aproximar-se das lojas líderes",
    description:
      "A loja quer se comparar com operações mais maduras do segmento e priorizar lacunas que a afastam desse patamar.",
    priorities: [
      "Comparar participação digital",
      "Melhorar qualidade dos dados",
      "Aumentar previsibilidade de recompra",
    ],
    metricsToWatch: [
      "Faturamento mensal",
      "Ticket médio",
      "Conversão digital",
      "Receita identificada",
    ],
    diagnosticsToPrioritize: [
      "Distância para benchmark",
      "Métricas abaixo do segmento",
      "Janelas que travam escala",
    ],
    icon: Target,
  },
];

export default function GrowthMapPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("market");
  const [selectedGoalId, setSelectedGoalId] = useState(
    "physical-first-digital-support"
  );

  const selectedGoal =
    positioningGoals.find((goal) => goal.id === selectedGoalId) ??
    positioningGoals[0];

  const highlightedStoreMetric = useMemo(() => {
    if (selectedGoal.id === "digital-as-growth-channel") {
      return storeMetrics.find((metric) => metric.id === "digital-share");
    }

    if (selectedGoal.id === "repurchase-and-relationship") {
      return storeMetrics.find((metric) => metric.id === "customer-memory");
    }

    if (selectedGoal.id === "top-segment-benchmark") {
      return storeMetrics.find((metric) => metric.id === "revenue-analyzed");
    }

    return storeMetrics.find((metric) => metric.id === "physical-share");
  }, [selectedGoal.id]);

  return (
    <AppShell>
      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-wide text-violet-700">
              Mapa de crescimento
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
              Direção da operação
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              O Ohrly usa o mercado, a posição atual e a meta da loja para
              priorizar leituras, oportunidades de teste e sinais de evolução.
            </p>
          </div>

          <GrowthMapSummary />
        </div>
      </section>

      <Tabs activeTab={activeTab} onChange={setActiveTab} />

      <div className="mt-6">
        {activeTab === "market" && (
          <MarketTab
            onGoToPosition={() => setActiveTab("position")}
            onGoToTarget={() => setActiveTab("target")}
          />
        )}

        {activeTab === "position" && (
          <StorePositionTab
            highlightedMetric={highlightedStoreMetric}
            onGoToTarget={() => setActiveTab("target")}
          />
        )}

        {activeTab === "target" && (
          <TargetPositionTab
            selectedGoal={selectedGoal}
            selectedGoalId={selectedGoalId}
            onGoalChange={setSelectedGoalId}
          />
        )}
      </div>
    </AppShell>
  );
}

function GrowthMapSummary() {
  return (
    <div className="grid min-w-full grid-cols-1 gap-3 sm:grid-cols-3 xl:min-w-[560px]">
      <MiniSummaryCard
        icon={Map}
        label="Mercado"
        value="Autopeças"
        description="segmento fragmentado"
        tone="violet"
      />

      <MiniSummaryCard
        icon={CircleDollarSign}
        label="Receita"
        value="R$ 704k"
        description="base analisada"
        tone="emerald"
      />

      <MiniSummaryCard
        icon={Compass}
        label="Posição"
        value="Físico forte"
        description="digital pequeno"
        tone="orange"
      />
    </div>
  );
}

function MiniSummaryCard({
  icon: Icon,
  label,
  value,
  description,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  description: string;
  tone: "violet" | "emerald" | "orange";
}) {
  const tones = {
    violet: "bg-violet-50 text-violet-700 ring-violet-100",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    orange: "bg-orange-50 text-orange-700 ring-orange-100",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
      <div className="flex items-center gap-2">
        <div className={`rounded-xl p-2 ring-1 ${tones[tone]}`}>
          <Icon className="h-4 w-4" />
        </div>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p className="text-sm font-bold text-slate-950">{value}</p>
        </div>
      </div>

      <p className="mt-2 text-xs leading-5 text-slate-500">{description}</p>
    </div>
  );
}

function Tabs({
  activeTab,
  onChange,
}: {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
}) {
  const tabs: Array<{ key: TabKey; label: string; icon: LucideIcon }> = [
    { key: "market", label: "Contexto do mercado", icon: Map },
    { key: "position", label: "Posição atual", icon: Route },
    { key: "target", label: "Meta da loja", icon: SlidersHorizontal },
  ];

  return (
    <div className="mt-8 border-b border-slate-200">
      <nav className="flex gap-8 overflow-x-auto">
        {tabs.map((tab) => {
          const active = activeTab === tab.key;
          const Icon = tab.icon;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={[
                "flex items-center gap-2 whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-bold transition",
                active
                  ? "border-violet-700 text-violet-700"
                  : "border-transparent text-slate-500 hover:text-slate-900",
              ].join(" ")}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function MarketTab({
  onGoToPosition,
  onGoToTarget,
}: {
  onGoToPosition: () => void;
  onGoToTarget: () => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_360px]">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wide text-violet-700">
          Contexto do mercado
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
          Autopeças e motopeças não são um e-commerce comum
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          A compra costuma misturar urgência, confiança técnica,
          compatibilidade do produto, atendimento e recorrência. Por isso, o
          digital pode funcionar menos como substituto da loja física e mais
          como uma ponte para consulta, reserva, recompra e continuidade.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <MarketPrincipleCard
            icon={Wrench}
            title="Compra técnica"
            description="O cliente precisa confiar que o item serve, resolve e pode ser orientado ou trocado."
          />

          <MarketPrincipleCard
            icon={Store}
            title="Físico ainda pesa"
            description="A loja física pode continuar sendo o centro, enquanto o digital apoia jornada e recompra."
          />

          <MarketPrincipleCard
            icon={Users}
            title="Memória gera retorno"
            description="Sem identificar quem comprou, a loja perde capacidade de chamar de volta e medir continuidade."
          />
        </div>

        <div className="mt-6 rounded-2xl border border-violet-100 bg-violet-50 p-5">
          <p className="text-sm font-bold text-violet-950">Leitura Ohrly</p>

          <p className="mt-2 text-sm leading-6 text-violet-900">
            O mercado sugere que a primeira oportunidade não é transformar a
            loja em um e-commerce puro, mas encontrar pontes entre força física,
            cliente identificado e compra digital assistida.
          </p>
        </div>
      </section>

      <div>
        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-slate-400">
            Próximo passo
          </p>

          <h3 className="mt-2 text-xl font-bold text-slate-950">
            Agora precisamos ver se a loja confirma essa leitura.
          </h3>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            O contexto do mercado só orienta a análise. O próximo passo é olhar a
            posição real da loja e entender onde ela já tem força, onde perde
            memória e onde existe uma janela de teste.
          </p>

          <div className="mt-5 space-y-3">
            <button
              type="button"
              onClick={onGoToPosition}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-violet-800"
            >
              Ver posição atual da loja
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={onGoToTarget}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Definir meta da loja
              <Target className="h-4 w-4" />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function MarketPrincipleCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
        <Icon className="h-5 w-5" />
      </div>

      <h3 className="mt-4 text-base font-bold text-slate-950">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </article>
  );
}

function StorePositionTab({
  highlightedMetric,
  onGoToTarget,
}: {
  highlightedMetric?: StoreMetric;
  onGoToTarget: () => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_380px]">
      <div>
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-violet-700">
            Posição atual
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
            Físico forte, digital pequeno e memória de cliente limitada
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            A loja já tem força comercial no ponto de venda. O desafio não parece
            ser simplesmente vender mais online, mas transformar parte dessa força
            física em relacionamento, dados e compras digitais assistidas.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <PositionInsightCard
              tone="emerald"
              label="Força atual"
              value="Ponto de venda"
              description="A maior parte da receita vem do físico. Isso é uma base, não um problema."
            />

            <PositionInsightCard
              tone="rose"
              label="Gargalo atual"
              value="Memória de cliente"
              description="Parte da operação ainda não identifica bem quem compra."
            />

            <PositionInsightCard
              tone="violet"
              label="Janela aberta"
              value="Ponte físico-digital"
              description="Clientes físicos podem ser ativados para compras online simples e assistidas."
            />
          </div>

          <div className="mt-6 rounded-2xl border border-violet-100 bg-violet-50 p-5">
            <p className="text-sm font-bold text-violet-950">Leitura Ohrly</p>

            <p className="mt-2 text-sm leading-6 text-violet-900">
              A prioridade inicial não é tratar o digital como um e-commerce
              isolado. A melhor oportunidade é usar a confiança já criada no
              físico para testar compras online de baixo atrito.
            </p>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <a
                href="/leituras/migracao-fisico-online"
                className="flex items-center justify-center gap-2 rounded-2xl bg-violet-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-violet-800"
              >
                Ver leitura sugerida
                <ArrowRight className="h-4 w-4" />
              </a>

              <button
                type="button"
                onClick={onGoToTarget}
                className="flex items-center justify-center gap-2 rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm font-bold text-violet-700 transition hover:bg-violet-50"
              >
                Ajustar meta da loja
                <SlidersHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      </div>

      <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wide text-slate-400">
          Prioridades do diagnóstico
        </p>

        <div className="mt-5 space-y-4">
          <PriorityStep
            number="1"
            title="Separar cliente real de venda genérica"
            description="Sem isso, recompra e segmentação ficam frágeis."
          />

          <PriorityStep
            number="2"
            title="Encontrar clientes físicos parecidos com online"
            description="Esse grupo pode abrir o primeiro experimento."
          />

          <PriorityStep
            number="3"
            title="Escolher produtos de baixo atrito"
            description="Complementos e giro tendem a funcionar melhor na primeira migração."
          />
        </div>

        {highlightedMetric && (
          <div className="mt-6 rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Métrica sensível
            </p>

            <p className="mt-2 text-base font-bold text-slate-950">
              {highlightedMetric.title}
            </p>

            <p className="mt-1 text-sm font-bold text-violet-700">
              {highlightedMetric.storeValue}
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {highlightedMetric.reading}
            </p>
          </div>
        )}

        <a
          href="/clientes-candidatos"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
        >
          Ver clientes associados
          <Users className="h-4 w-4" />
        </a>
      </aside>
    </div>
  );
}

function PositionInsightCard({
  label,
  value,
  description,
  tone,
}: {
  label: string;
  value: string;
  description: string;
  tone: "emerald" | "rose" | "violet";
}) {
  const tones = {
    emerald: "border-emerald-100 bg-emerald-50 text-emerald-700",
    rose: "border-rose-100 bg-rose-50 text-rose-700",
    violet: "border-violet-100 bg-violet-50 text-violet-700",
  };

  return (
    <article className={`rounded-2xl border p-4 ${tones[tone]}`}>
      <p className="text-xs font-bold uppercase tracking-wide opacity-80">
        {label}
      </p>

      <p className="mt-2 text-lg font-bold">{value}</p>

      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </article>
  );
}

function PriorityStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700">
        {number}
      </div>

      <div>
        <p className="text-sm font-bold text-slate-950">{title}</p>
        <p className="mt-1 text-sm leading-5 text-slate-600">{description}</p>
      </div>
    </div>
  );
}

function TargetPositionTab({
  selectedGoal,
  selectedGoalId,
  onGoalChange,
}: {
  selectedGoal: PositioningGoal;
  selectedGoalId: string;
  onGoalChange: (goalId: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[420px_1fr]">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wide text-violet-700">
          Meta da loja
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
          O que o Ohrly deve priorizar nas próximas leituras?
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          A meta não é uma previsão. Ela funciona como uma calibração: ajuda o
          Ohrly a decidir quais janelas, métricas e experimentos devem ganhar
          mais peso neste momento da operação.
        </p>

        <div className="mt-6 space-y-3">
          {positioningGoals.map((goal) => (
            <GoalOptionCard
              key={goal.id}
              goal={goal}
              active={goal.id === selectedGoalId}
              onClick={() => onGoalChange(goal.id)}
            />
          ))}
        </div>
      </section>

      <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <SelectedGoalPanel goal={selectedGoal} />
      </aside>
    </div>
  );
}

function GoalOptionCard({
  goal,
  active,
  onClick,
}: {
  goal: PositioningGoal;
  active: boolean;
  onClick: () => void;
}) {
  const Icon = goal.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full rounded-2xl border p-4 text-left transition",
        active
          ? "border-violet-300 bg-violet-50 ring-4 ring-violet-100"
          : "border-slate-200 bg-white hover:border-violet-200 hover:bg-violet-50/40",
      ].join(" ")}
    >
      <div className="flex gap-3">
        <div
          className={[
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            active ? "bg-violet-700 text-white" : "bg-slate-100 text-slate-600",
          ].join(" ")}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <h3 className="text-sm font-bold leading-5 text-slate-950">
            {goal.title}
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {goal.description}
          </p>
        </div>
      </div>
    </button>
  );
}

function SelectedGoalPanel({ goal }: { goal: PositioningGoal }) {
  const Icon = goal.icon;

  return (
    <div>
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
          <Icon className="h-6 w-6" />
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-violet-700">
            Calibração ativa
          </p>

          <h2 className="mt-2 text-xl font-bold text-slate-950">
            {goal.title}
          </h2>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600">
        {goal.description}
      </p>

      <div className="mt-6 rounded-2xl border border-violet-100 bg-violet-50 p-5">
        <p className="text-sm font-bold text-violet-950">
          O que muda nas próximas leituras?
        </p>

        <p className="mt-2 text-sm leading-6 text-violet-900">
          O Ohrly passa a dar mais peso para oportunidades, clientes, produtos e
          sinais que aproximem a operação dessa direção.
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <GoalSection title="Prioridades">
          {goal.priorities.map((item) => (
            <GoalListItem key={item} icon={Target} text={item} />
          ))}
        </GoalSection>

        <GoalSection title="Métricas que ganham peso">
          {goal.metricsToWatch.map((item) => (
            <GoalListItem key={item} icon={BarChart3} text={item} />
          ))}
        </GoalSection>

        <GoalSection title="Leituras priorizadas">
          {goal.diagnosticsToPrioritize.map((item) => (
            <GoalListItem key={item} icon={Route} text={item} />
          ))}
        </GoalSection>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <a
          href="/leituras"
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-violet-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-violet-800"
        >
          Aplicar meta e ver leituras
          <ArrowRight className="h-4 w-4" />
        </a>

        <button className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
          Salvar calibração
          <Settings2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function GoalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {title}
      </p>

      <div className="mt-3 space-y-2">{children}</div>
    </div>
  );
}

function GoalListItem({
  icon: Icon,
  text,
}: {
  icon: LucideIcon;
  text: string;
}) {
  return (
    <div className="flex gap-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-violet-700" />
      <p className="text-sm leading-5 text-slate-700">{text}</p>
    </div>
  );
}