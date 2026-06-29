import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const PUBLIC_ROUTES = [
  "/login",
  "/auth/callback",
];

const AUTH_REDIRECT_PATH = "/login";
const APP_HOME_PATH = "/";

function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.some((route) => {
    return pathname === route || pathname.startsWith(`${route}/`);
  });
}

function isStaticOrAssetRoute(pathname: string) {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/robots.txt") ||
    pathname.startsWith("/sitemap.xml") ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$/)
  );
}

function redirectWithCookies({
  request,
  response,
  path,
}: {
  request: NextRequest;
  response: NextResponse;
  path: string;
}) {
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = path;

  const redirectResponse = NextResponse.redirect(redirectUrl);

  response.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie.name, cookie.value);
  });

  return redirectResponse;
}

export async function updateSession(request: NextRequest) {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase envs não configuradas.");
  }

  const pathname = request.nextUrl.pathname;

  if (isStaticOrAssetRoute(pathname)) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        supabaseResponse = NextResponse.next({
          request,
        });

        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  const { data, error } = await supabase.auth.getClaims();

  const isAuthenticated = !error && Boolean(data?.claims);
  const publicRoute = isPublicRoute(pathname);

  if (!isAuthenticated && !publicRoute) {
    const loginUrl = request.nextUrl.clone();

    loginUrl.pathname = AUTH_REDIRECT_PATH;
    loginUrl.searchParams.set("next", pathname);

    const redirectResponse = NextResponse.redirect(loginUrl);

    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });

    return redirectResponse;
  }

  if (isAuthenticated && pathname === AUTH_REDIRECT_PATH) {
    return redirectWithCookies({
      request,
      response: supabaseResponse,
      path: APP_HOME_PATH,
    });
  }

  return supabaseResponse;
}