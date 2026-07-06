"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

const operationModels = [
    { value: "online_store", label: "Loja online" },
    { value: "physical_plus_digital", label: "Loja física + digital" },
    { value: "whatsapp_instagram", label: "WhatsApp / Instagram" },
    { value: "marketplace", label: "Marketplace" },
    { value: "multi_channel", label: "Mais de um canal" },
];

const mainQuestions = [
    { value: "unfinished_orders", label: "Pedidos ou carrinhos que não concluem" },
    { value: "high_friction_products", label: "Produtos que geram interesse, mas pouca compra" },
    { value: "customers_do_not_return", label: "Clientes que compram uma vez e não voltam" },
    { value: "digital_role", label: "O papel do digital na operação" },
    { value: "data_and_repurchase", label: "Dados, recompra e continuidade" },
    { value: "not_sure", label: "Ainda não sei exatamente" },
];

const dataLocations = [
    { value: "spreadsheet", label: "Planilha" },
    { value: "ecommerce_platform", label: "Plataforma de e-commerce" },
    { value: "erp", label: "ERP ou sistema de gestão" },
    { value: "marketplace", label: "Marketplace" },
    { value: "whatsapp_crm", label: "WhatsApp, CRM ou atendimento" },
    { value: "multiple_places", label: "Mais de um lugar" },
    { value: "not_sure", label: "Não sei" },
];

const signals = [
    "Pedidos não concluídos",
    "Produtos com atrito",
    "Clientes que não voltam",
    "Canal digital subaproveitado",
    "Dados invisíveis",
];

const fitCards = [
    {
        title: "Faz sentido se você já vende",
        description:
            "A versão inicial foi pensada para operações que já têm pedidos, produtos, clientes ou canais digitais para observar.",
    },
    {
        title: "Não começa pela planilha",
        description:
            "Antes de qualquer dado real, entendemos qual decisão você quer melhorar e onde as informações existem hoje.",
    },
    {
        title: "A leitura vem antes da ferramenta",
        description:
            "O objetivo é transformar sinais soltos em uma leitura mais clara sobre o que merece atenção na operação.",
    },
];

function FieldLabel({ children }: { children: React.ReactNode }) {
    return <label className="text-sm font-semibold text-[#21152f]">{children}</label>;
}

function SelectField({
    value,
    onChange,
    options,
    placeholder,
}: {
    value: string;
    onChange: (value: string) => void;
    options: Array<{ value: string; label: string }>;
    placeholder: string;
}) {
    return (
        <select
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-violet-100 bg-white px-4 py-3 text-sm text-[#21152f] outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
        >
            <option value="">{placeholder}</option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
}

export default function EcommerceEarlyAccessPage() {
    const params = useParams<{ locale?: string }>();
    const locale = typeof params?.locale === "string" ? params.locale : "pt";

    const [name, setName] = useState("");
    const [contact, setContact] = useState("");
    const [contactMethod, setContactMethod] = useState("email");
    const [operationModel, setOperationModel] = useState("");
    const [mainQuestion, setMainQuestion] = useState("");
    const [dataLocation, setDataLocation] = useState("");
    const [readChecklist, setReadChecklist] = useState(true);
    const [status, setStatus] = useState<SubmitStatus>("idle");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const canSubmit = useMemo(() => {
        return Boolean(contact.trim() && operationModel && mainQuestion && dataLocation);
    }, [contact, operationModel, mainQuestion, dataLocation]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!canSubmit || status === "submitting") return;

        setStatus("submitting");
        setErrorMessage(null);

        const searchParams =
            typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;

        const payload = {
            source: "ohrly_ecommerce_early_access_post_checklist",
            name: name.trim() || null,
            contact: contact.trim(),
            contactMethod,
            operationModel,
            mainQuestion,
            dataLocation,
            readChecklist,
            intent: "request_early_access_ecommerce",
            tracking: {
                landingPath: typeof window !== "undefined" ? window.location.pathname : null,
                referrer: typeof document !== "undefined" ? document.referrer || null : null,
                utmSource: searchParams?.get("utm_source"),
                utmMedium: searchParams?.get("utm_medium"),
                utmCampaign: searchParams?.get("utm_campaign"),
                utmContent: searchParams?.get("utm_content"),
                utmTerm: searchParams?.get("utm_term"),
            },
        };

        try {
            const response = await fetch("/api/ecommerce-interest", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    result?.message || "Não foi possível registrar seu interesse agora."
                );
            }

            setStatus("success");
        } catch (error) {
            setStatus("error");
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Não foi possível registrar seu interesse agora."
            );
        }
    }

    return (
        <PageShell>
            <main className="min-h-screen bg-[#fbf9ff] text-[#21152f]">
                <section className="relative overflow-hidden border-b border-violet-100/80">
                    <div className="absolute left-[-12rem] top-[-12rem] h-96 w-96 rounded-full bg-violet-200/35 blur-3xl" />
                    <div className="absolute bottom-[-12rem] right-[-10rem] h-96 w-96 rounded-full bg-fuchsia-200/25 blur-3xl" />

                    <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-16">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white/80 px-3 py-1 text-xs font-semibold text-violet-700 shadow-sm shadow-violet-900/5">
                                <span className="h-2 w-2 rounded-full bg-violet-500" />
                                Versão inicial do Ohrly para e-commerce
                            </div>

                            <h1 className="mt-6 max-w-2xl text-4xl font-semibold tracking-tight text-[#21152f] sm:text-5xl lg:text-6xl">
                                Transforme o checklist em uma leitura real do seu e-commerce.
                            </h1>

                            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                                Estamos liberando acesso inicial ao Ohrly para operações que querem entender melhor pedidos não concluídos, produtos com atrito, recompra, canal digital e dados invisíveis.
                            </p>

                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <a
                                    href="#early-access-form"
                                    className="inline-flex items-center justify-center rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/15 transition hover:bg-violet-700"
                                >
                                    Quero participar da versão inicial
                                </a>
                                <Link
                                    href={`/${locale}/diagnostic`}
                                    className="inline-flex items-center justify-center rounded-full border border-violet-200 bg-white px-6 py-3 text-sm font-semibold text-violet-700 transition hover:border-violet-300 hover:bg-violet-50"
                                >
                                    Simular um fluxo parecido
                                </Link>
                            </div>

                            <p className="mt-4 text-sm leading-6 text-slate-500">
                                Sem compromisso. Não vamos pedir planilha antes de entender se faz sentido para sua operação.
                            </p>
                        </div>

                        <div className="rounded-[2.25rem] border border-violet-100 bg-white/85 p-5 shadow-xl shadow-violet-900/8 backdrop-blur">
                            <div className="rounded-[1.75rem] bg-gradient-to-br from-violet-600 to-fuchsia-500 p-5 text-white">
                                <p className="text-sm font-medium text-violet-100">Possíveis janelas Ohrly</p>
                                <h2 className="mt-2 text-2xl font-semibold">O que sua operação pode estar tentando mostrar?</h2>
                                <div className="mt-5 space-y-3">
                                    {signals.map((signal) => (
                                        <div key={signal} className="flex items-center gap-3 rounded-2xl bg-white/14 px-4 py-3 text-sm font-medium backdrop-blur">
                                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs">✓</span>
                                            {signal}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-4 rounded-[1.5rem] border border-violet-100 bg-[#fbf9ff] p-4">
                                <p className="text-sm font-semibold text-[#21152f]">Do checklist para a leitura</p>
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    O checklist ajuda a perceber sinais. O Ohrly ajuda a transformar esses sinais em uma leitura sobre o que merece atenção e qual decisão pode vir primeiro.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:py-16">
                    <div className="grid gap-4 md:grid-cols-3">
                        {fitCards.map((card) => (
                            <div key={card.title} className="rounded-[1.75rem] border border-violet-100 bg-white p-5 shadow-sm shadow-violet-900/5">
                                <div className="mb-4 h-10 w-10 rounded-2xl bg-violet-100 text-center text-lg leading-10 text-violet-700">•</div>
                                <h3 className="text-base font-semibold text-[#21152f]">{card.title}</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-600">{card.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mx-auto grid max-w-6xl gap-8 px-5 pb-16 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:pb-20">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">Acesso inicial</p>
                        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#21152f] sm:text-4xl">
                            Levante a mão para uma primeira leitura.
                        </h2>
                        <p className="mt-4 text-base leading-8 text-slate-600">
                            Preencha algumas informações rápidas para entendermos se sua operação tem aderência à versão inicial. O próximo passo não é enviar dados, é entender o contexto.
                        </p>

                        <div className="mt-6 rounded-[1.75rem] border border-violet-100 bg-white/80 p-5 shadow-sm shadow-violet-900/5">
                            <p className="text-sm font-semibold text-[#21152f]">Você pode receber ajuda para entender:</p>
                            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                                <li>• quais sinais sua operação já consegue mostrar;</li>
                                <li>• quais janelas merecem investigação primeiro;</li>
                                <li>• se seus dados são suficientes para uma leitura real;</li>
                                <li>• qual próximo passo parece mais simples.</li>
                            </ul>
                        </div>
                    </div>

                    <form
                        id="early-access-form"
                        onSubmit={handleSubmit}
                        className="rounded-[2rem] border border-violet-100 bg-white p-5 shadow-xl shadow-violet-900/8 sm:p-6"
                    >
                        {status === "success" ? (
                            <div className="rounded-[1.5rem] bg-violet-50 p-6 text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-violet-600 text-white">✓</div>
                                <h3 className="mt-4 text-xl font-semibold text-[#21152f]">Recebemos seu interesse.</h3>
                                <p className="mt-3 text-sm leading-6 text-slate-600">
                                    Vamos avaliar suas respostas para entender se sua operação tem aderência a uma primeira leitura do Ohrly. Não é necessário enviar planilha agora.
                                </p>
                                <Link
                                    href={`/${locale}/diagnostic`}
                                    className="mt-6 inline-flex items-center justify-center rounded-full border border-violet-200 bg-white px-5 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
                                >
                                    Ver simulação de um fluxo parecido
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <FieldLabel>Nome</FieldLabel>
                                        <input
                                            value={name}
                                            onChange={(event) => setName(event.target.value)}
                                            placeholder="Seu nome"
                                            className="mt-2 w-full rounded-2xl border border-violet-100 bg-white px-4 py-3 text-sm text-[#21152f] outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                                        />
                                    </div>

                                    <div>
                                        <FieldLabel>Preferência de contato</FieldLabel>
                                        <SelectField
                                            value={contactMethod}
                                            onChange={setContactMethod}
                                            placeholder="Escolha uma opção"
                                            options={[
                                                { value: "email", label: "E-mail" },
                                                { value: "whatsapp", label: "WhatsApp" },
                                            ]}
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <FieldLabel>{contactMethod === "whatsapp" ? "WhatsApp" : "E-mail"}</FieldLabel>
                                    <input
                                        value={contact}
                                        onChange={(event) => setContact(event.target.value)}
                                        placeholder={contactMethod === "whatsapp" ? "(00) 00000-0000" : "voce@empresa.com"}
                                        className="mt-2 w-full rounded-2xl border border-violet-100 bg-white px-4 py-3 text-sm text-[#21152f] outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                                    />
                                </div>

                                <div className="mt-4">
                                    <FieldLabel>Como sua operação vende hoje?</FieldLabel>
                                    <SelectField
                                        value={operationModel}
                                        onChange={setOperationModel}
                                        placeholder="Selecione o modelo mais próximo"
                                        options={operationModels}
                                    />
                                </div>

                                <div className="mt-4">
                                    <FieldLabel>O que você mais quer entender?</FieldLabel>
                                    <SelectField
                                        value={mainQuestion}
                                        onChange={setMainQuestion}
                                        placeholder="Selecione uma dúvida principal"
                                        options={mainQuestions}
                                    />
                                </div>

                                <div className="mt-4">
                                    <FieldLabel>Onde seus dados estão hoje?</FieldLabel>
                                    <SelectField
                                        value={dataLocation}
                                        onChange={setDataLocation}
                                        placeholder="Selecione a origem mais provável"
                                        options={dataLocations}
                                    />
                                </div>

                                <label className="mt-5 flex gap-3 rounded-2xl border border-violet-100 bg-violet-50/60 p-4 text-sm leading-6 text-slate-600">
                                    <input
                                        type="checkbox"
                                        checked={readChecklist}
                                        onChange={(event) => setReadChecklist(event.target.checked)}
                                        className="mt-1 h-4 w-4 rounded border-violet-300 text-violet-600 focus:ring-violet-500"
                                    />
                                    <span>
                                        Li ou baixei o checklist e quero saber se minha operação tem aderência à versão inicial do Ohrly.
                                    </span>
                                </label>

                                {status === "error" && (
                                    <p className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                                        {errorMessage}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={!canSubmit || status === "submitting"}
                                    className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/15 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-violet-300"
                                >
                                    {status === "submitting" ? "Enviando..." : "Solicitar acesso inicial"}
                                </button>

                                <p className="mt-4 text-center text-xs leading-5 text-slate-500">
                                    Sem compromisso. Esse formulário serve para entendermos aderência antes de qualquer envio de dados.
                                </p>
                            </>
                        )}
                    </form>
                </section>
            </main>
        </PageShell>
    );
}
