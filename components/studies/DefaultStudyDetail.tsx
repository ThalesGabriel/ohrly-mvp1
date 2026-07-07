import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Sparkles,
} from "lucide-react";
import { getRelatedStudies, type StudyDetail } from "@/data/studies";

export function DefaultStudyDetail({ study }: { study: StudyDetail }) {
  const Icon = study.icon;
  const relatedStudies = getRelatedStudies(study);

  return (
    <article className="min-h-screen bg-[#f7fafc] text-slate-950">
      <section className="mx-auto max-w-7xl px-6 pb-8 pt-10 lg:px-8 lg:pt-14">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
          <div className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${study.visualClass} p-8 text-white shadow-xl shadow-slate-900/10`}>
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
            <div className="absolute bottom-10 right-12 h-28 w-28 rounded-full bg-violet-300/10" />

            <div className="relative z-10 flex h-full min-h-[360px] flex-col justify-between">
              <div>
                <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-white">
                  {study.type}
                </span>

                <div className="mt-10 flex h-24 w-24 items-center justify-center rounded-[1.5rem] bg-white/10">
                  <Icon className="h-12 w-12" />
                </div>
              </div>

              <div>
                <p className="text-sm font-bold text-white/70">
                  Estudos de Saúde da sua loja digital
                </p>
                <p className="mt-3 max-w-md text-xl font-semibold leading-7">
                  Fluxos críticos podem continuar funcionando enquanto perdem consistência.
                </p>
              </div>
            </div>
          </div>

          <header className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
            <div className="flex flex-wrap gap-2">
              {study.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-900"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="mt-6 text-4xl font-semibold tracking-[-0.045em] text-[#06183d] sm:text-5xl">
              {study.title}
            </h1>

            <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
              {study.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-4 text-sm font-bold text-slate-500">
              <span className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4" />
                {study.readingTime}
              </span>

              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                {formatDate(study.publishedAt)}
              </span>

              <span className="inline-flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                {study.author.name}
              </span>
            </div>
          </header>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-[280px_1fr] lg:px-8">
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-800">
              Neste estudo
            </h2>

            <ul className="mt-5 space-y-4">
              {study.summary.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-violet-700" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 rounded-[2rem] border border-violet-100 bg-violet-50 p-6">
            <h3 className="font-semibold text-[#06183d]">
              Quer aplicar isso na sua operação?
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Avalie se um fluxo crítico tem sinais suficientes para ser acompanhado pelo Ohrly.
            </p>

            <Link
              href="/diagnostic"
              className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 text-sm font-semibold text-white shadow-lg shadow-violet-900/10 transition hover:bg-violet-800"
            >
              Avaliar fluxo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </aside>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="prose prose-slate max-w-none prose-headings:text-[#06183d] prose-headings:tracking-tight prose-p:leading-8 prose-p:text-slate-600">
            {study.content.map((block, index) => (
              <StudyBlock key={index} block={block} />
            ))}
          </div>
        </div>
      </section>

      {relatedStudies.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-14 pt-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-800">
                Continue lendo
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#06183d]">
                Estudos relacionados
              </h2>
            </div>

            <Link
              href="/studies"
              className="hidden items-center gap-1 text-sm font-semibold text-violet-800 sm:inline-flex"
            >
              Ver todos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {relatedStudies.map((related) => (
              <RelatedStudyCard key={related.slug} study={related} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

function StudyBlock({
  block,
}: {
  block: StudyDetail["content"][number];
}) {
  if (block.type === "heading") {
    return <h2>{block.content}</h2>;
  }

  if (block.type === "paragraph") {
    return <p>{block.content}</p>;
  }

  if (block.type === "quote") {
    return (
      <blockquote className="rounded-3xl border-l-4 border-violet-700 bg-violet-50 px-6 py-5 text-xl font-semibold leading-8 text-[#06183d]">
        {block.content}
      </blockquote>
    );
  }

  if (block.type === "list") {
    return (
      <ul className="not-prose my-6 space-y-3">
        {block.items.map((item) => (
          <li
            key={item}
            className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold leading-6 text-slate-700"
          >
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-violet-700" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === "callout") {
    return (
      <div className="not-prose my-8 rounded-[2rem] border border-violet-100 bg-violet-50 p-6">
        <h3 className="text-xl font-semibold text-[#06183d]">{block.title}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-700">{block.content}</p>
      </div>
    );
  }

  return null;
}

function RelatedStudyCard({ study }: { study: StudyDetail }) {
  const Icon = study.icon;

  return (
    <Link
      href={`/studies/${study.slug}`}
      className="group rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-slate-900/5"
    >
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${study.accentClass}`}
      >
        <Icon className="h-7 w-7" />
      </div>

      <span className="mt-5 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
        {study.category}
      </span>

      <h3 className="mt-4 text-lg font-semibold leading-6 text-[#06183d]">
        {study.title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        {study.description}
      </p>

      <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-violet-800">
        Ler estudo
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}