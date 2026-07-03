import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
  throw new Error("Supabase envs não configuradas.");
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export const runtime = "nodejs";

type PaidInterestPayload = {
  sessionToken?: string | null;
  contact?: string | null;

  policyId?: string | null;
  policyTitle?: string | null;
  policyStatus?: string | null;
  policyImpact?: string | null;

  planName?: string | null;
  priceLabel?: string | null;
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as PaidInterestPayload;

    const sessionToken = payload.sessionToken?.trim() || null;
    const contactFromModal = payload.contact?.trim() || null;

    if (!sessionToken && !contactFromModal) {
      return NextResponse.json(
        {
          error:
            "Informe um contato ou acesse a partir de uma sessão de leitura gratuita.",
        },
        { status: 400 },
      );
    }

    let onboarding:
      | {
          id: string;
          session_token: string;
          contact: string | null;
          metadata: Record<string, unknown> | null;
        }
      | null = null;

    if (sessionToken) {
      const { data, error } = await supabaseAdmin
        .from("free_reading_onboardings")
        .select("id, session_token, contact, metadata")
        .eq("session_token", sessionToken)
        .maybeSingle();

      if (error) {
        console.error("[paid-interest] onboarding lookup error", error);

        return NextResponse.json(
          { error: "Erro ao localizar sua leitura gratuita." },
          { status: 500 },
        );
      }

      onboarding = data;
    }

    const contact = contactFromModal || onboarding?.contact || null;

    if (!contact) {
      return NextResponse.json(
        { error: "Informe um e-mail ou WhatsApp para entrar na lista." },
        { status: 400 },
      );
    }

    const { error: insertError } = await supabaseAdmin
      .from("free_reading_paid_interests")
      .insert({
        onboarding_id: onboarding?.id ?? null,
        session_token: sessionToken,

        policy_id: payload.policyId || null,
        policy_title: payload.policyTitle || null,
        policy_status: payload.policyStatus || null,
        policy_impact: payload.policyImpact || null,

        plan_name: payload.planName || "Ohrly Acompanhamento",
        price_label: payload.priceLabel || "R$ 97/mês",

        contact,
        interest_level: "waitlist",
        source: "policy_paid_modal",
        status: "new",

        metadata: {
          userAgent: request.headers.get("user-agent"),
          registeredAt: new Date().toISOString(),
        },
      });

    if (insertError) {
      console.error("[paid-interest] insert error", insertError);

      return NextResponse.json(
        { error: "Não foi possível registrar seu interesse agora." },
        { status: 500 },
      );
    }

    if (onboarding?.id) {
      await supabaseAdmin
        .from("free_reading_onboardings")
        .update({
          metadata: {
            ...(isObject(onboarding.metadata) ? onboarding.metadata : {}),
            lastPaidInterest: {
              policyId: payload.policyId || null,
              policyTitle: payload.policyTitle || null,
              priceLabel: payload.priceLabel || "R$ 97/mês",
              registeredAt: new Date().toISOString(),
            },
          },
        })
        .eq("id", onboarding.id);
    }

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    console.error("[paid-interest]", error);

    return NextResponse.json(
      { error: "Erro inesperado ao registrar interesse." },
      { status: 500 },
    );
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}