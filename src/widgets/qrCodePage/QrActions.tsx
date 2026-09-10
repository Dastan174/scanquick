'use client';

import { useState } from 'react';
import { Check, Download, Link2, Share2 } from 'lucide-react';
import scss from './qrCodePage.module.scss';

interface QrActionsProps {
  targetUrl: string;
  pngDataUrl: string | null;
  svgDataUrl: string | null;
  pngFilename: string;
  svgFilename: string;
  shareTitle: string;
  t: {
    downloadPng: string;
    downloadSvg: string;
    copyLink: string;
    copied: string;
    share: string;
  };
}

async function dataUrlToFile(dataUrl: string, filename: string, mime: string) {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: mime });
}

export default function QrActions({
  targetUrl,
  pngDataUrl,
  svgDataUrl,
  pngFilename,
  svgFilename,
  shareTitle,
  t,
}: QrActionsProps) {
  const [copied, setCopied] = useState(false);

  // On mobile, the OS share sheet's "Save Image" is the only reliable way to
  // land a file straight in Photos — an <a download> there either opens the
  // image in-tab or drops it into Files instead. Desktop browsers don't
  // expose file sharing, so they keep the plain download there.
  const handleDownload = async (dataUrl: string, filename: string, mime: string) => {
    if (typeof navigator !== 'undefined' && navigator.canShare) {
      try {
        const file = await dataUrlToFile(dataUrl, filename, mime);
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: shareTitle });
          return;
        }
      } catch {
        // Share sheet dismissed or unsupported mid-flight — fall through to
        // a normal download instead of leaving the click looking dead.
      }
    }
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    link.click();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (old browser / insecure context) — nothing more we can do.
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ url: targetUrl, title: shareTitle });
      } catch {
        // User cancelled the share sheet — no fallback needed.
      }
      return;
    }
    handleCopy();
  };

  return (
    <>
      <div className={scss.downloads}>
        {pngDataUrl ? (
          <button
            type="button"
            onClick={() => handleDownload(pngDataUrl, pngFilename, 'image/png')}
          >
            <Download size={14} />
            {t.downloadPng}
          </button>
        ) : (
          <button disabled>
            <Download size={14} />
            {t.downloadPng}
          </button>
        )}
        {svgDataUrl ? (
          <button
            type="button"
            onClick={() => handleDownload(svgDataUrl, svgFilename, 'image/svg+xml')}
          >
            <Download size={14} />
            {t.downloadSvg}
          </button>
        ) : (
          <button disabled>
            <Download size={14} />
            {t.downloadSvg}
          </button>
        )}
      </div>
      <div className={scss.downloads}>
        <button type="button" onClick={handleCopy}>
          {copied ? <Check size={14} /> : <Link2 size={14} />}
          {copied ? t.copied : t.copyLink}
        </button>
        <button type="button" onClick={handleShare}>
          <Share2 size={14} />
          {t.share}
        </button>
      </div>
    </>
  );
}
