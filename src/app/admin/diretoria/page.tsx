"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import AdminHeader from "@/components/admin/AdminHeader";
import ImageUpload from "@/components/admin/ImageUpload";
import {
  getDirectors,
  addDirector,
  updateDirector,
  deleteDirector,
} from "@/services/siteService";
import type { Director } from "@/types";
import { Plus, Trash2, Save, X, Check, Star } from "lucide-react";

const emptyDirector = (): Omit<Director, "id"> => ({
  name: "",
  role: "",
  bio: "",
  photoUrl: "",
  featured: false,
  order: 0,
});

export default function AdminDiretoriaPage() {
  const [directors, setDirectors] = useState<Director[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Director>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [newData, setNewData] = useState(emptyDirector());
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    getDirectors()
      .then(setDirectors)
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async () => {
    if (!newData.name || !newData.role) return;
    const d = await addDirector({ ...newData, order: directors.length + 1 });
    setDirectors((prev) => [...prev, d]);
    setNewData(emptyDirector());
    setShowAdd(false);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    setSavingId(editingId);
    try {
      await updateDirector(editingId, editData);
      setDirectors((prev) =>
        prev.map((d) => (d.id === editingId ? { ...d, ...editData } : d))
      );
      setEditingId(null);
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este membro?")) return;
    await deleteDirector(id);
    setDirectors((prev) => prev.filter((d) => d.id !== id));
  };

  if (loading) return <Loader />;

  return (
    <div>
      <AdminHeader
        title="Diretoria"
        description="Gerencie os membros da diretoria"
        action={
          <button onClick={() => setShowAdd(true)} className="admin-btn-primary">
            <Plus size={15} /> Adicionar membro
          </button>
        }
      />

      {/* Formulário de adição */}
      {showAdd && (
        <DirectorForm
          data={newData}
          setData={(d) => setNewData(d as Omit<Director, "id">)}
          storagePath="directors/new"
          onSave={handleAdd}
          onCancel={() => { setShowAdd(false); setNewData(emptyDirector()); }}
          saving={false}
          title="Novo membro"
        />
      )}

      {/* Lista */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {directors.map((d) =>
          editingId === d.id ? (
            <DirectorForm
              key={d.id}
              data={editData}
              setData={setEditData}
              storagePath={`directors/${d.id}`}
              onSave={handleSaveEdit}
              onCancel={() => setEditingId(null)}
              saving={savingId === d.id}
              title={`Editar: ${d.name}`}
            />
          ) : (
            <DirectorCard
              key={d.id}
              director={d}
              onEdit={() => { setEditingId(d.id); setEditData({ ...d }); }}
              onDelete={() => handleDelete(d.id)}
            />
          )
        )}
      </div>

      {directors.length === 0 && !showAdd && (
        <div className="text-center py-16 text-white/25">
          <p className="font-mono text-sm">Nenhum membro cadastrado.</p>
        </div>
      )}
    </div>
  );
}

function DirectorCard({
  director,
  onEdit,
  onDelete,
}: {
  director: Director;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "#111",
        border: director.featured
          ? "1px solid rgba(0,255,136,0.2)"
          : "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="relative h-40 bg-[#0a0a0a]">
        {director.photoUrl ? (
          <Image
            src={director.photoUrl}
            alt={director.name}
            fill
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-display"
              style={{
                background: "rgba(0,255,136,0.06)",
                border: "1px solid rgba(0,255,136,0.15)",
                color: "#00ff88",
                fontFamily: "var(--font-display)",
              }}
            >
              {director.name[0]}
            </div>
          </div>
        )}
        {director.featured && (
          <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "#00ff88" }}>
            <Star size={10} fill="black" className="text-black" />
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="font-semibold text-white text-sm">{director.name}</p>
        <p className="text-[#00ff88] text-xs font-mono uppercase tracking-wider mt-0.5">{director.role}</p>
        {director.bio && <p className="text-white/40 text-xs mt-2 line-clamp-2">{director.bio}</p>}
        <div className="flex gap-2 mt-4">
          <button onClick={onEdit} className="flex-1 text-xs py-1.5 rounded border border-white/10 hover:border-white/20 text-white/50 hover:text-white transition-all">
            Editar
          </button>
          <button onClick={onDelete} className="admin-btn-danger py-1.5">
            <Trash2 size={11} />
          </button>
        </div>
      </div>
    </div>
  );
}

function DirectorForm({
  data,
  setData,
  storagePath,
  onSave,
  onCancel,
  saving,
  title,
}: {
  data: Partial<Director> | Omit<Director, "id">;
  setData: (d: Partial<Director>) => void;
  storagePath: string;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  title: string;
}) {
  const set = (key: string, value: unknown) =>
    setData({ ...data, [key]: value } as Partial<Director>);

  return (
    <div
      className="rounded-xl p-5 sm:col-span-2 lg:col-span-3"
      style={{ background: "rgba(0,255,136,0.03)", border: "1px solid rgba(0,255,136,0.15)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white text-sm">{title}</h3>
        <button onClick={onCancel} className="text-white/30 hover:text-white"><X size={16} /></button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="admin-label">Nome *</label>
          <input className="admin-input" value={(data as Director).name || ""} onChange={(e) => set("name", e.target.value)} placeholder="Nome completo" />
        </div>
        <div>
          <label className="admin-label">Cargo *</label>
          <input className="admin-input" value={(data as Director).role || ""} onChange={(e) => set("role", e.target.value)} placeholder="Presidente, Diretor..." />
        </div>
        <div>
          <label className="admin-label">Bio (opcional)</label>
          <textarea className="admin-input resize-none" rows={2} value={(data as Director).bio || ""} onChange={(e) => set("bio", e.target.value)} />
        </div>
        <div>
          <label className="admin-label">Ordem</label>
          <input type="number" className="admin-input" value={(data as Director).order || 0} onChange={(e) => set("order", Number(e.target.value))} />
        </div>
      </div>

      <div className="mb-4">
        <ImageUpload
          currentUrl={(data as Director).photoUrl}
          storagePath={storagePath}
          aspect={3 / 4}
          label="Foto do membro"
          onUploaded={(url) => set("photoUrl", url)}
        />
      </div>

      <label className="flex items-center gap-2 cursor-pointer mb-5">
        <input
          type="checkbox"
          checked={(data as Director).featured || false}
          onChange={(e) => set("featured", e.target.checked)}
          style={{ accentColor: "#00ff88" }}
        />
        <span className="text-sm text-white/60">Membro em destaque</span>
      </label>

      <div className="flex gap-3">
        <button onClick={onSave} disabled={saving} className="admin-btn-primary">
          {saving ? <><Spin /> Salvando...</> : <><Check size={14} /> Salvar</>}
        </button>
        <button onClick={onCancel} className="admin-btn-secondary">Cancelar</button>
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
