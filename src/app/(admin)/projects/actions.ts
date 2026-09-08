'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/shared/lib/supabase/server';
import type { LoveStoryContent } from '@/shared/lib/loveStoryContent';
import type { InvitationContent } from '@/shared/lib/invitationContent';
import type { ProjectType } from '@/shared/lib/mockData';
import { sendTelegramMessage } from '@/shared/lib/telegram';

const DIACRITICS_RE = /[̀-ͯ]/g;

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(DIACRITICS_RE, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-+|-+$)/g, '');
}

function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 8);
}

export interface CreateProjectInput {
  name: string;
  partnerA: string;
  partnerB: string;
  anniversaryDate: string;
  templateId: string;
  type?: ProjectType;
}

export async function createProject(
  input: CreateProjectInput,
): Promise<{ id: string; error?: undefined } | { id?: undefined; error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not signed in.' };

  const base = slugify(`${input.partnerA}-${input.partnerB}`) || 'love-story';
  const slug = `${base}-${randomSuffix()}`;

  const { data, error } = await supabase
    .from('projects')
    .insert({
      owner_id: user.id,
      name: input.name,
      partner_a: input.partnerA,
      partner_b: input.partnerB,
      anniversary_date: input.anniversaryDate || null,
      template_id: input.templateId,
      type: input.type ?? 'love_story',
      slug,
      status: 'draft',
      content: {},
    })
    .select('id')
    .single();

  if (error || !data) return { error: error?.message ?? 'Could not create the project.' };

  revalidatePath('/dashboard');
  revalidatePath('/projects');
  return { id: data.id as string };
}

export async function updateProjectContent(id: string, content: LoveStoryContent) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not signed in.' };

  const { error } = await supabase
    .from('projects')
    .update({ content })
    .eq('id', id)
    .eq('owner_id', user.id);

  if (error) return { error: error.message };
  revalidatePath(`/projects/${id}`);
  return { ok: true };
}

export async function updateInvitationContent(id: string, content: InvitationContent) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not signed in.' };

  const { error } = await supabase
    .from('projects')
    .update({ content })
    .eq('id', id)
    .eq('owner_id', user.id);

  if (error) return { error: error.message };
  revalidatePath(`/projects/${id}`);
  return { ok: true };
}

// Public — called by the (unauthenticated) recipient once they pick a
// date/time. Notifies the creator on Telegram if they've linked their chat.
export async function submitInvitationResponse(projectId: string, chosenDate: string, chosenTime: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('invitation_responses')
    .insert({ project_id: projectId, chosen_date: chosenDate, chosen_time: chosenTime });
  if (error) return { error: error.message };

  const { data: project } = await supabase
    .from('projects')
    .select('name, telegram_chat_id')
    .eq('id', projectId)
    .single();

  if (project?.telegram_chat_id) {
    await sendTelegramMessage(
      project.telegram_chat_id,
      `💌 «${project.name}» — получатель ответил: ${chosenDate} в ${chosenTime}`,
    );
  }

  return { ok: true };
}

// Returns the deep link the owner sends themselves on Telegram to link
// their chat — the bot's webhook resolves telegram_link_token back to this
// project and fills in telegram_chat_id, see /api/telegram/webhook.
export async function getMyProjectTelegramLink(id: string): Promise<{ url: string } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not signed in.' };

  const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;
  if (!botUsername) return { error: 'Telegram bot is not configured yet.' };

  const { data } = await supabase
    .from('projects')
    .select('telegram_link_token')
    .eq('id', id)
    .eq('owner_id', user.id)
    .single();

  if (!data) return { error: 'Project not found.' };
  return { url: `https://t.me/${botUsername}?start=${data.telegram_link_token}` };
}

export async function updateProjectSlug(
  id: string,
  slug: string,
): Promise<
  | { ok: true; slug: string; error?: undefined }
  | { ok?: undefined; slug?: undefined; error: string }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not signed in.' };

  const clean = slugify(slug);
  if (!clean) return { error: 'Slug cannot be empty.' };

  const { error } = await supabase
    .from('projects')
    .update({ slug: clean })
    .eq('id', id)
    .eq('owner_id', user.id);

  if (error)
    return { error: error.code === '23505' ? 'That slug is already taken.' : error.message };

  revalidatePath(`/projects/${id}/settings`);
  return { ok: true, slug: clean };
}

export async function setProjectStatus(id: string, status: 'draft' | 'published') {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not signed in.' };

  const { error } = await supabase
    .from('projects')
    .update({ status })
    .eq('id', id)
    .eq('owner_id', user.id);
  if (error) return { error: error.message };

  revalidatePath('/dashboard');
  revalidatePath('/projects');
  revalidatePath(`/projects/${id}/settings`);
  return { ok: true };
}

export async function deleteProject(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not signed in.' };

  // Deleting the row doesn't touch Storage — every photo uploaded via
  // uploadSectionPhoto lives at `${user.id}/${id}/...` in the project-media
  // bucket, so clear that folder out first. A failure here shouldn't block
  // the actual delete (an orphaned file is a much smaller problem than an
  // undeletable project), so this is best-effort.
  const folder = `${user.id}/${id}`;
  const { data: files } = await supabase.storage.from('project-media').list(folder, { limit: 1000 });
  if (files && files.length > 0) {
    const paths = files.map((f) => `${folder}/${f.name}`);
    await supabase.storage.from('project-media').remove(paths);
  }

  const { error } = await supabase.from('projects').delete().eq('id', id).eq('owner_id', user.id);
  if (error) return { error: error.message };

  revalidatePath('/dashboard');
  revalidatePath('/projects');
  redirect('/projects');
}
