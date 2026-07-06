// src/components/theme/ThemeToggle.tsx
"use client";

import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

function subscribe() {
    return () => undefined;
}

function useMounted() {
    return useSyncExternalStore(
        subscribe,
        () => true,
        () => false,
    );
}

export default function ThemeToggle() {
    const mounted = useMounted();
    const { theme, setTheme } = useTheme();

    if (!mounted) {
        return (
            <div className="h-10 w-[132px] rounded-full border border-slate-200 bg-white/70 dark:border-slate-800 dark:bg-slate-950/70" />
        );
    }

    const options = [
        { value: "light", label: "Claro", icon: Sun },
        { value: "dark", label: "Escuro", icon: Moon },
        { value: "system", label: "Sistema", icon: Laptop },
    ];

    return (
        <div className="inline-flex rounded-full border border-slate-200 bg-white/80 p-1 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
            {options.map((option) => {
                const Icon = option.icon;
                const active = theme === option.value;

                return (
                    <button
                        key={option.value}
                        type="button"
                        aria-label={`Usar tema ${option.label.toLowerCase()}`}
                        onClick={() => setTheme(option.value)}
                        className={cn(
                            "flex h-8 w-10 cursor-pointer items-center justify-center rounded-full transition",
                            active
                                ? "bg-cyan-300 text-slate-950 shadow-sm"
                                : "text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100",
                        )}
                    >
                        <Icon className="h-4 w-4" />
                    </button>
                );
            })}
        </div>
    );
}
