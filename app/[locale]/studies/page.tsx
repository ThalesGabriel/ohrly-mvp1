"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ElementType } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
    Activity,
    ArrowRight,
    BarChart3,
    BookOpen,
    CheckCircle2,
    CircleHelp,
    Clock3,
    FlaskConical,
    GraduationCap,
    Headphones,
    Layers3,
    LibraryBig,
    MessageSquareWarning,
    Newspaper,
    Search,
    ShoppingCart,
    Signal,
    Sparkles,
    Workflow,
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";

type StudyCategory =
    | "Todos"
    | "Fundamentos"
    | "Atendimento e CX"
    | "E-commerce"
    | "Educação"
    | "Operações internas"
    | "Estudos de mercado"
    | "Laboratório";

type StudyStatus = "published" | "new" | "in_production";

type Study = {
    title: string;
    description: string;
    category: Exclude<StudyCategory, "Todos">;
    type: string;
    readingTime: string;
    href: string;
    tags: string[];
    icon: ElementType;
    accentClass: string;
    visualClass: string;
    status?: StudyStatus;
};

const categoryFilters: {
    label: StudyCategory;
    icon: ElementType;
}[] = [
        { label: "Todos", icon: LibraryBig },
        { label: "Fundamentos", icon: Activity },
        { label: "Atendimento e CX", icon: Headphones },
        { label: "E-commerce", icon: ShoppingCart },
        { label: "Educação", icon: GraduationCap },
        { label: "Operações internas", icon: Workflow },
        { label: "Estudos de mercado", icon: Layers3 },
        { label: "Laboratório", icon: FlaskConical },
    ];

const trails = [
    {
        title: "Fundamentos",
        description:
            "Conceitos centrais sobre saúde da sua loja digital, sinais vitais, janelas de atenção e perda de consistência.",
        icon: Activity,
        href: "#lista",
        items: [
            "O que é saúde da sua loja digital?",
            "O que são sinais vitais de um fluxo?",
            "Quando esperar deixa de ser neutro?",
        ],
    },
    {
        title: "Fluxos críticos",
        description:
            "Análises aplicadas a atendimento, vendas, checkout, entrega, cobrança, onboarding e suporte.",
        icon: Workflow,
        href: "#lista",
        items: [
            "Quando um atendimento funciona, mas deixa de resolver.",
            "Quando o checkout continua ativo, mas perde consistência.",
            "Quando a cobrança só aparece depois da urgência.",
        ],
    },
    {
        title: "Estudos de mercado",
        description:
            "Leituras sobre empresas, plataformas e modelos que ajudam a explicar como categorias de gestão são criadas.",
        icon: Layers3,
        href: "#lista",
        items: [
            "O que o V4 ensina sobre vender gestão.",
            "Por que empresas compram métodos.",
            "Como transformar diagnóstico em produto recorrente.",
        ],
    },
];

const featuredStudy: Study = {
    title: "Sua operação pode estar funcionando e ainda assim não estar saudável",
    description:
        "O estudo fundador do Ohrly sobre saúde da sua loja digital: por que nem todo problema começa quando algo quebra, e como fluxos críticos podem perder consistência antes de qualquer alerta evidente.",
    category: "Fundamentos",
    type: "Estudo fundador",
    readingTime: "8 min de leitura",
    href: "/studies/sua-operacao-pode-estar-funcionando",
    tags: ["Fundamentos", "Saúde da sua loja digital", "Método Ohrly"],
    icon: Activity,
    accentClass: "text-violet-800 bg-violet-50 border-violet-100",
    visualClass: "from-violet-700 to-violet-800",
    status: "new",
};

const studies: Study[] = [
    featuredStudy,
    {
        title: "O que é saúde da sua loja digital?",
        description:
            "Uma introdução à categoria que o Ohrly propõe: acompanhar fluxos críticos como organismos vivos, com sinais, sintomas e recuperação.",
        category: "Fundamentos",
        type: "Conceito",
        readingTime: "6 min de leitura",
        href: "/studies/o-que-e-saude-da-sua-loja-digital",
        tags: ["Saúde da sua loja digital", "Categoria", "Gestão"],
        icon: Activity,
        accentClass: "text-violet-800 bg-violet-50 border-violet-100",
        visualClass: "from-violet-700 to-violet-900",
        status: "new",
    },
    {
        title: "O que são sinais vitais de um fluxo?",
        description:
            "Tempo, fila, recontato, handoff, abandono, resolução e recorrência: como sinais intermediários revelam a saúde de um fluxo.",
        category: "Fundamentos",
        type: "Método",
        readingTime: "7 min de leitura",
        href: "/studies/sinais-vitais-de-um-fluxo",
        tags: ["Sinais vitais", "Fluxos", "Métricas"],
        icon: Signal,
        accentClass: "text-violet-800 bg-violet-50 border-violet-100",
        visualClass: "from-violet-700 to-slate-900",
    },
    {
        title: "Quando esperar deixa de ser neutro?",
        description:
            "A janela mais importante da operação nem sempre é o incidente. Muitas vezes é o ponto em que continuar esperando passa a comprar risco.",
        category: "Fundamentos",
        type: "Leitura estratégica",
        readingTime: "7 min de leitura",
        href: "/studies/quando-esperar-deixa-de-ser-neutro",
        tags: ["Janelas de decisão", "Risco", "Gestão"],
        icon: Clock3,
        accentClass: "text-amber-800 bg-amber-50 border-amber-100",
        visualClass: "from-amber-600 to-orange-900",
    },
    {
        title: "Por que dashboards mostram números, mas nem sempre mostram saúde?",
        description:
            "Dashboards ajudam a acompanhar indicadores, mas nem sempre mostram quando um fluxo começou a perder consistência da sua loja digital.",
        category: "Fundamentos",
        type: "Ensaio",
        readingTime: "9 min de leitura",
        href: "/studies/dashboards-nem-sempre-mostram-saude",
        tags: ["Dashboards", "BI", "Interpretação"],
        icon: BarChart3,
        accentClass: "text-blue-800 bg-blue-50 border-blue-100",
        visualClass: "from-blue-700 to-slate-900",
    },
    {
        title: "Quando um atendimento funciona, mas deixa de resolver",
        description:
            "Como aumento de recontato, fila, handoff e tempo de resolução podem indicar perda de saúde antes da reclamação aparecer.",
        category: "Atendimento e CX",
        type: "Fluxo aplicado",
        readingTime: "8 min de leitura",
        href: "/studies/atendimento-funciona-mas-deixa-de-resolver",
        tags: ["CX", "Atendimento", "Recontato"],
        icon: Headphones,
        accentClass: "text-violet-800 bg-violet-50 border-violet-100",
        visualClass: "from-violet-700 to-slate-950",
    },
    {
        title: "Quando um chatbot começa a transferir demais para humanos",
        description:
            "O transbordo para humano pode ser um sinal vital: o fluxo ainda responde, mas perde capacidade de resolver sozinho.",
        category: "Atendimento e CX",
        type: "Análise de fluxo",
        readingTime: "6 min de leitura",
        href: "/studies/chatbot-transferindo-demais-para-humanos",
        tags: ["Chatbot", "Handoff", "Atendimento"],
        icon: MessageSquareWarning,
        accentClass: "text-rose-800 bg-rose-50 border-rose-100",
        visualClass: "from-rose-700 to-slate-950",
    },
    {
        title: "Quando o checkout continua ativo, mas perde consistência",
        description:
            "Nem toda perda de venda aparece como erro técnico. Às vezes o fluxo funciona, mas começa a gerar mais abandono, tentativa e fricção.",
        category: "E-commerce",
        type: "Fluxo aplicado",
        readingTime: "8 min de leitura",
        href: "/studies/checkout-funciona-mas-perde-consistencia",
        tags: ["E-commerce", "Checkout", "Conversão"],
        icon: ShoppingCart,
        accentClass: "text-violet-800 bg-violet-50 border-violet-100",
        visualClass: "from-violet-700 to-slate-950",
    },
    {
        title: "Como escolas podem acompanhar a saúde dos seus fluxos administrativos",
        description:
            "Matrícula, rematrícula, atendimento a responsáveis e solicitações internas também podem ser vistos como fluxos críticos.",
        category: "Educação",
        type: "Exploração vertical",
        readingTime: "7 min de leitura",
        href: "/studies/escolas-saude-dos-fluxos-administrativos",
        tags: ["Educação", "Gestão", "Atendimento"],
        icon: GraduationCap,
        accentClass: "text-indigo-800 bg-indigo-50 border-indigo-100",
        visualClass: "from-indigo-700 to-slate-950",
    },
    {
        title: "Quando a cobrança só é percebida depois que vira inadimplência",
        description:
            "Sinais de atraso, tentativa, recontato e exceções podem indicar desgaste antes do problema financeiro ficar explícito.",
        category: "Operações internas",
        type: "Fluxo aplicado",
        readingTime: "6 min de leitura",
        href: "/studies/cobranca-antes-da-inadimplencia",
        tags: ["Cobrança", "Operação", "Risco"],
        icon: Workflow,
        accentClass: "text-slate-800 bg-slate-100 border-slate-200",
        visualClass: "from-slate-700 to-slate-950",
    },
    {
        title: "O que o V4 ensina sobre vender gestão, não aplicativo",
        description:
            "Uma leitura sobre como produtos ganham força quando deixam de ser percebidos como ferramenta e passam a representar uma camada de gestão.",
        category: "Estudos de mercado",
        type: "Estudo de mercado",
        readingTime: "10 min de leitura",
        href: "/studies/v4-vender-gestao-nao-aplicativo",
        tags: ["Categoria", "Gestão", "Posicionamento"],
        icon: Layers3,
        accentClass: "text-blue-800 bg-blue-50 border-blue-100",
        visualClass: "from-violet-800 to-blue-900",
    },
    {
        title: "Por que empresas compram métodos antes de comprar ferramentas",
        description:
            "Antes de contratar software, empresas precisam entender a categoria, o método e a decisão que aquela solução melhora.",
        category: "Estudos de mercado",
        type: "Estratégia",
        readingTime: "8 min de leitura",
        href: "/studies/empresas-compram-metodos-antes-de-ferramentas",
        tags: ["Método", "Produto", "Compra B2B"],
        icon: BookOpen,
        accentClass: "text-fuchsia-800 bg-fuchsia-50 border-fuchsia-100",
        visualClass: "from-fuchsia-700 to-slate-950",
    },
];

const PAGE_SIZE = 8;

export default function StudiesPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const tableTopRef = useRef<HTMLDivElement | null>(null);

    const initialPage = Number(searchParams.get("page") || "1");

    const [selectedCategory, setSelectedCategory] =
        useState<StudyCategory>("Todos");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(
        Number.isFinite(initialPage) && initialPage > 0 ? initialPage : 1
    );

    const filteredStudies = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return studies.filter((study) => {
            const matchesCategory =
                selectedCategory === "Todos" || study.category === selectedCategory;

            const matchesSearch =
                !query ||
                [
                    study.title,
                    study.description,
                    study.category,
                    study.type,
                    ...study.tags,
                ]
                    .join(" ")
                    .toLowerCase()
                    .includes(query);

            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery]);

    const pageCount = Math.max(1, Math.ceil(filteredStudies.length / PAGE_SIZE));

    const paginatedStudies = useMemo(() => {
        const safePage = Math.min(currentPage, pageCount);
        const start = (safePage - 1) * PAGE_SIZE;

        return filteredStudies.slice(start, start + PAGE_SIZE);
    }, [filteredStudies, currentPage, pageCount]);

    function updatePage(page: number) {
        const nextPage = Math.min(Math.max(page, 1), pageCount);

        setCurrentPage(nextPage);

        const params = new URLSearchParams(searchParams.toString());

        if (nextPage === 1) {
            params.delete("page");
        } else {
            params.set("page", String(nextPage));
        }

        const queryString = params.toString();

        router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
            scroll: false,
        });

        window.requestAnimationFrame(() => {
            tableTopRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        });
    }

    useEffect(() => {
        setCurrentPage(1);

        const params = new URLSearchParams(searchParams.toString());
        params.delete("page");

        const queryString = params.toString();

        router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
            scroll: false,
        });
    }, [selectedCategory, searchQuery]);

    return (
        <PageShell>
            <main className="min-h-screen bg-[#f7fafc] text-slate-950">
                <section className="mx-auto max-w-7xl px-6 pb-10 pt-10 lg:px-8 lg:pt-16">
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
                        <div>
                            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-sm font-semibold text-violet-900">
                                <Newspaper className="h-4 w-4" />
                                Como estimamos a saúde da sua loja digital
                            </p>

                            <h1 className="max-w-3xl text-2xl font-semibold tracking-[-0.045em] text-violet-800 md:text-3xl">
                                Estudos sobre operações que funcionam, mas começam a perder saúde
                            </h1>

                            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                                Leituras, análises e simulações sobre fluxos críticos que
                                acumulam sinais de perda de consistência antes de virar fila,
                                reclamação, retrabalho ou queda de resultado.
                            </p>

                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    href="#lista"
                                    className="inline-flex h-12 items-center justify-center rounded-xl bg-violet-700 px-6 text-sm font-semibold text-white shadow-lg shadow-violet-900/10 transition hover:bg-violet-800"
                                >
                                    Explorar estudos
                                </Link>

                                <Link
                                    href="/diagnostic"
                                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-violet-800 shadow-sm transition hover:border-violet-700"
                                >
                                    Avaliar um fluxo crítico
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>

                        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <HeroMetric
                                    value="4"
                                    label="trilhas de estudo"
                                    icon={LibraryBig}
                                />
                                <HeroMetric value="12+" label="leituras iniciais" icon={BookOpen} />
                                <HeroMetric
                                    value="3"
                                    label="próximos passos possíveis"
                                    icon={ArrowRight}
                                />
                            </div>

                            <div className="mt-6 rounded-2xl border border-violet-100 bg-violet-50 p-5">
                                <p className="text-sm font-semibold text-violet-800">
                                    Conteúdos para gestores, CX, operações, produto e liderança.
                                </p>
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    A página de estudos é a biblioteca viva do Método Ohrly:
                                    conceitos, exemplos e simulações para reconhecer quando um
                                    fluxo ainda funciona, mas já não está tão saudável.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
                    <FeaturedStudyCard study={featuredStudy} />
                </section>

                <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-800">
                                Trilhas
                            </p>
                            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-violet-800">
                                Explore por trilha
                            </h2>
                        </div>

                        <p className="max-w-xl text-sm leading-6 text-slate-600">
                            Cada trilha organiza um tipo de aprendizado: conceitos,
                            aplicações práticas, estudos de mercado e simulações.
                        </p>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {trails.map((trail) => (
                            <TrailCard key={trail.title} trail={trail} />
                        ))}
                    </div>
                </section>

                <section id="lista" className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
                    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-800">
                                    Biblioteca
                                </p>
                                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-violet-800">
                                    Todos os estudos
                                </h2>
                            </div>

                            <div className="relative w-full lg:max-w-sm">
                                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    value={searchQuery}
                                    onChange={(event) => setSearchQuery(event.target.value)}
                                    placeholder="Buscar estudos..."
                                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
                            {categoryFilters.map((filter) => {
                                const Icon = filter.icon;
                                const isSelected = selectedCategory === filter.label;

                                return (
                                    <button
                                        key={filter.label}
                                        type="button"
                                        onClick={() => setSelectedCategory(filter.label)}
                                        className={[
                                            "inline-flex min-w-fit items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition",
                                            isSelected
                                                ? "border-violet-700 bg-violet-50 text-violet-900"
                                                : "border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:bg-violet-50/40",
                                        ].join(" ")}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {filter.label}
                                    </button>
                                );
                            })}
                        </div>

                        <div ref={tableTopRef} className="scroll-mt-28" />
                        <StudyTable
                            studies={paginatedStudies}
                            totalCount={filteredStudies.length}
                            currentPage={currentPage}
                            pageSize={PAGE_SIZE}
                            pageCount={pageCount}
                            onPageChange={updatePage}
                        />
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-6 pb-12 pt-8 lg:px-8">
                    <div className="relative overflow-hidden rounded-[2rem] bg-violet-700 p-8 text-white shadow-xl shadow-violet-950/10 md:p-12">
                        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10" />
                        <div className="absolute bottom-8 right-20 h-24 w-24 rounded-full bg-violet-300/10" />

                        <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_auto]">
                            <div>
                                <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-white">
                                    <CircleHelp className="h-4 w-4" />
                                    Não sabe por onde começar?
                                </p>

                                <h2 className="max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
                                    Quer saber se um fluxo da sua operação deveria ser acompanhado?
                                </h2>

                                <p className="mt-4 max-w-2xl text-sm leading-6 text-white/80 md:text-base">
                                    Responda algumas perguntas simples e veja se um fluxo crítico
                                    tem sinais, recorrência e impacto suficientes para se
                                    beneficiar do acompanhamento pelo Ohrly.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                                <Link
                                    href="/avaliador"
                                    className="inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 text-sm font-semibold text-violet-700 shadow-lg transition hover:bg-slate-100"
                                >
                                    Avaliar meu fluxo
                                    <ArrowRight className="h-4 w-4" />
                                </Link>

                                <Link
                                    href="/contato"
                                    className="inline-flex h-13 items-center justify-center rounded-xl border border-white/20 bg-white/10 px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/15"
                                >
                                    Solicitar check-up
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </PageShell>
    );
}

function StudyTable({
    studies,
    totalCount,
    currentPage,
    pageSize,
    pageCount,
    onPageChange,
}: {
    studies: Study[];
    totalCount: number;
    currentPage: number;
    pageSize: number;
    pageCount: number;
    onPageChange: (page: number) => void;
}) {
    const router = useRouter();

    const firstItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const lastItem = Math.min(currentPage * pageSize, totalCount);

    function goToPage(page: number) {
        if (page < 1 || page > pageCount) return;
        onPageChange(page);
    }

    if (totalCount === 0) {
        return (
            <div className="mt-8 rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                <p className="text-sm font-semibold text-slate-700">
                    Nenhum estudo encontrado.
                </p>
                <p className="mt-2 text-sm text-slate-500">
                    Tente mudar a categoria ou buscar por outro termo.
                </p>
            </div>
        );
    }

    return (
        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] border-collapse text-left">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                            <th className="px-5 py-4">Estudo</th>
                            <th className="px-5 py-4">Categoria</th>
                            <th className="px-5 py-4">Tipo</th>
                            <th className="px-5 py-4">Tempo</th>
                            <th className="px-5 py-4">Status</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {studies.map((study) => {
                            const Icon = study.icon;
                            const isAvailable = study.status !== "in_production";

                            return (
                                <tr
                                    key={study.href}
                                    role={isAvailable ? "link" : undefined}
                                    tabIndex={isAvailable ? 0 : -1}
                                    onClick={(event) => {
                                        const target = event.target as HTMLElement;

                                        if (target.closest("a, button")) return;
                                        if (!isAvailable) return;

                                        router.push(study.href);
                                    }}
                                    onKeyDown={(event) => {
                                        if (!isAvailable) return;

                                        if (event.key === "Enter" || event.key === " ") {
                                            event.preventDefault();
                                            router.push(study.href);
                                        }
                                    }}
                                    className={[
                                        "group transition outline-none",
                                        isAvailable
                                            ? "cursor-pointer hover:bg-violet-50/50 focus:bg-violet-50/70"
                                            : "cursor-default bg-slate-50/40",
                                    ].join(" ")}
                                >
                                    <td className="px-5 py-5">
                                        <div className="flex items-start gap-4">
                                            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-700 transition group-hover:bg-violet-100">
                                                <Icon className="h-5 w-5" />
                                            </div>

                                            <div>
                                                {isAvailable ? (
                                                    <Link
                                                        href={study.href}
                                                        className="text-sm font-semibold leading-6 text-[#21152f] transition hover:text-violet-700"
                                                    >
                                                        {study.title}
                                                    </Link>
                                                ) : (
                                                    <p className="text-sm font-semibold leading-6 text-[#21152f]">
                                                        {study.title}
                                                    </p>
                                                )}

                                                <p className="mt-1 line-clamp-2 max-w-xl text-sm leading-6 text-slate-500">
                                                    {study.description}
                                                </p>

                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {study.tags.slice(0, 3).map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-5 py-5 align-top">
                                        <span className="inline-flex rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-800">
                                            {study.category}
                                        </span>
                                    </td>

                                    <td className="px-5 py-5 align-top">
                                        <span className="text-sm font-semibold text-slate-600">
                                            {study.type}
                                        </span>
                                    </td>

                                    <td className="px-5 py-5 align-top">
                                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500">
                                            <Clock3 className="h-4 w-4" />
                                            {study.readingTime}
                                        </span>
                                    </td>

                                    <td className="px-5 py-5 align-top">
                                        <StudyTableStatusBadge status={study.status} />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col gap-4 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-slate-500">
                    Mostrando{" "}
                    <span className="text-slate-800">{firstItem}</span>
                    {" "}–{" "}
                    <span className="text-slate-800">{lastItem}</span>
                    {" "}de{" "}
                    <span className="text-slate-800">{totalCount}</span>
                    {" "}estudos
                </p>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:border-violet-200 hover:text-violet-800 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Anterior
                    </button>

                    <div className="flex items-center gap-1">
                        {Array.from({ length: pageCount }).map((_, index) => {
                            const page = index + 1;
                            const isCurrent = page === currentPage;

                            return (
                                <button
                                    key={page}
                                    type="button"
                                    onClick={() => goToPage(page)}
                                    className={[
                                        "cursor-pointer inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition",
                                        isCurrent
                                            ? "bg-violet-700 text-white shadow-sm shadow-violet-900/15"
                                            : "border border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:text-violet-800",
                                    ].join(" ")}
                                >
                                    {page}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        type="button"
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === pageCount}
                        className="cursor-pointer inline-flex h-10 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:border-violet-200 hover:text-violet-800 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Próxima
                    </button>
                </div>
            </div>
        </div>
    );
}

function StudyTableStatusBadge({ status }: { status?: StudyStatus }) {
    if (status === "new") {
        return (
            <span className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                <Sparkles className="h-3.5 w-3.5" />
                Novo
            </span>
        );
    }

    if (status === "in_production") {
        return (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                <Clock3 className="h-3.5 w-3.5" />
                Em produção
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Publicado
        </span>
    );
}

function HeroMetric({
    value,
    label,
    icon: Icon,
}: {
    value: string;
    label: string;
    icon: ElementType;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <Icon className="h-5 w-5 text-violet-800" />
            <p className="mt-3 text-2xl font-semibold text-violet-800">{value}</p>
            <p className="mt-1 text-xs font-bold text-slate-500">{label}</p>
        </div>
    );
}

function StudyStatusBadge({ status }: { status?: StudyStatus }) {
    if (!status || status === "published") {
        return null;
    }

    if (status === "new") {
        return (
            <span className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                <Sparkles className="h-3.5 w-3.5" />
                Novo
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            <Clock3 className="h-3.5 w-3.5" />
            Em produção
        </span>
    );

}

function FeaturedStudyCard({ study }: { study: Study }) {
    const Icon = study.icon;

    return (
        <article className="grid grid-cols-1 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm lg:grid-cols-[0.95fr_1.05fr]">
            <div className={`relative min-h-[280px] bg-gradient-to-br ${study.visualClass} p-8 text-white`}>
                <div className="absolute -right-14 -top-14 h-48 w-48 rounded-full bg-white/10" />
                <div className="absolute bottom-8 right-8 h-24 w-24 rounded-full bg-violet-300/10" />

                <div className="relative z-10 flex h-full flex-col justify-between">
                    <div>
                        <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm font-semibold">
                            {study.type}
                        </span>

                        <div className="mt-10 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10">
                            <Icon className="h-10 w-10" />
                        </div>
                    </div>

                    <p className="mt-10 max-w-sm text-sm leading-6 text-white/75">
                        Toda operação tem sinais vitais. O problema é que muitos deles
                        mudam antes de qualquer indicador final parecer grave.
                    </p>
                </div>
            </div>

            <div className="p-6 sm:p-8 lg:p-10">
                <div className="flex flex-wrap gap-2">
                    <StudyStatusBadge status={study.status} />

                    {study.tags.map((tag) => (
                        <span
                            key={tag}
                            className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-900"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <h2 className="mt-6 max-w-2xl text-3xl font-semibold tracking-tight text-violet-800 md:text-4xl">
                    {study.title}
                </h2>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                    {study.description}
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                    {study.status === "new" ? (
                        <Link
                            href={study.href}
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-violet-700 px-6 text-sm font-semibold text-white shadow-lg shadow-violet-900/10 transition hover:bg-violet-800"
                        >
                            Ler estudo
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    ) : (
                        <button
                            type="button"
                            disabled
                            className="inline-flex h-12 cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-200 px-6 text-sm font-semibold text-slate-500"
                        >
                            Em produção
                        </button>
                    )}

                    <span className="inline-flex items-center gap-2 text-sm font-bold text-slate-500">
                        <Clock3 className="h-4 w-4" />
                        {study.readingTime}
                    </span>
                </div>
            </div>
        </article>
    );
}

function TrailCard({
    trail,
}: {
    trail: {
        title: string;
        description: string;
        icon: ElementType;
        href: string;
        items: string[];
    };
}) {
    const Icon = trail.icon;

    return (
        <Link
            href={trail.href}
            className="group rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-slate-900/5"
        >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-800 transition group-hover:bg-violet-700 group-hover:text-white">
                <Icon className="h-7 w-7" />
            </div>

            <h3 className="mt-5 text-xl font-semibold text-violet-800">{trail.title}</h3>

            <p className="mt-3 text-sm leading-6 text-slate-600">
                {trail.description}
            </p>

            <ul className="mt-5 space-y-3">
                {trail.items.map((item) => (
                    <li key={item} className="flex gap-2 text-xs leading-5 text-slate-600">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-700" />
                        <span>{item}</span>
                    </li>
                ))}
            </ul>

            <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-violet-800">
                Explorar trilha
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
        </Link>
    );
}