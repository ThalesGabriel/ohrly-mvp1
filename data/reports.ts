export type PublicReportId =
  | "retencaoBoletoConversacional"
  | "checkoutAprovacaoLenta";

export type PublicReport = {
  id: PublicReportId;
  slug: string;
  rpi: number;
  publishedAt: string;
};

export const publicReports: PublicReport[] = [
  {
    id: "retencaoBoletoConversacional",
    slug: "retencao-boleto-conversacional",
    rpi: 68,
    publishedAt: "26/05/2026",
  },
  {
    id: "checkoutAprovacaoLenta",
    slug: "checkout-aprovacao-lenta",
    rpi: 58,
    publishedAt: "25/05/2026",
  },
];