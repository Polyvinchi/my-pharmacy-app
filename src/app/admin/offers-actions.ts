'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addOffer(formData: FormData) {
  const title = formData.get('title') as string;
  const price = formData.get('price') as string;
  const oldPrice = formData.get('oldPrice') as string;
  const description = formData.get('description') as string;
  const conditionText = formData.get('conditionText') as string;
  const isActive = formData.get('isActive') === 'true';
  const bundleItemsStr = formData.get('bundleItems') as string;
  const images = formData.getAll('images') as File[];
  const externalImagesStr = formData.get('externalImages') as string;
  const sortOrderStr = formData.get('sortOrder') as string;
  const sortOrder = sortOrderStr ? parseInt(sortOrderStr) : 0;
  
  let externalImages: string[] = [];
  try {
    if (externalImagesStr) externalImages = JSON.parse(externalImagesStr);
  } catch (e) {}

  if (!title || !price) return { error: 'يجب إدخال البيانات الأساسية' };

  const supabase = await createClient();
  const uploadedUrls: string[] = [...externalImages];

  // Upload all images
  for (const image of images) {
    if (image.size > 0) {
      const fileExt = image.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `offers/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('public_assets').upload(filePath, image);
      if (uploadError) return { error: uploadError.message };

      const { data } = supabase.storage.from('public_assets').getPublicUrl(filePath);
      uploadedUrls.push(data.publicUrl);
    }
  }

  if (uploadedUrls.length === 0) return { error: 'يرجى إرفاق صورة واحدة على الأقل' };

  // Calculate discount percentage
  let discount_percentage = null;
  if (price && oldPrice) {
    const p = parseFloat(price.replace(/[^\d.]/g, ''));
    const op = parseFloat(oldPrice.replace(/[^\d.]/g, ''));
    if (!isNaN(p) && !isNaN(op) && op > p) {
      discount_percentage = Math.round(((op - p) / op) * 100);
    }
  }

  const { error: insertError } = await supabase.from('offers').insert({
    title,
    new_price: price ? price : null,
    old_price: oldPrice || null,
    description: description || null,
    image_url: uploadedUrls[0] || null,
    images: uploadedUrls,
    is_active: isActive,
    condition_text: conditionText || null,
    bundle_items: bundleItemsStr ? JSON.parse(bundleItemsStr) : [],
    discount_percentage,
    sort_order: sortOrder
  });

  if (insertError) {
    if (insertError.message.includes('Could not find')) {
      return { error: 'يرجى تشغيل كود SQL أولاً لتحديث قاعدة البيانات!' };
    }
    return { error: insertError.message };
  }

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

export async function editOffer(formData: FormData) {
  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const price = formData.get('price') as string;
  const oldPrice = formData.get('oldPrice') as string;
  const description = formData.get('description') as string;
  const conditionText = formData.get('conditionText') as string;
  const isActive = formData.get('isActive') === 'true';
  const bundleItemsStr = formData.get('bundleItems') as string;
  const images = formData.getAll('images') as File[];
  const externalImagesStr = formData.get('externalImages') as string;
  const sortOrderStr = formData.get('sortOrder') as string;
  const sortOrder = sortOrderStr ? parseInt(sortOrderStr) : 0;
  
  let externalImages: string[] = [];
  try {
    if (externalImagesStr) externalImages = JSON.parse(externalImagesStr);
  } catch (e) {}

  if (!id || !title || !price) return { error: 'بيانات غير مكتملة' };

  const supabase = await createClient();
  const uploadedUrls: string[] = [...externalImages];

  // Upload new images if provided
  if (images.length > 0 && images[0].size > 0) {
    for (const image of images) {
      if (image.size > 0) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `offers/${fileName}`;

        const { error: uploadError } = await supabase.storage.from('public_assets').upload(filePath, image);
        if (uploadError) return { error: uploadError.message };

        const { data } = supabase.storage.from('public_assets').getPublicUrl(filePath);
        uploadedUrls.push(data.publicUrl);
      }
    }
  }

  let discount_percentage = null;
  if (price && oldPrice) {
    const p = parseFloat(price.replace(/[^\d.]/g, ''));
    const op = parseFloat(oldPrice.replace(/[^\d.]/g, ''));
    if (!isNaN(p) && !isNaN(op) && op > p) {
      discount_percentage = Math.round(((op - p) / op) * 100);
    }
  }

  const updateData: any = {
    title,
    new_price: price ? price : null,
    old_price: oldPrice || null,
    description: description || null,
    is_active: isActive,
    condition_text: conditionText || null,
    bundle_items: bundleItemsStr ? JSON.parse(bundleItemsStr) : [],
    discount_percentage,
    sort_order: sortOrder
  };
  
  if (uploadedUrls.length > 0) {
    updateData.image_url = uploadedUrls[0];
    updateData.images = uploadedUrls;
  }

  const { error: updateError } = await supabase.from('offers').update(updateData).eq('id', id);

  if (updateError) {
    if (updateError.message.includes('Could not find')) {
      return { error: 'يرجى تشغيل كود SQL أولاً لتحديث قاعدة البيانات!' };
    }
    return { error: updateError.message };
  }

  revalidatePath('/admin');
  revalidatePath('/');
  return { success: true };
}
