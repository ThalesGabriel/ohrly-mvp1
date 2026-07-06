import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "./AppFooter";

type PageShellProps = {
  children: React.ReactNode;
};

export function PageShell({ children }: PageShellProps) {
  return (
    <main className="min-h-screen bg-[#fbf9ff] text-[#21152f] transition-colors">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-12%] top-[-14%] h-[420px] w-[420px] rounded-full bg-violet-200/40 blur-3xl" />
        <div className="absolute bottom-[-16%] right-[-10%] h-[520px] w-[520px] rounded-full bg-fuchsia-200/30 blur-3xl" />
      </div>

      <div className="relative z-10">
        <AppHeader />
        {children}
        <AppFooter/>
      </div>
    </main>
  );
}
