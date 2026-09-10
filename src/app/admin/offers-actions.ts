'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addOffer(formData: FormData) {
  const title = formData.get('title') as string;
  const price = formData.get('price') as string;
  const oldPrice = formData.get('oldPrice') as string;
  const image = formData.get('image') as File;

  if (!title || !price || !image) return { error: 'Missing required fields' };

  const supabase = await createClient();

  // 1. Upload Image
  const fileExt = image.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `offers/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('public_assets')
    .upload(filePath, image);

  if (uploadError) return { error: uploadError.message };

  const { data: publicUrlData } = supabase.storage
    .from('public_assets')
    .getPublicUrl(filePath);

  // 2. Insert into Database
  const { error: insertError } = await supabase
    .from('offers')
    .insert({
      title,
      price,
      old_price: oldPrice || null,
      img_url: publicUrlData.publicUrl
    });

  if (insertError) return { error: insertError.message };

  revalidatePath('/admin');
  revalidatePath('/');
  return { success: true };
}

export async function deleteOffer(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('offers').delete().eq('id', id);
  if (error) return { error: error.message };
  
  revalidatePath('/admin');
  revalidatePath('/');
  return { success: true };
}
