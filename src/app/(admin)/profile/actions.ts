'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/shared/lib/supabase/server';

export async function updateProfile(formData: FormData) {
  const fullName = String(formData.get('fullName') ?? '').trim();
  if (!fullName) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('profiles').update({ full_name: fullName }).eq('id', user.id);
  revalidatePath('/profile');
}
