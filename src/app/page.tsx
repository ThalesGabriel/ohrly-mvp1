import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const AUTHENTICATED_HOME_PATH = "/home";
const PUBLIC_HOME_PATH = "/login";

type HomeRedirectPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HomeRedirectPage({
  searchParams,
}: HomeRedirectPageProps) {
  const params = await searchParams;
  const queryString = buildQueryString(params);

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const destination = user ? AUTHENTICATED_HOME_PATH : PUBLIC_HOME_PATH;

  redirect(queryString ? `${destination}?${queryString}` : destination);
}

function buildQueryString(
  params?: Record<string, string | string[] | undefined>,
) {
  const query = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (!value) return;

    if (Array.isArray(value)) {
      value.forEach((item) => query.append(key, item));
      return;
    }

    query.set(key, value);
  });

  return query.toString();
}