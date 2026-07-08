import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { DefaultStudyDetail } from "@/components/studies/DefaultStudyDetail";
import { customStudyComponents } from "@/components/studies/custom";
import { PageShell } from "@/components/layout/PageShell";
import { routing } from "@/i18n/routing";
import { getStudyBySlug, studies } from "@/data/studies/index";

type StudyPageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    studies.map((study) => ({
      locale,
      slug: study.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: StudyPageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  setRequestLocale(locale);

  const study = getStudyBySlug(slug);

  if (!study) {
    return {
      title: "Estudo não encontrado | Ohrly",
    };
  }

  return {
    title: `${study.title} | Estudos Ohrly`,
    description: study.description,
  };
}

export default async function StudyPage({ params }: StudyPageProps) {
  const { locale, slug } = await params;

  setRequestLocale(locale);

  const study = getStudyBySlug(slug);

  if (!study) {
    notFound();
  }

  const CustomComponent = study.customComponent
    ? customStudyComponents[study.customComponent]
    : null;

  return (
    <PageShell>
      {CustomComponent ? (
        <CustomComponent study={study} />
      ) : (
        <DefaultStudyDetail study={study} />
      )}
    </PageShell>
  );
}