import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import * as XLSX from "xlsx";
import crypto from "node:crypto";

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

type SpreadsheetRow = Record<string, unknown>;

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { error: "Usuário não autenticado." },
        { status: 401 }
      );
    }

    const userClient = createClient(supabaseUrl!, supabaseAnonKey!, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
      auth: {
        persistSession: false,
      },
    });

    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Sessão inválida ou expirada." },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    const file = formData.get("file");
    const selectedDate = String(formData.get("selectedDate") ?? "");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Nenhuma planilha enviada." },
        { status: 400 }
      );
    }

    if (!selectedDate) {
      return NextResponse.json(
        { error: "Informe o dia da leitura." },
        { status: 400 }
      );
    }

    const store = await getUserStore(user.id);

    if (!store) {
      return NextResponse.json(
        { error: "Usuário não está vinculado a uma loja." },
        { status: 403 }
      );
    }

    const rows = await readSpreadsheet(file);

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "A planilha não possui linhas válidas." },
        { status: 400 }
      );
    }

    const dataImport = await createImport({
      organizationId: store.organization_id,
      storeId: store.id,
      fileName: file.name,
    });

    const normalizedRows = rows
  .map((row, index) =>
    normalizeSpreadsheetRow({
      row,
      index,
      selectedDate,
      organizationId: store.organization_id,
      storeId: store.id,
      importId: dataImport.id,
      fileName: file.name,
    })
  )
  .filter(isNormalizedSpreadsheetRow);

    if (normalizedRows.length === 0) {
      await markImportAsFailed(dataImport.id, {
        reason: "Nenhuma linha reconhecida na planilha.",
      });

      return NextResponse.json(
        {
          error:
            "Não consegui reconhecer produto, receita, CMV ou lucro na planilha.",
        },
        { status: 400 }
      );
    }

    const { error: insertError } = await supabaseAdmin
      .from("sales_order_items")
      .insert(normalizedRows);

    if (insertError) {
      await markImportAsFailed(dataImport.id, {
        reason: insertError.message,
      });

      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    await markImportAsCompleted(dataImport.id, {
      rows_read: rows.length,
      rows_imported: normalizedRows.length,
      source: "manual_spreadsheet",
    });

    return NextResponse.json({
      ok: true,
      importedRows: normalizedRows.length,
      selectedDate,
      fileName: file.name,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro inesperado ao importar planilha.",
      },
      { status: 500 }
    );
  }
}

async function getUserStore(userId: string) {
  const { data: membership, error: membershipError } = await supabaseAdmin
    .from("organization_memberships")
    .select("organization_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (membershipError) {
    throw membershipError;
  }

  if (!membership) {
    return null;
  }

  const { data: store, error: storeError } = await supabaseAdmin
    .from("stores")
    .select("*")
    .eq("organization_id", membership.organization_id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (storeError) {
    throw storeError;
  }

  return store;
}

async function createImport(input: {
  organizationId: string;
  storeId: string;
  fileName: string;
}) {
  const { data, error } = await supabaseAdmin
    .from("data_imports")
    .insert({
      organization_id: input.organizationId,
      store_id: input.storeId,
      source: "manual_spreadsheet",
      file_name: input.fileName,
      status: "processing",
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

async function markImportAsCompleted(
  importId: string,
  metadata: Record<string, unknown>
) {
  const { error } = await supabaseAdmin
    .from("data_imports")
    .update({
      status: "completed",
      metadata,
    })
    .eq("id", importId);

  if (error) throw error;
}

async function markImportAsFailed(
  importId: string,
  metadata: Record<string, unknown>
) {
  const { error } = await supabaseAdmin
    .from("data_imports")
    .update({
      status: "failed",
      metadata,
    })
    .eq("id", importId);

  if (error) throw error;
}

type NormalizedSpreadsheetRow = NonNullable<
  ReturnType<typeof normalizeSpreadsheetRow>
>;

function isNormalizedSpreadsheetRow(
  row: ReturnType<typeof normalizeSpreadsheetRow>
): row is NormalizedSpreadsheetRow {
  return row !== null;
}

async function readSpreadsheet(file: File): Promise<SpreadsheetRow[]> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const workbook = XLSX.read(buffer, {
    type: "buffer",
    cellDates: true,
  });

  const firstSheetName = workbook.SheetNames[0];

  if (!firstSheetName) {
    return [];
  }

  const sheet = workbook.Sheets[firstSheetName];

  return XLSX.utils.sheet_to_json<SpreadsheetRow>(sheet, {
    defval: null,
  });
}

function normalizeSpreadsheetRow(input: {
  row: SpreadsheetRow;
  index: number;
  selectedDate: string;
  organizationId: string;
  storeId: string;
  importId: string;
  fileName: string;
}) {
  const { row, index, selectedDate } = input;

  const productName =
    pickText(row, [
      "produto",
      "produto vendido",
      "nome do produto",
      "item",
      "descrição",
      "descricao",
    ]) ?? `Produto sem nome ${index + 1}`;

  const revenue = pickMoney(row, [
    "receita de venda",
    "receita",
    "venda",
    "valor de venda",
    "valor vendido",
    "total",
  ]);

  const cmv = pickMoney(row, ["cmv", "custo", "custo produto", "custo total"]);

  const grossProfitFromSheet = pickMoney(row, [
    "lucro bruto",
    "lucro",
    "lucro dia",
    "resultado",
  ]);

  if (revenue === null && cmv === null && grossProfitFromSheet === null) {
    return null;
  }

  const itemRevenue = revenue ?? 0;
  const itemCmv =
    cmv ?? (grossProfitFromSheet !== null ? itemRevenue - grossProfitFromSheet : null);

  const grossProfit =
    grossProfitFromSheet ?? (itemCmv !== null ? itemRevenue - itemCmv : null);

  const marginRate =
    grossProfit !== null && itemRevenue > 0 ? grossProfit / itemRevenue : null;

  const quantity =
    pickMoney(row, ["quantidade", "qtd", "qtde"]) ?? 1;

  const time = pickText(row, ["hora", "horário", "horario"]);
  const soldAt = buildSoldAt(selectedDate, time, index);

  const classification = classifyProduct(productName);

  return {
    organization_id: input.organizationId,
    store_id: input.storeId,
    import_id: input.importId,

    source: "manual_spreadsheet",
    line_fingerprint: sha256Key(
      input.storeId,
      input.fileName,
      selectedDate,
      productName,
      String(index)
    ),

    order_number: `manual-${selectedDate}-${index + 1}`,
    order_identifier: null,
    transaction_identifier: null,
    order_link: null,

    sold_at: soldAt,

    payment_status: "Confirmado",
    order_status: "manual_spreadsheet",
    shipping_status: null,

    channel: "Planilha manual",
    payment_method: null,
    delivery_method: null,
    seller: null,
    registered_by: null,
    point_of_sale: null,

    customer_key: null,
    customer_name: null,
    customer_email: null,
    customer_phone: null,
    customer_document: null,
    customer_city: null,
    customer_state: null,

    product_name: productName,
    product_name_normalized: normalizeKey(productName),
    product_sku: pickText(row, ["sku", "código", "codigo"]),
    product_category: null,
    product_brand: null,

    product_role: classification.productRole,
    is_complementary: classification.isComplementary,

    quantity,
    unit_price: quantity > 0 ? itemRevenue / quantity : itemRevenue,
    item_revenue: itemRevenue,

    unit_cost: itemCmv !== null && quantity > 0 ? itemCmv / quantity : null,
    cost_status: itemCmv !== null ? "known" : "missing",
    item_cmv: itemCmv,
    gross_profit: grossProfit,
    margin_rate: marginRate,

    raw_payload: row,
  };
}

function buildSoldAt(selectedDate: string, time: string | null, index: number) {
  if (time) {
    const normalizedTime = time.includes(":") ? time : `${time}:00`;

    return `${selectedDate}T${normalizedTime.length === 5 ? `${normalizedTime}:00` : normalizedTime}`;
  }

  const hour = index % 2 === 0 ? "10:00:00" : "15:00:00";

  return `${selectedDate}T${hour}`;
}

function pickText(row: SpreadsheetRow, possibleNames: string[]) {
  for (const [key, value] of Object.entries(row)) {
    const normalizedKey = normalizeKey(key);

    if (!normalizedKey) continue;

    const matched = possibleNames.some(
      (name) => normalizedKey === normalizeKey(name)
    );

    if (!matched) continue;

    const text = normalizeText(value);

    if (text) return text;
  }

  return null;
}

function pickMoney(row: SpreadsheetRow, possibleNames: string[]) {
  const text = pickText(row, possibleNames);

  if (!text) return null;

  return parseMoney(text);
}

function parseMoney(value: unknown): number | null {
  if (value === null || value === undefined) return null;

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  let text = String(value)
    .replace("R$", "")
    .replace("BRL", "")
    .replace(/\s/g, "")
    .trim();

  if (!text) return null;

  if (text.includes(",")) {
    text = text.replace(/\./g, "").replace(",", ".");
  }

  const parsed = Number(text);

  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeText(value: unknown): string | null {
  if (value === null || value === undefined) return null;

  const text = String(value).trim();

  return text || null;
}

function normalizeKey(value: unknown): string | null {
  const text = normalizeText(value);

  if (!text) return null;

  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function sha256Key(...values: Array<string | null | undefined>) {
  return crypto
    .createHash("sha256")
    .update(values.map((value) => value ?? "").join("|").toLowerCase())
    .digest("hex");
}

function classifyProduct(name: unknown): {
  productRole: "main_product" | "complementary" | "service" | "unknown";
  isComplementary: boolean;
} {
  const text = normalizeKey(name) ?? "";

  const complementaryTerms = [
    "viseira",
    "balaclava",
    "rede",
    "suporte",
    "oleo",
    "mobil",
    "reparo",
    "luva",
    "antena",
    "capa de chuva",
    "limpeza",
    "lubrificante",
    "manopla",
    "retrovisor",
    "adesivo",
    "intercomunicador",
  ];

  const mainProductTerms = [
    "capacete",
    "norisk",
    "ls2",
    "fw3",
    "gtx",
    "asx",
    "xopen",
    "helmet",
  ];

  if (complementaryTerms.some((term) => text.includes(term))) {
    return {
      productRole: "complementary",
      isComplementary: true,
    };
  }

  if (mainProductTerms.some((term) => text.includes(term))) {
    return {
      productRole: "main_product",
      isComplementary: false,
    };
  }

  return {
    productRole: "unknown",
    isComplementary: false,
  };
}