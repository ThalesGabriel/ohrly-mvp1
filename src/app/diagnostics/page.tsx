"use client";

import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Eye,
  FileSpreadsheet,
  LineChart,
  MessageSquare,
  Plus,
  Search,
  Store,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AppShell } from "@/components/AppShell";

type DiagnosticStatus = "COMPLETED" | "PROCESSING" | "FAILED";

type DiagnosticListItem = {
  id: string;
  storeName: string;
  segmentKey: string;
  analyzedPeriod: string;
  reportDate: string;
  status: DiagnosticStatus;
  criticalFindings: number;
  observationsForReview: number;
  trackedWindows: number;
  exposedValue: number;
};

const diagnostics: DiagnosticListItem[] = [
  {
    id: "7bfd2ba4-6faf-48e1-9e74-20aa779355a8",
    storeName: "Recife Moto Parts",
    segmentKey: "motopecas_acessorios",
    analyzedPeriod: "2024-01-01 a 2025-05-31",
    reportDate: "2025-05-31",
    status: "COMPLETED",
    criticalFindings: 3,
    observationsForReview: 0,
    trackedWindows: 1,
    exposedValue: 433090.59,
  },
  {
    id: "5785fea2-7220-47b5-8497-8b1662571ce4",
    storeName: "Recife Moto Parts",
    segmentKey: "motopecas_acessorios",
    analyzedPeriod: "2024-01-01 a 2025-05-31",
    reportDate: "2025-05-31",
    status: "COMPLETED",
    criticalFindings: 3,
    observationsForReview: 1,
    trackedWindows: 0,
    exposedValue: 433090.59,
  },
];

export default function DiagnosticsListPage() {
  const router = useRouter();

  const completedDiagnostics = diagnostics.filter(
    (diagnostic) => diagnostic.status === "COMPLETED"
  );

  const totalCriticalFindings = diagnostics.reduce(
    (total, diagnostic) => total + diagnostic.criticalFindings,
    0
  );

  const totalPendingObservations = diagnostics.reduce(
    (total, diagnostic) => total + diagnostic.observationsForReview,
    0
  );

  const totalTrackedWindows = diagnostics.reduce(
    (total, diagnostic) => total + diagnostic.trackedWindows,
    0
  );

  return (
    <AppShell
      title="Diagnósticos"
      subtitle="Histórico de leituras consolidadas da operação"
      rightSlot={
        <button
          type="button"
          onClick={() => router.push("/diagnostics/new")}
          className="hidden items-center gap-2 rounded-xl bg-violet-700 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-800 sm:flex"
        >
          <Plus className="h-4 w-4" />
          Novo diagnóstico
        </button>
      }
    >
      <section className="mt-8">
        <p className="text-sm font-bold uppercase tracking-wide text-violet-700">
          Histórico de diagnósticos
        </p>

        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              Leituras consolidadas da operação
            </h1>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              Cada diagnóstico consolida dados da loja, roda as policies,
              identifica findings e gera observações que podem virar janelas
              acompanhadas.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/diagnostics/new")}
            className="flex w-fit items-center gap-2 rounded-2xl bg-violet-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-violet-800 sm:hidden"
          >
            <Plus className="h-5 w-5" />
            Novo diagnóstico
          </button>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={FileSpreadsheet}
          label="Diagnósticos concluídos"
          value={String(completedDiagnostics.length)}
          description="leituras disponíveis"
          tone="violet"
        />

        <SummaryCard
          icon={AlertTriangle}
          label="Findings críticos"
          value={String(totalCriticalFindings)}
          description="somados no histórico"
          tone="rose"
        />

        <SummaryCard
          icon={MessageSquare}
          label="Observações pendentes"
          value={String(totalPendingObservations)}
          description="aguardando revisão"
          tone="orange"
        />

        <SummaryCard
          icon={ClipboardCheck}
          label="Janelas acompanhadas"
          value={String(totalTrackedWindows)}
          description="criadas por validação"
          tone="emerald"
        />
      </section>

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-950">
              Diagnósticos recentes
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Acesse um diagnóstico para revisar findings, observações e janelas.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
            <Search className="h-4 w-4" />
            <span>Buscar diagnóstico</span>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {diagnostics.map((diagnostic) => (
            <DiagnosticCard key={diagnostic.id} diagnostic={diagnostic} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}

function SummaryCard({
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
  tone: "violet" | "rose" | "orange" | "emerald";
}) {
  const styles = {
    violet: "bg-violet-100 text-violet-700",
    rose: "bg-rose-100 text-rose-700",
    orange: "bg-orange-100 text-orange-700",
    emerald: "bg-emerald-100 text-emerald-700",
  }[tone];

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div
          className={[
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
            styles,
          ].join(" ")}
        >
          <Icon className="h-6 w-6" />
        </div>

        <div>
          <p className="text-sm font-medium text-slate-600">{label}</p>
          <p className="mt-3 text-3xl font-bold text-slate-950">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>
      </div>
    </article>
  );
}

function DiagnosticCard({ diagnostic }: { diagnostic: DiagnosticListItem }) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push(`/diagnostics/${diagnostic.id}`)}
      className="w-full rounded-3xl border border-slate-200 bg-white p-5 text-left transition hover:border-violet-200 hover:bg-violet-50/40"
    >
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
            <LineChart className="h-6 w-6" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-slate-950">
                {diagnostic.storeName}
              </h3>

              <StatusPill status={diagnostic.status} />
            </div>

            <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Store className="h-4 w-4" />
                {diagnostic.segmentKey}
              </span>

              <span className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                {diagnostic.analyzedPeriod}
              </span>
            </div>

            <p className="mt-3 break-all text-xs text-slate-400">
              {diagnostic.id}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:w-[560px]">
          <MetricMini
            label="Críticos"
            value={String(diagnostic.criticalFindings)}
            tone="rose"
          />

          <MetricMini
            label="Pendentes"
            value={String(diagnostic.observationsForReview)}
            tone="orange"
          />

          <MetricMini
            label="Janelas"
            value={String(diagnostic.trackedWindows)}
            tone="violet"
          />

          <MetricMini
            label="Valor exposto"
            value={formatCurrency(diagnostic.exposedValue)}
            tone="emerald"
          />
        </div>

        <div className="hidden items-center gap-2 text-sm font-bold text-violet-700 xl:flex">
          Abrir
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </button>
  );
}

function MetricMini({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "rose" | "orange" | "violet" | "emerald";
}) {
  const color = {
    rose: "text-rose-600",
    orange: "text-orange-600",
    violet: "text-violet-700",
    emerald: "text-emerald-700",
  }[tone];

  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className={["mt-2 text-lg font-bold", color].join(" ")}>{value}</p>
    </div>
  );
}

function StatusPill({ status }: { status: DiagnosticStatus }) {
  const config = {
    COMPLETED: {
      label: "Concluído",
      className: "bg-emerald-100 text-emerald-700",
      icon: CheckCircle2,
    },
    PROCESSING: {
      label: "Processando",
      className: "bg-orange-100 text-orange-700",
      icon: Eye,
    },
    FAILED: {
      label: "Falhou",
      className: "bg-rose-100 text-rose-700",
      icon: AlertTriangle,
    },
  }[status];

  const Icon = config.icon;

  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold",
        config.className,
      ].join(" ")}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}