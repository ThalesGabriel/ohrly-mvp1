import {
  Activity,
  BarChart3,
  Clock3,
  Headphones,
  Layers3,
  MessageSquareWarning,
  ShoppingCart,
  Signal,
  type LucideIcon,
} from "lucide-react";

export type StudyCategory =
  | "Fundamentos"
  | "Atendimento e CX"
  | "E-commerce"
  | "Educação"
  | "Operações internas"
  | "Estudos de mercado"
  | "Laboratório";

export type StudyContentBlock =
  | {
      type: "paragraph";
      content: string;
    }
  | {
      type: "heading";
      content: string;
    }
  | {
      type: "quote";
      content: string;
    }
  | {
      type: "list";
      items: string[];
    }
  | {
      type: "callout";
      title: string;
      content: string;
    };

export type StudyDetail = {
  slug: string;
  title: string;
  description: string;
  category: StudyCategory;
  type: string;
  readingTime: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  icon: LucideIcon;
  visualClass: string;
  accentClass: string;
  author: {
    name: string;
    role: string;
  };
  summary: string[];
  content: StudyContentBlock[];
  relatedSlugs?: string[];
  customComponent?: string;
};

export const studies: StudyDetail[] = [
  {
    slug: "sua-operacao-pode-estar-funcionando",
    title: "Sua operação pode estar funcionando e ainda assim não estar saudável",
    description:
      "O estudo fundador do Ohrly sobre saúde da sua loja digital: por que nem todo problema começa quando algo quebra, e como fluxos críticos podem perder consistência antes de qualquer alerta evidente.",
    category: "Fundamentos",
    type: "Estudo fundador",
    readingTime: "8 min de leitura",
    publishedAt: "2026-07-01",
    tags: ["Fundamentos", "Saúde da sua loja digital", "Método Ohrly"],
    icon: Activity,
    visualClass: "from-[#004653] to-[#06183d]",
    accentClass: "text-teal-800 bg-teal-50 border-teal-100",
    author: {
      name: "Ohrly",
      role: "Estudos de Saúde da sua loja digital",
    },
    summary: [
      "Nem todo problema da sua loja digital começa quando algo quebra.",
      "Fluxos críticos podem continuar funcionando enquanto perdem consistência.",
      "A saúde da sua loja digital aparece nos sinais intermediários antes dos indicadores finais.",
      "O papel do Ohrly é tornar visível quando esperar deixa de ser neutro.",
    ],
    content: [
      {
        type: "paragraph",
        content:
          "Uma operação pode continuar atendendo, vendendo, entregando e respondendo clientes enquanto começa a perder saúde. O problema é que, muitas vezes, os sinais aparecem antes da reclamação, antes da fila explodir e antes da queda de resultado ficar evidente.",
      },
      {
        type: "heading",
        content: "O problema não começa no alerta",
      },
      {
        type: "paragraph",
        content:
          "Muitas empresas só percebem um fluxo crítico quando ele já virou urgência. Antes disso, os sinais aparecem como pequenas mudanças: mais recontato, mais transbordo, mais demora, mais exceção, mais retrabalho ou mais dúvida sobre onde agir.",
      },
      {
        type: "quote",
        content:
          "O fluxo ainda funciona. Mas talvez já não esteja se comportando como deveria.",
      },
      {
        type: "heading",
        content: "O que chamamos de saúde da sua loja digital",
      },
      {
        type: "paragraph",
        content:
          "Saúde da sua loja digital é a capacidade de um fluxo crítico manter consistência, recuperar-se de variações normais e não transferir custo invisível para clientes, equipes ou gestores.",
      },
      {
        type: "list",
        items: [
          "Um atendimento pode estar saudável quando resolve com previsibilidade.",
          "Um checkout pode estar saudável quando conduz o cliente sem fricção crescente.",
          "Uma cobrança pode estar saudável quando não depende apenas de reação tardia.",
          "Um onboarding pode estar saudável quando não acumula exceções e dúvidas recorrentes.",
        ],
      },
      {
        type: "callout",
        title: "A pergunta central do Ohrly",
        content:
          "Em que momento esperar deixou de ser uma decisão neutra?",
      },
    ],
    relatedSlugs: [
      "o-que-e-saude-da-sua-loja-digital",
      "sinais-vitais-de-um-fluxo",
      "quando-esperar-deixa-de-ser-neutro",
    ],
  },
  {
    slug: "o-que-e-saude-da-sua-loja-digital",
    title: "O que é saúde da sua loja digital?",
    description:
      "Uma introdução à categoria que o Ohrly propõe: acompanhar fluxos críticos como organismos vivos, com sinais, sintomas e recuperação.",
    category: "Fundamentos",
    type: "Conceito",
    readingTime: "6 min de leitura",
    publishedAt: "2026-07-01",
    tags: ["Saúde da sua loja digital", "Categoria", "Gestão"],
    icon: Activity,
    visualClass: "from-teal-700 to-cyan-900",
    accentClass: "text-teal-800 bg-teal-50 border-teal-100",
    author: {
      name: "Ohrly",
      role: "Estudos de Saúde da sua loja digital",
    },
    summary: [
      "Saúde da sua loja digital não é apenas ausência de erro.",
      "Fluxos críticos precisam ser acompanhados por sinais vitais.",
      "O objetivo é identificar perda de consistência antes da urgência.",
    ],
    content: [
      {
        type: "paragraph",
        content:
          "Saúde da sua loja digital é uma forma de olhar para fluxos críticos não apenas pelo resultado final, mas pelo comportamento que eles demonstram ao longo do tempo.",
      },
      {
        type: "heading",
        content: "Funcionando não significa saudável",
      },
      {
        type: "paragraph",
        content:
          "Um sistema pode continuar disponível, uma equipe pode continuar atendendo e um processo pode continuar rodando. Ainda assim, a operação pode estar ficando mais cara, mais lenta ou mais dependente de intervenção manual.",
      },
      {
        type: "callout",
        title: "Definição prática",
        content:
          "Um fluxo saudável é aquele que mantém consistência, previsibilidade e capacidade de recuperação sem acumular custo invisível.",
      },
    ],
    relatedSlugs: [
      "sinais-vitais-de-um-fluxo",
      "dashboards-nem-sempre-mostram-saude",
    ],
  },
  {
    slug: "sinais-vitais-de-um-fluxo",
    title: "O que são sinais vitais de um fluxo?",
    description:
      "Tempo, fila, recontato, handoff, abandono, resolução e recorrência: como sinais intermediários revelam a saúde de um fluxo.",
    category: "Fundamentos",
    type: "Método",
    readingTime: "7 min de leitura",
    publishedAt: "2026-07-01",
    tags: ["Sinais vitais", "Fluxos", "Métricas"],
    icon: Signal,
    visualClass: "from-cyan-700 to-slate-900",
    accentClass: "text-cyan-800 bg-cyan-50 border-cyan-100",
    author: {
      name: "Ohrly",
      role: "Estudos de Saúde da sua loja digital",
    },
    summary: [
      "Sinais vitais são métricas que indicam a saúde comportamental de um fluxo.",
      "Eles aparecem antes dos indicadores finais.",
      "Nem toda métrica é um sinal vital.",
    ],
    content: [
      {
        type: "paragraph",
        content:
          "Sinais vitais são indicadores que ajudam a entender se um fluxo está mantendo sua capacidade natural de funcionar bem. Eles não mostram apenas resultado; mostram comportamento.",
      },
      {
        type: "list",
        items: [
          "Tempo de resposta",
          "Tempo de resolução",
          "Recontato",
          "Handoff ou transbordo",
          "Abandono",
          "Fila",
          "Status por etapa",
          "Reclamações",
        ],
      },
    ],
    relatedSlugs: [
      "o-que-e-saude-da-sua-loja-digital",
      "quando-esperar-deixa-de-ser-neutro",
    ],
  },
  {
    slug: "quando-esperar-deixa-de-ser-neutro",
    title: "Quando esperar deixa de ser neutro?",
    description:
      "A janela mais importante da operação nem sempre é o incidente. Muitas vezes é o ponto em que continuar esperando passa a comprar risco.",
    category: "Fundamentos",
    type: "Leitura estratégica",
    readingTime: "7 min de leitura",
    publishedAt: "2026-07-01",
    tags: ["Janelas de decisão", "Risco", "Gestão"],
    icon: Clock3,
    visualClass: "from-amber-600 to-orange-900",
    accentClass: "text-amber-800 bg-amber-50 border-amber-100",
    author: {
      name: "Ohrly",
      role: "Estudos de Saúde da sua loja digital",
    },
    summary: [
      "Esperar pode ser uma decisão válida.",
      "O problema começa quando esperar passa a aumentar risco da sua loja digital.",
      "O Ohrly tenta identificar essa janela antes da urgência.",
    ],
    content: [
      {
        type: "paragraph",
        content:
          "Nem toda variação exige ação imediata. Operações têm ruídos normais. O ponto importante é entender quando a variação deixa de ser saudável e passa a indicar perda de consistência.",
      },
      {
        type: "quote",
        content:
          "A pergunta não é apenas se algo piorou. A pergunta é se continuar esperando ainda é barato.",
      },
    ],
    relatedSlugs: [
      "sua-operacao-pode-estar-funcionando",
      "sinais-vitais-de-um-fluxo",
    ],
  },
  {
    slug: "dashboards-nem-sempre-mostram-saude",
    title: "Por que dashboards mostram números, mas nem sempre mostram saúde?",
    description:
      "Dashboards ajudam a acompanhar indicadores, mas nem sempre mostram quando um fluxo começou a perder consistência da sua loja digital.",
    category: "Fundamentos",
    type: "Ensaio",
    readingTime: "9 min de leitura",
    publishedAt: "2026-07-01",
    tags: ["Dashboards", "BI", "Interpretação"],
    icon: BarChart3,
    visualClass: "from-blue-700 to-slate-900",
    accentClass: "text-blue-800 bg-blue-50 border-blue-100",
    author: {
      name: "Ohrly",
      role: "Estudos de Saúde da sua loja digital",
    },
    summary: [
      "Dashboards mostram números, mas nem sempre mostram mudança de comportamento.",
      "O problema pode estar na interpretação, não na falta de dado.",
      "Saúde da sua loja digital depende de contexto, recorrência e decisão.",
    ],
    content: [
      {
        type: "paragraph",
        content:
          "Dashboards são importantes, mas geralmente mostram indicadores isolados. A saúde da sua loja digital depende de entender relações, contexto, recorrência e perda de consistência.",
      },
    ],
    relatedSlugs: [
      "o-que-e-saude-da-sua-loja-digital",
      "quando-esperar-deixa-de-ser-neutro",
    ],
  },
  {
    slug: "atendimento-funciona-mas-deixa-de-resolver",
    title: "Quando um atendimento funciona, mas deixa de resolver",
    description:
      "Como aumento de recontato, fila, handoff e tempo de resolução podem indicar perda de saúde antes da reclamação aparecer.",
    category: "Atendimento e CX",
    type: "Fluxo aplicado",
    readingTime: "8 min de leitura",
    publishedAt: "2026-07-01",
    tags: ["CX", "Atendimento", "Recontato"],
    icon: Headphones,
    visualClass: "from-violet-700 to-slate-950",
    accentClass: "text-violet-800 bg-violet-50 border-violet-100",
    author: {
      name: "Ohrly",
      role: "Estudos de Saúde da sua loja digital",
    },
    summary: [
      "Um atendimento pode continuar respondendo e ainda assim perder resolução.",
      "Recontato, fila e handoff são sinais vitais importantes.",
      "A perda de saúde aparece antes da reclamação formal.",
    ],
    content: [
      {
        type: "paragraph",
        content:
          "Em CX, muitos problemas não começam como reclamação. Eles começam como aumento de esforço: o cliente volta mais vezes, espera mais, é transferido com mais frequência ou precisa explicar o mesmo problema novamente.",
      },
    ],
    relatedSlugs: [
      "chatbot-transferindo-demais-para-humanos",
      "sinais-vitais-de-um-fluxo",
    ],
  },
  {
    slug: "chatbot-transferindo-demais-para-humanos",
    title: "Quando um chatbot começa a transferir demais para humanos",
    description:
      "O transbordo para humano pode ser um sinal vital: o fluxo ainda responde, mas perde capacidade de resolver sozinho.",
    category: "Atendimento e CX",
    type: "Análise de fluxo",
    readingTime: "6 min de leitura",
    publishedAt: "2026-07-01",
    tags: ["Chatbot", "Handoff", "Atendimento"],
    icon: MessageSquareWarning,
    visualClass: "from-rose-700 to-slate-950",
    accentClass: "text-rose-800 bg-rose-50 border-rose-100",
    author: {
      name: "Ohrly",
      role: "Estudos de Saúde da sua loja digital",
    },
    summary: [
      "Handoff não é necessariamente problema.",
      "Mas aumento persistente de handoff pode indicar perda de resolução automática.",
      "O importante é observar recorrência, contexto e impacto.",
    ],
    content: [
      {
        type: "paragraph",
        content:
          "Um chatbot pode continuar respondendo mensagens e, ao mesmo tempo, transferir cada vez mais casos para humanos. Nesse cenário, o fluxo não quebrou, mas pode ter perdido capacidade de resolver.",
      },
    ],
    relatedSlugs: [
      "atendimento-funciona-mas-deixa-de-resolver",
      "sinais-vitais-de-um-fluxo",
    ],
  },
  {
    slug: "checkout-funciona-mas-perde-consistencia",
    title: "Quando o checkout continua ativo, mas perde consistência",
    description:
      "Nem toda perda de venda aparece como erro técnico. Às vezes o fluxo funciona, mas começa a gerar mais abandono, tentativa e fricção.",
    category: "E-commerce",
    type: "Fluxo aplicado",
    readingTime: "8 min de leitura",
    publishedAt: "2026-07-01",
    tags: ["E-commerce", "Checkout", "Conversão"],
    icon: ShoppingCart,
    visualClass: "from-emerald-700 to-slate-950",
    accentClass: "text-emerald-800 bg-emerald-50 border-emerald-100",
    author: {
      name: "Ohrly",
      role: "Estudos de Saúde da sua loja digital",
    },
    summary: [
      "Checkout saudável não é apenas checkout disponível.",
      "Abandono, tentativa repetida e pedidos não concluídos podem indicar perda de consistência.",
      "A operação precisa perceber atrito antes da queda final.",
    ],
    content: [
      {
        type: "paragraph",
        content:
          "No e-commerce, um checkout pode continuar tecnicamente disponível e ainda assim gerar mais fricção. A queda nem sempre aparece como erro; pode aparecer como abandono, repetição de tentativa, falha de pagamento ou pedido não concluído.",
      },
    ],
    relatedSlugs: [
      "sinais-vitais-de-um-fluxo",
      "quando-esperar-deixa-de-ser-neutro",
    ],
  },
  {
    slug: "v4-vender-gestao-nao-aplicativo",
    title: "O que o V4 ensina sobre vender gestão, não aplicativo",
    description:
      "Uma leitura sobre como produtos ganham força quando deixam de ser percebidos como ferramenta e passam a representar uma camada de gestão.",
    category: "Estudos de mercado",
    type: "Estudo de mercado",
    readingTime: "10 min de leitura",
    publishedAt: "2026-07-01",
    tags: ["Categoria", "Gestão", "Posicionamento"],
    icon: Layers3,
    visualClass: "from-[#06183d] to-blue-900",
    accentClass: "text-blue-800 bg-blue-50 border-blue-100",
    author: {
      name: "Ohrly",
      role: "Estudos de Saúde da sua loja digital",
    },
    summary: [
      "Produtos fortes não vendem apenas interface.",
      "Eles vendem uma camada de gestão.",
      "O Ohrly pode aprender com essa lógica para posicionar saúde da sua loja digital.",
    ],
    content: [],
    customComponent: "V4StudyDetail",
    relatedSlugs: [
      "empresas-compram-metodos-antes-de-ferramentas",
      "sua-operacao-pode-estar-funcionando",
    ],
  },
];

export function getStudyBySlug(slug: string) {
  return studies.find((study) => study.slug === slug);
}

export function getRelatedStudies(study: StudyDetail) {
  if (!study.relatedSlugs?.length) {
    return studies
      .filter(
        (item) => item.slug !== study.slug && item.category === study.category
      )
      .slice(0, 3);
  }

  return study.relatedSlugs
    .map((slug) => getStudyBySlug(slug))
    .filter(Boolean)
    .slice(0, 3) as StudyDetail[];
}