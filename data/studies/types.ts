export type StudyCategory =
  | "Fundamentos"
  | "Atendimento e CX"
  | "E-commerce"
  | "Educação"
  | "Operações internas"
  | "Estudos de mercado"
  | "Laboratório";

export type StudyIconKey =
  | "activity"
  | "barChart"
  | "clock"
  | "headphones"
  | "layers"
  | "messageWarning"
  | "shoppingCart"
  | "signal";

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
  icon: StudyIconKey;
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