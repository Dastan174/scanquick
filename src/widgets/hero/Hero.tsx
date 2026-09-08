import { Heart, Play, Share2, Sparkle, Star } from 'lucide-react';
import Button from '@/shared/ui/button/Button';
import scss from './hero.module.scss';
import Image from 'next/image';
import { getT } from '@/shared/lib/i18n/locale';

export default async function Hero() {
  const t = await getT();

  return (
    <section className={scss.container}>
      <div className="container">
        <div className={scss.mainContainer}>
          <div className={scss.textContent}>
            <span className={scss.effect}>
              <Sparkle size={14} />
              {t.hero.eyebrow}
            </span>
            <h1>
              {t.hero.titleLine1} <em>{t.hero.titleEm}</em>
              <br />
              {t.hero.titleLine2Prefix} <span>{t.hero.titleLine2Em}</span>
            </h1>
            <p>{t.hero.description}</p>
            <div className={scss.actions}>
              <Button href="/projects/new">{t.hero.ctaPrimary}</Button>
              <Button variant="ghost" href="/dashboard">
                <Play size={16} />
                {t.hero.ctaSecondary}
              </Button>
            </div>
            <div className={scss.social}>
              <div className={scss.avatars}>
                <span />
                <span />
                <span />
              </div>
              <div>
                <div className={scss.stars}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p>{t.hero.social}</p>
              </div>
            </div>
          </div>
          <div className={scss.phoneWrap}>
            <div className={scss.phone}>
              <div className={scss.screen}>
                <Image src="/hero.png" alt="Love preview" fill sizes="325px" priority />
              </div>
            </div>
            <div className={`${scss.floatCard} ${scss.floatTop}`}>
              <span className={scss.floatLabel}>{t.hero.floatNewScan}</span>
              <p>
                <Heart size={12} />
                {t.hero.floatReading}
              </p>
              <span className={scss.floatTime}>{t.hero.floatTimeAgo}</span>
            </div>
            <div className={`${scss.floatCard} ${scss.floatBottom}`}>
              <span className={scss.floatLabel}>{t.hero.floatLive}</span>
              <p>
                {t.hero.floatCopyLink}
                <Share2 size={12} />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
