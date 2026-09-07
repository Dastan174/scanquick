'use server';

import { createClient } from '@/shared/lib/supabase/server';

const MAX_SIZE = 20 * 1024 * 1024; // 20MB, matches the wizard's copy.
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

// Uploads a photo for any section slot and just hands back its public URL —
// it does not touch the project's saved `content`. The caller (ProjectEditor)
// merges the URL into local state like any other field, so it's only
// persisted once the user hits Save, same as text edits.
export async function uploadSectionPhoto(
  projectId: string,
  file: File,
): Promise<{ url: string; error?: undefined } | { url?: undefined; error: string }> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: 'Please upload a JPG, PNG, WEBP or HEIC photo.' };
  }
  if (file.size > MAX_SIZE) {
    return { error: 'Photo must be under 20MB.' };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not signed in.' };

  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', projectId)
    .eq('owner_id', user.id)
    .single();
  if (!project) return { error: 'Project not found.' };

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const path = `${user.id}/${projectId}/${unique}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('project-media')
    .upload(path, file, { contentType: file.type });
  if (uploadError) return { error: uploadError.message };

  const {
    data: { publicUrl },
  } = supabase.storage.from('project-media').getPublicUrl(path);

  return { url: publicUrl };
}
