"use client";

import { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { getContact, saveContact } from "@/services/siteService";
import { defaultContact } from "@/lib/defaults";
import type { ContactData } from "@/types";
import { Save, Check, Instagram, Mail } from "lucide-react";

export default function AdminContatoPage() {
  const [data, setData] = useState<ContactData>(defaultContact);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getContact()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const set = (key: keyof ContactData, value: string) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveContact(data);
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
        title="Contato"
        description="Gerencie as informações de contato do site"
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
          <label className="admin-label">
            <span className="flex items-center gap-1.5"><Instagram size={11} /> Instagram</span>
          </label>
          <input
            className="admin-input"
            value={data.instagram}
            onChange={(e) => set("instagram", e.target.value)}
            placeholder="@pantherium"
          />
        </div>

        <div>
          <label className="admin-label">
            <span className="flex items-center gap-1.5"><Mail size={11} /> E-mail</span>
          </label>
          <input
            type="email"
            className="admin-input"
            value={data.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="pantherium@unef.edu.br"
          />
        </div>

        <div>
          <label className="admin-label">Chamada para ação (CTA)</label>
          <input
            className="admin-input"
            value={data.cta}
            onChange={(e) => set("cta", e.target.value)}
            placeholder="Faça parte da nossa história"
          />
        </div>

        <div>
          <label className="admin-label">Texto final</label>
          <textarea
            className="admin-input resize-none"
            rows={3}
            value={data.finalText}
            onChange={(e) => set("finalText", e.target.value)}
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
