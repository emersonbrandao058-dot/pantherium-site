"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import AdminHeader from "@/components/admin/AdminHeader";
import { getGallery, addGalleryItem, updateGalleryItem, deleteGalleryItem, uploadImage } from "@/services/siteService";
import type { GalleryItem } from "@/types";
import { Upload, Trash2, Pencil, Check, X } from "lucide-react";

export default function AdminGaleriaPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getGallery()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    try {
      const newItems: GalleryItem[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const path = `gallery/${Date.now()}_${i}_${file.name}`;
        const result = await uploadImage(file, path);
        const order = items.length + newItems.length + 1;
        const item = await addGalleryItem({
          imageUrl: result.url,
          caption: "",
          order,
        });
        newItems.push(item);
      }
      setItems((prev) => [...prev, ...newItems]);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir esta imagem?")) return;
    await deleteGalleryItem(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleSaveCaption = async (id: string) => {
    await updateGalleryItem(id, { caption: editCaption });
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, caption: editCaption } : i))
    );
    setEditingId(null);
  };

  if (loading) return <Loader />;

  return (
    <div>
      <AdminHeader
        title="Galeria"
        description="Gerencie as imagens da galeria"
        action={
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="admin-btn-primary"
          >
            {uploading ? (
              <><Spin /> Enviando...</>
            ) : (
              <><Upload size={15} /> Enviar imagens</>
            )}
          </button>
        }
      />

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFiles}
      />

      {/* Drop hint */}
      {items.length === 0 && !uploading && (
        <div
          className="flex flex-col items-center justify-center py-24 rounded-2xl cursor-pointer hover:border-[#00ff88]/30 transition-all"
          style={{ border: "2px dashed rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.01)" }}
          onClick={() => inputRef.current?.click()}
        >
          <Upload size={32} className="text-white/20 mb-3" />
          <p className="text-white/30 text-sm font-mono">Nenhuma imagem ainda</p>
          <p className="text-white/20 text-xs mt-1">Clique ou arraste imagens aqui</p>
        </div>
      )}

      {/* Grid */}
      {items.length > 0 && (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group rounded-xl overflow-hidden"
              style={{ background: "#111", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <div className="relative h-40">
                <Image
                  src={item.imageUrl}
                  alt={item.caption || "Galeria"}
                  fill
                  style={{ objectFit: "cover" }}
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    onClick={() => { setEditingId(item.id); setEditCaption(item.caption); }}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
                  >
                    <Pencil size={13} className="text-white" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center hover:bg-red-500/40 transition-all"
                  >
                    <Trash2 size={13} className="text-red-400" />
                  </button>
                </div>
              </div>
              <div className="p-3">
                {editingId === item.id ? (
                  <div className="flex gap-2">
                    <input
                      className="admin-input text-xs py-1.5 flex-1"
                      value={editCaption}
                      onChange={(e) => setEditCaption(e.target.value)}
                      placeholder="Legenda..."
                      autoFocus
                    />
                    <button onClick={() => handleSaveCaption(item.id)} className="text-[#00ff88]"><Check size={14} /></button>
                    <button onClick={() => setEditingId(null)} className="text-white/30"><X size={14} /></button>
                  </div>
                ) : (
                  <p className="text-white/35 text-xs truncate">
                    {item.caption || <span className="italic text-white/20">Sem legenda</span>}
                  </p>
                )}
              </div>
            </div>
          ))}
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
