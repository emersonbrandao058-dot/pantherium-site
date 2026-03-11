"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function PainelLoginPage() {
  const { user, loading, signIn } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
      setError("E-mail ou senha inválidos.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#080808", color: "#fff" }}
      >
        Carregando...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{
        background: "#080808",
        color: "#f0f0f0",
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8"
        style={{
          background: "#111111",
          border: "1px solid rgba(57,255,20,0.12)",
          boxShadow: "0 0 40px rgba(0,0,0,0.35)",
        }}
      >
        <div className="mb-6">
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "12px",
              background: "#39ff14",
              color: "#000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              marginBottom: "18px",
            }}
          >
            P
          </div>

          <h1
            style={{
              fontSize: "40px",
              lineHeight: 1,
              fontWeight: 900,
              letterSpacing: "2px",
              marginBottom: "10px",
            }}
          >
            LOGIN <span style={{ color: "#39ff14" }}>ADMIN</span>
          </h1>

          <p style={{ color: "rgba(240,240,240,0.55)" }}>
            Acesse o painel da Pantherium
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              background: "#0d0d0d",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#fff",
              borderRadius: "12px",
              padding: "14px 16px",
              outline: "none",
            }}
          />

          <input
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              background: "#0d0d0d",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#fff",
              borderRadius: "12px",
              padding: "14px 16px",
              outline: "none",
            }}
          />

          {error && (
            <div style={{ color: "#ff6b6b", fontSize: "14px" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              background: "#39ff14",
              color: "#000",
              border: "none",
              borderRadius: "12px",
              padding: "14px 16px",
              fontWeight: 800,
              cursor: "pointer",
              marginTop: "6px",
            }}
          >
            {submitting ? "Entrando..." : "Entrar no painel"}
          </button>
        </form>
      </div>
    </div>
  );
}