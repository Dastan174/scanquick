import Link from 'next/link';
import LoveStoryExperience from '@/widgets/loveStoryExperience/LoveStoryExperience';
import { demoLoveStoryContent } from '@/shared/lib/loveStoryContent';
import type { Project } from '@/shared/lib/mockData';
import scss from './example.module.scss';

// A public, no-login demo of the real visitor experience — "Посмотреть
// пример" on the landing page used to link to /dashboard, which just bounced
// anonymous visitors to the login screen instead of showing them anything.
const exampleProject: Project = {
  id: 'example',
  name: 'Пример истории любви',
  partnerA: 'Alex',
  partnerB: 'Jordan',
  template: 'demo',
  gradient: 'linear-gradient(135deg, #fdf0f3, #fce4b0, #f0a060)',
  status: 'published',
  type: 'love_story',
  scans: 0,
  updatedAt: '',
  slug: null,
  telegramChatId: null,
  telegramLinkToken: '',
};

export default function ExamplePage() {
  return (
    <>
      <LoveStoryExperience project={exampleProject} content={demoLoveStoryContent} />
      <div className={scss.banner}>
        <span>Это пример — создайте свою историю бесплатно</span>
        <Link href="/signup">Начать бесплатно →</Link>
      </div>
      <Link href="/" className={scss.back}>
        ← scanquick.kg
      </Link>
    </>
  );
}
