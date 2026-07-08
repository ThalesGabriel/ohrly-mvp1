import type { StudyDetail } from "../types";

export const suaOperacaoPodeEstarFuncionando: StudyDetail = {
  slug: "sua-operacao-pode-estar-funcionando",
  title: "Sua operação pode estar funcionando e ainda assim não estar saudável",
  description:
    "O estudo fundador do Ohrly sobre saúde da sua loja digital: por que nem todo problema começa quando algo quebra, e como fluxos críticos podem perder consistência antes de qualquer alerta evidente.",
  category: "Fundamentos",
  type: "Estudo fundador",
  readingTime: "8 min de leitura",
  publishedAt: "2026-07-01",
  tags: ["Fundamentos", "Saúde da sua loja digital", "Método Ohrly"],
  icon: "activity",
  accentClass: "text-violet-800 bg-violet-50 border-violet-100",
  visualClass: "from-violet-700 to-violet-800",
  customComponent: "founderStudy",
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
      content: "Em que momento esperar deixou de ser uma decisão neutra?",
    },
  ],
  relatedSlugs: [
    "o-que-e-saude-da-sua-loja-digital",
    "sinais-vitais-de-um-fluxo",
    "quando-esperar-deixa-de-ser-neutro",
  ],
};