'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  Eye,
  QrCode,
  Send,
  Settings as SettingsIcon,
} from 'lucide-react';
import type { Project } from '@/shared/lib/mockData';
import { demoInvitationContent, type InvitationContent } from '@/shared/lib/invitationContent';
import {
  updateInvitationContent,
  getMyProjectTelegramLink,
  getMyProjectTelegramStatus,
  setProjectStatus,
} from '@/app/(admin)/projects/actions';
import PhoneFrame from '@/shared/ui/phoneFrame/PhoneFrame';
import TextListEditor from '../projectEditor/TextListEditor';
import scss from '../projectEditor/projectEditor.module.scss';

interface InvitationEditorProps {
  project: Project;
  initialContent: Record<string, unknown> | null;
}

export default function InvitationEditor({ project, initialContent }: InvitationEditorProps) {
  const [content, setContent] = useState<InvitationContent>({
    ...demoInvitationContent,
    ...(initialContent ?? {}),
  });
  const [saveState, setSaveState] = useState<'saved' | 'dirty' | 'saving'>('saved');
  const [status, setStatus] = useState(project.status);
  const [telegramStatus, setTelegramStatus] = useState('');
  const [telegramConnected, setTelegramConnected] = useState(Boolean(project.telegramChatId));
  const [previewSrc, setPreviewSrc] = useState(
    () => `/view/${project.slug}?preview=${encodeURIComponent(JSON.stringify(content))}&draft=1`,
  );
  const contentRef = useRef(content);
  const savingRef = useRef(false);
  const pendingRef = useRef(false);

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  const patch = (fields: Partial<InvitationContent>) => {
    setContent((c) => ({ ...c, ...fields }));
    setSaveState('dirty');
  };

  const persist = async () => {
    if (savingRef.current) {
      pendingRef.current = true;
      return;
    }
    savingRef.current = true;
    setSaveState('saving');
    const result = await updateInvitationContent(project.id, contentRef.current);
    savingRef.current = false;
    if (pendingRef.current) {
      pendingRef.current = false;
      persist();
      return;
    }
    setSaveState('error' in result ? 'dirty' : 'saved');
  };

  useEffect(() => {
    if (saveState !== 'dirty') return;
    const timer = window.setTimeout(persist, 1500);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, saveState]);

  // The preview is a real page in its own iframe (not the component inlined
  // here) so its 100vh-based screens size against the iframe's own viewport
  // instead of the admin page's — same reasoning as ProjectEditor's preview.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPreviewSrc(
        `/view/${project.slug}?preview=${encodeURIComponent(JSON.stringify(content))}&draft=1`,
      );
    }, 500);
    return () => window.clearTimeout(timer);
  }, [content, project.slug]);

  // Getting the QR code only makes sense once the site is actually live for
  // whoever scans it, so publish it right away instead of making the owner
  // remember to flip the toggle in Settings first.
  const handleGetQr = () => {
    if (status === 'published') return;
    setStatus('published');
    setProjectStatus(project.id, 'published');
  };

  const connectTelegram = async () => {
    // Open the tab synchronously, in the same tick as the click, so browsers
    // don't treat it as an unsolicited popup — then fill in the URL once the
    // server action resolves. Opening `window.open(url)` only after an
    // `await` loses the user-gesture association and gets silently blocked.
    const win = window.open('', '_blank');
    setTelegramStatus('Открываю Telegram…');
    const result = await getMyProjectTelegramLink(project.id);
    if ('error' in result) {
      setTelegramStatus(result.error);
      win?.close();
      return;
    }
    if (win) {
      win.location.href = result.url;
    } else {
      window.open(result.url, '_blank', 'noopener,noreferrer');
    }
    setTelegramStatus('Нажмите "Start" в Telegram, затем вернитесь сюда.');
  };

  // The actual linking happens inside Telegram, outside this tab, so the
  // only way to notice it finished is to re-check when the owner comes back
  // — window focus is a good proxy for "just switched back from Telegram".
  useEffect(() => {
    if (telegramConnected) return;
    const handleFocus = async () => {
      const result = await getMyProjectTelegramStatus(project.id);
      if (result.connected) {
        setTelegramConnected(true);
        setTelegramStatus('');
      }
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [telegramConnected, project.id]);

  return (
    <div className={scss.editor}>
      <aside className={scss.right} style={{ borderRight: '1px solid var(--color-border)' }}>
        <div className={scss.rightHeader}>
          <div>
            <strong>Экран «Да / Нет»</strong>
            <span>Первый вопрос, который увидит получатель</span>
          </div>
        </div>

        <label className={scss.field}>
          Заголовок
          <textarea
            rows={2}
            value={content.questionTitle}
            onChange={(e) => patch({ questionTitle: e.target.value })}
          />
        </label>
        <div className={scss.field} style={{ display: 'flex', gap: 12 }}>
          <label className={scss.field} style={{ flex: 1 }}>
            Кнопка «Да»
            <input value={content.yesLabel} onChange={(e) => patch({ yesLabel: e.target.value })} />
          </label>
          <label className={scss.field} style={{ flex: 1 }}>
            Кнопка «Нет»
            <input value={content.noLabel} onChange={(e) => patch({ noLabel: e.target.value })} />
          </label>
        </div>

        <div className={scss.storyGroup}>
          <strong style={{ display: 'block', marginBottom: 12 }}>Экран подтверждения</strong>
          <label className={scss.field}>
            Заголовок
            <input
              value={content.confirmTitle}
              onChange={(e) => patch({ confirmTitle: e.target.value })}
            />
          </label>
          <label className={scss.field}>
            Подзаголовок
            <input
              value={content.confirmSubtitle}
              onChange={(e) => patch({ confirmSubtitle: e.target.value })}
            />
          </label>
          <label className={scss.field}>
            Текст кнопки
            <input
              value={content.confirmButtonLabel}
              onChange={(e) => patch({ confirmButtonLabel: e.target.value })}
            />
          </label>
        </div>

        <div className={scss.storyGroup}>
          <strong style={{ display: 'block', marginBottom: 12 }}>Дата и время</strong>
          <label className={scss.field}>
            Кто выбирает дату и время
            <select
              value={content.dateMode}
              onChange={(e) => patch({ dateMode: e.target.value as InvitationContent['dateMode'] })}
            >
              <option value="recipient">Пусть выберет получатель</option>
              <option value="fixed">Укажу сам</option>
            </select>
          </label>
          {content.dateMode === 'fixed' && (
            <div style={{ display: 'flex', gap: 12 }}>
              <label className={scss.field} style={{ flex: 1 }}>
                Дата
                <input
                  type="date"
                  value={content.fixedDate ?? ''}
                  onChange={(e) => patch({ fixedDate: e.target.value })}
                />
              </label>
              <label className={scss.field} style={{ flex: 1 }}>
                Время
                <input
                  type="time"
                  value={content.fixedTime ?? ''}
                  onChange={(e) => patch({ fixedTime: e.target.value })}
                />
              </label>
            </div>
          )}
          <label className={scss.field}>
            Заголовок экрана
            <input
              value={content.dateQuestionTitle}
              onChange={(e) => patch({ dateQuestionTitle: e.target.value })}
            />
          </label>
          <label className={scss.field}>
            Текст кнопки
            <input
              value={content.dateButtonLabel}
              onChange={(e) => patch({ dateButtonLabel: e.target.value })}
            />
          </label>
        </div>

        <div className={scss.storyGroup}>
          <strong style={{ display: 'block', marginBottom: 12 }}>Куда сходим</strong>
          <label className={scss.field}>
            Заголовок экрана
            <input
              value={content.activityQuestionTitle}
              onChange={(e) => patch({ activityQuestionTitle: e.target.value })}
            />
          </label>
          <label className={scss.field}>
            Варианты
            <TextListEditor
              items={content.activityOptions}
              onChange={(items) => patch({ activityOptions: items })}
              addLabel="Добавить вариант"
              removeLabel="Удалить вариант"
            />
          </label>
          <label className={scss.field}>
            Текст кнопки
            <input
              value={content.activityButtonLabel}
              onChange={(e) => patch({ activityButtonLabel: e.target.value })}
            />
          </label>
        </div>

        <div className={scss.storyGroup}>
          <strong style={{ display: 'block', marginBottom: 12 }}>Финальный экран</strong>
          <label className={scss.field}>
            Заголовок
            <input
              value={content.finalTitle}
              onChange={(e) => patch({ finalTitle: e.target.value })}
            />
          </label>
          <label className={scss.field}>
            Описание
            <textarea
              rows={2}
              value={content.finalDescription}
              onChange={(e) => patch({ finalDescription: e.target.value })}
            />
            <p className={scss.hint}>{'{date}, {time} и {activity} подставятся автоматически'}</p>
          </label>
        </div>

        <div className={scss.storyGroup}>
          <strong style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Send size={16} /> Уведомления в Telegram
          </strong>
          <p className={scss.hint} style={{ marginBottom: 12 }}>
            Когда получатель ответит, вы получите сообщение от бота.
          </p>
          {telegramConnected ? (
            <p
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                color: 'var(--color-success)',
              }}
            >
              <CheckCircle2 size={16} />
              Telegram подключён
            </p>
          ) : (
            <>
              <button type="button" className={scss.addBtn} onClick={connectTelegram}>
                Подключить Telegram
              </button>
              {telegramStatus && (
                <p className={scss.hint} style={{ marginTop: 8 }}>
                  {telegramStatus}
                </p>
              )}
            </>
          )}
        </div>
      </aside>

      <div className={scss.center}>
        <div className={scss.centerHeader}>
          <Link href="/projects" className={scss.crumb}>
            <ChevronLeft size={14} />
            Ваши истории любви
          </Link>
          <div className={scss.titleRow}>
            <h1>{project.name}</h1>
          </div>
          <div className={scss.headerActions}>
            <Link href={`/projects/${project.id}/settings`}>
              <SettingsIcon size={14} />
              Настройки
            </Link>
            <button className={scss.saveBtn} onClick={persist} disabled={saveState !== 'dirty'}>
              {saveState === 'saved' && <Check size={14} />}
              {saveState === 'saving'
                ? 'Сохранение…'
                : saveState === 'saved'
                  ? 'Сохранено'
                  : 'Сохранить'}
            </button>
          </div>
          <div className={scss.stage}>
            <PhoneFrame>
              <iframe
                key={project.id}
                src={previewSrc}
                className={scss.previewFrame}
                style={{ pointerEvents: 'none' }}
                title="Live preview"
              />
            </PhoneFrame>
          </div>
        </div>
      </div>

      <Link
        href={`/projects/${project.id}/preview`}
        target="_blank"
        rel="noopener noreferrer"
        className={scss.stickyPreviewBtn}
      >
        <Eye size={14} />
        Просмотр
      </Link>

      <Link href={`/projects/${project.id}/qr`} className={scss.stickyQrBtn} onClick={handleGetQr}>
        <QrCode size={14} />
        Ваш QR-код
      </Link>
    </div>
  );
}
