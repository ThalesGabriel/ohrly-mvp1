import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  Eye,
  Layers3,
  LineChart,
  ShieldAlert,
  Sparkles,
  Workflow,
} from "lucide-react";
import type { StudyDetail } from "@/data/studies/types";

type FounderStudyDetailProps = {
  study: StudyDetail;
};

const degradationStages = [
  {
    title: "Tudo parece normal",
    description:
      "O fluxo continua funcionando. Pedidos entram, atendimentos seguem, clientes ainda conseguem concluir ações.",
  },
  {
    title: "Pequenas variações aparecem",
    description:
      "Começam sinais intermediários: mais espera, mais exceções, mais recontato, mais abandono ou mais dúvida.",
  },
  {
    title: "O custo fica invisível",
    description:
      "A operação absorve o problema com esforço, retrabalho, urgência ou sensação de que algo está mais pesado.",
  },
  {
    title: "O problema ganha nome",
    description:
      "Só depois ele aparece como reclamação, fila, queda de conversão, perda de receita ou desgaste do time.",
  },
];

const vitalSignals = [
  {
    title: "Tempo",
    description: "Quanto o fluxo demora para resolver, concluir ou avançar.",
    icon: Clock3,
  },
  {
    title: "Recontato",
    description: "Quando o cliente precisa voltar para resolver o mesmo ponto.",
    icon: Workflow,
  },
  {
    title: "Abandono",
    description: "Quando a pessoa começa o caminho, mas não chega até o fim.",
    icon: ShieldAlert,
  },
  {
    title: "Exceções",
    description: "Quando o fluxo depende cada vez mais de intervenção manual.",
    icon: AlertTriangle,
  },
];

const comparison = [
  {
    label: "Funcionando",
    items: [
      "O sistema está no ar.",
      "O pedido ainda pode ser feito.",
      "O atendimento ainda responde.",
      "O indicador final ainda não estourou.",
    ],
  },
  {
    label: "Saudável",
    items: [
      "O fluxo mantém consistência.",
      "A operação não compra risco sem perceber.",
      "Os sinais intermediários seguem dentro do esperado.",
      "A decisão acontece antes da urgência.",
    ],
  },
];

export function FounderStudyDetail({ study }: FounderStudyDetailProps) {
  return (
    <article className="min-h-screen bg-[#f7fafc] text-slate-950">
      <section className="relative overflow-hidden border-b border-violet-100 bg-gradient-to-br from-white via-violet-50/70 to-white">
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-violet-200/40 blur-3xl" />
        <div className="absolute -bottom-40 left-10 h-80 w-80 rounded-full bg-fuchsia-100/70 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-3 py-1 text-sm font-semibold text-violet-800 shadow-sm">
                <Sparkles className="h-4 w-4" />
                {study.type}
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-slate-600 shadow-sm">
                <Clock3 className="h-4 w-4" />
                {study.readingTime}
              </span>
            </div>

            <h1 className="mt-8 max-w-4xl text-4xl font-semibold tracking-[-0.055em] text-[#21152f] sm:text-5xl lg:text-6xl">
              {study.title}
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              {study.description}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/diagnostic"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-violet-700 px-6 text-sm font-semibold text-white shadow-lg shadow-violet-900/10 transition hover:bg-violet-800"
              >
                Simular um fluxo crítico
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/studies"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-violet-100 bg-white px-6 text-sm font-semibold text-violet-800 shadow-sm transition hover:border-violet-300"
              >
                Ver outros estudos
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] border border-violet-100 bg-white/85 p-5 shadow-xl shadow-violet-900/5 backdrop-blur">
              <div className="rounded-[1.5rem] bg-gradient-to-br from-violet-700 to-violet-950 p-6 text-white">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                  <Activity className="h-7 w-7" />
                </div>

                <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-violet-100">
                  Tese central
                </p>

                <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                  O problema nem sempre começa quando algo quebra.
                </h2>

                <p className="mt-4 text-sm leading-7 text-white/75">
                  Muitas vezes, ele começa quando o comportamento normal de um
                  fluxo muda, antes da reclamação, antes da fila e antes do
                  indicador final parecer grave.
                </p>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <HeroMiniCard
                  icon={Eye}
                  title="Ver antes"
                  description="Reconhecer sinais antes da urgência."
                />
                <HeroMiniCard
                  icon={LineChart}
                  title="Ler comportamento"
                  description="Observar mudança, não só resultado final."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-800">
              Resumo do estudo
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#21152f]">
              O que esta leitura propõe
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              O Ohrly parte de uma diferença simples: uma operação pode estar
              funcionando tecnicamente e, ainda assim, estar perdendo saúde
              operacional.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {study.summary.map((item) => (
              <div
                key={item}
                className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-violet-700" />
                <p className="text-sm leading-6 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-800">
                Diferença essencial
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#21152f]">
                Funcionar não é a mesma coisa que estar saudável
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                Um fluxo pode continuar ativo enquanto começa a exigir mais
                esforço, mais espera, mais intervenção e mais retrabalho para
                entregar o mesmo resultado.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {comparison.map((column) => (
                <div
                  key={column.label}
                  className="rounded-[1.5rem] border border-violet-100 bg-violet-50/50 p-5"
                >
                  <h3 className="text-lg font-semibold text-violet-900">
                    {column.label}
                  </h3>

                  <ul className="mt-4 space-y-3">
                    {column.items.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2 text-sm leading-6 text-slate-600"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-700" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-800">
              Sinais vitais
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#21152f]">
              Onde a perda de saúde costuma aparecer primeiro
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-7 text-slate-600">
            Antes de um problema ganhar nome, ele costuma aparecer como mudança
            em sinais intermediários do fluxo.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {vitalSignals.map((signal) => {
            const Icon = signal.icon;

            return (
              <div
                key={signal.title}
                className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-slate-900/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-800">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-[#21152f]">
                  {signal.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {signal.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-6 lg:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-800">
              Como a degradação evolui
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#21152f]">
              Da normalidade aparente ao problema visível
            </h2>
          </div>

          <div className="grid grid-cols-1 divide-y divide-slate-100 lg:grid-cols-4 lg:divide-x lg:divide-y-0">
            {degradationStages.map((stage, index) => (
              <div key={stage.title} className="p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-700 text-sm font-semibold text-white">
                  {index + 1}
                </div>

                <h3 className="mt-5 text-lg font-semibold text-[#21152f]">
                  {stage.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {stage.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        <div className="rounded-[2rem] border border-violet-200 bg-violet-700 p-8 text-white shadow-xl shadow-violet-950/10 md:p-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
            <BarChart3 className="h-7 w-7" />
          </div>

          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-violet-100">
            A pergunta central do Ohrly
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            Em que momento esperar deixou de ser uma decisão neutra?
          </h2>

          <p className="mt-5 text-sm leading-7 text-white/80 md:text-base">
            Essa é a pergunta que transforma dados operacionais em leitura.
            Não basta saber que um número mudou. O ponto é entender quando essa
            mudança começa a comprar risco para a operação.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 pt-4 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-800">
              Método Ohrly
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#21152f]">
              O papel do Ohrly é transformar sinais dispersos em janelas de decisão
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-600 md:text-base">
              O Ohrly não existe para substituir dashboards, planilhas ou
              ferramentas de atendimento. Ele existe para interpretar quando os
              sinais de um fluxo começam a sugerir perda de consistência,
              aumento de risco ou necessidade de investigação.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/diagnostic"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-violet-700 px-6 text-sm font-semibold text-white shadow-lg shadow-violet-900/10 transition hover:bg-violet-800"
              >
                Simular um fluxo parecido
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/ecommerce"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-violet-800 shadow-sm transition hover:border-violet-300"
              >
                Ver aplicação em e-commerce
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-800">
                <Layers3 className="h-6 w-6" />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#21152f]">
                  Leitura, não apenas métrica
                </p>
                <p className="text-xs font-semibold text-slate-500">
                  O dado mostra. A leitura ajuda a decidir.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {[
                "O que mudou?",
                "Isso é variação normal ou sinal de atenção?",
                "Qual fluxo está comprando risco?",
                "Qual decisão deveria acontecer agora?",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}

function HeroMiniCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Eye;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <Icon className="h-5 w-5 text-violet-800" />
      <p className="mt-3 text-sm font-semibold text-[#21152f]">{title}</p>
      <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
    </div>
  );
}