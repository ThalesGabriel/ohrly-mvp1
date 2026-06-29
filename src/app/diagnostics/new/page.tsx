"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  FileSpreadsheet,
  Loader2,
  Store,
  UploadCloud,
} from "lucide-react";

type UploadResponse = {
  diagnosticRunId: string;
  storeId: string;
  storeName: string;
  segmentKey: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_POLICY_API_BASE_URL ?? "http://localhost:8080";

export default function NewDiagnosticPage() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [storeName, setStoreName] = useState("Recife Moto Parts");
  const [segmentKey, setSegmentKey] = useState("motopecas_acessorios");
  const [analyzedPeriodStart, setAnalyzedPeriodStart] = useState("2024-01-01");
  const [analyzedPeriodEnd, setAnalyzedPeriodEnd] = useState("2025-05-31");
  const [reportDate, setReportDate] = useState("2025-05-31");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return (
      file !== null &&
      storeName.trim().length > 0 &&
      segmentKey.trim().length > 0 &&
      analyzedPeriodStart.trim().length > 0 &&
      analyzedPeriodEnd.trim().length > 0 &&
      reportDate.trim().length > 0
    );
  }, [
    file,
    storeName,
    segmentKey,
    analyzedPeriodStart,
    analyzedPeriodEnd,
    reportDate,
  ]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      setError("Selecione um arquivo CSV para gerar o diagnóstico.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();

      formData.append("file", file);
      formData.append("storeName", storeName);
      formData.append("segmentKey", segmentKey);
      formData.append("analyzedPeriodStart", analyzedPeriodStart);
      formData.append("analyzedPeriodEnd", analyzedPeriodEnd);
      formData.append("reportDate", reportDate);

      const response = await fetch(
        `${API_BASE_URL}/api/policy-diagnostics/nuvemshop-sales/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const responseText = await response.text();

        throw new Error(
          responseText ||
            "Não foi possível gerar o diagnóstico a partir do CSV."
        );
      }

      const data = (await response.json()) as UploadResponse;

      router.push(`/diagnostics/${data.diagnosticRunId}`);
    } catch (exception) {
      setError(
        exception instanceof Error
          ? exception.message
          : "Erro inesperado ao gerar o diagnóstico."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#faf9ff] text-slate-950">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10">
        <header className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold tracking-tight text-slate-950">
              <span className="text-violet-600">O</span>hrly
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Novo diagnóstico de policies
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/diagnostics")}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Voltar
          </button>
        </header>

        <section className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                <UploadCloud className="h-7 w-7" />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-950">
                  Gerar diagnóstico a partir de CSV
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Envie um arquivo de vendas da Nuvemshop para o Ohrly normalizar
                  os dados, rodar as policies e gerar uma tela de validação dos
                  achados encontrados.
                </p>
              </div>
            </div>

            {error && (
              <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                {error}
              </div>
            )}

            <div className="mt-8 space-y-6">
              <FileUploadField file={file} onChange={setFile} />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <TextField
                  label="Nome da loja"
                  value={storeName}
                  onChange={setStoreName}
                  icon={Store}
                  placeholder="Ex.: Recife Moto Parts"
                />

                <SelectField
                  label="Segmento"
                  value={segmentKey}
                  onChange={setSegmentKey}
                  options={[
                    {
                      label: "Motopeças e acessórios",
                      value: "motopecas_acessorios",
                    },
                    {
                      label: "Autopeças",
                      value: "autopecas",
                    },
                    {
                      label: "E-commerce geral",
                      value: "ecommerce_general",
                    },
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <DateField
                  label="Início do período"
                  value={analyzedPeriodStart}
                  onChange={setAnalyzedPeriodStart}
                />

                <DateField
                  label="Fim do período"
                  value={analyzedPeriodEnd}
                  onChange={setAnalyzedPeriodEnd}
                />

                <DateField
                  label="Data do relatório"
                  value={reportDate}
                  onChange={setReportDate}
                />
              </div>

              <div className="rounded-2xl border border-violet-100 bg-violet-50 px-5 py-4">
                <div className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-violet-700" />

                  <div>
                    <p className="text-sm font-bold text-violet-900">
                      O que será gerado
                    </p>

                    <p className="mt-1 text-sm leading-6 text-violet-800">
                      O Ohrly vai calcular findings individuais, identificar
                      observações críticas que precisam de revisão e criar um
                      diagnóstico interativo para validação.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={!canSubmit || loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-700 px-5 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Gerando diagnóstico...
                  </>
                ) : (
                  <>
                    Gerar diagnóstico
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </form>

          <aside className="space-y-5">
            <InfoCard
              icon={FileSpreadsheet}
              title="Arquivo esperado"
              description="Use o CSV de vendas exportado da Nuvemshop. O backend já trata as linhas extras de produtos do mesmo pedido."
            />

            <InfoCard
              icon={AlertTriangle}
              title="Policies aplicadas"
              description="Qualidade de identificação do cliente, pressão de desconto, conclusão de pedido, concentração por canal e anonimidade por canal."
            />

            <InfoCard
              icon={CalendarDays}
              title="Depois do upload"
              description="Você será levado para a tela de validação, onde poderá confirmar ou descartar observações encontradas pelo motor."
            />
          </aside>
        </section>
      </div>
    </main>
  );
}

function FileUploadField({
  file,
  onChange,
}: {
  file: File | null;
  onChange: (file: File | null) => void;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-800">
        CSV de vendas
      </label>

      <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-violet-200 bg-violet-50/60 px-6 py-10 text-center transition hover:border-violet-400 hover:bg-violet-50">
        <input
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(event) => {
            const selectedFile = event.target.files?.[0] ?? null;
            onChange(selectedFile);
          }}
        />

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-violet-700 shadow-sm">
          <UploadCloud className="h-7 w-7" />
        </div>

        <p className="mt-4 text-sm font-bold text-slate-900">
          {file ? file.name : "Clique para selecionar um arquivo CSV"}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {file
            ? `${formatFileSize(file.size)} selecionado`
            : "Arquivo de vendas exportado da Nuvemshop"}
        </p>
      </label>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  icon: Icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: typeof Store;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-800">{label}</label>

      <div className="relative mt-2">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        )}

        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={[
            "w-full rounded-2xl border border-slate-200 bg-white py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100",
            Icon ? "pl-11 pr-4" : "px-4",
          ].join(" ")}
        />
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-800">{label}</label>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-800">{label}</label>

      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
      />
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof FileSpreadsheet;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
          <Icon className="h-6 w-6" />
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-950">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function formatFileSize(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}