"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { CropArea } from "@/types";
import { X, Check, ZoomIn, ZoomOut } from "lucide-react";

interface CropModalProps {
  imageSrc: string;
  aspect?: number;
  onConfirm: (croppedBlob: Blob) => void;
  onCancel: () => void;
  title?: string;
}

// Função para criar canvas com a área recortada e retornar Blob
async function getCroppedBlob(
  imageSrc: string,
  cropArea: CropArea
): Promise<Blob> {
  const image = await createImageFromSrc(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Não foi possível obter contexto do canvas");

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = cropArea.width;
  canvas.height = cropArea.height;

  ctx.drawImage(
    image,
    cropArea.x * scaleX,
    cropArea.y * scaleY,
    cropArea.width * scaleX,
    cropArea.height * scaleY,
    0,
    0,
    cropArea.width,
    cropArea.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Falha ao gerar blob do canvas"));
      },
      "image/jpeg",
      0.92
    );
  });
}

function createImageFromSrc(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", (e) => reject(e));
    img.setAttribute("crossOrigin", "anonymous");
    img.src = src;
  });
}

export default function CropModal({
  imageSrc,
  aspect = 1,
  onConfirm,
  onCancel,
  title = "Recortar imagem",
}: CropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);
  const [processing, setProcessing] = useState(false);

  const onCropComplete = useCallback(
    (_croppedArea: unknown, pixels: CropArea) => {
      setCroppedAreaPixels(pixels);
    },
    []
  );

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    setProcessing(true);
    try {
      const blob = await getCroppedBlob(imageSrc, croppedAreaPixels);
      onConfirm(blob);
    } catch (err) {
      console.error("Erro ao recortar imagem:", err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.92)" }}
    >
      <div
        className="w-full max-w-2xl rounded-2xl overflow-hidden"
        style={{
          background: "#111",
          border: "1px solid rgba(0,255,136,0.2)",
          boxShadow: "0 0 60px rgba(0,255,136,0.1)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <h3 className="font-semibold text-white">{title}</h3>
          <button
            onClick={onCancel}
            className="text-white/40 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Área de crop */}
        <div className="relative" style={{ height: "400px" }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            style={{
              containerStyle: { background: "#0a0a0a" },
              cropAreaStyle: {
                border: "2px solid #00ff88",
                boxShadow: "0 0 0 9999px rgba(0,0,0,0.7)",
              },
            }}
          />
        </div>

        {/* Controles de zoom */}
        <div
          className="px-6 py-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
        >
          <div className="flex items-center gap-3 mb-5">
            <ZoomOut size={16} className="text-white/40" />
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1"
              style={{ accentColor: "#00ff88" }}
            />
            <ZoomIn size={16} className="text-white/40" />
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={onCancel} className="admin-btn-secondary">
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={!croppedAreaPixels || processing}
              className="admin-btn-primary"
            >
              {processing ? (
                <>
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Check size={16} />
                  Confirmar Recorte
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
