"use client";

import Link from "next/link";
import { useState, type ElementType } from "react";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  ClipboardCheck,
  Clock3,
  FileText,
  HeartPulse,
  Layers3,
  MessageSquare,
  Radar,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  TimerReset,
  TrendingUp,
  Workflow,
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";

type PricingPlan = {
  name: string;
  eyebrow: string;
  price: string;
  priceNote: string;
  description: string;
  badge?: string;
  cta: string;
  href: string;
  highlighted?: boolean;
  features: string[];
  bestFor: string;
  icon: ElementType;
};

const pricingPlans: PricingPlan[] = [
  {
    name: "Check-up Essencial",
    eyebrow: "Primeiro diagnóstico",
    price: "R$ 1.500",
    priceNote: "Pilotos selecionados a partir de R$ 1.200",
    description:
      "Para quem quer avaliar um fluxo crítico pela primeira vez e entender se há sinais suficientes para acompanhamento.",
    cta: "Começar com Essencial",
    href: "/contato?plano=checkup-essencial",
    features: [
      "Análise inicial de um fluxo crítico",
      "Leitura dos sinais disponíveis",
      "Identificação de sinais vitais",
      "Relatório executivo de 1 página",
      "1 hipótese principal de perda de consistência",
      "Sessão online de 30–60 minutos",
    ],
    bestFor: "Melhor para validar se o Ohrly faz sentido.",
    icon: SearchCheck,
  },
  {
    name: "Check-up Avançado",
    eyebrow: "Análise aprofundada",
    price: "R$ 3.000",
    priceNote: "Para operações com mais histórico ou múltiplos sinais",
    description:
      "Para empresas que já têm dados, histórico ou percepções recorrentes e precisam transformar sinais em decisão.",
    badge: "Mais recomendado",
    cta: "Solicitar Avançado",
    href: "/contato?plano=checkup-avancado",
    highlighted: true,
    features: [
      "Tudo do Check-up Essencial",
      "Análise por canal, período ou segmento",
      "Leitura de recorrência",
      "Priorização de janelas de decisão",
      "Recomendações práticas de intervenção",
      "Sessão consultiva de 1h",
      "Plano de acompanhamento inicial",
    ],
    bestFor: "Melhor para quem já percebe sintomas, mas precisa de clareza.",
    icon: Radar,
  },
  {
    name: "Monitoramento Inicial",
    eyebrow: "Acompanhamento",
    price: "A partir de R$ 4.500",
    priceNote: "Para ciclos de 30 ou 60 dias",
    description:
      "Para empresas que querem acompanhar recuperação, recorrência ou piora de um fluxo crítico ao longo do tempo.",
    cta: "Falar sobre monitoramento",
    href: "/contato?plano=monitoramento-inicial",
    features: [
      "Diagnóstico inicial do fluxo",
      "Acompanhamento por 30 ou 60 dias",
      "Relatórios de evolução",
      "Leitura de recuperação e recorrência",
      "Reuniões de acompanhamento",
      "Recomendação de próximos ciclos",
    ],
    bestFor: "Melhor para fluxos já críticos, recorrentes ou estratégicos.",
    icon: HeartPulse,
  },
];

const chooseCards = [
  {
    title: "Ainda não sei se o Ohrly se aplica ao meu caso",
    text: "Use o Avaliador de Fluxo Crítico para entender se há aderência antes de solicitar um check-up.",
    action: "Avaliar meu fluxo",
    href: "/avaliador",
    icon: CircleHelp,
  },
  {
    title: "Tenho um fluxo que parece piorar, mas ainda não sei provar",
    text: "Comece pelo Check-up Essencial para organizar sinais, sintomas e uma primeira leitura.",
    action: "Ver Essencial",
    href: "#planos",
    icon: SearchCheck,
  },
  {
    title: "Tenho dados e quero uma leitura mais profunda",
    text: "O Check-up Avançado ajuda a cruzar sinais, recorrência, contexto e prioridade de decisão.",
    action: "Ver Avançado",
    href: "#planos",
    icon: BarChart3,
  },
  {
    title: "Quero acompanhar se o problema volta ou melhora",
    text: "O Monitoramento Inicial acompanha recuperação, recorrência e evolução do fluxo ao longo do tempo.",
    action: "Ver Monitoramento",
    href: "#planos",
    icon: TrendingUp,
  },
];

const includedItems = [
  {
    title: "Leitura de saúde do fluxo",
    text: "Uma visão clara sobre o comportamento atual do fluxo crítico analisado.",
    icon: HeartPulse,
  },
  {
    title: "Sinais vitais candidatos",
    text: "Identificação dos sinais que ajudam a acompanhar saúde, esforço, atrito e recorrência.",
    icon: Radar,
  },
  {
    title: "Janelas de atenção",
    text: "Indicação de onde a variação pode ter deixado de ser ruído e começado a merecer decisão.",
    icon: TimerReset,
  },
  {
    title: "Próximos passos recomendados",
    text: "Ações sugeridas para investigar, intervir, acompanhar ou encerrar a hipótese.",
    icon: ClipboardCheck,
  },
];

const faqs = [
  {
    question: "Preciso enviar dados sensíveis?",
    answer:
      "Não no primeiro contato. Primeiro entendemos o fluxo e os sinais disponíveis. Se fizer sentido avançar, combinamos quais dados são necessários e como eles devem ser enviados.",
  },
  {
    question: "O Ohrly substitui meu BI?",
    answer:
      "Não. O Ohrly complementa BI, dashboards e ferramentas operacionais com uma leitura de saúde comportamental dos fluxos críticos.",
  },
  {
    question: "O check-up garante que existe degradação?",
    answer:
      "Não. O check-up ajuda a identificar se há sinais consistentes de perda de saúde da sua loja digital ou se a variação parece normal.",
  },
  {
    question: "Serve só para e-commerce?",
    answer:
      "Não. Pode ser aplicado a atendimento, chatbot, checkout, pagamento, entrega, cobrança, onboarding, suporte, fluxos escolares e operações internas.",
  },
  {
    question: "O que acontece depois do check-up?",
    answer:
      "Você pode encerrar com a leitura pontual, aprofundar a análise ou iniciar monitoramento recorrente.",
  },
];

export default function PricingPage() {
  return (
    <PageShell>
      <main className="min-h-screen bg-[#f7fafc] text-slate-950">
        <section className="mx-auto max-w-7xl px-6 pb-10 pt-10 lg:px-8 lg:pt-16">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-900">
                <Sparkles className="h-4 w-4" />
                Preços e check-ups
              </p>

              <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.045em] text-[#06183d] sm:text-5xl lg:text-6xl">
                Comece pequeno. Enxergue cedo. Decida melhor.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                O Ohrly ajuda sua empresa a avaliar a saúde da sua loja digital de um
                fluxo crítico antes que sinais dispersos virem fila, reclamação,
                retrabalho ou perda de resultado.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/avaliador"
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-[#004653] px-6 text-sm font-semibold text-white shadow-lg shadow-teal-900/10 transition hover:bg-[#003844]"
                >
                  Avaliar meu fluxo primeiro
                </Link>

                <Link
                  href="/contato"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-[#06183d] shadow-sm transition hover:border-teal-700"
                >
                  Solicitar check-up
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <p className="mt-5 text-sm leading-6 text-slate-500">
                Não sabe qual plano escolher? Comece pelo avaliador gratuito de
                fluxo crítico.
              </p>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="rounded-[1.5rem] bg-[#004653] p-6 text-white">
                <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold">
                  <Workflow className="h-4 w-4" />
                  Jornada Ohrly
                </p>

                <h2 className="mt-6 text-3xl font-semibold tracking-tight">
                  O Ohrly não começa com uma assinatura. Começa com uma leitura.
                </h2>

                <p className="mt-4 text-sm leading-6 text-white/75">
                  Primeiro entendemos se o fluxo tem criticidade, recorrência e
                  sinais observáveis suficientes para justificar acompanhamento.
                </p>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <JourneyStep number="1" title="Entender" />
                <JourneyStep number="2" title="Aprofundar" />
                <JourneyStep number="3" title="Acompanhar" />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="rounded-[2rem] border border-cyan-100 bg-cyan-50 p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-800">
                  Antes dos preços
                </p>

                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#06183d]">
                  Primeiro vem a leitura. Depois vem o plano.
                </h2>
              </div>

              <p className="text-sm leading-7 text-slate-700 md:text-base">
                O check-up existe para reduzir incerteza. Ele mostra se um fluxo
                crítico tem sinais suficientes para acompanhamento, quais sinais
                merecem atenção e se faz sentido evoluir para uma análise mais
                profunda ou monitoramento inicial.
              </p>
            </div>
          </div>
        </section>

        <section id="planos" className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-800">
                Planos
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#06183d]">
                Escolha como começar
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-6 text-slate-600">
              As opções seguem uma jornada simples: entender um fluxo, aprofundar
              a leitura ou acompanhar sua evolução ao longo do tempo.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
            {pricingPlans.map((plan) => (
              <PricingCard key={plan.name} plan={plan} />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-800">
                  Orientação
                </p>

                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#06183d]">
                  Qual opção faz mais sentido para você?
                </h2>
              </div>

              <p className="max-w-xl text-sm leading-6 text-slate-600">
                Preço não deveria ser uma escolha no escuro. Use estes cenários
                para encontrar o melhor ponto de entrada.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              {chooseCards.map((card) => (
                <ChooseCard key={card.title} card={card} />
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-800">
                Incluso
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#06183d]">
                Todo check-up Ohrly entrega clareza da sua loja digital
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
                Independentemente do ponto de entrada, a entrega central é uma
                leitura clara sobre a saúde de um fluxo crítico e o próximo passo
                mais prudente.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {includedItems.map((item) => (
                <IncludedCard key={item.title} item={item} />
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-800">
                Perguntas frequentes
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#06183d]">
                Dúvidas comuns antes do check-up
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
                O objetivo é começar com segurança, sem exigir uma contratação
                grande antes de entender se o fluxo realmente merece
                acompanhamento.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <FaqItem key={faq.question} faq={faq} defaultOpen={index === 0} />
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-12 pt-8 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#004653] p-8 text-white shadow-xl shadow-teal-950/10 md:p-12">
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10" />
            <div className="absolute bottom-8 right-20 h-24 w-24 rounded-full bg-cyan-300/10" />

            <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-white">
                  <CircleHelp className="h-4 w-4" />
                  Não sabe qual plano escolher?
                </p>

                <h2 className="max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
                  Avalie um fluxo crítico gratuitamente antes de solicitar um check-up
                </h2>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-white/80 md:text-base">
                  Veja se o fluxo tem sinais, recorrência e impacto suficientes
                  para se beneficiar do acompanhamento pelo Ohrly.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  href="/avaliador"
                  className="inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 text-sm font-semibold text-[#004653] shadow-lg transition hover:bg-slate-100"
                >
                  Avaliar meu fluxo
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/contato"
                  className="inline-flex h-13 items-center justify-center rounded-xl border border-white/20 bg-white/10 px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  Solicitar check-up
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </PageShell>
  );
}

function JourneyStep({ number, title }: { number: string; title: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-50 text-sm font-semibold text-teal-900">
        {number}
      </span>

      <p className="mt-3 text-sm font-semibold text-[#06183d]">{title}</p>
    </div>
  );
}

function PricingCard({ plan }: { plan: PricingPlan }) {
  const Icon = plan.icon;

  return (
    <article
      className={[
        "relative flex h-full flex-col rounded-[2rem] border bg-white p-6 shadow-sm transition",
        plan.highlighted
          ? "border-teal-700 shadow-xl shadow-teal-900/10"
          : "border-slate-200",
      ].join(" ")}
    >
      {plan.badge && (
        <span className="absolute right-6 top-6 rounded-full bg-[#004653] px-3 py-1 text-xs font-semibold text-white">
          {plan.badge}
        </span>
      )}

      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-800">
        <Icon className="h-7 w-7" />
      </div>

      <p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-teal-800">
        {plan.eyebrow}
      </p>

      <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[#06183d]">
        {plan.name}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        {plan.description}
      </p>

      <div className="mt-6">
        <p className="text-4xl font-semibold tracking-tight text-[#06183d]">
          {plan.price}
        </p>
        <p className="mt-2 text-sm font-bold leading-5 text-slate-500">
          {plan.priceNote}
        </p>
      </div>

      <Link
        href={plan.href}
        className={[
          "mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition",
          plan.highlighted
            ? "bg-[#004653] text-white shadow-lg shadow-teal-900/10 hover:bg-[#003844]"
            : "border border-slate-200 bg-white text-[#06183d] shadow-sm hover:border-teal-700",
        ].join(" ")}
      >
        {plan.cta}
        <ArrowRight className="h-4 w-4" />
      </Link>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-semibold text-[#06183d]">{plan.bestFor}</p>
      </div>

      <ul className="mt-6 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-3 text-sm leading-6 text-slate-600">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function ChooseCard({
  card,
}: {
  card: {
    title: string;
    text: string;
    action: string;
    href: string;
    icon: ElementType;
  };
}) {
  const Icon = card.icon;

  return (
    <Link
      href={card.href}
      className="group rounded-[2rem] border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:border-teal-200 hover:bg-teal-50/40"
    >
      <div className="flex gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-teal-800 shadow-sm">
          <Icon className="h-6 w-6" />
        </div>

        <div>
          <h3 className="font-semibold leading-6 text-[#06183d]">{card.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{card.text}</p>

          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal-800">
            {card.action}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function IncludedCard({
  item,
}: {
  item: {
    title: string;
    text: string;
    icon: ElementType;
  };
}) {
  const Icon = item.icon;

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-800">
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="mt-5 font-semibold text-[#06183d]">{item.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
    </div>
  );
}

function FaqItem({
  faq,
  defaultOpen = false,
}: {
  faq: {
    question: string;
    answer: string;
  };
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left"
      >
        <span className="font-semibold text-[#06183d]">{faq.question}</span>

        <ChevronDown
          className={[
            "h-5 w-5 shrink-0 text-slate-400 transition",
            open ? "rotate-180" : "",
          ].join(" ")}
        />
      </button>

      {open && (
        <div className="border-t border-slate-100 px-5 pb-5 pt-1">
          <p className="text-sm leading-7 text-slate-600">{faq.answer}</p>
        </div>
      )}
    </div>
  );
}