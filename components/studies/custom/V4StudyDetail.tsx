import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  AppWindow,
  CheckCircle2,
  Layers3,
  School,
  Sparkles,
  Workflow,
} from "lucide-react";
import type { StudyDetail } from "@/data/studies";

export function V4StudyDetail({ study }: { study: StudyDetail }) {
  return (
    <article className="min-h-screen bg-[#f7fafc] text-slate-950">
      <section className="mx-auto max-w-7xl px-6 pb-10 pt-10 lg:px-8 lg:pt-14">
        <Link
          href="/studies"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-teal-800 transition hover:text-teal-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para estudos
        </Link>

        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="relative bg-gradient-to-br from-[#06183d] to-blue-900 p-8 text-white lg:p-12">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10" />
            <div className="absolute bottom-10 right-20 h-24 w-24 rounded-full bg-cyan-300/10" />

            <div className="relative z-10 max-w-4xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold">
                <Layers3 className="h-4 w-4" />
                {study.type}
              </span>

              <h1 className="mt-6 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                {study.title}
              </h1>

              <p className="mt-6 max-w-3xl text-base leading-7 text-white/75 sm:text-lg">
                {study.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-0 lg:grid-cols-3">
            <InsightCard
              icon={AppWindow}
              title="Produto não é só interface"
              text="O app ou dashboard é apenas a superfície. O valor real está na camada de gestão que ele representa."
            />
            <InsightCard
              icon={School}
              title="Categoria cria percepção de valor"
              text="Quando a solução vira gestão, o comprador entende melhor por que aquilo merece orçamento."
            />
            <InsightCard
              icon={Workflow}
              title="Método sustenta autoridade"
              text="Sem método, a solução parece ferramenta. Com método, ela vira uma forma nova de gerir."
            />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-[0.75fr_1.25fr] lg:px-8">
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-800">
              Tese do estudo
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#06183d]">
              O Ohrly não deve vender uma ferramenta. Deve vender uma forma de gestão.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              O aprendizado central é que produtos ganham força quando deixam
              de ser percebidos como software isolado e passam a representar uma
              camada de gestão para um problema recorrente.
            </p>
          </div>

          <div className="mt-5 rounded-[2rem] border border-cyan-100 bg-cyan-50 p-6">
            <h3 className="font-semibold text-[#06183d]">
              Aplicação no Ohrly
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              A categoria não é observabilidade. A categoria é saúde da sua loja digital
              de fluxos críticos.
            </p>

            <Link
              href="/avaliador"
              className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#004653] px-4 text-sm font-semibold text-white shadow-lg shadow-teal-900/10 transition hover:bg-[#003844]"
            >
              Avaliar fluxo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </aside>

        <div className="space-y-6">
          <CustomSection
            eyebrow="01"
            title="O V4 não parece vender apenas um app"
            text="A leitura importante para o Ohrly é que uma solução ganha força quando deixa de ser percebida como uma interface e passa a ser percebida como uma camada de gestão. O app vira porta de entrada, mas a promessa é maior: organizar uma parte relevante da operação."
          />

          <CustomSection
            eyebrow="02"
            title="Gestão é uma categoria mais forte que ferramenta"
            text="Ferramentas são comparadas por funcionalidade. Categorias de gestão são comparadas por importância. Quando o comprador entende que aquilo melhora uma área crítica da empresa, a conversa muda de recurso para decisão."
          />

          <CustomSection
            eyebrow="03"
            title="Ohrly precisa fazer o mesmo com saúde da sua loja digital"
            text="Em vez de explicar o produto como observabilidade comportamental, o Ohrly pode se apresentar como uma plataforma de gestão da saúde da sua loja digital. O método vem antes da tela. O diagnóstico vem antes do dashboard. A decisão vem antes da métrica."
          />

          <div className="rounded-[2rem] border border-teal-100 bg-teal-50 p-6 sm:p-8">
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-semibold text-teal-900">
              <Sparkles className="h-4 w-4" />
              Formulação final
            </p>

            <blockquote className="mt-5 text-2xl font-semibold leading-9 tracking-tight text-[#06183d]">
              Ohrly é uma plataforma de gestão da saúde da sua loja digital de fluxos
              críticos. Ela ajuda empresas a perceberem quando atendimento,
              venda, pagamento, entrega ou suporte começam a perder consistência
              antes disso virar fila, reclamação, retrabalho ou perda de resultado.
            </blockquote>
          </div>
        </div>
      </section>
    </article>
  );
}

function InsightCard({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ElementType;
  title: string;
  text: string;
}) {
  return (
    <div className="border-t border-slate-200 p-6 lg:border-l lg:border-t-0">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-800">
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="mt-5 font-semibold text-[#06183d]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}

function CustomSection({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex gap-5">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-sm font-semibold text-slate-500">
          {eyebrow}
        </span>

        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-[#06183d]">
            {title}
          </h2>

          <p className="mt-4 text-base leading-8 text-slate-600">{text}</p>
        </div>
      </div>
    </section>
  );
}