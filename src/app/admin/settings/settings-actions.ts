'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateSettings(formData: FormData) {
  const supabase = await createClient();

  const phone_number = formData.get('phone_number') as string;
  const whatsapp_number = formData.get('whatsapp_number') as string;
  const landline_number = formData.get('landline_number') as string;
  const facade_title = formData.get('facade_title') as string;
  const facade_subtitle = formData.get('facade_subtitle') as string;

  const { error } = await supabase
    .from('app_settings')
    .upsert({
      singleton_key: 'config',
      phone_number,
      whatsapp_number,
      landline_number,
      facade_title,
      facade_subtitle,
      updated_at: new Date().toISOString()
    }, { onConflict: 'singleton_key' });

  if (error) return { error: error.message };

  revalidatePath('/');
  revalidatePath('/admin/settings');
  return { success: true };
}
