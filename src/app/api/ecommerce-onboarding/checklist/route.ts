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

import { Resend } from "resend";

export const runtime = "nodejs";

type ChecklistPayload = {
  source?: string;
  operationModel?: string;
  mainQuestion?: string;
  availableData?: string[];
  matchedPolicies?: Array<{
    id: string;
    title: string;
    score?: number;
    fitReasons?: string[];
  }>;
  refinement?: {
    scenario?: string;
    channelContext?: string;
    behaviorPattern?: string;
  };
  checklistRequest?: {
    name?: string;
    email?: string;
    leadMagnet?: string;
    intent?: string;
    wantsEarlyAccess?: boolean;
    suggestedFocus?: Array<{
      id: string;
      title: string;
    }>;
  };
  tracking?: {
    landingPath?: string | null;
    referrer?: string | null;
    utmSource?: string | null;
    utmMedium?: string | null;
    utmCampaign?: string | null;
    utmContent?: string | null;
    utmTerm?: string | null;
  };
};

const resendApiKey = process.env.RESEND_API_KEY;

if (!supabaseUrl) {
  throw new Error("Missing SUPABASE_URL");
}

if (!serviceRoleKey) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
}

if (!resendApiKey) {
  throw new Error("Missing RESEND_API_KEY");
}

const supabase = createClient(supabaseUrl, serviceRoleKey);
const resend = new Resend(resendApiKey);

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeText(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : null;
}

export async function POST(request: Request) {
  let payload: ChecklistPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Payload inválido." },
      { status: 400 }
    );
  }

  const checklistRequest = payload.checklistRequest;
  const email = normalizeText(checklistRequest?.email)?.toLowerCase();
  const name = normalizeText(checklistRequest?.name);

  if (!email || !isValidEmail(email)) {
    return NextResponse.json(
      { message: "Informe um e-mail válido para receber o checklist." },
      { status: 400 }
    );
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://ohrly-mvp1.vercel.app/";

  const checklistUrl = `${siteUrl}/materials/checklist_desempenho_invisivel_ecommerce_ohrly.pdf`;

  const suggestedPolicies = payload.matchedPolicies || [];
  const suggestedFocus = checklistRequest?.suggestedFocus || [];

  const row = {
    source: payload.source || "ohrly_ecommerce_checklist_lead_stepper",
    status: "new",

    operation_model: normalizeText(payload.operationModel),
    main_question: normalizeText(payload.mainQuestion),
    available_data: payload.availableData || [],

    suggested_policy_keys: suggestedPolicies.map((policy) => policy.id),
    suggested_policies: suggestedPolicies,

    refinement_scenario: normalizeText(payload.refinement?.scenario),
    refinement_channel: normalizeText(payload.refinement?.channelContext),
    refinement_pattern: normalizeText(payload.refinement?.behaviorPattern),

    simulated_reading: {
      suggestedFocus,
      refinement: payload.refinement || {},
      leadMagnet:
        checklistRequest?.leadMagnet ||
        "checklist_desempenho_invisivel_ecommerce",
    },

    lead_name: name,
    lead_email: email,
    wants_early_access: Boolean(checklistRequest?.wantsEarlyAccess),
    accepts_contact: true,

    utm_source: normalizeText(payload.tracking?.utmSource),
    utm_medium: normalizeText(payload.tracking?.utmMedium),
    utm_campaign: normalizeText(payload.tracking?.utmCampaign),
    utm_content: normalizeText(payload.tracking?.utmContent),
    utm_term: normalizeText(payload.tracking?.utmTerm),
    referrer: normalizeText(payload.tracking?.referrer),
    landing_path: normalizeText(payload.tracking?.landingPath),

    user_agent: request.headers.get("user-agent"),
  };

  const { data: insertedLead, error: insertError } = await supabase
    .from("ecommerce_onboarding_responses")
    .insert(row)
    .select("id")
    .single();

  if (insertError) {
    console.error("Supabase insert error", insertError);

    return NextResponse.json(
      { message: "Não foi possível registrar sua solicitação." },
      { status: 500 }
    );
  }

  const leadId = insertedLead.id as string;

  const focusList =
    suggestedFocus.length > 0
      ? suggestedFocus.map((item) => `<li>${item.title}</li>`).join("")
      : "<li>conversão, continuidade, produtos, canal digital e mensurabilidade</li>";

  const from =
    process.env.RESEND_FROM_EMAIL || "Ohrly <onboarding@resend.dev>";

  const internalEmail = process.env.OHRLY_INTERNAL_EMAIL;

  const { error: emailError } = await resend.emails.send({
    from,
    to: email,
    subject: "Seu checklist gratuito de desempenho para e-commerce",
    html: `
      <div style="font-family: Arial, sans-serif; color: #21152f; line-height: 1.6;">
        <h1 style="color: #6d28d9;">Seu checklist está aqui</h1>

        <p>Olá${name ? `, ${name}` : ""}.</p>

        <p>
          Obrigado por responder à simulação do Ohrly. Preparamos o checklist
          gratuito para ajudar você a observar sinais de desempenho invisível
          no seu e-commerce.
        </p>

        <p>
          Pelo seu perfil, faz sentido olhar principalmente para:
        </p>

        <ul>
          ${focusList}
        </ul>

        <p>
          O material está anexado neste e-mail.
        </p>

        <p>
          Importante: o checklist não é um diagnóstico da sua loja. Ele é um
          ponto de partida para você entender quais sinais observar antes de
          investir mais em tráfego, desconto ou operação.
        </p>

        <p>
          — Ohrly
        </p>
      </div>
    `,
    attachments: [
      {
        filename: "checklist_desempenho_invisivel_ecommerce_ohrly.pdf",
        path: checklistUrl,
      },
    ],
  });

  if (emailError) {
    console.error("Resend checklist email error", emailError);

    await supabase
      .from("ecommerce_onboarding_responses")
      .update({ status: "email_failed" })
      .eq("id", leadId);

    return NextResponse.json(
      {
        message:
          "Registramos sua solicitação, mas não conseguimos enviar o checklist agora.",
      },
      { status: 502 }
    );
  }

  await supabase
    .from("ecommerce_onboarding_responses")
    .update({
      status: "checklist_sent",
      checklist_email_sent_at: new Date().toISOString(),
    })
    .eq("id", leadId);

  if (internalEmail) {
    await resend.emails.send({
      from,
      to: internalEmail,
      subject: "Novo lead do checklist Ohrly",
      html: `
        <div style="font-family: Arial, sans-serif; color: #21152f; line-height: 1.6;">
          <h2>Novo lead do checklist</h2>

          <p><strong>Nome:</strong> ${name || "Não informado"}</p>
          <p><strong>E-mail:</strong> ${email}</p>
          <p><strong>Quer acesso inicial:</strong> ${
            checklistRequest?.wantsEarlyAccess ? "Sim" : "Não"
          }</p>

          <p><strong>Operação:</strong> ${payload.operationModel || "-"}</p>
          <p><strong>Dúvida principal:</strong> ${payload.mainQuestion || "-"}</p>
          <p><strong>Dados disponíveis:</strong> ${
            payload.availableData?.join(", ") || "-"
          }</p>

          <p><strong>Policies sugeridas:</strong></p>
          <ul>
            ${
              suggestedPolicies.length > 0
                ? suggestedPolicies
                    .map((policy) => `<li>${policy.title}</li>`)
                    .join("")
                : "<li>Nenhuma policy calculada</li>"
            }
          </ul>
        </div>
      `,
    });
  }

  return NextResponse.json({
    ok: true,
    leadId,
    message: "Checklist enviado com sucesso.",
  });
}