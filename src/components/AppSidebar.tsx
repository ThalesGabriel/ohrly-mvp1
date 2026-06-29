"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  HelpCircle,
  Home,
  LineChart,
  ListChecks,
  Settings,
  Signal,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

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
  // {
  //   label: "Crescimento",
  //   href: "/growth",
  //   icon: BarChart3,
  //   match: "startsWith",
  // },
  // {
  //   label: "Diagnóstico",
  //   href: "/diagnostics",
  //   icon: LineChart,
  //   match: "startsWith",
  // },
  // {
  //   label: "Sinais",
  //   href: "/signals",
  //   icon: Signal,
  //   match: "startsWith",
  // },
  // {
  //   label: "Janelas",
  //   href: "/actionable-windows",
  //   icon: ListChecks,
  //   match: "startsWith",
  // },

];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function isActive(item: SidebarItem) {
    if (item.match === "exact") {
      return pathname === item.href;
    }

    return pathname.startsWith(item.href);
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

      {/* <div className="border-t border-slate-100 px-2 py-5">
        <button
          type="button"
          className="flex w-full flex-col items-center gap-1 rounded-2xl px-2 py-3 text-xs text-slate-500 hover:bg-slate-50"
        >
          <HelpCircle className="h-5 w-5" />
          Ajuda
        </button>
      </div> */}
    </aside>
  );
}