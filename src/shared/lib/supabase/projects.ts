import { createClient } from '@/shared/lib/supabase/server';
import { templates, type Project, type ProjectStatus, type ProjectType } from '@/shared/lib/mockData';

interface ProjectRow {
  id: string;
  owner_id: string;
  name: string;
  partner_a: string;
  partner_b: string;
  anniversary_date: string | null;
  template_id: string;
  slug: string | null;
  status: ProjectStatus;
  type: ProjectType;
  telegram_chat_id: string | null;
  telegram_link_token: string;
  content: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  const weeks = Math.round(days / 7);
  if (weeks < 5) return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
  const months = Math.round(days / 30);
  return `${months} month${months === 1 ? '' : 's'} ago`;
}

function toProject(row: ProjectRow): Project {
  const template = templates.find((t) => t.id === row.template_id) ?? templates[0];
  return {
    id: row.id,
    name: row.name,
    partnerA: row.partner_a,
    partnerB: row.partner_b,
    template: template.name,
    gradient: template.gradient,
    status: row.status,
    type: row.type,
    scans: 0,
    updatedAt: formatRelativeTime(row.updated_at),
    slug: row.slug,
    telegramChatId: row.telegram_chat_id,
    telegramLinkToken: row.telegram_link_token,
  };
}

export async function listMyProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('owner_id', user.id)
    .order('updated_at', { ascending: false });

  return (data ?? []).map(toProject);
}

export async function getMyProjectById(id: string): Promise<Project | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .eq('owner_id', user.id)
    .single();

  return data ? toProject(data) : null;
}

interface ProjectWithContent {
  project: Project;
  content: Record<string, unknown>;
}

export async function getPublishedProjectBySlug(slug: string): Promise<ProjectWithContent | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  return data ? { project: toProject(data), content: data.content ?? {} } : null;
}

// Used only by the Editor's own live-preview iframe (see ProjectEditor.tsx),
// which needs to render draft projects too — real visitors never hit this,
// they go through getPublishedProjectBySlug above.
export async function getProjectBySlugAnyStatus(slug: string): Promise<ProjectWithContent | null> {
  const supabase = await createClient();
  const { data } = await supabase.from('projects').select('*').eq('slug', slug).single();

  return data ? { project: toProject(data), content: data.content ?? {} } : null;
}

export async function getMyProjectContent(id: string): Promise<Record<string, unknown> | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('projects')
    .select('content')
    .eq('id', id)
    .eq('owner_id', user.id)
    .single();

  return data?.content ?? null;
}
