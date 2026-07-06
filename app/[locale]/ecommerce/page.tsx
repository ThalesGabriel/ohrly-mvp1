import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { EcommerceInterestForm } from "@/components/landing/EcommerceInterestForm";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Database,
  FileSpreadsheet,
  Gauge,
  Layers3,
  LineChart,
  PackageSearch,
  Repeat2,
  SearchCheck,
  ShoppingCart,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Ohrly para E-commerce | Da planilha do dia à próxima decisão",
  description:
    "Veja como o Ohrly ajuda lojistas a transformar dados simples de pedidos, produtos, clientes e canais em uma leitura clara sobre o que merece atenção no e-commerce.",
  alternates: {
    canonical: "/pt/ecommerce",
  },
  openGraph: {
    title: "Ohrly para E-commerce | Da planilha do dia à próxima decisão",
    description:
      "Depois do checklist, entenda como o Ohrly pode ajudar sua loja a identificar pedidos não concluídos, produtos com atrito, recompra e dados invisíveis.",
    url: "/pt/ecommerce",
    type: "website",
  },
};

const invisibleSignals = [
  {
    title: "Pedidos que não viram venda",
    text: "Entenda se o problema está no carrinho, checkout, pagamento ou em tentativas que nem deveriam ser recuperadas.",
    icon: ShoppingCart,
  },
  {
    title: "Produtos com atrito",
    text: "Separe produtos que vendem direto daqueles que precisam de confiança, prova, atendimento ou jornada assistida.",
    icon: PackageSearch,
  },
  {
    title: "Clientes que não voltam",
    text: "Veja se a primeira compra está abrindo continuidade, recompra ou venda complementar.",
    icon: Repeat2,
  },
  {
    title: "Digital sem papel claro",
    text: "Descubra se o canal online vende, gera intenção, apoia o WhatsApp ou funciona como vitrine da loja física.",
    icon: LineChart,
  },
  {
    title: "Dados invisíveis",
    text: "Identifique quando cliente, canal e recompra não estão claros o suficiente para orientar decisões.",
    icon: Database,
  },
];

const methodSteps = [
  {
    eyebrow: "1",
    title: "Você começa com dados simples",
    text: "Planilha, exportação de pedidos, produtos, clientes, carrinhos ou vendas por canal. Não precisa integrar nada no primeiro contato.",
    icon: FileSpreadsheet,
  },
  {
    eyebrow: "2",
    title: "O Ohrly organiza sinais",
    text: "A leitura procura comportamentos recorrentes: o que conclui, o que trava, onde existe atrito e o que não dá para afirmar ainda.",
    icon: Layers3,
  },
  {
    eyebrow: "3",
    title: "Você enxerga janelas de decisão",
    text: "Em vez de só ver números soltos, você entende quais pontos merecem atenção antes de mexer em tráfego, desconto ou operação.",
    icon: SearchCheck,
  },
];

const ohrlyReads = [
  "Conversão: intenção virando pedido confirmado",
  "Produtos: interesse, atrito e conclusão",
  "Canais: online, físico, WhatsApp e marketplace",
  "Continuidade: recompra e pós-compra",
  "Mensurabilidade: cliente real, canal e origem",
];

const studyCards = [
  {
    title: "Fluxos continuam funcionando antes de perder desempenho",
    text: "A tese por trás do Ohrly: operações podem seguir ativas enquanto alguns comportamentos começam a perder consistência.",
  },
  {
    title: "O laboratório mostra o que pode ser lido sem dados reais",
    text: "Antes de pedir uma base, usamos simulações e templates para explicar que tipo de leitura seria possível.",
  },
  {
    title: "O motor transforma dados simples em janelas decisórias",
    text: "A primeira versão para lojistas prioriza comportamentos que se repetem e experimentos pequenos para validar melhoria.",
  },
];

export default function EcommerceBridgePage() {
  return (
    <PageShell>
      <section className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-6 pb-16 pt-12 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:pb-24 lg:pt-20">
        <div className="flex flex-col justify-center">
          <p className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-violet-100 bg-white px-3 py-1 text-sm font-semibold text-violet-700 shadow-sm shadow-violet-900/5">
            <Sparkles className="h-4 w-4" />
            Para quem baixou o checklist gratuito
          </p>

          <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.055em] text-[#21152f] sm:text-5xl lg:text-6xl">
            Da planilha do dia para a próxima decisão do seu e-commerce.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
            O checklist ajuda você a perceber sinais. O Ohrly ajuda a transformar
            esses sinais em uma leitura mais clara sobre o que merece atenção na loja:
            pedidos, produtos, canais, clientes e continuidade.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#early-access"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-violet-700 px-6 text-sm font-semibold text-white shadow-lg shadow-violet-900/10 transition hover:bg-violet-800"
            >
              Saiba mais
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
            {[
              ["2 min", "para entender"],
              ["0", "integrações agora"],
              ["1", "próximo passo"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-violet-100 bg-white/80 p-4 text-center shadow-sm shadow-violet-900/5">
                <p className="text-2xl font-semibold tracking-[-0.04em] text-violet-700">{value}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center justify-center lg:justify-end">
          <div className="w-full max-w-xl rounded-[2.25rem] border border-violet-100 bg-white p-5 shadow-2xl shadow-violet-900/10 sm:p-6">
            <div className="rounded-[1.75rem] border border-violet-100 bg-[#fbf9ff] p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-500">
                    Leitura Ohrly do dia
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#21152f]">
                    O que merece atenção amanhã?
                  </h2>
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-700 text-white">
                  <Gauge className="h-5 w-5" />
                </span>
              </div>

              <div className="mt-6 grid gap-3">
                {[
                  ["Pedidos não concluídos", "Sinal de atrito no checkout", "Atenção"],
                  ["Produtos com alto interesse", "Possível jornada assistida", "Investigar"],
                  ["Clientes sem recompra", "Continuidade baixa", "Testar"],
                ].map(([title, text, tag]) => (
                  <div key={title} className="rounded-2xl border border-violet-100 bg-white p-4 shadow-sm shadow-violet-900/5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold tracking-[-0.02em] text-[#21152f]">{title}</h3>
                        <p className="mt-1 text-sm leading-5 text-slate-500">{text}</p>
                      </div>
                      <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                        {tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl bg-violet-700 p-5 text-white">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-100">Síntese</p>
                <p className="mt-2 text-lg font-semibold tracking-[-0.03em]">
                  A loja pode estar vendendo, mas algumas janelas indicam onde a próxima decisão deveria começar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-8 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-500">Depois do checklist</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-[#21152f] sm:text-4xl">
              O que o Ohrly ajuda você a enxergar melhor?
            </h2>
          </div>
          <p className="text-base leading-7 text-slate-600">
            A ideia não é substituir sua decisão nem prometer aumento de faturamento.
            A ideia é reduzir achismo: organizar sinais que já aparecem nos dados e mostrar
            quais comportamentos merecem investigação primeiro.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {invisibleSignals.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="rounded-[1.75rem] border border-violet-100 bg-white p-5 shadow-sm shadow-violet-900/5">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold tracking-[-0.03em] text-[#21152f]">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-8 lg:py-16">
        <div className="rounded-[2.5rem] border border-violet-100 bg-white p-6 shadow-xl shadow-violet-900/5 lg:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-500">Como funciona</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-[#21152f] sm:text-4xl">
                Uma ponte entre a planilha e a decisão.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                O Ohrly começa simples porque a primeira pergunta não é técnica. É operacional:
                o que mudou, o que se repetiu e o que vale olhar antes de decidir amanhã?
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {methodSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="rounded-[1.75rem] border border-violet-100 bg-[#fbf9ff] p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-violet-500">{step.eyebrow}</span>
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-violet-700 shadow-sm">
                        <Icon className="h-5 w-5" />
                      </span>
                    </div>
                    <h3 className="mt-5 text-lg font-semibold tracking-[-0.03em] text-[#21152f]">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{step.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[1fr_0.85fr] lg:px-8 lg:py-16">
        <div className="rounded-[2.5rem] border border-violet-100 bg-[#21152f] p-6 text-white shadow-xl shadow-violet-900/10 lg:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-200">Leitura, não dashboard genérico</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
            O Ohrly organiza os sinais em janelas de decisão.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-violet-100/80">
            Em vez de entregar dezenas de gráficos, a leitura tenta responder onde o crescimento
            pode estar escapando: vender, medir, confirmar intenção ou manter continuidade.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {ohrlyReads.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl bg-white/8 p-4 ring-1 ring-white/10">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-violet-200" />
                <span className="text-sm font-bold leading-6 text-white/90">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-violet-100 bg-white p-6 shadow-xl shadow-violet-900/5 lg:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-500">Exemplo prático</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#21152f]">
            Antes de aumentar tráfego, talvez valha olhar para a qualidade da intenção.
          </h3>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Se há pedidos criados que não concluem, produtos de alto atrito e clientes que não voltam,
            a próxima decisão talvez não seja comprar mais visitas. Talvez seja entender onde a jornada perde continuidade.
          </p>

          <div className="mt-6 grid gap-3">
            {[
              [Clock3, "Há quanto tempo isso aparece?"],
              [BarChart3, "Isso afeta quais produtos ou canais?"],
              [TrendingUp, "Qual experimento pequeno validaria melhora?"],
            ].map(([Icon, text]) => {
              const TypedIcon = Icon as typeof Clock3;
              return (
                <div key={text as string} className="flex items-center gap-3 rounded-2xl bg-violet-50 p-4 text-sm font-semibold text-[#21152f]">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-violet-700 shadow-sm">
                    <TypedIcon className="h-5 w-5" />
                  </span>
                  {text as string}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-500">Autoridade e estudos</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-[#21152f] sm:text-4xl">
              Por trás do checklist existe uma pesquisa maior.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Os estudos explicam por que operações podem continuar funcionando enquanto perdem
              desempenho, clareza ou continuidade. Eles são a camada de profundidade para quem quer entender a tese do Ohrly.
            </p>
            <Link
              href="/studies"
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-violet-200 bg-white px-5 text-sm font-semibold text-[#21152f] shadow-sm transition hover:border-violet-400 hover:text-violet-800"
            >
              Ver estudos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {studyCards.map((study) => (
              <article key={study.title} className="rounded-[1.75rem] border border-violet-100 bg-white p-5 shadow-sm shadow-violet-900/5">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                  <ClipboardCheck className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold tracking-[-0.03em] text-[#21152f]">{study.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{study.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="early-access" className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-20">
        <div className="flex flex-col justify-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-500">Próximo passo</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-[#21152f] sm:text-5xl">
            Quer sair do checklist e testar uma leitura mais próxima da sua operação?
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
            A versão inicial do Ohrly para e-commerce está sendo liberada com cuidado. O objetivo é entender
            primeiro se sua loja tem dados e contexto suficientes para uma leitura útil.
          </p>

          <div className="mt-8 rounded-[2rem] border border-violet-100 bg-white/80 p-5 shadow-sm shadow-violet-900/5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#21152f]">
                  Quer ver antes como seria uma leitura?
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Simule um fluxo parecido com o seu e veja quais sinais o Ohrly observaria em um
                  e-commerce, sem enviar dados reais agora.
                </p>
              </div>

              <Link
                href="/pt/diagnostic"
                className="inline-flex shrink-0 items-center justify-center rounded-full bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-violet-900/15 transition hover:bg-violet-700"
              >
                Simular meu fluxo
              </Link>
            </div>
          </div>
        </div>

        <EcommerceInterestForm />
      </section>
    </PageShell>
  );
}
