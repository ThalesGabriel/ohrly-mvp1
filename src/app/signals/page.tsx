"use client";

import { useMemo, useState } from "react";
import {
    AlertTriangle,
    ArrowRight,
    BarChart2Icon,
    Bell,
    CheckCircle2,
    Clock,
    Eye,
    Filter,
    LineChart,
    MessageSquare,
    MoreHorizontal,
    MousePointerClick,
    RefreshCcw,
    Route,
    Search,
    ShieldCheck,
    ShoppingCart,
    Signal,
    Store,
    Target,
    User,
    Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AppShell } from "@/components/AppShell";

type SignalStatus =
    | "observing"
    | "persistent"
    | "relevant_to_goal"
    | "became_diagnostic"
    | "resolved"
    | "ignored";

type ImpactArea = "growth" | "customer" | "channel" | "margin" | "operation";

type SignalItem = {
    id: string;
    title: string;
    summary: string;
    status: SignalStatus;
    impactArea: ImpactArea;
    affectedIndicator: string;
    activeGoal: string;
    detectedAt: string;
    intensity: "baixa" | "média" | "alta";
    whatChanged: string[];
    possibleImpacts: string[];
    suggestedAction: string;
    relatedDiagnostics: string[];
    relatedWindows: string[];
    icon: LucideIcon;
};

const signals: SignalItem[] = [
    {
        id: "digital-conversion-drop",
        title: "Menos visitas estão virando pedido no digital",
        summary:
            "Desde o último ciclo, as visitas digitais seguem próximas do padrão, mas os pedidos não acompanharam.",
        status: "persistent",
        impactArea: "growth",
        affectedIndicator: "Conversão digital",
        activeGoal: "Digital como canal relevante",
        detectedAt: "Hoje, 14:20",
        intensity: "alta",
        whatChanged: [
            "Visitas digitais ficaram próximas do comportamento esperado.",
            "Carrinhos e intenção continuaram aparecendo.",
            "Pedidos digitais ficaram abaixo do padrão recente.",
        ],
        possibleImpacts: [
            "Menor participação do digital na receita.",
            "Mais dependência do WhatsApp ou do ponto de venda.",
            "Próximo diagnóstico pode reforçar intenção digital sem conversão.",
        ],
        suggestedAction:
            "Verificar frete, pagamento, retirada e se o WhatsApp está absorvendo dúvidas antes da compra.",
        relatedDiagnostics: [
            "Conversão digital",
            "Intenção digital sem compra",
            "Papel do digital na operação",
        ],
        relatedWindows: [
            "Conversão digital",
            "Abandono de intenção",
            "Canal/atendimento",
        ],
        icon: MousePointerClick,
    },
    {
        id: "anonymous-counter-sales",
        title: "Aumentou a venda sem comprador confiável no balcão",
        summary:
            "O ponto de venda continua concentrando receita, mas uma fatia maior veio sem telefone, CPF ou comprador confiável.",
        status: "relevant_to_goal",
        impactArea: "customer",
        affectedIndicator: "Memória de cliente",
        activeGoal: "Físico forte com digital de apoio",
        detectedAt: "Hoje, 11:05",
        intensity: "alta",
        whatChanged: [
            "Mais pedidos presenciais foram registrados com cliente genérico.",
            "A receita do canal dominante ficou menos rastreável.",
            "A base para recompra e campanhas ficou mais fraca.",
        ],
        possibleImpacts: [
            "Menos clientes acionáveis para pós-venda.",
            "Menor confiabilidade em análises de recompra.",
            "Diagnóstico mensal pode reforçar canal dominante sem memória de cliente.",
        ],
        suggestedAction:
            "Orientar balcão a capturar telefone ou CPF em pedidos acima de R$ 100 por 7 dias.",
        relatedDiagnostics: [
            "Receita sem comprador confiável",
            "Canal dominante sem memória de cliente",
            "Continuidade/recompra",
        ],
        relatedWindows: [
            "Measurability gap",
            "Channel measurability gap",
            "Recompra",
        ],
        icon: User,
    },
    {
        id: "digital-ticket-concentration",
        title: "Ticket digital concentrado em poucos produtos",
        summary:
            "Poucos produtos explicam uma parte relevante da receita digital recente.",
        status: "observing",
        impactArea: "channel",
        affectedIndicator: "Ticket digital e mix",
        activeGoal: "Digital como canal relevante",
        detectedAt: "Ontem, 17:40",
        intensity: "média",
        whatChanged: [
            "O digital gerou receita em poucos itens.",
            "A navegação não se distribuiu bem pelo catálogo.",
            "Itens complementares aparecem menos no online que no físico.",
        ],
        possibleImpacts: [
            "Digital pode estar funcionando como compra específica, não como canal amplo.",
            "Oportunidade de kits, recomendações e vitrines por categoria.",
            "Próximo diagnóstico pode apontar mix digital limitado.",
        ],
        suggestedAction:
            "Criar uma vitrine com produtos complementares aos itens digitais mais vendidos.",
        relatedDiagnostics: [
            "Qualidade da venda online",
            "Ticket/mix físico",
            "Venda complementar digital aprendendo com o físico",
        ],
        relatedWindows: ["Ticket por canal", "Mix digital", "Complementares"],
        icon: ShoppingCart,
    },
    {
        id: "discount-pressure-category",
        title: "Descontos subiram em uma categoria específica",
        summary:
            "A pressão de desconto ainda não é crítica no geral, mas uma categoria começou a concentrar reduções.",
        status: "observing",
        impactArea: "margin",
        affectedIndicator: "Margem e desconto",
        activeGoal: "Aumentar ticket médio",
        detectedAt: "Hoje, 09:10",
        intensity: "baixa",
        whatChanged: [
            "Desconto agregado segue sob controle.",
            "Uma categoria passou a receber descontos com mais frequência.",
            "Ainda não há sinal suficiente para virar diagnóstico.",
        ],
        possibleImpacts: [
            "Pode afetar margem se persistir.",
            "Pode indicar campanha, queima de estoque ou pressão competitiva.",
            "Pode distorcer leitura de ticket médio.",
        ],
        suggestedAction:
            "Confirmar se os descontos são campanha planejada ou ajuste informal de venda.",
        relatedDiagnostics: ["Pressão de desconto", "Ticket/mix", "Qualidade da venda"],
        relatedWindows: ["Margin pressure", "Ticket médio", "Mix por categoria"],
        icon: Wallet,
    },
];

const impactFilters: Array<{
    key: ImpactArea | "all";
    label: string;
    icon: LucideIcon;
}> = [
        { key: "all", label: "Todos", icon: Signal },
        { key: "growth", label: "Crescimento", icon: LineChart },
        { key: "customer", label: "Cliente", icon: User },
        { key: "channel", label: "Canal", icon: Store },
        { key: "margin", label: "Margem", icon: Wallet },
        { key: "operation", label: "Operação", icon: Route },
    ];

export default function SignalsPage() {
    const [selectedImpact, setSelectedImpact] = useState<ImpactArea | "all">(
        "all"
    );
    const [selectedSignalId, setSelectedSignalId] = useState(signals[0].id);

    const filteredSignals = useMemo(() => {
        if (selectedImpact === "all") {
            return signals;
        }

        return signals.filter((signal) => signal.impactArea === selectedImpact);
    }, [selectedImpact]);

    const selectedSignal =
        signals.find((signal) => signal.id === selectedSignalId) ??
        filteredSignals[0] ??
        signals[0];

    return (
        <AppShell>
            <section className="mt-8">
                <p className="text-sm font-bold uppercase tracking-wide text-violet-700">
                    Sinais da operação
                </p>

                <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                            O que mudou agora que pode afetar sua meta?
                        </h1>

                        <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
                            O Ohrly observa mudanças recentes de comportamento e traduz
                            esses sinais em impacto sobre indicadores, diagnósticos e
                            estratégia da loja.
                        </p>
                    </div>

                    <button className="flex w-fit items-center gap-2 rounded-2xl bg-violet-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-violet-800">
                        Atualizar sinais
                        <RefreshCcw className="h-5 w-5" />
                    </button>
                </div>
            </section>

            <SummaryCards />

            <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-sm font-bold text-slate-950">
                            Meta ativa: Digital como canal relevante
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                            Os sinais abaixo foram priorizados porque podem afetar a meta
                            calibrada no Mapa de Crescimento.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {impactFilters.map((filter) => (
                            <ImpactFilterButton
                                key={filter.key}
                                filter={filter}
                                active={selectedImpact === filter.key}
                                onClick={() => {
                                    setSelectedImpact(filter.key);
                                    const firstSignal =
                                        filter.key === "all"
                                            ? signals[0]
                                            : signals.find(
                                                (signal) => signal.impactArea === filter.key
                                            );

                                    if (firstSignal) {
                                        setSelectedSignalId(firstSignal.id);
                                    }
                                }}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <section className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[1fr_440px]">
                <SignalList
                    signals={filteredSignals}
                    selectedSignalId={selectedSignal.id}
                    onSelect={setSelectedSignalId}
                />

                <SignalDetail signal={selectedSignal} />
            </section>

            <section className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[1fr_420px]">
                <DiagnosticImpactPanel signal={selectedSignal} />
                <ActionPanel signal={selectedSignal} />
            </section>
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
                        Monitoramento calibrado pela meta da loja
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

function SummaryCards() {
    const cards = [
        {
            label: "Sinais ativos",
            value: "4",
            description: "mudanças recentes observadas",
            icon: Signal,
            tone: "violet",
        },
        {
            label: "Ligados à meta",
            value: "2",
            description: "podem afetar o digital",
            icon: Target,
            tone: "orange",
        },
        {
            label: "Persistentes",
            value: "1",
            description: "passou de variação normal",
            icon: AlertTriangle,
            tone: "rose",
        },
        {
            label: "Viraram diagnóstico",
            value: "0",
            description: "aguardando próximo consolidado",
            icon: CheckCircle2,
            tone: "emerald",
        },
    ] as const;

    return (
        <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
                <SummaryCard key={card.label} {...card} />
            ))}
        </section>
    );
}

function SummaryCard({
    label,
    value,
    description,
    icon: Icon,
    tone,
}: {
    label: string;
    value: string;
    description: string;
    icon: LucideIcon;
    tone: "violet" | "orange" | "rose" | "emerald";
}) {
    const styles = {
        violet: "bg-violet-100 text-violet-700",
        orange: "bg-orange-100 text-orange-700",
        rose: "bg-rose-100 text-rose-700",
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

function ImpactFilterButton({
    filter,
    active,
    onClick,
}: {
    filter: {
        key: ImpactArea | "all";
        label: string;
        icon: LucideIcon;
    };
    active: boolean;
    onClick: () => void;
}) {
    const Icon = filter.icon;

    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold transition",
                active
                    ? "border-violet-300 bg-violet-50 text-violet-700"
                    : "border-slate-200 bg-white text-slate-500 hover:border-violet-200 hover:text-violet-700",
            ].join(" ")}
        >
            <Icon className="h-4 w-4" />
            {filter.label}
        </button>
    );
}

function SignalList({
    signals,
    selectedSignalId,
    onSelect,
}: {
    signals: SignalItem[];
    selectedSignalId: string;
    onSelect: (id: string) => void;
}) {
    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-lg font-bold text-slate-950">
                        Sinais recentes
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Mudanças traduzidas para impacto de negócio.
                    </p>
                </div>

                <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-500">
                    <Search className="h-4 w-4" />
                    <span>Filtrar sinais</span>
                </div>
            </div>

            <div className="mt-5 space-y-3">
                {signals.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
                        <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-700" />
                        <p className="mt-4 text-sm font-bold text-slate-900">
                            Nenhum sinal nesta categoria
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                            Tente outro filtro ou aguarde a próxima leitura.
                        </p>
                    </div>
                ) : (
                    signals.map((signal) => (
                        <SignalListItem
                            key={signal.id}
                            signal={signal}
                            active={selectedSignalId === signal.id}
                            onClick={() => onSelect(signal.id)}
                        />
                    ))
                )}
            </div>
        </section>
    );
}

function SignalListItem({
    signal,
    active,
    onClick,
}: {
    signal: SignalItem;
    active: boolean;
    onClick: () => void;
}) {
    const Icon = signal.icon;
    const status = signalStatusConfig(signal.status);
    const impact = impactAreaConfig(signal.impactArea);

    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "w-full rounded-2xl border p-4 text-left transition",
                active
                    ? "border-violet-300 bg-violet-50 ring-4 ring-violet-100"
                    : "border-slate-200 bg-white hover:border-violet-200 hover:bg-violet-50/30",
            ].join(" ")}
        >
            <div className="flex gap-4">
                <div
                    className={[
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
                        status.iconBg,
                        status.iconColor,
                    ].join(" ")}
                >
                    <Icon className="h-6 w-6" />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <span
                            className={[
                                "rounded-full px-2.5 py-1 text-xs font-bold",
                                status.badge,
                            ].join(" ")}
                        >
                            {status.label}
                        </span>

                        <span
                            className={[
                                "rounded-full px-2.5 py-1 text-xs font-bold",
                                impact.badge,
                            ].join(" ")}
                        >
                            {impact.label}
                        </span>
                    </div>

                    <h3 className="mt-3 text-base font-bold text-slate-950">
                        {signal.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                        {signal.summary}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                        <span>{signal.detectedAt}</span>
                        <span>•</span>
                        <span>Afeta: {signal.affectedIndicator}</span>
                        <span>•</span>
                        <span>Intensidade {signal.intensity}</span>
                    </div>
                </div>
            </div>
        </button>
    );
}

function SignalDetail({ signal }: { signal: SignalItem }) {
    const Icon = signal.icon;
    const status = signalStatusConfig(signal.status);

    return (
        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div
                    className={[
                        "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl",
                        status.iconBg,
                        status.iconColor,
                    ].join(" ")}
                >
                    <Icon className="h-7 w-7" />
                </div>

                <span
                    className={[
                        "rounded-full px-3 py-1 text-xs font-bold",
                        status.badge,
                    ].join(" ")}
                >
                    {status.label}
                </span>
            </div>

            <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-950">
                {signal.title}
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
                {signal.summary}
            </p>

            <div className="mt-5 grid grid-cols-1 gap-3">
                <DetailBox label="Indicador afetado" value={signal.affectedIndicator} />
                <DetailBox label="Meta relacionada" value={signal.activeGoal} />
                <DetailBox label="Detectado" value={signal.detectedAt} />
            </div>

            <div className="mt-6 rounded-2xl border border-orange-100 bg-orange-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-orange-700">
                    O que mudou
                </p>

                <div className="mt-3 space-y-2">
                    {signal.whatChanged.map((item) => (
                        <div key={item} className="flex gap-2">
                            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-orange-700" />
                            <p className="text-sm leading-5 text-orange-950">{item}</p>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}

function DetailBox({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                {label}
            </p>
            <p className="mt-2 text-sm font-bold leading-6 text-slate-900">
                {value}
            </p>
        </div>
    );
}

function DiagnosticImpactPanel({ signal }: { signal: SignalItem }) {
    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wide text-violet-700">
                Como isso afeta o diagnóstico
            </p>

            <h2 className="mt-2 text-xl font-bold text-slate-950">
                Se persistir, esse sinal pode aparecer no próximo consolidado
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
                O sinal não é tratado como incidente isolado. Ele é uma evidência viva
                que pode explicar ou antecipar diagnósticos futuros.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <ConnectionColumn
                    icon={BarChart2Icon}
                    title="Impactos possíveis"
                    items={signal.possibleImpacts}
                />
                <ConnectionColumn
                    icon={Route}
                    title="Diagnósticos relacionados"
                    items={signal.relatedDiagnostics}
                />
                <ConnectionColumn
                    icon={LineChart}
                    title="Janelas e sinais"
                    items={signal.relatedWindows}
                />
            </div>
        </section>
    );
}

function BarChartIcon(props: React.ComponentProps<"svg">) {
    return <LineChart {...props} />;
}

function ConnectionColumn({
    icon: Icon,
    title,
    items,
}: {
    icon: LucideIcon;
    title: string;
    items: string[];
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2">
                <Icon className="h-5 w-5 text-violet-700" />
                <p className="text-sm font-bold text-slate-950">{title}</p>
            </div>

            <div className="mt-4 space-y-2">
                {items.map((item) => (
                    <div key={item} className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-700" />
                        <p className="text-sm leading-5 text-slate-600">{item}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ActionPanel({ signal }: { signal: SignalItem }) {
    return (
        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wide text-violet-700">
                Próxima ação sugerida
            </p>

            <h2 className="mt-2 text-xl font-bold text-slate-950">
                O que fazer com esse sinal?
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
                {signal.suggestedAction}
            </p>

            <div className="mt-6 space-y-3">
                <ActionButton icon={Eye} label="Acompanhar este sinal" primary />
                <ActionButton icon={ShieldCheck} label="Marcar como esperado" />
                <ActionButton icon={MessageSquare} label="Criar experimento" />
                <ActionButton icon={Route} label="Ver diagnóstico relacionado" />
            </div>
        </aside>
    );
}

function ActionButton({
    icon: Icon,
    label,
    primary = false,
}: {
    icon: LucideIcon;
    label: string;
    primary?: boolean;
}) {
    return (
        <button
            type="button"
            className={[
                "flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold transition",
                primary
                    ? "bg-violet-700 text-white hover:bg-violet-800"
                    : "border border-violet-200 bg-white text-violet-700 hover:bg-violet-50",
            ].join(" ")}
        >
            <Icon className="h-5 w-5" />
            {label}
        </button>
    );
}

function signalStatusConfig(status: SignalStatus) {
    switch (status) {
        case "persistent":
            return {
                label: "Persistente",
                badge: "bg-orange-100 text-orange-700",
                iconBg: "bg-orange-100",
                iconColor: "text-orange-700",
            };
        case "relevant_to_goal":
            return {
                label: "Relevante para meta",
                badge: "bg-rose-100 text-rose-700",
                iconBg: "bg-rose-100",
                iconColor: "text-rose-700",
            };
        case "became_diagnostic":
            return {
                label: "Virou diagnóstico",
                badge: "bg-violet-100 text-violet-700",
                iconBg: "bg-violet-100",
                iconColor: "text-violet-700",
            };
        case "resolved":
            return {
                label: "Resolvido",
                badge: "bg-emerald-100 text-emerald-700",
                iconBg: "bg-emerald-100",
                iconColor: "text-emerald-700",
            };
        case "ignored":
            return {
                label: "Ignorado",
                badge: "bg-slate-100 text-slate-700",
                iconBg: "bg-slate-100",
                iconColor: "text-slate-700",
            };
        case "observing":
        default:
            return {
                label: "Observando",
                badge: "bg-violet-100 text-violet-700",
                iconBg: "bg-violet-100",
                iconColor: "text-violet-700",
            };
    }
}

function impactAreaConfig(area: ImpactArea) {
    switch (area) {
        case "growth":
            return {
                label: "Crescimento",
                badge: "bg-violet-100 text-violet-700",
            };
        case "customer":
            return {
                label: "Cliente",
                badge: "bg-rose-100 text-rose-700",
            };
        case "channel":
            return {
                label: "Canal",
                badge: "bg-orange-100 text-orange-700",
            };
        case "margin":
            return {
                label: "Margem",
                badge: "bg-emerald-100 text-emerald-700",
            };
        case "operation":
        default:
            return {
                label: "Operação",
                badge: "bg-slate-100 text-slate-700",
            };
    }
}