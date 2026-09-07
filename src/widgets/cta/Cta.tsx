import scss from './cta.module.scss';
import Button from '@/shared/ui/button/Button';

export default function Cta() {
  return (
    <section className={scss.container}>
      <div className="container">
        <div className={scss.mainContainer}>
          <h1>
            Start your love story
            <br />
            <em>today</em>
          </h1>
          <p>Free to start. Upgrade when you are ready to go premium.</p>
          <Button href="/projects/new">Create for Free →</Button>
        </div>
      </div>
    </section>
  );
}
