export type ProjectStatus = 'published' | 'draft';

export interface Project {
  id: string;
  name: string;
  partnerA: string;
  partnerB: string;
  template: string;
  gradient: string;
  status: ProjectStatus;
  scans: number;
  updatedAt: string;
  slug: string | null;
}

export const projects: Project[] = [
  {
    id: 'anniversary-2024',
    name: 'Anniversary 2024',
    partnerA: 'James',
    partnerB: 'Sofia',
    template: 'Starlit Romance',
    gradient: 'linear-gradient(135deg, #1a0a2e, #4a1060, #8b2080)',
    status: 'published',
    scans: 284,
    updatedAt: '2 hours ago',
    slug: 'james-sofia-2024',
  },
  {
    id: 'valentines-surprise',
    name: "Valentine's Surprise",
    partnerA: 'Marco',
    partnerB: 'Lucia',
    template: 'Garden of Love',
    gradient: 'linear-gradient(135deg, #f5ede8, #fad8e4, #e8b8c8)',
    status: 'published',
    scans: 612,
    updatedAt: 'Yesterday',
    slug: 'marco-lucia-forever',
  },
  {
    id: 'wedding-proposal',
    name: 'Wedding Proposal',
    partnerA: 'Alex',
    partnerB: 'Jordan',
    template: 'Golden Hour',
    gradient: 'linear-gradient(135deg, #fdf0f3, #fce4b0, #f0a060)',
    status: 'draft',
    scans: 0,
    updatedAt: '3 days ago',
    slug: null,
  },
  {
    id: 'first-date-anniversary',
    name: 'First Date Anniversary',
    partnerA: 'Yuki',
    partnerB: 'Chen',
    template: 'Cherry Blossom',
    gradient: 'linear-gradient(135deg, #fef0f8, #fad0e8, #e8a0c0)',
    status: 'published',
    scans: 388,
    updatedAt: '5 days ago',
    slug: 'yuki-chen-love',
  },
  {
    id: 'our-story',
    name: 'Our Story',
    partnerA: 'Emma',
    partnerB: 'Noah',
    template: 'Parisian Dream',
    gradient: 'linear-gradient(135deg, #2c2420, #6b4a3c, #c4866a)',
    status: 'published',
    scans: 156,
    updatedAt: '1 week ago',
    slug: 'emma-noah-story',
  },
  {
    id: 'northern-love',
    name: 'Northern Love',
    partnerA: 'Astrid',
    partnerB: 'Bjorn',
    template: 'Northern Lights',
    gradient: 'linear-gradient(135deg, #0a1a2e, #0a4a3c, #20a080)',
    status: 'draft',
    scans: 0,
    updatedAt: '2 weeks ago',
    slug: null,
  },
  {
    id: '10-years-together',
    name: '10 Years Together',
    partnerA: 'David',
    partnerB: 'Maria',
    template: 'Starlit Romance',
    gradient: 'linear-gradient(135deg, #1a0a2e, #4a1060, #8b2080)',
    status: 'published',
    scans: 923,
    updatedAt: '3 weeks ago',
    slug: 'david-maria-10years',
  },
];

export const templates = [
  {
    id: 'starlit-romance',
    name: 'Starlit Romance',
    mood: 'Тёмный и волшебный',
    gradient: 'linear-gradient(135deg, #1a0a2e, #4a1060, #8b2080)',
  },
  {
    id: 'garden-of-love',
    name: 'Garden of Love',
    mood: 'Нежный и цветочный',
    gradient: 'linear-gradient(135deg, #f5ede8, #fad8e4, #e8b8c8)',
  },
  {
    id: 'parisian-dream',
    name: 'Parisian Dream',
    mood: 'Классический и роскошный',
    gradient: 'linear-gradient(135deg, #2c2420, #6b4a3c, #c4866a)',
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    mood: 'Тёплый и золотой',
    gradient: 'linear-gradient(135deg, #fdf0f3, #fce4b0, #f0a060)',
  },
  {
    id: 'northern-lights',
    name: 'Northern Lights',
    mood: 'Магия сияния',
    gradient: 'linear-gradient(135deg, #0a1a2e, #0a4a3c, #20a080)',
  },
  {
    id: 'cherry-blossom',
    name: 'Cherry Blossom',
    mood: 'Утончённый и чистый',
    gradient: 'linear-gradient(135deg, #fef0f8, #fad0e8, #e8a0c0)',
  },
];

export const currentUser = {
  name: 'Sofia Martinez',
  email: 'sofia@example.com',
  plan: 'Premium',
  memberSince: 'Jan 2024',
  projectsCount: 7,
};

export const scansByMonth = [30, 45, 38, 52, 60, 55, 70, 65, 80, 90, 85, 100];

export const recentUsers = [
  { name: 'Sofia Martinez', projects: 7, plan: 'PREMIUM', when: '2 hours ago' },
  { name: 'Marco Ricci', projects: 3, plan: 'PREMIUM', when: 'Yesterday' },
  { name: 'Yuki Tanaka', projects: 1, plan: 'FREE', when: '3 days ago' },
  { name: 'Emma Wilson', projects: 2, plan: 'GIFT', when: '1 week ago' },
  { name: 'David Zhao', projects: 12, plan: 'PREMIUM', when: '1 week ago' },
];

export const recentPayments = [
  { name: 'Sofia M.', plan: 'Annual Premium', amount: 84, status: 'SUCCESS' },
  { name: 'Marco R.', plan: 'Gift Plan', amount: 29, status: 'SUCCESS' },
  { name: 'Yuki T.', plan: 'Monthly Premium', amount: 12, status: 'SUCCESS' },
  { name: 'Emma W.', plan: 'Annual Premium', amount: 84, status: 'REFUNDED' },
  { name: 'David Z.', plan: 'Monthly Premium', amount: 12, status: 'SUCCESS' },
];

export const invoices = [
  { id: 'INV-2024-012', date: 'Dec 14, 2024', description: 'LoveQR Premium — Annual', amount: 84 },
  {
    id: 'INV-2024-009',
    date: 'Sep 14, 2024',
    description: 'LoveQR Gift Frame — Single',
    amount: 29,
  },
  { id: 'INV-2024-006', date: 'Jun 14, 2024', description: 'LoveQR Premium — Upgrade', amount: 52 },
  { id: 'INV-2024-001', date: 'Jan 14, 2024', description: 'LoveQR Premium — Monthly', amount: 12 },
  { id: 'INV-2023-012', date: 'Dec 14, 2023', description: 'LoveQR Premium — Annual', amount: 84 },
];

export function getProject(id: string): Project {
  return projects.find((p) => p.id === id) ?? projects[0];
}

export function getProjectBySlug(slug: string): Project {
  return projects.find((p) => p.slug === slug) ?? projects[0];
}
