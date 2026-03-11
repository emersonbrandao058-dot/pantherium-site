"use client";

import { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import ImageUpload from "@/components/admin/ImageUpload";
import { getIdentity, saveIdentity } from "@/services/siteService";
import { defaultIdentity } from "@/lib/defaults";
import type { IdentityData } from "@/types";
import { Save, Check } from "lucide-react";

export default function AdminIdentidadePage() {
  const [data, setData] = useState<IdentityData>(defaultIdentity);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getIdentity()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const set = (key: keyof IdentityData, value: string) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveIdentity(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <AdminHeader
        title="Identidade"
        description="Gerencie os mascotes e símbolos da Pantherium"
        action={
          <button onClick={handleSave} disabled={saving} className="admin-btn-primary">
            {saved ? <><Check size={15} /> Salvo!</> : saving ? <><Spin /> Salvando...</> : <><Save size={15} /> Salvar</>}
          </button>
        }
      />

      <div className="space-y-6">
        {/* Pantera */}
        <div
          className="rounded-xl p-6"
          style={{ background: "#111", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <h3 className="font-semibold text-[#00ff88] mb-5 flex items-center gap-2">
            🐆 Pantera
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="admin-label">Título</label>
                <input className="admin-input" value={data.pantherTitle} onChange={(e) => set("pantherTitle", e.target.value)} />
              </div>
              <div>
                <label className="admin-label">Texto</label>
                <textarea className="admin-input resize-none" rows={4} value={data.pantherText} onChange={(e) => set("pantherText", e.target.value)} />
              </div>
            </div>
            <ImageUpload
              currentUrl={data.pantherImageUrl}
              storagePath="identity/panther"
              aspect={1}
              label="Imagem da Pantera"
              onUploaded={(url) => set("pantherImageUrl", url)}
            />
          </div>
        </div>

        {/* Cobra */}
        <div
          className="rounded-xl p-6"
          style={{ background: "#111", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <h3 className="font-semibold text-[#00ff88] mb-5 flex items-center gap-2">
            🐍 Cobra
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="admin-label">Título</label>
                <input className="admin-input" value={data.snakeTitle} onChange={(e) => set("snakeTitle", e.target.value)} />
              </div>
              <div>
                <label className="admin-label">Texto</label>
                <textarea className="admin-input resize-none" rows={4} value={data.snakeText} onChange={(e) => set("snakeText", e.target.value)} />
              </div>
            </div>
            <ImageUpload
              currentUrl={data.snakeImageUrl}
              storagePath="identity/snake"
              aspect={1}
              label="Imagem da Cobra"
              onUploaded={(url) => set("snakeImageUrl", url)}
            />
          </div>
        </div>

        {/* Arte central + texto de união */}
        <div
          className="rounded-xl p-6"
          style={{ background: "#111", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <h3 className="font-semibold text-white/60 mb-5">Arte Central & Texto de União</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="admin-label">Texto de união</label>
              <textarea
                className="admin-input resize-none"
                rows={3}
                value={data.unionText}
                onChange={(e) => set("unionText", e.target.value)}
              />
            </div>
            <ImageUpload
              currentUrl={data.centerArtUrl}
              storagePath="identity/center"
              aspect={1}
              label="Arte Central (opcional)"
              onUploaded={(url) => set("centerArtUrl", url)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Loader() {
  return <div className="flex justify-center py-32"><div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: "rgba(0,255,136,0.2)", borderTopColor: "#00ff88" }} /></div>;
}
function Spin() {
  return <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />;
}
