import Link from "next/link";

const socialLinks = [
    {
        label: "LinkedIn",
        href: "https://www.linkedin.com/company/ohrly",
        icon: (
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
                <path d="M20.45 20.45h-3.56v-5.58c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.95v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27h-.03ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.56V9h3.56v11.45ZM22.23 0H1.76C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.76 24h20.47c.97 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0Z" />
            </svg>
        ),
    },
    {
        label: "Instagram",
        href: "https://www.instagram.com/ohrlyapp",
        icon: (
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
        ),
    },
    {
        label: "E-mail",
        href: "mailto:taraujo@ohrly.com.br",
        icon: (
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4.5 6.5h15A1.5 1.5 0 0 1 21 8v8a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 16V8a1.5 1.5 0 0 1 1.5-1.5Z" />
                <path d="m4 8 8 5 8-5" />
            </svg>
        ),
    },
];

export function AppFooter() {
    return (
        <footer className="relative overflow-hidden border-t border-violet-100 bg-[#fbf9ff]">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300 to-transparent" />
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 left-10 h-72 w-72 rounded-full bg-fuchsia-100/60 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-10">
                <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
                    <div>
                        <Link href="/pt" className="inline-flex items-center gap-3" aria-label="Ohrly">
                            <span className="text-xl font-semibold tracking-tight text-[#21152f]">Ohrly</span>
                        </Link>

                        <p className="mt-5 max-w-xl text-sm leading-6 text-slate-600">
                            O Ohrly ajuda lojistas a transformar dados simples da operação em uma leitura mais clara sobre
                            pedidos, produtos, clientes, canais e sinais que merecem decisão.
                        </p>



                        <div className="mt-6 flex flex-wrap items-center gap-3">
                            {socialLinks.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    target={item.href.startsWith("http") ? "_blank" : undefined}
                                    rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                                    className="inline-flex h-10 items-center gap-2 rounded-full border border-violet-100 bg-white px-4 text-sm font-medium text-slate-600 shadow-sm shadow-violet-900/5 transition hover:border-violet-200 hover:text-violet-700"
                                >
                                    {item.icon}
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="">
                        <div className="mt-6 inline-flex max-w-xl flex-col gap-3 rounded-[1.5rem] border border-violet-100 bg-white/75 p-4 shadow-sm shadow-violet-900/5 sm:flex-row sm:items-center">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <path d="M12 3 4.5 6v5.5c0 4.72 3.14 7.93 7.5 9.5 4.36-1.57 7.5-4.78 7.5-9.5V6L12 3Z" />
                                    <path d="m8.8 12.1 2.1 2.1 4.4-4.6" />
                                </svg>
                            </div>
                            <p className="text-sm leading-6 text-slate-600">
                                Startup em pré-incubação no ecossistema do Porto Digital, em fase de validação com operações de e-commerce.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex flex-col gap-4 border-t border-violet-100 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                    <p>© {new Date().getFullYear()} Ohrly. Todos os direitos reservados.</p>
                    <div className="flex flex-wrap gap-4">
                        <Link href="/pt/privacy" className="transition hover:text-violet-700">
                            Privacidade
                        </Link>
                        <Link href="/pt/terms" className="transition hover:text-violet-700">
                            Termos
                        </Link>
                        <span>Feito em Recife.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
