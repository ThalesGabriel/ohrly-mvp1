"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Columns3,
  FileSpreadsheet,
  HelpCircle,
  RefreshCcw,
  X,
} from "lucide-react";

export type ColumnPreview = {
  name: string;
  examples: string[];
};

export type ColumnMapping = {
  sheetName?: string;

  productColumn: string;
  revenueColumn: string;

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

type ColumnMappingModalProps = {
  open: boolean;
  fileName: string;
  sheetName?: string;
  columns: ColumnPreview[];
  initialMapping?: Partial<ColumnMapping>;
  isSubmitting?: boolean;
  onClose: () => void;
  onChangeFile?: () => void;
  onConfirm: (mapping: ColumnMapping) => void;
};

const emptyMapping: ColumnMapping = {
  productColumn: "",
  revenueColumn: "",

  dateColumn: "",
  timeColumn: "",
  costColumn: "",
  quantityColumn: "",
  skuColumn: "",
  orderColumn: "",
  channelColumn: "",

  useSingleDay: false,
  singleDayDate: "",

  hasHeader: true,
};

export function ColumnMappingModal({
  open,
  fileName,
  sheetName,
  columns,
  initialMapping,
  isSubmitting = false,
  onClose,
  onChangeFile,
  onConfirm,
}: ColumnMappingModalProps) {
  const [mapping, setMapping] = useState<ColumnMapping>({
    ...emptyMapping,
    ...initialMapping,
    sheetName,
  });

  useEffect(() => {
    if (!open) return;

    setMapping({
      ...emptyMapping,
      ...initialMapping,
      sheetName,
    });
  }, [open, initialMapping, sheetName]);

  const validation = useMemo(() => {
    const errors: string[] = [];

    if (!mapping.productColumn) {
      errors.push("Informe qual coluna representa o produto vendido.");
    }

    if (!mapping.revenueColumn) {
      errors.push("Informe qual coluna representa a receita ou valor vendido.");
    }

    if (mapping.useSingleDay && !mapping.singleDayDate) {
      errors.push("Informe a data dessa planilha.");
    }

    if (!mapping.useSingleDay && !mapping.dateColumn) {
      errors.push(
        "Informe uma coluna de data ou marque que a planilha representa um único dia."
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, [mapping]);

  if (!open) return null;

  function updateMapping<K extends keyof ColumnMapping>(
    key: K,
    value: ColumnMapping[K]
  ) {
    setMapping((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleConfirm() {
    if (!validation.isValid) return;
    onConfirm(mapping);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-950/20">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-5 sm:px-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
              <Columns3 className="h-6 w-6" />
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-wide text-violet-700">
                De/para da planilha
              </p>

              <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
                Confirme os campos principais
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                Para gerar a leitura gratuita, o Ohrly só precisa saber onde
                estão as informações essenciais. O restante da planilha não será
                analisado nesse plano.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="grid max-h-[calc(92vh-200px)] grid-cols-1 overflow-y-auto lg:grid-cols-[1.35fr_0.65fr]">
          <main className="px-5 py-5 sm:px-6">
            <div className="rounded-3xl border border-violet-200 bg-violet-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                    <FileSpreadsheet className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] font-black uppercase tracking-wide text-violet-700">
                      Arquivo selecionado
                    </p>

                    <p className="truncate text-sm font-black text-violet-950">
                      {fileName}
                    </p>

                    {sheetName ? (
                      <p className="mt-0.5 text-xs font-bold text-violet-700">
                        Aba: {sheetName}
                      </p>
                    ) : null}
                  </div>
                </div>

                {onChangeFile ? (
                  <button
                    type="button"
                    onClick={onChangeFile}
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-violet-200 bg-white px-4 py-2.5 text-xs font-black text-violet-700 transition hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <RefreshCcw className="h-3.5 w-3.5" />
                    Trocar planilha
                  </button>
                ) : null}
              </div>
            </div>

            <section className="mt-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-950">
                    Campos obrigatórios
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Sem esses campos, o Ohrly não consegue gerar a leitura do
                    dia.
                  </p>
                </div>

                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-500">
                  <HelpCircle className="h-3.5 w-3.5" />
                  Selecione a coluna equivalente
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <ColumnSelect
                  label="Produto vendido"
                  required
                  value={mapping.productColumn}
                  columns={columns}
                  placeholder="Selecione a coluna de produto"
                  onChange={(value) => updateMapping("productColumn", value)}
                />

                <ColumnSelect
                  label="Receita / valor vendido"
                  required
                  value={mapping.revenueColumn}
                  columns={columns}
                  placeholder="Selecione a coluna de receita"
                  onChange={(value) => updateMapping("revenueColumn", value)}
                />
              </div>
            </section>

            <section className="mt-7">
              <h3 className="text-base font-black text-slate-950">
                Data da leitura
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Use uma coluna de data quando a base tiver vários dias. Se a
                planilha for diária, informe a data manualmente.
              </p>

              <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={mapping.useSingleDay}
                    onChange={(event) =>
                      updateMapping("useSingleDay", event.target.checked)
                    }
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-violet-700 focus:ring-violet-500"
                  />

                  <div>
                    <p className="text-sm font-black text-slate-800">
                      Minha planilha representa um único dia
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Marque esta opção quando sua planilha não tiver uma coluna
                      de data.
                    </p>
                  </div>
                </label>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  {mapping.useSingleDay ? (
                    <label className="block rounded-2xl border border-slate-200 bg-white px-4 py-3">
                      <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
                        <CalendarDays className="h-3.5 w-3.5 text-violet-700" />
                        Data da planilha
                        <span className="text-violet-700">*</span>
                      </span>

                      <input
                        type="date"
                        value={mapping.singleDayDate ?? ""}
                        onChange={(event) =>
                          updateMapping("singleDayDate", event.target.value)
                        }
                        className="mt-2 w-full bg-transparent text-sm font-black text-slate-800 outline-none"
                      />
                    </label>
                  ) : (
                    <ColumnSelect
                      label="Data da venda"
                      required
                      value={mapping.dateColumn ?? ""}
                      columns={columns}
                      placeholder="Selecione a coluna de data"
                      onChange={(value) => updateMapping("dateColumn", value)}
                    />
                  )}

                  <ColumnSelect
                    label="Horário"
                    value={mapping.timeColumn ?? ""}
                    columns={columns}
                    placeholder="Opcional"
                    allowEmpty
                    emptyLabel="Não tenho horário"
                    onChange={(value) => updateMapping("timeColumn", value)}
                  />
                </div>
              </div>
            </section>

            <section className="mt-7">
              <h3 className="text-base font-black text-slate-950">
                Campos recomendados
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Esses campos melhoram a leitura, mas não impedem o plano
                gratuito.
              </p>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <ColumnSelect
                  label="Custo / CMV"
                  value={mapping.costColumn ?? ""}
                  columns={columns}
                  placeholder="Opcional"
                  allowEmpty
                  emptyLabel="Não tenho custo"
                  onChange={(value) => updateMapping("costColumn", value)}
                />

                <ColumnSelect
                  label="Quantidade"
                  value={mapping.quantityColumn ?? ""}
                  columns={columns}
                  placeholder="Opcional"
                  allowEmpty
                  emptyLabel="Usar 1 por linha"
                  onChange={(value) => updateMapping("quantityColumn", value)}
                />
              </div>
            </section>

            <section className="mt-7">
              <h3 className="text-base font-black text-slate-950">
                Campos opcionais
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Servem para melhorar leituras futuras e organizar melhor a base.
              </p>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <ColumnSelect
                  label="SKU / código"
                  value={mapping.skuColumn ?? ""}
                  columns={columns}
                  placeholder="Opcional"
                  allowEmpty
                  emptyLabel="Não tenho SKU"
                  onChange={(value) => updateMapping("skuColumn", value)}
                />

                <ColumnSelect
                  label="Pedido"
                  value={mapping.orderColumn ?? ""}
                  columns={columns}
                  placeholder="Opcional"
                  allowEmpty
                  emptyLabel="Não tenho pedido"
                  onChange={(value) => updateMapping("orderColumn", value)}
                />

                <ColumnSelect
                  label="Canal"
                  value={mapping.channelColumn ?? ""}
                  columns={columns}
                  placeholder="Opcional"
                  allowEmpty
                  emptyLabel="Não tenho canal"
                  onChange={(value) => updateMapping("channelColumn", value)}
                />
              </div>
            </section>
          </main>

          <aside className="border-t border-slate-200 bg-slate-50 px-5 py-5 sm:px-6 lg:border-l lg:border-t-0">
            <div className="sticky top-5 space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                  Resumo do mapeamento
                </p>

                <div className="mt-4 space-y-3">
                  <MappingStatusRow
                    label="Produto"
                    value={mapping.productColumn}
                    required
                  />

                  <MappingStatusRow
                    label="Receita"
                    value={mapping.revenueColumn}
                    required
                  />

                  <MappingStatusRow
                    label="Data"
                    value={
                      mapping.useSingleDay
                        ? mapping.singleDayDate
                        : mapping.dateColumn
                    }
                    required
                  />

                  <MappingStatusRow
                    label="CMV"
                    value={mapping.costColumn}
                  />

                  <MappingStatusRow
                    label="Horário"
                    value={mapping.timeColumn}
                  />

                  <MappingStatusRow
                    label="Quantidade"
                    value={mapping.quantityColumn}
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />

                  <div>
                    <p className="text-sm font-black text-amber-950">
                      O plano gratuito lê apenas o essencial
                    </p>

                    <p className="mt-2 text-sm leading-6 text-amber-900/80">
                      A análise completa da planilha, explicação das policies e
                      acompanhamento das oportunidades entram no plano pago.
                    </p>
                  </div>
                </div>
              </div>

              {validation.errors.length > 0 ? (
                <div className="rounded-3xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-black text-red-800">
                    Antes de continuar:
                  </p>

                  <ul className="mt-2 space-y-1 text-sm leading-6 text-red-700">
                    {validation.errors.map((error) => (
                      <li key={error}>• {error}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />

                    <div>
                      <p className="text-sm font-black text-emerald-950">
                        Campos suficientes
                      </p>

                      <p className="mt-2 text-sm leading-6 text-emerald-900/80">
                        Já temos o necessário para gerar a leitura gratuita.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={!validation.isValid || isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-700 px-5 py-4 text-sm font-black text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Gerando leitura..." : "Confirmar e gerar leitura"}
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function ColumnSelect({
  label,
  value,
  columns,
  placeholder,
  required,
  allowEmpty,
  emptyLabel = "Não usar",
  onChange,
}: {
  label: string;
  value: string;
  columns: ColumnPreview[];
  placeholder: string;
  required?: boolean;
  allowEmpty?: boolean;
  emptyLabel?: string;
  onChange: (value: string) => void;
}) {
  const selectedColumn = columns.find((column) => column.name === value);

  return (
    <label className="block rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <span className="text-xs font-black uppercase tracking-wide text-slate-500">
        {label} {required ? <span className="text-violet-700">*</span> : null}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full bg-transparent text-sm font-black text-slate-800 outline-none"
      >
        <option value="">{placeholder}</option>

        {allowEmpty ? <option value="">{emptyLabel}</option> : null}

        {columns.map((column) => (
          <option key={column.name} value={column.name}>
            {column.name}
          </option>
        ))}
      </select>

      {selectedColumn?.examples?.length ? (
        <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2">
          <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">
            Exemplos encontrados
          </p>

          <p className="mt-1 truncate text-xs font-bold text-slate-600">
            {selectedColumn.examples.slice(0, 3).join(" · ")}
          </p>
        </div>
      ) : (
        <p className="mt-2 text-xs font-semibold text-slate-400">
          Selecione uma coluna para ver exemplos.
        </p>
      )}
    </label>
  );
}

function MappingStatusRow({
  label,
  value,
  required,
}: {
  label: string;
  value?: string;
  required?: boolean;
}) {
  const hasValue = Boolean(value);

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-3 py-2">
      <div>
        <p className="text-xs font-black text-slate-700">{label}</p>

        <p className="mt-0.5 max-w-[180px] truncate text-xs font-semibold text-slate-400">
          {hasValue ? value : required ? "Obrigatório" : "Opcional"}
        </p>
      </div>

      <span
        className={[
          "flex h-7 w-7 items-center justify-center rounded-full",
          hasValue
            ? "bg-emerald-100 text-emerald-700"
            : required
              ? "bg-red-100 text-red-700"
              : "bg-slate-200 text-slate-500",
        ].join(" ")}
      >
        {hasValue ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          <span className="text-xs font-black">!</span>
        )}
      </span>
    </div>
  );
}