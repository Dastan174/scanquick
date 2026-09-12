'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { THEME_COLORS, type InvitationContent } from '@/shared/lib/invitationContent';
import { submitInvitationResponse } from '@/app/(admin)/projects/actions';
import scss from './dateInvitationExperience.module.scss';

type Screen = 'lock' | 'question' | 'confirm' | 'date' | 'activity' | 'final';

interface DateInvitationExperienceProps {
  projectId: string;
  content: InvitationContent;
  // Pins the preview to a specific screen instead of always starting at the
  // question — the editor/wizard preview is click-through-proof (see
  // InvitationEditor.tsx), so without this it could never show anything
  // past the first screen. Real visitors never pass this.
  previewScreen?: string;
}

const SCREENS: Screen[] = ['lock', 'question', 'confirm', 'date', 'activity', 'final'];
const SCRATCH_CLEAR_THRESHOLD = 0.55;
// A small fan of particles flying outward from the button reads as an actual
// "explosion" — a single static emoji next to a shaking button just looked
// like the button shaking.
const BURST_PARTICLES: { emoji: string; tx: number; ty: number }[] = [
  { emoji: '💥', tx: -46, ty: -30 },
  { emoji: '💋', tx: -16, ty: -50 },
  { emoji: '💖', tx: 16, ty: -50 },
  { emoji: '✨', tx: 46, ty: -30 },
];

function fillTemplate(text: string, date: string, time: string, activity: string): string {
  return text.replace('{date}', date).replace('{time}', time).replace('{activity}', activity);
}

function isScheduledLocked(content: InvitationContent): boolean {
  if (content.openMode !== 'scheduled' || !content.openAt) return false;
  return Date.now() < new Date(content.openAt).getTime();
}

// Real visitors (no previewScreen) skip straight to 'question' unless the
// content actually needs a reveal moment first — including 'scheduled' once
// its target time has already passed, so an old link doesn't show a pointless
// lock.
function getInitialLiveScreen(content: InvitationContent): Screen {
  if (content.openMode === 'direct') return 'question';
  if (content.openMode === 'scheduled' && !isScheduledLocked(content)) return 'question';
  return 'lock';
}

// A real scratch-card: paints over its parent, gets wiped away by dragging
// (pointer or touch) via destination-out compositing, and hands control back
// once enough of it has been cleared.
function ScratchOverlay({ onCleared }: { onCleared: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scratchingRef = useRef(false);
  const clearedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const { width, height } = parent.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#e08094';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = '600 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Потри пальцем, чтобы открыть ✨', width / 2, height / 2);

    const checkCleared = () => {
      if (clearedRef.current) return;
      const { data } = ctx.getImageData(0, 0, width, height);
      let transparent = 0;
      const step = 40; // sample every 10th pixel (4 channels) for speed
      let sampled = 0;
      for (let i = 3; i < data.length; i += step) {
        sampled++;
        if (data[i] < 40) transparent++;
      }
      if (sampled > 0 && transparent / sampled > SCRATCH_CLEAR_THRESHOLD) {
        clearedRef.current = true;
        onCleared();
      }
    };

    const scratchAt = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(clientX - rect.left, clientY - rect.top, 26, 0, Math.PI * 2);
      ctx.fill();
    };

    const handleDown = (e: PointerEvent) => {
      scratchingRef.current = true;
      canvas.setPointerCapture(e.pointerId);
      scratchAt(e.clientX, e.clientY);
    };
    const handleMove = (e: PointerEvent) => {
      if (!scratchingRef.current) return;
      scratchAt(e.clientX, e.clientY);
      checkCleared();
    };
    const handleUp = () => {
      scratchingRef.current = false;
      checkCleared();
    };

    canvas.addEventListener('pointerdown', handleDown);
    canvas.addEventListener('pointermove', handleMove);
    canvas.addEventListener('pointerup', handleUp);
    return () => {
      canvas.removeEventListener('pointerdown', handleDown);
      canvas.removeEventListener('pointermove', handleMove);
      canvas.removeEventListener('pointerup', handleUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={canvasRef} className={scss.scratchCanvas} />;
}

export default function DateInvitationExperience({
  projectId,
  content,
  previewScreen,
}: DateInvitationExperienceProps) {
  const initialScreen: Screen = SCREENS.includes(previewScreen as Screen)
    ? (previewScreen as Screen)
    : getInitialLiveScreen(content);
  const [screen, setScreen] = useState<Screen>(initialScreen);
  const [noOffset, setNoOffset] = useState({ x: 0, y: 0 });
  const [noScale, setNoScale] = useState(1);
  const [kissVisible, setKissVisible] = useState(false);
  const [yesAnimating, setYesAnimating] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [codeError, setCodeError] = useState(false);
  const [envelopeOpening, setEnvelopeOpening] = useState(false);
  // Previewing the final screen directly (no real answers to fill it with)
  // — show a sample so it doesn't render with blank date/time/activity.
  const [activity, setActivity] = useState<string[]>(
    initialScreen === 'final'
      ? content.activityOptions[0]
        ? [content.activityOptions[0]]
        : []
      : [],
  );
  const [date, setDate] = useState(
    content.fixedDate ?? (initialScreen === 'final' ? '2026-09-20' : ''),
  );
  const [time, setTime] = useState(content.fixedTime ?? (initialScreen === 'final' ? '18:00' : ''));
  const [submitting, setSubmitting] = useState(false);

  // 'scheduled' locks re-check themselves every second so an already-open tab
  // reveals itself right at the target moment, without needing a refresh.
  useEffect(() => {
    if (screen !== 'lock' || content.openMode !== 'scheduled' || !content.openAt) return;
    const id = window.setInterval(() => {
      if (!isScheduledLocked(content)) setScreen('question');
    }, 1000);
    return () => window.clearInterval(id);
  }, [screen, content]);

  const [primary, primaryLight] = THEME_COLORS[content.themeColor] ?? THEME_COLORS.pink;
  const themeStyle = {
    background: content.coverGradient,
    '--invite-primary': primary,
    '--invite-primary-light': primaryLight,
  } as React.CSSProperties;

  const dodgeNo = () => {
    setNoOffset({ x: (Math.random() - 0.5) * 160, y: (Math.random() - 0.5) * 60 });
  };

  // Hover only drives 'dodge' (the button has to run before the cursor can
  // land a click) — kiss/shrink are reactions to an actual tap, so triggering
  // them on hover too made them fire (and, for kiss, finish fading) before the
  // click itself, which read as the button vanishing for no reason.
  const handleNoHover = () => {
    if (content.noAnimation === 'dodge') dodgeNo();
  };

  const handleNoClick = () => {
    if (content.noAnimation === 'dodge') dodgeNo();
    else if (content.noAnimation === 'kiss') {
      setKissVisible(true);
      window.setTimeout(() => setKissVisible(false), 700);
    } else if (content.noAnimation === 'shrink') {
      setNoScale((s) => Math.max(0.35, s - 0.15));
    }
  };

  const handleYesClick = () => {
    if (content.yesAnimation === 'shake') {
      setYesAnimating(true);
      window.setTimeout(() => setScreen('confirm'), 650);
    } else {
      setScreen('confirm');
    }
  };

  const toggleActivity = (option: string) => {
    setActivity((cur) => {
      if (!content.activityMultiSelect) return [option];
      return cur.includes(option) ? cur.filter((o) => o !== option) : [...cur, option];
    });
  };

  const confirmDate = async () => {
    if (!date || !time || activity.length === 0) return;
    setSubmitting(true);
    await submitInvitationResponse(projectId, date, time, activity.join(', '));
    setSubmitting(false);
    setScreen('final');
  };

  const checkCode = () => {
    if (codeInput.trim() === (content.openCode ?? '').trim() && codeInput.trim() !== '') {
      setScreen('question');
      return;
    }
    setCodeError(true);
    window.setTimeout(() => setCodeError(false), 500);
  };

  const questionContent = (
    <>
      {content.questionImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={content.questionImageUrl} alt="" className={scss.image} />
      ) : (
        <Image src="/invite.webp" alt="" width={140} height={140} priority />
      )}
      <h1>{content.questionTitle}</h1>
      <div className={scss.actions}>
        <button
          className={`${scss.yesBtn} ${yesAnimating ? scss.yesShake : ''}`}
          onClick={handleYesClick}
        >
          {content.yesLabel}
          {yesAnimating && (
            <span className={scss.burstWrap}>
              {BURST_PARTICLES.map((particle, i) => (
                <span
                  key={i}
                  className={scss.burst}
                  style={
                    {
                      '--tx': `${particle.tx}px`,
                      '--ty': `${particle.ty}px`,
                    } as React.CSSProperties
                  }
                >
                  {particle.emoji}
                </span>
              ))}
            </span>
          )}
        </button>
        <div className={scss.noWrap}>
          <button
            className={scss.noBtn}
            style={{
              transform: `translate(${noOffset.x}px, ${noOffset.y}px) scale(${noScale})`,
            }}
            onPointerEnter={handleNoHover}
            onClick={handleNoClick}
          >
            {content.noLabel}
          </button>
          {kissVisible && <span className={scss.kiss}>💋</span>}
        </div>
      </div>
    </>
  );

  return (
    <div className={scss.page} style={themeStyle}>
      <div className={`${scss.screen} ${content.cardShape === 'wavy' ? scss.screenWavy : ''}`}>
        {screen === 'lock' && content.openMode === 'code' && (
          <>
            <h1>{content.openLockedTitle}</h1>
            <input
              className={`${scss.codeInput} ${codeError ? scss.codeInputError : ''}`}
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              inputMode="numeric"
              placeholder="••••"
              maxLength={8}
            />
            <button className={scss.yesBtn} onClick={checkCode}>
              Открыть
            </button>
          </>
        )}

        {screen === 'lock' && content.openMode === 'scheduled' && (
          <>
            <h1>{content.openLockedTitle}</h1>
            {content.openAt && (
              <p className={scss.fixedDate}>
                {new Date(content.openAt).toLocaleString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            )}
          </>
        )}

        {screen === 'lock' && content.openMode === 'envelope' && (
          <>
            <button
              type="button"
              className={`${scss.envelope} ${envelopeOpening ? scss.envelopeOpen : ''}`}
              onClick={() => {
                setEnvelopeOpening(true);
                window.setTimeout(() => setScreen('question'), 650);
              }}
              aria-label="Открыть конверт"
            >
              <span className={scss.envelopeFlap} />
              <span className={scss.envelopeHeart}>💌</span>
            </button>
            <h1>Тебе письмо</h1>
          </>
        )}

        {screen === 'lock' && content.openMode === 'scratch' && (
          <div className={scss.scratchWrap}>
            {questionContent}
            <ScratchOverlay onCleared={() => setScreen('question')} />
          </div>
        )}

        {screen === 'question' && questionContent}

        {screen === 'confirm' && (
          <>
            <Image src="/excited.webp" alt="" width={140} height={140} />
            <h1>{content.confirmTitle}</h1>
            <p>{content.confirmSubtitle}</p>
            <button className={scss.yesBtn} onClick={() => setScreen('date')}>
              {content.confirmButtonLabel}
            </button>
          </>
        )}

        {screen === 'date' && (
          <>
            <h1>{content.dateQuestionTitle}</h1>
            {content.dateMode === 'fixed' ? (
              <p className={scss.fixedDate}>
                {content.fixedDate} · {content.fixedTime}
              </p>
            ) : (
              <div className={scss.dateFields}>
                <label>
                  Дата
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </label>
                <label>
                  Время
                  <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                </label>
              </div>
            )}
            <button
              className={scss.yesBtn}
              disabled={!date || !time}
              onClick={() => setScreen('activity')}
            >
              {content.dateButtonLabel}
            </button>
          </>
        )}

        {screen === 'activity' && (
          <>
            <h1>{content.activityQuestionTitle}</h1>
            <div className={scss.optionsGrid}>
              {content.activityOptions.map((option) => (
                <button
                  key={option}
                  className={`${scss.optionBtn} ${activity.includes(option) ? scss.optionActive : ''}`}
                  onClick={() => toggleActivity(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            <button
              className={scss.yesBtn}
              disabled={activity.length === 0 || submitting}
              onClick={confirmDate}
            >
              {submitting ? '…' : content.activityButtonLabel}
            </button>
          </>
        )}

        {screen === 'final' && (
          <>
            <Image src="/hug.webp" alt="" width={160} height={160} priority />
            <h1>{content.finalTitle}</h1>
            <p>{fillTemplate(content.finalDescription, date, time, activity.join(', '))}</p>
          </>
        )}
      </div>
    </div>
  );
}
