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
              Love, Encoded in a <span>QR Code</span>
            </h1>
            <p>
              Create a breathtaking interactive website with your love story — photos, letters,
              music, memories — then gift it as a single QR code to scan and cherish forever.
            </p>
            <div className={scss.actions}>
              <Button>Create Yout Love Story -{'>'}</Button>
              <Button variant="ghost">
                <a target="_blank" href="https://elmir-present-two.vercel.app/">
                  See a Live Example
                </a>
              </Button>
            </div>
          </div>
          <div className={scss.phone}>
            <div className={scss.screen}>
              <img src="/hero.png" alt="Love preview" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
