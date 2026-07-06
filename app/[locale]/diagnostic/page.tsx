"use client";

import { useMemo, useState, type ElementType, type ReactNode } from "react";
import {
    ArrowRight,
    BarChart3,
    Bot,
    CheckCircle2,
    ChevronLeft,
    CircleAlert,
    CircleHelp,
    ClipboardCheck,
    Clock,
    CreditCard,
    GraduationCap,
    Headphones,
    MessageSquare,
    PackageCheck,
    RefreshCw,
    Send,
    ShieldCheck,
    ShoppingCart,
    Sparkles,
    TimerReset,
    TrendingUp,
    Users,
    Workflow,
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";

type Option = {
    label: string;
    value: string;
    icon: ElementType;
};

type WeightedOption = Option & {
    score: number;
};

const wizardSteps = [
    {
        title: "Fluxo",
        description: "Qual fluxo você quer avaliar?",
    },
    {
        title: "Impacto",
        description: "O que esse fluxo afeta?",
    },
    {
        title: "Sintomas",
        description: "O que parece estar acontecendo?",
    },
    {
        title: "Incidência",
        description: "Com que frequência isso aparece?",
    },
    {
        title: "Sinais",
        description: "Quais sinais podem ser medidos?",
    },
    {
        title: "Dados",
        description: "Vocês têm histórico disponível?",
    },
    {
        title: "Resultado",
        description: "Aderência ao Ohrly",
    },
];

const flowOptions: Option[] = [
    { label: "Atendimento ao cliente", value: "atendimento", icon: Headphones },
    { label: "Chatbot / WhatsApp", value: "chatbot", icon: Bot },
    { label: "Checkout / pagamento", value: "checkout", icon: CreditCard },
    { label: "Entrega / pós-venda", value: "entrega", icon: PackageCheck },
    { label: "Cobrança / inadimplência", value: "cobranca", icon: RefreshCw },
    { label: "Matrícula / atendimento escolar", value: "educacao", icon: GraduationCap },
    { label: "Onboarding", value: "onboarding", icon: Workflow },
    { label: "Outro fluxo crítico", value: "outro", icon: CircleHelp },
];

const impactOptions: WeightedOption[] = [
    { label: "Experiência do cliente", value: "cliente", icon: Users, score: 7 },
    { label: "Receita", value: "receita", icon: TrendingUp, score: 8 },
    { label: "Retrabalho da equipe", value: "retrabalho", icon: RefreshCw, score: 6 },
    { label: "Fila ou tempo de espera", value: "fila", icon: Clock, score: 6 },
    { label: "Reclamações", value: "reclamacoes", icon: MessageSquare, score: 7 },
    { label: "Eficiência da sua loja digital", value: "eficiencia", icon: BarChart3, score: 6 },
    { label: "Decisão de gestão", value: "gestao", icon: ShieldCheck, score: 6 },
    { label: "Não sei dizer ainda", value: "nao_sei", icon: CircleHelp, score: 2 },
];

const situationOptions: WeightedOption[] = [
    { label: "Está mais lento", value: "lento", icon: Clock, score: 5 },
    { label: "Está gerando mais retrabalho", value: "mais_retrabalho", icon: RefreshCw, score: 6 },
    { label: "Exige mais intervenção humana", value: "intervencao_humana", icon: Users, score: 7 },
    { label: "Tem mais abandono", value: "abandono", icon: ShoppingCart, score: 7 },
    { label: "Tem mais reclamações", value: "mais_reclamacoes", icon: MessageSquare, score: 7 },
    { label: "É difícil saber se piorou mesmo", value: "ambiguo", icon: CircleHelp, score: 8 },
    { label: "Funciona, mas parece menos confiável", value: "menos_confiavel", icon: CircleAlert, score: 9 },
    { label: "Ainda não tenho certeza", value: "incerto", icon: Sparkles, score: 4 },
];

const frequencyOptions = [
    { label: "Foi pontual", value: "pontual", score: 3 },
    { label: "Aparece de vez em quando", value: "as_vezes", score: 9 },
    { label: "Tem se repetido nas últimas semanas", value: "semanas", score: 18 },
    { label: "Parece recorrente", value: "recorrente", score: 24 },
    { label: "Só percebemos quando vira reclamação ou urgência", value: "tarde", score: 26 },
];

const signalOptions = [
    "Tempo de resposta",
    "Tempo de resolução",
    "Taxa de abandono",
    "Handoff / transbordo",
    "Recontato",
    "Pedidos não concluídos",
    "Reclamações",
    "Status por etapa",
    "Volume por canal",
    "Valor exposto",
    "Não sei",
    "Ainda não medimos isso",
];

const dataOptions = [
    {
        label: "Sim, consigo exportar",
        value: "exportar",
        score: 12,
        nextStep: "Rodar um check-up da sua loja digital com dados reais.",
    },
    {
        label: "Sim, mas depende de outra área",
        value: "depende_area",
        score: 9,
        nextStep: "Mapear campos necessários e envolver a área dona dos dados.",
    },
    {
        label: "Talvez",
        value: "talvez",
        score: 5,
        nextStep: "Começar por uma simulação ou mapeamento de sinais vitais.",
    },
    {
        label: "Não temos dados organizados",
        value: "sem_dados",
        score: 2,
        nextStep: "Começar pelo mapeamento do fluxo e dos sinais mínimos.",
    },
    {
        label: "Não sei onde esses dados estão",
        value: "nao_sei",
        score: 3,
        nextStep: "Identificar onde os sinais do fluxo aparecem hoje.",
    },
];

export default function CriticalFlowEvaluatorPage() {
    const [activeStep, setActiveStep] = useState(0);
    const [flow, setFlow] = useState("atendimento");
    const [impacts, setImpacts] = useState<string[]>([]);
    const [situations, setSituations] = useState<string[]>([]);
    const [frequency, setFrequency] = useState("");
    const [signals, setSignals] = useState<string[]>([]);
    const [dataAccess, setDataAccess] = useState("");
    const [showResult, setShowResult] = useState(false);

    const result = useMemo(() => {
        const selectedImpactOptions = impactOptions.filter((option) =>
            impacts.includes(option.value)
        );

        const selectedSituationOptions = situationOptions.filter((option) =>
            situations.includes(option.value)
        );

        const selectedFrequency = frequencyOptions.find(
            (option) => option.value === frequency
        );

        const selectedData = dataOptions.find((option) => option.value === dataAccess);

        const measuredSignals = signals.filter(
            (signal) => signal !== "Não sei" && signal !== "Ainda não medimos isso"
        );

        const criticidade = Math.min(
            selectedImpactOptions.reduce((sum, option) => sum + option.score, 0),
            28
        );

        const recorrencia = selectedFrequency?.score ?? 0;

        const observabilidade = Math.min(
            measuredSignals.length * 3 + (selectedData?.score ?? 0),
            26
        );

        const ambiguidade = Math.min(
            selectedSituationOptions.reduce((sum, option) => sum + option.score, 0),
            24
        );

        const potencialAcompanhamento =
            frequency === "semanas" ||
                frequency === "recorrente" ||
                frequency === "tarde"
                ? 8
                : frequency === "as_vezes"
                    ? 5
                    : 1;

        const total = Math.min(
            100,
            Math.round(
                criticidade +
                recorrencia +
                observabilidade +
                ambiguidade +
                potencialAcompanhamento
            )
        );

        const level =
            total >= 75
                ? "Alta aderência"
                : total >= 45
                    ? "Aderência moderada"
                    : "Baixa aderência";

        const tone =
            total >= 75
                ? {
                    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
                    bar: "bg-emerald-600",
                    title: "Esse fluxo parece se beneficiar fortemente do Ohrly",
                }
                : total >= 45
                    ? {
                        badge: "bg-amber-50 text-amber-700 border-amber-200",
                        bar: "bg-amber-500",
                        title: "Esse fluxo pode se beneficiar do Ohrly, com algum preparo",
                    }
                    : {
                        badge: "bg-slate-100 text-slate-700 border-slate-200",
                        bar: "bg-slate-500",
                        title: "Esse talvez não seja o melhor primeiro fluxo para acompanhar",
                    };

        const selectedFlow = flowOptions.find((option) => option.value === flow);

        const nextStep =
            total >= 75
                ? selectedData?.nextStep ?? "Rodar um check-up da sua loja digital desse fluxo."
                : total >= 45
                    ? selectedData?.nextStep ??
                    "Começar por uma simulação ou mapeamento de sinais."
                    : "Mapear melhor o fluxo antes de iniciar acompanhamento contínuo.";

        return {
            total,
            level,
            tone,
            selectedFlow,
            measuredSignals,
            selectedImpactOptions,
            selectedSituationOptions,
            selectedFrequency,
            selectedData,
            nextStep,
            criticidade,
            recorrencia,
            observabilidade,
            ambiguidade,
        };
    }, [flow, impacts, situations, frequency, signals, dataAccess]);

    const contactHref = `/contato?fluxo=${encodeURIComponent(
        flow
    )}&aderencia=${encodeURIComponent(result.level)}&score=${result.total}`;

    const progress = Math.round((activeStep / (wizardSteps.length - 1)) * 100);

    const currentStepIsValid = useMemo(() => {
        if (activeStep === 0) return Boolean(flow);
        if (activeStep === 1) return impacts.length > 0;
        if (activeStep === 2) return situations.length > 0;
        if (activeStep === 3) return Boolean(frequency);
        if (activeStep === 4) return signals.length > 0;
        if (activeStep === 5) return Boolean(dataAccess);
        return true;
    }, [activeStep, flow, impacts, situations, frequency, signals, dataAccess]);

    function toggleValue(
        value: string,
        list: string[],
        setter: (value: string[]) => void
    ) {
        if (list.includes(value)) {
            setter(list.filter((item) => item !== value));
            return;
        }

        setter([...list, value]);
    }

    function goNext() {
        if (!currentStepIsValid) return;

        setActiveStep((step) => Math.min(step + 1, wizardSteps.length - 1));
    }

    function goBack() {
        setActiveStep((step) => Math.max(step - 1, 0));
    }

    function handleGenerateResult() {
        if (!currentStepIsValid) return;

        setShowResult(true);
        setActiveStep(6);
    }

    return (
        <PageShell>
            <section className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-6 py-10 lg:grid-cols-[0.75fr_1.35fr] lg:px-8 lg:py-16">
                <aside className="lg:sticky lg:top-24 lg:h-fit">
                    <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
                        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-sm font-semibold text-violet-900">
                            <Sparkles className="h-4 w-4" />
                            Avaliador de Fluxo Crítico
                        </p>

                        <h1 className="text-2xl font-semibold tracking-[-0.045em] text-[#06183d]">
                            Seu fluxo crítico deveria ser acompanhado pelo Ohrly?
                        </h1>

                        <p className="mt-5 text-base leading-7 text-slate-600">
                            Veja se um fluxo da sua loja digital digital tem sinais suficientes 
                            para um acompanhamento de saúde da sua loja digital.
                        </p>

                        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <InfoCard
                                icon={TimerReset}
                                title="3 minutos"
                                text="Não precisa enviar dados reais."
                            />

                            <InfoCard
                                icon={ClipboardCheck}
                                title="Imediato"
                                text="Veja aderência e próximo passo."
                            />
                        </div>
                    </div>

                    <div className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
                        <h2 className="text-xl font-semibold tracking-tight text-[#06183d]">
                            O que o avaliador mede?
                        </h2>

                        <div className="mt-6 space-y-5">
                            <ScoreDimension
                                title="Criticidade"
                                text="O fluxo afeta cliente, receita, fila, retrabalho ou gestão?"
                            />
                            <ScoreDimension
                                title="Recorrência"
                                text="O problema aparece de forma repetida ou apenas pontual?"
                            />
                            <ScoreDimension
                                title="Sinais observáveis"
                                text="Existem dados ou indicadores que permitam acompanhar comportamento?"
                            />
                            <ScoreDimension
                                title="Ambiguidade decisória"
                                text="Hoje é difícil saber quando agir, esperar ou investigar?"
                            />
                        </div>

                    </div>
                </aside>

                <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5 sm:p-8">
                    <StepperHeader activeStep={activeStep} progress={progress} />

                    <div className="mt-8">
                        {activeStep === 0 && (
                            <StepShell
                                number="1"
                                title="Qual fluxo você quer avaliar?"
                                description="Escolha o fluxo que parece mais importante neste momento."
                            >
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                    {flowOptions.map((option) => (
                                        <SelectableCard
                                            key={option.value}
                                            option={option}
                                            selected={flow === option.value}
                                            onClick={() => setFlow(option.value)}
                                        />
                                    ))}
                                </div>
                            </StepShell>
                        )}

                        {activeStep === 1 && (
                            <StepShell
                                number="2"
                                title="Esse fluxo afeta o quê?"
                                description="Marque os impactos que esse fluxo pode gerar quando começa a piorar."
                            >
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                    {impactOptions.map((option) => (
                                        <CheckboxCard
                                            key={option.value}
                                            option={option}
                                            selected={impacts.includes(option.value)}
                                            onClick={() =>
                                                toggleValue(option.value, impacts, setImpacts)
                                            }
                                        />
                                    ))}
                                </div>
                            </StepShell>
                        )}

                        {activeStep === 2 && (
                            <StepShell
                                number="3"
                                title="O que parece estar acontecendo?"
                                description="Você pode marcar mais de uma percepção. Mesmo uma sensação inicial pode ser útil."
                            >
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                    {situationOptions.map((option) => (
                                        <CheckboxCard
                                            key={option.value}
                                            option={option}
                                            selected={situations.includes(option.value)}
                                            onClick={() =>
                                                toggleValue(option.value, situations, setSituations)
                                            }
                                        />
                                    ))}
                                </div>
                            </StepShell>
                        )}

                        {activeStep === 3 && (
                            <StepShell
                                number="4"
                                title="Isso acontece com que frequência?"
                                description="A recorrência ajuda a separar ruído de um comportamento que merece acompanhamento."
                            >
                                <div className="space-y-3">
                                    {frequencyOptions.map((option) => (
                                        <RadioRow
                                            key={option.value}
                                            label={option.label}
                                            selected={frequency === option.value}
                                            onClick={() => setFrequency(option.value)}
                                        />
                                    ))}
                                </div>
                            </StepShell>
                        )}

                        {activeStep === 4 && (
                            <StepShell
                                number="5"
                                title="Existem sinais mensuráveis?"
                                description="Marque os sinais que vocês já acompanham ou poderiam extrair de algum sistema."
                            >
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                    {signalOptions.map((signal) => (
                                        <label
                                            key={signal}
                                            className={[
                                                "flex cursor-pointer items-center gap-3 rounded-2xl border p-4 text-sm font-bold transition",
                                                signals.includes(signal)
                                                    ? "border-violet-700 bg-violet-50 text-[#06183d]"
                                                    : "border-slate-200 bg-slate-50 text-slate-700 hover:border-violet-300",
                                            ].join(" ")}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={signals.includes(signal)}
                                                onChange={() =>
                                                    toggleValue(signal, signals, setSignals)
                                                }
                                                className="h-4 w-4 rounded border-slate-300 text-violet-700 focus:ring-violet-700"
                                            />
                                            {signal}
                                        </label>
                                    ))}
                                </div>
                            </StepShell>
                        )}

                        {activeStep === 5 && (
                            <StepShell
                                number="6"
                                title="Existem dados históricos desse fluxo?"
                                description="Essa resposta ajuda a indicar se o próximo passo é check-up, simulação ou mapeamento."
                            >
                                <div className="space-y-3">
                                    {dataOptions.map((option) => (
                                        <RadioRow
                                            key={option.value}
                                            label={option.label}
                                            selected={dataAccess === option.value}
                                            onClick={() => setDataAccess(option.value)}
                                        />
                                    ))}
                                </div>
                            </StepShell>
                        )}

                        {activeStep === 6 && showResult && (
                            <ResultPanel
                                id="resultado"
                                result={result}
                                contactHref={contactHref}
                            />
                        )}
                    </div>

                    {activeStep < 6 && (
                        <StepActions
                            activeStep={activeStep}
                            isValid={currentStepIsValid}
                            isLastQuestionStep={activeStep === 5}
                            onBack={goBack}
                            onNext={goNext}
                            onFinish={handleGenerateResult}
                        />
                    )}
                </section>
            </section>
        </PageShell>
    );
}

function InfoCard({
    icon: Icon,
    title,
    text,
}: {
    icon: ElementType;
    title: string;
    text: string;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-center gap-2">
            <Icon className="h-6 w-6 text-violet-800" />
            <p className="text-sm font-semibold text-[#06183d]">{title}</p>
        </div>
    );
}

function ScoreDimension({ title, text }: { title: string; text: string }) {
    return (
        <div className="flex gap-3">
            <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-violet-700" />
            <div>
                <h3 className="font-semibold text-[#06183d]">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
            </div>
        </div>
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
                        Etapa {Math.min(activeStep + 1, wizardSteps.length)} de{" "}
                        {wizardSteps.length}
                    </p>

                    <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#06183d]">
                        {wizardSteps[activeStep].description}
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

            <div className="mt-6 hidden grid-cols-7 gap-2 lg:grid">
                {wizardSteps.map((step, index) => {
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
                {wizardSteps.map((step, index) => {
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
    isLastQuestionStep,
    onBack,
    onNext,
    onFinish,
}: {
    activeStep: number;
    isValid: boolean;
    isLastQuestionStep: boolean;
    onBack: () => void;
    onNext: () => void;
    onFinish: () => void;
}) {
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
                    Selecione pelo menos uma opção para continuar.
                </p>
            )}

            {isLastQuestionStep ? (
                <button
                    type="button"
                    onClick={onFinish}
                    disabled={!isValid}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-violet-700 px-6 text-sm font-semibold text-white shadow-lg shadow-violet-900/10 transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Gerar diagnóstico
                    <Send className="h-4 w-4" />
                </button>
            ) : (
                <button
                    type="button"
                    onClick={onNext}
                    disabled={!isValid}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-violet-700 px-6 text-sm font-semibold text-white shadow-lg shadow-violet-900/10 transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Próxima etapa
                    <ArrowRight className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}

function SelectableCard({
    option,
    selected,
    onClick,
}: {
    option: Option;
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

function CheckboxCard({
    option,
    selected,
    onClick,
}: {
    option: Option;
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

            <span
                className={[
                    "flex h-5 w-5 items-center justify-center rounded-md border",
                    selected ? "border-violet-700 bg-violet-700 text-white" : "border-slate-300",
                ].join(" ")}
            >
                {selected && <CheckCircle2 className="h-4 w-4" />}
            </span>
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

function ResultPanel({
    id,
    result,
    contactHref,
}: {
    id: string;
    result: {
        total: number;
        level: string;
        tone: {
            badge: string;
            bar: string;
            title: string;
        };
        selectedFlow?: Option;
        measuredSignals: string[];
        selectedImpactOptions: WeightedOption[];
        selectedSituationOptions: WeightedOption[];
        selectedFrequency?: { label: string; value: string; score: number };
        selectedData?: { label: string; value: string; score: number; nextStep: string };
        nextStep: string;
        criticidade: number;
        recorrencia: number;
        observabilidade: number;
        ambiguidade: number;
    };
    contactHref: string;
}) {
    const reasons = [
        result.selectedImpactOptions.length > 0
            ? "Afeta áreas relevantes da operação."
            : null,
        result.selectedSituationOptions.length > 0
            ? "Há sinais percebidos de mudança no comportamento do fluxo."
            : null,
        result.selectedFrequency
            ? "Existe algum nível de recorrência ou percepção temporal."
            : null,
        result.measuredSignals.length > 0
            ? "Existem sinais candidatos para acompanhamento."
            : null,
        result.selectedData
            ? "Há uma hipótese sobre disponibilidade de dados históricos."
            : null,
    ].filter(Boolean);

    return (
        <section
            id={id}
            className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5 sm:p-8"
        >
            <div className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <span
                        className={[
                            "inline-flex w-fit items-center rounded-full border px-3 py-1 text-sm font-semibold",
                            result.tone.badge,
                        ].join(" ")}
                    >
                        {result.level}
                    </span>

                    <span className="text-sm font-semibold text-slate-500">
                        Score: {result.total}/100
                    </span>
                </div>

                <h2 className="mt-5 text-3xl font-semibold tracking-tight text-[#06183d]">
                    {result.tone.title}
                </h2>

                <p className="mt-4 text-sm leading-6 text-slate-600">
                    O fluxo{" "}
                    <strong className="text-[#06183d]">
                        {result.selectedFlow?.label ?? "avaliado"}
                    </strong>{" "}
                    foi analisado a partir de criticidade, recorrência, sinais
                    observáveis, ambiguidade decisória e potencial de acompanhamento.
                </p>

                <div className="mt-6">
                    <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                        <div
                            className={`h-full rounded-full ${result.tone.bar}`}
                            style={{ width: `${result.total}%` }}
                        />
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                    <MiniScore title="Criticidade" value={result.criticidade} max={28} />
                    <MiniScore title="Recorrência" value={result.recorrencia} max={26} />
                    <MiniScore
                        title="Sinais observáveis"
                        value={result.observabilidade}
                        max={26}
                    />
                    <MiniScore
                        title="Ambiguidade"
                        value={result.ambiguidade}
                        max={24}
                    />
                </div>

            </div>
            <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="space-y-4">
                    <div className="rounded-3xl bg-white p-6 shadow-sm">
                        <h3 className="font-semibold text-[#06183d]">
                            Por que esse fluxo pode fazer sentido?
                        </h3>

                        <ul className="mt-4 space-y-3">
                            {reasons.map((reason) => (
                                <li
                                    key={reason}
                                    className="flex gap-3 text-sm leading-6 text-slate-600"
                                >
                                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-violet-700" />
                                    <span>{reason}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div>
                    <div className="rounded-3xl bg-white p-6 shadow-sm">
                        <h3 className="font-semibold text-[#06183d]">
                            O que o Ohrly observaria primeiro
                        </h3>

                        {result.measuredSignals.length > 0 ? (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {result.measuredSignals.slice(0, 8).map((signal) => (
                                    <span
                                        key={signal}
                                        className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-900"
                                    >
                                        {signal}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="mt-3 text-sm leading-6 text-slate-600">
                                Primeiro seria necessário mapear quais sinais vitais esse fluxo
                                gera ou poderia gerar.
                            </p>
                        )}
                    </div>

                    <div className="mt-4 rounded-3xl border border-cyan-100 bg-cyan-50 p-6">
                        <h3 className="font-semibold text-[#06183d]">
                            Próximo passo recomendado
                        </h3>

                        <p className="mt-3 text-sm leading-6 text-slate-700">
                            {result.nextStep}
                        </p>

                        <div className="mt-6 flex flex-col gap-3">
                            <a
                                href={contactHref}
                                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-violet-700 px-5 text-sm font-semibold text-white shadow-lg shadow-violet-900/10 transition hover:bg-violet-800"
                            >
                                Solicitar check-up da sua loja digital
                                <Send className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function MiniScore({
    title,
    value,
    max,
}: {
    title: string;
    value: number;
    max: number;
}) {
    const percent = Math.min(100, Math.round((value / max) * 100));

    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-500">{title}</p>
            <p className="mt-2 text-xl font-semibold text-[#06183d]">{percent}%</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                    className="h-full rounded-full bg-violet-700"
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
}