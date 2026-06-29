"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { supabase } from "@/lib/supabase/client";
import {
  BarChart3,
  Box,
  CalendarDays,
  CheckCircle2,
  DollarSign,
  LineChart,
  Package,
  Percent,
  Plus,
  Star,
  Sun,
  Tags,
  TrendingDown,
  TrendingUp,
  Upload,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedDate, setSelectedDate] = useState("");
  const [fileName, setFileName] = useState("base histórica");

  const [activeContext, setActiveContext] = useState<ActiveStoreContext | null>(
    null
  );

  const [summary, setSummary] = useState<SummaryRow | null>(null);
  const [previousSummary, setPreviousSummary] = useState<SummaryRow | null>(
    null
  );
  const [productMix, setProductMix] = useState<ProductMixRow[]>([]);
  const [shiftSummary, setShiftSummary] = useState<ShiftSummaryRow[]>([]);
  const [monthlyShiftRows, setMonthlyShiftRows] = useState<MonthlyShiftRow[]>(
    []
  );

  const [isLoadingStore, setIsLoadingStore] = useState(true);
  const [isLoadingLatestDate, setIsLoadingLatestDate] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleFileChange(file?: File) {
    if (!file) return;

    setFileName(file.name);
    setIsLoadingData(true);
    setErrorMessage(null);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      setErrorMessage("Sessão expirada. Faça login novamente.");
      setIsLoadingData(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("selectedDate", selectedDate);

    const response = await fetch("/api/spreadsheets/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      setErrorMessage(result.error ?? "Erro ao importar planilha.");
      setIsLoadingData(false);
      return;
    }

    window.location.reload();
  }

  useEffect(() => {
    async function loadUserStoreContext() {
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
          "Sua conta ainda não está vinculada a nenhuma organização."
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
          "Não encontramos uma loja vinculada à sua organização."
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
  }, [router]);

  useEffect(() => {
    async function loadLatestDate() {
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

      setSelectedDate(data?.sold_date ?? "");
      setIsLoadingLatestDate(false);
    }

    loadLatestDate();
  }, [activeContext?.store.id]);

  useEffect(() => {
    async function loadDashboardData() {
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
        (previousSummaryResult.data as SummaryRow | null) ?? null
      );
      setProductMix((productMixResult.data as ProductMixRow[]) ?? []);
      setShiftSummary((shiftSummaryResult.data as ShiftSummaryRow[]) ?? []);
      setMonthlyShiftRows((monthlyShiftResult.data as MonthlyShiftRow[]) ?? []);

      setIsLoadingData(false);
    }

    loadDashboardData();
  }, [activeContext?.store.id, selectedDate]);

  const summaryCards = useMemo(
    () => buildSummaryCards(summary, previousSummary),
    [summary, previousSummary]
  );

  const productGroups = useMemo(
    () => buildProductGroups(productMix),
    [productMix]
  );

  const stateReading = useMemo(
    () => buildStateReading(summary, productMix),
    [summary, productMix]
  );

  const isLoading = isLoadingStore || isLoadingLatestDate || isLoadingData;

  return (
    <AppShell>
      <div className="mx-auto max-w-[1500px] px-5 py-6 lg:px-8">
        <section className="mt-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-wide text-violet-700">
                Acompanhamento operacional
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
                Acompanhamento operacional
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                O Ohrly lê a base histórica da loja e transforma venda, custo,
                margem, produtos e turnos em uma leitura simples para decisão.
              </p>
            </div>

            <DailyReadingActions
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              fileName={fileName}
              isLoading={isLoading}
              onAddSpreadsheet={() => fileInputRef.current?.click()}
            />

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={(event) => handleFileChange(event.target.files?.[0])}
            />
          </div>
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
      </div>
    </AppShell>
  );
}

function DailyReadingActions({
  selectedDate,
  onDateChange,
  fileName,
  isLoading,
  onAddSpreadsheet,
}: {
  selectedDate: string;
  onDateChange: (value: string) => void;
  fileName: string;
  isLoading: boolean;
  onAddSpreadsheet: () => void;
}) {
  return (
    <div className="flex w-full flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm xl:w-auto xl:min-w-[520px]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <CalendarDays className="h-5 w-5 text-violet-700" />

          <div className="flex-1">
            <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">
              Filtrar dia
            </p>

            <input
              type="date"
              value={selectedDate}
              onChange={(event) => onDateChange(event.target.value)}
              className="mt-1 w-full bg-transparent text-sm font-black text-slate-800 outline-none"
            />
          </div>
        </label>

        <button
          type="button"
          onClick={onAddSpreadsheet}
          className="flex items-center justify-center gap-2 rounded-2xl bg-violet-700 px-5 py-4 text-sm font-black text-white shadow-sm transition hover:bg-violet-800"
        >
          <Plus className="h-4 w-4" />
          Adicionar planilha
        </button>
      </div>

      <div className="flex flex-col gap-2 rounded-2xl bg-violet-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-2 text-sm text-violet-900">
          <Upload className="h-4 w-4 shrink-0 text-violet-700" />
          <span className="shrink-0 font-bold">Base atual:</span>
          <span className="truncate text-violet-800">{fileName}</span>
        </div>

        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          {isLoading ? "Carregando" : "Pronta para leitura"}
        </span>
      </div>
    </div>
  );
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

function ShiftOpportunity({
  shifts,
  summary,
  isLoading,
}: {
  shifts: ShiftSummaryRow[];
  summary: SummaryRow | null;
  isLoading: boolean;
}) {
  const morning = shifts.find(
    (shift) => shift.shift_bucket === "08:00-13:59"
  );

  const afternoon = shifts.find(
    (shift) => shift.shift_bucket === "14:00-19:59"
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
                  <th className="px-4 py-3 text-right font-black">
                    08h–13:59
                  </th>
                  <th className="px-4 py-3 text-right font-black">
                    14h–19h
                  </th>
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
  previousSummary: SummaryRow | null
): SummaryCardData[] {
  return [
    {
      label: "Receita total",
      value: formatCurrency(summary?.total_revenue),
      helper: buildDeltaHelper(summary?.total_revenue, previousSummary?.total_revenue),
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
      helper: buildDeltaHelper(summary?.gross_profit, previousSummary?.gross_profit),
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
  products: ProductMixRow[]
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

function buildShiftInterpretation(
  morning?: ShiftSummaryRow,
  afternoon?: ShiftSummaryRow,
  summary?: SummaryRow | null
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
  previousValue?: number | null
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
  quality?: "real" | "partial" | "unavailable" | null
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