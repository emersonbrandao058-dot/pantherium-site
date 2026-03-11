"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, loading, signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && user) {
      router.replace("/admin/dashboard");
    }
  }, [user, loading, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await signIn(email, password);
      router.replace("/admin/dashboard");
    } catch {
      setError("Email ou senha inválidos.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#080808" }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 rounded-full border-2 animate-spin"
            style={{
              borderColor: "rgba(0,255,136,0.2)",
              borderTopColor: "#00ff88",
            }}
          />
          <p className="text-white/40 text-sm">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-6"
      style={{
        background:
          "radial-gradient(circle at center, rgba(57,255,20,0.08) 0%, #080808 55%)",
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8"
        style={{
          background: "#0d0d0d",
          border: "1px solid rgba(57,255,20,0.12)",
          boxShadow: "0 0 40px rgba(0,0,0,0.35)",
        }}
      >
        <div className="mb-8 text-center">
          <div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl"
            style={{
              background: "#39ff14",
              color: "#080808",
              fontWeight: 900,
              fontSize: "22px",
            }}
          >
            P
          </div>

          <h1
            style={{
              color: "#f5f5f5",
              fontSize: "32px",
              lineHeight: 1,
              letterSpacing: "2px",
              fontWeight: 800,
            }}
          >
            PANTHE<span style={{ color: "#39ff14" }}>RIUM</span>
          </h1>

          <p
            style={{
              marginTop: "10px",
              color: "rgba(255,255,255,0.45)",
              fontSize: "13px",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            Painel Admin
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="email"
              style={{
                display: "block",
                marginBottom: "8px",
                color: "rgba(255,255,255,0.7)",
                fontSize: "13px",
              }}
            >
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@gmail.com"
              autoComplete="email"
              required
              style={{
                width: "100%",
                height: "48px",
                padding: "0 14px",
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.12)",
                background: "#111111",
                color: "#f0f0f0",
                outline: "none",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              style={{
                display: "block",
                marginBottom: "8px",
                color: "rgba(255,255,255,0.7)",
                fontSize: "13px",
              }}
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              style={{
                width: "100%",
                height: "48px",
                padding: "0 14px",
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.12)",
                background: "#111111",
                color: "#f0f0f0",
                outline: "none",
              }}
            />
          </div>

          {error ? (
            <div
              style={{
                borderRadius: "10px",
                padding: "12px 14px",
                background: "rgba(255,80,80,0.08)",
                border: "1px solid rgba(255,80,80,0.18)",
                color: "#ff8a8a",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            style={{
              marginTop: "8px",
              height: "50px",
              borderRadius: "10px",
              border: "none",
              background: "#39ff14",
              color: "#080808",
              fontWeight: 800,
              letterSpacing: "1px",
              cursor: submitting ? "not-allowed" : "pointer",
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? "Entrando..." : "Entrar no painel"}
          </button>
        </form>
      </div>
    </main>
  );
}