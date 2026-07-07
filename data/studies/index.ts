import type { StudyDetail } from "./types";

import { suaOperacaoPodeEstarFuncionando } from "./fundamentos/sua-operacao-pode-estar-funcionando";
// import { oQueESaudeDaSuaLojaDigital } from "./fundamentos/o-que-e-saude-da-sua-loja-digital";
// import { sinaisVitaisDeUmFluxo } from "./fundamentos/sinais-vitais-de-um-fluxo";
// import { quandoEsperarDeixaDeSerNeutro } from "./fundamentos/quando-esperar-deixa-de-ser-neutro";
// import { dashboardsNemSempreMostramSaude } from "./fundamentos/dashboards-nem-sempre-mostram-saude";

// import { atendimentoFuncionaMasDeixaDeResolver } from "./atendimento-cx/atendimento-funciona-mas-deixa-de-resolver";
// import { chatbotTransferindoDemaisParaHumanos } from "./atendimento-cx/chatbot-transferindo-demais-para-humanos";

// import { checkoutFuncionaMasPerdeConsistencia } from "./ecommerce/checkout-funciona-mas-perde-consistencia";

// import { v4VenderGestaoNaoAplicativo } from "./estudos-de-mercado/v4-vender-gestao-nao-aplicativo";

export const studies = [
  suaOperacaoPodeEstarFuncionando,
//   oQueESaudeDaSuaLojaDigital,
//   sinaisVitaisDeUmFluxo,
//   quandoEsperarDeixaDeSerNeutro,
//   dashboardsNemSempreMostramSaude,
//   atendimentoFuncionaMasDeixaDeResolver,
//   chatbotTransferindoDemaisParaHumanos,
//   checkoutFuncionaMasPerdeConsistencia,
//   v4VenderGestaoNaoAplicativo,
] satisfies StudyDetail[];

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

export function getStudiesByCategory(category: StudyDetail["category"]) {
  return studies.filter((study) => study.category === category);
}