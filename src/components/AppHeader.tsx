"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  Bell,
  ChevronDown,
  LogOut,
  MoreHorizontal,
  Store,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type AppHeaderProps = {
  title?: string;
  subtitle?: string;
  storeName?: string;
  storeContext?: string;
  rightSlot?: ReactNode;
};

type HeaderAccountContext = {
  userEmail: string | null;
  userName: string | null;
  organizationName: string | null;
  storeName: string | null;
  storeContext: string | null;
};

export function AppHeader({
  title,
  subtitle,
  storeName = "Nome da sua loja",
  storeContext = "Segmento",
  rightSlot,
}: AppHeaderProps) {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  const [accountContext, setAccountContext] =
    useState<HeaderAccountContext | null>(null);

  const [isLoadingAccount, setIsLoadingAccount] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadAccountContext() {
      try {
        setIsLoadingAccount(true);

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!isMounted) return;

        if (!user) {
          setAccountContext(null);
          setIsLoadingAccount(false);
          return;
        }

        const userEmail = user.email ?? null;

        const userName =
          getStringMetadata(user.user_metadata, "full_name") ??
          getStringMetadata(user.user_metadata, "name") ??
          getStringMetadata(user.user_metadata, "business_name") ??
          null;

        const { data: membership } = await supabase
          .from("organization_memberships")
          .select("organization_id")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true })
          .limit(1)
          .maybeSingle();

        if (!membership?.organization_id) {
          setAccountContext({
            userEmail,
            userName,
            organizationName: null,
            storeName: null,
            storeContext: null,
          });

          setIsLoadingAccount(false);
          return;
        }

        const [organizationResult, storeResult] = await Promise.all([
          supabase
            .from("organizations")
            .select("name")
            .eq("id", membership.organization_id)
            .maybeSingle(),

          supabase
            .from("stores")
            .select("name, platform")
            .eq("organization_id", membership.organization_id)
            .order("created_at", { ascending: true })
            .limit(1)
            .maybeSingle(),
        ]);

        if (!isMounted) return;

        setAccountContext({
          userEmail,
          userName,
          organizationName: organizationResult.data?.name ?? null,
          storeName: storeResult.data?.name ?? null,
          storeContext:
            storeResult.data?.platform ??
            organizationResult.data?.name ??
            null,
        });
      } catch (error) {
        console.error("[AppHeader/loadAccountContext]", error);

        if (!isMounted) return;

        setAccountContext(null);
      } finally {
        if (isMounted) {
          setIsLoadingAccount(false);
        }
      }
    }

    loadAccountContext();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadAccountContext();
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!menuRef.current) return;

      if (!menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const displayTitle =
    title ??
    accountContext?.storeName ??
    accountContext?.organizationName ??
    storeName;

  const displaySubtitle =
    subtitle ??
    accountContext?.storeContext ??
    accountContext?.organizationName ??
    storeContext;

  const accountLabel = useMemo(() => {
    if (isLoadingAccount) return "Carregando";
    if (accountContext?.userName) return accountContext.userName;
    if (accountContext?.userEmail) return accountContext.userEmail;
    return "Visitante";
  }, [accountContext, isLoadingAccount]);

  const accountInitial = useMemo(() => {
    const source =
      accountContext?.userName ??
      accountContext?.userEmail ??
      displayTitle ??
      "O";

    return source.slice(0, 1).toUpperCase();
  }, [accountContext, displayTitle]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setMenuOpen(false);
    router.replace("/login");
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-40 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:left-24 lg:px-8">
      <div className="flex min-w-0 items-center gap-4">
        <div className="lg:hidden">
          <div className="text-2xl font-bold tracking-tight text-slate-950">
            <span className="text-violet-600">O</span>hrly
          </div>
        </div>

        <div className="hidden h-8 w-px bg-slate-200 lg:block" />

        <div className="flex min-w-0 items-center gap-3">
          <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 sm:flex">
            <Store className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-black text-slate-900">
              {displayTitle}
            </p>

            <p className="truncate text-xs font-semibold text-slate-500">
              {displaySubtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {rightSlot}

        <button
          type="button"
          className="relative rounded-full p-2 text-slate-500 transition hover:bg-slate-100"
          aria-label="Notificações"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-violet-600" />
        </button>

        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white py-1.5 pl-1.5 pr-3 text-left transition hover:bg-slate-50 sm:flex"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-black text-white">
              {accountInitial}
            </div>

            <div className="min-w-0 max-w-[160px]">
              <p className="truncate text-xs font-black text-slate-800">
                {accountLabel}
              </p>

              <p className="truncate text-[11px] font-semibold text-slate-400">
                {accountContext?.userEmail ? "Conta Ohrly" : "Sessão atual"}
              </p>
            </div>

            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 sm:hidden"
            aria-label="Menu da conta"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>

          {menuOpen ? (
            <div className="absolute right-0 mt-3 w-72 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-950/10">
              <div className="border-b border-slate-100 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-sm font-black text-violet-700">
                    {accountInitial}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-slate-950">
                      {accountLabel}
                    </p>

                    <p className="truncate text-xs font-semibold text-slate-500">
                      {accountContext?.userEmail ?? "Usuário não autenticado"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-2">
                {accountContext?.userEmail ? (
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-bold text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair da conta
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      router.push("/login");
                    }}
                    className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-bold text-violet-700 transition hover:bg-violet-50"
                  >
                    <UserRound className="h-4 w-4" />
                    Entrar ou criar conta
                  </button>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

function getStringMetadata(
  metadata: Record<string, unknown> | undefined,
  key: string,
): string | null {
  const value = metadata?.[key];

  if (typeof value !== "string") return null;

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}