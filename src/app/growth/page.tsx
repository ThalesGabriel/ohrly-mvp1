"use client";

import { AppShell } from "@/components/AppShell";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Eye,
  Flag,
  LineChart,
  MessageSquare,
  MoreHorizontal,
  Route,
  ShieldCheck,
  Store,
  Target,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type AlignmentStatus =
  | "aligned"
  | "partially_aligned"
  | "needs_decision"
  | "unclear";

type StrategicEvidence = {
  id: string;
  title: string;
  value: string;
  description: string;
  interpretation: string;
  icon: LucideIcon;
  tone: "critical" | "attention" | "healthy" | "neutral";
};

type StrategicPriority = {
  id: string;
  title: string;
  description: string;
  reason: string;
  recommendedAction: string;
  effort: "baixo" | "médio" | "alto";
  impact: "baixo" | "médio" | "alto";
};

const strategicGoal = {
  title: "Expandir o digital usando a força do físico",
  description:
    "A loja quer transformar o ponto de venda em motor de confiança e usar o digital como canal de continuidade, recompra e conveniência.",
  hypothesis:
    "Antes de tentar vender tudo online, a operação precisa reconhecer melhor quem compra no balcão e criar uma ponte entre físico, WhatsApp e loja virtual.",
};

const strategicReading = {
  status: "partially_aligned" as AlignmentStatus,
  title: "A operação vende bem no físico, mas ainda perde memória de cliente",
  summary:
    "O ponto de venda sustenta a maior parte da receita. Isso é uma força, não um problema. O gargalo é que justamente esse canal concentra uma parcela alta de receita sem comprador confiável.",
  implication:
    "Sem memória de cliente, a expansão digital tende a depender mais de tráfego novo do que de relacionamento, recompra e campanhas segmentadas.",
};

const evidences: StrategicEvidence[] = [
  {
    id: "channel-concentration",
    title: "O físico ainda é o motor da operação",
    value: "94,26%",
    description: "da receita vem do Ponto de venda",
    interpretation:
      "A loja tem uma base forte no presencial. A estratégia digital deve aproveitar essa força, não ignorá-la.",
    icon: Store,
    tone: "attention",
  },
  {
    id: "channel-memory-loss",
    title: "O canal mais importante perde memória de cliente",
    value: "65,24%",
    description: "da receita do Ponto de venda está sem comprador confiável",
    interpretation:
      "A loja vende, mas nem sempre preserva dados suficientes para recompra, segmentação ou continuidade.",
    icon: User,
    tone: "critical",
  },
  {
    id: "general-measurability",
    title: "A mensurabilidade geral limita decisões futuras",
    value: "61,55%",
    description: "da receita total está sem comprador confiável",
    interpretation:
      "Campanhas, LTV, recompra e análise de clientes ficam limitadas quando a receita não tem vínculo confiável com comprador.",
    icon: Eye,
    tone: "critical",
  },
  {
    id: "discount-pressure",
    title: "Desconto não parece ser o problema central",
    value: "8,02%",
    description: "da receita aparece como desconto",
    interpretation:
      "A pressão de desconto está abaixo do limite crítico inicial. A prioridade não parece ser margem, mas memória operacional.",
    icon: ShieldCheck,
    tone: "healthy",
  },
];

const priorities: StrategicPriority[] = [
  {
    id: "capture-identity",
    title: "Criar identificação confiável no balcão",
    description:
      "Registrar telefone, CPF/CNPJ ou outro identificador confiável em vendas presenciais relevantes.",
    reason:
      "Essa é a base para transformar venda física em relacionamento, recompra e campanhas futuras.",
    recommendedAction:
      "Durante 7 dias, pedidos acima de R$ 100 no balcão devem ter telefone ou CPF preenchido.",
    effort: "baixo",
    impact: "alto",
  },
  {
    id: "digital-categories",
    title: "Escolher categorias ponte para o digital",
    description:
      "Não tentar levar todo o catálogo para o digital com a mesma prioridade.",
    reason:
      "Alguns produtos dependem de prova, confiança ou orientação presencial. Outros podem funcionar melhor como recompra ou complemento.",
    recommendedAction:
      "Separar produtos de baixo atrito, recompra ou complemento para testar como vitrine digital.",
    effort: "médio",
    impact: "alto",
  },
  {
    id: "whatsapp-continuity",
    title: "Usar WhatsApp como continuidade, não só atendimento",
    description:
      "Transformar contatos e vendas assistidas em relacionamento mensurável.",
    reason:
      "Se o digital ainda é pequeno, o WhatsApp pode ser a ponte mais natural entre balcão, recompra e loja virtual.",
    recommendedAction:
      "Criar uma rotina simples de pós-venda para clientes identificados no balcão.",
    effort: "médio",
    impact: "médio",
  },
];

const history = [
  {
    date: "2026-06-07",
    title: "Primeira leitura validada",
    description:
      "Foi confirmada a leitura de que o canal dominante também concentra perda de memória de cliente.",
  },
  {
    date: "2026-06-14",
    title: "Prioridade estratégica definida",
    description:
      "O foco recomendado passou a ser identificação no balcão antes de ampliar investimento em digital.",
  },
  {
    date: "Próxima leitura",
    title: "Reavaliar aderência ao objetivo",
    description:
      "A próxima leitura deve verificar se a operação está mais preparada para recompra e continuidade.",
  },
];

export default function StrategicOperationPage() {
  const alignment = alignmentConfig(strategicReading.status);

  return (
    <AppShell>

      <section className="mt-8">
        <p className="text-sm font-bold uppercase tracking-wide text-violet-700">
          Direção da operação
        </p>

        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              Sua operação está caminhando na direção certa?
            </h1>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              O Ohrly entende a operação e transforma em leitura estratégica:
              O que a operação está sustentando, o que está travando o plano e
              qual decisão faz mais sentido agora.
            </p>
          </div>

          <button className="flex w-fit items-center gap-2 rounded-2xl bg-violet-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-violet-800">
            Rodar nova leitura
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      <section className="mt-8 gap-5">
        <StrategicGoalCard />
        <div>
          
        </div>
        <div>
          
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[1fr_1fr]">
        <StrategicReadingCard alignment={alignment} />
        <NextDecisionCard />
      </section>

      <section className="mt-6">
        <SectionHeader
          eyebrow="Evidências que sustentam a leitura"
          title="O que os dados estão dizendo"
          description="As policies e observações continuam existindo, mas aparecem aqui como evidências traduzidas para decisão."
        />

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {evidences.map((evidence) => (
            <EvidenceCard key={evidence.id} evidence={evidence} />
          ))}
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[1fr_420px]">
        <PrioritiesPanel />
        <HistoryPanel />
      </section>

      <TechnicalDetailsPanel />
    </AppShell>
  );
}

function Topbar() {
  return (
    <header className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="text-2xl font-bold tracking-tight text-slate-950">
          <span className="text-violet-600">O</span>hrly
        </div>

        <div className="hidden h-8 w-px bg-slate-200 md:block" />

        <div className="hidden md:block">
          <p className="text-sm font-semibold text-slate-900">
            Recife Moto Parts
          </p>
          <p className="text-xs text-slate-500">
            Estratégia analisada: físico + digital
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-violet-600" />
        </button>

        <button className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}

function StrategicGoalCard() {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
          <Flag className="h-7 w-7" />
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-violet-700">
            Objetivo estratégico
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
            {strategicGoal.title}
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            {strategicGoal.description}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-violet-100 bg-violet-50 p-5">
        <p className="text-sm font-bold text-violet-950">
          Hipótese de crescimento
        </p>

        <p className="mt-2 text-sm leading-6 text-violet-900">
          {strategicGoal.hypothesis}
        </p>
      </div>
    </article>
  );
}

function AlignmentCard({
  alignment,
}: {
  alignment: ReturnType<typeof alignmentConfig>;
}) {
  const Icon = alignment.icon;

  return (
    <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-slate-400">
            Alinhamento atual
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-950">
            {alignment.label}
          </h2>
        </div>

        <div
          className={[
            "flex h-14 w-14 items-center justify-center rounded-2xl",
            alignment.iconBg,
            alignment.iconColor,
          ].join(" ")}
        >
          <Icon className="h-7 w-7" />
        </div>
      </div>

      <p className="mt-5 text-sm leading-6 text-slate-600">
        {alignment.description}
      </p>

      <div className="mt-6 space-y-3">
        <AlignmentItem
          label="Força atual"
          value="O ponto de venda sustenta a receita."
        />
        <AlignmentItem
          label="Risco atual"
          value="A loja perde memória de cliente onde mais vende."
        />
        <AlignmentItem
          label="Decisão agora"
          value="Melhorar identificação no balcão antes de escalar o digital."
        />
      </div>
    </aside>
  );
}

function AlignmentItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">
        {value}
      </p>
    </div>
  );
}

function StrategicReadingCard({
  alignment,
}: {
  alignment: ReturnType<typeof alignmentConfig>;
}) {
  const Icon = alignment.icon;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex gap-4">
        <div
          className={[
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl",
            alignment.iconBg,
            alignment.iconColor,
          ].join(" ")}
        >
          <Icon className="h-7 w-7" />
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-violet-700">
            Leitura do Ohrly
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
            {strategicReading.title}
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            {strategicReading.summary}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-orange-100 bg-orange-50 p-5">
        <p className="text-sm font-bold text-orange-950">
          O que isso trava
        </p>

        <p className="mt-2 text-sm leading-6 text-orange-900">
          {strategicReading.implication}
        </p>
      </div>
    </section>
  );
}

function NextDecisionCard() {
  return (
    <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
          <Target className="h-6 w-6" />
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-rose-600">
            Decisão recomendada agora
          </p>

          <h2 className="mt-2 text-xl font-bold text-slate-950">
            Não começar tentando vender tudo online
          </h2>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600">
        O próximo passo mais seguro é preparar a operação física para gerar
        continuidade. Sem identificação confiável no balcão, o digital fica com
        pouca base para recompra, campanhas e segmentação.
      </p>

      <div className="mt-5 space-y-3">
        {[
          "Capturar telefone ou CPF em pedidos presenciais relevantes.",
          "Separar categorias de recompra e baixo atrito.",
          "Usar WhatsApp como ponte entre venda física e continuidade.",
        ].map((step, index) => (
          <div key={step} className="flex gap-3 rounded-2xl bg-slate-50 p-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-700 text-xs font-bold text-white">
              {index + 1}
            </div>

            <p className="text-sm leading-6 text-slate-700">{step}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-sm font-bold uppercase tracking-wide text-violet-700">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
        {title}
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
        {description}
      </p>
    </div>
  );
}

function EvidenceCard({ evidence }: { evidence: StrategicEvidence }) {
  const Icon = evidence.icon;
  const tone = toneConfig(evidence.tone);

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div
          className={[
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
            tone.iconBg,
            tone.iconColor,
          ].join(" ")}
        >
          <Icon className="h-6 w-6" />
        </div>

        <span
          className={[
            "rounded-full px-2.5 py-1 text-xs font-bold",
            tone.badge,
          ].join(" ")}
        >
          {tone.label}
        </span>
      </div>

      <h3 className="mt-5 text-base font-bold text-slate-950">
        {evidence.title}
      </h3>

      <p className={["mt-4 text-4xl font-bold", tone.valueColor].join(" ")}>
        {evidence.value}
      </p>

      <p className="mt-2 text-sm leading-5 text-slate-600">
        {evidence.description}
      </p>

      <div className="mt-5 rounded-2xl bg-slate-50 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
          Interpretação
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-700">
          {evidence.interpretation}
        </p>
      </div>
    </article>
  );
}

function PrioritiesPanel() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <SectionHeader
        eyebrow="Prioridades"
        title="O que fazer primeiro"
        description="As recomendações estão ordenadas pela relação entre impacto estratégico e esforço operacional."
      />

      <div className="mt-5 space-y-4">
        {priorities.map((priority, index) => (
          <PriorityCard key={priority.id} priority={priority} index={index} />
        ))}
      </div>
    </section>
  );
}

function PriorityCard({
  priority,
  index,
}: {
  priority: StrategicPriority;
  index: number;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex gap-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-700 text-sm font-bold text-white">
          {index + 1}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-slate-950">
            {priority.title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {priority.description}
          </p>

          <div className="mt-4 rounded-2xl bg-violet-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-violet-700">
              Ação sugerida
            </p>
            <p className="mt-2 text-sm leading-6 text-violet-900">
              {priority.recommendedAction}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Pill label={`Impacto ${priority.impact}`} />
            <Pill label={`Esforço ${priority.effort}`} />
          </div>
        </div>
      </div>
    </article>
  );
}

function Pill({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
      {label}
    </span>
  );
}

function HistoryPanel() {
  return (
    <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-950">
        Histórico estratégico
      </h2>

      <div className="mt-6 space-y-5">
        {history.map((item) => (
          <div key={item.title} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div className="mt-2 h-full w-px bg-slate-200" />
            </div>

            <div className="pb-5">
              <p className="text-xs font-semibold text-slate-400">
                {formatDate(item.date)}
              </p>
              <h3 className="mt-1 text-sm font-bold text-slate-950">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

function TechnicalDetailsPanel() {
  return (
    <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-slate-400">
            Evidências técnicas
          </p>
          <h2 className="mt-2 text-xl font-bold text-slate-950">
            O que ficou por trás dessa leitura
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            A leitura estratégica foi sustentada por 3 findings críticos e 1
            observação validada. Esses detalhes podem ser revisados, mas não
            precisam ser o centro da decisão diária do lojista.
          </p>
        </div>

        <button className="flex w-fit items-center gap-2 rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm font-bold text-violet-700 transition hover:bg-violet-50">
          Ver diagnóstico técnico
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <TechnicalBox
          icon={ClipboardList}
          label="Findings críticos"
          value="3"
        />
        <TechnicalBox
          icon={MessageSquare}
          label="Observações validadas"
          value="1"
        />
        <TechnicalBox
          icon={Route}
          label="Direção estratégica"
          value="Parcial"
        />
      </div>
    </section>
  );
}

function TechnicalBox({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-violet-700" />
        <p className="text-sm font-semibold text-slate-700">{label}</p>
      </div>
      <p className="mt-4 text-3xl font-bold text-slate-950">{value}</p>
    </div>
  );
}

function alignmentConfig(status: AlignmentStatus): {
  label: string;
  description: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
} {
  switch (status) {
    case "aligned":
      return {
        label: "Alinhado",
        description:
          "A operação está sustentando bem o objetivo definido e os sinais principais apontam na direção esperada.",
        icon: CheckCircle2,
        iconBg: "bg-emerald-100",
        iconColor: "text-emerald-700",
      };
    case "needs_decision":
      return {
        label: "Precisa de decisão",
        description:
          "Há sinais suficientes para indicar que uma decisão operacional precisa ser tomada antes do próximo ciclo.",
        icon: AlertTriangle,
        iconBg: "bg-rose-100",
        iconColor: "text-rose-700",
      };
    case "unclear":
      return {
        label: "Indefinido",
        description:
          "Ainda faltam dados ou contexto para afirmar se a operação está alinhada com o objetivo.",
        icon: Eye,
        iconBg: "bg-slate-100",
        iconColor: "text-slate-700",
      };
    case "partially_aligned":
    default:
      return {
        label: "Parcial",
        description:
          "A operação tem uma força clara, mas ainda existe um gargalo que limita o avanço do objetivo estratégico.",
        icon: LineChart,
        iconBg: "bg-orange-100",
        iconColor: "text-orange-700",
      };
  }
}

function toneConfig(tone: StrategicEvidence["tone"]): {
  label: string;
  badge: string;
  iconBg: string;
  iconColor: string;
  valueColor: string;
} {
  switch (tone) {
    case "critical":
      return {
        label: "Atenção",
        badge: "bg-rose-100 text-rose-700",
        iconBg: "bg-rose-100",
        iconColor: "text-rose-700",
        valueColor: "text-rose-600",
      };
    case "attention":
      return {
        label: "Relevante",
        badge: "bg-orange-100 text-orange-700",
        iconBg: "bg-orange-100",
        iconColor: "text-orange-700",
        valueColor: "text-orange-600",
      };
    case "healthy":
      return {
        label: "Sob controle",
        badge: "bg-emerald-100 text-emerald-700",
        iconBg: "bg-emerald-100",
        iconColor: "text-emerald-700",
        valueColor: "text-emerald-700",
      };
    case "neutral":
    default:
      return {
        label: "Informativo",
        badge: "bg-slate-100 text-slate-700",
        iconBg: "bg-slate-100",
        iconColor: "text-slate-700",
        valueColor: "text-slate-950",
      };
  }
}

function formatDate(value: string) {
  if (!value) return "-";

  const isoDateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;

  if (!isoDateOnlyPattern.test(value)) {
    return value;
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("pt-BR").format(date);
}