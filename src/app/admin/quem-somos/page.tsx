"use client";

import { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { getAbout, saveAbout } from "@/services/siteService";
import { defaultAbout } from "@/lib/defaults";
import type { AboutData } from "@/types";
import { Save, Check } from "lucide-react";

export default function AdminAboutPage() {
  const [data, setData] = useState<AboutData>(defaultAbout);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAbout()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const set = (key: keyof AboutData, value: string) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveAbout(data);
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
        title="Quem Somos"
        description="Edite a seção de apresentação da Pantherium"
        action={
          <button onClick={handleSave} disabled={saving} className="admin-btn-primary">
            {saved ? <><Check size={15} /> Salvo!</> : saving ? <><Spin /> Salvando...</> : <><Save size={15} /> Salvar</>}
          </button>
        }
      />

      <div
        className="max-w-2xl rounded-xl p-6 space-y-5"
        style={{ background: "#111", border: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div>
          <label className="admin-label">Título da seção</label>
          <input
            className="admin-input"
            value={data.title}
            onChange={(e) => set("title", e.target.value)}
          />
        </div>
        <div>
          <label className="admin-label">Parágrafo 1</label>
          <textarea
            className="admin-input resize-none"
            rows={4}
            value={data.text1}
            onChange={(e) => set("text1", e.target.value)}
          />
        </div>
        <div>
          <label className="admin-label">Parágrafo 2</label>
          <textarea
            className="admin-input resize-none"
            rows={4}
            value={data.text2}
            onChange={(e) => set("text2", e.target.value)}
          />
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
