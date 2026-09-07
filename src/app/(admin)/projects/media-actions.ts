'use server';

import { createClient } from '@/shared/lib/supabase/server';

const PHOTO_MAX_SIZE = 20 * 1024 * 1024; // 20MB, matches the wizard's copy.
const PHOTO_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

const MUSIC_MAX_SIZE = 8 * 1024 * 1024; // A short background track, not an album.
const MUSIC_ALLOWED_TYPES = [
  'audio/mpeg',
  'audio/mp4',
  'audio/x-m4a',
  'audio/aac',
  'audio/ogg',
  'audio/wav',
];

type UploadResult = { url: string; error?: undefined } | { url?: undefined; error: string };

// Shared by every upload flow below: checks the caller actually owns the
// project, then stores the file at `${user.id}/${projectId}/...` in the
// project-media bucket and hands back its public URL.
async function uploadToProjectMedia(projectId: string, file: File, prefix: string): Promise<UploadResult> {
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

  const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const path = `${user.id}/${projectId}/${prefix}${unique}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('project-media')
    .upload(path, file, { contentType: file.type });
  if (uploadError) return { error: uploadError.message };

  const {
    data: { publicUrl },
  } = supabase.storage.from('project-media').getPublicUrl(path);

  return { url: publicUrl };
}

// Uploads a photo for any section slot and just hands back its public URL —
// it does not touch the project's saved `content`. The caller (ProjectEditor)
// merges the URL into local state like any other field, so it's only
// persisted once the user hits Save, same as text edits.
export async function uploadSectionPhoto(projectId: string, file: File): Promise<UploadResult> {
  if (!PHOTO_ALLOWED_TYPES.includes(file.type)) {
    return { error: 'Please upload a JPG, PNG, WEBP or HEIC photo.' };
  }
  if (file.size > PHOTO_MAX_SIZE) {
    return { error: 'Photo must be under 20MB.' };
  }
  return uploadToProjectMedia(projectId, file, '');
}

// Same idea, for the cover's background music track.
export async function uploadMusic(projectId: string, file: File): Promise<UploadResult> {
  if (!MUSIC_ALLOWED_TYPES.includes(file.type)) {
    return { error: 'Please upload an MP3, M4A, AAC, OGG or WAV file.' };
  }
  if (file.size > MUSIC_MAX_SIZE) {
    return { error: 'Music must be under 8MB.' };
  }
  return uploadToProjectMedia(projectId, file, 'music-');
}
