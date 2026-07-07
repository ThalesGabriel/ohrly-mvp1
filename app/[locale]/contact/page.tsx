"use client";

import { useState, type ElementType, type ReactNode } from "react";
import {
    ArrowRight,
    BarChart3,
    Bot,
    CheckCircle2,
    ChevronLeft,
    CircleHelp,
    ClipboardList,
    Clock,
    CreditCard,
    GraduationCap,
    Headphones,
    Mail,
    Map,
    MessageSquare,
    PackageCheck,
    RefreshCw,
    Send,
    ShieldCheck,
    ShoppingCart,
    Sparkles,
    TimerReset,
    UserRound,
    Users,
    Workflow,
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";

type SelectOption = {
    label: string;
    value: string;
    icon: ElementType;
};

const contactSteps = [
    {
        title: "Dados",
        description: "Dados básicos para retorno",
    },
    {
        title: "Fluxo",
        description: "Qual fluxo devemos entender?",
    },
    {
        title: "Sinais",
        description: "Quais sinais já existem?",
    },
    {
        title: "Contexto",
        description: "O que está acontecendo?",
    },
];

const flowOptions: SelectOption[] = [
    { label: "Atendimento e CX", value: "atendimento_cx", icon: Headphones },
    { label: "Chatbot ou WhatsApp", value: "chatbot_whatsapp", icon: Bot },
    { label: "Checkout e pagamento", value: "checkout_pagamento", icon: CreditCard },
    { label: "Entrega ou pós-venda", value: "entrega_pos_venda", icon: PackageCheck },
    { label: "Matrícula ou atendimento escolar", value: "educacao", icon: GraduationCap },
    { label: "Cobrança ou inadimplência", value: "cobranca", icon: RefreshCw },
    { label: "Onboarding", value: "onboarding", icon: Map },
    { label: "Outro fluxo", value: "outro", icon: Workflow },
];

const reasonOptions: SelectOption[] = [
    { label: "Aumento de reclamações", value: "reclamacoes", icon: MessageSquare },
    { label: "Mais fila ou demora", value: "fila_demora", icon: Clock },
    { label: "Mais retrabalho", value: "retrabalho", icon: RefreshCw },
    { label: "Mais transbordo para humano", value: "handoff", icon: Users },
    { label: "Queda de conversão", value: "queda_conversao", icon: ShoppingCart },
    { label: "Dúvida sobre onde agir", value: "duvida_decisao", icon: CircleHelp },
    {
        label: "Sensação de que algo piorou",
        value: "sensacao_piorou",
        icon: Sparkles,
    },
    { label: "Outro motivo", value: "outro_motivo", icon: ClipboardList },
];

const signalOptions = [
    "Tempo de resposta",
    "Tempo de resolução",
    "Taxa de abandono",
    "Handoff / transbordo",
    "Recontato",
    "Reclamações",
    "Pedidos não concluídos",
    "Conversão",
    "Fila",
    "Status de etapas",
    "Ainda não sei",
];

const dataHistoryOptions = [
    "Sim, consigo exportar CSV/planilha",
    "Sim, mas depende de outra área",
    "Talvez, preciso verificar",
    "Não temos dados organizados ainda",
];

const nextSteps = [
    {
        title: "Entendemos seu fluxo",
        text: "Atendimento, vendas, pagamento, entrega, onboarding, cobrança ou outro processo crítico.",
        icon: Workflow,
    },
    {
        title: "Avaliamos os sinais disponíveis",
        text: "Quais dados, indicadores ou sintomas já existem hoje na operação.",
        icon: BarChart3,
    },
    {
        title: "Indicamos o melhor ponto de entrada",
        text: "Simulação, check-up da sua loja digital ou monitoramento inicial.",
        icon: TimerReset,
    },
    {
        title: "Retornamos com uma leitura inicial",
        text: "Você entende se existe uma janela real de atenção ou apenas uma variação normal.",
        icon: CheckCircle2,
    },
];

export default function ContactPage() {
    const [activeStep, setActiveStep] = useState(0);

    const [selectedFlow, setSelectedFlow] = useState("atendimento_cx");
    const [selectedReason, setSelectedReason] = useState("sensacao_piorou");
    const [selectedSignals, setSelectedSignals] = useState<string[]>([]);
    const [selectedDataHistory, setSelectedDataHistory] = useState("");

    const [contactData, setContactData] = useState({
        nome: "",
        email: "",
        empresa: "",
        cargo: "",
        mensagem: "",
    });

    const progress = Math.round((activeStep / (contactSteps.length - 1)) * 100);

    const currentStepIsValid = (() => {
        if (activeStep === 0) {
            return (
                contactData.nome.trim().length > 1 &&
                contactData.email.includes("@") &&
                contactData.empresa.trim().length > 1
            );
        }

        if (activeStep === 1) {
            return Boolean(selectedFlow && selectedReason);
        }

        if (activeStep === 2) {
            return selectedSignals.length > 0 && Boolean(selectedDataHistory);
        }

        return true;
    })();

    function updateContactField(field: keyof typeof contactData, value: string) {
        setContactData((current) => ({
            ...current,
            [field]: value,
        }));
    }

    function toggleSignal(signal: string) {
        setSelectedSignals((current) => {
            if (current.includes(signal)) {
                return current.filter((item) => item !== signal);
            }

            return [...current, signal];
        });
    }

    function goNext() {
        if (!currentStepIsValid) return;
        setActiveStep((step) => Math.min(step + 1, contactSteps.length - 1));
    }

    function goBack() {
        setActiveStep((step) => Math.max(step - 1, 0));
    }

    return (
        <PageShell>
            <section className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-6 py-8 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
                <aside className="lg:sticky lg:top-24 lg:h-fit">
                    <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
                        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-sm font-bold text-violet-900">
                            <Sparkles className="h-4 w-4" />
                            Check-up da sua loja digital
                        </p>

                        <h1 className="text-2xl font-semibold tracking-[-0.045em] text-[#06183d]">
                            Vamos entender onde sua operação pode estar perdendo saúde
                        </h1>

                        <p className="mt-5 text-base leading-7 text-slate-600">
                            Descreva um fluxo crítico da sua operação. O Ohrly ajuda a
                            identificar sinais de perda de consistência antes que eles virem
                            fila, reclamação, retrabalho ou queda de resultado.
                        </p>
                    </div>

                    <div className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
                        <h2 className="text-xl font-semibold tracking-tight text-[#06183d]">
                            O que acontece depois?
                        </h2>

                        <div className="mt-6 space-y-5">
                            {nextSteps.map((step, index) => {
                                const Icon = step.icon;

                                return (
                                    <div key={step.title} className="flex gap-4">
                                        <div className="relative">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-50 text-violet-800">
                                                <Icon className="h-5 w-5" />
                                            </div>

                                            {index < nextSteps.length - 1 && (
                                                <div className="mx-auto mt-2 h-8 w-px bg-slate-200" />
                                            )}
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-[#06183d]">
                                                {step.title}
                                            </h3>
                                            <p className="mt-1 text-sm leading-6 text-slate-600">
                                                {step.text}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </aside>

                <section>
                    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5 sm:p-8">
                        <StepperHeader activeStep={activeStep} progress={progress} />

                        <form
                            action="https://formspree.io/f/mkoygpnk"
                            method="POST"
                            className="mt-8"
                        >
                            <input type="hidden" name="nome" value={contactData.nome} />
                            <input type="hidden" name="email" value={contactData.email} />
                            <input type="hidden" name="empresa" value={contactData.empresa} />
                            <input type="hidden" name="cargo" value={contactData.cargo} />
                            <input type="hidden" name="fluxo" value={selectedFlow} />
                            <input type="hidden" name="motivo" value={selectedReason} />
                            <input
                                type="hidden"
                                name="dados_historicos"
                                value={selectedDataHistory}
                            />
                            <input type="hidden" name="mensagem" value={contactData.mensagem} />

                            {selectedSignals.map((signal) => (
                                <input key={signal} type="hidden" name="sinais" value={signal} />
                            ))}

                            {activeStep === 0 && (
                                <StepShell
                                    number="1"
                                    title="Sobre você"
                                    description="Preencha os dados básicos para entrarmos em contato."
                                >
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <TextField
                                            label="Nome"
                                            name="nome_visivel"
                                            placeholder="Seu nome"
                                            icon={UserRound}
                                            value={contactData.nome}
                                            onChange={(value) => updateContactField("nome", value)}
                                            required
                                        />

                                        <TextField
                                            label="E-mail profissional"
                                            name="email_visivel"
                                            type="email"
                                            placeholder="voce@empresa.com"
                                            icon={Mail}
                                            value={contactData.email}
                                            onChange={(value) => updateContactField("email", value)}
                                            required
                                        />

                                        <TextField
                                            label="Empresa"
                                            name="empresa_visivel"
                                            placeholder="Nome da empresa"
                                            icon={ShieldCheck}
                                            value={contactData.empresa}
                                            onChange={(value) => updateContactField("empresa", value)}
                                            required
                                        />

                                        <TextField
                                            label="Cargo ou área"
                                            name="cargo_visivel"
                                            placeholder="CX, Operações, Produto, Gestão..."
                                            icon={Users}
                                            value={contactData.cargo}
                                            onChange={(value) => updateContactField("cargo", value)}
                                        />
                                    </div>
                                </StepShell>
                            )}

                            {activeStep === 1 && (
                                <div className="space-y-10">
                                    <StepShell
                                        number="2"
                                        title="Qual fluxo você quer entender melhor?"
                                        description="Escolha o fluxo que parece mais importante neste momento."
                                    >
                                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                            {flowOptions.map((option) => (
                                                <SelectableCard
                                                    key={option.value}
                                                    option={option}
                                                    selected={selectedFlow === option.value}
                                                    onClick={() => setSelectedFlow(option.value)}
                                                />
                                            ))}
                                        </div>
                                    </StepShell>

                                    <StepShell
                                        number="3"
                                        title="O que fez você olhar para esse fluxo agora?"
                                        description="Isso ajuda a entender se estamos olhando para uma variação normal, uma janela de atenção ou uma perda de consistência."
                                    >
                                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                            {reasonOptions.map((option) => (
                                                <SelectableCard
                                                    key={option.value}
                                                    option={option}
                                                    selected={selectedReason === option.value}
                                                    onClick={() => setSelectedReason(option.value)}
                                                />
                                            ))}
                                        </div>
                                    </StepShell>
                                </div>
                            )}

                            {activeStep === 2 && (
                                <div className="space-y-10">
                                    <StepShell
                                        number="4"
                                        title="Hoje vocês já acompanham algum sinal desse fluxo?"
                                        description="Marque os sinais que já existem em dashboards, planilhas, sistemas internos ou ferramentas de atendimento."
                                    >
                                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                            {signalOptions.map((signal) => (
                                                <label
                                                    key={signal}
                                                    className={[
                                                        "flex cursor-pointer items-center gap-3 rounded-2xl border p-4 text-sm font-bold transition",
                                                        selectedSignals.includes(signal)
                                                            ? "border-violet-700 bg-violet-50 text-[#06183d]"
                                                            : "border-slate-200 bg-slate-50 text-slate-700 hover:border-violet-300 hover:bg-violet-50/40",
                                                    ].join(" ")}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedSignals.includes(signal)}
                                                        onChange={() => toggleSignal(signal)}
                                                        className="h-4 w-4 rounded border-slate-300 text-violet-700 focus:ring-violet-700"
                                                    />
                                                    {signal}
                                                </label>
                                            ))}
                                        </div>
                                    </StepShell>

                                    <StepShell
                                        number="5"
                                        title="Vocês têm dados históricos desse fluxo?"
                                        description="Essa resposta define se o melhor caminho é simulação, diagnóstico ou monitoramento inicial."
                                    >
                                        <div className="space-y-3">
                                            {dataHistoryOptions.map((option) => (
                                                <RadioRow
                                                    key={option}
                                                    label={option}
                                                    selected={selectedDataHistory === option}
                                                    onClick={() => setSelectedDataHistory(option)}
                                                />
                                            ))}
                                        </div>
                                    </StepShell>
                                </div>
                            )}

                            {activeStep === 3 && (
                                <StepShell
                                    number="6"
                                    title="Conte rapidamente o que está acontecendo"
                                    description="Pode ser uma percepção inicial. A ideia é entender o contexto antes de pedir qualquer base."
                                >
                                    <textarea
                                        value={contactData.mensagem}
                                        onChange={(event) =>
                                            updateContactField("mensagem", event.target.value)
                                        }
                                        rows={6}
                                        placeholder='Exemplo: "Nosso chatbot continua funcionando, mas percebemos mais transbordo para humano e mais recontato nas últimas semanas. Ainda não sabemos se é sazonal ou se o fluxo perdeu eficiência."'
                                        className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-600/10"
                                    />

                                    <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
                                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <p className="font-semibold text-[#06183d]">
                                                    Pronto para começar?
                                                </p>
                                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                                    Você não precisa enviar dados sensíveis neste primeiro
                                                    contato.
                                                </p>
                                            </div>

                                            <button
                                                type="submit"
                                                className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-violet-700 px-7 text-sm font-semibold text-white shadow-lg shadow-violet-900/10 transition hover:bg-violet-800"
                                            >
                                                Solicitar check-up da sua loja digital
                                                <Send className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </StepShell>
                            )}

                            <StepActions
                                activeStep={activeStep}
                                isValid={currentStepIsValid}
                                isLastStep={activeStep === contactSteps.length - 1}
                                onBack={goBack}
                                onNext={goNext}
                            />
                        </form>
                    </div>
                </section>
            </section>
        </PageShell>
    );
}

function StepperHeader({
    activeStep,
    progress,
}: {
    activeStep: number;
    progress: number;
}) {
    return (
        <div className="border-b border-slate-200 pb-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-sm font-semibold text-violet-800">
                        Etapa {activeStep + 1} de {contactSteps.length}
                    </p>

                    <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#06183d]">
                        {contactSteps[activeStep].description}
                    </h2>
                </div>

                <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-500">
                    {progress}% concluído
                </div>
            </div>

            <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                    className="h-full rounded-full bg-violet-700 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="mt-6 hidden grid-cols-4 gap-2 lg:grid">
                {contactSteps.map((step, index) => {
                    const isCompleted = index < activeStep;
                    const isActive = index === activeStep;

                    return (
                        <div
                            key={step.title}
                            className={[
                                "rounded-2xl border p-3 transition",
                                isActive
                                    ? "border-violet-700 bg-violet-50"
                                    : isCompleted
                                        ? "border-violet-100 bg-white"
                                        : "border-slate-200 bg-slate-50",
                            ].join(" ")}
                        >
                            <div
                                className={[
                                    "mb-3 flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold",
                                    isCompleted
                                        ? "bg-violet-700 text-white"
                                        : isActive
                                            ? "bg-violet-100 text-violet-900"
                                            : "bg-slate-200 text-slate-500",
                                ].join(" ")}
                            >
                                {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                            </div>

                            <p
                                className={[
                                    "text-xs font-semibold leading-4",
                                    isActive || isCompleted ? "text-[#06183d]" : "text-slate-400",
                                ].join(" ")}
                            >
                                {step.title}
                            </p>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 flex gap-2 overflow-x-auto pb-1 lg:hidden">
                {contactSteps.map((step, index) => {
                    const isCompleted = index < activeStep;
                    const isActive = index === activeStep;

                    return (
                        <div
                            key={step.title}
                            className={[
                                "flex min-w-fit items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold",
                                isActive
                                    ? "border-violet-700 bg-violet-50 text-violet-900"
                                    : isCompleted
                                        ? "border-violet-100 bg-white text-violet-800"
                                        : "border-slate-200 bg-slate-50 text-slate-400",
                            ].join(" ")}
                        >
                            {isCompleted ? (
                                <CheckCircle2 className="h-4 w-4" />
                            ) : (
                                <span>{index + 1}</span>
                            )}
                            {step.title}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function StepShell({
    number,
    title,
    description,
    children,
}: {
    number: string;
    title: string;
    description: string;
    children: ReactNode;
}) {
    return (
        <section>
            <div className="mb-6 flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-50 text-sm font-semibold text-violet-900">
                    {number}
                </span>

                <div>
                    <h3 className="text-xl font-semibold text-[#06183d]">{title}</h3>
                    <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
                        {description}
                    </p>
                </div>
            </div>

            {children}
        </section>
    );
}

function StepActions({
    activeStep,
    isValid,
    isLastStep,
    onBack,
    onNext,
}: {
    activeStep: number;
    isValid: boolean;
    isLastStep: boolean;
    onBack: () => void;
    onNext: () => void;
}) {
    if (isLastStep) {
        return (
            <div className="mt-10 flex border-t border-slate-200 pt-6">
                <button
                    type="button"
                    onClick={onBack}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-violet-700"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Voltar
                </button>
            </div>
        );
    }

    return (
        <div className="mt-10 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <button
                type="button"
                onClick={onBack}
                disabled={activeStep === 0}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
                <ChevronLeft className="h-4 w-4" />
                Voltar
            </button>

            {!isValid && (
                <p className="text-center text-sm font-bold text-slate-500">
                    Preencha esta etapa para continuar.
                </p>
            )}

            <button
                type="button"
                onClick={onNext}
                disabled={!isValid}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-violet-700 px-6 text-sm font-semibold text-white shadow-lg shadow-violet-900/10 transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
                Próxima etapa
                <ArrowRight className="h-4 w-4" />
            </button>
        </div>
    );
}

function TextField({
    label,
    name,
    placeholder,
    icon: Icon,
    value,
    onChange,
    type = "text",
    required = false,
}: {
    label: string;
    name: string;
    placeholder: string;
    icon: ElementType;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    required?: boolean;
}) {
    return (
        <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#06183d]">
                {label}
            </span>

            <div className="relative">
                <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                    name={name}
                    type={type}
                    required={required}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder={placeholder}
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-600/10"
                />
            </div>
        </label>
    );
}

function SelectableCard({
    option,
    selected,
    onClick,
}: {
    option: SelectOption;
    selected: boolean;
    onClick: () => void;
}) {
    const Icon = option.icon;

    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "flex items-center gap-4 rounded-2xl border p-4 text-left transition",
                selected
                    ? "border-violet-700 bg-violet-50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50/40",
            ].join(" ")}
        >
            <span
                className={[
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
                    selected ? "bg-violet-700 text-white" : "bg-slate-100 text-slate-600",
                ].join(" ")}
            >
                <Icon className="h-5 w-5" />
            </span>

            <span className="flex-1 text-sm font-semibold leading-5 text-[#06183d]">
                {option.label}
            </span>

            {selected && <CheckCircle2 className="h-5 w-5 text-violet-700" />}
        </button>
    );
}

function RadioRow({
    label,
    selected,
    onClick,
}: {
    label: string;
    selected: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "flex w-full items-center gap-4 rounded-2xl border p-4 text-left text-sm font-bold transition",
                selected
                    ? "border-violet-700 bg-violet-50 text-[#06183d]"
                    : "border-slate-200 bg-white text-slate-700 hover:border-violet-300",
            ].join(" ")}
        >
            <span
                className={[
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                    selected ? "border-violet-700" : "border-slate-300",
                ].join(" ")}
            >
                {selected && <span className="h-2.5 w-2.5 rounded-full bg-violet-700" />}
            </span>
            {label}
        </button>
    );
}