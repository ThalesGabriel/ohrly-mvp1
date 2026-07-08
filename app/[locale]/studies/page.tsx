import { setRequestLocale } from "next-intl/server";
import { StudiesClientPage } from "./StudiesClientPage";

type StudiesPageProps = {
  params: Promise<{
    locale: string;
  }>;
  searchParams?: Promise<{
    page?: string;
  }>;
};

function normalizePage(value?: string) {
  const page = Number(value || "1");

  if (!Number.isFinite(page) || page < 1) {
    return 1;
  }

  return Math.floor(page);
}

export default async function StudiesPage({
  params,
  searchParams,
}: StudiesPageProps) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;

  setRequestLocale(locale);

  return (
    <StudiesClientPage
      initialPage={normalizePage(resolvedSearchParams?.page)}
    />
  );
}