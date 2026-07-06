import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DefaultStudyDetail } from "@/components/studies/DefaultStudyDetail";
import { customStudyComponents } from "@/components/studies/custom";
import { getStudyBySlug, studies } from "@/data/studies";
import { PageShell } from "@/components/layout/PageShell";

type StudyPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return studies.map((study) => ({
    slug: study.slug,
  }));
}

export async function generateMetadata({
  params,
}: StudyPageProps): Promise<Metadata> {
  const { slug } = await params;
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
  const { slug } = await params;
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