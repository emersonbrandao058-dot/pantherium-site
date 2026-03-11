"use client";

import { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import ImageUpload from "@/components/admin/ImageUpload";
import { getHero, saveHero } from "@/services/siteService";
import { defaultHero } from "@/lib/defaults";
import type { HeroData } from "@/types";
import { Save, Check } from "lucide-react";

export default function AdminHeroPage() {
  const [data, setData] = useState<HeroData>(defaultHero);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHero()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const set = (key: keyof HeroData, value: string) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveHero(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <AdminHeader
        title="Hero"
        description="Edite o banner principal do site"
        action={
          <button
            onClick={handleSave}
            disabled={saving}
            className="admin-btn-primary"
          >
            {saved ? (
              <>
                <Check size={15} />
                Salvo!
              </>
            ) : saving ? (
              <>
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save size={15} />
                Salvar alterações
              </>
            )}
          </button>
        }
      />

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Coluna esquerda — Textos */}
        <div
          className="rounded-xl p-6 space-y-5"
          style={{ background: "#111", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
            Textos
          </h2>

          <div>
            <label className="admin-label">Badge</label>
            <input
              className="admin-input"
              value={data.badge}
              onChange={(e) => set("badge", e.target.value)}
              placeholder="ex: Atlética de Enfermagem · UNEF"
            />
          </div>

          <div>
            <label className="admin-label">Título principal</label>
            <input
              className="admin-input text-lg font-bold tracking-widest"
              value={data.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="PANTHERIUM"
            />
          </div>

          <div>
            <label className="admin-label">Subtítulo (linha neon)</label>
            <input
              className="admin-input"
              value={data.subtitle}
              onChange={(e) => set("subtitle", e.target.value)}
              placeholder="Força · Sabedoria · União"
            />
          </div>

          <div>
            <label className="admin-label">Frase de efeito (tagline)</label>
            <textarea
              className="admin-input resize-none"
              rows={2}
              value={data.tagline}
              onChange={(e) => set("tagline", e.target.value)}
              placeholder="A força da pantera. A sabedoria da cobra..."
            />
          </div>

          <div>
            <label className="admin-label">Texto secundário</label>
            <textarea
              className="admin-input resize-none"
              rows={3}
              value={data.secondaryText}
              onChange={(e) => set("secondaryText", e.target.value)}
              placeholder="Somos mais que uma atlética..."
            />
          </div>
        </div>

        {/* Coluna direita — Logo */}
        <div
          className="rounded-xl p-6"
          style={{ background: "#111", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-6">
            Logo Central
          </h2>

          <ImageUpload
            currentUrl={data.logoUrl}
            storagePath="hero/logo"
            aspect={1}
            label="Logo do Hero (1:1 — moldura circular)"
            cropTitle="Recortar logo — proporção 1:1"
            onUploaded={(url) => set("logoUrl", url)}
          />

          <div
            className="mt-6 p-4 rounded-xl"
            style={{ background: "rgba(0,255,136,0.03)", border: "1px solid rgba(0,255,136,0.08)" }}
          >
            <p className="text-xs text-white/30 font-mono leading-relaxed">
              A logo será exibida dentro de uma moldura circular com brilho neon.
              Use uma imagem com fundo transparente (PNG) para melhor resultado.
              O crop garante proporção 1:1 antes do upload.
            </p>
          </div>

          {/* Preview no contexto */}
          {data.logoUrl && (
            <div className="mt-6">
              <p className="text-xs text-white/30 uppercase tracking-widest font-mono mb-3">
                Preview no hero
              </p>
              <div
                className="relative mx-auto"
                style={{ width: "120px", height: "120px" }}
              >
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    border: "2px solid rgba(0,255,136,0.4)",
                    boxShadow: "0 0 20px rgba(0,255,136,0.2)",
                  }}
                />
                <div
                  className="absolute inset-3 rounded-full overflow-hidden"
                  style={{
                    background: "#0a0a0a",
                    border: "1px solid rgba(0,255,136,0.15)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={data.logoUrl}
                    alt="Preview logo"
                    className="w-full h-full p-2"
                    style={{ objectFit: "contain" }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-32">
      <div
        className="w-8 h-8 rounded-full border-2 animate-spin"
        style={{ borderColor: "rgba(0,255,136,0.2)", borderTopColor: "#00ff88" }}
      />
    </div>
  );
}
