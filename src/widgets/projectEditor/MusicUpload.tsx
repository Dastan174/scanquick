'use client';

import { useRef, useState } from 'react';
import { uploadMusic } from '@/app/(admin)/projects/media-actions';
import type { Dictionary } from '@/shared/lib/i18n/dictionaries';
import scss from './musicUpload.module.scss';

interface MusicUploadProps {
  projectId: string;
  musicUrl: string | undefined;
  t: Dictionary['musicUpload'];
  onChange: (url: string | undefined) => void;
}

export default function MusicUpload({ projectId, musicUrl, t, onChange }: MusicUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    setError('');
    const result = await uploadMusic(projectId, file);
    setUploading(false);
    if (result.error || !result.url) {
      setError(result.error ?? t.uploadFailed);
      return;
    }
    onChange(result.url);
  };

  return (
    <div className={scss.wrap}>
      <span className={scss.label}>{t.label}</span>

      {musicUrl ? (
        <>
          <audio controls src={musicUrl} className={scss.player} />
          <div className={scss.controls}>
            <button type="button" className={scss.changeBtn} onClick={() => inputRef.current?.click()}>
              {uploading ? t.uploading : t.changeMusic}
            </button>
            <button type="button" className={scss.removeBtn} onClick={() => onChange(undefined)}>
              {t.remove}
            </button>
          </div>
        </>
      ) : (
        <button type="button" className={scss.uploadBtn} onClick={() => inputRef.current?.click()}>
          <span>🎵</span>
          <span>{uploading ? t.uploading : t.uploadMusic}</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="audio/mpeg,audio/mp4,audio/x-m4a,audio/aac,audio/ogg,audio/wav"
        hidden
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      <span className={scss.hint}>{t.hint}</span>
      {error && <p className={scss.error}>{error}</p>}
    </div>
  );
}
