import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);

  const code = requestUrl.searchParams.get("code");
  const claimSession = requestUrl.searchParams.get("claimSession");

  const origin = requestUrl.origin;

  if (!code) {
    return NextResponse.redirect(
      `${origin}/home?auth_error=missing_code`,
    );
  }

  const supabase = await createSupabaseServerClient();

  const { error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    console.error("[auth/callback] exchange error", exchangeError);

    return NextResponse.redirect(
      `${origin}/home?auth_error=exchange_failed`,
    );
  }

  if (!claimSession) {
    return NextResponse.redirect(`${origin}/dashboard`);
  }

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.access_token) {
    console.error("[auth/callback] session error", sessionError);

    return NextResponse.redirect(
      `${origin}/home?auth_error=session_not_found`,
    );
  }

  const claimResponse = await fetch(`${origin}/api/free-readings/claim`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      sessionToken: claimSession,
    }),
  });

  if (!claimResponse.ok) {
    const result = await claimResponse.json().catch(() => null);

    console.error("[auth/callback] claim error", result);

    return NextResponse.redirect(
      `${origin}/home?auth_error=claim_failed`,
    );
  }

  return NextResponse.redirect(`${origin}/dashboard?claimed=1`);
}