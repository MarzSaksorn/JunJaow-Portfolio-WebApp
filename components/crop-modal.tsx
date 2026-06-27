"use client";

import { useCallback, useRef, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { X, Image as ImageIcon } from "@phosphor-icons/react";

interface CropModalProps {
  open: boolean;
  file: File;
  onCrop: (croppedBlob: Blob) => void;
  onClose: () => void;
}

export function CropModal({ open, file, onCrop, onClose }: CropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const loading = useRef(false);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  async function handleApply() {
    if (!croppedAreaPixels || loading.current) return;
    loading.current = true;
    try {
      const image = await createImage(URL.createObjectURL(file));
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        -croppedAreaPixels.width / 2,
        -croppedAreaPixels.height / 2,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
      );
      canvas.toBlob((blob) => {
        if (blob) onCrop(blob);
      }, file.type);
    } finally {
      loading.current = false;
    }
  }

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card crop-modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h3>ครอบตัดรูปภาพ</h3>
          <button className="modal-close" onClick={onClose}><X weight="duotone" /></button>
        </header>

        <div className="crop-container">
          <Cropper
            image={URL.createObjectURL(file)}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={4 / 3}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="crop-controls">
          <label>
            <span>ซูม</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
            />
          </label>
          <label>
            <span>หมุน</span>
            <input
              type="range"
              min={0}
              max={360}
              step={90}
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
            />
          </label>
        </div>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            <ImageIcon weight="duotone" /> ใช้ต้นฉบับ
          </button>
          <button className="btn btn-primary" onClick={handleApply} disabled={loading.current}>
            {loading.current ? "กำลังประมวลผล..." : "ยืนยันการครอบตัด"}
          </button>
        </div>
      </div>
    </div>
  );
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = url;
  });
}
