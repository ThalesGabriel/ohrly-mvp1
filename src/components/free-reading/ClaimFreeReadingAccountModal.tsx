"use client";

import { useEffect, useMemo, useState } from "react";
import {
    ArrowRight,
    CheckCircle2,
    Eye,
    EyeOff,
    KeyRound,
    Loader2,
    Lock,
    Mail,
    ShieldCheck,
    Sparkles,
    UserPlus,
    X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type ClaimFreeReadingAccountModalProps = {
    open: boolean;
    sessionToken: string | null;
    defaultEmail?: string | null;
    onClose: () => void;
    onClaimed?: (payload: { organizationId?: string; storeId?: string }) => void;
};

type Mode = "signup" | "signin";
type Step = "form" | "success" | "emailConfirmationRequired";

export function ClaimFreeReadingAccountModal({
    open,
    sessionToken,
    defaultEmail,
    onClose,
    onClaimed,
}: ClaimFreeReadingAccountModalProps) {
    const router = useRouter();
    const [mode, setMode] = useState<Mode>("signup");
    const [step, setStep] = useState<Step>("form");

    const [email, setEmail] = useState(defaultEmail ?? "");
    const [password, setPassword] = useState("");
    const [businessName, setBusinessName] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [claimedPayload, setClaimedPayload] = useState<{
        organizationId?: string;
        storeId?: string;
    } | null>(null);

    const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email]);

    useEffect(() => {
        if (!open) return;

        setMode("signup");
        setStep("form");
        setEmail(defaultEmail ?? "");
        setPassword("");
        setBusinessName("");
        setShowPassword(false);
        setIsSubmitting(false);
        setErrorMessage(null);
        setClaimedPayload(null);
    }, [open, defaultEmail]);

    if (!open) return null;

    async function handleSubmit() {
        if (!sessionToken) {
            setErrorMessage("Sessão da leitura gratuita não encontrada.");
            return;
        }

        if (!normalizedEmail || !normalizedEmail.includes("@")) {
            setErrorMessage("Informe um e-mail válido.");
            return;
        }

        if (!password || password.length < 6) {
            setErrorMessage("Use uma senha com pelo menos 6 caracteres.");
            return;
        }

        try {
            setIsSubmitting(true);
            setErrorMessage(null);

            if (mode === "signup") {
                const { data, error } = await supabase.auth.signUp({
                    email: normalizedEmail,
                    password,
                    options: {
                        data: {
                            source: "free_reading_claim",
                            business_name: businessName || null,
                        },
                    },
                });

                if (error) {
                    if (isUserAlreadyExistsError(error)) {
                        const signedIn = await trySignInExistingUser({
                            email: normalizedEmail,
                            password,
                        });

                        if (!signedIn) {
                            return;
                        }
                    } else {
                        setErrorMessage(error.message);
                        return;
                    }
                } else if (!data.session) {
                    setStep("emailConfirmationRequired");
                    return;
                } else {
                    await supabase.auth.setSession({
                        access_token: data.session.access_token,
                        refresh_token: data.session.refresh_token,
                    });
                }
            } else {
                const signedIn = await trySignInExistingUser({
                    email: normalizedEmail,
                    password,
                });

                if (!signedIn) {
                    return;
                }
            }

            const claimResult = await claimFreeReadingSession(sessionToken);

            setClaimedPayload(claimResult);
            setStep("success");

            onClaimed?.(claimResult);
        } catch (error) {
            console.error("[ClaimFreeReadingAccountModal]", error);

            const message =
                error instanceof Error
                    ? error.message
                    : "Erro inesperado ao salvar sua leitura.";

            setErrorMessage(message);
        } finally {
            setIsSubmitting(false);
        }
    }

    async function trySignInExistingUser({
        email,
        password,
    }: {
        email: string;
        password: string;
    }): Promise<boolean> {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setErrorMessage(
                "Essa conta já existe. Entre com a senha correta ou use a aba “Já tenho conta”.",
            );
            return false;
        }

        if (!data.session) {
            setErrorMessage("Não conseguimos iniciar sua sessão.");
            return false;
        }

        await supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
        });

        return true;
    }

    function isUserAlreadyExistsError(error: { message?: string; code?: string }) {
        const message = error.message?.toLowerCase() ?? "";
        const code = error.code?.toLowerCase() ?? "";

        return (
            code.includes("user_already_exists") ||
            message.includes("user already") ||
            message.includes("already registered") ||
            message.includes("already exists") ||
            message.includes("já existe") ||
            message.includes("já cadastrado")
        );
    }

    async function claimFreeReadingSession(token: string): Promise<{
        organizationId?: string;
        storeId?: string;
    }> {
        const {
            data: { session },
            error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session?.access_token) {
            throw new Error("Não conseguimos recuperar sua sessão autenticada.");
        }

        const response = await fetch("/api/free-readings/claim", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
                sessionToken: token,
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.error ?? "Não foi possível salvar a leitura na sua conta.",
            );
        }

        return {
            organizationId: result.organizationId,
            storeId: result.storeId,
        };
    }

    const isSignup = mode === "signup";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm">
            <div className="w-full max-w-4xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-950/20">
                <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-5 sm:px-6">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                            <UserPlus className="h-6 w-6" />
                        </div>

                        <div>
                            <p className="text-xs font-black uppercase tracking-wide text-violet-700">
                                Salvar leitura
                            </p>

                            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
                                Crie sua conta sem perder esta análise
                            </h2>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                                A leitura gratuita vira parte da sua conta. Você não precisa
                                reenviar a planilha nem recomeçar o processo.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                        aria-label="Fechar"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </header>

                {step === "success" ? (
                    <div className="px-5 py-8 sm:px-6">
                        <div className="mx-auto max-w-xl rounded-[2rem] border border-emerald-200 bg-emerald-50 p-6 text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                                <CheckCircle2 className="h-8 w-8" />
                            </div>

                            <h3 className="mt-5 text-2xl font-black text-emerald-950">
                                Leitura salva na sua conta
                            </h3>

                            <p className="mt-3 text-sm font-semibold leading-6 text-emerald-900/80">
                                A sessão gratuita foi associada ao seu usuário. Agora essa base,
                                a leitura e os sinais detectados fazem parte da sua conta.
                            </p>

                            {claimedPayload?.storeId ? (
                                <div className="mt-4 rounded-2xl bg-white px-4 py-3 text-xs font-bold text-emerald-800">
                                    Store vinculada: {claimedPayload.storeId}
                                </div>
                            ) : null}

                            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                                <a
                                    href="/home?claimed=1"
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-800"
                                >
                                    Ir para minha área
                                    <ArrowRight className="h-4 w-4" />
                                </a>

                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="rounded-2xl border border-emerald-200 bg-white px-5 py-3 text-sm font-black text-emerald-700 transition hover:bg-emerald-50"
                                >
                                    Continuar vendo a leitura
                                </button>
                            </div>
                        </div>
                    </div>
                ) : step === "emailConfirmationRequired" ? (
                    <div className="px-5 py-8 sm:px-6">
                        <div className="mx-auto max-w-xl rounded-[2rem] border border-amber-200 bg-amber-50 p-6 text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                                <Mail className="h-8 w-8" />
                            </div>

                            <h3 className="mt-5 text-2xl font-black text-amber-950">
                                Sua conta foi criada, mas precisa confirmar e-mail
                            </h3>

                            <p className="mt-3 text-sm font-semibold leading-6 text-amber-900/80">
                                O Supabase está exigindo confirmação de e-mail antes de abrir a
                                sessão. Para o fluxo de MVP sem e-mail, desative a confirmação
                                em Authentication → Providers → Email → Confirm email.
                            </p>

                            <button
                                type="button"
                                onClick={onClose}
                                className="mt-6 rounded-2xl bg-amber-700 px-5 py-3 text-sm font-black text-white transition hover:bg-amber-800"
                            >
                                Voltar para a leitura
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr]">
                        <main className="px-5 py-5 sm:px-6">
                            <div className="rounded-3xl border border-violet-200 bg-violet-50 p-5">
                                <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-black uppercase tracking-wide text-violet-700 shadow-sm">
                                    <Sparkles className="h-4 w-4" />
                                    Sua leitura será preservada
                                </div>

                                <h3 className="mt-4 text-xl font-black text-violet-950">
                                    Criar conta aqui é só salvar o que você já gerou
                                </h3>

                                <p className="mt-2 text-sm font-semibold leading-6 text-violet-900/80">
                                    Depois do cadastro, o Ohrly associa esta sessão gratuita à sua
                                    conta real. Isso inclui a base enviada, as leituras do dia e
                                    os sinais das policies.
                                </p>
                            </div>

                            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                <ClaimBenefit
                                    icon={ShieldCheck}
                                    title="Sem recomeçar"
                                    description="A leitura atual continua existindo após criar conta."
                                />

                                <ClaimBenefit
                                    icon={KeyRound}
                                    title="Acesso direto"
                                    description="Você entra com e-mail e senha, sem depender de magic link."
                                />

                                <ClaimBenefit
                                    icon={CheckCircle2}
                                    title="Base associada"
                                    description="Uploads e sinais ficam ligados ao usuário real."
                                />
                            </div>
                        </main>

                        <aside className="border-t border-slate-200 bg-slate-50 px-5 py-5 sm:px-6 lg:border-l lg:border-t-0">
                            <div className="rounded-[2rem] border border-slate-200 bg-white p-5">
                                <div className="grid grid-cols-2 rounded-2xl bg-slate-100 p-1">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMode("signup");
                                            setErrorMessage(null);
                                        }}
                                        disabled={isSubmitting}
                                        className={[
                                            "rounded-xl px-3 py-2 text-sm font-black transition",
                                            mode === "signup"
                                                ? "bg-white text-violet-700 shadow-sm"
                                                : "text-slate-500 hover:text-slate-800",
                                        ].join(" ")}
                                    >
                                        Criar conta
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMode("signin");
                                            setErrorMessage(null);
                                        }}
                                        disabled={isSubmitting}
                                        className={[
                                            "rounded-xl px-3 py-2 text-sm font-black transition",
                                            mode === "signin"
                                                ? "bg-white text-violet-700 shadow-sm"
                                                : "text-slate-500 hover:text-slate-800",
                                        ].join(" ")}
                                    >
                                        Já tenho conta
                                    </button>
                                </div>

                                <p className="mt-5 text-sm font-black text-slate-950">
                                    {isSignup
                                        ? "Crie seu acesso ao Ohrly"
                                        : "Entre para salvar esta leitura"}
                                </p>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    {isSignup
                                        ? "Use e-mail e senha para salvar esta leitura gratuita na sua conta."
                                        : "Entre com sua conta existente para reivindicar esta sessão gratuita."}
                                </p>

                                {isSignup ? (
                                    <label className="mt-4 block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                        <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-400">
                                            <Sparkles className="h-3.5 w-3.5" />
                                            Nome da sua loja
                                        </span>

                                        <input
                                            value={businessName}
                                            onChange={(event) => setBusinessName(event.target.value)}
                                            placeholder="Ex: Recife Motos"
                                            disabled={isSubmitting}
                                            className="mt-2 w-full bg-transparent text-sm font-black text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
                                        />
                                    </label>
                                ) : null}

                                <label className="mt-4 block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-400">
                                        <Mail className="h-3.5 w-3.5" />
                                        E-mail
                                    </span>

                                    <input
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        placeholder="voce@email.com"
                                        disabled={isSubmitting}
                                        className="mt-2 w-full bg-transparent text-sm font-black text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
                                    />
                                </label>

                                <label className="mt-4 block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-400">
                                        <Lock className="h-3.5 w-3.5" />
                                        Senha
                                    </span>

                                    <div className="mt-2 flex items-center gap-2">
                                        <input
                                            value={password}
                                            onChange={(event) => setPassword(event.target.value)}
                                            placeholder="Mínimo 6 caracteres"
                                            type={showPassword ? "text" : "password"}
                                            disabled={isSubmitting}
                                            className="w-full bg-transparent text-sm font-black text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((current) => !current)}
                                            disabled={isSubmitting}
                                            className="text-slate-400 transition hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                                            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </label>

                                {errorMessage ? <ErrorBox message={errorMessage} /> : null}

                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-700 px-5 py-4 text-sm font-black text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Salvando leitura...
                                        </>
                                    ) : (
                                        <>
                                            {isSignup
                                                ? "Criar conta e salvar leitura"
                                                : "Entrar e salvar leitura"}
                                            <ArrowRight className="h-4 w-4" />
                                        </>
                                    )}
                                </button>

                                <p className="mt-3 text-center text-xs font-semibold leading-5 text-slate-400">
                                    A conta serve para guardar esta leitura e acompanhar novas
                                    bases depois.
                                </p>
                            </div>
                        </aside>
                    </div>
                )}
            </div>
        </div>
    );
}

function ClaimBenefit({
    icon: Icon,
    title,
    description,
}: {
    icon: LucideIcon;
    title: string;
    description: string;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                <Icon className="h-5 w-5" />
            </div>

            <p className="mt-3 text-sm font-black text-slate-950">{title}</p>

            <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
        </div>
    );
}

function ErrorBox({ message }: { message: string }) {
    return (
        <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {message}
        </div>
    );
}