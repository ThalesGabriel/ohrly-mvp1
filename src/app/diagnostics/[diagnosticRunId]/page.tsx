"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    AlertTriangle,
    Bell,
    CalendarDays,
    CheckCircle2,
    ChevronRight,
    CircleDollarSign,
    ClipboardCheck,
    Eye,
    FlaskConical,
    HelpCircle,
    Home,
    LayoutGrid,
    LineChart,
    Loader2,
    MessageSquare,
    MoreHorizontal,
    Settings,
    ShieldCheck,
    Store,
    Trash2,
    User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Severity = "critical" | "healthy" | "attention";

type TabKey = "overview" | "findings" | "observations" | "tracked_windows";

type DiagnosticReviewResponse = {
    diagnosticRunId: string;
    storeId: string;
    storeName: string;
    segmentKey: string;
    analyzedPeriod: string;
    reportDate: string;
    summary: {
        criticalFindings: number;
        observationsForReview: number;
        trackedWindows: number;
        exposedValue: number;
    };
    findings: FindingResponse[];
    observations: ObservationResponse[];
    trackedWindows: TrackedWindowResponse[];
};

type FindingResponse = {
    id: string;
    policyKey: string;
    metricKey: string;
    title: string;
    decisionQuestion: string;
    value: number;
    displayValue: string;
    severity: Severity;
    triggered: boolean;
    windowType: string;
    reference: {
        sourceType: string;
        confidence: string;
        notes: string;
        criticalMin: number;
    };
};

type ObservationResponse = {
    id: string;
    observationKey: string;
    policyKeys: string[];
    metricKeys: string[];
    windowTypes: string[];
    severities: string[];
    averageScore: number;
    findingCount: number;
    status: "NEEDS_REVIEW" | "VALIDATED" | "DISMISSED" | "EXPECTED_BEHAVIOR" | "NEEDS_MORE_CONTEXT";
    createdAt: string;
    evidence: EvidenceResponse[];
};

type EvidenceResponse = {
    label: string;
    metricKey: string;
    value: string;
    description: string;
};

type TrackedWindowResponse = {
    id: string;
    sourcePolicyKey: string;
    metricKey: string;
    windowType: string;
    baselineValue: number;
    status: string;
    firstDetectedAt: string;
    lastEvaluatedAt: string;
};

type ValidationStatus =
    | "VALIDATED"
    | "DISMISSED"
    | "EXPECTED_BEHAVIOR"
    | "NEEDS_MORE_CONTEXT";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_POLICY_API_BASE_URL ?? "http://localhost:8080";

export default function DiagnosticsPage() {
    const params = useParams<{ diagnosticRunId: string }>();
    const router = useRouter();

    const diagnosticRunId = params.diagnosticRunId;

    const [review, setReview] = useState<DiagnosticReviewResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [validatingObservationId, setValidatingObservationId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<TabKey>("observations");

    async function loadReview() {
        try {
            setError(null);

            const response = await fetch(
                `${API_BASE_URL}/api/policy-diagnostics/${diagnosticRunId}/review`,
                { cache: "no-store" }
            );

            if (!response.ok) {
                throw new Error("Não foi possível carregar o diagnóstico.");
            }

            const data = (await response.json()) as DiagnosticReviewResponse;
            setReview(data);
        } catch (exception) {
            setError(
                exception instanceof Error
                    ? exception.message
                    : "Erro inesperado ao carregar o diagnóstico."
            );
        } finally {
            setLoading(false);
        }
    }

    async function validateObservation(
        observationId: string,
        status: ValidationStatus,
        feedback: string
    ) {
        try {
            setValidatingObservationId(observationId);
            setError(null);

            const response = await fetch(
                `${API_BASE_URL}/api/policy-diagnostics/observations/${observationId}/validations`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        status,
                        feedback,
                        validatedBy: "thales",
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Não foi possível validar a observação.");
            }

            await loadReview();
            setActiveTab("tracked_windows");
        } catch (exception) {
            setError(
                exception instanceof Error
                    ? exception.message
                    : "Erro inesperado ao validar a observação."
            );
        } finally {
            setValidatingObservationId(null);
        }
    }

    useEffect(() => {
        void loadReview();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [diagnosticRunId]);

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#faf9ff] text-slate-950">
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
                    <Loader2 className="h-5 w-5 animate-spin text-violet-700" />
                    <span className="text-sm font-medium text-slate-700">
                        Carregando diagnóstico...
                    </span>
                </div>
            </main>
        );
    }

    if (!review) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#faf9ff] text-slate-950">
                <div className="rounded-2xl border border-rose-200 bg-white px-6 py-5 shadow-sm">
                    <p className="font-semibold text-rose-700">
                        {error ?? "Diagnóstico não encontrado."}
                    </p>
                </div>
            </main>
        );
    }

    const primaryObservation =
        review.observations.find((observation) => observation.status === "NEEDS_REVIEW") ??
        review.observations[0];

    return (
        <main className="min-h-screen bg-[#faf9ff] text-slate-950">
            <div className="flex min-h-screen">
                <Sidebar />

                <section className="flex min-w-0 flex-1 flex-col">
                    <Topbar storeName={review.storeName} />

                    <div className="mx-auto w-full max-w-7xl px-8 py-8">
                        <Header />

                        {error && (
                            <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-700">
                                {error}
                            </div>
                        )}

                        <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

                            <button
                                type="button"
                                onClick={() => router.push("/diagnostics/new")}
                                className="w-fit rounded-xl bg-violet-700 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-800"
                            >
                                Novo diagnóstico
                            </button>
                        </div>

                        <div className="mt-6">
                            {activeTab === "overview" && (
                                <OverviewTab
                                    review={review}
                                    onGoToObservations={() => setActiveTab("observations")}
                                    onGoToTrackedWindows={() => setActiveTab("tracked_windows")}
                                />
                            )}

                            {activeTab === "findings" && (
                                <FindingsTab findings={review.findings} />
                            )}

                            {activeTab === "observations" && (
                                <ObservationsTab
                                    observations={review.observations}
                                    findings={review.findings}
                                    validatingObservationId={validatingObservationId}
                                    onValidate={validateObservation}
                                />
                            )}

                            {activeTab === "tracked_windows" && (
                                <TrackedWindowsSection trackedWindows={review.trackedWindows} />
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

function Sidebar() {
    const items = [
        { label: "Início", icon: Home, active: false },
        { label: "Diagnósticos", icon: LineChart, active: true },
        { label: "Janelas", icon: LayoutGrid, active: false },
        { label: "Alertas", icon: Bell, active: false },
        { label: "Experimentos", icon: FlaskConical, active: false },
        { label: "Relatórios", icon: ClipboardCheck, active: false },
        { label: "Configurações", icon: Settings, active: false },
    ];

    return (
        <aside className="hidden w-24 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
            <div className="flex h-20 items-center justify-center border-b border-slate-100">
                <div className="text-2xl font-bold tracking-tight text-slate-950">
                    <span className="text-violet-600">O</span>hrly
                </div>
            </div>

            <nav className="flex flex-1 flex-col gap-1 px-2 py-6">
                {items.map((item) => {
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.label}
                            className={[
                                "flex flex-col items-center gap-1 rounded-2xl px-2 py-3 text-xs transition",
                                item.active
                                    ? "bg-violet-100 text-violet-700"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                            ].join(" ")}
                        >
                            <Icon className="h-5 w-5" />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="border-t border-slate-100 px-2 py-5">
                <button className="flex w-full flex-col items-center gap-1 rounded-2xl px-2 py-3 text-xs text-slate-500 hover:bg-slate-50">
                    <HelpCircle className="h-5 w-5" />
                    Ajuda
                </button>
            </div>
        </aside>
    );
}

function Topbar({ storeName }: { storeName: string }) {
    return (
        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">
            <div className="lg:hidden">
                <div className="text-2xl font-bold tracking-tight text-slate-950">
                    <span className="text-violet-600">O</span>hrly
                </div>
            </div>

            <div className="hidden text-sm text-slate-500 lg:block">
                Diagnósticos / {storeName}
            </div>

            <div className="flex items-center gap-5">
                <button className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-violet-600" />
                </button>

                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-700 font-semibold text-white">
                        T
                    </div>

                    <div className="hidden sm:block">
                        <p className="text-sm font-semibold text-slate-900">Thales</p>
                        <p className="text-xs text-slate-500">Admin</p>
                    </div>

                    <MoreHorizontal className="h-5 w-5 text-slate-400" />
                </div>
            </div>
        </header>
    );
}

function Header() {
    return (
        <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                Diagnóstico da operação
            </h1>
            <p className="text-base text-slate-600">
                Valide os achados encontrados e escolha o que vale acompanhar.
            </p>
        </div>
    );
}

function SummaryCards({ review }: { review: DiagnosticReviewResponse }) {
    const cards = [
        {
            label: "Findings críticos",
            value: String(review.summary.criticalFindings),
            icon: AlertTriangle,
            color: "text-rose-600",
            bg: "bg-rose-100",
        },
        {
            label: "Observações para revisão",
            value: String(review.summary.observationsForReview),
            icon: MessageSquare,
            color: "text-orange-600",
            bg: "bg-orange-100",
        },
        {
            label: "Janelas acompanhadas",
            value: String(review.summary.trackedWindows),
            icon: ClipboardCheck,
            color: "text-violet-700",
            bg: "bg-violet-100",
        },
        {
            label: "Valor exposto identificado",
            value: formatCurrency(review.summary.exposedValue),
            icon: CircleDollarSign,
            color: "text-emerald-700",
            bg: "bg-emerald-100",
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => {
                const Icon = card.icon;

                return (
                    <div
                        key={card.label}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                        <div className="flex items-start gap-4">
                            <div
                                className={[
                                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
                                    card.bg,
                                    card.color,
                                ].join(" ")}
                            >
                                <Icon className="h-6 w-6" />
                            </div>

                            <div>
                                <p className="text-sm font-medium text-slate-600">{card.label}</p>
                                <p className={["mt-4 text-3xl font-bold", card.color].join(" ")}>
                                    {card.value}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function ReportMetadata({ review }: { review: DiagnosticReviewResponse }) {
    return (
        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="space-y-5">
                <MetadataItem icon={Store} label="Loja:" value={review.storeName} />
                <MetadataItem
                    icon={CalendarDays}
                    label="Período analisado:"
                    value={review.analyzedPeriod}
                />
                <MetadataItem
                    icon={CalendarDays}
                    label="Data do relatório:"
                    value={formatDate(review.reportDate)}
                />
            </div>
        </aside>
    );
}

function MetadataItem({
    icon: Icon,
    label,
    value,
}: {
    icon: LucideIcon;
    label: string;
    value: string;
}) {
    return (
        <div className="flex gap-3">
            <Icon className="mt-0.5 h-5 w-5 shrink-0 text-slate-700" />
            <div>
                <p className="text-sm font-semibold text-slate-900">{label}</p>
                <p className="text-sm text-slate-600">{value}</p>
            </div>
        </div>
    );
}

function Tabs({
    activeTab,
    onTabChange,
}: {
    activeTab: TabKey;
    onTabChange: (tab: TabKey) => void;
}) {
    const tabs: Array<{ key: TabKey; label: string }> = [
        { key: "overview", label: "Visão geral" },
        { key: "findings", label: "Findings" },
        { key: "observations", label: "Observações" },
        { key: "tracked_windows", label: "Janelas acompanhadas" },
    ];

    return (
        <div className="border-b border-slate-200">
            <nav className="flex gap-8 overflow-x-auto">
                {tabs.map((tab) => {
                    const active = tab.key === activeTab;

                    return (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => onTabChange(tab.key)}
                            className={[
                                "whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-medium transition",
                                active
                                    ? "border-violet-700 text-violet-700"
                                    : "border-transparent text-slate-500 hover:text-slate-900",
                            ].join(" ")}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}

function OverviewTab({
    review,
    onGoToObservations,
    onGoToTrackedWindows,
}: {
    review: DiagnosticReviewResponse;
    onGoToObservations: () => void;
    onGoToTrackedWindows: () => void;
}) {
    const criticalFindings = review.findings.filter(
        (finding) => finding.severity === "critical"
    );

    const pendingObservations = review.observations.filter(
        (observation) => observation.status === "NEEDS_REVIEW"
    );

    return (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_420px]">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-bold text-slate-950">
                    Leitura inicial do diagnóstico
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                    O Ohrly encontrou {review.summary.criticalFindings} findings críticos,
                    {` ${review.summary.observationsForReview} `}observação para revisão e
                    {` ${review.summary.trackedWindows} `}janela acompanhada.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
                    {criticalFindings.map((finding) => (
                        <div
                            key={finding.id}
                            className="rounded-2xl border border-rose-100 bg-rose-50 p-4"
                        >
                            <p className="text-sm font-bold text-slate-900">
                                {finding.title}
                            </p>
                            <p className="mt-4 text-3xl font-bold text-rose-600">
                                {finding.displayValue}
                            </p>
                            <p className="mt-2 text-xs text-slate-500">
                                {finding.metricKey}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={onGoToObservations}
                        className="rounded-xl bg-violet-700 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-800"
                    >
                        Revisar observações
                    </button>

                    <button
                        type="button"
                        onClick={onGoToTrackedWindows}
                        className="rounded-xl border border-violet-200 bg-white px-4 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-50"
                    >
                        Ver janelas acompanhadas
                    </button>
                </div>
            </section>

            <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-bold text-slate-950">
                    Pendências
                </h2>

                <div className="mt-5 space-y-3">
                    <div className="rounded-2xl border border-slate-200 p-4">
                        <p className="text-sm font-semibold text-slate-900">
                            Observações pendentes
                        </p>
                        <p className="mt-3 text-3xl font-bold text-orange-600">
                            {pendingObservations.length}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 p-4">
                        <p className="text-sm font-semibold text-slate-900">
                            Janelas acompanhadas
                        </p>
                        <p className="mt-3 text-3xl font-bold text-violet-700">
                            {review.trackedWindows.length}
                        </p>
                    </div>
                </div>
            </aside>
        </div>
    );
}

function FindingsTab({ findings }: { findings: FindingResponse[] }) {
    return (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_420px]">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-bold text-slate-950">
                    Todos os findings
                </h2>

                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                    {findings.map((finding) => (
                        <FindingDetailCard key={finding.id} finding={finding} />
                    ))}
                </div>
            </section>

            <FindingsPanel findings={findings} />
        </div>
    );
}

function FindingDetailCard({ finding }: { finding: FindingResponse }) {
    const critical = finding.severity === "critical";

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-bold text-slate-950">
                        {finding.title}
                    </p>

                    <p className="mt-2 text-xs text-slate-400">
                        {finding.policyKey} / {finding.metricKey}
                    </p>
                </div>

                <span
                    className={[
                        "rounded-full px-2.5 py-1 text-xs font-bold",
                        critical
                            ? "bg-rose-100 text-rose-700"
                            : "bg-emerald-100 text-emerald-700",
                    ].join(" ")}
                >
                    {critical ? "Crítico" : "Saudável"}
                </span>
            </div>

            <p
                className={[
                    "mt-5 text-4xl font-bold",
                    critical ? "text-rose-600" : "text-emerald-700",
                ].join(" ")}
            >
                {finding.displayValue}
            </p>

            <p className="mt-4 text-sm leading-6 text-slate-600">
                {finding.decisionQuestion}
            </p>

            <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
                Referência crítica: {formatDecimal(finding.reference.criticalMin)}
                {" · "}
                Confiança: {finding.reference.confidence}
            </div>
        </div>
    );
}

function ObservationsTab({
    observations,
    findings,
    validatingObservationId,
    onValidate,
}: {
    observations: ObservationResponse[];
    findings: FindingResponse[];
    validatingObservationId: string | null;
    onValidate: (
        observationId: string,
        status: ValidationStatus,
        feedback: string
    ) => Promise<void>;
}) {
    const primaryObservation =
        observations.find((observation) => observation.status === "NEEDS_REVIEW") ??
        observations[0];

    return (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_420px]">
            <ObservationReviewCard
                observation={primaryObservation}
                validating={validatingObservationId === primaryObservation?.id}
                onValidate={onValidate}
            />

            <div className="space-y-5">
                <ObservationList observations={observations} />
                <FindingsPanel findings={findings} />
            </div>
        </div>
    );
}

function ObservationList({
    observations,
}: {
    observations: ObservationResponse[];
}) {
    return (
        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">
                Observações detectadas
            </h2>

            {observations.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500">
                    Nenhuma observação composta foi detectada neste diagnóstico.
                </p>
            ) : (
                <div className="mt-5 space-y-3">
                    {observations.map((observation) => (
                        <div
                            key={observation.id}
                            className="rounded-2xl border border-slate-200 bg-white p-4"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-sm font-semibold text-slate-900">
                                    {observation.findingCount} findings combinados
                                </p>

                                <StatusPill status={observation.status} />
                            </div>

                            <p className="mt-3 break-all text-xs text-slate-400">
                                {observation.observationKey}
                            </p>

                            <p className="mt-3 text-sm text-slate-600">
                                Score médio: {formatDecimal(observation.averageScore)}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </aside>
    );
}

function ObservationReviewCard({
    observation,
    validating,
    onValidate,
}: {
    observation?: ObservationResponse;
    validating: boolean;
    onValidate: (
        observationId: string,
        status: ValidationStatus,
        feedback: string
    ) => Promise<void>;
}) {
    const [feedback, setFeedback] = useState("");

    const evidence = useMemo(() => observation?.evidence ?? [], [observation]);

    if (!observation) {
        return (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-bold text-slate-950">Observações</h2>
                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
                    <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
                    <h3 className="mt-4 text-lg font-bold text-slate-950">
                        Nenhuma observação pendente
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                        Quando combinações críticas aparecerem juntas, elas serão exibidas aqui.
                    </p>
                </div>
            </section>
        );
    }

    const canReview = observation.status === "NEEDS_REVIEW";

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-lg font-bold text-slate-950">
                    Observação para revisão
                </h2>

                <StatusPill status={observation.status} />
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                        <AlertTriangle className="h-7 w-7" />
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-slate-950">
                            Canal dominante + perda de memória de cliente
                        </h3>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                            {observation.findingCount} achados críticos apareceram juntos.
                            Essa combinação ainda não é uma policy; é uma observação validável.
                        </p>

                        <p className="mt-2 break-all text-xs text-slate-400">
                            {observation.observationKey}
                        </p>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
                    {evidence.map((item) => {
                        const Icon = iconForMetric(item.metricKey);

                        return (
                            <div
                                key={item.metricKey}
                                className="rounded-2xl border border-rose-100 bg-rose-50 p-4"
                            >
                                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    <Icon className="h-5 w-5 text-rose-600" />
                                    {item.label}
                                </div>

                                <p className="mt-4 text-3xl font-bold text-rose-600">
                                    {item.value}
                                </p>

                                <p className="mt-2 text-sm leading-5 text-slate-700">
                                    {item.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {canReview ? (
                    <>
                        <div className="mt-6 border-t border-slate-200 pt-5">
                            <p className="text-center text-sm font-bold text-slate-900">
                                Como você quer classificar esta observação?
                            </p>

                            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
                                <ValidationButton
                                    disabled={validating}
                                    icon={CheckCircle2}
                                    label="Validar como relevante"
                                    variant="primary"
                                    onClick={() =>
                                        onValidate(observation.id, "VALIDATED", feedback)
                                    }
                                />

                                <ValidationButton
                                    disabled={validating}
                                    icon={ShieldCheck}
                                    label="É esperado"
                                    variant="secondary"
                                    onClick={() =>
                                        onValidate(observation.id, "EXPECTED_BEHAVIOR", feedback)
                                    }
                                />

                                <ValidationButton
                                    disabled={validating}
                                    icon={HelpCircle}
                                    label="Mais contexto"
                                    variant="secondary"
                                    onClick={() =>
                                        onValidate(observation.id, "NEEDS_MORE_CONTEXT", feedback)
                                    }
                                />

                                <ValidationButton
                                    disabled={validating}
                                    icon={Trash2}
                                    label="Descartar"
                                    variant="danger"
                                    onClick={() =>
                                        onValidate(observation.id, "DISMISSED", feedback)
                                    }
                                />
                            </div>
                        </div>

                        <div className="mt-5">
                            <label className="text-sm font-semibold text-slate-800">
                                Comentário
                            </label>

                            <div className="relative mt-2">
                                <textarea
                                    value={feedback}
                                    onChange={(event) => setFeedback(event.target.value)}
                                    maxLength={500}
                                    rows={4}
                                    placeholder="Ex.: Isso acontece no balcão e afeta campanhas e recompra."
                                    className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                                />
                                <span className="absolute bottom-3 right-4 text-xs text-slate-400">
                                    {feedback.length}/500
                                </span>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-800">
                        Esta observação já foi classificada como {statusLabel(observation.status)}.
                    </div>
                )}
            </div>
        </section>
    );
}

function ValidationButton({
    icon: Icon,
    label,
    variant,
    disabled,
    onClick,
}: {
    icon: LucideIcon;
    label: string;
    variant: "primary" | "secondary" | "danger";
    disabled: boolean;
    onClick: () => void;
}) {
    const className =
        variant === "primary"
            ? "bg-violet-700 text-white shadow-sm hover:bg-violet-800"
            : variant === "danger"
                ? "border border-rose-200 bg-white text-rose-600 hover:bg-rose-50"
                : "border border-violet-200 bg-white text-violet-700 hover:bg-violet-50";

    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={[
                "flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
                className,
            ].join(" ")}
        >
            {disabled ? <Loader2 className="h-5 w-5 animate-spin" /> : <Icon className="h-5 w-5" />}
            {label}
        </button>
    );
}

function FindingsPanel({ findings }: { findings: FindingResponse[] }) {
    return (
        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">Findings individuais</h2>

            <div className="mt-5 space-y-3">
                {findings.map((finding) => (
                    <FindingCard key={finding.id} finding={finding} />
                ))}
            </div>
        </aside>
    );
}

function FindingCard({ finding }: { finding: FindingResponse }) {
    const critical = finding.severity === "critical";

    return (
        <button className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-violet-200 hover:bg-violet-50/40">
            <div className="flex items-start gap-3">
                <div
                    className={[
                        "mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                        critical
                            ? "bg-rose-100 text-rose-600"
                            : "bg-emerald-100 text-emerald-700",
                    ].join(" ")}
                >
                    {critical ? (
                        <AlertTriangle className="h-5 w-5" />
                    ) : (
                        <CheckCircle2 className="h-5 w-5" />
                    )}
                </div>

                <div>
                    <p className="max-w-[210px] text-sm font-semibold text-slate-900">
                        {finding.title}
                    </p>

                    <span
                        className={[
                            "mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-bold",
                            critical
                                ? "bg-rose-100 text-rose-700"
                                : "bg-emerald-100 text-emerald-700",
                        ].join(" ")}
                    >
                        {critical ? "Crítico" : "Saudável"}
                    </span>

                    <p className="mt-2 max-w-[230px] truncate text-xs text-slate-400">
                        {finding.metricKey}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-slate-950">
                    {finding.displayValue}
                </span>
                <ChevronRight className="h-5 w-5 text-slate-400" />
            </div>
        </button>
    );
}

function TrackedWindowsSection({
    trackedWindows,
}: {
    trackedWindows: TrackedWindowResponse[];
}) {
    return (
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">Janelas acompanhadas</h2>

            {trackedWindows.length === 0 ? (
                <TrackedWindowsEmptyState />
            ) : (
                <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <div className="grid grid-cols-4 gap-4 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        <span>Janela</span>
                        <span>Baseline</span>
                        <span>Status</span>
                        <span>Última avaliação</span>
                    </div>

                    {trackedWindows.map((window) => (
                        <div
                            key={window.id}
                            className="grid grid-cols-4 gap-4 border-t border-slate-200 px-5 py-4 text-sm text-slate-700"
                        >
                            <span className="break-words font-medium text-slate-900">
                                {window.sourcePolicyKey}
                            </span>
                            <span>{formatDecimal(window.baselineValue)}</span>
                            <span className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                {window.status}
                            </span>
                            <span>{formatDateTime(window.lastEvaluatedAt)}</span>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

function TrackedWindowsEmptyState() {
    return (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white px-5 py-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                <Eye className="h-8 w-8" />
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-950">
                Nenhuma janela acompanhada ainda
            </h3>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
                Quando você validar uma observação como relevante, ela aparecerá aqui
                para acompanhamento nos próximos diagnósticos.
            </p>
        </div>
    );
}

function StatusPill({ status }: { status: ObservationResponse["status"] }) {
    const style =
        status === "VALIDATED"
            ? "bg-emerald-100 text-emerald-700"
            : status === "DISMISSED"
                ? "bg-rose-100 text-rose-700"
                : status === "NEEDS_REVIEW"
                    ? "bg-violet-100 text-violet-700"
                    : "bg-orange-100 text-orange-700";

    return (
        <span
            className={[
                "rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide",
                style,
            ].join(" ")}
        >
            {status}
        </span>
    );
}

function iconForMetric(metricKey: string): LucideIcon {
    if (metricKey === "top_channel_revenue_share") {
        return LineChart;
    }

    if (metricKey === "top_channel_unidentified_revenue_share") {
        return User;
    }

    if (metricKey === "unidentified_revenue_share") {
        return Eye;
    }

    return AlertTriangle;
}

function statusLabel(status: ObservationResponse["status"]) {
    const labels: Record<ObservationResponse["status"], string> = {
        NEEDS_REVIEW: "precisa de revisão",
        VALIDATED: "relevante",
        DISMISSED: "descartada",
        EXPECTED_BEHAVIOR: "comportamento esperado",
        NEEDS_MORE_CONTEXT: "precisa de mais contexto",
    };

    return labels[status];
}

function formatCurrency(value: number) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value);
}

function formatDecimal(value: number) {
    return new Intl.NumberFormat("pt-BR", {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
    }).format(value);
}

function formatDate(value: string) {
    if (!value) return "-";

    const date = new Date(`${value}T00:00:00`);

    return new Intl.DateTimeFormat("pt-BR").format(date);
}

function formatDateTime(value: string) {
    if (!value) return "-";

    return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(new Date(value));
}