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


type StartFreeReadingPayload = {
  name?: string;
  contact?: string;
  operationType?: string;
  segment?: string;
  objective?: string;
  operationSize?: string;
  allowContact?: boolean;
  source?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as StartFreeReadingPayload;

    const name = payload.name?.trim();
    const contact = payload.contact?.trim();
    const operationType = payload.operationType?.trim();
    const segment = payload.segment?.trim();
    const objective = payload.objective?.trim();

    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: "Informe seu nome." },
        { status: 400 }
      );
    }

    if (!contact || contact.length < 5) {
      return NextResponse.json(
        { error: "Informe um e-mail ou WhatsApp válido." },
        { status: 400 }
      );
    }

    if (!operationType) {
      return NextResponse.json(
        { error: "Informe o tipo de operação." },
        { status: 400 }
      );
    }

    if (!segment) {
      return NextResponse.json(
        { error: "Informe o segmento do negócio." },
        { status: 400 }
      );
    }

    if (!objective) {
      return NextResponse.json(
        { error: "Informe o que você quer entender primeiro." },
        { status: 400 }
      );
    }

    const contactType = detectContactType(contact);

    const { data, error } = await supabaseAdmin
      .from("free_reading_onboardings")
      .insert({
        name,
        contact,
        contact_type: contactType,
        operation_type: operationType,
        segment,
        objective,
        operation_size: payload.operationSize?.trim() || null,
        allow_contact: payload.allowContact ?? true,
        source: payload.source || "free_daily_reading",
        utm_source: payload.utmSource || null,
        utm_medium: payload.utmMedium || null,
        utm_campaign: payload.utmCampaign || null,
        utm_content: payload.utmContent || null,
        utm_term: payload.utmTerm || null,
        metadata: {
          userAgent: request.headers.get("user-agent"),
          createdFrom: "free_reading_start_form",
        },
      })
      .select("id, session_token")
      .single();

    if (error) {
      console.error("[free-readings/start]", error);

      return NextResponse.json(
        { error: "Não foi possível iniciar sua leitura gratuita." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      onboardingId: data.id,
      sessionToken: data.session_token,
    });
  } catch (error) {
    console.error("[free-readings/start]", error);

    return NextResponse.json(
      { error: "Erro inesperado ao iniciar leitura gratuita." },
      { status: 500 }
    );
  }
}

function detectContactType(contact: string): "email" | "whatsapp" | "unknown" {
  if (contact.includes("@")) {
    return "email";
  }

  const onlyDigits = contact.replace(/\D/g, "");

  if (onlyDigits.length >= 10) {
    return "whatsapp";
  }

  return "unknown";
}