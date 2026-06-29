"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

type AuthMode = "login" | "signup";

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isLogin = mode === "login";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setErrorMessage(null);
    setMessage(null);

    if (!email || !password) {
      setErrorMessage("Preencha e-mail e senha para continuar.");
      setIsSubmitting(false);
      return;
    }

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage("Não foi possível entrar. Verifique e-mail e senha.");
        setIsSubmitting(false);
        return;
      }

      router.push("/");
      router.refresh();
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    setMessage(
      "Conta criada. Verifique seu e-mail para confirmar o acesso antes de entrar."
    );

    setMode("login");
    setIsSubmitting(false);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative hidden overflow-hidden bg-violet-950 px-10 py-10 lg:flex lg:flex-col lg:justify-evenly">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(167,139,250,0.35),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(59,130,246,0.22),transparent_28%),radial-gradient(circle_at_55%_80%,rgba(16,185,129,0.18),transparent_30%)]" />

          <div className="relative z-10 flex items-center gap-3">
            <div>
              <p className="text-2xl font-black tracking-tight">Ohrly</p>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-200">
                leitura operacional
              </p>
            </div>
          </div>

          <div className="relative z-10 max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-violet-100 backdrop-blur">
              <Sparkles className="h-4 w-4" />
              Planilha diária em decisão
            </div>

            <h1 className="text-5xl font-black leading-tight tracking-tight">
              Entenda o que sustentou o resultado da loja.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 text-violet-100">
              O Ohrly transforma vendas, custo, margem, mix de produtos e turnos
              em uma leitura simples para decidir o próximo teste da operação.
            </p>

            <div className="mt-8 grid max-w-xl grid-cols-1 gap-3">
              <FeatureItem text="Veja se o dia foi bom de verdade." />
              <FeatureItem text="Entenda quais produtos puxaram lucro ou só giraram caixa." />
              <FeatureItem text="Descubra onde testar comissão de complementares." />
            </div>
          </div>

        </section>

        <section className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-10 text-slate-950">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <LogoMark dark />

              <div>
                <p className="text-2xl font-black tracking-tight text-slate-950">
                  Ohrly
                </p>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
                  leitura operacional
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-700">
                  Acesso ao painel
                </p>

                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                  {isLogin ? "Entrar no Ohrly" : "Criar conta"}
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {isLogin
                    ? "Acesse a leitura operacional da loja e acompanhe resultado, mix e turnos."
                    : "Crie uma conta para acessar a leitura operacional da loja."}
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setErrorMessage(null);
                    setMessage(null);
                  }}
                  className={[
                    "rounded-xl px-4 py-3 text-sm font-black transition",
                    isLogin
                      ? "bg-white text-violet-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-800",
                  ].join(" ")}
                >
                  Entrar
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setErrorMessage(null);
                    setMessage(null);
                  }}
                  className={[
                    "rounded-xl px-4 py-3 text-sm font-black transition",
                    !isLogin
                      ? "bg-white text-violet-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-800",
                  ].join(" ")}
                >
                  Criar conta
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <label className="block">
                  <span className="text-sm font-black text-slate-700">
                    E-mail
                  </span>

                  <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-violet-300 focus-within:bg-white">
                    <Mail className="h-5 w-5 text-slate-400" />

                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="voce@email.com"
                      className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="text-sm font-black text-slate-700">
                    Senha
                  </span>

                  <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-violet-300 focus-within:bg-white">
                    <LockKeyhole className="h-5 w-5 text-slate-400" />

                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Sua senha"
                      className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="text-slate-400 transition hover:text-slate-700"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </label>

                {errorMessage ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-700">
                    {errorMessage}
                  </div>
                ) : null}

                {message ? (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold leading-6 text-emerald-700">
                    {message}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-700 px-5 py-4 text-sm font-black text-white shadow-sm transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processando
                    </>
                  ) : (
                    <>
                      {isLogin ? "Entrar no painel" : "Criar conta"}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 flex items-start gap-3 rounded-2xl bg-violet-50 p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-violet-700" />

                <p className="text-xs font-semibold leading-5 text-violet-900">
                  O acesso usa Supabase Auth. A chave `service_role` continua
                  apenas nos scripts/backend; no frontend usamos somente a anon
                  key.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function LogoMark({ dark = false }: { dark?: boolean }) {
  return (
    <div
      className={[
        "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm",
        dark ? "bg-violet-700 text-white" : "bg-white/15 text-white",
      ].join(" ")}
    >
      <div className="h-7 w-7 rounded-full border-[6px] border-current border-t-transparent" />
    </div>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold text-violet-50 backdrop-blur">
      <div className="h-2 w-2 rounded-full bg-emerald-300" />
      {text}
    </div>
  );
}