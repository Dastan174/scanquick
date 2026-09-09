'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Heart, Mail, MessageCircle, Send } from 'lucide-react';
import type { Project } from '@/shared/lib/mockData';
import type { LoveStoryContent } from '@/shared/lib/loveStoryContent';
import { sectionKindOf } from '@/shared/lib/sectionLibrary';
import { getCoverTemplate } from '@/shared/lib/coverTemplates';
import TypewriterText from './TypewriterText';
import HoldHeart from './HoldHeart';
import StoriesRow from './StoriesRow';
import PhotoWipeReveal from './PhotoWipeReveal';
import { MailIcon, ChatModal } from './ChatMail';
import QuotesCarousel from './QuotesCarousel';
import BalloonGame from './BalloonGame';
import ClickHearts from './ClickHearts';
import CollageSection from './CollageSection';
import scss from './loveStoryExperience.module.scss';

const FloatingHearts = dynamic(() => import('./FloatingHearts'), { ssr: false });

interface LoveStoryExperienceProps {
  project: Project;
  content: LoveStoryContent;
  // Set for the Editor's live-preview iframe, so every edit is visible
  // immediately instead of needing a tap-to-open on each reload.
  skipCover?: boolean;
}

function PhotoBlock({ transform }: { transform: LoveStoryContent['photos'][string] | undefined }) {
  if (!transform?.url) return <div className={scss.fullBleed} style={{ background: '#e8dfda' }} />;
  return (
    <div className={scss.photoBlock}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={transform.url}
        alt=""
        className={scss.photoBlockImg}
        style={{
          objectPosition: `${transform.x}% ${transform.y}%`,
          transform: `scale(${transform.scale})`,
          transformOrigin: `${transform.x}% ${transform.y}%`,
        }}
      />
    </div>
  );
}

function PhotoDivider({
  transform,
}: {
  transform: LoveStoryContent['photos'][string] | undefined;
}) {
  if (!transform?.url) return <div className={scss.divider} style={{ background: '#e8dfda' }} />;
  return (
    <div className={scss.divider}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={transform.url}
        alt=""
        className={scss.dividerImg}
        style={{
          objectPosition: `${transform.x}% ${transform.y}%`,
          transform: `scale(${transform.scale})`,
          transformOrigin: `${transform.x}% ${transform.y}%`,
        }}
      />
    </div>
  );
}

function VideoMemory() {
  return (
    <div className={scss.wrapper}>
      <h2>Наши воспоминания</h2>
      <div className={scss.videoPlaceholder}>
        <span>▶</span>
        <p>Видео появится здесь после загрузки</p>
      </div>
    </div>
  );
}

export default function LoveStoryExperience({
  project,
  content: initialContent,
  skipCover,
}: LoveStoryExperienceProps) {
  const [content, setContent] = useState(initialContent);
  const [opened, setOpened] = useState(Boolean(skipCover));
  const [closing, setClosing] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const highlightTimer = useRef<number | null>(null);

  // Inside the Editor's preview iframe, edits arrive via postMessage instead
  // of a URL reload, so the iframe never restarts and loses scroll position.
  // The same channel also carries "scroll to this section" requests, fired
  // when the owner selects a section in the editor's sidebar.
  useEffect(() => {
    if (!skipCover) return;
    const handleMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === 'loveqr-preview-update') {
        setContent(e.data.content);
        return;
      }
      if (e.data?.type === 'loveqr-scroll-to-section') {
        const id = e.data.sectionId as string;
        if (id === 'cover') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        const el = document.querySelector(`[data-section-id="${CSS.escape(id)}"]`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setHighlightId(id);
        if (highlightTimer.current) window.clearTimeout(highlightTimer.current);
        highlightTimer.current = window.setTimeout(() => setHighlightId(null), 1400);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [skipCover]);

  // Tapping the cover doesn't swap it out for the content instantly — it
  // slides/fades away first (like scrolling down past it), and only mounts
  // the content once that's done. Content stays unmounted until then so
  // section animations (typewriter, etc.) don't start playing underneath
  // the still-visible cover.
  const handleOpen = () => {
    if (opened || closing) return;
    setClosing(true);
    const audio = audioRef.current;
    if (audio) {
      audio.muted = false;
      audio.play().catch(() => {
        // Autoplay can still be blocked by the browser — that's fine,
        // the visitor can unmute manually once they interact again.
      });
    }
    window.setTimeout(() => {
      setOpened(true);
      setClosing(false);
    }, 550);
  };

  const coverStyle = content.coverPhotoUrl
    ? {
        backgroundImage: `linear-gradient(rgba(28, 20, 18, 0.35), rgba(28, 20, 18, 0.55)), url(${content.coverPhotoUrl})`,
        backgroundSize: `${content.coverPhotoScale * 100}%`,
        backgroundPosition: `${content.coverPhotoX}% ${content.coverPhotoY}%`,
      }
    : { background: content.coverGradient };

  const coverTemplate = getCoverTemplate(content.coverTemplateId);

  const renderSection = (id: string) => {
    switch (sectionKindOf(id)) {
      case 'typewriter':
        return <TypewriterText text={content.typewriterText} />;
      case 'holdHeart':
        return (
          <HoldHeart prompt={content.holdHeartPrompt} revealText={content.holdHeartRevealText} />
        );
      case 'stories':
        return <StoriesRow stories={content.stories} />;
      case 'instagram':
        return (
          <div className={scss.post}>
            <div className={scss.postHeader}>
              <span className={scss.avatar} />
              <span className={scss.username}>{content.instagramPost.username}</span>
            </div>
            {content.instagramPhoto?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={content.instagramPhoto.url}
                alt=""
                className={scss.postImage}
                style={{
                  objectPosition: `${content.instagramPhoto.x}% ${content.instagramPhoto.y}%`,
                  transform: `scale(${content.instagramPhoto.scale})`,
                  transformOrigin: `${content.instagramPhoto.x}% ${content.instagramPhoto.y}%`,
                }}
              />
            ) : (
              <div className={scss.postImage} style={{ background: content.sectionGradients[1] }} />
            )}
            <div className={scss.postContent}>
              <div className={scss.actions}>
                <span>
                  <Heart size={18} fill="currentColor" />
                </span>
                <span>
                  <MessageCircle size={18} />
                </span>
                <span>
                  <Send size={18} />
                </span>
              </div>
              <p className={scss.likes}>
                {content.instagramPost.likes.toLocaleString('en-US')} likes
              </p>
              <p className={scss.caption}>
                <strong>{content.instagramPost.username}</strong> {content.instagramPost.caption}
              </p>
            </div>
          </div>
        );
      case 'photoReveal':
        return (
          <PhotoWipeReveal
            gradient={content.wipeRevealGradient}
            hint={content.photoRevealHint}
            photo={content.photoRevealPhoto}
          />
        );
      case 'chat':
        return (
          <div className={scss.mailWrap}>
            <MailIcon onClick={() => setChatOpen(true)} />
          </div>
        );
      case 'quotes':
        return <QuotesCarousel quotes={content.quotes} />;
      case 'balloons':
        return <BalloonGame messages={content.balloonMessages} />;
      case 'video':
        return <VideoMemory />;
      case 'photo':
        return <PhotoBlock transform={content.photos[id]} />;
      case 'divider':
        return <PhotoDivider transform={content.photos[id]} />;
      case 'collage':
        return <CollageSection instance={content.collages[id]} />;
      default:
        return null;
    }
  };

  return (
    <div className={scss.page}>
      <FloatingHearts />
      {opened && <ClickHearts />}
      <audio ref={audioRef} loop preload="auto" muted src={content.musicUrl || '/music.mp3'} />

      {!opened ? (
        coverTemplate ? (
          <button
            type="button"
            className={`${scss.coverTemplateWrap} ${closing ? scss.coverClosing : ''}`}
            style={{ background: coverTemplate.backdropColor }}
            onClick={handleOpen}
          >
            <div
              className={scss.coverTemplateCard}
              style={{
                aspectRatio: `${coverTemplate.canvasWidth} / ${coverTemplate.canvasHeight}`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverTemplate.background} alt="" className={scss.coverTemplateBg} />
              <div
                className={scss.coverTemplateSlot}
                style={{
                  left: `${coverTemplate.slot.x}%`,
                  top: `${coverTemplate.slot.y}%`,
                  width: `${coverTemplate.slot.width}%`,
                  height: `${coverTemplate.slot.height}%`,
                }}
              >
                {content.coverPhotoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={content.coverPhotoUrl}
                    alt=""
                    className={scss.coverTemplateSlotImg}
                    style={{
                      objectPosition: `${content.coverPhotoX}% ${content.coverPhotoY}%`,
                      transform: `scale(${content.coverPhotoScale})`,
                      transformOrigin: `${content.coverPhotoX}% ${content.coverPhotoY}%`,
                    }}
                  />
                ) : null}
              </div>
            </div>
          </button>
        ) : (
          <button
            className={`${scss.cover} ${closing ? scss.coverClosing : ''}`}
            style={coverStyle}
            onClick={handleOpen}
          >
            <span className={scss.coverIcon}>
              <Heart size={40} fill="currentColor" />
            </span>
            <span className={scss.coverText}>{content.coverPromptText}</span>
          </button>
        )
      ) : (
        <div className={scss.content}>
          {content.sectionOrder.map((id) => (
            <div
              key={id}
              data-section-id={id}
              className={id === highlightId ? scss.sectionHighlight : undefined}
            >
              {renderSection(id)}
            </div>
          ))}

          <div className={scss.replyWrap}>
            <button className={scss.replyBtn} onClick={() => setChatOpen(true)}>
              <Mail size={16} />
              Нажми, чтобы ответить
            </button>
          </div>
        </div>
      )}

      <ChatModal
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        nameA={project.partnerA}
        nameB={project.partnerB}
        lines={content.chatLines}
      />
    </div>
  );
}
