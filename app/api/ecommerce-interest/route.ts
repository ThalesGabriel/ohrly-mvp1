import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

type EcommerceInterestPayload = {
  source?: string;
  name?: string;
  email?: string;
  mainQuestion?: string;
  dataSource?: string;
  wantsEarlyAccess?: boolean;
  landingPath?: string | null;
  referrer?: string | null;
};

function normalizeText(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : null;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  let payload: EcommerceInterestPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Payload inválido." }, { status: 400 });
  }

  const email = normalizeText(payload.email)?.toLowerCase();

  if (!email || !isValidEmail(email)) {
    return NextResponse.json(
      { message: "Informe um e-mail válido." },
      { status: 400 },
    );
  }

  if (!normalizeText(payload.mainQuestion) || !normalizeText(payload.dataSource)) {
    return NextResponse.json(
      { message: "Preencha as duas perguntas rápidas." },
      { status: 400 },
    );
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.info("Supabase envs missing. Interest captured in fallback mode.", {
      email,
      source: payload.source,
    });

    return NextResponse.json({
      ok: true,
      mode: "fallback_without_supabase",
      message: "Interesse recebido.",
    });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  const row = {
    source: payload.source || "post_checklist_ecommerce_landing",
    status: "new",
    operation_model: null,
    main_question: normalizeText(payload.mainQuestion),
    available_data: payload.dataSource ? [payload.dataSource] : [],
    suggested_policy_keys: [],
    suggested_policies: [],
    refinement_scenario: null,
    refinement_channel: null,
    refinement_pattern: null,
    simulated_reading: {
      source: "post_checklist_ecommerce_landing",
      dataSource: payload.dataSource,
      wantsEarlyAccess: Boolean(payload.wantsEarlyAccess),
    },
    lead_name: normalizeText(payload.name),
    lead_email: email,
    wants_early_access: Boolean(payload.wantsEarlyAccess),
    accepts_contact: true,
    referrer: normalizeText(payload.referrer),
    landing_path: normalizeText(payload.landingPath),
    user_agent: request.headers.get("user-agent"),
  };

  const { data, error } = await supabase
    .from("ecommerce_onboarding_responses")
    .insert(row)
    .select("id")
    .single();

  if (error) {
    console.error("Supabase insert error", error);
    return NextResponse.json(
      { message: "Não foi possível registrar seu interesse." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    leadId: data?.id,
    message: "Interesse registrado.",
  });
}
