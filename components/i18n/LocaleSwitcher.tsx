"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";

const localeOptions = [
    {
        value: "pt",
        label: "🇧🇷 PT",
    },
    {
        value: "en",
        label: "🇺🇸 EN",
    },
];

export default function LocaleSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    function changeLocale(nextLocale: string) {
        startTransition(() => {
            router.replace(pathname, { locale: nextLocale });
        });
    }

    return (
        <select
            value={locale}
            disabled={isPending}
            onChange={(event) => changeLocale(event.target.value)}
            aria-label="Selecionar idioma"
            className="h-10 rounded-full border border-slate-200 bg-white/80 px-3 text-xs font-medium text-slate-700 shadow-sm outline-none transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-200 dark:hover:bg-slate-900"
        >
            {localeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
}