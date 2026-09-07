'use client';

import { useRef, useState } from 'react';
import { uploadSectionPhoto } from '@/app/(admin)/projects/media-actions';
import { compressImage } from '@/shared/lib/compressImage';
import type { PhotoTransform } from '@/shared/lib/loveStoryContent';
import type { Dictionary } from '@/shared/lib/i18n/dictionaries';
import scss from './photoSlot.module.scss';

interface PhotoSlotProps {
  projectId: string;
  transform: PhotoTransform | undefined;
  aspectRatio: string; // CSS aspect-ratio value, e.g. '9 / 16'
  t: Dictionary['photoSlot'];
  onChange: (transform: PhotoTransform) => void;
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export default function PhotoSlot({ projectId, transform, aspectRatio, t, onChange }: PhotoSlotProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const x = transform?.x ?? 50;
  const y = transform?.y ?? 50;
  const scale = transform?.scale ?? 1;

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    setError('');
    const compressed = await compressImage(file);
    const result = await uploadSectionPhoto(projectId, compressed);
    setUploading(false);
    if (result.error || !result.url) {
      setError(result.error ?? t.uploadFailed);
      return;
    }
    onChange({ url: result.url, x: 50, y: 50, scale: 1 });
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!transform?.url) return;
    dragRef.current = { startX: e.clientX, startY: e.clientY, origX: x, origY: y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current || !containerRef.current || !transform) return;
    const rect = containerRef.current.getBoundingClientRect();
    const dxPct = ((e.clientX - dragRef.current.startX) / rect.width) * 100;
    const dyPct = ((e.clientY - dragRef.current.startY) / rect.height) * 100;
    onChange({
      ...transform,
      x: clamp(dragRef.current.origX - dxPct, 0, 100),
      y: clamp(dragRef.current.origY - dyPct, 0, 100),
    });
  };

  const onPointerUp = () => {
    dragRef.current = null;
  };

  return (
    <div className={scss.wrap}>
      <div
        ref={containerRef}
        className={scss.frame}
        style={{ aspectRatio }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {transform?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={transform.url}
            alt=""
            draggable={false}
            className={scss.img}
            style={{
              objectPosition: `${x}% ${y}%`,
              transform: `scale(${scale})`,
              transformOrigin: `${x}% ${y}%`,
            }}
          />
        ) : (
          <button type="button" className={scss.empty} onClick={() => inputRef.current?.click()}>
            <span>📸</span>
            <span>{uploading ? t.uploading : t.uploadPhoto}</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
        hidden
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {transform?.url && (
        <div className={scss.controls}>
          <button type="button" className={scss.changeBtn} onClick={() => inputRef.current?.click()}>
            {uploading ? t.uploading : t.changePhoto}
          </button>
          <label className={scss.zoomRow}>
            {t.zoom}
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={scale}
              onChange={(e) => onChange({ ...transform, scale: Number(e.target.value) })}
            />
          </label>
          <span className={scss.hint}>{t.dragHint}</span>
        </div>
      )}

      {error && <p className={scss.error}>{error}</p>}
    </div>
  );
}
