"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Home, LogOut } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { supabase } from "@/lib/supabase/client";

type SidebarItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  match: "exact" | "startsWith";
};

const sidebarItems: SidebarItem[] = [
  {
    label: "Home",
    href: "/",
    icon: Home,
    match: "exact",
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  function isActive(item: SidebarItem) {
    if (item.match === "exact") {
      return pathname === item.href;
    }

    return pathname.startsWith(item.href);
  }

  async function handleLogout() {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      setIsLoggingOut(false);
      console.error("Erro ao sair:", error.message);
      return;
    }

    router.replace("/login");
    router.refresh();
  }

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-24 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      <button
        type="button"
        onClick={() => router.push("/")}
        className="flex h-20 items-center justify-center border-b border-slate-100"
      >
        <div className="text-2xl font-bold tracking-tight text-slate-950">
          <span className="text-violet-600">O</span>hrly
        </div>
      </button>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-6">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);

          return (
            <button
              key={item.href}
              type="button"
              onClick={() => router.push(item.href)}
              title={item.label}
              className={[
                "flex flex-col items-center gap-1 rounded-2xl px-2 py-3 text-xs transition",
                active
                  ? "bg-violet-100 text-violet-700"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
              ].join(" ")}
            >
              <Icon className="h-5 w-5" />
              <span className="max-w-full truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 px-2 py-5">
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          title="Sair"
          className="flex w-full flex-col items-center gap-1 rounded-2xl px-2 py-3 text-xs text-slate-500 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LogOut className="h-5 w-5" />
          <span>{isLoggingOut ? "Saindo" : "Sair"}</span>
        </button>
      </div>
    </aside>
  );
}