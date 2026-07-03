"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowRight,
    BarChart3,
    CheckCircle2,
    ClipboardList,
    FileSpreadsheet,
    Lock,
    Mail,
    ShieldCheck,
    Sparkles,
    Store,
    Upload,
    UsersRound,
    Wand2,
} from "lucide-react";

type FormState = {
    name: string;
    contact: string;
    operationType: string;
    segment: string;
    objective: string;
    operationSize: string;
    allowContact: boolean;
};

const initialFormState: FormState = {
    name: "",
    contact: "",
    operationType: "",
    segment: "",
    objective: "",
    operationSize: "",
    allowContact: true,
};

const operationTypes = [
    "Loja física",
    "Loja online",
    "Loja híbrida",
    "Atendimento / suporte",
    "Serviços",
    "Outro",
];

const segments = [
    "Autopeças / motopeças",
    "Moda / acessórios",
    "Alimentos",
    "Saúde / estética",
    "Serviços",
    "Atendimento / CX",
    "Outro",
];

const objectives = [
    "Entender como foi o dia",
    "Melhorar margem",
    "Vender mais",
    "Entender produtos importantes",
    "Reduzir retrabalho",
    "Acompanhar atendimento",
    "Ainda não sei",
];

const operationSizes = [
    "Só eu / até 2 pessoas",
    "3 a 10 pessoas",
    "11 a 30 pessoas",
    "Mais de 30 pessoas",
];

export default function FreeReadingStartPage() {
    const router = useRouter();

    const [form, setForm] = useState<FormState>(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const isFormValid = useMemo(() => {
        return (
            form.name.trim().length >= 2 &&
            form.contact.trim().length >= 5 &&
            form.operationType.trim().length > 0 &&
            form.segment.trim().length > 0 &&
            form.objective.trim().length > 0
        );
    }, [form]);

    function updateField<K extends keyof FormState>(
        field: K,
        value: FormState[K]
    ) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        setErrorMessage(null);
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!isFormValid) {
            setErrorMessage("Preencha os campos principais para continuar.");
            return;
        }

        setIsSubmitting(true);
        setErrorMessage(null);

        try {
            const searchParams = new URLSearchParams(window.location.search);

            const response = await fetch("/api/free-readings/start", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: form.name,
                    contact: form.contact,
                    operationType: form.operationType,
                    segment: form.segment,
                    objective: form.objective,
                    operationSize: form.operationSize,
                    allowContact: form.allowContact,
                    source: "free_daily_reading",
                    utmSource: searchParams.get("utm_source"),
                    utmMedium: searchParams.get("utm_medium"),
                    utmCampaign: searchParams.get("utm_campaign"),
                    utmContent: searchParams.get("utm_content"),
                    utmTerm: searchParams.get("utm_term"),
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                setErrorMessage(result.error ?? "Não foi possível continuar.");
                setIsSubmitting(false);
                return;
            }

            router.push(`/home?session=${result.sessionToken}`);
        } catch(error) {
            console.log(error)
            setErrorMessage("Erro ao iniciar sua leitura gratuita.");
            setIsSubmitting(false);
        }
    }

    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#f5f3ff_0,#ffffff_34%,#f8fafc_100%)] text-slate-950">
            <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 lg:px-8">
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-700 text-white shadow-sm">
                            <Sparkles className="h-5 w-5" />
                        </div>

                        <div>
                            <p className="text-lg font-black tracking-tight text-slate-950">
                                Ohrly
                            </p>
                            <p className="text-xs font-bold text-slate-500">
                                Leitura operacional
                            </p>
                        </div>
                    </div>

                    <div className="hidden items-center gap-2 rounded-full border border-violet-200 bg-white px-4 py-2 text-xs font-black text-violet-700 shadow-sm sm:flex">
                        <Lock className="h-3.5 w-3.5" />
                        Sem cadastro agora
                    </div>
                </header>

                <section className="grid flex-1 grid-cols-1 gap-8 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-14">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-3 py-1.5 text-xs font-black uppercase tracking-wide text-violet-700 shadow-sm">
                            <Wand2 className="h-3.5 w-3.5" />
                            Primeira leitura gratuita
                        </div>

                        <h1 className="mt-6 max-w-3xl text-3xl font-black tracking-tight text-slate-950">
                            Veja uma leitura gratuita do dia da sua operação.
                        </h1>

                        <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                            Envie uma planilha simples e o Ohrly mostra o que aconteceu, o que
                            chamou atenção e quais sinais podem virar oportunidade.
                        </p>

                        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <BenefitCard
                                icon={BarChart3}
                                title="Como foi o dia"
                                description="Uma leitura simples sobre receita, margem, produtos e sinais relevantes."
                            />

                            <BenefitCard
                                icon={ClipboardList}
                                title="O que puxou o resultado"
                                description="Entenda quais itens, períodos ou recortes explicam melhor o dia."
                            />

                            <BenefitCard
                                icon={Sparkles}
                                title="Policies detectadas"
                                description="O Ohrly aponta sinais como concentração, margem apertada e oportunidade."
                            />

                            <BenefitCard
                                icon={ShieldCheck}
                                title="Sem compromisso"
                                description="Você não precisa criar senha agora. Primeiro veja se a leitura faz sentido."
                            />
                        </div>

                        <div className="mt-8 rounded-3xl border border-violet-200 bg-violet-50 p-5">
                            <div className="flex items-start gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                                    <FileSpreadsheet className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="text-sm font-black text-violet-950">
                                        Você não precisa adaptar sua planilha ao Ohrly.
                                    </h2>

                                    <p className="mt-2 text-sm leading-6 text-violet-900/80">
                                        Depois do envio, perguntamos quais colunas representam os
                                        campos necessários para a leitura gratuita: produto, receita,
                                        custo/CMV, quantidade, data e horário.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2">
                            <SmallPill text="Sem senha agora" />
                            <SmallPill text="Upload simples" />
                            <SmallPill text="Leitura diária" />
                            <SmallPill text="Plano pago só para aprofundar" />
                        </div>
                    </div>

                    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-violet-950/5 sm:p-6 lg:p-7">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-black uppercase tracking-wide text-violet-700">
                                    Comece aqui
                                </p>

                                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                                    Conte sobre sua operação
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    Isso ajuda o Ohrly a interpretar melhor os sinais antes do
                                    upload da planilha.
                                </p>
                            </div>

                            <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 sm:flex">
                                <Store className="h-6 w-6" />
                            </div>
                        </div>

                        {errorMessage ? (
                            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                                {errorMessage}
                            </div>
                        ) : null}

                        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                            <TextField
                                label="Seu nome"
                                value={form.name}
                                placeholder=""
                                icon={UsersRound}
                                onChange={(value) => updateField("name", value)}
                            />

                            <TextField
                                label="E-mail ou WhatsApp"
                                value={form.contact}
                                placeholder="Para receber o link da sua leitura"
                                icon={Mail}
                                onChange={(value) => updateField("contact", value)}
                            />

                            <SelectField
                                label="Tipo de operação"
                                value={form.operationType}
                                placeholder="Selecione uma opção"
                                options={operationTypes}
                                onChange={(value) => updateField("operationType", value)}
                            />

                            <SelectField
                                label="Segmento do negócio"
                                value={form.segment}
                                placeholder="Selecione uma opção"
                                options={segments}
                                onChange={(value) => updateField("segment", value)}
                            />

                            <SelectField
                                label="O que você quer entender primeiro?"
                                value={form.objective}
                                placeholder="Selecione uma opção"
                                options={objectives}
                                onChange={(value) => updateField("objective", value)}
                            />

                            <SelectField
                                label="Tamanho aproximado"
                                value={form.operationSize}
                                placeholder="Opcional"
                                options={operationSizes}
                                onChange={(value) => updateField("operationSize", value)}
                                optional
                            />

                            <label className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                                <input
                                    type="checkbox"
                                    checked={form.allowContact}
                                    onChange={(event) =>
                                        updateField("allowContact", event.target.checked)
                                    }
                                    className="mt-1 h-4 w-4 rounded border-slate-300 text-violet-700 focus:ring-violet-500"
                                />

                                <span className="text-sm leading-6 text-slate-600">
                                    Quero receber o link da minha leitura e posso ser contatado
                                    sobre recursos de acompanhamento do Ohrly.
                                </span>
                            </label>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-700 px-5 py-4 text-sm font-black text-white shadow-sm transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isSubmitting ? "Preparando próxima etapa..." : "Continuar para enviar planilha"}
                                <ArrowRight className="h-4 w-4" />
                            </button>

                            <p className="text-center text-xs font-semibold leading-5 text-slate-400">
                                Não vamos pedir senha agora. Você poderá criar uma conta depois
                                se quiser salvar, acompanhar ou aprofundar suas leituras.
                            </p>
                        </form>
                    </div>
                </section>

                <footer className="pb-4 text-center text-xs font-semibold text-slate-400">
                    Dados mostram o que aconteceu. Ohrly mostra o que merece decisão agora.
                </footer>
            </div>
        </main>
    );
}

function BenefitCard({
    icon: Icon,
    title,
    description,
}: {
    icon: React.ElementType;
    title: string;
    description: string;
}) {
    return (
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                <Icon className="h-5 w-5" />
            </div>

            <h3 className="mt-4 text-base font-black text-slate-950">{title}</h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
        </article>
    );
}

function SmallPill({ text }: { text: string }) {
    return (
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-black text-slate-600 shadow-sm">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            {text}
        </span>
    );
}

function TextField({
    label,
    value,
    placeholder,
    icon: Icon,
    onChange,
}: {
    label: string;
    value: string;
    placeholder: string;
    icon: React.ElementType;
    onChange: (value: string) => void;
}) {
    return (
        <label className="block">
            <span className="text-xs font-black uppercase tracking-wide text-slate-500">
                {label}
            </span>

            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 transition focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-100">
                <Icon className="h-4 w-4 shrink-0 text-violet-700" />

                <input
                    value={value}
                    placeholder={placeholder}
                    onChange={(event) => onChange(event.target.value)}
                    className="w-full bg-transparent text-sm font-bold text-slate-800 outline-none placeholder:text-slate-300"
                />
            </div>
        </label>
    );
}

function SelectField({
    label,
    value,
    placeholder,
    options,
    optional,
    onChange,
}: {
    label: string;
    value: string;
    placeholder: string;
    options: string[];
    optional?: boolean;
    onChange: (value: string) => void;
}) {
    return (
        <label className="block">
            <span className="text-xs font-black uppercase tracking-wide text-slate-500">
                {label}{" "}
                {optional ? (
                    <span className="font-bold normal-case tracking-normal text-slate-400">
                        opcional
                    </span>
                ) : null}
            </span>

            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
            >
                <option value="">{placeholder}</option>

                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </label>
    );
}