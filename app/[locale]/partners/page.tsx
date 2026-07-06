"use client";

import Link from "next/link";
import { useState, type ElementType } from "react";
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  ClipboardCheck,
  HandCoins,
  Handshake,
  Headphones,
  Landmark,
  Mail,
  Megaphone,
  MessageSquare,
  Network,
  Send,
  ShieldCheck,
  Sparkles,
  Store,
  UserRound,
  Users,
  Workflow,
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";

type PartnerType = {
  title: string;
  description: string;
  icon: ElementType;
};

type CommissionExample = {
  offer: string;
  value: string;
  commission: string;
};

const partnerTypes: PartnerType[] = [
  {
    title: "Consultores e mentores",
    description:
      "Para quem já orienta lojistas, founders, gestores ou operações e quer oferecer uma leitura mais clara sobre gargalos operacionais.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Agências",
    description:
      "Para agências de tráfego, CRM, automação, CX ou e-commerce que identificam problemas além da campanha.",
    icon: Megaphone,
  },
  {
    title: "Comunidades e eventos",
    description:
      "Para quem reúne empreendedores, gestores ou profissionais de operação e quer levar conteúdo prático sobre saúde da sua loja digital.",
    icon: Users,
  },
  {
    title: "Parceiros institucionais",
    description:
      "Para hubs, associações, programas de empreendedorismo e iniciativas que apoiam empresas em crescimento.",
    icon: Landmark,
  },
];

const howItWorks = [
  {
    title: "Você identifica uma empresa com fluxo crítico",
    text: "Pode ser atendimento sobrecarregado, checkout com abandono, cobrança reativa, chatbot transferindo demais ou operação com retrabalho.",
    icon: Workflow,
  },
  {
    title: "Indica para o Ohrly",
    text: "Você envia o contato, apresenta o Ohrly ou direciona a empresa para uma página com seu código de indicação.",
    icon: Network,
  },
  {
    title: "O Ohrly faz a triagem",
    text: "A empresa passa pelo avaliador ou por uma conversa inicial para entender se existe aderência ao check-up da sua loja digital.",
    icon: ClipboardCheck,
  },
  {
    title: "Se fechar, você recebe comissão",
    text: "A comissão é paga sobre check-ups ou monitoramentos contratados a partir da sua indicação.",
    icon: HandCoins,
  },
];

const commissionExamples: CommissionExample[] = [
  {
    offer: "Check-up Essencial",
    value: "R$ 1.500",
    commission: "R$ 495",
  },
  {
    offer: "Check-up Avançado",
    value: "R$ 3.000",
    commission: "R$ 990",
  },
  {
    offer: "Monitoramento Inicial",
    value: "R$ 4.500",
    commission: "R$ 1.485",
  },
];

const partnerBenefits = [
  {
    title: "Materiais de apoio",
    items: [
      "Página de indicação",
      "Apresentação curta do Ohrly",
      "Roteiro de abordagem",
      "Exemplos de fluxos críticos",
      "Materiais para workshop ou conteúdo",
      "Simulações demonstrativas",
    ],
    icon: ClipboardCheck,
  },
  {
    title: "Suporte comercial",
    items: [
      "Triagem dos leads indicados",
      "Retorno sobre status da indicação",
      "Apoio em reuniões quando fizer sentido",
      "Sugestão do melhor check-up para cada caso",
    ],
    icon: Headphones,
  },
  {
    title: "Autoridade compartilhada",
    items: [
      "Possibilidade de co-criar estudos",
      "Workshops em parceria",
      "Conteúdos sobre saúde da sua loja digital por segmento",
      "Cases com parceiros, quando houver autorização",
    ],
    icon: ShieldCheck,
  },
];

const goodFits = [
  "Empresas com atendimento, vendas ou operação recorrente",
  "Negócios com fluxo crítico claro",
  "Empresas que já sentem retrabalho, fila, abandono ou reclamação",
  "Operações com planilhas, sistemas ou histórico mínimo",
  "Gestores que precisam decidir onde agir",
];

const weakFits = [
  "Negócios sem volume recorrente",
  "Empresas sem fluxo digital ou da sua loja digital claro",
  "Quem busca apenas tráfego, post ou campanha",
  "Quem quer dashboard bonito sem decisão da sua loja digital",
  "Quem não tem abertura para olhar dados ou sinais",
];

const workshopFormats = [
  "Palestra introdutória",
  "Workshop para e-commerce",
  "Workshop para CX e atendimento",
  "Diagnóstico demonstrativo com dados sintéticos",
  "Ação com vagas limitadas para check-ups",
];

const partnerTypeOptions = [
  "Consultor",
  "Agência",
  "Mentor",
  "Comunidade",
  "Instituição",
  "Outro",
];

const audienceOptions = [
  "E-commerces",
  "Pequenas empresas",
  "Operações de atendimento",
  "Startups",
  "Escolas",
  "Prestadores de serviço",
  "Outros",
];

const indicationOptions = [
  "Indicações diretas",
  "Workshop",
  "Conteúdo em parceria",
  "Comunidade/evento",
  "Consultoria complementar",
  "Ainda quero entender",
];

const faqs = [
  {
    question: "Preciso vender o Ohrly sozinho?",
    answer:
      "Não. O parceiro pode apenas indicar ou abrir a conversa. O Ohrly conduz a triagem, entende o caso e apresenta a proposta quando fizer sentido.",
  },
  {
    question: "Quando a comissão é paga?",
    answer:
      "A comissão é paga após a confirmação do pagamento do cliente indicado. Os detalhes de prazo e forma de pagamento são combinados no acordo de parceria.",
  },
  {
    question: "O parceiro participa da entrega?",
    answer:
      "Pode participar, se fizer sentido para o cliente e para o formato da parceria. Mas não é obrigatório.",
  },
  {
    question: "Posso indicar empresas de qualquer segmento?",
    answer:
      "Sim, desde que exista um fluxo crítico recorrente que possa ser analisado: atendimento, vendas, cobrança, entrega, onboarding, suporte ou operação interna.",
  },
  {
    question: "Instituições podem participar?",
    answer:
      "Sim. Para instituições, comunidades e programas, os formatos podem ser desenhados caso a caso, incluindo workshops, ações educativas ou benefícios para participantes.",
  },
];

export default function PartnersPage() {
  return (
    <PageShell>
      <main className="min-h-screen bg-[#f7fafc] text-slate-950">
        <section className="mx-auto max-w-7xl px-6 pb-10 pt-10 lg:px-8 lg:pt-16">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-900">
                <Handshake className="h-4 w-4" />
                Programa de Parceiros Ohrly
              </p>

              <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.045em] text-[#06183d] sm:text-5xl lg:text-6xl">
                Indique empresas que precisam enxergar melhor seus fluxos críticos
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                O Programa de Parceiros Ohrly conecta consultores, agências,
                mentores e comunidades a empresas que precisam entender a saúde
                da sua loja digital de fluxos como atendimento, checkout, cobrança,
                entrega, onboarding e suporte.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="#candidatura"
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-[#004653] px-6 text-sm font-semibold text-white shadow-lg shadow-teal-900/10 transition hover:bg-[#003844]"
                >
                  Quero ser parceiro
                </Link>

                <Link
                  href="#como-funciona"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-[#06183d] shadow-sm transition hover:border-teal-700"
                >
                  Ver como funciona
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <p className="mt-5 text-sm leading-6 text-slate-500">
                Ganhe comissão por check-ups fechados a partir da sua indicação.
              </p>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="rounded-[1.5rem] bg-[#004653] p-6 text-white">
                <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold">
                  <Sparkles className="h-4 w-4" />
                  Parceria com método
                </p>

                <h2 className="mt-6 text-3xl font-semibold tracking-tight">
                  Ajude empresas a perceberem sinais antes que eles virem problema visível.
                </h2>

                <p className="mt-4 text-sm leading-6 text-white/75">
                  O Ohrly transforma percepções soltas sobre atendimento, vendas,
                  cobrança ou operação em uma leitura clara de saúde da sua loja digital.
                </p>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <HeroMetric value="33%" label="na primeira venda" icon={HandCoins} />
                <HeroMetric value="20%" label="em recorrências" icon={BarChart3} />
                <HeroMetric value="6 meses" label="janela de recorrência" icon={ShieldCheck} />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-800">
                Para quem é
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#06183d]">
                Quem pode se tornar parceiro
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-6 text-slate-600">
              O programa foi pensado para quem já conversa com empresas que têm
              fluxos críticos, decisões operacionais e sintomas difíceis de
              interpretar.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {partnerTypes.map((type) => (
              <PartnerTypeCard key={type.title} partnerType={type} />
            ))}
          </div>
        </section>

        <section id="como-funciona" className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-800">
                  Como funciona
                </p>

                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#06183d]">
                  Uma indicação simples, com triagem conduzida pelo Ohrly
                </h2>
              </div>

              <p className="max-w-xl text-sm leading-6 text-slate-600">
                Você não precisa vender sozinho. O parceiro abre caminho, e o
                Ohrly ajuda a entender se existe aderência para check-up ou
                monitoramento.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
              {howItWorks.map((step, index) => (
                <HowItWorksCard
                  key={step.title}
                  step={step}
                  index={index + 1}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-800">
                Comissões
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#06183d]">
                Ganhe por check-ups fechados a partir da sua indicação
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
                A comissão padrão é de 33% sobre a primeira venda fechada. Em
                acompanhamentos recorrentes originados pela indicação, o parceiro
                recebe 20% por até 6 meses.
              </p>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <div className="grid grid-cols-3 bg-slate-50 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  <div className="p-4">Oferta</div>
                  <div className="p-4 text-right">Valor</div>
                  <div className="p-4 text-right">Comissão</div>
                </div>

                {commissionExamples.map((example) => (
                  <div
                    key={example.offer}
                    className="grid grid-cols-3 border-t border-slate-200 text-sm"
                  >
                    <div className="p-4 font-semibold text-[#06183d]">
                      {example.offer}
                    </div>
                    <div className="p-4 text-right font-bold text-slate-600">
                      {example.value}
                    </div>
                    <div className="p-4 text-right font-semibold text-teal-800">
                      {example.commission}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-cyan-100 bg-cyan-50 p-5">
                <p className="text-sm font-semibold text-[#06183d]">
                  Recorrência
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  20% sobre acompanhamentos recorrentes por até 6 meses, quando
                  a recorrência nasce de uma indicação do parceiro.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-800">
                Apoio ao parceiro
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#06183d]">
                O que você recebe como parceiro
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-6 text-slate-600">
              O objetivo é facilitar a indicação e aumentar a qualidade das
              conversas, não transformar o parceiro em vendedor solitário.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {partnerBenefits.map((benefit) => (
              <PartnerBenefitCard key={benefit.title} benefit={benefit} />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <FitCard
              title="Boas indicações"
              description="Empresas com sinais recorrentes, fluxo crítico claro e abertura para entender dados ou sintomas operacionais."
              items={goodFits}
              positive
            />

            <FitCard
              title="Menos aderente agora"
              description="Casos em que talvez ainda falte volume, fluxo claro, abertura ou decisão da sua loja digital relevante."
              items={weakFits}
            />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="rounded-[2rem] border border-cyan-100 bg-cyan-50 p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-800">
                  Workshops e comunidades
                </p>

                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#06183d]">
                  Quer levar o Método Ohrly para sua comunidade?
                </h2>

                <p className="mt-4 text-sm leading-7 text-slate-700 md:text-base">
                  Também criamos workshops sobre saúde da sua loja digital de fluxos
                  críticos, mostrando como empresas podem identificar sinais de
                  perda de consistência antes que eles virem problema visível.
                </p>

                <Link
                  href="#candidatura"
                  className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#004653] px-6 text-sm font-semibold text-white shadow-lg shadow-teal-900/10 transition hover:bg-[#003844]"
                >
                  Propor workshop
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {workshopFormats.map((format) => (
                  <div
                    key={format}
                    className="flex items-center gap-3 rounded-2xl border border-cyan-100 bg-white p-4 text-sm font-semibold text-[#06183d] shadow-sm"
                  >
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-teal-700" />
                    {format}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="candidatura" className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-800">
                Candidatura
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#06183d]">
                Quero ser parceiro Ohrly
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
                Conte brevemente com quem você atua e como imagina indicar o
                Ohrly. A partir disso, podemos sugerir o melhor formato de
                parceria: indicação direta, workshop, conteúdo, comunidade ou
                parceria institucional.
              </p>

              <div className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="font-semibold text-[#06183d]">
                  O que acontece depois?
                </p>

                <ul className="mt-4 space-y-3">
                  {[
                    "Entendemos seu perfil de atuação.",
                    "Identificamos o tipo de empresa que você costuma alcançar.",
                    "Combinamos o modelo de indicação ou parceria.",
                    "Você recebe materiais e próximos passos.",
                  ].map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <PartnerApplicationForm />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-800">
                Perguntas frequentes
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#06183d]">
                Dúvidas comuns sobre parceria
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
                A parceria foi desenhada para ser simples: você indica ou abre a
                conversa, e o Ohrly conduz a triagem comercial.
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
                  <Handshake className="h-4 w-4" />
                  Vamos construir canal juntos?
                </p>

                <h2 className="max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
                  Atende empresas que poderiam se beneficiar do Ohrly?
                </h2>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-white/80 md:text-base">
                  Conheça o Programa de Parceiros e ajude empresas a enxergarem
                  a saúde da sua loja digital dos seus fluxos críticos antes que pequenos
                  sintomas virem grandes problemas.
                </p>
              </div>

              <Link
                href="#candidatura"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-[#004653] shadow-lg transition hover:bg-slate-100"
              >
                Quero ser parceiro
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </PageShell>
  );
}

function HeroMetric({
  value,
  label,
  icon: Icon,
}: {
  value: string;
  label: string;
  icon: ElementType;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <Icon className="h-5 w-5 text-teal-800" />
      <p className="mt-3 text-2xl font-semibold text-[#06183d]">{value}</p>
      <p className="mt-1 text-xs font-bold text-slate-500">{label}</p>
    </div>
  );
}

function PartnerTypeCard({ partnerType }: { partnerType: PartnerType }) {
  const Icon = partnerType.icon;

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-800">
        <Icon className="h-7 w-7" />
      </div>

      <h3 className="mt-5 text-xl font-semibold text-[#06183d]">
        {partnerType.title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        {partnerType.description}
      </p>
    </div>
  );
}

function HowItWorksCard({
  step,
  index,
}: {
  step: {
    title: string;
    text: string;
    icon: ElementType;
  };
  index: number;
}) {
  const Icon = step.icon;

  return (
    <div className="relative rounded-[2rem] border border-slate-200 bg-slate-50 p-5">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-semibold text-teal-900 shadow-sm">
        {index}
      </span>

      <div className="mt-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-800">
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="mt-5 font-semibold leading-6 text-[#06183d]">{step.title}</h3>

      <p className="mt-3 text-sm leading-6 text-slate-600">{step.text}</p>
    </div>
  );
}

function PartnerBenefitCard({
  benefit,
}: {
  benefit: {
    title: string;
    items: string[];
    icon: ElementType;
  };
}) {
  const Icon = benefit.icon;

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-800">
        <Icon className="h-7 w-7" />
      </div>

      <h3 className="mt-5 text-xl font-semibold text-[#06183d]">
        {benefit.title}
      </h3>

      <ul className="mt-5 space-y-3">
        {benefit.items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FitCard({
  title,
  description,
  items,
  positive = false,
}: {
  title: string;
  description: string;
  items: string[];
  positive?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-[2rem] border p-6 shadow-sm sm:p-8",
        positive
          ? "border-teal-100 bg-teal-50"
          : "border-slate-200 bg-white",
      ].join(" ")}
    >
      <h2 className="text-2xl font-semibold tracking-tight text-[#06183d]">
        {title}
      </h2>

      <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>

      <ul className="mt-6 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
            <CheckCircle2
              className={[
                "mt-0.5 h-5 w-5 shrink-0",
                positive ? "text-teal-800" : "text-slate-400",
              ].join(" ")}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PartnerApplicationForm() {
  const [partnerType, setPartnerType] = useState("");
  const [audience, setAudience] = useState<string[]>([]);
  const [indicationMode, setIndicationMode] = useState<string[]>([]);

  function toggleValue(
    value: string,
    list: string[],
    setter: (value: string[]) => void
  ) {
    if (list.includes(value)) {
      setter(list.filter((item) => item !== value));
      return;
    }

    setter([...list, value]);
  }

  return (
    <form
      action="https://formspree.io/f/SEU_ID_AQUI"
      method="POST"
      className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5 sm:p-8"
    >
      <input type="hidden" name="tipo_parceiro" value={partnerType} />

      {audience.map((item) => (
        <input key={item} type="hidden" name="publico" value={item} />
      ))}

      {indicationMode.map((item) => (
        <input key={item} type="hidden" name="forma_indicacao" value={item} />
      ))}

      <div>
        <h3 className="text-2xl font-semibold tracking-tight text-[#06183d]">
          Candidatura de parceiro
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Preencha os dados para avaliarmos o melhor formato de parceria.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <TextField
          label="Nome"
          name="nome"
          placeholder="Seu nome"
          icon={UserRound}
          required
        />

        <TextField
          label="E-mail"
          name="email"
          type="email"
          placeholder="voce@empresa.com"
          icon={Mail}
          required
        />

        <TextField
          label="Empresa / projeto"
          name="empresa"
          placeholder="Nome da empresa ou projeto"
          icon={Building2}
        />

        <TextField
          label="Site ou perfil"
          name="site"
          placeholder="LinkedIn, site ou Instagram"
          icon={Store}
        />
      </div>

      <fieldset className="mt-8">
        <legend className="mb-4 text-sm font-semibold text-[#06183d]">
          Tipo de parceiro
        </legend>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {partnerTypeOptions.map((option) => (
            <RadioPill
              key={option}
              label={option}
              selected={partnerType === option}
              onClick={() => setPartnerType(option)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-8">
        <legend className="mb-4 text-sm font-semibold text-[#06183d]">
          Com quem você costuma se relacionar?
        </legend>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {audienceOptions.map((option) => (
            <CheckboxPill
              key={option}
              label={option}
              selected={audience.includes(option)}
              onClick={() => toggleValue(option, audience, setAudience)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-8">
        <legend className="mb-4 text-sm font-semibold text-[#06183d]">
          Como imagina indicar o Ohrly?
        </legend>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {indicationOptions.map((option) => (
            <CheckboxPill
              key={option}
              label={option}
              selected={indicationMode.includes(option)}
              onClick={() =>
                toggleValue(option, indicationMode, setIndicationMode)
              }
            />
          ))}
        </div>
      </fieldset>

      <label className="mt-8 block">
        <span className="mb-2 block text-sm font-semibold text-[#06183d]">
          Mensagem
        </span>

        <textarea
          name="mensagem"
          rows={6}
          placeholder="Conte brevemente o público com quem você atua e que tipo de fluxo crítico costuma aparecer nas conversas."
          className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-600/10"
        />
      </label>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-[#06183d]">
              Pronto para conversar?
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Vamos avaliar o melhor formato de parceria para o seu contexto.
            </p>
          </div>

          <button
            type="submit"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#004653] px-6 text-sm font-semibold text-white shadow-lg shadow-teal-900/10 transition hover:bg-[#003844]"
          >
            Quero ser parceiro
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </form>
  );
}

function TextField({
  label,
  name,
  placeholder,
  icon: Icon,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  placeholder: string;
  icon: ElementType;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#06183d]">
        {label}
      </span>

      <div className="relative">
        <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <input
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-600/10"
        />
      </div>
    </label>
  );
}

function RadioPill({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex items-center gap-3 rounded-2xl border p-4 text-left text-sm font-bold transition",
        selected
          ? "border-teal-700 bg-teal-50 text-[#06183d]"
          : "border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50/40",
      ].join(" ")}
    >
      <span
        className={[
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
          selected ? "border-teal-700" : "border-slate-300",
        ].join(" ")}
      >
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-teal-700" />}
      </span>
      {label}
    </button>
  );
}

function CheckboxPill({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex items-center gap-3 rounded-2xl border p-4 text-left text-sm font-bold transition",
        selected
          ? "border-teal-700 bg-teal-50 text-[#06183d]"
          : "border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50/40",
      ].join(" ")}
    >
      <span
        className={[
          "flex h-5 w-5 items-center justify-center rounded-md border",
          selected ? "border-teal-700 bg-teal-700 text-white" : "border-slate-300",
        ].join(" ")}
      >
        {selected && <CheckCircle2 className="h-4 w-4" />}
      </span>
      {label}
    </button>
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