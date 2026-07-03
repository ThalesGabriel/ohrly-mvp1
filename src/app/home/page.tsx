"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { ClaimFreeReadingAccountModal } from "@/components/free-reading/ClaimFreeReadingAccountModal";

import { AppShell } from "@/components/AppShell";
import { supabase } from "@/lib/supabase/client";
import {
    ArrowRight,
    BarChart3,
    Box,
    CalendarDays,
    CheckCircle2,
    DollarSign,
    FileSpreadsheet,
    History,
    Layers3,
    LineChart,
    Lock,
    Package,
    Percent,
    Plus,
    ShieldCheck,
    Sparkles,
    Star,
    Sun,
    Tags,
    TrendingDown,
    TrendingUp,
    Upload,
    UserPlus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { ColumnMapping, ColumnMappingModal, ColumnPreview } from "@/components/free-reading/ColumnMappingModal";
import { PaidPlanPolicy, PolicyPaidPlanModal } from "@/components/free-reading/PolicyPaidPlanModal";

type Tone = "green" | "blue" | "orange" | "violet" | "rose" | "amber";

type SummaryRow = {
    store_id: string;
    sold_date: string;
    total_revenue: number | null;
    total_cmv: number | null;
    gross_profit: number | null;
    average_margin: number | null;
    items_sold: number | null;
    orders_count: number | null;
    items_with_known_cost: number | null;
    items_with_missing_cost: number | null;
    margin_quality: "real" | "partial" | "unavailable" | null;
};

type FreeReadingByDate = {
    summary: SummaryRow | null;
    previousSummary: SummaryRow | null;
    productMix: ProductMixRow[];
    shiftSummary: ShiftSummaryRow[];
};

type FreeReadingsByDate = Record<string, FreeReadingByDate>;

type ProductMixRow = {
    store_id: string;
    sold_date: string;
    product_name: string;
    product_sku: string | null;
    product_role: string | null;
    is_complementary: boolean | null;
    quantity_sold: number | null;
    revenue: number | null;
    cmv: number | null;
    gross_profit: number | null;
    margin_rate: number | null;
    margin_quality: "real" | "partial" | "unavailable" | null;
    ohrly_mix_group: string | null;
};

type BaseDateRange = {
    daysWithSales: number;
    minSoldDate: string | null;
    maxSoldDate: string | null;
};

type ShiftSummaryRow = {
    store_id: string;
    sold_date: string;
    shift_bucket: string;
    revenue: number | null;
    cmv: number | null;
    gross_profit: number | null;
    average_margin: number | null;
    items_sold: number | null;
    orders_count: number | null;
    complementary_items_sold: number | null;
    complementary_revenue: number | null;
    complementary_gross_profit: number | null;
};

type MonthlyShiftRow = {
    store_id: string;
    month_start: string;
    morning_revenue: number | null;
    afternoon_revenue: number | null;
    best_shift: string | null;
};

type ProductGroup = {
    title: string;
    description: string;
    icon: LucideIcon;
    tone: "green" | "blue" | "orange" | "violet";
    products: ProductMixRow[];
};

type SummaryCardData = {
    label: string;
    value: string;
    helper: string;
    icon: LucideIcon;
    tone: Tone;
};

type PolicyReading = {
    id: string;
    title: string;
    status: "Atenção" | "Variação" | "Normal" | "Parcial";
    confidence: "Alta" | "Média" | "Baixa";
    impact: string;
    message: string;
    freeReading: string;
    paidCta: string;
    icon: LucideIcon;
    tone: "green" | "blue" | "orange" | "violet" | "amber";
};

type OrganizationMembershipRow = {
    id: string;
    organization_id: string;
    user_id: string;
    role: "owner" | "admin" | "member";
};

type OrganizationRow = {
    id: string;
    name: string;
    slug: string;
};

type StoreRow = {
    id: string;
    organization_id: string;
    name: string;
    slug: string;
    platform: string | null;
    timezone: string | null;
};

type ActiveStoreContext = {
    organization: OrganizationRow;
    membership: OrganizationMembershipRow;
    store: StoreRow;
};

const productGroupConfig = [
    {
        key: "Produtos que puxaram lucro",
        title: "Produtos que puxaram lucro",
        description: "Boa margem e contribuição relevante",
        icon: TrendingUp,
        tone: "green" as const,
    },
    {
        key: "Produtos que giraram caixa",
        title: "Produtos que giraram caixa",
        description: "Boa venda, mas menor leitura de margem",
        icon: BarChart3,
        tone: "blue" as const,
    },
    {
        key: "Produtos com margem fraca",
        title: "Produtos com margem fraca",
        description: "Vendidos, mas com baixa contribuição",
        icon: TrendingDown,
        tone: "orange" as const,
    },
    {
        key: "Candidatos a oferta/comissão",
        title: "Candidatos a oferta/comissão",
        description: "Podem entrar em teste amanhã",
        icon: Tags,
        tone: "violet" as const,
    },
];

export default function DailyReadingPage() {
    const [usesClaimedFreeReadingData, setUsesClaimedFreeReadingData] = useState(false);
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [mappingModalOpen, setMappingModalOpen] = useState(false);
    const [columnPreview, setColumnPreview] = useState<ColumnPreview[]>([]);
    const [claimAccountModalOpen, setClaimAccountModalOpen] = useState(false);
    const [suggestedMapping, setSuggestedMapping] = useState<Partial<ColumnMapping>>({});
    const [isPreviewLoading, setIsPreviewLoading] = useState(false);
    const [baseDateRange, setBaseDateRange] = useState<BaseDateRange | null>(null);
    const [freeReadingsByDate, setFreeReadingsByDate] = useState<FreeReadingsByDate>({});
    const [paidPlanModalOpen, setPaidPlanModalOpen] = useState(false);
    const [selectedPaidPolicy, setSelectedPaidPolicy] =
        useState<PaidPlanPolicy | null>(null);

    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [sessionToken, setSessionToken] = useState<string | null>(null);
    const [hasResolvedSessionMode, setHasResolvedSessionMode] = useState(false);

    const isFreeReadingSession = hasResolvedSessionMode && Boolean(sessionToken);

    const [selectedDate, setSelectedDate] = useState("");
    const [fileName, setFileName] = useState("base histórica");

    const [activeContext, setActiveContext] = useState<ActiveStoreContext | null>(
        null,
    );

    const [summary, setSummary] = useState<SummaryRow | null>(null);
    const [previousSummary, setPreviousSummary] = useState<SummaryRow | null>(
        null,
    );
    const [productMix, setProductMix] = useState<ProductMixRow[]>([]);
    const [shiftSummary, setShiftSummary] = useState<ShiftSummaryRow[]>([]);
    const [monthlyShiftRows, setMonthlyShiftRows] = useState<MonthlyShiftRow[]>(
        [],
    );

    const [isLoadingStore, setIsLoadingStore] = useState(true);
    const [isLoadingLatestDate, setIsLoadingLatestDate] = useState(true);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [freeReadingReady, setFreeReadingReady] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        setSessionToken(params.get("session"));
        setHasResolvedSessionMode(true);
    }, []);

    function handleOpenPaidPlanModal(policy: PolicyReading) {
        setSelectedPaidPolicy({
            id: policy.id,
            title: policy.title,
            status: policy.status,
            impact: policy.impact,
            message: policy.message,
            freeReading: policy.freeReading,
        });

        setPaidPlanModalOpen(true);
    }

    function applyFreeReadingDate(
        date: string,
        source: FreeReadingsByDate = freeReadingsByDate,
    ) {
        const reading = source[date];

        if (!reading) {
            setSummary(null);
            setPreviousSummary(null);
            setProductMix([]);
            setShiftSummary([]);
            return;
        }

        setSummary(reading.summary ?? null);
        setPreviousSummary(reading.previousSummary ?? null);
        setProductMix(reading.productMix ?? []);
        setShiftSummary(reading.shiftSummary ?? []);
    }

    function handleSelectedDateChange(value: string) {
        setSelectedDate(value);

        if (isFreeReadingSession || usesClaimedFreeReadingData) {
            applyFreeReadingDate(value);
        }
    }

    async function loadLatestClaimedFreeReading(storeId: string) {
        const { data, error } = await supabase
            .from("free_reading_uploads")
            .select(
                `
      file_name,
      selected_date,
      date_range,
      summary,
      previous_summary,
      product_mix,
      shift_summary,
      monthly_shift_rows,
      readings_by_date,
      created_at
    `,
            )
            .eq("store_id", storeId)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

        if (error) {
            throw error;
        }

        if (!data) {
            return false;
        }

        const readingsByDate = (data.readings_by_date ?? {}) as FreeReadingsByDate;

        const initialDate =
            data.selected_date ??
            Object.keys(readingsByDate).sort().at(-1) ??
            "";

        setUsesClaimedFreeReadingData(true);
        setFileName(data.file_name ? `base importada: ${data.file_name}` : "base importada");

        setFreeReadingsByDate(readingsByDate);
        setSelectedDate(initialDate);
        setBaseDateRange((data.date_range as BaseDateRange) ?? null);
        setMonthlyShiftRows((data.monthly_shift_rows as MonthlyShiftRow[]) ?? []);

        if (initialDate && readingsByDate[initialDate]) {
            applyFreeReadingDate(initialDate, readingsByDate);
        } else {
            setSummary((data.summary as SummaryRow | null) ?? null);
            setPreviousSummary((data.previous_summary as SummaryRow | null) ?? null);
            setProductMix((data.product_mix as ProductMixRow[]) ?? []);
            setShiftSummary((data.shift_summary as ShiftSummaryRow[]) ?? []);
        }

        return true;
    }

    async function handleFileChange(file?: File) {
        if (!file) return;

        try {
            setPendingFile(file);
            setFileName(file.name);
            setErrorMessage(null);
            setIsPreviewLoading(true);

            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/free-readings/preview", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                setErrorMessage(result.error ?? "Erro ao ler prévia da planilha.");
                return;
            }

            setColumnPreview(result.columns ?? []);
            setSuggestedMapping(result.suggestedMapping ?? {});

            setMappingModalOpen(true);
        } catch (error) {
            console.error("[handleFileChange]", error);
            setErrorMessage("Erro inesperado ao ler prévia da planilha.");
        } finally {
            setIsPreviewLoading(false);
        }
    }

    async function handleConfirmColumnMapping(mapping: ColumnMapping) {
        if (!pendingFile || !sessionToken) return;

        setMappingModalOpen(false);
        setIsLoadingData(true);
        setErrorMessage(null);

        const formData = new FormData();
        formData.append("file", pendingFile);
        formData.append("sessionToken", sessionToken);
        formData.append("columnMapping", JSON.stringify(mapping));

        const response = await fetch("/api/free-readings/upload", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
            setErrorMessage(result.error ?? "Erro ao gerar leitura gratuita.");
            setIsLoadingData(false);
            return;
        }

        const readingsByDate = result.readingsByDate ?? {};
        const initialDate =
            result.selectedDate ??
            result.summary?.sold_date ??
            Object.keys(readingsByDate).sort().at(-1) ??
            "";

        setFreeReadingsByDate(readingsByDate);
        setSelectedDate(initialDate);
        setBaseDateRange(result.dateRange ?? null);
        setMonthlyShiftRows(result.monthlyShiftRows ?? []);

        if (readingsByDate[initialDate]) {
            applyFreeReadingDate(initialDate, readingsByDate);
        } else {
            setSummary(result.summary ?? null);
            setPreviousSummary(result.previousSummary ?? null);
            setProductMix(result.productMix ?? []);
            setShiftSummary(result.shiftSummary ?? []);
        }

        setFreeReadingReady(true);
        setIsLoadingData(false);
    }

    async function handleFreeReadingUpload(file: File, token: string) {
        const formData = new FormData();

        formData.append("file", file);
        formData.append("sessionToken", token);

        const response = await fetch("/api/free-readings/upload", {
            method: "POST",
            body: formData,
        });

        const rawResponse = await response.text();

        let result: {
            error?: string;
            selectedDate?: string;
            summary?: SummaryRow | null;
            previousSummary?: SummaryRow | null;
            productMix?: ProductMixRow[];
            shiftSummary?: ShiftSummaryRow[];
            monthlyShiftRows?: MonthlyShiftRow[];
        };

        try {
            result = JSON.parse(rawResponse);
        } catch {
            console.error("Resposta não JSON da API:", rawResponse);

            setErrorMessage(
                "A API de upload não retornou JSON. Verifique se /api/free-readings/upload existe.",
            );
            setIsLoadingData(false);
            return;
        }

        if (!response.ok) {
            setErrorMessage(result.error ?? "Erro ao gerar leitura gratuita.");
            setIsLoadingData(false);
            return;
        }

        setSelectedDate(result.selectedDate ?? result.summary?.sold_date ?? "");
        setSummary(result.summary ?? null);
        setPreviousSummary(result.previousSummary ?? null);
        setProductMix(result.productMix ?? []);
        setShiftSummary(result.shiftSummary ?? []);
        setMonthlyShiftRows(result.monthlyShiftRows ?? []);

        setFreeReadingReady(true);
        setIsLoadingData(false);
    }

    useEffect(() => {
        async function loadUserStoreContext() {
            if (!hasResolvedSessionMode) return;

            if (isFreeReadingSession) {
                setIsLoadingStore(false);
                setIsLoadingLatestDate(false);
                setFileName("nenhuma planilha enviada");
                return;
            }

            setIsLoadingStore(true);
            setErrorMessage(null);

            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError) {
                setErrorMessage(userError.message);
                setIsLoadingStore(false);
                return;
            }

            if (!user) {
                router.replace("/login");
                return;
            }

            const { data: membership, error: membershipError } = await supabase
                .from("organization_memberships")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: true })
                .limit(1)
                .maybeSingle();

            if (membershipError) {
                setErrorMessage(membershipError.message);
                setIsLoadingStore(false);
                return;
            }

            if (!membership) {
                setErrorMessage(
                    "Sua conta ainda não está vinculada a nenhuma organização.",
                );
                setIsLoadingStore(false);
                return;
            }

            const [organizationResult, storeResult] = await Promise.all([
                supabase
                    .from("organizations")
                    .select("*")
                    .eq("id", membership.organization_id)
                    .maybeSingle(),

                supabase
                    .from("stores")
                    .select("*")
                    .eq("organization_id", membership.organization_id)
                    .order("created_at", { ascending: true })
                    .limit(1)
                    .maybeSingle(),
            ]);

            if (organizationResult.error) {
                setErrorMessage(organizationResult.error.message);
                setIsLoadingStore(false);
                return;
            }

            if (storeResult.error) {
                setErrorMessage(storeResult.error.message);
                setIsLoadingStore(false);
                return;
            }

            if (!organizationResult.data || !storeResult.data) {
                setErrorMessage(
                    "Não encontramos uma loja vinculada à sua organização.",
                );
                setIsLoadingStore(false);
                return;
            }

            setActiveContext({
                organization: organizationResult.data as OrganizationRow,
                membership: membership as OrganizationMembershipRow,
                store: storeResult.data as StoreRow,
            });

            setFileName(`base histórica ${storeResult.data.name}`);
            setIsLoadingStore(false);
        }

        loadUserStoreContext();
    }, [router, hasResolvedSessionMode, isFreeReadingSession]);

    useEffect(() => {
        async function loadLatestDate() {
            if (!hasResolvedSessionMode || isFreeReadingSession) return;
            if (!activeContext?.store.id) return;

            setIsLoadingLatestDate(true);
            setErrorMessage(null);

            const { data, error } = await supabase
                .from("daily_operational_summary")
                .select("sold_date")
                .eq("store_id", activeContext.store.id)
                .order("sold_date", { ascending: false })
                .limit(1)
                .maybeSingle();

            if (error) {
                setErrorMessage(error.message);
                setIsLoadingLatestDate(false);
                return;
            }

            if (data?.sold_date) {
                setUsesClaimedFreeReadingData(false);
                setSelectedDate(data.sold_date);
                setIsLoadingLatestDate(false);
                return;
            }

            try {
                const loadedClaimedReading = await loadLatestClaimedFreeReading(
                    activeContext.store.id,
                );

                if (!loadedClaimedReading) {
                    setSelectedDate("");
                }
            } catch (claimError) {
                console.error("[loadLatestClaimedFreeReading]", claimError);
                setErrorMessage(
                    "Não encontramos leitura operacional nem leitura gratuita salva para esta conta.",
                );
            } finally {
                setIsLoadingLatestDate(false);
            }
        }

        loadLatestDate();
    }, [activeContext?.store.id, hasResolvedSessionMode, isFreeReadingSession]);

    useEffect(() => {
        async function loadDashboardData() {
            if (!hasResolvedSessionMode || isFreeReadingSession || usesClaimedFreeReadingData) {
                return;
            }
            if (!activeContext?.store.id || !selectedDate) return;

            setIsLoadingData(true);
            setErrorMessage(null);

            const storeId = activeContext.store.id;

            const [
                summaryResult,
                previousSummaryResult,
                productMixResult,
                shiftSummaryResult,
                monthlyShiftResult,
            ] = await Promise.all([
                supabase
                    .from("daily_operational_summary")
                    .select("*")
                    .eq("store_id", storeId)
                    .eq("sold_date", selectedDate)
                    .maybeSingle(),

                supabase
                    .from("daily_operational_summary")
                    .select("*")
                    .eq("store_id", storeId)
                    .lt("sold_date", selectedDate)
                    .order("sold_date", { ascending: false })
                    .limit(1)
                    .maybeSingle(),

                supabase
                    .from("daily_product_mix_classified")
                    .select("*")
                    .eq("store_id", storeId)
                    .eq("sold_date", selectedDate)
                    .order("revenue", { ascending: false }),

                supabase
                    .from("daily_shift_summary")
                    .select("*")
                    .eq("store_id", storeId)
                    .eq("sold_date", selectedDate)
                    .order("shift_bucket", { ascending: true }),

                supabase
                    .from("monthly_shift_sales")
                    .select("*")
                    .eq("store_id", storeId)
                    .order("month_start", { ascending: true }),
            ]);

            const firstError =
                summaryResult.error ??
                previousSummaryResult.error ??
                productMixResult.error ??
                shiftSummaryResult.error ??
                monthlyShiftResult.error;

            if (firstError) {
                setErrorMessage(firstError.message);
                setIsLoadingData(false);
                return;
            }

            setSummary((summaryResult.data as SummaryRow | null) ?? null);
            setPreviousSummary(
                (previousSummaryResult.data as SummaryRow | null) ?? null,
            );
            setProductMix((productMixResult.data as ProductMixRow[]) ?? []);
            setShiftSummary((shiftSummaryResult.data as ShiftSummaryRow[]) ?? []);
            setMonthlyShiftRows((monthlyShiftResult.data as MonthlyShiftRow[]) ?? []);

            setIsLoadingData(false);
        }

        loadDashboardData();
    }, [
        activeContext?.store.id,
        selectedDate,
        hasResolvedSessionMode,
        isFreeReadingSession,
        usesClaimedFreeReadingData,
    ]);

    const summaryCards = useMemo(
        () => buildSummaryCards(summary, previousSummary),
        [summary, previousSummary],
    );

    const productGroups = useMemo(
        () => buildProductGroups(productMix),
        [productMix],
    );

    const policyReadings = useMemo(
        () => buildPolicyReadings(summary, productMix, shiftSummary),
        [summary, productMix, shiftSummary],
    );

    const stateReading = useMemo(
        () => buildStateReading(summary, productMix),
        [summary, productMix],
    );

    const isLoading =
        !hasResolvedSessionMode ||
        isLoadingStore ||
        isLoadingLatestDate ||
        isLoadingData;

    const columnMappingModal = (
        <ColumnMappingModal
            open={mappingModalOpen}
            fileName={pendingFile?.name ?? ""}
            sheetName={suggestedMapping.sheetName}
            columns={columnPreview}
            initialMapping={suggestedMapping}
            isSubmitting={isLoadingData}
            onClose={() => setMappingModalOpen(false)}
            onChangeFile={() => {
                setMappingModalOpen(false);
                fileInputRef.current?.click();
            }}
            onConfirm={handleConfirmColumnMapping}
        />
    );

    const paidPlanModal = (
        <PolicyPaidPlanModal
            open={paidPlanModalOpen}
            sessionToken={sessionToken}
            policy={selectedPaidPolicy}
            priceLabel="R$ 97/mês"
            planName="Ohrly Acompanhamento"
            onClose={() => setPaidPlanModalOpen(false)}
        />
    );

    const claimAccountModal = (
        <ClaimFreeReadingAccountModal
            open={claimAccountModalOpen}
            sessionToken={sessionToken}
            onClose={() => setClaimAccountModalOpen(false)}
            onClaimed={() => {
                setClaimAccountModalOpen(false);

                setSessionToken(null);
                setFreeReadingReady(false);
                setUsesClaimedFreeReadingData(true);

                router.replace("/home?claimed=1");
                router.refresh();
            }}
        />
    );

    if (!hasResolvedSessionMode) {
        return (
            <AppShell>
                <div className="mx-auto max-w-5xl px-5 py-10 lg:px-8">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm font-bold text-slate-500 shadow-sm">
                        Preparando a leitura...
                    </div>
                </div>
            </AppShell>
        );
    }

    if (isFreeReadingSession && !freeReadingReady) {
        return (
            <AppShell>
                <div className="h-[90vh] flex">
                    <div className="m-auto max-w-5xl px-5 py-10 lg:px-8">
                        <section className="rounded-[2rem] border border-violet-200 bg-white p-6 shadow-sm lg:p-8">
                            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                <div className="max-w-2xl">
                                    <p className="text-xs font-black uppercase tracking-wide text-violet-700">
                                        Leitura gratuita
                                    </p>

                                    <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                                        Agora envie sua planilha para gerar a leitura do dia
                                    </h1>

                                    <p className="mt-3 text-sm leading-6 text-slate-600">
                                        O Ohrly ainda não vai buscar dados automaticamente. Primeiro
                                        precisamos receber sua planilha para gerar a leitura gratuita
                                        da operação.
                                    </p>

                                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <FreeReadingInfoCard
                                            title="O que vamos ler"
                                            description="Produto, receita, custo/CMV, quantidade, data e horário, quando existirem."
                                        />

                                        <FreeReadingInfoCard
                                            title="O que você recebe"
                                            description="Resultado do dia, produtos importantes, policies detectadas e sinais de atenção."
                                        />

                                        <FreeReadingInfoCard
                                            title="Sem cadastro agora"
                                            description="Você só cria conta se quiser salvar, acompanhar ou aprofundar a leitura."
                                        />

                                        <FreeReadingInfoCard
                                            title="Plano pago depois"
                                            description="O aprofundamento das policies e o acompanhamento entram no plano pago."
                                        />
                                    </div>
                                </div>

                                <div className="w-full rounded-3xl border border-slate-200 bg-slate-50 p-5 lg:max-w-sm">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                                        <Upload className="h-7 w-7" />
                                    </div>

                                    <h2 className="mt-4 text-xl font-black text-slate-950">
                                        Enviar planilha
                                    </h2>

                                    <p className="mt-2 text-sm leading-6 text-slate-500">
                                        Aceitamos arquivos CSV, XLS e XLSX. Depois vamos gerar uma
                                        leitura inicial usando os campos disponíveis.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isPreviewLoading || isLoadingData}
                                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-700 px-5 py-4 text-sm font-black text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <Upload className="h-4 w-4" />
                                        {isPreviewLoading
                                            ? "Lendo planilha..."
                                            : isLoadingData
                                                ? "Gerando leitura..."
                                                : "Selecionar planilha"}
                                    </button>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".csv,.xlsx,.xls"
                                        className="hidden"
                                        onChange={(event) => handleFileChange(event.target.files?.[0])}
                                    />

                                    {fileName !== "nenhuma planilha enviada" ? (
                                        <div className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-600">
                                            Arquivo selecionado:{" "}
                                            <span className="text-violet-700">{fileName}</span>
                                        </div>
                                    ) : null}

                                    {errorMessage ? (
                                        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                                            {errorMessage}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
                {columnMappingModal}
            </AppShell>
        );
    }

    return (
        <AppShell>
            <div className="mx-auto max-w-[1500px] px-5 py-6 lg:px-8">
                <section className="mt-6">
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                        <div className="max-w-2xl">
                            <p className="text-xs font-bold uppercase tracking-wide text-violet-700">
                                {isFreeReadingSession
                                    ? "Leitura gratuita"
                                    : "Acompanhamento operacional"}
                            </p>

                            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
                                {isFreeReadingSession
                                    ? "Leitura gratuita da operação"
                                    : "Acompanhamento operacional"}
                            </h1>

                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                {isFreeReadingSession
                                    ? "O Ohrly transformou a planilha enviada em uma leitura simples do dia, com resultado, produtos importantes e policies detectadas."
                                    : "O Ohrly lê a base histórica da loja e transforma venda, custo, margem, produtos e turnos em uma leitura simples para decisão."}
                            </p>
                        </div>
                    </div>
                    <DailyReadingActions
                        selectedDate={selectedDate}
                        onDateChange={handleSelectedDateChange}
                        fileName={fileName}
                        isLoading={isLoading}
                        baseDateRange={baseDateRange}
                        onAddSpreadsheet={() => fileInputRef.current?.click()}
                    />

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        className="hidden"
                        onChange={(event) => handleFileChange(event.target.files?.[0])}
                    />
                </section>

                {errorMessage ? <ErrorState message={errorMessage} /> : null}

                <SectionHeader
                    number="01"
                    title="Resultado do dia"
                    description="A primeira leitura substitui a planilha como ponto de partida: estado do dia, receita, custo, lucro e margem."
                />

                <section className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_1.7fr]">
                    <StateCard reading={stateReading} isLoading={isLoading} />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                        {summaryCards.map((card) => (
                            <SummaryCard key={card.label} {...card} isLoading={isLoading} />
                        ))}
                    </div>
                </section>

                <SectionHeader
                    number="02"
                    title="O que explicou o resultado"
                    description="Aqui o Ohrly traduz os produtos vendidos em leitura de margem, giro, risco e oportunidade."
                />

                <section className="mt-4">
                    <ProductMix productGroups={productGroups} isLoading={isLoading} />
                </section>

                <SectionHeader
                    number="03"
                    title="Leituras detectadas pelo Ohrly"
                    description="As policies aparecem como leituras simples no plano gratuito. O aprofundamento, a explicação e o acompanhamento ficam para o plano pago."
                />

                <section className="mt-4">
                    <PolicyReadingGrid
                        policies={policyReadings}
                        isLoading={isLoading}
                        onPaidCtaClick={handleOpenPaidPlanModal}
                    />
                </section>

                <SectionHeader
                    number="04"
                    title="Oportunidade por turno"
                    description="A leitura cruza horário, mês e margem para ajudar a decidir onde testar comissão de produtos complementares."
                />

                <section className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1.65fr]">
                    <ShiftOpportunity
                        shifts={shiftSummary}
                        summary={summary}
                        isLoading={isLoading}
                    />

                    <MonthlyShiftTable rows={monthlyShiftRows} isLoading={isLoading} />
                </section>

                {isFreeReadingSession ? (
                    <CreateAccountCta
                        sessionToken={sessionToken}
                        baseDateRange={baseDateRange}
                        summary={summary}
                        policyReadings={policyReadings}
                        onCreateAccountClick={() => setClaimAccountModalOpen(true)}
                    />
                ) : null}
            </div>
            {columnMappingModal}
            {paidPlanModal}
            {claimAccountModal}
        </AppShell>
    );
}

function CreateAccountCta({
    sessionToken,
    baseDateRange,
    summary,
    policyReadings,
    onCreateAccountClick
}: {
    sessionToken: string | null;
    baseDateRange: BaseDateRange | null;
    summary: SummaryRow | null;
    policyReadings: PolicyReading[];
    onCreateAccountClick: () => void;
}) {
    const days = baseDateRange?.daysWithSales ?? 0;

    const activePolicies = policyReadings.filter(
        (policy) => policy.status === "Atenção" || policy.status === "Variação",
    ).length;

    return (
        <section className="mt-8 overflow-hidden rounded-[2rem] border border-violet-200 bg-violet-700 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="p-6 text-white lg:p-8">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-violet-100 ring-1 ring-white/15">
                        <Sparkles className="h-4 w-4" />
                        Próximo passo
                    </div>

                    <h2 className="mt-5 max-w-2xl text-2xl font-black tracking-tight lg:text-3xl">
                        Salve essa leitura e acompanhe se a operação melhora ou volta a
                        degradar
                    </h2>

                    <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-violet-100">
                        A leitura gratuita mostra o que chamou atenção na base enviada. Com
                        uma conta, você pode manter esse histórico, comparar novos dias e
                        transformar as policies em oportunidades acompanhadas.
                    </p>

                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <CtaMetricCard
                            label="Dias na base"
                            value={days > 0 ? `${days}` : "—"}
                            helper="dias registrados"
                        />

                        <CtaMetricCard
                            label="Policies ativas"
                            value={String(activePolicies)}
                            helper="sinais para acompanhar"
                        />

                        <CtaMetricCard
                            label="Receita lida"
                            value={formatCurrency(summary?.total_revenue)}
                            helper="no dia selecionado"
                        />
                    </div>

                    <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <button
                            type="button"
                            onClick={onCreateAccountClick}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 text-sm font-black text-violet-700 shadow-sm transition hover:bg-violet-50"
                        >
                            <UserPlus className="h-4 w-4" />
                            Criar conta e salvar leitura
                            <ArrowRight className="h-4 w-4" />
                        </button>

                        <button
                            type="button"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-sm font-black text-white transition hover:bg-white/15"
                        >
                            <Lock className="h-4 w-4" />
                            Ver o que entra no plano pago
                        </button>
                    </div>
                </div>

                <div className="border-t border-white/10 bg-white p-6 lg:border-l lg:border-t-0 lg:p-8">
                    <p className="text-xs font-black uppercase tracking-wide text-violet-700">
                        Ao criar conta, você destrava
                    </p>

                    <div className="mt-5 grid md:grid-cols-2 gap-5">
                        <CtaBenefit
                            icon={History}
                            title="Histórico da base"
                            description="Volte para essa leitura depois e compare com novas planilhas enviadas."
                        />

                        <CtaBenefit
                            icon={ShieldCheck}
                            title="Leituras mais confiáveis"
                            description="Salve mapeamentos de colunas e reduza retrabalho em novos uploads."
                        />

                        <CtaBenefit
                            icon={Sparkles}
                            title="Aprofundamento das policies"
                            description="Entenda causas prováveis, oportunidades e próximos testes sugeridos."
                        />

                        <CtaBenefit
                            icon={TrendingUp}
                            title="Acompanhamento da evolução"
                            description="Veja se uma oportunidade melhorou, sustentou ou voltou a degradar."
                        />
                    </div>

                    <div className="mt-6 rounded-2xl bg-violet-50 p-4 text-sm font-semibold leading-6 text-violet-900">
                        A conta não precisa mudar a planilha. Ela serve para guardar a
                        leitura e acompanhar a operação com mais profundidade.
                    </div>
                </div>
            </div>
        </section>
    );
}

function CtaMetricCard({
    label,
    value,
    helper,
}: {
    label: string;
    value: string;
    helper: string;
}) {
    return (
        <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
            <p className="text-[11px] font-black uppercase tracking-wide text-violet-100">
                {label}
            </p>

            <p className="mt-2 text-2xl font-black text-white">{value}</p>

            <p className="mt-1 text-xs font-bold text-violet-100">{helper}</p>
        </div>
    );
}

function CtaBenefit({
    icon: Icon,
    title,
    description,
}: {
    icon: LucideIcon;
    title: string;
    description: string;
}) {
    return (
        <div className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                <Icon className="h-5 w-5" />
            </div>

            <div>
                <p className="text-sm font-black text-slate-900">{title}</p>

                <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
            </div>
        </div>
    );
}

function DailyReadingActions({
    selectedDate,
    onDateChange,
    fileName,
    isLoading,
    baseDateRange,
    onAddSpreadsheet,
}: {
    selectedDate: string;
    onDateChange: (value: string) => void;
    fileName: string;
    isLoading: boolean;
    baseDateRange: BaseDateRange | null;
    onAddSpreadsheet: () => void;
}) {
    return (
        <div className="w-full xl:w-auto xl:min-w-[680px]">
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.3fr_0.8fr]">
                <article className="rounded-3xl border border-violet-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                                    <FileSpreadsheet className="h-5 w-5" />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[11px] font-black uppercase tracking-wide text-violet-700">
                                        Base da operação
                                    </p>

                                    <h3 className="truncate text-sm font-black text-slate-950">
                                        {fileName}
                                    </h3>
                                </div>
                            </div>

                            <p className="mt-3 max-w-sm text-xs font-semibold leading-5 text-slate-500">
                                Esta planilha alimenta as leituras disponíveis. Ao enviar uma
                                nova base, o Ohrly recalcula os dias encontrados nela.
                            </p>
                        </div>

                        <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">
                            <CheckCircle2 className="h-4 w-4" />
                            {isLoading ? "Processando" : "Base pronta"}
                        </span>
                    </div>

                    <div className="mt-4">
                        <BaseRegisteredDaysCard baseDateRange={baseDateRange} />

                        <div>
                            <button
                                type="button"
                                onClick={onAddSpreadsheet}
                                className="flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-violet-700 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-violet-800"
                            >
                                <Upload className="h-4 w-4" />
                                Enviar nova base
                            </button>
                        </div>
                    </div>
                </article>

                <article className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                            <CalendarDays className="h-5 w-5" />
                        </div>

                        <div>
                            <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">
                                Dia da leitura
                            </p>

                            <h3 className="text-sm font-black text-slate-950">
                                Filtrar resultado
                            </h3>
                        </div>
                    </div>

                    <p className="mt-3 text-xs font-semibold leading-5 text-slate-500">
                        Escolha qual dia da base você quer visualizar agora.
                    </p>

                    <label className="mt-4 block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <span className="text-[11px] font-black uppercase tracking-wide text-slate-400">
                            Data analisada
                        </span>

                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(event) => onDateChange(event.target.value)}
                            className="mt-1 w-full bg-transparent text-sm font-black text-slate-800 outline-none"
                        />
                    </label>
                </article>
            </div>
        </div>
    );
}

function BaseRegisteredDaysCard({
    baseDateRange,
}: {
    baseDateRange: BaseDateRange | null;
}) {
    const days = baseDateRange?.daysWithSales ?? 0;
    const minDate = baseDateRange?.minSoldDate;
    const maxDate = baseDateRange?.maxSoldDate;

    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">
                        Dias registrados na base
                    </p>

                    <p className="mt-1 text-xl font-black text-slate-950">
                        {days > 0 ? `${days} dia${days === 1 ? "" : "s"}` : "—"}
                    </p>
                </div>

                <div className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-slate-600 shadow-sm">
                    {minDate && maxDate
                        ? `${formatShortDate(minDate)} até ${formatShortDate(maxDate)}`
                        : "Aguardando base"}
                </div>
            </div>

            <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">
                Esse número indica quantos dias com vendas foram encontrados na
                planilha enviada.
            </p>
        </div>
    );
}

function formatShortDate(value?: string | null): string {
    if (!value) return "—";

    const [year, month, day] = value.split("-");

    if (!year || !month || !day) return value;

    return `${day}/${month}/${year}`;
}

function SectionHeader({
    number,
    title,
    description,
}: {
    number: string;
    title: string;
    description: string;
}) {
    return (
        <div className="mt-8 flex flex-col gap-3 border-slate-200 pt-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
                <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-xs font-black text-violet-700">
                        {number}
                    </span>

                    <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-700">
                        {title}
                    </p>
                </div>
            </div>

            <p className="max-w-2xl text-sm leading-6 text-slate-500">
                {description}
            </p>
        </div>
    );
}

function StateCard({
    reading,
    isLoading,
}: {
    reading: {
        title: string;
        description: string;
    };
    isLoading: boolean;
}) {
    return (
        <article className="rounded-3xl border border-violet-200 bg-violet-50 p-6 shadow-sm">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-violet-200 text-violet-800">
                    <Star className="h-10 w-10" />
                </div>

                <div>
                    <p className="text-xs font-black uppercase tracking-wide text-violet-700">
                        Estado do dia
                    </p>

                    <h2 className="mt-2 max-w-xl text-2xl font-black leading-tight text-violet-800">
                        {isLoading ? "Carregando leitura..." : reading.title}
                    </h2>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700">
                        {isLoading
                            ? "Buscando os dados da base histórica no Supabase."
                            : reading.description}
                    </p>
                </div>
            </div>
        </article>
    );
}

function SummaryCard({
    label,
    value,
    helper,
    icon: Icon,
    tone,
    isLoading,
}: SummaryCardData & {
    isLoading: boolean;
}) {
    const toneClass = {
        violet: "bg-violet-100 text-violet-700",
        rose: "bg-rose-100 text-rose-700",
        green: "bg-emerald-100 text-emerald-700",
        amber: "bg-amber-100 text-amber-700",
        blue: "bg-blue-100 text-blue-700",
        orange: "bg-orange-100 text-orange-700",
    }[tone];

    return (
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div
                className={`flex h-11 w-11 items-center justify-center rounded-full ${toneClass}`}
            >
                <Icon className="h-5 w-5" />
            </div>

            <p className="mt-5 text-sm font-bold text-slate-700">{label}</p>

            <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                {isLoading ? "..." : value}
            </p>

            <p
                className={[
                    "mt-2 text-xs font-bold",
                    tone === "rose" ? "text-slate-500" : "text-emerald-700",
                ].join(" ")}
            >
                {isLoading ? "atualizando leitura" : helper}
            </p>
        </article>
    );
}

function ProductMix({
    productGroups,
    isLoading,
}: {
    productGroups: ProductGroup[];
    isLoading: boolean;
}) {
    return (
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wide text-violet-700">
                Mix do dia
            </p>

            {isLoading ? (
                <EmptyCard text="Carregando produtos do dia..." />
            ) : (
                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                    {productGroups.map((group) => (
                        <ProductGroupCard key={group.title} group={group} />
                    ))}
                </div>
            )}
        </article>
    );
}

function ProductGroupCard({ group }: { group: ProductGroup }) {
    const tones = {
        green: {
            card: "border-emerald-200 bg-emerald-50/40",
            icon: "bg-emerald-100 text-emerald-700",
            title: "text-emerald-800",
            dot: "bg-emerald-500",
        },
        blue: {
            card: "border-blue-200 bg-blue-50/40",
            icon: "bg-blue-100 text-blue-700",
            title: "text-blue-800",
            dot: "bg-blue-500",
        },
        orange: {
            card: "border-orange-200 bg-orange-50/40",
            icon: "bg-orange-100 text-orange-700",
            title: "text-orange-800",
            dot: "bg-orange-500",
        },
        violet: {
            card: "border-violet-200 bg-violet-50/40",
            icon: "bg-violet-100 text-violet-700",
            title: "text-violet-800",
            dot: "bg-violet-500",
        },
    }[group.tone];

    return (
        <div className={`rounded-2xl border p-4 ${tones.card}`}>
            <div className="flex items-start gap-3">
                <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${tones.icon}`}
                >
                    <group.icon className="h-4 w-4" />
                </div>

                <div>
                    <h3 className={`text-sm font-black leading-5 ${tones.title}`}>
                        {group.title}
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                        {group.description}
                    </p>
                </div>
            </div>

            {group.products.length === 0 ? (
                <p className="mt-4 text-sm leading-6 text-slate-500">
                    Nenhum produto classificado neste grupo para o dia selecionado.
                </p>
            ) : (
                <ul className="mt-4 space-y-2">
                    {group.products.slice(0, 3).map((product) => (
                        <li
                            key={`${group.title}-${product.product_name}-${product.product_sku ?? ""}`}
                            className="flex items-start gap-2 text-sm text-slate-700"
                        >
                            <span
                                className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${tones.dot}`}
                            />
                            <span>
                                {product.product_name}
                                <span className="block text-xs text-slate-500">
                                    {formatCurrency(product.revenue)} · margem{" "}
                                    {formatPercent(product.margin_rate)}
                                </span>
                            </span>
                        </li>
                    ))}
                </ul>
            )}

            <p className="mt-4 text-xs font-black text-violet-700">
                {group.products.length} produto(s)
            </p>
        </div>
    );
}

function PolicyReadingGrid({
    policies,
    isLoading,
    onPaidCtaClick,
}: {
    policies: PolicyReading[];
    isLoading: boolean;
    onPaidCtaClick: (policy: PolicyReading) => void;
}) {
    return (
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-xs font-black uppercase tracking-wide text-violet-700">
                        Policies ativadas
                    </p>

                    <h2 className="mt-1 text-xl font-black text-slate-950">
                        O que o Ohrly percebeu nesse dia
                    </h2>
                </div>

                <p className="max-w-2xl text-sm leading-6 text-slate-500">
                    A leitura gratuita mostra o sinal. O plano pago explica a causa,
                    sugere oportunidades e acompanha se a ação melhorou ou degradou.
                </p>
            </div>

            {isLoading ? (
                <EmptyCard text="Carregando policies detectadas..." />
            ) : (
                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
                    {policies.map((policy) => (
                        <PolicyReadingCard
                            key={policy.id}
                            policy={policy}
                            onPaidCtaClick={onPaidCtaClick}
                        />
                    ))}
                </div>
            )}
        </article>
    );
}

function PolicyReadingCard({
    policy,
    onPaidCtaClick,
}: {
    policy: PolicyReading;
    onPaidCtaClick: (policy: PolicyReading) => void;
}) {
    const Icon = policy.icon;

    const tones = {
        green: {
            card: "border-emerald-200 bg-emerald-50/40",
            icon: "bg-emerald-100 text-emerald-700",
            title: "text-emerald-800",
            badge: "bg-emerald-100 text-emerald-700",
        },
        blue: {
            card: "border-blue-200 bg-blue-50/40",
            icon: "bg-blue-100 text-blue-700",
            title: "text-blue-800",
            badge: "bg-blue-100 text-blue-700",
        },
        orange: {
            card: "border-orange-200 bg-orange-50/40",
            icon: "bg-orange-100 text-orange-700",
            title: "text-orange-800",
            badge: "bg-orange-100 text-orange-700",
        },
        violet: {
            card: "border-violet-200 bg-violet-50/40",
            icon: "bg-violet-100 text-violet-700",
            title: "text-violet-800",
            badge: "bg-violet-100 text-violet-700",
        },
        amber: {
            card: "border-amber-200 bg-amber-50/40",
            icon: "bg-amber-100 text-amber-700",
            title: "text-amber-800",
            badge: "bg-amber-100 text-amber-700",
        },
    }[policy.tone];

    return (
        <div className={`rounded-2xl border p-4 ${tones.card}`}>
            <div className="flex items-start justify-between gap-3">
                <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${tones.icon}`}
                >
                    <Icon className="h-5 w-5" />
                </div>

                <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-black ${tones.badge}`}
                >
                    {policy.status}
                </span>
            </div>

            <h3 className={`mt-4 text-base font-black leading-5 ${tones.title}`}>
                {policy.title}
            </h3>

            <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
                {policy.message}
            </p>

            <div className="mt-4 space-y-2 text-xs font-bold text-slate-600">
                <div className="flex justify-between gap-3">
                    <span>Impacto</span>
                    <span className="text-slate-950">{policy.impact}</span>
                </div>

                <div className="flex justify-between gap-3">
                    <span>Confiança</span>
                    <span className="text-slate-950">{policy.confidence}</span>
                </div>
            </div>

            <div className="mt-4 rounded-2xl bg-white/80 p-3 text-xs leading-5 text-slate-600">
                {policy.freeReading}
            </div>

            <button
                type="button"
                onClick={() => onPaidCtaClick(policy)}
                className="mt-4 flex w-full items-center justify-between rounded-2xl border border-violet-200 bg-white px-3 py-3 text-left text-xs font-black text-violet-700 transition hover:bg-violet-50"
            >
                <span className="flex items-center gap-2">
                    <Lock className="h-3.5 w-3.5" />
                    {policy.paidCta}
                </span>

                <ArrowRight className="h-3.5 w-3.5" />
            </button>
        </div>
    );
}

function ShiftOpportunity({
    shifts,
    summary,
    isLoading,
}: {
    shifts: ShiftSummaryRow[];
    summary: SummaryRow | null;
    isLoading: boolean;
}) {
    const morning = shifts.find((shift) => shift.shift_bucket === "08:00-13:59");

    const afternoon = shifts.find(
        (shift) => shift.shift_bucket === "14:00-19:59",
    );

    const interpretation = buildShiftInterpretation(morning, afternoon, summary);

    return (
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wide text-violet-700">
                Comparativo do dia por turno
            </p>

            {isLoading ? (
                <EmptyCard text="Carregando turnos do dia..." />
            ) : (
                <>
                    <div className="mt-4 grid grid-cols-1 items-center gap-3 md:grid-cols-[1fr_auto_1fr]">
                        <ShiftCard
                            period="08h–13:59"
                            shift={morning}
                            highlight={
                                toNumber(morning?.average_margin) >=
                                    toNumber(afternoon?.average_margin)
                                    ? "green"
                                    : "orange"
                            }
                        />

                        <div className="hidden h-9 w-9 items-center justify-center rounded-full border border-violet-200 bg-white text-xs font-black text-violet-700 md:flex">
                            VS
                        </div>

                        <ShiftCard
                            period="14h–19h"
                            shift={afternoon}
                            highlight={
                                toNumber(afternoon?.average_margin) >
                                    toNumber(morning?.average_margin)
                                    ? "green"
                                    : "orange"
                            }
                        />
                    </div>

                    <div className="mt-4 flex gap-2 rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-slate-700">
                        <Sun className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                        <p>{interpretation}</p>
                    </div>
                </>
            )}
        </article>
    );
}

function ShiftCard({
    period,
    shift,
    highlight,
}: {
    period: string;
    shift?: ShiftSummaryRow;
    highlight: "green" | "orange";
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2">
                <Sun className="h-5 w-5 text-blue-500" />
                <p className="text-xl font-black text-blue-800">{period}</p>
            </div>

            <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between gap-4">
                    <span className="font-bold text-slate-600">Vendas</span>
                    <span className="font-black text-slate-950">
                        {formatCurrency(shift?.revenue)}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <span className="font-bold text-slate-600">Margem média</span>
                    <span
                        className={[
                            "font-black",
                            highlight === "green" ? "text-emerald-700" : "text-orange-600",
                        ].join(" ")}
                    >
                        {formatPercent(shift?.average_margin)}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <span className="font-bold text-slate-600">Complementares</span>
                    <span className="font-black text-slate-950">
                        {formatInteger(shift?.complementary_items_sold)}
                    </span>
                </div>
            </div>
        </div>
    );
}

function MonthlyShiftTable({
    rows,
    isLoading,
}: {
    rows: MonthlyShiftRow[];
    isLoading: boolean;
}) {
    const orderedRows = rows.slice(-8);

    return (
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wide text-violet-700">
                Relatório mensal por turno
            </p>

            {isLoading ? (
                <EmptyCard text="Carregando relatório mensal..." />
            ) : orderedRows.length === 0 ? (
                <EmptyCard text="Nenhum dado mensal encontrado para a loja." />
            ) : (
                <>
                    <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                        <table className="w-full border-collapse text-sm">
                            <thead className="bg-slate-50 text-slate-600">
                                <tr>
                                    <th className="px-4 py-3 text-left font-black">Mês</th>
                                    <th className="px-4 py-3 text-right font-black">08h–13:59</th>
                                    <th className="px-4 py-3 text-right font-black">14h–19h</th>
                                    <th className="px-4 py-3 text-center font-black">
                                        Melhor turno
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {orderedRows.map((row) => (
                                    <tr key={row.month_start} className="bg-white">
                                        <td className="px-4 py-3 font-bold text-slate-700">
                                            {formatMonth(row.month_start)}
                                        </td>

                                        <td className="px-4 py-3 text-right font-bold text-slate-700">
                                            {formatCurrency(row.morning_revenue)}
                                        </td>

                                        <td className="px-4 py-3 text-right font-bold text-slate-700">
                                            {formatCurrency(row.afternoon_revenue)}
                                        </td>

                                        <td className="px-4 py-3 text-center">
                                            <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700">
                                                {row.best_shift ?? "—"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                        <LineChart className="h-4 w-4 text-violet-700" />
                        <p>{buildMonthlyShiftReading(rows)}</p>
                    </div>
                </>
            )}
        </article>
    );
}

function FreeReadingInfoCard({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-black text-slate-800">{title}</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
        </div>
    );
}

function ErrorState({ message }: { message: string }) {
    return (
        <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-5 text-sm leading-6 text-red-800">
            <strong>Erro ao carregar dados:</strong> {message}
        </div>
    );
}

function EmptyCard({ text }: { text: string }) {
    return (
        <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm font-semibold text-slate-500">
            {text}
        </div>
    );
}

function buildSummaryCards(
    summary: SummaryRow | null,
    previousSummary: SummaryRow | null,
): SummaryCardData[] {
    return [
        {
            label: "Receita total",
            value: formatCurrency(summary?.total_revenue),
            helper: buildDeltaHelper(
                summary?.total_revenue,
                previousSummary?.total_revenue,
            ),
            icon: DollarSign,
            tone: "violet",
        },
        {
            label: "CMV total",
            value: formatCurrency(summary?.total_cmv),
            helper: buildCostHelper(summary),
            icon: Tags,
            tone: "rose",
        },
        {
            label: "Lucro bruto",
            value: formatCurrency(summary?.gross_profit),
            helper: buildDeltaHelper(
                summary?.gross_profit,
                previousSummary?.gross_profit,
            ),
            icon: LineChart,
            tone: "green",
        },
        {
            label: "Margem média",
            value: formatPercent(summary?.average_margin),
            helper: buildMarginQualityLabel(summary?.margin_quality),
            icon: Percent,
            tone: "amber",
        },
        {
            label: "Produtos vendidos",
            value: formatInteger(summary?.items_sold),
            helper: `${formatInteger(summary?.orders_count)} pedido(s)`,
            icon: Box,
            tone: "blue",
        },
    ];
}

function buildProductGroups(productMix: ProductMixRow[]): ProductGroup[] {
    return productGroupConfig.map((config) => ({
        title: config.title,
        description: config.description,
        icon: config.icon,
        tone: config.tone,
        products: productMix
            .filter((product) => product.ohrly_mix_group === config.key)
            .sort((a, b) => toNumber(b.revenue) - toNumber(a.revenue)),
    }));
}

function buildStateReading(
    summary: SummaryRow | null,
    products: ProductMixRow[],
): {
    title: string;
    description: string;
} {
    if (!summary) {
        return {
            title: "Sem leitura para o dia selecionado",
            description:
                "Não encontramos vendas confirmadas para este dia na base histórica. Tente selecionar outra data.",
        };
    }

    if (summary.margin_quality === "unavailable") {
        return {
            title: "Vendas registradas, mas margem indisponível",
            description:
                "A base histórica tem vendas para este dia, mas ainda não há custo suficiente para calcular CMV, lucro bruto e margem com segurança.",
        };
    }

    const totalGrossProfit = toNumber(summary.gross_profit);
    const topThreeGrossProfit = products
        .slice()
        .sort((a, b) => toNumber(b.gross_profit) - toNumber(a.gross_profit))
        .slice(0, 3)
        .reduce((sum, product) => sum + toNumber(product.gross_profit), 0);

    const concentration =
        totalGrossProfit > 0 ? topThreeGrossProfit / totalGrossProfit : 0;

    if (concentration >= 0.6) {
        return {
            title: "Lucro saudável, mas concentrado em poucos produtos",
            description:
                "O dia foi bom, mas dependeu principalmente de 2 ou 3 itens de boa margem. Alguns produtos giraram caixa, mas contribuíram menos para o lucro.",
        };
    }

    if (toNumber(summary.average_margin) < 0.18) {
        return {
            title: "Receita com margem apertada",
            description:
                "A loja vendeu no dia, mas a margem média ficou baixa. Antes de estimular volume, vale revisar quais produtos realmente compensam entrar em oferta ou comissão.",
        };
    }

    return {
        title: "Dia com mix relativamente equilibrado",
        description:
            "O resultado não ficou tão dependente de poucos produtos. A próxima leitura é entender quais itens podem ser repetidos em combos ou comissão por turno.",
    };
}

function buildPolicyReadings(
    summary: SummaryRow | null,
    products: ProductMixRow[],
    shifts: ShiftSummaryRow[],
): PolicyReading[] {
    const totalRevenue = toNumber(summary?.total_revenue);
    const totalGrossProfit = toNumber(summary?.gross_profit);

    const topThreeRevenue = products
        .slice()
        .sort((a, b) => toNumber(b.revenue) - toNumber(a.revenue))
        .slice(0, 3)
        .reduce((sum, product) => sum + toNumber(product.revenue), 0);

    const topThreeGrossProfit = products
        .slice()
        .sort((a, b) => toNumber(b.gross_profit) - toNumber(a.gross_profit))
        .slice(0, 3)
        .reduce((sum, product) => sum + toNumber(product.gross_profit), 0);

    const revenueConcentration =
        totalRevenue > 0 ? topThreeRevenue / totalRevenue : 0;

    const profitConcentration =
        totalGrossProfit > 0 ? topThreeGrossProfit / totalGrossProfit : 0;

    const margin = toNumber(summary?.average_margin);

    const candidates = products.filter(
        (product) =>
            product.ohrly_mix_group === "Candidatos a oferta/comissão" ||
            product.is_complementary,
    );

    const missingCosts = toNumber(summary?.items_with_missing_cost);
    const knownCosts = toNumber(summary?.items_with_known_cost);

    const morning = shifts.find((shift) => shift.shift_bucket === "08:00-13:59");

    const afternoon = shifts.find(
        (shift) => shift.shift_bucket === "14:00-19:59",
    );

    const hasShiftSignal =
        toNumber(morning?.revenue) > 0 || toNumber(afternoon?.revenue) > 0;

    return [
        {
            id: "operational_concentration",
            title: "Concentração operacional",
            status:
                revenueConcentration >= 0.6 || profitConcentration >= 0.6
                    ? "Atenção"
                    : "Normal",
            confidence: totalRevenue > 0 ? "Média" : "Baixa",
            impact: "Margem e dependência",
            message:
                revenueConcentration >= 0.6 || profitConcentration >= 0.6
                    ? "O resultado ficou concentrado em poucos produtos."
                    : "O resultado não ficou excessivamente concentrado.",
            freeReading:
                revenueConcentration >= 0.6 || profitConcentration >= 0.6
                    ? `Os 3 principais produtos representam ${formatPercent(
                        revenueConcentration,
                    )} da receita e ${formatPercent(
                        profitConcentration,
                    )} do lucro bruto do dia.`
                    : "A receita e o lucro parecem mais distribuídos entre os itens vendidos.",
            paidCta: "Ver causa e oportunidade",
            icon: Layers3,
            tone:
                revenueConcentration >= 0.6 || profitConcentration >= 0.6
                    ? "orange"
                    : "green",
        },
        {
            id: "margin_pressure",
            title: "Margem apertada",
            status:
                summary?.margin_quality === "unavailable"
                    ? "Parcial"
                    : margin > 0 && margin < 0.18
                        ? "Atenção"
                        : "Normal",
            confidence: summary?.margin_quality === "real" ? "Alta" : "Média",
            impact: "Lucro bruto",
            message:
                summary?.margin_quality === "unavailable"
                    ? "A leitura de margem está limitada porque faltam custos."
                    : margin > 0 && margin < 0.18
                        ? "A venda aconteceu, mas a margem ficou apertada."
                        : "A margem do dia não apresenta sinal crítico.",
            freeReading:
                summary?.margin_quality === "unavailable"
                    ? "Adicione CMV/custo para destravar uma leitura melhor de lucro."
                    : `Margem média do dia: ${formatPercent(summary?.average_margin)}.`,
            paidCta: "Ver produtos que puxaram margem",
            icon: TrendingDown,
            tone:
                summary?.margin_quality === "unavailable" ||
                    (margin > 0 && margin < 0.18)
                    ? "amber"
                    : "green",
        },
        {
            id: "complementary_opportunity",
            title: "Oportunidade de complemento",
            status: candidates.length > 0 ? "Variação" : "Parcial",
            confidence: candidates.length >= 3 ? "Média" : "Baixa",
            impact: "Receita e lucro",
            message:
                candidates.length > 0
                    ? "Existem itens que podem virar teste de oferta, combo ou comissão."
                    : "Ainda não há sinal suficiente de produto complementar.",
            freeReading:
                candidates.length > 0
                    ? `${candidates.length} item(ns) aparecem como candidatos a oferta/comissão na leitura do dia.`
                    : "Com mais histórico e categorias, o Ohrly consegue sugerir complementos melhores.",
            paidCta: "Criar teste acompanhado",
            icon: Tags,
            tone: candidates.length > 0 ? "violet" : "blue",
        },
        {
            id: "period_potential",
            title: "Potencial por turno",
            status: hasShiftSignal ? "Variação" : "Parcial",
            confidence: hasShiftSignal ? "Média" : "Baixa",
            impact: "Eficiência comercial",
            message: hasShiftSignal
                ? "Há diferença relevante entre períodos do dia."
                : "Mapeie horário para destravar leitura por período.",
            freeReading: hasShiftSignal
                ? buildShiftInterpretation(morning, afternoon, summary)
                : "Se sua planilha tiver horário, o Ohrly compara períodos e sugere onde testar primeiro.",
            paidCta: "Acompanhar oportunidade por turno",
            icon: Sun,
            tone: hasShiftSignal ? "blue" : "amber",
        },
        {
            id: "data_quality",
            title: "Qualidade da leitura",
            status: missingCosts > 0 ? "Parcial" : "Normal",
            confidence: knownCosts > 0 && missingCosts === 0 ? "Alta" : "Média",
            impact: "Precisão da decisão",
            message:
                missingCosts > 0
                    ? "Parte da leitura está limitada por custos ausentes."
                    : "A base do dia tem custos suficientes para leitura de margem.",
            freeReading:
                missingCosts > 0
                    ? `${missingCosts} item(ns) estão sem custo informado. Isso reduz a precisão das leituras de lucro e margem.`
                    : "Os campos principais estão suficientes para a leitura gratuita do dia.",
            paidCta: "Melhorar mapeamento da base",
            icon: CheckCircle2,
            tone: missingCosts > 0 ? "amber" : "green",
        },
    ];
}

function buildShiftInterpretation(
    morning?: ShiftSummaryRow,
    afternoon?: ShiftSummaryRow,
    summary?: SummaryRow | null,
): string {
    if (!summary) {
        return "Sem vendas confirmadas suficientes para gerar uma leitura por turno neste dia.";
    }

    const morningRevenue = toNumber(morning?.revenue);
    const afternoonRevenue = toNumber(afternoon?.revenue);
    const morningMargin = toNumber(morning?.average_margin);
    const afternoonMargin = toNumber(afternoon?.average_margin);

    if (morningRevenue === 0 && afternoonRevenue === 0) {
        return "Não encontramos vendas nos turnos principais para este dia.";
    }

    if (afternoonRevenue > morningRevenue && morningMargin > afternoonMargin) {
        return "A tarde vendeu mais, mas a manhã teve melhor margem. Isso sugere testar comissão de produtos complementares pela manhã antes de expandir para o dia inteiro.";
    }

    if (afternoonRevenue > morningRevenue) {
        return "A tarde concentrou maior volume de vendas. Se o objetivo for estimular complementares sem depender de mais fluxo, esse turno pode ser o primeiro teste.";
    }

    if (morningRevenue > afternoonRevenue) {
        return "A manhã concentrou maior volume de vendas. Vale testar se produtos complementares podem aumentar o lucro bruto desse turno sem reduzir a margem.";
    }

    return "Os turnos ficaram próximos em volume. O melhor teste agora é comparar quais produtos complementares aparecem em cada turno.";
}

function buildMonthlyShiftReading(rows: MonthlyShiftRow[]): string {
    if (rows.length === 0) {
        return "Ainda não há histórico mensal suficiente para detectar padrão por turno.";
    }

    const afternoonWins = rows.filter((row) => row.best_shift === "Tarde").length;
    const morningWins = rows.filter((row) => row.best_shift === "Manhã").length;

    if (afternoonWins > morningWins) {
        return "Padrão detectado: a tarde vende mais na maior parte dos meses analisados.";
    }

    if (morningWins > afternoonWins) {
        return "Padrão detectado: a manhã vende mais na maior parte dos meses analisados.";
    }

    return "Padrão detectado: os turnos alternam liderança ao longo dos meses.";
}

function buildDeltaHelper(
    currentValue?: number | null,
    previousValue?: number | null,
): string {
    const current = toNumber(currentValue);
    const previous = toNumber(previousValue);

    if (previous <= 0) return "sem comparação anterior";

    const delta = (current - previous) / previous;
    const sign = delta >= 0 ? "+" : "";

    return `vs leitura anterior ${sign}${formatPercent(delta)}`;
}

function buildCostHelper(summary: SummaryRow | null): string {
    if (!summary) return "sem dados";

    const known = toNumber(summary.items_with_known_cost);
    const missing = toNumber(summary.items_with_missing_cost);

    if (known === 0 && missing > 0) {
        return "custos ausentes";
    }

    if (known > 0 && missing > 0) {
        return `${known} com custo · ${missing} sem custo`;
    }

    return "custos conhecidos";
}

function buildMarginQualityLabel(
    quality?: "real" | "partial" | "unavailable" | null,
): string {
    if (quality === "real") return "margem real";
    if (quality === "partial") return "margem parcial";
    if (quality === "unavailable") return "margem indisponível";
    return "sem margem";
}

function formatCurrency(value?: number | null): string {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
        return "—";
    }

    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 0,
    }).format(Number(value));
}

function formatPercent(value?: number | null): string {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
        return "—";
    }

    return new Intl.NumberFormat("pt-BR", {
        style: "percent",
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    }).format(Number(value));
}

function formatInteger(value?: number | null): string {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
        return "0";
    }

    return new Intl.NumberFormat("pt-BR", {
        maximumFractionDigits: 0,
    }).format(Number(value));
}

function formatMonth(date: string): string {
    const parsed = new Date(`${date}T00:00:00`);

    return new Intl.DateTimeFormat("pt-BR", {
        month: "short",
        year: "2-digit",
    })
        .format(parsed)
        .replace(".", "");
}

function toNumber(value?: number | null): number {
    if (value === null || value === undefined) return 0;

    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : 0;
}
