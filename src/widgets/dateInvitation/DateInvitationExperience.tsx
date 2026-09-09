'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import type { InvitationContent } from '@/shared/lib/invitationContent';
import { submitInvitationResponse } from '@/app/(admin)/projects/actions';
import scss from './dateInvitationExperience.module.scss';

interface DateInvitationExperienceProps {
  projectId: string;
  content: InvitationContent;
}

type Screen = 'question' | 'confirm' | 'date' | 'final';

function fillTemplate(text: string, date: string, time: string): string {
  return text.replace('{date}', date).replace('{time}', time);
}

export default function DateInvitationExperience({ projectId, content }: DateInvitationExperienceProps) {
  const [screen, setScreen] = useState<Screen>('question');
  const [noOffset, setNoOffset] = useState({ x: 0, y: 0 });
  const [date, setDate] = useState(content.fixedDate ?? '');
  const [time, setTime] = useState(content.fixedTime ?? '');
  const [submitting, setSubmitting] = useState(false);

  const dodgeNo = () => {
    setNoOffset({ x: (Math.random() - 0.5) * 160, y: (Math.random() - 0.5) * 60 });
  };

  const confirmDate = async () => {
    if (!date || !time) return;
    setSubmitting(true);
    await submitInvitationResponse(projectId, date, time);
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
              <Heart size={56} className={scss.heartIcon} fill="currentColor" />
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
              disabled={!date || !time || submitting}
              onClick={confirmDate}
            >
              {submitting ? '…' : content.dateButtonLabel}
            </button>
          </>
        )}

        {screen === 'final' && (
          <>
            <Image src="/hug.png" alt="" width={160} height={160} priority />
            <h1>{content.finalTitle}</h1>
            <p>{fillTemplate(content.finalDescription, date, time)}</p>
          </>
        )}
      </div>
    </div>
  );
}
