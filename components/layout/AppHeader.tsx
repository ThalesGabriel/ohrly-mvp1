"use client";

import Link from "next/link";
import { Menu, X, ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: "Início", href: "/" },
  { label: "Estudos", href: "/studies" },
  { label: "Diagnóstico", href: "/diagnostic" },
];

export function AppHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-violet-100/80 bg-[#fbf9ff]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-700 text-white shadow-sm shadow-violet-900/10">
            <Sparkles className="h-5 w-5" />
          </span>

          <div className="leading-none">
            <span className="block text-2xl font-semibold tracking-[-0.05em] text-[#21152f]">
              Ohrly
            </span>
            <span className="hidden text-[11px] font-bold uppercase tracking-[0.18em] text-violet-400 sm:block">
              E-commerce intelligence
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-bold text-slate-600 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-violet-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/onboarding"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-violet-200 bg-white px-5 text-sm font-semibold text-[#21152f] shadow-sm transition hover:border-violet-400 hover:text-violet-800"
          >
            Checklist
          </Link>

          <Link
            href="/early-access"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-violet-700 px-5 text-sm font-semibold text-white shadow-lg shadow-violet-900/10 transition hover:bg-violet-800"
          >
            Quero saber mais
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-violet-200 bg-white text-[#21152f] shadow-sm lg:hidden"
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-violet-100 bg-white px-6 py-5 shadow-xl shadow-violet-900/5 lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-violet-50 hover:text-violet-800"
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Link
                href="/materials/checklist_desempenho_invisivel_ecommerce_ohrly.pdf"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-12 items-center justify-center rounded-xl border border-violet-200 bg-white px-5 text-sm font-semibold text-[#21152f] shadow-sm transition hover:border-violet-400"
              >
                Baixar checklist
              </Link>

              <Link
                href="/ecommerce#early-access"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-violet-700 px-5 text-sm font-semibold text-white shadow-lg shadow-violet-900/10 transition hover:bg-violet-800"
              >
                Quero saber mais
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
