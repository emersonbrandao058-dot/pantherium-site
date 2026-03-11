"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, ImageIcon } from "lucide-react";
import CropModal from "./CropModal";
import { uploadImage } from "@/services/siteService";

interface ImageUploadProps {
  currentUrl?: string;
  storagePath: string;
  aspect?: number;
  label?: string;
  onUploaded: (url: string) => void;
  cropTitle?: string;
}

export default function ImageUpload({
  currentUrl,
  storagePath,
  aspect = 1,
  label = "Imagem",
  onUploaded,
  cropTitle,
}: ImageUploadProps) {
  const [rawSrc, setRawSrc] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentUrl);
  const [showCrop, setShowCrop] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Passo 1: usuário seleciona arquivo → abre modal de crop
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Selecione um arquivo de imagem válido.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setRawSrc(objectUrl);
    setShowCrop(true);
    setError(null);

    // Reseta o input para permitir re-selecionar o mesmo arquivo
    e.target.value = "";
  };

  // Passo 2: usuário confirma crop → faz upload
  const handleCropConfirm = async (blob: Blob) => {
    setShowCrop(false);
    setUploading(true);
    setError(null);

    try {
      const timestamp = Date.now();
      const fullPath = `${storagePath}_${timestamp}.jpg`;
      const result = await uploadImage(blob, fullPath);

      setPreviewUrl(result.url);
      onUploaded(result.url);
    } catch (err) {
      console.error("Erro no upload:", err);
      setError("Falha no upload. Verifique a conexão e as permissões do Storage.");
    } finally {
      setUploading(false);
      if (rawSrc) URL.revokeObjectURL(rawSrc);
      setRawSrc(null);
    }
  };

  const handleCropCancel = () => {
    setShowCrop(false);
    if (rawSrc) URL.revokeObjectURL(rawSrc);
    setRawSrc(null);
  };

  const handleRemove = () => {
    setPreviewUrl(undefined);
    onUploaded("");
  };

  return (
    <div>
      <label className="admin-label">{label}</label>

      {/* Preview */}
      {previewUrl ? (
        <div className="relative inline-block">
          <div
            className="relative rounded-xl overflow-hidden"
            style={{
              width: aspect === 1 ? "140px" : "240px",
              height: "140px",
              background: "#0a0a0a",
              border: "1px solid rgba(0,255,136,0.2)",
            }}
          >
            <Image
              src={previewUrl}
              alt={label}
              fill
              style={{ objectFit: "contain" }}
              className="p-2"
            />
          </div>
          <button
            onClick={handleRemove}
            className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-white transition-all"
            style={{ background: "#ff4444", border: "2px solid #111" }}
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <div
          className="flex items-center justify-center rounded-xl cursor-pointer transition-all duration-200 hover:border-[#00ff88]/40"
          style={{
            width: aspect === 1 ? "140px" : "240px",
            height: "140px",
            background: "rgba(255,255,255,0.02)",
            border: "2px dashed rgba(255,255,255,0.08)",
          }}
          onClick={() => inputRef.current?.click()}
        >
          <div className="text-center">
            <ImageIcon size={24} className="mx-auto mb-2 text-white/20" />
            <span className="text-xs text-white/30">Sem imagem</span>
          </div>
        </div>
      )}

      {/* Botão de upload */}
      <div className="mt-3 flex items-center gap-3 flex-wrap">
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="admin-btn-secondary text-sm"
        >
          {uploading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Upload size={14} />
              {previewUrl ? "Trocar imagem" : "Selecionar imagem"}
            </>
          )}
        </button>

        <span className="text-xs text-white/25 font-mono">
          Crop 1:{aspect === 1 ? "1" : String(Math.round((1 / aspect) * 10) / 10)} · JPG/PNG/WebP
        </span>
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
          ⚠ {error}
        </p>
      )}

      {/* Input oculto */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Modal de crop - só abre quando há imagem selecionada */}
      {showCrop && rawSrc && (
        <CropModal
          imageSrc={rawSrc}
          aspect={aspect}
          title={cropTitle || `Recortar — ${label}`}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
}
