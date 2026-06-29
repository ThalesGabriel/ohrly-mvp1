"use client";

import { AppHeader } from "@/components/AppHeader";
import { AppSidebar } from "@/components/AppSidebar";

type AppShellProps = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  storeName?: string;
  storeContext?: string;
  rightSlot?: React.ReactNode;
  showHeader?: boolean;
  contentClassName?: string;
  innerClassName?: string;
};

export function AppShell({
  children,
  title,
  subtitle,
  storeName = "Recife Moto Parts",
  storeContext = "Motopeças e acessórios",
  rightSlot,
  showHeader = true,
  contentClassName = "",
  innerClassName = "mx-auto w-full px-8 py-8",
}: AppShellProps) {
  return (
    <main className="min-h-screen bg-[#faf9ff] text-slate-950">
      <div className="flex min-h-screen">
        <AppSidebar />

        <section
          className={[
            "min-w-0 flex-1 lg:pl-24",
            contentClassName,
          ].join(" ")}
        >
          {showHeader && (
            <AppHeader
              title={title}
              subtitle={subtitle}
              storeName={storeName}
              storeContext={storeContext}
              rightSlot={rightSlot}
            />
          )}

          <div className={["pt-20", innerClassName].join(" ")}>
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}