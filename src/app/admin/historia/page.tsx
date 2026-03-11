"use client";

import { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  getTimeline,
  addTimelineItem,
  updateTimelineItem,
  deleteTimelineItem,
} from "@/services/siteService";
import type { TimelineItem } from "@/types";
import { Plus, Trash2, Save, X, Check, GripVertical } from "lucide-react";

export default function AdminHistoriaPage() {
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<TimelineItem>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ year: "", title: "", description: "" });
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    getTimeline()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = (item: TimelineItem) => {
    setEditingId(item.id);
    setEditData({ ...item });
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    setSavingId(editingId);
    try {
      await updateTimelineItem(editingId, editData);
      setItems((prev) =>
        prev.map((i) => (i.id === editingId ? { ...i, ...editData } : i))
      );
      setEditingId(null);
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este item da timeline?")) return;
    await deleteTimelineItem(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleAdd = async () => {
    if (!newItem.year || !newItem.title) return;
    const order = items.length + 1;
    const added = await addTimelineItem({
      ...newItem,
      order,
    });
    setItems((prev) => [...prev, added]);
    setNewItem({ year: "", title: "", description: "" });
    setShowAdd(false);
  };

  if (loading) return <Loader />;

  return (
    <div>
      <AdminHeader
        title="História"
        description="Gerencie a timeline da trajetória da Pantherium"
        action={
          <button
            onClick={() => setShowAdd(true)}
            className="admin-btn-primary"
          >
            <Plus size={15} />
            Adicionar item
          </button>
        }
      />

      {/* Modal de adição */}
      {showAdd && (
        <div
          className="rounded-xl p-6 mb-6"
          style={{
            background: "rgba(0,255,136,0.03)",
            border: "1px solid rgba(0,255,136,0.2)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Novo item</h3>
            <button onClick={() => setShowAdd(false)} className="text-white/30 hover:text-white">
              <X size={16} />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="admin-label">Ano / Período</label>
              <input
                className="admin-input"
                value={newItem.year}
                onChange={(e) => setNewItem((p) => ({ ...p, year: e.target.value }))}
                placeholder="2024"
              />
            </div>
            <div>
              <label className="admin-label">Título</label>
              <input
                className="admin-input"
                value={newItem.title}
                onChange={(e) => setNewItem((p) => ({ ...p, title: e.target.value }))}
                placeholder="Título do evento"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="admin-label">Descrição</label>
            <textarea
              className="admin-input resize-none"
              rows={3}
              value={newItem.description}
              onChange={(e) => setNewItem((p) => ({ ...p, description: e.target.value }))}
              placeholder="Descreva o evento..."
            />
          </div>
          <div className="flex gap-3">
            <button onClick={handleAdd} className="admin-btn-primary">
              <Check size={14} /> Adicionar
            </button>
            <button onClick={() => setShowAdd(false)} className="admin-btn-secondary">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista */}
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-xl overflow-hidden"
            style={{ background: "#111", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            {editingId === item.id ? (
              /* Modo edição */
              <div className="p-5 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="admin-label">Ano / Período</label>
                    <input
                      className="admin-input"
                      value={editData.year || ""}
                      onChange={(e) => setEditData((p) => ({ ...p, year: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="admin-label">Título</label>
                    <input
                      className="admin-input"
                      value={editData.title || ""}
                      onChange={(e) => setEditData((p) => ({ ...p, title: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <label className="admin-label">Descrição</label>
                  <textarea
                    className="admin-input resize-none"
                    rows={3}
                    value={editData.description || ""}
                    onChange={(e) => setEditData((p) => ({ ...p, description: e.target.value }))}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleSaveEdit}
                    disabled={savingId === item.id}
                    className="admin-btn-primary"
                  >
                    {savingId === item.id ? (
                      <><Spin /> Salvando...</>
                    ) : (
                      <><Save size={14} /> Salvar</>
                    )}
                  </button>
                  <button onClick={() => setEditingId(null)} className="admin-btn-secondary">
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              /* Modo visualização */
              <div className="flex items-start gap-4 p-5">
                <GripVertical size={16} className="mt-1 text-white/15 flex-shrink-0" />
                <div
                  className="flex-shrink-0 w-14 text-center"
                >
                  <span
                    className="text-xs font-mono font-bold"
                    style={{ color: "#00ff88" }}
                  >
                    {item.year}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm">{item.title}</p>
                  <p className="text-white/40 text-sm mt-0.5 line-clamp-2">
                    {item.description}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-xs px-3 py-1.5 rounded text-white/50 hover:text-white border border-white/10 hover:border-white/20 transition-all"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="admin-btn-danger"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-16 text-white/25">
          <p className="font-mono text-sm">Nenhum item na timeline.</p>
          <p className="text-xs mt-1">Clique em &quot;Adicionar item&quot; para começar.</p>
        </div>
      )}
    </div>
  );
}

function Loader() {
  return <div className="flex justify-center py-32"><div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: "rgba(0,255,136,0.2)", borderTopColor: "#00ff88" }} /></div>;
}
function Spin() {
  return <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />;
}
