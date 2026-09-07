import Button from '@/shared/ui/button/Button';
import scss from './hero.module.scss';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className={scss.container}>
      <div className="container">
        <div className={scss.mainContainer}>
          <div className={scss.textContent}>
            <span className={scss.effect}>✦ The most romantic gift you can give</span>
            <h1>
              Love, <em>Encoded</em>
              <br />
              in a <span>QR Code</span>
            </h1>
            <p>
              Create a breathtaking interactive website with your love story — photos, letters,
              music, memories — then gift it as a single QR code to scan and cherish forever.
            </p>
            <div className={scss.actions}>
              <Button href="/projects/new">Create Your Love Story →</Button>
              <Button variant="ghost" href="/dashboard">
                ▷ See a Live Example
              </Button>
            </div>
            <div className={scss.social}>
              <div className={scss.avatars}>
                <span />
                <span />
                <span />
              </div>
              <div>
                <div className={scss.stars}>★★★★★</div>
                <p>Loved by 12,000+ couples</p>
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
              <span className={scss.floatLabel}>New scan</span>
              <p>♡ Someone is reading...</p>
              <span className={scss.floatTime}>2 min ago</span>
            </div>
            <div className={`${scss.floatCard} ${scss.floatBottom}`}>
              <span className={scss.floatLabel}>Your QR is live</span>
              <p>Copy link ↗</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
