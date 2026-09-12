'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { InvitationContent } from '@/shared/lib/invitationContent';
import { submitInvitationResponse } from '@/app/(admin)/projects/actions';
import scss from './dateInvitationExperience.module.scss';

type Screen = 'question' | 'confirm' | 'date' | 'activity' | 'final';

interface DateInvitationExperienceProps {
  projectId: string;
  content: InvitationContent;
  // Pins the preview to a specific screen instead of always starting at the
  // question — the editor/wizard preview is click-through-proof (see
  // InvitationEditor.tsx), so without this it could never show anything
  // past the first screen. Real visitors never pass this.
  previewScreen?: string;
}

const SCREENS: Screen[] = ['question', 'confirm', 'date', 'activity', 'final'];

function fillTemplate(text: string, date: string, time: string, activity: string): string {
  return text.replace('{date}', date).replace('{time}', time).replace('{activity}', activity);
}

export default function DateInvitationExperience({
  projectId,
  content,
  previewScreen,
}: DateInvitationExperienceProps) {
  const initialScreen = SCREENS.includes(previewScreen as Screen)
    ? (previewScreen as Screen)
    : 'question';
  const [screen, setScreen] = useState<Screen>(initialScreen);
  const [noOffset, setNoOffset] = useState({ x: 0, y: 0 });
  // Previewing the final screen directly (no real answers to fill it with)
  // — show a sample so it doesn't render with blank date/time/activity.
  const [activity, setActivity] = useState(
    initialScreen === 'final' ? (content.activityOptions[0] ?? '') : '',
  );
  const [date, setDate] = useState(
    content.fixedDate ?? (initialScreen === 'final' ? '2026-09-20' : ''),
  );
  const [time, setTime] = useState(content.fixedTime ?? (initialScreen === 'final' ? '18:00' : ''));
  const [submitting, setSubmitting] = useState(false);

  const dodgeNo = () => {
    setNoOffset({ x: (Math.random() - 0.5) * 160, y: (Math.random() - 0.5) * 60 });
  };

  const confirmDate = async () => {
    if (!date || !time) return;
    setSubmitting(true);
    await submitInvitationResponse(projectId, date, time, activity);
    setSubmitting(false);
    setScreen('final');
  };

  return (
    <div className={scss.page} style={{ background: content.coverGradient }}>
      <div className={scss.screen}>
        {screen === 'question' && (
          <>
            {content.questionImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={content.questionImageUrl} alt="" className={scss.image} />
            ) : (
              <Image src="/invite.webp" alt="" width={140} height={140} priority />
            )}
            <h1>{content.questionTitle}</h1>
            <div className={scss.actions}>
              <button className={scss.yesBtn} onClick={() => setScreen('confirm')}>
                {content.yesLabel}
              </button>
              <button
                className={scss.noBtn}
                style={{ transform: `translate(${noOffset.x}px, ${noOffset.y}px)` }}
                onPointerEnter={dodgeNo}
                onClick={dodgeNo}
              >
                {content.noLabel}
              </button>
            </div>
          </>
        )}

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
                  className={`${scss.optionBtn} ${activity === option ? scss.optionActive : ''}`}
                  onClick={() => setActivity(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            <button
              className={scss.yesBtn}
              disabled={!activity || submitting}
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
            <p>{fillTemplate(content.finalDescription, date, time, activity)}</p>
          </>
        )}
      </div>
    </div>
  );
}
