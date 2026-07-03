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

type ClaimPayload = {
  sessionToken?: string | null;
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ClaimPayload;
    const sessionToken = payload.sessionToken?.trim();

    if (!sessionToken) {
      return NextResponse.json(
        { error: "Sessão da leitura gratuita não encontrada." },
        { status: 400 },
      );
    }

    const authHeader = request.headers.get("authorization");
    const accessToken = authHeader?.replace("Bearer ", "");

    if (!accessToken) {
      return NextResponse.json(
        { error: "Usuário não autenticado." },
        { status: 401 },
      );
    }

    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(accessToken);

    if (userError || !user) {
      return NextResponse.json(
        { error: "Usuário não autenticado." },
        { status: 401 },
      );
    }

    const { data: onboarding, error: onboardingError } = await supabaseAdmin
      .from("free_reading_onboardings")
      .select("*")
      .eq("session_token", sessionToken)
      .maybeSingle();

    if (onboardingError) {
      console.error("[free-readings/claim] onboarding error", onboardingError);

      return NextResponse.json(
        { error: "Erro ao localizar leitura gratuita." },
        { status: 500 },
      );
    }

    if (!onboarding) {
      return NextResponse.json(
        { error: "Leitura gratuita não encontrada." },
        { status: 404 },
      );
    }

    if (
      onboarding.claimed_by_user_id &&
      onboarding.claimed_by_user_id !== user.id
    ) {
      return NextResponse.json(
        { error: "Esta leitura já foi associada a outra conta." },
        { status: 409 },
      );
    }

    const context = await getOrCreateAccountContext({
      userId: user.id,
      businessName: buildBusinessName(onboarding),
      segment: onboarding.segment,
    });

    const now = new Date().toISOString();

    const { error: onboardingUpdateError } = await supabaseAdmin
      .from("free_reading_onboardings")
      .update({
        status: "converted",
        claimed_by_user_id: user.id,
        claimed_at: now,
        claimed_organization_id: context.organizationId,
        claimed_store_id: context.storeId,
        metadata: {
          ...(isObject(onboarding.metadata) ? onboarding.metadata : {}),
          claimed: {
            userId: user.id,
            organizationId: context.organizationId,
            storeId: context.storeId,
            claimedAt: now,
          },
        },
      })
      .eq("id", onboarding.id);

    if (onboardingUpdateError) {
      console.error(
        "[free-readings/claim] onboarding update error",
        onboardingUpdateError,
      );

      return NextResponse.json(
        { error: "Não foi possível associar a leitura à conta." },
        { status: 500 },
      );
    }

    await supabaseAdmin
      .from("free_reading_uploads")
      .update({
        claimed_by_user_id: user.id,
        organization_id: context.organizationId,
        store_id: context.storeId,
      })
      .eq("onboarding_id", onboarding.id);

    await supabaseAdmin
      .from("free_reading_paid_interests")
      .update({
        user_id: user.id,
        organization_id: context.organizationId,
        store_id: context.storeId,
      })
      .eq("onboarding_id", onboarding.id);

    await supabaseAdmin.from("free_reading_claims").upsert(
      {
        onboarding_id: onboarding.id,
        session_token: sessionToken,
        user_id: user.id,
        organization_id: context.organizationId,
        store_id: context.storeId,
        source: "create_account_cta",
        metadata: {
          claimedAt: now,
        },
      },
      {
        onConflict: "onboarding_id",
      },
    );

    return NextResponse.json({
      ok: true,
      organizationId: context.organizationId,
      storeId: context.storeId,
    });
  } catch (error) {
    console.error("[free-readings/claim]", error);

    return NextResponse.json(
      { error: "Erro inesperado ao salvar leitura na conta." },
      { status: 500 },
    );
  }
}

async function getOrCreateAccountContext({
  userId,
  businessName,
  segment,
}: {
  userId: string;
  businessName: string;
  segment?: string | null;
}): Promise<{
  organizationId: string;
  storeId: string;
}> {
  const { data: existingMembership, error: membershipError } =
    await supabaseAdmin
      .from("organization_memberships")
      .select("organization_id")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

  if (membershipError) {
    throw membershipError;
  }

  if (existingMembership?.organization_id) {
    const { data: existingStore, error: storeError } = await supabaseAdmin
      .from("stores")
      .select("id")
      .eq("organization_id", existingMembership.organization_id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (storeError) {
      throw storeError;
    }

    if (existingStore?.id) {
      return {
        organizationId: existingMembership.organization_id,
        storeId: existingStore.id,
      };
    }

    const createdStore = await createStore({
      organizationId: existingMembership.organization_id,
      businessName,
      segment,
    });

    return {
      organizationId: existingMembership.organization_id,
      storeId: createdStore.id,
    };
  }

  const organizationSlug = `${slugify(businessName)}-${crypto.randomUUID().slice(0, 8)}`;

  const { data: organization, error: organizationError } = await supabaseAdmin
    .from("organizations")
    .insert({
      name: businessName,
      slug: organizationSlug,
    })
    .select("id")
    .single();

  if (organizationError) {
    throw organizationError;
  }

  const { error: membershipInsertError } = await supabaseAdmin
    .from("organization_memberships")
    .insert({
      organization_id: organization.id,
      user_id: userId,
      role: "owner",
    });

  if (membershipInsertError) {
    throw membershipInsertError;
  }

  const store = await createStore({
    organizationId: organization.id,
    businessName,
    segment,
  });

  return {
    organizationId: organization.id,
    storeId: store.id,
  };
}

async function createStore({
  organizationId,
  businessName,
  segment,
}: {
  organizationId: string;
  businessName: string;
  segment?: string | null;
}): Promise<{ id: string }> {
  const storeSlug = `${slugify(businessName)}-${crypto.randomUUID().slice(0, 8)}`;

  const { data: store, error } = await supabaseAdmin
    .from("stores")
    .insert({
      organization_id: organizationId,
      name: businessName,
      slug: storeSlug,
      platform: segment || null,
      timezone: "America/Recife",
    })
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  return store;
}

function buildBusinessName(onboarding: {
  name?: string | null;
  segment?: string | null;
}): string {
  if (onboarding.segment) {
    return `Operação ${onboarding.segment}`;
  }

  if (onboarding.name) {
    return `Operação de ${onboarding.name}`;
  }

  return "Minha operação";
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}