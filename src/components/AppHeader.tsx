"use client";

import { Bell, MoreHorizontal } from "lucide-react";

type AppHeaderProps = {
  title?: string;
  subtitle?: string;
  storeName?: string;
  storeContext?: string;
  rightSlot?: React.ReactNode;
};

export function AppHeader({
  title,
  subtitle,
  storeName = "Recife Moto Parts",
  storeContext = "Motopeças e acessórios",
  rightSlot,
}: AppHeaderProps) {
  return (
    <header className="fixed left-0 right-0 top-0 z-40 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8 lg:left-24">
      <div className="flex min-w-0 items-center gap-4">
        <div className="lg:hidden">
          <div className="text-2xl font-bold tracking-tight text-slate-950">
            <span className="text-violet-600">O</span>hrly
          </div>
        </div>

        <div className="hidden h-8 w-px bg-slate-200 lg:block" />

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">
            {title ?? storeName}
          </p>

          <p className="truncate text-xs text-slate-500">
            {subtitle ?? storeContext}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {rightSlot}

        <button
          type="button"
          className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-violet-600" />
        </button>

        <button
          type="button"
          className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}