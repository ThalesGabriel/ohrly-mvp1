import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export const runtime = "nodejs";

type ColumnPreview = {
  name: string;
  examples: string[];
};

type SuggestedMapping = {
  sheetName?: string;
  productColumn?: string;
  revenueColumn?: string;
  dateColumn?: string;
  timeColumn?: string;
  costColumn?: string;
  quantityColumn?: string;
  skuColumn?: string;
  orderColumn?: string;
  channelColumn?: string;
  useSingleDay: boolean;
  singleDayDate?: string;
  hasHeader: boolean;
};

const MAX_FILE_SIZE_IN_MB = 8;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Envie uma planilha válida." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_IN_MB * 1024 * 1024) {
      return NextResponse.json(
        {
          error: `A planilha precisa ter até ${MAX_FILE_SIZE_IN_MB}MB para a leitura gratuita.`,
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const workbook = XLSX.read(buffer, {
      type: "buffer",
      cellDates: true,
    });

    if (workbook.SheetNames.length === 0) {
      return NextResponse.json(
        { error: "A planilha não possui abas para leitura." },
        { status: 400 }
      );
    }

    const sheetName = chooseBestSheetName(workbook.SheetNames);
    const sheet = workbook.Sheets[sheetName];

    const rawRows = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
      header: 1,
      defval: "",
      raw: false,
      blankrows: false,
    });

    const preview = buildPreview(rawRows);

    if (preview.columns.length === 0) {
      return NextResponse.json(
        {
          error:
            "Não conseguimos identificar colunas na planilha. Verifique se o arquivo possui dados.",
        },
        { status: 400 }
      );
    }

    const suggestedMapping = buildSuggestedMapping({
      columns: preview.columns,
      sheetName,
      hasHeader: preview.hasHeader,
    });

    return NextResponse.json({
      fileName: file.name,
      sheetName,
      hasHeader: preview.hasHeader,
      columns: preview.columns,
      suggestedMapping,
    });
  } catch (error) {
    console.error("[free-readings/preview]", error);

    return NextResponse.json(
      { error: "Erro inesperado ao ler prévia da planilha." },
      { status: 500 }
    );
  }
}

function chooseBestSheetName(sheetNames: string[]): string {
  return (
    sheetNames.find((name) => normalizeText(name).includes("venda")) ??
    sheetNames.find((name) => normalizeText(name).includes("sales")) ??
    sheetNames[0]
  );
}

function buildPreview(rawRows: unknown[][]): {
  hasHeader: boolean;
  columns: ColumnPreview[];
} {
  const usableRows = rawRows.filter((row) =>
    row.some((cell) => toCellText(cell).length > 0)
  );

  if (usableRows.length === 0) {
    return {
      hasHeader: true,
      columns: [],
    };
  }

  const headerRowIndex = detectHeaderRowIndex(usableRows);

  if (headerRowIndex !== null) {
    const headerRow = usableRows[headerRowIndex];
    const dataRows = usableRows.slice(headerRowIndex + 1);

    const headers = headerRow.map((cell, index) => {
      const value = toCellText(cell);
      return value || columnLabel(index);
    });

    const columns = headers.map((header, index) => ({
      name: makeUniqueHeader(header, headers, index),
      examples: collectExamples(dataRows, index),
    }));

    return {
      hasHeader: true,
      columns: columns.filter((column) => column.name.trim().length > 0),
    };
  }

  const widestRowLength = Math.max(...usableRows.map((row) => row.length));

  const columns = Array.from({ length: widestRowLength }).map((_, index) => ({
    name: columnLabel(index),
    examples: collectExamples(usableRows, index),
  }));

  return {
    hasHeader: false,
    columns,
  };
}

function detectHeaderRowIndex(rows: unknown[][]): number | null {
  const rowsToInspect = rows.slice(0, 8);

  for (let index = 0; index < rowsToInspect.length; index += 1) {
    const row = rowsToInspect[index];
    const normalizedCells = row.map((cell) => normalizeText(toCellText(cell)));

    const hasKnownHeader = normalizedCells.some((cell) =>
      [
        "data",
        "data da venda",
        "produto",
        "produto vendido",
        "descricao",
        "descrição",
        "item",
        "receita",
        "receita de venda",
        "valor",
        "valor vendido",
        "total",
        "cmv",
        "custo",
        "quantidade",
        "qtd",
        "hora",
        "horario",
        "horário",
        "sku",
        "pedido",
        "canal",
      ].some((alias) => cell === normalizeText(alias))
    );

    if (hasKnownHeader) {
      return index;
    }
  }

  const firstRow = rowsToInspect[0] ?? [];
  const secondRow = rowsToInspect[1] ?? [];

  const firstRowTexts = firstRow.map(toCellText).filter(Boolean);
  const secondRowTexts = secondRow.map(toCellText).filter(Boolean);

  if (firstRowTexts.length >= 2 && secondRowTexts.length >= 2) {
    const firstRowLooksTextual =
      firstRowTexts.filter((value) => /[a-zA-ZÀ-ÿ]/.test(value)).length >=
      Math.ceil(firstRowTexts.length / 2);

    const secondRowHasValues =
      secondRowTexts.some(looksLikeMoneyOrNumber) ||
      secondRowTexts.some(looksLikeDate);

    if (firstRowLooksTextual && secondRowHasValues) {
      return 0;
    }
  }

  return null;
}

function buildSuggestedMapping({
  columns,
  sheetName,
  hasHeader,
}: {
  columns: ColumnPreview[];
  sheetName: string;
  hasHeader: boolean;
}): SuggestedMapping {
  const names = columns.map((column) => column.name);

  const dateColumn = findColumn(names, [
    "data",
    "data da venda",
    "data venda",
    "date",
    "sold date",
    "sold_at",
  ]);

  return {
    sheetName,
    hasHeader,

    productColumn: findColumn(names, [
      "produto",
      "produto vendido",
      "nome do produto",
      "item",
      "descrição",
      "descricao",
      "product",
    ]),

    revenueColumn: findColumn(names, [
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

    dateColumn,

    timeColumn: findColumn(names, [
      "hora",
      "horario",
      "horário",
      "hora da venda",
      "time",
    ]),

    costColumn: findColumn(names, [
      "cmv",
      "custo",
      "custo produto",
      "custo total",
      "cost",
    ]),

    quantityColumn: findColumn(names, [
      "quantidade",
      "qtd",
      "qtde",
      "unidades",
      "quantity",
    ]),

    skuColumn: findColumn(names, [
      "sku",
      "codigo",
      "código",
      "cod",
      "referencia",
      "referência",
    ]),

    orderColumn: findColumn(names, [
      "pedido",
      "numero pedido",
      "número pedido",
      "order",
      "order id",
      "id pedido",
    ]),

    channelColumn: findColumn(names, ["canal", "channel", "origem", "loja"]),

    useSingleDay: !dateColumn,
    singleDayDate: "",
  };
}

function findColumn(headers: string[], aliases: string[]): string | undefined {
  const normalizedAliases = aliases.map(normalizeText);

  return headers.find((header) => {
    const normalizedHeader = normalizeText(header);

    return normalizedAliases.some(
      (alias) =>
        normalizedHeader === alias ||
        normalizedHeader.includes(alias) ||
        alias.includes(normalizedHeader)
    );
  });
}

function collectExamples(rows: unknown[][], columnIndex: number): string[] {
  const examples: string[] = [];

  for (const row of rows) {
    const value = toCellText(row[columnIndex]);

    if (!value) continue;
    if (examples.includes(value)) continue;

    examples.push(value);

    if (examples.length >= 4) break;
  }

  return examples;
}

function makeUniqueHeader(
  header: string,
  allHeaders: string[],
  currentIndex: number
): string {
  const repeatedBefore = allHeaders
    .slice(0, currentIndex)
    .filter((candidate) => candidate === header).length;

  if (repeatedBefore === 0) return header;

  return `${header} ${repeatedBefore + 1}`;
}

function columnLabel(index: number): string {
  let label = "";
  let number = index + 1;

  while (number > 0) {
    const remainder = (number - 1) % 26;
    label = String.fromCharCode(65 + remainder) + label;
    number = Math.floor((number - 1) / 26);
  }

  return `Coluna ${label}`;
}

function toCellText(value: unknown): string {
  if (value === null || value === undefined) return "";

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  return String(value).trim();
}

function looksLikeMoneyOrNumber(value: string): boolean {
  const clean = value.replace(/[^\d,.-]/g, "");

  if (!clean) return false;

  const normalized = clean.includes(",")
    ? clean.replace(/\./g, "").replace(",", ".")
    : clean;

  return Number.isFinite(Number(normalized));
}

function looksLikeDate(value: string): boolean {
  return (
    /^\d{4}-\d{2}-\d{2}/.test(value) ||
    /^\d{1,2}[/-]\d{1,2}[/-]\d{2,4}/.test(value)
  );
}

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}