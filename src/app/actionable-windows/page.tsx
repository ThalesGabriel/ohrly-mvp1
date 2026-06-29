"use client";

import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Copy,
  Download,
  Flag,
  HelpCircle,
  ListChecks,
  Loader2,
  Megaphone,
  MessageCircle,
  RefreshCcw,
  Search,
  Send,
  ShieldAlert,
  Sparkles,
  Target,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";

type ActionWindowType =
  | "campaign"
  | "qualification"
  | "operational_task"
  | "experiment"
  | string;

type Priority = "critical" | "high" | "medium" | "low" | string;

type ActionWindowChannel = "whatsapp" | "manual" | "internal" | string;

type ActionableWindowsResponse = {
  diagnosticRunId: string | null;
  storeId: string | null;
  storeName: string | null;
  segmentKey: string | null;
  summary: ActionableWindowsSummary;
  windows: ActionableWindow[];
};

type ActionableWindowsSummary = {
  openWindows: number;
  actionableCustomers: number;
  associatedValue: number;
  readyCampaigns: number;
};

type MessageSuggestion = {
  channel: string;
  text: string;
};

type ActionableRecord = {
  id: string;
  label: string;
  reason: string;
  daysSinceTrigger: number | null;
  confidence: number | null;
  explanation: string;
  contact: string | null;
  baseEvent: string | null;
  baseValue: string | null;
};

type ActionableWindow = {
  id: string;
  type: ActionWindowType;
  title: string;
  description: string;
  priority: Priority;
  channel: ActionWindowChannel | null;
  countLabel: string;
  valueLabel: string | null;
  metricKey: string;
  suggestedAction: string;
  whyItAppeared: string[];
  messageSuggestion: MessageSuggestion | null;
  records: ActionableRecord[];
};

const filters = [
  { id: "all", label: "Todas" },
  { id: "campaign", label: "Campanhas" },
  { id: "qualification", label: "Qualificação" },
  { id: "operational_task", label: "Tarefas" },
  { id: "experiment", label: "Experimentos" },
  { id: "high_priority", label: "Alta prioridade" },
  { id: "whatsapp", label: "WhatsApp" },
] as const;

type FilterId = (typeof filters)[number]["id"];

const API_BASE_URL = process.env.NEXT_PUBLIC_OHRLY_API_BASE_URL;

async function getActionableWindows(): Promise<ActionableWindowsResponse> {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_OHRLY_API_BASE_URL não configurado.");
  }

  const response = await fetch(`${API_BASE_URL}/api/bff/actionable-windows`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");

    throw new Error(
      `Erro ao buscar janelas acionáveis: ${response.status} ${body}`,
    );
  }

  return response.json();
}

function formatCurrency(value: number | null | undefined) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

function priorityLabel(priority: Priority) {
  const labels: Record<string, string> = {
    critical: "Prioridade crítica",
    high: "Prioridade alta",
    medium: "Prioridade média",
    low: "Prioridade baixa",
  };

  return labels[priority] ?? "Prioridade";
}

function priorityClasses(priority: Priority) {
  const classes: Record<string, string> = {
    critical: "bg-rose-50 text-rose-700 ring-rose-100",
    high: "bg-red-50 text-red-700 ring-red-100",
    medium: "bg-amber-50 text-amber-700 ring-amber-100",
    low: "bg-slate-50 text-slate-600 ring-slate-100",
  };

  return classes[priority] ?? "bg-slate-50 text-slate-600 ring-slate-100";
}

function typeConfig(type: ActionWindowType): {
  label: string;
  icon: LucideIcon;
  classes: string;
  iconClasses: string;
} {
  const config: Record<
    string,
    {
      label: string;
      icon: LucideIcon;
      classes: string;
      iconClasses: string;
    }
  > = {
    campaign: {
      label: "Campanha WhatsApp",
      icon: MessageCircle,
      classes: "bg-emerald-50 text-emerald-700 ring-emerald-100",
      iconClasses: "bg-emerald-50 text-emerald-600",
    },
    qualification: {
      label: "Qualificação",
      icon: Search,
      classes: "bg-violet-50 text-violet-700 ring-violet-100",
      iconClasses: "bg-violet-50 text-violet-600",
    },
    operational_task: {
      label: "Tarefa operacional",
      icon: ClipboardList,
      classes: "bg-orange-50 text-orange-700 ring-orange-100",
      iconClasses: "bg-orange-50 text-orange-600",
    },
    experiment: {
      label: "Experimento",
      icon: Sparkles,
      classes: "bg-blue-50 text-blue-700 ring-blue-100",
      iconClasses: "bg-blue-50 text-blue-600",
    },
  };

  return (
    config[type] ?? {
      label: "Janela acionável",
      icon: ListChecks,
      classes: "bg-slate-50 text-slate-700 ring-slate-100",
      iconClasses: "bg-slate-50 text-slate-600",
    }
  );
}

function channelLabel(channel?: ActionWindowChannel | null) {
  if (channel === "whatsapp") return "Canal: WhatsApp";
  if (channel === "manual") return "Revisão manual";
  if (channel === "internal") return "Ação interna";
  return "Ação sugerida";
}

export default function ActionableWindowsPage() {
  const [data, setData] = useState<ActionableWindowsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const [selectedWindowId, setSelectedWindowId] = useState<string | null>(null);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  async function loadActionableWindows() {
    try {
      setLoading(true);
      setErrorMessage(null);

      const response = await getActionableWindows();
      const firstWindow = response.windows[0];

      setData(response);
      setSelectedWindowId(firstWindow?.id ?? null);
      setSelectedRecordId(firstWindow?.records?.[0]?.id ?? null);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Erro inesperado ao carregar janelas acionáveis.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadActionableWindows();
  }, []);

  const windows = data?.windows ?? [];

  const filteredWindows = useMemo(() => {
    return windows.filter((window) => {
      if (activeFilter === "all") return true;

      if (activeFilter === "high_priority") {
        return window.priority === "high" || window.priority === "critical";
      }

      if (activeFilter === "whatsapp") {
        return window.channel === "whatsapp";
      }

      return window.type === activeFilter;
    });
  }, [activeFilter, windows]);

  const selectedWindow =
    windows.find((window) => window.id === selectedWindowId) ??
    windows[0] ??
    null;

  const selectedRecord =
    selectedWindow?.records?.find((record) => record.id === selectedRecordId) ??
    selectedWindow?.records?.[0] ??
    null;

  function handleSelectWindow(window: ActionableWindow) {
    setSelectedWindowId(window.id);
    setSelectedRecordId(window.records?.[0]?.id ?? null);
  }

  async function copyMessage() {
    const text = selectedWindow?.messageSuggestion?.text;

    if (!text) return;

    await navigator.clipboard.writeText(text);
  }

  if (loading) {
    return (
      <AppShell>
        <ActionableWindowsLoading />
      </AppShell>
    );
  }

  if (errorMessage) {
    return (
      <AppShell>
        <ActionableWindowsError
          message={errorMessage}
          onRetry={loadActionableWindows}
        />
      </AppShell>
    );
  }

  if (!data || windows.length === 0 || !selectedWindow) {
    return (
      <AppShell>
        <ActionableWindowsEmpty />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <section className="flex min-w-0 flex-1 flex-col px-5 py-6 sm:px-8 lg:px-10">
          <header className="flex flex-col gap-5 border-b border-slate-200 pb-6 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white px-3 py-1 text-xs font-medium text-violet-700 shadow-sm">
                <ListChecks className="h-3.5 w-3.5" />
                Janelas acionáveis
              </div>

              <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Janelas Acionáveis
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Quem chamar, por que chamar e o que testar agora.
              </p>

              {data.storeName && (
                <p className="mt-2 text-sm text-slate-400">
                  {data.storeName}
                  {data.segmentKey ? ` · ${data.segmentKey}` : ""}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50"
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                Como funciona
              </button>

              <button
                type="button"
                className="inline-flex h-10 items-center justify-center rounded-2xl bg-violet-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-violet-700"
              >
                <Send className="mr-2 h-4 w-4" />
                Exportar ações
              </button>
            </div>
          </header>

          <section className="grid gap-4 py-6 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              icon={ListChecks}
              label="janelas abertas"
              value={String(data.summary.openWindows)}
              tone="violet"
            />

            <MetricCard
              icon={Users}
              label="clientes acionáveis"
              value={String(data.summary.actionableCustomers)}
              tone="blue"
            />

            <MetricCard
              icon={WalletCards}
              label="em valor associado"
              value={formatCurrency(data.summary.associatedValue)}
              tone="emerald"
            />

            <MetricCard
              icon={Megaphone}
              label="campanhas prontas"
              value={String(data.summary.readyCampaigns)}
              tone="amber"
            />
          </section>

          <section className="mb-5 flex flex-wrap gap-2">
            {filters.map((filter) => {
              const active = filter.id === activeFilter;

              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                  className={[
                    "inline-flex h-10 items-center rounded-2xl px-4 text-sm font-medium transition",
                    active
                      ? "bg-violet-600 text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                  ].join(" ")}
                >
                  {filter.id === "high_priority" && (
                    <Flag className="mr-2 h-4 w-4" />
                  )}
                  {filter.id === "whatsapp" && (
                    <MessageCircle className="mr-2 h-4 w-4" />
                  )}
                  {filter.label}
                </button>
              );
            })}
          </section>

          <section className="grid flex-1 gap-5 xl:grid-cols-[minmax(0,1fr)_440px] 2xl:grid-cols-[minmax(0,1fr)_500px]">
            <div className="space-y-4">
              {filteredWindows.length > 0 ? (
                filteredWindows.map((window) => (
                  <ActionWindowCard
                    key={window.id}
                    window={window}
                    selected={window.id === selectedWindow.id}
                    onClick={() => handleSelectWindow(window)}
                  />
                ))
              ) : (
                <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                  <p className="text-sm font-medium text-slate-950">
                    Nenhuma janela encontrada para este filtro.
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Tente visualizar todas as janelas acionáveis.
                  </p>
                </div>
              )}
            </div>

            <ActionWindowDetail
              selectedWindow={selectedWindow}
              selectedRecord={selectedRecord}
              selectedRecordId={selectedRecordId}
              onSelectRecord={setSelectedRecordId}
              onCopyMessage={copyMessage}
            />
          </section>
        </section>
      </div>
    </AppShell>
  );
}

function MetricCard({
  icon: Icon,
  value,
  label,
  tone,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
  tone: "violet" | "blue" | "emerald" | "amber";
}) {
  const tones = {
    violet: "bg-violet-50 text-violet-600",
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div
          className={[
            "flex h-12 w-12 items-center justify-center rounded-2xl",
            tones[tone],
          ].join(" ")}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <p className="text-2xl font-semibold tracking-tight text-slate-950">
            {value}
          </p>
          <p className="text-sm text-slate-500">{label}</p>
        </div>
      </div>
    </div>
  );
}

function ActionWindowCard({
  window,
  selected,
  onClick,
}: {
  window: ActionableWindow;
  selected: boolean;
  onClick: () => void;
}) {
  const config = typeConfig(window.type);
  const Icon = config.icon;
  const hasMessage = Boolean(window.messageSuggestion?.text);

  return (
    <article
      className={[
        "group cursor-pointer rounded-3xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
        selected
          ? "border-violet-300 ring-4 ring-violet-100"
          : "border-slate-200",
      ].join(" ")}
      onClick={onClick}
    >
      <div className="flex gap-4">
        <div
          className={[
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
            config.iconClasses,
          ].join(" ")}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span
              className={[
                "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                config.classes,
              ].join(" ")}
            >
              {config.label}
            </span>

            <span
              className={[
                "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                priorityClasses(window.priority),
              ].join(" ")}
            >
              <Flag className="mr-1.5 h-3 w-3" />
              {priorityLabel(window.priority)}
            </span>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-slate-950 sm:text-lg">
                {window.title}
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                {window.description}
              </p>
            </div>

            <ArrowRight
              className={[
                "mt-1 h-5 w-5 shrink-0 transition",
                selected
                  ? "text-violet-600"
                  : "text-slate-300 group-hover:text-slate-500",
              ].join(" ")}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              {window.countLabel}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Target className="h-4 w-4" />
              {channelLabel(window.channel)}
            </span>

            {window.valueLabel && (
              <span className="inline-flex items-center gap-1.5">
                <WalletCards className="h-4 w-4" />
                {window.valueLabel}
              </span>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              className="inline-flex h-9 items-center rounded-xl bg-violet-600 px-4 text-sm font-medium text-white hover:bg-violet-700"
              onClick={(event) => {
                event.stopPropagation();
                onClick();
              }}
            >
              {window.type === "campaign" ? "Ver lista" : "Ver detalhe"}
            </button>

            {hasMessage && (
              <button
                type="button"
                className="inline-flex h-9 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 hover:bg-slate-50"
                onClick={async (event) => {
                  event.stopPropagation();
                  await navigator.clipboard.writeText(
                    window.messageSuggestion?.text ?? "",
                  );
                }}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copiar mensagem
              </button>
            )}

            <button
              type="button"
              className="inline-flex h-9 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 hover:bg-slate-50"
              onClick={(event) => event.stopPropagation()}
            >
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function ActionWindowDetail({
  selectedWindow,
  selectedRecord,
  selectedRecordId,
  onSelectRecord,
  onCopyMessage,
}: {
  selectedWindow: ActionableWindow;
  selectedRecord?: ActionableRecord | null;
  selectedRecordId?: string | null;
  onSelectRecord: (recordId: string) => void;
  onCopyMessage: () => void;
}) {
  const config = typeConfig(selectedWindow.type);
  const TypeIcon = config.icon;
  const message = selectedWindow.messageSuggestion?.text;
  const records = selectedWindow.records ?? [];

  return (
    <aside className="sticky top-6 hidden h-[calc(100vh-48px)] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm xl:flex xl:flex-col">
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-6">
        <div>
          <div
            className={[
              "mb-3 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
              config.classes,
            ].join(" ")}
          >
            <TypeIcon className="mr-1.5 h-3.5 w-3.5" />
            {config.label}
          </div>

          <h2 className="text-lg font-semibold leading-7 text-slate-950">
            {selectedWindow.title}
          </h2>
        </div>

        <button
          type="button"
          className="rounded-xl p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <section>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
              <Sparkles className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-slate-950">
              Por que isso apareceu?
            </h3>
          </div>

          <ul className="mt-4 space-y-3">
            {selectedWindow.whyItAppeared.map((reason) => (
              <li
                key={reason}
                className="flex items-start gap-3 text-sm leading-5 text-slate-600"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="my-6 h-px bg-slate-100" />

        <section>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Target className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-slate-950">Ação sugerida</h3>
          </div>

          <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            {selectedWindow.suggestedAction}
          </p>

          <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Métrica de validação
            </p>
            <p className="mt-1 font-mono text-sm font-medium text-slate-800">
              {selectedWindow.metricKey}
            </p>
          </div>
        </section>

        {message && (
          <>
            <div className="my-6 h-px bg-slate-100" />

            <section>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <MessageCircle className="h-4 w-4" />
                  </div>
                  <h3 className="font-semibold text-slate-950">
                    Mensagem sugerida
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={onCopyMessage}
                  className="inline-flex h-8 items-center rounded-xl border border-slate-200 px-3 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  <Copy className="mr-1.5 h-3.5 w-3.5" />
                  Copiar
                </button>
              </div>

              <div className="mt-4 rounded-3xl bg-emerald-50 p-4 text-sm leading-6 text-slate-700 ring-1 ring-emerald-100">
                {message}

                <div className="mt-2 flex items-center justify-end gap-1 text-xs text-emerald-700">
                  11:32
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
              </div>
            </section>
          </>
        )}

        {records.length > 0 ? (
          <>
            <div className="my-6 h-px bg-slate-100" />

            <section>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                    <Users className="h-4 w-4" />
                  </div>
                  <h3 className="font-semibold text-slate-950">
                    Registros nesta janela
                  </h3>
                </div>

                <span className="text-sm text-slate-500">
                  {selectedWindow.countLabel}
                </span>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <div className="grid grid-cols-[1fr_90px_90px] bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <span>Registro</span>
                  <span>Dias</span>
                  <span>Confiança</span>
                </div>

                {records.map((record) => {
                  const active = record.id === selectedRecordId;
                  const confidence = record.confidence ?? 0;

                  return (
                    <button
                      key={record.id}
                      type="button"
                      onClick={() => onSelectRecord(record.id)}
                      className={[
                        "w-full border-t border-slate-100 px-4 py-3 text-left transition",
                        active ? "bg-violet-50" : "bg-white hover:bg-slate-50",
                      ].join(" ")}
                    >
                      <div className="grid grid-cols-[1fr_90px_90px] items-center gap-2">
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {record.label}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            {record.reason}
                          </p>
                        </div>

                        <span className="text-sm text-slate-600">
                          {record.daysSinceTrigger ?? "-"}
                        </span>

                        <div className="flex items-center gap-2">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                            <div
                              className="h-full rounded-full bg-emerald-500"
                              style={{ width: `${confidence}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-slate-600">
                            {confidence}%
                          </span>
                        </div>
                      </div>

                      {active && (
                        <div className="mt-3 rounded-2xl bg-white p-3 text-xs leading-5 text-slate-600 ring-1 ring-violet-100">
                          {record.explanation}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedRecord && (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700">
                      {selectedRecord.label.slice(0, 1)}
                    </div>

                    <div className="min-w-0">
                      <p className="font-medium text-slate-950">
                        {selectedRecord.label}
                      </p>

                      {(selectedRecord.baseEvent || selectedRecord.baseValue) && (
                        <p className="mt-1 text-sm text-slate-500">
                          {selectedRecord.baseEvent ?? "Evento base"}
                          {selectedRecord.baseValue
                            ? ` · ${selectedRecord.baseValue}`
                            : ""}
                        </p>
                      )}

                      {selectedRecord.contact && (
                        <p className="mt-1 text-sm text-slate-500">
                          {selectedRecord.contact}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    {message && (
                      <button
                        type="button"
                        onClick={onCopyMessage}
                        className="inline-flex h-9 flex-1 items-center justify-center rounded-xl bg-violet-600 px-3 text-sm font-medium text-white hover:bg-violet-700"
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copiar mensagem
                      </button>
                    )}

                    <button
                      type="button"
                      className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 px-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              )}
            </section>
          </>
        ) : (
          <>
            <div className="my-6 h-px bg-slate-100" />

            <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-600 shadow-sm">
                  <ShieldAlert className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-950">
                    Esta janela não gera lista de clientes
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    O Ohrly encontrou uma ação possível, mas ela não possui público
                    acionável suficiente para virar campanha. Neste caso, a saída
                    recomendada é tarefa, experimento ou qualificação manual.
                  </p>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </aside>
  );
}

function ActionableWindowsLoading() {
  return (
    <div className="mx-auto max-w-[1600px] px-5 py-8 sm:px-8 lg:px-10">
      <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        Carregando janelas acionáveis...
      </div>

      <div className="mt-6 h-10 w-72 animate-pulse rounded-2xl bg-slate-200" />
      <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded-xl bg-slate-200" />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-3xl border border-slate-200 bg-white"
          />
        ))}
      </div>

      <div className="mt-8 space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-40 animate-pulse rounded-3xl border border-slate-200 bg-white"
          />
        ))}
      </div>
    </div>
  );
}

function ActionableWindowsError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6">
      <div className="rounded-3xl border border-rose-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <AlertCircle className="h-6 w-6" />
        </div>

        <h1 className="mt-4 text-xl font-semibold text-slate-950">
          Não foi possível carregar as janelas acionáveis
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">{message}</p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex h-10 items-center rounded-2xl bg-violet-600 px-4 text-sm font-medium text-white hover:bg-violet-700"
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Tentar novamente
        </button>
      </div>
    </div>
  );
}

function ActionableWindowsEmpty() {
  return (
    <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
          <ListChecks className="h-6 w-6" />
        </div>

        <h1 className="mt-4 text-xl font-semibold text-slate-950">
          Nenhuma janela acionável encontrada
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Quando o Ohrly encontrar uma janela com ação possível, ela aparecerá
          aqui com motivo, registros e próximo passo sugerido.
        </p>
      </div>
    </div>
  );
}