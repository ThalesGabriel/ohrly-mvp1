import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
    throw new Error("Supabase envs não configuradas.");
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    },
});


export const runtime = "nodejs";

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

type NormalizedSaleRow = {
    sold_date: string;
    sold_time: string | null;
    product_name: string;
    product_sku: string | null;
    revenue: number;
    cmv: number | null;
    quantity: number;
    order_key: string;
    channel: string | null;
    is_complementary: boolean;
    product_role: string;
};

type SpreadsheetRow = Record<string, unknown>;

type ColumnMap = {
    date?: string;
    time?: string;
    product?: string;
    sku?: string;
    revenue?: string;
    cost?: string;
    quantity?: string;
    order?: string;
    channel?: string;
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");
    const sessionToken = formData.get("sessionToken");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Envie uma planilha válida." },
        { status: 400 }
      );
    }

    if (!sessionToken || typeof sessionToken !== "string") {
      return NextResponse.json(
        { error: "Sessão da leitura gratuita não encontrada." },
        { status: 400 }
      );
    }

    const { data: onboarding, error: onboardingError } = await supabaseAdmin
      .from("free_reading_onboardings")
      .select("id, session_token, metadata")
      .eq("session_token", sessionToken)
      .maybeSingle();

    if (onboardingError) {
      console.error("[free-readings/upload] onboarding error", onboardingError);

      return NextResponse.json(
        { error: "Erro ao validar sessão da leitura gratuita." },
        { status: 500 }
      );
    }

    if (!onboarding) {
      return NextResponse.json(
        { error: "Sessão da leitura gratuita não encontrada." },
        { status: 404 }
      );
    }

    const rows = await readSpreadsheetRows(file);

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "A planilha não possui linhas para leitura." },
        { status: 400 }
      );
    }

    const columnMap = detectColumns(rows);

    if (!columnMap.product) {
      return NextResponse.json(
        {
          error:
            "Não encontrei a coluna de produto. Use nomes como Produto, Item ou Descrição.",
        },
        { status: 400 }
      );
    }

    if (!columnMap.revenue) {
      return NextResponse.json(
        {
          error:
            "Não encontrei a coluna de receita. Use nomes como Receita, Receita de venda, Valor vendido ou Total.",
        },
        { status: 400 }
      );
    }

    const normalizedRows = normalizeRows(rows, columnMap);

    if (normalizedRows.length === 0) {
      return NextResponse.json(
        {
          error:
            "Não consegui gerar vendas válidas a partir da planilha. Verifique produto, receita e data.",
        },
        { status: 400 }
      );
    }

    const dates = Array.from(
      new Set(normalizedRows.map((row) => row.sold_date))
    ).sort();

    const selectedDate = dates[dates.length - 1] ?? null;

    const dateRange = {
      daysWithSales: dates.length,
      minSoldDate: dates[0] ?? null,
      maxSoldDate: selectedDate,
    };

    const reading = buildFreeReading({
      storeId: onboarding.id,
      rows: normalizedRows,
    });

    const readingWithDateRange = {
      ...reading,
      selectedDate: reading.selectedDate ?? selectedDate,
      dateRange,
    };

    const { error: uploadInsertError } = await supabaseAdmin
      .from("free_reading_uploads")
      .insert({
        onboarding_id: onboarding.id,
        session_token: sessionToken,

        file_name: file.name,
        file_size: file.size,
        file_type: file.type || null,

        rows_read: rows.length,
        rows_normalized: normalizedRows.length,

        selected_date: readingWithDateRange.selectedDate,
        date_range: dateRange,
        detected_columns: columnMap,

        summary: reading.summary,
        previous_summary: reading.previousSummary,
        product_mix: reading.productMix,
        shift_summary: reading.shiftSummary,
        monthly_shift_rows: reading.monthlyShiftRows,

        status: "processed",
        metadata: {
          uploadedAt: new Date().toISOString(),
        },
      });

    if (uploadInsertError) {
      console.error(
        "[free-readings/upload] upload insert error",
        uploadInsertError
      );

      return NextResponse.json(
        { error: "Não foi possível salvar o resultado da leitura gratuita." },
        { status: 500 }
      );
    }

    const { error: onboardingUpdateError } = await supabaseAdmin
      .from("free_reading_onboardings")
      .update({
        status: "uploaded",
        metadata: {
          ...(isObject(onboarding.metadata) ? onboarding.metadata : {}),
          lastUpload: {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type || null,
            rowsRead: rows.length,
            rowsNormalized: normalizedRows.length,
            selectedDate: readingWithDateRange.selectedDate,
            uploadedAt: new Date().toISOString(),
            detectedColumns: columnMap,
            dateRange,
          },
        },
      })
      .eq("id", onboarding.id);

    if (onboardingUpdateError) {
      console.error(
        "[free-readings/upload] onboarding update error",
        onboardingUpdateError
      );

      return NextResponse.json(
        { error: "A leitura foi gerada, mas não conseguimos atualizar a sessão." },
        { status: 500 }
      );
    }

    return NextResponse.json(readingWithDateRange);
  } catch (error) {
    console.error("[free-readings/upload]", error);

    return NextResponse.json(
      { error: "Erro inesperado ao gerar leitura gratuita." },
      { status: 500 }
    );
  }
}

async function readSpreadsheetRows(file: File): Promise<SpreadsheetRow[]> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const workbook = XLSX.read(buffer, {
        type: "buffer",
        cellDates: true,
    });

    const sheetName =
        workbook.SheetNames.find((name) =>
            normalizeText(name).includes("venda")
        ) ?? workbook.SheetNames[0];

    const sheet = workbook.Sheets[sheetName];

    return XLSX.utils.sheet_to_json<SpreadsheetRow>(sheet, {
        defval: "",
        raw: false,
    });
}

function detectColumns(rows: SpreadsheetRow[]): ColumnMap {
    const headers = Object.keys(rows[0] ?? {});

    return {
        date: findColumn(headers, [
            "data",
            "data da venda",
            "data venda",
            "date",
            "sold date",
            "sold_at",
        ]),
        time: findColumn(headers, [
            "hora",
            "horario",
            "horário",
            "hora da venda",
            "time",
        ]),
        product: findColumn(headers, [
            "produto",
            "produto vendido",
            "nome do produto",
            "item",
            "descrição",
            "descricao",
            "product",
        ]),
        sku: findColumn(headers, ["sku", "codigo", "código", "cod", "referencia"]),
        revenue: findColumn(headers, [
            "receita",
            "receita de venda",
            "valor vendido",
            "valor de venda",
            "venda",
            "total",
            "preco",
            "preço",
            "valor",
        ]),
        cost: findColumn(headers, [
            "cmv",
            "custo",
            "custo produto",
            "custo total",
            "cost",
        ]),
        quantity: findColumn(headers, [
            "quantidade",
            "qtd",
            "qtde",
            "unidades",
            "quantity",
        ]),
        order: findColumn(headers, [
            "pedido",
            "numero pedido",
            "número pedido",
            "order",
            "order id",
            "id pedido",
        ]),
        channel: findColumn(headers, ["canal", "channel", "origem", "loja"]),
    };
}

function normalizeRows(
    rows: SpreadsheetRow[],
    columnMap: ColumnMap
): NormalizedSaleRow[] {
    return rows
        .map((row, index) => {
            const productName = getStringValue(row, columnMap.product);

            if (!productName) return null;

            const revenue = parseMoney(getValue(row, columnMap.revenue));

            if (revenue <= 0) return null;

            const cmvColumnValue = getValue(row, columnMap.cost);
            const cmv =
                cmvColumnValue === null || String(cmvColumnValue).trim() === ""
                    ? null
                    : parseMoney(cmvColumnValue);

            const quantityValue = parseNumber(getValue(row, columnMap.quantity));
            const quantity = quantityValue > 0 ? quantityValue : 1;

            const soldDate =
                parseDateToISO(getValue(row, columnMap.date)) ??
                new Date().toISOString().slice(0, 10);

            const soldTime = parseTimeToHHMM(getValue(row, columnMap.time));

            const sku = getStringValue(row, columnMap.sku);
            const channel = getStringValue(row, columnMap.channel);

            const orderKey =
                getStringValue(row, columnMap.order) || `${soldDate}-${index + 1}`;

            const isComplementary = isComplementaryProduct(productName);

            return {
                sold_date: soldDate,
                sold_time: soldTime,
                product_name: productName,
                product_sku: sku || null,
                revenue,
                cmv,
                quantity,
                order_key: orderKey,
                channel: channel || null,
                is_complementary: isComplementary,
                product_role: isComplementary ? "complementar" : "principal",
            };
        })
        .filter((row): row is NormalizedSaleRow => row !== null);
}

function buildFreeReading({
  storeId,
  rows,
}: {
  storeId: string;
  rows: NormalizedSaleRow[];
}): {
  selectedDate: string;
  dateRange: {
    daysWithSales: number;
    minSoldDate: string | null;
    maxSoldDate: string | null;
  };
  summary: SummaryRow | null;
  previousSummary: SummaryRow | null;
  productMix: ProductMixRow[];
  shiftSummary: ShiftSummaryRow[];
  monthlyShiftRows: MonthlyShiftRow[];
  readingsByDate: Record<
    string,
    {
      summary: SummaryRow | null;
      previousSummary: SummaryRow | null;
      productMix: ProductMixRow[];
      shiftSummary: ShiftSummaryRow[];
    }
  >;
} {
  const dates = Array.from(new Set(rows.map((row) => row.sold_date))).sort();
  const selectedDate = dates[dates.length - 1];

  const readingsByDate: Record<
    string,
    {
      summary: SummaryRow | null;
      previousSummary: SummaryRow | null;
      productMix: ProductMixRow[];
      shiftSummary: ShiftSummaryRow[];
    }
  > = {};

  dates.forEach((date, index) => {
    const dayRows = rows.filter((row) => row.sold_date === date);

    const previousDate = dates[index - 1];
    const previousRows = previousDate
      ? rows.filter((row) => row.sold_date === previousDate)
      : [];

    readingsByDate[date] = {
      summary: buildSummary(storeId, date, dayRows),
      previousSummary: previousDate
        ? buildSummary(storeId, previousDate, previousRows)
        : null,
      productMix: buildProductMix(storeId, date, dayRows),
      shiftSummary: buildShiftSummary(storeId, date, dayRows),
    };
  });

  const selectedReading = readingsByDate[selectedDate];

  return {
    selectedDate,
    dateRange: {
      daysWithSales: dates.length,
      minSoldDate: dates[0] ?? null,
      maxSoldDate: selectedDate ?? null,
    },
    summary: selectedReading?.summary ?? null,
    previousSummary: selectedReading?.previousSummary ?? null,
    productMix: selectedReading?.productMix ?? [],
    shiftSummary: selectedReading?.shiftSummary ?? [],
    monthlyShiftRows: buildMonthlyShiftRows(storeId, rows),
    readingsByDate,
  };
}

function buildSummary(
    storeId: string,
    soldDate: string,
    rows: NormalizedSaleRow[]
): SummaryRow {
    const totalRevenue = sum(rows.map((row) => row.revenue));
    const knownCostRows = rows.filter((row) => row.cmv !== null);
    const missingCostRows = rows.filter((row) => row.cmv === null);

    const totalCmv =
        knownCostRows.length > 0
            ? sum(knownCostRows.map((row) => row.cmv ?? 0))
            : null;

    const grossProfit =
        totalCmv === null ? null : Math.max(0, totalRevenue - totalCmv);

    const averageMargin =
        grossProfit === null || totalRevenue <= 0 ? null : grossProfit / totalRevenue;

    return {
        store_id: storeId,
        sold_date: soldDate,
        total_revenue: roundMoney(totalRevenue),
        total_cmv: totalCmv === null ? null : roundMoney(totalCmv),
        gross_profit: grossProfit === null ? null : roundMoney(grossProfit),
        average_margin: averageMargin,
        items_sold: sum(rows.map((row) => row.quantity)),
        orders_count: new Set(rows.map((row) => row.order_key)).size,
        items_with_known_cost: knownCostRows.length,
        items_with_missing_cost: missingCostRows.length,
        margin_quality:
            knownCostRows.length === 0
                ? "unavailable"
                : missingCostRows.length > 0
                    ? "partial"
                    : "real",
    };
}

function buildProductMix(
    storeId: string,
    soldDate: string,
    rows: NormalizedSaleRow[]
): ProductMixRow[] {
    const grouped = new Map<string, NormalizedSaleRow[]>();

    rows.forEach((row) => {
        const key = `${row.product_sku ?? ""}::${row.product_name}`;
        const current = grouped.get(key) ?? [];
        current.push(row);
        grouped.set(key, current);
    });

    const productRows = Array.from(grouped.values()).map((items) => {
        const first = items[0];
        const revenue = sum(items.map((item) => item.revenue));
        const quantity = sum(items.map((item) => item.quantity));

        const knownCostRows = items.filter((item) => item.cmv !== null);
        const missingCostRows = items.filter((item) => item.cmv === null);

        const cmv =
            knownCostRows.length > 0
                ? sum(knownCostRows.map((item) => item.cmv ?? 0))
                : null;

        const grossProfit = cmv === null ? null : revenue - cmv;
        const marginRate =
            grossProfit === null || revenue <= 0 ? null : grossProfit / revenue;

        return {
            store_id: storeId,
            sold_date: soldDate,
            product_name: first.product_name,
            product_sku: first.product_sku,
            product_role: first.product_role,
            is_complementary: first.is_complementary,
            quantity_sold: quantity,
            revenue: roundMoney(revenue),
            cmv: cmv === null ? null : roundMoney(cmv),
            gross_profit: grossProfit === null ? null : roundMoney(grossProfit),
            margin_rate: marginRate,
            margin_quality:
                knownCostRows.length === 0
                    ? "unavailable"
                    : missingCostRows.length > 0
                        ? "partial"
                        : "real",
            ohrly_mix_group: "Outros itens vendidos",
        } satisfies ProductMixRow;
    });

    const byProfit = productRows
        .slice()
        .sort((a, b) => toNumber(b.gross_profit) - toNumber(a.gross_profit))
        .slice(0, 3)
        .map((row) => row.product_name);

    return productRows
        .map((row) => ({
            ...row,
            ohrly_mix_group: classifyProductMixGroup(row, byProfit),
        }))
        .sort((a, b) => toNumber(b.revenue) - toNumber(a.revenue));
}

function buildShiftSummary(
    storeId: string,
    soldDate: string,
    rows: NormalizedSaleRow[]
): ShiftSummaryRow[] {
    const grouped = new Map<string, NormalizedSaleRow[]>();

    rows.forEach((row) => {
        const bucket = getShiftBucket(row.sold_time);
        const current = grouped.get(bucket) ?? [];
        current.push(row);
        grouped.set(bucket, current);
    });

    const orderedBuckets = [
        "08:00-13:59",
        "14:00-19:59",
        "fora_do_horario_principal",
    ];

    return orderedBuckets
        .filter((bucket) => grouped.has(bucket))
        .map((bucket) => {
            const bucketRows = grouped.get(bucket) ?? [];

            const revenue = sum(bucketRows.map((row) => row.revenue));
            const knownCostRows = bucketRows.filter((row) => row.cmv !== null);
            const cmv =
                knownCostRows.length > 0
                    ? sum(knownCostRows.map((row) => row.cmv ?? 0))
                    : null;

            const grossProfit = cmv === null ? null : revenue - cmv;
            const averageMargin =
                grossProfit === null || revenue <= 0 ? null : grossProfit / revenue;

            const complementaryRows = bucketRows.filter((row) => row.is_complementary);
            const complementaryRevenue = sum(
                complementaryRows.map((row) => row.revenue)
            );

            const complementaryKnownCosts = complementaryRows.filter(
                (row) => row.cmv !== null
            );

            const complementaryCmv =
                complementaryKnownCosts.length > 0
                    ? sum(complementaryKnownCosts.map((row) => row.cmv ?? 0))
                    : null;

            const complementaryGrossProfit =
                complementaryCmv === null
                    ? null
                    : complementaryRevenue - complementaryCmv;

            return {
                store_id: storeId,
                sold_date: soldDate,
                shift_bucket: bucket,
                revenue: roundMoney(revenue),
                cmv: cmv === null ? null : roundMoney(cmv),
                gross_profit: grossProfit === null ? null : roundMoney(grossProfit),
                average_margin: averageMargin,
                items_sold: sum(bucketRows.map((row) => row.quantity)),
                orders_count: new Set(bucketRows.map((row) => row.order_key)).size,
                complementary_items_sold: sum(
                    complementaryRows.map((row) => row.quantity)
                ),
                complementary_revenue: roundMoney(complementaryRevenue),
                complementary_gross_profit:
                    complementaryGrossProfit === null
                        ? null
                        : roundMoney(complementaryGrossProfit),
            };
        });
}

function buildMonthlyShiftRows(
    storeId: string,
    rows: NormalizedSaleRow[]
): MonthlyShiftRow[] {
    const grouped = new Map<
        string,
        {
            morningRevenue: number;
            afternoonRevenue: number;
        }
    >();

    rows.forEach((row) => {
        const monthStart = `${row.sold_date.slice(0, 7)}-01`;
        const current = grouped.get(monthStart) ?? {
            morningRevenue: 0,
            afternoonRevenue: 0,
        };

        const bucket = getShiftBucket(row.sold_time);

        if (bucket === "08:00-13:59") {
            current.morningRevenue += row.revenue;
        }

        if (bucket === "14:00-19:59") {
            current.afternoonRevenue += row.revenue;
        }

        grouped.set(monthStart, current);
    });

    return Array.from(grouped.entries())
        .map(([monthStart, value]) => ({
            store_id: storeId,
            month_start: monthStart,
            morning_revenue: roundMoney(value.morningRevenue),
            afternoon_revenue: roundMoney(value.afternoonRevenue),
            best_shift:
                value.morningRevenue === value.afternoonRevenue
                    ? "Empate"
                    : value.morningRevenue > value.afternoonRevenue
                        ? "Manhã"
                        : "Tarde",
        }))
        .sort((a, b) => a.month_start.localeCompare(b.month_start));
}

function classifyProductMixGroup(
    row: ProductMixRow,
    topProfitProductNames: string[]
): string {
    const margin = toNumber(row.margin_rate);

    if (row.margin_quality === "unavailable") {
        return "Sem leitura de margem";
    }

    if (margin > 0 && margin < 0.15) {
        return "Margem fraca";
    }

    if (row.is_complementary) {
        return "Candidatos a oferta/comissão";
    }

    if (topProfitProductNames.includes(row.product_name)) {
        return "Puxaram lucro";
    }

    if (toNumber(row.quantity_sold) >= 2) {
        return "Giraram caixa";
    }

    return "Outros itens vendidos";
}

function getShiftBucket(time: string | null): string {
    if (!time) return "fora_do_horario_principal";

    const hour = Number(time.slice(0, 2));

    if (Number.isNaN(hour)) return "fora_do_horario_principal";

    if (hour >= 8 && hour <= 13) return "08:00-13:59";
    if (hour >= 14 && hour <= 19) return "14:00-19:59";

    return "fora_do_horario_principal";
}

function findColumn(headers: string[], aliases: string[]): string | undefined {
    const normalizedAliases = aliases.map(normalizeText);

    return headers.find((header) => {
        const normalizedHeader = normalizeText(header);

        return normalizedAliases.some(
            (alias) => normalizedHeader === alias || normalizedHeader.includes(alias)
        );
    });
}

function getValue(row: SpreadsheetRow, column?: string): unknown {
    if (!column) return null;

    return row[column] ?? null;
}

function getStringValue(row: SpreadsheetRow, column?: string): string {
    const value = getValue(row, column);

    if (value === null || value === undefined) return "";

    return String(value).trim();
}

function parseMoney(value: unknown): number {
    if (value === null || value === undefined) return 0;

    if (typeof value === "number") return value;

    let text = String(value).trim();

    if (!text) return 0;

    text = text.replace(/[^\d,.-]/g, "");

    if (text.includes(",") && text.includes(".")) {
        text = text.replace(/\./g, "").replace(",", ".");
    } else if (text.includes(",")) {
        text = text.replace(",", ".");
    }

    const parsed = Number(text);

    return Number.isFinite(parsed) ? parsed : 0;
}

function parseNumber(value: unknown): number {
    return parseMoney(value);
}

function parseDateToISO(value: unknown): string | null {
    if (value === null || value === undefined || value === "") return null;

    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        return value.toISOString().slice(0, 10);
    }

    if (typeof value === "number") {
        const parsed = XLSX.SSF.parse_date_code(value);

        if (!parsed) return null;

        return `${parsed.y}-${String(parsed.m).padStart(2, "0")}-${String(
            parsed.d
        ).padStart(2, "0")}`;
    }

    const text = String(value).trim();

    const isoMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})/);

    if (isoMatch) {
        return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
    }

    const brMatch = text.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})/);

    if (brMatch) {
        const day = brMatch[1].padStart(2, "0");
        const month = brMatch[2].padStart(2, "0");
        const year =
            brMatch[3].length === 2 ? `20${brMatch[3]}` : brMatch[3];

        return `${year}-${month}-${day}`;
    }

    const parsed = new Date(text);

    if (!Number.isNaN(parsed.getTime())) {
        return parsed.toISOString().slice(0, 10);
    }

    return null;
}

function parseTimeToHHMM(value: unknown): string | null {
    if (value === null || value === undefined || value === "") return null;

    if (typeof value === "number") {
        const totalMinutes = Math.round(value * 24 * 60);
        const hours = Math.floor(totalMinutes / 60) % 24;
        const minutes = totalMinutes % 60;

        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
            2,
            "0"
        )}`;
    }

    const text = String(value).trim();

    const match = text.match(/(\d{1,2}):(\d{2})/);

    if (!match) return null;

    return `${match[1].padStart(2, "0")}:${match[2]}`;
}

function isComplementaryProduct(productName: string): boolean {
    const normalized = normalizeText(productName);

    const keywords = [
        "oleo",
        "lubrificante",
        "viseira",
        "suporte",
        "luva",
        "capa",
        "balaclava",
        "rede",
        "reparo",
        "trava",
        "pelicula",
        "lampada",
        "lampada",
        "farol",
        "intercomunicador",
        "limpador",
        "adesivo",
        "cabo",
    ];

    return keywords.some((keyword) => normalized.includes(keyword));
}

function normalizeText(value: string): string {
    return value
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .trim();
}

function sum(values: number[]): number {
    return values.reduce((acc, value) => acc + toNumber(value), 0);
}

function toNumber(value: number | null | undefined): number {
    if (value === null || value === undefined) return 0;

    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : 0;
}

function roundMoney(value: number): number {
    return Math.round(value * 100) / 100;
}

function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}